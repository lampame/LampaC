using System.Collections.Generic;

namespace Kinotochka;

public class EmbedModel
{
    public bool IsEmpty { get; set; }

    public string content { get; set; }
}

public class RootEpisode
{
    public List<Episode> playlist { get; set; }
}

public class Episode
{
    public Episode() { }

    public Episode(string comment, string file)
    {
        this.comment = comment;
        this.file = file;
    }

    public string comment { get; set; }

    public string file { get; set; }
}

public class Season
{
    public string url { get; set; }

    public string name { get; set; }

    public string season { get; set; }
}
