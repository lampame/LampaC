using Microsoft.Extensions.DependencyInjection;
using Shared;
using Shared.Models.AppConf;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using System.Collections.Generic;
using Shared.Services;

namespace WatchTogether
{
    public class WatchTogetherConf
    {
        public bool enable { get; set; } = true;
        public bool allow_anonymous { get; set; } = true;
        public int relay_max_channels { get; set; } = 500;
        public int relay_max_clients_per_channel { get; set; } = 32;
        public int gc_empty_timeout_minutes { get; set; } = 30;
        public int gc_max_lifetime_hours { get; set; } = 12;

        public List<WafLimitRootMap> limit_map { get; set; } = new()
        {
            new("^/watchtogether/", new WafLimitMap { limit = 30, second = 1 }),
            new("^/wt/c/", new WafLimitMap { limit = 10, second = 1 })
        };
    }

    /// <summary>
    /// WatchTogether: a lampac module that acts as both the lparty relay and a
    /// shadow host keeping rooms alive when their creator disconnects.
    /// </summary>
    public class ModInit : IModuleLoaded, IModuleConfigure
    {
        public static string modpath;
        public static WatchTogetherConf conf;

        public void Configure(ConfigureModel app)
        {
            app.services.AddTransient<Microsoft.AspNetCore.Hosting.IStartupFilter, RelayStartupFilter>();
        }

        public void Loaded(InitspaceModel baseconf)
        {
            modpath = baseconf.path;
            UpdateConf();
            EventListener.UpdateInitFile += UpdateConf;
            ShadowHost.Start();
        }

        public void Dispose()
        {
            EventListener.UpdateInitFile -= UpdateConf;
            ShadowHost.Stop();
        }

        private static bool isWafInjected = false;

        private void UpdateConf()
        {
            conf = ModuleInvoke.Init("WatchTogether", new WatchTogetherConf());

            if (!isWafInjected && conf.limit_map != null)
            {
                foreach (var m in conf.limit_map)
                {
                    CoreInit.conf.WAF.limit_map.Insert(0, m);
                }
                isWafInjected = true;
            }
        }
    }
}
