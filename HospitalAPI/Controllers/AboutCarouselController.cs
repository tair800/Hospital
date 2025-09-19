using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;
using HospitalAPI.Models;
using HospitalAPI.Services;

namespace HospitalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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
            var carouselItems = await _context.AboutCarousel
                .OrderBy(c => c.CreatedAt)
                .ToListAsync();

            // Format image paths for frontend
            foreach (var item in carouselItems)
            {
                item.Image = ImagePathService.FormatContextualImagePath(item.Image, "admin");
            }

            return Ok(carouselItems);
        }

        // GET: api/aboutcarousel/{id} - Get specific about carousel item
        [HttpGet("{id}")]
        public async Task<ActionResult<AboutCarousel>> GetAboutCarouselItem(int id)
        {
            var carouselItem = await _context.AboutCarousel.FindAsync(id);

            if (carouselItem == null)
            {
                return NotFound();
            }

            return Ok(carouselItem);
        }

        // POST: api/aboutcarousel - Create new about carousel item
        [HttpPost]
        public async Task<ActionResult<AboutCarousel>> CreateAboutCarouselItem(AboutCarousel carouselItem)
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

        // PUT: api/aboutcarousel/{id} - Update about carousel item
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAboutCarouselItem(int id, AboutCarousel carouselItem)
        {
            if (id != carouselItem.Id)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingCarouselItem = await _context.AboutCarousel.FindAsync(id);
            if (existingCarouselItem == null)
            {
                return NotFound();
            }

            existingCarouselItem.Name = carouselItem.Name;
            existingCarouselItem.Image = carouselItem.Image;
            existingCarouselItem.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AboutCarouselItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/aboutcarousel/{id} - Delete about carousel item
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAboutCarouselItem(int id)
        {
            var carouselItem = await _context.AboutCarousel.FindAsync(id);
            if (carouselItem == null)
            {
                return NotFound();
            }

            _context.AboutCarousel.Remove(carouselItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AboutCarouselItemExists(int id)
        {
            return _context.AboutCarousel.Any(e => e.Id == id);
        }
    }
}
