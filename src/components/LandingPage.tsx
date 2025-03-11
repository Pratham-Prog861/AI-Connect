import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, MessageSquare, Image, Zap, Star, Shield, Cpu, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)] bg-gradient-to-b from-indigo-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-20 lg:mb-24 space-y-6 sm:space-y-8">
          <div className="relative inline-block animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 relative z-10">
              Experience AI with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient">
                AI Connect
              </span>
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg blur opacity-30 dark:opacity-40 animate-pulse"></div>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Harness the power of Google's Gemini AI for intelligent conversations, 
            image analysis, and problem-solving. Your smart companion for the future.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Link
              to="/chat"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Start Chatting
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800 border-2 border-indigo-600 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transform hover:scale-105 transition-all duration-200"
            >
              Learn More
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-16 sm:mb-20 lg:mb-24">
          <FeatureCard
            icon={<Brain className="h-12 w-12 text-indigo-500" />}
            title="Smart Conversations"
            description="Experience natural, intelligent discussions powered by Google's advanced Gemini AI technology"
          />
          <FeatureCard
            icon={<Image className="h-12 w-12 text-purple-500" />}
            title="Image Analysis"
            description="Upload images or paste URLs for detailed visual analysis and understanding"
          />
          <FeatureCard
            icon={<Zap className="h-12 w-12 text-pink-500" />}
            title="Quick Responses"
            description="Get instant, accurate responses to your questions with minimal latency"
          />
        </div>

        {/* About Section */}
        <div className="text-center mb-16 sm:mb-20 lg:mb-24">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">
            Why Choose <span className="text-indigo-500">AI Connect</span>?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <InfoCard
              icon={<Shield className="h-8 w-8" />}
              title="Secure & Private"
              description="Enterprise-grade security for your data and conversations"
            />
            <InfoCard
              icon={<Cpu className="h-8 w-8" />}
              title="Advanced Technology"
              description="Powered by Google's latest Gemini AI model"
            />
            <InfoCard
              icon={<Star className="h-8 w-8" />}
              title="User-Friendly"
              description="Intuitive interface for seamless interaction"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto text-center">
          <StatCard number="99.9%" text="Uptime" />
          <StatCard number="<500ms" text="Response Time" />
          <StatCard number="24/7" text="Support" />
          <StatCard number="100%" text="Satisfaction" />
        </div>
      </div>
    </div>
  );
};

// Component definitions remain the same but with enhanced responsive classes
const FeatureCard = ({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-gray-100 dark:border-gray-700">
    <div className="mb-4 sm:mb-6 animate-bounce-slow">{icon}</div>
    <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">{title}</h3>
    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

const InfoCard = ({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="p-5 sm:p-6 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200">
    <div className="text-indigo-500 mb-3 sm:mb-4">{icon}</div>
    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

const StatCard = ({ number, text }: { number: string; text: string }) => (
  <div className="p-4 sm:p-5">
    <div className="text-2xl sm:text-3xl font-bold text-indigo-500 mb-1 sm:mb-2">{number}</div>
    <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{text}</div>
  </div>
);

export default LandingPage;