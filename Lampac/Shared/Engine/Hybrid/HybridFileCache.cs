using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Shared.Engine.Utilities;
using System.Collections.Concurrent;
using System.Globalization;
using System.IO.Compression;
using System.Text;
using System.Threading;

namespace Shared.Engine
{
    public class HybridFileCache : BaseHybridCache, IHybridCache
    {
        sealed record class cacheEntry(string path, DateTime ex, int capacity);

        #region static
        static readonly ThreadLocal<JsonSerializer> _serializer = new ThreadLocal<JsonSerializer>(JsonSerializer.CreateDefault);
        static readonly ThreadLocal<Encoding> _utf8NoBom = new ThreadLocal<Encoding>(() => new UTF8Encoding(encoderShouldEmitUTF8Identifier: false));

        static IMemoryCache memoryCache;

        static Timer _clearTempDb, _cleanupTimer;

        static readonly ConcurrentDictionary<string, cacheEntry> cacheFiles = new();

        static readonly ConcurrentDictionary<string, TempEntry> tempDb = new();

        public static int Stat_ContTempDb => tempDb.IsEmpty ? 0 : tempDb.Count;
        #endregion

        #region Configure
        public static void Configure(IMemoryCache mem)
        {
            memoryCache = mem;
            Directory.CreateDirectory("cache/fdb");

            _clearTempDb = new Timer(ClearTempDb, null, TimeSpan.FromSeconds(10), TimeSpan.FromSeconds(1));
            _cleanupTimer = new Timer(ClearCacheFiles, null, TimeSpan.FromMinutes(1), TimeSpan.FromMinutes(1));

            var now = DateTime.Now;

            foreach (string inFile in Directory.EnumerateFiles("cache/fdb", "*"))
            {
                try
                {
                    // cacheKey-time-capacity
                    string path = Path.GetFileName(inFile);
                    string[] parts = path.Split('-');

                    if (parts.Length != 3)
                    {
                        File.Delete(inFile);
                        continue;
                    }

                    #region ex
                    if (!long.TryParse(parts[1], out long fileTime) || fileTime == 0)
                    {
                        File.Delete(inFile);
                        continue;
                    }

                    var ex = DateTime.FromFileTime(fileTime);

                    if (now > ex)
                    {
                        File.Delete(inFile);
                        continue;
                    }
                    #endregion

                    int.TryParse(parts[2], out int capacity);

                    cacheFiles[parts[0]] = new cacheEntry(path, ex, capacity);
                }
                catch { }
            }
        }
        #endregion

        #region ClearTempDb
        static int _updatingDb = 0;

        async static void ClearTempDb(object state)
        {
            if (tempDb.IsEmpty)
                return;

            if (Interlocked.Exchange(ref _updatingDb, 1) == 1)
                return;

            try
            {
                var now = DateTime.Now;

                foreach (var tdb in tempDb)
                {
                    if (now > tdb.Value.extend)
                    {
                        try
                        {
                            int capacity = GetCapacity(tdb.Value.value);
                            string path = $"{tdb.Key}-{tdb.Value.ex.ToFileTime()}-{capacity}";
                            string pathFile = $"cache/fdb/{path}";

                            if (tdb.Value.IsSerialize)
                            {
                                using (var fs = new FileStream(pathFile, FileMode.Create, FileAccess.Write, FileShare.Read))
                                {
                                    using (var gzip = new GZipStream(fs, CompressionLevel.Fastest))
                                    {
                                        using (var sw = new StreamWriter(gzip, _utf8NoBom.Value))
                                        {
                                            using (var jw = new JsonTextWriter(sw)
                                            {
                                                Formatting = Formatting.None
                                            })
                                            {
                                                var serializer = _serializer.Value;
                                                serializer.Serialize(jw, tdb.Value.value);
                                            }
                                        }
                                    }
                                }
                            }
                            else
                            {
                                File.WriteAllText(pathFile, (string)tdb.Value.value);
                            }

                            cacheFiles[tdb.Key] = new cacheEntry(path, tdb.Value.ex, capacity);
                            tempDb.TryRemove(tdb.Key, out _);
                        }
                        catch { }
                    }
                }
            }
            catch (Exception ex) 
            { 
                Console.WriteLine("HybridFileCache: " + ex); 
            }
            finally
            {
                Volatile.Write(ref _updatingDb, 0);
            }
        }
        #endregion

        #region ClearCacheFiles
        static void ClearCacheFiles(object state)
        {
            try
            {
                foreach (string inFile in Directory.EnumerateFiles("cache/fdb", "*"))
                {
                    // cacheKey-time-capacity
                    ReadOnlySpan<char> fileName = inFile.AsSpan();
                    int lastSlash = fileName.LastIndexOfAny('\\', '/');
                    if (lastSlash >= 0)
                        fileName = fileName.Slice(lastSlash + 1);

                    int dash = fileName.IndexOf('-');
                    if (dash <= 0)
                        continue;

                    string cachekey = new string(fileName.Slice(0, dash));
                    if (!cacheFiles.ContainsKey(cachekey))
                    {
                        try
                        {
                            File.Delete(inFile);
                        }
                        catch { }
                    }
                }
            }
            catch { }
        }
        #endregion


        #region TryGetValue
        public bool TryGetValue<TItem>(string key, out TItem value, bool? inmemory = null)
        {
            if (memoryCache.TryGetValue(key, out value))
                return true;

            if (ReadCache(key, out value, out _))
                return true;

            return false;
        }
        #endregion
        
