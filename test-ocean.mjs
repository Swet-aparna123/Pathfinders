
import { calculateOceanScores } from './lib/oceanAssessmentEngine.js';

console.log('🧪 Starting OCEAN tests...');

// TEST 1: All answers are neutral (3).
const answers = {};

for (const trait of ['O', 'C', 'E', 'A', 'N']) {
  for (let i = 1; i <= 5; i++) {
    answers[`${trait}${i}`] = 3;
  }
}

const result = calculateOceanScores(answers);

console.log('\nTEST 1: Neutral answers');
console.log('Completion:', result.completionPercentage + '%');

for (const trait of Object.values(result.scores)) {
  console.log(`${trait.name}: ${trait.percentage}%`);
}

if (
  Object.values(result.scores).some(
    trait => trait.percentage !== 50
  ) ||
  !result.isComplete
) {
  throw new Error('❌ TEST 1 FAILED');
}

console.log('✅ TEST 1 PASSED');

// TEST 2: Reverse scoring.
const reverseResult = calculateOceanScores({ O4: 5 });

console.log('\nTEST 2: Reverse scoring');
console.log('O4 answer = 5');
console.log('Openness:', reverseResult.scores.O.percentage + '%');

if (reverseResult.scores.O.percentage !== 0) {
  throw new Error('❌ TEST 2 FAILED');
}

console.log('✅ TEST 2 PASSED');
console.log('\n🎉 SUCCESS: All OCEAN tests passed!');
