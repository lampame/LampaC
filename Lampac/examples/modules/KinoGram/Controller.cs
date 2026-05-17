using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Web;
using System.Linq;
using Shared;
using Shared.Models.Templates;

namespace KinoGram;

public class KinoGramController : BaseOnlineController
{
    public KinoGramController() : base(ModInit.conf) { }

    [HttpGet]
    [Route("lite/kinogram")]
    async public Task<ActionResult> Index(long id, string imdb_id, long kinopoisk_id, string title, string original_title, string original_language, int year, string source, int serial, string t, int s = -1)
    {
        if (await IsRequestBlocked(rch: false))
            return badInitMsg;

        var result = await search(imdb_id, kinopoisk_id, serial);
        if (result == null)
            return OnError();

        if (result.movie != null)
        {
            var tpl = new MovieTpl(title, original_title);

            foreach (var movie in result.movie)
            {
                var streamquality = new StreamQualityTpl();

                foreach (var l in movie.links)
                    streamquality.Append(HostStreamProxy(l.link), l.quality);

                var first = streamquality.Firts();
                if (first != null)
                    tpl.Append(movie.translation, first.link, quality: first.quality, streamquality: streamquality);
            }

            return ContentTpl(tpl);
        }
        else
        {
            if (result.serial == null)
                return OnError();

            string defaultargs = $"&imdb_id={imdb_id}&kinopoisk_id={kinopoisk_id}&title={HttpUtility.UrlEncode(title)}&original_title={HttpUtility.UrlEncode(original_title)}&serial={serial}";

            if (s == -1)
            {
                var tpl = new SeasonTpl(quality: "4K HDR");

                foreach (var season in result.serial)
                    tpl.Append($"{season.Key} сезон", $"{host}/lite/kinogram?s={season.Key}" + defaultargs, season.Key);

                return ContentTpl(tpl);
            }
            else
            {
                var vtpl = new VoiceTpl();
                var etpl = new EpisodeTpl();

                #region Переводы
                string activTranslate = t;
                foreach (var translation in result.serial[s.ToString()])
                {
                    if (string.IsNullOrEmpty(activTranslate))
                        activTranslate = translation.id;

                    vtpl.Append(translation.name, activTranslate == translation.id, $"{host}/lite/kinogram?s={s}&t={translation.id}" + defaultargs);
                }
                #endregion

                foreach (var episode in result.serial[s.ToString()].First(i => i.id == activTranslate).episodes)
                {
                    var streamquality = new StreamQualityTpl();

                    foreach (var l in episode.links)
                        streamquality.Append(HostStreamProxy(l.link), l.quality);

                    var first = streamquality.Firts();
                    if (first != null)
                        etpl.Append($"{episode.id} серия", $"{title ?? original_title} ({episode.id} серия)", s.ToString(), episode.id, first.link, streamquality: streamquality);
                }

                etpl.Append(vtpl);

                return ContentTpl(etpl);
            }
        }
    }


    async Task<Result> search(string imdb_id, long kinopoisk_id, int serial)
    {
        string memKey = $"KinoGram:view:{kinopoisk_id}:{imdb_id}";
        var entryCache = await hybridCache.EntryAsync<Result>(memKey);
        if (entryCache.success)
            return entryCache.value;

        await Task.Delay(200); // имитация поиска

        var defaultLinks = new List<(string link, string quality)>()
        {
            ("https://www.elecard.com/storage/video/TheaterSquare_3840x2160.mp4", "2160p"),
            ("https://www.elecard.com/storage/video/TheaterSquare_1920x1080.mp4", "1080p"),
            ("https://www.elecard.com/storage/video/TheaterSquare_1280x720.mp4", "720p")
        };

        Result res = null;

        if (serial == 0)
        {
            res = new Result()
            {
                movie = new List<Movie>()
                {
                    new Movie()
                    {
                        translation = "RHS",
                        links = defaultLinks
                    },
                    new Movie()
                    {
                        translation = "ViruseProject",
                        links = defaultLinks
                    }
                }
            };
        }
        else
        {
            res = new Result()
            {
                serial = new Dictionary<string, List<Voice>>()
                {
                    ["1"] = new List<Voice>()
                    {
                        new Voice()
                        {
                            id = "36",
                            name = "ViruseProject",
                            episodes = new List<Serial>
                            {
                                new Serial()
                                {
                                    id = "1",
                                    links = defaultLinks
                                },
                                new Serial()
                                {
                                    id = "2",
                                    links = defaultLinks
                                },
                                new Serial()
                                {
                                    id = "3",
                                    links = defaultLinks
                                }
                            }
                        },
                        new Voice()
                        {
                            id = "12",
                            name = "RHS",
                            episodes = new List<Serial>
                            {
                                new Serial()
                                {
                                    id = "1",
                                    links = defaultLinks
                                },
                                new Serial()
                                {
                                    id = "2",
                                    links = defaultLinks
                                }
                            }
                        }
                    },
                    ["2"] = new List<Voice>()
                    {
                        new Voice()
                        {
                            id = "36",
                            name = "ViruseProject",
                            episodes = new List<Serial>
                            {
                                new Serial()
                                {
                                    id = "1",
                                    links = defaultLinks
                                }
                            }
                        },
                        new Voice()
                        {
                            id = "12",
                            name = "RHS",
                            episodes = new List<Serial>
                            {
                                new Serial()
                                {
                                    id = "1",
                                    links = defaultLinks
                                }
                            }
                        }
                    }
                }
            };
        }

        hybridCache.Set(memKey, res, cacheTime(5));

        return res;
    }
}
