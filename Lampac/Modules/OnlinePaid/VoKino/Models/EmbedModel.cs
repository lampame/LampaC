using System.Collections.Generic;

namespace VoKino;

public class Details
{
    public string id { get; set; }
}

public class EmbedModel
{
    public bool IsEmpty { get; set; }

    public Сhannel[] menu { get; set; }

    public Сhannel[] channels { get; set; }

    public List<Similar> similars { get; set; }
}

public class RootObject
{
    public Сhannel[] menu { get; set; }

    public Сhannel[] channels { get; set; }
}

public class Similar
{
    public string title { get; set; }

    public string balancer { get; set; }
}

public class Сhannel
{
    public string title { get; set; }

    public string ident { get; set; }

    public string playlist_url { get; set; }

    public bool selected { get; set; }

    public Сhannel[] submenu { get; set; }


    public string stream_url { get; set; }

    public string quality_full { get; set; }

    public Dictionary<string, string> extra { get; set; }

    public Details details { get; set; }
}
