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

namespace PlayEmbed;

public class ModInit : IModuleLoaded, IModuleOnline
{
    public static OnlinesSettings conf;

    public List<ModuleOnlineItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, OnlineEventsModel args)
    {
        var online = new List<ModuleOnlineItem>();

        if ((args.original_language == null || args.original_language == "en") && CoreInit.conf.disableEng == false)
        {
            if (args.source != null && (args.source is "tmdb" or "cub") && long.TryParse(args.id, out long id) && id > 0)
            {
                if (PlaywrightBrowser.Status != PlaywrightStatus.disabled)
                    online.Add(new(conf, "playembed", "PlayEmbed", " (ENG)"));
            }
        }

        return online;
    }

    public void Loaded(InitspaceModel baseconf)
    {
        UpdateConf();
        EventListener.UpdateInitFile += UpdateConf;
        EventListener.OnlineApiQuality += OnlineApiQuality;
    }

    public void Dispose()
    {
        EventListener.UpdateInitFile -= UpdateConf;
        EventListener.OnlineApiQuality -= OnlineApiQuality;
    }

    private void UpdateConf()
    {
        /// <summary>
        /// Omega
        /// </summary>
        conf = ModuleInvoke.Init("Playembed", new OnlinesSettings("Playembed", "https://vidora.su")
        {
            enable = false,
            displayindex = 1040,
            streamproxy = true
        });
    }

    private string OnlineApiQuality(EventOnlineApiQuality e)
    {
        return e.balanser == "playembed" ? " ~ 1080p" : null;
    }
}
