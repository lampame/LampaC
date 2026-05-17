using Microsoft.AspNetCore.Http;
using Shared.Models.Base;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using Shared.Models.SISI.Base;
using Shared.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PornGram;

public class ModInit : IModuleLoaded, IModuleSisi, IModuleSisiAsync
{
    public static SisiSettings conf;

    public List<SisiModuleItem> Invoke(HttpContext httpContext, RequestModel requestInfo, string host, SisiEventsModel args)
    {
        return new List<SisiModuleItem>()
        {
            new("PornGram", conf)
        };
    }

    public Task<List<SisiModuleItem>> InvokeAsync(HttpContext httpContext, RequestModel requestInfo, string host, SisiEventsModel args)
    {
        return Task.FromResult(default(List<SisiModuleItem>));
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
        conf = ModuleInvoke.Init("PornGram", new SisiSettings("PornGram", "porngram.com")
        {
            displayindex = 1,
            streamproxy = true
        });
    }
}
