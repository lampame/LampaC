using Shared.Models.Base;

namespace Kinobase;

public class ModuleConf : BaseSettings
{
    public ModuleConf(string plugin, string host, bool playerjs, bool hdr)
    {
        enable = true;
        this.plugin = plugin;

        if (host != null)
            this.host = host.StartsWith("http") ? host : Decrypt(host);

        this.playerjs = playerjs;
        this.hdr = hdr;
    }


    public bool playerjs { get; set; }

    public bool hdr { get; set; }
}
