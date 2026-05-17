using Microsoft.AspNetCore.Http;

namespace Shared.Models.Module.Interfaces;

public interface IModuleSisi
{
    List<SisiModuleItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, SisiEventsModel args);
}

public interface IModuleSisiAsync
{
    Task<List<SisiModuleItem>> InvokeAsync(HttpContext httpContext, RequestModel requestInfo, string host, SisiEventsModel args);
}
