import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400">
            <Box size={18} />
          </div>
          <span className="font-bold text-slate-100 tracking-tight text-base font-mono">
            STRUCT<span className="text-cyan-400">BIM</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-xs text-slate-400 font-medium">
          <Link to="/" className="hover:text-slate-200 transition-colors">Overview</Link>
          <Link to="/planner" className="hover:text-slate-200 transition-colors">Plot Planner</Link>
        </div>

        <button
          onClick={() => navigate('/planner')}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-cyan-500/10"
        >
          Launch Planner <ArrowRight size={14} />
        </button>
      </div>
    </nav>
  );
};