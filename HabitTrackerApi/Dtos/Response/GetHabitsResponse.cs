namespace HabitTrackerApi.Dtos
{
    public class GetHabitsResponseDto
    {
        public List<HabitItemDto> Habits { get; set; } = new List<HabitItemDto>();
    }

    public class HabitItemDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public long XpAmount { get; set; }
    }
}
