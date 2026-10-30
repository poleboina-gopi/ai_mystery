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
  RefreshCw
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

  const fetchCaseData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCase(id);
      if (res?.case) {
        // If case is already completed, forward to results
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

  // Handle Clue Discovery
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

  // Handle Hint Request
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-fade-in">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-200 text-xs font-mono shadow-2xl flex items-center gap-2 animate-slide-up">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Case Header & Stats Banner */}
      <div className="noir-card p-6 border-slate-800">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold">
                ACTIVE CASE FILE
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                ID: {mysteryCase._id?.substring(0, 8)}...
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              {mysteryCase.title}
            </h1>
          </div>

          {/* Score & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <ScoreBadge
              score={mysteryCase.score}
              difficulty={mysteryCase.difficulty}
              cluesDiscovered={discoveredCount}
              hintsUsed={hintsUsedCount}
              totalClues={mysteryCase.clues.length}
            />

            <button
              onClick={() => setIsHintModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-amber-400 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Precinct Hints ({mysteryCase.hints.length - hintsUsedCount} left)</span>
            </button>
          </div>

        </div>
      </div>

      {/* Case Incident Briefing */}
      <div className="noir-card p-6 sm:p-7 border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-amber-400 mb-3">
          <FileText className="w-4 h-4" />
          <span>Incident Overview & Briefing</span>
        </div>
        <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans whitespace-pre-line">
          {mysteryCase.story}
        </p>
      </div>

      {/* Suspects Lineup */}
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
            Inspect statements & secret motives
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mysteryCase.suspects.map((suspect) => (
            <SuspectCard key={suspect.id} suspect={suspect} />
          ))}
        </div>
      </div>

      {/* Crime Scene Clues Board */}
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
          {mysteryCase.clues.map((clue) => (
            <ClueCard
              key={clue.id}
              clue={clue}
              onDiscover={handleDiscoverClue}
              isDiscovering={discoveringClueId === clue.id}
            />
          ))}
        </div>
      </div>

      {/* Accusation CTA Banner */}
      <div className="noir-card p-6 sm:p-8 border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-slate-900 to-amber-950/20 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold text-slate-100">
          Ready to Name the Perpetrator?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Review your evidence carefully. Once you step into the interrogation room to submit your formal indictment, your verdict will be evaluated and the case will conclude.
        </p>
        <div className="pt-2">
          <button
            onClick={() => navigate(`/cases/${id}/accuse`)}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm sm:text-base inline-flex items-center gap-2 shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
          >
            <span>Proceed to Formal Accusation</span>
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
  );
}
