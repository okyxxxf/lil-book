using System.ComponentModel.DataAnnotations;

namespace api.Models.DTO
{
    public class BookDTO
    {
        public int Id { get; set; }

        [Required]
        [Length(3, 100)]
        public string Name { get; set; } = null!;
        
        [Required]
        public int Year { get; set; }
        
        [Required]
        public double Price { get; set; }
        
        [Required]
        public int Count { get; set; }

        public int? AuthorId { get; set; }
        public int? PublisherId { get; set; }
    }
}