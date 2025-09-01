using System.ComponentModel.DataAnnotations;

namespace HospitalAPI.Models
{
    public class EmployeeDegree
    {
        public int Id { get; set; }
        
        public int EmployeeId { get; set; }
        
        [MaxLength(255)]
        public string UniversityName { get; set; }
        
        public int StartYear { get; set; }
        
        public int EndYear { get; set; }
        
        public int OrderNumber { get; set; }
        
        // Navigation property
        public Employee Employee { get; set; }
    }
}
