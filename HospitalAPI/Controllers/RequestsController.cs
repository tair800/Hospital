using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;
using HospitalAPI.Models;

namespace HospitalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RequestsController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public RequestsController(HospitalDbContext context)
        {
            _context = context;
        }

        // GET: api/requests - Get all requests
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Request>>> GetRequests()
        {
            try
            {
                var requests = await _context.Requests
                    .OrderByDescending(r => r.CreatedAt)
                    .ToListAsync();
                
                return Ok(requests);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/requests/{id} - Get specific request
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Request>> GetRequest(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid request ID");
                }

                var request = await _context.Requests.FindAsync(id);

                if (request == null)
                {
                    return NotFound($"Request with ID {id} not found");
                }

                return Ok(request);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/requests - Create new request
        [HttpPost]
        public async Task<ActionResult<Request>> CreateRequest([FromBody] Request request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest("Request data is required");
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Validate required fields
                if (string.IsNullOrWhiteSpace(request.Name))
                {
                    return BadRequest("Name is required");
                }

                if (string.IsNullOrWhiteSpace(request.Surname))
                {
                    return BadRequest("Surname is required");
                }

                if (string.IsNullOrWhiteSpace(request.Email))
                {
                    return BadRequest("Email is required");
                }

                if (string.IsNullOrWhiteSpace(request.Phone))
                {
                    return BadRequest("Phone is required");
                }

                if (string.IsNullOrWhiteSpace(request.FinCode))
                {
                    return BadRequest("Fin code is required");
                }

                if (string.IsNullOrWhiteSpace(request.Vezife))
                {
                    return BadRequest("Vezife is required");
                }

                // Validate email format
                if (!IsValidEmail(request.Email))
                {
                    return BadRequest("Invalid email format");
                }

                // Set timestamps
                request.CreatedAt = DateTime.UtcNow;
                request.UpdatedAt = DateTime.UtcNow;

                _context.Requests.Add(request);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetRequest), new { id = request.Id }, request);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/requests/{id} - Update request
        [HttpPut("{id:int}")]
        public async Task<ActionResult<Request>> UpdateRequest(int id, [FromBody] Request request)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid request ID");
                }

                if (request == null)
                {
                    return BadRequest("Request data is required");
                }

                if (id != request.Id)
                {
                    return BadRequest("ID mismatch");
                }

                var existingRequest = await _context.Requests.FindAsync(id);
                if (existingRequest == null)
                {
                    return NotFound($"Request with ID {id} not found");
                }

                // Update all fields
                existingRequest.Name = request.Name ?? existingRequest.Name;
                existingRequest.Surname = request.Surname ?? existingRequest.Surname;
                existingRequest.Email = request.Email ?? existingRequest.Email;
                existingRequest.Phone = request.Phone ?? existingRequest.Phone;
                existingRequest.FinCode = request.FinCode ?? existingRequest.FinCode;
                existingRequest.Vezife = request.Vezife ?? existingRequest.Vezife;
                existingRequest.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(existingRequest);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/requests/{id} - Delete request
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteRequest(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid request ID");
                }

                var request = await _context.Requests.FindAsync(id);
                if (request == null)
                {
                    return NotFound($"Request with ID {id} not found");
                }

                _context.Requests.Remove(request);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PATCH: api/requests/{id}/status - Update request status
        [HttpPatch("{id:int}/status")]
        public async Task<ActionResult<Request>> UpdateRequestStatus(int id, [FromBody] UpdateStatusRequest statusRequest)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid request ID");
                }

                if (statusRequest == null || string.IsNullOrWhiteSpace(statusRequest.Status))
                {
                    return BadRequest("Status is required");
                }

                // Validate status values
                if (statusRequest.Status != "pending" && statusRequest.Status != "completed")
                {
                    return BadRequest("Status must be either 'pending' or 'completed'");
                }

                var request = await _context.Requests.FindAsync(id);
                if (request == null)
                {
                    return NotFound($"Request with ID {id} not found");
                }

                // Update status and timestamp
                request.Status = statusRequest.Status;
                request.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(request);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/requests/count - Get total count of requests
        [HttpGet("count")]
        public async Task<ActionResult<int>> GetRequestCount()
        {
            try
            {
                var count = await _context.Requests.CountAsync();
                return Ok(count);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Helper method to validate email format
        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }
    }
}
