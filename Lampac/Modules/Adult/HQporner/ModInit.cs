using Microsoft.AspNetCore.Http;
using Shared.Models.Base;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using Shared.Models.SISI.Base;
using Shared.Services;
using System.Collections.Generic;

namespace HQporner;

public class ModInit : IModuleLoaded, IModuleSisi
{
    public static SisiSettings conf;

    public List<SisiModuleItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, SisiEventsModel args)
    {
        return new List<SisiModuleItem>()
        {
            new("hqporner.com", conf, "hqr")
        };
    }

    public void Loaded(InitspaceModel baseconf)
    {
        updateConf();
        EventListener.UpdateInitFile += updateConf;
    }

    public void Dispose()
    {
        EventListener.UpdateInitFile -= updateConf;
    }

    void updateConf()
    {
        conf = ModuleInvoke.Init("HQporner", new SisiSettings("HQporner", "https://m.hqporner.com")
        {
            displayindex = 15,
            rch_access = "apk,cors",
            stream_access = "apk,cors,web",
            geostreamproxy = ["ALL"],
            headers = HeadersModel.Init("referer", "https://m.hqporner.com").ToDictionary(),
            headers_image = HeadersModel.Init("referer", "https://m.hqporner.com").ToDictionary()
        });
    }
}
