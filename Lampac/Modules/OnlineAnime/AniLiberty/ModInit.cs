using Microsoft.AspNetCore.Http;
using Shared.Models.Base;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using Shared.Models.Online.Settings;
using Shared.Services;
using System.Collections.Generic;
using Shared;

namespace AniLiberty;

public class ModInit : IModuleLoaded, IModuleOnline
{
    public static OnlinesSettings conf;

    public List<ModuleOnlineItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, OnlineEventsModel args)
    {
        if (!args.isanime)
            return null;

        return new List<ModuleOnlineItem>()
        {
            new(conf, "aniliberty", "AniLiberty")
        };
    }

    public void Loaded(InitspaceModel baseconf)
    {
        CoreInit.conf.online.with_search.Add("aniliberty");

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
        conf = ModuleInvoke.Init("AniLiberty", new OnlinesSettings("AniLiberty", "https://api.anilibria.app")
        {
            displayindex = 110,
            stream_access = "apk,cors,web",
            httpversion = 2
        });
    }

    string onlineApiQuality(EventOnlineApiQuality e)
    {
        return e.balanser == "aniliberty" ? " ~ 1080p" : null;
    }
}
