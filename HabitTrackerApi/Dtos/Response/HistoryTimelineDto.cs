using System;
using System.Collections.Generic;

namespace HabitTrackerApi.Dtos
{
    /// <summary>
    /// Represents a single entry in the user's habit history timeline.
    /// </summary>
    public class HistoryTimelineEntryDto
    {
        public Guid RecordId { get; set; } // Unique ID for the specific record
        public Guid HabitId { get; set; }
        public string HabitName { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; } // Nullable if the habit is still in progress
        public int Status { get; set; } // 0: In Progress, 1: Completed
        public long XpAmount { get; set; } // XP gained from this habit (from the associated Habit model)
    }

    /// <summary>
    /// Response DTO for the history timeline API.
    /// </summary>
    public class HistoryTimelineResponseDto
    {
        public List<HistoryTimelineEntryDto> Timeline { get; set; } = new List<HistoryTimelineEntryDto>();
    }
}
