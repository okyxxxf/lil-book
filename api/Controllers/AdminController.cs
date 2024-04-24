using api.Data;
using api.Models;
using api.Models.DTO;
using api.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private static readonly string correctKey = "Keyyyy(4)";

        [HttpGet("{key}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<Admin>>> GetListAsync(string key)
        {
            if (key != correctKey) return BadRequest();
            
            using (AppDbContext db = new())
            {
                IEnumerable<Admin> adminList = await db.Admin.ToArrayAsync();

                return Ok(adminList);
            }
        }

        [HttpGet("{id:int}/{key}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<Admin>> GetAsync(int id, string key)
        {
            if (key != correctKey) return BadRequest();

            if (id < 1) return BadRequest();

            using (AppDbContext db = new())
            {
                Admin? admin = await db.Admin.FirstOrDefaultAsync(adminDb => adminDb.Id == id);

                if (admin is null) return NotFound();

                return Ok(admin);
            }
        }

        [HttpPost("{key}")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<AdminDTO>> CreateAsync(string key, [FromBody] AdminDTO adminDTO)
        {
            if (key != correctKey) return BadRequest();

            using (AppDbContext db = new())
            {
                if (await db.Admin.FirstOrDefaultAsync(
                    adminDb =>
                        adminDb.Login.ToLower() == adminDTO.Login.ToLower()
                ) is not null)
                {
                    ModelState.AddModelError("Custom Error", "Admin already exists!");

                    return BadRequest(ModelState);
                }

                int salt = new Random().Next(int.MinValue, int.MaxValue);

                await db.Admin.AddAsync(new()
                {
                    Login = adminDTO.Login,
                    PasswordHash = HashWorker.GenerateSHA512SaltedHash(adminDTO.Password, salt.ToString()),
                    Salt = salt,
                });

                await db.SaveChangesAsync();

                return Created("Admin", adminDTO);
            }
        }

        [HttpPut("{id:int}/{key}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateAsync(string key, int id, [FromBody] AdminDTO adminDTO)
        {
            if (key != correctKey) return BadRequest();

            if (id < 1) return BadRequest();
            if (id != adminDTO.Id) return BadRequest();

            using (AppDbContext db = new())
            {
                if (await db.Admin.FirstOrDefaultAsync(
                    adminDb =>
                        adminDb.Login.ToLower() == adminDTO.Login.ToLower()
                ) is not null)
                {
                    ModelState.AddModelError("Custom Error", "Admin already exists!");

                    return BadRequest(ModelState);
                }

                Admin? adminToUpdate = await db.Admin.FirstOrDefaultAsync(adminDb => adminDb.Id == id);

                if (adminToUpdate is null) return NotFound();

                int salt = new Random().Next(int.MinValue, int.MaxValue);

                adminToUpdate.Login = adminDTO.Login;
                adminToUpdate.PasswordHash = HashWorker.GenerateSHA512SaltedHash(adminDTO.Password, salt.ToString());
                adminToUpdate.Salt = salt;

                await db.SaveChangesAsync();

                return NoContent();
            }
        }

        [HttpDelete("{id:int}/{key}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteAsync(int id, string key)
        {
            if (key != correctKey) return BadRequest();

            if (id < 1) return BadRequest();

            using (AppDbContext db = new())
            {
                Admin? admin = await db.Admin.FirstOrDefaultAsync(adminDb => adminDb.Id == id);

                if (admin is null) return NotFound();

                db.Remove(admin);

                await db.SaveChangesAsync();

                return NoContent();
            }
        }
    }
}