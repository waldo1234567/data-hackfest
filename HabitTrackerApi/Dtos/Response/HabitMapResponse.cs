namespace HabitTrackerApi.Dtos
{
    public class GetRecordsDto
    {
        public List<HabitNodeDto> Nodes { get; set; } = new List<HabitNodeDto>();
    }

    public class HabitNodeDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Frequency { get; set; }
        public string TotalDuration { get; set; } = "00:00:00";
        public List<HabitRelationDto> Relations { get; set; } = new List<HabitRelationDto>();
    }

    public class HabitRelationDto
    {
        public string To { get; set; } = string.Empty;
        public double Probability { get; set; }
    }
}
