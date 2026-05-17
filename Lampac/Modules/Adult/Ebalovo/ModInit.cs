using Microsoft.AspNetCore.Http;
using Shared.Models.Base;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using Shared.Models.SISI.Base;
using Shared.Services;
using System.Collections.Generic;

namespace Ebalovo;

public class ModInit : IModuleLoaded, IModuleSisi
{
    public static SisiSettings conf;

    public List<SisiModuleItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, SisiEventsModel args)
    {
        return new List<SisiModuleItem>()
        {
            new("ebalovo.porn", conf, "elo")
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
        conf = ModuleInvoke.Init("Ebalovo", new SisiSettings("Ebalovo", "https://www.ebalovo.pro")
        {
            displayindex = 14,
            rch_access = "apk",
            stream_access = "apk,cors",
            rchstreamproxy = "web",
            headers = Http.defaultFullHeaders,
            headers_stream = HeadersModel.Init(Http.defaultFullHeaders,
                ("sec-fetch-dest", "video"),
                ("sec-fetch-mode", "no-cors"),
                ("sec-fetch-site", "same-origin")
            ).ToDictionary()
        });
    }
}
