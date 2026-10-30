import React, { useState } from 'react';
import { HelpCircle, AlertCircle, X, ShieldAlert, Sparkles, CheckCircle } from 'lucide-react';
import { playHintSound } from '../utils/soundEffects';

export default function HintModal({ 
  isOpen, 
  onClose, 
  hints = [], 
  onRequestHint, 
  isRequesting = false 
}) {
  const [confirmPrompt, setConfirmPrompt] = useState(false);

  if (!isOpen) return null;

  const unlockedHints = hints.filter(h => h.isUsed);
  const remainingCount = hints.filter(h => !h.isUsed).length;

  const handleRequest = async () => {
    playHintSound();
    await onRequestHint();
    setConfirmPrompt(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg noir-card border-amber-500/40 p-6 shadow-2xl shadow-amber-500/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-100">Precinct Guidance & Hints</h3>
            <p className="text-xs text-slate-400 font-mono">
              Detective Support Channel • {remainingCount} hint{remainingCount !== 1 ? 's' : ''} remaining
            </p>
          </div>
        </div>

        {/* Scoring Warning Banner */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs mb-5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            Requesting advice from senior detectives incurs a <strong className="font-bold text-amber-200">10-point penalty</strong> per hint on your final evaluation.
          </p>
        </div>

        {/* Unlocked Hints List */}
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1 mb-5">
          {unlockedHints.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs font-mono border border-dashed border-slate-800 rounded-xl">
              No hints requested yet. Work through the clues first!
            </div>
          ) : (
            unlockedHints.map((hint, idx) => (
              <div 
                key={hint.id || idx}
                className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-amber-400">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Hint #{idx + 1}
                  </span>
                  <span className="text-slate-500 text-[10px]">Precinct Archive</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {hint.content}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-slate-800/80">
          {remainingCount === 0 ? (
            <p className="text-center text-xs text-slate-500 font-mono py-2">
              All precinct hints have been exhausted for this case.
            </p>
          ) : confirmPrompt ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleRequest}
                disabled={isRequesting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isRequesting ? 'Decrypting Hint...' : 'Confirm (-10 Pts)'}</span>
              </button>
              <button
                onClick={() => setConfirmPrompt(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmPrompt(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:border-amber-400 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Request Next Hint ({remainingCount} left)</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
