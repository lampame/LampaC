using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.ComponentModel.DataAnnotations;

namespace SISI;

public partial class SisiContext
{
    public static readonly string semaphoreKey = "SisiContext";

    public static IDbContextFactory<SisiContext> Factory { get; set; }

    public static void Initialization(IServiceProvider applicationServices)
    {
        Directory.CreateDirectory("database");

        Factory = applicationServices.GetService<IDbContextFactory<SisiContext>>();

        using (var sqlDb = new SisiContext())
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


public partial class SisiContext : DbContext
{
    public DbSet<SisiBookmarkSqlModel> bookmarks { get; set; }

    public DbSet<SisiHistorySqlModel> historys { get; set; }

    static readonly string _connection = new SqliteConnectionStringBuilder
    {
        DataSource = "database/Sisi.sql",
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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<SisiBookmarkSqlModel>()
                    .HasIndex(b => new { b.user, b.uid })
                    .IsUnique();

        modelBuilder.Entity<SisiHistorySqlModel>()
                    .HasIndex(h => new { h.user, h.uid })
                    .IsUnique();
    }
}

public class SisiBookmarkSqlModel
{
    [Key]
    public long Id { get; set; }

    [Required]
    public string user { get; set; }

    [Required]
    public string uid { get; set; }

    public DateTime created { get; set; }

    public string json { get; set; }

    public string name { get; set; }

    public string model { get; set; }
}

public class SisiHistorySqlModel
{
    [Key]
    public long Id { get; set; }

    [Required]
    public string user { get; set; }

    [Required]
    public string uid { get; set; }

    public DateTime created { get; set; }

    public string json { get; set; }
}
