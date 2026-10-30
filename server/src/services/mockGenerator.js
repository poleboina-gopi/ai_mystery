/**
 * Intelligent fallback mystery generator
 * Generates thematic, coherent mysteries adhering to the difficulty specs when Gemini API is unavailable or missing keys.
 */

const PRESET_STORIES = [
  {
    theme: 'gallery',
    title: 'The Phantom of the Obsidian Gallery',
    story: 'At 11:42 PM during the private midnight opening of the Obsidian Gallery, the alarm was triggered in the high-security Renaissance wing. The priceless 16th-century diamond-encrusted pendant "The Heart of Verona" vanished from its climate-controlled vitrine. When police arrived, the security laser grid was disabled from an internal terminal, and three drops of specialized photographic fixative were found on the display pedestal.',
    suspectsPool: [
      { id: 's1', name: 'Julian Cross', role: 'Head Gallery Curator', relationship: 'Organized the exhibition', alibi: 'Claims he was in his executive office reviewing insurance paperwork.', motive: 'Deep in debt to offshore syndicates; was overheard arguing about loan defaults.' },
      { id: 's2', name: 'Elena Rostova', role: 'Chief of Security', relationship: 'Longtime security contractor', alibi: 'Claims she was patrolling the east perimeter during the system glitch.', motive: 'Recently denied promotion; holds the master override cryptographic key.' },
      { id: 's3', name: 'Vincent Moreau', role: 'Art Restorer & Appraiser', relationship: 'Contracted to evaluate the pendant', alibi: 'Was seen in the catering hall having champagne at 11:30 PM.', motive: 'Published a manifesto alleging the pendant belonged in a public museum, not private hands.' },
      { id: 's4', name: 'Claire Bennett', role: 'Catering Director', relationship: 'Catering vendor for the evening', alibi: 'Prepping dessert service in the west wing kitchen.', motive: 'Her father was bankrupt after a disputed transaction with the gallery owner.' },
      { id: 's5', name: 'Marcus Sterling', role: 'Private Collector & Guest of Honor', relationship: 'Prospective buyer', alibi: 'Viewing the Impressionist gallery on the second floor alone.', motive: 'Secretly outbid on the pendant ten years ago; vowed to acquire it at any cost.' }
    ],
    cluesPool: [
      { id: 'c1', title: 'Shattered Display Lock', location: 'Pedestal Vitrine', description: 'The electromagnetic lock was not forced from outside; it was deactivated using an authorized cryptographic keycard.' },
      { id: 'c2', title: 'Security Terminal Log', location: 'Control Room Terminal', description: 'The alarm was silenced at 11:41 PM using Keycard #04, assigned specifically to the Chief of Security.' },
      { id: 'c3', title: 'Drop of Photographic Fixative', location: 'Under the Pedestal', description: 'Chemical analysis reveals a specialized silver-based solvent used exclusively in antique art restoration workshops.' },
      { id: 'c4', title: 'Smudged Fingerprint on Emergency Exit', location: 'Fire Stairwell Door', description: 'A partial thumbprint on the exit panic bar belongs to Elena Rostova, with traces of powdered velvet.' },
      { id: 'c5', title: 'Crushed Silk Ribbon', location: 'Ventilation Grate', description: 'A frayed purple silk ribbon identical to the lanyard worn by catering staff, discarded near the exhaust vent.' },
      { id: 'c6', title: 'Damaged Security Camera Cable', location: 'Gallery Ceiling Junction', description: 'The fiber optic feed to Camera 3 was cleanly sliced with a surgical scalpel rather than industrial wire cutters.' },
      { id: 'c7', title: 'Offshore Wire Transfer Slip', location: 'Trash Can near Security Office', description: 'A crumpled transaction memo showing an incoming deposit of $250,000 pending delivery of "The Verona Asset".' },
      { id: 'c8', title: 'High-Purity Laser Neutralizer', location: 'Behind the Baroque Sculpture', description: 'A pocket-sized optical diffuser designed to bypass tripwires, engraved with initials "E.R."' },
      { id: 'c9', title: 'Altered Security Roster', location: 'Guard Station Binder', description: 'The East perimeter patrol log was falsified 2 hours in advance to create a fake window of absence.' }
    ],
    hintsPool: [
      { id: 'h1', content: 'Examine which suspect possessed both the cryptographic keycard override AND direct physical access to disable the perimeter cameras.' },
      { id: 'h2', content: 'Look closely at the chemical evidence: while art solvent was found, note how the panic bar and cryptographic logs directly contradict the security patrol alibi.' },
      { id: 'h3', content: 'The culprit planted the art restorer\'s fixative as a deliberate red herring, but couldn\'t disguise their own keycard timestamp and personal optical equipment.' }
    ],
    culpritId: 's2',
    culpritName: 'Elena Rostova',
    solution: 'Elena Rostova utilized her position as Chief of Security to orchestrate the theft. She falsified the patrol schedule in advance, used her personal Keycard #04 to disable the laser grid at 11:41 PM, and cut the Camera 3 feed with precision. To frame Vincent Moreau, she planted photographic fixative taken from the restoration lab. However, her panic-exit fingerprint, the hidden wire transfer deposit slip, and the laser neutralizer engraved with her initials firmly convict her.'
  },
  {
    theme: 'mansion',
    title: 'The Crimson Toast at Blackwood Manor',
    story: 'During Lord Archibald Blackwood\'s 70th birthday dinner at Blackwood Manor, the lights flickered and plunged the dining room into darkness for ninety seconds. When the chandelier hummed back to life, Archibald was slumped forward over his heirloom mahogany table, his vintage port glass knocked over and the aroma of bitter almonds lingering in the air. His freshly rewritten last will and testament had disappeared from his coat pocket.',
    suspectsPool: [
      { id: 's1', name: 'Beatrice Blackwood', role: 'Daughter & Philanthropist', relationship: 'Eldest child', alibi: 'Sitting at the far end of the dining table next to the butler.', motive: 'Discovered this afternoon that her father was disinheriting her in favor of a foreign charity.' },
      { id: 's2', name: 'Dr. Evelyn Sterling', role: 'Family Physician', relationship: 'Personal doctor for 15 years', alibi: 'Was attending to the fuse box in the service corridor when power failed.', motive: 'Archibald had uncovered that Evelyn had been prescribing unregulated experimental treatments.' },
      { id: 's3', name: 'Arthur Pendelton', role: 'Blackwood Estate Butler', relationship: 'Household manager for 30 years', alibi: 'Pouring wine at the sideboard when the darkness fell.', motive: 'Faced imminent termination without pension due to missing silver antiques.' },
      { id: 's4', name: 'Gideon Thorne', role: 'Estate Attorney', relationship: 'Drafter of the new will', alibi: 'Excused himself to the washroom just before the lights went out.', motive: 'Offered a 20% cut of the estate by an anonymous rival heir if the will vanished.' },
      { id: 's5', name: 'Lady Vivienne Vance', role: 'Business Partner & Neighbor', relationship: 'Co-owner of Blackwood Shipping Lines', alibi: 'Sitting across from Archibald holding a napkin over her dress.', motive: 'Archibald intended to force an audit into the shipping line\'s offshore accounts on Monday.' }
    ],
    cluesPool: [
      { id: 'c1', title: 'Spilled Port Wine Residue', location: 'Dining Table Cloth', description: 'Chemical analysis reveals deadly potassium cyanide dissolved into the sweet fortified wine.' },
      { id: 'c2', title: 'Tampered Circuit Breaker', location: 'Basement Electrical Panel', description: 'The main fuse was not blown by a surge; a digital relay timer had been clipped into the mains circuit.' },
      { id: 'c3', title: 'Medical Syringe Cap', location: 'Floor behind the Sideboard', description: 'A protective plastic tip from a 5ml hypodermic syringe, labeled with pharmaceutical-grade cyanide warnings.' },
      { id: 'c4', title: 'Empty Coat Pocket', location: 'Victim\'s Jacket', description: 'The inner breast pocket had a torn seam, indicating a document was forcefully snatched in haste.' },
      { id: 'c5', title: 'Fountain Pen Ink Stain', location: 'Dr. Evelyn\'s Cuff', description: 'A smudge of rare crimson gall ink matching the ink used by Lord Blackwood when signing legal documents.' },
      { id: 'c6', title: 'Discarded Burned Paper Ash', location: 'Library Fireplace', description: 'Remnants of parchment showing the Blackwood notary seal and the phrase "...bequeath to the St. Jude Foundation".' },
      { id: 'c7', title: 'Prescription Pad Page', location: 'Doctor\'s Medical Bag', description: 'A requisition form for toxic alkaloids with the patient name forged in hurried handwriting.' },
      { id: 'c8', title: 'Gold Cufflink with Medical Emblem', location: 'Under Victim\'s Chair', description: 'An antique 18k gold cufflink bearing the Rod of Asclepius, missing from Dr. Evelyn\'s left shirt sleeve.' },
      { id: 'c9', title: 'Audio Dictaphone Recording', location: 'Victim\'s Study Desk', description: 'A tape recording of Archibald stating: "If anything happens to me tonight, Evelyn knows I found out about the clinic."' }
    ],
    hintsPool: [
      { id: 'h1', content: 'Investigate the exact nature of the poison used and who possessed the professional access and knowledge to administer it.' },
      { id: 'h2', content: 'Check the physical items dropped near the crime scene: who is missing a piece of jewelry matching their attire?' },
      { id: 'h3', content: 'The electrical blackout was premeditated to provide cover. Compare who claimed to be checking the fuses with who had the victim\'s ink on their sleeves.' }
    ],
    culpritId: 's2',
    culpritName: 'Dr. Evelyn Sterling',
    solution: 'Dr. Evelyn Sterling murdered Lord Archibald Blackwood to prevent exposure of her fraudulent medical trials. Knowing Archibald was amending his will and preparing to contact authorities, Evelyn installed a timed relay on the circuit breaker. When darkness struck, she dosed Archibald\'s port with cyanide via syringe, ripped the new will from his pocket, and hurried to burn it. In the scramble, her gold medical cufflink detached under the victim\'s chair, and the victim\'s fresh red notary ink stained her cuff.'
  }
];

