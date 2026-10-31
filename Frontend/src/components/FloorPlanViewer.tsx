import React, { useMemo } from 'react';
import type { FloorPlanResponse, Room } from '../types/FloorPlan';
import { ROOM_STYLES } from '../types/FloorPlan';
import { Layers, Maximize2 } from 'lucide-react';

interface FloorPlanViewerProps {
  data: FloorPlanResponse;
}

export const FloorPlanViewer: React.FC<FloorPlanViewerProps> = ({ data }) => {
  const { plot_coordinates, rooms } = data.floor_plan;

  // Calculate grid dimensions from plot outer coordinates
  const { maxX, maxY } = useMemo(() => {
    let max_x = 0;
    let max_y = 0;
    plot_coordinates.forEach(([x, y]) => {
      if (x > max_x) max_x = x;
      if (y > max_y) max_y = y;
    });
    return { maxX: max_x || 12, maxY: max_y || 10 };
  }, [plot_coordinates]);

  // SVG viewport setup
  const viewSize = 650;
  const padding = 60;
  const effectiveSize = viewSize - padding * 2;

  // Transform coordinates to SVG pixels (inverting Y for Cartesian ground plane)
  const toSvgX = (x: number) => padding + (x / maxX) * effectiveSize;
  const toSvgY = (y: number) => viewSize - padding - (y / maxY) * effectiveSize;

  // Compute room bounding dimensions (Width x Height in meters)
  const getRoomMetrics = (corners: number[][]) => {
    const xs = corners.map(([x]) => x);
    const ys = corners.map(([, y]) => y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const width = maxX - minX;
    const height = maxY - minY;

    const centerX = toSvgX((minX + maxX) / 2);
    const centerY = toSvgY((minY + maxY) / 2);

    return {
      width: width.toFixed(1),
      height: height.toFixed(1),
      centerX,
      centerY,
    };
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-100">
            Generated AI Floor Plan Layout
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Maximize2 size={14} className="text-amber-400" />
          <span>Plot Domain: {maxX}m × {maxY}m</span>
        </div>
      </div>

      {/* Interactive SVG Viewport */}
      <div className="relative w-full aspect-square bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
        <svg
          viewBox={`0 0 ${viewSize} ${viewSize}`}
          className="w-full h-full select-none"
        >
          {/* Grid Background */}
          <defs>
            <pattern
              id="planGrid"
              width={effectiveSize / maxX}
              height={effectiveSize / maxY}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M ${effectiveSize / maxX} 0 L 0 0 0 ${effectiveSize / maxY}`}
                fill="none"
                stroke="#1E293B"
                strokeWidth="1"
              />
            </pattern>
          </defs>

          <rect
            x={padding}
            y={padding}
            width={effectiveSize}
            height={effectiveSize}
            fill="url(#planGrid)"
            stroke="#334155"
            strokeWidth="1.5"
          />

          {/* Plot Boundary */}
          <polyline
            points={plot_coordinates.map(([x, y]) => `${toSvgX(x)},${toSvgY(y)}`).join(' ')}
            fill="none"
            stroke="#06B6D4"
            strokeWidth="3.5"
            strokeDasharray="6 3"
          />

          {/* Render Rooms */}
          {rooms.map((room, idx) => {
            const style = ROOM_STYLES[room.type] || ROOM_STYLES.default;
            const pointsStr = room.corners.map(([x, y]) => `${toSvgX(x)},${toSvgY(y)}`).join(' ');
            const metrics = getRoomMetrics(room.corners);

            return (
              <g key={`room-${idx}`} className="transition-all hover:opacity-90">
                {/* Room Polygon */}
                <polygon
                  points={pointsStr}
                  fill={style.fill}
                  stroke={style.stroke}
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />

                {/* Room Labels and Dimensions */}
                <g transform={`translate(${metrics.centerX}, ${metrics.centerY})`}>
                  {/* Label Background Badge */}
                  <rect
                    x="-45"
                    y="-18"
                    width="90"
                    height="34"
                    rx="4"
                    fill={style.badgeBg}
                    stroke={style.stroke}
                    strokeWidth="1"
                  />
                  {/* Room Name */}
                  <text
                    x="0"
                    y="-4"
                    fill={style.textColor}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {room.name}
                  </text>
                  {/* Room Dimension in Meters */}
                  <text
                    x="0"
                    y="10"
                    fill="#F59E0B"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="semibold"
                    textAnchor="middle"
                  >
                    {metrics.width}m × {metrics.height}m
                  </text>
                </g>
              </g>
            );
          })}

          {/* Grid Axis Labels in Meters */}
          {Array.from({ length: Math.floor(maxX) + 1 }).map((_, i) => {
            if (i % 2 !== 0 && i !== maxX) return null; // Show every 2 meters
            const posX = toSvgX(i);
            return (
              <text
                key={`x-axis-${i}`}
                x={posX}
                y={viewSize - padding + 18}
                fill="#64748B"
                fontSize="9"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {i}m
              </text>
            );
          })}

          {Array.from({ length: Math.floor(maxY) + 1 }).map((_, i) => {
            if (i % 2 !== 0 && i !== maxY) return null;
            const posY = toSvgY(i);
            return (
              <text
                key={`y-axis-${i}`}
                x={padding - 12}
                y={posY + 3}
                fill="#64748B"
                fontSize="9"
                fontFamily="monospace"
                textAnchor="end"
              >
                {i}m
              </text>
            );
          })}
        </svg>
      </div>

      {/* Room Legend Schedule */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800">
        {rooms.map((room, idx) => {
          const style = ROOM_STYLES[room.type] || ROOM_STYLES.default;
          const xs = room.corners.map(([x]) => x);
          const ys = room.corners.map(([, y]) => y);
          const w = (Math.max(...xs) - Math.min(...xs)).toFixed(1);
          const h = (Math.max(...ys) - Math.min(...ys)).toFixed(1);

          return (
            <div
              key={idx}
              className="bg-slate-950 p-2 rounded border border-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: style.stroke }}
                />
                <span className="text-xs font-mono text-slate-300">{room.name}</span>
              </div>
              <span className="text-[11px] font-mono text-amber-400 font-bold">
                {w}m × {h}m
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
