using api.Data;
using api.Models;
using api.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("booking")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<Booking>>> GetListAsync()
        {
            using (AppDbContext db = new())
            {
                IEnumerable<Booking> bookingList = await db.Booking.ToArrayAsync();

                return Ok(bookingList);
            }
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<Booking>> GetAsync(int id)
        {
            if (id < 1) return BadRequest();

            using (AppDbContext db = new())
            {
                Booking? booking = await db.Booking.FirstOrDefaultAsync(bookingDb => bookingDb.Id == id);

                if (booking is null) return NotFound();

                return Ok(booking);
            }
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<BookingDTO>> CreateAsync([FromBody] BookingDTO bookingDTO)
        {
            using (AppDbContext db = new())
            {
                if (await db.Booking.FirstOrDefaultAsync(
                    bookingDb =>
                        bookingDb.BookId == bookingDTO.BookId &&
                        bookingDb.LibraryCardId == bookingDTO.LibraryCardId
                ) is not null)
                {
                    ModelState.AddModelError("Custom Error", "Booking already exists!");

                    return BadRequest(ModelState);
                }

                Book? book = await db.Book.FirstOrDefaultAsync(bookDb => bookDb.Id == bookingDTO.BookId);

                if (book is null) return NotFound("Book is null!");

                LibraryCard? libraryCard = await db.LibraryCard.FirstOrDefaultAsync(libraryCardDb => libraryCardDb.Id == bookingDTO.LibraryCardId);

                if (libraryCard is null) return NotFound("LibraryCard is null!");

                await db.Booking.AddAsync(new()
                {
                    Date = bookingDTO.Date,
                    BookId = book.Id,
                    LibraryCardId = libraryCard.Id,
                });

                await db.SaveChangesAsync();

                return Created("Booking", bookingDTO);
            }
        }

        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateAsync(int id, [FromBody] BookingDTO bookingDTO)
        {
            if (id < 1) return BadRequest();

            if (id != bookingDTO.Id) return BadRequest();

            using (AppDbContext db = new())
            {
                // if (await db.Booking.FirstOrDefaultAsync(
                //     bookingDb =>
                //         bookingDb.BookId == bookingDTO.BookId &&
                //         bookingDb.LibraryCardId == bookingDTO.LibraryCardId
                // ) is not null)
                // {
                //     ModelState.AddModelError("Custom Error", "Booking already exists!");

                //     return BadRequest(ModelState);
                // }

                Booking? bookingToUpdate = await db.Booking.FirstOrDefaultAsync(bookingDb => bookingDb.Id == id);

                if (bookingToUpdate is null) return NotFound();

                Book? book = await db.Book.FirstOrDefaultAsync(bookDb => bookDb.Id == bookingDTO.BookId);

                if (book is null) return NotFound("Book is null!");

                LibraryCard? libraryCard = await db.LibraryCard.FirstOrDefaultAsync(libraryCardDb => libraryCardDb.Id == bookingDTO.LibraryCardId);

                if (libraryCard is null) return NotFound("Library Card is null!");

                bookingToUpdate.Date = bookingDTO.Date;
                bookingToUpdate.BookId = book.Id;
                bookingToUpdate.LibraryCardId = libraryCard.Id;

                await db.SaveChangesAsync();

                return NoContent();
            }
        }

        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            if (id < 1) return BadRequest();

            using (AppDbContext db = new())
            {
                Booking? booking = await db.Booking.FirstOrDefaultAsync(bookingDb => bookingDb.Id == id);

                if (booking is null) return NotFound();

                db.Remove(booking);

                await db.SaveChangesAsync();

                return NoContent();
            }
        }
    }
}