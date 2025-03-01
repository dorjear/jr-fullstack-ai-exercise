# Speech service server with NodeJS

This sample shows how to integrate the backend for speech-to-text conversions.

## How to run the app

1. Clone this repo, then change directory to the project root and run `npm install` to install dependencies.
2. Update your Azure secret key to the AZURE_SPEECH_KEY in the .env file
3. To run the Express server run `node index.js`.

## Token exchange process

This sample application shows an example design pattern for retrieving and managing tokens, a common task when using the Speech JavaScript SDK in a browser environment. This backend expose a rest api, which abstracts the token retrieval process.

The reason for this design is to prevent your speech key from being exposed on the front-end, since it can be used to make calls directly to your subscription. By using an ephemeral token, you are able to protect your speech key from being used directly. To get a token, you use the Speech REST API and make a call using your speech key and region.

In the request, you create a `Ocp-Apim-Subscription-Key` header, and pass your speech key as the value. Then you make a request to the **issueToken** endpoint for your region, and an authorization token is returned. In a production application, this endpoint returning the token should be *restricted by additional user authentication* whenever possible. 

Refer to https://learn.microsoft.com/en-us/azure/ai-services/authentication
