using Microsoft.AspNetCore.Mvc;
using HospitalAPI.Models;
using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;
using System.Text.Json;

namespace HospitalAPI.Controllers
{
    [ApiController]
    [Route("api/employee-degrees")]
    public class EmployeeDegreeController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public EmployeeDegreeController(HospitalDbContext context)
        {
            _context = context;
        }

        // GET: api/employee-degrees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeDegree>>> GetEmployeeDegrees()
        {
            return await _context.EmployeeDegrees.ToListAsync();
        }

        // GET: api/employee-degrees/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EmployeeDegree>> GetEmployeeDegree(int id)
        {
            var employeeDegree = await _context.EmployeeDegrees.FindAsync(id);

            if (employeeDegree == null)
            {
                return NotFound();
            }

            return employeeDegree;
        }

        // POST: api/employee-degrees
        [HttpPost]
        public async Task<ActionResult<EmployeeDegree>> PostEmployeeDegree(EmployeeDegree employeeDegree)
        {
            _context.EmployeeDegrees.Add(employeeDegree);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEmployeeDegree", new { id = employeeDegree.Id }, employeeDegree);
        }

        // PUT: api/employee-degrees/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmployeeDegree(int id, [FromBody] JsonElement updateData)
        {
            var existingDegree = await _context.EmployeeDegrees.FindAsync(id);
            if (existingDegree == null)
            {
                return NotFound();
            }

            // Update only provided fields
            if (updateData.TryGetProperty("universityName", out JsonElement uniEl))
            {
                existingDegree.UniversityName = uniEl.GetString();
            }

            if (updateData.TryGetProperty("startYear", out JsonElement startEl))
            {
                if (startEl.ValueKind == JsonValueKind.Number && startEl.TryGetInt32(out int startYear))
                {
                    existingDegree.StartYear = startYear;
                }
                else if (startEl.ValueKind == JsonValueKind.String && int.TryParse(startEl.GetString(), out int startYearStr))
                {
                    existingDegree.StartYear = startYearStr;
                }
            }

            if (updateData.TryGetProperty("endYear", out JsonElement endEl))
            {
                if (endEl.ValueKind == JsonValueKind.Number && endEl.TryGetInt32(out int endYear))
                {
                    existingDegree.EndYear = endYear;
                }
                else if (endEl.ValueKind == JsonValueKind.String && int.TryParse(endEl.GetString(), out int endYearStr))
                {
                    existingDegree.EndYear = endYearStr;
                }
            }

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Degree updated successfully", degree = existingDegree });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeDegreeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        // DELETE: api/employee-degrees/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployeeDegree(int id)
        {
            var employeeDegree = await _context.EmployeeDegrees.FindAsync(id);
            if (employeeDegree == null)
            {
                return NotFound();
            }

            _context.EmployeeDegrees.Remove(employeeDegree);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EmployeeDegreeExists(int id)
        {
            return _context.EmployeeDegrees.Any(e => e.Id == id);
        }
    }
}
