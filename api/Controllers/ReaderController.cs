using api.Data;
using api.Models;
using api.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("reader")]
    [ApiController]
    public class ReaderController : ControllerBase
    {
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<Reader>>> GetListAsync()
        {
            using (AppDbContext db = new())
            {
                IEnumerable<Reader> readerList = await db.Reader.ToArrayAsync();

                return Ok(readerList);
            }
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<Reader>> GetAsync(int id)
        {
            if (id < 1) return BadRequest();

            using (AppDbContext db = new())
            {
                Reader? reader = await db.Reader.FirstOrDefaultAsync(readerDb => readerDb.Id == id);

                if (reader is null) return NotFound();

                return Ok(reader);
            }
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ReaderDTO>> CreateAsync([FromBody] ReaderDTO readerDTO)
        {
            using (AppDbContext db = new())
            {
                if (await db.Reader.FirstOrDefaultAsync(
                    readerDb =>
                        readerDb.FirstName.ToLower() == readerDTO.FirstName.ToLower() &&
                        readerDb.MiddleName.ToLower() == readerDTO.MiddleName.ToLower() &&
                        readerDb.LastName.ToLower() == readerDTO.LastName.ToLower()
                ) is not null)
                {
                    ModelState.AddModelError("Custom Error", "Reader already exists!");

                    return BadRequest(ModelState);
                }

                await db.Reader.AddAsync(new()
                {
                    FirstName = readerDTO.FirstName,
                    MiddleName = readerDTO.MiddleName,
                    LastName = readerDTO.LastName,
                    Phone = readerDTO.Phone,
                    Address = readerDTO.Address,
                });

                await db.SaveChangesAsync();

                return Created("Reader", readerDTO);
            }
        }

        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateAsync(int id, [FromBody] ReaderDTO readerDTO)
        {
            if (id < 1) return BadRequest();

            if (id != readerDTO.Id) return BadRequest();

            using (AppDbContext db = new())
            {
                if (await db.Reader.FirstOrDefaultAsync(
                    readerDb =>
                        readerDb.FirstName.ToLower() == readerDTO.FirstName.ToLower() &&
                        readerDb.MiddleName.ToLower() == readerDTO.MiddleName.ToLower() &&
                        readerDb.LastName.ToLower() == readerDTO.LastName.ToLower()
                ) is not null)
                {
                    ModelState.AddModelError("Custom Error", "Reader already exists!");

                    return BadRequest(ModelState);
                }

                Reader? readerToUpdate = await db.Reader.FirstOrDefaultAsync(readerDb => readerDb.Id == id);

                if (readerToUpdate is null) return NotFound();

                readerToUpdate.FirstName = readerDTO.FirstName;
                readerToUpdate.MiddleName = readerDTO.MiddleName;
                readerToUpdate.LastName = readerDTO.LastName;
                readerToUpdate.Phone = readerDTO.Phone;
                readerToUpdate.Address = readerDTO.Address;

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
                Reader? reader = await db.Reader.FirstOrDefaultAsync(readerDb => readerDb.Id == id);

                if (reader is null) return NotFound();

                db.Remove(reader);

                await db.SaveChangesAsync();

                return NoContent();
            }
        }
    }
}