import { motion } from 'framer-motion';
import { Calendar, Code2, MessageSquare, Image, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-6">
            About AI Connect
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            An intelligent chat interface powered by Google's Gemini AI, designed to make AI interactions more accessible and intuitive.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <MessageSquare className="h-12 w-12 text-indigo-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Natural Conversations</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Engage in natural, context-aware conversations with advanced AI technology.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Code2 className="h-12 w-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Code Understanding</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get help with code explanations, debugging, and programming concepts.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Image className="h-12 w-12 text-pink-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Image Analysis</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Upload images and get AI-powered analysis and insights.
            </p>
          </motion.div>
        </div>

        {/* Timeline Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
            Our Journey
          </h2>
          <div className="max-w-3xl flex items-center justify-center mx-auto space-y-8">
            <div className="flex items-center gap-4">
              <Calendar className="h-8 w-8 text-indigo-500 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold">Project Launch</h3>
                <p className="text-gray-600 dark:text-gray-300">March 2024</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Creator Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
            Created by
          </h2>
          <div className="inline-block bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <img 
              src="/creator-avatar.png" 
              alt="Pratham Darji"
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold mb-2">Pratham Darji</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Frontend Developer</p>
            <a 
              href="https://github.com/Pratham-Prog861" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-indigo-500 hover:text-indigo-600 transition-colors"
            >
              <Github className="h-5 w-5" />
              <span>GitHub Profile</span>
            </a>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <Link 
            to="/chat"
            className="inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Start Chatting Now
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default About;