using Newtonsoft.Json;
using Shared.Models.AppConf;

namespace Shared.Models.Module;

public class ModuleBaseConf
{
    [JsonProperty("limit_map", ObjectCreationHandling = ObjectCreationHandling.Replace, NullValueHandling = NullValueHandling.Ignore)]
    public List<WafLimitRootMap> limit_map { get; set; }
}
