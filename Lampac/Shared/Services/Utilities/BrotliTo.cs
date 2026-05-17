using System.IO.Compression;
using System.Text;

namespace Shared.Services.Utilities;

public static class BrotliTo
{
    static readonly Serilog.ILogger Log = Serilog.Log.ForContext("SourceContext", nameof(BrotliTo));

    static readonly object lockObj = new object();


    #region Compress byte[]
    public static byte[] Compress(string value)
    {
        return Compress(Encoding.UTF8.GetBytes(value));
    }

    public static byte[] Compress(in byte[] value)
    {
        try
        {
            using (var input = new MemoryStream(value))
            {
                using (var output = new MemoryStream())
                {
                    try
                    {
                        using (var stream = new BrotliStream(output, CompressionLevel.Fastest))
                            input.CopyTo(stream);

                        return output.ToArray();
                    }
                    catch { return null; }
                }
            }
        }
        catch { return null; }
    }
    #endregion

    #region Compress file
    public static void Compress(string outfile, string value)
    {
        Compress(outfile, Encoding.UTF8.GetBytes(value));
    }

    public static void Compress(string outfile, in byte[] value)
    {
        try
        {
            lock (lockObj)
            {
                using (var input = new MemoryStream(value))
                {
                    using (var output = new FileStream(outfile, FileMode.Create, FileAccess.Write, FileShare.None, bufferSize: PoolInvk.bufferSize, options: FileOptions.Asynchronous))
                    {
                        try
                        {
                            using (var stream = new BrotliStream(output, CompressionLevel.Fastest))
                                input.CopyTo(stream);
                        }
                        catch (System.Exception ex)
                        {
                            Log.Error(ex, "CatchId={CatchId}", "id_wn78ucku");
                        }
                    }
                }
            }
        }
        catch (System.Exception ex)
        {
            Log.Error(ex, "CatchId={CatchId}", "id_kvw2gwpv");
        }
    }
    #endregion

    #region CompressAsync file
    public static Task CompressAsync(string outfile, string value)
    {
        return CompressAsync(outfile, Encoding.UTF8.GetBytes(value));
    }

    async public static Task CompressAsync(string outfile, byte[] value)
    {
        try
        {
            using (var input = new MemoryStream(value))
            {
                await using (var output = new FileStream(outfile, FileMode.Create, FileAccess.Write, FileShare.None, bufferSize: PoolInvk.bufferSize, options: FileOptions.Asynchronous))
                {
                    try
                    {
                        using (var stream = new BrotliStream(output, CompressionLevel.Fastest))
                            await input.CopyToAsync(stream);
                    }
                    catch (System.Exception ex)
                    {
                        Log.Error(ex, "CatchId={CatchId}", "id_bihrczq3");
                    }
                }
            }
        }
        catch (System.Exception ex)
        {
            Log.Error(ex, "CatchId={CatchId}", "id_tltvjmup");
        }
    }

    async public static Task CompressAsync(string outfile, MemoryStream value)
    {
        try
        {
            await using (var output = new FileStream(outfile, FileMode.Create, FileAccess.Write, FileShare.None, bufferSize: PoolInvk.bufferSize, options: FileOptions.Asynchronous))
            {
                try
                {
                    using (var stream = new BrotliStream(output, CompressionLevel.Fastest))
                        await value.CopyToAsync(stream);
                }
                catch (System.Exception ex)
                {
                    Log.Error(ex, "CatchId={CatchId}", "id_a470yb8x");
                }
            }
        }
        catch (System.Exception ex)
        {
            Log.Error(ex, "CatchId={CatchId}", "id_o6e4r31c");
        }
    }
    #endregion

    #region Decompress byte[]
    public static string Decompress(in byte[] value)
    {
        try
        {
            using (var input = new MemoryStream(value))
            {
                using (var output = new MemoryStream())
                {
                    try
                    {
                        using (var stream = new BrotliStream(input, CompressionMode.Decompress))
                            stream.CopyTo(output);

                        return Encoding.UTF8.GetString(output.ToArray());
                    }
                    catch { return null; }
                }
            }
        }
        catch { return null; }
    }
    #endregion

    #region Decompress file
    public static string Decompress(string infile)
    {
        try
        {
            byte[] array = DecompressArray(infile);
            if (array == null)
                return null;

            return Encoding.UTF8.GetString(array);
        }
        catch { return null; }
    }

    public static byte[] DecompressArray(string infile)
    {
        try
        {
            lock (lockObj)
            {
                using (var input = new FileStream(infile, FileMode.Open, FileAccess.Read))
                {
                    using (var output = new MemoryStream())
                    {
                        try
                        {
                            using (var stream = new BrotliStream(input, CompressionMode.Decompress))
                                stream.CopyTo(output);

                            return output.ToArray();
                        }
                        catch { return null; }
                    }
                }
            }
        }
        catch { return null; }
    }
    #endregion

    #region DecompressAsync file
    async public static Task<string> DecompressAsync(string infile)
    {
        try
        {
            byte[] array = await DecompressArrayAsync(infile);
            if (array == null)
                return null;

            return Encoding.UTF8.GetString(array);
        }
        catch { return null; }
    }

    public static async Task<byte[]> DecompressArrayAsync(string infile)
    {
        try
        {
            await using (var input = new FileStream(infile, FileMode.Open, FileAccess.Read))
            {
                using (var output = new MemoryStream())
                {
                    try
                    {
                        using (var stream = new BrotliStream(input, CompressionMode.Decompress))
                            await stream.CopyToAsync(output);

                        return output.ToArray();
                    }
                    catch { return null; }
                }
            }
        }
        catch { return null; }
    }
    #endregion
}
