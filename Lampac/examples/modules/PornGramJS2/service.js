async function handle() {
    const path = req.path || "";
    const query = req.query || {};

    if (path.endsWith("/video")) {
        const uri = decryptQuery(query.uri);
        return Video(uri);
    }

    return Playlist(
        query.search || "",
        query.model || "",
        query.sort || "",
        query.cat || "",
        query.pg || 1
    );
}

async function Playlist(search, model, sort, cat, pg) {
    const channel = {
        menu: [
            {
                title: "Поиск",
                search_on: "search_on",
                playlist_url: host + "/porngram"
            },
            {
                title: "Сортировка: " + (!sort ? "новинки" : sort),
                playlist_url: "submenu",
                submenu: [
                    { title: "Новинки", playlist_url: host + "/porngram" },
                    { title: "Лучшее", playlist_url: host + "/porngram?sort=porno-online" },
                    { title: "Популярное", playlist_url: host + "/porngram?sort=xxx-top" }
                ]
            }
        ],
        list: [],
        total_pages: 0
    };

    const cachekey = `${search}:${model}:${sort}:${cat}:${pg}`;
    var html = cacheGet(cachekey);
    if (!html) {
        html = await httpGet("https://www.elecard.com/");
        cacheSet(cachekey, html, 20);
    }

    // html parse ...
    log('console.log ...');

    for (let i = 0; i < 24; i++) {
        channel.list.push({
            name: "Tomsk Theater Square",
            video: `${host}/porngram/video?uri=${encryptQuery("https://www.elecard.com/ru/videos")}`,
            picture: imgProxy("https://www.elecard.com/storage/thumbs/1_1280x_FFFFFF/images/Video%20Previews/TheaterSquare_640x360.jpg"),
            time: "9:15",
            quality: "4K",
            json: true
        });
    }

    return JSON.stringify(channel);
}


async function Video(uri) {
    log(uri);

    var html = cacheGet(uri);
    if (!html) {
        html = await httpGet(uri);
        cacheSet(uri, html, 5);
    }

    // html parse ...

    return JSON.stringify({
        "2160p": streamProxy("https://www.elecard.com/storage/video/TheaterSquare_3840x2160.mp4"),
        "1080p": streamProxy("https://www.elecard.com/storage/video/TheaterSquare_1920x1080.mp4"),
        "720p": streamProxy("https://www.elecard.com/storage/video/TheaterSquare_1280x720.mp4")
    });
}
