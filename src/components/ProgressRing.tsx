import React, { useEffect, useRef, useState } from 'react';

interface ProgressRingProps {
  radius: number;
  stroke: number;
  progress: number;
  phaseColor?: string;
  currentCycle?: number;
  totalCycles?: number;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  radius,
  stroke,
  progress,
  phaseColor = 'rgba(139, 92, 246, 0.8)', // Not used anymore, keeping for compatibility
  currentCycle = 1,
  totalCycles = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(progress);
  const animationRef = useRef<number | null>(null);
  const [displayProgress, setDisplayProgress] = useState(progress);
  
  // Linear tracking of progress with gentle smoothing
  useEffect(() => {
    // Update the reference immediately
    progressRef.current = progress;
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // Animation function for smooth progress updates
    const animateProgress = () => {
      // Calculate the difference between target and current
      const diff = progressRef.current - displayProgress;
      
      // If we're close enough, just set to final value
      if (Math.abs(diff) < 0.2) {
        setDisplayProgress(progressRef.current);
        return;
      }
      
      // Otherwise, move linearly toward target with a small smoothing factor
      const step = diff * 0.2; // Linear movement with slight smoothing
      setDisplayProgress(prev => prev + step);
      
      // Continue animation
      animationRef.current = requestAnimationFrame(animateProgress);
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animateProgress);
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [progress]);
  
  // Draw the progress ring
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate dimensions
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = Math.min(centerX, centerY) - stroke / 2;
    
    // Ensure the context is reset
    ctx.setLineDash([]);
    ctx.lineWidth = stroke;
    
    // Create subtle glow effect
    ctx.shadowColor = 'rgba(170, 150, 230, 0.2)';
    ctx.shadowBlur = 5;
    
    // Draw full background circle with very low opacity
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(170, 150, 230, 0.15)';
    ctx.stroke();
    
    // Draw progress arc if there is progress
    if (displayProgress > 0) {
      const startAngle = -Math.PI / 2; // Start at top (12 o'clock)
      const endAngle = startAngle + (2 * Math.PI * displayProgress / 100);
      
      // Light subtle glow for the progress arc
      ctx.shadowColor = 'rgba(170, 150, 230, 0.3)';
      ctx.shadowBlur = 6;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
      ctx.strokeStyle = 'rgba(170, 150, 230, 0.4)'; // Light consistent lavender
      ctx.lineCap = 'round';
      ctx.stroke();
    }
    
    // Reset shadow for future drawings
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }, [displayProgress, stroke]);
  
  // Handle canvas sizing and resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      // Get container dimensions
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;
      
      // Account for device pixel ratio for crisp rendering
      const dpr = window.devicePixelRatio || 1;
      
      // Set canvas size to match container
      canvas.width = containerWidth * dpr;
      canvas.height = containerHeight * dpr;
      
      // Set display size
      canvas.style.width = `${containerWidth}px`;
      canvas.style.height = `${containerHeight}px`;
      
      // Scale the context
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        
        // Draw immediately after resize to prevent flicker
        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;
        const outerRadius = Math.min(centerX, centerY) - stroke / 2;
        
        // Subtle glow
        ctx.shadowColor = 'rgba(170, 150, 230, 0.2)';
        ctx.shadowBlur = 5;
        
        // Draw background circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(170, 150, 230, 0.15)';
        ctx.lineWidth = stroke;
        ctx.stroke();
        
        // Draw progress arc if there is progress
        if (displayProgress > 0) {
          const startAngle = -Math.PI / 2;
          const endAngle = startAngle + (2 * Math.PI * displayProgress / 100);
          
          // Light subtle glow for the progress arc
          ctx.shadowColor = 'rgba(170, 150, 230, 0.3)';
          ctx.shadowBlur = 6;
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
          ctx.strokeStyle = 'rgba(170, 150, 230, 0.4)'; // Light consistent lavender
          ctx.lineCap = 'round';
          ctx.stroke();
        }
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      }
    };
    
    // Initial resize
    resizeCanvas();
    
    // Set up resize observer for responsive resizing
    const observer = new ResizeObserver(resizeCanvas);
    const container = canvas.parentElement;
    if (container) {
      observer.observe(container);
    }
    
    return () => {
      if (container) {
        observer.unobserve(container);
      }
      observer.disconnect();
    };
  }, [displayProgress, stroke]);
  
  return (
    <>
      {(currentCycle && totalCycles && totalCycles > 1) && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-opacity-40 backdrop-filter backdrop-blur-sm bg-white dark:bg-opacity-20 dark:bg-gray-800 px-3 py-0.5 rounded-full text-xs font-medium text-purple-600 dark:text-purple-200 shadow-sm border border-purple-100 dark:border-purple-800 transition-all duration-300">
          <span className="relative">
            <span className="mr-1 text-purple-400 dark:text-purple-300">{currentCycle}</span>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <span className="ml-1 text-gray-400 dark:text-gray-500">{totalCycles}</span>
          </span>
        </div>
      )}
      <div className="absolute inset-0 pointer-events-none">
        <canvas 
          ref={canvasRef}
          className="progress-ring w-full h-full"
        />
      </div>
    </>
  );
};

export default ProgressRing;