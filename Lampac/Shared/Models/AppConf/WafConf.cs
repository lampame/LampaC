using Newtonsoft.Json;

namespace Shared.Models.AppConf
{
    public class WafConf
    {
        public bool enable { get; set; }

        public bool bypassLocalIP { get; set; }

        public bool allowExternalIpAccess { get; set; }

        public bool bruteForceProtection { get; set; }

        public List<string> whiteIps { get; set; }

        public int limit_req { get; set; }

        /// <summary>
        /// uri_pattern: WafLimitMap
        /// </summary>
        [JsonProperty("limit_map", ObjectCreationHandling = ObjectCreationHandling.Replace, NullValueHandling = NullValueHandling.Ignore)]
        public Dictionary<string, WafLimitMap> limit_map { get; set; }

        public List<string> ipsDeny { get; set; }

        public List<string> ipsAllow { get; set; }

        public List<string> countryDeny { get; set; }

        public List<string> countryAllow { get; set; }

        public List<WafAsnRange> asnsDeny { get; set; }

        public List<long> asnDeny { get; set; }

        public List<long> asnAllow { get; set; }

        /// <summary>
        /// header_key: regex
        /// </summary>
        [JsonProperty("headersDeny", ObjectCreationHandling = ObjectCreationHandling.Replace, NullValueHandling = NullValueHandling.Ignore)]
        public Dictionary<string, string> headersDeny { get; set; }
    }


    public class WafLimitMap
    {
        public int limit { get; set; }

        public int second { get; set; }

        public bool pathId { get; set; }

        public string[] queryIds { get; set; }
    }

    public class WafAsnRange
    {
        public long start { get; set; }

        public long end { get; set; }
    }
}
