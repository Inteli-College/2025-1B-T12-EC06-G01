// Program.cs
using Microsoft.EntityFrameworkCore;
using localApi.Context;  // Namespace do seu AppDbContext e MigrationHostedService

var builder = WebApplication.CreateBuilder(args);

// registra o DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// opcional: aplica migrations automaticamente
builder.Services.AddHostedService<MigrationHostedService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();
app.Run();
