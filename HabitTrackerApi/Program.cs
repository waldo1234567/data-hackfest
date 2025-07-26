// Program.cs
using Microsoft.EntityFrameworkCore;
using HabitTrackerApi.Data;
using HabitTrackerApi.Filters;
using HabitTrackerApi.Models;
using HabitTrackerApi.Dtos;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// --- Configuration ---
builder.Configuration.AddEnvironmentVariables();

// --- Services ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Habit Tracker API", Version = "v1" });

    // Add this line to include your custom header in Swagger UI
    c.OperationFilter<AddTestAuth0IdHeaderFilter>();

    // This is for the real Auth0 bearer token, keep it for when you re-enable Auth0
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer YOUR_AUTH0_TOKEN\""
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});
// Configure PostgreSQL with Npgsql
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// Configure Auth0 Authentication (JWT Bearer)
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["Auth0:Domain"]; // Your Auth0 Domain
        options.Audience = builder.Configuration["Auth0:Audience"]; // Your Auth0 API Audience

        // IMPORTANT: For local testing without a real Auth0 setup, you might temporarily relax validation.
        // In production, ensure these are robustly configured and validated.
        // options.RequireHttpsMetadata = false;
        // options.SaveToken = true;
        // options.TokenValidationParameters = new TokenValidationParameters
        // {
        //     ValidateIssuerSigningKey = false,
        //     ValidateIssuer = false,
        //     ValidateAudience = false,
        //     ValidateLifetime = false,
        // };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AuthenticatedUser", policy => policy.RequireAuthenticatedUser());
});

// Add HttpClient for Gemini API calls
builder.Services.AddHttpClient("GeminiApiClient", client =>
{
    client.BaseAddress = new Uri("https://generativelanguage.googleapis.com/");
    client.DefaultRequestHeaders.Accept.Clear();
    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
});

var app = builder.Build();

