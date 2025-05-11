using System;
using Microsoft.EntityFrameworkCore;
using YourApp.Data.Models;

namespace localApi.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        { }

        // agora mapeamos todas as entidades do modelo
        public DbSet<User> Users { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<Log> Logs { get; set; }

        // fallback para design-time ou ENV var
        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            if (!options.IsConfigured)
            {
                var conn = Environment.GetEnvironmentVariable("DATABASE_URL");
                options.UseNpgsql(conn);
            }
        }
    }
}
