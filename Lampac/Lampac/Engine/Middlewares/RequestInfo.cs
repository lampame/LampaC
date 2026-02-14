using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Primitives;
using Shared;
using Shared.Models;
using System;
using System.IO;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace Lampac.Engine.Middlewares
{
    public class RequestInfo
    {
        #region RequestInfo
        private readonly RequestDelegate _next;
        IMemoryCache memoryCache;

        public RequestInfo(RequestDelegate next, IMemoryCache mem)
        {
            _next = next;
            memoryCache = mem;
        }
        #endregion

        public Task Invoke(HttpContext httpContext)
        {
            bool IsWsRequest = httpContext.Request.Path.StartsWithSegments("/nws", StringComparison.OrdinalIgnoreCase) || 
                               httpContext.Request.Path.StartsWithSegments("/ws", StringComparison.OrdinalIgnoreCase);

            #region stats
            if (AppInit.conf.openstat.enable && !IsWsRequest)
            {
                var now = DateTime.UtcNow;
                var counter = memoryCache.GetOrCreate($"stats:request:{now.Hour}:{now.Minute}", entry =>
                {
                    entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(60);
                    return new CounterRequestInfo();
                });

                Interlocked.Increment(ref counter.Value);
            }
            #endregion

            bool IsLocalRequest = false;
            string cf_country = null;
            string clientIp = httpContext.Connection.RemoteIpAddress.ToString();
            bool IsLocalIp = Shared.Engine.Utilities.IPNetwork.IsLocalIp(clientIp);

            if (httpContext.Request.Headers.TryGetValue("localrequest", out StringValues _localpasswd) && _localpasswd.Count > 0)
            {
                if (!IsLocalIp && !AppInit.conf.BaseModule.allowExternalIpAccessToLocalRequest)
                    return httpContext.Response.WriteAsync("allowExternalIpAccessToLocalRequest false", httpContext.RequestAborted);

                if (_localpasswd[0] != AppInit.rootPasswd)
                    return httpContext.Response.WriteAsync("error passwd", httpContext.RequestAborted);

                IsLocalRequest = true;

                if (httpContext.Request.Headers.TryGetValue("x-client-ip", out StringValues xip) && xip.Count > 0)
                {
                    if (!string.IsNullOrEmpty(xip[0]))
                        clientIp = xip[0];
                }
            }
            else if (AppInit.conf.real_ip_cf || AppInit.conf.listen.frontend == "cloudflare")
            {
                #region cloudflare
                if (Program.cloudflare_ips != null && Program.cloudflare_ips.Count > 0)
                {
                    try
                    {
                        var clientIPAddress = IPAddress.Parse(clientIp);
                        foreach (var cf in Program.cloudflare_ips)
                        {
                            if (new System.Net.IPNetwork(cf.prefix, cf.prefixLength).Contains(clientIPAddress))
                            {
                                if (httpContext.Request.Headers.TryGetValue("CF-Connecting-IP", out StringValues xip) && xip.Count > 0)
                                {
                                    if (!string.IsNullOrEmpty(xip[0]))
                                        clientIp = xip[0];
                                }

                                if (httpContext.Request.Headers.TryGetValue("X-Forwarded-Proto", out StringValues xfp) && xfp.Count > 0)
                                {
                                    if (!string.IsNullOrEmpty(xfp[0]))
                                    {
                                        if (xfp[0] == "http" || xfp[0] == "https")
                                            httpContext.Request.Scheme = xfp;
                                    }
                                }

                                if (httpContext.Request.Headers.TryGetValue("CF-IPCountry", out StringValues xcountry) && xcountry.Count > 0)
                                {
                                    if (!string.IsNullOrEmpty(xcountry[0]))
                                        cf_country = xcountry[0];
                                }

                                break;
                            }
                        }
                    }
                    catch { }
                }
                #endregion
            }
            // запрос с cloudflare, запрос не в админку
            else if (httpContext.Request.Headers.ContainsKey("CF-Connecting-IP") && !httpContext.Request.Path.Value.StartsWith("/admin", StringComparison.OrdinalIgnoreCase))
            {
                // если не указан frontend и это не первоначальная установка, тогда выводим ошибку
                if (string.IsNullOrEmpty(AppInit.conf.listen.frontend) && File.Exists("module/manifest.json"))
                    return httpContext.Response.WriteAsync(unknownFrontend, httpContext.RequestAborted);
            }

            var req = new RequestModel()
            {
                IsLocalRequest = IsLocalRequest,
                IsLocalIp = IsLocalIp,
                IP = clientIp,
                Country = cf_country,
                UserAgent = httpContext.Request.Headers.UserAgent
            };

            if (httpContext.Request.Headers.TryGetValue("X-Kit-AesGcm", out StringValues aesGcmKey) && aesGcmKey.Count > 0)
                req.AesGcmKey = aesGcmKey;

            #region Weblog Request
            if (!IsLocalRequest && !IsWsRequest && AppInit.conf.weblog.enable)
            {
                if (AppInit.conf.WebSocket.type == "signalr")
                {
                    if (AppInit.conf.BaseModule.ws && soks.weblog_clients.Count > 0)
                        soks.SendLog(builderLog(httpContext, req), "request");
                }
                else
                {
                    if (AppInit.conf.BaseModule.nws && NativeWebSocket.weblog_clients.Count > 0)
                        NativeWebSocket.SendLog(builderLog(httpContext, req), "request");
                }
            }
            #endregion

            if (!string.IsNullOrEmpty(AppInit.conf.accsdb.domainId_pattern))
            {
                string uid = Regex.Match(httpContext.Request.Host.Host, AppInit.conf.accsdb.domainId_pattern).Groups[1].Value;
                req.user = AppInit.conf.accsdb.findUser(uid);
                req.user_uid = uid;

                if (req.user == null)
                    return httpContext.Response.WriteAsync("user not found", httpContext.RequestAborted);

                req.@params = AppInit.conf.accsdb.@params;

                httpContext.Features.Set(req);
                return _next(httpContext);
            }
            else
            {
                if (!IsWsRequest)
                {
                    req.user = AppInit.conf.accsdb.findUser(httpContext, out string uid);
                    req.user_uid = uid;

                    if (req.user != null)
                        req.@params = AppInit.conf.accsdb.@params;

                    if (string.IsNullOrEmpty(req.user_uid))
                        req.user_uid = getuid(httpContext);
                }

                httpContext.Features.Set(req);
                return _next(httpContext);
            }
        }


        #region getuid
        static readonly string[] uids = ["token", "account_email", "uid", "box_mac"];

        static string getuid(HttpContext httpContext)
        {
            foreach (string id in uids)
            {
                if (httpContext.Request.Query.ContainsKey(id))
                {
                    StringValues val = httpContext.Request.Query[id];
                    if (val.Count > 0 && IsValidUid(val[0]))
                        return val[0];
                }
            }

            return null;
        }

        static bool IsValidUid(ReadOnlySpan<char> value)
        {
            if (value.IsEmpty)
                return false;

            foreach (char ch in value)
            {
                if 
                (
                    (ch >= 'a' && ch <= 'z') || 
                    (ch >= 'A' && ch <= 'Z') || 
                    (ch >= '0' && ch <= '9') ||
                    ch == '_' || ch == '+' || ch == '.' || ch == '-' || ch == '@' || ch == '='
                )
                {
                    continue;
                }

                return false;
            }

            return true;
        }
        #endregion


        static string builderLog(HttpContext httpContext, RequestModel req)
        {
            var logBuilder = new System.Text.StringBuilder();
            logBuilder.AppendLine($"{DateTime.Now}");
            logBuilder.AppendLine($"IP: {req.IP} {req.Country}");
            logBuilder.AppendLine($"URL: {AppInit.Host(httpContext)}{httpContext.Request.Path}{httpContext.Request.QueryString}\n");

            foreach (var header in httpContext.Request.Headers)
                logBuilder.AppendLine($"{header.Key}: {header.Value}");

            return logBuilder.ToString();
        }


        static readonly string unknownFrontend = @"<!DOCTYPE html>
<html lang='ru'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>CloudFlare</title>
    <link href='/control/npm/bootstrap.min.css' rel='stylesheet'>
</head>
<body>
    <div class='container mt-5'>
        <div class='card mt-4'>
            <div class='card-body'>
                <h5 class='card-title'>Укажите frontend для правильной обработки запроса</h5>
				<br>
                <p class='card-text'>Добавьте в init.conf следующий код:</p>
                <pre style='background: #e9ecef; padding: 1em;'><code>""listen"": {
  ""frontend"": ""cloudflare""
}</code></pre>
				<br>
                <p class='card-text'>Либо отключите проверку CF-Connecting-IP:</p>
                <pre style='background: #e9ecef; padding: 1em;'><code>""listen"": {
  ""frontend"": ""off""
}</code></pre>
				<br>
                <p class='card-text'>Так же параметр можно изменить в <a href='/admin' target='_blank'>админке</a>: Остальное, base, frontend</p>
            </div>
        </div>
    </div>
</body>
</html>";
    }


    public class CounterRequestInfo
    {
        public int Value;
    }
}
