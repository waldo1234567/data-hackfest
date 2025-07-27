namespace HabitTrackerApi.Dtos
{
    public class StatisticsRequestDto
    {
        public Granularity Granularity { get; set; } = Granularity.Weekly;
    }

    public enum Granularity
    {
        Daily,
        Weekly,
        Monthly
    }
}


