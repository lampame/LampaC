namespace Shared.Models.Module;

public class SisiModuleItem
{
    public string name { get; set; }
    public BaseSettings init { get; set; }
    public string plugin { get; set; }
    public int displayindex { get; set; } = -1;
    public BaseSettings myinit { get; set; }

    public SisiModuleItem() { }

    public SisiModuleItem(string name, BaseSettings init, string plugin = null, int displayindex = -1, BaseSettings myinit = null)
    {
        this.name = name;
        this.init = init;
        this.plugin = plugin;
        this.displayindex = displayindex;
        this.myinit = myinit;
    }
}
