import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  ShieldAlert, 
  RotateCcw, 
  Home, 
  FileText, 
  Key,
  Users,
  Search
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getCaseResult } from '../api/client';
import SuspectCard from '../components/SuspectCard';
import LoadingOverlay from '../components/LoadingOverlay';
import { playVictorySound, playFailureSound } from '../utils/soundEffects';

export default function ResultsPage() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCaseResult(id)
      .then(res => {
        if (res?.case) {
          setCaseData(res.case);
          const isSolved = res.case.status === 'solved';
          
          if (isSolved) {
            playVictorySound();
            // Trigger victory confetti burst
            confetti({
              particleCount: 120,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#f59e0b', '#fbbf24', '#10b981', '#38bdf8']
            });
          } else {
            playFailureSound();
          }
        }
      })
      .catch(err => {
        setError(err?.response?.data?.error || err.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <LoadingOverlay message="Declassifying Case Dossier..." />;
  }

  if (error || !caseData) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <p className="text-red-400 font-mono">{error || 'Unable to retrieve case results.'}</p>
        <Link to="/" className="text-amber-400 text-xs font-mono">Return Home</Link>
      </div>
    );
  }

  const isSolved = caseData.status === 'solved';
  const score = caseData.score || { basePoints: 0, clueBonus: 0, hintPenalty: 0, total: 0 };
  const accusedId = caseData.playerAccusation?.suspectId;
  const accusedSuspect = caseData.suspects.find(s => s.id === accusedId);

  // Compute detective rank title
  const getRankTitle = (total) => {
    if (total >= 220) return 'Chief Inspector / Master Sleuth 🎖️';
    if (total >= 160) return 'Senior Consulting Detective 🕵️‍♂️';
    if (total >= 100) return 'Precinct Investigator 🔍';
    return 'Junior Deputy Detective 📋';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 animate-fade-in">
      
      {/* 1. Verdict Banner */}
      <div className={`noir-card p-8 text-center border-2 ${
        isSolved 
          ? 'border-emerald-500/60 bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-950 noir-glow-emerald' 
          : 'border-red-500/60 bg-gradient-to-b from-red-950/40 via-slate-900 to-slate-950 noir-glow-crimson'
      }`}>
        <div className="space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-slate-900/80 border border-slate-700/60 shadow-lg">
            {isSolved ? (
              <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            ) : (
              <XCircle className="w-12 h-12 text-red-400" />
            )}
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-mono tracking-widest uppercase font-bold text-slate-400">
              OFFICIAL VERDICT • {caseData.difficulty} DIFFICULTY
            </span>
            <h1 className={`text-3xl sm:text-5xl font-black tracking-tight ${
              isSolved ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {isSolved ? 'CASE SOLVED — CONVICTION SECURED!' : 'WRONGFUL ACCUSATION — PERPETRATOR AT LARGE!'}
            </h1>
          </div>

          <p className="text-sm text-slate-300 max-w-xl mx-auto font-sans leading-relaxed">
            {isSolved ? (
              <span>You correctly identified <strong className="text-emerald-300 font-bold">{caseData.culpritName}</strong> as the true perpetrator. Justice has been served.</span>
            ) : (
              <span>You indicted <strong className="text-red-300 font-bold">{accusedSuspect?.name || 'an innocent party'}</strong>, allowing <strong className="text-amber-400 font-bold">{caseData.culpritName}</strong> to slip through precinct custody.</span>
            )}
          </p>

          {/* Detective Rank Pill */}
          <div className="pt-2">
            <div className="inline-block px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono font-semibold text-amber-400 shadow-md">
              Rank Assigned: {getRankTitle(score.total)}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Scorecard Breakdown */}
      <div className="noir-card p-6 sm:p-8 border-slate-800">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-6">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Precinct Score Breakdown</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 block mb-1">Base Accusation</span>
            <span className={`text-xl font-bold font-mono ${isSolved ? 'text-amber-400' : 'text-slate-500'}`}>
              +{score.basePoints} Pts
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">
              {isSolved ? 'Correct Conviction' : 'Incorrect'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 block mb-1">Clues Discovered</span>
            <span className="text-xl font-bold font-mono text-emerald-400">
              +{score.clueBonus} Pts
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">
              {caseData.clues.filter(c => c.isDiscovered).length} × 5 Pts
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 block mb-1">Precinct Hints</span>
            <span className="text-xl font-bold font-mono text-red-400">
              -{score.hintPenalty} Pts
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">
              {caseData.hints.filter(h => h.isUsed).length} × 10 Pts
            </span>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/40">
            <span className="text-[11px] font-mono text-amber-300 font-semibold block mb-1">Final Score</span>
            <span className="text-2xl font-black font-mono text-amber-400">
              {score.total} PTS
            </span>
            <span className="text-[10px] text-amber-400/80 block mt-1">
              Score floor: 0
            </span>
          </div>

        </div>
      </div>

      {/* 3. The Truth Revealed (Declassified Case Dossier) */}
      <div className="noir-card p-6 sm:p-8 border-amber-500/30 bg-slate-900/80 space-y-6">
        <div className="flex items-center gap-2 text-sm font-mono uppercase font-bold text-amber-400">
          <Key className="w-5 h-5" />
          <span>The Truth Revealed: Full Case Resolution</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-400 block">The True Perpetrator:</span>
            <h4 className="text-xl font-extrabold text-amber-400">
              {caseData.culpritName}
            </h4>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-bold">
            Guilty Beyond Reasonable Doubt
          </span>
        </div>

        <div className="space-y-2">
          <h5 className="text-xs font-mono uppercase text-slate-300 font-semibold">
            Confession & Method of Execution:
          </h5>
          <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-line font-sans">
            {caseData.solution}
          </div>
        </div>

        {/* Player's submitted deduction note if provided */}
        {caseData.playerAccusation?.deduction && (
          <div className="pt-2 border-t border-slate-800/80 space-y-1">
            <span className="text-[11px] font-mono uppercase text-slate-400">
              Your Recorded Deduction:
            </span>
            <p className="italic text-xs text-slate-300 bg-slate-950/40 p-3 rounded-lg border border-slate-800">
              "{caseData.playerAccusation.deduction}"
            </p>
          </div>
        )}
      </div>

      {/* 4. Complete Suspect Lineup (Exonerated vs True Culprit) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-mono font-bold text-slate-200">
          <Users className="w-4 h-4 text-amber-400" />
          <span>Suspect Lineup Review</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {caseData.suspects.map((suspect) => (
            <SuspectCard
              key={suspect.id}
              suspect={suspect}
              showGuiltyBadge={true}
              isGuilty={suspect.id === caseData.culpritId}
            />
          ))}
        </div>
      </div>

      {/* 5. Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to="/create"
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Investigate Another Mystery</span>
        </Link>
        <Link
          to="/"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Return to Precinct Lobby</span>
        </Link>
      </div>

    </div>
  );
}
