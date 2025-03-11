import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, MessageSquare, Image, Zap, Star, Shield, Cpu } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)] bg-gradient-to-b from-indigo-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16 flex-1">
        {/* Hero Section */}
        <div className="text-center mb-24 space-y-8">
          <div className="relative inline-block animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 relative z-10">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient">AI Connect</span>
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg blur opacity-30 dark:opacity-40 animate-pulse"></div>
          </div>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Experience the next generation of AI interaction powered by Google's Gemini. 
            Your intelligent companion for conversations, image analysis, and problem-solving.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/chat"
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Start Chatting
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
          <FeatureCard
            icon={<Brain className="h-12 w-12 text-indigo-500" />}
            title="Smart Conversations"
            description="Engage in natural, intelligent discussions powered by Google's advanced Gemini AI technology"
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
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Why Choose <span className="text-indigo-500">AI Connect</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <InfoCard
              icon={<Shield className="h-8 w-8" />}
              title="Secure & Private"
              description="Your conversations and data are protected with enterprise-grade security"
            />
            <InfoCard
              icon={<Cpu className="h-8 w-8" />}
              title="Advanced Technology"
              description="Powered by Google's latest Gemini AI model for superior understanding"
            />
            <InfoCard
              icon={<Star className="h-8 w-8" />}
              title="User-Friendly"
              description="Intuitive interface designed for seamless interaction"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
          <StatCard number="99.9%" text="Uptime" />
          <StatCard number="<500ms" text="Response Time" />
          <StatCard number="24/7" text="Support" />
          <StatCard number="100%" text="Satisfaction" />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-gray-100 dark:border-gray-700">
    <div className="mb-6 animate-bounce-slow">{icon}</div>
    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 text-lg">{description}</p>
  </div>
);

const InfoCard = ({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="p-6 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200">
    <div className="text-indigo-500 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

const StatCard = ({ number, text }: { number: string; text: string }) => (
  <div className="p-4">
    <div className="text-3xl font-bold text-indigo-500 mb-2">{number}</div>
    <div className="text-gray-600 dark:text-gray-300">{text}</div>
  </div>
);

export default LandingPage;