import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, LogIn, LogOut, User } from 'lucide-react';
import { supabase } from '../Supabase/Supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/Auth/Login');
  };

  const handlePlannerNavigation = () => {
    if (user) {
      navigate(`/planner/${user.id}`);
    } else {
      navigate('/Auth/Login');
    }
  };

  return (
    <nav className="w-full border-b border-slate-200 bg-white sticky top-0 z-50 font-mono">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Product Branding */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center font-black text-xs tracking-tighter rounded-lg shadow-sm">
            DRCS
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 tracking-widest text-sm uppercase leading-none">
              DRCS
            </span>
            <span className="text-[9px] text-slate-500 tracking-wider font-normal mt-0.5">
              by CypherLabs
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-xs uppercase tracking-wider text-slate-600 font-semibold">
          <Link to="/" className="hover:text-blue-600 transition-colors">Overview</Link>
          <button onClick={handlePlannerNavigation} className="hover:text-blue-600 transition-colors uppercase">
            Plot Planner
          </button>
        </div>

        {/* Auth & Planner Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-600 font-mono flex items-center gap-1.5 border border-slate-200 px-3 py-1 bg-slate-50 rounded-lg">
                <User size={12} className="text-blue-600" />
                <span className="max-w-[120px] truncate text-slate-800 font-semibold">
                  {user.email || user.user_metadata?.username || 'User'}
                </span>
              </span>

              <button
                onClick={handleSignOut}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <LogOut size={13} /> Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/Auth/Login')}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <LogIn size={13} /> Sign In
            </button>
          )}

          <button
            onClick={handlePlannerNavigation}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
          >
            Planner <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </nav>
  );
};