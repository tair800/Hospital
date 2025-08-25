using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;
using HospitalAPI.Models;

namespace HospitalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactsController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public ContactsController(HospitalDbContext context)
        {
            _context = context;
        }

        // GET: api/contacts - Get all contact information
        [HttpGet]
        public async Task<ActionResult<object>> GetContactInfo()
        {
            try
            {
                var contacts = await _context.Contacts.ToListAsync();
                var socialMedia = await _context.SocialMedia.ToListAsync();
                var heading = await _context.ContactHeadings.FirstOrDefaultAsync();

                var result = new
                {
                    heading = heading ?? new ContactHeading 
                    { 
                        Line1 = "Nə sualın varsa,", 
                        Line2 = "buradayıq!" 
                    },
                    contactInfo = contacts,
                    socialMedia = socialMedia
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/contacts/contact-info - Get only contact information
        [HttpGet("contact-info")]
        public async Task<ActionResult<IEnumerable<Contact>>> GetContacts()
        {
            try
            {
                var contacts = await _context.Contacts.ToListAsync();
                return Ok(contacts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/contacts/social-media - Get only social media
        [HttpGet("social-media")]
        public async Task<ActionResult<IEnumerable<SocialMedia>>> GetSocialMedia()
        {
            try
            {
                var socialMedia = await _context.SocialMedia.ToListAsync();
                return Ok(socialMedia);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/contacts/heading - Get contact heading
        [HttpGet("heading")]
        public async Task<ActionResult<ContactHeading>> GetContactHeading()
        {
            try
            {
                var heading = await _context.ContactHeadings.FirstOrDefaultAsync();
                if (heading == null)
                {
                    heading = new ContactHeading 
                    { 
                        Line1 = "Nə sualın varsa,", 
                        Line2 = "buradayıq!" 
                    };
                }
                return Ok(heading);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/contacts/contact-info - Create new contact
        [HttpPost("contact-info")]
        public async Task<ActionResult<Contact>> CreateContact(Contact contact)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                contact.CreatedAt = DateTime.UtcNow;
                contact.UpdatedAt = DateTime.UtcNow;

                _context.Contacts.Add(contact);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetContacts), new { id = contact.Id }, contact);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/contacts/social-media - Create new social media
        [HttpPost("social-media")]
        public async Task<ActionResult<SocialMedia>> CreateSocialMedia(SocialMedia socialMedia)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                socialMedia.CreatedAt = DateTime.UtcNow;
                socialMedia.UpdatedAt = DateTime.UtcNow;

                _context.SocialMedia.Add(socialMedia);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetSocialMedia), new { id = socialMedia.Id }, socialMedia);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/contacts/contact-info/{id} - Update contact
        [HttpPut("contact-info/{id}")]
        public async Task<IActionResult> UpdateContact(int id, Contact contact)
        {
            try
            {
                if (id != contact.Id)
                {
                    return BadRequest("ID mismatch");
                }

                var existingContact = await _context.Contacts.FindAsync(id);
                if (existingContact == null)
                {
                    return NotFound($"Contact with ID {id} not found");
                }

                existingContact.Type = contact.Type;
                existingContact.Value = contact.Value;
                existingContact.Icon = contact.Icon;
                existingContact.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/contacts/social-media/{id} - Update social media
        [HttpPut("social-media/{id}")]
        public async Task<IActionResult> UpdateSocialMedia(int id, SocialMedia socialMedia)
        {
            try
            {
                if (id != socialMedia.Id)
                {
                    return BadRequest("ID mismatch");
                }

                var existingSocialMedia = await _context.SocialMedia.FindAsync(id);
                if (existingSocialMedia == null)
                {
                    return NotFound($"Social media with ID {id} not found");
                }

                existingSocialMedia.Platform = socialMedia.Platform;
                existingSocialMedia.Name = socialMedia.Name;
                existingSocialMedia.Url = socialMedia.Url;
                existingSocialMedia.Icon = socialMedia.Icon;
                existingSocialMedia.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/contacts/heading/{id} - Update contact heading
        [HttpPut("heading/{id}")]
        public async Task<IActionResult> UpdateContactHeading(int id, ContactHeading heading)
        {
            try
            {
                if (id != heading.Id)
                {
                    return BadRequest("ID mismatch");
                }

                var existingHeading = await _context.ContactHeadings.FindAsync(id);
                if (existingHeading == null)
                {
                    return NotFound($"Contact heading with ID {id} not found");
                }

                existingHeading.Line1 = heading.Line1;
                existingHeading.Line2 = heading.Line2;
                existingHeading.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
