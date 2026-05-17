using System.Collections.Concurrent;

namespace Shared.Services;

public static class FileCache
{
    record DbModel(DateTime lockTime, string value);
    static ConcurrentDictionary<string, DbModel> db = new();

    public static string ReadAllText(string path)
        => ReadAllText(path, null, true);

    public static string ReadAllText(string path, string mypath)
        => ReadAllText(path, mypath, true);

    public static string ReadAllText(string path, string mypath, bool saveCache)
    {
        var secondCache = DateTime.Now.AddMinutes(10);

        try
        {
            string key = $"{path}:{mypath}";

            if (db.TryGetValue(key, out DbModel cache))
            {
                if (cache.lockTime > DateTime.Now)
                    return cache.value;
            }

            if (!string.IsNullOrEmpty(mypath) && File.Exists($"plugins/override/{mypath}"))
            {
                path = $"plugins/override/{mypath}";
            }
            else if (!File.Exists(path))
            {
                db.TryAdd(path, new(DateTime.Now.AddMinutes(1), string.Empty));
                return string.Empty;
            }

            string value = File.ReadAllText(path);

            if (saveCache)
                return db.GetOrAdd(key, _ => new(secondCache, value)).value;

            return value;
        }
        catch
        {
            return string.Empty;
        }
    }
}
