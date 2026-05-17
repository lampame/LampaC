using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using Shared.Models.Online.Settings;
using Shared.Services;

namespace KinoGram;

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
        conf = ModuleInvoke.Init("KinoGram", new OnlinesSettings("KinoGram", "kinogram.com")
        {
            displayindex = 1,
            streamproxy = true
        });
    }
}
