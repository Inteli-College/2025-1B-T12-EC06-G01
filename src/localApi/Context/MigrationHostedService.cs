// Context/MigrationHostedService.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace localApi.Context
{
    public class MigrationHostedService : IHostedService
    {
        private readonly IServiceProvider _provider;
        public MigrationHostedService(IServiceProvider provider)
        {
            _provider = provider;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            using var scope = _provider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            await db.Database.MigrateAsync(cancellationToken);
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }
}
