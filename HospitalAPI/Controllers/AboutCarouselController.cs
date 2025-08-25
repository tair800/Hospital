using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;
using HospitalAPI.Models;

namespace HospitalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AboutCarouselController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public AboutCarouselController(HospitalDbContext context)
        {
            _context = context;
        }

        // GET: api/aboutcarousel - Get all about carousel items
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AboutCarousel>>> GetAboutCarousel()
        {
            try
            {
                var carouselItems = await _context.AboutCarousel
                    .OrderBy(ac => ac.Id)
                    .ToListAsync();
                
                return Ok(carouselItems);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/aboutcarousel/{id} - Get specific about carousel item
        [HttpGet("{id}")]
        public async Task<ActionResult<AboutCarousel>> GetAboutCarouselItem(int id)
        {
            try
            {
                var carouselItem = await _context.AboutCarousel.FindAsync(id);

                if (carouselItem == null)
                {
                    return NotFound($"About carousel item with ID {id} not found");
                }

                return Ok(carouselItem);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/aboutcarousel - Create new about carousel item
        [HttpPost]
        public async Task<ActionResult<AboutCarousel>> CreateAboutCarouselItem(AboutCarousel carouselItem)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                carouselItem.CreatedAt = DateTime.UtcNow;
                carouselItem.UpdatedAt = DateTime.UtcNow;

                _context.AboutCarousel.Add(carouselItem);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetAboutCarouselItem), new { id = carouselItem.Id }, carouselItem);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/aboutcarousel/{id} - Update about carousel item
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAboutCarouselItem(int id, AboutCarousel carouselItem)
        {
            try
            {
                if (id != carouselItem.Id)
                {
                    return BadRequest("ID mismatch");
                }

                var existingCarouselItem = await _context.AboutCarousel.FindAsync(id);
                if (existingCarouselItem == null)
                {
                    return NotFound($"About carousel item with ID {id} not found");
                }

                existingCarouselItem.Name = carouselItem.Name;
                existingCarouselItem.Image = carouselItem.Image;
                existingCarouselItem.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/aboutcarousel/{id} - Delete about carousel item
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAboutCarouselItem(int id)
        {
            try
            {
                var carouselItem = await _context.AboutCarousel.FindAsync(id);
                if (carouselItem == null)
                {
                    return NotFound($"About carousel item with ID {id} not found");
                }

                _context.AboutCarousel.Remove(carouselItem);
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
