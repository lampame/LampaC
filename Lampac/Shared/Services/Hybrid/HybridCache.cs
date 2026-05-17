using Microsoft.Extensions.Caching.Memory;

namespace Shared.Services.Hybrid;

public static class HybridCache
{
    static IHybridCache _instance = new HybridFileCache();
    static IMemoryCache _instanceMemory;


    public static IHybridCache Get()
        => _instance;

    public static IMemoryCache GetMemory()
        => _instanceMemory;


    public static void Configure(IHybridCache hybridCache)
    {
        if (hybridCache == null)
            return;

        _instance = hybridCache;
    }

    public static void Configure(IMemoryCache mem)
    {
        if (mem == null)
            return;

        _instanceMemory = mem;
    }
}
