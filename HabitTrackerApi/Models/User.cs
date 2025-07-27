using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HabitTrackerApi.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Auth0Id { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(500)]
        public string Picture { get; set; }

        [Required]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;

        public long TotalXp { get; set; } = 0;

        public bool EmailVerified { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime LastLogin { get; set; }

        public ICollection<Record> Records { get; set; } = new List<Record>();
    }
}
