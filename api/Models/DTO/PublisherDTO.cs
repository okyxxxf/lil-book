using System.ComponentModel.DataAnnotations;

namespace api.Models.DTO
{
    public class PublisherDTO
    {
        public int Id { get; set; }

        [Required]
        [Length(3, 50)]
        public string Name { get; set; } = null!;

        public int? CityId { get; set; }
    }
}