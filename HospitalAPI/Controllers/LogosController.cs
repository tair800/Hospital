using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;
using HospitalAPI.Models;
using HospitalAPI.Services;

namespace HospitalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LogosController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public LogosController(HospitalDbContext context)
        {
            _context = context;
        }

        // GET: api/logos - Get all logos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Logo>>> GetLogos()
        {
            try
            {
                var logos = await _context.Logos
                    .OrderBy(l => l.Id)
                    .ToListAsync();
                
                // Format image paths for frontend
                foreach (var logo in logos)
                {
                    logo.Image = ImagePathService.FormatContextualImagePath(logo.Image, "admin");
                }
                
                return Ok(logos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/logos/{id} - Get specific logo
        [HttpGet("{id}")]
        public async Task<ActionResult<Logo>> GetLogo(int id)
        {
            try
            {
                var logo = await _context.Logos.FindAsync(id);

                if (logo == null)
                {
                    return NotFound($"Logo with ID {id} not found");
                }

                return Ok(logo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/logos - Create new logo
        [HttpPost]
        public async Task<ActionResult<Logo>> CreateLogo(Logo logo)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                logo.CreatedAt = DateTime.UtcNow;
                logo.UpdatedAt = DateTime.UtcNow;

                _context.Logos.Add(logo);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetLogo), new { id = logo.Id }, logo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/logos/{id} - Update logo
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLogo(int id, Logo logo)
        {
            try
            {
                if (id != logo.Id)
                {
                    return BadRequest("ID mismatch");
                }

                var existingLogo = await _context.Logos.FindAsync(id);
                if (existingLogo == null)
                {
                    return NotFound($"Logo with ID {id} not found");
                }

                existingLogo.Name = logo.Name;
                existingLogo.Image = logo.Image;
                existingLogo.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/logos/{id} - Delete logo
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLogo(int id)
        {
            try
            {
                var logo = await _context.Logos.FindAsync(id);
                if (logo == null)
                {
                    return NotFound($"Logo with ID {id} not found");
                }

                _context.Logos.Remove(logo);
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
