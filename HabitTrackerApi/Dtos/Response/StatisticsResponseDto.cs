namespace HabitTrackerApi.Dtos
{

    // The complete statistics report
    public class StatisticsResponseDto
    {
        public StatisticsOverviewDto Overview { get; set; } = new StatisticsOverviewDto();
        public List<TimelineDataPointDto> TimelineData { get; set; } = new List<TimelineDataPointDto>();
        public List<HabitBreakdownDto> HabitBreakdown { get; set; } = new List<HabitBreakdownDto>();
        public List<string> AIInsights { get; set; } = new List<string>();
    }

    // Top-level numbers for the selected period
    public class StatisticsOverviewDto
    {
        public int TotalCompletions { get; set; }
        public string TotalDuration { get; set; } = "00:00:00";
        public int TotalUniqueHabits { get; set; }
        public double AverageSessionDurationSeconds { get; set; }
    }
    // Data point for a chart (e.g., one bar in a bar chart)
    public class TimelineDataPointDto
    {
        public string Period { get; set; } = string.Empty;
        public int Completions { get; set; }
        public double TotalDurationSeconds { get; set; }
    }

    // Detailed stats for a single habit
    public class HabitBreakdownDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Frequency { get; set; }
        public string Duration { get; set; } = "00:00:00";
    }
}
