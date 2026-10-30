import { Case } from '../models/Case.js';
import { generateMysteryWithGemini } from '../services/geminiService.js';
import { calculateScore } from '../utils/scoring.js';

// 1. Generate a new mystery
export async function createCase(req, res) {
  try {
    const { premise = '', difficulty = 'Medium' } = req.body;

    if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      return res.status(400).json({ 
        success: false, 
        error: "Difficulty must be 'Easy', 'Medium', or 'Hard'." 
      });
    }

    console.log(`[CaseController] Creating mystery with difficulty: ${difficulty}`);
    const mysteryData = await generateMysteryWithGemini({ premise, difficulty });

    const newCase = new Case({
      title: mysteryData.title,
      story: mysteryData.story,
      difficulty: mysteryData.difficulty,
      premise: mysteryData.premise,
      suspects: mysteryData.suspects,
      clues: mysteryData.clues,
      hints: mysteryData.hints,
      culpritId: mysteryData.culpritId,
      culpritName: mysteryData.culpritName,
      solution: mysteryData.solution,
      status: 'active',
      score: {
        basePoints: 0,
        clueBonus: 0,
        hintPenalty: 0,
        total: 0
      }
    });

    const saved = await newCase.save();
    console.log(`[CaseController] Mystery created with ID: ${saved._id}`);

    // Return the safe active view (strips solution, culpritId, and unexamined clues/hints)
    res.status(201).json({
      success: true,
      case: saved.toActiveView()
    });
  } catch (err) {
    console.error('[CaseController] Error generating case:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate mystery case. ' + err.message 
    });
  }
}

// 2. Retrieve active mystery
export async function getCaseById(req, res) {
  try {
    const { id } = req.params;
    const mysteryCase = await Case.findById(id);

    if (!mysteryCase) {
      return res.status(404).json({ success: false, error: 'Case not found.' });
    }

    // If case is solved or failed, return with solution unlocked
    if (mysteryCase.status !== 'active') {
      const fullCase = await Case.findById(id).select('+culpritId +culpritName +solution +suspects.isCulprit');
      return res.json({
        success: true,
        case: fullCase
      });
    }

    res.json({
      success: true,
      case: mysteryCase.toActiveView()
    });
  } catch (err) {
    console.error('[CaseController] Error fetching case:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve case.' });
  }
}

// 3. Discover a clue
export async function discoverClue(req, res) {
  try {
    const { id, clueId } = req.params;
    const mysteryCase = await Case.findById(id);

    if (!mysteryCase) {
      return res.status(404).json({ success: false, error: 'Case not found.' });
    }

    if (mysteryCase.status !== 'active') {
      return res.status(400).json({ success: false, error: 'Cannot discover clues on a completed case.' });
    }

    const clue = mysteryCase.clues.find(c => c.id === clueId);
    if (!clue) {
      return res.status(404).json({ success: false, error: 'Clue not found in this crime scene.' });
    }

    const wasAlreadyDiscovered = clue.isDiscovered;
    if (!wasAlreadyDiscovered) {
      clue.isDiscovered = true;
      clue.discoveredAt = new Date();
      mysteryCase.score.clueBonus += 5;
      mysteryCase.score.total = Math.max(0, mysteryCase.score.basePoints + mysteryCase.score.clueBonus - mysteryCase.score.hintPenalty);
      await mysteryCase.save();
    }

    res.json({
      success: true,
      clue: {
        id: clue.id,
        title: clue.title,
        location: clue.location,
        description: clue.description,
        isDiscovered: true,
        discoveredAt: clue.discoveredAt
      },
      clueBonus: mysteryCase.score.clueBonus,
      totalScore: mysteryCase.score.total
    });
  } catch (err) {
    console.error('[CaseController] Error discovering clue:', err);
    res.status(500).json({ success: false, error: 'Failed to discover clue.' });
  }
}

