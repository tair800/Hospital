using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalAPI.Models
{
    public class HomeSection
    {
        public int Id { get; set; }
        
        [Column("section_1_description")]
        [MaxLength(2000)]
        public string? Section1Description { get; set; }
        
        [Column("section_2_image")]
        [MaxLength(500)]
        public string? Section2Image { get; set; }
        
        [Column("section_3_image")]
        [MaxLength(500)]
        public string? Section3Image { get; set; }
        
        [Column("section_4_title")]
        [MaxLength(500)]
        public string? Section4Title { get; set; }
        
        [Column("section_4_description")]
        [MaxLength(2000)]
        public string? Section4Description { get; set; }
        
        [Column("section_4_purpose_title")]
        [MaxLength(500)]
        public string? Section4PurposeTitle { get; set; }
        
        [Column("section_4_purpose_description")]
        [MaxLength(2000)]
        public string? Section4PurposeDescription { get; set; }
        
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
