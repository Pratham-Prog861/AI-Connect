import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, MessageCircle, Send } from 'lucide-react';
import { getGeminiResponse } from '../services/geminiService';

const AnswerDisplay = () => {
  const location = useLocation();
  const { answer, question } = location.state as { answer: string; question: string };
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
      const response = await getGeminiResponse(followUpQuestion);
      setConversation(prev => [...prev, { type: 'answer', content: response }]);
      setFollowUpQuestion('');
    } catch (error) {
      setConversation(prev => [...prev, { 
        type: 'answer', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-indigo-500 hover:text-indigo-600 mb-4 sm:mb-6"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Back to Chat</span>
        </Link>
        
        <div className="space-y-4 sm:space-y-6">
          {conversation.map((item, index) => (
            <div key={index} className={`${item.type === 'question' ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} p-3 sm:p-4 rounded-lg`}>
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base font-medium">{item.type === 'question' ? 'Question' : 'Answer'}</span>
              </div>
              
              <div className="prose dark:prose-invert prose-sm sm:prose-base md:prose-lg max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({children}) => <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">{children}</h1>,
                    h2: ({children}) => <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mt-6 sm:mt-8 mb-3 sm:mb-4">{children}</h2>,
                    h3: ({children}) => <h3 className="text-base sm:text-lg md:text-xl font-medium mt-4 sm:mt-6 mb-2 sm:mb-3">{children}</h3>,
                    ul: ({children}) => <ul className="list-disc pl-4 sm:pl-6 mb-4 sm:mb-6">{children}</ul>,
                    ol: ({children}) => <ol className="list-decimal pl-4 sm:pl-6 mb-4 sm:mb-6">{children}</ol>,
                    li: ({children}) => <li className="mb-1 sm:mb-2 text-sm sm:text-base">{children}</li>,
                    p: ({children}) => <p className="mb-3 sm:mb-4 text-sm sm:text-base text-gray-800 dark:text-gray-200">{children}</p>,
                    code: ({children}) => <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">{children}</code>,
                    pre: ({children}) => <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg overflow-x-auto text-sm my-4">{children}</pre>,
                  }}
                >
                  {item.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleFollowUp} className="mt-4 sm:mt-6 sticky bottom-4 sm:bottom-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={followUpQuestion}
              onChange={(e) => setFollowUpQuestion(e.target.value)}
              placeholder="Ask a follow-up question..."
              className="flex-1 p-2 text-sm sm:text-base border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="px-3 sm:px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              disabled={!followUpQuestion.trim() || isLoading}
            >
              {isLoading ? (
                <span>Sending...</span>
              ) : (
                <>
                  <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Send</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnswerDisplay;