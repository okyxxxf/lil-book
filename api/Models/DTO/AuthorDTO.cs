using System.ComponentModel.DataAnnotations;

namespace api.Models.DTO
{
    public class AuthorDTO
    {
        public int Id { get; set; }

        [Required]
        [Length(3, 15)]
        public string FirstName { get; set; } = null!;

        [Required]
        [Length(3, 25)]
        public string MiddleName { get; set; } = null!;
        
        [Required]
        [Length(3, 20)]
        public string LastName { get; set; } = null!;
    }
}