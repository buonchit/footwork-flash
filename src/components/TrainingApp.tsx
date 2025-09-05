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
  starting: boolean; // Prevent re-entry during start handshake
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
      starting: false, // Prevent re-entry during start handshake
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
  const scheduleIdRef = useRef<number>(0);
  const currentRunningRef = useRef<boolean>(false);
  const watchdogRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Sync running state with ref for closures
  useEffect(() => {
    currentRunningRef.current = state.running;
  }, [state.running]);

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

  // Prime audio context for user gesture compliance
  const primeAudioContext = useCallback(async (): Promise<boolean> => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      return audioContextRef.current.state === 'running';
    } catch (e) {
      console.warn('[AUDIO] Failed to prime audio context:', e);
      return false;
    }
  }, []);

  // Non-blocking TTS with cancellation
  const speakNumber = useCallback((positionId: number) => {
    if (!currentRunningRef.current) return; // Guard: only if running
    if (!state.ttsEnabled) return;
    
    try {
      if (!speechSynthesis.current) return;
      
      // Cancel any prior utterance for sync at low delays
      speechSynthesis.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(String(positionId));
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
      utterance.volume = 0.8;
      
      speechSynthesis.current.speak(utterance);
      console.log(`[TTS-${scheduleIdRef.current}] Speaking: ${positionId}`);
    } catch (e) {
      console.warn('[TTS] Speech failed:', e);
    }
  }, [state.ttsEnabled]);

  // Fallback beep (non-blocking)
  const playBeep = useCallback(() => {
    if (!currentRunningRef.current) return;
    
    try {
      const audioContext = audioContextRef.current;
      if (!audioContext || audioContext.state !== 'running') return;
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      console.warn('[BEEP] Failed:', e);
    }
  }, []);

