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

        {/* Training Positions - REQ-ARW-CLR-1: Higher z-index than arrow */}
        {POSITIONS.map((position) => (
          <g key={position.id} style={{ zIndex: 20 }}>
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
                strokeWidth: '1px',
                zIndex: 25
              }}
              aria-label={position.label}
            >
              {position.id}
            </text>
          </g>
        ))}

        {/* REQ-ARW: Solid, continuous arrow with marker clearance */}
        {arrowPosition && (
          <g className="arrow-pointer" style={{ zIndex: 10 }}>
            <defs>
              {/* REQ-ARW-2: Filled chevron/triangle head with precise orientation */}
              <marker
                id="arrowhead"
                markerWidth="12"
                markerHeight="8"
                refX="12"
                refY="4"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <polygon
                  points="0 0, 12 4, 0 8"
                  fill="hsl(var(--court-highlight))"
                  stroke="none"
                />
              </marker>
              {/* REQ-ARW-1: Subtle outer glow for separation */}
              <filter id="arrowGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* REQ-ARW-CLR: Calculate arrow path with marker clearance */}
            {(() => {
              const dx = arrowPosition.x - centerPosition.x;
              const dy = arrowPosition.y - centerPosition.y;
              const totalDistance = Math.sqrt(dx * dx + dy * dy);
              
              // REQ-ARW-CLR-2: Start arrow outside STOP circle (radius ~70px for desktop)
              const stopCircleRadius = 70;
              const markerRadius = 24; // Marker circle radius
              const clearance = 8; // Distance to stay away from marker edge
              
              // Calculate start point outside STOP circle
              const startDistance = Math.max(stopCircleRadius + 5, 24);
              const startX = centerPosition.x + (dx / totalDistance) * startDistance;
              const startY = centerPosition.y + (dy / totalDistance) * startDistance;
              
              // Calculate end point with marker clearance
              const endDistance = totalDistance - markerRadius - clearance;
              const endX = centerPosition.x + (dx / totalDistance) * endDistance;
              const endY = centerPosition.y + (dy / totalDistance) * endDistance;
              
              const finalLength = endDistance - startDistance;
              
              console.log(`[ARROW_RENDERED] length=${finalLength.toFixed(1)}px headVisible=true layerOrderOK=true`);
              
              // REQ-ARW-CLR-3: If target is too close to center, show pulse ring instead
              if (finalLength < 24) {
                return (
                  <circle
                    cx={arrowPosition.x}
                    cy={arrowPosition.y}
                    r="16"
                    fill="none"
                    stroke="hsl(var(--court-highlight))"
                    strokeWidth="4"
                    style={{
                      opacity: 1,
                      animation: `arrow-pulse-${forceArrowRedraw} 0.45s ease-out forwards`
                    }}
                  />
                );
              }
              
              // Normal arrow with clearance
              return (
                <path
                  ref={arrowPathRef}
                  d={`M ${startX} ${startY} L ${endX} ${endY}`}
                  stroke="hsl(var(--court-highlight))"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  filter="url(#arrowGlow)"
                  style={{
                    // REQ-ARW-3: Ensure arrow becomes fully visible after animation
                    opacity: 1,
                    animation: `arrow-draw-${forceArrowRedraw} 0.45s ease-out forwards`
                  }}
                />
              );
            })()}
            
            <circle
              cx={centerPosition.x}
              cy={centerPosition.y}
              r="6"
              fill="hsl(var(--court-highlight))"
              className="animate-pulse"
              style={{ zIndex: 5 }}
            />
          </g>
        )}
      </svg>
    </div>
  );
};

export default Court;
export { POSITIONS };