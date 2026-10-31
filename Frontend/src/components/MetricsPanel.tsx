import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import type { UnitSystem } from '../types';
import { convertFromFeet } from '../types';

interface MetricsPanelProps {
  areaSqFt: number;
  perimeterFt: number;
  isClosed: boolean;
  nodeCount: number;
  unit: UnitSystem;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({
  areaSqFt,
  perimeterFt,
  isClosed,
  nodeCount,
  unit
}) => {
  const convertedPerimeter = convertFromFeet(perimeterFt, unit).toFixed(unit === 'm' ? 2 : 0);
  const areaSqM = (areaSqFt * 0.092903).toFixed(2);

  return (
    <div className="grid grid-cols-3 gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-lg mb-4">
      <div className="bg-slate-950 p-2.5 rounded border border-slate-800/80">
        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Area</div>
        <div className="text-lg font-mono font-bold text-cyan-400 mt-0.5">
          {areaSqFt.toLocaleString()} <span className="text-xs text-slate-400 font-normal">sq ft</span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">{areaSqM} sq m</div>
      </div>

      <div className="bg-slate-950 p-2.5 rounded border border-slate-800/80">
        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Perimeter</div>
        <div className="text-lg font-mono font-bold text-amber-400 mt-0.5">
          {convertedPerimeter} <span className="text-xs text-slate-400 font-normal">{unit}</span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">{nodeCount} Nodes / Vertices</div>
      </div>

      <div className="bg-slate-950 p-2.5 rounded border border-slate-800/80 flex flex-col justify-between">
        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Boundary Status</div>
        <div className="flex items-center gap-1.5 mt-1">
          {isClosed ? (
            <>
              <CheckCircle size={16} className="text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400">Closed Loop</span>
            </>
          ) : (
            <>
              <AlertCircle size={16} className="text-amber-400" />
              <span className="text-xs font-semibold text-amber-400">Incomplete</span>
            </>
          )}
        </div>
        <div className="text-[10px] text-slate-500 truncate">
          {isClosed ? 'Ready for 3D extrusion' : 'Add segment back to N1'}
        </div>
      </div>
    </div>
  );
};