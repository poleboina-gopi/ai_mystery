export const MYSTERY_PRESETS = [
  {
    id: 'renaissance',
    emoji: '🏛️',
    title: 'The Stolen Renaissance Masterpiece',
    tag: 'Art Theft',
    premise: 'During a midnight private gala at the Obsidian Gallery, the alarm was triggered and the priceless "Heart of Verona" pendant vanished from a locked vitrine.'
  },
  {
    id: 'mansion',
    emoji: '🍸',
    title: 'The Crimson Toast at Blackwood Manor',
    tag: 'Poison Mystery',
    premise: 'During Lord Archibald Blackwood’s 70th birthday dinner, a 90-second power blackout struck. When lights returned, Lord Blackwood lay dead over his wine with his newly written will missing.'
  },
  {
    id: 'space',
    emoji: '🚀',
    title: 'Sabotage on Orbital Station Apex-9',
    tag: 'Sci-Fi Thriller',
    premise: 'The chief hydroponics researcher was discovered trapped inside an evacuated airlock 400 kilometers above Earth. The emergency manual cycle handle had been electronically locked from the command module.'
  },
  {
    id: 'cyber',
    emoji: '💻',
    title: 'Silicon Valley Source Code Murder',
    tag: 'Tech Noir',
    premise: 'The lead quantum AI architect at NeuroCore was found slumped over her terminal at 3 AM. The proprietary autonomous code repository was wiped, and her hardware security token was missing from her lanyard.'
  },
  {
    id: 'express',
    emoji: '🚂',
    title: 'Murder on the Alpine Night Express',
    tag: 'Classic Train',
    premise: 'As the luxury sleeper train plunged through the Simplon Tunnel during a blizzard, a gunshot rang out in Car 4. The reclusive diamond baron was shot through an open compartment window.'
  }
];

export const DIFFICULTY_CONFIG = {
  Easy: {
    suspects: 3,
    clues: 5,
    hints: 2,
    basePoints: 100,
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    description: 'Straightforward clues, clear alibis, and direct physical evidence.'
  },
  Medium: {
    suspects: 4,
    clues: 7,
    hints: 3,
    basePoints: 150,
    badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    description: 'Balanced challenge with conflicting timelines and subtle red herrings.'
  },
  Hard: {
    suspects: 5,
    clues: 9,
    hints: 3,
    basePoints: 200,
    badgeColor: 'border-crimson-500/40 text-red-400 bg-red-500/10',
    description: 'Deceptive web of deceit, layered motives, and complex alibi deconstructions.'
  }
};
