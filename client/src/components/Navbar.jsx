import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Sparkles, Volume2, VolumeX, PlusCircle, Home } from 'lucide-react';
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
    <nav className="sticky top-0 z-40 bg-noir-950/85 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:border-amber-400 group-hover:scale-105 transition-all duration-300">
              <Shield className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-lg tracking-tight text-slate-100">
                <span>AI Mystery Room</span>
                <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-medium">
                  Gemini
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight hidden sm:block">
                Bureau of Criminal Deduction
              </p>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className={`flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                location.pathname === '/' 
                  ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link
              to="/create"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-amber-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Mystery</span>
            </Link>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              title={soundOn ? "Mute audio cues" : "Unmute audio cues"}
              className="p-2 rounded-lg border border-slate-700/60 text-slate-400 hover:text-amber-400 hover:border-slate-600 transition-colors bg-slate-900/50"
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
