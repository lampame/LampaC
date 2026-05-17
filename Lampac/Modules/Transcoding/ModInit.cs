using Shared;
using Shared.Services;
using Shared.Models.AppConf;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using System.Collections.Generic;
using System.IO;
using Shared.Models.Events;

namespace Transcoding;

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
        Directory.CreateDirectory(conf.tempRoot);

        TranscodingService.Instance.Configure(conf);
    }

    public void Dispose()
    {
        EventListener.UpdateInitFile -= updateConf;
        TranscodingService.Instance.StopAll();
    }

    void updateConf()
    {
        conf = ModuleInvoke.Init("transcoding", new ModuleConf()
        {
            tempRoot = Path.Combine("cache", "transcoding"),
            idleTimeoutSec = 60 * 5,
            idleTimeoutSec_live = 120,
            maxConcurrentJobs = 5,
            limit_map = new List<WafLimitRootMap>()
            {
                new("^/transcoding/", new WafLimitMap { limit = 50, second = 1 })
            }
        });
    }
}
