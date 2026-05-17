using Shared;
using Shared.Services;
using Shared.Models.AppConf;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using System.Collections.Generic;

namespace CubProxy;

public class ModInit : IModuleLoaded
{
    public static string modpath;
    public static ModuleConf conf;
    public static CacheFileWatcher fileWatcher;

    public void Loaded(InitspaceModel baseconf)
    {
        modpath = baseconf.path;

        updateConf();
        EventListener.UpdateInitFile += updateConf;

        foreach (var m in conf.limit_map)
            CoreInit.conf.WAF.limit_map.Insert(0, m);

        CacheFileWatcher.Configure("cub", conf.cache_img);
        fileWatcher = new CacheFileWatcher("cub");
    }

    public void Dispose()
    {
        EventListener.UpdateInitFile -= updateConf;
    }

    void updateConf()
    {
        conf = ModuleInvoke.Init("cub", new ModuleConf()
        {
            viewru = true,
            responseContentLength = true,
            scheme = CoreInit.conf.cub.scheme,
            domain = CoreInit.conf.cub.domain,
            mirror = CoreInit.conf.cub.mirror,
            cache_api = 180,     // 3h
            cache_img = 60 * 24, // 24h
            limit_map = new List<WafLimitRootMap>()
            {
                new("^/cub/", new WafLimitMap { limit = 50, second = 1 })
            }
        });
    }
}
