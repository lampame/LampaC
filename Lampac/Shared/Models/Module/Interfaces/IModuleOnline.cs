using Microsoft.AspNetCore.Http;

namespace Shared.Models.Module.Interfaces;

public interface IModuleOnline
{
    List<ModuleOnlineItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, OnlineEventsModel args);
}

public interface IModuleOnlineAsync
{
    Task<List<ModuleOnlineItem>> InvokeAsync(HttpContext httpContext, RequestModel requestInfo, string host, OnlineEventsModel args);
}

public interface IModuleOnlineSpider
{
    List<ModuleOnlineSpiderItem> Spider(HttpContext httpContext, RequestModel requestInfo, string host, OnlineSpiderModel args);
}

public interface IModuleOnlineSpiderAsync
{
    Task<List<ModuleOnlineSpiderItem>> SpiderAsync(HttpContext httpContext, RequestModel requestInfo, string host, OnlineSpiderModel args);
}
