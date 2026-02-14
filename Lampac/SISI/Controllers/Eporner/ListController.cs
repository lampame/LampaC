using Microsoft.AspNetCore.Mvc;

namespace SISI.Controllers.Eporner
{
    public class ListController : BaseSisiController
    {
        public ListController() : base(AppInit.conf.Eporner) { }

        [HttpGet]
        [Route("epr")]
        async public Task<ActionResult> Index(string search, string sort, string c, int pg = 1)
        {
            if (await IsRequestBlocked(rch: true, rch_keepalive: -1))
                return badInitMsg;

            pg += 1;

            string semaphoreKey = $"epr:{search}:{sort}:{c}:{pg}";
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
                        string url = EpornerTo.Uri(init.corsHost(), search, sort, c, pg);

                        await httpHydra.GetSpan(url, span => 
                        {
                            playlists = EpornerTo.Playlist("epr/vidosik", span);
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
                EpornerTo.Menu(host, search, sort, c)
            );
        }
    }
}
