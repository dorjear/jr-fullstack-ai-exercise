 ## Introduction:
Update existing app to use token rather than subscription key directly

## Implementation:

Update file SpeechToTextComponent.js in the src directory with the following changes:

    Remove SPEECH_KEY and SPEECH_REGION.
    fetch token from backend 'http://localhost:5001/api/Voice/get-speech-token'
    Use tokenData.token and tokenData.region to set auth using
     sdk.SpeechConfig.fromAuthorizationToken(tokenData.token, tokenData.region);


## Starting the Application:

Now we are ready to start the server. Go to terminal and execute the following command:

npm start
This will bring up your react application at port 3000.

Using the Application:

You will see a mic icon popping up in the title section of browser. If it does not popup then press stop and then resume mic button.

Now try saying something … e.g -> Hello World 😏

You will see the transcript and also recognizing transcript (dynamic transcript). This is all coming from azure 😄

