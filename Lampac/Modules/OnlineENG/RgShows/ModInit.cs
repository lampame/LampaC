using Microsoft.AspNetCore.Http;
using Shared;
using Shared.Models.Base;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using Shared.Models.Online.Settings;
using Shared.Services;
using System.Collections.Generic;

namespace RgShows;

public class ModInit : IModuleLoaded, IModuleOnline
{
    public static OnlinesSettings conf;

    public List<ModuleOnlineItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, OnlineEventsModel args)
    {
        var online = new List<ModuleOnlineItem>();

        if ((args.original_language == null || args.original_language == "en") && CoreInit.conf.disableEng == false)
        {
            if (args.source != null && (args.source is "tmdb" or "cub") && long.TryParse(args.id, out long id) && id > 0)
                online.Add(new(conf, "rgshows", "RgShows", " (ENG)"));
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
        conf = ModuleInvoke.Init("Rgshows", new OnlinesSettings("Rgshows", "https://api.rgshows.me")
        {
            enable = false,
            displayindex = 1050,
            streamproxy = true,
            headers = HeadersModel.Init(
                ("accept", "*/*"),
                ("user-agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"),
                ("accept-language", "en-US,en;q=0.5"),
                ("referer", "https://www.rgshows.me/"),
                ("origin", "https://www.rgshows.me"),
                ("sec-fetch-dest", "empty"),
                ("sec-fetch-mode", "cors"),
                ("sec-fetch-site", "same-site")
            ).ToDictionary(),
            headers_stream = HeadersModel.Init(
                ("accept", "*/*"),
                ("user-agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"),
                ("accept-language", "en-US,en;q=0.5"),
                ("referer", "https://www.rgshows.me/"),
                ("origin", "https://www.rgshows.me"),
                ("sec-fetch-dest", "empty"),
                ("sec-fetch-mode", "cors"),
                ("sec-fetch-site", "cross-site")
            ).ToDictionary()
        });
    }

    private string OnlineApiQuality(EventOnlineApiQuality e)
    {
        return e.balanser == "rgshows" ? " ~ 1080p" : null;
    }
}
