using System.Collections.Generic;

namespace FanCDN;

public class EmbedModel
{
    public Episode[] movies { get; set; }

    public Voice[] serial { get; set; }
}

public class Episode
{
    public string title { get; set; }

    public string file { get; set; }

    public string subtitles { get; set; }


    public Dictionary<string, Episode> folder { get; set; }
}

public class Voice
{
    public int id { get; set; }

    public string title { get; set; }

    public Dictionary<string, Episode> folder { get; set; }

    public int seasons { get; set; }
}
