process.env.NODE_ENV = 'test';
import test from 'node:test';
import assert from 'node:assert/strict';
import { connectDB } from '../src/config/db.js';
import app from '../server.js';

// Test the entire REST API workflow
test('Complete End-to-End Mystery Workflow', async () => {
  await connectDB();
  
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/api`;

  try {
    // 1. Health check
    const healthRes = await fetch(`${baseUrl}/health`);
    assert.equal(healthRes.status, 200);
    const healthData = await healthRes.json();
    assert.equal(healthData.status, 'online');

    // 2. Generate a mystery case (Easy difficulty: 3 suspects, 5 clues, 2 hints)
    const createRes = await fetch(`${baseUrl}/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        premise: 'A diamond ring vanished from the locked hotel vault',
        difficulty: 'Easy'
      })
    });
    assert.equal(createRes.status, 201);
    const createData = await createRes.json();
    assert.equal(createData.success, true);
    
    const activeCase = createData.case;
    assert.ok(activeCase._id);
    assert.equal(activeCase.difficulty, 'Easy');
    assert.equal(activeCase.suspects.length, 3);
    assert.equal(activeCase.clues.length, 5);
    assert.equal(activeCase.hints.length, 2);

    // SECURITY CHECK: Ensure culprit fields are NOT leaked in active case
    assert.equal(activeCase.culpritId, undefined, 'culpritId must be omitted');
    assert.equal(activeCase.culpritName, undefined, 'culpritName must be omitted');
    assert.equal(activeCase.solution, undefined, 'solution must be omitted');
    activeCase.suspects.forEach(s => {
      assert.equal(s.isCulprit, undefined, 'isCulprit must not be exposed on suspect objects');
    });

    // Also check unexamined clues & hints are masked
    assert.equal(activeCase.clues[0].isDiscovered, false);
    assert.match(activeCase.clues[0].description, /EVIDENCE UNEXAMINED/);
    assert.equal(activeCase.hints[0].isUsed, false);
    assert.match(activeCase.hints[0].content, /HINT LOCKED/);

    const caseId = activeCase._id;

    // 3. Retrieve active case via GET /api/cases/:id
    const getRes = await fetch(`${baseUrl}/cases/${caseId}`);
    assert.equal(getRes.status, 200);
    const getData = await getRes.json();
    assert.equal(getData.case.culpritId, undefined, 'GET active case must not leak culprit');

    // 4. Try to access results before accusation -> MUST BE FORBIDDEN (403)
    const earlyResultRes = await fetch(`${baseUrl}/cases/${caseId}/result`);
    assert.equal(earlyResultRes.status, 403, 'Early result access must be forbidden');

    // 5. Discover first clue -> should grant +5 points
    const firstClueId = activeCase.clues[0].id;
    const discoverRes = await fetch(`${baseUrl}/cases/${caseId}/clues/${firstClueId}/discover`, {
      method: 'POST'
    });
    assert.equal(discoverRes.status, 200);
    const discoverData = await discoverRes.json();
    assert.equal(discoverData.success, true);
    assert.equal(discoverData.clue.isDiscovered, true);
    assert.ok(discoverData.clue.description.length > 10);
    assert.equal(discoverData.clueBonus, 5);

    // 6. Request a precinct hint -> should deduct 10 points
    const hintRes = await fetch(`${baseUrl}/cases/${caseId}/hints`, {
      method: 'POST'
    });
    assert.equal(hintRes.status, 200);
    const hintData = await hintRes.json();
    assert.equal(hintData.success, true);
    assert.equal(hintData.hint.isUsed, true);
    assert.ok(hintData.hint.content.length > 5);
    assert.equal(hintData.hintPenalty, 10);
    assert.equal(hintData.hintsRemaining, 1);

    // 7. Submit Accusation
    const accusedSuspectId = activeCase.suspects[0].id;
    const accuseRes = await fetch(`${baseUrl}/cases/${caseId}/accuse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        suspectId: accusedSuspectId,
        deduction: 'The security log matches their arrival.'
      })
    });
    assert.equal(accuseRes.status, 200);
    const accuseData = await accuseRes.json();
    assert.equal(accuseData.success, true);
    assert.ok(['solved', 'failed'].includes(accuseData.verdict));
    assert.ok(accuseData.culpritName);
    assert.ok(accuseData.solution);
    assert.ok(accuseData.score.total >= 0);

    // 8. Now retrieve final result via GET /api/cases/:id/result -> 200 OK
    const finalResultRes = await fetch(`${baseUrl}/cases/${caseId}/result`);
    assert.equal(finalResultRes.status, 200);
    const finalResultData = await finalResultRes.json();
    assert.equal(finalResultData.case.status, accuseData.verdict);
    assert.equal(finalResultData.case.culpritName, accuseData.culpritName);

  } finally {
    server.close();
  }
});
