using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace YourApp.Data.Models
{
    [Table("logs")]
    public class Log
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("mensage")]
        public string Mensage { get; set; } = null!;

        [Column("datetime")]
        public DateTimeOffset DateTime { get; set; }

        [Column("id_images")]
        public int ImageId { get; set; }

        [ForeignKey(nameof(ImageId))]
        public Image Image { get; set; } = null!;

        [Column("id_user")]
        public int UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public User User { get; set; } = null!;
    }
}