// Uniform position chooser avoiding consecutive repeats
  const chooseNext = useCallback((allowed: number[], lastId: number | null): number => {
    const pool = (allowed.length > 1 && lastId !== null)
      ? allowed.filter(id => id !== lastId)
      : allowed.slice(); // Don't mutate original
    
    const idx = Math.floor(Math.random() * pool.length);
    return pool[idx];
  }, []);

  // Get next position using uniform chooser
  const getNextPosition = useCallback((): number => {
    const modePositions = getCurrentModePositions();
    return chooseNext(modePositions, state.lastPosition);
  }, [getCurrentModePositions, state.lastPosition, chooseNext]);

  // Force arrow redraw counter
  const [arrowRedrawCounter, setArrowRedrawCounter] = React.useState(0);

  // Move to next position with comprehensive guards
  const moveToNextPosition = useCallback(() => {
    const scheduleId = scheduleIdRef.current;
    console.log(`[SCHEDULE-${scheduleId}] moveToNextPosition: executing`);
    
    // GUARD: Check running state and timer before executing
    if (!currentRunningRef.current) {
      console.log(`[SCHEDULE-${scheduleId}] moveToNextPosition: aborted - not running`);
      return;
    }
    
    // GUARD: Check timer hasn't expired
    if (state.timerValue > 0 && state.timeRemaining <= 0) {
      console.log(`[SCHEDULE-${scheduleId}] moveToNextPosition: aborted - timer expired`);
      return;
    }
    
    const nextPos = getNextPosition();
    setState(prev => ({
      ...prev,
      activePosition: nextPos,
      lastPosition: nextPos,
      currentIdx: prev.currentIdx + 1,
      score: prev.score + 1
    }));
    
    // Force arrow redraw for every position change
    setArrowRedrawCounter(prev => prev + 1);
    
    console.log(`[SCHEDULE-${scheduleId}] moveToNextPosition: moved to position ${nextPos}`);
    
    // Non-blocking audio feedback
    speakNumber(nextPos);
    if (!state.ttsEnabled) {
      playBeep();
    }
  }, [getNextPosition, speakNumber, playBeep, state.ttsEnabled, state.timerValue, state.timeRemaining]);

  // Start preconditions check
  const checkStartPreconditions = useCallback((): { canStart: boolean; reason?: string } => {
    // Check if mode has valid positions
    const modePositions = getCurrentModePositions();
    if (modePositions.length === 0) {
      return { canStart: false, reason: "Mode has no valid positions" };
    }
    
    // Check if already starting/running
    if (state.starting || currentRunningRef.current) {
      return { canStart: false, reason: "Session already active" };
    }
    
    // Check timer conditions
    if (state.timerValue > 0 && state.timeRemaining === 0) {
      return { canStart: false, reason: "Timer is set but no time remaining. Please reset timer." };
    }
    
    return { canStart: true };
  }, [getCurrentModePositions, state.starting, state.timerValue, state.timeRemaining]);

  // Start watchdog - ensures first move happens within 700ms
  const startWatchdog = useCallback(() => {
    if (watchdogRef.current) {
      clearTimeout(watchdogRef.current);
    }
    
    watchdogRef.current = setTimeout(() => {
      console.log('[WATCHDOG] Checking start completion...');
      
      // Check if session started successfully
      if (currentRunningRef.current && state.activePosition) {
        console.log('[WATCHDOG] Start successful - disabling');
        return;
      }
      
      // Check if session was explicitly stopped
      if (!currentRunningRef.current) {
        console.log('[WATCHDOG] Session stopped - no action needed');
        return;
      }
      
      // Recovery: trigger first move if still running but no position active
      if (currentRunningRef.current && !state.activePosition) {
        console.log('[WATCHDOG] Recovery: triggering first move');
        moveToNextPosition();
      }
      
      watchdogRef.current = null;
    }, 700);
  }, [state.activePosition, moveToNextPosition]);

  // Comprehensive start training with ordered handshake
  const startTraining = useCallback(async () => {
    console.log('[TRAINING] startTraining: entering handshake');
    
    // REQ-INT-2: Start preconditions check
    const { canStart, reason } = checkStartPreconditions();
    if (!canStart) {
      console.log(`[TRAINING] startTraining: preconditions failed - ${reason}`);
      toast({
        title: "Cannot Start",
        description: reason,
        variant: "destructive"
      });
      return;
    }
    
    try {
      // REQ-INT-3: Ordered start handshake (atomic)
      // (a) Mark session as starting and prevent re-entry
      setState(prev => ({ ...prev, starting: true }));
      
      // (b) Clear any prior timers/intervals/animation frames and cancel any pending speech
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (watchdogRef.current) {
        clearTimeout(watchdogRef.current);
        watchdogRef.current = null;
      }
      if (speechSynthesis.current) {
        speechSynthesis.current.cancel();
      }
      
      // Increment schedule ID for this session
      scheduleIdRef.current += 1;
      const scheduleId = scheduleIdRef.current;
      console.log(`[TRAINING] startTraining: session ${scheduleId} starting`);
      
      // (c) Reset "last pick"/selection memory and timer remaining
      setState(prev => ({
        ...prev,
        timeRemaining: prev.timerValue,
        lastPosition: null,
        activePosition: null,
        currentIdx: 0
      }));
      
      // (d) Set running=true
      currentRunningRef.current = true;
      setState(prev => ({ ...prev, running: true }));
      
      // (e) Prime audio/TTS opportunistically (non-blocking)
      const audioReady = await primeAudioContext();
      console.log(`[TRAINING] Audio context ready: ${audioReady}`);
      
      // Clear starting flag
      setState(prev => ({ ...prev, starting: false }));
      
      // (f) Trigger first move immediately (REQ-INT-4: First-Move Guarantee)
      console.log(`[SCHEDULE-${scheduleId}] startTraining: triggering first move`);
      
      // Use setTimeout to ensure move happens within 300-500ms
      setTimeout(() => {
        if (currentRunningRef.current) {
          moveToNextPosition();
        }
      }, 100);
      
      // REQ-INT-8: Start watchdog
      startWatchdog();
      
      // Enforce minimum delay for TTS sync (REQ-INT-5)
      const userDelayMs = state.delay * 1000;
      const minTtsMs = state.ttsEnabled ? 800 : 0;
      const effectiveDelay = Math.max(userDelayMs, minTtsMs);
      
      // Set up interval for subsequent positions with comprehensive guards
      console.log(`[SCHEDULE-${scheduleId}] startTraining: setting interval with ${effectiveDelay}ms delay`);
      intervalRef.current = setInterval(() => {
        // REQ-INT-7: Scheduling barriers & race-free guards
        if (!currentRunningRef.current) {
          console.log(`[SCHEDULE-${scheduleId}] interval: aborted - not running`);
          return;
        }
        if (state.timerValue > 0 && state.timeRemaining <= 0) {
          console.log(`[SCHEDULE-${scheduleId}] interval: aborted - timer expired`);
          return;
        }
        moveToNextPosition();
      }, effectiveDelay);
      
      // REQ-INT-6: Timer guardrails
      if (state.timerValue > 0) {
        console.log(`[TRAINING] startTraining: starting ${state.timerValue}s countdown`);
        timerRef.current = setInterval(() => {
          setState(prev => {
            const newTimeRemaining = prev.timeRemaining - 1;
            console.log(`[TIMER] countdown tick: ${newTimeRemaining}s remaining`);
            
            if (newTimeRemaining <= 0) {
              console.log('[TIMER] countdown: reached 00:00 - triggering stop');
              // Timer expired - trigger centralized stop with proper sequence
              setTimeout(() => {
                if (currentRunningRef.current) {
                  stopTraining();
                }
              }, 0);
              return { ...prev, timeRemaining: 0 };
            }
            return { ...prev, timeRemaining: newTimeRemaining };
          });
        }, 1000);
      }
      
      toast({
        title: "Training Started",
        description: `Mode: ${state.mode.replace('-', ' ')}`,
      });
      
    } catch (error) {
      console.error('[TRAINING] startTraining: error during handshake', error);
      
      // Abort cleanly on failure
      currentRunningRef.current = false;
      setState(prev => ({ 
        ...prev, 
        running: false, 
        starting: false,
        activePosition: null 
      }));
      
      toast({
        title: "Start Failed",
        description: "Unable to start training session",
        variant: "destructive"
      });
    }
  }, [checkStartPreconditions, primeAudioContext, state.delay, state.timerValue, 
      state.ttsEnabled, state.mode, moveToNextPosition, startWatchdog, toast]);

  // REQ-INT-10: Centralized, idempotent stop procedure
  const stopTraining = useCallback(() => {
    console.log('[TRAINING] stopTraining: entering stop procedure');
    
    try {
      // REQ-INT-1: Single source of truth - set running=false FIRST
      currentRunningRef.current = false;
      setState(prev => ({ 
        ...prev, 
        running: false, 
        starting: false,
        activePosition: null, 
        timeRemaining: 0 
      }));
      console.log('[TRAINING] stopTraining: set running=false');
      
      // Cancel ALL scheduled callbacks (idempotent)
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        console.log('[TRAINING] stopTraining: cleared position interval');
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        console.log('[TRAINING] stopTraining: cleared timer interval');
      }
      
      if (watchdogRef.current) {
        clearTimeout(watchdogRef.current);
        watchdogRef.current = null;
        console.log('[TRAINING] stopTraining: cleared watchdog');
      }
      
      // Cancel any TTS (idempotent)
      if (speechSynthesis.current) {
        speechSynthesis.current.cancel();
        console.log('[TRAINING] stopTraining: cancelled TTS');
      }
      
      console.log('[TRAINING] stopTraining: stop procedure complete');
      
      toast({
        title: "Training Stopped", 
        description: `Score: ${state.score}`,
      });
      
    } catch (e) {
      console.error('[TRAINING] stopTraining: error during stop', e);
    }
  }, [state.score, toast]);

  // REQ-INT-10: Hard Reset - guaranteed kill-switch
  const hardReset = useCallback(() => {
    console.log('[TRAINING] hardReset: entering kill-switch reset');
    
    try {
      // Force running state to false
      currentRunningRef.current = false;
      
      // Clear ALL timers, intervals, and timeouts (idempotent)
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        console.log('[TRAINING] hardReset: cleared position interval');
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        console.log('[TRAINING] hardReset: cleared timer interval');
      }
      
      if (watchdogRef.current) {
        clearTimeout(watchdogRef.current);
        watchdogRef.current = null;
        console.log('[TRAINING] hardReset: cleared watchdog');
      }
      
      // Cancel any TTS
      if (speechSynthesis.current) {
        speechSynthesis.current.cancel();
        console.log('[TRAINING] hardReset: cancelled TTS');
      }
      
      // Reset all state to defaults
      setState({
        running: false,
        starting: false, // Reset start handshake state
        currentIdx: 0,
        score: 0,
        delay: 3,
        timerValue: 0,
        timeRemaining: 0,
        mode: 'full-court',
        ttsEnabled: false,
        activePosition: null,
        lastPosition: null
      });
      
      // Reset schedule counter
      scheduleIdRef.current = 0;
      
      // Force arrow redraw
      setArrowRedrawCounter(prev => prev + 1);
      
      console.log('[TRAINING] hardReset: reset complete');
      
      toast({
        title: "Training Reset",
        description: "Ready to start fresh",
      });
      
    } catch (e) {
      console.warn('Reset error:', e);
    }
  }, [toast]);

  // Home function 
  const goHome = useCallback(() => {
    hardReset();
    toast({
      title: "Returned Home",
      description: "Training session ended",
    });
  }, [hardReset, toast]);

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
          speakNumber(pos);
          if (!state.ttsEnabled) {
            playBeep();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.running, state.ttsEnabled, startTraining, stopTraining, speakNumber, playBeep]);

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
          forceArrowRedraw={arrowRedrawCounter}
        />
        
        {/* Centered Stop Overlay */}
        {state.running && (
          <button
            id="stopOverlayBtn"
            onClick={stopTraining}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                       bg-red-600 hover:bg-red-700 text-white font-bold 
                       w-28 h-28 rounded-full shadow-lg z-10 
                       flex items-center justify-center text-sm
                       transition-colors duration-200"
            aria-label="Stop Training"
          >
            {state.timerValue > 0 && state.timeRemaining > 0 ? (
              <span>STOP ({Math.floor(state.timeRemaining / 60)}:{(state.timeRemaining % 60).toString().padStart(2, '0')})</span>
            ) : (
              <span>STOP</span>
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
            onReset={hardReset}
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