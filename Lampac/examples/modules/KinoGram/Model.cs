using System.Collections.Generic;

namespace KinoGram;

public class Result
{
    public List<Movie> movie { get; set; }

    /// <summary>
    /// сезон, (перевод, серии)
    /// </summary>
    public Dictionary<string, List<Voice>> serial { get; set; }
}

public class Movie
{
    public string translation { get; set; }

    public List<(string link, string quality)> links { get; set; }
}

public class Serial
{
    public string id { get; set; }

    public List<(string link, string quality)> links { get; set; }
}

public class Voice
{
    public string id { get; set; }

    public string name { get; set; }

    public List<Serial> episodes { get; set; }
}
