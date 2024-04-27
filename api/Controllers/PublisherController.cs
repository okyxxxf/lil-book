using api.Data;
using api.Models;
using api.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("publisher")]
    [ApiController]
    public class PublisherController : ControllerBase
    {
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<Publisher>>> GetListAsync()
        {
            using (AppDbContext db = new())
            {
                IEnumerable<Publisher> publisherList = await db.Publisher.Include(publisherDb => publisherDb.BookList).ToArrayAsync();

                return Ok(publisherList);
            }
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<Publisher>> GetAsync(int id)
        {
            if (id < 1) return BadRequest();

            using (AppDbContext db = new())
            {
                Publisher? publisher = await db.Publisher.Include(publisherDb => publisherDb.BookList).FirstOrDefaultAsync(publisherDb => publisherDb.Id == id);

                if (publisher is null) return NotFound();

                return Ok(publisher);
            }
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<PublisherDTO>> CreateAsync([FromBody] PublisherDTO publisherDTO)
        {
            using (AppDbContext db = new())
            {
                if (await db.Publisher.FirstOrDefaultAsync(
                    publisherDb =>
                        publisherDb.Name.ToLower() == publisherDTO.Name.ToLower()
                ) is not null)
                {
                    ModelState.AddModelError("Custom Error", "Publisher already exists!");

                    return BadRequest(ModelState);
                }

                int? cityId = null;

                if (publisherDTO.CityId is not null)
                {
                    City? city = await db.City.FirstOrDefaultAsync(cityDb => cityDb.Id == publisherDTO.CityId);

                    if (city is null) return NotFound("City is null!");

                    cityId = city.Id;
                }

                await db.Publisher.AddAsync(new()
                {
                    Name = publisherDTO.Name,
                    CityId = cityId,
                });

                await db.SaveChangesAsync();

                return Created("Publisher", publisherDTO);
            }
        }

        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateAsync(int id, [FromBody] PublisherDTO publisherDTO)
        {
            if (id < 1) return BadRequest();

            if (id != publisherDTO.Id) return BadRequest();

            using (AppDbContext db = new())
            {
                // if (await db.Publisher.FirstOrDefaultAsync(
                //     publisherDb =>
                //         publisherDb.Name.ToLower() == publisherDTO.Name.ToLower()
                // ) is not null)
                // {
                //     ModelState.AddModelError("Custom Error", "Publisher already exists!");

                //     return BadRequest(ModelState);
                // }

                Publisher? publisherToUpdate = await db.Publisher.FirstOrDefaultAsync(publisherDb => publisherDb.Id == id);

                if (publisherToUpdate is null) return NotFound();

                int? cityId = null;

                if (publisherDTO.CityId is not null)
                {
                    City? city = await db.City.FirstOrDefaultAsync(cityDb => cityDb.Id == publisherDTO.CityId);

                    if (city is null) return NotFound("City is null!");

                    cityId = city.Id;
                }

                publisherToUpdate.Name = publisherDTO.Name;
                publisherToUpdate.CityId = cityId;

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
                Publisher? publisher = await db.Publisher.FirstOrDefaultAsync(publisherDb => publisherDb.Id == id);

                if (publisher is null) return NotFound();

                db.Remove(publisher);

                await db.SaveChangesAsync();

                return NoContent();
            }
        }
    }
}