// PATHFINDERS Adaptive Follow-up Question Engine
// Takes Rapid Fire signals and synthesizes tailored follow-up questions for the Detailed Questionnaire

/**
 * Predefined deterministic fallback questions mapped by signal_id and track
 */
const FALLBACK_QUESTIONS_BY_SIGNAL = {
  signal_evidence_verification: {
    question: 'When you encounter two opposing viewpoints or project methodologies in school/college, how do you typically verify which one to trust?',
    type: 'likert_or_choice',
    dimension: 'Evidence Verification in Practice',
    options: [
      'I independently review raw data and academic sources.',
      'I test both with a small prototype or experiment.',
      'I ask an expert teacher or mentor for their assessment.',
      'I discuss with peers to see what common sense dictates.'
    ]
  },
  signal_collaborative_learning: {
    question: 'In deep technical or creative work, what balance between solo focus and team collaboration brings out your best results?',
    type: 'likert_or_choice',
    dimension: 'Collaboration Equilibrium',
    options: [
      'Mostly solo deep-work with occasional review check-ins.',
      'Equal split: brainstorming together, executing individually.',
      'Highly collaborative pairs or pods throughout execution.',
      'Leading the vision while coordinating member tasks.'
    ]
  },
  signal_high_agency_decision: {
    question: 'When a group or project team is stuck in circular debate, what role do you usually step into?',
    type: 'likert_or_choice',
    dimension: 'Team Agency & Leadership',
    options: [
      'I propose a concrete decision matrix to vote on.',
      'I volunteer to test one route myself to break the deadlock.',
      'I call a timeout and request external mentor input.',
      'I encourage everyone to compromise on a blended option.'
    ]
  },
  signal_iterative_learning: {
    question: 'Think about a project where your initial attempt failed. What helped you stay motivated and find the winning path?',
    type: 'likert_or_choice',
    dimension: 'Failure Persistence Strategy',
    options: [
      'Treating it like a puzzle and debugging what went wrong.',
      'Taking a break, clearing my mind, and restarting fresh.',
      'Researching how industry professionals solve identical issues.',
      'Pairing with a friend or peer who had a different perspective.'
    ]
  },
  signal_strategic_triage: {
    question: 'Under intense exam or project crunch, what is your most reliable personal method for organizing tasks?',
    type: 'likert_or_choice',
    dimension: 'Crunch-Time Execution',
    options: [
      'A strict written checklist prioritized by deadlines and weight.',
      'Time-blocking focused 45-minute sprints on the hardest piece.',
      'Knocking out small tasks first to build momentum.',
      'Adapting dynamically hour-by-hour based on what feels urgent.'
    ]
  },
  signal_high_logical_precision: {
    question: 'You demonstrated strong abstract pattern-matching. Which type of analytical problem gives you the most satisfaction?',
    type: 'likert_or_choice',
    dimension: 'Analytical Problem Affinity',
    options: [
      'Algorithmic and mathematical puzzles with clear right answers.',
      'System design: seeing how hardware, software, and tools connect.',
      'Data forensics: finding hidden insights within messy figures.',
      'Strategic simulation: predicting market or human behaviors.'
    ]
  },
  signal_general_problem_solving: {
    question: 'When tackling an unfamiliar topic or complex assignment, where do you prefer to start?',
    type: 'likert_or_choice',
    dimension: 'Unfamiliar Problem Onboarding',
    options: [
      'Reading foundational theory and watching tutorials first.',
      'Tinkering hands-on right away and learning from errors.',
      'Examining high-scoring examples or finished templates.',
      'Asking someone who mastered it to explain key concepts.'
    ]
  }
};

/**
 * Generates adaptive follow-up questions from Rapid Fire analysis signals
 * @param {Object} rapidFireAnalysis - result from analyzeRapidFireSession
 * @returns {Array} List of adaptive questions for Detailed Questionnaire
 */
export function generateAdaptiveFollowupQuestions(rapidFireAnalysis = {}) {
  const signals = rapidFireAnalysis?.adaptive_questionnaire_signals || rapidFireAnalysis?.rapidFireResult?.adaptive_questionnaire_signals || [];
  const generated = [];

  signals.forEach((sig) => {
    const template = FALLBACK_QUESTIONS_BY_SIGNAL[sig.signal_id];
    if (template) {
      generated.push({
        id: `adaptive_${sig.signal_id}`,
        derived_from_signal: sig.signal_id,
        category: sig.category,
        question: template.question,
        dimension: template.dimension,
        options: template.options,
        rationale: sig.observation
      });
    }
  });

  // Guarantee between 3 and 5 questions
  if (generated.length < 3) {
    const defaults = ['signal_general_problem_solving', 'signal_collaborative_learning', 'signal_iterative_learning'];
    defaults.forEach((defKey) => {
      if (!generated.some((g) => g.derived_from_signal === defKey)) {
        const item = FALLBACK_QUESTIONS_BY_SIGNAL[defKey];
        if (item) {
          generated.push({
            id: `adaptive_${defKey}`,
            derived_from_signal: defKey,
            category: 'Adaptive Discovery',
            question: item.question,
            dimension: item.dimension,
            options: item.options,
            rationale: 'Baseline discovery question to personalize mentor advice.'
          });
        }
      }
    });
  }

  return generated.slice(0, 5);
}

