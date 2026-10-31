import React from 'react';
import { Home } from 'lucide-react';

interface BhkSelectorProps {
  bhk: number;
  setBhk: (value: number) => void;
  disabled?: boolean;
}

const BHK_OPTIONS = [
  { value: 1, label: '1 BHK', desc: 'Compact' },
  { value: 2, label: '2 BHK', desc: 'Standard' },
  { value: 3, label: '3 BHK', desc: 'Family' },
  { value: 4, label: '4 BHK', desc: 'Villa' },
  { value: 5, label: '5 BHK', desc: 'Luxury' }
];

export const BhkSelector: React.FC<BhkSelectorProps> = ({ bhk, setBhk, disabled }) => {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
        <Home size={14} className="text-cyan-400" /> Select Room Configuration (BHK)
      </label>
      <div className="grid grid-cols-5 gap-1.5">
        {BHK_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            disabled={disabled}
            onClick={() => setBhk(opt.value)}
            className={`py-2 px-1 rounded border flex flex-col items-center justify-center transition-all ${
              bhk === opt.value
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-lg shadow-cyan-500/10'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="text-xs font-mono">{opt.label}</span>
            <span className="text-[9px] text-slate-500 font-normal">{opt.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
};