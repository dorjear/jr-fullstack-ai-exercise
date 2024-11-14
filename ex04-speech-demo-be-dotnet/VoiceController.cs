using Microsoft.AspNetCore.Mvc;
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Runtime.InteropServices;
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

        // Implementation add header Ocp-Apim-Subscription-Key

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
