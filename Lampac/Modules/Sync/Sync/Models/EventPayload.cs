using Newtonsoft.Json.Linq;

namespace Sync;

public class EventPayload
{
    public string Method { get; set; }

    public string Where { get; set; }

    public JObject Card { get; set; }

    public string CardIdRaw { get; set; }

    public string ResolveCardId()
    {
        if (!string.IsNullOrWhiteSpace(CardIdRaw))
            return CardIdRaw.ToLowerAndTrim();

        var token = Card?["id"];
        if (token != null)
        {
            if (token.Type == JTokenType.Integer)
                return token.Value<long>().ToString();

            string _id = token.ToString();
            if (string.IsNullOrWhiteSpace(_id))
                return null;

            return _id.ToLowerAndTrim();
        }

        return null;
    }
}
