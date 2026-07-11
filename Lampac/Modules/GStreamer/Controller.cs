using GStreamer.Models;
using GStreamer.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Win32.SafeHandles;
using Shared;
using Shared.Attributes;
using Shared.Services;
using Shared.Services.Pools;
using Shared.Services.Utilities;
using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace GStreamer;

public class GStreamerController : BaseController
{
    #region gst.js
    [AllowAnonymous]
    [Staticache(10, always: true, setHeadersNoCache: true)]
    [HttpGet("/gst.js")]
    [HttpGet("/gst/js/{token}")]
    public ActionResult GstJs(string token)
    {
        if (!ModInit.conf.enable)
            return Content(string.Empty, "application/javascript; charset=utf-8");

        var plugin = FileCache.ReadAllText($"{ModInit.modpath}/plugins/gst.js", "gst.js")
            .Replace("{localhost}", CoreInit.Host(HttpContext))
            .Replace("{token}", HttpUtility.UrlEncode(token));

        return ContentTo(plugin, "application/javascript; charset=utf-8");
    }
    #endregion

    #region tracks.js
    [HttpGet, AllowAnonymous]
    [Staticache(10, always: true, setHeadersNoCache: true)]
    [Route("gst/tracks.js")]
    [Route("gst/tracks/js/{token}")]
    public ActionResult Tracks(string token)
    {
        string plugin = FileCache.ReadAllText($"{ModInit.modpath}/plugins/tracks.js", "gstracks.js")
            .Replace("{localhost}", host)
            .Replace("{token}", HttpUtility.UrlEncode(token));

        return ContentTo(plugin, "application/javascript; charset=utf-8");
    }
    #endregion


    #region add
    [HttpGet("/gst/add")]
    public async Task<ActionResult> Add(string link, string linkencode, string uid, string token)
    {
        if (!ModInit.conf.enable)
            return StatusCode(403);

        string user_id = uid ?? token;
        if (ModInit.conf.allowed_uids != null && !ModInit.conf.allowed_uids.Contains(user_id))
            return StatusCode(401);

        var gstask = await GService.GetOrAdd(link ?? CrypTo.DecodeBase64(linkencode), user_id);
        if (gstask.task == null)
        {
            HttpContext.Response.StatusCode = StatusCodes.Status502BadGateway;
            return Content(gstask.error);
        }

        var task = gstask.task;

        return Json(new
        {
            id = task.id.ToString(),
            task.user_uid,
            hls = $"{host}/gst/{task.id}/master.m3u8",
            task.probe
        });
    }
    #endregion

    #region remove
    [AllowAnonymous]
    [HttpGet("/gst/remove")]
    public async Task<ActionResult> Remove(ulong id)
    {
        if (!ModInit.conf.enable)
            return StatusCode(403);

        var gstask = GService.Get(id);
        if (gstask == null)
            return StatusCode(404);

        gstask.CancelSegmentPrefetch();

        if (GService.TryRemove(id))
            return Json(new { success = true });

        return StatusCode(503);
    }
    #endregion

    #region Heartbeat
    [AllowAnonymous]
    [HttpGet("/gst/{id}/heartbeat")]
    public ActionResult Heartbeat(ulong id)
    {
        if (!ModInit.conf.enable)
            return StatusCode(403);

        if (GService.Get(id) != null)
            return Ok();

        return StatusCode(404);
    }
    #endregion


    #region start.m3u8
    [HttpGet("/gst/start.m3u8")]
    public async Task<ActionResult> Start(string link, string linkencode, string uid, string token, int audio)
    {
        if (!ModInit.conf.enable)
            return StatusCode(403);

        string user_id = uid ?? token;
        if (ModInit.conf.allowed_uids != null && !ModInit.conf.allowed_uids.Contains(user_id))
            return StatusCode(401);

        var gstask = await GService.GetOrAdd(link ?? CrypTo.DecodeBase64(linkencode), user_id, audio);
        if (gstask.task == null)
        {
            HttpContext.Response.StatusCode = StatusCodes.Status502BadGateway;
            return Content(gstask.error);
        }

        return LocalRedirect($"/gst/{gstask.task.id}/master.m3u8?audio={audio}");
    }
    #endregion

