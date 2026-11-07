import React from 'react';
import { CheckCircle2, AlertCircle, Maximize2, Ruler, ShieldCheck } from 'lucide-react';
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
    <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 flex-shrink-0">
      {/* Total Area */}
      <div className="bg-white border border-slate-200/80 p-2.5 rounded-xl shadow-sm">
        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold flex items-center justify-between">
          <span>Total Area</span>
          <Maximize2 size={12} className="text-blue-600" />
        </div>
        <div className="text-sm font-mono font-bold text-slate-900 mt-0.5">
          {areaSqFt.toLocaleString()} <span className="text-xs text-slate-400 font-normal">sq ft</span>
        </div>
        <div className="text-[10px] text-slate-500 font-mono">{areaSqM} sq m</div>
      </div>

      {/* Perimeter */}
      <div className="bg-white border border-slate-200/80 p-2.5 rounded-xl shadow-sm">
        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold flex items-center justify-between">
          <span>Perimeter</span>
          <Ruler size={12} className="text-blue-600" />
        </div>
        <div className="text-sm font-mono font-bold text-slate-900 mt-0.5">
          {convertedPerimeter} <span className="text-xs text-slate-400 font-normal">{unit}</span>
        </div>
        <div className="text-[10px] text-slate-500 font-mono">{nodeCount} Vertices</div>
      </div>

      {/* Boundary Status */}
      <div className="bg-white border border-slate-200/80 p-2.5 rounded-xl shadow-sm">
        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold flex items-center justify-between">
          <span>Boundary Status</span>
          <ShieldCheck size={12} className="text-blue-600" />
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          {isClosed ? (
            <>
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span className="text-xs font-bold text-emerald-600 font-mono">Closed Path</span>
            </>
          ) : (
            <>
              <AlertCircle size={14} className="text-amber-500" />
              <span className="text-xs font-semibold text-amber-600 font-mono">Open Path</span>
            </>
          )}
        </div>
        <div className="text-[10px] text-slate-400 font-mono truncate">
          {isClosed ? 'Extrusion Ready' : 'Click N1 to Close'}
        </div>
      </div>
    </div>
  );
};