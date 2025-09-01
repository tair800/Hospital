using System.ComponentModel.DataAnnotations;

namespace HospitalAPI.Models
{
    public class EmployeeCertificate
    {
        public int Id { get; set; }
        
        public int EmployeeId { get; set; }
        
        [MaxLength(500)]
        public string CertificateImage { get; set; }
        
        [MaxLength(255)]
        public string CertificateName { get; set; }
        
        public int OrderNumber { get; set; }
        
        // Navigation property
        public Employee Employee { get; set; }
    }
}
