using System.ComponentModel.DataAnnotations;

namespace HospitalAPI.Models
{
    public class EventEmployee
    {
        public int Id { get; set; }
        
        [Required]
        public int EventId { get; set; }
        
        [Required]
        public int EmployeeId { get; set; }
        
        public string CreatedAt { get; set; } = string.Empty;
        public string UpdatedAt { get; set; } = string.Empty;
        
        // Navigation properties
        public Event? Event { get; set; }
        public Employee? Employee { get; set; }
    }
}
