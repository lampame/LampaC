using System.Collections.Generic;

namespace UaKino;

public class EmbedModel
{
    public bool IsEmpty { get; set; }

    public List<Similar> similars { get; set; }
}

public class Similar
{
    public string title { get; set; }

    public string href { get; set; }

    public string img { get; set; }
}
