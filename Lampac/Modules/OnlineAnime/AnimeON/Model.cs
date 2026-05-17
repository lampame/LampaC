namespace AnimeON;

public class CatalogItem
{
    public int Id { get; set; }

    public int Season { get; set; }

    public string ImdbId { get; set; }

    public string Title { get; set; }

    public string Year { get; set; }

    public string Poster { get; set; }
}

public class TranslationOption
{
    public int TranslationId { get; set; }

    public int PlayerId { get; set; }

    public string Title { get; set; }
}

public class EpisodeOption
{
    public int Episode { get; set; }

    public string Title { get; set; }

    public string FileUrl { get; set; }
}

public class SearchResponse
{
    public SearchItem[] result { get; set; }
}

public class SearchItem
{
    public int id { get; set; }

    public int? season { get; set; }

    public string imdbId { get; set; }

    public string titleUa { get; set; }

    public string titleEn { get; set; }

    public string releaseDate { get; set; }

    public Image image { get; set; }
}

public class Image
{
    public string preview { get; set; }
}

public class TranslationsResponse
{
    public TranslationItem[] translations { get; set; }
}

public class TranslationItem
{
    public Translation translation { get; set; }

    public Player[] player { get; set; }
}

public class Translation
{
    public int id { get; set; }

    public string name { get; set; }
}

public class Player
{
    public int id { get; set; }

    public string name { get; set; }
}

public class EpisodesResponse
{
    public Episode[] episodes { get; set; }
}

public class Episode
{
    public int episode { get; set; }

    public string fileUrl { get; set; }
}
