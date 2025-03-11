import  { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ReactMarkdown, { Components } from 'react-markdown';
import { ArrowLeft, MessageCircle, Send, Copy, Check, ThumbsUp, ThumbsDown, Share, Bookmark } from 'lucide-react';
import { getGeminiResponse } from '../services/geminiService';
import LoadingAnimation from './LoadingAnimation';
import CodeBlock from './CodeBlock';

interface CodeProps {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

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

  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const [feedback, setFeedback] = useState<Record<number, 'like' | 'dislike' | null>>({});
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [showShareTooltip, setShowShareTooltip] = useState<number | null>(null);

  // Add animation effect when mounting
  useEffect(() => {
    const elements = document.querySelectorAll('.answer-item');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('opacity-100', 'translate-y-0');
      }, index * 200);
    });
  }, [conversation]);

  const handleFeedback = (index: number, type: 'like' | 'dislike') => {
    setFeedback(prev => ({
      ...prev,
      [index]: prev[index] === type ? null : type
    }));
  };

  const handleBookmark = (index: number) => {
    setBookmarks(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleShare = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setShowShareTooltip(Date.now());
    setTimeout(() => setShowShareTooltip(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50 dark:from-gray-800 dark:to-gray-900">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-indigo-500 hover:text-indigo-600 mb-4 sm:mb-6 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Back to Chat</span>
        </Link>
        
        <div className="space-y-4 sm:space-y-6">
          {conversation.map((item, index) => (
            <div 
              key={index} 
              className="answer-item opacity-0 translate-y-4 transition-all duration-500 ease-out relative group"
            >
              <div
                className={`${
                  item.type === 'question' 
                    ? 'bg-white dark:bg-gray-700' 
                    : 'bg-white dark:bg-gray-800 border-l-4 border-indigo-500'
                } p-4 sm:p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MessageCircle className={`h-5 w-5 ${item.type === 'question' ? 'text-purple-500' : 'text-indigo-500'}`} />
                    <span className="text-sm sm:text-base font-medium">
                      {item.type === 'question' ? 'Your Question' : 'AI Response'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.type === 'answer' && (
                      <>
                        <button
                          onClick={() => handleFeedback(index, 'like')}
                          className={`p-2 rounded-full transition-all duration-200 ${
                            feedback[index] === 'like' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
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
                    <button
                      onClick={() => handleShare(item.content)}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                      <Share className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleCopyText(item.content)}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                      {copiedText === item.content ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
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
            <div className="flex justify-center">
              <LoadingAnimation />
            </div>
          )}
        </div>

        <form onSubmit={handleFollowUp} className="mt-6 sticky bottom-4 sm:bottom-6">
          <div className="flex gap-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <input
              type="text"
              value={followUpQuestion}
              onChange={(e) => setFollowUpQuestion(e.target.value)}
              placeholder="Ask a follow-up question..."
              className="flex-1 p-3 text-sm sm:text-base border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md"
              disabled={!followUpQuestion.trim() || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-pulse">Thinking</span>
                  <span className="animate-bounce">...</span>
                </span>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send</span>
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