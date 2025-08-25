using Microsoft.EntityFrameworkCore;
using HospitalAPI.Models;

namespace HospitalAPI.Data
{
    public class HospitalDbContext : DbContext
    {
        public HospitalDbContext(DbContextOptions<HospitalDbContext> options) : base(options)
        {
        }

        public DbSet<Event> Events { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configure Events table with proper Unicode support
            modelBuilder.Entity<Event>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200).HasColumnType("nvarchar(200)");
                entity.Property(e => e.Subtitle).HasMaxLength(300).HasColumnType("nvarchar(300)");
                entity.Property(e => e.Description).HasMaxLength(1000).HasColumnType("nvarchar(1000)");
                entity.Property(e => e.Venue).HasMaxLength(200).HasColumnType("nvarchar(200)");
                entity.Property(e => e.Trainer).HasMaxLength(100).HasColumnType("nvarchar(100)");
                entity.Property(e => e.Time).HasMaxLength(10).HasColumnType("nvarchar(10)");
                entity.Property(e => e.Currency).HasMaxLength(3).HasColumnType("nvarchar(3)");
                entity.Property(e => e.MainImage).HasMaxLength(500).HasColumnType("nvarchar(500)");
                entity.Property(e => e.DetailImageLeft).HasMaxLength(500).HasColumnType("nvarchar(500)");
                entity.Property(e => e.DetailImageMain).HasMaxLength(500).HasColumnType("nvarchar(500)");
                entity.Property(e => e.DetailImageRight).HasMaxLength(500).HasColumnType("nvarchar(500)");
                entity.Property(e => e.Price).HasColumnType("decimal(10,2)");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETDATE()");
            });
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                // This will be configured in Program.cs, but we can add fallback here
            }
        }
    }
}
