using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace YourApp.Data.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("name")]
        public string Name { get; set; } = null!;

        // Inicializa a coleção para evitar warning CS8618
        public ICollection<Log> Logs { get; set; } = new List<Log>();
    }
}
