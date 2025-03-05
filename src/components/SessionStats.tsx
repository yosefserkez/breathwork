import React from 'react';
import { Clock, Activity, BarChart } from 'lucide-react';

interface SessionStatsProps {
  isActive: boolean;
  totalSessionTime: number;
  elapsedTime: number;
  currentCycle: number;
  totalCycles: number;
  compact?: boolean;
}

const SessionStats: React.FC<SessionStatsProps> = ({
  isActive,
  totalSessionTime,
  elapsedTime,
  currentCycle,
  totalCycles,
  compact = false,
}) => {
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate remaining time
  const remainingTime = Math.max(0, totalSessionTime - elapsedTime);

  // Calculate completion percentage
  const completionPercentage = isActive 
    ? Math.min(100, Math.round((elapsedTime / totalSessionTime) * 100)) 
    : 0;

  if (compact) {
    return (
      <div className="bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-80 backdrop-blur-sm rounded-lg p-2 shadow-md w-48">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <Clock className="w-3 h-3 text-purple-500 dark:text-purple-400 mr-1" />
            <span className="text-xs text-gray-700 dark:text-gray-300">Remaining</span>
          </div>
          <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
            {formatTime(remainingTime)}
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <BarChart className="w-3 h-3 text-purple-500 dark:text-purple-400 mr-1" />
            <span className="text-xs text-gray-700 dark:text-gray-300">Completion</span>
          </div>
          <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
            {completionPercentage}%
          </span>
        </div>
        
        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-30 backdrop-blur-sm rounded-xl p-5 shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-purple-800 dark:text-purple-300">Session Stats</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center mb-2">
            <Clock className="w-5 h-5 text-purple-500 dark:text-purple-400 mr-2" />
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Remaining</h3>
          </div>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {formatTime(remainingTime)}
          </p>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center mb-2">
            <Activity className="w-5 h-5 text-purple-500 dark:text-purple-400 mr-2" />
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Cycle Progress</h3>
          </div>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {currentCycle}/{totalCycles}
          </p>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center mb-2">
            <BarChart className="w-5 h-5 text-purple-500 dark:text-purple-400 mr-2" />
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Completion</h3>
          </div>
          <div className="flex items-center">
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300 mr-2">
              {completionPercentage}%
            </p>
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionStats;