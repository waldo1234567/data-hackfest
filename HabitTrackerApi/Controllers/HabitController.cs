using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HabitTrackerApi.Data;
using HabitTrackerApi.Dtos;
using HabitTrackerApi.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Newtonsoft.Json.Linq;
using System.Text;
using System.Globalization;
using System.Text.Json;
using System.Net.Http.Headers;
using System.Text.RegularExpressions;

namespace HabitTrackerApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize]
    public class HabitController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly ILogger<HabitController> _logger;

        public HabitController(
            ApplicationDbContext context,
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration,
            ILogger<HabitController> logger)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _logger = logger;
        }

        // --- Method to get the current User's Guid ID from your database ---
        // This method will now rely on GetCurrentUserFromDbAsync()
        private async Task<Guid?> GetUserIdAsync()
        {
            try
            {
                // Get the User entity from the database using our consolidated logic
                var user = await GetCurrentUserFromDbAsync();
                return user?.Id; // Return the GUID Id from the fetched User object
            }
            catch (InvalidOperationException ex) // Catch the specific exception from GetCurrentUserFromDbAsync
            {
                Console.WriteLine($"Error getting user ID: {ex.Message}");
                return null; // Or handle as appropriate, e.g., throw a custom exception
            }
        }
        private async Task<User> GetCurrentUserFromDbAsync()
        {
            string auth0Id = null;

            // --- TEMPORARY LOGIC FOR TESTING WITHOUT AUTH0 ---
            // 1. Try to get Auth0Id from a custom test header
            if (HttpContext.Request.Headers.TryGetValue("X-Test-Auth0-Id", out var testAuth0IdHeader))
            {
                auth0Id = testAuth0IdHeader.ToString();
                Console.WriteLine($"DEBUG: Using Auth0Id from 'X-Test-Auth0-Id' header: {auth0Id}");
            }
            // --- END TEMPORARY LOGIC ---
            else
            {
                // 2. Fallback to normal Auth0 claims if header is not present
                // This is the production way, when [Authorize] is active
                auth0Id = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                Console.WriteLine($"DEBUG: Using Auth0Id from token claims: {auth0Id ?? "null"}");
            }


            if (string.IsNullOrEmpty(auth0Id))
            {
                // If no Auth0Id could be determined (neither from header nor from token)
                // This means either no test header was sent, AND no valid token was present.
                // For development, you might want to throw or return a default user,
                // but in production with [Authorize] this path should ideally not be reached.
                Console.WriteLine("ERROR: No Auth0 ID found for current request.");
                // For now, let's just return the first user if no ID is found at all
                // This is a last resort fallback for testing convenience
                return await _context.Users.FirstOrDefaultAsync() ?? throw new InvalidOperationException("No users found in database for testing fallback.");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Auth0Id == auth0Id);

            if (user == null)
            {
                // User does not exist in our database, provision them
                // NOTE: When testing with X-Test-Auth0-Id, other claims like email/name/picture
                // won't be available from HttpContext.User unless you explicitly set them in a fake token.
                // For simple testing, you might use hardcoded values or generate placeholders.
                Console.WriteLine($"DEBUG: Provisioning new user with Auth0Id: {auth0Id}");
                user = new User
                {
                    Id = Guid.NewGuid(),
                    Auth0Id = auth0Id,
                    Email = $"{auth0Id.Replace("|", "_")}@example.com", // Placeholder email
                    EmailVerified = false,
                    Name = $"Test User {auth0Id.Replace("auth0|", "")}", // Placeholder name
                    Picture = "",
                    CreatedAt = DateTime.UtcNow,
                    LastLogin = DateTime.UtcNow
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }
            else
            {
                // User exists, update last login time
                user.LastLogin = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                Console.WriteLine($"DEBUG: User found: {auth0Id}, LastLogin updated.");
            }

            return user;
        }

        // --- Helper method to format TimeSpan to HH:MM:SS ---
        private string FormatTimeSpan(TimeSpan duration)
        {
            // Use Math.Floor for total hours in case duration exceeds 24 hours
            return $"{(int)Math.Floor(duration.TotalHours):D2}:{duration.Minutes:D2}:{duration.Seconds:D2}";
        }

        /// <summary>
        /// Retrieves a map of habit relations and frequencies for the authenticated user.
        /// </summary>
        [HttpPost("GetRecords")]
        public async Task<ActionResult<GetRecordsDto>> GetRecords()
        {
            var userId = await GetUserIdAsync();
            if (!userId.HasValue)
            {
                return Unauthorized("User not found or not authenticated.");
            }

            var finishedRecords = await _context.Records
                .Where(r => r.UserId == userId.Value && r.Status == 1 && r.EndTime.HasValue)
                .Include(r => r.Habit)
                .OrderBy(r => r.StartTime)
                .ToListAsync();

            var habitFrequencies = finishedRecords
                .GroupBy(r => r.HabitId)
                .ToDictionary(g => g.Key, g => g.Count());

            var habitTotalDurations = finishedRecords
                .Where(r => r.StartTime.HasValue && r.EndTime.HasValue)
                .GroupBy(r => r.HabitId)
                .ToDictionary(
                    g => g.Key,
                    g => g.Aggregate(TimeSpan.Zero, (currentSum, r) => currentSum + (r.EndTime.Value - r.StartTime.Value))
                );

            var allHabits = await _context.Habits.ToDictionaryAsync(h => h.Id, h => h.Name);

            var nodes = new Dictionary<Guid, HabitNodeDto>();
            for (int i = 0; i < finishedRecords.Count; i++)
            {
                var currentRecord = finishedRecords[i];
                var currentHabitId = currentRecord.HabitId;
                var currentHabitName = allHabits.GetValueOrDefault(currentHabitId, "Unknown");

                if (!nodes.ContainsKey(currentHabitId))
                {
                    nodes[currentHabitId] = new HabitNodeDto
                    {
                        Id = currentHabitId,
                        Name = currentHabitName,
                        Frequency = habitFrequencies.GetValueOrDefault(currentHabitId, 0),
                        TotalDuration = FormatTimeSpan(habitTotalDurations.GetValueOrDefault(currentHabitId, TimeSpan.Zero)),
                        Relations = new List<HabitRelationDto>()
                    };
                }

                Record? nextRecord = null;
                for (int j = i + 1; j < finishedRecords.Count; j++)
                {
                    if (finishedRecords[j].StartTime > currentRecord.EndTime)
                    {
                        nextRecord = finishedRecords[j];
                        break;
                    }
                }

                if (nextRecord != null)
                {
                    var nextHabitId = nextRecord.HabitId;
                    var nextHabitName = allHabits.GetValueOrDefault(nextHabitId, "Unknown");

                    // We only add the relation's 'to' part here; probability is calculated later
                    // This ensures each 'to' habit is listed only once per 'from' habit
                    if (!nodes[currentHabitId].Relations.Any(r => r.To == nextHabitName))
                    {
                        nodes[currentHabitId].Relations.Add(new HabitRelationDto { To = nextHabitName, Probability = 0 });
                    }
                }
            }

            // Calculate probabilities for relations
            foreach (var node in nodes.Values)
            {
                var recordsOfCurrentHabit = finishedRecords.Where(r => r.HabitId == node.Id).ToList();
                var totalOccurrencesOfNode = recordsOfCurrentHabit.Count;

                if (totalOccurrencesOfNode == 0) continue;

                var relationCounts = new Dictionary<string, int>();

                foreach (var currentRecord in recordsOfCurrentHabit)
                {
                    // Find the next finished habit for this specific currentRecord
                    var nextRecord = finishedRecords
                        .FirstOrDefault(r => r.StartTime > currentRecord.EndTime && r.UserId == currentRecord.UserId); // Ensure same user

                    if (nextRecord != null)
                    {
                        var nextHabitName = allHabits.GetValueOrDefault(nextRecord.HabitId, "Unknown");
                        if (relationCounts.ContainsKey(nextHabitName))
                        {
                            relationCounts[nextHabitName]++;
                        }
                        else
                        {
                            relationCounts[nextHabitName] = 1;
                        }
                    }
                }

                foreach (var relationDto in node.Relations)
                {
                    var count = relationCounts.GetValueOrDefault(relationDto.To, 0);
                    relationDto.Probability = Math.Round((double)count / totalOccurrencesOfNode * 100, 2);
                }
            }

            return Ok(new GetRecordsDto { Nodes = nodes.Values.ToList() });
        }


        /// <summary>
        /// Retrieves a list of all habits.
        /// </summary>
        [HttpPost("GetHabits")]
        public async Task<ActionResult<GetHabitsResponseDto>> GetHabits()
        {
            var habits = await _context.Habits
                .Select(h => new HabitItemDto
                {
                    Id = h.Id,
                    Name = h.Name,
                    Description = h.Description,
                    XpAmount = h.XpAmount
                })
                .ToListAsync();

            return Ok(new GetHabitsResponseDto { Habits = habits });
        }

        /// <summary>
        /// Retrieves a list of unfinished records for the authenticated user.
        /// </summary>
        [HttpPost("GetUnfinishedRecords")] // Changed from GetUnfinished
        public async Task<ActionResult<GetUnfinishedRecordsResponseDto>> GetUnfinishedRecords()
        {
            var userId = await GetUserIdAsync();
            if (!userId.HasValue)
            {
                return Unauthorized("User not found or not authenticated.");
            }

            var unfinishedRecords = await _context.Records
                .Where(r => r.UserId == userId.Value && r.Status == 0)
                .Include(r => r.Habit)
                .Select(r => new UnfinishedRecordItemDto // Changed from UnfinishedTaskItemDto
                {
                    Id = r.Id,
                    Name = r.Habit.Name,
                    StartTime = r.StartTime,
                    XpAmount = r.Habit.XpAmount
                })
                .ToListAsync();

            return Ok(new GetUnfinishedRecordsResponseDto { Records = unfinishedRecords });
        }

        // --- Modified Helper Method for Parsing Gemini's Response ---
        private List<string> ParseGeminiInsights(string geminiResponse, Granularity granularity)
        {
            var insightsList = new List<string> { "", "", "", "" }; // 0: Completions, 1: Duration, 2: Frequency, 3: Time Per Habit

            // Normalize newlines for consistent regex matching
            string normalizedResponse = geminiResponse.Replace("\r\n", "\n");

            // Regex pattern to capture heading and content for each section:
            // ###\s* -> Matches "###" followed by any whitespace
            // (.*?)           -> Captures the heading text (non-greedy)
            // \s*\n           -> Matches any whitespace and a newline (separating heading from content)
            // (.*?)           -> Captures the content text (non-greedy)
            // (?=\n###|\Z)    -> Positive lookahead: asserts that the content is followed by "\n###" OR the end of the string (Z)
            // RegexOptions.Singleline -> Makes '.' match newlines, so (.*?) can span multiple lines
            var regex = new Regex(@"###\s*(.*?)\s*\n(.*?)(?=\n###|\Z)", RegexOptions.Singleline);
            var matches = regex.Matches(normalizedResponse);

            foreach (Match match in matches)
            {
                var rawHeading = match.Groups[1].Value.Trim(); // Group 1 is the captured heading text
                var content = match.Groups[2].Value.Trim();    // Group 2 is the captured content text

                // Use StartsWith for flexibility, as granularity might be appended
                if (rawHeading.StartsWith("Habit Completions Trend"))
                {
                    insightsList[0] = content;
                }
                else if (rawHeading.StartsWith("Total Duration Trend"))
                {
                    insightsList[1] = content;
                }
                else if (rawHeading.StartsWith("Overall Habit Frequency Insights"))
                {
                    insightsList[2] = content;
                }
                else if (rawHeading.StartsWith("Time Spent Per Habit Insights"))
                {
                    insightsList[3] = content;
                }
                // If there are other headings from Gemini, they will be ignored as per current requirements.
            }
            return insightsList;
        }


        // --- Helper for ISO Week Start Date (Monday of the week) ---
        // This helper is for consistent weekly grouping and might already be in your code.
        // If not, add it.
        private DateTime GetIsoWeekStartDate(DateTime date)
        {
            DayOfWeek day = CultureInfo.InvariantCulture.Calendar.GetDayOfWeek(date);
            if (day == DayOfWeek.Sunday)
            {
                day = DayOfWeek.Monday - 7; // Treat Sunday as the last day of the previous week
            }
            DateTime weekStart = date.AddDays(DayOfWeek.Monday - day);
            return weekStart.Date; // Return date only
        }

        /// <summary>
        /// Provides a customizable statistics report about the user's habit tracking.
        /// </summary>
        [HttpPost("Statistics")]
        public async Task<ActionResult<StatisticsResponseDto>> Statistics([FromBody] StatisticsRequestDto request)
        {
            var userId = await GetUserIdAsync();
            if (!userId.HasValue)
            {
                return Unauthorized("User not found or not authenticated.");
            }

            // 1. Initial Query: Filter records by user and fetch all finished records
            var query = _context.Records
                .Where(r => r.UserId == userId.Value && r.Status == 1 && r.EndTime.HasValue);

            // Eagerly load the habits and execute the query.
            var finishedRecords = await query.Include(r => r.Habit).ToListAsync();

            // 2. Calculate Overview Statistics
            var totalCompletions = finishedRecords.Count;
            var totalDurationSeconds = finishedRecords.Sum(r => (r.EndTime.Value - r.StartTime.Value).TotalSeconds);
            var overview = new StatisticsOverviewDto
            {
                TotalCompletions = totalCompletions,
                TotalDuration = FormatTimeSpan(TimeSpan.FromSeconds(totalDurationSeconds)),
                TotalUniqueHabits = finishedRecords.Select(r => r.HabitId).Distinct().Count(),
                AverageSessionDurationSeconds = totalCompletions > 0 ? totalDurationSeconds / totalCompletions : 0
            };

            // 3. Calculate Timeline Data based on Granularity
            var timelineData = new List<TimelineDataPointDto>();
            if (finishedRecords.Any())
            {
                timelineData = request.Granularity switch
                {
                    Granularity.Daily => finishedRecords
                        .GroupBy(r => r.EndTime.Value.Date)
                        .Select(g => new TimelineDataPointDto
                        {
                            Period = g.Key.ToString("yyyy-MM-dd"),
                            Completions = g.Count(),
                            TotalDurationSeconds = g.Sum(r => (r.EndTime.Value - r.StartTime.Value).TotalSeconds)
                        }).OrderBy(t => t.Period).ToList(),

                    Granularity.Weekly => finishedRecords
                        // Group by the first day of the ISO week for consistent weekly grouping
                        .GroupBy(r => GetIsoWeekStartDate(r.EndTime.Value.Date))
                        .Select(g => new TimelineDataPointDto
                        {
                            Period = $"Week of {g.Key:yyyy-MM-dd}",
                            Completions = g.Count(),
                            TotalDurationSeconds = g.Sum(r => (r.EndTime.Value - r.StartTime.Value).TotalSeconds)
                        }).OrderBy(t => t.Period).ToList(),

                    Granularity.Monthly => finishedRecords
                        .GroupBy(r => new { r.EndTime.Value.Year, r.EndTime.Value.Month })
                        .Select(g => new TimelineDataPointDto
                        {
                            Period = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMMM yyyy"),
                            Completions = g.Count(),
                            TotalDurationSeconds = g.Sum(r => (r.EndTime.Value - r.StartTime.Value).TotalSeconds)
                        }).OrderBy(t => t.Period).ToList(),

                    _ => new List<TimelineDataPointDto>() // Default or Granularity.Overall means no specific timeline
                };
            }

            // 4. Calculate Habit Breakdown (sorted by frequency by default, or duration if specifically needed for other metrics)
            var habitBreakdown = finishedRecords
                .GroupBy(r => new { r.HabitId, r.Habit.Name })
                .Select(g => new
                {
                    Id = g.Key.HabitId,
                    Name = g.Key.Name,
                    Frequency = g.Count(),
                    TotalDurationSeconds = g.Sum(r => (r.EndTime.Value - r.StartTime.Value).TotalSeconds)
                })
                .OrderByDescending(h => h.Frequency) // Default sorting for AI input
                .ToList()
                .Select(h => new HabitBreakdownDto
                {
                    Id = h.Id,
                    Name = h.Name,
                    Frequency = h.Frequency,
                    Duration = FormatTimeSpan(TimeSpan.FromSeconds(h.TotalDurationSeconds))
                }).ToList();


            // 5. Generate AI Insights
            List<string> aiInsights = new List<string>();
            try
            {
                var geminiApiKey = _configuration["GeminiApi:ApiKey"];
                if (string.IsNullOrEmpty(geminiApiKey))
                {
                    _logger.LogWarning("Gemini API key is not configured. Skipping AI insights.");
                }
                else
                {
                    var promptBuilder = new StringBuilder();
                    promptBuilder.AppendLine("Analyze the following habit tracking data for a user.");
                    promptBuilder.AppendLine($"Current Date: {DateTime.Now.ToString("MMMM dd, yyyy HH:mm")}");
                    promptBuilder.AppendLine("**The response for each section headings and content, should not exceed 150 words.**"); // NEW WORD LIMIT CONSTRAINT
                    promptBuilder.AppendLine("\nOVERVIEW:");
                    promptBuilder.AppendLine($"- Total Habits Completed: {overview.TotalCompletions}");
                    promptBuilder.AppendLine($"- Total Time Spent: {overview.TotalDuration}");
                    promptBuilder.AppendLine($"- Unique Habits Tracked: {overview.TotalUniqueHabits}");
                    promptBuilder.AppendLine($"- Average Session Duration: {FormatTimeSpan(TimeSpan.FromSeconds(overview.AverageSessionDurationSeconds))}");

                    if (timelineData.Any())
                    {
                        promptBuilder.AppendLine($"\nTIMELINE DATA (Aggregated by {request.Granularity}):");
                        foreach (var dataPoint in timelineData)
                        {
                            promptBuilder.AppendLine($"- Period: {dataPoint.Period}, Completions: {dataPoint.Completions}, Total Duration: {FormatTimeSpan(TimeSpan.FromSeconds(dataPoint.TotalDurationSeconds))}");
                        }
                    }

                    if (habitBreakdown.Any())
                    {
                        promptBuilder.AppendLine("\nHABIT BREAKDOWN:");
                        foreach (var habitStat in habitBreakdown)
                        {
                            promptBuilder.AppendLine($"- {habitStat.Name}: Frequency {habitStat.Frequency}, Total Duration {habitStat.Duration}");
                        }
                    }

                    promptBuilder.AppendLine("\nBased on this data, provide an insightful analysis focusing on progress, patterns, and areas for improvement or encouragement. Use friendly and encouraging tone, and refer to the user using 'You' instead of the user");
                    promptBuilder.AppendLine("Structure your response with distinct sections for each category below. Provide suggestions and advice relevant to the data.\n");
                    promptBuilder.AppendLine($"### Habit Completions Trend ({request.Granularity})");
                    promptBuilder.AppendLine($"### Total Duration Trend ({request.Granularity})");
                    promptBuilder.AppendLine("### Overall Habit Frequency Insights");
                    promptBuilder.AppendLine("### Time Spent Per Habit Insights");

                    var geminiEndpoint = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={geminiApiKey}";
                    var httpClient = _httpClientFactory.CreateClient();

                    var requestContent = new
                    {
                        contents = new[]
                                            {
                            new { parts = new[] { new { text = promptBuilder.ToString() } } }
                        }
                    };

                    var jsonString = JsonSerializer.Serialize<object>(requestContent);

                    _logger.LogInformation("Sending Gemini API request:\n{GeminiApiRequest}", jsonString);

                    var jsonContent = new StringContent(
                        jsonString,
                        Encoding.UTF8,
                        new MediaTypeHeaderValue("application/json")
                    );

                    var response = await httpClient.PostAsync(geminiEndpoint, jsonContent);
                    response.EnsureSuccessStatusCode();

                    var responseString = await response.Content.ReadAsStringAsync();

                    _logger.LogInformation("Received Gemini API raw response:\n{GeminiApiResponse}", responseString);

                    var geminiResponseDto = JsonSerializer.Deserialize<GeminiResponseDto>(responseString);

                    if (geminiResponseDto?.candidates?.FirstOrDefault()?.content?.parts?.FirstOrDefault()?.text != null)
                    {
                        aiInsights = ParseGeminiInsights(geminiResponseDto.candidates.First().content.parts.First().text, request.Granularity);
                    }
                    else
                    {
                        _logger.LogWarning("Gemini API response did not contain expected text content.");
                    }
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Error calling Gemini API: {Message}", ex.Message);
                // Optionally return a specific error or a partial response
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Error deserializing Gemini API response: {Message}", ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred during AI insight generation.");
            }


            // 6. Assemble and return the final response.
            var responseDto = new StatisticsResponseDto
            {
                Overview = overview,
                TimelineData = timelineData,
                HabitBreakdown = habitBreakdown,
                AIInsights = aiInsights // Include the AI insights here
            };

            return Ok(responseDto);
        }

        // Helper to format habit data into a string for the AI prompt
        private string FormatHabitDataForAI(List<HabitNodeDto> nodes)
        {
            if (nodes == null || !nodes.Any())
            {
                return "No detailed habit data available yet for analysis.";
            }

            var sb = new StringBuilder();
            sb.AppendLine("Here's a summary of the user's completed habit activities:");
            sb.AppendLine("---");

            foreach (var node in nodes)
            {
                sb.AppendLine($"- Habit: '{node.Name}'");
                sb.AppendLine($"  - Completed: {node.Frequency} times");
                sb.AppendLine($"  - Total Time Spent: {node.TotalDuration}");

                if (node.Relations.Any())
                {
                    sb.AppendLine("  - Common follow-up habits (relations):");
                    foreach (var relation in node.Relations.OrderByDescending(r => r.Probability))
                    {
                        sb.AppendLine($"    - Often followed by: '{relation.To}' (Probability: {relation.Probability}%)");
                    }
                }
                sb.AppendLine("---");
            }
            return sb.ToString();
        }

        /// <summary>
        /// Retrieves a detailed history timeline of all habit records for the authenticated user.
        /// </summary>
        /// <returns>A list of habit records with associated habit names, sorted by start time.</returns>
        [HttpPost("HistoryTimeline")] // Using POST consistent with other APIs, though GET could also work
        public async Task<ActionResult<HistoryTimelineResponseDto>> HistoryTimeline()
        {
            var userId = await GetUserIdAsync();
            if (!userId.HasValue)
            {
                return Unauthorized("User not found or not authenticated.");
            }

            // Query records for the current user, include associated Habit data, and order by StartTime
            var records = await _context.Records
                .Where(r => r.UserId == userId.Value)
                .Include(r => r.Habit) // Eagerly load Habit details to get HabitName and XpAmount
                .OrderByDescending(r => r.StartTime) // Order by latest records first
                .Select(r => new HistoryTimelineEntryDto // Project directly into the DTO for efficiency
                {
                    RecordId = r.Id,
                    HabitId = r.HabitId,
                    HabitName = r.Habit.Name,
                    StartTime = r.StartTime.HasValue ? r.StartTime.Value : DateTime.MinValue, // Ensure StartTime is not null for DTO
                    EndTime = r.EndTime, // EndTime can be null if Status is 0 (in progress)
                    Status = r.Status,
                    XpAmount = r.Habit.XpAmount // Get XP from the related Habit
                })
                .ToListAsync();

            // Return the list wrapped in the response DTO
            return Ok(new HistoryTimelineResponseDto { Timeline = records });
        }
    }
}
