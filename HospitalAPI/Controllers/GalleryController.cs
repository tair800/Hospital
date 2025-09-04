using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;
using HospitalAPI.Models;
using HospitalAPI.Services;

namespace HospitalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GalleryController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public GalleryController(HospitalDbContext context)
        {
            _context = context;
        }

        // GET: api/gallery
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Gallery>>> GetGallery()
        {
            try
            {
                var gallery = await _context.Gallery
                    .Where(g => g.IsActive)
                    .OrderBy(g => g.Id)
                    .ToListAsync();

                // Format image paths for frontend
                foreach (var item in gallery)
                {
                    item.Image = ImagePathService.FormatContextualImagePath(item.Image, "gallery");
                }

                return Ok(gallery);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching gallery: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/gallery/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Gallery>> GetGalleryItem(int id)
        {
            try
            {
                var galleryItem = await _context.Gallery.FindAsync(id);

                if (galleryItem == null)
                {
                    return NotFound();
                }

                // Format image path for frontend
                galleryItem.Image = ImagePathService.FormatContextualImagePath(galleryItem.Image, "gallery");

                return Ok(galleryItem);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching gallery item {id}: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/gallery
        [HttpPost]
        public async Task<ActionResult<Gallery>> CreateGalleryItem(Gallery gallery)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                gallery.CreatedAt = DateTime.UtcNow;
                gallery.UpdatedAt = DateTime.UtcNow;

                _context.Gallery.Add(gallery);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetGalleryItem), new { id = gallery.Id }, gallery);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating gallery item: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/gallery/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGalleryItem(int id, Gallery gallery)
        {
            try
            {
                if (id != gallery.Id)
                {
                    return BadRequest();
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var existingItem = await _context.Gallery.FindAsync(id);
                if (existingItem == null)
                {
                    return NotFound();
                }

                existingItem.Title = gallery.Title;
                existingItem.Description = gallery.Description;
                existingItem.Image = gallery.Image;
                existingItem.IsActive = gallery.IsActive;
                existingItem.UpdatedAt = DateTime.UtcNow;

                _context.Entry(existingItem).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!GalleryItemExists(id))
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
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating gallery item {id}: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // DELETE: api/gallery/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGalleryItem(int id)
        {
            try
            {
                var galleryItem = await _context.Gallery.FindAsync(id);
                if (galleryItem == null)
                {
                    return NotFound();
                }

                _context.Gallery.Remove(galleryItem);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting gallery item {id}: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // PATCH: api/gallery/{id}/toggle-active
        [HttpPatch("{id}/toggle-active")]
        public async Task<IActionResult> ToggleActive(int id)
        {
            try
            {
                var galleryItem = await _context.Gallery.FindAsync(id);
                if (galleryItem == null)
                {
                    return NotFound();
                }

                galleryItem.IsActive = !galleryItem.IsActive;
                galleryItem.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { id, isActive = galleryItem.IsActive });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error toggling active status for gallery item {id}: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        private bool GalleryItemExists(int id)
        {
            return _context.Gallery.Any(e => e.Id == id);
        }
    }
}
