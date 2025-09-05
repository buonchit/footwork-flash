import React, { useState, useEffect, useCallback, useRef } from 'react';
import Court, { POSITIONS } from './Court';
import TrainingControls, { TRAINING_MODES } from './TrainingControls';
import { useToast } from '../hooks/use-toast';

// Mode position mappings
const MODE_POSITIONS: Record<string, number[]> = {
  'random1-8': [1, 2, 3, 4, 5, 6, 7, 8],
  'random1-3-5-7': [1, 3, 5, 7],
  'random2-4-6-8': [2, 4, 6, 8],
  'random1-2-3': [1, 2, 3],
  'random4-5-6': [4, 5, 6],
  'random7-8-1': [7, 8, 1],
  'random1-4-7': [1, 4, 7],
  'random2-5-8': [2, 5, 8],
  'random3-6-1': [3, 6, 1],
  'corners': [1, 3, 5, 7],
  'front-court': [1, 2, 3],
  'back-court': [5, 6, 7],
  'left-side': [1, 7, 8],
  'right-side': [3, 4, 5],
  'challenge': [1, 2, 3, 4, 5, 6, 7, 8],
  'custom': [1, 2, 3, 4, 5, 6, 7, 8]
};

interface TrainingState {
  running: boolean;
  currentIdx: number;
  score: number;
  delay: number;
  timerValue: number;
  timeRemaining: number;
  mode: string;
  ttsEnabled: boolean;
  activePosition: number | null;
}

