using Shared.Models;

namespace Shared.Engine
{
    public interface IHybridCache
    {
        bool TryGetValue<TItem>(string key, out TItem value, bool? inmemory = null);

        HybridCacheEntry<TItem> Entry<TItem>(string key, bool? inmemory = null);

        TItem Set<TItem>(string key, TItem value, DateTimeOffset absoluteExpiration, bool? inmemory = null);

        TItem Set<TItem>(string key, TItem value, TimeSpan absoluteExpirationRelativeToNow, bool? inmemory = null);

        public static IHybridCache Get(RequestModel requestInfo) => AppInit.conf.cache.type == "fdb"
            ? new HybridFileCache()
            : new HybridCache(requestInfo);
    }
}
