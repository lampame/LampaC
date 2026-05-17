using Microsoft.AspNetCore.Mvc;
using Shared;
using Shared.Attributes;
using Shared.Models.SISI.Base;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PornGram;

public class PornGramController : BaseSisiController
{
    public PornGramController() : base(ModInit.conf) { }


    [HttpGet]
    [Staticache]
    [Route("porngram")]
    async public Task<ActionResult> Index(string search, string sort, int pg = 1)
    {
        if (await IsRequestBlocked(rch: false))
            return badInitMsg;

        var menu = new List<MenuItem>()
        {
            new MenuItem()
            {
                title = "Поиск",
                search_on = "search_on",
                playlist_url = host + "/porngram",
            },
            new MenuItem()
            {
                title = $"Сортировка: {(string.IsNullOrEmpty(sort) ? "новинки" : sort)}",
                playlist_url = "submenu",
                submenu = new List<MenuItem>()
                {
                    new("Новинки", host + "/porngram"),
                    new("Лучшее",  host + $"/porngram?sort=porno-online"),
                    new("Популярное", host + $"/porngram?sort=xxx-top")
                }
            }
        };

        var cache = await InvokeCacheResult<List<PlaylistItem>>($"PornGram:{search}:{sort}:{pg}", 20, async e =>
        {
            // await http
            // пасинг

            var playlists = new List<PlaylistItem>();

            for (int i = 0; i < 24; i++)
            {
                playlists.Add(new PlaylistItem()
                {
                    name = "Tomsk Theater Square",
                    video = $"{host}/porngram/video?uri={EncryptQuery("https://www.elecard.com/ru/videos")}",
                    picture = "https://www.elecard.com/storage/thumbs/1_1280x_FFFFFF/images/Video%20Previews/TheaterSquare_640x360.jpg",
                    time = "9:15",
                    quality = "4K",
                    json = true
                });
            }

            if (playlists.Count == 0)
                return e.Fail("playlists", refresh_proxy: true);

            return e.Success(playlists);
        });

        return PlaylistResult(cache, menu);
    }


    [HttpGet]
    [Staticache]
    [Route("porngram/video")]
    async public Task<ActionResult> Video(string uri)
    {
        uri = DecryptQuery(uri);
        if (string.IsNullOrEmpty(uri))
            return BadRequest("Invalid URI");

        var cache = await InvokeCacheResult<Dictionary<string, string>>($"PornGram:{uri}", 10, async e =>
        {
            // await http
            // пасинг

            var stream_links = new Dictionary<string, string>()
            {
                ["2160p"] = "https://www.elecard.com/storage/video/TheaterSquare_3840x2160.mp4",
                ["1080p"] = "https://www.elecard.com/storage/video/TheaterSquare_1920x1080.mp4",
                ["720p"] = "https://www.elecard.com/storage/video/TheaterSquare_1280x720.mp4"
            };

            if (stream_links.Count == 0)
                return e.Fail("stream_links", refresh_proxy: true);

            return e.Success(stream_links);
        });

        return OnResult(cache);
    }
}
