
/**
 * Pathfinders - OCEAN Personality Assessment Engine
 *
 * OCEAN / Big Five:
 * O - Openness
 * C - Conscientiousness
 * E - Extraversion
 * A - Agreeableness
 * N - Neuroticism (Emotional Sensitivity)
 *
 * Each question uses a 1-5 Likert scale.
 * Reverse-scored questions are inverted before scoring.
 */

export const OCEAN_QUESTIONS = [
  // 🟣 OPENNESS
  {
    id: 'O1',
    trait: 'O',
    emoji: '🎨',
    text: 'I enjoy exploring new ideas and creative possibilities.',
    reverseScored: false,
  },
  {
    id: 'O2',
    trait: 'O',
    emoji: '🔍',
    text: 'I like learning about topics that are completely new to me.',
    reverseScored: false,
  },
  {
    id: 'O3',
    trait: 'O',
    emoji: '💡',
    text: 'I enjoy finding different ways to solve a problem.',
    reverseScored: false,
  },
  {
    id: 'O4',
    trait: 'O',
    emoji: '📚',
    text: 'I prefer familiar activities over trying something new.',
    reverseScored: true,
  },
  {
    id: 'O5',
    trait: 'O',
    emoji: '🌈',
    text: 'I enjoy imagining possibilities beyond what I already know.',
    reverseScored: false,
  },

  // 🔵 CONSCIENTIOUSNESS
  {
    id: 'C1',
    trait: 'C',
    emoji: '📅',
    text: 'I make plans before starting an important task.',
    reverseScored: false,
  },
  {
    id: 'C2',
    trait: 'C',
    emoji: '🎯',
    text: 'I try to finish tasks before moving on to something else.',
    reverseScored: false,
  },
  {
    id: 'C3',
    trait: 'C',
    emoji: '📝',
    text: 'I keep my study materials and work organised.',
    reverseScored: false,
  },
  {
    id: 'C4',
    trait: 'C',
    emoji: '⏰',
    text: 'I often leave important work until the last minute.',
    reverseScored: true,
  },
  {
    id: 'C5',
    trait: 'C',
    emoji: '🏆',
    text: 'I keep working towards a goal even when it takes time.',
    reverseScored: false,
  },

  // 🟡 EXTRAVERSION
  {
    id: 'E1',
    trait: 'E',
    emoji: '🗣️',
    text: 'I feel comfortable starting conversations with new people.',
    reverseScored: false,
  },
  {
    id: 'E2',
    trait: 'E',
    emoji: '👥',
    text: 'I enjoy participating in group activities.',
    reverseScored: false,
  },
  {
    id: 'E3',
    trait: 'E',
    emoji: '🎤',
    text: 'I feel comfortable sharing my ideas in front of others.',
    reverseScored: false,
  },
  {
    id: 'E4',
    trait: 'E',
    emoji: '🌿',
    text: 'I usually prefer spending time alone rather than with a group.',
    reverseScored: true,
  },
  {
    id: 'E5',
    trait: 'E',
    emoji: '🤝',
    text: 'Meeting and interacting with people gives me energy.',
    reverseScored: false,
  },

  // 🟢 AGREEABLENESS
  {
    id: 'A1',
    trait: 'A',
    emoji: '❤️',
    text: 'I try to understand how other people feel.',
    reverseScored: false,
  },
  {
    id: 'A2',
    trait: 'A',
    emoji: '🤗',
    text: 'I willingly help others when they need support.',
    reverseScored: false,
  },
  {
    id: 'A3',
    trait: 'A',
    emoji: '🤝',
    text: 'I listen respectfully when someone has a different opinion.',
    reverseScored: false,
  },
  {
    id: 'A4',
    trait: 'A',
    emoji: '⚖️',
    text: "I rarely consider other people's feelings when making decisions.",
    reverseScored: true,
  },
  {
    id: 'A5',
    trait: 'A',
    emoji: '🌻',
    text: 'I try to cooperate rather than compete in group situations.',
    reverseScored: false,
  },

  // 🟠 NEUROTICISM / EMOTIONAL SENSITIVITY
  {
    id: 'N1',
    trait: 'N',
    emoji: '😟',
    text: 'I often feel worried when something unexpected happens.',
    reverseScored: false,
  },
  {
    id: 'N2',
    trait: 'N',
    emoji: '🌧️',
    text: 'Small setbacks can affect my mood for a long time.',
    reverseScored: false,
  },
  {
    id: 'N3',
    trait: 'N',
    emoji: '💭',
    text: 'I sometimes overthink situations that make me uncomfortable.',
    reverseScored: false,
  },
  {
    id: 'N4',
    trait: 'N',
    emoji: '🧘',
    text: 'I usually remain calm when facing stressful situations.',
    reverseScored: true,
  },
  {
    id: 'N5',
    trait: 'N',
    emoji: '🌊',
    text: 'I sometimes find it difficult to manage my emotions under pressure.',
    reverseScored: false,
  },
];

