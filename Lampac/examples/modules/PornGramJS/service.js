async function Playlist(host, search, model, sort, cat, pg) {
    const channel = {
        total_pages: 0,
        list: [],
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
        ]
    };

    var html = await httpGet("https://www.elecard.com/");
    // html parse ...
    log('console.log ...');

    for (let i = 0; i < 24; i++) {
        channel.list.push({
            name: "Tomsk Theater Square",
            video: `${host}/porngram/video?uri=${encryptQuery("https://www.elecard.com/ru/videos")}`,
            picture: "https://www.elecard.com/storage/thumbs/1_1280x_FFFFFF/images/Video%20Previews/TheaterSquare_640x360.jpg",
            time: "9:15",
            quality: "4K",
            json: true
        });
    }

    return JSON.stringify(channel);
}


async function Video(uri) {
    var html = await httpGet(uri);
    // html parse ...
    return JSON.stringify({
        "2160p": "https://www.elecard.com/storage/video/TheaterSquare_3840x2160.mp4",
        "1080p": "https://www.elecard.com/storage/video/TheaterSquare_1920x1080.mp4",
        "720p": "https://www.elecard.com/storage/video/TheaterSquare_1280x720.mp4"
    });
}


function MyResult(type) {
    return type == "json"
        ? JSON.stringify({ success: true, playlist: [] })
        : "hello html";
}