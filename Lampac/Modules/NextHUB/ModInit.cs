using Shared.Models.AppConf;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;

namespace NextHUB;

public class ModInit : IModuleLoaded
{
    public static string modpath;
    public static ModuleConf conf;

    public void Loaded(InitspaceModel baseconf)
    {
        modpath = baseconf.path;

        updateConf();
        EventListener.UpdateInitFile += updateConf;

        CoreInit.conf.WAF.limit_map.Insert(0, new WafLimitRootMap("^/nexthub", new WafLimitMap { limit = 5, second = 1, queryIds = ["plugin"] }));
    }

    public void Dispose()
    {
        EventListener.UpdateInitFile -= updateConf;
    }

    void updateConf()
    {
        conf = ModuleInvoke.Init("NextHUB", new ModuleConf());
    }
}
