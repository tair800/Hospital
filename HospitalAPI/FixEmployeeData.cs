using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;
using HospitalAPI.Models;

namespace HospitalAPI
{
    public class FixEmployeeData
    {
        public static async Task FixEmployeeIds()
        {
            var options = new DbContextOptionsBuilder<HospitalDbContext>()
                .UseSqlite("Data Source=HospitalAPI.db")
                .Options;

            using var context = new HospitalDbContext(options);
            
            try
            {
                Console.WriteLine("Starting to fix employee IDs...");
                
                // Get all employees
                var employees = await context.Employees.ToListAsync();
                Console.WriteLine($"Found {employees.Count} employees");
                
                // Get all degrees with employeeId = 0
                var degreesWithZeroId = await context.EmployeeDegrees
                    .Where(d => d.EmployeeId == 0)
                    .ToListAsync();
                Console.WriteLine($"Found {degreesWithZeroId.Count} degrees with employeeId = 0");
                
                // Get all certificates with employeeId = 0
                var certificatesWithZeroId = await context.EmployeeCertificates
                    .Where(c => c.EmployeeId == 0)
                    .ToListAsync();
                Console.WriteLine($"Found {certificatesWithZeroId.Count} certificates with employeeId = 0");
                
                // Assign degrees to employees in order
                for (int i = 0; i < degreesWithZeroId.Count && i < employees.Count; i++)
                {
                    degreesWithZeroId[i].EmployeeId = employees[i].Id;
                    Console.WriteLine($"Assigned degree {degreesWithZeroId[i].Id} to employee {employees[i].Id} ({employees[i].Fullname})");
                }
                
                // Assign certificates to employees in order
                for (int i = 0; i < certificatesWithZeroId.Count && i < employees.Count; i++)
                {
                    certificatesWithZeroId[i].EmployeeId = employees[i].Id;
                    Console.WriteLine($"Assigned certificate {certificatesWithZeroId[i].Id} to employee {employees[i].Id} ({employees[i].Fullname})");
                }
                
                // Save changes
                await context.SaveChangesAsync();
                Console.WriteLine("Successfully updated employee IDs!");
                
                // Verify the fix
                var updatedDegrees = await context.EmployeeDegrees
                    .Where(d => d.EmployeeId > 0)
                    .ToListAsync();
                var updatedCertificates = await context.EmployeeCertificates
                    .Where(c => c.EmployeeId > 0)
                    .ToListAsync();
                
                Console.WriteLine($"After fix: {updatedDegrees.Count} degrees with valid employeeId");
                Console.WriteLine($"After fix: {updatedCertificates.Count} certificates with valid employeeId");
                
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fixing employee IDs: {ex.Message}");
                throw;
            }
        }
    }
}
