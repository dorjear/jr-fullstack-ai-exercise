## No library required to build a Text-to-Speech component in React
What we are building we need to use window.speechSynthesis

## Initial setup
You can use any React boilerplate to get started. I will be using the Create React App boilerplate to create a new React app.

You can install it using the following command:

    npx create-react-app speech-demo-tts-simple
Once the app is created, you can start the development server using the following command:

    cd speech-demo-tts-simple
    yarn start

## Creating the SimpleTextToSpeech component
The first step is to create a new component called SimpleTextToSpeech that will read the content of our input. Let's create a file called SimpleTextToSpeech.js.

    import React, { useState, useEffect } from "react";

    const SimpleTextToSpeech = ({ text }) => {
    const [isPaused, setIsPaused] = useState(false);
    const [utterance, setUtterance] = useState(null);
    
    useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);
    
        setUtterance(u);
    
        return () => {
          synth.cancel();
        };
    }, [text]);
    
    const handlePlay = () => {
    const synth = window.speechSynthesis;
    
        if (isPaused) {
          synth.resume();
        }
    
        synth.speak(utterance);
    
        setIsPaused(false);
    };
    
    const handlePause = () => {
    const synth = window.speechSynthesis;
    
        synth.pause();
    
        setIsPaused(true);
    };
    
    const handleStop = () => {
    const synth = window.speechSynthesis;
    
        synth.cancel();
    
        setIsPaused(false);
    };
    
    return (
    <div>
    <button onClick={handlePlay}>{isPaused ? "Resume" : "Play"}</button>
    <button onClick={handlePause}>Pause</button>
    <button onClick={handleStop}>Stop</button>
    </div>
    );
    };
    
    export default SimpleTextToSpeech;

This code defines a new functional component called SimpleTextToSpeech. The component takes the text prop as input and creates a new SpeechSynthesisUtterance object that contains the text to be spoken. The useEffect hook is used to initialise the utterance state and cancel any ongoing speech synthesis when the component is unmounted.

The component also defines three event handlers for playing, pausing, and stopping the speech synthesis. When the Play/Resume button is clicked, the speak method of the SpeechSynthesis interface is called to start/resume the speech synthesis. Similarly, the pause and cancel methods are called when the Pause and Stop buttons are clicked, respectively.

In case you are curious what we save into utterance state, here is the output of the SpeechSynthesisUtterance object.

    SpeechSynthesisUtterance
    text: "Text-to-speech feature is ..."
    lang: ""
    voice: null
    volume: 1
    rate: 1
    pitch: 1
    onstart: null
    onend: null
    onerror: null
    onpause: null
    onresume: null
    onmark: null
    onboundary: null
    addEventListener: ƒ addEventListener() {}
    dispatchEvent: ƒ dispatchEvent() {}
    removeEventListener: ƒ removeEventListener() {}
    <constructor>: "SpeechSynthesisUtterance"

## Usage of the Text-to-Speech component
Okay, so now when we have a basic TextToSpeech component created, we can use it in our main page.

    import logo from './logo.svg';
    import './App.css';
    import React from "react";
    import SimpleTextToSpeech from "./SimpleTextToSpeech";
    
    function App() {
        const [text, setText] = React.useState("");
    
        return (
            <div className="App">
            <div className="group">
            <textarea
                rows="10"
                value={text}
                onChange={(e) => setText(e.target.value)}
            ></textarea>
            </div>
            <div>
            <h1>Simple TTS without extra library</h1>
            <SimpleTextToSpeech text={text} />
            <p>{text}</p>
            </div>
            </div>
        );
    }
    
    export default App;


Adding voice, speed and pitch controls
To add controls for changing the voice, speed, and pitch of the speech synthesis, we can create new state variables for each of these properties in our TextToSpeech component. We can then add input elements to allow the user to adjust these properties.

The code after adding above features will be here:
https://github.com/dorjear/speech-demo-stt-fe-direct/blob/main/src/SpeechToTextComponent.js


that’s a lot of changes to our initial code. So let’s discuss what happened here. We’ve added new state variables for voice, pitch, rate and volume and input elements for controls. We've also added a select element to allow the user to choose from the available voices.

We’ve updated the handlePlay function to set the voice, rate, and pitch properties of the SpeechSynthesisUtterance object based on the current state of our component.

