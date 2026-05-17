using Microsoft.AspNetCore.Http;
using Shared.Models.Base;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace KinoGram;

public class OnlineApi : IModuleOnline, IModuleOnlineAsync, IModuleOnlineSpider, IModuleOnlineSpiderAsync
{
    public List<ModuleOnlineItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, OnlineEventsModel args)
    {
        return new List<ModuleOnlineItem>()
        {
            new(ModInit.conf)
        };
    }

    public Task<List<ModuleOnlineItem>> InvokeAsync(HttpContext httpContext, RequestModel requestInfo, string host, OnlineEventsModel args)
    {
        return Task.FromResult(default(List<ModuleOnlineItem>));
    }


    public List<ModuleOnlineSpiderItem> Spider(HttpContext httpContext, RequestModel requestInfo, string host, OnlineSpiderModel args)
    {
        var online = new List<ModuleOnlineSpiderItem>();

        void send(BaseSettings init, string plugin)
        {
            if (init.spider && init.enable && !init.rip)
                online.Add(new(init, plugin));
        }

        if (!args.isanime)
            send(ModInit.conf, "kinogram");

        return online;
    }

    public Task<List<ModuleOnlineSpiderItem>> SpiderAsync(HttpContext httpContext, RequestModel requestInfo, string host, OnlineSpiderModel args)
    {
        return Task.FromResult(default(List<ModuleOnlineSpiderItem>));
    }
}
