import { useState, useRef, useEffect } from 'react'; // Added missing imports
import { Send, ImagePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getGeminiResponse } from "../services/geminiService";
import ImageUploader from "./ImageUploader"; // Removed unused imports
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown


const ChatInterface = () => {
  const [messages, setMessages] = useState<
    Array<{ text: string; sender: "user" | "ai" }>
  >([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (imageData: string) => {
    setSelectedImage(imageData);
    // Don't automatically hide the uploader
  };

  const sendMessage = async () => {
    if (input.trim() !== "") {
      const userMessage = input.trim();
      setMessages((prev: Array<{ text: string; sender: "user" | "ai" }>) => [...prev, { text: userMessage, sender: "user" }]);
      setInput("");
      setIsLoading(true);
  
      try {
        const response = await getGeminiResponse(userMessage);
        navigate("/answer", {
          state: {
            question: userMessage,
            answer: response,
            image: selectedImage,
          },
        });
      } catch (error) {
        setMessages((prev: Array<{ text: string; sender: "user" | "ai" }>) => [
          ...prev,
          {
            text: "Sorry, I encountered an error. Please try again.",
            sender: "ai",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] sm:h-[calc(100vh-8rem)] md:h-[calc(100vh-16rem)]">
      <div className="flex-1 w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="h-12 sm:h-14 md:h-16 p-2 sm:p-3 md:p-4 border-b dark:border-gray-700 flex items-center">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">
            Ask AIConnect
          </h2>
        </div>

        <div className="flex flex-col h-[calc(100%-7rem)] sm:h-[calc(100%-8rem)] p-2 sm:p-3 md:p-4 overflow-y-auto">
          {showImageUploader && (
            <div className="mb-3 sm:mb-4">
              <ImageUploader
                onImageSelect={handleImageSelect}
                onClose={() => setShowImageUploader(false)}
              />
            </div>
          )}
          {selectedImage && (
            <div className="mb-3 sm:mb-4 relative group">
              <img
                src={selectedImage}
                alt="Selected"
                className="max-h-48 sm:max-h-56 md:max-h-64 rounded-lg mx-auto"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 p-1.5 sm:p-2 bg-gray-800/50 hover:bg-gray-800/75 rounded-full text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                disabled={isLoading}
              >
                ×
              </button>
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } mb-2 sm:mb-3 md:mb-4`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 rounded-lg text-sm sm:text-base ${
                  message.sender === "user"
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
                }`}
              >
                {message.sender === "ai" ? (
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                ) : (
                  message.text
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="h-14 sm:h-16 p-2 border-t dark:border-gray-700">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowImageUploader(!showImageUploader)}
              className="p-1.5 sm:p-2 text-gray-500 hover:text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
              title="Upload Image"
              disabled={isLoading}
            >
              <ImagePlus className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <input
              type="text"
              className="flex-grow p-2 sm:p-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button
              className="px-3 sm:px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
            >
              <Send className={`h-4 w-4 sm:h-5 sm:w-5 ${isLoading ? "animate-pulse" : ""}`} />
              <span className="hidden sm:inline text-sm sm:text-base">
                {isLoading ? "Sending..." : "Send"}
              </span>
            </button>
          </div>
        </div>

        {showImageUploader && (
          <div className="fixed inset-x-0 bottom-16 sm:bottom-20 mx-2 sm:mx-auto max-w-lg bg-white dark:bg-gray-800 p-3 sm:p-4 shadow-lg rounded-lg">
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
