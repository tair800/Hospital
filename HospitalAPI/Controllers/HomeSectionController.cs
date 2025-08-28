using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;
using HospitalAPI.Models;
using System.IO;

namespace HospitalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeSectionController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public HomeSectionController(HospitalDbContext context)
        {
            _context = context;
        }

        // GET: api/HomeSection
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HomeSection>>> GetHomeSections()
        {
            return await _context.HomeSections.ToListAsync();
        }

        // GET: api/HomeSection/5
        [HttpGet("{id}")]
        public async Task<ActionResult<HomeSection>> GetHomeSection(int id)
        {
            var homeSection = await _context.HomeSections.FindAsync(id);

            if (homeSection == null)
            {
                return NotFound();
            }

            return homeSection;
        }

        // GET: api/HomeSection/first
        [HttpGet("first")]
        public async Task<ActionResult<HomeSection>> GetFirstHomeSection()
        {
            var homeSection = await _context.HomeSections.FirstOrDefaultAsync();

            if (homeSection == null)
            {
                return NotFound();
            }

            return homeSection;
        }

        // PUT: api/HomeSection/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHomeSection(int id, [FromForm] IFormCollection form)
        {
            var homeSection = await _context.HomeSections.FindAsync(id);
            if (homeSection == null)
            {
                return NotFound();
            }

            if (id != homeSection.Id)
            {
                return BadRequest();
            }

            // Update text fields
            homeSection.Section1Description = form["section1Description"];
            homeSection.Section4Title = form["section4Title"];
            homeSection.Section4Description = form["section4Description"];
            homeSection.Section4PurposeTitle = form["section4PurposeTitle"];
            homeSection.Section4PurposeDescription = form["section4PurposeDescription"];

            // Handle image files
            var section2ImageFile = form.Files.FirstOrDefault(f => f.Name == "section2Image");
            var section3ImageFile = form.Files.FirstOrDefault(f => f.Name == "section3Image");

            if (section2ImageFile != null && section2ImageFile.Length > 0)
            {
                // Generate unique filename
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(section2ImageFile.FileName);
                var filePath = Path.Combine("wwwroot", "uploads", fileName);
                
                // Ensure directory exists
                Directory.CreateDirectory(Path.GetDirectoryName(filePath));
                
                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await section2ImageFile.CopyToAsync(stream);
                }
                
                homeSection.Section2Image = fileName;
            }
            else if (form["section2Image"].ToString() != "")
            {
                // Keep existing image if no new file uploaded
                homeSection.Section2Image = form["section2Image"];
            }

            if (section3ImageFile != null && section3ImageFile.Length > 0)
            {
                // Generate unique filename
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(section3ImageFile.FileName);
                var filePath = Path.Combine("wwwroot", "uploads", fileName);
                
                // Ensure directory exists
                Directory.CreateDirectory(Path.GetDirectoryName(filePath));
                
                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await section3ImageFile.CopyToAsync(stream);
                }
                
                homeSection.Section3Image = fileName;
            }
            else if (form["section3Image"].ToString() != "")
            {
                // Keep existing image if no new file uploaded
                homeSection.Section3Image = form["section3Image"];
            }

            homeSection.UpdatedAt = DateTime.UtcNow;
            _context.Entry(homeSection).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HomeSectionExists(id))
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

        // POST: api/HomeSection
        [HttpPost]
        public async Task<ActionResult<HomeSection>> PostHomeSection(HomeSection homeSection)
        {
            homeSection.CreatedAt = DateTime.UtcNow;
            homeSection.UpdatedAt = DateTime.UtcNow;
            
            _context.HomeSections.Add(homeSection);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetHomeSection", new { id = homeSection.Id }, homeSection);
        }

        // DELETE: api/HomeSection/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHomeSection(int id)
        {
            var homeSection = await _context.HomeSections.FindAsync(id);
            if (homeSection == null)
            {
                return NotFound();
            }

            _context.HomeSections.Remove(homeSection);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool HomeSectionExists(int id)
        {
            return _context.HomeSections.Any(e => e.Id == id);
        }
    }
}
