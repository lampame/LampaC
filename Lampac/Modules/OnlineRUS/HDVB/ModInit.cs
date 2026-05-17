using Microsoft.AspNetCore.Http;
using Shared.Models.Base;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using Shared.Models.Online.Settings;
using Shared.Services;
using System.Collections.Generic;
using Shared;

namespace HDVB;

public class ModInit : IModuleLoaded, IModuleOnline, IModuleOnlineSpider
{
    public static OnlinesSettings conf;

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
            new(conf, "hdvb-search")
        };
    }

    public void Loaded(InitspaceModel baseconf)
    {
        CoreInit.conf.online.with_search.Add("hdvb");

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
        conf = ModuleInvoke.Init("HDVB", new OnlinesSettings("HDVB", "https://vid1733431681.entouaedon.com", "https://apivb.com", token: "5e2fe4c70bafd9a7414c4f170ee1b192")
        {
            displayindex = 560,
            streamproxy = true,
            rch_access = "apk",
            stream_access = "apk,cors,web",
            headers = HeadersModel.Init(Http.defaultFullHeaders,
                ("referer", "encrypt:kwwsv=22prylhode1rqh2")
            ).ToDictionary(),
            headers_stream = HeadersModel.Init(Http.defaultFullHeaders,
                ("origin", "https://vid1733431681.entouaedon.com"),
                ("referer", "https://vid1733431681.entouaedon.com/"),
                ("sec-fetch-dest", "empty"),
                ("sec-fetch-mode", "cors"),
                ("sec-fetch-site", "same-site")
            ).ToDictionary()
        });
    }

    string onlineApiQuality(EventOnlineApiQuality e)
    {
        return e.balanser switch
        {
            "hdvb" => " ~ 1080p",
            _ => null
        };
    }
}
