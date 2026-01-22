using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Shared.Engine.Utilities;
using System.Collections.Concurrent;
using System.Text;
using System.Threading;

namespace Shared.Engine
{
    public class HybridFileCache : IHybridCache
    {
        #region static
        static readonly ThreadLocal<JsonSerializer> _serializer = new ThreadLocal<JsonSerializer>(JsonSerializer.CreateDefault);
        static readonly ThreadLocal<Encoding> _utf8NoBom = new ThreadLocal<Encoding>(() => new UTF8Encoding(encoderShouldEmitUTF8Identifier: false));

        static IMemoryCache memoryCache;

        static Timer _clearTempDb, _cleanupTimer;

        static readonly ConcurrentDictionary<string, DateTime> cacheFiles = new();

        static readonly ConcurrentDictionary<string, (DateTime extend, bool IsSerialize, DateTime ex, object value)> tempDb = new();

        public static int Stat_ContTempDb => tempDb.IsEmpty ? 0 : tempDb.Count;

        static string getFilePath(string md5key, DateTime ex)
        {
            return $"cache/fdb/{md5key}-{ex.ToFileTime()}";
        }
        #endregion

        #region Configure
        public static void Configure(IMemoryCache mem)
        {
            memoryCache = mem;
            Directory.CreateDirectory("cache/fdb");

            _clearTempDb = new Timer(ClearTempDb, null, TimeSpan.FromSeconds(10), TimeSpan.FromSeconds(1));
            _cleanupTimer = new Timer(ClearCacheFiles, null, TimeSpan.FromSeconds(10), TimeSpan.FromSeconds(1));

            var now = DateTime.Now;

            foreach (string inFile in Directory.EnumerateFiles("cache/fdb", "*"))
            {
                try
                {
                    // cacheKey-<time>
                    ReadOnlySpan<char> fileName = inFile.AsSpan();
                    int lastSlash = fileName.LastIndexOfAny('\\', '/');
                    if (lastSlash >= 0)
                        fileName = fileName.Slice(lastSlash + 1);

                    int dash = fileName.IndexOf('-');
                    if (dash <= 0)
                    {
                        File.Delete(inFile);
                        continue;
                    }

                    ReadOnlySpan<char> fileTimeSpan = fileName.Slice(dash + 1);
                    if (!long.TryParse(fileTimeSpan, out long fileTime) || fileTime == 0)
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

                    string cachekey = new string(fileName.Slice(0, dash));

                    cacheFiles[cachekey] = ex;
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
                            string path = getFilePath(tdb.Key, tdb.Value.ex);

                            if (tdb.Value.IsSerialize)
                            {
                                using (var fs = new FileStream(path,
                                    FileMode.Create,
                                    FileAccess.Write,
                                    FileShare.Read,
                                    bufferSize: PoolInvk.bufferSize,
                                    options: FileOptions.SequentialScan))
                                {
                                    using (var sw = new StreamWriter(fs,
                                        _utf8NoBom.Value,
                                        bufferSize: PoolInvk.bufferSize,
                                        leaveOpen: false))
                                    {
                                        using (var jw = new JsonTextWriter(sw)
                                        {
                                            Formatting = Formatting.None,
                                            CloseOutput = false,
                                            AutoCompleteOnClose = false
                                        })
                                        {
                                            var serializer = _serializer.Value;
                                            serializer.Serialize(jw, tdb.Value.value);
                                        }
                                    }
                                }
                            }
                            else
                            {
                                File.WriteAllText(path, (string)tdb.Value.value);
                            }

                            cacheFiles[tdb.Key] = tdb.Value.ex;
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
                var now = DateTime.Now;

                foreach (var _c in cacheFiles)
                {
                    try
                    {
                        if (_c.Value > now)
                            continue;

                        string cachefile = getFilePath(_c.Key, _c.Value);

                        try
                        {
                            File.Delete(cachefile);
                        }
                        catch { }

                        cacheFiles.TryRemove(_c.Key, out _);
                    }
                    catch { }
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

            if (ReadCache(key, out value))
                return true;

            return false;
        }
        #endregion

        #region ReadCache
        private bool ReadCache<TItem>(string key, out TItem value)
        {
            value = default;

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
                    if (!cacheFiles.TryGetValue(md5key, out DateTime _cacheFileEx) || DateTime.Now > _cacheFileEx)
                        return false;

                    string path = getFilePath(md5key, _cacheFileEx);

                    if (IsDeserialize)
                    {
                        using (var fs = File.OpenRead(path))
                        {
                            using (var sr = new StreamReader(fs,
                                Encoding.UTF8,
                                detectEncodingFromByteOrderMarks: false,
                                bufferSize: PoolInvk.bufferSize,
                                leaveOpen: false))
                            {
                                using (var jsonReader = new JsonTextReader(sr)
                                {
                                    ArrayPool = NewtonsoftPool.Array,
                                    CloseInput = false
                                })
                                {
                                    var serializer = _serializer.Value;
                                    value = serializer.Deserialize<TItem>(jsonReader);
                                }
                            }
                        }
                    }
                    else
                    {
                        value = (TItem)System.ComponentModel.TypeDescriptor
                            .GetConverter(typeof(TItem))
                            .ConvertFromInvariantString(File.ReadAllText(path));
                    }

                    return true;
                }
            }
            catch { }

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

                tempDb.TryAdd(md5key, (extend, IsSerialize, absoluteExpiration.DateTime, value));

                return true;
            }
            catch { }

            return false;
        }
        #endregion
    }
}
