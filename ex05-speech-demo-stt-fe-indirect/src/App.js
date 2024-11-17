import React, { useState } from 'react';
import { Container } from 'reactstrap';
import { getTokenOrRefresh } from './token_util';
import './custom.css'
import { ResultReason } from 'microsoft-cognitiveservices-speech-sdk';

const speechsdk = require('microsoft-cognitiveservices-speech-sdk')

export default function App() { 
    const [displayText, setDisplayText] = useState('INITIALIZED: ready to test speech...');
    const [player, updatePlayer] = useState({p: undefined, muted: false});

    async function startRecording() {
        // Implementation of start recording and speech to text
    }

    async function textToSpeech() {
        const tokenObj = await getTokenOrRefresh();
        const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region);
        const myPlayer = new speechsdk.SpeakerAudioDestination();
        updatePlayer(p => {p.p = myPlayer; return p;});
        const audioConfig = speechsdk.AudioConfig.fromSpeakerOutput(player.p);

        let synthesizer = new speechsdk.SpeechSynthesizer(speechConfig, audioConfig);

        const textToSpeak = displayText.toLowerCase();
        setDisplayText(`speaking text: ${textToSpeak}...`);
        synthesizer.speakTextAsync(
        textToSpeak,
        result => {
            let text;
            if (result.reason === speechsdk.ResultReason.SynthesizingAudioCompleted) {
                text = `synthesis finished for "${textToSpeak}".\n`
            } else if (result.reason === speechsdk.ResultReason.Canceled) {
                text = `synthesis failed. Error detail: ${result.errorDetails}.\n`
            }
            synthesizer.close();
            synthesizer = undefined;
            setDisplayText(text);
        },
        function (err) {
            setDisplayText(`Error: ${err}.\n`);

            synthesizer.close();
            synthesizer = undefined;
        });
    }

    async function handleMute() {
        updatePlayer(p => { 
            if (!p.muted) {
                p.p.pause();
                return {p: p.p, muted: true}; 
            } else {
                p.p.resume();
                return {p: p.p, muted: false}; 
            }
        });
    }

    async function handleFileChange(event) {
        // Implementation of file speech to text
    }

    return (
        <Container className="app-container">
            <h1 className="display-4 mb-3">Speech sample app</h1>

            <div className="row main-container">
                <div className="col-6">
                    <i className="fas fa-microphone fa-lg mr-2" onClick={() => startRecording()}/>
                    Convert speech to text from your mic.

                    <div className="mt-2">
                        <label htmlFor="audio-file"><i className="fas fa-file-audio fa-lg mr-2"/></label>
                        <input 
                            type="file" 
                            id="audio-file" 
                            onChange={(e) => handleFileChange(e)}
                            style={{display: "none"}} 
                        />
                        Convert speech to text from an audio file.
                    </div>
                    <div className="mt-2">
                        <i className="fas fa-volume-up fa-lg mr-2" onClick={() => textToSpeech()}/>
                        Convert text to speech.
                    </div>
                    <div className="mt-2">
                        <i className="fas fa-volume-mute fa-lg mr-2" onClick={() => handleMute()}/>
                        Pause/resume text to speech output.
                    </div>

                </div>
                    <textarea className="col-6 output-display rounded"
                      value={displayText}
                      onChange={(e) => setDisplayText(e.target.value)}
                    ></textarea>
            </div>
        </Container>
    );
}