const TrainingApp: React.FC = () => {
  const { toast } = useToast();
  
  const [state, setState] = useState<TrainingState>(() => {
    // Load from localStorage
    const saved = localStorage.getItem('masterFootworkState');
    const defaultState: TrainingState = {
      running: false,
      currentIdx: 0,
      score: 0,
      delay: 3,
      timerValue: 300, // 5 minutes default
      timeRemaining: 0,
      mode: 'random1-8',
      ttsEnabled: false,
      activePosition: null
    };
    
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        return { ...defaultState, ...parsedState, running: false };
      } catch (e) {
        console.warn('Failed to load saved state:', e);
      }
    }
    
    return defaultState;
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const speechSynthesis = useRef<SpeechSynthesis | null>(null);

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.current = window.speechSynthesis;
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    const stateToSave = { ...state };
    delete (stateToSave as any).running; // Don't persist running state
    localStorage.setItem('masterFootworkState', JSON.stringify(stateToSave));
  }, [state]);

  // Get current mode positions
  const getCurrentModePositions = useCallback((): number[] => {
    return MODE_POSITIONS[state.mode] || MODE_POSITIONS['random1-8'];
  }, [state.mode]);

  // Audio feedback
  const playAudioFeedback = useCallback((positionId: number) => {
    const position = POSITIONS.find(p => p.id === positionId);
    if (!position) return;

    if (state.ttsEnabled && speechSynthesis.current) {
      try {
        const utterance = new SpeechSynthesisUtterance(`Position ${positionId}`);
        utterance.rate = 1.2;
        utterance.volume = 0.8;
        speechSynthesis.current.speak(utterance);
      } catch (e) {
        console.warn('TTS failed, using beep fallback');
        playBeep();
      }
    } else {
      playBeep();
    }
  }, [state.ttsEnabled]);

  // Beep fallback
  const playBeep = useCallback(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }, []);

  // Get next position
  const getNextPosition = useCallback((): number => {
    const modePositions = getCurrentModePositions();
    const randomIndex = Math.floor(Math.random() * modePositions.length);
    return modePositions[randomIndex];
  }, [getCurrentModePositions]);

  // Move to next position
  const moveToNextPosition = useCallback(() => {
    const nextPos = getNextPosition();
    setState(prev => ({
      ...prev,
      activePosition: nextPos,
      currentIdx: prev.currentIdx + 1,
      score: prev.score + 1
    }));
    
    playAudioFeedback(nextPos);
  }, [getNextPosition, playAudioFeedback]);

  // Start training
  const startTraining = useCallback(() => {
    setState(prev => ({
      ...prev,
      running: true,
      timeRemaining: prev.timerValue
    }));
    
    // Start first position immediately
    moveToNextPosition();
    
    // Set up interval for subsequent positions
    intervalRef.current = setInterval(() => {
      moveToNextPosition();
    }, state.delay * 1000);
    
    // Set up timer countdown if timer is enabled
    if (state.timerValue > 0) {
      timerRef.current = setInterval(() => {
        setState(prev => {
          if (prev.timeRemaining <= 1) {
            return { ...prev, running: false, timeRemaining: 0 };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    }
    
    toast({
      title: "Training Started",
      description: `Mode: ${state.mode.replace('-', ' ')}`,
    });
  }, [state.delay, state.timerValue, state.mode, moveToNextPosition, toast]);

  // Stop training
  const stopTraining = useCallback(() => {
    setState(prev => ({ ...prev, running: false, activePosition: null }));
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    toast({
      title: "Training Stopped",
      description: `Score: ${state.score}`,
    });
  }, [state.score, toast]);

  // Reset training
  const resetTraining = useCallback(() => {
    stopTraining();
    setState(prev => ({
      ...prev,
      score: 0,
      currentIdx: 0,
      activePosition: null,
      timeRemaining: prev.timerValue
    }));
    
    toast({
      title: "Training Reset",
      description: "Ready to start fresh",
    });
  }, [stopTraining, toast]);

  // Next position manually
  const nextPosition = useCallback(() => {
    if (state.running) {
      moveToNextPosition();
    }
  }, [state.running, moveToNextPosition]);

  // Home function (placeholder)
  const goHome = useCallback(() => {
    resetTraining();
    toast({
      title: "Returned Home",
      description: "Training session ended",
    });
  }, [resetTraining, toast]);

  // Handle timer expiry
  useEffect(() => {
    if (state.timeRemaining === 0 && state.running && state.timerValue > 0) {
      stopTraining();
      toast({
        title: "Time's Up!",
        description: `Final Score: ${state.score}`,
        variant: "destructive"
      });
    }
  }, [state.timeRemaining, state.running, state.timerValue, state.score, stopTraining, toast]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) {
        return; // Don't interfere with form inputs
      }
      
      switch (event.code) {
        case 'Space':
          event.preventDefault();
          if (state.running) {
            stopTraining();
          } else {
            startTraining();
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextPosition();
          break;
        case 'Digit1':
        case 'Digit2':
        case 'Digit3':
        case 'Digit4':
        case 'Digit5':
        case 'Digit6':
        case 'Digit7':
        case 'Digit8':
          event.preventDefault();
          const pos = parseInt(event.code.slice(-1));
          setState(prev => ({ ...prev, activePosition: pos }));
          playAudioFeedback(pos);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.running, startTraining, stopTraining, nextPosition, playAudioFeedback]);

  // Touch/swipe gestures
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!startX || !startY) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      
      // Check for horizontal swipe (≥50px)
      if (Math.abs(deltaX) >= 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          // Swipe right - next position
          nextPosition();
        }
      }
      
      startX = 0;
      startY = 0;
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [nextPosition]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Get arrow position
  const getArrowPosition = () => {
    if (!state.activePosition) return null;
    const position = POSITIONS.find(p => p.id === state.activePosition);
    return position ? { x: position.x, y: position.y } : null;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="text-center py-6 px-4 fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Master Footwork
        </h1>
        <div className="badge-version">
          v5.8
        </div>
        {state.timeRemaining > 0 && state.running && (
          <div className="mt-4 text-warning font-mono text-lg">
            Time: {Math.floor(state.timeRemaining / 60)}:{(state.timeRemaining % 60).toString().padStart(2, '0')}
          </div>
        )}
      </header>

      {/* Court */}
      <main className="flex-1 flex items-center justify-center px-4 slide-up">
        <Court
          positions={POSITIONS}
          activePosition={state.activePosition}
          arrowPosition={getArrowPosition()}
        />
      </main>

      {/* Controls */}
      <footer className={`px-4 py-6 ${state.running ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-300`}>
        <div className="max-w-4xl mx-auto">
          <TrainingControls
            isRunning={state.running}
            score={state.score}
            delay={state.delay}
            timerValue={state.timerValue}
            mode={state.mode}
            ttsEnabled={state.ttsEnabled}
            onStart={startTraining}
            onStop={stopTraining}
            onNext={nextPosition}
            onReset={resetTraining}
            onHome={goHome}
            onDelayChange={(delay) => setState(prev => ({ ...prev, delay }))}
            onTimerChange={(timerValue) => setState(prev => ({ ...prev, timerValue, timeRemaining: timerValue }))}
            onModeChange={(mode) => setState(prev => ({ ...prev, mode }))}
            onTtsToggle={() => setState(prev => ({ ...prev, ttsEnabled: !prev.ttsEnabled }))}
          />
        </div>
      </footer>
    </div>
  );
};

export default TrainingApp;