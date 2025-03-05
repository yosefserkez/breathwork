import React, { useState, useEffect } from 'react';
import { breathPatterns } from './data/breathPatterns';
import { BreathPattern, BreathSettings } from './types';
import { useBreathSession } from './hooks/useBreathSession';
import { useUserPresets } from './hooks/useUserPresets';

// Components
import Header from './components/Header';
import BreathAnimation from './components/BreathAnimation';
import ProgressRing from './components/ProgressRing';
import PatternSelector from './components/PatternSelector';
import SettingsPanel from './components/SettingsPanel';
import SessionControls from './components/SessionControls';
import CustomPatternModal from './components/CustomPatternModal';
import SavePresetModal from './components/SavePresetModal';
import InfoModal from './components/InfoModal';
import SessionStats from './components/SessionStats';
import FavoritePatterns from './components/FavoritePatterns';
import CurrentPatternDisplay from './components/CurrentPatternDisplay';

function App() {
  // Get user presets
  const { userPresets, savePreset } = useUserPresets();
  
  // Combine default patterns with user presets
  const allPatterns = [...breathPatterns];
  
  // State for settings and UI
  const [showPatternSelector, setShowPatternSelector] = useState(true);
  const [showCustomPatternModal, setShowCustomPatternModal] = useState(false);
  const [showSavePresetModal, setShowSavePresetModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  
  // Initialize settings from localStorage if available
  const [settings, setSettings] = useState<BreathSettings>(() => {
    const defaultSettings: BreathSettings = {
      pattern: breathPatterns[0], // Default to first pattern
      cycles: 5,
      guidanceVolume: 0.7,
      backgroundVolume: 1,
      useVoiceGuidance: false,
      useVisualCues: true,
      useAudioCues: true,
    };
    
    // Try to load saved settings from localStorage
    const savedSettingsString = localStorage.getItem('breathflow-settings');
    
    if (savedSettingsString) {
      try {
        const savedSettings = JSON.parse(savedSettingsString);
        
        // If there's a pattern in saved settings, find the matching pattern or use the saved one
        if (savedSettings.pattern) {
          const matchingPattern = breathPatterns.find(p => p.id === savedSettings.pattern.id);
          savedSettings.pattern = matchingPattern || savedSettings.pattern;
        }
        
        return {...defaultSettings, ...savedSettings};
      } catch (e) {
        console.error('Error parsing saved settings:', e);
        return defaultSettings;
      }
    }
    
    return defaultSettings;
  });

  // Get session controls from hook
  const {
    isActive,
    isPaused,
    currentPhase,
    currentCycle,
    timeRemaining,
    totalSessionTime,
    elapsedTime,
    progress,
    startSession,
    pauseSession,
    resetSession,
  } = useBreathSession(settings);

  // Get the total time for the current phase
  const getTotalPhaseTime = () => {
    return settings.pattern[currentPhase] || 0;
  };

  // Get color based on current phase
  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'rgba(139, 92, 246, 0.8)'; // Purple
      case 'hold1':
        return 'rgba(79, 70, 229, 0.8)'; // Indigo
      case 'exhale':
        return 'rgba(59, 130, 246, 0.8)'; // Blue
      case 'hold2':
        return 'rgba(124, 58, 237, 0.8)'; // Violet
      default:
        return 'rgba(139, 92, 246, 0.8)'; // Default purple
    }
  };

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('breathflow-settings', JSON.stringify(settings));
  }, [settings]);

  // Handle settings updates
  const handleUpdateSettings = (updatedSettings: Partial<BreathSettings>) => {
    setSettings({ ...settings, ...updatedSettings });
    // The effect above will save to localStorage
  };

  // Handle pattern selection
  const handleSelectPattern = (pattern: BreathPattern) => {
    setSettings({ ...settings, pattern });
    // Save selected pattern to localStorage
    localStorage.setItem('breathflow-selected-pattern', JSON.stringify(pattern));
  };

  // Handle custom pattern
  const handleCustomizePattern = (pattern: BreathPattern) => {
    setShowCustomPatternModal(true);
  };

  // Save custom pattern
  const handleSaveCustomPattern = (pattern: BreathPattern) => {
    setSettings({ ...settings, pattern });
    setShowCustomPatternModal(false);
  };
  
  // Open save preset modal
  const handleOpenSavePresetModal = () => {
    setShowSavePresetModal(true);
  };
  
  // Save preset
  const handleSavePreset = (pattern: BreathPattern) => {
    const savedPattern = savePreset(pattern);
    setSettings({ ...settings, pattern: savedPattern });
    setShowSavePresetModal(false);
  };

  // Toggle settings/pattern selector view
  const toggleSettingsView = () => {
    if (isActive && !isPaused) return;
    setShowPatternSelector(!showPatternSelector);
  };

  // Reset session when settings change
  useEffect(() => {
    if (isActive) {
      resetSession();
    }
  }, [settings.pattern]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onInfoClick={() => setShowInfoModal(true)} />
      
      <main className="flex-1 container mx-auto px-4 py-6 max-w-5xl">
        
        <div className="breathwork-container rounded-2xl p-6 mb-8 relative overflow-hidden">
          {/* Session stats in top right */}
          {/* {isActive && (
            <div className="absolute top-4 right-4 z-10">
              <SessionStats
                isActive={isActive}
                totalSessionTime={totalSessionTime}
                elapsedTime={elapsedTime}
                currentCycle={currentCycle}
                totalCycles={settings.cycles}
                compact={true}
              />
            </div>
          )} */}
          
          {/* Cycle progress indicator around the breath animation */}
          <div className="relative flex items-center justify-center w-full">
            <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-full flex items-center justify-center">
              <ProgressRing
                radius={144}
                stroke={4}
                progress={progress}
                currentCycle={currentCycle}
                totalCycles={settings.cycles}
                phaseColor={getPhaseColor()}
              />
              
              {/* Breath animation */}
              <BreathAnimation
                phase={currentPhase}
                timeRemaining={timeRemaining}
                totalPhaseTime={getTotalPhaseTime()}
                isActive={isActive}
                isPaused={isPaused}
              />
            </div>
          </div>
          
          {/* Session controls */}
          <SessionControls
            isActive={isActive}
            isPaused={isPaused}
            onStart={startSession}
            onPause={pauseSession}
            onReset={resetSession}
            onOpenSettings={toggleSettingsView}
          />
        </div>
        
          {/* Current Pattern Display */}
        <div className="mb-6">
          <CurrentPatternDisplay pattern={settings.pattern} />
        </div>

        {/* Favorite Patterns */}
        {/* {!isActive && (
          <FavoritePatterns
            patterns={allPatterns}
            selectedPattern={settings.pattern}
            onSelectPattern={handleSelectPattern}
          />
        )} */}

        
        {/* Settings or Pattern Selector */}
        <div className="grid grid-cols-1 gap-6">
          {showPatternSelector ? (
            <PatternSelector
              patterns={allPatterns}
              selectedPattern={settings.pattern}
              onSelectPattern={handleSelectPattern}
            />
          ) : (
            <div className="flex flex-col gap-4 items-center justify-center">
              <button
                onClick={() => setShowPatternSelector(true)}
                className="btn btn-secondary dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900"
              >
                Show Breathing Patterns
              </button>
                        <SettingsPanel
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onCustomizePattern={handleCustomizePattern}
            onSavePreset={handleOpenSavePresetModal}
          />
            </div>
          )}
          
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-4 px-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>BreathFlow &copy; 2025 - Guided breathwork for wellbeing</p>
      </footer>
      
      {/* Modals */}
      {showCustomPatternModal && (
        <CustomPatternModal
          pattern={settings.pattern}
          onSave={handleSaveCustomPattern}
          onCancel={() => setShowCustomPatternModal(false)}
        />
      )}
      
      {showSavePresetModal && (
        <SavePresetModal
          pattern={settings.pattern}
          onSave={handleSavePreset}
          onCancel={() => setShowSavePresetModal(false)}
        />
      )}
      
      {showInfoModal && (
        <InfoModal onClose={() => setShowInfoModal(false)} />
      )}
    </div>
  );
}

export default App;