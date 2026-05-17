using Microsoft.AspNetCore.Http;
using Shared;
using Shared.Models.Base;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using Shared.Models.Online.Settings;
using Shared.PlaywrightCore;
using Shared.Services;
using System.Collections.Generic;

namespace ZetflixDB;

public class ModInit : IModuleLoaded, IModuleOnline
{
    public static OnlinesSettings conf;

    public List<ModuleOnlineItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, OnlineEventsModel args)
    {
        var online = new List<ModuleOnlineItem>();

        if (args.kinopoisk_id > 0 && (conf.rhub || conf.priorityBrowser == "http" || PlaywrightBrowser.Status != PlaywrightStatus.disabled))
            online.Add(new(conf));

        return online;
    }

    public void Loaded(InitspaceModel baseconf)
    {
        updateConf();
        EventListener.UpdateInitFile += updateConf;
        EventListener.UpdateCurrentConf += updateCurrentConf;
        EventListener.OnlineApiQuality += onlineApiQuality;
    }

    public void Dispose()
    {
        EventListener.UpdateInitFile -= updateConf;
        EventListener.UpdateCurrentConf -= updateCurrentConf;
        EventListener.OnlineApiQuality -= onlineApiQuality;
    }

    void updateConf()
    {
        conf = ModuleInvoke.Init("ZetflixDB", new OnlinesSettings("ZetflixDB", "", "https://54243ba5.obrut.show")
        {
            displayindex = 515
        });
    }

    void updateCurrentConf()
    {
        if (CoreInit.CurrentConf.TryGetValue("VideoDB", out var videoDBConf))
        {
            var _conf = videoDBConf.ToObject<OnlinesSettings>();

            if (_conf != null)
            {
                conf.rch_access = _conf.rch_access;
                conf.stream_access = _conf.stream_access;
                conf.priorityBrowser = _conf.priorityBrowser;
            }
        }
    }

    string onlineApiQuality(EventOnlineApiQuality e)
    {
        return e.balanser == "zetflixdb" ? " ~ 2160p" : null;
    }
}
