using Microsoft.AspNetCore.Http;
using Shared.Models.Base;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using Shared.Models.Online.Settings;
using Shared.Services;
using System.Collections.Generic;
using Shared;

namespace AnimeGo;

public class ModInit : IModuleLoaded, IModuleOnline, IModuleOnlineSpider
{
    public static OnlinesSettings conf;

    public List<ModuleOnlineItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, OnlineEventsModel args)
    {
        if (!args.isanime)
            return null;

        return new List<ModuleOnlineItem>()
        {
            new(conf)
        };
    }

    public List<ModuleOnlineSpiderItem> Spider(HttpContext httpContext, RequestModel requestInfo, string host, OnlineSpiderModel args)
    {
        if (!args.isanime)
            return null;

        return new List<ModuleOnlineSpiderItem>()
        {
            new(conf)
        };
    }

    public void Loaded(InitspaceModel baseconf)
    {
        CoreInit.conf.online.with_search.Add("animego");

        updateConf();
        EventListener.UpdateInitFile += updateConf;
        EventListener.OnlineApiQuality += onlineApiQuality;
    }

    public void Dispose()
    {
        EventListener.UpdateInitFile -= updateConf;
        EventListener.OnlineApiQuality -= onlineApiQuality;
    }

    void updateConf()
    {
        conf = ModuleInvoke.Init("AnimeGo", new OnlinesSettings("AnimeGo", "https://animego.me", streamproxy: true, enable: false)
        {
            displayindex = 155,
            httpversion = 2,
            headers_stream = HeadersModel.Init(
                ("origin", "https://aniboom.one"),
                ("referer", "https://aniboom.one/")
            ).ToDictionary()
        });
    }

    string onlineApiQuality(EventOnlineApiQuality e)
    {
        return e.balanser == "animego" ? " ~ 1080p" : null;
    }
}
