using Shared.Models.Base;
using System;

namespace Kodik;

public class ModuleConf : BaseSettings, ICloneable
{
    public ModuleConf(string plugin, string token, bool localip, bool enable = true, bool hls = true, bool streamproxy = false)
    {
        this.plugin = plugin;
        this.localip = localip;
        this.enable = enable;
        this.hls = hls;
        this.streamproxy = streamproxy;

        this.token = token.Contains(":") ? Decrypt(token)! : token;
    }

    public bool auto_proxy { get; set; }

    public bool cdn_is_working { get; set; }

    public string secret_token { get; set; }

    public string linkhost { get; set; }

    public string playerhost { get; set; }

    public bool localip { get; set; }

    public ModuleConf Clone()
    {
        return (ModuleConf)MemberwiseClone();
    }

    object ICloneable.Clone()
    {
        return MemberwiseClone();
    }
}
