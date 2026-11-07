
/**
 * PATHFINDERS - APTITUDE ASSESSMENT ENGINE
 * Person B - B2
 *
 * Categories:
 * 1. Numerical Reasoning
 * 2. Verbal Reasoning
 * 3. Logical Reasoning
 */

export const APTITUDE_CATEGORIES = {
  NUMERICAL: 'numerical',
  VERBAL: 'verbal',
  LOGICAL: 'logical',
};

const QUESTION_BANK = [
  // 🔢 NUMERICAL REASONING
  {
    id: 'NUM01',
    category: 'numerical',
    difficulty: 'easy',
    question: '🔢 What is 15% of 200?',
    options: [
      { id: 'A', text: '20' },
      { id: 'B', text: '25' },
      { id: 'C', text: '30' },
      { id: 'D', text: '35' },
    ],
    correctOptionId: 'C',
    explanation: '15% of 200 = (15 / 100) × 200 = 30.',
  },
  {
    id: 'NUM02',
    category: 'numerical',
    difficulty: 'easy',
    question: '🔢 Find the next number: 5, 10, 20, 40, ?',
    options: [
      { id: 'A', text: '60' },
      { id: 'B', text: '70' },
      { id: 'C', text: '80' },
      { id: 'D', text: '100' },
    ],
    correctOptionId: 'C',
    explanation: 'Each number is multiplied by 2. So 40 × 2 = 80.',
  },
  {
    id: 'NUM03',
    category: 'numerical',
    difficulty: 'medium',
    question: '🧮 A student scores 72 out of 90. What is the percentage?',
    options: [
      { id: 'A', text: '70%' },
      { id: 'B', text: '75%' },
      { id: 'C', text: '80%' },
      { id: 'D', text: '85%' },
    ],
    correctOptionId: 'C',
    explanation: '(72 / 90) × 100 = 80%.',
  },
  {
    id: 'NUM04',
    category: 'numerical',
    difficulty: 'medium',
    question: '📊 The average of 10, 20 and 30 is:',
    options: [
      { id: 'A', text: '15' },
      { id: 'B', text: '20' },
      { id: 'C', text: '25' },
      { id: 'D', text: '30' },
    ],
    correctOptionId: 'B',
    explanation: '(10 + 20 + 30) / 3 = 20.',
  },
  {
    id: 'NUM05',
    category: 'numerical',
    difficulty: 'hard',
    question: '💡 A product costs ₹800 after a 20% discount. What was its original price?',
    options: [
      { id: 'A', text: '₹900' },
      { id: 'B', text: '₹960' },
      { id: 'C', text: '₹1,000' },
      { id: 'D', text: '₹1,200' },
    ],
    correctOptionId: 'C',
    explanation: '₹800 is 80% of the original price. 800 / 0.8 = ₹1,000.',
  },

  // 📖 VERBAL REASONING
  {
    id: 'VER01',
    category: 'verbal',
    difficulty: 'easy',
    question: '📖 Choose the synonym of "Brave".',
    options: [
      { id: 'A', text: 'Cowardly' },
      { id: 'B', text: 'Courageous' },
      { id: 'C', text: 'Weak' },
      { id: 'D', text: 'Careless' },
    ],
    correctOptionId: 'B',
    explanation: 'Courageous means brave or willing to face danger.',
  },
  {
    id: 'VER02',
    category: 'verbal',
    difficulty: 'easy',
    question: '✍️ Choose the antonym of "Ancient".',
    options: [
      { id: 'A', text: 'Old' },
      { id: 'B', text: 'Historic' },
      { id: 'C', text: 'Modern' },
      { id: 'D', text: 'Traditional' },
    ],
    correctOptionId: 'C',
    explanation: 'Modern is the opposite of ancient.',
  },
  {
    id: 'VER03',
    category: 'verbal',
    difficulty: 'medium',
    question: '📝 Complete the sentence: She _____ to school every day.',
    options: [
      { id: 'A', text: 'go' },
      { id: 'B', text: 'going' },
      { id: 'C', text: 'goes' },
      { id: 'D', text: 'gone' },
    ],
    correctOptionId: 'C',
    explanation: 'With "she" in the simple present tense, use "goes".',
  },
  {
    id: 'VER04',
    category: 'verbal',
    difficulty: 'medium',
    question: '📚 Choose the correctly spelled word.',
    options: [
      { id: 'A', text: 'Recieve' },
      { id: 'B', text: 'Receive' },
      { id: 'C', text: 'Receeve' },
      { id: 'D', text: 'Receve' },
    ],
    correctOptionId: 'B',
    explanation: 'The correct spelling is Receive.',
  },
  {
    id: 'VER05',
    category: 'verbal',
    difficulty: 'hard',
    question: '🧠 Book is to Reading as Fork is to:',
    options: [
      { id: 'A', text: 'Writing' },
      { id: 'B', text: 'Drawing' },
      { id: 'C', text: 'Eating' },
      { id: 'D', text: 'Sleeping' },
    ],
    correctOptionId: 'C',
    explanation: 'A book is used for reading; a fork is used for eating.',
  },

  // 🧠 LOGICAL REASONING
  {
    id: 'LOG01',
    category: 'logical',
    difficulty: 'easy',
    question: '🧩 Find the next letter: A, C, E, G, ?',
    options: [
      { id: 'A', text: 'H' },
      { id: 'B', text: 'I' },
      { id: 'C', text: 'J' },
      { id: 'D', text: 'K' },
    ],
    correctOptionId: 'B',
    explanation: 'The sequence skips one letter each time: A, C, E, G, I.',
  },
  {
    id: 'LOG02',
    category: 'logical',
    difficulty: 'easy',
    question: '🐶 Which one does not belong?',
    options: [
      { id: 'A', text: 'Dog' },
      { id: 'B', text: 'Cat' },
      { id: 'C', text: 'Lion' },
      { id: 'D', text: 'Rose' },
    ],
    correctOptionId: 'D',
    explanation: 'Rose is a flower; the others are animals.',
  },
  {
    id: 'LOG03',
    category: 'logical',
    difficulty: 'medium',
    question: '🧠 All roses are flowers. Some flowers fade quickly. Which statement must be true?',
    options: [
      { id: 'A', text: 'All flowers are roses' },
      { id: 'B', text: 'All roses are flowers' },
      { id: 'C', text: 'All roses fade quickly' },
      { id: 'D', text: 'No roses fade quickly' },
    ],
    correctOptionId: 'B',
    explanation: 'This is directly given in the first statement.',
  },
  {
    id: 'LOG04',
    category: 'logical',
    difficulty: 'medium',
    question: '🔍 If yesterday was Monday, what day is tomorrow?',
    options: [
      { id: 'A', text: 'Tuesday' },
      { id: 'B', text: 'Wednesday' },
      { id: 'C', text: 'Thursday' },
      { id: 'D', text: 'Friday' },
    ],
    correctOptionId: 'B',
    explanation: 'Yesterday was Monday, today is Tuesday, and tomorrow is Wednesday.',
  },
  {
    id: 'LOG05',
    category: 'logical',
    difficulty: 'hard',
    question: '⚙️ If 3 machines make 3 items in 3 minutes, how long will 6 machines take to make 6 items?',
    options: [
      { id: 'A', text: '3 minutes' },
      { id: 'B', text: '6 minutes' },
      { id: 'C', text: '9 minutes' },
      { id: 'D', text: '12 minutes' },
    ],
    correctOptionId: 'A',
    explanation: 'Each machine makes one item in 3 minutes. Six machines make six items simultaneously in 3 minutes.',
  },
];

