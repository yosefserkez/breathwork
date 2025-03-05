import React from 'react';
import { BreathPattern } from '../types';
import { Wind, Zap, Moon, Clock, Sparkles, Settings } from 'lucide-react';

interface CurrentPatternDisplayProps {
  pattern: BreathPattern;
  currentCycle?: number;
  totalCycles?: number;
}

const CurrentPatternDisplay: React.FC<CurrentPatternDisplayProps> = ({ 
  pattern, 
  currentCycle, 
  totalCycles 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md">
      <div className="flex items-start">
       
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-300">
              {pattern.name}
            </h2>
            
            {currentCycle !== undefined && totalCycles !== undefined && (
              <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                Cycle {currentCycle} of {totalCycles}
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300">
              {pattern.category}
            </span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            {pattern.description}
          </p>
          
          {pattern.instructions && (
            <div className="mb-4">
              <p className="font-medium mb-1 text-purple-900 dark:text-purple-200">Instructions:</p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">{pattern.instructions}</p>
            </div>
          )}
          
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
          
          {pattern.benefits && pattern.benefits.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {pattern.benefits.map((benefit, index) => (
                <span 
                  key={index}
                  className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300"
                >
                  {benefit}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentPatternDisplay;