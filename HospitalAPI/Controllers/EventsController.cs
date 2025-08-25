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

        // GET: api/events - Get all events
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

        // GET: api/events/{id} - Get specific event
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

        // POST: api/events - Create new event
        [HttpPost]
        public async Task<ActionResult<Event>> CreateEvent(Event eventItem)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                eventItem.CreatedAt = DateTime.UtcNow;
                eventItem.UpdatedAt = DateTime.UtcNow;

                _context.Events.Add(eventItem);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetEvent), new { id = eventItem.Id }, eventItem);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/events/{id} - Update event
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEvent(int id, Event eventItem)
        {
            try
            {
                if (id != eventItem.Id)
                {
                    return BadRequest("ID mismatch");
                }

                var existingEvent = await _context.Events.FindAsync(id);
                if (existingEvent == null)
                {
                    return NotFound($"Event with ID {id} not found");
                }

                // Update all properties
                existingEvent.Title = eventItem.Title;
                existingEvent.Subtitle = eventItem.Subtitle;
                existingEvent.Description = eventItem.Description;
                existingEvent.LongDescription = eventItem.LongDescription;
                existingEvent.EventDate = eventItem.EventDate;
                existingEvent.Time = eventItem.Time;
                existingEvent.Venue = eventItem.Venue;
                existingEvent.Trainer = eventItem.Trainer;
                existingEvent.IsFree = eventItem.IsFree;
                existingEvent.Price = eventItem.Price;
                existingEvent.Currency = eventItem.Currency;
                existingEvent.MainImage = eventItem.MainImage;
                existingEvent.DetailImageLeft = eventItem.DetailImageLeft;
                existingEvent.DetailImageMain = eventItem.DetailImageMain;
                existingEvent.DetailImageRight = eventItem.DetailImageRight;
                existingEvent.IsMain = eventItem.IsMain;
                existingEvent.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/events/{id} - Delete event
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            try
            {
                var eventItem = await _context.Events.FindAsync(id);
                if (eventItem == null)
                {
                    return NotFound($"Event with ID {id} not found");
                }

                _context.Events.Remove(eventItem);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PATCH: api/events/{id}/toggle-main - Toggle IsMain status
        [HttpPatch("{id}/toggle-main")]
        public async Task<IActionResult> ToggleMainStatus(int id)
        {
            try
            {
                var eventItem = await _context.Events.FindAsync(id);
                if (eventItem == null)
                {
                    return NotFound($"Event with ID {id} not found");
                }

                eventItem.IsMain = !eventItem.IsMain;
                eventItem.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { id = eventItem.Id, isMain = eventItem.IsMain });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PATCH: api/events/{id}/toggle-free - Toggle IsFree status
        [HttpPatch("{id}/toggle-free")]
        public async Task<IActionResult> ToggleFreeStatus(int id)
        {
            try
            {
                var eventItem = await _context.Events.FindAsync(id);
                if (eventItem == null)
                {
                    return NotFound($"Event with ID {id} not found");
                }

                eventItem.IsFree = !eventItem.IsFree;
                eventItem.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { id = eventItem.Id, isFree = eventItem.IsFree });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
