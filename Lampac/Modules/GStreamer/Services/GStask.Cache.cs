using GStreamer.Models;
using Microsoft.Win32.SafeHandles;
using Shared.Services.Pools;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;

namespace GStreamer.Services;

public partial class GStask
{
    readonly object segmentCacheLock = new();
    readonly HashSet<int> readySegmentFiles = new();
    readonly Dictionary<int, int> pinnedSegmentFiles = new();

    int clientSegmentIndex = -1;
    string segmentCacheDir;

    int SegmentPast()
        => Math.Max(1, conf.segment_past);

    int SegmentBuffer()
        => Math.Max(2, conf.segment_buffer);

    void InitSegmentCache()
    {
        segmentCacheDir = Path.Combine(
            "cache",
            "gstranscoding",
            id.ToString(CultureInfo.InvariantCulture)
        );

        ClearSegmentCache();

        try
        {
            Directory.CreateDirectory(segmentCacheDir);
        }
        catch { }
    }

    #region SetClientSegmentIndex
    public void SetClientSegmentIndex(int index, bool cacheHit)
    {
        if (index < 0)
            return;

        lock (segmentCacheLock)
        {
            if (cacheHit && clientSegmentIndex >= 0 && index < clientSegmentIndex)
                return;

            clientSegmentIndex = index;

            if (readySegmentFiles.Count == 0)
                return;

            int min = Math.Max(0, clientSegmentIndex - SegmentPast());
            int max = clientSegmentIndex + SegmentBuffer();

            int[] remove = TakeAndRemoveOutsideWindow(
                readySegmentFiles,
                min,
                max
            );

            foreach (int removeIndex in remove)
                TryDeleteFile(SegmentFilePath(removeIndex));
        }
    }
    #endregion

    #region TryOpenSegmentFile
    public bool TryOpenSegmentFile(int index, out CachedSegmentFile file)
    {
        file = default;

        if (index < 0)
            return false;

        lock (segmentCacheLock)
        {
            if (!readySegmentFiles.Contains(index))
                return false;
        }

        string path = SegmentFilePath(index);
        SafeFileHandle handle = null;

        try
        {
            handle = File.OpenHandle(
                path,
                FileMode.Open,
                FileAccess.Read,
                FileShare.Read | FileShare.Delete,
                FileOptions.Asynchronous | FileOptions.SequentialScan
            );

            long length = RandomAccess.GetLength(handle);
            if (length <= 0)
            {
                handle.Dispose();
                handle = null;

                RemoveSegmentFile(index, deleteFile: true);
                return false;
            }

            file = new CachedSegmentFile(length, handle);
            handle = null;

            return true;
        }
        catch (IOException ex)
        {
            handle?.Dispose();

            Serilog.Log.Warning(ex, "Unable to open cached GStreamer segment. Segment={Segment}", index);
            RemoveSegmentFile(index, deleteFile: true);
            return false;
        }
        catch (UnauthorizedAccessException ex)
        {
            handle?.Dispose();

            Serilog.Log.Warning(ex, "Unable to open cached GStreamer segment. Segment={Segment}", index);
            RemoveSegmentFile(index, deleteFile: true);
            return false;
        }
    }
    #endregion

    #region Pin/Unpin SegmentFile
    public void PinSegmentFile(int index)
    {
        if (index < 0)
            return;

        lock (segmentCacheLock)
        {
            pinnedSegmentFiles.TryGetValue(index, out int count);
            pinnedSegmentFiles[index] = count + 1;
        }
    }

    public void UnpinSegmentFile(int index)
    {
        if (index < 0)
            return;

        lock (segmentCacheLock)
        {
            if (!pinnedSegmentFiles.TryGetValue(index, out int count))
                return;

            if (count > 1)
                pinnedSegmentFiles[index] = count - 1;
            else
                pinnedSegmentFiles.Remove(index);
        }
    }
    #endregion

