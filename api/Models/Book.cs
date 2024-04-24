namespace api.Models
{
    public class Book
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public int Year { get; set; }
        public double Price { get; set; }
        public int Count { get; set; }

        public int? AuthorId { get; set; }
        public int? PublisherId { get; set; }
    }
}