// 4. Request a precinct hint
export async function requestHint(req, res) {
  try {
    const { id } = req.params;
    const mysteryCase = await Case.findById(id);

    if (!mysteryCase) {
      return res.status(404).json({ success: false, error: 'Case not found.' });
    }

    if (mysteryCase.status !== 'active') {
      return res.status(400).json({ success: false, error: 'Cannot request hints for a completed case.' });
    }

    const nextHint = mysteryCase.hints.find(h => !h.isUsed);
    if (!nextHint) {
      return res.status(400).json({ 
        success: false, 
        error: 'All available precinct hints have already been unlocked.' 
      });
    }

    nextHint.isUsed = true;
    nextHint.usedAt = new Date();
    mysteryCase.score.hintPenalty += 10;
    mysteryCase.score.total = Math.max(0, mysteryCase.score.basePoints + mysteryCase.score.clueBonus - mysteryCase.score.hintPenalty);
    await mysteryCase.save();

    const hintsRemaining = mysteryCase.hints.filter(h => !h.isUsed).length;

    res.json({
      success: true,
      hint: {
        id: nextHint.id,
        content: nextHint.content,
        isUsed: true,
        usedAt: nextHint.usedAt
      },
      hintsRemaining,
      hintPenalty: mysteryCase.score.hintPenalty,
      totalScore: mysteryCase.score.total
    });
  } catch (err) {
    console.error('[CaseController] Error requesting hint:', err);
    res.status(500).json({ success: false, error: 'Failed to request hint.' });
  }
}

// 5. Submit an accusation
export async function submitAccusation(req, res) {
  try {
    const { id } = req.params;
    const { suspectId, deduction = '' } = req.body;

    if (!suspectId) {
      return res.status(400).json({ success: false, error: 'You must select a suspect to accuse.' });
    }

    // Retrieve case with secret solution fields
    const mysteryCase = await Case.findById(id).select('+culpritId +culpritName +solution +suspects.isCulprit');

    if (!mysteryCase) {
      return res.status(404).json({ success: false, error: 'Case not found.' });
    }

    if (mysteryCase.status !== 'active') {
      return res.status(400).json({ 
        success: false, 
        error: 'An indictment has already been filed for this case.' 
      });
    }

    const suspectExists = mysteryCase.suspects.some(s => s.id === suspectId);
    if (!suspectExists) {
      return res.status(400).json({ success: false, error: 'Selected suspect is not on the suspect roster.' });
    }

    const isCorrect = suspectId === mysteryCase.culpritId;
    const discoveredCluesCount = mysteryCase.clues.filter(c => c.isDiscovered).length;
    const hintsUsedCount = mysteryCase.hints.filter(h => h.isUsed).length;

    const finalScore = calculateScore({
      isCorrect,
      difficulty: mysteryCase.difficulty,
      discoveredCluesCount,
      hintsUsedCount
    });

    mysteryCase.status = isCorrect ? 'solved' : 'failed';
    mysteryCase.playerAccusation = {
      suspectId,
      deduction,
      accusedAt: new Date()
    };
    mysteryCase.score = finalScore;

    await mysteryCase.save();

    res.json({
      success: true,
      verdict: mysteryCase.status,
      isCorrect,
      culpritId: mysteryCase.culpritId,
      culpritName: mysteryCase.culpritName,
      solution: mysteryCase.solution,
      score: finalScore,
      accusedSuspect: mysteryCase.suspects.find(s => s.id === suspectId)
    });
  } catch (err) {
    console.error('[CaseController] Error submitting accusation:', err);
    res.status(500).json({ success: false, error: 'Failed to evaluate accusation.' });
  }
}

// 6. Retrieve completed result
export async function getCaseResult(req, res) {
  try {
    const { id } = req.params;
    const mysteryCase = await Case.findById(id).select('+culpritId +culpritName +solution +suspects.isCulprit');

    if (!mysteryCase) {
      return res.status(404).json({ success: false, error: 'Case not found.' });
    }

    // Security requirement: Must not reveal before accusation
    if (mysteryCase.status === 'active') {
      return res.status(403).json({
        success: false,
        error: 'Accusation must be formally submitted before case resolution dossier can be accessed.'
      });
    }

    res.json({
      success: true,
      case: mysteryCase
    });
  } catch (err) {
    console.error('[CaseController] Error getting case result:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve result.' });
  }
}

// 7. List recent cases
export async function listRecentCases(req, res) {
  try {
    const cases = await Case.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .select('title difficulty status createdAt score.total');

    res.json({ success: true, cases });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch cases.' });
  }
}
