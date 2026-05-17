using Shared;
using Shared.Services;
using Shared.Models.AppConf;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using System.Collections.Generic;
using System.IO;

namespace Tracks;

public class ModInit : IModuleLoaded
{
    public static string modpath;
    public static ModuleConf conf;

    public void Loaded(InitspaceModel initspace)
    {
        modpath = initspace.path;

        updateConf();
        EventListener.UpdateInitFile += updateConf;

        foreach (var m in conf.limit_map)
            CoreInit.conf.WAF.limit_map.Insert(0, m);

        Directory.CreateDirectory("database/tracks");
    }

    public void Dispose()
    {
        EventListener.UpdateInitFile -= updateConf;
    }

    void updateConf()
    {
        conf = ModuleInvoke.Init("Tracks", new ModuleConf()
        {
            tsuri = null,
            limit_map = new List<WafLimitRootMap>()
            {
                new("^/ffprobe", new WafLimitMap { limit = 10, second = 1 })
            }
        });
    }
}
