import React from 'react';
import { 
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, 
  RotateCcw, Trash2, CheckCircle, Ruler, LayoutGrid, Scale 
} from 'lucide-react';
import type { Direction, UnitSystem } from '../types';

interface DrawingControlsProps {
  gridDomainInput: string;
  setGridDomainInput: (val: string) => void;
  selectedDir: Direction;
  setSelectedDir: (dir: Direction) => void;
  stepLengthInput: string;
  setStepLengthInput: (val: string) => void;
  unit: UnitSystem;
  setUnit: (u: UnitSystem) => void;
  onAddSegment: () => void;
  onCloseLoop: () => void;
  onUndo: () => void;
  onClear: () => void;
  isClosed: boolean;
  nodesLength: number;
}

// Unit-specific quick grid domain options
const QUICK_GRID_OPTIONS: Record<UnitSystem, number[]> = {
  ft: [30, 60, 80, 100],
  m: [10, 20, 30, 50],
  mm: [3000, 6000, 10000, 20000],
  in: [300, 600, 1000, 1200]
};

export const DrawingControls: React.FC<DrawingControlsProps> = ({
  gridDomainInput,
  setGridDomainInput,
  selectedDir,
  setSelectedDir,
  stepLengthInput,
  setStepLengthInput,
  unit,
  setUnit,
  onAddSegment,
  onCloseLoop,
  onUndo,
  onClear,
  isClosed,
  nodesLength
}) => {
  return (
    <div className="space-y-4 bg-slate-900 border border-slate-800 p-4 rounded-lg">
      {/* 1. Unit Switcher */}
      <div>
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
          <Scale size={14} className="text-cyan-400" /> Measurement Unit
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {(['ft', 'm', 'mm', 'in'] as UnitSystem[]).map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`py-1 text-xs font-mono rounded border uppercase transition-all ${
                unit === u
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Custom Max Grid Domain Input & Unit Presets */}
      <div>
        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between mb-2">
          <span className="flex items-center gap-1.5">
            <LayoutGrid size={14} className="text-cyan-400" /> Max Grid Domain ({unit})
          </span>
        </label>

        {/* Custom Input */}
        <div className="relative mb-2">
          <input
            type="number"
            value={gridDomainInput}
            onChange={(e) => setGridDomainInput(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-400"
            placeholder={`Enter custom grid size in ${unit}`}
          />
          <span className="absolute right-3 top-2 text-xs text-slate-500 font-mono uppercase">{unit}</span>
        </div>

        {/* Dynamic Unit Presets */}
        <div className="grid grid-cols-4 gap-1.5">
          {QUICK_GRID_OPTIONS[unit].map((opt) => (
            <button
              key={opt}
              onClick={() => setGridDomainInput(opt.toString())}
              className={`py-1 text-xs font-mono rounded border transition-all ${
                gridDomainInput === opt.toString()
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {opt}×{opt} {unit}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Direction Pad & Distance Step */}
      <div>
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
          <Ruler size={14} className="text-cyan-400" /> Step Direction & Distance
        </label>
        <div className="grid grid-cols-3 gap-1.5 w-full max-w-[220px] mx-auto my-2">
          <div />
          <button
            onClick={() => setSelectedDir('UP')}
            disabled={isClosed}
            className={`p-2.5 rounded border flex items-center justify-center transition-all ${
              selectedDir === 'UP'
                ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <ArrowUp size={18} />
          </button>
          <div />
          <button
            onClick={() => setSelectedDir('LEFT')}
            disabled={isClosed}
            className={`p-2.5 rounded border flex items-center justify-center transition-all ${
              selectedDir === 'LEFT'
                ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={() => setSelectedDir('DOWN')}
            disabled={isClosed}
            className={`p-2.5 rounded border flex items-center justify-center transition-all ${
              selectedDir === 'DOWN'
                ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <ArrowDown size={18} />
          </button>
          <button
            onClick={() => setSelectedDir('RIGHT')}
            disabled={isClosed}
            className={`p-2.5 rounded border flex items-center justify-center transition-all ${
              selectedDir === 'RIGHT'
                ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Clean Distance Input */}
        <div className="flex gap-2 mt-3">
          <div className="relative flex-1">
            <input
              type="number"
              value={stepLengthInput}
              onChange={(e) => setStepLengthInput(e.target.value)}
              disabled={isClosed}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-400"
              placeholder={`Length in ${unit}`}
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono uppercase">{unit}</span>
          </div>
          <button
            onClick={onAddSegment}
            disabled={isClosed || !stepLengthInput || parseFloat(stepLengthInput) <= 0}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-slate-950 font-semibold rounded text-sm transition-all"
          >
            + Add Side
          </button>
        </div>
      </div>

      {/* Action Utilities */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
        <button
          onClick={onCloseLoop}
          disabled={isClosed || nodesLength < 3}
          className="flex-1 py-1.5 px-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 disabled:opacity-30 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-all"
        >
          <CheckCircle size={14} /> Auto-Close
        </button>
        <button
          onClick={onUndo}
          disabled={nodesLength <= 1}
          className="py-1.5 px-2 bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700 disabled:opacity-30 rounded text-xs font-semibold flex items-center gap-1"
        >
          <RotateCcw size={14} /> Undo
        </button>
        <button
          onClick={onClear}
          className="py-1.5 px-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded text-xs font-semibold flex items-center gap-1"
        >
          <Trash2 size={14} /> Clear
        </button>
      </div>
    </div>
  );
};