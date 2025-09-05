import React from 'react';
import { Play, Pause, Square, SkipForward, RotateCcw, Home, Volume2 } from 'lucide-react';

interface TrainingControlsProps {
  isRunning: boolean;
  score: number;
  delay: number;
  timerValue: number;
  mode: string;
  ttsEnabled: boolean;
  onStart: () => void;
  onStop: () => void;
  onNext: () => void;
  onReset: () => void;
  onHome: () => void;
  onDelayChange: (value: number) => void;
  onTimerChange: (value: number) => void;
  onModeChange: (mode: string) => void;
  onTtsToggle: () => void;
}

const TRAINING_MODES = [
  'full-court',
  'front-court',
  'back-court',
  'corners',
  'left-side',
  'right-side',
  'random-1-2-3-4-8',
  'random-4-5-6-7-8',
  'random-4-8',
  'random-2-4-6-8',
  'random-1-5',
  'random-2-6',
  'random-3-7',
  'random-5-7',
  'random-1-3-6'
];

const TrainingControls: React.FC<TrainingControlsProps> = ({
  isRunning,
  score,
  delay,
  timerValue,
  mode,
  ttsEnabled,
  onStart,
  onStop,
  onNext,
  onReset,
  onHome,
  onDelayChange,
  onTimerChange,
  onModeChange,
  onTtsToggle
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="control-panel">
      {/* Score Display */}
      <div className="flex justify-center mb-6">
        <div className="bg-success/20 rounded-2xl px-6 py-3 border border-success/30">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{score}</div>
            <div className="text-xs text-success/80">Score</div>
          </div>
        </div>
      </div>

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
          onClick={onNext}
          className="btn-secondary"
          disabled={!isRunning}
          aria-label="Next position"
        >
          <SkipForward size={18} />
          <span className="ml-2">Next</span>
        </button>
        
        <button
          onClick={onReset}
          className="btn-secondary"
          aria-label="Reset training"
        >
          <RotateCcw size={18} />
          <span className="ml-2">Reset</span>
        </button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Delay Control */}
        <div className="space-y-2">
          <label className="flex items-center justify-between text-sm font-medium text-card-foreground">
            <span>Delay</span>
            <span className="text-success">{delay}s</span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={delay}
            onChange={(e) => onDelayChange(Number(e.target.value))}
            className="slider-input"
            aria-label="Training delay in seconds"
          />
        </div>

        {/* Timer Control */}
        <div className="space-y-2">
          <label className="flex items-center justify-between text-sm font-medium text-card-foreground">
            <span>Timer</span>
            <span className="text-success">{formatTime(timerValue)}</span>
          </label>
          <input
            type="range"
            min="0"
            max="600"
            step="30"
            value={timerValue}
            onChange={(e) => onTimerChange(Number(e.target.value))}
            className="slider-input"
            aria-label="Training timer in seconds"
          />
        </div>

        {/* Mode Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-card-foreground">
            Training Mode
          </label>
          <select
            value={mode}
            onChange={(e) => onModeChange(e.target.value)}
            className="w-full px-3 py-2 bg-input border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Select training mode"
          >
            {TRAINING_MODES.map((modeOption) => (
              <option key={modeOption} value={modeOption}>
                {modeOption.charAt(0).toUpperCase() + modeOption.slice(1).replace('-', ' ')}
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

      {/* Home Button */}
      <div className="flex justify-center mt-6">
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