using Microsoft.AspNetCore.Http;
using Shared.Models.Base;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using Shared.Models.SISI.Base;
using Shared.PlaywrightCore;
using Shared.Services;
using System.Collections.Generic;

namespace BongaCams;

public class ModInit : IModuleLoaded, IModuleSisi
{
    public static SisiSettings conf;

    public List<SisiModuleItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, SisiEventsModel args)
    {
        if (conf.priorityBrowser == "http" || conf.rhub || PlaywrightBrowser.Status != PlaywrightStatus.disabled || !string.IsNullOrEmpty(conf.overridehost) || conf.overridehosts?.Length > 0)
        {
            return new List<SisiModuleItem>()
            {
                new("bongacams.com", conf, "bgs")
            };
        }

        return null;
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
        conf = ModuleInvoke.Init("BongaCams", new SisiSettings("BongaCams", "https://ee.bongacams.com")
        {
            spider = false,
            httpversion = 2,
            displayindex = 22,
            rch_access = "apk",
            stream_access = "apk,cors,web",
            headers = HeadersModel.Init(
                ("referer", "https://ee.bongacams.com/"),
                ("x-requested-with", "XMLHttpRequest")
            ).ToDictionary()
        });
    }
}
