using Microsoft.EntityFrameworkCore;
using HospitalAPI.Models;
using HospitalAPI.Data;

namespace HospitalAPI
{
    public static class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using var context = new HospitalDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<HospitalDbContext>>());
            
            SeedDataInternal(context);
        }
        
        public static void Initialize(HospitalDbContext context)
        {
            SeedDataInternal(context);
        }
        
        private static void SeedDataInternal(HospitalDbContext context)
        {
            // Check if data already exists
            if (context.Events.Any())
            {
                return; // Data already seeded
            }

        }
    }
}