export function generateMockMystery({ premise, difficulty = 'Medium' }) {
  const counts = {
    Easy: { suspects: 3, clues: 5, hints: 2 },
    Medium: { suspects: 4, clues: 7, hints: 3 },
    Hard: { suspects: 5, clues: 9, hints: 3 },
  }[difficulty] || { suspects: 4, clues: 7, hints: 3 };

  // Select base preset or adapt
  const isMansion = /mansion|poison|estate|lord|dinner|will/i.test(premise);
  const base = isMansion ? PRESET_STORIES[1] : PRESET_STORIES[0];

  const selectedSuspects = base.suspectsPool.slice(0, counts.suspects).map(s => ({
    ...s,
    isCulprit: s.id === base.culpritId
  }));

  // Ensure culprit is in the suspect list
  const culpritInList = selectedSuspects.some(s => s.id === base.culpritId);
  if (!culpritInList) {
    const realCulprit = base.suspectsPool.find(s => s.id === base.culpritId);
    if (realCulprit) {
      selectedSuspects[0] = { ...realCulprit, isCulprit: true };
    }
  }

  const selectedClues = base.cluesPool.slice(0, counts.clues).map((c, idx) => ({
    ...c,
    id: `c${idx + 1}`,
    isDiscovered: false
  }));

  const selectedHints = base.hintsPool.slice(0, counts.hints).map((h, idx) => ({
    ...h,
    id: `h${idx + 1}`,
    isUsed: false
  }));

  return {
    title: `${base.title} (${difficulty} Case)`,
    story: premise ? `${premise}\n\n${base.story}` : base.story,
    difficulty,
    premise: premise || base.title,
    suspects: selectedSuspects,
    clues: selectedClues,
    hints: selectedHints,
    culpritId: base.culpritId,
    culpritName: base.culpritName,
    solution: base.solution
  };
}
