import { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { BreathPattern, BreathPhase, BreathSettings } from '../types';

export const useBreathSession = (settings: BreathSettings) => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathPhase>('inhale');
  const [currentCycle, setCurrentCycle] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalSessionTime, setTotalSessionTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // Refs for precise timing
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);
  const phaseStartTimeRef = useRef<number>(0);
  const currentPhaseRef = useRef<BreathPhase>('inhale');
  const currentCycleRef = useRef<number>(1);
  
  // Audio refs
  const inhaleSound = useRef<Howl | null>(null);
  const exhaleSound = useRef<Howl | null>(null);
  const holdSound = useRef<Howl | null>(null);
  const completeSound = useRef<Howl | null>(null);
  const backgroundSound = useRef<Howl | null>(null);
  
  // Initialize sounds
  useEffect(() => {
    // Initialize sounds if they don't exist
    if (!inhaleSound.current) {
      inhaleSound.current = new Howl({
        src: ['/audio/inhale.mp3'],
        volume: settings.guidanceVolume,
      });
    }
    
    if (!exhaleSound.current) {
      exhaleSound.current = new Howl({
        src: ['/audio/exhale.mp3'],
        volume: settings.guidanceVolume,
      });
    }
    
    if (!holdSound.current) {
      holdSound.current = new Howl({
        src: ['/audio/hold.mp3'],
        volume: settings.guidanceVolume,
      });
    }
    
    if (!completeSound.current) {
      completeSound.current = new Howl({
        src: ['/audio/complete.mp3'],
        volume: settings.guidanceVolume,
      });
    }
    
    if (!backgroundSound.current) {
      try {
        backgroundSound.current = new Howl({
          src: ['/audio/background.mp3', '/audio/background-2.mp3'],
          volume: Math.max(0.1, settings.backgroundVolume),
          loop: true,
          preload: true,
          format: ['mp3', 'wav'],
          html5: true
        });
        
        backgroundSound.current.once('loaderror', (id, err) => {
          console.error("Error loading background sound:", err);
          backgroundSound.current = new Howl({
            src: ['https://assets.mixkit.co/sfx/preview/mixkit-calm-forest-stream-ambience-1197.mp3'],
            volume: Math.max(0.1, settings.backgroundVolume),
            loop: true,
            html5: true
          });
          
          if (isActive && !isPaused) {
            backgroundSound.current.play();
          }
        });
      } catch (e) {
        console.error("Failed to initialize background sound:", e);
      }
    }
    
    return () => {
      inhaleSound.current?.unload();
      exhaleSound.current?.unload();
      holdSound.current?.unload();
      completeSound.current?.unload();
      backgroundSound.current?.unload();
    };
  }, []); // Empty dependency array means this runs only once
  
  // Calculate total session time
  useEffect(() => {
    const { inhale, hold1, exhale, hold2 } = settings.pattern;
    const cycleTime = inhale + hold1 + exhale + hold2;
    setTotalSessionTime(cycleTime * settings.cycles);
  }, [settings.pattern, settings.cycles]);
  
  // Play sound based on current phase
  const playPhaseSound = (phase: BreathPhase) => {
    if (!settings.useAudioCues) return;
    
    switch (phase) {
      case 'inhale':
        inhaleSound.current?.play();
        break;
      case 'exhale':
        exhaleSound.current?.play();
        break;
      case 'hold1':
      case 'hold2':
        if (settings.pattern[phase] > 0) {
          holdSound.current?.play();
        }
        break;
    }
  };
  
  // Get next phase in the cycle
  const getNextPhase = (currentPhase: BreathPhase): BreathPhase => {
    switch (currentPhase) {
      case 'inhale':
        return settings.pattern.hold1 > 0 ? 'hold1' : 'exhale';
      case 'hold1':
        return 'exhale';
      case 'exhale':
        return settings.pattern.hold2 > 0 ? 'hold2' : 'inhale';
      case 'hold2':
        return 'inhale';
      default:
        return 'inhale';
    }
  };
  
  // Advance to the next phase
  const advanceToNextPhase = () => {
    const nextPhase = getNextPhase(currentPhaseRef.current);
    
    // If moving to inhale from the last phase, we're starting a new cycle
    const isCompletingCycle = 
      (currentPhaseRef.current === 'hold2' && nextPhase === 'inhale') || 
      (currentPhaseRef.current === 'exhale' && nextPhase === 'inhale' && settings.pattern.hold2 === 0);
    
    if (isCompletingCycle) {
      currentCycleRef.current += 1;
      
      // Force state update to trigger re-render
      setCurrentCycle((prev: number) => {
        console.log('Updating cycle from', prev, 'to', currentCycleRef.current);
        return currentCycleRef.current;
      });
      
      // Check if we've completed all cycles
      if (currentCycleRef.current > settings.cycles) {
        completeSession();
        return;
      }
    }
    
    // If the current phase has a duration of 0, skip to the next phase
    if (settings.pattern[nextPhase] === 0) {
      currentPhaseRef.current = getNextPhase(nextPhase);
    } else {
      currentPhaseRef.current = nextPhase;
    }
    
    setCurrentPhase(currentPhaseRef.current);
    phaseStartTimeRef.current = Date.now();
    playPhaseSound(currentPhaseRef.current);
    
    // Set time remaining for the new phase
    setTimeRemaining(settings.pattern[currentPhaseRef.current as keyof BreathPattern]);
  };
  
  // Start the session
  const startSession = () => {
    if (isActive && !isPaused) return;
    
    if (isPaused) {
      setIsPaused(false);
      startTimeRef.current = Date.now() - pausedTimeRef.current;
      lastUpdateTimeRef.current = Date.now();
    } else {
      setIsActive(true);
      currentCycleRef.current = 1;
      setCurrentCycle(1);
      currentPhaseRef.current = 'inhale';
      setCurrentPhase('inhale');
      setTimeRemaining(settings.pattern.inhale);
      setElapsedTime(0);
      setProgress(0);
      
      startTimeRef.current = Date.now();
      phaseStartTimeRef.current = Date.now();
      lastUpdateTimeRef.current = Date.now();
      pausedTimeRef.current = 0;
      
      // Play initial sound
      playPhaseSound('inhale');
      
      // Start background sound
      if (settings.backgroundVolume > 0) {
        console.log("Attempting to play background sound with volume:", settings.backgroundVolume);
        backgroundSound.current?.play();
        
        // Add a callback to verify if sound is playing
        backgroundSound.current?.once('play', () => {
          console.log("Background sound is now playing");
        });
      }
    }
    
    // Start the timer with a higher frequency for smoother updates
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      if (startTimeRef.current === null) return;
      
      const now = Date.now();
      const deltaTime = (now - lastUpdateTimeRef.current) / 1000;
      lastUpdateTimeRef.current = now;
      
      // Calculate total elapsed time
      const totalElapsed = (now - startTimeRef.current) / 1000;
      setElapsedTime(totalElapsed);
      
      // Calculate overall progress
      const progressPercent = Math.min((totalElapsed / totalSessionTime) * 100, 100);
      setProgress(progressPercent);
      
      // Calculate time elapsed in current phase
      const phaseElapsed = (now - phaseStartTimeRef.current) / 1000;
      const phaseDuration = settings.pattern[currentPhaseRef.current as keyof BreathPattern];
      const phaseRemaining = Math.max(0, phaseDuration - phaseElapsed);
      
      setTimeRemaining(phaseRemaining);
      
      // Check if it's time to advance to the next phase
      if (phaseElapsed >= phaseDuration) {
        advanceToNextPhase();
      }
      
    }, 33); // ~30fps for smooth animation
  };
  
  // Pause the session
  const pauseSession = () => {
    if (!isActive || isPaused) return;
    
    setIsPaused(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (startTimeRef.current) {
      pausedTimeRef.current = Date.now() - startTimeRef.current;
    }
    
    // Pause background sound
    backgroundSound.current?.pause();
  };
  
  // Reset the session
  const resetSession = () => {
    setIsActive(false);
    setIsPaused(false);
    currentPhaseRef.current = 'inhale';
    setCurrentPhase('inhale');
    currentCycleRef.current = 1;
    setCurrentCycle(1);
    setTimeRemaining(settings.pattern.inhale);
    setElapsedTime(0);
    setProgress(0);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
    phaseStartTimeRef.current = 0;
    lastUpdateTimeRef.current = 0;
    
    // Stop background sound
    backgroundSound.current?.stop();
  };
  
  // Complete the session
  const completeSession = () => {
    resetSession();
    completeSound.current?.play();
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      backgroundSound.current?.stop();
    };
  }, []);
  
  // Update volumes when settings change
  useEffect(() => {
    // Update volumes without recreating sounds
    if (inhaleSound.current) {
      inhaleSound.current.volume(settings.guidanceVolume);
    }
    
    if (exhaleSound.current) {
      exhaleSound.current.volume(settings.guidanceVolume);
    }
    
    if (holdSound.current) {
      holdSound.current.volume(settings.guidanceVolume);
    }
    
    if (completeSound.current) {
      completeSound.current.volume(settings.guidanceVolume);
    }
    
    if (backgroundSound.current) {
      const newVolume = Math.max(0.1, settings.backgroundVolume);
      backgroundSound.current.volume(newVolume);
      
      // If session is active and not paused, ensure background sound is playing
      if (isActive && !isPaused && settings.backgroundVolume > 0) {
        if (!backgroundSound.current.playing()) {
          console.log("Restarting background sound after volume change");
          backgroundSound.current.play();
        }
      } else if (settings.backgroundVolume <= 0 || !isActive || isPaused) {
        // Stop if volume is turned to 0 or session is not active
        if (backgroundSound.current.playing()) {
          backgroundSound.current.pause();
        }
      }
    }
  }, [settings.guidanceVolume, settings.backgroundVolume, isActive, isPaused]);
  
  return {
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
  };
};