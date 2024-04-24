using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Models;
using api.Models.DTO;
using api.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<string>> LoginAsync([FromBody] AdminDTO adminDTO)
        {
            using (AppDbContext db = new())
            {
                Admin? admin = await db.Admin.FirstOrDefaultAsync(adminDb => adminDb.Login == adminDTO.Login);

                if (admin is null) return NotFound();

                string passwordHashFromDTO = HashWorker.GenerateSHA512SaltedHash(adminDTO.Password, admin.Salt.ToString());

                if (passwordHashFromDTO != admin.PasswordHash) return BadRequest();

                return Ok();
            }
        }
    }
}