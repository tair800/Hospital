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
                var blogs = await _context.Blogs.ToListAsync();
                
                Console.WriteLine("=== RAW BLOG DATA FROM DATABASE ===");
                foreach (var blog in blogs)
                {
                    Console.WriteLine($"ID: {blog.Id}, Number: '{blog.Number}' (Type: {blog.Number?.GetType().Name}), Title: {blog.Title}, Created: {blog.CreatedAt}");
                }
                
                // Simple and reliable sorting by Number field
                var sortedBlogs = blogs
                    .Where(b => !string.IsNullOrEmpty(b.Number) && int.TryParse(b.Number, out _))
                    .OrderBy(b => int.Parse(b.Number))
                    .ToList();
                
                Console.WriteLine("=== AFTER NUMERIC SORTING ===");
                foreach (var blog in sortedBlogs)
                {
                    Console.WriteLine($"ID: {blog.Id}, Number: '{blog.Number}', Title: {blog.Title}");
                }
                
                return Ok(sortedBlogs);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR in GetBlogs: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
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
                    .ToListAsync(); // Get featured blogs first
                
                // Sort by numeric value of Number field
                var sortedFeaturedBlogs = featuredBlogs.OrderBy(b => int.Parse(b.Number)).ToList();
                
                // Log to verify Image field is included
                foreach (var blog in sortedFeaturedBlogs)
                {
                    Console.WriteLine($"Featured Blog ID: {blog.Id}, Number: {blog.Number}, Title: {blog.Title}, Image: {blog.Image ?? "NULL"}");
                }
                
                return Ok(sortedFeaturedBlogs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/blogs/{id} - Get specific blog
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Blog>> GetBlog(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid blog ID");
                }

                var blog = await _context.Blogs.FindAsync(id);

                if (blog == null)
                {
                    return NotFound($"Blog with ID {id} not found");
                }

                // Log to verify Image field is included
                Console.WriteLine($"Single Blog ID: {blog.Id}, Title: {blog.Title}, Image: {blog.Image ?? "NULL"}");

                return Ok(blog);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/blogs - Create new blog
        [HttpPost]
        public async Task<ActionResult<Blog>> CreateBlog([FromBody] Blog blog)
        {
            try
            {
                if (blog == null)
                {
                    return BadRequest("Blog data is required");
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Validate required fields
                if (string.IsNullOrWhiteSpace(blog.Title))
                {
                    return BadRequest("Blog title is required");
                }

                if (string.IsNullOrWhiteSpace(blog.Date))
                {
                    return BadRequest("Publication date is required");
                }

                // Auto-generate the next available blog number
                var existingNumbers = await _context.Blogs
                    .Select(b => b.Number)
                    .ToListAsync();

                int nextNumber = 1;
                while (existingNumbers.Contains(nextNumber.ToString("D2"))) // Format as "01", "02", etc.
                {
                    nextNumber++;
                }

                blog.Number = nextNumber.ToString("D2");
                Console.WriteLine($"Auto-assigned blog number: {blog.Number}");

                // Set timestamps
                blog.CreatedAt = DateTime.UtcNow;
                blog.UpdatedAt = DateTime.UtcNow;

                // Ensure Image field is properly handled
                if (blog.Image == null)
                {
                    blog.Image = string.Empty;
                }

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
        [HttpPut("{id:int}")]
        public async Task<ActionResult<Blog>> UpdateBlog(int id, [FromBody] Blog blog)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid blog ID");
                }

                if (blog == null)
                {
                    return BadRequest("Blog data is required");
                }

                if (id != blog.Id)
                {
                    return BadRequest("ID mismatch");
                }

                var existingBlog = await _context.Blogs.FindAsync(id);
                if (existingBlog == null)
                {
                    return NotFound($"Blog with ID {id} not found");
                }

                // Update all fields including Image
                existingBlog.Number = blog.Number ?? existingBlog.Number;
                existingBlog.Title = blog.Title ?? existingBlog.Title;
                existingBlog.Description = blog.Description;
                existingBlog.Date = blog.Date ?? existingBlog.Date;
                existingBlog.Visitors = blog.Visitors;
                existingBlog.SecondDescTitle = blog.SecondDescTitle;
                existingBlog.SecondDescBody = blog.SecondDescBody;
                existingBlog.ThirdTextTitle = blog.ThirdTextTitle;
                existingBlog.ThirdTextBody = blog.ThirdTextBody;
                existingBlog.Image = blog.Image ?? existingBlog.Image;
                existingBlog.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(existingBlog);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/blogs/{id} - Delete blog
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteBlog(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid blog ID");
                }

                var blog = await _context.Blogs.FindAsync(id);
                if (blog == null)
                {
                    return NotFound($"Blog with ID {id} not found");
                }

                // Log before deletion to verify Image field
                Console.WriteLine($"Deleting Blog ID: {blog.Id}, Title: {blog.Title}, Number: {blog.Number}, Image: {blog.Image ?? "NULL"}");

                _context.Blogs.Remove(blog);
                await _context.SaveChangesAsync();

                // Renumber remaining blogs to maintain sequential order
                await RenumberBlogsSequentially();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Helper method to renumber blogs sequentially
        private async Task RenumberBlogsSequentially()
        {
            try
            {
                var allBlogs = await _context.Blogs
                    .OrderBy(b => b.CreatedAt) // Order by creation date to maintain original order
                    .ToListAsync();

                int newNumber = 1;
                foreach (var blog in allBlogs)
                {
                    var oldNumber = blog.Number;
                    blog.Number = newNumber.ToString("D2");
                    blog.UpdatedAt = DateTime.UtcNow;
                    
                    if (oldNumber != blog.Number)
                    {
                        Console.WriteLine($"Renumbered blog {blog.Id} from {oldNumber} to {blog.Number}");
                    }
                    
                    newNumber++;
                }

                await _context.SaveChangesAsync();
                Console.WriteLine($"Blog renumbering completed. Total blogs: {allBlogs.Count}");
                
                // Verify the new order
                var verifyBlogs = await _context.Blogs
                    .OrderBy(b => int.Parse(b.Number))
                    .Select(b => new { b.Id, b.Number, b.Title })
                    .ToListAsync();
                
                Console.WriteLine("Verification of new numbering:");
                foreach (var blog in verifyBlogs)
                {
                    Console.WriteLine($"Blog ID: {blog.Id}, Number: {blog.Number}, Title: {blog.Title}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during blog renumbering: {ex.Message}");
            }
        }

        // GET: api/blogs/test-image - Test Image field handling
        [HttpGet("test-image")]
        public async Task<ActionResult<object>> TestImageField()
        {
            try
            {
                var blogs = await _context.Blogs.Take(5).ToListAsync();
                var result = blogs.Select(b => new
                {
                    Id = b.Id,
                    Title = b.Title,
                    Number = b.Number,
                    Image = b.Image,
                    ImageType = b.Image?.GetType().Name ?? "NULL",
                    ImageLength = b.Image?.Length ?? 0
                }).ToList();

                Console.WriteLine("Image Field Test Results:");
                foreach (var item in result)
                {
                    Console.WriteLine($"Blog {item.Id}: Number={item.Number}, Image='{item.Image}' (Type: {item.ImageType}, Length: {item.ImageLength})");
                }

                return Ok(new
                {
                    Message = "Image field test completed",
                    TotalBlogs = blogs.Count,
                    Results = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/blogs/renumber - Manually trigger blog renumbering
        [HttpPost("renumber")]
        public async Task<ActionResult<object>> ManualRenumber()
        {
            try
            {
                Console.WriteLine("Manual blog renumbering triggered");
                
                // Get current blog order before renumbering
                var blogsBefore = await _context.Blogs
                    .OrderBy(b => b.CreatedAt)
                    .Select(b => new { b.Id, b.Number, b.Title, b.CreatedAt })
                    .ToListAsync();
                
                Console.WriteLine("Blogs before renumbering:");
                foreach (var blog in blogsBefore)
                {
                    Console.WriteLine($"ID: {blog.Id}, Current Number: {blog.Number}, Title: {blog.Title}, Created: {blog.CreatedAt}");
                }
                
                await RenumberBlogsSequentially();
                
                var allBlogs = await _context.Blogs
                    .OrderBy(b => b.Number)
                    .Select(b => new { b.Id, b.Number, b.Title })
                    .ToListAsync();

                Console.WriteLine("Blogs after renumbering:");
                foreach (var blog in allBlogs)
                {
                    Console.WriteLine($"ID: {blog.Id}, New Number: {blog.Number}, Title: {blog.Title}");
                }

                return Ok(new
                {
                    Message = "Blog renumbering completed successfully",
                    TotalBlogs = allBlogs.Count,
                    BlogNumbers = allBlogs
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/blogs/numbers - Get current blog numbering status
        [HttpGet("numbers")]
        public async Task<ActionResult<object>> GetBlogNumbers()
        {
            try
            {
                var blogs = await _context.Blogs
                    .ToListAsync(); // Get all blogs first
                
                // Sort by numeric value of Number field
                var sortedBlogs = blogs.OrderBy(b => int.Parse(b.Number))
                    .Select(b => new { b.Id, b.Number, b.Title, b.CreatedAt })
                    .ToList();

                var result = new
                {
                    TotalBlogs = sortedBlogs.Count,
                    CurrentNumbers = sortedBlogs.Select(b => b.Number).ToList(),
                    BlogDetails = sortedBlogs,
                    IsSequential = IsSequential(sortedBlogs.Select(b => b.Number).ToList())
                };

                Console.WriteLine($"Blog numbering status: {string.Join(", ", result.CurrentNumbers)}");
                Console.WriteLine($"Is sequential: {result.IsSequential}");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/blogs/fix-numbering - Fix any numbering issues automatically
        [HttpPost("fix-numbering")]
        public async Task<ActionResult<object>> FixBlogNumbering()
        {
            try
            {
                Console.WriteLine("Automatic blog numbering fix triggered");
                
                // Check if numbering is already correct
                var currentBlogs = await _context.Blogs
                    .OrderBy(b => b.CreatedAt)
                    .ToListAsync();
                
                bool needsFix = false;
                int expectedNumber = 1;
                
                foreach (var blog in currentBlogs)
                {
                    if (blog.Number != expectedNumber.ToString("D2"))
                    {
                        needsFix = true;
                        Console.WriteLine($"Blog {blog.Id} has wrong number: {blog.Number}, should be {expectedNumber.ToString("D2")}");
                    }
                    expectedNumber++;
                }
                
                if (!needsFix)
                {
                    return Ok(new { Message = "Blog numbering is already correct", TotalBlogs = currentBlogs.Count });
                }
                
                // Fix the numbering
                await RenumberBlogsSequentially();
                
                var fixedBlogs = await _context.Blogs
                    .OrderBy(b => b.Number)
                    .Select(b => new { b.Id, b.Number, b.Title })
                    .ToListAsync();

                return Ok(new
                {
                    Message = "Blog numbering fixed successfully",
                    TotalBlogs = fixedBlogs.Count,
                    BlogNumbers = fixedBlogs
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/blogs/test-ordering - Test blog ordering
        [HttpGet("test-ordering")]
        public async Task<ActionResult<object>> TestBlogOrdering()
        {
            try
            {
                var blogs = await _context.Blogs.ToListAsync();
                
                // Test different ordering methods
                var stringOrdered = blogs.OrderBy(b => b.Number).ToList();
                var numericOrdered = blogs.OrderBy(b => int.Parse(b.Number)).ToList();
                
                var result = new
                {
                    TotalBlogs = blogs.Count,
                    StringOrdered = stringOrdered.Select(b => new { b.Id, b.Number, b.Title }).ToList(),
                    NumericOrdered = numericOrdered.Select(b => new { b.Id, b.Number, b.Title }).ToList(),
                    StringOrderedNumbers = stringOrdered.Select(b => b.Number).ToList(),
                    NumericOrderedNumbers = numericOrdered.Select(b => b.Number).ToList()
                };

                Console.WriteLine("String ordering (wrong): " + string.Join(", ", result.StringOrderedNumbers));
                Console.WriteLine("Numeric ordering (correct): " + string.Join(", ", result.NumericOrderedNumbers));

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/blogs/debug-database - Debug database content
        [HttpGet("debug-database")]
        public async Task<ActionResult<object>> DebugDatabase()
        {
            try
            {
                var blogs = await _context.Blogs.ToListAsync();
                
                var debugInfo = new
                {
                    TotalBlogs = blogs.Count,
                    RawData = blogs.Select(b => new
                    {
                        b.Id,
                        Number = b.Number,
                        NumberType = b.Number?.GetType().Name ?? "NULL",
                        NumberLength = b.Number?.Length ?? 0,
                        NumberAsInt = int.TryParse(b.Number, out int num) ? num : -1,
                        b.Title,
                        b.CreatedAt
                    }).ToList(),
                    NumberAnalysis = new
                    {
                        UniqueNumbers = blogs.Select(b => b.Number).Distinct().OrderBy(n => n).ToList(),
                        NumberTypes = blogs.Select(b => b.Number?.GetType().Name ?? "NULL").Distinct().ToList(),
                        HasNullNumbers = blogs.Any(b => string.IsNullOrEmpty(b.Number)),
                        HasInvalidNumbers = blogs.Any(b => !int.TryParse(b.Number, out _))
                    }
                };

                Console.WriteLine("=== DATABASE DEBUG INFO ===");
                Console.WriteLine($"Total blogs: {debugInfo.TotalBlogs}");
                Console.WriteLine($"Unique numbers: {string.Join(", ", debugInfo.NumberAnalysis.UniqueNumbers)}");
                Console.WriteLine($"Number types: {string.Join(", ", debugInfo.NumberAnalysis.NumberTypes)}");
                Console.WriteLine($"Has null numbers: {debugInfo.NumberAnalysis.HasNullNumbers}");
                Console.WriteLine($"Has invalid numbers: {debugInfo.NumberAnalysis.HasInvalidNumbers}");
                
                foreach (var blog in debugInfo.RawData)
                {
                    Console.WriteLine($"Blog {blog.Id}: Number='{blog.Number}' (Type: {blog.NumberType}, Length: {blog.NumberLength}, AsInt: {blog.NumberAsInt})");
                }

                return Ok(debugInfo);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR in DebugDatabase: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/blogs/simple - Simple test endpoint
        [HttpGet("simple")]
        public async Task<ActionResult<object>> GetBlogsSimple()
        {
            try
            {
                var blogs = await _context.Blogs.ToListAsync();
                
                // Just return them in the order they come from database
                var simpleResult = blogs.Select(b => new
                {
                    b.Id,
                    b.Number,
                    b.Title,
                    NumberAsInt = int.TryParse(b.Number, out int num) ? num : -1
                }).ToList();
                
                Console.WriteLine("=== SIMPLE ENDPOINT DEBUG ===");
                foreach (var blog in simpleResult)
                {
                    Console.WriteLine($"ID: {blog.Id}, Number: '{blog.Number}', AsInt: {blog.NumberAsInt}, Title: {blog.Title}");
                }
                
                return Ok(simpleResult);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR in GetBlogsSimple: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Helper method to check if numbers are sequential
        private bool IsSequential(List<string> numbers)
        {
            if (numbers.Count <= 1) return true;
            
            for (int i = 0; i < numbers.Count - 1; i++)
            {
                if (int.Parse(numbers[i]) + 1 != int.Parse(numbers[i + 1]))
                {
                    return false;
                }
            }
            return true;
        }
    }
}
