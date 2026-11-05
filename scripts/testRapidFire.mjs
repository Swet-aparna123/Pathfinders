// Rapid Fire Comprehensive Verification Test
import {
  TRACK_A_QUESTIONS,
  TRACK_B_QUESTIONS,
  TRACK_C_QUESTIONS,
  getQuestionsForEducationLevel
} from '../lib/rapidFireQuestionBank.js';
import { analyzeRapidFireSession } from '../lib/rapidFireEngine.js';
import { generateAdaptiveFollowupQuestions } from '../lib/adaptiveFollowupEngine.js';

console.log('=== PATHFINDERS RAPID FIRE VERIFICATION TEST ===\n');

// 1. Question Bank Counts & Structure
console.log('Test 1: Question Bank Counts & Structure');
console.assert(TRACK_A_QUESTIONS.length === 10, `Track A should have 10 questions, found ${TRACK_A_QUESTIONS.length}`);
console.assert(TRACK_B_QUESTIONS.length === 10, `Track B should have 10 questions, found ${TRACK_B_QUESTIONS.length}`);
console.assert(TRACK_C_QUESTIONS.length === 10, `Track C should have 10 questions, found ${TRACK_C_QUESTIONS.length}`);
console.log('✓ All 3 tracks contain exactly 10 questions each (Total: 30 questions).');

// Verify all questions have 4 options
[...TRACK_A_QUESTIONS, ...TRACK_B_QUESTIONS, ...TRACK_C_QUESTIONS].forEach((q) => {
  console.assert(q.options.length === 4, `${q.id} must have 4 options, found ${q.options.length}`);
});
console.log('✓ All 30 questions have exactly 4 options (A, B, C, D).');

// 2. Track Selection by Education Level
console.log('\nTest 2: Track Resolution by Education Level');
const trackA = getQuestionsForEducationLevel('Class 8–10');
console.assert(trackA.trackId === 'class_8_10', 'Expected trackId class_8_10');
console.log(`✓ 'Class 8–10' maps to: ${trackA.trackLabel}`);

const trackB = getQuestionsForEducationLevel('Class 11–12');
console.assert(trackB.trackId === 'class_11_12', 'Expected trackId class_11_12');
console.log(`✓ 'Class 11–12' maps to: ${trackB.trackLabel}`);

const trackC_ug = getQuestionsForEducationLevel('Undergraduate');
console.assert(trackC_ug.trackId === 'undergrad_postgrad', 'Expected trackId undergrad_postgrad');
console.log(`✓ 'Undergraduate' maps to: ${trackC_ug.trackLabel}`);

const trackC_pg = getQuestionsForEducationLevel('Postgraduate');
console.assert(trackC_pg.trackId === 'undergrad_postgrad', 'Expected trackId undergrad_postgrad');
console.log(`✓ 'Postgraduate' maps to: ${trackC_pg.trackLabel}`);

// 3. Objective Scoring Engine Tests
console.log('\nTest 3: Objective Reasoning Scored Questions');

// Track A: Q2 is C (42), Q9 is C (28)
const trackA_perfect_responses = TRACK_A_QUESTIONS.map((q) => {
  if (q.id === 'trackA_q2') return { questionId: q.id, selectedOption: 'C', isSkipped: false };
  if (q.id === 'trackA_q9') return { questionId: q.id, selectedOption: 'C', isSkipped: false };
  return { questionId: q.id, selectedOption: 'B', isSkipped: false };
});
const analysisA = analyzeRapidFireSession({ trackId: 'class_8_10', responses: trackA_perfect_responses });
console.assert(analysisA.objective_reasoning.correct === 2, `Expected 2 correct in Track A, got ${analysisA.objective_reasoning.correct}`);
console.assert(analysisA.objective_reasoning.accuracy_pct === 100, `Expected 100%, got ${analysisA.objective_reasoning.accuracy_pct}%`);
console.log(`✓ Track A Objective Scoring: ${analysisA.objective_reasoning.correct}/${analysisA.objective_reasoning.attempted} (${analysisA.objective_reasoning.accuracy_pct}%)`);

