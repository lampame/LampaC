using Microsoft.AspNetCore.Http;
using Shared.Models.Base;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using Shared.Models.Online.Settings;
using Shared.Services;
using System.Collections.Generic;
using Shared;

namespace RutubeMovie;

public class ModInit : IModuleLoaded, IModuleOnline
{
    public static OnlinesSettings conf;

    public List<ModuleOnlineItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, OnlineEventsModel args)
    {
        if (args.serial == -1 || args.serial == 0)
        {
            return new List<ModuleOnlineItem>()
            {
                new(conf, plugin: "rutubemovie", name: "Rutube")
            };
        }

        return null;
    }

    public void Loaded(InitspaceModel baseconf)
    {
        CoreInit.conf.online.with_search.Add("rutubemovie");

        updateConf();
        EventListener.UpdateInitFile += updateConf;
        EventListener.OnlineApiQuality += onlineApiQuality;
    }

    public void Dispose()
    {
        EventListener.UpdateInitFile -= updateConf;
        EventListener.OnlineApiQuality -= onlineApiQuality;
    }

    private void updateConf()
    {
        conf = ModuleInvoke.Init("RutubeMovie", new OnlinesSettings("RutubeMovie", "https://rutube.ru")
        {
            displayindex = 565,
            streamproxy = true,
            rch_access = "apk,cors"
        });
    }

    private string onlineApiQuality(EventOnlineApiQuality e)
    {
        return e.balanser switch
        {
            "rutubemovie" => " ~ 2160p",
            _ => null
        };
    }
}
