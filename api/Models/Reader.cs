namespace api.Models
{
    public class Reader
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string MiddleName { get; set; } = null!;
        public string LastName { get; set;} = null!;
        public string Phone { get; set; } = null!;
        public string Address { get; set; } = null!;

        public int? LibraryCardId { get; set; }
    }
}