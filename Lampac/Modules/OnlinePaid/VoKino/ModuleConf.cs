using Shared.Models.Base;
using System;

namespace VoKino;

public class ModuleConf : BaseSettings, ICloneable
{
    public ModuleConf(string plugin, string host)
    {
        this.plugin = plugin;

        if (host != null)
            this.host = host.StartsWith("http") ? host : Decrypt(host);
    }


    public bool onlyBalancerName { get; set; }

    public ViewOnline online { get; set; } = new ViewOnline();


    public ModuleConf Clone()
    {
        return (ModuleConf)MemberwiseClone();
    }

    object ICloneable.Clone()
    {
        return MemberwiseClone();
    }
}