// --- Middleware ---
// Apply database migrations on startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    try
    {
        dbContext.Database.Migrate();
        Console.WriteLine("Database migrations applied successfully.");
        SeedData(dbContext);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred while applying migrations or seeding data: {ex.Message}");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

// --- Helper for Seeding Data ---
void SeedData(ApplicationDbContext context)
{
    // Only seed if no users exist to prevent duplicates on every run
    if (!context.Users.Any())
    {
        Console.WriteLine("Seeding initial data...");
        var random = new Random();
        var now = DateTime.UtcNow;

        // 1. Seed Users (5 users)
        var users = new List<User>();
        for (int i = 1; i <= 5; i++)
        {
            users.Add(new User
            {
                Id = Guid.NewGuid(),
                Auth0Id = $"auth0|user{i}",
                Name = $"TestUser{i}",
                Picture = $"https://randomuser.me/api/portraits/men/{i}.jpg",
                Email = $"user{i}@example.com",
                EmailVerified = (i % 2 == 0) // Alternate verified status
            });
        }
        context.Users.AddRange(users);
        context.SaveChanges();
        Console.WriteLine($"Seeded {users.Count} Users.");

        // 2. Seed Habits (30 habits)
        var habitNames = new List<string>
        {
            "Morning Run", "Read Book", "Meditate", "Drink Water", "Journaling",
            "Learn New Language", "Code Practice", "Yoga", "Meal Prep", "Call Family",
            "Go for a Walk", "Stretch", "Clean Desk", "Plan Day", "Review Goals",
            "Practice Instrument", "Write Blog Post", "Gardening", "No Social Media", "Cook Healthy Meal",
            "Evening Read", "Gratitude Practice", "Listen to Podcast", "Online Course", "Pushups",
            "Learn new Skill", "Bedtime Routine", "Mindful Eating", "Take Vitamins", "Outdoor Activity"
        };

        var habits = new List<Habit>();
        foreach (var name in habitNames)
        {
            habits.Add(new Habit
            {
                Id = Guid.NewGuid(),
                Name = name,
                Description = $"Focus on {name} daily.",
                XpAmount = random.Next(20, 100) // Random XP
            });
        }
        context.Habits.AddRange(habits);
        context.SaveChanges();
        Console.WriteLine($"Seeded {habits.Count} Habits.");

        // 3. Seed Records (aiming for 200-300+ records across users and habits)
        var recordsToSeed = new List<Record>();
        var totalRecordsCount = 0;
        var maxSimulationDays = 90; // Simulate data for the past 90 days

        foreach (var user in users)
        {
            for (int d = 0; d < maxSimulationDays; d++)
            {
                var dayToSimulate = now.Date.AddDays(-d); // Current day going backwards

                // Simulate 1 to 4 habits per day for this user
                var numHabitsToday = random.Next(1, 5); // At least 1 habit, up to 4

                // To create some potential "relation" patterns for the AI:
                // User 1 often does "Morning Run" then "Meditate"
                if (user.Auth0Id == "auth0|user1" && random.Next(0, 10) < 7) // 70% chance
                {
                    var morningRunHabit = habits.FirstOrDefault(h => h.Name == "Morning Run");
                    var meditateHabit = habits.FirstOrDefault(h => h.Name == "Meditate");

                    if (morningRunHabit != null)
                    {
                        var mrStart = dayToSimulate.AddHours(6).AddMinutes(random.Next(0, 30));
                        var mrEnd = mrStart.AddMinutes(random.Next(25, 35));
                        recordsToSeed.Add(new Record { UserId = user.Id, HabitId = morningRunHabit.Id, StartTime = mrStart, EndTime = mrEnd, Status = 1 });
                        totalRecordsCount++;

                        if (meditateHabit != null && random.Next(0, 10) < 8) // 80% chance to follow
                        {
                            var medStart = mrEnd.AddMinutes(random.Next(5, 15)); // Short break then meditate
                            var medEnd = medStart.AddMinutes(random.Next(8, 12));
                            recordsToSeed.Add(new Record { UserId = user.Id, HabitId = meditateHabit.Id, StartTime = medStart, EndTime = medEnd, Status = 1 });
                            totalRecordsCount++;
                        }
                    }
                }

                // Other users or random habits for this day
                for (int h = 0; h < numHabitsToday; h++)
                {
                    var chosenHabit = habits[random.Next(habits.Count)];

                    // Avoid re-adding habits already "patterned" for user1 on this day
                    if (user.Auth0Id == "auth0|user1" && (chosenHabit.Name == "Morning Run" || chosenHabit.Name == "Meditate"))
                    {
                        continue;
                    }

                    var startTime = dayToSimulate.AddHours(random.Next(7, 22)).AddMinutes(random.Next(0, 60)); // Random time of day
                    var durationMinutes = random.Next(10, 90); // 10 to 90 minutes duration
                    var endTime = startTime.AddMinutes(durationMinutes);

                    // Ensure EndTime doesn't bleed into next day for simple simulation
                    if (endTime.Date > dayToSimulate)
                    {
                        endTime = dayToSimulate.AddHours(23).AddMinutes(59).AddSeconds(59);
                        if (endTime < startTime) endTime = startTime.AddMinutes(5); // Safety check for very short durations near midnight
                    }


                    var status = random.Next(0, 10) < 8 ? 1 : 0; // ~80% complete, ~20% in progress/skipped

                    recordsToSeed.Add(new Record
                    {
                        UserId = user.Id,
                        HabitId = chosenHabit.Id,
                        StartTime = startTime,
                        EndTime = status == 1 ? (DateTime?)endTime : null, // Only set EndTime if status is complete
                        Status = status
                    });
                    totalRecordsCount++;
                }
            }
        }
        context.Records.AddRange(recordsToSeed);
        context.SaveChanges();
        Console.WriteLine($"Seeded {totalRecordsCount} Records.");

        Console.WriteLine("Data seeding complete!");
    }
    else
    {
        Console.WriteLine("Database already contains users. Skipping data seeding.");
    }
}
