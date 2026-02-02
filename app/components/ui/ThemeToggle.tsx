'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
      aria-label="Theme umschalten"
    >
      <div className="relative w-5 h-5">
        <Sun
          className={`absolute inset-0 w-5 h-5 text-[#cb530a] transition-all duration-300 ${
            theme === 'light' ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'
          }`}
        />
        <Moon
          className={`absolute inset-0 w-5 h-5 text-[#182c30] transition-all duration-300 ${
            theme === 'dark' ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
          }`}
        />
      </div>
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#cb530a] to-[#182c30] opacity-0 group-hover:opacity-20 transition-opacity" />
    </button>
  );
}

