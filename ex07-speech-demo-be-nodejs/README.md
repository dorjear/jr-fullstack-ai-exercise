# Speech service server with NodeJS

This sample shows how to integrate the backend for speech-to-text conversions.

## How to run the app

1. Clone this repo, then change directory to the project root and run `npm install` to install dependencies.
2. Update your Azure secret key to the AZURE_SPEECH_KEY in the .env file
3. To run the Express server run `node index.js`.

# Backend service to provide speech translation using Azure AI Service:
        // use sdk.SpeechConfig.fromSubscription to set speech key and region
        // set speechConfig.speechRecognitionLanguage to 'zh-CN'
        // set speechConfig.addTargetLanguage to 'en'
        // create TranslationRecognizer object
        // call recognizeOnceAsync to get result and set the result to the response
