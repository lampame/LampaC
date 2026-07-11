using Shared.Models.Module;
using System.Collections.Generic;

namespace GStreamer;

public class ModuleConf : ModuleBaseConf
{
    public bool enable { get; set; }

    public string debugType { get; set; }

    public int inactiveMinutes { get; set; }


    public double gst_version { get; set; }

    public string PATH { get; set; }

    public Dictionary<string, ModuleConf> conf_uids { get; set; }

    public string[] allowed_uids { get; set; }


    /// <summary>
    /// задний кеш m4s
    /// </summary>
    public int segment_past { get; set; } = 1;

    /// <summary>
    /// количество буферных m4s
    /// </summary>
    public int segment_buffer { get; set; } = 10;

    /// <summary>
    /// без transcode видео - примерная длительность сегмента
    /// для transcode видео - точная длительность сегмента
    /// </summary>
    public int segment_seconds { get; set; } = 9;

    /// <summary>
    /// граница выравнивания
    /// </summary>
    public int segment_diff { get; set; } = 10;

    public bool subtitles { get; set; } = true;


    /// <summary>
    /// 256 кбит/с
    /// </summary>
    public int aac_bitrate { get; set; } = 256;

    /// <summary>
    /// sample rate для AAC энкодера (Hz). 0 = берётся из исходной дорожки.
    /// </summary>
    public int aac_samplerate { get; set; }

    /// <summary>
    /// количество каналов AAC. 0 = берётся из исходной дорожки (поддерживается до 7.1 / 8 каналов).
    /// </summary>
    public int aac_channels { get; set; }


    /// <summary>
    /// если нужна нарезка m4s сегментов срого по segment_seconds
    /// </summary>
    public bool transcodeH264 { get; set; }

    /// <summary>
    /// конвертировать видео в h.265 > h.264
    /// </summary>
    public bool transcodeH265 { get; set; }

    public bool transcodeAV1 { get; set; }

    public bool transcodeVP9 { get; set; }

    /// <summary>
    /// 14 Мбит/c
    /// </summary>
    public int video_bitrate { get; set; } = 14_000;
}
