
import assert from 'node:assert/strict';

import {
  analyzeSkillGaps,
  generateSkillRoadmap,
} from './lib/skillGapRoadmapEngine.js';

console.log('\n🧪 Testing Person B - B5 Skill Gap Engine\n');

// Test data: required career skills
const requiredSkills = [
  { name: 'JavaScript', level: 4 },
  { name: 'Communication', level: 3 },
  { name: 'Problem Solving', level: 5 },
];

// Test data: student's current skills
const studentSkills = [
  { name: 'JavaScript', level: 2 },
  { name: 'Communication', level: 3 },
];

// TEST 1: Skill gap calculation
const result = analyzeSkillGaps({
  careerTitle: 'Software Developer',
  requiredSkills,
  studentSkills,
});

assert.equal(result.totalSkills, 3);
assert.equal(result.skillsMet, 1);
assert.equal(result.skillsNeedingImprovement, 2);

console.log('✅ Test 1 passed: Skill gaps calculated correctly.');

// TEST 2: Match percentage
assert.equal(result.matchPercentage, 42);

console.log('✅ Test 2 passed: Match percentage is correct.');

// TEST 3: Missing skill detection
assert.equal(result.missingSkills.length, 2);

console.log('✅ Test 3 passed: Missing skills identified.');

// TEST 4: Roadmap generation
const roadmap = generateSkillRoadmap(result);

assert.equal(roadmap.totalPhases, 2);
assert.equal(roadmap.phases[0].skillName, 'Problem Solving');

console.log('✅ Test 4 passed: Roadmap generated and prioritised.');

// TEST 5: Fully skilled student
const completeResult = analyzeSkillGaps({
  careerTitle: 'Software Developer',
  requiredSkills,
  studentSkills: [
    { name: 'JavaScript', level: 4 },
    { name: 'Communication', level: 3 },
    { name: 'Problem Solving', level: 5 },
  ],
});

assert.equal(completeResult.matchPercentage, 100);
assert.equal(completeResult.isReady, true);
assert.equal(generateSkillRoadmap(completeResult).totalPhases, 0);

console.log('✅ Test 5 passed: Fully skilled student is recognised.');

// TEST 6: Invalid skill level
assert.throws(() => {
  analyzeSkillGaps({
    requiredSkills: [{ name: 'JavaScript', level: 8 }],
    studentSkills: [],
  });
});

console.log('✅ Test 6 passed: Invalid skill levels rejected.');

console.log('\n🎉 SUCCESS: All 6 B5 tests passed!\n');

console.log('📊 Sample analysis:');
console.log(JSON.stringify(result, null, 2));

console.log('\n🗺️ Sample roadmap:');
console.log(JSON.stringify(roadmap, null, 2));
