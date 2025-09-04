using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;
using HospitalAPI.Models;

namespace HospitalAPI
{
    public class TestDatabase
    {
        public static async Task TestDatabaseConnection()
        {
            var options = new DbContextOptionsBuilder<HospitalDbContext>()
                .UseSqlite("Data Source=HospitalAPI.db")
                .Options;

            using var context = new HospitalDbContext(options);
            
            try
            {
                Console.WriteLine("Testing database connection...");
                
                // Test basic connection
                var canConnect = await context.Database.CanConnectAsync();
                Console.WriteLine($"Can connect to database: {canConnect}");
                
                if (canConnect)
                {
                    // Test reading from Blogs table
                    var blogCount = await context.Blogs.CountAsync();
                    Console.WriteLine($"Number of blogs in database: {blogCount}");
                    
                    // Test reading from Events table
                    var eventCount = await context.Events.CountAsync();
                    Console.WriteLine($"Number of events in database: {eventCount}");
                    
                    // Test reading from Employees table
                    var employeeCount = await context.Employees.CountAsync();
                    Console.WriteLine($"Number of employees in database: {employeeCount}");
                    
                    // Test creating a new blog entry
                    Console.WriteLine("Testing blog creation...");
                    var newBlog = new Blog
                    {
                        Number = "99",
                        Title = "Test Blog",
                        Description = "This is a test blog entry",
                        Date = DateTime.Now.ToString("yyyy-MM-dd"),
                        Visitors = 0,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    
                    context.Blogs.Add(newBlog);
                    await context.SaveChangesAsync();
                    Console.WriteLine("Successfully created test blog entry");
                    
                    // Clean up test entry
                    context.Blogs.Remove(newBlog);
                    await context.SaveChangesAsync();
                    Console.WriteLine("Successfully cleaned up test blog entry");
                    
                    Console.WriteLine("Database test completed successfully!");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Database test failed: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
            }
        }
    }
}

