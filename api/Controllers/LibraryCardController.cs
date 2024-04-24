using api.Data;
using api.Models;
using api.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("library-card")]
    [ApiController]
    public class LibraryCardController : ControllerBase
    {
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<LibraryCard>>> GetListAsync()
        {
            using (AppDbContext db = new())
            {
                IEnumerable<LibraryCard> libraryCardList = await db.LibraryCard.Include(libraryCardDb => libraryCardDb.Reader).ToArrayAsync();

                return Ok(libraryCardList);
            }
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<LibraryCard>> GetAsync(int id)
        {
            if (id < 1) return BadRequest();

            using (AppDbContext db = new())
            {
                LibraryCard? libraryCard = await db.LibraryCard.Include(libraryCardDb => libraryCardDb.Reader).FirstOrDefaultAsync(libraryCardDb => libraryCardDb.Id == id);

                if (libraryCard is null) return NotFound();

                return Ok(libraryCard);
            }
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<LibraryCardDTO>> CreateAsync([FromBody] LibraryCardDTO libraryCardDTO)
        {
            using (AppDbContext db = new())
            {
                if (await db.LibraryCard.FirstOrDefaultAsync(
                    libraryCardDb =>
                        libraryCardDb.Reader.Id == libraryCardDTO.ReaderId
                ) is not null)
                {
                    ModelState.AddModelError("Custom Error", "Library Card already exists!");

                    return BadRequest(ModelState);
                }

                Reader? reader = await db.Reader.FirstOrDefaultAsync(readerDb => readerDb.Id == libraryCardDTO.ReaderId);

                if (reader is null) return NotFound("Reader is null!");

                await db.LibraryCard.AddAsync(new()
                {
                    DateCreated = libraryCardDTO.DateCreated,
                    Reader = reader,
                });

                await db.SaveChangesAsync();

                return Created("LibraryCard", libraryCardDTO);
            }
        }

        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateAsync(int id, [FromBody] LibraryCardDTO libraryCardDTO)
        {
            if (id < 1) return BadRequest();
            if (id != libraryCardDTO.Id) return BadRequest();

            using (AppDbContext db = new())
            {
                if (await db.LibraryCard.FirstOrDefaultAsync(
                    libraryCardDb =>
                        libraryCardDb.Reader.Id == libraryCardDTO.ReaderId
                ) is not null)
                {
                    ModelState.AddModelError("Custom Error", "Library Card already exists!");

                    return BadRequest(ModelState);
                }

                LibraryCard? libraryCardToUpdate = await db.LibraryCard.FirstOrDefaultAsync(libraryCardDb => libraryCardDb.Id == id);

                if (libraryCardToUpdate is null) return NotFound();

                Reader? reader = await db.Reader.FirstOrDefaultAsync(readerDb => readerDb.Id == libraryCardDTO.ReaderId);

                if (reader is null) return NotFound("Reader is null!");

                libraryCardToUpdate.DateCreated = libraryCardDTO.DateCreated;
                libraryCardToUpdate.Reader = reader;

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
                LibraryCard? libraryCard = await db.LibraryCard.FirstOrDefaultAsync(libraryCardDb => libraryCardDb.Id == id);

                if (libraryCard is null) return NotFound();

                db.Remove(libraryCard);

                await db.SaveChangesAsync();

                return NoContent();
            }
        }
    }
}