using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace YourApp.Data.Models
{
    [Table("images")]
    public class Image
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("raw_img")]
        public int? RawImg { get; set; }

        [Column("fresh_img")]
        public int? FreshImg { get; set; }

        [Column("datetime")]
        public DateTimeOffset DateTime { get; set; }

        [Column("latitude", TypeName = "numeric(9,6)")]
        public decimal? Latitude { get; set; }

        [Column("longitude", TypeName = "numeric(9,6)")]
        public decimal? Longitude { get; set; }

        [Column("fissure_type")]
        public int? FissureType { get; set; }

        [Column("veredict")]
        public string Veredict { get; set; } = null!;

        [Column("id_project")]
        public int ProjectId { get; set; }

        [ForeignKey(nameof(ProjectId))]
        public Project Project { get; set; } = null!;

        public ICollection<Log> Logs { get; set; } = new List<Log>();
    }
}
