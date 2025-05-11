using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace YourApp.Data.Models
{
    [Table("project")]
    public class Project
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public string Name { get; set; } = null!;

        [Column("contractor")]
        public string Contractor { get; set; } = null!;

        [Column("date")]
        public DateTime Date { get; set; }

        public ICollection<Image> Images { get; set; } = new List<Image>();
    }
}