    #region master.m3u8
    [AllowAnonymous]
    [HttpGet("/gst/{id}/master.m3u8")]
    public ActionResult MasterPlaylist(ulong id, int audio)
    {
        SetHeadersNoCache();

        var gstask = GService.Get(id);
        if (gstask == null)
            return NotFound();

        var probe = gstask.probe;
        var playlist = StringBuilderPool.Rent();

        try
        {
            playlist.AppendLine("#EXTM3U");
            playlist.AppendLine("#EXT-X-VERSION:7");
            playlist.AppendLine();

            bool hasSubs = false;

            if (probe != null && gstask.conf.subtitles)
            {
                foreach (var track in probe.Tracks)
                {
                    if (track.Type != "subtitle")
                        continue;

                    switch (track.Codec)
                    {
                        case "text":
                        case "subrip":
                        case "utf8":
                        case "ass":
                        case "ssa":
                            break;

                        default:
                            continue;
                    }

                    hasSubs = true;

                    string lang = string.IsNullOrWhiteSpace(track.Language)
                        ? "und"
                        : HlsQuoted(track.Language);

                    string name = string.IsNullOrWhiteSpace(track.Title)
                        ? $"Subtitle {track.Index}"
                        : HlsQuoted(track.Title);

                    playlist.AppendLine($"#EXT-X-MEDIA:TYPE=SUBTITLES,GROUP-ID=\"subs\",NAME=\"{name}\",LANGUAGE=\"{lang}\",DEFAULT=NO,AUTOSELECT=YES,FORCED=NO,URI=\"/gst/{id}/subs/{track.Index}.m3u8\"");
                }

                if (hasSubs)
                    playlist.AppendLine();
            }

            long bandwidth = gstask.GetHlsBandwidth(
                out long? averageBandwidth
            );

            playlist
                .Append("#EXT-X-STREAM-INF:BANDWIDTH=")
                .Append(bandwidth);

            if (averageBandwidth.HasValue)
            {
                playlist
                    .Append(",AVERAGE-BANDWIDTH=")
                    .Append(averageBandwidth.Value);
            }

            if (probe != null)
            {
                if (probe.Video?.Width > 0 && probe.Video?.Height > 0)
                    playlist.Append($",RESOLUTION={probe.Video.Width}x{probe.Video.Height}");
            }

            if (hasSubs)
                playlist.Append(",SUBTITLES=\"subs\"");

            playlist.AppendLine();
            playlist.AppendLine($"/gst/{id}/video.m3u8?audio={audio}");

            return ContentTo(
                playlist,
                "application/vnd.apple.mpegurl; charset=utf-8"
            );
        }
        finally
        {
            StringBuilderPool.Return(playlist);
        }
    }
    #endregion


    #region video.m3u8
    [AllowAnonymous]
    [HttpGet("/gst/{id}/video.m3u8")]
    public ActionResult VideoPlaylist(ulong id, int audio)
    {
        SetHeadersNoCache();

        var gstask = GService.Get(id);
        if (gstask == null)
            return NotFound();

        int duration = gstask.probe.DurationSeconds;
        if (0 >= duration)
            duration = 200 * 60; // 200 min

        int segmentSeconds = gstask.conf.segment_seconds;
        int count = duration / segmentSeconds;

        var playlist = StringBuilderPool.Rent();

        try
        {
            playlist.AppendLine("#EXTM3U");
            playlist.AppendLine("#EXT-X-PLAYLIST-TYPE:VOD");
            playlist.AppendLine("#EXT-X-VERSION:7");
            playlist.Append("#EXT-X-TARGETDURATION:")
                    .Append(segmentSeconds)
                    .Append('\n');
            playlist.AppendLine("#EXT-X-MEDIA-SEQUENCE:0");
            playlist.Append("#EXT-X-MAP:URI=\"init.mp4?audio=")
                    .Append(audio)
                    .AppendLine("\"");

            for (int i = 0; i < count; i++)
            {
                playlist
                    .Append("#EXTINF:")
                    .Append(segmentSeconds)
                    .AppendLine(".00,");

                playlist
                    .Append("seg/")
                    .Append(i)
                    .AppendLine(".m4s");
            }

            playlist.AppendLine("#EXT-X-ENDLIST");

            return ContentTo(
                playlist,
                "application/vnd.apple.mpegurl; charset=utf-8"
            );
        }
        finally
        {
            StringBuilderPool.Return(playlist);
        }
    }
    #endregion

