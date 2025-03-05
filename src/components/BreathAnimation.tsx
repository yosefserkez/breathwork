import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { BreathPhase } from '../types';

interface BreathAnimationProps {
  phase: BreathPhase;
  timeRemaining: number;
  totalPhaseTime: number;
  isActive: boolean;
  isPaused: boolean;
}

const BreathAnimation: React.FC<BreathAnimationProps> = ({
  phase,
  timeRemaining,
  totalPhaseTime,
  isActive,
  isPaused,
}) => {
  const controls = useAnimation();
  const [prevPhase, setPrevPhase] = useState<BreathPhase>(phase);
  const [phaseProgress, setPhaseProgress] = useState(0);
  
  // Calculate phase progress (0-1)
  useEffect(() => {
    if (totalPhaseTime > 0) {
      const progress = 1 - (timeRemaining / totalPhaseTime);
      setPhaseProgress(Math.max(0, Math.min(1, progress)));
    }
  }, [timeRemaining, totalPhaseTime]);
  
  // Update animation when phase changes
  useEffect(() => {
    if (!isActive) return;
    
    // Set target scale and opacity based on phase
    let targetScale = 1.2;
    let targetOpacity = 0.8;
    let animationDuration = 0;
    
    if (phase === 'inhale') {
      // For inhale, animate from contracted to expanded state
      targetScale = 1.4;
      targetOpacity = 1;
      animationDuration = isPaused ? 0 : totalPhaseTime;
    } 
    else if (phase === 'hold1') {
      // Hold at expanded state - no animation
      targetScale = 1.4;
      targetOpacity = 1;
      animationDuration = 0; // No animation during hold
    }
    else if (phase === 'exhale') {
      // For exhale, animate from expanded to contracted state
      targetScale = 0.9;
      targetOpacity = 0.7;
      animationDuration = isPaused ? 0 : totalPhaseTime;
    }
    else if (phase === 'hold2') {
      // Hold at contracted state - no animation
      targetScale = 0.9;
      targetOpacity = 0.7;
      animationDuration = 0; // No animation during hold
    }
    
    // Animate to the target values
    controls.start({
      scale: targetScale,
      opacity: targetOpacity,
      transition: {
        duration: animationDuration,
        ease: "easeInOut"
      }
    });
    
    // Track phase changes
    if (phase !== prevPhase) {
      setPrevPhase(phase);
    }
  }, [phase, totalPhaseTime, isActive, isPaused, prevPhase, controls]);

  // Get ripple properties
  const getRippleScale = () => {
    if (!isActive) return 1.3;
    
    if (isPaused) {
      return phase === 'inhale' || phase === 'hold1' ? 1.7 : 0.9;
    }
    
    switch (phase) {
      case 'inhale':
        return 0.9 + (0.8 * phaseProgress);
      case 'hold1':
        return 1.7;
      case 'exhale':
        return 1.7 - (0.8 * phaseProgress);
      case 'hold2':
        return 0.9;
      default:
        return 1.3;
    }
  };
  
  const getRippleOpacity = () => {
    if (!isActive) return 0.3;
    
    if (isPaused) {
      return 0.2;
    }
    
    switch (phase) {
      case 'inhale':
        return 0.5 - (0.5 * phaseProgress); // Fade out during inhale
      case 'hold1':
        return 0.2; // Low opacity during hold
      case 'exhale':
        return 0 + (0.5 * phaseProgress); // Fade in during exhale
      case 'hold2':
        return 0.2; // Low opacity during hold
      default:
        return 0.3;
    }
  };

  // Get phase text
  const getPhaseText = () => {
    if (!isActive) return "Ready";
    if (isPaused) return "Paused";
    
    switch (phase) {
      case 'inhale': return "Inhale";
      case 'hold1': return "Hold";
      case 'exhale': return "Exhale";
      case 'hold2': return "Hold";
      default: return "";
    }
  };

  // Get phase color
  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return 'from-purple-400 to-indigo-500';
      case 'hold1':
        return 'from-indigo-400 to-blue-500';
      case 'exhale':
        return 'from-blue-400 to-cyan-500';
      case 'hold2':
        return 'from-violet-400 to-purple-500';
      default:
        return 'from-purple-400 to-indigo-500';
    }
  };

  return (
    <div className="relative flex items-center justify-center w-full h-64 md:h-80">
      {/* Background ripple effect */}
      {isActive ? (
        <motion.div
          className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full bg-purple-400 bg-opacity-20 blur-md"
          animate={{
            scale: getRippleScale(),
            opacity: getRippleOpacity(),
          }}
          transition={{
            duration: (phase === 'hold1' || phase === 'hold2' || isPaused) ? 0 : 0.3,
            ease: "easeInOut"
          }}
        />
      ) : (
        <motion.div
          className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full bg-purple-400 bg-opacity-20 blur-md"
          animate={{
            scale: [1, 1.3],
            opacity: [0.3, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
      )}
      
      {/* Main breathing circle */}
      {isActive ? (
        <motion.div
          className={`absolute w-40 h-40 md:w-56 md:h-56 rounded-full bg-gradient-to-br ${getPhaseColor()} shadow-lg breath-animation`}
          animate={controls}
          initial={{ scale: 1.2, opacity: 0.8 }}
        />
      ) : (
        <motion.div
          className="absolute w-40 h-40 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg breath-animation"
          animate={{
            scale: [1.1, 1.3],
            opacity: [0.7, 0.9],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      )}
      
      {/* Inner circle with text */}
      <div className="absolute flex items-center justify-center w-40 h-40 md:w-56 md:h-56">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white breath-text">
            {getPhaseText()}
          </h2>
          {isActive && !isPaused && (
            <p className="text-xl md:text-2xl font-medium text-white breath-text">
              {Math.ceil(timeRemaining)}
            </p>
          )}
        </div>
      </div>
      
      {/* Floating particles for visual effect */}
      <motion.div
        className="absolute w-3 h-3 rounded-full bg-purple-300 bg-opacity-70"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "loop",
        }}
        style={{ top: '30%', left: '30%' }}
      />
      
      <motion.div
        className="absolute w-2 h-2 rounded-full bg-indigo-300 bg-opacity-70"
        animate={{
          y: [0, 15, 0],
          x: [0, -8, 0],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          repeatType: "loop",
          delay: 0.5,
        }}
        style={{ bottom: '35%', right: '35%' }}
      />
      
      <motion.div
        className="absolute w-4 h-4 rounded-full bg-blue-300 bg-opacity-60"
        animate={{
          y: [0, -15, 0],
          x: [0, -10, 0],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "loop",
          delay: 1,
        }}
        style={{ top: '40%', right: '30%' }}
      />
    </div>
  );
};

export default BreathAnimation;