using api.Data;
using api.Models;
using api.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("author")]
    [ApiController]
    public class AuthorController : ControllerBase
    {
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<Author>>> GetListAsync()
        {
            using (AppDbContext db = new())
            {
                IEnumerable<Author> authorList = await db.Author.Include(authorDb => authorDb.BookList).ToArrayAsync();

                return Ok(authorList);
            }
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<Author>> GetAsync(int id)
        {
            if (id < 1) return BadRequest();

            using (AppDbContext db = new())
            {
                Author? author = await db.Author.Include(authorDb => authorDb.BookList).FirstOrDefaultAsync(authorDb => authorDb.Id == id);

                if (author is null) return NotFound();

                return Ok(author);
            }
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<AuthorDTO>> CreateAsync([FromBody] AuthorDTO authorDTO)
        {
            using (AppDbContext db = new())
            {
                if (await db.Author.FirstOrDefaultAsync(
                    authorDb =>
                        authorDb.FirstName.ToLower() == authorDTO.FirstName.ToLower() &&
                        authorDb.MiddleName.ToLower() == authorDTO.MiddleName.ToLower() &&
                        authorDb.LastName.ToLower() == authorDTO.LastName.ToLower()
                ) is not null)
                {
                    ModelState.AddModelError("Custom Error", "Author already exists!");

                    return BadRequest(ModelState);
                }

                await db.Author.AddAsync(new()
                {
                    FirstName = authorDTO.FirstName,
                    MiddleName = authorDTO.MiddleName,
                    LastName = authorDTO.LastName,
                });

                await db.SaveChangesAsync();

                return Created("Author", authorDTO);
            }
        }

        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateAsync(int id, [FromBody] AuthorDTO authorDTO)
        {
            if (id < 1) return BadRequest();

            if (id != authorDTO.Id) return BadRequest();

            using (AppDbContext db = new())
            {
                if (await db.Author.FirstOrDefaultAsync(
                    authorDb =>
                        authorDb.FirstName.ToLower() == authorDTO.FirstName.ToLower() &&
                        authorDb.MiddleName.ToLower() == authorDTO.MiddleName.ToLower() &&
                        authorDb.LastName.ToLower() == authorDTO.LastName.ToLower()
                ) is not null)
                {
                    ModelState.AddModelError("Custom Error", "Author already exists!");

                    return BadRequest(ModelState);
                }

                Author? authorToUpdate = await db.Author.FirstOrDefaultAsync(authorDb => authorDb.Id == id);

                if (authorToUpdate is null) return NotFound();

                authorToUpdate.FirstName = authorDTO.FirstName;
                authorToUpdate.MiddleName = authorDTO.MiddleName;
                authorToUpdate.LastName = authorDTO.LastName;

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
                Author? author = await db.Author.FirstOrDefaultAsync(authorDb => authorDb.Id == id);

                if (author is null) return NotFound();

                IQueryable<Book>? bookList = db.Book.Where(bookDb => bookDb.AuthorId == author.Id);

                if (bookList is not null)
                {
                    foreach(Book book in bookList)
                    {
                        book.AuthorId = null;
                    }
                }

                db.Remove(author);

                await db.SaveChangesAsync();

                return NoContent();
            }
        }
    }
}