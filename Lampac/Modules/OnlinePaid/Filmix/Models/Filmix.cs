using Newtonsoft.Json.Linq;

namespace Filmix.Models;

public class Movie
{
    public string link { get; set; }

    public string translation { get; set; }

    public int[] qualities { get; set; }
}

public class PlayerLinks
{
    public Movie[] movie { get; set; }

    /// <summary>
    /// сезон, (озвучка, (серия, item))
    /// </summary>
    public Dictionary<string, Dictionary<string, JToken>> playlist { get; set; }
}

public class RootObject
{
    public PlayerLinks player_links { get; set; }

    public string quality { get; set; }
}

public class SearchModel
{
    public int id { get; set; }

    public string title { get; set; }

    public string original_title { get; set; }

    /// <summary>
    /// api.filmix.tv
    /// </summary>
    public string original_name { get; set; }

    public string poster { get; set; }

    public int year { get; set; }
}

public class SearchResult
{
    public int id { get; set; }

    public SimilarTpl similars { get; set; }
}
