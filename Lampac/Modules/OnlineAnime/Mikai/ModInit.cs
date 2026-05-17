using Microsoft.AspNetCore.Http;
using Shared.Models.Base;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using Shared.Models.Online.Settings;
using Shared.Services;
using System.Collections.Generic;

namespace Mikai;

public class ModInit : IModuleLoaded, IModuleOnline
{
    public static OnlinesSettings conf;

    public List<ModuleOnlineItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, OnlineEventsModel args)
    {
        if (!args.isanime)
            return null;

        return new List<ModuleOnlineItem>()
        {
            new(conf, arg_title: " (Украинский)")
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
        conf = ModuleInvoke.Init("Mikai", new OnlinesSettings("Mikai", "https://api.mikai.me")
        {
            displayindex = 150,
            rch_access = "apk,cors",
            stream_access = "apk,cors",
            rchstreamproxy = "web",
            geo_hide = ["RU", "BY"]
        });
    }

    string onlineApiQuality(EventOnlineApiQuality e)
    {
        return e.balanser == "mikai" ? " ~ 1080p" : null;
    }
}