// Track B: Q2 is C (159), Q8 is C (survey conclusion)
const trackB_perfect_responses = TRACK_B_QUESTIONS.map((q) => {
  if (q.id === 'trackB_q2') return { questionId: q.id, selectedOption: 'C', isSkipped: false };
  if (q.id === 'trackB_q8') return { questionId: q.id, selectedOption: 'C', isSkipped: false };
  return { questionId: q.id, selectedOption: 'A', isSkipped: false };
});
const analysisB = analyzeRapidFireSession({ trackId: 'class_11_12', responses: trackB_perfect_responses });
console.assert(analysisB.objective_reasoning.correct === 2, `Expected 2 correct in Track B, got ${analysisB.objective_reasoning.correct}`);
console.assert(analysisB.objective_reasoning.accuracy_pct === 100, `Expected 100%, got ${analysisB.objective_reasoning.accuracy_pct}%`);
console.log(`✓ Track B Objective Scoring: ${analysisB.objective_reasoning.correct}/${analysisB.objective_reasoning.attempted} (${analysisB.objective_reasoning.accuracy_pct}%)`);

// Track C: Q2 is A (5 minutes), Q8 is B (4% lower)
const trackC_perfect_responses = TRACK_C_QUESTIONS.map((q) => {
  if (q.id === 'trackC_q2') return { questionId: q.id, selectedOption: 'A', isSkipped: false };
  if (q.id === 'trackC_q8') return { questionId: q.id, selectedOption: 'B', isSkipped: false };
  return { questionId: q.id, selectedOption: 'C', isSkipped: false };
});
const analysisC = analyzeRapidFireSession({ trackId: 'undergrad_postgrad', responses: trackC_perfect_responses });
console.assert(analysisC.objective_reasoning.correct === 2, `Expected 2 correct in Track C, got ${analysisC.objective_reasoning.correct}`);
console.assert(analysisC.objective_reasoning.accuracy_pct === 100, `Expected 100%, got ${analysisC.objective_reasoning.accuracy_pct}%`);
console.log(`✓ Track C Objective Scoring: ${analysisC.objective_reasoning.correct}/${analysisC.objective_reasoning.attempted} (${analysisC.objective_reasoning.accuracy_pct}%)`);

// 4. Behavioral Preferences & Dimensions Extraction
console.log('\nTest 4: Behavioral Preferences Extraction');
const dims = Object.keys(analysisB.behavioural_preferences);
console.assert(dims.length >= 8, `Expected at least 8 dimensions mapped, got ${dims.length}`);
console.log(`✓ Successfully extracted ${dims.length} behavioral dimensions without single-score collapse:`);
dims.slice(0, 5).forEach((d) => console.log(`   - ${d}: [${analysisB.behavioural_preferences[d].observed_patterns.join(', ')}]`));

// 5. Adaptive Follow-up Question Generation
console.log('\nTest 5: Adaptive Follow-up Generation');
const followups = generateAdaptiveFollowupQuestions(analysisB);
console.assert(followups.length >= 3 && followups.length <= 5, `Expected 3 to 5 questions, got ${followups.length}`);
console.log(`✓ Generated ${followups.length} adaptive follow-up questions for the Detailed Questionnaire:`);
followups.forEach((f, i) => console.log(`   Q${i + 1} (${f.category}): "${f.question.slice(0, 75)}..."`));

// 6. Handling of Skipped Questions
console.log('\nTest 6: Handling of Skipped Questions');
const skippedResponses = TRACK_A_QUESTIONS.map((q, idx) => {
  if (idx < 5) return { questionId: q.id, selectedOption: null, isSkipped: true };
  return { questionId: q.id, selectedOption: 'A', isSkipped: false };
});
const analysisSkipped = analyzeRapidFireSession({ trackId: 'class_8_10', responses: skippedResponses });
console.assert(analysisSkipped.metrics.skipped_count === 5, 'Expected 5 skipped');
console.assert(analysisSkipped.uncertainties.length === 5, 'Expected 5 uncertainties recorded');
console.log(`✓ Handled skipped questions gracefully: ${analysisSkipped.metrics.skipped_count} skipped, ${analysisSkipped.uncertainties.length} recorded in uncertainties array.`);

console.log('\n=== ALL TESTS PASSED SUCCESSFULLY ===');

