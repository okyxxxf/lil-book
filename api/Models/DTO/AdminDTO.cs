using System.ComponentModel.DataAnnotations;

namespace api.Models.DTO
{
    public class AdminDTO
    {
        public int Id { get; set; }

        [Required]
        [Length(3, 20)]
        public string Login { get; set; } = null!;

        [Required]
        [Length(10, 20)]
        public string Password { get; set; } = null!;
    }
}