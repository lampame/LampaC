using System.Collections.Generic;

namespace Dreamerscast;

public class SearchResponse
{
    public List<Release> releases { get; set; }
}

public class Release
{
    public string url { get; set; }
    public string russian { get; set; }
    public string original { get; set; }
    public int dateissue { get; set; }
    public string image { get; set; }
}

public class SearchItem
{
    public string title { get; set; }
    public int year { get; set; }
    public string uri { get; set; }
    public string s { get; set; }
    public string img { get; set; }
}

public class PlayerRoot
{
    public List<PlayerFile> file { get; set; }
}

public class PlayerFile
{
    public string title { get; set; }
    public string file { get; set; }
}

public class Episode
{
    public string name { get; set; }
    public string episode { get; set; }
    public string hls { get; set; }
}
