import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Layers, Cpu, ShieldCheck } from 'lucide-react';
import { supabase } from '../Supabase/Supabase';
import type { User } from '@supabase/supabase-js';

export const HeroPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const handleStartDrawer = () => {
    if (user) {
      navigate(`/planner/${user.id}`);
    } else {
      navigate('/Auth/Login');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-mono font-semibold text-slate-700">
          <Cpu size={14} className="text-blue-600" /> Powered by CypherLabs BIM Engine
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          3D House Planning, <br />
          <span className="text-blue-600">Without CAD Complexity.</span>
        </h1>

        <p className="text-base text-slate-600 max-w-2xl mx-auto font-normal">
          Define plot dimensions, draw directional boundaries with AutoCAD precision, and automatically generate structural framing models ready for architectural design.
        </p>

        {/* Start Drawer CTA */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={handleStartDrawer}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-[0.98]"
          >
            Start Plot Drawer <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="max-w-5xl mx-auto px-6 py-12 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-2xl space-y-2">
          <Layers size={22} className="text-blue-600" />
          <h3 className="font-bold text-sm text-slate-900">Interactive AutoCAD Viewport</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            Draw plot boundaries directly with live floating distance and polar angle indicators.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-2xl space-y-2">
          <Cpu size={22} className="text-blue-600" />
          <h3 className="font-bold text-sm text-slate-900">Dynamic Floor Plan Generation</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            Configure BHK specifications and extrude 2D coordinate hulls into 3D structural layouts.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-2xl space-y-2">
          <ShieldCheck size={22} className="text-blue-600" />
          <h3 className="font-bold text-sm text-slate-900">Engineered Integrity</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            Built on structural engineering algorithms for seamless plan generation.
          </p>
        </div>
      </div>
    </div>
  );
};