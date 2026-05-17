using Microsoft.AspNetCore.Http;
using Shared.Models.Base;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using Shared.Models.Online.Settings;
using Shared.PlaywrightCore;
using Shared.Services;
using System.Collections.Generic;
using System.IO;

namespace Kinogo;

public class ModInit : IModuleLoaded, IModuleOnline, IModuleOnlineSpider
{
    public static OnlinesSettings conf;
    public static string playerjs;

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
        playerjs = File.ReadAllText($"{baseconf.path}/playerjs.js");

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
        conf = ModuleInvoke.Init("Kinogo", new OnlinesSettings("Kinogo", "https://kinogo.luxury")
        {
            displayindex = 530,
            rch_access = "apk",
            stream_access = "apk,cors",
            rchstreamproxy = "web"
        });
    }

    string onlineApiQuality(EventOnlineApiQuality e)
    {
        return e.balanser switch
        {
            "kinogo" => " ~ 1080p",
            _ => null
        };
    }
}
