using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Threading;

namespace Shared.Models.SQL
{
    public partial class ExternalidsContext
    {
        public static readonly SemaphoreSlim semaphore = new SemaphoreSlim(1, 1);

        public static IDbContextFactory<ExternalidsContext> Factory { get; set; }

        public static void Initialization() 
        {
            Directory.CreateDirectory("cache");

            try
            {
                using (var sqlDb = new ExternalidsContext())
                    sqlDb.Database.EnsureCreated();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ExternalidsDb initialization failed: {ex.Message}");
            }
        }

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

        async public Task<int> SaveChangesLocks()
        {
            try
            {
                await semaphore.WaitAsync(TimeSpan.FromSeconds(30));

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
}
