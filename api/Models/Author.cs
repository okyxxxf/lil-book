namespace api.Models
{
    public class Author
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string MiddleName { get; set; } = null!;
        public string LastName { get; set;} = null!;

        public List<Book>? BookList { get; set; } = [];
    }
}