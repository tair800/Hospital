using System.ComponentModel.DataAnnotations;

namespace HospitalAPI.Models
{
    public class EventTimeline
    {
        public int Id { get; set; }
        
        [Required]
        public int EventId { get; set; }
        
        [Required]
        [MaxLength(10)]
        public string StartTime { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(10)]
        public string EndTime { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;
        
        [MaxLength(1000)]
        public string? Description { get; set; }
        
        [MaxLength(2000)]
        public string? Info { get; set; }
        
        [Required]
        public int OrderIndex { get; set; }
        
        public string CreatedAt { get; set; } = string.Empty;
        public string UpdatedAt { get; set; } = string.Empty;
        
        // Navigation property
        public Event? Event { get; set; }
    }
}
