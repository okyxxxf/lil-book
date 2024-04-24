using api.Data;
using api.Models;
using api.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("issuing")]
    [ApiController]
    public class IssuingController : ControllerBase
    {
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<Issuing>>> GetListAsync()
        {
            using (AppDbContext db = new())
            {
                IEnumerable<Issuing> issuingList = await db.Issuing.ToArrayAsync();

                return Ok(issuingList);
            }
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<Issuing>> GetAsync(int id)
        {
            if (id < 1) return BadRequest();

            using (AppDbContext db = new())
            {
                Issuing? issuing = await db.Issuing.FirstOrDefaultAsync(issuingDb => issuingDb.Id == id);

                if (issuing is null) return NotFound();

                return Ok(issuing);
            }
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IssuingDTO>> CreateAsync([FromBody] IssuingDTO issuingDTO)
        {
            using (AppDbContext db = new())
            {
                if (await db.Issuing.FirstOrDefaultAsync(
                    issuingDb =>
                        issuingDb.BookId == issuingDTO.BookId &&
                        issuingDb.LibraryCardId == issuingDTO.LibraryCardId
                ) is not null)
                {
                    ModelState.AddModelError("Custom Error", "Issuing already exists!");

                    return BadRequest(ModelState);
                }

                Book? book = await db.Book.FirstOrDefaultAsync(bookDb => bookDb.Id == issuingDTO.BookId);

                if (book is null) return NotFound("Book is null!");

                LibraryCard? libraryCard = await db.LibraryCard.FirstOrDefaultAsync(libraryCardDb => libraryCardDb.Id == issuingDTO.LibraryCardId);

                if (libraryCard is null) return NotFound("LibraryCard is null!");

                await db.Issuing.AddAsync(new()
                {
                    DateIssue = issuingDTO.DateIssue,
                    DateReturn = issuingDTO.DateReturn,
                    BookId = book.Id,
                    LibraryCardId = libraryCard.Id,
                });

                await db.SaveChangesAsync();

                return Created("Issuing", issuingDTO);
            }
        }

        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateAsync(int id, [FromBody] IssuingDTO issuingDTO)
        {
            if (id < 1) return BadRequest();

            if (id != issuingDTO.Id) return BadRequest();

            using (AppDbContext db = new())
            {
                if (await db.Issuing.FirstOrDefaultAsync(
                    issuingDb =>
                        issuingDb.BookId == issuingDTO.BookId &&
                        issuingDb.LibraryCardId == issuingDTO.LibraryCardId
                ) is not null)
                {
                    ModelState.AddModelError("Custom Error", "Issuing already exists!");

                    return BadRequest(ModelState);
                }

                Issuing? issuingToUpdate = await db.Issuing.FirstOrDefaultAsync(issuingDb => issuingDb.Id == id);

                if (issuingToUpdate is null) return NotFound();

                Book? book = await db.Book.FirstOrDefaultAsync(bookDb => bookDb.Id == issuingDTO.BookId);

                if (book is null) return NotFound("Book is null!");

                LibraryCard? libraryCard = await db.LibraryCard.FirstOrDefaultAsync(libraryCardDb => libraryCardDb.Id == issuingDTO.LibraryCardId);

                if (libraryCard is null) return NotFound("Library Card is null!");

                issuingToUpdate.DateIssue = issuingDTO.DateIssue;
                issuingToUpdate.DateReturn = issuingDTO.DateReturn;
                issuingToUpdate.BookId = book.Id;
                issuingToUpdate.LibraryCardId = libraryCard.Id;

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
                Issuing? issuing = await db.Issuing.FirstOrDefaultAsync(issuingDb => issuingDb.Id == id);

                if (issuing is null) return NotFound();

                db.Remove(issuing);

                await db.SaveChangesAsync();

                return NoContent();
            }
        }
    }
}