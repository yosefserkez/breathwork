import React, { useState, useEffect } from 'react';
import { Star, StarOff, Heart } from 'lucide-react';
import { BreathPattern } from '../types';

interface FavoritePatternsProps {
  patterns: BreathPattern[];
  selectedPattern: BreathPattern;
  onSelectPattern: (pattern: BreathPattern) => void;
}

const FavoritePatterns: React.FC<FavoritePatternsProps> = ({
  patterns,
  selectedPattern,
  onSelectPattern,
}) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage
  useEffect(() => {
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

  // Get favorite patterns
  const favoritePatterns = patterns.filter(pattern => favorites.includes(pattern.id));

  if (favoritePatterns.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-6">
      <h2 className="text-xl font-semibold mb-4 text-purple-800 dark:text-purple-300 flex items-center">
        <Heart className="w-5 h-5 mr-2 text-pink-500" />
        Favorite Patterns
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favoritePatterns.map((pattern) => (
          <div
            key={pattern.id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedPattern.id === pattern.id
                ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900 transform scale-[1.02] shadow-lg'
                : 'bg-white dark:bg-gray-800 hover:shadow-md hover:-translate-y-1'
            } rounded-lg p-4 shadow-md`}
            onClick={() => onSelectPattern(pattern)}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-purple-900 dark:text-purple-300">{pattern.name}</h3>
              <button
                onClick={(e) => toggleFavorite(pattern.id, e)}
                className="text-yellow-500 hover:text-yellow-600 dark:hover:text-yellow-400"
                aria-label={favorites.includes(pattern.id) ? "Remove from favorites" : "Add to favorites"}
              >
                {favorites.includes(pattern.id) ? (
                  <Star className="w-4 h-4 fill-current" />
                ) : (
                  <StarOff className="w-4 h-4" />
                )}
              </button>
            </div>
            
            {selectedPattern.id === pattern.id && (
              <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                Current
              </span>
            )}
            
            <div className="mt-2 flex flex-wrap gap-1">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900 text-xs text-purple-800 dark:text-purple-300">
                In: {pattern.inhale}s
              </span>
              {pattern.hold1 > 0 && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900 text-xs text-indigo-800 dark:text-indigo-300">
                  Hold: {pattern.hold1}s
                </span>
              )}
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900 text-xs text-blue-800 dark:text-blue-300">
                Out: {pattern.exhale}s
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritePatterns;