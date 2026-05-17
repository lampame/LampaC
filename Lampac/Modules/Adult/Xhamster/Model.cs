using System.Collections.Generic;

namespace Xhamster;

public class Root
{
    public LayoutPage layoutPage { get; set; }

    public VideoListProps searchResult { get; set; }

    public LayoutPage pagesCategoryComponent { get; set; }
}

public class LayoutPage
{
    public VideoListProps videoListProps { get; set; }

    public VideoListProps trendingVideoListProps { get; set; }
}

public class VideoListProps
{
    public List<VideoThumbProps> videoThumbProps { get; set; }
}

public class VideoThumbProps
{
    public int duration { get; set; }

    public string title { get; set; }

    public string pageURL { get; set; }

    public string thumbURL { get; set; }

    public string trailerURL { get; set; }

    public string trailerFallbackUrl { get; set; }

    public bool isUHD { get; set; }
}
