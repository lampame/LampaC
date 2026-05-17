using Newtonsoft.Json;

namespace Shared.Models.AppConf;

public class BaseModule
{
    public bool nws { get; set; }

    public bool ValidateRequest { get; set; }

    public bool ValidateIdentity { get; set; }

    public bool NotCheckLocalIp { get; set; }

    public bool BlockedBots { get; set; }

    public string[] LoadModules { get; set; }

    public string[] SkipModules { get; set; } = Array.Empty<string>();

    public BaseModuleMiddlewares Middlewares { get; set; }
}


public class BaseModuleMiddlewares
{
    public bool proxy { get; set; }

    public bool proxyimg { get; set; }

    public bool anonymousRequest { get; set; }

    #region staticFiles
    public bool staticFiles { get; set; }

    public bool unknownStaticFiles { get; set; }


    [JsonProperty("staticFilesMappings", ObjectCreationHandling = ObjectCreationHandling.Replace, NullValueHandling = NullValueHandling.Ignore)]
    public Dictionary<string, string> staticFilesMappings = new Dictionary<string, string>();
    #endregion
}
