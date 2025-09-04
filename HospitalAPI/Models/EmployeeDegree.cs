using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalAPI.Models
{
    [Table("Employee_degrees")]
    public class EmployeeDegree
    {
        public int Id { get; set; }
        
        [Column("employee_id")]
        public int EmployeeId { get; set; }
        
        [Required]
        [MaxLength(255)]
        [Column("university_name")]
        public string UniversityName { get; set; } = string.Empty;
        
        [Column("start_year")]
        public int StartYear { get; set; }
        
        [Column("end_year")]
        public int EndYear { get; set; }
    }
}
