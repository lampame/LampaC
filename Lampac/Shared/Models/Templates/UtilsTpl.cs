using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization.Metadata;

namespace Shared.Models.Templates;

public static class UtilsTpl
{
    #region HtmlEncode
    public static void HtmlEncode(ReadOnlySpan<char> value, StringBuilder sb)
    {
        foreach (var c in value)
        {
            switch (c)
            {
                case '<': sb.Append("&lt;"); break;
                case '>': sb.Append("&gt;"); break;
                case '&': sb.Append("&amp;"); break;
                case '"': sb.Append("&quot;"); break;
                case '\'': sb.Append("&#39;"); break;
                default: sb.Append(c); break;
            }
        }
    }
    #endregion

    #region WriteJson
    static readonly JsonWriterOptions _jsonWriterOptions = new JsonWriterOptions
    {
        Indented = false,
        SkipValidation = true
    };

    public static void WriteJson<T>(StringBuilder sb, BufferWriterPool<byte> utf8Buf, T value, JsonTypeInfo<T> options)
    {
        utf8Buf.SetLength(0);

        using (var writer = new Utf8JsonWriter(utf8Buf, _jsonWriterOptions))
            JsonSerializer.Serialize(writer, value, options);

        ReadOnlySpan<byte> utf8 = utf8Buf.WrittenSpan;
        if (utf8.IsEmpty)
            return;

        int charCount = Encoding.UTF8.GetMaxCharCount(utf8.Length);
        if (charCount > BufferCharPool.sizeMedium)
            charCount = Encoding.UTF8.GetCharCount(utf8);

        using (var charBuf = new BufferCharPool(charCount))
        {
            int charsWritten = Encoding.UTF8.GetChars(utf8, charBuf.Span);
            if (charsWritten > 0)
                sb.Append(charBuf.Span.Slice(0, charsWritten));
        }
    }
    #endregion
}
