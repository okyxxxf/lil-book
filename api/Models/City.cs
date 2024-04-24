namespace api.Models
{
    public class City
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public List<Publisher>? PublisherList { get; set; } = [];
    }
}