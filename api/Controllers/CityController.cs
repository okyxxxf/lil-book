using api.Data;
using api.Models;
using api.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("city")]
    [ApiController]
    public class CityController : ControllerBase
    {
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<City>>> GetListAsync()
        {
            using (AppDbContext db = new())
            {
                IEnumerable<City> cityList = await db.City.Include(cityDb => cityDb.PublisherList).ToArrayAsync();

                return Ok(cityList);
            }
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<City>> GetAsync(int id)
        {
            if (id < 1) return BadRequest();

            using (AppDbContext db = new())
            {
                City? city = await db.City.Include(cityDb => cityDb.PublisherList).FirstOrDefaultAsync(cityDb => cityDb.Id == id);

                if (city is null) return NotFound();

                return Ok(city);
            }
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<CityDTO>> CreateAsync([FromBody] CityDTO cityDTO)
        {
            using (AppDbContext db = new())
            {
                if (await db.City.FirstOrDefaultAsync(
                    cityDb =>
                        cityDb.Name.ToLower() == cityDTO.Name.ToLower()
                ) is not null)
                {
                    ModelState.AddModelError("Custom Error", "City already exists!");

                    return BadRequest(ModelState);
                }

                await db.City.AddAsync(new()
                {
                    Name = cityDTO.Name,
                });

                await db.SaveChangesAsync();

                return Created("City", cityDTO);
            }
        }

        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateAsync(int id, [FromBody] CityDTO cityDTO)
        {
            if (id < 1) return BadRequest();

            if (id != cityDTO.Id) return BadRequest();

            using (AppDbContext db = new())
            {
                if (await db.City.FirstOrDefaultAsync(
                    cityDb =>
                        cityDb.Name.ToLower() == cityDTO.Name.ToLower()
                ) is not null)
                {
                    ModelState.AddModelError("Custom Error", "City already exists!");

                    return BadRequest(ModelState);
                }

                City? cityToUpdate = await db.City.FirstOrDefaultAsync(cityDb => cityDb.Id == id);

                if (cityToUpdate is null) return NotFound();

                cityToUpdate.Name = cityDTO.Name;

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
                City? city = await db.City.FirstOrDefaultAsync(cityDb => cityDb.Id == id);

                if (city is null) return NotFound();

                IQueryable<Publisher>? publisherList = db.Publisher.Where(publisherDb => publisherDb.CityId == city.Id);

                if (publisherList is not null)
                {
                    foreach(Publisher publisher in publisherList)
                    {
                        publisher.CityId = null;
                    }
                }

                db.Remove(city);

                await db.SaveChangesAsync();

                return NoContent();
            }
        }
    }
}