import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateScore } from '../src/utils/scoring.js';
import { generateMockMystery } from '../src/services/mockGenerator.js';

test('calculateScore gives correct values for Easy, Medium, Hard', () => {
  // Easy: Base 100
  const easyScore = calculateScore({
    isCorrect: true,
    difficulty: 'Easy',
    discoveredCluesCount: 5, // 5 * 5 = 25
    hintsUsedCount: 1        // 1 * 10 = 10
  });
  assert.equal(easyScore.basePoints, 100);
  assert.equal(easyScore.clueBonus, 25);
  assert.equal(easyScore.hintPenalty, 10);
  assert.equal(easyScore.total, 115); // 100 + 25 - 10

  // Medium: Base 150
  const medScore = calculateScore({
    isCorrect: true,
    difficulty: 'Medium',
    discoveredCluesCount: 7, // 35
    hintsUsedCount: 2        // 20
  });
  assert.equal(medScore.basePoints, 150);
  assert.equal(medScore.total, 165); // 150 + 35 - 20

  // Hard: Base 200
  const hardScore = calculateScore({
    isCorrect: true,
    difficulty: 'Hard',
    discoveredCluesCount: 9, // 45
    hintsUsedCount: 0
  });
  assert.equal(hardScore.basePoints, 200);
  assert.equal(hardScore.total, 245); // 200 + 45
});

test('calculateScore floors total score at 0 when penalties exceed points', () => {
  const failedScore = calculateScore({
    isCorrect: false, // 0 base
    difficulty: 'Easy',
    discoveredCluesCount: 1, // +5
    hintsUsedCount: 2        // -20
  });
  assert.equal(failedScore.basePoints, 0);
  assert.equal(failedScore.clueBonus, 5);
  assert.equal(failedScore.hintPenalty, 20);
  assert.equal(failedScore.total, 0); // 5 - 20 = -15 -> floored to 0
});

test('generateMockMystery fulfills difficulty specifications', () => {
  const easy = generateMockMystery({ premise: 'Stolen painting', difficulty: 'Easy' });
  assert.equal(easy.suspects.length, 3);
  assert.equal(easy.clues.length, 5);
  assert.equal(easy.hints.length, 2);

  const medium = generateMockMystery({ premise: 'Stolen painting', difficulty: 'Medium' });
  assert.equal(medium.suspects.length, 4);
  assert.equal(medium.clues.length, 7);
  assert.equal(medium.hints.length, 3);

  const hard = generateMockMystery({ premise: 'Stolen painting', difficulty: 'Hard' });
  assert.equal(hard.suspects.length, 5);
  assert.equal(hard.clues.length, 9);
  assert.equal(hard.hints.length, 3);
});
