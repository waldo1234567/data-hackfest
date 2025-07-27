
using System;

namespace HabitTrackerApi.Dtos
{
    public class StartRecordDtoRequest
    {
        public Guid HabitId { get; set; }
        public DateTime? StartTime { get; set; }
    }
}
