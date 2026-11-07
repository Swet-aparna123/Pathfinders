
import assert from 'node:assert/strict';

import {
  getAptitudeQuestions,
  evaluateAptitudeAssessment,
} from './lib/aptitudeAssessmentEngine.js';

console.log('🧪 Starting Aptitude Engine Tests...\n');

// TEST 1: Check total questions.
const questions = getAptitudeQuestions();

assert.equal(questions.length, 15);
console.log('✅ TEST 1: All 15 questions loaded');

// TEST 2: Check category distribution.
for (const category of ['numerical', 'verbal', 'logical']) {
  const categoryQuestions = getAptitudeQuestions(category);
  assert.equal(categoryQuestions.length, 5);
}

console.log('✅ TEST 2: All 3 categories contain 5 questions');

// TEST 3: Check that student questions hide answers.
assert.ok(
  questions.every(
    q => !('correctOptionId' in q) && !('explanation' in q)
  )
);

console.log('✅ TEST 3: Correct answers are hidden from students');

// TEST 4: Submit all correct answers.
const allCorrectAnswers = {
  NUM01: 'C',
  NUM02: 'C',
  NUM03: 'C',
  NUM04: 'B',
  NUM05: 'C',

  VER01: 'B',
  VER02: 'C',
  VER03: 'C',
  VER04: 'B',
  VER05: 'C',

  LOG01: 'B',
  LOG02: 'D',
  LOG03: 'B',
  LOG04: 'B',
  LOG05: 'A',
};

const perfectResult = evaluateAptitudeAssessment(allCorrectAnswers);

assert.equal(perfectResult.correct, 15);
assert.equal(perfectResult.percentage, 100);
assert.equal(perfectResult.isComplete, true);

console.log('✅ TEST 4: All correct answers produce 100%');

// TEST 5: Check category-wise scoring.
assert.equal(perfectResult.categories.numerical.percentage, 100);
assert.equal(perfectResult.categories.verbal.percentage, 100);
assert.equal(perfectResult.categories.logical.percentage, 100);

console.log('✅ TEST 5: Category-wise scoring works');

// TEST 6: Check incorrect answers.
const partialResult = evaluateAptitudeAssessment({
  NUM01: 'A',
  NUM02: 'C',
});

assert.equal(partialResult.correct, 1);
assert.equal(partialResult.incorrect, 1);
assert.equal(partialResult.attempted, 2);
assert.equal(partialResult.percentage, 7);

console.log('✅ TEST 6: Incorrect answers are scored correctly');

// TEST 7: Check unanswered questions.
const emptyResult = evaluateAptitudeAssessment({});

assert.equal(emptyResult.attempted, 0);
assert.equal(emptyResult.unanswered, 15);
assert.equal(emptyResult.percentage, 0);

console.log('✅ TEST 7: Unanswered questions are handled');

// TEST 8: Invalid question ID must be rejected.
assert.throws(
  () => evaluateAptitudeAssessment({ UNKNOWN: 'A' }),
  /Invalid question ID/
);

console.log('✅ TEST 8: Invalid question IDs are rejected');

// TEST 9: Invalid option must be rejected.
assert.throws(
  () => evaluateAptitudeAssessment({ NUM01: 'Z' }),
  /Invalid option/
);

console.log('✅ TEST 9: Invalid answer options are rejected');

console.log('\n🎉 SUCCESS: All 9 Aptitude Engine tests passed!');
