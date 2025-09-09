using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;
using HospitalAPI.Models;

namespace HospitalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventTimelineController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public EventTimelineController(HospitalDbContext context)
        {
            _context = context;
        }

        // GET: api/eventtimeline/event/{eventId}
        [HttpGet("event/{eventId}")]
        public async Task<ActionResult<IEnumerable<EventTimeline>>> GetTimelineByEvent(int eventId)
        {
            try
            {
                var timeline = await _context.EventTimeline
                    .Where(et => et.EventId == eventId)
                    .OrderBy(et => et.OrderIndex)
                    .ToListAsync();

                return Ok(timeline);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/eventtimeline/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<EventTimeline>> GetEventTimeline(int id)
        {
            try
            {
                var eventTimeline = await _context.EventTimeline
                    .Include(et => et.Event)
                    .FirstOrDefaultAsync(et => et.Id == id);

                if (eventTimeline == null)
                {
                    return NotFound();
                }

                return Ok(eventTimeline);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/eventtimeline
        [HttpPost]
        public async Task<ActionResult<EventTimeline>> CreateEventTimeline(EventTimeline eventTimeline)
        {
            try
            {
                _context.EventTimeline.Add(eventTimeline);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetEventTimeline), new { id = eventTimeline.Id }, eventTimeline);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/eventtimeline/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEventTimeline(int id, EventTimeline eventTimeline)
        {
            if (id != eventTimeline.Id)
            {
                return BadRequest();
            }

            try
            {
                _context.Entry(eventTimeline).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventTimelineExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/eventtimeline/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEventTimeline(int id)
        {
            try
            {
                var eventTimeline = await _context.EventTimeline.FindAsync(id);
                if (eventTimeline == null)
                {
                    return NotFound();
                }

                _context.EventTimeline.Remove(eventTimeline);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private bool EventTimelineExists(int id)
        {
            return _context.EventTimeline.Any(e => e.Id == id);
        }
    }
}
