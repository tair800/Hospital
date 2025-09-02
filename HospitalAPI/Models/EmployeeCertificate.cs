using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalAPI.Models
{
    [Table("Employee_certificates")]
    public class EmployeeCertificate
    {
        public int Id { get; set; }
        
        [Column("employee_id")]
        public int EmployeeId { get; set; }
        
        [MaxLength(500)]
        [Column("certificate_image")]
        public string CertificateImage { get; set; }
        
        [MaxLength(255)]
        [Column("certificate_name")]
        public string CertificateName { get; set; }
    }
}
