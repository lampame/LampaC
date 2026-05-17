using Jint;
using Microsoft.AspNetCore.Mvc;
using Shared;
using Shared.Attributes;
using Shared.Models.SISI.Base;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PornGramJS;

public class ApiController : BaseSisiController
{
    public ApiController() : base(ModInit.conf) { }


    [HttpGet]
    [Staticache]
    [Route("porngram")]
    async public Task<ActionResult> Index(string search, string model, string sort, string cat, int pg = 1)
    {
        if (await IsRequestBlocked(rch: true))
            return badInitMsg;

    rhubFallback:
        var cache = await InvokeCacheResult<Channel>($"PornGram:{search}:{model}:{sort}:{cat}:{pg}", 5, async e =>
        {
            var js = JSRuntime(ModInit.jsFile);

            var channel = await js.InvokeAsync<Channel>("Playlist", host, search, model, sort, cat, pg);
            if (channel?.list == null || channel.list.Count == 0)
                return e.Fail("playlists", refresh_proxy: true);

            return e.Success(channel);
        });

        if (IsRhubFallback(cache))
            goto rhubFallback;

        return PlaylistResult(cache);
    }


    [HttpGet]
    [Staticache]
    [Route("porngram/video")]
    async public Task<ActionResult> Video(string uri)
    {
        uri = DecryptQuery(uri);
        if (string.IsNullOrEmpty(uri))
            return BadRequest("Invalid URI");

    rhubFallback:
        var cache = await InvokeCacheResult<Dictionary<string, string>>($"PornGram:{uri}", 10, async e =>
        {
            var js = JSRuntime(ModInit.jsFile);

            var stream_links = await js.InvokeAsync<Dictionary<string, string>>("Video", uri);
            if (stream_links == null || stream_links.Count == 0)
                return e.Fail("stream_links", refresh_proxy: true);

            return e.Success(stream_links);
        });

        if (IsRhubFallback(cache))
            goto rhubFallback;

        return OnResult(cache);
    }


    [HttpGet]
    [Route("porngram/myresult")]
    public ActionResult MyResult(string type)
    {
        var js = JSRuntime(ModInit.jsFile);

        return ContentTo(js.Invoke("MyResult", type).AsString());
    }
}
