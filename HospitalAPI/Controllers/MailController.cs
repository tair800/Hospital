using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;
using HospitalAPI.Models;

namespace HospitalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MailController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public MailController(HospitalDbContext context)
        {
            _context = context;
        }

        // GET: api/Mail
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Mail>>> GetMails()
        {
            return await _context.Mails
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();
        }

        // GET: api/Mail/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Mail>> GetMail(int id)
        {
            var mail = await _context.Mails.FindAsync(id);

            if (mail == null)
            {
                return NotFound();
            }

            return mail;
        }

        // GET: api/Mail/status/unread
        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<Mail>>> GetMailsByStatus(string status)
        {
            var mails = await _context.Mails
                .Where(m => m.Status.ToLower() == status.ToLower())
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();

            return mails;
        }

        // GET: api/Mail/count
        [HttpGet("count")]
        public async Task<ActionResult<object>> GetMailCounts()
        {
            var total = await _context.Mails.CountAsync();
            var unread = await _context.Mails.CountAsync(m => m.Status == "unread");
            var read = await _context.Mails.CountAsync(m => m.Status == "read");
            var replied = await _context.Mails.CountAsync(m => m.Status == "replied");
            var archived = await _context.Mails.CountAsync(m => m.Status == "archived");

            return new { total, unread, read, replied, archived };
        }

        // POST: api/Mail
        [HttpPost]
        public async Task<ActionResult<Mail>> PostMail(Mail mail)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                mail.CreatedAt = DateTime.UtcNow;
                mail.UpdatedAt = DateTime.UtcNow;
                mail.Status = "unread";

                _context.Mails.Add(mail);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetMail", new { id = mail.Id }, mail);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    success = false, 
                    message = "An error occurred while creating the mail.",
                    error = ex.Message 
                });
            }
        }

        // PUT: api/Mail/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMail(int id, Mail mail)
        {
            if (id != mail.Id)
            {
                return BadRequest();
            }

            try
            {
                mail.UpdatedAt = DateTime.UtcNow;
                _context.Entry(mail).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MailExists(id))
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

        // PUT: api/Mail/5/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateMailStatus(int id, [FromBody] UpdateMailStatusRequest request)
        {
            try
            {
                var mail = await _context.Mails.FindAsync(id);
                if (mail == null)
                {
                    return NotFound();
                }

                mail.Status = request.Status;
                mail.UpdatedAt = DateTime.UtcNow;

                if (request.Status == "read" && mail.ReadAt == null)
                {
                    mail.ReadAt = DateTime.UtcNow;
                }

                if (request.Status == "replied" && mail.RepliedAt == null)
                {
                    mail.RepliedAt = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Mail status updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    success = false, 
                    message = "An error occurred while updating mail status.",
                    error = ex.Message 
                });
            }
        }

        // PUT: api/Mail/5/reply
        [HttpPut("{id}/reply")]
        public async Task<IActionResult> ReplyToMail(int id, [FromBody] ReplyToMailRequest request)
        {
            try
            {
                var mail = await _context.Mails.FindAsync(id);
                if (mail == null)
                {
                    return NotFound();
                }

                mail.ReplyMessage = request.ReplyMessage;
                mail.Status = "replied";
                mail.UpdatedAt = DateTime.UtcNow;
                mail.RepliedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Reply sent successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    success = false, 
                    message = "An error occurred while sending reply.",
                    error = ex.Message 
                });
            }
        }

        // DELETE: api/Mail/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMail(int id)
        {
            var mail = await _context.Mails.FindAsync(id);
            if (mail == null)
            {
                return NotFound();
            }

            _context.Mails.Remove(mail);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MailExists(int id)
        {
            return _context.Mails.Any(e => e.Id == id);
        }
    }

    // DTOs for mail operations
    public class UpdateMailStatusRequest
    {
        public string Status { get; set; } = string.Empty;
    }

    public class ReplyToMailRequest
    {
        public string ReplyMessage { get; set; } = string.Empty;
    }
}
