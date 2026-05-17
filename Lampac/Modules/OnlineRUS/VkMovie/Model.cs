using System.Collections.Generic;

namespace VkMovie;

public class Root
{
    public Response response { get; set; }
}

public class Response
{
    public List<CatalogVideo> catalog_videos { get; set; }
}

public class CatalogVideo
{
    public Video video { get; set; }
}

public class Video
{
    public long id { get; set; }
    public long owner_id { get; set; }
    public string title { get; set; }
    public string description { get; set; }
    public long duration { get; set; }
    public VideoFiles files { get; set; }
    public VideoSubtitle[] subtitles { get; set; }
}

public class VideoFiles
{
    public string mp4_144 { get; set; }
    public string mp4_240 { get; set; }
    public string mp4_360 { get; set; }
    public string mp4_480 { get; set; }
    public string mp4_720 { get; set; }
    public string mp4_1080 { get; set; }
    public string mp4_1440 { get; set; }
    public string mp4_2160 { get; set; }
    public string hls { get; set; }
    public string hls_fmp4 { get; set; }
    public string hls_streams { get; set; }
    public string dash_sep { get; set; }
    public string dash_streams { get; set; }
    public string dash_webm { get; set; }
    public string failover_host { get; set; }
}

public class VideoSubtitle
{
    public string lang { get; set; }
    public string title { get; set; }
    public bool is_auto { get; set; }
    public string url { get; set; }
    public string manifest_name { get; set; }
}
