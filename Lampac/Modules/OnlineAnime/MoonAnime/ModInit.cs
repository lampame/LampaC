using Microsoft.AspNetCore.Http;
using Shared.Models.Base;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using Shared.Models.Online.Settings;
using Shared.PlaywrightCore;
using Shared.Services;
using System.Collections.Generic;

namespace MoonAnime;

public class ModInit : IModuleLoaded, IModuleOnline, IModuleOnlineSpider
{
    public static OnlinesSettings conf;

    public List<ModuleOnlineItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, OnlineEventsModel args)
    {
        if (!args.isanime || PlaywrightBrowser.Status == PlaywrightStatus.disabled)
            return null;

        return new List<ModuleOnlineItem>()
        {
            new(conf)
        };
    }

    public List<ModuleOnlineSpiderItem> Spider(HttpContext httpContext, RequestModel requestInfo, string host, OnlineSpiderModel args)
    {
        if (!args.isanime || PlaywrightBrowser.Status == PlaywrightStatus.disabled)
            return null;

        return new List<ModuleOnlineSpiderItem>()
        {
            new(conf)
        };
    }

    public void Loaded(InitspaceModel baseconf)
    {
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
        conf = ModuleInvoke.Init("MoonAnime", new OnlinesSettings("MoonAnime", "https://api.moonanime.art", token: "865fEF-E2e1Bc-2ca431-e6A150-780DFD-737C6B")
        {
            displayindex = 140,
            stream_access = "apk",
            rchstreamproxy = "web,cors",
            geo_hide = ["RU", "BY"]
        });
    }

    string onlineApiQuality(EventOnlineApiQuality e)
    {
        return e.balanser == "moonanime" ? " ~ 1080p" : null;
    }
}
