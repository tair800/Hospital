using HospitalAPI.Data;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Upload limit
builder.Services.Configure<IISServerOptions>(o => o.MaxRequestBodySize = 100 * 1024 * 1024);
builder.Services.Configure<FormOptions>(o => o.MultipartBodyLengthLimit = 100 * 1024 * 1024);

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Hospital API",
        Version = "v1",
        Description = "API for Hospital Management System"
    });
});

//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowAll", p =>
//        p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
//});

builder.Services.AddAutoMapper(typeof(Program));

builder.Services.AddDbContext<HospitalDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// ✅ DB init: Yalnız Migrate(); EnsureCreated() istifadə ETMƏ
using (var scope = app.Services.CreateScope())
{
    var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("DbInit");
    var db = scope.ServiceProvider.GetRequiredService<HospitalDbContext>();
    try
    {
        var pending = await db.Database.GetPendingMigrationsAsync();
        if (pending.Any())
        {
            logger.LogInformation("Applying {Count} pending migrations...", pending.Count());
            await db.Database.MigrateAsync();
        }

        // Seed həmişə idempotent olsun (dublikat yaratmasın)
        await HospitalAPI.SeedEventData.SeedAsync(db);

        logger.LogInformation("Database initialized successfully");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Database initialization failed");
        // ❗ Burada throw etməsən systemd loop-a düşməyəcək; istəsən app-i dayandırma
        // throw;
    }
}

// Reverse proxy-dən gələn başlıqlar (Nginx arxasında tövsiyə olunur)
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Hospital API v1");
        c.RoutePrefix = "swagger";
        c.DocumentTitle = "Hospital API Documentation";
        c.DefaultModelsExpandDepth(2);
        c.DefaultModelExpandDepth(2);
    });
}

// Nginx HTTPS terminasiya edirsə, UseHttpsRedirection zəruri deyil (qoya da bilərsən)
app.UseHttpsRedirection();
//app.UseCors("AllowAll");

app.UseStaticFiles(); // wwwroot
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads")),
    RequestPath = "/uploads"
});

app.UseAuthorization();
app.MapControllers();
app.MapGet("/", () => Results.Redirect("/swagger/index.html", permanent: false));

app.Run();
