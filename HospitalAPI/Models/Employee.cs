using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
        [Column("detail_image")]
        public string DetailImage { get; set; }
        
        [MaxLength(50)]
        public string Phone { get; set; }
        
        [MaxLength(50)]
        public string WhatsApp { get; set; }
        
        [MaxLength(255)]
        public string Email { get; set; }
        
        [MaxLength(255)]
        public string Location { get; set; }
        
        [Column("first_desc")]
        public string FirstDesc { get; set; }
        
        [Column("second_desc")]
        public string SecondDesc { get; set; }
        
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties (not mapped to database)
        [NotMapped]
        public List<EmployeeDegree> Degrees { get; set; } = new List<EmployeeDegree>();
        [NotMapped]
        public List<EmployeeCertificate> Certificates { get; set; } = new List<EmployeeCertificate>();
    }
}
