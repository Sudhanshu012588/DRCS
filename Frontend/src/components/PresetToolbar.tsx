import React from 'react';
import { Download, Box, ArrowRight } from 'lucide-react';
import { type PlotPreset, PRESETS } from '../types';

interface PresetToolbarProps {
  onLoadPreset: (preset: PlotPreset) => void;
  onExportJSON: () => void;
  isClosed: boolean;
}

export const PresetToolbar: React.FC<PresetToolbarProps> = ({
  onLoadPreset,
  onExportJSON,
  isClosed
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 border border-slate-800 p-2.5 rounded-lg mb-4">
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-slate-400 font-medium mr-1">Presets:</span>
        {PRESETS.map((preset, i) => (
          <button
            key={i}
            onClick={() => onLoadPreset(preset)}
            className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded text-xs transition-all"
          >
            {preset.name}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onExportJSON}
          className="px-3 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded text-xs flex items-center gap-1 font-mono"
        >
          <Download size={12} /> JSON
        </button>
        <button
          disabled={!isClosed}
          className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold rounded text-xs flex items-center gap-1 transition-all"
        >
          <Box size={14} /> Generate 3D Model <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
};