using JacRed.Models.AppConf;
using Newtonsoft.Json;
using Shared.Models.AppConf;

namespace JacRed
{
    public class JacRedConf
    {
        public string apikey { get; set; }

        /// <summary>
        /// red
        /// jackett
        /// webapi
        /// </summary>
        public string typesearch { get; set; }

        public string merge { get; set; }

        public bool disableJackett { get; set; }

        public string webApiHost { get; set; }

        public string filter { get; set; }

        public string filter_ignore { get; set; }


        public RedConf Red { get; set; } = new RedConf();

        public JacConf Jackett { get; set; } = new JacConf();


        [JsonProperty("limit_map", ObjectCreationHandling = ObjectCreationHandling.Replace, NullValueHandling = NullValueHandling.Ignore)]
        public List<WafLimitRootMap> limit_map { get; set; }
    }
}
