using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalAPI.Models
{
    [Table("Blogs")]
    public class Blog
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(10)]
        public string Number { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(300)]
        public string Title { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string? Description { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string Date { get; set; } = string.Empty;
        
        public int Visitors { get; set; } = 0;
        
        [MaxLength(200)]
        public string? SecondDescTitle { get; set; }
        
        [MaxLength(1000)]
        public string? SecondDescBody { get; set; }
        
        [MaxLength(200)]
        public string? ThirdTextTitle { get; set; }
        
        [MaxLength(1000)]
        public string? ThirdTextBody { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
