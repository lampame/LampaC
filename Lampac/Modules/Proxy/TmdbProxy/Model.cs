using System.Text.Json.Nodes;

namespace TmdbProxy;

public class CacheModel
{
    public CacheModel() { }

    public CacheModel(JsonObject json, int statusCode)
    {
        this.json = json;
        this.statusCode = statusCode;
    }

    public JsonObject json { get; set; }

    public int statusCode { get; set; }
}
