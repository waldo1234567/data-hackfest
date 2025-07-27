# Stage 1: Build the application
# Use the .NET 7.0 SDK image
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

# Copy the .csproj file first to leverage Docker's cache for faster builds
# if dependencies haven't changed.
COPY ["HabitTrackerApi.csproj", "HabitTrackerApi/"]
RUN dotnet restore "HabitTrackerApi/HabitTrackerApi.csproj"

# Copy the rest of the application files
COPY . .
WORKDIR "/src/HabitTrackerApi"

# Build the application
RUN dotnet build "HabitTrackerApi.csproj" -c Release -o /app/build

# Stage 2: Publish the application (create a self-contained deployment)
FROM build AS publish
RUN dotnet publish "HabitTrackerApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 3: Create the final runtime image
# Use the .NET 7.0 ASP.NET runtime image, which is smaller and more secure
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS final
WORKDIR /app

# Copy the published output from the publish stage
COPY --from=publish /app/publish .

# Expose the port your application listens on.
# ASP.NET Core typically listens on port 80 inside the container for HTTP.
EXPOSE 80

# Define the command to run your application when the container starts
ENTRYPOINT ["dotnet", "HabitTrackerApi.dll"]
