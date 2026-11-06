import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Crosshair, Volume2, VolumeX, FilePlus2, Building2 } from 'lucide-react';
import { isSoundEnabled, toggleSound } from '../utils/soundEffects';

export default function Navbar() {
  const location = useLocation();
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    setSoundOn(isSoundEnabled());
  }, []);

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  return (
    <nav className="sticky top-0 z-50 bg-noir-950/90 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-transparent border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:border-amber-400 group-hover:scale-105 transition-all duration-300 shadow-md shadow-amber-500/5">
              <Crosshair className="w-5 h-5 transition-transform group-hover:rotate-12 duration-300" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-noir text-base tracking-wide text-slate-100 group-hover:text-amber-300 transition-colors">
                  AI Mystery Room
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 font-semibold hidden sm:inline">
                  CASE DOSSIER
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase hidden sm:block">
                Bureau of Criminal Deduction
              </p>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              to="/"
              className={`flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-xl transition-all ${
                location.pathname === '/' 
                  ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30 shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Precinct</span>
            </Link>

            <Link
              to="/create"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 btn-shimmer hover:brightness-110 active:scale-95 transition-all shadow-md shadow-amber-500/20"
            >
              <FilePlus2 className="w-4 h-4" />
              <span>New Case</span>
            </Link>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              title={soundOn ? "Mute forensic sound effects" : "Unmute forensic sound effects"}
              className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-slate-700 transition-all bg-slate-900/60 hover:scale-105 active:scale-95"
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
