namespace Shared.Models.Module;

public record ModuleOnlineItem(BaseSettings init, string plugin = null, string name = null, string arg_title = null, string arg_url = null, string myurl = null);

public record ModuleOnlineSpiderItem(BaseSettings init, string plugin = null);
