import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import Court, { POSITIONS } from './Court';
import TrainingControls, { TRAINING_MODES } from './TrainingControls';
import { useToast } from '../hooks/use-toast';

// REQ-11: Mode position mappings with explicit positions
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
  starting: boolean; // REQ-02: Prevent re-entry during start handshake
  currentIdx: number;
  score: number;
  totalScore: number; // Total score across all training sessions
  delay: number;
  timerValue: number;
  timeRemaining: number;
  mode: string;
  ttsEnabled: boolean;
  activePosition: number | null;
  lastPosition: number | null;
  controlsLocked: boolean; // REQ-09: Lock controls while running
  positionDeck: number[]; // Shuffle bucket: deck of positions to draw from
}

const TrainingApp: React.FC = () => {
  const { toast } = useToast();
  
  const [state, setState] = useState<TrainingState>(() => {
    // Load from localStorage
    const saved = localStorage.getItem('masterFootworkState');
    const defaultState: TrainingState = {
      running: false,
      starting: false, // REQ-02: Prevent re-entry during start handshake
      currentIdx: 0,
      score: 0,
      totalScore: 0, // Total score across all training sessions
      delay: 3,
      timerValue: 300, // 5 minutes default
      timeRemaining: 0,
      mode: 'full-court',
      ttsEnabled: false,
      activePosition: null,
      lastPosition: null,
      controlsLocked: true, // REQ-09: Default to locked during training
      positionDeck: [] // Shuffle bucket: initialize empty deck
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
  const nextMoveTimeoutRef = useRef<NodeJS.Timeout | null>(null); // REQ-01: Single scheduler
  const sessionStartTimeRef = useRef<number>(0); // Track actual session start time

  // REQ-01: Sync running state with ref for closures
  useEffect(() => {
    currentRunningRef.current = state.running;
  }, [state.running]);

  // REQ-04: Initialize speech synthesis
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

  // REQ-02: Prime audio context for user gesture compliance
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

  // REQ-TT-6: Speech discipline - cancel prior, speak once per move
  const speakNumber = useCallback((positionId: number) => {
    if (!currentRunningRef.current) return; // Guard: only if running
    if (!state.ttsEnabled) return;
    
    try {
      if (!speechSynthesis.current) return;
      
      // REQ-TT-6: Cancel any prior utterance to avoid backlog
      speechSynthesis.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(String(positionId));
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
      utterance.volume = 0.8;
      
      // REQ-TT-6: Speak the current digit once at arrow appearance
      speechSynthesis.current.speak(utterance);
      console.log(`[TTS-${scheduleIdRef.current}] SPEAK_ATTEMPT: ${positionId}`);
    } catch (e) {
      console.warn('[TTS] SPEAK_FAILED:', e);
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

  // Shuffle deck using Fisher-Yates algorithm
  const shuffleDeck = useCallback((positions: number[]): number[] => {
    const deck = [...positions]; // Don't mutate original
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }, []);

  // Build new shuffled deck from current mode positions
  const buildNewDeck = useCallback((currentMode?: string): number[] => {
    const mode = currentMode || state.mode;
    const modePositions = MODE_POSITIONS[mode] || MODE_POSITIONS['full-court'];
    const shuffled = shuffleDeck(modePositions);
    console.log(`[DECK] Built new deck for mode ${mode}: positions [${modePositions.join(', ')}] -> shuffled [${shuffled.join(', ')}]`);
    return shuffled;
  }, [shuffleDeck, state.mode]);

  // Get next position from deck, handle consecutive repeats and deck rebuild
  const getNextPosition = useCallback((currentDeck: number[], lastPos: number | null, currentMode?: string): { position: number; newDeck: number[] } => {
    const mode = currentMode || state.mode;
    const modePositions = MODE_POSITIONS[mode] || MODE_POSITIONS['full-court'];
    
    console.log(`[DECK] Current deck: [${currentDeck.join(', ')}], lastPos: ${lastPos}`);
    
    // Special handling for 2-position modes to ensure true randomness
    if (modePositions.length === 2) {
      // For 2-position modes, use direct random selection with 50/50 probability
      const randomPos = modePositions[Math.random() < 0.5 ? 0 : 1];
      console.log(`[DECK] 2-position mode: random selection ${randomPos} from [${modePositions.join(', ')}]`);
      
      return {
        position: randomPos,
        newDeck: [] // Keep deck empty for 2-position modes to always use random selection
      };
    }
    
    // Standard deck algorithm for 3+ positions
    let positionDeck = currentDeck;
    
    // If deck is empty, rebuild and shuffle
    if (positionDeck.length === 0) {
      positionDeck = buildNewDeck(currentMode);
      console.log(`[DECK] Rebuilt deck: [${positionDeck.join(', ')}]`);
    }
    
    // Pop next position from deck
    let nextPos = positionDeck[0];
    let newDeck = positionDeck.slice(1);
    
    console.log(`[DECK] Popped position: ${nextPos}, remaining deck: [${newDeck.join(', ')}]`);
    
    // Handle consecutive repeats: if same as last position and deck has more cards, swap with next
    if (nextPos === lastPos && newDeck.length > 0) {
      // Swap with next card in deck
      const swapPos = newDeck[0];
      newDeck = [nextPos, ...newDeck.slice(1)];
      nextPos = swapPos;
      console.log(`[DECK] Swapped to avoid repeat: ${nextPos}, updated deck: [${newDeck.join(', ')}]`);
    }
    
    return {
      position: nextPos,
      newDeck: newDeck
    };
  }, [buildNewDeck, state.mode]);

  // REQ-05: Force arrow redraw counter for repeat animations
  const [arrowRedrawCounter, setArrowRedrawCounter] = React.useState(0);

  // REQ-03 & REQ-10: Centralized, idempotent stop procedure
  const stopTraining = useCallback(() => {
    console.log('[TRAINING] stopTraining: entering stop procedure');
    
    try {
      // REQ-03: Single source of truth - set running=false FIRST, unlock controls
      currentRunningRef.current = false;
      sessionStartTimeRef.current = 0; // Clear session start time
      setState(prev => ({ 
        ...prev, 
        running: false, 
        starting: false,
        activePosition: null, 
        timeRemaining: prev.timerValue, // REQ-FIX: Reset to timer value for fresh restart
        controlsLocked: false 
      }));
      console.log('[TRAINING] stopTraining: set running=false');
      
      // Cancel ALL scheduled callbacks (idempotent)
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        console.log('[TRAINING] stopTraining: cleared position interval');
      }
      
      if (nextMoveTimeoutRef.current) {
        clearTimeout(nextMoveTimeoutRef.current);
        nextMoveTimeoutRef.current = null;
        console.log('[TRAINING] stopTraining: cleared next move timeout');
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

  // REQ-Z1: Move to next position with zero-th move prevention
  const moveToNextPosition = useCallback(() => {
    const scheduleId = scheduleIdRef.current;
    const now = Date.now();
    const elapsed = sessionStartTimeRef.current > 0 ? now - sessionStartTimeRef.current : 0;
    
    console.log(`[SCHEDULE-${scheduleId}] moveToNextPosition: executing at t=${elapsed}ms`);
    
    // REQ-Z1: CRITICAL - Prevent zero-th move (no move before 700ms after session start)
    if (elapsed < 700) {
      console.error(`[SCHEDULE-${scheduleId}] ERROR: Zero-th move detected at t=${elapsed}ms - BLOCKED`);
      return;
    }
    
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
    
    // Get the next position and update state in a single atomic operation
    setState(prev => {
      const { position: nextPos, newDeck } = getNextPosition(prev.positionDeck, prev.lastPosition, prev.mode);
      console.log(`[SCHEDULE-${scheduleId}] moveToNextPosition: moved to position ${nextPos}`);
      
      // REQ-04: Non-blocking audio feedback - TTS fires exactly when arrow renders
      // Note: We need to call these after setState, so we'll use a setTimeout
      setTimeout(() => {
        speakNumber(nextPos);
        if (!prev.ttsEnabled) {
          playBeep();
        }
      }, 0);
      
      return {
        ...prev,
        activePosition: nextPos,
        lastPosition: nextPos,
        currentIdx: prev.currentIdx + 1,
        score: prev.score + 1,
        totalScore: prev.totalScore + 1, // Increment total score
        positionDeck: newDeck // Update deck with remaining cards
      };
    });
    
    // REQ-05: Force arrow redraw for every position change
    setArrowRedrawCounter(prev => prev + 1);
  }, [getNextPosition, speakNumber, playBeep, state.ttsEnabled, state.timerValue, state.timeRemaining]);

  // REQ-TMR-COMP-1: Start preconditions check (timer compatibility)
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
    
    // REQ-TMR-COMP-1: Timer OFF (Timer = 0) - always allow start
    // REQ-TMR-COMP-1: Timer ON but expired - auto-rearm and start
    // No blocking based on timeRemaining alone
    
    return { canStart: true };
  }, [getCurrentModePositions, state.starting]);

  // REQ-02: Start watchdog - ensures first move happens within 700ms
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

  // REQ-01 & REQ-02: Comprehensive start training with ~1000ms pre-roll + fixed cadence
  const startTraining = useCallback(async () => {
    console.log('[TRAINING] startTraining: entering handshake');
    
    // REQ-02: Start preconditions check
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
      // REQ-02: Atomic start handshake
      // (a) Mark session as starting and prevent re-entry
      setState(prev => ({ ...prev, starting: true }));
      
      // (b) Clear any prior schedules and cancel TTS
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (nextMoveTimeoutRef.current) {
        clearTimeout(nextMoveTimeoutRef.current);
        nextMoveTimeoutRef.current = null;
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
      
      // Increment schedule ID for this session and record start time
      scheduleIdRef.current += 1;
      const scheduleId = scheduleIdRef.current;
      sessionStartTimeRef.current = Date.now(); // REQ-Z1: Record session start time
      console.log(`[TRAINING] startTraining: session ${scheduleId} starting at t=0`);
      
      // (c) Reset state with auto-rearm timer
      setState(prev => ({
        ...prev,
        timeRemaining: prev.timerValue, // REQ-TMR-COMP-1: Auto-rearm timer on start
        lastPosition: null,
        activePosition: null,
        currentIdx: 0,
        score: 0,
        positionDeck: [] // Shuffle bucket: reset deck on session start
      }));
      
      // (d) Set running=true and lock controls
      currentRunningRef.current = true;
      setState(prev => ({ ...prev, running: true, controlsLocked: true }));
      
      // (e) Prime audio/TTS opportunistically (non-blocking)
      const audioReady = await primeAudioContext();
      console.log(`[TRAINING] Audio context ready: ${audioReady}`);
      
      // Clear starting flag
      setState(prev => ({ ...prev, starting: false }));
      
      // REQ-Z1: Schedule ONLY the pre-roll - no immediate move at t=0
      console.log(`[SCHEDULE-${scheduleId}] PRE_ROLL_SCHEDULED: first move in 1000ms`);
      
      // Single scheduler: pre-roll timeout that then sets up the interval
      nextMoveTimeoutRef.current = setTimeout(() => {
        console.log(`[SCHEDULE-${scheduleId}] PRE_ROLL_FIRED: executing first move`);
        
        // Guards before executing first move
        if (!currentRunningRef.current) {
          console.log(`[SCHEDULE-${scheduleId}] pre-roll: aborted - not running`);
          return;
        }
        
        // Execute first move
        const firstMoveTime = Date.now();
        moveToNextPosition();
        console.log(`[SCHEDULE-${scheduleId}] MOVE#1_COMMIT: t=${firstMoveTime - sessionStartTimeRef.current}ms`);
        
        // Clear the timeout reference since it's complete
        nextMoveTimeoutRef.current = null;
        
        // REQ-Z3: Set up cadence scheduling anchored to first move completion
        const userDelayMs = state.delay * 1000;
        const minTtsMs = state.ttsEnabled ? 800 : 0;
        const effectiveDelay = Math.max(userDelayMs, minTtsMs);
        
        console.log(`[SCHEDULE-${scheduleId}] startTraining: setting cadence interval with ${effectiveDelay}ms delay`);
        
        // Start interval from first move completion
        intervalRef.current = setInterval(() => {
          // Guards before each scheduled move
          if (!currentRunningRef.current) {
            console.log(`[SCHEDULE-${scheduleId}] interval: aborted - not running`);
            return;
          }
          if (state.timerValue > 0 && state.timeRemaining <= 0) {
            console.log(`[SCHEDULE-${scheduleId}] interval: aborted - timer expired`);
            return;
          }
          
          const moveTime = Date.now();
          moveToNextPosition();
          console.log(`[SCHEDULE-${scheduleId}] MOVE_COMMIT: t=${moveTime - sessionStartTimeRef.current}ms`);
        }, effectiveDelay);
      }, 1000);
      
      // REQ-FIX: Post-timer-expiry restart watchdog
      setTimeout(() => {
        if (currentRunningRef.current && !nextMoveTimeoutRef.current && !intervalRef.current) {
          console.log(`[SCHEDULE-${scheduleId}] WATCHDOG_RECOVERED: forcing first move after timer expiry restart`);
          moveToNextPosition();
        }
      }, 500);
      
      // REQ-TMR-COMP-3: Timer countdown only when TimerEnabled = TRUE
      if (state.timerValue > 0) {
        console.log(`[TRAINING] startTraining: starting ${state.timerValue}s countdown`);
        timerRef.current = setInterval(() => {
          setState(prev => {
            const newTimeRemaining = prev.timeRemaining - 1;
            console.log(`[TIMER] countdown tick: ${newTimeRemaining}s remaining`);
            
            if (newTimeRemaining <= 0) {
              console.log('[TIMER] countdown: reached 00:00 - triggering stop');
              // REQ-03: Timer absolute stop
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
      state.ttsEnabled, state.mode, moveToNextPosition, startWatchdog, toast, stopTraining]);

  // REQ-10: Hard Reset - guaranteed kill-switch
  const hardReset = useCallback(() => {
    console.log('[TRAINING] hardReset: entering kill-switch reset');
    
    try {
      // Force running state to false
      currentRunningRef.current = false;
      sessionStartTimeRef.current = 0; // Clear session start time
      
      // Clear ALL timers, intervals, and timeouts (idempotent)
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        console.log('[TRAINING] hardReset: cleared position interval');
      }
      
      if (nextMoveTimeoutRef.current) {
        clearTimeout(nextMoveTimeoutRef.current);
        nextMoveTimeoutRef.current = null;
        console.log('[TRAINING] hardReset: cleared next move timeout');
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
        starting: false,
        currentIdx: 0,
        score: 0,
        totalScore: 0, // Reset total score on hard reset
        delay: 3,
        timerValue: 0,
        timeRemaining: 0,
        mode: 'full-court',
        ttsEnabled: false,
        activePosition: null,
        lastPosition: null,
        controlsLocked: false,
        positionDeck: [] // Shuffle bucket: reset deck on hard reset
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

  // Control handlers with proper state update semantics
  const handleDelayChange = useCallback((newDelay: number) => {
    setState(prev => ({ ...prev, delay: newDelay }));
    
    // REQ-09: If running and unlocked, reschedule from next interval
    if (state.running && !state.controlsLocked) {
      // Clear current interval and set new one from next move
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        const userDelayMs = newDelay * 1000;
        const minTtsMs = state.ttsEnabled ? 800 : 0;
        const effectiveDelay = Math.max(userDelayMs, minTtsMs);
        
        intervalRef.current = setInterval(() => {
          if (!currentRunningRef.current) return;
          if (state.timerValue > 0 && state.timeRemaining <= 0) return;
          moveToNextPosition();
        }, effectiveDelay);
      }
    }
  }, [state.running, state.controlsLocked, state.ttsEnabled, state.timerValue, state.timeRemaining, moveToNextPosition]);

  const handleTimerChange = useCallback((newTimerValue: number) => {
    setState(prev => ({
      ...prev,
      timerValue: newTimerValue,
      timeRemaining: state.running ? 
        Math.min(prev.timeRemaining, newTimerValue) : // If running, adopt min of current remaining and new value
        newTimerValue // If not running, set to new value
    }));
  }, [state.running]);

  const handleModeChange = useCallback((newMode: string) => {
    setState(prev => ({ 
      ...prev, 
      mode: newMode,
      lastPosition: null, // REQ-04: Reset last position on mode change
      positionDeck: [] // Shuffle bucket: reset deck on mode change
    }));
  }, []);

  // REQ-TT-1: Atomic TTS toggle with cadence preservation and watchdog recovery
  const handleTtsToggle = useCallback(async () => {
    const newTtsEnabled = !state.ttsEnabled;
    const scheduleId = scheduleIdRef.current;
    
    console.log(`[TTS_TOGGLE] ${state.ttsEnabled ? 'OFF' : 'ON'} -> ${newTtsEnabled ? 'ON' : 'OFF'}`);
    
    try {
      // REQ-TT-1: Atomic toggle - update TTS flag immediately
      setState(prev => ({ ...prev, ttsEnabled: newTtsEnabled }));
      
      // REQ-TT-1: If turning OFF -> cancel any in-flight utterance immediately
      if (!newTtsEnabled && speechSynthesis.current) {
        speechSynthesis.current.cancel();
        console.log('[TTS_TOGGLE] Cancelled in-flight utterance');
      }
      
      // REQ-TT-1: If turning ON -> attempt lightweight audio prime (non-blocking)
      if (newTtsEnabled) {
        try {
          await primeAudioContext();
          console.log('[TTS_TOGGLE] Audio context primed');
        } catch (e) {
          console.warn('[TTS_TOGGLE] Audio prime failed (non-blocking):', e);
        }
      }
      
      // REQ-TT-2: Cadence preservation - only if running
      if (currentRunningRef.current && intervalRef.current) {
        // Clear current interval
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        
        // REQ-TT-2: Recompute effective delay with new TTS state
        const userDelayMs = state.delay * 1000;
        const minTtsMs = newTtsEnabled ? 800 : 0;
        const effectiveDelay = Math.max(userDelayMs, minTtsMs);
        
        console.log(`[TTS_TOGGLE] Updating cadence: ${effectiveDelay}ms delay (TTS: ${newTtsEnabled})`);
        
        // REQ-TT-2: Restart interval with new effective delay - no immediate move
        intervalRef.current = setInterval(() => {
          if (!currentRunningRef.current) {
            console.log(`[SCHEDULE-${scheduleId}] interval: aborted - not running`);
            return;
          }
          if (state.timerValue > 0 && state.timeRemaining <= 0) {
            console.log(`[SCHEDULE-${scheduleId}] interval: aborted - timer expired`);
            return;
          }
          
          const moveTime = Date.now();
          moveToNextPosition();
          console.log(`[SCHEDULE-${scheduleId}] MOVE_COMMIT: t=${moveTime - sessionStartTimeRef.current}ms`);
        }, effectiveDelay);
        
        console.log(`[TTS_TOGGLE] Cadence updated with ${effectiveDelay}ms delay`);
      }
      
      // REQ-TT-5: Watchdog after toggle - ensure scheduler exists if running
      if (currentRunningRef.current) {
        setTimeout(() => {
          const hasScheduler = intervalRef.current !== null || nextMoveTimeoutRef.current !== null;
          console.log(`[TTS_TOGGLE] WATCHDOG: running=${currentRunningRef.current}, scheduler=${hasScheduler ? 'exists' : 'missing'}`);
          
          if (currentRunningRef.current && !hasScheduler) {
            console.log('[TTS_TOGGLE] WATCHDOG: Recovery - scheduling next move');
            
            // REQ-TT-5: Schedule exactly one next move if missing
            const userDelayMs = state.delay * 1000;
            const minTtsMs = newTtsEnabled ? 800 : 0;
            const effectiveDelay = Math.max(userDelayMs, minTtsMs);
            
            intervalRef.current = setInterval(() => {
              if (!currentRunningRef.current) return;
              if (state.timerValue > 0 && state.timeRemaining <= 0) return;
              moveToNextPosition();
            }, effectiveDelay);
            
            console.log('[TTS_TOGGLE] WATCHDOG: Recovery complete');
          }
        }, 300); // REQ-TT-5: 250-400ms watchdog delay
      }
      
    } catch (e) {
      console.error('[TTS_TOGGLE] Error during toggle:', e);
      // Rollback on error
      setState(prev => ({ ...prev, ttsEnabled: state.ttsEnabled }));
    }
  }, [state.ttsEnabled, state.delay, state.timerValue, state.timeRemaining, primeAudioContext, moveToNextPosition]);

  const handleToggleLock = useCallback(() => {
    setState(prev => ({ ...prev, controlsLocked: !prev.controlsLocked }));
  }, []);

  // REQ-13: Remove Next button - keyboard shortcuts only for Space
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

  // REQ-09: Touch/swipe gestures (court only, no slider interference)
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
      
      // Check for horizontal swipe (≥50px) - but only for court interactions
      // Slider interactions are handled by MobileSafeSlider component
      if (Math.abs(deltaX) >= 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
        // Future swipe functionality can be added here if needed
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
      if (nextMoveTimeoutRef.current) clearTimeout(nextMoveTimeoutRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      if (watchdogRef.current) clearTimeout(watchdogRef.current);
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
        
        {/* REQ-07: Centered Stop Overlay with countdown */}
        {state.running && (
          <button
            id="stopOverlayBtn"
            onClick={stopTraining}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                       w-32 h-32 md:w-40 md:h-40 
                       rounded-full flex items-center justify-center font-bold 
                       hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-red-500/50
                       transition-all duration-200 z-50"
            style={{
              // REQ-STOP-BTN-1: Circular button with proper background
              background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
              color: 'white',
              border: '3px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(220, 38, 38, 0.4)',
              // REQ-STOP-FIT-1: Auto-scale text to fit circle (60-80% of diameter)
              fontSize: state.timerValue > 0 ? 'clamp(0.8rem, 4vw, 1.2rem)' : 'clamp(1.2rem, 6vw, 2rem)'
            }}
            aria-label="Stop Training"
          >
            <div className="text-center leading-tight">
              <div className="font-black tracking-wide">STOP</div>
              {/* REQ-TMR-COMP-3: Show countdown only when TimerEnabled = TRUE AND running */}
              {state.timerValue > 0 && (
                <div className="text-xs md:text-sm opacity-90 mt-1 font-mono">
                  {Math.floor(state.timeRemaining / 60)}:{(state.timeRemaining % 60).toString().padStart(2, '0')}
                </div>
              )}
            </div>
          </button>
        )}
      </main>

      {/* REQ-08: Controls - Always Visible */}
      <footer className={`px-4 py-6 ${state.running ? 'opacity-80' : 'opacity-100'} transition-opacity duration-300`}>
        <div className="max-w-4xl mx-auto">
          <TrainingControls
            isRunning={state.running}
            score={state.score}
            totalScore={state.totalScore}
            delay={state.delay}
            timerValue={state.timerValue}
            mode={state.mode}
            ttsEnabled={state.ttsEnabled}
            controlsLocked={state.controlsLocked}
            onStart={startTraining}
            onStop={stopTraining}
            onReset={hardReset}
            onHome={goHome}
            onDelayChange={handleDelayChange}
            onTimerChange={handleTimerChange}
            onModeChange={handleModeChange}
            onTtsToggle={handleTtsToggle}
            onToggleLock={handleToggleLock}
          />
        </div>
      </footer>
    </div>
  );
};

export default TrainingApp;