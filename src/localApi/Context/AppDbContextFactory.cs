using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace localApi.Context
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            // Carrega o appsettings.json da raiz do projeto
            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var opts = new DbContextOptionsBuilder<AppDbContext>()
                .UseNpgsql(config.GetConnectionString("DefaultConnection"));

            return new AppDbContext(opts.Options);
        }
    }
}
