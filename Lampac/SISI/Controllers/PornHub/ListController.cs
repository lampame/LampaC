using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SISI.Controllers.PornHub
{
    public class ListController : BaseSisiController
    {
        public ListController() : base(AppInit.conf.PornHub) { }

        [HttpGet]
        [Route("phub")]
        [Route("phubgay")]
        [Route("phubsml")]
        async public Task<ActionResult> Index(string search, string model, string sort, int c, int pg = 1)
        {
            if (await IsRequestBlocked(rch: true, rch_keepalive: -1))
                return badInitMsg;

            string plugin = Regex.Match(HttpContext.Request.Path.Value, "^/([a-z]+)").Groups[1].Value;

            string semaphoreKey = $"{plugin}:list:{search}:{model}:{sort}:{c}:{pg}";
            var semaphore = new SemaphorManager(semaphoreKey, TimeSpan.FromSeconds(30));

            PlaylistAndPage cache = null;
            HybridCacheEntry<PlaylistAndPage> entryCache;

            try
            {
                reset: // http запросы последовательно 
                if (rch?.enable != true)
                    await semaphore.WaitAsync();

                entryCache = hybridCache.Entry<PlaylistAndPage>(semaphoreKey);

                // fallback cache
                if (!entryCache.success)
                {
                    string memKey = headerKeys(semaphoreKey, "accept");

                    bool next = rch == null;
                    if (!next)
                    {
                        // user cache разделенный по ip
                        entryCache = hybridCache.Entry<PlaylistAndPage>(memKey);
                        next = !entryCache.success;
                    }

                    if (next)
                    {
                        string uri = PornHubTo.Uri(init.corsHost(), plugin, search, model, sort, c, null, pg);

                        await httpHydra.GetSpan(uri, span => 
                        {
                            cache = new PlaylistAndPage(
                                PornHubTo.Pages(span), 
                                PornHubTo.Playlist("phub/vidosik", "phub", span, IsModel_page: !string.IsNullOrEmpty(model))
                            );
                        });

                        if (cache?.playlists == null || cache.playlists.Count == 0)
                        {
                            if (IsRhubFallback())
                                goto reset;

                            return OnError("playlists", refresh_proxy: string.IsNullOrEmpty(search));
                        }

                        proxyManager?.Success();

                        hybridCache.Set(memKey, cache, cacheTime(10));
                    }
                }
            }
            finally
            {
                semaphore.Release();
            }

            if (cache == null)
                cache = entryCache.value;

            return await PlaylistResult(
                cache.playlists,
                entryCache.singleCache,
                string.IsNullOrEmpty(model) ? PornHubTo.Menu(host, plugin, search, sort, c) : null,
                total_pages: cache.total_pages
            );
        }
    }
}
