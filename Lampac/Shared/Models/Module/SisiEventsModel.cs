using Newtonsoft.Json.Linq;

namespace Shared.Models.Module;

public class SisiEventsModel
{
    public SisiEventsModel(string rchtype, string account_email, string uid, string token, bool lgbt, JObject kitconf)
    {
        this.rchtype = rchtype;
        this.account_email = account_email;
        this.uid = uid;
        this.token = token;
        this.lgbt = lgbt;
        this.kitconf = kitconf;
    }

    public string rchtype { get; set; }

    public string account_email { get; set; }

    public string uid { get; set; }

    public string token { get; set; }

    public bool lgbt { get; set; }

    public JObject kitconf { get; set; }
}
