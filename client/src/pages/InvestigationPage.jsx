import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  Search, 
  Users, 
  HelpCircle, 
  ArrowRight, 
  FileText, 
  AlertCircle, 
  Sparkles, 
  CheckCircle,
  Gavel,
  ChevronDown
} from 'lucide-react';
import { getCase, discoverClue, requestHint } from '../api/client';
import SuspectCard from '../components/SuspectCard';
import ClueCard from '../components/ClueCard';
import HintModal from '../components/HintModal';
import ScoreBadge from '../components/ScoreBadge';
import LoadingOverlay from '../components/LoadingOverlay';

export default function InvestigationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mysteryCase, setMysteryCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Hint modal state
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [isRequestingHint, setIsRequestingHint] = useState(false);

  // Clue discovery loading state tracker (clueId)
  const [discoveringClueId, setDiscoveringClueId] = useState(null);

  // Notification toast
  const [toastMessage, setToastMessage] = useState(null);

  // Scroll-Linked reading progress state
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchCaseData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCase(id);
      if (res?.case) {
        if (res.case.status !== 'active') {
          navigate(`/cases/${id}/results`, { replace: true });
          return;
        }
        setMysteryCase(res.case);
      } else {
        throw new Error('Case not found');
      }
    } catch (err) {
      console.error('Error fetching case:', err);
      setError(err?.response?.data?.error || err.message || 'Failed to load case dossier.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCaseData();
    }
  }, [id]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDiscoverClue = async (clueId) => {
    try {
      setDiscoveringClueId(clueId);
      const res = await discoverClue(id, clueId);
      if (res?.success && res?.clue) {
        setMysteryCase(prev => {
          const updatedClues = prev.clues.map(c => c.id === clueId ? res.clue : c);
          return {
            ...prev,
            clues: updatedClues,
            score: {
              ...prev.score,
              clueBonus: res.clueBonus,
              total: res.totalScore
            }
          };
        });
        showToast(`🔍 Forensic Evidence Discovered! (+5 Points Added)`);
      }
    } catch (err) {
      console.error('Failed to discover clue:', err);
      showToast('⚠️ Could not examine clue: ' + (err?.response?.data?.error || err.message));
    } finally {
      setDiscoveringClueId(null);
    }
  };

  const handleRequestHint = async () => {
    try {
      setIsRequestingHint(true);
      const res = await requestHint(id);
      if (res?.success && res?.hint) {
        setMysteryCase(prev => {
          const updatedHints = prev.hints.map(h => h.id === res.hint.id ? res.hint : h);
          return {
            ...prev,
            hints: updatedHints,
            score: {
              ...prev.score,
              hintPenalty: res.hintPenalty,
              total: res.totalScore
            }
          };
        });
        showToast(`💡 Precinct Hint Unlocked (-10 Points Deducted)`);
      }
    } catch (err) {
      console.error('Failed to request hint:', err);
      showToast('⚠️ ' + (err?.response?.data?.error || err.message));
    } finally {
      setIsRequestingHint(false);
    }
  };

  if (loading) {
    return <LoadingOverlay message="Decrypting Case Dossier..." />;
  }

  if (error || !mysteryCase) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4 animate-fade-in">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-100">Unable to Access Dossier</h2>
        <p className="text-sm text-slate-400 font-mono">{error || 'Case not found'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
        >
          Return to Precinct
        </Link>
      </div>
    );
  }

  const discoveredCount = mysteryCase.clues.filter(c => c.isDiscovered).length;
  const hintsUsedCount = mysteryCase.hints.filter(h => h.isUsed).length;
  const clueProgressPct = Math.round((discoveredCount / mysteryCase.clues.length) * 100);

  return (
    <div className="relative min-h-screen">
      
      {/* 1. SCROLL-LINKED MOTION: Top Viewport Reading / Case Progress Bar */}
      <div className="fixed top-16 left-0 right-0 h-1 z-50 bg-slate-900/60 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 via-cyan-400 to-emerald-400 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 2. PIN / STICKY INVESTIGATION HUD: Holds Score & Action Bar in View */}
      <aside className="sticky top-16 z-40 bg-noir-950/85 backdrop-blur-md border-b border-slate-800/80 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-slate-300 font-semibold truncate max-w-[200px] sm:max-w-xs">
              {mysteryCase.title}
            </span>
            <span className="text-slate-500 hidden md:inline">|</span>
            <span className="text-amber-400/90 hidden md:inline">
              {clueProgressPct}% Clues Examined
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ScoreBadge
              score={mysteryCase.score}
              difficulty={mysteryCase.difficulty}
              cluesDiscovered={discoveredCount}
              hintsUsed={hintsUsedCount}
              totalClues={mysteryCase.clues.length}
            />

            <button
              onClick={() => setIsHintModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-amber-400 text-[11px] font-mono flex items-center gap-1 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Hints</span>
              <span>({mysteryCase.hints.length - hintsUsedCount})</span>
            </button>

            <button
              onClick={() => navigate(`/cases/${id}/accuse`)}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-md shadow-red-600/20 active:scale-95 transition-all"
            >
              <Gavel className="w-3.5 h-3.5" />
              <span>Accuse</span>
            </button>
          </div>

        </div>
      </aside>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-200 text-xs font-mono shadow-2xl flex items-center gap-2 animate-slide-up">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Case Header & Story Briefing */}
        <div className="noir-card p-6 sm:p-8 border-slate-800 relative overflow-hidden">
          
          {/* Depth / Parallax Accent Glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-amber-500/5 blur-3xl pointer-events-none ambient-float" />
          
          <div className="relative space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold uppercase">
                ACTIVE CASE FILE
              </span>
              <span className="text-slate-500">
                CASE #{mysteryCase._id?.substring(0, 8)}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              {mysteryCase.title}
            </h1>

            {/* Evidence Examination Progress Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Crime Scene Evidence Uncovered: {discoveredCount} of {mysteryCase.clues.length}</span>
                <span className="text-amber-400 font-bold">{clueProgressPct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-cyan-400 transition-all duration-500 rounded-full"
                  style={{ width: `${clueProgressPct}%` }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-amber-400 mb-2">
                <FileText className="w-4 h-4" />
                <span>Incident Briefing</span>
              </div>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans whitespace-pre-line bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
                {mysteryCase.story}
              </p>
            </div>
          </div>
        </div>

        {/* 3. SCROLL TRIGGER: Suspects Lineup Grid with Staggered Entrance */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-slate-100">Suspect Roster</h2>
              <span className="text-xs font-mono text-slate-400">
                ({mysteryCase.suspects.length} Persons of Interest)
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono hidden sm:block">
              Inspect alibis and examine motives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {mysteryCase.suspects.map((suspect, idx) => (
              <div 
                key={suspect.id}
                className="reveal-item"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <SuspectCard suspect={suspect} />
              </div>
            ))}
          </div>
        </div>

        {/* 4. SCROLL TRIGGER: Crime Scene Clues Board with Staggered Entrance */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold text-slate-100">Crime Scene Evidence</h2>
              <span className="text-xs font-mono text-cyan-400">
                ({discoveredCount} of {mysteryCase.clues.length} Discovered)
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400 hidden sm:block">
              Each discovered clue awards +5 points
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {mysteryCase.clues.map((clue, idx) => (
              <div 
                key={clue.id}
                className="reveal-item"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <ClueCard
                  clue={clue}
                  onDiscover={handleDiscoverClue}
                  isDiscovering={discoveringClueId === clue.id}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Final Accusation CTA Banner */}
        <div className="noir-card p-6 sm:p-8 border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-slate-900 to-amber-950/20 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-slate-100">
            Ready to Indict the Perpetrator?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Review your gathered evidence. Once you step into the judicial chamber, your indictment is final.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate(`/cases/${id}/accuse`)}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-display font-bold text-sm sm:text-base inline-flex items-center gap-2 shadow-xl shadow-amber-500/25 active:scale-95 transition-all btn-shimmer"
            >
              <span>Step into the Accusation Room</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hint Modal */}
        <HintModal
          isOpen={isHintModalOpen}
          onClose={() => setIsHintModalOpen(false)}
          hints={mysteryCase.hints}
          onRequestHint={handleRequestHint}
          isRequesting={isRequestingHint}
        />

      </div>
    </div>
  );
}
