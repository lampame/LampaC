using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Caching.Memory;
using Shared.Models;

namespace Shared
{
    public class Startup
    {
        public static bool IsShutdown { get; set; }

        public static INws Nws { get; set; }

        public static ISoks WS { get; set; }

        public static AppReload appReload { get; private set; }

        public static IServiceProvider ApplicationServices { get; private set; }

        public static IMemoryCache memoryCache { get; private set; }

        public static void Configure(AppReload reload, INws nws, ISoks ws)
        {
            appReload = reload;
            Nws = nws;
            WS = ws;
        }

        public static void Configure(IApplicationBuilder app, IMemoryCache mem)
        {
            ApplicationServices = app.ApplicationServices;
            memoryCache = mem;
        }
    }


    public class AppReload
    {
        public Action InkvReload { get; set; }

        public void Reload()
        {
            if (InkvReload == null)
                return;

            InkvReload();
        }
    }
}
