namespace Filmix.Models;

public class ModuleConf
{
    /// <summary>
    /// http://filmixapp.cyou
    /// http://filmixapp.vip
    /// http://fxapp.biz
    /// </summary>
    public FilmixSettings Filmix { get; set; } = new FilmixSettings("Filmix", "http://filmixapp.cyou")
    {
        displayindex = 305,
        rhub_safety = false,
        rch_access = "apk",
        stream_access = "apk,cors,web",
        reserve = false,
        headers = HeadersModel.Init(
            ("Accept-Encoding", "gzip")
        ).ToDictionary()
    };

    public FilmixSettings FilmixTV { get; set; } = new FilmixSettings("FilmixTV", "https://api.filmix.tv")
    {
        enable = false,
        displayindex = 310,
        httpversion = 2,
        rhub_safety = false,
        pro = true,
        stream_access = "apk,cors,web",
        headers = HeadersModel.Init(
            ("user-agent", "Mozilla/5.0 (SMART-TV; LINUX; Tizen 6.0) AppleWebKit/537.36 (KHTML, like Gecko) 76.0.3809.146/6.0 TV Safari/537.36")
        ).ToDictionary()
    };

    public FilmixSettings FilmixPartner { get; set; } = new FilmixSettings("FilmixPartner", "http://5.61.56.18/partner_api")
    {
        enable = false,
        displayindex = 315,
        stream_access = "apk,cors,web"
    };
}
