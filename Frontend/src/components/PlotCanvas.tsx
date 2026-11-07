import React, { useRef, useState, useMemo, useEffect } from 'react';
import type { Point, UnitSystem } from '../types';
import { convertFromFeet, convertToFeet } from '../types';
import { RotateCcw, RotateCw, Trash2, CheckCircle2, Move } from 'lucide-react';

interface PlotCanvasProps {
  gridDomainFt: number;
  gridDomainInUnit: number;
  nodes: Point[];
  onCanvasClickNode: (p: Point) => void;
  isClosed: boolean;
  unit: UnitSystem;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onCloseLoop: () => void;
  onClear: () => void;
}

export const PlotCanvas: React.FC<PlotCanvasProps> = ({
  gridDomainFt,
  gridDomainInUnit,
  nodes,
  onCanvasClickNode,
  isClosed,
  unit,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onCloseLoop,
  onClear
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const distanceInputRef = useRef<HTMLInputElement>(null);
  const angleInputRef = useRef<HTMLInputElement>(null);

  const [hoverGridPoint, setHoverGridPoint] = useState<Point | null>(null);
  const [isOrtho, setIsOrtho] = useState<boolean>(false);

  const [typedDistance, setTypedDistance] = useState<string>('');
  const [typedAngle, setTypedAngle] = useState<string>('');
  const [activeField, setActiveField] = useState<'distance' | 'angle' | null>(null);

  const viewSize = 650;
  const padding = 55;
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

    let snappedX = Math.max(0, Math.min(gridDomainFt, rawX));
    let snappedY = Math.max(0, Math.min(gridDomainFt, rawY));

    if (isOrtho && nodes.length > 0) {
      const lastNode = nodes[nodes.length - 1];
      const dx = Math.abs(snappedX - lastNode.x);
      const dy = Math.abs(snappedY - lastNode.y);

      if (dx >= dy) {
        snappedY = lastNode.y;
      } else {
        snappedX = lastNode.x;
      }
    }

    setHoverGridPoint({ x: snappedX, y: snappedY });
  };

  const liveMouseMetrics = useMemo(() => {
    if (!hoverGridPoint || nodes.length === 0 || isClosed) return null;
    const lastNode = nodes[nodes.length - 1];

    const dxFt = hoverGridPoint.x - lastNode.x;
    const dyFt = hoverGridPoint.y - lastNode.y;

    const distFt = Math.hypot(dxFt, dyFt);
    const distInUnit = convertFromFeet(distFt, unit);

    let rad = Math.atan2(dyFt, dxFt);
    let deg = (rad * (180 / Math.PI) + 360) % 360;

    if (isOrtho) {
      if (deg >= 45 && deg < 135) deg = 90;
      else if (deg >= 135 && deg < 225) deg = 180;
      else if (deg >= 225 && deg < 315) deg = 270;
      else deg = 0;
    }

    const midSvgX = (toSvgX(lastNode.x) + toSvgX(hoverGridPoint.x)) / 2;
    const midSvgY = (toSvgY(lastNode.y) + toSvgY(hoverGridPoint.y)) / 2;

    return {
      distInUnit,
      deg,
      midSvgX,
      midSvgY,
      targetSvgX: toSvgX(hoverGridPoint.x),
      targetSvgY: toSvgY(hoverGridPoint.y)
    };
  }, [hoverGridPoint, nodes, isClosed, unit, isOrtho]);

  const handleFocusDistance = () => {
    setActiveField('distance');
    if (typedDistance === '' && liveMouseMetrics) {
      setTypedDistance(liveMouseMetrics.distInUnit.toFixed(1));
    }
  };

  const handleFocusAngle = () => {
    setActiveField('angle');
    if (typedAngle === '' && liveMouseMetrics) {
      setTypedAngle(liveMouseMetrics.deg.toFixed(1));
    }
  };

  useEffect(() => {
    if (activeField === 'distance') {
      distanceInputRef.current?.focus();
      distanceInputRef.current?.select();
    } else if (activeField === 'angle') {
      angleInputRef.current?.focus();
      angleInputRef.current?.select();
    }
  }, [activeField]);

  const displayDistance = activeField === 'distance' || typedDistance !== ''
    ? typedDistance
    : (liveMouseMetrics ? liveMouseMetrics.distInUnit.toFixed(1) : '');

  const displayAngle = activeField === 'angle' || typedAngle !== ''
    ? typedAngle
    : (liveMouseMetrics ? liveMouseMetrics.deg.toFixed(1) : '');

  const commitDynamicPoint = () => {
    if (nodes.length === 0 || isClosed) return;
    
    const distVal = parseFloat(displayDistance);
    const angleVal = parseFloat(displayAngle);

    if (isNaN(distVal) || isNaN(angleVal) || distVal <= 0) return;

    const distFt = convertToFeet(distVal, unit);
    const rad = angleVal * (Math.PI / 180);
    const lastNode = nodes[nodes.length - 1];

    let nextX = lastNode.x + distFt * Math.cos(rad);
    let nextY = lastNode.y + distFt * Math.sin(rad);

    nextX = Math.max(0, Math.min(gridDomainFt, parseFloat(nextX.toFixed(2))));
    nextY = Math.max(0, Math.min(gridDomainFt, parseFloat(nextY.toFixed(2))));

    onCanvasClickNode({ x: nextX, y: nextY });

    setTypedDistance('');
    setTypedAngle('');
    setActiveField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'F8') {
      e.preventDefault();
      setIsOrtho(prev => !prev);
      return;
    }

    if (isClosed || nodes.length === 0) return;

    if (e.key === 'Tab') {
      e.preventDefault();
      if (!activeField || activeField === 'angle') {
        handleFocusDistance();
      } else {
        handleFocusAngle();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      commitDynamicPoint();
    } else if (e.key === 'Escape') {
      setTypedDistance('');
      setTypedAngle('');
      setActiveField(null);
    }
  };

  const ticksCount = 5;
  const stepUnit = gridDomainInUnit / ticksCount;

  return (
    <div 
      className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-sm flex flex-col h-full min-h-0 space-y-2 font-mono outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* CAD Toolbar Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            AutoCAD CAD Viewport
          </h2>
          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono hidden sm:inline-block">
            [TAB] Edit | [F8] Ortho
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo"
            className="p-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 rounded-lg transition-colors"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo"
            className="p-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 rounded-lg transition-colors"
          >
            <RotateCw size={14} />
          </button>

          <button
            onClick={() => setIsOrtho(!isOrtho)}
            title="Toggle Ortho Mode [F8]"
            className={`px-2 py-0.5 text-xs font-bold rounded-lg flex items-center gap-1 transition-all ${
              isOrtho
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
            }`}
          >
            <Move size={12} className={isOrtho ? 'text-white' : 'text-slate-500'} />
            <span className="text-[10px] uppercase font-mono">ORTHO</span>
          </button>

          <div className="h-4 w-px bg-slate-200 mx-0.5" />

          <button
            onClick={onCloseLoop}
            disabled={isClosed || nodes.length < 3}
            className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 disabled:opacity-30 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
          >
            <CheckCircle2 size={13} /> Close
          </button>
          <button
            onClick={onClear}
            className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
          >
            <Trash2 size={13} /> Reset
          </button>
        </div>
      </div>

      {/* Flexible Dynamic Viewport Box */}
      <div 
        ref={containerRef}
        className="relative flex-1 w-full min-h-0 bg-[#0B0F19] rounded-xl overflow-hidden flex items-center justify-center shadow-inner border border-slate-800"
      >
        <svg
          viewBox={`0 0 ${viewSize} ${viewSize}`}
          className="max-h-full max-w-full aspect-square select-none cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverGridPoint(null)}
          onClick={() => {
            if (hoverGridPoint && !isClosed && !activeField) {
              onCanvasClickNode(hoverGridPoint);
            }
          }}
        >
          <defs>
            <pattern id="cadGridPattern" width={effectiveSize / ticksCount} height={effectiveSize / ticksCount} patternUnits="userSpaceOnUse">
              <path d={`M ${effectiveSize / ticksCount} 0 L 0 0 0 ${effectiveSize / ticksCount}`} fill="none" stroke="#1E293B" strokeWidth="1" />
            </pattern>
          </defs>

          <rect x={padding} y={padding} width={effectiveSize} height={effectiveSize} fill="url(#cadGridPattern)" stroke="#334155" strokeWidth="1.5" />

          <line x1={padding} y1={viewSize - padding} x2={viewSize - padding} y2={viewSize - padding} stroke="#475569" strokeWidth="1.5" />
          <line x1={padding} y1={padding} x2={padding} y2={viewSize - padding} stroke="#475569" strokeWidth="1.5" />
          <text x={viewSize - padding + 8} y={viewSize - padding + 4} fill="#64748B" fontSize="10" fontWeight="bold">+X</text>
          <text x={padding - 4} y={padding - 10} fill="#64748B" fontSize="10" fontWeight="bold">+Y</text>

          {Array.from({ length: ticksCount + 1 }).map((_, i) => {
            const valInUnit = i * stepUnit;
            const fraction = i / ticksCount;
            const posX = padding + fraction * effectiveSize;
            const posY = viewSize - padding - fraction * effectiveSize;
            const labelVal = valInUnit.toFixed(unit === 'm' ? 1 : 0);

            return (
              <g key={`tick-${i}`}>
                <text x={posX} y={viewSize - padding + 16} fill="#64748B" fontSize="9" textAnchor="middle">{labelVal}{unit}</text>
                <text x={padding - 10} y={posY + 3} fill="#64748B" fontSize="9" textAnchor="end">{labelVal}{unit}</text>
              </g>
            );
          })}

          {nodes.length > 1 && (
            <polyline
              points={nodes.map(p => `${toSvgX(p.x)},${toSvgY(p.y)}`).join(' ')}
              fill={isClosed ? 'rgba(6, 182, 212, 0.12)' : 'none'}
              stroke="#00F0FF"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

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
                <rect x={midX - 22} y={midY - 9} width="44" height="16" rx="4" fill="#0F172A" stroke="#00F0FF" strokeWidth="1" />
                <text x={midX} y={midY + 3} fill="#38BDF8" fontSize="9" fontWeight="bold" textAnchor="middle">
                  {labelVal}{unit}
                </text>
              </g>
            );
          })}

          {!isClosed && nodes.length > 0 && liveMouseMetrics && (
            <line
              x1={toSvgX(nodes[nodes.length - 1].x)}
              y1={toSvgY(nodes[nodes.length - 1].y)}
              x2={liveMouseMetrics.targetSvgX}
              y2={liveMouseMetrics.targetSvgY}
              stroke="#F59E0B"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          )}

          {nodes.map((p, idx) => {
            const isOrigin = idx === 0;
            return (
              <g key={`node-${idx}`}>
                <circle
                  cx={toSvgX(p.x)}
                  cy={toSvgY(p.y)}
                  r={isOrigin ? 6 : 4}
                  fill={isOrigin ? '#10B981' : '#00F0FF'}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                <text
                  x={toSvgX(p.x) + 8}
                  y={toSvgY(p.y) - 8}
                  fill="#94A3B8"
                  fontSize="10"
                  fontWeight="bold"
                >
                  N{idx + 1}
                </text>
              </g>
            );
          })}
        </svg>

        {!isClosed && liveMouseMetrics && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 pointer-events-auto flex items-center gap-1.5 bg-[#0F172A]/95 backdrop-blur-md border border-amber-500/80 px-2 py-0.5 rounded-lg shadow-xl"
            style={{
              left: `${(liveMouseMetrics.midSvgX / viewSize) * 100}%`,
              top: `${(liveMouseMetrics.midSvgY / viewSize) * 100}%`
            }}
          >
            <div className="flex items-center gap-1">
              <input
                ref={distanceInputRef}
                type="text"
                inputMode="decimal"
                value={displayDistance}
                onFocus={handleFocusDistance}
                onChange={(e) => setTypedDistance(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`w-14 bg-slate-900 border text-center text-xs font-bold font-mono rounded px-1 py-0.5 outline-none transition-all ${
                  activeField === 'distance'
                    ? 'border-cyan-400 text-cyan-400 ring-2 ring-cyan-400/30'
                    : 'border-slate-700 text-amber-400'
                }`}
                placeholder="0"
              />
              <span className="text-[10px] font-bold text-slate-400">{unit}</span>
            </div>

            <span className="text-slate-600 font-bold">|</span>

            <div className="flex items-center gap-1">
              <input
                ref={angleInputRef}
                type="text"
                inputMode="decimal"
                value={displayAngle}
                onFocus={handleFocusAngle}
                onChange={(e) => setTypedAngle(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`w-14 bg-slate-900 border text-center text-xs font-bold font-mono rounded px-1 py-0.5 outline-none transition-all ${
                  activeField === 'angle'
                    ? 'border-cyan-400 text-cyan-400 ring-2 ring-cyan-400/30'
                    : 'border-slate-700 text-amber-400'
                }`}
                placeholder="0"
              />
              <span className="text-[10px] font-bold text-slate-400">°</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};