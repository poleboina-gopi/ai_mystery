/**
 * Scoring calculation engine for AI Mystery Room
 * 
 * Rules:
 * Correct accusation: Easy 100, Medium 150, Hard 200 points (0 if incorrect).
 * Discovered clues: +5 points each.
 * Hints used: -10 points each.
 * Minimum score: 0 (never negative).
 */

export function calculateScore({ isCorrect, difficulty, discoveredCluesCount = 0, hintsUsedCount = 0 }) {
  let basePoints = 0;
  if (isCorrect) {
    switch (difficulty) {
      case 'Easy':
        basePoints = 100;
        break;
      case 'Medium':
        basePoints = 150;
        break;
      case 'Hard':
        basePoints = 200;
        break;
      default:
        basePoints = 100;
    }
  }

  const clueBonus = discoveredCluesCount * 5;
  const hintPenalty = hintsUsedCount * 10;
  const rawTotal = basePoints + clueBonus - hintPenalty;
  const total = Math.max(0, rawTotal);

  return {
    basePoints,
    clueBonus,
    hintPenalty,
    total
  };
}
