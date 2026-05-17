namespace Shared.Services.HTML;

public enum HtmlSpanTargetType
{
    Exact = 0,
    Contains = 1
}

public static class HtmlSpan
{
    public static ReadOnlySpan<char> Node(
        ReadOnlySpan<char> html,
        string element,
        string attribute,
        string target,
        HtmlSpanTargetType targetType)
    {
        if (html.IsEmpty)
            return ReadOnlySpan<char>.Empty;

        foreach (var span in Nodes(html, element, attribute, target, targetType))
            return span;

        return ReadOnlySpan<char>.Empty;
    }

    public static NodesEnumerable Nodes(
        ReadOnlySpan<char> html,
        string element,
        string attribute,
        string target,
        HtmlSpanTargetType targetType)
        => new NodesEnumerable(html, element, attribute, target, targetType);

    public readonly ref struct NodesEnumerable
    {
        private readonly ReadOnlySpan<char> _html;
        private readonly string _element;
        private readonly string _attribute;
        private readonly string _target;
        private readonly HtmlSpanTargetType _targetType;

        public NodesEnumerable(ReadOnlySpan<char> html, string element, string attribute, string target, HtmlSpanTargetType targetType)
        {
            _html = html;
            _element = element;
            _attribute = attribute;
            _target = target;
            _targetType = targetType;
        }

        public Enumerator GetEnumerator() => new Enumerator(_html, _element, _attribute, _target, _targetType);
    }

    public ref struct Enumerator
    {
        private readonly ReadOnlySpan<char> _html;
        private readonly string _element;
        private readonly string _attribute;
        private readonly string _target;
        private readonly HtmlSpanTargetType _targetType;
        private readonly bool _anyElement;

        private int _scanIndex;
        private bool _inCapture;
        private int _captureStartIndex;
        private int _depth;
        private string _captureTagName;

        private ReadOnlySpan<char> _current;

        public ReadOnlySpan<char> Current => _current;

        public Enumerator(ReadOnlySpan<char> html, string element, string attribute, string target, HtmlSpanTargetType targetType)
        {
            _html = html;
            _element = element;
            _attribute = attribute;
            _target = target;
            _targetType = targetType;
            _anyElement = element.Length == 1 && element[0] == '*';

            _scanIndex = 0;
            _inCapture = false;
            _captureStartIndex = -1;
            _depth = 0;
            _captureTagName = null;
            _current = ReadOnlySpan<char>.Empty;
        }

        public bool MoveNext()
        {
            _current = ReadOnlySpan<char>.Empty;
            if (_html.IsEmpty)
                return false;

            while (TryReadTag(_html, ref _scanIndex, out var tag))
            {
                if (!_inCapture)
                {
                    if (tag.IsEndTag)
                        continue;

                    if (!_anyElement && !EqualsOrdinalIgnoreCase(tag.Name, _element))
                        continue;

                    if (!TagHasAttributeMatch(_html.Slice(tag.Start, tag.End - tag.Start), _attribute, _target, _targetType))
                        continue;

                    _inCapture = true;
                    _captureStartIndex = tag.Start;
                    _captureTagName = tag.Name;

                    if (tag.IsEmptyElement)
                    {
                        _inCapture = false;
                        _captureTagName = null;
                        _depth = 0;

                        _current = _html.Slice(_captureStartIndex, tag.End - _captureStartIndex);
                        return true;
                    }

                    _depth = 1;
                    continue;
                }

                if (_captureTagName is null)
                    return false;

                if (!EqualsOrdinalIgnoreCase(tag.Name, _captureTagName))
                    continue;

                if (tag.IsEndTag)
                {
                    _depth--;
                    if (_depth == 0)
                    {
                        int start = _captureStartIndex;
                        int len = tag.End - start;

                        _inCapture = false;
                        _captureStartIndex = -1;
                        _captureTagName = null;
                        _depth = 0;

                        _current = _html.Slice(start, len);
                        return true;
                    }
                }
                else if (!tag.IsEmptyElement)
                {
                    _depth++;
                }
            }

            return false;
        }
    }

    private readonly struct ParsedTag
    {
        public ParsedTag(int start, int end, string name, bool isEndTag, bool isEmptyElement)
        {
            Start = start;
            End = end;
            Name = name;
            IsEndTag = isEndTag;
            IsEmptyElement = isEmptyElement;
        }

        public int Start { get; }
        public int End { get; }
        public string Name { get; }
        public bool IsEndTag { get; }
        public bool IsEmptyElement { get; }
    }

