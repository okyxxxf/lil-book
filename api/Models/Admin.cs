namespace api.Models
{
    public class Admin
    {
        public int Id { get; set; }
        public string Login { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public int Salt { get; set;}
    }
}