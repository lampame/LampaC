using Microsoft.AspNetCore.Http;

namespace Shared.Services;

public static class ResponseCache
{
    static readonly HashSet<string> SensitiveKeys = new(StringComparer.OrdinalIgnoreCase)
    {
        "account_email", "cub_id", "box_mac", "uid", "token", "source", "rchtype", "nws_id"
    };

    static readonly string Prefix = "ResponseCache:errorMsg:";


    public static string ErrorKey(HttpContext httpContext)
    {
        var sb = StringBuilderPool.ThreadInstance;

        sb.Append(Prefix);
        sb.Append(httpContext.Request.Path.Value ?? string.Empty);

        bool first = true;
        foreach (var kvp in httpContext.Request.Query)
        {
            if (SensitiveKeys.Contains(kvp.Key))
                continue;

            foreach (var value in kvp.Value)
            {
                sb.Append(first ? '?' : '&');
                first = false;

                sb.Append(kvp.Key);
                sb.Append('=');
                sb.Append(value);
            }
        }

        return sb.ToString();
    }
}
