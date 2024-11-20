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
