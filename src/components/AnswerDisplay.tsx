import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ReactMarkdown, { Components } from 'react-markdown';
import { ArrowLeft, MessageCircle, Send, ThumbsUp, ThumbsDown, Bookmark, X, ImagePlus } from 'lucide-react';
import { getGeminiResponse } from '../services/geminiService';
import LoadingAnimation from './LoadingAnimation';
import CodeBlock from './CodeBlock';
import ImageUploader from './ImageUploader';
import SpeechControls from './SpeechControls';

interface CodeProps {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

const AnswerDisplay = () => {
  const location = useLocation();
  const { answer, question, image } = location.state as { 
    answer: string; 
    question: string;
    image?: string;
  };

  // Initialize selectedImage with the image from location state
// Remove this duplicate declaration since selectedImage is already declared below
  
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState([
    { type: 'question', content: question },
    { type: 'answer', content: answer }
  ]);

  const handleFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpQuestion.trim()) return;

    setIsLoading(true);
    setConversation(prev => [...prev, { type: 'question', content: followUpQuestion }]);
    
    try {
      const response = await getGeminiResponse(followUpQuestion, selectedImage || undefined);
      if (!response) {
        throw new Error('Empty response from AI');
      }
      setConversation(prev => [...prev, { type: 'answer', content: response }]);
      setFollowUpQuestion('');
    } catch (error) {
      console.error('Error getting AI response:', error);
      setConversation(prev => [...prev, { 
        type: 'answer', 
        content: 'Sorry, I encountered an error. Please try rephrasing your question or try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const [feedback, setFeedback] = useState<Record<number, 'like' | 'dislike' | null>>({});
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageSelect = (imageData: string) => {
    setSelectedImage(imageData);
    setShowImageUploader(false);
  };

  const handleFeedback = (index: number, type: 'like' | 'dislike') => {
    setFeedback(prev => {
      const newFeedback = {
        ...prev,
        [index]: prev[index] === type ? null : type
      };
      return newFeedback;
    });
  };

  const handleBookmark = (index: number) => {
    setBookmarks(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
    setShowBookmarks(true);
  };

  return (
    <div className="relative min-h-screen bg-[conic-gradient(at_top,_var(--tw-gradient-stops))]">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Link 
          to="/chat" 
          className="group inline-flex items-center space-x-2 text-indigo-500 hover:text-indigo-600 mb-6 sm:mb-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 transform group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm sm:text-base font-medium">Back to Chat</span>
        </Link>
        
        <div className="space-y-6 sm:space-y-8">
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
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
          {conversation.map((item, index) => (
            <div 
              key={index} 
              className="answer-item opacity-100 relative group px-2 sm:px-0" 
            >
              <div
                className={`${
                  item.type === 'question' 
                    ? 'bg-white/90 dark:bg-gray-700/90 border-l-4 border-purple-500' 
                    : 'bg-white/90 dark:bg-gray-800/90 border-l-4 border-indigo-500'
                } backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`p-1.5 sm:p-2 rounded-full ${item.type === 'question' ? 'bg-purple-100 dark:bg-purple-900/50' : 'bg-indigo-100 dark:bg-indigo-900/50'}`}>
                      <MessageCircle className={`h-4 w-4 sm:h-5 sm:w-5 ${item.type === 'question' ? 'text-purple-500' : 'text-indigo-500'}`} />
                    </div>
                    <span className="text-sm sm:text-base md:text-lg font-medium">
                      {item.type === 'question' ? 'Your Question' : 'AI Response'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <SpeechControls
                      text={item.content}
                      onSpeechInput={setFollowUpQuestion}
                    />
                    {item.type === 'answer' && (
                      <>
                        <button
                          onClick={() => handleFeedback(index, 'like')}
                          className={`p-2.5 rounded-full transition-all duration-200 ${
                            feedback[index] === 'like' 
                              ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 scale-110' 
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-110'
                          }`}
                          title="Helpful"
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleFeedback(index, 'dislike')}
                          className={`p-2 rounded-full transition-all duration-200 ${
                            feedback[index] === 'dislike' ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleBookmark(index)}
                          className={`p-2 rounded-full transition-all duration-200 ${
                            bookmarks.includes(index) ? 'text-yellow-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <Bookmark className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({children}) => (
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                          {children}
                        </h1>
                      ),
                      h2: ({children}) => <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mt-6 sm:mt-8 mb-3 sm:mb-4">{children}</h2>,
                      h3: ({children}) => <h3 className="text-base sm:text-lg md:text-xl font-medium mt-4 sm:mt-6 mb-2 sm:mb-3">{children}</h3>,
                      ul: ({children}) => <ul className="list-disc pl-4 sm:pl-6 mb-4 sm:mb-6">{children}</ul>,
                      ol: ({children}) => <ol className="list-decimal pl-4 sm:pl-6 mb-4 sm:mb-6">{children}</ol>,
                      li: ({children}) => <li className="mb-1 sm:mb-2 text-sm sm:text-base">{children}</li>,
                      p: ({children}) => <p className="mb-3 sm:mb-4 text-sm sm:text-base text-gray-800 dark:text-gray-200">{children}</p>,
                      code: ({ inline, className, children }: CodeProps) => {
                        const match = /language-(\w+)/.exec(className || '');
                        if (inline) {
                          return (
                            <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
                              {children}
                            </code>
                          );
                        }
                        return (
                          <CodeBlock language={match?.[1]}>
                            {String(children).replace(/\n$/, '')}
                          </CodeBlock>
                        );
                      }
                    } as Components}
                  >
                    {item.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-center py-8">
              <LoadingAnimation />
            </div>
          )}
        </div>

        <form onSubmit={handleFollowUp} className="mt-8 sticky bottom-4 sm:bottom-6 md:bottom-8 w-full px-2 sm:px-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setShowImageUploader(true)}
                className="p-2 text-gray-500 hover:text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                title="Upload Image"
              >
                <ImagePlus className="h-5 w-5" />
              </button>
              <SpeechControls
                text={followUpQuestion}
                onSpeechInput={setFollowUpQuestion}
              />
            </div>
            <input
              type="text"
              value={followUpQuestion}
              onChange={(e) => setFollowUpQuestion(e.target.value)}
              placeholder="Ask a follow-up question..."
              className="flex-1 p-2 sm:p-3 text-sm sm:text-base border rounded-lg dark:bg-gray-700/50 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md hover:shadow-xl font-medium min-w-[100px] sm:min-w-[120px]"
              disabled={!followUpQuestion.trim() || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-pulse">...</span>
                </span>
              ) : (
                <>
                  <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Send</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Image Uploader Modal */}
      {showImageUploader && (
        <ImageUploader
          onImageSelect={handleImageSelect}
          onClose={() => setShowImageUploader(false)}
        />
      )}
      
      {/* Bookmarks Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          showBookmarks ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Bookmarks</h3>
            <button
              onClick={() => setShowBookmarks(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-4">
            {bookmarks.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                No bookmarks yet
              </p>
            ) : (
              bookmarks.map((index) => (
                <div 
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600"
                >
                  <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-3 mb-2">
                    {conversation[index].content}
                  </p>
                  <button
                    onClick={() => setBookmarks(prev => prev.filter(i => i !== index))}
                    className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerDisplay;