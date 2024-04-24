using System.ComponentModel.DataAnnotations;

namespace api.Models.DTO
{
    public class BookingDTO
    {
        public int Id { get; set; }

        [Required]
        public DateTime Date { get; set;}

        [Required]
        public int BookId { get; set; }

        [Required]
        public int LibraryCardId { get; set; }
    }
}