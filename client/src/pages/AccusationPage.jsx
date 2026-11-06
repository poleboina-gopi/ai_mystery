import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Eye, 
  ArrowLeft, 
  Gavel, 
  Siren, 
  BadgeCheck, 
  Lightbulb,
  FolderSearch,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  SlidersHorizontal,
  Zap
} from 'lucide-react';
import { getCase, submitAccusation } from '../api/client';
import SuspectCard from '../components/SuspectCard';
import LoadingOverlay from '../components/LoadingOverlay';
import { playAccusationSound } from '../utils/soundEffects';

export default function AccusationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mysteryCase, setMysteryCase] = useState(null);
  const [selectedSuspectId, setSelectedSuspectId] = useState(null);
  const [deduction, setDeduction] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Lineup view mode: 'lineup' (horizontal scroll) vs 'grid'
  const [viewMode, setViewMode] = useState('lineup');
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    getCase(id)
      .then(res => {
        if (res?.case) {
          if (res.case.status !== 'active') {
            navigate(`/cases/${id}/results`, { replace: true });
            return;
          }
          setMysteryCase(res.case);
        }
      })
      .catch(err => {
        setError(err?.response?.data?.error || err.message);
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const scrollLineup = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSuspectId) {
      setError('Please select a suspect from the lineup before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      playAccusationSound();
      
      const res = await submitAccusation(id, {
        suspectId: selectedSuspectId,
        deduction: deduction.trim()
      });

      if (res?.success) {
        navigate(`/cases/${id}/results`, { replace: true });
      } else {
        throw new Error(res?.error || 'Accusation failed to process.');
      }
    } catch (err) {
      console.error('Error submitting accusation:', err);
      setError(err?.response?.data?.error || err.message || 'Failed to submit accusation.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingOverlay message="Accessing Interrogation Chamber..." />;
  }

  if (!mysteryCase) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <p className="text-red-400 font-mono">Case file could not be found.</p>
        <Link to="/" className="text-amber-400 text-xs font-mono">Return to precinct</Link>
      </div>
    );
  }

  const selectedSuspect = mysteryCase.suspects.find(s => s.id === selectedSuspectId);
  const discoveredClues = mysteryCase.clues.filter(c => c.isDiscovered);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-fade-in space-y-8">
      
      {/* Back button */}
      <div>
        <Link
          to={`/cases/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Crime Scene Investigation</span>
        </Link>
      </div>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold tracking-wide">
          <Gavel className="w-3.5 h-3.5" />
          <span>Judicial Indictment Chamber</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-tight text-slate-100">
          File Formal Accusation
        </h1>
        <p className="text-sm text-slate-400 font-mono leading-relaxed">
          Case: <strong className="text-slate-200">{mysteryCase.title}</strong> ({mysteryCase.difficulty})
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <Siren className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Step 1: Suspect Selection with Horizontal Lineup / Grid Toggle */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="text-xs uppercase font-mono font-bold tracking-wider text-slate-300 block">
                1. Select Perpetrator from the Lineup
              </label>
              {selectedSuspect ? (
                <span className="text-xs font-mono text-amber-400 font-semibold flex items-center gap-1 mt-0.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Primary Indictment Target: <strong className="text-amber-300">{selectedSuspect.name}</strong> ({selectedSuspect.role})
                </span>
              ) : (
                <span className="text-xs font-mono text-slate-500 block mt-0.5">
                  Click a suspect card below to mark as the prime perpetrator
                </span>
              )}
            </div>

            {/* View Mode Toggle & Horizontal Scroll Buttons */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setViewMode('lineup')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                    viewMode === 'lineup' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Police Lineup (Horizontal Scroll)"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Lineup</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Dossier Grid"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Grid</span>
                </button>
              </div>

              {viewMode === 'lineup' && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => scrollLineup('left')}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-slate-700 transition-colors"
                    title="Scroll Left"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollLineup('right')}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-slate-700 transition-colors"
                    title="Scroll Right"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* HORIZONTAL POLICE LINEUP */}
          {viewMode === 'lineup' ? (
            <div className="relative rounded-2xl border border-slate-800/80 p-4 sm:p-6 lineup-wall shadow-2xl overflow-hidden">
              <div className="absolute top-2 left-4 text-[10px] font-mono text-slate-600 uppercase tracking-widest pointer-events-none">
                PRECINCT POLICE LINEUP • HEIGHT CALIBRATION
              </div>

              <div 
                ref={scrollContainerRef}
                className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pt-6 pb-2 no-scrollbar scroll-smooth"
              >
                {mysteryCase.suspects.map((suspect, idx) => (
                  <div 
                    key={suspect.id} 
                    className="w-[280px] sm:w-[320px] shrink-0 snap-center transition-transform duration-200"
                  >
                    <div className="text-[10px] font-mono text-center text-slate-500 mb-2">
                      SUSPECT #{idx + 1}
                    </div>
                    <SuspectCard
                      suspect={suspect}
                      selectable={true}
                      selected={selectedSuspectId === suspect.id}
                      onSelect={(sId) => setSelectedSuspectId(sId)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mysteryCase.suspects.map((suspect) => (
                <SuspectCard
                  key={suspect.id}
                  suspect={suspect}
                  selectable={true}
                  selected={selectedSuspectId === suspect.id}
                  onSelect={(sId) => setSelectedSuspectId(sId)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Step 2: Evidence Deductive Theory */}
        <div className="space-y-3">
          <label className="text-xs uppercase font-mono font-bold tracking-wider text-slate-300 block">
            2. Detective's Theory & Decisive Proof (Optional)
          </label>
          <textarea
            value={deduction}
            onChange={(e) => setDeduction(e.target.value)}
            rows={3}
            placeholder="Document how the discovered forensic clues break their alibi..."
            className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-sans leading-relaxed"
          />
        </div>

        {/* Quick Clues Discovered Checklist Summary */}
        <div className="noir-card p-4 sm:p-5 border-slate-800 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-300 mb-2">
            <span className="font-bold flex items-center gap-1.5">
              <FolderSearch className="w-4 h-4 text-cyan-400" />
              Evidence Examined: {discoveredClues.length} of {mysteryCase.clues.length}
            </span>
            <span className="text-amber-400">
              Reward for correct conviction: +{
                mysteryCase.difficulty === 'Easy' ? 100 : mysteryCase.difficulty === 'Medium' ? 150 : 200
              } Pts
            </span>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
            {discoveredClues.map(c => (
              <span key={c.id} className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60 text-slate-300">
                ✓ {c.title}
              </span>
            ))}
          </div>
        </div>

        {/* Irrevocable Warning & Submission Button */}
        <div className="noir-card p-6 border-red-500/30 bg-red-950/20 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-red-300 font-semibold">
            <Siren className="w-4 h-4 text-red-400" />
            <span>WARNING: INDICTMENT SUBMISSION IS FINAL AND CANNOT BE UNDONE</span>
          </div>

          <button
            type="submit"
            disabled={submitting || !selectedSuspectId}
            className="btn-shimmer w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-xl shadow-red-600/20 active:scale-95 transition-all mx-auto disabled:opacity-50 disabled:pointer-events-none"
          >
            <Gavel className="w-5 h-5" />
            <span>
              {submitting ? 'Deliberating Verdict...' : selectedSuspect ? `Indict ${selectedSuspect.name}` : 'Select a Suspect Above'}
            </span>
          </button>
        </div>

      </form>

    </div>
  );
}
