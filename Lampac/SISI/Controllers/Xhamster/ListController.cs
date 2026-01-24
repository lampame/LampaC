using Microsoft.AspNetCore.Mvc;

namespace SISI.Controllers.Xhamster
{
    public class ListController : BaseSisiController
    {
        public ListController() : base(AppInit.conf.Xhamster) { }

        [HttpGet]
        [Route("xmr")]
        [Route("xmrgay")]
        [Route("xmrsml")]
        async public Task<ActionResult> Index(string search, string c, string q, string sort = "newest", int pg = 1)
        {
            if (await IsRequestBlocked(rch: true, rch_keepalive: -1))
                return badInitMsg;

            pg++;
            string plugin = Regex.Match(HttpContext.Request.Path.Value, "^/([a-z]+)").Groups[1].Value;

            string semaphoreKey = $"{plugin}:{search}:{sort}:{c}:{q}:{pg}";
            var semaphore = new SemaphorManager(semaphoreKey, TimeSpan.FromSeconds(30));

            List<PlaylistItem> playlists = null;
            HybridCacheEntry<List<PlaylistItem>> entryCache;

            try
            {
                reset: // http запросы последовательно 
                if (rch?.enable != true)
                    await semaphore.WaitAsync();

                entryCache = hybridCache.Entry<List<PlaylistItem>>(semaphoreKey);

                // fallback cache
                if (!entryCache.success)
                {
                    string memKey = headerKeys(semaphoreKey, "accept");

                    bool next = rch == null;
                    if (!next)
                    {
                        // user cache разделенный по ip
                        entryCache = hybridCache.Entry<List<PlaylistItem>>(memKey);
                        next = !entryCache.success;
                    }

                    if (next)
                    {
                        string url = XhamsterTo.Uri(init.corsHost(), plugin, search, c, q, sort, pg);

                        await httpHydra.GetSpan(url, span => 
                        {
                            playlists = XhamsterTo.Playlist("xmr/vidosik", span);
                        });

                        if (playlists == null || playlists.Count == 0)
                        {
                            if (IsRhubFallback())
                                goto reset;

                            return OnError("playlists", refresh_proxy: string.IsNullOrEmpty(search));
                        }

                        proxyManager?.Success();

                        hybridCache.Set(memKey, playlists, cacheTime(10));
                    }
                }
            }
            finally
            {
                semaphore.Release();
            }

            if (playlists == null)
                playlists = entryCache.value;

            return await PlaylistResult(
                playlists,
                entryCache.singleCache,
                string.IsNullOrEmpty(search) ? XhamsterTo.Menu(host, plugin, c, q, sort) : null
            );
        }
    }
}
