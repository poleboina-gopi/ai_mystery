import React, { useState, useEffect } from 'react';
import { Shield, Sparkles } from 'lucide-react';

const STATUS_MESSAGES = [
  'Initializing criminal forensic architecture...',
  'Synthesizing suspect psychologies and conflicting motives...',
  'Fabricating timeline alibis and verifiable inconsistencies...',
  'Seeding physical clues and ballistic traces at the crime scene...',
  'Generating subtle red herrings for forensic evaluation...',
  'Encrypting true culprit identity on the precinct mainframe...'
];

export default function LoadingOverlay({ message = 'Synthesizing Crime Investigation...' }) {
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-noir-950/92 backdrop-blur-lg animate-fade-in">
      
      {/* Radar scanning animation container */}
      <div className="relative w-36 h-36 mb-8 flex items-center justify-center">
        {/* Outer pulse ring */}
        <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-ping"></div>
        {/* Inner concentric rings */}
        <div className="absolute inset-2 rounded-full border border-amber-500/30"></div>
        <div className="absolute inset-6 rounded-full border border-slate-700/60"></div>
        
        {/* Rotating sweep */}
        <div className="absolute inset-0 rounded-full radar-sweep animate-radar"></div>

        {/* Center Badge */}
        <div className="relative w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/20">
          <Shield className="w-7 h-7 animate-pulse" />
        </div>
      </div>

      {/* Main Title */}
      <h3 className="font-display text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
        <span>{message}</span>
      </h3>

      {/* Cycling Terminal Status */}
      <div className="w-full max-w-md bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-center font-mono text-xs text-amber-400 min-h-[52px] flex items-center justify-center shadow-inner">
        <span className="cursor-blink mr-1.5 text-amber-500 font-bold">›</span>
        <span>{STATUS_MESSAGES[currentStatusIndex]}</span>
      </div>

      <p className="text-[11px] text-slate-500 font-mono mt-4 tracking-wide uppercase">
        Constructing a fair, logically verifiable puzzle...
      </p>

    </div>
  );
}
