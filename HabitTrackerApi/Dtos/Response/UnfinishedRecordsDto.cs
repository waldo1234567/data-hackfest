namespace HabitTrackerApi.Dtos
{
    public class GetUnfinishedRecordsResponseDto
    {
        public List<UnfinishedRecordItemDto> Records { get; set; } = new List<UnfinishedRecordItemDto>();
    }

    public class UnfinishedRecordItemDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime? StartTime { get; set; }
        public long XpAmount { get; set; }
    }
}
