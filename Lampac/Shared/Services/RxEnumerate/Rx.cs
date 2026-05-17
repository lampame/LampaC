using System.Text.RegularExpressions;

namespace Shared.Services.RxEnumerate;

public static class Rx
{
    public static RxSplit Split(string pattern, ReadOnlySpan<char> html, int skip = 0, RegexOptions options = RegexOptions.CultureInvariant)
        => new RxSplit(pattern, html, skip, options);

    public static RxSplit Split(string pattern, string html, int skip = 0, RegexOptions options = RegexOptions.CultureInvariant)
        => new RxSplit(pattern, html.AsSpan(), skip, options);

    public static RxMatch Matches(string pattern, ReadOnlySpan<char> html, int skip = 0, RegexOptions options = RegexOptions.CultureInvariant)
        => new RxMatch(pattern, html, skip, options);

    public static RxMatch Matches(string pattern, string html, int skip = 0, RegexOptions options = RegexOptions.CultureInvariant)
        => new RxMatch(pattern, html.AsSpan(), skip, options);

    public static string Match(ReadOnlySpan<char> html, string pattern, int index = 1, RegexOptions options = RegexOptions.CultureInvariant)
    {
        if (html.IsEmpty)
            return null;

        var m = new RxMatch(pattern, html, 0, options);
        if (m.Count == 0)
            return null;

        return m[0].Match(pattern, index, false, options);
    }

    public static GroupCollection Groups(ReadOnlySpan<char> html, string pattern, RegexOptions options = RegexOptions.CultureInvariant)
    {
        if (html.IsEmpty)
            return null;

        var m = new RxMatch(pattern, html, 0, options);
        if (m.Count == 0)
            return null;

        return m[0].Groups(pattern, options);
    }

    public static ReadOnlySpan<char> Slice(ReadOnlySpan<char> html, string markerStart, string markerEnd)
    {
        if (html.IsEmpty)
            return ReadOnlySpan<char>.Empty;

        int start = html.IndexOf(markerStart);
        if (start < 0)
            return ReadOnlySpan<char>.Empty;

        start += markerStart.Length;
        ReadOnlySpan<char> tail = html.Slice(start);

        int scriptEnd = tail.IndexOf(markerEnd);
        int length = scriptEnd;
        if (length < 0)
            return ReadOnlySpan<char>.Empty;

        return tail.Slice(0, length);
    }
}
