import React, { useState } from 'react';
import { BreathPattern } from '../types';
import { X } from 'lucide-react';

interface CustomPatternModalProps {
  pattern: BreathPattern;
  onSave: (pattern: BreathPattern) => void;
  onCancel: () => void;
}

const CustomPatternModal: React.FC<CustomPatternModalProps> = ({
  pattern,
  onSave,
  onCancel,
}) => {
  const [customPattern, setCustomPattern] = useState<BreathPattern>({
    ...pattern,
    id: 'custom',
    name: 'Custom Pattern',
  });

  const handleInputChange = (field: keyof BreathPattern, value: number) => {
    setCustomPattern({
      ...customPattern,
      [field]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(customPattern);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-2xl font-bold text-purple-800 mb-6">Customize Breathing Pattern</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Inhale duration */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="inhale" className="text-sm font-medium text-gray-700">
                Inhale Duration (seconds)
              </label>
              <span className="text-sm text-purple-600 font-medium">{customPattern.inhale}s</span>
            </div>
            <input
              type="range"
              id="inhale"
              min="1"
              max="10"
              step="0.5"
              value={customPattern.inhale}
              onChange={(e) => handleInputChange('inhale', parseFloat(e.target.value))}
              className="custom-slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1s</span>
              <span>5s</span>
              <span>10s</span>
            </div>
          </div>
          
          {/* Hold after inhale */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="hold1" className="text-sm font-medium text-gray-700">
                Hold After Inhale (seconds)
              </label>
              <span className="text-sm text-purple-600 font-medium">{customPattern.hold1}s</span>
            </div>
            <input
              type="range"
              id="hold1"
              min="0"
              max="15"
              step="0.5"
              value={customPattern.hold1}
              onChange={(e) => handleInputChange('hold1', parseFloat(e.target.value))}
              className="custom-slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0s</span>
              <span>7.5s</span>
              <span>15s</span>
            </div>
          </div>
          
          {/* Exhale duration */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="exhale" className="text-sm font-medium text-gray-700">
                Exhale Duration (seconds)
              </label>
              <span className="text-sm text-purple-600 font-medium">{customPattern.exhale}s</span>
            </div>
            <input
              type="range"
              id="exhale"
              min="1"
              max="15"
              step="0.5"
              value={customPattern.exhale}
              onChange={(e) => handleInputChange('exhale', parseFloat(e.target.value))}
              className="custom-slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1s</span>
              <span>8s</span>
              <span>15s</span>
            </div>
          </div>
          
          {/* Hold after exhale */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="hold2" className="text-sm font-medium text-gray-700">
                Hold After Exhale (seconds)
              </label>
              <span className="text-sm text-purple-600 font-medium">{customPattern.hold2}s</span>
            </div>
            <input
              type="range"
              id="hold2"
              min="0"
              max="10"
              step="0.5"
              value={customPattern.hold2}
              onChange={(e) => handleInputChange('hold2', parseFloat(e.target.value))}
              className="custom-slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0s</span>
              <span>5s</span>
              <span>10s</span>
            </div>
          </div>
          
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn btn-primary"
            >
              Save Pattern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomPatternModal;