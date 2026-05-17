using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using Shared.Models.Online.Settings;
using Shared.Services;

namespace HdvbUA;

public class ModInit : IModuleLoaded
{
    public static OnlinesSettings conf;

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
        conf = ModuleInvoke.Init("HdvbUA", new OnlinesSettings("HdvbUA", "")
        {
            displayindex = 815,
            rch_access = "apk,cors",
            stream_access = "apk,cors,web",
            geo_hide = ["RU", "BY"]
        });
    }
}
