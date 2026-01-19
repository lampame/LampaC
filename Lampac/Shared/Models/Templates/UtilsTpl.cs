using System.Runtime.InteropServices;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization.Metadata;

namespace Shared.Models.Templates
{
    public static unsafe class UtilsTpl
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
        static readonly MemoryStream _msJson = new MemoryStream(PoolInvk.rentMax);

        public static void WriteJson<T>(StringBuilder sb, in T value, JsonTypeInfo<T> options)
        {
            _msJson.SetLength(0);
            _msJson.Position = 0;

            using (var writer = new Utf8JsonWriter(_msJson, new JsonWriterOptions
            {
                Indented = false,
                SkipValidation = true
            }))
            {
                JsonSerializer.Serialize(writer, value, options);
            }

            if (_msJson.TryGetBuffer(out ArraySegment<byte> buffer))
            {
                ReadOnlySpan<byte> utf8 = buffer.AsSpan(0, (int)_msJson.Length);

                int neededChars = Encoding.UTF8.GetCharCount(utf8);

                nint rentedJsonPtr = (nint)NativeMemory.Alloc((nuint)neededChars, (nuint)sizeof(char));

                try
                {
                    Span<char> rentedChars = new Span<char>((void*)rentedJsonPtr, neededChars);
                    int charsWritten = Encoding.UTF8.GetChars(utf8, rentedChars);
                    if (charsWritten > 0)
                        sb.Append(rentedChars.Slice(0, charsWritten));
                }
                finally
                {
                    NativeMemory.Free((void*)rentedJsonPtr);
                }
            }
        }
        #endregion
    }
}
