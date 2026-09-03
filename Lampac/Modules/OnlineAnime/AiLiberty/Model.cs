using System.Collections.Generic;

namespace AiLiberty;

public class PlayerJsItem
{
    public string title { get; set; }
    public string file { get; set; }
}

public class ReleaseData
{
    public List<PlayerJsItem> items { get; set; }
    public int season { get; set; }
}
