import React from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

interface SessionControlsProps {
  isActive: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onOpenSettings: () => void;
}

const SessionControls: React.FC<SessionControlsProps> = ({
  isActive,
  isPaused,
  onStart,
  onPause,
  onReset,
  onOpenSettings,
}) => {
  return (
    <div className="flex justify-center items-center space-x-4 mt-6">
      {!isActive || isPaused ? (
        <button
          onClick={onStart}
          className="btn btn-primary flex items-center justify-center space-x-2 px-6"
          aria-label="Start session"
        >
          <Play className="w-5 h-5" />
          <span>{isPaused ? 'Resume' : 'Start'}</span>
        </button>
      ) : (
        <button
          onClick={onPause}
          className="btn btn-primary flex items-center justify-center space-x-2 px-6"
          aria-label="Pause session"
        >
          <Pause className="w-5 h-5" />
          <span>Pause</span>
        </button>
      )}
      
      <button
        onClick={onReset}
        className="btn btn-secondary flex items-center justify-center"
        aria-label="Reset session"
        disabled={!isActive}
      >
        <RotateCcw className="w-5 h-5" />
      </button>
      
      <button
        onClick={onOpenSettings}
        className="btn btn-secondary flex items-center justify-center"
        aria-label="Open settings"
        disabled={isActive && !isPaused}
      >
        <Settings className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SessionControls;