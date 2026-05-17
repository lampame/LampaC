using Shared;
using Shared.Models.AppConf;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using Shared.Services;
using SyncEvents;
using System.Collections.Generic;

namespace Storage;

public class ModInit : IModuleLoaded
{
    public static string modpath;
    public static ModuleConf conf;

    public void Loaded(InitspaceModel baseconf)
    {
        modpath = baseconf.path;

        updateConf();
        EventListener.UpdateInitFile += updateConf;
        NwsEvents.Start(onlyreg: true);

        foreach (var m in conf.limit_map)
            CoreInit.conf.WAF.limit_map.Insert(0, m);
    }

    public void Dispose()
    {
        EventListener.UpdateInitFile -= updateConf;
        NwsEvents.Stop();
    }

    void updateConf()
    {
        conf = ModuleInvoke.Init("Storage", new ModuleConf()
        {
            enableTemp = false,
            limit_map = new List<WafLimitRootMap>()
            {
                new("^/storage/", new WafLimitMap { limit = 10, second = 1 })
            }
        });
    }
}
