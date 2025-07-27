using System;
using System.Collections.Generic;

namespace HabitTrackerApi.Dtos
{
    public class GeminiResponseDto
    {
        public List<Candidate>? candidates { get; set; }
    }

    public class Candidate
    {
        public Content? content { get; set; }
        public string? finishReason { get; set; }
        public int? index { get; set; }
    }

    public class Content
    {
        public List<Part>? parts { get; set; }
        public string? role { get; set; }
    }

    public class Part
    {
        public string? text { get; set; }
    }
}
