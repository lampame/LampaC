using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.ComponentModel.DataAnnotations;
using System.IO;

namespace TimeCode;

public class SqlContext : DbContext
{
    public static readonly string semaphoreKey = "TimeCode";

    public static IDbContextFactory<SqlContext> Factory { get; private set; }

    public static SqlContext Create()
    {
        if (Factory != null)
            return Factory.CreateDbContext();

        return new SqlContext();
    }

    public static void Initialization(IServiceProvider applicationServices)
    {
        Directory.CreateDirectory("database");

        Factory = applicationServices.GetService<IDbContextFactory<SqlContext>>();

        using (var sqlDb = new SqlContext())
            sqlDb.Database.EnsureCreated();
    }

    static readonly string _connection = new SqliteConnectionStringBuilder
    {
        DataSource = "database/TimeCode.sql",
        Cache = SqliteCacheMode.Shared,
        DefaultTimeout = 10,
        Pooling = true
    }.ToString();

    public DbSet<SqlModel> timecodes { get; set; }

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
        modelBuilder.Entity<SqlModel>()
                    .HasIndex(t => new { t.user, t.card, t.item })
                    .IsUnique();
    }
}

public class SqlModel
{
    [Key]
    public long Id { get; set; }

    [Required]
    public string user { get; set; }

    [Required]
    public string card { get; set; }

    [Required]
    public string item { get; set; }

    public string data { get; set; }

    public DateTime updated { get; set; }
}
