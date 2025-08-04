## Run the project
Replace the "SubscriptionKey" and "Region" in appsettings.json
dotnet build
dotnet run

## Project setup: 
dotnet new webapi -n speech-demo-be-dotnet
cd speech-demo-be-dotnet
dotnet add package Microsoft.CognitiveServices.Speech
dotnet add package Microsoft.AspNetCore.Cors
dotnet add package Xabe.FFmpeg
dotnet run

# Backend service to provide speech translation using Azure AI Service:
Implement the TranslateAudioAsync function
// Set from language and target language
// Create a TranslationRecognizer object
// Call recognize.RecognizeOnceAsync() to get the text
// return the text or throw exception if something wrong
