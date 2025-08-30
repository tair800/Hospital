using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalAPI.Models
{
    [Table("Events")]
    public class Event
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [MaxLength(300)]
        public string? Subtitle { get; set; }
        
        [MaxLength(1000)]
        public string? Description { get; set; }
        
        public string? LongDescription { get; set; }
        
        [Required]
        public DateTime EventDate { get; set; }
        
        [MaxLength(10)]
        public string? Time { get; set; }
        
        [MaxLength(200)]
        public string? Venue { get; set; }
        
        [MaxLength(100)]
        public string? Trainer { get; set; }
        
        [Required]
        public bool IsFree { get; set; }
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal? Price { get; set; }
        
        [MaxLength(3)]
        public string Currency { get; set; } = "AZN";
        
        [MaxLength(500)]
        public string? MainImage { get; set; }
        
        [MaxLength(500)]
        public string? DetailImageLeft { get; set; }
        
        [MaxLength(500)]
        public string? DetailImageMain { get; set; }
        
        [MaxLength(500)]
        public string? DetailImageRight { get; set; }
        
        public bool IsMain { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
