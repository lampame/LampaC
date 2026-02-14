using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.Extensions.Primitives;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
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

            if (Program.RuntimeCve2025_55315)
            {
                if (Regex.IsMatch(context.Request.Path.Value, "^/(ffprobe|transcoding|dlna|admin)", RegexOptions.IgnoreCase))
                {
                    string ip = context.Connection.RemoteIpAddress.ToString();
                    if (!Shared.Engine.Utilities.IPNetwork.IsLocalIp(ip))
                    {
                        context.Response.StatusCode = 400;
                        return context.Response.WriteAsync("Please update dotnet\nhttps://github.com/dotnet/core/blob/main/release-notes/9.0/9.0.12/9.0.113.md", context.RequestAborted);
                    }
                }
            }

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
                    ch == ':' || ch == '+' || ch == '=' ||
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
                    (ch >= '0' && ch <= '9') ||
                    ch == '.' // tmdb
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
                    ch == '*' || // merchant
                    ch == '|' || // tmdb
                    char.IsLetter(ch) // ← любые буквы Unicode
                )
                {
                    sb.Append(ch);
                    continue;
                }

                if (name is "search" or "query" or "title" or "original_title" or "t")
                {
                    if (
                        char.IsDigit(ch) || // ← символ цифрой Unicode
                        ch == '\'' || ch == '!' || ch == ',' || ch == '+' || ch == '~' || ch == '"' || ch == ';' ||
                        ch == '(' || ch == ')' || ch == '[' || ch == ']' || ch == '{' || ch == '}' || ch == '«' || ch == '»' || ch == '“' || ch == '”' ||
                        ch == '$' || ch == '%' || ch == '^' || ch == '#' || ch == '×'
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
