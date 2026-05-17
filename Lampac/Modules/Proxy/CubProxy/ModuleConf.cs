using Newtonsoft.Json;
using Shared.Models.AppConf;
using Shared.Models.Base;
using System.Collections.Generic;

namespace CubProxy;

public class ModuleConf : CubConf, Iproxy
{
    public bool viewru { get; set; }


    public int cache_api { get; set; }

    public int cache_img { get; set; }

    public bool responseContentLength { get; set; }


    public bool useproxy { get; set; }

    public bool useproxystream { get; set; }

    public string globalnameproxy { get; set; }

    public ProxySettings proxy { get; set; }


    [JsonProperty("limit_map", ObjectCreationHandling = ObjectCreationHandling.Replace, NullValueHandling = NullValueHandling.Ignore)]
    public List<WafLimitRootMap> limit_map { get; set; }
}
