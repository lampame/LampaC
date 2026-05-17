using Shared.Models.SISI.Base;
using Shared.Models.SISI.OnResult;
using Shared.Services;
using Shared.Services.RxEnumerate;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web;

namespace Tizam;

public static class TizamTo
{
    public static string Uri(string host, int pg)
    {
        string uri = $"{host}/fil_my_dlya_vzroslyh/s_russkim_perevodom/";

        int page = pg - 1;
        if (page > 0)
            uri += $"?p={page}";

        return uri;
    }

    public static List<PlaylistItem> Playlist(string host, ReadOnlySpan<char> html)
    {
        if (html.IsEmpty)
            return null;

        var pagination = Rx.Split("id=\"pagination\"", html);
        if (pagination.Count == 0)
            return null;

        var rx = Rx.Split("video-item", pagination[0].Span, 1);
        if (rx.Count == 0)
            return null;

        var playlists = new List<PlaylistItem>(rx.Count);

        foreach (var row in rx.Rows())
        {
            if (row.Contains("pin--premium"))
                continue;

            string title = row.Match("-name=\"name\">([^<]+)<");
            string href = row.Match("href=\"/([^\"]+)\" itemprop=\"url\"");

            if (string.IsNullOrEmpty(href) || string.IsNullOrWhiteSpace(title))
                continue;

            string img = row.Match("class=\"item__img\" src=\"/([^\"]+)\"");
            if (img == null)
                continue;

            string imageUrl = $"{host}/{img}";

            playlists.Add(new PlaylistItem()
            {
                name = title,
                video = $"tizam/vidosik?uri={HttpUtility.UrlEncode(href)}",
                picture = imageUrl,
                time = row.Match("itemprop=\"duration\" content=\"([^<]+)\"", trim: true),
                json = true,
                bookmark = new Bookmark()
                {
                    site = "tizam",
                    href = href,
                    image = imageUrl
                }
            });
        }

        return playlists;
    }

    async public static Task<StreamItem> Stream(HttpHydra httpHydra, string host, string uri)
    {
        string location = null;

        await httpHydra.GetSpan($"{host}/{uri}", span =>
        {
            location = Rx.Match(span, "src=\"(https?://[^\"]+\\.mp4)\" type=\"video/mp4\"");
        });

        if (string.IsNullOrEmpty(location))
            return null;

        return new StreamItem()
        {
            qualitys = new Dictionary<string, string>()
            {
                ["auto"] = location
            }
        };
    }
}
