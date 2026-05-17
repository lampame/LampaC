using MaxMind.Db;
using MaxMind.GeoIP2;

namespace Shared.Services.Utilities;

public class GeoIP2
{
    static readonly Lazy<DatabaseReader> cityReader = new Lazy<DatabaseReader>(() =>
    {
        var mode = CoreInit.conf.lowMemoryMode
            ? FileAccessMode.MemoryMapped
            : FileAccessMode.Memory;

        if (File.Exists("data/GeoLite2-Country.mmdb"))
            return new DatabaseReader("data/GeoLite2-Country.mmdb", mode);

        return null;
    });

    static readonly Lazy<DatabaseReader> asnReader = new Lazy<DatabaseReader>(() =>
    {
        var mode = CoreInit.conf.lowMemoryMode
            ? FileAccessMode.MemoryMapped
            : FileAccessMode.Memory;

        if (File.Exists("data/GeoLite2-ASN.mmdb"))
            return new DatabaseReader("data/GeoLite2-ASN.mmdb", mode);

        return null;
    });

    /// <param name="IP">IP пользователя</param>
    /// <returns>Страна UA,RU,BY,KZ</returns>
    public static string Country(string IP)
    {
        if (string.IsNullOrWhiteSpace(IP))
            return null;

        if (IPNetwork.IsLocalIp(IP, forced: true))
            return null;

        try
        {
            var reader = cityReader.Value;

            if (reader == null)
                return null;

            string code = reader.Country(IP).Country.IsoCode;
            if (string.IsNullOrEmpty(code))
                return null;

            return code.ToUpper();
        }
        catch
        {
            return null;
        }
    }

    /// <param name="IP">IP пользователя</param>
    /// <returns>ASN (например: 13335)</returns>
    public static long ASN(string IP)
    {
        if (string.IsNullOrWhiteSpace(IP))
            return -1;

        if (IPNetwork.IsLocalIp(IP, forced: true))
            return -1;

        try
        {
            var reader = asnReader.Value;

            if (reader == null)
                return -1;

            return reader.Asn(IP).AutonomousSystemNumber ?? -1;
        }
        catch
        {
            return -1;
        }
    }
}
