import React from 'react';
import { X, Wind, Heart, Brain, Zap, Info } from 'lucide-react';

interface InfoModalProps {
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-center mb-6">
          <Wind className="w-8 h-8 text-purple-600 mr-3" />
          <h2 className="text-2xl font-bold text-purple-800">About BreathFlow</h2>
        </div>
        
        <div className="space-y-6">
          <p className="text-gray-700">
            BreathFlow is a guided breathwork application designed to help you reduce stress, 
            improve focus, and enhance your overall wellbeing through intentional breathing practices.
          </p>
          
          <div>
            <h3 className="text-lg font-semibold text-purple-700 mb-2 flex items-center">
              <Heart className="w-5 h-5 mr-2" /> Benefits of Breathwork
            </h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Reduces stress and anxiety</li>
              <li>Improves focus and mental clarity</li>
              <li>Enhances sleep quality</li>
              <li>Boosts energy levels</li>
              <li>Strengthens immune function</li>
              <li>Supports emotional regulation</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-purple-700 mb-2 flex items-center">
              <Brain className="w-5 h-5 mr-2" /> How to Use BreathFlow
            </h3>
            <ol className="list-decimal pl-6 text-gray-700 space-y-2">
              <li>Select a breathing pattern that matches your current needs</li>
              <li>Adjust the number of cycles and audio settings</li>
              <li>Find a comfortable position, sitting or lying down</li>
              <li>Press Start and follow the visual and audio guidance</li>
              <li>Focus on your breath and the sensations in your body</li>
              <li>Complete the session and notice how you feel</li>
            </ol>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-purple-700 mb-2 flex items-center">
              <Zap className="w-5 h-5 mr-2" /> Breathing Patterns
            </h3>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Box Breathing (4-4-4-4):</strong> Equal duration for all phases. Used by Navy SEALs 
                to promote calm and mental clarity.
              </p>
              <p>
                <strong>4-7-8 Breathing:</strong> Developed by Dr. Andrew Weil, this pattern helps calm 
                the nervous system and is excellent for anxiety and sleep.
              </p>
              <p>
                <strong>Coherent Breathing:</strong> Breathing at a rate of about 5-6 breaths per minute 
                to balance the autonomic nervous system and improve heart rate variability.
              </p>
              <p>
                <strong>Wim Hof Method:</strong> Energizing breath technique to boost immunity and focus, 
                developed by "The Iceman" Wim Hof.
              </p>
              <p>
                <strong>Relaxing Breath:</strong> Features a longer exhale to activate the parasympathetic 
                nervous system for deep relaxation.
              </p>
              <p>
                <strong>Alternate Nostril Breathing:</strong> Traditional yogic technique that balances the 
                hemispheres of the brain and promotes calm alertness.
              </p>
              <p>
                <strong>Ujjayi Breath:</strong> The "ocean breath" used in yoga practice to build internal 
                heat and maintain focus during movement.
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-purple-700 mb-2 flex items-center">
              <Info className="w-5 h-5 mr-2" /> Scientific Background
            </h3>
            <p className="text-gray-700 mb-2">
              Breathwork has been studied extensively for its effects on the autonomic nervous system, which controls our stress response. 
              Controlled breathing practices can:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Activate the parasympathetic "rest and digest" system</li>
              <li>Reduce cortisol levels and other stress hormones</li>
              <li>Improve heart rate variability (HRV), a key indicator of health</li>
              <li>Enhance cognitive function and emotional regulation</li>
              <li>Support immune system function</li>
            </ul>
          </div>
          
          <p className="text-sm text-gray-500 pt-4">
            Note: While breathwork is generally safe for most people, if you have any medical conditions 
            such as respiratory disorders, cardiovascular issues, or are pregnant, please consult with a 
            healthcare professional before practicing intensive breathwork techniques.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;