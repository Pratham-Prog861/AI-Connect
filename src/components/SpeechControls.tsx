import { useState, useEffect } from 'react';
import { Mic, Volume2, VolumeX } from 'lucide-react';

interface SpeechControlsProps {
  text: string;
  onSpeechInput: (text: string) => void;
}

const SpeechControls = ({ text, onSpeechInput }: SpeechControlsProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported] = useState('speechSynthesis' in window);
  const [recognitionSupported] = useState('webkitSpeechRecognition' in window);

  const startListening = () => {
    if (!recognitionSupported) return;

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    
    recognition.onend = () => {
      setIsListening(false);
      // Only trigger submit if we have valid text
      if (text && text.trim()) {
        setTimeout(() => {
          const submitButton = document.querySelector('button[type="submit"]');
          if (submitButton && !submitButton.hasAttribute('disabled')) {
            (submitButton as HTMLButtonElement).click();
          }
        }, 500);
      }
    };
    
    recognition.onresult = (event) => {
      try {
        const transcript = event.results[0][0].transcript;
        if (transcript && transcript.trim()) {
          onSpeechInput(transcript);
        }
      } catch (error) {
        console.error('Speech recognition result error:', error);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setIsListening(false);
    }
  };

  // Text-to-Speech
  const speak = (text: string) => {
    if (!speechSupported) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (speechSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (speechSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [speechSupported]);

  return (
    <div className="flex items-center gap-2">
      {recognitionSupported && (
        <button
          onClick={startListening}
          className={`p-2 rounded-full transition-all duration-200 ${
            isListening 
              ? 'bg-red-100 text-red-600 animate-pulse' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          title={isListening ? 'Listening...' : 'Start speaking'}
        >
          <Mic className="h-5 w-5" />
        </button>
      )}
      
      {speechSupported && (
        <button
          onClick={isSpeaking ? stopSpeaking : () => speak(text)}
          className={`p-2 rounded-full transition-all duration-200 ${
            isSpeaking 
              ? 'bg-indigo-100 text-indigo-600' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          title={isSpeaking ? 'Stop speaking' : 'Listen to text'}
        >
          {isSpeaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      )}
    </div>
  );
};

export default SpeechControls;