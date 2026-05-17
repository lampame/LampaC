using Shared.Models.Base;
using Shared.Models.Module;

namespace TmdbProxy;

public class ModuleConf : ModuleBaseConf
{
    public int httpversion { get; set; }

    public int cache_api { get; set; }

    public int cache_img { get; set; }

    public bool responseContentLength { get; set; }


    public TmdbProxyApiConf proxyapi { get; set; }

    public TmdbProxyApiConf proxyimg { get; set; }
}


public class TmdbProxyApiConf : Iproxy
{
    public bool useproxy { get; set; }

    public bool useproxystream { get; set; }

    public string globalnameproxy { get; set; }

    public ProxySettings proxy { get; set; }
}

public class TmdbProxyImageConf : Iproxy
{
    public bool useproxy { get; set; }

    public bool useproxystream { get; set; }

    public string globalnameproxy { get; set; }

    public ProxySettings proxy { get; set; }
}
