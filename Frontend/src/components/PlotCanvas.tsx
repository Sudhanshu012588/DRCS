import React, { useRef, useState, useMemo } from 'react';
import type { Point, UnitSystem } from '../types';
import { convertFromFeet } from '../types';

interface PlotCanvasProps {
  gridDomainFt: number;  // Storage in Feet
  gridDomainInUnit: number; // Value in Active Unit
  nodes: Point[];
  onCanvasClickNode: (p: Point) => void;
  isClosed: boolean;
  unit: UnitSystem;
}

export const PlotCanvas: React.FC<PlotCanvasProps> = ({
  gridDomainFt,
  gridDomainInUnit,
  nodes,
  onCanvasClickNode,
  isClosed,
  unit
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverGridPoint, setHoverGridPoint] = useState<Point | null>(null);

  // Dynamically calculate grid division steps based on user domain input
  const { majorStepUnit, ticksCount } = useMemo(() => {
    let step = gridDomainInUnit / 5;
    if (step <= 0) step = 1;
    return {
      majorStepUnit: step,
      ticksCount: 5
    };
  }, [gridDomainInUnit]);

  const viewSize = 600;
  const padding = 50;
  const effectiveSize = viewSize - padding * 2;

  const toSvgX = (xInFt: number) => padding + (xInFt / (gridDomainFt || 1)) * effectiveSize;
  const toSvgY = (yInFt: number) => viewSize - padding - (yInFt / (gridDomainFt || 1)) * effectiveSize;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isClosed || gridDomainFt <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const scale = viewSize / rect.width;
    const svgX = mouseX * scale;
    const svgY = mouseY * scale;

    const rawX = ((svgX - padding) / effectiveSize) * gridDomainFt;
    const rawY = ((viewSize - padding - svgY) / effectiveSize) * gridDomainFt;

    const snappedX = Math.max(0, Math.min(gridDomainFt, Math.round(rawX)));
    const snappedY = Math.max(0, Math.min(gridDomainFt, Math.round(rawY)));

    setHoverGridPoint({ x: snappedX, y: snappedY });
  };

  return (
    <div ref={containerRef} className="relative w-full aspect-square bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
      <svg
        viewBox={`0 0 ${viewSize} ${viewSize}`}
        className="w-full h-full select-none cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverGridPoint(null)}
        onClick={() => {
          if (hoverGridPoint && !isClosed) {
            onCanvasClickNode(hoverGridPoint);
          }
        }}
      >
        <defs>
          <pattern id="majorGrid" width={effectiveSize / 5} height={effectiveSize / 5} patternUnits="userSpaceOnUse">
            <path d={`M ${effectiveSize / 5} 0 L 0 0 0 ${effectiveSize / 5}`} fill="none" stroke="#1E293B" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Dynamic SVG Grid Pattern */}
        <rect x={padding} y={padding} width={effectiveSize} height={effectiveSize} fill="url(#majorGrid)" stroke="#334155" strokeWidth="1.5" />

        {/* Origin Axes */}
        <line x1={padding} y1={viewSize - padding} x2={viewSize - padding} y2={viewSize - padding} stroke="#EF4444" strokeWidth="2" />
        <line x1={padding} y1={padding} x2={padding} y2={viewSize - padding} stroke="#22C55E" strokeWidth="2" />
        <text x={viewSize - padding + 10} y={viewSize - padding + 4} fill="#EF4444" fontSize="10" fontFamily="monospace" fontWeight="bold">+X</text>
        <text x={padding - 4} y={padding - 10} fill="#22C55E" fontSize="10" fontFamily="monospace" fontWeight="bold">+Y</text>

        {/* Axis Ticks in Typed Active Unit */}
        {Array.from({ length: ticksCount + 1 }).map((_, i) => {
          const valInUnit = i * majorStepUnit;
          const fraction = i / ticksCount;
          const posX = padding + fraction * effectiveSize;
          const posY = viewSize - padding - fraction * effectiveSize;
          const labelVal = valInUnit.toFixed(unit === 'm' ? 1 : 0);

          return (
            <g key={`tick-${i}`}>
              <text x={posX} y={viewSize - padding + 16} fill="#64748B" fontSize="9" fontFamily="monospace" textAnchor="middle">
                {labelVal}{unit}
              </text>
              <text x={padding - 12} y={posY + 3} fill="#64748B" fontSize="9" fontFamily="monospace" textAnchor="end">
                {labelVal}{unit}
              </text>
            </g>
          );
        })}

        {/* Boundary Path */}
        {nodes.length > 1 && (
          <polyline
            points={nodes.map(p => `${toSvgX(p.x)},${toSvgY(p.y)}`).join(' ')}
            fill={isClosed ? 'rgba(6, 182, 212, 0.15)' : 'none'}
            stroke="#06B6D4"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Segment Dimension Badges */}
        {nodes.map((curr, idx) => {
          if (idx === 0) return null;
          const prev = nodes[idx - 1];
          const midX = (toSvgX(prev.x) + toSvgX(curr.x)) / 2;
          const midY = (toSvgY(prev.y) + toSvgY(curr.y)) / 2;
          const distFt = Math.hypot(curr.x - prev.x, curr.y - prev.y);

          if (distFt === 0) return null;

          const labelVal = convertFromFeet(distFt, unit).toFixed(unit === 'm' ? 1 : 0);

          return (
            <g key={`dim-${idx}`}>
              <rect x={midX - 24} y={midY - 9} width="48" height="16" rx="3" fill="#090D16" stroke="#06B6D4" strokeWidth="0.8" />
              <text x={midX} y={midY + 3} fill="#F59E0B" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                {labelVal} {unit}
              </text>
            </g>
          );
        })}

        {/* Hover Ray Line */}
        {!isClosed && nodes.length > 0 && hoverGridPoint && (
          <line
            x1={toSvgX(nodes[nodes.length - 1].x)}
            y1={toSvgY(nodes[nodes.length - 1].y)}
            x2={toSvgX(hoverGridPoint.x)}
            y2={toSvgY(hoverGridPoint.y)}
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        )}

        {/* Node Points */}
        {nodes.map((p, idx) => {
          const isOrigin = idx === 0;
          return (
            <g key={`node-${idx}`}>
              <circle
                cx={toSvgX(p.x)}
                cy={toSvgY(p.y)}
                r={isOrigin ? 6 : 4}
                fill={isOrigin ? '#10B981' : '#06B6D4'}
                stroke="#020617"
                strokeWidth="2"
              />
              <text
                x={toSvgX(p.x) + 8}
                y={toSvgY(p.y) - 8}
                fill="#94A3B8"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                N{idx + 1}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};