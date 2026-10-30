import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { generateMockMystery } from './mockGenerator.js';

// Schema validation for Gemini outputs
const MysteryOutputSchema = z.object({
  title: z.string().min(3),
  story: z.string().min(30),
  culpritId: z.string(),
  culpritName: z.string(),
  suspects: z.array(z.object({
    id: z.string(),
    name: z.string(),
    role: z.string(),
    relationship: z.string(),
    alibi: z.string(),
    motive: z.string(),
    isCulprit: z.boolean().default(false)
  })),
  clues: z.array(z.object({
    id: z.string(),
    title: z.string(),
    location: z.string(),
    description: z.string()
  })),
  hints: z.array(z.object({
    id: z.string(),
    content: z.string()
  })),
  solution: z.string().min(30)
});

export async function generateMysteryWithGemini({ premise, difficulty = 'Medium' }) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // If no API key is configured or set to placeholder, use intelligent fallback
  if (!apiKey || apiKey === 'your_gemini_api_key' || apiKey.length < 10) {
    console.warn('[GeminiService] No active GEMINI_API_KEY detected in environment. Using dynamic procedural mystery generator.');
    return generateMockMystery({ premise, difficulty });
  }

  const difficultySpecs = {
    Easy: { suspects: 3, clues: 5, hints: 2, desc: 'straightforward evidence pointing to culprit with minimal misdirection' },
    Medium: { suspects: 4, clues: 7, hints: 3, desc: 'balanced mystery with subtle alibi contradictions and 2 red herrings' },
    Hard: { suspects: 5, clues: 9, hints: 3, desc: 'complex web of deception, conflicting testimonies, and 3 red herrings' }
  }[difficulty] || { suspects: 4, clues: 7, hints: 3, desc: 'balanced mystery' };

  const prompt = `
You are a master criminal mystery architect creating an interactive detective case for a game.
Generate a captivating, logically watertight murder or grand theft mystery.

CASE SPECIFICATIONS:
- Difficulty: ${difficulty} (${difficultySpecs.desc})
- Premise / Theme: ${premise || 'An unexpected murder during an elite private event'}
- Number of Suspects: EXACTLY ${difficultySpecs.suspects}
- Number of Clues: EXACTLY ${difficultySpecs.clues}
- Number of Hints: EXACTLY ${difficultySpecs.hints}

RULES OF DEDUCTION:
1. Exactly ONE suspect is the true culprit.
2. The clues must logically and decisively identify the true culprit while ruling out or explaining innocent suspects.
3. Every clue must have an 'id' ("c1", "c2", ...), 'title', 'location', and a forensic 'description'.
4. Every suspect must have an 'id' ("s1", "s2", ...), 'name', 'role', 'relationship', 'alibi', 'motive', and 'isCulprit' (boolean, true for exactly one suspect).
5. 'culpritId' must match the culprit's 'id' (e.g. "s1"), and 'culpritName' must match their 'name'.
6. Hints must be sequential detective guidance from a precinct sergeant ("h1", "h2", ...).
7. 'solution' must be a detailed breakdown explaining how the clues convict the culprit and debunk their alibi.

OUTPUT FORMAT:
Respond with ONLY a valid, raw JSON object (no markdown, no backticks, no markdown fence) adhering to this structure:
{
  "title": "Case Title",
  "story": "Detailed incident narrative setting up the crime scene, time, and discovery...",
  "culpritId": "s1",
  "culpritName": "Suspect Name",
  "suspects": [
    { "id": "s1", "name": "Name", "role": "Role", "relationship": "Relationship to victim", "alibi": "Alibi details", "motive": "Possible motive", "isCulprit": true }
  ],
  "clues": [
    { "id": "c1", "title": "Clue Title", "location": "Crime scene spot", "description": "Forensic description of what is found" }
  ],
  "hints": [
    { "id": "h1", "content": "Helpful deductive tip" }
  ],
  "solution": "Complete revelation of how the crime was planned and executed..."
}
`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Using gemini-2.5-flash for speed and structured fidelity
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      }
    });

    const responseText = response.text?.trim();
    if (!responseText) {
      throw new Error('Empty response from Gemini API');
    }

    // Clean potential markdown formatting if returned
    const cleanJson = responseText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    const parsedData = JSON.parse(cleanJson);

    // Validate with Zod
    const validated = MysteryOutputSchema.parse(parsedData);

    // Ensure culprit flags match
    const hasCulprit = validated.suspects.some(s => s.id === validated.culpritId);
    if (!hasCulprit && validated.suspects.length > 0) {
      validated.suspects[0].isCulprit = true;
      validated.culpritId = validated.suspects[0].id;
      validated.culpritName = validated.suspects[0].name;
    }

    return {
      title: validated.title,
      story: validated.story,
      difficulty,
      premise: premise || validated.title,
      suspects: validated.suspects.map(s => ({
        ...s,
        isCulprit: s.id === validated.culpritId
      })),
      clues: validated.clues.map(c => ({
        ...c,
        isDiscovered: false
      })),
      hints: validated.hints.map(h => ({
        ...h,
        isUsed: false
      })),
      culpritId: validated.culpritId,
      culpritName: validated.culpritName,
      solution: validated.solution
    };
  } catch (err) {
    console.error('[GeminiService] Gemini API call or validation failed:', err.message);
    console.log('[GeminiService] Seamlessly falling back to dynamic procedural mystery generator.');
    return generateMockMystery({ premise, difficulty });
  }
}
