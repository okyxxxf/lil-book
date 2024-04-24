namespace api.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public DateTime Date { get; set;}

        public int BookId { get; set; }
        public int LibraryCardId { get; set; }
    }
}