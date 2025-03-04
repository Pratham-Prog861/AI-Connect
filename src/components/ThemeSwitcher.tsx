import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Check localStorage and system preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme as 'light' | 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    // Update the HTML document class for Tailwind dark mode
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save the theme preference
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="h-6 w-6 text-gray-600 hover:text-gray-800" />
      ) : (
        <Sun className="h-6 w-6 text-yellow-400 hover:text-yellow-300" />
      )}
    </button>
  );
};

export default ThemeSwitcher;
