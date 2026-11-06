import React from 'react';
import { Trophy, Microscope, Lightbulb } from 'lucide-react';

export default function ScoreBadge({ score = {}, difficulty = 'Medium', cluesDiscovered = 0, hintsUsed = 0, totalClues = 0 }) {
  const cluePoints = cluesDiscovered * 5;
  const hintPoints = hintsUsed * 10;
  const total = score?.total ?? Math.max(0, cluePoints - hintPoints);

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 font-mono text-xs">
      
      {/* Total Score Highlight */}
      <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold px-2.5 py-1 rounded-lg">
        <Trophy className="w-3.5 h-3.5" />
        <span>SCORE: {total} PTS</span>
      </div>

      {/* Clues Count */}
      <div className="flex items-center gap-1 text-slate-300">
        <Microscope className="w-3.5 h-3.5 text-cyan-400" />
        <span>Clues: {cluesDiscovered}/{totalClues}</span>
        <span className="text-[10px] text-emerald-400 font-semibold">(+{cluePoints})</span>
      </div>

      <div className="text-slate-600 hidden sm:inline">•</div>

      {/* Hints Count */}
      <div className="flex items-center gap-1 text-slate-300">
        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
        <span>Hints Used: {hintsUsed}</span>
        {hintsUsed > 0 && (
          <span className="text-[10px] text-red-400 font-semibold">(-{hintPoints})</span>
        )}
      </div>

      <div className="text-slate-600 hidden sm:inline">•</div>

      {/* Difficulty Pill */}
      <div className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
        {difficulty}
      </div>

    </div>
  );
}
