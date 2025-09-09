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
        public DbSet<Employee> Employees { get; set; }
        public DbSet<EmployeeDegree> EmployeeDegrees { get; set; }
        public DbSet<EmployeeCertificate> EmployeeCertificates { get; set; }

        public DbSet<Logo> Logos { get; set; }
        public DbSet<AboutCarousel> AboutCarousel { get; set; }
        public DbSet<About> About { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<HomeSection> HomeSections { get; set; }
        public DbSet<Gallery> Gallery { get; set; }
        public DbSet<Request> Requests { get; set; }
        public DbSet<EventEmployee> EventEmployees { get; set; }
        public DbSet<EventSpeaker> EventSpeakers { get; set; }
        public DbSet<EventTimeline> EventTimeline { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configure Events table for SQLite
            modelBuilder.Entity<Event>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Subtitle).HasMaxLength(300);
                entity.Property(e => e.Description).HasMaxLength(1000);
                entity.Property(e => e.Venue).HasMaxLength(200);
                entity.Property(e => e.Trainer).HasMaxLength(100);
                entity.Property(e => e.Time).HasMaxLength(10);
                entity.Property(e => e.Currency).HasMaxLength(3);
                entity.Property(e => e.MainImage).HasMaxLength(500);
                entity.Property(e => e.DetailImageLeft).HasMaxLength(500);
                entity.Property(e => e.DetailImageMain).HasMaxLength(500);
                entity.Property(e => e.DetailImageRight).HasMaxLength(500);
                entity.Property(e => e.Price).HasColumnType("REAL");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // Configure Blogs table for SQLite
            modelBuilder.Entity<Blog>(entity =>
            {
                entity.HasKey(b => b.Id);
                entity.Property(b => b.Number).IsRequired().HasMaxLength(10);
                entity.Property(b => b.Title).IsRequired().HasMaxLength(300);
                entity.Property(b => b.Description).HasMaxLength(500);
                entity.Property(b => b.Date).IsRequired().HasMaxLength(50);
                entity.Property(b => b.SecondDescTitle).HasMaxLength(200);
                entity.Property(b => b.SecondDescBody).HasMaxLength(1000);
                entity.Property(b => b.ThirdTextTitle).HasMaxLength(200);
                entity.Property(b => b.ThirdTextBody).HasMaxLength(1000);
                entity.Property(b => b.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(b => b.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });



            // Configure Logos table for SQLite
            modelBuilder.Entity<Logo>(entity =>
            {
                entity.HasKey(l => l.Id);
                entity.Property(l => l.Name).IsRequired().HasMaxLength(100);
                entity.Property(l => l.Image).IsRequired().HasMaxLength(500);
                entity.Property(l => l.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(l => l.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // Configure AboutCarousel table for SQLite
            modelBuilder.Entity<AboutCarousel>(entity =>
            {
                entity.HasKey(ac => ac.Id);
                entity.Property(ac => ac.Name).IsRequired().HasMaxLength(200);
                entity.Property(ac => ac.Image).IsRequired().HasMaxLength(500);
                entity.Property(ac => ac.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(ac => ac.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // Configure About table for SQLite
            modelBuilder.Entity<About>(entity =>
            {
                entity.HasKey(a => a.Id);
                entity.Property(a => a.Title).IsRequired().HasMaxLength(500);
                entity.Property(a => a.Description).IsRequired();
                entity.Property(a => a.Img).IsRequired().HasMaxLength(500);
            });

            // Configure Contact table for SQLite
            modelBuilder.Entity<Contact>(entity =>
            {
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Type).IsRequired().HasMaxLength(50);
                entity.Property(c => c.Value).IsRequired().HasMaxLength(500);
                entity.Property(c => c.Icon).IsRequired().HasMaxLength(100);
                entity.Property(c => c.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(c => c.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // Configure HomeSection table for SQLite
            modelBuilder.Entity<HomeSection>(entity =>
            {
                entity.HasKey(h => h.Id);
                entity.Property(h => h.Section1Description).HasColumnName("section_1_description").HasMaxLength(2000);
                entity.Property(h => h.Section2Image).HasColumnName("section_2_image").HasMaxLength(500);
                entity.Property(h => h.Section3Image).HasColumnName("section_3_image").HasMaxLength(500);
                entity.Property(h => h.Section4Title).HasColumnName("section_4_title").HasMaxLength(500);
                entity.Property(h => h.Section4Description).HasColumnName("section_4_description").HasMaxLength(2000);
                entity.Property(h => h.Section4PurposeTitle).HasColumnName("section_4_purpose_title").HasMaxLength(500);
                entity.Property(h => h.Section4PurposeDescription).HasColumnName("section_4_purpose_description").HasMaxLength(2000);
                entity.Property(h => h.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(h => h.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // Configure Gallery table for SQLite
            modelBuilder.Entity<Gallery>(entity =>
            {
                entity.HasKey(g => g.Id);
                entity.Property(g => g.Title).IsRequired().HasMaxLength(200);
                entity.Property(g => g.Description).HasMaxLength(500);
                entity.Property(g => g.Image).IsRequired().HasMaxLength(500);
                entity.Property(g => g.IsActive).HasDefaultValue(true);
                entity.Property(g => g.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(g => g.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // Configure Employee table for SQLite
            modelBuilder.Entity<Employee>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Fullname).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Field).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Clinic).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Image).HasMaxLength(500);
                entity.Property(e => e.DetailImage).HasMaxLength(500);
                entity.Property(e => e.Phone).HasMaxLength(50);
                entity.Property(e => e.WhatsApp).HasMaxLength(50);
                entity.Property(e => e.Email).HasMaxLength(255);
                entity.Property(e => e.Location).HasMaxLength(255);
                entity.Property(e => e.FirstDesc);
                entity.Property(e => e.SecondDesc);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                
                // Configure relationships
                entity.HasMany<EmployeeDegree>()
                    .WithOne()
                    .HasForeignKey(ed => ed.EmployeeId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasMany<EmployeeCertificate>()
                    .WithOne()
                    .HasForeignKey(ec => ec.EmployeeId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure EmployeeDegree table for SQLite
            modelBuilder.Entity<EmployeeDegree>(entity =>
            {
                entity.ToTable("Employee_degrees");
                entity.HasKey(ed => ed.Id);
                entity.Property(ed => ed.UniversityName).IsRequired().HasMaxLength(255);
            });

            // Configure EmployeeCertificate table for SQLite
            modelBuilder.Entity<EmployeeCertificate>(entity =>
            {
                entity.ToTable("Employee_certificates");
                entity.HasKey(ec => ec.Id);
                entity.Property(ec => ec.CertificateImage).IsRequired().HasMaxLength(500);
                entity.Property(ec => ec.CertificateName).IsRequired().HasMaxLength(255);
            });

            // Configure Request table for SQLite
            modelBuilder.Entity<Request>(entity =>
            {
                entity.HasKey(r => r.Id);
                entity.Property(r => r.Name).IsRequired().HasMaxLength(100);
                entity.Property(r => r.Surname).IsRequired().HasMaxLength(100);
                entity.Property(r => r.Email).IsRequired().HasMaxLength(255);
                entity.Property(r => r.Phone).IsRequired().HasMaxLength(20);
                entity.Property(r => r.FinCode).IsRequired().HasMaxLength(20);
                entity.Property(r => r.Vezife).IsRequired().HasMaxLength(200);
                entity.Property(r => r.Status).IsRequired().HasMaxLength(20).HasDefaultValue("pending");
                entity.Property(r => r.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(r => r.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // Configure EventEmployee table for SQLite
            modelBuilder.Entity<EventEmployee>(entity =>
            {
                entity.HasKey(ee => ee.Id);
                entity.Property(ee => ee.EventId).IsRequired();
                entity.Property(ee => ee.EmployeeId).IsRequired();
                entity.Property(ee => ee.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(ee => ee.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                
                // Configure relationships
                entity.HasOne<Event>()
                    .WithMany()
                    .HasForeignKey(ee => ee.EventId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne<Employee>()
                    .WithMany()
                    .HasForeignKey(ee => ee.EmployeeId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure EventSpeaker table for SQLite
            modelBuilder.Entity<EventSpeaker>(entity =>
            {
                entity.HasKey(es => es.Id);
                entity.Property(es => es.EventId).IsRequired();
                entity.Property(es => es.Name).IsRequired().HasMaxLength(255);
                entity.Property(es => es.Title).IsRequired().HasMaxLength(255);
                entity.Property(es => es.Image).HasMaxLength(500);
                entity.Property(es => es.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(es => es.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                
                // Configure relationship with Event
                entity.HasOne<Event>()
                    .WithMany()
                    .HasForeignKey(es => es.EventId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure EventTimeline table for SQLite
            modelBuilder.Entity<EventTimeline>(entity =>
            {
                entity.HasKey(et => et.Id);
                entity.Property(et => et.EventId).IsRequired();
                entity.Property(et => et.StartTime).IsRequired().HasMaxLength(10);
                entity.Property(et => et.EndTime).IsRequired().HasMaxLength(10);
                entity.Property(et => et.Title).IsRequired().HasMaxLength(255);
                entity.Property(et => et.Description).HasMaxLength(1000);
                entity.Property(et => et.Info).HasMaxLength(2000);
                entity.Property(et => et.OrderIndex).IsRequired();
                entity.Property(et => et.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(et => et.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                
                // Configure relationship with Event
                entity.HasOne<Event>()
                    .WithMany()
                    .HasForeignKey(et => et.EventId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlite("Data Source=HospitalAPI.db");
            }
        }
    }
}
