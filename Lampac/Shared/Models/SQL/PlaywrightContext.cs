using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Shared.Models.SQL;

public partial class PlaywrightContext
{
    public static void Initialization()
    {
        Directory.CreateDirectory("cache");

        using (var sqlDb = new PlaywrightContext())
            sqlDb.Database.EnsureCreated();
    }
}


public partial class PlaywrightContext : DbContext
{
    public DbSet<PlaywrightSqlModel> files { get; set; }

    static readonly string _connection = new SqliteConnectionStringBuilder
    {
        DataSource = "cache/Playwright.sql",
        Cache = SqliteCacheMode.Shared,
        DefaultTimeout = 10,
        Pooling = true
    }.ToString();

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite(_connection);
        optionsBuilder.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
    }
}

public class PlaywrightSqlModel
{
    [Key]
    public string Id { get; set; }

    public DateTime ex { get; set; }

    public byte[] content { get; set; }

    public string headers { get; set; }
}
