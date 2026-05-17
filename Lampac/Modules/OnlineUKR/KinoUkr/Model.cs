using System.Collections.Generic;

namespace KinoUkr;

public class DbModel
{
    public string name { get; set; }

    public string eng_name { get; set; }

    public string year { get; set; }


    public string kp_id { get; set; }

    public string imdb_id { get; set; }


    public string ashdi { get; set; }

    public string tortuga { get; set; }
}

public class EmbedModel
{
    public bool IsEmpty { get; set; }

    public List<Similar> similars { get; set; }
}

public class Similar
{
    public string title { get; set; }

    public string year { get; set; }

    public string href { get; set; }
}
