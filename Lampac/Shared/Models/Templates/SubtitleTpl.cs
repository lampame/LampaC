using System.Text.Json;
using System.Text.Json.Serialization;

namespace Shared.Models.Templates;

public class SubtitleTpl
{
    public List<SubtitleDto> data { get; set; }

    public SubtitleTpl(int capacity = 10)
    {
        data = new List<SubtitleDto>(capacity);
    }

    public bool IsEmpty => data == null || data.Count == 0;

    public void Append(string label, string url)
    {
        if (!string.IsNullOrEmpty(label) && !string.IsNullOrEmpty(url))
            data.Add(new SubtitleDto(url, label));
    }

    public string ToJson() => JsonSerializer.Serialize(ToObject(), SubtitleJsonContext.Default.IReadOnlyListSubtitleDto);

    public IReadOnlyList<SubtitleDto> ToObject(bool emptyToNull = false)
    {
        if (IsEmpty)
            return emptyToNull ? null : Array.Empty<SubtitleDto>();

        return data;
    }
}


[JsonSourceGenerationOptions(
    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingDefault
)]
[JsonSerializable(typeof(SubtitleDto))]
[JsonSerializable(typeof(IReadOnlyList<SubtitleDto>))]
public partial class SubtitleJsonContext : JsonSerializerContext
{
}

public record SubtitleDto
{
    public string method { get; }
    public string url { get; }
    public string label { get; }

    [JsonConstructor]
    public SubtitleDto(string url, string label)
    {
        method = "link";
        this.url = url;
        this.label = label;
    }
}
