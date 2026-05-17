using Filmix.Models;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;

namespace Filmix;

public class ModInit : IModuleLoaded, IModuleOnline, IModuleOnlineSpider
{
    public static ModuleConf conf;

    public List<ModuleOnlineItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, OnlineEventsModel args)
    {
        var online = new List<ModuleOnlineItem>(3);

        bool fxshow = true;

        if (string.IsNullOrEmpty(conf.Filmix.token) && (conf.Filmix.tokens == null || conf.Filmix.tokens.Length == 0) && conf.Filmix.hidefreeStart > 0)
        {
            if (TimeZoneTo.ByIds(["Europe/Kyiv", "Europe/Kiev", "FLE Standard Time"], out DateTime kievTime))
            {
                if (kievTime.Hour >= conf.Filmix.hidefreeStart && kievTime.Hour < conf.Filmix.hidefreeEnd)
                    fxshow = false;
            }
        }

        if (fxshow)
            online.Add(new(conf.Filmix));

        online.Add(new(conf.FilmixTV, "filmixtv"));
        online.Add(new(conf.FilmixPartner, "fxapi", "Filmix"));

        return online;
    }

    public List<ModuleOnlineSpiderItem> Spider(HttpContext httpContext, RequestModel requestInfo, string host, OnlineSpiderModel args)
    {
        return new List<ModuleOnlineSpiderItem>()
        {
            new(conf.Filmix),
            new(conf.FilmixTV, "filmixtv"),
            new(conf.FilmixPartner, "fxapi")
        };
    }

    public void Loaded(InitspaceModel baseconf)
    {
        CoreInit.conf.online.with_search.Add("filmix");
        CoreInit.conf.online.with_search.Add("filmixtv");
        CoreInit.conf.online.with_search.Add("fxapi");

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
        conf = ModuleInvoke.DeserializeInit(new ModuleConf());
    }

    string onlineApiQuality(EventOnlineApiQuality e)
    {
        if (e.balanser == "filmix" && e.kitconf != null)
        {
            bool pro = conf.Filmix.pro;
            string token = conf.Filmix.token;

            if (e.kitconf.TryGetValue("Filmix", out JToken kit))
            {
                if (kit["pro"] != null)
                    pro = kit.Value<bool>("pro");

                if (kit["token"] != null)
                    token = kit.Value<string>("token");
            }

            if (pro)
                return " ~ 2160p";

            return string.IsNullOrEmpty(token) ? " - 480p" : " - 720p";
        }
        else
        {
            return e.balanser switch
            {
                "fxapi" or "filmixtv" => " ~ 2160p",
                _ => null
            };
        }
    }
}
