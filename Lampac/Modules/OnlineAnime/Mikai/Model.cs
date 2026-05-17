namespace Mikai;

public class SearchResponse
{
    public bool ok { get; set; }

    public int total { get; set; }

    public SearchItem[] result { get; set; }
}

public class SearchItem
{
    public int id { get; set; }

    public int year { get; set; }

    public string slug { get; set; }

    public SearchDetails details { get; set; }

    public SearchMedia media { get; set; }
}

public class SearchDetails
{
    public SearchNames names { get; set; }
}

public class SearchNames
{
    public string name { get; set; }

    public string nameNative { get; set; }

    public string nameEnglish { get; set; }
}

public class SearchMedia
{
    public string posterUid { get; set; }
}

public class AnimeResponse
{
    public bool ok { get; set; }

    public AnimeResult result { get; set; }
}

public class AnimeResult
{
    public string slug { get; set; }

    public AnimeDetails details { get; set; }

    public PlayerItem[] players { get; set; }
}

public class AnimeDetails
{
    public AnimeNames names { get; set; }
}

public class AnimeNames
{
    public string name { get; set; }

    public string nameNative { get; set; }

    public string nameEnglish { get; set; }
}

public class PlayerItem
{
    public PlayerTeam team { get; set; }

    public ProviderItem[] providers { get; set; }
}

public class PlayerTeam
{
    public string name { get; set; }
}

public class ProviderItem
{
    public string name { get; set; }

    public ProviderEpisode[] episodes { get; set; }
}

public class ProviderEpisode
{
    public int number { get; set; }

    public string playLink { get; set; }
}
