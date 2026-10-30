import React from 'react';
import { Search, Lock, CheckCircle2, MapPin, Sparkles } from 'lucide-react';
import { playClueSound } from '../utils/soundEffects';

export default function ClueCard({ clue, onDiscover = () => {}, isDiscovering = false }) {
  const isDiscovered = Boolean(clue.isDiscovered);

  const handleInspect = () => {
    playClueSound();
    onDiscover(clue.id);
  };

  return (
    <div className={`noir-card p-5 transition-all duration-300 relative overflow-hidden ${
      isDiscovered 
        ? 'border-cyan-500/40 bg-slate-900/80 shadow-lg shadow-cyan-500/5 forensic-scanner' 
        : 'border-slate-800/90 bg-slate-950/60 hover:border-amber-500/40'
    }`}>
      
      {/* Top Header: Location & Status */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate max-w-[170px]">{clue.location || 'Crime Scene'}</span>
        </div>

        {isDiscovered ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold shrink-0">
            <CheckCircle2 className="w-3 h-3" />
            +5 PTS
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
            <Lock className="w-3 h-3" />
            LOCKED
          </span>
        )}
      </div>

      {/* Clue Content */}
      {isDiscovered ? (
        <div className="space-y-2 animate-fade-in">
          <h4 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{clue.title}</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
            {clue.description}
          </p>
          <div className="text-[10px] font-mono text-slate-400 pt-1 flex justify-between items-center">
            <span>Evidence #{clue.id}</span>
            <span className="text-cyan-400/80 font-medium">Forensic Log Active</span>
          </div>
        </div>
      ) : (
        <div className="space-y-3 py-1">
          <div>
            <h4 className="font-semibold text-sm text-slate-300">
              {clue.title || 'Unexamined Evidence'}
            </h4>
            <p className="text-xs text-slate-400 line-clamp-2 mt-1 italic">
              Forensic data hidden. Examine this location to uncover ballistic, physical, or cryptographic traces.
            </p>
          </div>

          <button
            onClick={handleInspect}
            disabled={isDiscovering}
            className="w-full mt-2 py-2 px-3.5 rounded-xl bg-slate-800/90 hover:bg-amber-500 hover:text-slate-950 text-amber-400 border border-amber-500/30 hover:border-amber-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 group shadow-sm disabled:opacity-50"
          >
            <Search className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span>{isDiscovering ? 'Analyzing Forensics...' : 'Inspect Location (+5 Pts)'}</span>
          </button>
        </div>
      )}

    </div>
  );
}
