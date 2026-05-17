async function handle() {
    var q = req.query || {};

    var imdb_id = q.imdb_id || "";
    var kinopoisk_id = toInt(q.kinopoisk_id, 0);
    var title = q.title || "";
    var original_title = q.original_title || "";
    var year = toInt(q.year, 0);
    var serial = toInt(q.serial, 0);
    var t = q.t || "";
    var s = toInt(q.s, -1);

    var result = await search(imdb_id, kinopoisk_id, serial);
    if (result == null)
        return "";

    if (result.movie != null)
    {
        var tpl = new MovieTpl(title, original_title);

        for (var i = 0; i < result.movie.length; i++)
        {
            var movie = result.movie[i];
            var streamquality = new StreamQualityTpl();

            for (var j = 0; j < movie.links.length; j++) {
                var l = movie.links[j];
                streamquality.Append(streamProxy(l.link), l.quality);
            }

            var first = streamquality.Firts();

            tpl.Append(
                movie.translation,
                first.link,
                "play",
                null,
                streamquality,
                null,
                null,
                null,
                null,
                first.quality
            );
        }

        return tpl.ToHtml();
    }
    else
    {
        if (result.serial == null)
            return "";

        var defaultargs =
            "&imdb_id=" + encodeURIComponent(imdb_id) +
            "&kinopoisk_id=" + kinopoisk_id +
            "&title=" + encodeURIComponent(title) +
            "&original_title=" + encodeURIComponent(original_title) +
            "&serial=" + serial;

        if (s === -1)
        {
            var tpl = new SeasonTpl("4K HDR");

            for (var seasonKey in result.serial)
            {
                tpl.Append(
                    seasonKey + " сезон",
                    host + "/lite/kinogram?s=" + seasonKey + defaultargs,
                    parseInt(seasonKey, 10)
                );
            }

            return tpl.ToHtml();
        }
        else
        {
            var vtpl = new VoiceTpl();
            var tpl = new EpisodeTpl();

            var seasonVoices = result.serial[String(s)];
            if (seasonVoices == null || seasonVoices.length === 0)
                return "";

            var activTranslate = t;
            for (var k = 0; k < seasonVoices.length; k++)
            {
                var translation = seasonVoices[k];

                if (!activTranslate)
                    activTranslate = translation.id;

                vtpl.Append(
                    translation.name,
                    activTranslate === translation.id,
                    host + "/lite/kinogram?s=" + s + "&t=" + translation.id + defaultargs
                );
            }

            var activeVoice = null;
            for (var n = 0; n < seasonVoices.length; n++)
            {
                if (seasonVoices[n].id === activTranslate) {
                    activeVoice = seasonVoices[n];
                    break;
                }
            }

            if (activeVoice == null)
                return "";

            for (var m = 0; m < activeVoice.episodes.length; m++)
            {
                var episode = activeVoice.episodes[m];
                var streamquality = new StreamQualityTpl();

                for (var z = 0; z < episode.links.length; z++) {
                    var l = episode.links[z];
                    streamquality.Append(streamProxy(l.link), l.quality);
                }

                var first = streamquality.Firts();

                tpl.Append(
                    episode.id + " серия",
                    title || original_title,
                    String(s),
                    episode.id,
                    first.link,
                    "play",
                    streamquality
                );
            }

            tpl.Append(vtpl);

            return tpl.ToHtml();
        }
    }
}


async function search(imdb_id, kinopoisk_id, serial)
{
    /*const cachekey = `${imdb_id}:${kinopoisk_id}:${serial}`;
    var html = cacheGet(cachekey);
    if (!html) {
        html = await httpGet("https://kinogram.com/movie?imdb_id=" + encodeURIComponent(imdb_id) + "&kinopoisk_id=" + kinopoisk_id);
        cacheSet(cachekey, html, 20);
    }*/

    // html parse ...

    var defaultLinks = [
        { link: "https://www.elecard.com/storage/video/TheaterSquare_3840x2160.mp4", quality: "2160p" },
        { link: "https://www.elecard.com/storage/video/TheaterSquare_1920x1080.mp4", quality: "1080p" },
        { link: "https://www.elecard.com/storage/video/TheaterSquare_1280x720.mp4", quality: "720p" }
    ];

    var res = null;

    if (serial === 0)
    {
        res = {
            movie: [
                {
                    translation: "RHS",
                    links: defaultLinks
                },
                {
                    translation: "ViruseProject",
                    links: defaultLinks
                }
            ]
        };
    }
    else
    {
        res = {
            serial: {
                "1": [
                    {
                        id: "36",
                        name: "ViruseProject",
                        episodes: [
                            { id: "1", links: defaultLinks },
                            { id: "2", links: defaultLinks },
                            { id: "3", links: defaultLinks }
                        ]
                    },
                    {
                        id: "12",
                        name: "RHS",
                        episodes: [
                            { id: "1", links: defaultLinks },
                            { id: "2", links: defaultLinks }
                        ]
                    }
                ],
                "2": [
                    {
                        id: "36",
                        name: "ViruseProject",
                        episodes: [
                            { id: "1", links: defaultLinks }
                        ]
                    },
                    {
                        id: "12",
                        name: "RHS",
                        episodes: [
                            { id: "1", links: defaultLinks }
                        ]
                    }
                ]
            }
        };
    }

    return res;
}


function toInt(v, def = 0) {
    var n = parseInt(v, 10);
    return isNaN(n) ? def : n;
}
