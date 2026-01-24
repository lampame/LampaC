using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.Extensions.Primitives;
using Shared;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Lampac.Engine.Middlewares
{
    public class BaseMod
    {
        private readonly RequestDelegate _next;

        public BaseMod(RequestDelegate next)
        {
            _next = next;
        }

        public Task Invoke(HttpContext context)
        {
            if (!HttpMethods.IsGet(context.Request.Method) &&
                !HttpMethods.IsPost(context.Request.Method) &&
                !HttpMethods.IsOptions(context.Request.Method))
                return Task.CompletedTask;

            if (!IsValidPath(context.Request.Path.Value))
            {
                context.Response.StatusCode = 400; 
                return context.Response.WriteAsync("400 Bad Request", context.RequestAborted);
            }

            var disble = AppInit.conf.BaseModule.DisableControllers;

            if (disble.admin && context.Request.Path.Value.StartsWith("/admin"))
                return Task.CompletedTask;

            if (disble.bookmark && context.Request.Path.Value.StartsWith("/bookmark"))
                return Task.CompletedTask;

            if (disble.storage && context.Request.Path.Value.StartsWith("/storage"))
                return Task.CompletedTask;

            if (disble.timecode && context.Request.Path.Value.StartsWith("/timecode"))
                return Task.CompletedTask;

            if (disble.corseu && context.Request.Path.Value.StartsWith("/corseu"))
                return Task.CompletedTask;

            if (disble.media && context.Request.Path.Value.StartsWith("/media"))
                return Task.CompletedTask;

            #region valid query
            var builder = new QueryBuilder();
            var dict = new Dictionary<string, StringValues>(StringComparer.OrdinalIgnoreCase);
            var sbQuery = new StringBuilder(32);

            foreach (var q in context.Request.Query)
            {
                if (IsValidQueryName(q.Key))
                {
                    string val = ValidQueryValue(sbQuery, q.Key, q.Value);

                    if (dict.TryAdd(q.Key, val))
                        builder.Add(q.Key, val);
                }
            }

            context.Request.QueryString = builder.ToQueryString();
            context.Request.Query = new QueryCollection(dict);
            #endregion

            return _next(context);
        }


        #region IsValid
        static bool IsValidPath(ReadOnlySpan<char> path)
        {
            if (path.IsEmpty)
                return false;

            foreach (char ch in path)
            {
                if (
                    ch == '/' || ch == '-' || ch == '.' || ch == '_' ||
                    (ch >= 'A' && ch <= 'Z') ||
                    (ch >= 'a' && ch <= 'z') ||
                    (ch >= '0' && ch <= '9')
                )
                {
                    continue;
                }

                if (path.StartsWith("/proxy/") ||
                    path.StartsWith("/proxyimg") ||
                    path.StartsWith("/lite/videoseed/video/"))
                {
                    if (ch == ':' || ch == '+' || ch == '=')
                        continue;
                }

                return false;
            }

            return true;
        }

        static bool IsValidQueryName(ReadOnlySpan<char> path)
        {
            if (path.IsEmpty)
                return false;

            foreach (char ch in path)
            {
                if (
                    ch == '-' || ch == '_' ||
                    (ch >= 'A' && ch <= 'Z') ||
                    (ch >= 'a' && ch <= 'z') ||
                    (ch >= '0' && ch <= '9')
                )
                {
                    continue;
                }

                return false;
            }

            return true;
        }

        static string ValidQueryValue(StringBuilder sb, string name, StringValues values)
        {
            if (values.Count == 0)
                return string.Empty;

            string value = values[0];

            if (string.IsNullOrEmpty(value))
                return string.Empty;

            sb.Clear();

            foreach (char ch in value)
            {
                if (
                    ch == '/' || ch == ':' || ch == '?' || ch == '&' || ch == '=' || ch == '.' || // ссылки
                    ch == '-' || ch == '_' || ch == ' ' || ch == ',' || // base
                    (ch >= '0' && ch <= '9') ||
                    ch == '@' || // email
                    ch == '+' || // aes
                    char.IsLetter(ch) // ← любые буквы Unicode
                )
                {
                    sb.Append(ch);
                    continue;
                }

                if (name is "title" or "original_title" or "t")
                {
                    if (
                        char.IsDigit(ch) || // ← символ цифрой Unicode
                        ch == '\'' || ch == '!' || ch == ',' || ch == '+' || ch == '~' || ch == '"' || ch == ';' ||
                        ch == '(' || ch == ')' || ch == '[' || ch == ']' || ch == '{' || ch == '}' || ch == '«' || ch == '»' || ch == '“' || ch == '”' ||
                        ch == '$' || ch == '%' || ch == '^' || ch == '|' || ch == '#' || ch == '×'
                    )
                    {
                        sb.Append(ch);
                        continue;
                    }
                }
            }

            return sb.ToString();
        }
        #endregion
    }
}
