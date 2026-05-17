using Shared.Services;
using Shared.Services.RxEnumerate;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Eneyida;

public struct EneyidaInvoke
{
    #region EneyidaInvoke
    string apihost;
    HttpHydra httpHydra;

    public EneyidaInvoke(string apihost, HttpHydra httpHydra)
    {
        this.apihost = apihost;
        this.httpHydra = httpHydra;
    }
    #endregion

    #region Search
    public async Task<EmbedModel> Search(string story)
    {
        var result = new EmbedModel();

        bool searchEmpty = false;
        string _site = apihost;

        await httpHydra.PostSpan($"{_site}/index.php?do=search", $"do=search&subaction=search&search_start=0&result_from=1&story={HttpUtility.UrlEncode(story)}", search =>
        {
            searchEmpty = search.Contains(">Пошук по сайту<", StringComparison.OrdinalIgnoreCase);

            var rx = Rx.Split("<article ", search, 1);

            foreach (var row in rx.Rows())
            {
                if (row.Contains(">Анонс</div>") || row.Contains(">Трейлер</div>"))
                    continue;

                string newslink = row.Match("href=\"https?://[^/]+/([^\"]+\\.html)\"");
                if (newslink == null)
                    continue;

                // <div class="short_subtitle"><a href="https://eneyida.tv/xfsearch/year/2025/">2025</a> &bull; Thunderbolts</div>
                var g = row.Groups("class=\"short_subtitle\">(<a [^>]+>([0-9]{4})</a>)?([^<]+)</div>");

                string name = g[3].Value.Replace("&bull;", "").Trim();
                if (string.IsNullOrEmpty(name))
                    continue;

                if (result.similars == null)
                    result.similars = new List<Similar>(rx.Count);

                string uaname = row.Match("id=\"short_title\"[^>]+>([^<]+)<");
                string img = row.Match("data-src=\"/([^\"]+)\"");

                result.similars.Add(new Similar()
                {
                    title = $"{uaname} / {name}",
                    year = g[2].Value,
                    href = newslink,
                    img = string.IsNullOrEmpty(img) ? null : $"{_site}/{img}"
                });
            }
        });

        if (result.similars == null || result.similars.Count == 0)
            return searchEmpty ? new EmbedModel() { IsEmpty = true } : null;

        return result;
    }
    #endregion

    #region Embed
    public async Task<string> Embed(string href)
    {
        string iframeUri = null;

        await httpHydra.GetSpan($"{apihost}/{href}", news =>
        {
            iframeUri = Rx.Match(news, "<iframe width=\"100%\" height=\"400\" src=\"(https?://[^/]+/[^\"]+/[0-9]+)");
        });

        return iframeUri;
    }
    #endregion
}
