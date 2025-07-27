using System;

namespace HabitTrackerApi.Dtos
{
    public class UpdateRecordDtoRequest
    {
        public Guid RecordId { get; set; }
        public DateTime? EndTime { get; set; }
        public int? status { get; set; }
    }
}
