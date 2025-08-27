using System.ComponentModel.DataAnnotations;

namespace HospitalAPI.Models
{
    public class Contact
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string Type { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(500)]
        public string Value { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string Icon { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
