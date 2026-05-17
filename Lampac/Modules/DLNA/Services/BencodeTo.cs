using BencodeNET.Parsing;
using BencodeNET.Torrents;
using System.Text.RegularExpressions;

namespace DLNA;

public class BencodeTo
{
    public static string Magnet(byte[] torrent)
    {
        try
        {
            if (torrent == null)
                return null;

            var parser = new BencodeParser();
            var res = parser.Parse<Torrent>(torrent);

            string magnet = res.GetMagnetLink();
            if (res.OriginalInfoHash != null)
                magnet = Regex.Replace(magnet, @"urn:btih:[\w0-9]+", $"urn:btih:{res.OriginalInfoHash.ToLowerInvariant()}", RegexOptions.IgnoreCase);

            return magnet;
        }
        catch
        {
            return null;
        }
    }
}
