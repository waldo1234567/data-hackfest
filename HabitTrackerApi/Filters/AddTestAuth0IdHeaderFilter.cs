using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Collections.Generic;

namespace HabitTrackerApi.Filters
{
    public class AddTestAuth0IdHeaderFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            if (operation.Parameters == null)
            {
                operation.Parameters = new List<OpenApiParameter>();
            }

            // Add the custom header parameter
            operation.Parameters.Add(new OpenApiParameter
            {
                Name = "X-Test-Auth0-Id", // The name of your custom header
                In = ParameterLocation.Header, // Indicates it's a header parameter
                Description = "Temporary Auth0Id for testing purposes (e.g., auth0|user1)",
                Required = false, // It's optional, only for testing
                Schema = new OpenApiSchema
                {
                    Type = "string"
                }
            });
        }
    }
}
