import React from 'react';
import { Crosshair, BadgeCheck, Archive } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-noir-950/90 text-slate-400 py-8 text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2.5 text-slate-300">
          <div className="w-5 h-5 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Crosshair className="w-3 h-3" />
          </div>
          <span className="font-noir text-slate-200 tracking-wide">AI Mystery Room</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 text-[11px]">Bureau of Criminal Deduction</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-500">
          <span>Scoring: +5 Clue Bonus • -10 Hint Penalty</span>
          <span>•</span>
          <span className="text-amber-400/90 flex items-center gap-1 font-medium">
            <BadgeCheck className="w-3 h-3" /> Zero Solution Leaks
          </span>
          <span>•</span>
          <span className="text-cyan-400/80 flex items-center gap-1">
            <Archive className="w-3 h-3" /> Case Vault Secured
          </span>
        </div>

      </div>
    </footer>
  );
}
