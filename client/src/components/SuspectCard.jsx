import React, { useState } from 'react';
import { ScrollText, Siren, BadgeCheck } from 'lucide-react';

export default function SuspectCard({ 
  suspect, 
  selectable = false, 
  selected = false, 
  onSelect = () => {},
  showGuiltyBadge = false,
  isGuilty = false
}) {
  const [activeTab, setActiveTab] = useState('alibi'); // 'alibi' | 'motive'

  // Deterministic subtle avatar background hue based on name
  const hues = ['from-amber-600 to-amber-800', 'from-cyan-600 to-blue-800', 'from-indigo-600 to-purple-800', 'from-rose-600 to-pink-800', 'from-emerald-600 to-teal-800'];
  const hueIndex = Math.abs((suspect.name || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % hues.length;
  const avatarGradient = hues[hueIndex];

  return (
    <div
      onClick={selectable ? () => onSelect(suspect.id) : undefined}
      className={`relative noir-card p-5 transition-all duration-300 ${
        selectable ? 'cursor-pointer hover:border-amber-500/60' : ''
      } ${
        selected ? 'border-amber-400 bg-amber-950/20 shadow-xl shadow-amber-500/10 ring-2 ring-amber-400/50' : 'hover:border-slate-700'
      } ${
        showGuiltyBadge && isGuilty ? 'border-red-500 ring-2 ring-red-500/50 bg-red-950/30' : ''
      }`}
    >
      {/* Selection Indicator for Accusation page */}
      {selectable && (
        <div className="absolute top-4 right-4">
          <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
            selected 
              ? 'bg-amber-500 border-amber-400 text-slate-950' 
              : 'border-slate-600 bg-slate-800/80 text-transparent'
          }`}>
            <BadgeCheck className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Post-Verdict Guilty Badge */}
      {showGuiltyBadge && (
        <div className="absolute top-4 right-4">
          {isGuilty ? (
            <span className="text-[11px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40">
              TRUE CULPRIT
            </span>
          ) : (
            <span className="text-[11px] font-mono uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              EXONERATED
            </span>
          )}
        </div>
      )}

      {/* Header: Avatar, Name & Role */}
      <div className="flex items-center gap-3.5 mb-4 pr-8">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center font-bold text-lg text-white shadow-md shadow-black/40 border border-white/10 shrink-0`}>
          {suspect.name ? suspect.name.charAt(0) : '?'}
        </div>
        <div>
          <h3 className="font-bold text-base text-slate-100 tracking-tight leading-snug">
            {suspect.name}
          </h3>
          <p className="text-xs text-amber-400/90 font-medium">
            {suspect.role}
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            Relation: {suspect.relationship}
          </p>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="flex border-b border-slate-800 mb-3 text-xs font-mono">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setActiveTab('alibi'); }}
          className={`flex items-center gap-1.5 pb-2 px-1 border-b-2 transition-colors ${
            activeTab === 'alibi' 
              ? 'border-amber-400 text-amber-400 font-semibold' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ScrollText className="w-3.5 h-3.5" />
          <span>Statement & Alibi</span>
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setActiveTab('motive'); }}
          className={`flex items-center gap-1.5 pb-2 px-3 border-b-2 transition-colors ${
            activeTab === 'motive' 
              ? 'border-amber-400 text-amber-400 font-semibold' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Siren className="w-3.5 h-3.5" />
          <span>Motive & Notes</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="text-xs leading-relaxed text-slate-300 min-h-[72px]">
        {activeTab === 'alibi' ? (
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Stated Alibi:</span>
            <p className="italic font-serif-italic bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
              "{suspect.alibi}"
            </p>
          </div>
        ) : (
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Detective Observations:</span>
            <p className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80 text-amber-200/90">
              {suspect.motive}
            </p>
          </div>
        )}
      </div>

      {/* Footer Tag */}
      <div className="mt-4 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span>Suspect ID: #{suspect.id}</span>
        {selected && (
          <span className="text-amber-400 font-semibold flex items-center gap-1">
            <BadgeCheck className="w-3.5 h-3.5" /> Target of Accusation
          </span>
        )}
      </div>

    </div>
  );
}
