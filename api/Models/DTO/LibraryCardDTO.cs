using System.ComponentModel.DataAnnotations;

namespace api.Models.DTO
{
    public class LibraryCardDTO
    {
        public int Id { get; set; }

        [Required]
        public DateTime DateCreated { get; set; }
        
        [Required]
        public int ReaderId { get; set; }
    }
}