import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getGeminiResponse } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const ChatInterface = () => {
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'ai' }>>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const sendMessage = async () => {
    if (input.trim() !== '') {
      const userMessage = input.trim();
      setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
      setInput('');
      setIsLoading(true);

      try {
        const response = await getGeminiResponse(userMessage);
        // Navigate to answer display with the response
        navigate('/answer', { state: { answer: response } });
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
    <div className="h-[550px] w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="h-16 p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold text-center text-gray-800 dark:text-white">Ask AIConnect </h2>
      </div>
      
      <div className="h-[calc(100%-8rem)] p-4 overflow-y-auto">
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
      </div>

      <div className="h-15 p-2 border-t dark:border-gray-700">
        <div className="flex items-center space-x-3">
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
    </div>
  );
};

export default ChatInterface;
