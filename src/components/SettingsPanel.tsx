import React from 'react';
import { BreathPattern, BreathSettings } from '../types';
import { Volume2, Volume, VolumeX, Eye, EyeOff, Music, Bell, Save } from 'lucide-react';

interface SettingsPanelProps {
  settings: BreathSettings;
  onUpdateSettings: (settings: Partial<BreathSettings>) => void;
  onCustomizePattern: (pattern: BreathPattern) => void;
  onSavePreset: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onUpdateSettings,
  onCustomizePattern,
  onSavePreset,
}) => {
  const handleCyclesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cycles = parseInt(e.target.value, 10);
    onUpdateSettings({ cycles });
  };

  const handleGuidanceVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const guidanceVolume = parseFloat(e.target.value);
    onUpdateSettings({ guidanceVolume });
  };

  const handleBackgroundVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const backgroundVolume = parseFloat(e.target.value);
    onUpdateSettings({ backgroundVolume });
  };

  const toggleVoiceGuidance = () => {
    onUpdateSettings({ useVoiceGuidance: !settings.useVoiceGuidance });
  };

  const toggleVisualCues = () => {
    onUpdateSettings({ useVisualCues: !settings.useVisualCues });
  };

  const toggleAudioCues = () => {
    onUpdateSettings({ useAudioCues: !settings.useAudioCues });
  };

  const handleCustomizePattern = () => {
    if (settings.pattern.id !== 'custom') {
      // Clone the current pattern as custom
      const customPattern: BreathPattern = {
        ...settings.pattern,
        id: 'custom',
        name: 'Custom Pattern',
        description: 'Your personalized breathing pattern.',
      };
      onCustomizePattern(customPattern);
    } else {
      onCustomizePattern(settings.pattern);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-30 backdrop-blur-sm rounded-xl p-5 shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-purple-800 dark:text-purple-300">Session Settings</h2>
      
      <div className="space-y-6">
        {/* Number of cycles */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="cycles" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Number of Cycles
            </label>
            <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">{settings.cycles}</span>
          </div>
          <input
            type="number"
            id="cycles"
            min="1"
            max="1000"
            step="1"
            value={settings.cycles}
            onChange={handleCyclesChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Min: 1</span>
            <span>Max: 1000</span>
          </div>
        </div>
        
        {/* Audio settings */}
        <div>
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Audio Settings</h3>
          
          {/* Guidance volume */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Bell className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                <label htmlFor="guidanceVolume" className="text-sm text-gray-700 dark:text-gray-300">
                  Guidance Volume
                </label>
              </div>
              <button
                onClick={toggleAudioCues}
                className={`btn btn-icon ${
                  settings.useAudioCues ? 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                }`}
                aria-label={settings.useAudioCues ? 'Disable audio cues' : 'Enable audio cues'}
              >
                {settings.useAudioCues ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
            <input
              type="range"
              id="guidanceVolume"
              min="0"
              max="1"
              step="0.1"
              value={settings.guidanceVolume}
              onChange={handleGuidanceVolumeChange}
              disabled={!settings.useAudioCues}
              className={`custom-slider dark:bg-purple-900 ${!settings.useAudioCues ? 'opacity-50' : ''}`}
            />
          </div>
          
          {/* Background volume */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Music className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                <label htmlFor="backgroundVolume" className="text-sm text-gray-700 dark:text-gray-300">
                  Background Volume
                </label>
              </div>
              <Volume className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <input
              type="range"
              id="backgroundVolume"
              min="0"
              max="0.5"
              step="0.05"
              value={settings.backgroundVolume}
              onChange={handleBackgroundVolumeChange}
              className="custom-slider dark:bg-purple-900"
            />
          </div>
        </div>
        
        {/* Visual settings */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Visual Guidance</h3>
            <button
              onClick={toggleVisualCues}
              className={`btn btn-icon ${
                settings.useVisualCues ? 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
              }`}
              aria-label={settings.useVisualCues ? 'Disable visual cues' : 'Enable visual cues'}
            >
              {settings.useVisualCues ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;