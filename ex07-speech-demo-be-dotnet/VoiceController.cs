using Microsoft.AspNetCore.Mvc;
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;
using Microsoft.CognitiveServices.Speech.Translation;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Xabe.FFmpeg;

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
            _logger.LogError("No file uploaded.");
            return BadRequest("No file uploaded.");
        }

        var webmFilePath = Path.Combine("uploads", Guid.NewGuid() + ".webm");
        var wavFilePath = Path.ChangeExtension(webmFilePath, ".wav");

        try
        {
            _logger.LogInformation("Saving webm file to {FilePath}", webmFilePath);

            // Save the webm file
            Directory.CreateDirectory("uploads"); // Ensure the directory exists
            using (var stream = new FileStream(webmFilePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            _logger.LogInformation("Initializing FFmpeg");

            // Set the path to ffmpeg executables
            FFmpeg.SetExecutablesPath("/usr/local/bin"); // Update this path to the actual location of ffmpeg
            _logger.LogInformation("Converting webm file to wav format");

            // Convert webm to wav
            var conversion = await FFmpeg.Conversions.New()
                .AddParameter($"-i {webmFilePath} {wavFilePath}")
                .Start();

            _logger.LogInformation("Conversion completed. Transcribing audio");

            // Transcribe the wav file
            var result = await TranscribeAudioAsync(wavFilePath);
            _logger.LogInformation("Transcription completed successfully");
            return Ok(new { DisplayText = result });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while processing the file");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
        finally
        {
            // Clean up files
            _logger.LogInformation("Cleaning up files");
        }
    }

    [HttpPost("translate")]
    public async Task<IActionResult> Translate([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            _logger.LogError("No file uploaded.");
            return BadRequest("No file uploaded.");
        }

        var webmFilePath = Path.Combine("uploads", Guid.NewGuid() + ".webm");
        var wavFilePath = Path.ChangeExtension(webmFilePath, ".wav");

        try
        {
            _logger.LogInformation("Saving webm file to {FilePath}", webmFilePath);

            // Save the webm file
            Directory.CreateDirectory("uploads"); // Ensure the directory exists
            using (var stream = new FileStream(webmFilePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            _logger.LogInformation("Initializing FFmpeg");

            // Set the path to ffmpeg executables
            FFmpeg.SetExecutablesPath("/usr/local/bin"); // Update this path to the actual location of ffmpeg
            _logger.LogInformation("Converting webm file to wav format");

            // Convert webm to wav
            var conversion = await FFmpeg.Conversions.New()
                .AddParameter($"-i {webmFilePath} {wavFilePath}")
                .Start();

            _logger.LogInformation("Conversion completed. Transcribing audio");

            // Translate the wav file
            var translatedText = await TranslateAudioAsync(wavFilePath, "zh-CN", "en"); // Translate from English to Spanish
            _logger.LogInformation("Translation completed successfully");
            return Ok(new { DisplayText = translatedText });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while processing the file");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
        finally
        {
            // Clean up files
            _logger.LogInformation("Cleaning up files");
        }
    }

    private async Task<string> TranscribeAudioAsync(string wavFilePath)
    {
        var subscriptionKey = _configuration["Azure:SubscriptionKey"];
        var region = _configuration["Azure:Region"];
        var config = SpeechConfig.FromSubscription(subscriptionKey, region);

        using var audioInput = AudioConfig.FromWavFileInput(wavFilePath);
        using var recognizer = new SpeechRecognizer(config, audioInput);

        var result = await recognizer.RecognizeOnceAsync();
        if (result.Reason == ResultReason.RecognizedSpeech)
        {
            return result.Text;
        }
        else
        {
            throw new Exception($"Speech recognition failed. Reason: {result.Reason}");
        }
    }

    private async Task<string> TranslateAudioAsync(string wavFilePath, string fromLanguage, string toLanguage)
    {
        var subscriptionKey = _configuration["Azure:SubscriptionKey"];
        var region = _configuration["Azure:Region"];
        var config = SpeechTranslationConfig.FromSubscription(subscriptionKey, region);
        // Implementation
        // Set from language and target language

        using var audioInput = AudioConfig.FromWavFileInput(wavFilePath);

        // Implementation
        // Create a TranslationRecognizer object
        // Call recognize.RecognizeOnceAsync() to get the text
        // return the text or throw exception if something wrong

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
