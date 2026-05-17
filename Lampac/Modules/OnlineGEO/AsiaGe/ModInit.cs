using Microsoft.AspNetCore.Http;
using Shared.Models.Base;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using Shared.Models.Online.Settings;
using Shared.Services;
using System.Collections.Generic;

namespace AsiaGe;

public class ModInit : IModuleLoaded, IModuleOnline
{
    public static OnlinesSettings conf;

    public List<ModuleOnlineItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, OnlineEventsModel args)
    {
        var online = new List<ModuleOnlineItem>();

        if (args.serial == 1)
        {
            if (args.original_language != null && args.original_language.Split("|")[0] is "ko" or "cn")
                online.Add(new(conf, arg_title: " (Грузинский)"));
        }

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
        conf = ModuleInvoke.Init("AsiaGe", new OnlinesSettings("AsiaGe", "https://asia.com.ge")
        {
            displayindex = 910,
            rch_access = "apk,cors",
            stream_access = "apk,web,cors"
        });
    }

    string onlineApiQuality(EventOnlineApiQuality e)
    {
        return e.balanser == "asiage" ? " ~ 1080p" : null;
    }
}
