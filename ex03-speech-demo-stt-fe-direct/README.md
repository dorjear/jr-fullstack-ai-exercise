## Introduction:

Speech recognition technology has revolutionized the way we interact with applications and devices. In this tutorial, we’ll explore how to create a speech recognition app using Microsoft Cognitive Services and React.

Microsoft Cognitive Services provides powerful speech recognition capabilities that can be easily integrated into your React applications. By the end of this tutorial, you’ll have a working speech recognition app with options to start, stop, and pause the microphone.

## Prerequisites:

Before we dive into the implementation, make sure you have the following prerequisites in place:

An Azure account for accessing Microsoft Cognitive Services.
The necessary subscription key and region for using the Speech Services API.
Node.js and npm (Node Package Manager) installed on your machine.
Basic knowledge of React and JavaScript.
## Setting Up the Project:

Create a new React project by running the following command in your terminal:

    npx create-react-app speech-demo-stt-fe-direct
    cd speech-demo-stt-fe-direct
Install the Azure Cognitive Services SDK for JavaScript:

    npm install microsoft-cognitiveservices-speech-sdk --save-dev
## Implementation:

Now let’s implement the speech recognition functionality in our React app.

Create file SpeechToTextComponent.js in the src directory and paste the the following code:

    import React, { useState, useEffect, useRef } from 'react';
    import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
    
    const SPEECH_KEY = 'your-key-of-speech-service';
    const SPEECH_REGION = 'eastus';
    
    export function SpeechToTextComponent() {
    
        const [isListening, setIsListening] = useState(false);
        const speechConfig = useRef(null);
        const audioConfig = useRef(null);
        const recognizer = useRef(null);
        
        const [myTranscript, setMyTranscript] = useState("");
        const [recognizingTranscript, setRecTranscript] = useState("");
        
        const processRecognizedTranscript = (event) => {
        const result = event.result;
        console.log('Recognition result:', result);
    
        if (result.reason === sdk.ResultReason.RecognizedSpeech) {
          const transcript = result.text;
          console.log('Transcript: -->', transcript);
          // Call a function to process the transcript as needed
    
          setMyTranscript(transcript);
        }
    };
    
    const processRecognizingTranscript = (event) =>{
        const result = event.result;
        console.log('Recognition result:', result);
        if (result.reason === sdk.ResultReason.RecognizingSpeech) {
            const transcript = result.text;
            console.log('Transcript: -->', transcript);
            // Call a function to process the transcript as needed
        
            setRecTranscript(transcript);
        }
    }
    
    const initRecognizer = () => {
        speechConfig.current = sdk.SpeechConfig.fromSubscription(
              SPEECH_KEY,
              SPEECH_REGION
        );
        
        speechConfig.current.speechRecognitionLanguage = 'en-US';
    
        audioConfig.current = sdk.AudioConfig.fromDefaultMicrophoneInput();
        recognizer.current = new sdk.SpeechRecognizer(
          speechConfig.current,
          audioConfig.current
        );
    
        recognizer.current.recognized = (s, e) => processRecognizedTranscript(e);
        recognizer.current.recognizing = (s, e) => processRecognizingTranscript(e);
    
        recognizer.current.startContinuousRecognitionAsync(() => {
          console.log('Speech recognition started.');
          setIsListening(true);
        });
    
        return () => {
          recognizer.current.stopContinuousRecognitionAsync(() => {
            setIsListening(false);
          });
        };
    }
    
    useEffect(() => {
        initRecognizer();
    }, []);
    
    const pauseListening = () => {
        setIsListening(false);
        recognizer.current.stopContinuousRecognitionAsync();
        console.log('Paused listening.');
    };
    
    const startListening = () => {
        if (!isListening) {
            setIsListening(true);
            recognizer.current.startContinuousRecognitionAsync(() => {
            console.log('Started listening...');
            });
        }
    };
    
    const stopListening = () => {
        setIsListening(false);
            recognizer.current.stopContinuousRecognitionAsync(() => {
            console.log('Speech recognition stopped.');
        });
    };
    
    return (
        <div>
        <button onClick={pauseListening}>Pause Listening</button>
        <button onClick={startListening}>Start Listening</button>
        <button onClick={stopListening}>Stop Listening</button>
    
        <div>
            <div>
              Recognizing Transcript :
            </div>
            <div>
              <textarea rows="5" cols="40" value={recognizingTranscript}/>
            </div>
            
            <div>
              RecognizedTranscript :
            </div>
            <div>
              <textarea rows="5" cols="40" value={myTranscript}/>
            </div>
        </div>
        </div>
    );
    }

Update SPEECH_KEY and SPEECH_REGION.

Now go to App.js and remove the exiting code and paste the following:

    import logo from './logo.svg';
    import './App.css';
    import { SpeechToTextComponent } from './SpeechToTextComponent';
    
    function App() {
        return (
            <div className="App">
            <SpeechToTextComponent></SpeechToTextComponent>
            </div>
        );
    }

    export default App;

## Starting the Application:

Now we are ready to start the server. Go to terminal and execute the following command:

npm start
This will bring up your react application at port 3000.

Using the Application:

You will see a mic icon popping up in the title section of browser. If it does not popup then press stop and then resume mic button.

Now try saying something … e.g -> Hello World 😏

You will see the transcript and also recognizing transcript (dynamic transcript). This is all coming from azure 😄

