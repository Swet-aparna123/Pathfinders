// PATHFINDERS Rapid Fire Assessment Analysis Engine
// Evaluates objective reasoning performance and self-reported behavioural tendencies
// Generates structured signals to seed the Detailed Questionnaire.

import { TRACK_A_QUESTIONS, TRACK_B_QUESTIONS, TRACK_C_QUESTIONS } from './rapidFireQuestionBank.js';

const ALL_QUESTIONS_MAP = {};
[...TRACK_A_QUESTIONS, ...TRACK_B_QUESTIONS, ...TRACK_C_QUESTIONS].forEach((q) => {
  ALL_QUESTIONS_MAP[q.id] = q;
});

/**
 * Normalises dimension names for structured JSON output
 */
function normalizeDimensionKey(dimension) {
  return String(dimension || 'general')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * Analyzes a completed Rapid Fire assessment session
 * @param {Object} session
 *   - trackId: 'class_8_10' | 'class_11_12' | 'undergrad_postgrad'
 *   - responses: Array of { questionId, selectedOption, isSkipped, timeSpentMs }
 *   - userProfile: optional user metadata
 */
export function analyzeRapidFireSession(session = {}) {
  const { trackId = 'class_8_10', responses = [], userProfile = {} } = session;

  const responseMap = {};
  responses.forEach((r) => {
    responseMap[r.questionId] = r;
  });

  // Track questions
  let trackQuestions = TRACK_A_QUESTIONS;
  if (trackId === 'class_11_12') trackQuestions = TRACK_B_QUESTIONS;
  if (trackId === 'undergrad_postgrad') trackQuestions = TRACK_C_QUESTIONS;

  let totalQuestions = trackQuestions.length;
  let answeredCount = 0;
  let skippedCount = 0;

  // Objective metrics
  let objectiveAttempted = 0;
  let objectiveCorrect = 0;
  const objectiveByDimension = {};

  // Behavioral preferences
  const behaviouralByDimension = {};

  // Adaptive signals
  const adaptiveSignals = [];
  const uncertainties = [];

  trackQuestions.forEach((q) => {
    const resp = responseMap[q.id];
    const isSkipped = !resp || resp.isSkipped || !resp.selectedOption;

    if (isSkipped) {
      skippedCount++;
      uncertainties.push({
        question_id: q.id,
        title: q.title,
        dimension: q.dimension,
        reason: 'Question skipped by student'
      });
      return;
    }

    answeredCount++;
    const selectedOpt = q.options.find((o) => o.id === resp.selectedOption);

    // Objective Scoring
    if (q.type === 'objective') {
      objectiveAttempted++;
      const isCorrect = resp.selectedOption === q.correctOption;
      if (isCorrect) objectiveCorrect++;

      const dimKey = normalizeDimensionKey(q.dimension);
      if (!objectiveByDimension[dimKey]) {
        objectiveByDimension[dimKey] = {
          correct: 0,
          attempted: 0,
          accuracy_pct: 0,
          evidence_level: 'preliminary'
        };
      }
      objectiveByDimension[dimKey].attempted++;
      if (isCorrect) objectiveByDimension[dimKey].correct++;
      objectiveByDimension[dimKey].accuracy_pct = Math.round(
        (objectiveByDimension[dimKey].correct / objectiveByDimension[dimKey].attempted) * 100
      );
      objectiveByDimension[dimKey].evidence_level =
        objectiveByDimension[dimKey].attempted >= 2 ? 'moderate' : 'limited';
    }

    // Behavioral Analysis (Subjective Questions)
    if (q.type === 'subjective' && selectedOpt) {
      const dimKey = normalizeDimensionKey(q.dimension);
      if (!behaviouralByDimension[dimKey]) {
        behaviouralByDimension[dimKey] = {
          dimension_label: q.dimension,
          observed_patterns: [],
          observed_traits: [],
          evidence_level: 'preliminary'
        };
      }

      if (selectedOpt.pattern) {
        behaviouralByDimension[dimKey].observed_patterns.push(selectedOpt.pattern);
      }
      if (selectedOpt.trait) {
        behaviouralByDimension[dimKey].observed_traits.push(selectedOpt.trait);
      }
    }
  });

  // Calculate overall objective accuracy
  const objectiveAccuracy = objectiveAttempted > 0
    ? Math.round((objectiveCorrect / objectiveAttempted) * 100)
    : 0;

  // Synthesize Adaptive Questionnaire Signals (Section 7 in specs)
  // 1. Evidence evaluation & critical thinking
  const critThinking = behaviouralByDimension['critical_thinking'] || behaviouralByDimension['critical_evaluation'] || behaviouralByDimension['evidence_evaluation'];
  if (critThinking?.observed_patterns.some((p) => p.includes('verification') || p.includes('deconstruction') || p.includes('meta_analytic') || p.includes('socratic'))) {
    adaptiveSignals.push({
      signal_id: 'signal_evidence_verification',
      category: 'Critical Evaluation',
      observation: 'Student demonstrates a tendency to cross-check sources and compare methodologies before reaching conclusions.',
      followup_focus: 'Explore real-world evaluation of conflicting claims and academic research habits.'
    });
  }

  // 2. Collaboration & help-seeking
  const collab = behaviouralByDimension['collaboration_and_decision_making'] || behaviouralByDimension['collaborative_decision_making'] || behaviouralByDimension['conflict_resolution'];
  if (collab?.observed_patterns.some((p) => p.includes('guidance') || p.includes('community') || p.includes('consensus') || p.includes('inquiry'))) {
    adaptiveSignals.push({
      signal_id: 'signal_collaborative_learning',
      category: 'Collaboration',
      observation: 'Student values consulting peers and experienced mentors to unblock challenges.',
      followup_focus: 'Explore independent self-directed learning versus group project team dynamics.'
    });
  } else if (collab?.observed_patterns.some((p) => p.includes('decisive_leadership') || p.includes('assertive_advocate') || p.includes('principled_dissent'))) {
    adaptiveSignals.push({
      signal_id: 'signal_high_agency_decision',
      category: 'Leadership & Autonomy',
      observation: 'Student exhibits high decision-making autonomy and willingness to drive stalled initiatives.',
      followup_focus: 'Explore project ownership, initiative leadership, and team debate handling.'
    });
  }

  // 3. Learning from failure & adaptation
  const learningFail = behaviouralByDimension['learning_from_mistakes'] || behaviouralByDimension['feedback_orientation'] || behaviouralByDimension['reflective_learning'];
  if (learningFail?.observed_patterns.some((p) => p.includes('hypothesis_shift') || p.includes('growth_mindset') || p.includes('systematic_postmortem') || p.includes('error_audit'))) {
    adaptiveSignals.push({
      signal_id: 'signal_iterative_learning',
      category: 'Learning Agility',
      observation: 'Student adjusts strategies diagnostically following setbacks rather than abandoning tasks.',
      followup_focus: 'Explore persistence strategies and adaptation during deep or multi-week projects.'
    });
  }

  // 4. Prioritisation & constraint management
  const prio = behaviouralByDimension['prioritisation'] || behaviouralByDimension['resource_management'] || behaviouralByDimension['constraint_management'];
  if (prio?.observed_patterns.some((p) => p.includes('eisenhower') || p.includes('strategic_triage') || p.includes('critical_path') || p.includes('iron_triangle'))) {
    adaptiveSignals.push({
      signal_id: 'signal_strategic_triage',
      category: 'Workload & Time Management',
      observation: 'Student naturally triages competing demands through structured effort/urgency frameworks.',
      followup_focus: 'Explore real-life calendar blocking, milestone delivery habits, and crunch-time endurance.'
    });
  }

  // 5. Objective reasoning strength
  if (objectiveAttempted > 0 && objectiveAccuracy >= 80) {
    adaptiveSignals.push({
      signal_id: 'signal_high_logical_precision',
      category: 'Logical & Quantitative Reasoning',
      observation: 'Demonstrated precise pattern-matching and deterministic reasoning on objective benchmark questions.',
      followup_focus: 'Explore affinity for systems architecture, formal mathematics, and algorithmic puzzles.'
    });
  }

  // Ensure at least 3 baseline signals exist if student answered mostly subjective options
  if (adaptiveSignals.length < 3) {
    adaptiveSignals.push({
      signal_id: 'signal_general_problem_solving',
      category: 'General Problem Approach',
      observation: 'Prefers evaluating multiple possible routes before committing full resources.',
      followup_focus: 'Explore real-world decision-making habits and project execution workflows.'
    });
  }

  // Profile completion status (at least 7 out of 10 answered)
  const isCompleted = answeredCount >= Math.min(7, totalQuestions);

  // Build schema matching Section 10
  return {
    assessment_type: 'rapid_fire',
    track: trackId,
    version: '1.0',
    completion_status: isCompleted ? 'completed' : 'partially_completed',
    timestamp: new Date().toISOString(),
    metrics: {
      total_questions: totalQuestions,
      answered_count: answeredCount,
      skipped_count: skippedCount,
      completion_rate_pct: Math.round((answeredCount / totalQuestions) * 100),
    },
    objective_reasoning: {
      attempted: objectiveAttempted,
      correct: objectiveCorrect,
      accuracy_pct: objectiveAccuracy,
      dimensions: objectiveByDimension
    },
    behavioural_preferences: behaviouralByDimension,
    uncertainties,
    adaptive_questionnaire_signals: adaptiveSignals,
    career_recommendation_ready: false,
    disclaimer: 'Rapid Fire is an exploratory assessment measuring preliminary decision patterns and reasoning styles. It does not label intelligence or directly assign careers.'
  };
}
