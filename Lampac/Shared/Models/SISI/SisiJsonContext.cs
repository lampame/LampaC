using Shared.Models.SISI.Base;
using Shared.Models.SISI.OnResult;
using System.Text.Json.Serialization;

namespace Shared.Models.SISI;

[JsonSourceGenerationOptions(
    PropertyNamingPolicy = JsonKnownNamingPolicy.CamelCase,
    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
)]
[JsonSerializable(typeof(MenuItem))]
[JsonSerializable(typeof(PlaylistAndPage))]
[JsonSerializable(typeof(List<PlaylistItem>))]
[JsonSerializable(typeof(StreamItem))]
[JsonSerializable(typeof(Dictionary<string, string>))]
public partial class SisiJsonContext : JsonSerializerContext
{

}
