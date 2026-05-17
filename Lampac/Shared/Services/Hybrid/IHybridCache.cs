using System.Text.Json.Serialization.Metadata;

namespace Shared.Services.Hybrid;

public interface IHybridCache
{
    bool TryGetValue<TItem>(string key, out TItem value, JsonTypeInfo<TItem> jsonType = null, bool textJson = false);


    bool ContainsKey<T>(string key, out T value);

    bool ContainsKey<T>(string key, out T value, out DateTimeOffset ex);

    Task<HybridCacheEntry<TItem>> EntryAsync<TItem>(string key, bool fileCache = false, JsonTypeInfo<TItem> jsonType = null, bool textJson = false);


    TItem Set<TItem>(string key, TItem value, DateTimeOffset absoluteExpiration, bool? inmemory = null, bool textJson = false);

    TItem Set<TItem>(string key, TItem value, TimeSpan absoluteExpirationRelativeToNow, bool? inmemory = null, bool textJson = false);
}
