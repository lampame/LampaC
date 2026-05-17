using Newtonsoft.Json;
using System.Globalization;

namespace Shared.Services.Pools.Json;

public static class JsonConvertPool
{
    public static string SerializeObject<T>(T value)
    {
        var sb = StringBuilderPool.Rent();

        try
        {
            using (var sw = new StringWriter(sb, CultureInfo.InvariantCulture))
            {
                using (var jw = new JsonTextWriter(sw)
                {
                    ArrayPool = NewtonsoftPool.Array
                })
                {
                    var serializer = JsonSerializer.CreateDefault();
                    serializer.Serialize(jw, value);
                }

                return sb.ToString();
            }
        }
        finally
        {
            StringBuilderPool.Return(sb);
        }
    }
}
