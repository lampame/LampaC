using Microsoft.AspNetCore.Http;
using Shared.Models.Base;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using Shared.Models.Online.Settings;
using Shared.Services;
using System.Collections.Generic;
using System.IO;

namespace KinoGramJS;

public class ModInit : IModuleLoaded, IModuleOnline
{
    public static string jsFile;
    public static OnlinesSettings conf;

    public List<ModuleOnlineItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, OnlineEventsModel args)
    {
        return new List<ModuleOnlineItem>()
        {
            new(conf)
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
        conf = ModuleInvoke.Init("KinoGram", new OnlinesSettings("KinoGram", "kinogram.com")
        {
            displayindex = 1,
            streamproxy = true
        });
    }
}
