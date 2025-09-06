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

        {/* REQ-AR-2: Arrow above court lines with proper layering */}
        {arrowPosition && (
          <g className="arrow-container" style={{ zIndex: 15 }}>
            {/* REQ-AR-1: Subtle halo for centerline separation (no heavy filters) */}
            <defs>
              <filter id="arrowHalo" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.5" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* REQ-AR-3: Calculate arrow path with proper offsets */}
            {(() => {
              const dx = arrowPosition.x - centerPosition.x;
              const dy = arrowPosition.y - centerPosition.y;
              const totalDistance = Math.sqrt(dx * dx + dy * dy);
              
              // REQ-AR-4: Handle vertical paths explicitly
              if (totalDistance < 1) {
                console.log(`[ARROW_DIAGNOSTIC] target=center visible=false reason=zero_distance`);
                return null; // No arrow for center position
              }
              
              // REQ-AR-3: Offset calculations
              const stopCircleRadius = 70;
              const markerRadius = 24;
              const clearance = 8;
              const startMargin = 8;
              
              // Normalize direction vector (REQ-AR-4: robust for vertical)
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
              
              // REQ-AR-6: Diagnostic logging
              const targetPosition = POSITIONS.find(p => 
                Math.abs(p.x - arrowPosition.x) < 5 && Math.abs(p.y - arrowPosition.y) < 5
              );
              const orientation = Math.abs(dirX) < 0.1 ? (dirY < 0 ? 'up' : 'down') : 
                                 Math.abs(dirY) < 0.1 ? (dirX < 0 ? 'left' : 'right') : 'diagonal';
              
              console.log(`[ARROW_DIAGNOSTIC] target=${targetPosition?.id || 'unknown'} length=${finalLength.toFixed(1)}px orientation=${orientation} layerOrder=OK`);
              
              // REQ-AR-3: Minimum visible length check
              if (finalLength < 24) {
                console.log(`[ARROW_DIAGNOSTIC] target=${targetPosition?.id} visible=pulse reason=short_distance`);
                return (
                  <circle
                    cx={arrowPosition.x}
                    cy={arrowPosition.y}
                    r="16"
                    fill="none"
                    stroke="#FFD700"
                    strokeWidth="4"
                    filter="url(#arrowHalo)"
                    style={{
                      opacity: 1,
                      animation: `arrow-pulse-${forceArrowRedraw} 0.45s ease-out forwards`
                    }}
                  />
                );
              }
              
              // REQ-AR-1: Calculate arrowhead as solid polygon
              const headLength = 16;
              const headWidth = 10;
              
              // Calculate arrowhead points
              const headTipX = endX;
              const headTipY = endY;
              const headBaseX = endX - dirX * headLength;
              const headBaseY = endY - dirY * headLength;
              
              // Perpendicular vector for head width
              const perpX = -dirY;
              const perpY = dirX;
              
              const headPoint1X = headBaseX + perpX * headWidth;
              const headPoint1Y = headBaseY + perpY * headWidth;
              const headPoint2X = headBaseX - perpX * headWidth;
              const headPoint2Y = headBaseY - perpY * headWidth;
              
              // Adjust body end to connect cleanly with head
              const bodyEndX = headBaseX;
              const bodyEndY = headBaseY;
              
              // REQ-AR-1: Fixed high-contrast colors, solid primitives
              return (
                <g>
                  {/* Background stroke for centerline separation */}
                  <path
                    d={`M ${startX} ${startY} L ${bodyEndX} ${bodyEndY}`}
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
                  
                  {/* REQ-AR-1: Main arrow body - solid, fixed color */}
                  <path
                    d={`M ${startX} ${startY} L ${bodyEndX} ${bodyEndY}`}
                    stroke="#FFD700"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    filter="url(#arrowHalo)"
                    style={{
                      opacity: 1,
                      animation: `arrow-draw-${forceArrowRedraw} 0.45s ease-out forwards`
                    }}
                  />
                  
                  {/* REQ-AR-1: Solid arrowhead polygon - no marker-end */}
                  <polygon
                    points={`${headTipX},${headTipY} ${headPoint1X},${headPoint1Y} ${headPoint2X},${headPoint2Y}`}
                    fill="#FFD700"
                    stroke="rgba(0,0,0,0.4)"
                    strokeWidth="1"
                    filter="url(#arrowHalo)"
                    style={{
                      opacity: 1,
                      animation: `arrow-draw-${forceArrowRedraw} 0.45s ease-out forwards`
                    }}
                  />
                </g>
              );
            })()}
            
            {/* Center position indicator */}
            <circle
              cx={centerPosition.x}
              cy={centerPosition.y}
              r="6"
              fill="#FFD700"
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