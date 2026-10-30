import React from 'react';
import { Shield, Sparkles, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-noir-950/90 text-slate-400 py-8 text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2 text-slate-400">
          <Terminal className="w-4 h-4 text-amber-400" />
          <span>AI Mystery Room • Powered by Google Gemini 2.5 & React</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-500">
          <span>Rules: +5 Clue Bonus | -10 Hint Penalty</span>
          <span>•</span>
          <span className="text-amber-400/80 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Zero Solution Leaks
          </span>
        </div>

      </div>
    </footer>
  );
}
