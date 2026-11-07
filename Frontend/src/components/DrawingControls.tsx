import React from 'react';
import type { UnitSystem } from '../types';
import { LayoutGrid, Scale } from 'lucide-react';

interface DrawingControlsProps {
  gridDomainInput: string;
  setGridDomainInput: (val: string) => void;
  unit: UnitSystem;
  setUnit: (u: UnitSystem) => void;
}

export const DrawingControls: React.FC<DrawingControlsProps> = ({
  gridDomainInput,
  setGridDomainInput,
  unit,
  setUnit
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-4">
      {/* 1. Unit Selection (FT & M Only) */}
      <div>
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
          <Scale size={14} className="text-blue-600" /> Unit System
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['ft', 'm'] as UnitSystem[]).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUnit(u)}
              className={`py-2 text-xs font-mono font-bold rounded-xl uppercase transition-all ${
                unit === u
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {u === 'ft' ? 'Feet (FT)' : 'Meters (M)'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Grid Extent Input */}
      <div>
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
          <LayoutGrid size={14} className="text-blue-600" /> Grid Extent ({unit.toUpperCase()})
        </label>
        <div className="relative">
          <input
            type="number"
            value={gridDomainInput}
            onChange={(e) => setGridDomainInput(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            placeholder={`Grid size in ${unit}`}
          />
          <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-mono uppercase font-bold">{unit}</span>
        </div>
      </div>
    </div>
  );
};