using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;
using HospitalAPI.Models;

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

        // PUT: api/HomeSection/first
        [HttpPut("first")]
        public async Task<IActionResult> PutFirstHomeSection(HomeSection homeSection)
        {
            var existingHomeSection = await _context.HomeSections.FirstOrDefaultAsync();
            
            if (existingHomeSection == null)
            {
                return NotFound();
            }

            // Update the existing record with new data
            existingHomeSection.Section1Description = homeSection.Section1Description;
            existingHomeSection.Section2Image = homeSection.Section2Image;
            existingHomeSection.Section3Image = homeSection.Section3Image;
            existingHomeSection.Section4Title = homeSection.Section4Title;
            existingHomeSection.Section4Description = homeSection.Section4Description;
            existingHomeSection.Section4PurposeTitle = homeSection.Section4PurposeTitle;
            existingHomeSection.Section4PurposeDescription = homeSection.Section4PurposeDescription;
            existingHomeSection.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return NoContent();
        }

        // PUT: api/HomeSection/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHomeSection(int id, HomeSection homeSection)
        {
            if (id != homeSection.Id)
            {
                return BadRequest();
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
