import React, { useState, useRef, useEffect } from 'react';
import { Send, ImagePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getGeminiResponse } from '../services/geminiService';
import LoadingAnimation from './LoadingAnimation';
import ImageUploader from './ImageUploader';
import { Upload } from 'lucide-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'ai' }>>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (imageData: string) => {
    setSelectedImage(imageData);
    // Don't automatically hide the uploader
  };

  const sendMessage = async () => {
    if (input.trim() !== '') {
      const userMessage = input.trim();
      setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
      setInput('');
      setIsLoading(true);

      try {
const response = await getGeminiResponse(userMessage);
        navigate('/answer', { 
          state: { 
            question: userMessage,
            answer: response,
            image: selectedImage 
          } 
        });
      } catch (error) {
        setMessages(prev => [
          ...prev,
          { text: 'Sorry, I encountered an error. Please try again.', sender: 'ai' }
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)]">
      <div className="flex-1 w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="h-16 p-4 border-b dark:border-gray-700 flex items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Ask AIConnect</h2>
        </div>

        <div className="flex flex-col h-[calc(100%-8rem)] p-4 overflow-y-auto">
          {showImageUploader && (
            <div className="mb-4">
              <ImageUploader onImageSelect={handleImageSelect} onClose={() => setShowImageUploader(false)} />
            </div>
          )}
          {selectedImage && (
            <div className="mb-4 relative group">
              <img 
                src={selectedImage} 
                alt="Selected" 
                className="max-h-64 rounded-lg mx-auto"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 p-2 bg-gray-800/50 hover:bg-gray-800/75 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={isLoading}
              >
                ×
              </button>
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="h-16 p-2 border-t dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowImageUploader(!showImageUploader)}
              className="p-2 text-gray-500 hover:text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
              title="Upload Image"
              disabled={isLoading}
            >
              <ImagePlus className="h-5 w-5" />
            </button>
            <input
              type="text"
              className="flex-grow p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
            >
              <span className="hidden sm:inline">{isLoading ? 'Sending...' : 'Send'}</span>
              <Send className={`h-5 w-5 ${isLoading ? 'animate-pulse' : ''}`} />
            </button>
          </div>
        </div>

        {showImageUploader && (
          <div className="absolute bottom-20 left-0 right-0 bg-white dark:bg-gray-800 p-4 shadow-lg rounded-lg">
            <ImageUploader 
              onImageSelect={handleImageSelect} 
              onClose={() => setShowImageUploader(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
