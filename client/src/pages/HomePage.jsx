import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Crosshair, Zap, Microscope, Trophy, Lightbulb, ArrowRight, BadgeCheck, ChevronRight, Archive, SlidersHorizontal } from 'lucide-react';
import { MYSTERY_PRESETS, DIFFICULTY_CONFIG } from '../utils/presets';
import { listRecentCases } from '../api/client';

export default function HomePage() {
  const [recentCases, setRecentCases] = useState([]);

  useEffect(() => {
    listRecentCases()
      .then(res => {
        if (res?.cases) setRecentCases(res.cases);
      })
      .catch(() => {
        // Quiet fallback if server is starting
      });
  }, []);

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-24 animate-fade-in overflow-hidden">
      
      {/* Depth Parallax Ambient Background Elements */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none ambient-float" />
      <div className="absolute top-96 -left-32 w-[350px] h-[350px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <div className="relative text-center max-w-3xl mx-auto space-y-6">
        
        {/* Glow pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold tracking-wider uppercase shadow-sm">
          <Zap className="w-3.5 h-3.5" />
          <span>Interactive Criminal Investigation Bureau</span>
        </div>

        {/* Headline with Playfair Display — noir editorial */}
        <h1 className="font-serif text-4xl sm:text-6xl font-black tracking-tight text-slate-100 leading-[1.12]">
          Every Crime Leaves A Trail.{' '}
          <br className="hidden sm:inline" />
          <span className="font-serif-italic bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
            Can You Unmask The Culprit?
          </span>
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
          Step into the detective bureau. Generate logically watertight murder and grand theft mysteries. Interrogate suspect alibis, analyze physical and forensic evidence, request precinct hints, and file your formal indictment.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Link
            to="/create"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-display font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/25 active:scale-95 transition-all btn-shimmer"
          >
            <span>Open New Investigation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#rules"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 text-sm font-medium transition-colors hover:border-slate-600"
          >
            How Investigations Work
          </a>
        </div>

        {/* Trust Badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <BadgeCheck className="w-4 h-4 text-emerald-400" /> 100% Watertight Logic
          </span>
          <span className="flex items-center gap-1.5">
            <BadgeCheck className="w-4 h-4 text-amber-400" /> Backend Solution Privacy
          </span>
          <span className="flex items-center gap-1.5">
            <BadgeCheck className="w-4 h-4 text-cyan-400" /> 3 Difficulty Tiers
          </span>
        </div>

      </div>

      {/* 3-Step Gameplay Loop (Staggered Scroll Reveals) */}
      <div id="rules" className="space-y-8 relative">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
            The Detective Protocol
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto font-mono">
            Follow the precinct handbook to maximize your detective rating.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1 */}
          <div 
            className="noir-card p-6 space-y-3 relative overflow-hidden group reveal-item"
            style={{ animationDelay: '100ms' }}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-noir text-base">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-100">1. Commission A Case</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Input any crime premise or select a curated scenario. Choose between Easy, Medium, or Hard difficulty to tailor suspect and clue density.
            </p>
          </div>

          {/* Step 2 */}
          <div 
            className="noir-card p-6 space-y-3 relative overflow-hidden group reveal-item"
            style={{ animationDelay: '200ms' }}
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-noir text-base">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-100">2. Examine The Evidence</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Inspect crime scene spots to uncover hidden clues (+5 pts each). Interrogate suspects to cross-examine their alibis and reveal secret motives.
            </p>
          </div>

          {/* Step 3 */}
          <div 
            className="noir-card p-6 space-y-3 relative overflow-hidden group reveal-item"
            style={{ animationDelay: '300ms' }}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-noir text-base">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-100">3. File The Indictment</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Confront the suspect lineup and submit your deductive reasoning. Accuse correctly to secure a conviction and unlock the full solution dossier.
            </p>
          </div>

        </div>
      </div>

      {/* Scoring Matrix & Rules */}
      <div className="noir-card p-6 sm:p-8 border-slate-800">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Precinct Scoring Matrix</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Backend-validated points system based on deductive precision.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              Clue Discovered: +5 Pts
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
              Hint Used: -10 Pts
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
              Floor: 0 Pts
            </span>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase">
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Suspects</th>
                <th className="py-3 px-4">Crime Scene Clues</th>
                <th className="py-3 px-4">Precinct Hints</th>
                <th className="py-3 px-4">Base Accusation Reward</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {Object.entries(DIFFICULTY_CONFIG).map(([diff, config]) => (
                <tr key={diff} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-200">
                    <span className={`px-2 py-0.5 rounded text-[11px] border ${config.badgeColor}`}>
                      {diff}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{config.suspects} Suspects</td>
                  <td className="py-3 px-4 text-slate-300">{config.clues} Clues (+{config.clues * 5} Max Bonus)</td>
                  <td className="py-3 px-4 text-slate-300">{config.hints} Hints Available</td>
                  <td className="py-3 px-4 font-bold text-amber-400">+{config.basePoints} Points</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Featured Case Scenarios (Horizontal / Grid adaptive) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-100">Themed Crime Dossiers</h3>
            <p className="text-xs text-slate-400 font-mono">Launch a case instantly using curated premises</p>
          </div>
          <Link to="/create" className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1">
            <span>Custom Premise</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MYSTERY_PRESETS.map((preset, idx) => (
            <Link
              key={preset.id}
              to={`/create?preset=${preset.id}`}
              className="noir-card p-5 hover:border-amber-500/50 hover:shadow-xl hover:-translate-y-0.5 transition-all group reveal-item"
              style={{ animationDelay: `${idx * 70}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{preset.emoji}</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {preset.tag}
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-100 group-hover:text-amber-400 transition-colors">
                {preset.title}
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                {preset.premise}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-amber-400">
                <span>Investigate Scenario</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Investigations if any */}
      {recentCases.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-800/80">
          <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
            <Archive className="w-4 h-4 text-cyan-400" />
            <span>Precinct Case Log (Recent Cases)</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {recentCases.map((c, idx) => (
              <Link
                key={c._id}
                to={c.status === 'active' ? `/cases/${c._id}` : `/cases/${c._id}/results`}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 flex items-center justify-between text-xs font-mono transition-colors reveal-item"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="truncate mr-3">
                  <span className="text-slate-200 font-semibold block truncate">{c.title}</span>
                  <span className="text-[10px] text-slate-400 capitalize">{c.difficulty} • Status: {c.status}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
