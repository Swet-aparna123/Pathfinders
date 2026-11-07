
/**
 * Student Career Matching Utility
 *
 * Calculates career alignment using the logged-in
 * student's actual Holland RIASEC assessment answers.
 *
 * Rules:
 * - Only logged-in students can see their match.
 * - Reads user-specific assessment data first.
 * - Never invents default assessment answers.
 * - Match percentage represents actual RIASEC answer alignment.
 */

import { userProfileService } from './userProfileService.js';

const HOLLAND_TRAIT_NAMES = {
  R: { code: 'R', name: 'Realistic', archetype: 'The Builder' },
  I: { code: 'I', name: 'Investigative', archetype: 'The Investigator' },
  A: { code: 'A', name: 'Artistic', archetype: 'The Creator' },
  S: { code: 'S', name: 'Social', archetype: 'The Helper' },
  E: { code: 'E', name: 'Enterprising', archetype: 'The Leader' },
  C: { code: 'C', name: 'Conventional', archetype: 'The Organizer' },
};

export function getStudentMatchForCareer(career) {
  if (typeof window === 'undefined') {
    return { isVisible: false };
  }

  try {
    // 1. Verify the logged-in student.
    const profile = userProfileService.getProfile();

    const isStudent =
      profile?.role === 'student' &&
      typeof profile?.fullName === 'string' &&
      profile.fullName.trim().length > 0;

    if (!isStudent) {
      return { isVisible: false };
    }

    // 2. Get the active student's assessment.
    const uid = userProfileService.getActiveUserId();

    if (!uid) {
      return { isVisible: false };
    }

    const userAssessmentKey =
      `pathfinders_student_assessment_${uid}`;

    let studentAssessment = null;

    const rawAssessment = localStorage.getItem(userAssessmentKey);

    if (rawAssessment) {
      try {
        studentAssessment = JSON.parse(rawAssessment);
      } catch {
        studentAssessment = null;
      }
    }

    // Legacy fallback only for an already completed assessment.
    if (
      !studentAssessment &&
      profile.assessmentCompleted === true
    ) {
      try {
        const legacyRaw = localStorage.getItem(
          'pathfinders_student_assessment'
        );

        if (legacyRaw) {
          studentAssessment = JSON.parse(legacyRaw);
        }
      } catch {
        studentAssessment = null;
      }
    }

    if (!studentAssessment) {
      return {
        isVisible: false,
        needsAssessment: true,
      };
    }

    // 3. Validate actual RIASEC answer counts.
    const rawAnswers = studentAssessment.answers;

    if (!rawAnswers || typeof rawAnswers !== 'object') {
      return {
        isVisible: false,
        needsAssessment: true,
      };
    }

    const answers = {};

    for (const code of Object.keys(HOLLAND_TRAIT_NAMES)) {
      const count = Number(rawAnswers[code] ?? 0);

      if (!Number.isInteger(count) || count < 0) {
        return { isVisible: false };
      }

      answers[code] = count;
    }

    const totalAnswered = Object.values(answers).reduce(
      (total, count) => total + count,
      0
    );

    if (totalAnswered === 0) {
      return {
        isVisible: false,
        needsAssessment: true,
      };
    }

    // 4. Find the student's strongest RIASEC traits.
    const sortedTraits = Object.entries(answers)
      .map(([code, count]) => ({
        ...HOLLAND_TRAIT_NAMES[code],
        count,
        pct: Math.round((count / totalAnswered) * 100),
      }))
      .sort(
        (a, b) =>
          b.count - a.count ||
          b.pct - a.pct
      );

    const dominant = sortedTraits[0];
    const secondary = sortedTraits[1];

    // 5. Read the career's actual RIASEC requirements.
    const careerCode =
      typeof career?.riasecCode === 'string'
        ? career.riasecCode.toUpperCase()
        : '';

    const careerTraitNames = Array.isArray(career?.riasecTraits)
      ? career.riasecTraits
      : [];

    const matchingCodes = new Set(
      careerCode
        .split('')
        .filter((code) => HOLLAND_TRAIT_NAMES[code])
    );

    // Also support career traits stored as names.
    for (const [code, trait] of Object.entries(HOLLAND_TRAIT_NAMES)) {
      if (careerTraitNames.includes(trait.name)) {
        matchingCodes.add(code);
      }
    }

    // Do not invent a career match when requirements are missing.
    if (matchingCodes.size === 0) {
      return { isVisible: false };
    }

    // 6. Calculate actual RIASEC alignment.
    // This is the percentage of the student's answers
    // that fall within the career's listed RIASEC traits.
    const matchingAnswers = [...matchingCodes].reduce(
      (total, code) => total + answers[code],
      0
    );

    const matchPct = Math.round(
      (matchingAnswers / totalAnswered) * 100
    );

    const traitLabel =
      `${dominant.name} (${dominant.archetype}) & ` +
      `${secondary.name} (${secondary.archetype})`;

    return {
      isVisible: true,
      matchPct,
      topTraits: [dominant.name, secondary.name],
      traitLabel,
      dominantCode: dominant.code,
      secondaryCode: secondary.code,
      matchingCodes: [...matchingCodes],
      totalAnswered,
      matchingAnswers,
    };

  } catch (err) {
    console.warn(
      'Error calculating student career match:',
      err
    );

    return { isVisible: false };
  }
}
