using System.ComponentModel.DataAnnotations;

namespace HospitalAPI.Models
{
    public class About
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(500)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(500)]
        public string Img { get; set; } = string.Empty;
    }
}
