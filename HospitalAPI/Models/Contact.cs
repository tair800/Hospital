using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalAPI.Models
{
    [Table("Contacts")]
    public class Contact
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Type { get; set; } = string.Empty; // phone, whatsapp, email, location
        
        [Required]
        [MaxLength(200)]
        public string Value { get; set; } = string.Empty;
        
        [MaxLength(100)]
        public string? Icon { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
