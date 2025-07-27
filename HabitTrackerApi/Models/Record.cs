// Models/Record.cs
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HabitTrackerApi.Models
{
    public class Record
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [Required]
        public Guid UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        [Required]
        public Guid HabitId { get; set; }

        [ForeignKey("HabitId")]
        public Habit Habit { get; set; } = null!;

        [Required]
        public DateTime? StartTime { get; set; }

        public DateTime? EndTime { get; set; }

        public int Status { get; set; } // 0 for unfinished, 1 for finished, 2 for canceled
    }
}
