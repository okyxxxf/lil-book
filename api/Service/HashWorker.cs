using System.Security.Cryptography;
using System.Text;

namespace api.Service
{
    public static class HashWorker
    {
        public static string GenerateSHA512SaltedHash(string password, string salt = "")
        {
            byte[] bytes = Encoding.UTF8.GetBytes(password + salt);
            byte[] hash = SHA512.HashData(bytes);

            return Convert.ToBase64String(hash);
        }
    }
}