export const OCEAN_TRAITS = {
  O: {
    name: 'Openness',
    description: 'Curiosity, imagination and willingness to explore new ideas.',
  },
  C: {
    name: 'Conscientiousness',
    description: 'Organisation, responsibility and goal-oriented behaviour.',
  },
  E: {
    name: 'Extraversion',
    description: 'Social energy, communication and outgoing behaviour.',
  },
  A: {
    name: 'Agreeableness',
    description: 'Empathy, cooperation and consideration for others.',
  },
  N: {
    name: 'Emotional Sensitivity',
    description: 'How a person experiences and responds to stress and emotions.',
  },
};

/**
 * Accepts responses in either format:
 *
 * Object: { O1: 4, O2: 3 }
 *
 * Array: [{ questionId: 'O1', value: 4 }]
 *
 * Only valid integer answers from 1 to 5 are scored.
 */
function normalizeResponses(responses) {
  if (Array.isArray(responses)) {
    return Object.fromEntries(
      responses
        .filter(
          (item) =>
            item &&
            typeof item.questionId === 'string'
        )
        .map((item) => [item.questionId, item.value])
    );
  }

  if (responses && typeof responses === 'object') {
    return responses;
  }

  return {};
}

/**
 * Score all five OCEAN traits.
 * Reverse scoring formula: 6 - original answer.
 *
 * Percentage formula:
 * ((average score - 1) / 4) * 100
 */
export function calculateOceanScores(responses = {}) {
  const normalized = normalizeResponses(responses);

  const scores = {};

  let answeredCount = 0;

  for (const [traitCode, traitInfo] of Object.entries(OCEAN_TRAITS)) {
    const questions = OCEAN_QUESTIONS.filter(
      (question) => question.trait === traitCode
    );

    let total = 0;
    let traitAnsweredCount = 0;

    for (const question of questions) {
      const answer = normalized[question.id];

      if (
        typeof answer !== 'number' ||
        !Number.isInteger(answer) ||
        answer < 1 ||
        answer > 5
      ) {
        continue;
      }

      const scoredAnswer = question.reverseScored
        ? 6 - answer
        : answer;

      total += scoredAnswer;
      traitAnsweredCount += 1;
      answeredCount += 1;
    }

    const average =
      traitAnsweredCount > 0
        ? total / traitAnsweredCount
        : null;

    const percentage =
      average !== null
        ? Math.round(((average - 1) / 4) * 100)
        : null;

    scores[traitCode] = {
      code: traitCode,
      name: traitInfo.name,
      description: traitInfo.description,
      answeredCount: traitAnsweredCount,
      totalQuestions: questions.length,
      average: average === null
        ? null
        : Number(average.toFixed(2)),
      percentage,
      level:
        percentage === null
          ? 'Pending'
          : percentage >= 67
            ? 'High'
            : percentage >= 34
              ? 'Moderate'
              : 'Low',
    };
  }

  const totalQuestions = OCEAN_QUESTIONS.length;

  return {
    scores,
    answeredCount,
    totalQuestions,
    completionPercentage: Math.round(
      (answeredCount / totalQuestions) * 100
    ),
    isComplete: answeredCount === totalQuestions,
  };
}
