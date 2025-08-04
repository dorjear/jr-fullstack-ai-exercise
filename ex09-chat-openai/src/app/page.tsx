'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faRobot, faUser, faMicrophone, faRecordVinyl } from '@fortawesome/free-solid-svg-icons';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import MicRecorder from 'mic-recorder-to-mp3';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const recorder = new MicRecorder({ bitRate: 128 });

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hello! How can I help you today?', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    setInput(transcript);
  }, [transcript]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const newUserMessage: Message = { id: messages.length + 1, text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInput('');
    resetTranscript();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, newUserMessage].map(msg => ({ role: msg.sender === 'user' ? 'user' : 'assistant', content: msg.text })) }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botResponse: Message = { id: messages.length + 2, text: data.response, sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = { id: messages.length + 2, text: 'Error: Could not connect to the chatbot.', sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleVoiceClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const handleRecordClick = () => {
    if (isRecording) {
      recorder.stop().getMp3().then(async ([buffer, blob]) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];

          const userMessageText = input || "Audio message";
          const newUserMessage: Message = { id: messages.length + 1, text: userMessageText, sender: 'user' };
          setMessages((prevMessages) => [...prevMessages, newUserMessage]);
          setInput('');

          try {
            const response = await fetch('/api/chat/audio-completion', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                audio: base64Audio,
                messages: [...messages, newUserMessage].map(msg => ({ role: msg.sender === 'user' ? 'user' : 'assistant', content: msg.text }))
              }),
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const botResponse: Message = { id: messages.length + 2, text: data.response, sender: 'bot' };
            setMessages((prevMessages) => [...prevMessages, botResponse]);

          } catch (error) {
            console.error('Error sending audio for completion:', error);
            const errorMessage: Message = { id: messages.length + 2, text: 'Error: Could not process the audio.', sender: 'bot' };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
          }
        };
      }).catch((e: any) => console.error(e));
      setIsRecording(false);
    } else {
      recorder.start().then(() => {
        setIsRecording(true);
      }).catch((e: any) => console.error(e));
    }
  };

  if (!isMounted) {
    return null;
  }

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 text-white font-sans">
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="max-w-3xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`relative p-3 rounded-lg shadow-lg max-w-[70%] ${message.sender === 'user'
                  ? 'bg-blue-600 bg-opacity-40 backdrop-filter backdrop-blur-lg border border-blue-500 border-opacity-30'
                  : 'bg-gray-700 bg-opacity-40 backdrop-filter backdrop-blur-lg border border-gray-600 border-opacity-30'}
                  before:content-[''] before:absolute before:w-0 before:h-0 before:border-[10px] before:border-transparent
                  ${message.sender === 'user'
                    ? 'before:border-l-blue-500/30 before:right-[-20px] before:top-1/2 before:-translate-y-1/2'
                    : 'before:border-r-gray-600/30 before:left-[-20px] before:top-1/2 before:-translate-y-1/2'}
                `}
              >
                <div className="flex items-center">
                  {message.sender === 'bot' && (
                    <FontAwesomeIcon icon={faRobot} className="mr-2 text-blue-300" />
                  )}
                  <p className="text-sm">{message.text}</p>
                  {message.sender === 'user' && (
                    <FontAwesomeIcon icon={faUser} className="ml-2 text-purple-300" />
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <form onSubmit={handleSubmit} className="p-4 bg-gray-800 bg-opacity-60 backdrop-filter backdrop-blur-lg border-t border-gray-700">
        <div className="max-w-3xl mx-auto flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={listening ? 'Listening...' : 'Type your message...'}
            className="flex-1 p-3 rounded-lg bg-gray-700 bg-opacity-50 border border-gray-600 focus:outline-none focus:border-purple-500 text-white placeholder-gray-400"
          />
          <button
            type="button"
            onClick={handleVoiceClick}
            className={`${listening ? 'text-red-500' : 'text-white'} bg-purple-600 hover:bg-purple-700 p-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105`}
          >
            <FontAwesomeIcon icon={faMicrophone} />
          </button>
          <button
            type="button"
            onClick={handleRecordClick}
            className={`${isRecording ? 'text-red-500' : 'text-white'} bg-purple-600 hover:bg-purple-700 p-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105`}
          >
            <FontAwesomeIcon icon={faRecordVinyl} />
          </button>
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </form>

      <footer className="p-3 text-center text-gray-400 text-xs bg-gray-900 bg-opacity-70">
        © {new Date().getFullYear()} Chatbot UI. Created by @TonyKing
      </footer>
    </div>
  );
}
