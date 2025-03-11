import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ChatInterface from './components/ChatInterface';
import AnswerDisplay from './components/AnswerDisplay';
import About from './components/About';
import ThemeSwitcher from './components/ThemeSwitcher';
import { Brain } from 'lucide-react';
import LandingPage from './components/LandingPage';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-sm">
          <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 text-lg sm:text-xl font-semibold">
              <Brain className="h-6 w-6 sm:h-7 sm:w-7 text-indigo-500" />
              <span className="text-indigo-500">AI Connect</span>
            </Link>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <ThemeSwitcher />
            </div>
          </nav>
        </header>

        <main className="flex-1 flex flex-col container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/chat" element={<ChatInterface />} />
            <Route path="/answer" element={<AnswerDisplay />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-inner">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-center text-sm sm:text-base text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} AI Connect Made by Pratham Darji. All rights reserved.
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
