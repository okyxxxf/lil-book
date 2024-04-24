using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Admin> Admin { get; set;}
        public DbSet<Author> Author { get; set; }
        public DbSet<Book> Book { get; set; }
        public DbSet<Booking> Booking { get; set; }
        public DbSet<City> City { get; set; }
        public DbSet<Issuing> Issuing { get; set; }
        public DbSet<LibraryCard> LibraryCard { get; set; }
        public DbSet<Publisher> Publisher { get; set; }
        public DbSet<Reader> Reader { get; set; }

        public AppDbContext()
        {
            Database.EnsureCreated();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=AppData/Database.db");
        }
    }
}