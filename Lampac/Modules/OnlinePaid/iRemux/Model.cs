using System.Collections.Generic;

namespace iRemux;

public class EmbedModel
{
    public bool IsEmpty { get; set; }

    public List<PlayLinks> links { get; set; } = new List<PlayLinks>(4);

    public List<Similar> similars { get; set; } = new List<Similar>(15);
}


public class PlayLinks
{
    public string quality { get; set; }

    public string linkid { get; set; }
}

public class Similar
{
    public string title { get; set; }

    public string year { get; set; }

    public string href { get; set; }
}
