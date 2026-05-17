using Shared.Models.Base;
using System;

namespace KinoPub;

public class ModuleConf : BaseSettings, ICloneable
{
    public ModuleConf(string plugin, string host = null)
    {
        this.plugin = plugin;

        if (host != null)
            this.host = host.StartsWith("http") ? host : Decrypt(host);
    }

    public string[] tokens { get; set; }

    public string filetype { get; set; }


    public ModuleConf Clone()
    {
        return (ModuleConf)MemberwiseClone();
    }

    object ICloneable.Clone()
    {
        return MemberwiseClone();
    }
}