        #region Entry
        public HybridCacheEntry<TItem> Entry<TItem>(string key, bool? inmemory = null)
        {
            if (memoryCache.TryGetValue(key, out TItem value))
                return new HybridCacheEntry<TItem>(true, value, false);

            if (ReadCache(key, out value, out bool singleCache))
                return new HybridCacheEntry<TItem>(true, value, singleCache);

            return new HybridCacheEntry<TItem>(false, default, false);
        }
        #endregion

        #region ReadCache
        private bool ReadCache<TItem>(string key, out TItem value, out bool singleCache)
        {
            value = default;
            singleCache = false;

            var type = typeof(TItem);
            bool isText = type == typeof(string);

            bool IsDeserialize = type.GetConstructor(Type.EmptyTypes) != null 
                || type.IsValueType 
                || type.IsArray
                || type == typeof(JToken)
                || type == typeof(JObject)
                || type == typeof(JArray);

            if (!isText && !IsDeserialize)
                return false;

            try
            {
                string md5key = CrypTo.md5(key);

                if (tempDb.TryGetValue(md5key, out var _temp))
                {
                    value = (TItem)_temp.value;
                    return true;
                }
                else
                {
                    if (!cacheFiles.TryGetValue(md5key, out cacheEntry _cache))
                        return false;

                    if (DateTime.Now > _cache.ex)
                    {
                        cacheFiles.TryRemove(md5key, out _);
                        return false;
                    }

                    string path = $"cache/fdb/{_cache.path}";

                    if (IsDeserialize)
                    {
                        using (var fs = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
                        {
                            using (var gzip = new GZipStream(fs, CompressionMode.Decompress))
                            {
                                using (var sr = new StreamReader(gzip, Encoding.UTF8))
                                {
                                    using (var jsonReader = new JsonTextReader(sr)
                                    {
                                        ArrayPool = NewtonsoftPool.Array
                                    })
                                    {
                                        singleCache = true;
                                        var serializer = _serializer.Value;

                                        if (IsCapacityCollection(type) && _cache.capacity > 0)
                                        {
                                            var instance = CreateCollectionWithCapacity(type, _cache.capacity);
                                            if (instance != null)
                                            {
                                                serializer.Populate(jsonReader, instance);
                                                value = (TItem)instance;
                                            }
                                            else
                                            {
                                                value = serializer.Deserialize<TItem>(jsonReader);
                                            }
                                        }
                                        else
                                        {
                                            value = serializer.Deserialize<TItem>(jsonReader);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else
                    {
                        singleCache = true;
                        string val = File.ReadAllText(path);

                        if (typeof(TItem) == typeof(string))
                            value = (TItem)(object)val;
                        else
                        {
                            value = (TItem)Convert.ChangeType(val, typeof(TItem), CultureInfo.InvariantCulture);
                        }
                    }

                    return true;
                }
            }
            catch (Exception ex) { Console.WriteLine($"HybridFileCache.ReadCache({key}): {ex}\n\n"); }

            return false;
        }
        #endregion


        #region Set
        public TItem Set<TItem>(string key, TItem value, DateTimeOffset absoluteExpiration, bool? inmemory = null)
        {
            if (inmemory != true && WriteCache(key, value, absoluteExpiration, default))
                return value;

            if (inmemory != true)
                Console.WriteLine($"set memory: {key} / {DateTime.Now}");

            return memoryCache.Set(key, value, absoluteExpiration);
        }

        public TItem Set<TItem>(string key, TItem value, TimeSpan absoluteExpirationRelativeToNow, bool? inmemory = null)
        {
            if (inmemory != true && WriteCache(key, value, default, absoluteExpirationRelativeToNow))
                return value;

            if (inmemory != true)
                Console.WriteLine($"set memory: {key} / {DateTime.Now}");

            return memoryCache.Set(key, value, absoluteExpirationRelativeToNow);
        }
        #endregion

        #region WriteCache
        private bool WriteCache<TItem>(string key, TItem value, DateTimeOffset absoluteExpiration, TimeSpan absoluteExpirationRelativeToNow)
        {
            var type = typeof(TItem);
            bool isText = type == typeof(string);

            bool IsSerialize = type.GetConstructor(Type.EmptyTypes) != null
                || type.IsValueType
                || type.IsArray
                || type == typeof(JToken)
                || type == typeof(JObject)
                || type == typeof(JArray);

            if (!isText && !IsSerialize)
                return false;

            string md5key = CrypTo.md5(key);

            // кеш уже получен от другого rch клиента
            if (tempDb.ContainsKey(md5key))
                return true;

            try
            {
                if (absoluteExpiration == default)
                    absoluteExpiration = DateTimeOffset.Now.Add(absoluteExpirationRelativeToNow);

                /// защита от асинхронных rch запросов которые приходят в рамках 12 секунд
                /// дополнительный кеш для сериалов, что бы выборка сезонов/озвучки не дергала sql 
                var extend = DateTime.Now.AddSeconds(Math.Max(15, AppInit.conf.cache.extend));

                tempDb.TryAdd(md5key, new TempEntry(extend, IsSerialize, absoluteExpiration.DateTime, value));

                return true;
            }
            catch { }

            return false;
        }
        #endregion
    }
}
