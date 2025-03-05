import React from 'react';
import { Wind, Info } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  onInfoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onInfoClick }) => {
  return (
    <header className="w-full py-4 px-6 flex justify-between items-center bg-white dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm shadow-sm">
      <div className="flex items-center">
        <Wind className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-2" />
        <h1 className="text-2xl font-bold text-purple-900 dark:text-purple-300">BreathFlow <span className="text-sm opacity-50 italic">by Yo</span></h1>
      </div>
      
      <div className="flex items-center space-x-3">
        <ThemeToggle />
        <button
          onClick={onInfoClick}
          className="p-2 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
          aria-label="Information"
        >
          <Info className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </button>
      </div>
    </header>
  );
};

export default Header;