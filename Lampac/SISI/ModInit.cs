using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Shared.Models.AppConf;
using Shared.Models.Events;
using Shared.Models.Module;
using Shared.Models.Module.Interfaces;
using System.Threading;

namespace SISI;

public class ModInit : IModuleLoaded, IModuleConfigure
{
    public static string modpath;
    public static ModuleConf conf;
    private static Timer cleanupTimer;

    public void Configure(ConfigureModel app)
    {
        app.services.AddDbContextFactory<SisiContext>(SisiContext.ConfiguringDbBuilder);
    }

    public void Loaded(InitspaceModel baseconf)
    {
        modpath = baseconf.path;

        updateConf();
        EventListener.UpdateInitFile += updateConf;

        foreach (var m in conf.limit_map)
            CoreInit.conf.WAF.limit_map.Insert(0, m);

        Directory.CreateDirectory("wwwroot/bookmarks/img");
        Directory.CreateDirectory("wwwroot/bookmarks/preview");

        cleanupTimer = new Timer(_ => CleanupHistory(), null, TimeSpan.FromMinutes(5), TimeSpan.FromDays(1));

        SisiContext.Initialization(baseconf.app.ApplicationServices);
    }

    public void Dispose()
    {
        EventListener.UpdateInitFile -= updateConf;
    }

    void updateConf()
    {
        conf = ModuleInvoke.Init("sisi", new ModuleConf()
        {
            spider = true,
            lgbt = true,
            component = "sisi",
            iconame = "",
            push_all = true,
            bookmarks = new BookmarksConf() { saveimage = true, savepreview = true },
            history = new HistoryConf() { enable = true, days = 30 },
            limit_map = new List<WafLimitRootMap>
            {
                new("^/(sisi|bgs|chu|runetki|elo|epr|hqr|phub|ptx|sbg|tizam|xmr|xnx|xds)", new WafLimitMap { limit = 5, second = 1, pathId = true })
            }
        });

    }


    static int _updatingDb = 0;
    private static void CleanupHistory()
    {
        if (Interlocked.Exchange(ref _updatingDb, 1) == 1)
            return;

        try
        {
            var threshold = DateTime.UtcNow.AddDays(-conf.history.days);

            using (var sqlDb = new SisiContext())
            {
                sqlDb.historys
                    .AsNoTracking()
                    .Where(i => i.created < threshold)
                    .ExecuteDelete();
            }
        }
        catch (Exception ex)
        {
            Serilog.Log.Error(ex, "CatchId={CatchId}", "id_6dc40a56");
        }
        finally
        {
            Volatile.Write(ref _updatingDb, 0);
        }
    }
}