    #region init.mp4
    [AllowAnonymous]
    [HttpGet("/gst/{id}/init.mp4")]
    public async Task<ActionResult> VideoInit(ulong id, int audio)
    {
        SetHeadersNoCache();

        var gstask = GService.Get(id);
        if (gstask == null)
            return NotFound();

        if (gstask.initMp4 == null)
        {
            try
            {
                await gstask.semaphore.WaitAsync().ConfigureAwait(false);

                gstask.EnsureSegment(-1, default, audio);

                if (gstask.initMp4 == null)
                    return StatusCode(502);
            }
            finally
            {
                gstask.semaphore.Release();
            }
        }

        Response.Headers.ContentLength = gstask.initMp4.Length;
        return File(gstask.initMp4, "video/mp4", true);
    }
    #endregion

    #region seg.m4s
    [AllowAnonymous]
    [HttpGet("/gst/{id}/seg/{index:int}.m4s")]
    public async Task VideoSeg(ulong id, int index)
    {
        SetHeadersNoCache();

        var gstask = GService.Get(id);
        if (gstask == null)
        {
            Response.StatusCode = StatusCodes.Status404NotFound;
            return;
        }

        gstask.PinSegmentFile(index);

        try
        {
            if (gstask.IsFrozen)
            {
                try
                {
                    await gstask.semaphore.WaitAsync().ConfigureAwait(false);
                    gstask.Defrost();
                }
                finally
                {
                    gstask.semaphore.Release();
                }
            }

            gstask.SetClientSegmentIndex(index);

            if (gstask.TryOpenSegmentFile(index, out var cachedSegment))
            {
                gstask.QueueSegmentPrefetch(index);

                await SendSegmentFile(
                    cachedSegment,
                    HttpContext.RequestAborted
                );
            }
            else
            {
                gstask.CancelSegmentPrefetch();

                try
                {
                    await gstask.semaphore.WaitAsync(HttpContext.RequestAborted).ConfigureAwait(false);
                }
                catch (OperationCanceledException) when (HttpContext.RequestAborted.IsCancellationRequested)
                {
                    return;
                }
                catch (ObjectDisposedException)
                {
                    Response.StatusCode = StatusCodes.Status410Gone;
                    return;
                }

                CachedSegmentFile segmentFile = default;

                try
                {
                    if (!gstask.TryOpenSegmentFile(index, out segmentFile))
                    {
                        if (!gstask.EnsureClientSegment(index, HttpContext.RequestAborted))
                        {
                            if (HttpContext.RequestAborted.IsCancellationRequested)
                                return;

                            Response.StatusCode = StatusCodes.Status502BadGateway;
                            return;
                        }

                        if (!gstask.TryOpenSegmentFile(index, out segmentFile))
                        {
                            if (HttpContext.RequestAborted.IsCancellationRequested)
                                return;

                            Response.StatusCode = StatusCodes.Status502BadGateway;
                            return;
                        }
                    }
                }
                finally
                {
                    gstask.semaphore.Release();
                }

                gstask.QueueSegmentPrefetch(index);

                await SendSegmentFile(
                    segmentFile,
                    HttpContext.RequestAborted
                );
            }
        }
        finally
        {
            gstask.UnpinSegmentFile(index);
        }
    }
    #endregion


    #region subs.m3u8
    [AllowAnonymous]
    [HttpGet("/gst/{id}/subs/{index}.m3u8")]
    public ActionResult SubsPlaylist(ulong id, int index)
    {
        SetHeadersNoCache();

        var gstask = GService.Get(id);
        if (gstask == null)
            return NotFound();

        int duration = gstask.probe.DurationSeconds;
        if (0 >= duration)
            duration = 200 * 60; // 200 min

        int segmentSeconds = gstask.conf.segment_seconds;
        int count = duration / segmentSeconds;

        var playlist = StringBuilderPool.Rent();

        try
        {
            playlist.AppendLine("#EXTM3U");
            playlist.AppendLine("#EXT-X-PLAYLIST-TYPE:VOD");
            playlist.AppendLine("#EXT-X-VERSION:3");
            playlist.Append("#EXT-X-TARGETDURATION:")
                    .Append(segmentSeconds)
                    .Append('\n');
            playlist.AppendLine("#EXT-X-MEDIA-SEQUENCE:0");

            for (int i = 0; i < count; i++)
            {
                playlist
                    .Append("#EXTINF:")
                    .Append(segmentSeconds)
                    .AppendLine(".00,");

                playlist
                    .Append(index)
                    .Append('/')
                    .Append(i)
                    .AppendLine(".vtt");
            }

            playlist.AppendLine("#EXT-X-ENDLIST");

            return ContentTo(
                playlist,
                "application/vnd.apple.mpegurl; charset=utf-8"
            );
        }
        finally
        {
            StringBuilderPool.Return(playlist);
        }
    }
    #endregion

