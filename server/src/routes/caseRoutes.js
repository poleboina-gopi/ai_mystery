import express from 'express';
import {
  createCase,
  getCaseById,
  discoverClue,
  requestHint,
  submitAccusation,
  getCaseResult,
  listRecentCases
} from '../controllers/caseController.js';

const router = express.Router();

// Case generation and listing
router.post('/cases', createCase);
router.get('/cases', listRecentCases);

// Active investigation routes
router.get('/cases/:id', getCaseById);
router.post('/cases/:id/clues/:clueId/discover', discoverClue);
router.post('/cases/:id/hints', requestHint);

// Accusation & Result resolution
router.post('/cases/:id/accuse', submitAccusation);
router.get('/cases/:id/result', getCaseResult);

export default router;
