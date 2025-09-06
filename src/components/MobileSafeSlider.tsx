import React, { useRef, useCallback, useState } from 'react';
import { Lock, LockOpen } from 'lucide-react';

interface MobileSafeSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  disabled?: boolean;
  locked?: boolean;
  onValueChange: (value: number) => void;
  onToggleLock?: () => void;
  formatter?: (value: number) => string;
}

const MobileSafeSlider: React.FC<MobileSafeSliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  unit = '',
  disabled = false,
  locked = false,
  onValueChange,
  onToggleLock,
  formatter
}) => {
  const sliderRef = useRef<HTMLInputElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startTouch, setStartTouch] = useState<{ x: number; y: number } | null>(null);
  const [currentPreview, setCurrentPreview] = useState<number | null>(null);

  const formatValue = formatter || ((val: number) => `${val}${unit}`);

  // Snap value to step
  const snapToStep = useCallback((val: number): number => {
    const snapped = Math.round((val - min) / step) * step + min;
    return Math.max(min, Math.min(max, snapped));
  }, [min, max, step]);

  // Handle touch start - check if starting on thumb
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || locked) return;
    
    const touch = e.touches[0];
    const slider = sliderRef.current;
    const track = trackRef.current;
    
    if (!slider || !track) return;

    const trackRect = track.getBoundingClientRect();
    const thumbPosition = ((value - min) / (max - min)) * trackRect.width + trackRect.left;
    const touchX = touch.clientX;
    
    // Dead zone around thumb (±20px for easier mobile interaction)
    const thumbTolerance = 20;
    const onThumb = Math.abs(touchX - thumbPosition) <= thumbTolerance;
    
    if (!onThumb) return;
    
    console.log(`[SLIDER-${label}] Touch start on thumb: onThumb=${onThumb}`);
    
    setStartTouch({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
    setCurrentPreview(value);
    
    e.preventDefault();
  }, [disabled, locked, value, min, max, label]);

  // Handle touch move - check direction and update preview
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !startTouch || disabled || locked) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startTouch.x;
    const deltaY = touch.clientY - startTouch.y;
    
    // Direction filter: horizontal motion must dominate
    const horizontalDominance = Math.abs(deltaX) > Math.abs(deltaY) * 1.5;
    
    // Gesture dead-zone: ignore tiny movements (±5px)
    const significantMovement = Math.abs(deltaX) > 5;
    
    if (!horizontalDominance || !significantMovement) {
      return;
    }
    
    const track = trackRef.current;
    if (!track) return;
    
    const trackRect = track.getBoundingClientRect();
    const percentage = deltaX / trackRect.width;
    const valueChange = percentage * (max - min);
    const newValue = snapToStep(value + valueChange);
    
    console.log(`[SLIDER-${label}] Touch move: deltaX=${deltaX}, newValue=${newValue}`);
    
    setCurrentPreview(newValue);
    e.preventDefault();
  }, [isDragging, startTouch, disabled, locked, value, min, max, snapToStep, label]);

  // Handle touch end - commit value
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    
    console.log(`[SLIDER-${label}] Touch end: committing value=${currentPreview}`);
    
    if (currentPreview !== null && currentPreview !== value) {
      onValueChange(currentPreview);
    }
    
    setIsDragging(false);
    setStartTouch(null);
    setCurrentPreview(null);
    e.preventDefault();
  }, [isDragging, currentPreview, value, onValueChange, label]);

  // Prevent click propagation when disabled/locked
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (disabled || locked) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, [disabled, locked]);

  // Standard mouse/desktop handling
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || locked) return;
    
    const newValue = snapToStep(Number(e.target.value));
    console.log(`[SLIDER-${label}] Standard change: ${newValue}`);
    onValueChange(newValue);
  }, [disabled, locked, snapToStep, onValueChange, label]);

  const displayValue = currentPreview !== null ? currentPreview : value;
  const isLockable = onToggleLock !== undefined;

  return (
    <div className="space-y-2">
      <label className="flex items-center justify-between text-sm font-medium text-card-foreground">
        <span className="flex items-center gap-2">
          {label}
          {isLockable && (
            <button
              onClick={onToggleLock}
              className={`p-1 rounded transition-colors ${
                locked 
                  ? 'text-warning hover:text-warning/80' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-label={`${locked ? 'Unlock' : 'Lock'} ${label} control`}
              title={locked ? `Locked - tap to unlock ${label}` : `Unlocked - tap to lock ${label}`}
            >
              {locked ? <Lock size={14} /> : <LockOpen size={14} />}
            </button>
          )}
        </span>
        <span className={`text-success ${isDragging ? 'font-bold' : ''}`}>
          {formatValue(displayValue)}
        </span>
      </label>
      
      <div 
        ref={trackRef}
        className={`relative w-full h-8 flex items-center ${
          locked ? 'cursor-not-allowed' : 'cursor-pointer'
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
      >
        <input
          ref={sliderRef}
          type="range"
          min={min}
          max={max}
          step={step}
          value={displayValue}
          onChange={handleChange}
          disabled={disabled || locked}
          className={`slider-input w-full ${
            locked ? 'opacity-50 cursor-not-allowed' : ''
          } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          aria-label={`${label} ${locked ? '(locked)' : ''}`}
        />
        
        {/* Lock indicator overlay */}
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-warning/20 text-warning px-2 py-1 rounded text-xs font-medium">
              Locked
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileSafeSlider;