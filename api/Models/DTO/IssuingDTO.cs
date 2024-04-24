using System.ComponentModel.DataAnnotations;

namespace api.Models.DTO
{
    public class IssuingDTO
    {
        public int Id { get; set; }

        [Required]
        public DateTime DateIssue { get; set;}

        [Required]
        public DateTime DateReturn { get; set;}

        [Required]
        public int BookId { get; set; }

        [Required]
        public int LibraryCardId { get; set; }
    }
}