/**
 * Return questions without correct answers.
 * Safe to use when displaying questions to students.
 */
export function getAptitudeQuestions(category = null) {
  const questions = category
    ? QUESTION_BANK.filter(q => q.category === category)
    : QUESTION_BANK;

  return questions.map(({ correctOptionId, explanation, ...question }) => ({
    ...question,
    options: question.options.map(option => ({ ...option })),
  }));
}

/**
 * Calculate category-wise and overall aptitude scores.
 *
 * responses format:
 * {
 *   NUM01: 'C',
 *   VER01: 'B',
 *   LOG01: 'A'
 * }
 */
export function evaluateAptitudeAssessment(responses = {}) {
  if (
    !responses ||
    typeof responses !== 'object' ||
    Array.isArray(responses)
  ) {
    throw new Error('Responses must be an object.');
  }

  const validIds = new Set(QUESTION_BANK.map(q => q.id));

  for (const id of Object.keys(responses)) {
    if (!validIds.has(id)) {
      throw new Error(`Invalid question ID: ${id}`);
    }
  }

  const categories = {};

  for (const category of Object.values(APTITUDE_CATEGORIES)) {
    const questions = QUESTION_BANK.filter(
      q => q.category === category
    );

    let correct = 0;
    let attempted = 0;

    for (const question of questions) {
      const answer = responses[question.id];

      if (answer === undefined || answer === null || answer === '') {
        continue;
      }

      if (!question.options.some(option => option.id === answer)) {
        throw new Error(`Invalid option for ${question.id}`);
      }

      attempted++;

      if (answer === question.correctOptionId) {
        correct++;
      }
    }

    categories[category] = {
      totalQuestions: questions.length,
      attempted,
      correct,
      incorrect: attempted - correct,
      percentage: Math.round((correct / questions.length) * 100),
      accuracy: attempted
        ? Math.round((correct / attempted) * 100)
        : 0,
    };
  }

  const totalQuestions = QUESTION_BANK.length;
  const attempted = Object.values(categories).reduce(
    (sum, result) => sum + result.attempted,
    0
  );
  const correct = Object.values(categories).reduce(
    (sum, result) => sum + result.correct,
    0
  );

  const percentage = Math.round((correct / totalQuestions) * 100);

  const feedback = QUESTION_BANK
    .filter(q => responses[q.id] !== undefined && responses[q.id] !== null && responses[q.id] !== '')
    .map(q => ({
      questionId: q.id,
      category: q.category,
      selectedOptionId: responses[q.id],
      correctOptionId: q.correctOptionId,
      isCorrect: responses[q.id] === q.correctOptionId,
      explanation: q.explanation,
    }));

  return {
    totalQuestions,
    attempted,
    unanswered: totalQuestions - attempted,
    correct,
    incorrect: attempted - correct,
    percentage,
    completionPercentage: Math.round(
      (attempted / totalQuestions) * 100
    ),
    isComplete: attempted === totalQuestions,
    categories,
    feedback,
  };
}
