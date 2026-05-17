using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Lamson;

public class ModInit : IModuleLoaded
{
    public void Loaded(InitspaceModel conf)
    {
        ThreadPool.QueueUserWorkItem(async _ =>
        {
            while (true)
            {
                // асинхронные задачи
                await Task.Delay(1000);
            }
        });


        var timer = new System.Timers.Timer(TimeSpan.FromMinutes(1).TotalMilliseconds)
        {
            AutoReset = true,
            Enabled = true
        };

        timer.Elapsed += async (s, e) =>
        {
            // cron
            await Task.Delay(1000);
        };
    }

    public void Dispose()
    {
    }
}
