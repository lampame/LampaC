using Shared;
using Shared.Models.Events;
using System;
using System.Runtime;
using System.Threading;

namespace Core.Services;

public static class GCMode
{
    private static int collect;
    private static long _lastGcTicks = DateTime.UtcNow.Ticks;
    private static long _lastRequestTicks;
    private static Timer _timer;
    private static long _workTimer;

    public static void Initialization()
    {
        if (CoreInit.conf.lowMemoryMode)
        {
            EventListener.Middleware += async (first, e) =>
            {
                if (first)
                {
                    Interlocked.Exchange(ref _lastRequestTicks, DateTime.UtcNow.Ticks);
                    Interlocked.Exchange(ref collect, 1);
                }

                return true;
            };

            _timer = new Timer(_ =>
            {
                if (Interlocked.Exchange(ref _workTimer, 1) == 1)
                    return;

                try
                {
                    if (Volatile.Read(ref collect) == 0)
                        return;

                    var nowTicks = DateTime.UtcNow.Ticks;
                    var lastGcTicks = Interlocked.Read(ref _lastGcTicks);
                    var lastRequestTicks = Interlocked.Read(ref _lastRequestTicks);

                    if (lastGcTicks < nowTicks - TimeSpan.FromMinutes(60).Ticks ||
                        lastRequestTicks < nowTicks - TimeSpan.FromSeconds(90).Ticks) // Kestrel KeepAliveTimeout
                    {
                        Interlocked.Exchange(ref _lastGcTicks, nowTicks);
                        Interlocked.Exchange(ref collect, 0);

                        GCSettings.LargeObjectHeapCompactionMode = GCLargeObjectHeapCompactionMode.CompactOnce;
                        GC.Collect(GC.MaxGeneration, GCCollectionMode.Aggressive, true, true);
                        GC.WaitForPendingFinalizers();
                        GC.Collect();
                    }
                }
                finally
                {
                    Volatile.Write(ref _workTimer, 0);
                }
            }, null, TimeSpan.Zero, TimeSpan.FromSeconds(1));
        }
    }
}
