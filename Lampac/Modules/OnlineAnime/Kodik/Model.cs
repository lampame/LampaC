using Shared.Models.Templates;
using System.Collections.Generic;

namespace Kodik;

public class EmbedModel
{
    public SimilarTpl stpl { get; set; }

    public List<Result> result { get; set; }
}

public class MaterialData
{
    public string poster_url { get; set; }

    public string drama_poster_url { get; set; }

    public string anime_poster_url { get; set; }
}

public class Result
{
    public string id { get; set; }

    public string title { get; set; }

    public string title_orig { get; set; }

    public string type { get; set; }

    public int? year { get; set; }

    public string link { get; set; }

    public string imdb_id { get; set; }

    public string kinopoisk_id { get; set; }

    public Translation translation { get; set; }

    public int last_season { get; set; }

    public Dictionary<string, Season> seasons { get; set; }


    public MaterialData material_data { get; set; }
}

public class RootObject
{
    public List<Result> results { get; set; }
}

public class Season
{
    public string link { get; set; }

    public Dictionary<string, string> episodes { get; set; }
}

public class StreamModel
{
    public string q { get; set; }

    public string url { get; set; }
}

public class Translation
{
    public string title { get; set; }
}
