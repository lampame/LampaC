namespace LampaWeb;

public class LampaPlugin
{
    public LampaPlugin() { }

    public LampaPlugin(string url, int status, string name, string author)
    {
        this.url = url;
        this.status = status;
        this.name = name;
        this.author = author;
    }

    public string url { get; set; }

    public int status { get; set; }

    public string name { get; set; }

    public string author { get; set; }
}
