import React from 'react';
import { Play, Pause, RotateCcw, Home, Volume2, Lock, LockOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileSafeSlider from './MobileSafeSlider';

interface TrainingControlsProps {
  isRunning: boolean;
  score: number;
  totalScore: number;
  delay: number;
  timerValue: number;
  mode: string;
  ttsEnabled: boolean;
  controlsLocked: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onHome: () => void;
  onDelayChange: (value: number) => void;
  onTimerChange: (value: number) => void;
  onModeChange: (mode: string) => void;
  onTtsToggle: () => void;
  onToggleLock: () => void;
}

// REQ-11: Training modes with explicit position labels
const TRAINING_MODES = [
  { value: 'full-court', label: 'Full court (1-2-3-4-5-6-7-8)' },
  { value: 'front-court', label: 'Front Court (1-2-3)' },
  { value: 'back-court', label: 'Back Court (5-6-7)' },
  { value: 'corners', label: 'Corners (1-3-5-7)' },
  { value: 'left-side', label: 'Left Side (1-7-8)' },
  { value: 'right-side', label: 'Right Side (3-4-5)' },
  { value: 'random-1-2-3-4-8', label: 'Random 1-2-3-4-8' },
  { value: 'random-4-5-6-7-8', label: 'Random 4-5-6-7-8' },
  { value: 'random-4-8', label: 'Random 4-8' },
  { value: 'random-2-4-6-8', label: 'Random 2-4-6-8' },
  { value: 'random-1-5', label: 'Random 1-5' },
  { value: 'random-2-6', label: 'Random 2-6' },
  { value: 'random-3-7', label: 'Random 3-7' },
  { value: 'random-5-7', label: 'Random 5-7' },
  { value: 'random-1-3-6', label: 'Random 1-3-6' }
];

const TrainingControls: React.FC<TrainingControlsProps> = ({
  isRunning,
  score,
  totalScore,
  delay,
  timerValue,
  mode,
  ttsEnabled,
  controlsLocked,
  onStart,
  onStop,
  onReset,
  onHome,
  onDelayChange,
  onTimerChange,
  onModeChange,
  onTtsToggle,
  onToggleLock
}) => {
  const navigate = useNavigate();
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="control-panel">
      {/* Score Display */}
      <div className="flex justify-center mb-6 gap-4">
        <div className="bg-success/20 rounded-2xl px-6 py-3 border border-success/30">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{score}</div>
            <div className="text-xs text-success/80">Score</div>
          </div>
        </div>
        <div className="bg-primary/20 rounded-2xl px-6 py-3 border border-primary/30">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{totalScore}</div>
            <div className="text-xs text-primary/80">Total Score</div>
          </div>
        </div>
      </div>

      {/* Lock Status Indicator */}
      {isRunning && controlsLocked && (
        <div className="flex justify-center mb-4">
          <div className="bg-warning/20 text-warning px-3 py-1 rounded-full text-xs font-medium border border-warning/30 flex items-center gap-2">
            <Lock size={12} />
            Controls Locked
          </div>
        </div>
      )}

      {/* Main Control Buttons */}
      <div className="flex justify-center gap-3 mb-6">
        <button
          onClick={isRunning ? onStop : onStart}
          className={isRunning ? 'btn-warning' : 'btn-success'}
          aria-label={isRunning ? 'Stop training' : 'Start training'}
        >
          {isRunning ? <Pause size={18} /> : <Play size={18} />}
          <span className="ml-2">{isRunning ? 'Stop' : 'Start'}</span>
        </button>
        
        <button
          onClick={onReset}
          className="btn-secondary"
          aria-label="Reset training"
        >
          <RotateCcw size={18} />
          <span className="ml-2">Reset</span>
        </button>

        {/* Global Lock Toggle (only when running) */}
        {isRunning && (
          <button
            onClick={onToggleLock}
            className={`btn-training ${
              controlsLocked 
                ? 'bg-warning text-warning-foreground' 
                : 'bg-success text-success-foreground'
            }`}
            aria-label={`${controlsLocked ? 'Unlock' : 'Lock'} all controls`}
          >
            {controlsLocked ? <Lock size={18} /> : <LockOpen size={18} />}
            <span className="ml-2">{controlsLocked ? 'Unlock' : 'Lock'}</span>
          </button>
        )}
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mobile-Safe Delay Control */}
        <MobileSafeSlider
          label="Delay"
          value={delay}
          min={1}
          max={10}
          step={1}
          unit="s"
          locked={controlsLocked}
          onValueChange={onDelayChange}
          onToggleLock={isRunning ? onToggleLock : undefined}
        />

        {/* Mobile-Safe Timer Control */}
        <MobileSafeSlider
          label="Timer"
          value={timerValue}
          min={0}
          max={600}
          step={30}
          locked={controlsLocked}
          onValueChange={onTimerChange}
          onToggleLock={isRunning ? onToggleLock : undefined}
          formatter={formatTime}
        />

        {/* Mode Selection */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-card-foreground">
            <span>Training Mode</span>
            {controlsLocked && <Lock size={14} className="text-warning" />}
          </label>
          <select
            value={mode}
            onChange={(e) => onModeChange(e.target.value)}
            disabled={controlsLocked}
            className={`w-full px-3 py-2 bg-input border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
              controlsLocked ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label={`Select training mode ${controlsLocked ? '(locked)' : ''}`}
          >
            {TRAINING_MODES.map((modeOption) => (
              <option key={modeOption.value} value={modeOption.value}>
                {modeOption.label}
              </option>
            ))}
          </select>
        </div>

        {/* TTS Toggle */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-card-foreground">
            Audio Feedback
          </label>
          <button
            onClick={onTtsToggle}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              ttsEnabled 
                ? 'bg-success/20 text-success border border-success/30' 
                : 'bg-muted text-muted-foreground border border-border'
            }`}
            aria-label={`Text-to-speech ${ttsEnabled ? 'enabled' : 'disabled'}`}
          >
            <Volume2 size={16} />
            <span>{ttsEnabled ? 'TTS On' : 'TTS Off'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center mt-6 gap-3 flex-wrap">
        <button
          onClick={() => navigate('/multi-sport')}
          className="btn-primary"
          aria-label="Go to Multi-Sport Hub"
        >
          <span>Multi-Sport</span>
        </button>
        
        <button
          onClick={() => navigate('/badminton')}
          className="btn-secondary"
          aria-label="Go to Badminton"
        >
          <span>Badminton</span>
        </button>
        
        <button
          onClick={() => navigate('/pickleball')}
          className="btn-secondary"
          aria-label="Go to Pickleball"
        >
          <span>Pickleball</span>
        </button>
        
        <button
          onClick={() => navigate('/table-tennis')}
          className="btn-secondary"
          aria-label="Go to Table Tennis"
        >
          <span>Table Tennis</span>
        </button>
        
        <button
          onClick={() => navigate('/tennis')}
          className="btn-secondary"
          aria-label="Go to Tennis"
        >
          <span>Tennis</span>
        </button>
        
        <button
          onClick={() => navigate('/how-it-works')}
          className="btn-secondary"
          aria-label="Go to How It Works"
        >
          <span>How It Works</span>
        </button>
        
        <button
          onClick={onHome}
          className="btn-secondary"
          aria-label="Return to home"
        >
          <Home size={18} />
          <span className="ml-2">Home</span>
        </button>
      </div>
    </div>
  );
};

export default TrainingControls;
export { TRAINING_MODES };