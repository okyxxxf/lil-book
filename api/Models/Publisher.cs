using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class Publisher
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public int? CityId { get; set; }
        public List<Book>? BookList { get; set; } = [];
    }
}