using System.Runtime.InteropServices;
using System.Text;

namespace Shared.Engine.Utilities
{
    public static class OwnerTo
    {
        public static unsafe void Span(Stream ms, Encoding encoding, Action<ReadOnlySpan<char>> spanAction)
        {
            try
            {
                int charCount = encoding.GetMaxCharCount((int)ms.Length);
                if (charCount <= 0)
                    return;

                char* buffer = (char*)NativeMemory.Alloc((nuint)charCount, (nuint)sizeof(char));

                try
                {
                    using (var reader = new StreamReader(ms, encoding, detectEncodingFromByteOrderMarks: false, leaveOpen: true))
                    {
                        int actual = reader.Read(new Span<char>(buffer, charCount));
                        spanAction(new ReadOnlySpan<char>(buffer, actual));
                    }
                }
                finally
                {
                    NativeMemory.Free(buffer);
                }
            }
            catch { }
        }
    }
}