    private static bool TryReadTag(ReadOnlySpan<char> html, ref int scanIndex, out ParsedTag tag)
    {
        int len = html.Length;
        while (scanIndex < len)
        {
            int lt = html.Slice(scanIndex).IndexOf('<');
            if (lt < 0)
                break;

            int start = scanIndex + lt;
            int i = start + 1;
            if (i >= len)
                break;

            if (html[i] == '!' || html[i] == '?')
            {
                scanIndex = start + 1;
                continue;
            }

            bool isEndTag = false;
            if (html[i] == '/')
            {
                isEndTag = true;
                i++;
                if (i >= len)
                    break;
            }

            int nameStart = i;
            while (i < len && IsTagNameChar(html[i]))
                i++;

            if (i == nameStart)
            {
                scanIndex = start + 1;
                continue;
            }

            string tagName = html.Slice(nameStart, i - nameStart).ToString();

            char quote = '\0';
            bool isEmptyElement = false;

            while (i < len)
            {
                char ch = html[i];
                if (quote == '\0')
                {
                    if (ch == '"' || ch == '\'')
                    {
                        quote = ch;
                    }
                    else if (ch == '>')
                    {
                        if (i > start && html[i - 1] == '/')
                            isEmptyElement = true;

                        tag = new ParsedTag(start, i + 1, tagName, isEndTag, isEmptyElement);
                        scanIndex = i + 1;
                        return true;
                    }
                }
                else if (ch == quote)
                {
                    quote = '\0';
                }

                i++;
            }

            break;
        }

        tag = default;
        return false;
    }

    private static bool IsTagNameChar(char c)
        => char.IsLetterOrDigit(c) || c == '-' || c == ':' || c == '_';

    private static bool TagHasAttributeMatch(ReadOnlySpan<char> tagSource, string attribute, string target, HtmlSpanTargetType targetType)
    {
        if (string.IsNullOrEmpty(attribute))
            return false;

        int i = 0;
        while (i < tagSource.Length)
        {
            while (i < tagSource.Length && !char.IsWhiteSpace(tagSource[i]))
                i++;

            while (i < tagSource.Length && char.IsWhiteSpace(tagSource[i]))
                i++;

            if (i >= tagSource.Length || tagSource[i] == '>' || tagSource[i] == '/')
                break;

            int nameStart = i;
            while (i < tagSource.Length && IsAttributeNameChar(tagSource[i]))
                i++;
            if (i == nameStart)
            {
                i++;
                continue;
            }

            var attrName = tagSource.Slice(nameStart, i - nameStart);

            while (i < tagSource.Length && char.IsWhiteSpace(tagSource[i]))
                i++;

            ReadOnlySpan<char> attrValue = ReadOnlySpan<char>.Empty;
            if (i < tagSource.Length && tagSource[i] == '=')
            {
                i++;
                while (i < tagSource.Length && char.IsWhiteSpace(tagSource[i]))
                    i++;

                if (i < tagSource.Length && (tagSource[i] == '"' || tagSource[i] == '\''))
                {
                    char quote = tagSource[i++];
                    int valStart = i;
                    while (i < tagSource.Length && tagSource[i] != quote)
                        i++;
                    attrValue = tagSource.Slice(valStart, Math.Max(0, i - valStart));
                    if (i < tagSource.Length)
                        i++;
                }
                else
                {
                    int valStart = i;
                    while (i < tagSource.Length && !char.IsWhiteSpace(tagSource[i]) && tagSource[i] != '>')
                        i++;
                    attrValue = tagSource.Slice(valStart, i - valStart);
                }
            }

            if (attrName.Equals(attribute, StringComparison.OrdinalIgnoreCase))
            {
                return targetType switch
                {
                    HtmlSpanTargetType.Exact => attrValue.Equals(target, StringComparison.Ordinal),
                    HtmlSpanTargetType.Contains => attrValue.IndexOf(target, StringComparison.Ordinal) >= 0,
                    _ => false
                };
            }
        }

        return false;
    }

    private static bool IsAttributeNameChar(char c)
        => char.IsLetterOrDigit(c) || c == '-' || c == '_' || c == ':';

    private static bool EqualsOrdinalIgnoreCase(string a, string b)
        => string.Equals(a, b, StringComparison.OrdinalIgnoreCase);
}
