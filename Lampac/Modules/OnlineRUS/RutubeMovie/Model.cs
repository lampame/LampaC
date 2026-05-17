using System.Collections.Generic;

namespace RutubeMovie;

public class RootSearch
{
    public List<Result> results { get; set; }
}

public class Result
{
    public string id { get; set; }

    public string title { get; set; }

    public long duration { get; set; }

    public Сategory category { get; set; }

    public bool is_hidden { get; set; }
    public bool is_deleted { get; set; }
    public bool is_adult { get; set; }
    public bool is_locked { get; set; }
    public bool is_audio { get; set; }
    public bool is_paid { get; set; }
    public bool is_livestream { get; set; }
}

public class Сategory
{
    public int id { get; set; }
}

public class RootPlayOptions
{
    public VideoBalancer video_balancer { get; set; }
}

public class VideoBalancer
{
    public string m3u8 { get; set; }
}
