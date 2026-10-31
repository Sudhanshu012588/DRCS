import React from 'react';
import { 
  ArrowRight, Sparkles, Ruler, Box, 
  Layers, ShieldCheck, MousePointerClick 
} from 'lucide-react';

interface HeroSectionProps {
  onStartDrawing: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartDrawing }) => {
  return (
    <div className="bg-slate-950 text-slate-100 overflow-hidden">
      {/* Background Accent Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Main Hero Container */}
      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Sparkles size={13} />
            <span>Zero-Complexity BIM Engine</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100 leading-[1.15]">
            3D House Planning, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300">
              Without the CAD Complexity.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Define plot dimensions, step directional boundaries on an intuitive grid, and automatically generate structural framing models ready for design.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onStartDrawing}
              className="w-full sm:w-auto px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
            >
              Start Plot Drawer <ArrowRight size={16} />
            </button>
            <button
              onClick={onStartDrawing}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold rounded-lg text-sm transition-all"
            >
              Load 30×50 Sample
            </button>
          </div>
        </div>

        {/* Hero Interactive Visual Preview */}
        <div className="mt-14 relative max-w-4xl mx-auto rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 px-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-500 ml-2">viewport_preview.bim</span>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Single Unified Core Model
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Visual Step 1 */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-cyan-400 mb-1">01. GRID & BOUNDARY</div>
                <h3 className="text-sm font-semibold text-slate-200">Set Plot Coordinates</h3>
                <p className="text-xs text-slate-400 mt-1">Input directions (UP, LEFT) & distances to plot boundary nodes.</p>
              </div>
              <div className="mt-4 h-28 border border-dashed border-cyan-500/40 rounded bg-slate-900/50 flex items-center justify-center">
                <Ruler size={32} className="text-cyan-400 opacity-60" />
              </div>
            </div>

            {/* Visual Step 2 */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-amber-400 mb-1">02. ARCHITECTURE</div>
                <h3 className="text-sm font-semibold text-slate-200">Synthesize 2D Layout</h3>
                <p className="text-xs text-slate-400 mt-1">Generates room spaces, circulation paths, walls, and openings.</p>
              </div>
              <div className="mt-4 h-28 border border-dashed border-amber-500/40 rounded bg-slate-900/50 flex items-center justify-center">
                <Layers size={32} className="text-amber-400 opacity-60" />
              </div>
            </div>

            {/* Visual Step 3 */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-emerald-400 mb-1">03. STRUCTURE & 3D</div>
                <h3 className="text-sm font-semibold text-slate-200">Extrude Framing Model</h3>
                <p className="text-xs text-slate-400 mt-1">Auto-places columns, beams, and footings with code checks.</p>
              </div>
              <div className="mt-4 h-28 border border-dashed border-emerald-500/40 rounded bg-slate-900/50 flex items-center justify-center">
                <Box size={32} className="text-emerald-400 opacity-60" />
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Value Pillars (USP) */}
        <div id="features" className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-lg bg-slate-900/50 border border-slate-800">
            <div className="w-9 h-9 rounded bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
              <MousePointerClick size={20} />
            </div>
            <h4 className="text-sm font-bold text-slate-200">Radically Simple UX</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              No complex CAD commands or setup required. Use step buttons or click vertices on a dynamic grid.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-slate-900/50 border border-slate-800">
            <div className="w-9 h-9 rounded bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
              <Layers size={20} />
            </div>
            <h4 className="text-sm font-bold text-slate-200">Unified Parametric Model</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              One data source drives 2D plans, 3D visualizations, and structural load distribution simultaneously.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-slate-900/50 border border-slate-800">
            <div className="w-9 h-9 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <ShieldCheck size={20} />
            </div>
            <h4 className="text-sm font-bold text-slate-200">Engineering Compliance</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Columns, beams, and footings are generated according to structural load continuity principles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};