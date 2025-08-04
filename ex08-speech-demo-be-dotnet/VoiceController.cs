using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using System.Net.Http.Headers;
using Newtonsoft.Json;

using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class VoiceController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<VoiceController> _logger;
    private readonly IHttpClientFactory _clientFactory;

    public VoiceController(IHttpClientFactory clientFactory, IConfiguration configuration, ILogger<VoiceController> logger)
    {
        _configuration = configuration;
        _clientFactory = clientFactory;
        _logger = logger;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> Upload([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("File is not provided or empty.");
        }

        var client = _clientFactory.CreateClient();

        var apiKey = _configuration["OpenAI:apiKey"];
        // Implementation
        // add auth header

        var content = new MultipartFormDataContent();

        // No need to convert to wav as openai supports webm
        var fileContent = new StreamContent(file.OpenReadStream());
        fileContent.Headers.ContentType = new MediaTypeHeaderValue("audio/webm");

        // Implementation
        // Add model "whisper-1" as content
        // Add fileContent to request body "file"

        try
        {
            // Implementation
            // Call openai URL with the prepared content above and return the openai's response as the response of this API.
        }
        catch (HttpRequestException ex)
        {
            // Print the error content if there is an HTTP request exception
            _logger.LogError(ex, "An error occurred while processing the file");
            throw;
        }
    }

    [HttpPost("translate")]
    public async Task<IActionResult> Translate([FromForm] IFormFile file)
    {
        // Implementation:
        // Implement the translate
    }

    [HttpGet("get-speech-token")]
    public async Task<IActionResult> GetSpeechToken()
    {
        var speechKey = _configuration["Azure:SubscriptionKey"];
        var speechRegion = _configuration["Azure:Region"];

        if (string.IsNullOrEmpty(speechKey) || string.IsNullOrEmpty(speechRegion) ||
            speechKey == "your-subscription-key" || speechRegion == "your-speech-region")
        {
            return BadRequest("You forgot to add your speech key or region to the configuration.");
        }

        var client = _clientFactory.CreateClient();
        client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", speechKey);

        try
        {
            var response = await client.PostAsync(
                $"https://{speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken",
                null);

            response.EnsureSuccessStatusCode();
            var token = await response.Content.ReadAsStringAsync();

            return Ok(new { token, region = speechRegion });
        }
        catch (HttpRequestException)
        {
            return Unauthorized("There was an error authorizing your speech key.");
        }
    }
}

