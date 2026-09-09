using Shared;
using Shared.Models.Base;

namespace Music;

public static class MusicImageProxyService
{
    static readonly BaseSettings init = new()
    {
        plugin = "Music"
    };

    // Cached DTOs (including nested images) can be shared by concurrent requests.
    // Rewrite only a response-owned copy, never the provider/cache object graph.
    public static T Apply<T>(BaseController controller, T response)
    {
        if (controller == null || response == null)
            return response;

        var copy = MusicJson.Deserialize<T>(MusicJson.Serialize(response));
        ApplyImages(controller, (object)copy);
        return copy;
    }

    static void ApplyImages(BaseController controller, object response)
    {
        switch (response)
        {
            case MusicSearchResponse search: ApplyImages(controller, search); break;
            case MusicHomeResponse home: ApplyImages(controller, home); break;
            case MusicStatsTopResult stats: ApplyImages(controller, stats); break;
            case MusicArtist artist: ApplyImages(controller, artist); break;
            case MusicAlbum album: ApplyImages(controller, album); break;
            case MusicTrack track: ApplyImages(controller, track); break;
            case MusicBrowseSection section: ApplyImages(controller, section); break;
            case MusicUserPlaylistSummary playlist: ApplyImages(controller, playlist); break;
            case MusicUserPlaylistImportResult import: ApplyImages(controller, import.tracks); break;
            case MusicDailyMixResponse daily: ApplyImages(controller, daily.tracks); break;
            case MusicRadioResponse radio: ApplyImages(controller, radio.tracks); break;
            case IEnumerable<MusicTrack> tracks:
                foreach (var item in tracks) ApplyImages(controller, item);
                break;
            case IEnumerable<MusicUserPlaylistSummary> playlists:
                foreach (var item in playlists) ApplyImages(controller, item);
                break;
        }
    }

    static MusicSearchResponse ApplyImages(BaseController controller, MusicSearchResponse response)
    {
        if (controller == null || response == null)
            return response;

        if (response.artists != null)
        {
            foreach (var artist in response.artists)
                ApplyImages(controller, artist);
        }

        if (response.albums != null)
        {
            foreach (var album in response.albums)
                ApplyImages(controller, album);
        }

        if (response.tracks != null)
        {
            foreach (var track in response.tracks)
                ApplyImages(controller, track);
        }

        if (response.search_sections != null)
        {
            foreach (var section in response.search_sections)
                ApplyImages(controller, section);
        }

        return response;
    }

    static MusicHomeResponse ApplyImages(BaseController controller, MusicHomeResponse response)
    {
        if (controller == null || response == null)
            return response;

        if (response.browse_sections != null)
        {
            foreach (var section in response.browse_sections)
                ApplyImages(controller, section);
        }

        if (response.recently_played != null)
        {
            foreach (var item in response.recently_played)
            {
                if (item?.track != null)
                    ApplyImages(controller, item.track);
            }
        }

        if (response.user_playlists != null)
        {
            foreach (var playlist in response.user_playlists)
                ApplyImages(controller, playlist);
        }

        return response;
    }

    static MusicUserPlaylistSummary ApplyImages(BaseController controller, MusicUserPlaylistSummary playlist)
    {
        if (controller == null || playlist == null)
            return playlist;

        ProxyImages(controller, playlist.images);
        return playlist;
    }

    static MusicStatsTopResult ApplyImages(BaseController controller, MusicStatsTopResult response)
    {
        if (controller == null || response == null)
            return response;

        if (response.tracks != null)
        {
            foreach (var item in response.tracks)
            {
                if (item?.track != null)
                    ApplyImages(controller, item.track);
            }
        }

        return response;
    }

    static MusicArtist ApplyImages(BaseController controller, MusicArtist artist)
    {
        if (controller == null || artist == null)
            return artist;

        ProxyImages(controller, artist.images);

        if (artist.albums != null)
        {
            foreach (var album in artist.albums)
                ApplyImages(controller, album);
        }

        if (artist.sections != null)
        {
            foreach (var section in artist.sections)
                ApplyImages(controller, section);
        }

        return artist;
    }

    static MusicAlbum ApplyImages(BaseController controller, MusicAlbum album)
    {
        if (controller == null || album == null)
            return album;

        ProxyImages(controller, album.images);

        if (album.tracks != null)
        {
            foreach (var track in album.tracks)
                ApplyImages(controller, track);
        }

        return album;
    }

    static MusicTrack ApplyImages(BaseController controller, MusicTrack track)
    {
        if (controller == null || track == null)
            return track;

        ProxyImages(controller, track.images);
        return track;
    }

    static MusicBrowseSection ApplyImages(BaseController controller, MusicBrowseSection section)
    {
        if (controller == null || section == null)
            return section;

        if (section.albums != null)
        {
            foreach (var album in section.albums)
                ApplyImages(controller, album);
        }

        if (section.artists != null)
        {
            foreach (var artist in section.artists)
                ApplyImages(controller, artist);
        }

        if (section.tracks != null)
        {
            foreach (var track in section.tracks)
                ApplyImages(controller, track);
        }

        return section;
    }

    static void ProxyImages(BaseController controller, List<MusicImage> images)
    {
        if (images == null || images.Count == 0)
            return;

        foreach (var image in images)
        {
            if (image == null || string.IsNullOrWhiteSpace(image.url))
                continue;

            // Normalize even when image proxying is disabled (e.g. file:// TV clients).
            if (image.url.StartsWith("//", StringComparison.Ordinal))
                image.url = "https:" + image.url;

            // Also repair legacy cached URLs created before response isolation.
            if (TryRewriteProxyHost(image.url, controller.host, out string rewritten))
            {
                image.url = rewritten;
                continue;
            }

            if (!NeedProxy(image.url, controller.host))
                continue;

            image.url = controller.HostImgProxy(init, image.url);
        }
    }

    static bool TryRewriteProxyHost(string url, string host, out string rewritten)
    {
        rewritten = null;

        int index = url.IndexOf("/proxyimg", StringComparison.OrdinalIgnoreCase);
        if (index <= 0 || string.IsNullOrWhiteSpace(host))
            return false;

        string prefix = url.Substring(0, index);
        if (string.Equals(prefix, host, StringComparison.OrdinalIgnoreCase))
            return false;

        // префикс должен быть полноценным origin (а не куском чужого пути)
        if (!Uri.TryCreate(prefix, UriKind.Absolute, out var prefixUri) ||
            !prefixUri.Scheme.StartsWith("http", StringComparison.OrdinalIgnoreCase))
            return false;

        rewritten = host + url.Substring(index);
        return true;
    }

    static bool NeedProxy(string url, string host)
    {
        if (string.IsNullOrWhiteSpace(url))
            return false;

        if (url.StartsWith("data:", StringComparison.OrdinalIgnoreCase) ||
            url.StartsWith("blob:", StringComparison.OrdinalIgnoreCase) ||
            url.StartsWith("file:", StringComparison.OrdinalIgnoreCase))
            return false;

        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri))
            return false;

        if (!uri.Scheme.StartsWith("http", StringComparison.OrdinalIgnoreCase))
            return false;

        if (!string.IsNullOrWhiteSpace(host) &&
            Uri.TryCreate(host, UriKind.Absolute, out var hostUri) &&
            string.Equals(uri.Host, hostUri.Host, StringComparison.OrdinalIgnoreCase))
            return false;

        return !url.Contains("/proxyimg", StringComparison.OrdinalIgnoreCase);
    }
}
