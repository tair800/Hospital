using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;
using HospitalAPI.Models;
using HospitalAPI.Services;

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
                
                // Format image paths for frontend
                foreach (var eventItem in events)
                {
                    eventItem.MainImage = ImagePathService.FormatContextualImagePath(eventItem.MainImage, "admin");
                    eventItem.DetailImageLeft = ImagePathService.FormatContextualImagePath(eventItem.DetailImageLeft, "admin");
                    eventItem.DetailImageMain = ImagePathService.FormatContextualImagePath(eventItem.DetailImageMain, "admin");
                    eventItem.DetailImageRight = ImagePathService.FormatContextualImagePath(eventItem.DetailImageRight, "admin");
                }
                
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

        // GET: api/events/upcoming/count - Get count of upcoming events
        [HttpGet("upcoming/count")]
        public async Task<ActionResult<int>> GetUpcomingEventsCount()
        {
            try
            {
                var upcomingEventsCount = await _context.Events
                    .Where(e => e.EventDate > DateTime.UtcNow)
                    .CountAsync();
                
                return Ok(upcomingEventsCount);
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

                // Automatically set IsFree based on Price
                eventItem.IsFree = eventItem.Price == 0 || eventItem.Price == null;
                
                // Ensure Price is not negative
                if (eventItem.Price.HasValue && eventItem.Price < 0)
                {
                    return BadRequest("Price cannot be negative");
                }

                // Log the creation for debugging
                Console.WriteLine($"Creating Event: Price={eventItem.Price}, Currency={eventItem.Currency}, IsFree={eventItem.IsFree}");

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

                // Log the existing event state
                Console.WriteLine($"Existing Event {id}: Price={existingEvent.Price}, Currency={existingEvent.Currency}, IsFree={existingEvent.IsFree}");
                Console.WriteLine($"Entity State: {_context.Entry(existingEvent).State}");

                // Validate price first before updating
                if (eventItem.Price.HasValue && eventItem.Price < 0)
                {
                    return BadRequest("Price cannot be negative");
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
                existingEvent.Region = eventItem.Region;
                existingEvent.Price = eventItem.Price;
                existingEvent.Currency = eventItem.Currency;
                existingEvent.MainImage = eventItem.MainImage;
                existingEvent.DetailImageLeft = eventItem.DetailImageLeft;
                existingEvent.DetailImageMain = eventItem.DetailImageMain;
                existingEvent.DetailImageRight = eventItem.DetailImageRight;
                existingEvent.IsMain = eventItem.IsMain;
                
                // Automatically set IsFree based on Price
                bool newIsFreeValue = eventItem.Price == 0 || eventItem.Price == null;
                existingEvent.IsFree = newIsFreeValue;
                
                Console.WriteLine($"Price: {eventItem.Price}, New IsFree value: {newIsFreeValue}");
                
                existingEvent.UpdatedAt = DateTime.UtcNow;

                // Explicitly mark the entity as modified
                _context.Entry(existingEvent).State = EntityState.Modified;
                
                // Explicitly mark IsFree as modified to ensure it's tracked
                _context.Entry(existingEvent).Property(e => e.IsFree).IsModified = true;

                // Log the update for debugging
                Console.WriteLine($"Updating Event {id}: Price={eventItem.Price}, Currency={eventItem.Currency}, IsFree={existingEvent.IsFree}");
                Console.WriteLine($"Before save - Existing Event Price: {existingEvent.Price}, IsFree: {existingEvent.IsFree}");
                Console.WriteLine($"Before save - New Event Price: {eventItem.Price}, IsFree: {eventItem.IsFree}");

                await _context.SaveChangesAsync();
                
                // Log after save
                Console.WriteLine($"After save - Event Price: {existingEvent.Price}, IsFree: {existingEvent.IsFree}");

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

        // GET: api/events/{id}/debug - Debug endpoint to check event state
        [HttpGet("{id}/debug")]
        public async Task<IActionResult> DebugEvent(int id)
        {
            try
            {
                var eventItem = await _context.Events.FindAsync(id);
                if (eventItem == null)
                {
                    return NotFound($"Event with ID {id} not found");
                }

                var entityState = _context.Entry(eventItem).State;
                var modifiedProperties = _context.Entry(eventItem).Properties
                    .Where(p => p.IsModified)
                    .Select(p => new { Property = p.Metadata.Name, IsModified = p.IsModified })
                    .ToList();

                return Ok(new
                {
                    id = eventItem.Id,
                    title = eventItem.Title,
                    price = eventItem.Price,
                    currency = eventItem.Currency,
                    isFree = eventItem.IsFree,
                    entityState = entityState.ToString(),
                    modifiedProperties = modifiedProperties
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/events/test-db - Test database connection and basic operations
        [HttpGet("test-db")]
        public async Task<IActionResult> TestDatabase()
        {
            try
            {
                // Test if we can connect to the database
                var eventCount = await _context.Events.CountAsync();
                
                // Test if we can read from the database
                var sampleEvent = await _context.Events.FirstOrDefaultAsync();
                
                return Ok(new
                {
                    message = "Database connection successful",
                    totalEvents = eventCount,
                    sampleEvent = sampleEvent != null ? new
                    {
                        id = sampleEvent.Id,
                        title = sampleEvent.Title,
                        price = sampleEvent.Price,
                        isFree = sampleEvent.IsFree
                    } : null
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database test failed: {ex.Message}");
            }
        }


    }
}
