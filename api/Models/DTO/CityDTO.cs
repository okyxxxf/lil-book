using System.ComponentModel.DataAnnotations;

namespace api.Models.DTO
{
    public class CityDTO
    {
        public int Id { get; set; }

        [Required]
        [Length(3, 30)]
        public string Name { get; set; } = null!;
    }
}