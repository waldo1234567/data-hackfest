using System;

namespace HabitTrackerApi.Dtos
{
    public class ActiveRecordsDto
    {
        public List<ActiveRecordDto> ActiveRecords { get; set; }
    }

    public class ActiveRecordDto
    {
        public Guid RecordId { get; set; }
        public Guid HabitId { get; set; }
        public string HabitName { get; set; }
        public DateTime? StartTime { get; set; }
        public long? XpAmount { get; set; }
    }
}
