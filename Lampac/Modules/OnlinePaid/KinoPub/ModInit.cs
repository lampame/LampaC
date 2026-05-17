using Microsoft.AspNetCore.Http;
using Shared.Models.Base;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using Shared.Services;
using System.Collections.Generic;
using Shared;

namespace KinoPub;

public class ModInit : IModuleLoaded, IModuleOnline, IModuleOnlineSpider
{
    public static ModuleConf conf;

    public List<ModuleOnlineItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, OnlineEventsModel args)
    {
        return new List<ModuleOnlineItem>()
        {
            new(conf)
        };
    }

    public List<ModuleOnlineSpiderItem> Spider(HttpContext httpContext, RequestModel requestInfo, string host, OnlineSpiderModel args)
    {
        return new List<ModuleOnlineSpiderItem>()
        {
            new(conf)
        };
    }

    public void Loaded(InitspaceModel baseconf)
    {
        CoreInit.conf.online.with_search.Add("kinopub");

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
        /// <summary>
        /// https://api.srvkp.com - стандартный
        /// https://cdn32.lol/api- apk
        /// https://cdn4t.store/api - apk
        /// https://kpapp.link/api - smart tv
        /// https://api.service-kp.com - старый
        /// </summary>
        conf = ModuleInvoke.Init("KinoPub", new ModuleConf("KinoPub", "https://api.srvkp.com")
        {
            displayindex = 320,
            httpversion = 2,
            rhub_safety = false,
            filetype = "hls", // hls | hls4 | mp4
            stream_access = "apk,cors,web",
            headers = HeadersModel.Init(Http.defaultFullHeaders,
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
        return e.balanser switch
        {
            "kinopub" => " ~ 2160p",
            _ => null
        };
    }
}
