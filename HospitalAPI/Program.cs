using HospitalAPI.Data;
using HospitalAPI.Services;
using HospitalAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Data.SqlClient;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "Hospital API", 
        Version = "v1",
        Description = "API for Hospital Management System"
    });
});

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

// Add AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

// Add DbContext with SQLite
builder.Services.AddDbContext<HospitalDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Services
// We'll add services here when we implement them

var app = builder.Build();

// Run data migration on startup
Console.WriteLine("Checking for data migration...");
try
{
    await MigrateDataFromMSSQLToSQLite(builder.Configuration);
}
catch (Exception ex)
{
    Console.WriteLine($"Migration failed: {ex.Message}");
}

// Configure the HTTP request pipeline.
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

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

// Redirect root URL to Swagger UI
app.MapGet("/", () => Results.Redirect("/swagger/index.html", permanent: false));

// Add migration endpoint
app.MapPost("/migrate-data", async (IConfiguration configuration) =>
{
    try
    {
        await MigrateDataFromMSSQLToSQLite(configuration);
        return Results.Ok("Data migration completed successfully!");
    }
    catch (Exception ex)
    {
        return Results.Problem($"Migration failed: {ex.Message}");
    }
});

// Migration method
static async Task MigrateDataFromMSSQLToSQLite(IConfiguration configuration)
{
    var mssqlConnectionString = configuration.GetConnectionString("MSSQLConnection");
    var sqliteConnectionString = configuration.GetConnectionString("DefaultConnection");

    Console.WriteLine("Starting data migration from MSSQL to SQLite...");

    // Test MSSQL connection
    using var mssqlConnection = new SqlConnection(mssqlConnectionString);
    try
    {
        await mssqlConnection.OpenAsync();
        Console.WriteLine("MSSQL connection successful.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"MSSQL connection failed: {ex.Message}");
        return;
    }

    // Create SQLite context
    using var sqliteContext = new HospitalDbContext(new DbContextOptionsBuilder<HospitalDbContext>()
        .UseSqlite(sqliteConnectionString)
        .Options);

    // Clear existing data
    sqliteContext.Events.RemoveRange(sqliteContext.Events);
    sqliteContext.Blogs.RemoveRange(sqliteContext.Blogs);
    sqliteContext.Employees.RemoveRange(sqliteContext.Employees);
    sqliteContext.EmployeeDegrees.RemoveRange(sqliteContext.EmployeeDegrees);
    sqliteContext.EmployeeCertificates.RemoveRange(sqliteContext.EmployeeCertificates);
    sqliteContext.Logos.RemoveRange(sqliteContext.Logos);
    sqliteContext.AboutCarousel.RemoveRange(sqliteContext.AboutCarousel);
    sqliteContext.About.RemoveRange(sqliteContext.About);
    sqliteContext.Contacts.RemoveRange(sqliteContext.Contacts);
    sqliteContext.HomeSections.RemoveRange(sqliteContext.HomeSections);
    sqliteContext.Gallery.RemoveRange(sqliteContext.Gallery);
    await sqliteContext.SaveChangesAsync();

    // Migrate Events
    await MigrateTableAsync<Event>(mssqlConnection, sqliteContext, "Events");
    
    // Migrate Blogs
    await MigrateTableAsync<Blog>(mssqlConnection, sqliteContext, "Blogs");
    
    // Migrate Employees
    await MigrateTableAsync<Employee>(mssqlConnection, sqliteContext, "Employees");
    
    // Migrate EmployeeDegrees
    await MigrateTableAsync<EmployeeDegree>(mssqlConnection, sqliteContext, "Employee_degrees");
    
    // Migrate EmployeeCertificates
    await MigrateTableAsync<EmployeeCertificate>(mssqlConnection, sqliteContext, "Employee_certificates");
    
    // Migrate Logos
    await MigrateTableAsync<Logo>(mssqlConnection, sqliteContext, "Logos");
    
    // Migrate AboutCarousel
    await MigrateTableAsync<AboutCarousel>(mssqlConnection, sqliteContext, "AboutCarousel");
    
    // Migrate About
    await MigrateTableAsync<About>(mssqlConnection, sqliteContext, "About");
    
    // Migrate Contacts
    await MigrateTableAsync<Contact>(mssqlConnection, sqliteContext, "Contacts");
    
    // Migrate HomeSections
    await MigrateTableAsync<HomeSection>(mssqlConnection, sqliteContext, "HomeSections");
    
    // Migrate Gallery
    await MigrateTableAsync<Gallery>(mssqlConnection, sqliteContext, "Gallery");

    Console.WriteLine("Data migration completed successfully!");
}

static async Task MigrateTableAsync<T>(SqlConnection mssqlConnection, HospitalDbContext sqliteContext, string tableName) where T : class
{
    try
    {
        Console.WriteLine($"Migrating {tableName}...");
        
        var query = $"SELECT * FROM {tableName}";
        using var command = new SqlCommand(query, mssqlConnection);
        using var reader = await command.ExecuteReaderAsync();
        
        var records = new List<T>();
        
        while (await reader.ReadAsync())
        {
            var obj = Activator.CreateInstance<T>();
            var properties = typeof(T).GetProperties();
            
            foreach (var property in properties)
            {
                try
                {
                    var columnName = GetColumnName(property.Name);
                    try
                    {
                        var value = reader[columnName];
                        
                        if (value != DBNull.Value)
                        {
                            if (property.PropertyType == typeof(DateTime) && value is string dateString)
                            {
                                if (DateTime.TryParse(dateString, out var dateValue))
                                {
                                    property.SetValue(obj, dateValue);
                                }
                            }
                            else if (property.PropertyType == typeof(bool) && value is int intValue)
                            {
                                property.SetValue(obj, intValue == 1);
                            }
                            else
                            {
                                property.SetValue(obj, value);
                            }
                        }
                    }
                    catch (IndexOutOfRangeException)
                    {
                        // Column doesn't exist, skip
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Warning: Could not set property {property.Name}: {ex.Message}");
                }
            }
            
            records.Add(obj);
        }
        
        if (records.Any())
        {
            var dbSet = sqliteContext.Set<T>();
            await dbSet.AddRangeAsync(records);
            await sqliteContext.SaveChangesAsync();
            Console.WriteLine($"✓ {tableName}: {records.Count} records migrated");
        }
        else
        {
            Console.WriteLine($"- {tableName}: No data found");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"✗ Error migrating {tableName}: {ex.Message}");
    }
}

static string GetColumnName(string propertyName)
{
    return propertyName switch
    {
        "Id" => "Id",
        "Title" => "Title",
        "Subtitle" => "Subtitle",
        "Description" => "Description",
        "LongDescription" => "LongDescription",
        "EventDate" => "EventDate",
        "Time" => "Time",
        "Venue" => "Venue",
        "Trainer" => "Trainer",
        "IsFree" => "IsFree",
        "Price" => "Price",
        "Currency" => "Currency",
        "MainImage" => "MainImage",
        "DetailImageLeft" => "DetailImageLeft",
        "DetailImageMain" => "DetailImageMain",
        "DetailImageRight" => "DetailImageRight",
        "IsMain" => "IsMain",
        "CreatedAt" => "CreatedAt",
        "UpdatedAt" => "UpdatedAt",
        "Number" => "Number",
        "Date" => "Date",
        "Visitors" => "Visitors",
        "SecondDescTitle" => "SecondDescTitle",
        "SecondDescBody" => "SecondDescBody",
        "ThirdTextTitle" => "ThirdTextTitle",
        "ThirdTextBody" => "ThirdTextBody",
        "Image" => "Image",
        "Fullname" => "Fullname",
        "Field" => "Field",
        "Clinic" => "Clinic",
        "DetailImage" => "detail_image",
        "Phone" => "Phone",
        "WhatsApp" => "WhatsApp",
        "Email" => "Email",
        "Location" => "Location",
        "FirstDesc" => "first_desc",
        "SecondDesc" => "second_desc",
        "UniversityName" => "university_name",
        "StartYear" => "start_year",
        "EndYear" => "end_year",
        "CertificateImage" => "certificate_image",
        "CertificateName" => "certificate_name",
        "Name" => "Name",
        "Type" => "Type",
        "Value" => "Value",
        "Icon" => "Icon",
        "Section1Description" => "section_1_description",
        "Section2Image" => "section_2_image",
        "Section3Image" => "section_3_image",
        "Section4Title" => "section_4_title",
        "Section4Description" => "section_4_description",
        "Section4PurposeTitle" => "section_4_purpose_title",
        "Section4PurposeDescription" => "section_4_purpose_description",
        "IsActive" => "IsActive",
        "Img" => "Img",
        _ => propertyName
    };
}

app.Run();
