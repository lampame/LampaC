using System.Collections.Generic;

namespace Rezka;

public class EmbedModel
{
    public bool IsEmpty { get; set; }

    public string content { get; set; }

    public string trs { get; set; }

    public string id { get; set; }

    public List<SimilarModel> similar { get; set; }
}

public class Episodes
{
    public string episodes { get; set; }

    public string seasons { get; set; }
}

public class MovieModel
{
    /// <summary>
    /// Rezka
    /// </summary>
    public List<ApiModel> links { get; set; }

    /// <summary>
    /// Voidboos
    /// </summary>
    public string url { get; set; }

    public string subtitlehtml { get; set; }
}

public class SearchModel
{
    public bool IsError { get; set; }

    public bool IsEmpty { get; set; }

    public string content { get; set; }

    public string href { get; set; }

    public string search_uri { get; set; }

    public List<SimilarModel> similar { get; set; }
}

public class SimilarModel
{
    public SimilarModel() { }

    public SimilarModel(string title, string year, string href, string img)
    {
        this.title = title;
        this.year = year;
        this.href = href;
        this.img = img;
    }

    public string title { get; set; }

    public string year { get; set; }

    public string href { get; set; }

    public string img { get; set; }
}

public class ApiModel
{
    public string title { get; set; }

    public string stream_url { get; set; }
}

public class ApiModelStream
{
    public string link { get; set; }

    public string quality { get; set; }
}
