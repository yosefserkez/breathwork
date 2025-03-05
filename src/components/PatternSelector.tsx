import React, { useState } from 'react';
import { BreathPattern } from '../types';
import { Wind, Zap, Moon, Clock, Sparkles, Settings, Star, StarOff, Search, Filter, Info } from 'lucide-react';

interface PatternSelectorProps {
  patterns: BreathPattern[];
  selectedPattern: BreathPattern;
  onSelectPattern: (pattern: BreathPattern) => void;
}

const PatternSelector: React.FC<PatternSelectorProps> = ({
  patterns,
  selectedPattern,
  onSelectPattern,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  
  // Map pattern IDs to icons
  const getPatternIcon = (id: string) => {
    switch (id) {
      case 'box':
        return <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />;
      case '478':
        return <Moon className="w-6 h-6 text-purple-600 dark:text-purple-400" />;
      case 'coherent':
        return <Wind className="w-6 h-6 text-purple-600 dark:text-purple-400" />;
      case 'wim-hof':
        return <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />;
      case 'relaxing':
        return <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />;
      case 'custom':
        return <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />;
      default:
        return <Wind className="w-6 h-6 text-purple-600 dark:text-purple-400" />;
    }
  };

  // Load favorites from localStorage
  const [favorites, setFavorites] = React.useState<string[]>([]);
  
  React.useEffect(() => {
    const savedFavorites = localStorage.getItem('breathflow-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  const saveFavorites = (newFavorites: string[]) => {
    localStorage.setItem('breathflow-favorites', JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  // Toggle favorite status
  const toggleFavorite = (patternId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (favorites.includes(patternId)) {
      saveFavorites(favorites.filter(id => id !== patternId));
    } else {
      saveFavorites([...favorites, patternId]);
    }
  };

  // Filter patterns based on search and category
  const filteredPatterns = patterns.filter(pattern => {
    const matchesSearch = pattern.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         pattern.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === null || pattern.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(patterns.map(pattern => pattern.category)));

  // State to track which pattern's instructions are being shown (for mobile)
  const [activeInstructions, setActiveInstructions] = useState<string | null>(null);
  
  const toggleInstructions = (patternId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveInstructions(activeInstructions === patternId ? null : patternId);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4 text-purple-800 dark:text-purple-300">Breathing Patterns</h2>
      
      {/* Search and filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search patterns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setFilterCategory(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
              filterCategory === null 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilterCategory(category === filterCategory ? null : category)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                filterCategory === category 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Pattern grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatterns.length > 0 ? (
          filteredPatterns.map((pattern) => (
            <div
              key={pattern.id}
              className={`preset-card cursor-pointer transition-all duration-200 ${
                selectedPattern.id === pattern.id
                  ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-50 transform scale-[1.02] shadow-lg'
                  : 'dark:bg-gray-800 dark:bg-opacity-40 hover:shadow-md hover:-translate-y-1'
              }`}
              onClick={() => onSelectPattern(pattern)}
            >
              <div className="flex items-start">
                {/* <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900 mr-3">
                  {getPatternIcon(pattern.id)}
                </div> */}
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-purple-900 dark:text-purple-300">{pattern.name}</h3>
                    <div className="flex items-center space-x-2">
                      <div className="relative group">
                        <button 
                          onClick={(e) => toggleInstructions(pattern.id, e)}
                          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                          aria-label="View instructions"
                        >
                          <Info className="h-5 w-5" />
                        </button>
                        
                        {/* Desktop tooltip (on hover) */}
                        <div className="hidden group-hover:block absolute z-10 right-0 w-72 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300">
                          <p className="font-medium mb-1 text-gray-900 dark:text-white">Instructions:</p>
                          <p>{pattern.instructions}</p>
                        </div>
                        
                        {/* Mobile tooltip (on click) */}
                        {activeInstructions === pattern.id && (
                          <div className="md:hidden absolute z-10 right-0 w-64 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300">
                            <p className="font-medium mb-1 text-gray-900 dark:text-white">Instructions:</p>
                            <p>{pattern.instructions}</p>
                          </div>
                        )}
                      </div>
                      
                      {/* <button
                        onClick={(e) => toggleFavorite(pattern.id, e)}
                        className={`p-1 focus:outline-none ${
                          favorites.includes(pattern.id)
                            ? 'text-yellow-500 hover:text-yellow-600'
                            : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
                        }`}
                        aria-label={favorites.includes(pattern.id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        {favorites.includes(pattern.id) ? (
                          <Star className="w-4 h-4 fill-current" />
                        ) : (
                          <StarOff className="w-4 h-4" />
                        )}
                      </button> */}
                    </div>
                  </div>
                  
                  <div className="mt-1 mb-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300">
                      {pattern.category}
                    </span>
                    {selectedPattern.id === pattern.id && (
                      <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                        Current
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{pattern.description}</p>
                  
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                      <span className="text-xs text-purple-500 dark:text-purple-300 font-medium">INHALE</span>
                      <span className="text-lg font-bold text-purple-800 dark:text-purple-200">{pattern.inhale}s</span>
                    </div>
                    
                    <div className={`flex flex-col items-center justify-center p-2 rounded-lg ${
                      pattern.hold1 > 0 
                        ? 'bg-indigo-100 dark:bg-indigo-900' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                    }`}>
                      <span className="text-xs text-indigo-500 dark:text-indigo-300 font-medium">HOLD</span>
                      <span className="text-lg font-bold text-indigo-800 dark:text-indigo-200">{pattern.hold1 > 0 ? `${pattern.hold1}s` : '—'}</span>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                      <span className="text-xs text-blue-500 dark:text-blue-300 font-medium">EXHALE</span>
                      <span className="text-lg font-bold text-blue-800 dark:text-blue-200">{pattern.exhale}s</span>
                    </div>
                    
                    <div className={`flex flex-col items-center justify-center p-2 rounded-lg ${
                      pattern.hold2 > 0 
                        ? 'bg-violet-100 dark:bg-violet-900' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                    }`}>
                      <span className="text-xs text-violet-500 dark:text-violet-300 font-medium">HOLD</span>
                      <span className="text-lg font-bold text-violet-800 dark:text-violet-200">{pattern.hold2 > 0 ? `${pattern.hold2}s` : '—'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No breathing patterns found matching your search.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilterCategory(null);
              }}
              className="mt-2 text-purple-600 dark:text-purple-400 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatternSelector;