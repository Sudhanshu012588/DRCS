import React from 'react';
import { Home } from 'lucide-react';

interface BhkSelectorProps {
  bhk: number;
  setBhk: (bhk: number) => void;
}

const BHK_OPTIONS = [
  { val: 1, label: '1 BHK', desc: 'Compact' },
  { val: 2, label: '2 BHK', desc: 'Standard' },
  { val: 3, label: '3 BHK', desc: 'Family' },
  { val: 4, label: '4 BHK', desc: 'Villa' },
  { val: 5, label: '5 BHK', desc: 'Luxury' }
];

export const BhkSelector: React.FC<BhkSelectorProps> = ({ bhk, setBhk }) => {
  return (
    <div>
      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2.5">
        <Home size={14} className="text-blue-600" /> Select Room Configuration (BHK)
      </label>
      <div className="flex flex-col gap-1.5">
        {BHK_OPTIONS.map((opt) => {
          const isSelected = bhk === opt.val;
          return (
            <button
              key={opt.val}
              type="button"
              onClick={() => setBhk(opt.val)}
              className={`py-2 px-3 rounded-xl flex items-center justify-between transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20 ring-2 ring-blue-500'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold'
              }`}
            >
              <span className="text-xs font-mono">{opt.label}</span>
              <span className={`text-[10px] ${isSelected ? 'text-blue-100 font-medium' : 'text-slate-400'}`}>
                {opt.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};