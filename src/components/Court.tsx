import React from 'react';

export interface Position {
  id: number;
  x: number;
  y: number;
  label: string;
}

interface CourtProps {
  positions: Position[];
  activePosition: number | null;
  arrowPosition: { x: number; y: number } | null;
  forceArrowRedraw?: number; // Add counter to force arrow redraw
}

// REQ-12: Positions shifted upward by 8px for better visual balance
const POSITIONS: Position[] = [
  { id: 1, x: 56, y: 38, label: "Front left corner (near net)" },
  { id: 2, x: 305, y: 36, label: "Front center (near net)" },
  { id: 3, x: 554, y: 38, label: "Front right corner (near net)" },
  { id: 4, x: 552, y: 318, label: "Right mid-court" },
  { id: 5, x: 554, y: 587, label: "Back right corner" },
  { id: 6, x: 305, y: 587, label: "Back center" },
  { id: 7, x: 56, y: 587, label: "Back left corner" },
  { id: 8, x: 58, y: 318, label: "Left mid-court" }
];

const Court: React.FC<CourtProps> = ({ activePosition, arrowPosition, forceArrowRedraw = 0 }) => {
  const centerPosition = { x: 305, y: 360 };
  const arrowPathRef = React.useRef<SVGPathElement>(null);

  return (
    <div className="court-container w-full max-w-[610px] mx-auto p-6">
      <svg
        width="610"
        height="670"
        viewBox="0 0 610 670"
        className="w-full h-auto"
        role="img"
        aria-label="Badminton court half with training positions"
      >
        {/* Court Surface */}
        <rect
          x="10"
          y="10"
          width="590"
          height="650"
          fill="hsl(var(--court-surface))"
          stroke="hsl(var(--court-lines))"
          strokeWidth="3"
          rx="8"
        />
        
        {/* Net Line (top) */}
        <line
          x1="10"
          y1="10"
          x2="600"
          y2="10"
          stroke="hsl(var(--court-lines))"
          strokeWidth="4"
        />
        
        {/* Baseline (bottom) */}
        <line
          x1="10"
          y1="660"
          x2="600"
          y2="660"
          stroke="hsl(var(--court-lines))"
          strokeWidth="3"
        />
        
        {/* Left Sideline */}
        <line
          x1="10"
          y1="10"
          x2="10"
          y2="660"
          stroke="hsl(var(--court-lines))"
          strokeWidth="3"
        />
        
        {/* Right Sideline */}
        <line
          x1="600"
          y1="10"
          x2="600"
          y2="660"
          stroke="hsl(var(--court-lines))"
          strokeWidth="3"
        />
        
        {/* Center Line (vertical) */}
        <line
          x1="305"
          y1="10"
          x2="305"
          y2="660"
          stroke="hsl(var(--court-lines))"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        
        {/* Service Lines */}
        <line
          x1="76"
          y1="198"
          x2="534"
          y2="198"
          stroke="hsl(var(--court-lines))"
          strokeWidth="2"
        />
        
        <line
          x1="76"
          y1="472"
          x2="534"
          y2="472"
          stroke="hsl(var(--court-lines))"
          strokeWidth="2"
        />
        
        {/* Left Service Box */}
        <line
          x1="76"
          y1="198"
          x2="76"
          y2="472"
          stroke="hsl(var(--court-lines))"
          strokeWidth="2"
        />
        
        {/* Right Service Box */}
        <line
          x1="534"
          y1="198"
          x2="534"
          y2="472"
          stroke="hsl(var(--court-lines))"
          strokeWidth="2"
        />

        {/* Training Positions */}
        {POSITIONS.map((position) => (
          <g key={position.id}>
            <circle
              cx={position.x}
              cy={position.y}
              r="24"
              className={`court-position ${activePosition === position.id ? 'active' : ''}`}
            />
            <text
              x={position.x}
              y={position.y + 6}
              textAnchor="middle"
              className="text-lg font-bold select-none"
              style={{
                fill: 'white',
                paintOrder: 'stroke',
                stroke: 'rgba(0,0,0,0.45)',
                strokeWidth: '1px'
              }}
              aria-label={position.label}
            >
              {position.id}
            </text>
          </g>
        ))}

        {/* REQ-ARW: Solid, continuous arrow with attached arrowhead */}
        {arrowPosition && (
          <g className="arrow-pointer">
            <defs>
              {/* REQ-ARW-2: Filled chevron/triangle head with precise orientation */}
              <marker
                id="arrowhead"
                markerWidth="14"
                markerHeight="10"
                refX="14"
                refY="5"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <polygon
                  points="0 0, 14 5, 0 10"
                  fill="hsl(var(--court-highlight))"
                  stroke="none"
                />
              </marker>
              {/* REQ-ARW-1: Subtle outer glow for separation */}
              <filter id="arrowGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {/* REQ-ARW-1: Thick, continuous stroke with rounded caps */}
            <path
              ref={arrowPathRef}
              d={`M ${centerPosition.x} ${centerPosition.y} L ${arrowPosition.x} ${arrowPosition.y}`}
              stroke="hsl(var(--court-highlight))"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              markerEnd="url(#arrowhead)"
              filter="url(#arrowGlow)"
              style={{
                // REQ-ARW-3: Animation restarts on each move
                opacity: 0,
                animation: `arrow-draw-${forceArrowRedraw} 0.45s ease-out forwards`
              }}
            />
            <circle
              cx={centerPosition.x}
              cy={centerPosition.y}
              r="6"
              fill="hsl(var(--court-highlight))"
              className="animate-pulse"
            />
          </g>
        )}
      </svg>
    </div>
  );
};

export default Court;
export { POSITIONS };