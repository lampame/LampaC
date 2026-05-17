using Microsoft.AspNetCore.Http;
using Shared.Models.Base;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using Shared.Models.SISI.Base;
using Shared.Services;
using System.Collections.Generic;

namespace Eporner;

public class ModInit : IModuleLoaded, IModuleSisi
{
    public static SisiSettings conf;

    public List<SisiModuleItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, SisiEventsModel args)
    {
        return new List<SisiModuleItem>()
        {
            new("eporner.com", conf, "epr")
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
        conf = ModuleInvoke.Init("Eporner", new SisiSettings("Eporner", "https://www.eporner.com")
        {
            httpversion = 2,
            displayindex = 17,
            rch_access = "apk,cors",
            stream_access = "apk,cors",
            rchstreamproxy = "web",
            headers_image = HeadersModel.Init(
                ("Accept", "image/jpeg,image/png,image/*;q=0.8,*/*;q=0.5"),
                ("User-Agent", "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/534.57.2 (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2"),
                ("Cache-Control", "max-age=0")
            ).ToDictionary()
        });
    }
}
