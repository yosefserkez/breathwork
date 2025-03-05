import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { BreathPattern } from '../types';

interface SavePresetModalProps {
  pattern: BreathPattern;
  onSave: (pattern: BreathPattern) => void;
  onCancel: () => void;
}

const SavePresetModal: React.FC<SavePresetModalProps> = ({
  pattern,
  onSave,
  onCancel,
}) => {
  const [presetName, setPresetName] = useState('My Custom Preset');
  const [presetDescription, setPresetDescription] = useState('A personalized breathing pattern.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a unique ID
    const id = `preset-${Date.now()}`;
    
    const savedPattern: BreathPattern = {
      ...pattern,
      id,
      name: presetName,
      description: presetDescription,
    };
    
    onSave(savedPattern);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-center mb-6">
          <Save className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
          <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-300">Save as Preset</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="presetName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Preset Name
            </label>
            <input
              type="text"
              id="presetName"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          <div>
            <label htmlFor="presetDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="presetDescription"
              value={presetDescription}
              onChange={(e) => setPresetDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 btn btn-secondary dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn btn-primary"
            >
              Save Preset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SavePresetModal;