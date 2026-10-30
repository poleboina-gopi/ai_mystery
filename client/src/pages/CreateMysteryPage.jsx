import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, Shield, AlertTriangle, ArrowRight, Check } from 'lucide-react';
import { MYSTERY_PRESETS, DIFFICULTY_CONFIG } from '../utils/presets';
import { createCase } from '../api/client';
import LoadingOverlay from '../components/LoadingOverlay';

export default function CreateMysteryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [difficulty, setDifficulty] = useState('Medium');
  const [premise, setPremise] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if a preset was passed via URL query
  useEffect(() => {
    const presetId = searchParams.get('preset');
    if (presetId) {
      const match = MYSTERY_PRESETS.find(p => p.id === presetId);
      if (match) {
        setPremise(match.premise);
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!premise.trim()) {
      setError('Please provide a crime premise or select a scenario below.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await createCase({ premise: premise.trim(), difficulty });
      if (res?.case?._id) {
        navigate(`/cases/${res.case._id}`);
      } else {
        throw new Error('Case creation returned an invalid payload.');
      }
    } catch (err) {
      console.error('Failed to create case:', err);
      setError(err?.response?.data?.error || err.message || 'Failed to generate mystery.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-fade-in">
      
      {/* Loading Overlay */}
      {loading && <LoadingOverlay message="Commissioning Case Investigation..." />}

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Case Commission Desk</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-tight text-slate-100">
          Commission An Investigation
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed font-sans">
          Configure the complexity tier and incident premise. The forensic engine will construct the suspects, crime scene evidence, and logical clues.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="noir-card p-6 sm:p-8 space-y-8 border-slate-800">
        
        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2.5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* 1. Difficulty Selector */}
        <div className="space-y-3">
          <label className="block text-xs uppercase font-mono font-bold tracking-wider text-slate-300">
            1. Select Difficulty & Complexity
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {Object.entries(DIFFICULTY_CONFIG).map(([level, cfg]) => {
              const isSelected = difficulty === level;
              return (
                <div
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-amber-400 bg-amber-950/20 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400' 
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-100">{level}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${cfg.badgeColor}`}>
                      +{cfg.basePoints} Pts
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 space-y-1 mb-2">
                    <div>👥 {cfg.suspects} Suspects</div>
                    <div>🔍 {cfg.clues} Clues</div>
                    <div>💡 {cfg.hints} Hints Available</div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal border-t border-slate-800/80 pt-2">
                    {cfg.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Premise Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs uppercase font-mono font-bold tracking-wider text-slate-300">
              2. Crime Premise & Incident Narrative
            </label>
            <span className="text-[11px] font-mono text-slate-400">
              {premise.length} characters
            </span>
          </div>

          <textarea
            value={premise}
            onChange={(e) => setPremise(e.target.value)}
            rows={4}
            placeholder="e.g., During the private midnight showing at the Obsidian Gallery, the alarm was silenced and the priceless Verona pendant vanished from the locked vitrine..."
            className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-sans leading-relaxed"
          />

          {/* Preset Buttons for Quick Inspiration */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-mono text-slate-400 block">
              Or pick an instant scenario preset:
            </span>
            <div className="flex flex-wrap gap-2">
              {MYSTERY_PRESETS.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setPremise(p.premise)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/30 text-xs text-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  <span>{p.emoji}</span>
                  <span>{p.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-display font-bold text-base flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/20 active:scale-98 transition-all disabled:opacity-50 btn-shimmer"
          >
            <Sparkles className="w-5 h-5" />
            <span>Commission Mystery Investigation</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </button>
          <p className="text-center text-[11px] font-mono text-slate-400 mt-3">
            Culprit and solution are securely isolated on the backend until formal accusation.
          </p>
        </div>

      </form>

    </div>
  );
}
