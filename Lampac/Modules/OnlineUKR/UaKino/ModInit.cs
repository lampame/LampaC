using Microsoft.AspNetCore.Http;
using Shared.Models.Base;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using Shared.Models.Online.Settings;
using Shared.PlaywrightCore;
using Shared.Services;
using System.Collections.Generic;

namespace UaKino;

public class ModInit : IModuleLoaded, IModuleOnline
{
    public static OnlinesSettings conf;

    public List<ModuleOnlineItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, OnlineEventsModel args)
    {
        var online = new List<ModuleOnlineItem>();

        if (PlaywrightBrowser.Status != PlaywrightStatus.disabled)
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
        conf = ModuleInvoke.Init("UaKino", new OnlinesSettings("UaKino", "https://uakino.cx")
        {
            displayindex = 825,
            rch_access = "apk,cors",
            stream_access = "apk,cors,web",
            geo_hide = ["RU", "BY"],
            headers = HeadersModel.Init(
                ("cache-control", "no-cache"),
                ("pragma", "no-cache"),
                ("priority", "u=0, i"),
                ("sec-fetch-dest", "document"),
                ("sec-fetch-mode", "navigate"),
                ("sec-fetch-site", "none"),
                ("sec-fetch-user", "?1"),
                ("upgrade-insecure-requests", "1")
            ).ToDictionary()
        });
    }

    string onlineApiQuality(EventOnlineApiQuality e)
    {
        return e.balanser == "uakino" ? " ~ 1080p" : null;
    }
}
