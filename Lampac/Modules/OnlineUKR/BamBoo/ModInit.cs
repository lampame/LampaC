using Microsoft.AspNetCore.Http;
using Shared.Models.Base;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using Shared.Models.Online.Settings;
using Shared.Services;
using System.Collections.Generic;

namespace BamBoo;

public class ModInit : IModuleLoaded, IModuleOnline
{
    public static OnlinesSettings conf;

    public List<ModuleOnlineItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, OnlineEventsModel args)
    {
        var online = new List<ModuleOnlineItem>();

        if (args.original_language != null && args.original_language.Split("|")[0] is "ko" or "zh" or "cn" or "th" or "vi" or "tl")
            online.Add(new(conf, arg_title: " (Украинский)"));

        return online;
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
        conf = ModuleInvoke.Init("BamBoo", new OnlinesSettings("BamBoo", "https://bambooua.com")
        {
            displayindex = 815,
            rch_access = "apk,cors",
            stream_access = "apk,cors",
            rchstreamproxy = "web",
            geo_hide = ["RU", "BY"]
        });
    }

    string onlineApiQuality(EventOnlineApiQuality e)
    {
        return e.balanser == "bamboo" ? " ~ 1080p" : null;
    }
}