    #region Helpers
    bool StoreSegmentFile(int index, Segment segment)
    {
        if (index < 0 || segment.length <= 0)
            return false;

        lock (segmentCacheLock)
        {
            if (readySegmentFiles.Contains(index))
                return true;
        }

        string path = SegmentFilePath(index);

        try
        {
            if (!WriteSegmentToFile(segment, path))
            {
                System.Threading.Thread.Sleep(200);

                if (!WriteSegmentToFile(segment, path))
                    return false;
            }

            lock (segmentCacheLock)
                readySegmentFiles.Add(index);

            return true;
        }
        catch (Exception ex) when (
            ex is IOException ||
            ex is UnauthorizedAccessException)
        {
            Serilog.Log.Warning(
                ex,
                "Unable to store GStreamer segment file. Segment={Segment}",
                index
            );

            lock (segmentCacheLock)
                readySegmentFiles.Remove(index);

            TryDeleteFile(path);
            return false;
        }
    }

    void ClearSegmentCache()
    {
        lock (segmentCacheLock)
            readySegmentFiles.Clear();

        try
        {
            if (Directory.Exists(segmentCacheDir))
                Directory.Delete(segmentCacheDir, recursive: true);
        }
        catch { }
    }

    void RemoveSegmentFile(int index, bool deleteFile)
    {
        lock (segmentCacheLock)
            readySegmentFiles.Remove(index);

        if (deleteFile)
            TryDeleteFile(SegmentFilePath(index));
    }

    string SegmentFilePath(int index)
    {
        return Path.Combine(
            segmentCacheDir,
            $"{index.ToString(CultureInfo.InvariantCulture)}.m4s"
        );
    }

    int[] TakeAndRemoveOutsideWindow(HashSet<int> set, int min, int max)
    {
        if (set.Count == 0)
            return Array.Empty<int>();

        List<int> remove = null;

        foreach (int index in set)
        {
            if (index >= min && index <= max)
                continue;

            if (pinnedSegmentFiles.ContainsKey(index))
                continue;

            remove ??= new List<int>();
            remove.Add(index);
        }

        if (remove == null)
            return Array.Empty<int>();

        foreach (int index in remove)
            set.Remove(index);

        return remove.ToArray();
    }

    static bool WriteSegmentToFile(Segment segment, string path)
    {
        if (segment.length <= 0)
            return false;

        try
        {
            using var output = new FileStream(
                path,
                new FileStreamOptions
                {
                    Mode = FileMode.Create,
                    Access = FileAccess.Write,
                    Share = FileShare.None,
                    Options = FileOptions.SequentialScan,
                    BufferSize = PoolInvk.msmBlockSize,
                    PreallocationSize = segment.length
                }
            );

            segment.WriteTo(output);

            if (output.Position != segment.length)
            {
                throw new EndOfStreamException(
                    $"Segment writer produced {output.Position} of {segment.length} bytes."
                );
            }

            return true;
        }
        catch (IOException ex)
        {
            Serilog.Log.Warning(ex, "Failed to write file '{Path}'", path);
            TryDeleteFile(path);
            return false;
        }
        catch (UnauthorizedAccessException ex)
        {
            Serilog.Log.Warning(ex, "Failed to write file '{Path}'", path);
            TryDeleteFile(path);
            return false;
        }
        catch
        {
            TryDeleteFile(path);
            throw;
        }
    }

    static void TryDeleteFile(string path)
    {
        try
        {
            File.Delete(path);
        }
        catch { }
    }

    bool SegmentFileReady(int index)
    {
        if (index < 0)
            return false;

        lock (segmentCacheLock)
            return readySegmentFiles.Contains(index);
    }

    bool NeedsSegmentPrefetch(int currentIndex)
    {
        if (currentIndex < 0)
            return false;

        int buffer = SegmentBuffer();

        lock (segmentCacheLock)
        {
            for (int index = currentIndex + 1; index <= currentIndex + buffer; index++)
            {
                if (!readySegmentFiles.Contains(index))
                    return true;
            }
        }

        return false;
    }

    int ClientSegmentIndex()
    {
        lock (segmentCacheLock)
            return clientSegmentIndex;
    }
    #endregion
}
