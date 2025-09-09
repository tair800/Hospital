using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;
using HospitalAPI.Models;

namespace HospitalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventEmployeesController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public EventEmployeesController(HospitalDbContext context)
        {
            _context = context;
        }

        // GET: api/eventemployees/event/{eventId}
        [HttpGet("event/{eventId}")]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployeesByEvent(int eventId)
        {
            try
            {
                // Join explicitly on EmployeeId to avoid shadow FK issues (EmployeeId1)
                var employees = await _context.EventEmployees
                    .Where(ee => ee.EventId == eventId)
                    .Join(_context.Employees,
                          ee => ee.EmployeeId,
                          e  => e.Id,
                          (ee, e) => e)
                    .ToListAsync();

                return Ok(employees);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/eventemployees
        [HttpPost]
        public async Task<ActionResult<EventEmployee>> CreateEventEmployee(EventEmployee eventEmployee)
        {
            try
            {
                _context.EventEmployees.Add(eventEmployee);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetEventEmployee), new { id = eventEmployee.Id }, eventEmployee);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/eventemployees/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<EventEmployee>> GetEventEmployee(int id)
        {
            try
            {
                var eventEmployee = await _context.EventEmployees
                    .Include(ee => ee.Event)
                    .Include(ee => ee.Employee)
                    .FirstOrDefaultAsync(ee => ee.Id == id);

                if (eventEmployee == null)
                {
                    return NotFound();
                }

                return Ok(eventEmployee);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/eventemployees/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEventEmployee(int id)
        {
            try
            {
                var eventEmployee = await _context.EventEmployees.FindAsync(id);
                if (eventEmployee == null)
                {
                    return NotFound();
                }

                _context.EventEmployees.Remove(eventEmployee);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
