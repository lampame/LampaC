using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Shared.Services;
using System;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Threading.Tasks;

namespace Online;

public partial class ExternalidsContext
{
    public static readonly string semaphoreKey = "ExternalidsContext";

    public static IDbContextFactory<ExternalidsContext> Factory { get; set; }

    public static void Initialization(IServiceProvider applicationServices)
    {
        Directory.CreateDirectory("cache");

        Factory = applicationServices.GetService<IDbContextFactory<ExternalidsContext>>();

        using (var sqlDb = new ExternalidsContext())
            sqlDb.Database.EnsureCreated();
    }

    async public Task<int> SaveChangesLocks()
    {
        var semaphore = new SemaphorManager(semaphoreKey, TimeSpan.FromSeconds(30));

        try
        {
            bool _acquired = await semaphore.WaitAsync();
            if (!_acquired)
                return 0;

            return await base.SaveChangesAsync();
        }
        catch
        {
            return 0;
        }
        finally
        {
            semaphore.Release();
        }
    }
}


public partial class ExternalidsContext : DbContext
{
    public DbSet<ExternalidsSqlModel> imdb { get; set; }

    public DbSet<ExternalidsSqlModel> kinopoisk { get; set; }

    static readonly string _connection = new SqliteConnectionStringBuilder
    {
        DataSource = "cache/Externalids.sql",
        Cache = SqliteCacheMode.Shared,
        DefaultTimeout = 10,
        Pooling = true
    }.ToString();

    public static void ConfiguringDbBuilder(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseSqlite(_connection);
            optionsBuilder.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
        }
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        ConfiguringDbBuilder(optionsBuilder);
    }
}

public class ExternalidsSqlModel
{
    [Key]
    public string Id { get; set; }

    public string value { get; set; }
}
