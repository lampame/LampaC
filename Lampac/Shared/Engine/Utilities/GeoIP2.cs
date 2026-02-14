using MaxMind.GeoIP2;

namespace Shared.Engine
{
    public class GeoIP2
    {
        static DatabaseReader cityReader = null, asnReader = null;

        static GeoIP2()
        {
            if (File.Exists("data/GeoLite2-Country.mmdb"))
                cityReader = new DatabaseReader("data/GeoLite2-Country.mmdb");

            if (File.Exists("data/GeoLite2-ASN.mmdb"))
                asnReader = new DatabaseReader("data/GeoLite2-ASN.mmdb");
        }

        /// <param name="IP">IP пользователя</param>
        /// <returns>Страна UA,RU,BY,KZ</returns>
        public static string Country(string IP)
        {
            if (string.IsNullOrEmpty(IP) || cityReader == null)
                return null;

            try
            {
                return cityReader.Country(IP).Country.IsoCode.ToUpper();
            }
            catch { return null; }
        }

        /// <param name="IP">IP пользователя</param>
        /// <returns>ASN (например: 13335)</returns>
        public static long ASN(string IP)
        {
            if (string.IsNullOrEmpty(IP) || asnReader == null)
                return -1;

            try
            {
                return asnReader.Asn(IP).AutonomousSystemNumber ?? -1;
            }
            catch
            {
                return -1;
            }
        }
    }
}