    #region sub.vtt
    [AllowAnonymous]
    [HttpGet("/gst/{id}/subs/{index}/{seg}.vtt")]
    public async Task<ActionResult> SubVtt(ulong id, int index, int seg)
    {
        SetHeadersNoCache();

        var gstask = GService.Get(id);
        if (gstask == null)
            return NotFound();

        if (!gstask.conf.subtitles)
            return Ok();

        var sb = StringBuilderPool.Rent();

        try
        {
            if (!gstask.GetSubtitleVtt(sb, index, seg))
            {
                await Task.Delay(TimeSpan.FromSeconds(1));

                sb.Clear();
                gstask.GetSubtitleVtt(sb, index, seg);
            }

            return ContentTo(
                sb,
                "text/vtt; charset=utf-8"
            );
        }
        finally
        {
            StringBuilderPool.Return(sb);
        }
    }
    #endregion

    #region Helpers
    async Task SendSegmentFile(CachedSegmentFile file, CancellationToken cancellationToken)
    {
        try
        {
            using (file)
            {
                if (!file.IsValid)
                {
                    Response.StatusCode = StatusCodes.Status404NotFound;
                    return;
                }

                HttpContext.Features.Get<IHttpResponseBodyFeature>()?.DisableBuffering();

                Response.ContentType = "video/mp4";
                Response.Headers.AcceptRanges = "bytes";

                long totalLength = file.Length;

                var range = Request.GetTypedHeaders()?.Range;

                if (range != null &&
                    range.Ranges.Count == 1 &&
                    string.Equals(range.Unit.Value, "bytes", StringComparison.OrdinalIgnoreCase))
                {
                    var item = range.Ranges.First();

                    long start;
                    long end;

                    if (item.From.HasValue)
                    {
                        start = item.From.Value;
                        end = item.To ?? totalLength - 1;
                    }
                    else
                    {
                        long suffixLength = item.To ?? 0;

                        if (suffixLength <= 0)
                        {
                            Response.StatusCode = StatusCodes.Status416RangeNotSatisfiable;
                            Response.Headers.ContentRange = $"bytes */{totalLength}";
                            return;
                        }

                        suffixLength = Math.Min(suffixLength, totalLength);

                        start = totalLength - suffixLength;
                        end = totalLength - 1;
                    }

                    if (start >= totalLength || end < start)
                    {
                        Response.StatusCode = StatusCodes.Status416RangeNotSatisfiable;
                        Response.Headers.ContentRange = $"bytes */{totalLength}";
                    }
                    else
                    {
                        end = Math.Min(end, totalLength - 1);

                        Response.StatusCode = StatusCodes.Status206PartialContent;
                        Response.Headers.ContentRange = $"bytes {start}-{end}/{totalLength}";
                        Response.ContentLength = end - start + 1;

                        await CopyFileRange(
                            file.Handle,
                            Response.Body,
                            start,
                            Response.ContentLength.Value,
                            cancellationToken
                        );
                    }
                }
                else
                {
                    Response.StatusCode = StatusCodes.Status200OK;
                    Response.ContentLength = totalLength;

                    await CopyFileRange(
                        file.Handle,
                        Response.Body,
                        0,
                        totalLength,
                        cancellationToken
                    );
                }
            }
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
        }
    }

    static async Task CopyFileRange(
        SafeFileHandle handle,
        Stream body,
        long offset,
        long count,
        CancellationToken cancellationToken
    )
    {
        using var buffer = new BufferPool();

        while (count > 0)
        {
            int length = (int)Math.Min(buffer.Memory.Length, count);

            int read = await RandomAccess.ReadAsync(
                handle,
                buffer.Memory.Slice(0, length),
                offset,
                cancellationToken
            );

            if (read <= 0)
                break;

            await body.WriteAsync(
                buffer.Memory.Slice(0, read),
                cancellationToken
            );

            offset += read;
            count -= read;
        }
    }

    static string HlsQuoted(string value)
    {
        return value
            .Replace('"', '\'')
            .Replace('\r', ' ')
            .Replace('\n', ' ');
    }
    #endregion
}
