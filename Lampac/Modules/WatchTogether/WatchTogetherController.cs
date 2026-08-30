using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Shared;
using System;
using System.IO;

namespace WatchTogether
{
    /// <summary>
    /// Static file service: the Lampa plugin (adapted lparty.js) and the web
    /// guest page (adapted lparty-web), with lampac hosts injected as
    /// placeholders. The relay itself lives at /c/ (RelayStartupFilter).
    /// </summary>
    [Route("watchtogether")]
    public class WatchTogetherController : BaseController
    {
        private bool CheckAuth()
        {
            if (ModInit.conf.allow_anonymous) return true;
            if (!CoreInit.conf.accsdb.enable) return true;
            return requestInfo.user != null;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("/watchtogether.js")]
        public ActionResult GetPlugin()
        {
            if (!CheckAuth()) return StatusCode(401);
            return ServeFile("plugin.js", "application/javascript; charset=utf-8", js =>
                js.Replace("{relay}", RelayAddress())
                  .Replace("{invite}", InviteAddress()));
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("/watch_together")]
        [Route("/watch_together/{file}")]
        public ActionResult GetWebPlayer(string file)
        {
            if (!CheckAuth()) return StatusCode(401);

            switch (file ?? string.Empty)
            {
                case "":
                case "index.html":
                    return ServeFile("web/index.html", "text/html; charset=utf-8", html =>
                        html.Replace("{relay}", RelayAddress()));
                case "lparty-web.js":
                    return ServeFile("web/lparty-web.js", "application/javascript; charset=utf-8", js =>
                        js.Replace("{relay}", RelayAddress()));
                case "i18n.js":
                    return ServeFile("web/i18n.js", "application/javascript; charset=utf-8", null);
                case "names.js":
                    return ServeFile("web/names.js", "application/javascript; charset=utf-8", null);
                default:
                    return NotFound();
            }
        }

        string RelayAddress()
        {
            return (host.StartsWith("https", StringComparison.Ordinal) ? "wss://" : "ws://") +
                   host.Replace("https://", "").Replace("http://", "").TrimEnd('/') + "/wt/c/";
        }

        string InviteAddress()
        {
            return host.TrimEnd('/') + "/watch_together/";
        }

        ActionResult ServeFile(string name, string contentType, Func<string, string> transform)
        {
            string path = Path.Combine(ModInit.modpath, name);
            if (!System.IO.File.Exists(path))
                return Content("<html><body><h2>" + name + " not found</h2></body></html>", "text/html; charset=utf-8");

            long mtime = System.IO.File.GetLastWriteTimeUtc(path).Ticks;
            string memKey = "watchtogether:file:" + name + ":" + mtime;

            if (!memoryCache.TryGetValue(memKey, out string raw))
            {
                raw = System.IO.File.ReadAllText(path);
                memoryCache.Set(memKey, raw, TimeSpan.FromMinutes(10));
            }

            string result = transform != null ? transform(raw) : raw;
            return Content(result, contentType);
        }
    }
}
