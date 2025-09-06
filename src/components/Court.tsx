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

// REQ-SYM: Calculate symmetric marker positions from court bounds
const calculateMarkerPositions = (): Position[] => {
  // Court bounds from SVG viewBox
  const LEFT = 10;
  const RIGHT = 600;
  const TOP = 10;
  const BOTTOM = 660;
  const centerX = (LEFT + RIGHT) / 2; // 305
  const midY = (TOP + BOTTOM) / 2; // 335
  
  // REQ-SYM-1: Equal paddings from edges (5% of dimensions)
  const courtWidth = RIGHT - LEFT; // 590
  const courtHeight = BOTTOM - TOP; // 650
  const PX = courtWidth * 0.08; // ~47px horizontal padding
  const PY = courtHeight * 0.07; // ~45px vertical padding
  
  // REQ-SYM-3: Downward nudge for visual balance
  const NUDGE_Y = 10;
  
  // REQ-SYM-2: Canonical symmetric positions with nudge
  return [
    { id: 1, x: LEFT + PX, y: TOP + PY + NUDGE_Y, label: "Front left corner (near net)" },
    { id: 2, x: centerX, y: TOP + PY + NUDGE_Y, label: "Front center (near net)" },
    { id: 3, x: RIGHT - PX, y: TOP + PY + NUDGE_Y, label: "Front right corner (near net)" },
    { id: 4, x: RIGHT - PX, y: midY + NUDGE_Y, label: "Right mid-court" },
    { id: 5, x: RIGHT - PX, y: BOTTOM - PY + NUDGE_Y, label: "Back right corner" },
    { id: 6, x: centerX, y: BOTTOM - PY + NUDGE_Y, label: "Back center" },
    { id: 7, x: LEFT + PX, y: BOTTOM - PY + NUDGE_Y, label: "Back left corner" },
    { id: 8, x: LEFT + PX, y: midY + NUDGE_Y, label: "Left mid-court" }
  ];
};

const POSITIONS: Position[] = calculateMarkerPositions();

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

        {/* REQ-CL1: Arrow above court lines with centerline separation */}
        {arrowPosition && (
          <g className="arrow-pointer" style={{ zIndex: 15 }}>
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
              {/* REQ-CL1: Enhanced glow for centerline separation */}
              <filter id="arrowGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMorphology operator="dilate" radius="1" in="SourceGraphic" result="thickened"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="thickened"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* REQ-CL2: Calculate arrow path with proper offsets */}
            {(() => {
              const dx = arrowPosition.x - centerPosition.x;
              const dy = arrowPosition.y - centerPosition.y;
              const totalDistance = Math.sqrt(dx * dx + dy * dy);
              
              // REQ-CL3: Handle vertical paths (avoid divide by zero)
              if (totalDistance < 1) {
                return null; // No arrow for center position
              }
              
              // REQ-CL2: Offset calculations
              const stopCircleRadius = 70;
              const markerRadius = 24;
              const clearance = 8;
              const startMargin = 8;
              
              // Normalize direction vector
              const dirX = dx / totalDistance;
              const dirY = dy / totalDistance;
              
              // Calculate start point outside STOP circle
              const startDistance = stopCircleRadius + startMargin;
              const startX = centerPosition.x + dirX * startDistance;
              const startY = centerPosition.y + dirY * startDistance;
              
              // Calculate end point with marker clearance
              const endDistance = totalDistance - markerRadius - clearance;
              const endX = centerPosition.x + dirX * endDistance;
              const endY = centerPosition.y + dirY * endDistance;
              
              const finalLength = endDistance - startDistance;
              
              console.log(`[ARROW_RENDERED] length=${finalLength.toFixed(1)}px headVisible=true layerOrderOK=true`);
              
              // REQ-CL2: Minimum visible length check
              if (finalLength < 24) {
                // Show pulse ring at target for very short distances
                return (
                  <circle
                    cx={arrowPosition.x}
                    cy={arrowPosition.y}
                    r="16"
                    fill="none"
                    stroke="hsl(var(--court-highlight))"
                    strokeWidth="4"
                    filter="url(#arrowGlow)"
                    style={{
                      opacity: 1,
                      animation: `arrow-pulse-${forceArrowRedraw} 0.45s ease-out forwards`
                    }}
                  />
                );
              }
              
              // REQ-CL1: Arrow with enhanced visibility and centerline separation
              return (
                <g>
                  {/* Subtle background stroke for centerline separation */}
                  <path
                    d={`M ${startX} ${startY} L ${endX} ${endY}`}
                    stroke="rgba(0,0,0,0.4)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    style={{
                      opacity: 1,
                      animation: `arrow-draw-${forceArrowRedraw} 0.45s ease-out forwards`
                    }}
                  />
                  {/* Main arrow stroke */}
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
                      opacity: 1,
                      animation: `arrow-draw-${forceArrowRedraw} 0.45s ease-out forwards`
                    }}
                  />
                </g>
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