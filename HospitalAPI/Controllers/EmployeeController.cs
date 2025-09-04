using Microsoft.AspNetCore.Mvc;
using HospitalAPI.Models;
using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;
using HospitalAPI.Services;

namespace HospitalAPI.Controllers
{
    [ApiController]
    [Route("api/employees")]
    public class EmployeeController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public EmployeeController(HospitalDbContext context)
        {
            _context = context;
        }

        // GET: api/employees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {
            var employees = await _context.Employees.ToListAsync();
            
            // Format image paths for frontend
            foreach (var employee in employees)
            {
                employee.Image = ImagePathService.FormatContextualImagePath(employee.Image, "employee");
                employee.DetailImage = ImagePathService.FormatContextualImagePath(employee.DetailImage, "employee");
            }
            
            return Ok(employees);
        }

        // GET: api/employees/recent - Get recent employees (last 5)
        [HttpGet("recent")]
        public async Task<ActionResult<IEnumerable<Employee>>> GetRecentEmployees()
        {
            var recentEmployees = await _context.Employees
                .OrderByDescending(e => e.CreatedAt)
                .Take(5)
                .ToListAsync();
            
            // Format image paths for frontend
            foreach (var employee in recentEmployees)
            {
                employee.Image = ImagePathService.FormatContextualImagePath(employee.Image, "employee");
                employee.DetailImage = ImagePathService.FormatContextualImagePath(employee.DetailImage, "employee");
            }
            
            return Ok(recentEmployees);
        }

        // GET: api/employees/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            
            if (employee == null)
            {
                return NotFound();
            }
            
            // Manually fetch related data
            employee.Degrees = await _context.EmployeeDegrees
                .Where(ed => ed.EmployeeId == id)
                .ToListAsync();
                
            employee.Certificates = await _context.EmployeeCertificates
                .Where(ec => ec.EmployeeId == id)
                .ToListAsync();
            
            // Format image paths for frontend
            employee.Image = ImagePathService.FormatContextualImagePath(employee.Image, "employee");
            employee.DetailImage = ImagePathService.FormatContextualImagePath(employee.DetailImage, "employee");
            
            return employee;
        }

        // POST: api/employees
        [HttpPost]
        public async Task<ActionResult<Employee>> CreateEmployee(Employee employee)
        {
            employee.CreatedAt = DateTime.UtcNow;
            employee.UpdatedAt = DateTime.UtcNow;
            
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            
            return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employee);
        }

        // PUT: api/employees/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, Employee employee)
        {
            if (id != employee.Id)
            {
                return BadRequest();
            }

            var existingEmployee = await _context.Employees.FindAsync(id);
            if (existingEmployee == null)
            {
                return NotFound();
            }

            existingEmployee.Fullname = employee.Fullname;
            existingEmployee.Field = employee.Field;
            existingEmployee.Clinic = employee.Clinic;
            existingEmployee.Image = employee.Image;
            existingEmployee.DetailImage = employee.DetailImage;
            existingEmployee.Phone = employee.Phone;
            existingEmployee.WhatsApp = employee.WhatsApp;
            existingEmployee.Email = employee.Email;
            existingEmployee.Location = employee.Location;
            existingEmployee.FirstDesc = employee.FirstDesc;
            existingEmployee.SecondDesc = employee.SecondDesc;
            existingEmployee.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(existingEmployee);
        }

        // DELETE: api/employees/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EmployeeExists(int id)
        {
            return _context.Employees.Any(e => e.Id == id);
        }
    }
}
