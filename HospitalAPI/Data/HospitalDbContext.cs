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
        public DbSet<Blog> Blogs { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<SocialMedia> SocialMedia { get; set; }
        public DbSet<ContactHeading> ContactHeadings { get; set; }
        public DbSet<Logo> Logos { get; set; }
        public DbSet<AboutCarousel> AboutCarousel { get; set; }

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

            // Configure Blogs table
            modelBuilder.Entity<Blog>(entity =>
            {
                entity.HasKey(b => b.Id);
                entity.Property(b => b.Number).IsRequired().HasMaxLength(10).HasColumnType("nvarchar(10)");
                entity.Property(b => b.Title).IsRequired().HasMaxLength(300).HasColumnType("nvarchar(300)");
                entity.Property(b => b.Description).HasMaxLength(500).HasColumnType("nvarchar(500)");
                entity.Property(b => b.Date).IsRequired().HasMaxLength(50).HasColumnType("nvarchar(50)");
                entity.Property(b => b.SecondDescTitle).HasMaxLength(200).HasColumnType("nvarchar(200)");
                entity.Property(b => b.SecondDescBody).HasMaxLength(1000).HasColumnType("nvarchar(1000)");
                entity.Property(b => b.ThirdTextTitle).HasMaxLength(200).HasColumnType("nvarchar(200)");
                entity.Property(b => b.ThirdTextBody).HasMaxLength(1000).HasColumnType("nvarchar(1000)");
                entity.Property(b => b.CreatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(b => b.UpdatedAt).HasDefaultValueSql("GETDATE()");
            });

            // Configure Contacts table
            modelBuilder.Entity<Contact>(entity =>
            {
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Type).IsRequired().HasMaxLength(100).HasColumnType("nvarchar(100)");
                entity.Property(c => c.Value).IsRequired().HasMaxLength(200).HasColumnType("nvarchar(200)");
                entity.Property(c => c.Icon).HasMaxLength(100).HasColumnType("nvarchar(100)");
                entity.Property(c => c.CreatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(c => c.UpdatedAt).HasDefaultValueSql("GETDATE()");
            });

            // Configure SocialMedia table
            modelBuilder.Entity<SocialMedia>(entity =>
            {
                entity.HasKey(s => s.Id);
                entity.Property(s => s.Platform).IsRequired().HasMaxLength(50).HasColumnType("nvarchar(50)");
                entity.Property(s => s.Name).IsRequired().HasMaxLength(100).HasColumnType("nvarchar(100)");
                entity.Property(s => s.Url).IsRequired().HasMaxLength(500).HasColumnType("nvarchar(500)");
                entity.Property(s => s.Icon).HasMaxLength(100).HasColumnType("nvarchar(100)");
                entity.Property(s => s.CreatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(s => s.UpdatedAt).HasDefaultValueSql("GETDATE()");
            });

            // Configure ContactHeadings table
            modelBuilder.Entity<ContactHeading>(entity =>
            {
                entity.HasKey(ch => ch.Id);
                entity.Property(ch => ch.Line1).IsRequired().HasMaxLength(100).HasColumnType("nvarchar(100)");
                entity.Property(ch => ch.Line2).IsRequired().HasMaxLength(100).HasColumnType("nvarchar(100)");
                entity.Property(ch => ch.CreatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(ch => ch.UpdatedAt).HasDefaultValueSql("GETDATE()");
            });

            // Configure Logos table
            modelBuilder.Entity<Logo>(entity =>
            {
                entity.HasKey(l => l.Id);
                entity.Property(l => l.Name).IsRequired().HasMaxLength(100).HasColumnType("nvarchar(100)");
                entity.Property(l => l.Image).IsRequired().HasMaxLength(500).HasColumnType("nvarchar(500)");
                entity.Property(l => l.CreatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(l => l.UpdatedAt).HasDefaultValueSql("GETDATE()");
            });

            // Configure AboutCarousel table
            modelBuilder.Entity<AboutCarousel>(entity =>
            {
                entity.HasKey(ac => ac.Id);
                entity.Property(ac => ac.Name).IsRequired().HasMaxLength(200).HasColumnType("nvarchar(200)");
                entity.Property(ac => ac.Image).IsRequired().HasMaxLength(500).HasColumnType("nvarchar(500)");
                entity.Property(ac => ac.CreatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(ac => ac.UpdatedAt).HasDefaultValueSql("GETDATE()");
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
