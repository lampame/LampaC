using Shared;
using Shared.Engine;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace Lampac.Engine.CRON
{
    public static class KurwaCron
    {
        public static void Run()
        {
            _cronTimer = new Timer(cron, null, TimeSpan.FromMinutes(20), TimeSpan.FromHours(5));
        }

        static Timer _cronTimer;

        static bool _cronWork = false;

        async static void cron(object state)
        {
            if (_cronWork)
                return;

            _cronWork = true;

            try
            {
                await DownloadBigJson("externalids");
                await DownloadBigJson("cdnmovies");
                await DownloadBigJson("lumex");
                await DownloadBigJson("veoveo");
                await DownloadBigJson("kodik");
            }
            finally
            {
                _cronWork = false;
            }
        }

        async static Task DownloadBigJson(string path)
        {
            try
            {
                using (var ms = PoolInvk.msm.GetStream())
                {
                    bool success = await Http.DownloadToStream(ms, $"http://194.246.82.144/{path}.json");
                    if (success)
                    {
                        using (var fileStream = new FileStream($"data/{path}.json", FileMode.Create, FileAccess.Write, FileShare.None, PoolInvk.bufferSize))
                            await ms.CopyToAsync(fileStream, PoolInvk.bufferSize);
                    }
                }
            }
            catch { }
        }
    }
}
