using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Shared.Models.Base;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using Shared.Models.Online.Settings;
using Shared.Services;
using Shared;

namespace AniLibria;

public class ModInit : IModuleLoaded, IModuleOnline, IModuleOnlineSpider
{
    public static OnlinesSettings conf;

    public List<ModuleOnlineItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, OnlineEventsModel args)
    {
        if (!args.isanime)
            return null;

        return new List<ModuleOnlineItem>()
        {
            new(conf, "anilibria", "Anilibria")
        };
    }

    public List<ModuleOnlineSpiderItem> Spider(HttpContext httpContext, RequestModel requestInfo, string host, OnlineSpiderModel args)
    {
        if (!args.isanime)
            return null;

        return new List<ModuleOnlineSpiderItem>()
        {
            new(conf, "anilibria")
        };
    }

    public void Loaded(InitspaceModel baseconf)
    {
        CoreInit.conf.online.with_search.Add("anilibria");

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
        conf = ModuleInvoke.Init("AniLibria", new OnlinesSettings("AnilibriaOnline", "https://api.anilibria.tv")
        {
            enable = false,
            displayindex = 105
        });
    }

    string onlineApiQuality(EventOnlineApiQuality e)
    {
        return e.balanser == "anilibria" ? " ~ 1080p" : null;
    }
}
