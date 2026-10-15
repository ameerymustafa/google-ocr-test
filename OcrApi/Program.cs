using Google.Cloud.Vision.V1;
using Microsoft.AspNetCore.Http;

var builder = WebApplication.CreateBuilder(args);

// 1. Add CORS and Antiforgery services
builder.Services.AddCors();
builder.Services.AddAntiforgery();

var app = builder.Build();

// 2. Activate the middleware
app.UseCors(policy => policy
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());
    
app.UseAntiforgery();

// 3. API Endpoint
app.MapPost("/api/scan", async (IFormFile imageFile) => {
    Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", "credentials.json");
    var client = ImageAnnotatorClient.Create();
    
    using var stream = imageFile.OpenReadStream();
    var image = Image.FromStream(stream);
    var response = await client.DetectTextAsync(image);
    
    return response.Count > 0 ? response[0].Description : "No text found.";
}).DisableAntiforgery();

app.Run();