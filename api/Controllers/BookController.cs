using api.Data;
using api.Models;
using api.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("book")]
    [ApiController]
    public class BookController : ControllerBase
    {
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<Book>>> GetListAsync()
        {
            using (AppDbContext db = new())
            {
                IEnumerable<Book> BookList = await db.Book.ToArrayAsync();

                return Ok(BookList);
            }
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<Book>> GetAsync(int id)
        {
            if (id < 1) return BadRequest();

            using (AppDbContext db = new())
            {
                Book? Book = await db.Book.FirstOrDefaultAsync(bookDb => bookDb.Id == id);

                if (Book is null) return NotFound();

                return Ok(Book);
            }
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<BookDTO>> CreateAsync([FromBody] BookDTO bookDTO)
        {
            using (AppDbContext db = new())
            {
                if (await db.Book.FirstOrDefaultAsync(
                    BookDb =>
                        BookDb.Name.ToLower() == bookDTO.Name.ToLower() &&
                        BookDb.Year == bookDTO.Year
                ) is not null)
                {
                    ModelState.AddModelError("Custom Error", "Book already exists!");

                    return BadRequest(ModelState);
                }

                int? authorId = null;
                int? publisherId = null;

                if (bookDTO.AuthorId is not null)
                {
                    Author? author = await db.Author.FirstOrDefaultAsync(authorDb => authorDb.Id == bookDTO.AuthorId);

                    if (author is null) return NotFound("Author is null!");

                    authorId = author.Id;
                }

                if (bookDTO.PublisherId is not null)
                {
                    Publisher? publisher = await db.Publisher.FirstOrDefaultAsync(publisherDb => publisherDb.Id == bookDTO.PublisherId);

                    if (publisher is null) return NotFound("Publisher is null!");

                    publisherId = publisher.Id;
                }


                await db.Book.AddAsync(new()
                {
                    Name = bookDTO.Name,
                    Year = bookDTO.Year,
                    Price = bookDTO.Price,
                    Count = bookDTO.Count,
                    AuthorId = authorId,
                    PublisherId = publisherId,
                });

                await db.SaveChangesAsync();

                return Created("Book", bookDTO);
            }
        }

        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateAsync(int id, [FromBody] BookDTO bookDTO)
        {
            if (id < 1) return BadRequest();

            if (id != bookDTO.Id) return BadRequest();

            using (AppDbContext db = new())
            {
                if (await db.Book.FirstOrDefaultAsync(
                    BookDb =>
                        BookDb.Name.ToLower() == bookDTO.Name.ToLower() &&
                        BookDb.Year == bookDTO.Year
                ) is not null)
                {
                    ModelState.AddModelError("Custom Error", "Book already exists!");

                    return BadRequest(ModelState);
                }

                Book? bookToUpdate = await db.Book.FirstOrDefaultAsync(BookDb => BookDb.Id == id);

                if (bookToUpdate is null) return NotFound();

                int? authorId = null;
                int? publisherId = null;

                if (bookDTO.AuthorId is not null)
                {
                    Author? author = await db.Author.FirstOrDefaultAsync(authorDb => authorDb.Id == bookDTO.AuthorId);

                    if (author is null) return NotFound("Author is null!");

                    authorId = author.Id;
                }

                if (bookDTO.PublisherId is not null)
                {
                    Publisher? publisher = await db.Publisher.FirstOrDefaultAsync(publisherDb => publisherDb.Id == bookDTO.PublisherId);

                    if (publisher is null) return NotFound("Publisher is null!");

                    publisherId = publisher.Id;
                }

                bookToUpdate.Name = bookDTO.Name;
                bookToUpdate.Year = bookDTO.Year;
                bookToUpdate.Price = bookDTO.Price;
                bookToUpdate.Count = bookDTO.Count;
                bookToUpdate.AuthorId = authorId;
                bookToUpdate.PublisherId = publisherId;

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
                Book? book = await db.Book.FirstOrDefaultAsync(bookDb => bookDb.Id == id);

                if (book is null) return NotFound();

                db.Remove(book);

                await db.SaveChangesAsync();

                return NoContent();
            }
        }
    }
}