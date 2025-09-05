import React, { useState, useEffect, useCallback, useRef } from 'react';
import Court, { POSITIONS } from './Court';
import TrainingControls, { TRAINING_MODES } from './TrainingControls';
import { useToast } from '../hooks/use-toast';

// Mode position mappings
const MODE_POSITIONS: Record<string, number[]> = {
  'full-court': [1, 2, 3, 4, 5, 6, 7, 8],
  'front-court': [1, 2, 3],
  'back-court': [5, 6, 7],
  'corners': [1, 3, 5, 7],
  'left-side': [1, 7, 8],
  'right-side': [3, 4, 5],
  'random-1-2-3-4-8': [1, 2, 3, 4, 8],
  'random-4-5-6-7-8': [4, 5, 6, 7, 8],
  'random-4-8': [4, 8],
  'random-2-4-6-8': [2, 4, 6, 8],
  'random-1-5': [1, 5],
  'random-2-6': [2, 6],
  'random-3-7': [3, 7],
  'random-5-7': [5, 7],
  'random-1-3-6': [1, 3, 6]
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
  lastPosition: number | null;
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
      mode: 'full-court',
      ttsEnabled: false,
      activePosition: null,
      lastPosition: null
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
    return MODE_POSITIONS[state.mode] || MODE_POSITIONS['full-court'];
  }, [state.mode]);

  // Audio feedback
  const playAudioFeedback = useCallback((positionId: number) => {
    const position = POSITIONS.find(p => p.id === positionId);
    if (!position) return;

    if (state.ttsEnabled && speechSynthesis.current) {
      try {
        const utterance = new SpeechSynthesisUtterance(String(positionId));
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

  // Uniform position chooser avoiding consecutive repeats
  const chooseNext = useCallback((allowed: number[], lastId: number | null): number => {
    if (allowed.length <= 1) {
      return allowed[0];
    }
    
    let nextPos;
    do {
      const randomIndex = Math.floor(Math.random() * allowed.length);
      nextPos = allowed[randomIndex];
    } while (nextPos === lastId && allowed.length > 1);
    
    return nextPos;
  }, []);

  // Get next position using uniform chooser
  const getNextPosition = useCallback((): number => {
    const modePositions = getCurrentModePositions();
    return chooseNext(modePositions, state.lastPosition);
  }, [getCurrentModePositions, state.lastPosition, chooseNext]);

  // Move to next position
  const moveToNextPosition = useCallback(() => {
    const nextPos = getNextPosition();
    setState(prev => ({
      ...prev,
      activePosition: nextPos,
      lastPosition: nextPos,
      currentIdx: prev.currentIdx + 1,
      score: prev.score + 1
    }));
    
    playAudioFeedback(nextPos);
  }, [getNextPosition, playAudioFeedback]);

  // Trigger next position manually and reschedule
  const triggerNext = useCallback(() => {
    if (!state.running) return;
    
    // Clear current interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Move to next position
    moveToNextPosition();
    
    // Restart the interval
    intervalRef.current = setInterval(() => {
      moveToNextPosition();
    }, state.delay * 1000);
  }, [state.running, state.delay, moveToNextPosition]);

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
    setState(prev => ({ ...prev, running: false, activePosition: null, lastPosition: null }));
    
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
      lastPosition: null,
      timeRemaining: prev.timerValue
    }));
    
    toast({
      title: "Training Reset",
      description: "Ready to start fresh",
    });
  }, [stopTraining, toast]);


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
  }, [state.running, startTraining, stopTraining, playAudioFeedback]);

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
          // Swipe functionality removed
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
  }, []);

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
      <main className="flex-1 flex items-center justify-center px-4 slide-up relative">
        <Court
          positions={POSITIONS}
          activePosition={state.activePosition}
          arrowPosition={getArrowPosition()}
        />
        
        {/* Centered Stop Overlay */}
        {state.running && (
          <button
            id="stopOverlayBtn"
            onClick={stopTraining}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                       bg-red-600 hover:bg-red-700 text-white font-bold 
                       w-28 h-28 rounded-full shadow-lg z-10 
                       flex flex-col items-center justify-center text-sm
                       transition-colors duration-200"
            aria-label="Stop Training"
          >
            <span>STOP</span>
            {state.timerValue > 0 && state.timeRemaining > 0 && (
              <span className="text-xs mt-1">
                ({Math.floor(state.timeRemaining / 60)}:{(state.timeRemaining % 60).toString().padStart(2, '0')})
              </span>
            )}
          </button>
        )}
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
            onReset={resetTraining}
            onHome={goHome}
            onDelayChange={(delay) => setState(prev => ({ ...prev, delay }))}
            onTimerChange={(timerValue) => setState(prev => ({ ...prev, timerValue, timeRemaining: timerValue }))}
            onModeChange={(mode) => setState(prev => ({ ...prev, mode, lastPosition: null }))}
            onTtsToggle={() => setState(prev => ({ ...prev, ttsEnabled: !prev.ttsEnabled }))}
          />
        </div>
      </footer>
    </div>
  );
};

export default TrainingApp;