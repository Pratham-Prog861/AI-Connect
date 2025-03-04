import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ChatInterface from './components/ChatInterface';
import AnswerDisplay from './components/AnswerDisplay';
import ThemeSwitcher from './components/ThemeSwitcher';
import { Brain } from 'lucide-react';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
          <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 text-xl font-semibold">
              <Brain className='text-indigo-500' />
              <span className="text-indigo-500">AI Connect</span>
            </Link>
            <div className="flex items-center space-x-4">
              <ThemeSwitcher />
            </div>
          </nav>
        </header>

        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<ChatInterface />} />
            <Route path="/answer" element={<AnswerDisplay />} />
          </Routes>
        </main>

        <footer className="bg-white dark:bg-gray-800 shadow-inner mt-8">
          <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} AI Connect. All rights reserved.
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
