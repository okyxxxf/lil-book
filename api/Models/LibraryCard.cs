namespace api.Models
{
    public class LibraryCard
    {
        public int Id { get; set; }
        public DateTime DateCreated { get; set; }
        
        public Reader Reader { get; set; } = null!;
    }
}