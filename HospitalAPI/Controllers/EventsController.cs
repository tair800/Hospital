using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;
using HospitalAPI.Models;

namespace HospitalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public EventsController(HospitalDbContext context)
        {
            _context = context;
        }

        // GET: api/events - Get all events (for Events page)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Event>>> GetEvents()
        {
            try
            {
                var events = await _context.Events
                    .OrderByDescending(e => e.EventDate)
                    .ToListAsync();
                
                return Ok(events);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/events/featured - Get main/featured events (for Home page)
        [HttpGet("featured")]
        public async Task<ActionResult<IEnumerable<Event>>> GetFeaturedEvents()
        {
            try
            {
                var featuredEvents = await _context.Events
                    .Where(e => e.IsMain)
                    .OrderByDescending(e => e.EventDate)
                    .Take(3)
                    .ToListAsync();
                
                return Ok(featuredEvents);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/events/{id} - Get specific event (for EventsDetail page)
        [HttpGet("{id}")]
        public async Task<ActionResult<Event>> GetEvent(int id)
        {
            try
            {
                var eventItem = await _context.Events.FindAsync(id);

                if (eventItem == null)
                {
                    return NotFound($"Event with ID {id} not found");
                }

                return Ok(eventItem);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/events/upcoming - Get upcoming events
        [HttpGet("upcoming")]
        public async Task<ActionResult<IEnumerable<Event>>> GetUpcomingEvents()
        {
            try
            {
                var upcomingEvents = await _context.Events
                    .Where(e => e.EventDate > DateTime.UtcNow)
                    .OrderBy(e => e.EventDate)
                    .ToListAsync();
                
                return Ok(upcomingEvents);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/events/search?q={searchTerm} - Search events
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Event>>> SearchEvents([FromQuery] string q)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(q))
                {
                    return BadRequest("Search query is required");
                }

                var searchResults = await _context.Events
                    .Where(e => e.Title.Contains(q) || 
                               (e.Description != null && e.Description.Contains(q)) ||
                               (e.Subtitle != null && e.Subtitle.Contains(q)))
                    .OrderByDescending(e => e.EventDate)
                    .ToListAsync();
                
                return Ok(searchResults);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
