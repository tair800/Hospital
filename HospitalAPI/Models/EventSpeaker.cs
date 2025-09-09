using System.ComponentModel.DataAnnotations;

namespace HospitalAPI.Models
{
    public class EventSpeaker
    {
        public int Id { get; set; }
        
        [Required]
        public int EventId { get; set; }
        
        [Required]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string? Image { get; set; }
        
        public string CreatedAt { get; set; } = string.Empty;
        public string UpdatedAt { get; set; } = string.Empty;
        
        // Navigation property
        public Event? Event { get; set; }
    }
}
