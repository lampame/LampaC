using Microsoft.AspNetCore.Http;
using Shared.Models.Base;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using Shared.Models.SISI.Base;
using Shared.Services;
using System.Collections.Generic;

namespace Xvideos;

public class ModInit : IModuleLoaded, IModuleSisi
{
    public static SisiSettings conf;

    public List<SisiModuleItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, SisiEventsModel args)
    {
        var channels = new List<SisiModuleItem>()
        {
            new("xvideos.com", conf, "xds")
        };

        if (args.lgbt)
        {
            channels.Add(new("xdsgay", conf, "xdsgay", 10_102));
            channels.Add(new("xdstrans", conf, "xdssml", 10_103));
        }

        return channels;
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
        // https://www.xvideos.com
        conf = ModuleInvoke.Init("Xvideos", new SisiSettings("Xvideos", "https://www.xv-ru.com")
        {
            httpversion = 2,
            displayindex = 12,
            rch_access = "apk,cors",
            stream_access = "apk,cors,web"
        });
    }
}
