using System.ComponentModel.DataAnnotations;

namespace HospitalAPI.Models
{
    public class Employee
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(255)]
        public string Fullname { get; set; }
        
        [Required]
        [MaxLength(255)]
        public string Field { get; set; }
        
        [Required]
        [MaxLength(255)]
        public string Clinic { get; set; }
        
        [MaxLength(500)]
        public string Image { get; set; }
        
        [MaxLength(500)]
        public string DetailImage { get; set; }
        
        [MaxLength(50)]
        public string Phone { get; set; }
        
        [MaxLength(50)]
        public string WhatsApp { get; set; }
        
        [MaxLength(255)]
        public string Email { get; set; }
        
        [MaxLength(255)]
        public string Location { get; set; }
        
        public string FirstDesc { get; set; }
        
        public string SecondDesc { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
