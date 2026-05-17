using Shared;
using Shared.Services;
using Shared.Models.AppConf;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using System.Collections.Generic;
using Microsoft.Extensions.DependencyInjection;

namespace TimeCode;

public class ModInit : IModuleLoaded, IModuleConfigure
{
    public static string modpath;
    public static ModuleBaseConf conf;

    public void Configure(ConfigureModel app)
    {
        app.services.AddDbContextFactory<SqlContext>(SqlContext.ConfiguringDbBuilder);
    }

    public void Loaded(InitspaceModel baseconf)
    {
        modpath = baseconf.path;

        updateConf();
        EventListener.UpdateInitFile += updateConf;

        foreach (var m in conf.limit_map)
            CoreInit.conf.WAF.limit_map.Insert(0, m);

        SqlContext.Initialization(baseconf.app.ApplicationServices);
    }

    public void Dispose()
    {
        EventListener.UpdateInitFile -= updateConf;
    }

    void updateConf()
    {
        conf = ModuleInvoke.Init("TimeCode", new ModuleBaseConf()
        {
            limit_map = new List<WafLimitRootMap>()
            {
                new("^/timecode/", new WafLimitMap { limit = 10, second = 1 })
            }
        });
    }
}
