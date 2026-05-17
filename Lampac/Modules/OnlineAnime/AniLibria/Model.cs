using System.Collections.Generic;

namespace AniLibria;

public class Hls
{
    public string fhd { get; set; }

    public string hd { get; set; }

    public string sd { get; set; }
}

public class Names
{
    public string ru { get; set; }

    public string en { get; set; }
}

public class Player
{
    public string host { get; set; }

    public Dictionary<string, Series> playlist { get; set; }
}

public class Poster
{
    public Poster_url small { get; set; }

    public Poster_url medium { get; set; }

    public Poster_url original { get; set; }
}

public class Poster_url
{
    public string url { get; set; }
}

public class RootObject
{
    public Names names { get; set; }

    public string code { get; set; }

    public Season season { get; set; }

    public Player player { get; set; }

    public Poster posters { get; set; }
}

public class Season
{
    public int year { get; set; }
}

public class Series
{
    public int serie { get; set; }

    public Hls hls { get; set; }
}
