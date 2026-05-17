using Shared.Models.Templates;

namespace Kinobase;

public class EmbedModel
{
    public bool IsEmpty { get; set; }
    public string errormsg { get; set; }


    public string content { get; set; }

    public Season[] serial { get; set; }

    public string quality { get; set; }
}

public class Playlist
{
    public int id { get; set; }
    public string file { get; set; }
    public string comment { get; set; }
    public string title { get; set; }
    public string subtitle { get; set; }
}

public class SearchModel
{
    public string link { get; set; }

    public SimilarTpl similar { get; set; }
}

public class Season
{
    public long id { get; set; }

    public string file { get; set; }

    public string title { get; set; }

    public string comment { get; set; }

    public string subtitle { get; set; }

    public Season[] folder { get; set; }
}
