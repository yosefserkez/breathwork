import { useState, useEffect } from 'react';
import { BreathPattern } from '../types';

export const useUserPresets = () => {
  const [userPresets, setUserPresets] = useState<BreathPattern[]>([]);

  // Load user presets from localStorage
  useEffect(() => {
    const savedPresets = localStorage.getItem('breathflow-presets');
    if (savedPresets) {
      try {
        setUserPresets(JSON.parse(savedPresets));
      } catch (error) {
        console.error('Failed to parse saved presets:', error);
        localStorage.removeItem('breathflow-presets');
      }
    }
  }, []);

  // Save a new preset
  const savePreset = (pattern: BreathPattern) => {
    const updatedPresets = [...userPresets, pattern];
    localStorage.setItem('breathflow-presets', JSON.stringify(updatedPresets));
    setUserPresets(updatedPresets);
    return pattern;
  };

  // Delete a preset
  const deletePreset = (patternId: string) => {
    const updatedPresets = userPresets.filter(preset => preset.id !== patternId);
    localStorage.setItem('breathflow-presets', JSON.stringify(updatedPresets));
    setUserPresets(updatedPresets);
  };

  return {
    userPresets,
    savePreset,
    deletePreset
  };
};