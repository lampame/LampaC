using System.Collections.Generic;

namespace Xvideos;

public class PornstarsRoot
{
    public List<Related> videos { get; set; }
}

public class Related
{
    public string tf { get; set; }

    public string d { get; set; }

    public string u { get; set; }

    public string i { get; set; }

    public string ipu { get; set; }

    public object pn { get; set; }

    public object p { get; set; }

    public bool? ch { get; set; }
}
