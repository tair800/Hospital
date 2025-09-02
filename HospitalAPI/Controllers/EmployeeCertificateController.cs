using Microsoft.AspNetCore.Mvc;
using HospitalAPI.Models;
using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;
using System.Text.Json;

namespace HospitalAPI.Controllers
{
    [ApiController]
    [Route("api/employee-certificates")]
    public class EmployeeCertificateController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public EmployeeCertificateController(HospitalDbContext context)
        {
            _context = context;
        }

        // GET: api/employee-certificates
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeCertificate>>> GetEmployeeCertificates()
        {
            return await _context.EmployeeCertificates.ToListAsync();
        }

        // GET: api/employee-certificates/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EmployeeCertificate>> GetEmployeeCertificate(int id)
        {
            var employeeCertificate = await _context.EmployeeCertificates.FindAsync(id);

            if (employeeCertificate == null)
            {
                return NotFound();
            }

            return employeeCertificate;
        }

        // POST: api/employee-certificates
        [HttpPost]
        public async Task<ActionResult<EmployeeCertificate>> PostEmployeeCertificate(EmployeeCertificate employeeCertificate)
        {
            _context.EmployeeCertificates.Add(employeeCertificate);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEmployeeCertificate", new { id = employeeCertificate.Id }, employeeCertificate);
        }

        // PUT: api/employee-certificates/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmployeeCertificate(int id, [FromBody] JsonElement updateData)
        {
            var existingCertificate = await _context.EmployeeCertificates.FindAsync(id);
            if (existingCertificate == null)
            {
                return NotFound();
            }

            // Update only the fields that are provided
            if (updateData.TryGetProperty("certificateName", out JsonElement nameElement))
            {
                existingCertificate.CertificateName = nameElement.GetString();
            }
            
            if (updateData.TryGetProperty("certificateImage", out JsonElement imageElement))
            {
                existingCertificate.CertificateImage = imageElement.GetString();
            }

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Certificate updated successfully", certificate = existingCertificate });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeCertificateExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        // DELETE: api/employee-certificates/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployeeCertificate(int id)
        {
            var employeeCertificate = await _context.EmployeeCertificates.FindAsync(id);
            if (employeeCertificate == null)
            {
                return NotFound();
            }

            _context.EmployeeCertificates.Remove(employeeCertificate);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EmployeeCertificateExists(int id)
        {
            return _context.EmployeeCertificates.Any(e => e.Id == id);
        }
    }
}
