using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;
using HospitalAPI.Models;

namespace HospitalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogsController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public BlogsController(HospitalDbContext context)
        {
            _context = context;
        }

        // GET: api/blogs - Get all blogs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Blog>>> GetBlogs()
        {
            try
            {
                var blogs = await _context.Blogs
                    .OrderByDescending(b => b.CreatedAt)
                    .ToListAsync();
                
                return Ok(blogs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/blogs/{id} - Get specific blog
        [HttpGet("{id}")]
        public async Task<ActionResult<Blog>> GetBlog(int id)
        {
            try
            {
                var blog = await _context.Blogs.FindAsync(id);

                if (blog == null)
                {
                    return NotFound($"Blog with ID {id} not found");
                }

                return Ok(blog);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/blogs/featured - Get featured blogs (most visited)
        [HttpGet("featured")]
        public async Task<ActionResult<IEnumerable<Blog>>> GetFeaturedBlogs()
        {
            try
            {
                var featuredBlogs = await _context.Blogs
                    .OrderByDescending(b => b.Visitors)
                    .Take(3)
                    .ToListAsync();
                
                return Ok(featuredBlogs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/blogs - Create new blog
        [HttpPost]
        public async Task<ActionResult<Blog>> CreateBlog(Blog blog)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                blog.CreatedAt = DateTime.UtcNow;
                blog.UpdatedAt = DateTime.UtcNow;

                _context.Blogs.Add(blog);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetBlog), new { id = blog.Id }, blog);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/blogs/{id} - Update blog
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBlog(int id, Blog blog)
        {
            try
            {
                if (id != blog.Id)
                {
                    return BadRequest("ID mismatch");
                }

                var existingBlog = await _context.Blogs.FindAsync(id);
                if (existingBlog == null)
                {
                    return NotFound($"Blog with ID {id} not found");
                }

                existingBlog.Number = blog.Number;
                existingBlog.Title = blog.Title;
                existingBlog.Description = blog.Description;
                existingBlog.Date = blog.Date;
                existingBlog.Visitors = blog.Visitors;
                existingBlog.SecondDescTitle = blog.SecondDescTitle;
                existingBlog.SecondDescBody = blog.SecondDescBody;
                existingBlog.ThirdTextTitle = blog.ThirdTextTitle;
                existingBlog.ThirdTextBody = blog.ThirdTextBody;
                existingBlog.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/blogs/{id} - Delete blog
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBlog(int id)
        {
            try
            {
                var blog = await _context.Blogs.FindAsync(id);
                if (blog == null)
                {
                    return NotFound($"Blog with ID {id} not found");
                }

                _context.Blogs.Remove(blog);
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
