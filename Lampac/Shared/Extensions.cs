using Shared.Models;

public static class Extensions
{
    public static Dictionary<string, string> ToDictionary(this IEnumerable<HeadersModel> headers)
    {
        if (headers == null)
            return null;

        var result = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        foreach (var h in headers)
            result.TryAdd(h.name, h.val);

        return result;
    }

    public static string ToLowerAndTrim(this string input)
    {
        if (string.IsNullOrEmpty(input))
            return input;

        ReadOnlySpan<char> span = input.AsSpan().Trim();

        return string.Create(span.Length, span, (dest, src) =>
        {
            for (int i = 0; i < src.Length; i++)
            {
                dest[i] = char.ToLowerInvariant(src[i]);
            }
        });
    }
}