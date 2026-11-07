
/**
 * Person B - B5
 * Skill Gap Analysis and Learning Roadmap Engine
 *
 * Independent engine. No database or dashboard integration yet.
 */

/**
 * Analyse the gap between a student's current skills
 * and the skills required for a selected career.
 *
 * Skill levels:
 * 0 = No knowledge
 * 1 = Beginner
 * 2 = Basic
 * 3 = Intermediate
 * 4 = Advanced
 * 5 = Expert
 */

const VALID_LEVELS = [0, 1, 2, 3, 4, 5];

const LEVEL_LABELS = {
  0: 'Not Started',
  1: 'Beginner',
  2: 'Basic',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Expert',
};

function validateSkill(skill, sourceName) {
  if (!skill || typeof skill !== 'object') {
    throw new Error(`Invalid skill in ${sourceName}.`);
  }

  if (typeof skill.name !== 'string' || !skill.name.trim()) {
    throw new Error(`Every skill in ${sourceName} needs a name.`);
  }

  if (!VALID_LEVELS.includes(skill.level)) {
    throw new Error(
      `Skill "${skill.name}" must have a level from 0 to 5.`
    );
  }

  return {
    name: skill.name.trim(),
    level: skill.level,
  };
}

function createLearningActions(skillName, currentLevel, requiredLevel) {
  const actions = [];

  if (currentLevel < 1) {
    actions.push(`Learn the fundamentals of ${skillName}.`);
  }

  if (currentLevel < 2 && requiredLevel >= 2) {
    actions.push(`Practise basic ${skillName} exercises.`);
  }

  if (currentLevel < 3 && requiredLevel >= 3) {
    actions.push(`Complete an intermediate ${skillName} project.`);
  }

  if (currentLevel < 4 && requiredLevel >= 4) {
    actions.push(`Apply ${skillName} to a practical real-world task.`);
  }

  if (currentLevel < 5 && requiredLevel === 5) {
    actions.push(`Build advanced expertise in ${skillName}.`);
  }

  return actions;
}

export function analyzeSkillGaps({
  careerTitle = 'Selected Career',
  requiredSkills = [],
  studentSkills = [],
} = {}) {
  if (!Array.isArray(requiredSkills) || !Array.isArray(studentSkills)) {
    throw new Error('requiredSkills and studentSkills must be arrays.');
  }

  if (requiredSkills.length === 0) {
    throw new Error('At least one required skill must be provided.');
  }

  const required = requiredSkills.map((skill) =>
    validateSkill(skill, 'requiredSkills')
  );

  const current = studentSkills.map((skill) =>
    validateSkill(skill, 'studentSkills')
  );

  const currentSkillMap = new Map(
    current.map((skill) => [
      skill.name.toLowerCase(),
      skill.level,
    ])
  );

  const skillAnalysis = required.map((skill) => {
    const currentLevel =
      currentSkillMap.get(skill.name.toLowerCase()) ?? 0;

    const gap = Math.max(0, skill.level - currentLevel);

    return {
      skillName: skill.name,
      currentLevel,
      currentLevelLabel: LEVEL_LABELS[currentLevel],
      requiredLevel: skill.level,
      requiredLevelLabel: LEVEL_LABELS[skill.level],
      gap,
      gapStatus:
        gap === 0
          ? 'Met'
          : gap <= 2
          ? 'Needs Improvement'
          : 'Major Gap',
      learningActions: createLearningActions(
        skill.name,
        currentLevel,
        skill.level
      ),
    };
  });

  const totalRequired = required.reduce(
    (sum, skill) => sum + skill.level,
    0
  );

  const totalCurrent = skillAnalysis.reduce(
    (sum, skill) =>
      sum + Math.min(skill.currentLevel, skill.requiredLevel),
    0
  );

  const matchPercentage =
    totalRequired === 0
      ? 100
      : Math.round((totalCurrent / totalRequired) * 100);

  const missingSkills = skillAnalysis.filter(
    (skill) => skill.gap > 0
  );

  return {
    careerTitle,
    matchPercentage,
    totalSkills: required.length,
    skillsMet: skillAnalysis.length - missingSkills.length,
    skillsNeedingImprovement: missingSkills.length,
    skillAnalysis,
    missingSkills,
    isReady: missingSkills.length === 0,
  };
}

/**
 * Generate a simple learning roadmap from skill-gap results.
 * Skills with larger gaps are prioritised first.
 */

export function generateSkillRoadmap(skillGapResult = {}) {
  if (!Array.isArray(skillGapResult.missingSkills)) {
    throw new Error('Valid skill-gap analysis result is required.');
  }

  const priorityOrder = [...skillGapResult.missingSkills].sort(
    (a, b) => b.gap - a.gap
  );

  const phases = priorityOrder.map((skill, index) => ({
    phase: index + 1,
    title: `Build ${skill.skillName}`,
    skillName: skill.skillName,
    currentLevel: skill.currentLevel,
    targetLevel: skill.requiredLevel,
    priority:
      skill.gap >= 3
        ? 'High'
        : skill.gap === 2
        ? 'Medium'
        : 'Low',
    activities: skill.learningActions,
    completionCriteria: `Reach level ${skill.requiredLevel} in ${skill.skillName}.`,
    status: 'Not Started',
  }));

  return {
    careerTitle: skillGapResult.careerTitle || 'Selected Career',
    totalPhases: phases.length,
    estimatedStatus:
      phases.length === 0 ? 'Ready' : 'Learning Required',
    phases,
  };
}
