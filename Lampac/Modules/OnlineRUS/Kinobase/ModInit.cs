using Microsoft.AspNetCore.Http;
using Shared.Models.Base;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using Shared.PlaywrightCore;
using Shared.Services;
using System.Collections.Generic;
using Shared;
using System.IO;

namespace Kinobase;

public class ModInit : IModuleLoaded, IModuleOnline, IModuleOnlineSpider
{
    public static ModuleConf conf;
    public static string uppod, playerjs;

    public List<ModuleOnlineItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, OnlineEventsModel args)
    {
        if (PlaywrightBrowser.Status == PlaywrightStatus.disabled)
            return null;

        return new List<ModuleOnlineItem>()
        {
            new(conf)
        };
    }

    public List<ModuleOnlineSpiderItem> Spider(HttpContext httpContext, RequestModel requestInfo, string host, OnlineSpiderModel args)
    {
        if (PlaywrightBrowser.Status == PlaywrightStatus.disabled)
            return null;

        return new List<ModuleOnlineSpiderItem>()
        {
            new(conf)
        };
    }

    public void Loaded(InitspaceModel baseconf)
    {
        CoreInit.conf.online.with_search.Add("kinobase");

        uppod = File.ReadAllText($"{baseconf.path}/players/uppod.js");
        playerjs = File.ReadAllText($"{baseconf.path}/players/playerjs.js");

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
        conf = ModuleInvoke.Init("Kinobase", new ModuleConf("Kinobase", "https://kinobase.org", true, hdr: true)
        {
            displayindex = 505,
            httpversion = 2,
            stream_access = "apk,cors,web",
            geostreamproxy = ["ALL"]
        });
    }

    string onlineApiQuality(EventOnlineApiQuality e)
    {
        return e.balanser switch
        {
            "kinobase" => " ~ 1080p",
            _ => null
        };
    }
}
