namespace SISI;

public class ModuleConf : SisiConf
{
    public bool spider { get; set; }

    public bool lgbt { get; set; }

    public BookmarksConf bookmarks { get; set; }

    public HistoryConf history { get; set; }


    public string component { get; set; }

    public string vipcontent { get; set; }

    public string iconame { get; set; }


    public bool push_all { get; set; }

    public bool forced_checkRchtype { get; set; }


    public Dictionary<string, string> appReplace { get; set; }
}
