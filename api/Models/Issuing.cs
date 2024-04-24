namespace api.Models
{
    public class Issuing
    {
        public int Id { get; set; }
        public DateTime DateIssue { get; set;}
        public DateTime DateReturn { get; set;}

        public int BookId { get; set; }
        public int LibraryCardId { get; set; }
    }
}