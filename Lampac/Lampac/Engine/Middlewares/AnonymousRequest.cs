using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Shared.Models;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Lampac.Engine.Middlewares
{
    public class AnonymousRequest
    {
        private readonly RequestDelegate _next;
        public AnonymousRequest(RequestDelegate next)
        {
            _next = next;
        }

        static readonly Regex rexProxy = new Regex("^/(proxy-dash|cub|ts|kit|bind)(/|$)", RegexOptions.Compiled | RegexOptions.IgnoreCase);
        static readonly Regex rexJs = new Regex("^/[a-zA-Z\\-]+\\.js", RegexOptions.Compiled);

        public Task Invoke(HttpContext httpContext)
        {
            var requestInfo = httpContext.Features.Get<RequestModel>();

            var endpoint = httpContext.GetEndpoint();
            if (endpoint != null && endpoint.Metadata.GetMetadata<IAllowAnonymous>() != null)
                requestInfo.IsAnonymousRequest = true;

            if (httpContext.Request.Path.Value == "/" || httpContext.Request.Path.Value == "/favicon.ico")
                requestInfo.IsAnonymousRequest = true;

            if (httpContext.Request.Path.Value == "/.well-known/appspecific/com.chrome.devtools.json")
                requestInfo.IsAnonymousRequest = true;

            if (rexProxy.IsMatch(httpContext.Request.Path.Value))
                requestInfo.IsAnonymousRequest = true;

            if (rexJs.IsMatch(httpContext.Request.Path.Value))
                requestInfo.IsAnonymousRequest = true;

            return _next(httpContext);
        }
    }
}
