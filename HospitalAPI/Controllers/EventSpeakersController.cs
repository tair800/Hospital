using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;
using HospitalAPI.Models;

namespace HospitalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventSpeakersController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public EventSpeakersController(HospitalDbContext context)
        {
            _context = context;
        }

        // GET: api/eventspeakers/event/{eventId}
        [HttpGet("event/{eventId}")]
        public async Task<ActionResult<IEnumerable<EventSpeaker>>> GetSpeakersByEvent(int eventId)
        {
            try
            {
                var speakers = await _context.EventSpeakers
                    .Where(es => es.EventId == eventId)
                    .OrderBy(es => es.Id)
                    .ToListAsync();

                return Ok(speakers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/eventspeakers/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<EventSpeaker>> GetEventSpeaker(int id)
        {
            try
            {
                var eventSpeaker = await _context.EventSpeakers
                    .Include(es => es.Event)
                    .FirstOrDefaultAsync(es => es.Id == id);

                if (eventSpeaker == null)
                {
                    return NotFound();
                }

                return Ok(eventSpeaker);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/eventspeakers
        [HttpPost]
        public async Task<ActionResult<EventSpeaker>> CreateEventSpeaker(EventSpeaker eventSpeaker)
        {
            try
            {
                _context.EventSpeakers.Add(eventSpeaker);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetEventSpeaker), new { id = eventSpeaker.Id }, eventSpeaker);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/eventspeakers/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEventSpeaker(int id, EventSpeaker eventSpeaker)
        {
            if (id != eventSpeaker.Id)
            {
                return BadRequest();
            }

            try
            {
                _context.Entry(eventSpeaker).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventSpeakerExists(id))
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

        // DELETE: api/eventspeakers/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEventSpeaker(int id)
        {
            try
            {
                var eventSpeaker = await _context.EventSpeakers.FindAsync(id);
                if (eventSpeaker == null)
                {
                    return NotFound();
                }

                _context.EventSpeakers.Remove(eventSpeaker);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private bool EventSpeakerExists(int id)
        {
            return _context.EventSpeakers.Any(e => e.Id == id);
        }
    }
}
