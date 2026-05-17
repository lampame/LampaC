using Microsoft.AspNetCore.Http;
using Shared.Models.Base;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using Shared.Models.SISI.Base;
using Shared.Services;
using System.Collections.Generic;
using System.IO;

namespace PornGramJS;

public class ModInit : IModuleLoaded, IModuleSisi
{
    public static string jsFile;
    public static SisiSettings conf;

    public List<SisiModuleItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, SisiEventsModel args)
    {
        return new List<SisiModuleItem>()
        {
            new("PornGram", conf)
        };
    }

    public void Loaded(InitspaceModel baseconf)
    {
        string jsPath = Path.Combine(baseconf.path, "service.js");
        jsFile = File.ReadAllText(jsPath);

        updateConf();
        EventListener.UpdateInitFile += updateConf;
    }

    public void Dispose()
    {
        EventListener.UpdateInitFile -= updateConf;
    }

    void updateConf()
    {
        conf = ModuleInvoke.Init("PornGram", new SisiSettings("PornGram", "porngram.com")
        {
            displayindex = 1,
            streamproxy = true
        });
    }
}
