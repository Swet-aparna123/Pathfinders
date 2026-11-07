
'use client';

import { useState } from 'react';
export default function AdaptiveFollowupQuestionnaire({
  questions = [],
  initialAnswers = {},
  onSave,
  isDark = false,
}) {
  const [answers, setAnswers] = useState(initialAnswers);
  const [currentId, setCurrentId] = useState(
    questions.find((q) => !initialAnswers[q.id])?.id || questions[0]?.id || null
  );

  // Choose the next unanswered question.
  // The previous answer influences which remaining question is selected.
  // Select the next unanswered question.
const currentQuestion =
  questions.find((q) => q.id === currentId && !answers[q.id]) ||
  questions.find((q) => !answers[q.id]) ||
  null;



  const completedCount = questions.filter((q) => answers[q.id]).length;
  const isComplete = questions.length > 0 && completedCount === questions.length;

  const saveAnswer = (option) => {
  if (!currentQuestion) return;

  const updated = {
    ...answers,
    [currentQuestion.id]: option,
  };

  setAnswers(updated);
  onSave?.(updated);

  // Find questions that are still unanswered.
  const remaining = questions.filter(
    (q) => !updated[q.id]
  );

  // Use the selected answer to determine the next question.
  const selectedIndex = currentQuestion.options.indexOf(option);

  const nextIndex = remaining.length
    ? selectedIndex % remaining.length
    : -1;

  setCurrentId(remaining[nextIndex]?.id || null);
};

  if (!questions.length) return null;

  return (
    <section className={`rounded-2xl border p-5 sm:p-6 space-y-5 ${
      isDark
        ? 'bg-[#0E1A33] border-slate-700 text-parchment'
        : 'bg-white border-[#E5DAC4] text-[#1C2536] shadow-sm'
    }`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-brass">
            Person B · Adaptive Assessment
          </p>
          <h3 className="text-lg font-semibold mt-1">
            A Few More Questions
          </h3>
        </div>
        <span className="text-xs font-mono opacity-70">
          {completedCount}/{questions.length} completed
        </span>
      </div>

      <div className={`h-2 rounded-full overflow-hidden ${
        isDark ? 'bg-slate-800' : 'bg-[#EEE7DA]'
      }`}>
        <div
          className="h-full bg-brass-bright transition-all"
          style={{ width: `${(completedCount / questions.length) * 100}%` }}
        />
      </div>

      {isComplete ? (
        <div className="rounded-xl p-4 bg-emerald-500/10 border border-emerald-500/30">
          <p className="font-semibold text-emerald-600">
            ✓ Adaptive questions completed!
          </p>
          <p className="text-sm mt-1 opacity-80">
            Your responses have been saved to your student profile.
          </p>
        </div>
      ) : currentQuestion ? (
        <div className="space-y-4">
          <p className="text-xs font-mono opacity-60">
            QUESTION {completedCount + 1}
          </p>

          <h4 className="text-base font-semibold leading-relaxed">
            {currentQuestion.question}
          </h4>

          <div className="space-y-2">
            {(currentQuestion.options || []).map((option, index) => (
              <button
                key={`${currentQuestion.id}-${index}`}
                type="button"
                onClick={() => saveAnswer(option)}
                className={`w-full text-left rounded-xl border p-3 text-sm transition-all ${
                  isDark
                    ? 'border-slate-700 bg-slate-900/50 hover:border-brass-bright hover:bg-slate-800'
                    : 'border-[#E5DAC4] bg-[#FFFEFC] hover:border-brass hover:bg-[#FBF6EA]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <p className="text-xs opacity-60">
            Choose the answer that best describes your approach. There are no right or wrong answers.
          </p>
        </div>
      ) : null}
    </section>
  );
}
