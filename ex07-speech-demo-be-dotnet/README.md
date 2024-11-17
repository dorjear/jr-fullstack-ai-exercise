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

## Token exchange process

This sample application shows an example design pattern for retrieving and managing tokens, a common task when using the Speech JavaScript SDK in a browser environment. This backend expose a rest api, which abstracts the token retrieval process.

The reason for this design is to prevent your speech key from being exposed on the front-end, since it can be used to make calls directly to your subscription. By using an ephemeral token, you are able to protect your speech key from being used directly. To get a token, you use the Speech REST API and make a call using your speech key and region.

In the request, you create a `Ocp-Apim-Subscription-Key` header, and pass your speech key as the value. Then you make a request to the **issueToken** endpoint for your region, and an authorization token is returned. In a production application, this endpoint returning the token should be *restricted by additional user authentication* whenever possible. 
