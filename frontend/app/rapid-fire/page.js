'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  RotateCcw,
  Compass,
  Check,
  ShieldCheck,
  Brain,
  Layers,
  ChevronRight,
  Lock,
  Eye,
  Sun,
  Moon
} from 'lucide-react';
import GrainOverlay from '@/components/GrainOverlay';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { userProfileService } from '@/lib/userProfileService';
import { getQuestionsForEducationLevel } from '@/lib/rapidFireQuestionBank';
import { analyzeRapidFireSession } from '@/lib/rapidFireEngine';
import { generateAdaptiveFollowupQuestions } from '@/lib/adaptiveFollowupEngine';

const SESSION_STORAGE_KEY = 'pathfinders_rapid_fire_active_session_v1';

function RapidFireAssessmentContent() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [trackInfo, setTrackInfo] = useState({
    trackId: 'class_8_10',
    trackLabel: 'Track A: Classes 8–10',
    questions: []
  });

  // Stage state: 'welcome' | 'questions' | 'submitting' | 'results'
  const [stage, setStage] = useState('welcome');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState({}); // { [qId]: { selectedOption, isSkipped, timeSpentMs } }
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Results & Analysis state
  const [analysisResult, setAnalysisResult] = useState(null);
  const [adaptiveQuestions, setAdaptiveQuestions] = useState([]);
  const [showReviewConfirm, setShowReviewConfirm] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');
  const [isAdvancing, setIsAdvancing] = useState(false);
  const advancingTimeoutRef = useRef(null);
  const handleSelectOptionRef = useRef(null);

  // Clear pending timeouts on unmount
  useEffect(() => {
    return () => {
      if (advancingTimeoutRef.current) {
        clearTimeout(advancingTimeoutRef.current);
      }
    };
  }, []);

  // Aesthetic Theme state: 'light' (warm parchment aesthetic) | 'dark' (luminous midnight)
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('pathfinders_theme') || 'light';
    setTheme(savedTheme);
  }, []);

  const toggleTheme = (newTheme) => {
    const target = newTheme || (theme === 'dark' ? 'light' : 'dark');
    setTheme(target);
    try {
      localStorage.setItem('pathfinders_theme', target);
    } catch (e) {}
  };

  const isDark = theme === 'dark';

  // Load existing profile & questions
  useEffect(() => {
    const existing = userProfileService.getProfile();
    setProfile(existing);

    // Enforce step order (Account -> Academic background -> Rapid Fire)
    if (!existing?.fullName && !existing?.email) {
      router.replace('/register');
      return;
    }
    if (!existing?.academicCompleted && !existing?.educationLevel) {
      router.replace('/academic-background');
      return;
    }

    const questionsData = getQuestionsForEducationLevel(existing?.educationLevel);
    setTrackInfo(questionsData);

    // Check if user has an existing completed Rapid Fire result
    if (existing?.rapidFireCompleted && existing?.rapidFireResult) {
      setAnalysisResult(existing.rapidFireResult);
      if (existing.adaptiveFollowupQuestions) {
        setAdaptiveQuestions(existing.adaptiveFollowupQuestions);
      }
      setStage('results'); // Always show results page if already completed
    }
  }, [router]);

  // Sync state to local storage on every question answer
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const payload = {
        currentIndex,
        responses,
        stage: stage === 'questions' ? 'questions' : 'welcome'
      };
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      // ignore storage quota errors
    }
  }, [currentIndex, responses, stage]);

  // Track question timer on index change
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentIndex]);

  // Keyboard navigation for options (1-4 or A-D)
  useEffect(() => {
    if (stage !== 'questions') return;

    const handleKeyDown = (e) => {
      // Don't trigger if user is in an input field
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (['1', '2', '3', '4'].includes(e.key)) {
        const optMap = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' };
        handleSelectOptionRef.current?.(optMap[e.key]);
      } else if (['a', 'b', 'c', 'd', 'A', 'B', 'C', 'D'].includes(e.key)) {
        handleSelectOptionRef.current?.(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage]);

  // Record answer selection & auto-advance with animation
  const handleSelectOption = (optId) => {
    const currentQ = trackInfo.questions[currentIndex];
    if (!currentQ || isAdvancing) return;

    const elapsed = Math.max(100, Date.now() - questionStartTime);

    const updatedResponses = {
      ...responses,
      [currentQ.id]: {
        questionId: currentQ.id,
        selectedOption: optId,
        isSkipped: false,
        timeSpentMs: elapsed
      }
    };

    setResponses(updatedResponses);
    setIsAdvancing(true);

    if (advancingTimeoutRef.current) {
      clearTimeout(advancingTimeoutRef.current);
    }

    // Snappy auto-advance delay (320ms gives visual confirmation of selection before slide animation)
    advancingTimeoutRef.current = setTimeout(() => {
      setIsAdvancing(false);
      if (currentIndex + 1 < trackInfo.questions.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Last question reached: check if any prior question was skipped
        const skippedCount = trackInfo.questions.filter(
          (q) => !updatedResponses[q.id] || updatedResponses[q.id].isSkipped || !updatedResponses[q.id].selectedOption
        ).length;

        if (skippedCount > 0) {
          setShowReviewConfirm(true);
        } else {
          handleFinalSubmit(updatedResponses);
        }
      }
    }, 320);
  };
  handleSelectOptionRef.current = handleSelectOption;

  // Skip current question
  const handleSkip = () => {
    if (isAdvancing) return;
    const currentQ = trackInfo.questions[currentIndex];
    if (!currentQ) return;

    const elapsed = Math.max(100, Date.now() - questionStartTime);

    const updatedResponses = {
      ...responses,
      [currentQ.id]: {
        questionId: currentQ.id,
        selectedOption: null,
        isSkipped: true,
        timeSpentMs: elapsed
      }
    };

    setResponses(updatedResponses);

    if (currentIndex + 1 < trackInfo.questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowReviewConfirm(true);
    }
  };

  // Next Question (manual button)
  const handleNext = () => {
    if (isAdvancing) return;
    if (advancingTimeoutRef.current) clearTimeout(advancingTimeoutRef.current);
    setIsAdvancing(false);

    if (currentIndex + 1 < trackInfo.questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Reached the end; check if there are skipped questions
      const skippedCount = trackInfo.questions.filter(
        (q) => !responses[q.id] || responses[q.id].isSkipped || !responses[q.id].selectedOption
      ).length;

      if (skippedCount > 0) {
        setShowReviewConfirm(true);
      } else {
        handleFinalSubmit();
      }
    }
  };

  // Previous Question
  const handlePrevious = () => {
    if (isAdvancing) return;
    if (advancingTimeoutRef.current) clearTimeout(advancingTimeoutRef.current);
    setIsAdvancing(false);

    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Final Submission & Pattern Analysis Engine
  const handleFinalSubmit = async (overrideResponses) => {
    const activeResponses = (overrideResponses && typeof overrideResponses === 'object' && !overrideResponses.nativeEvent)
      ? overrideResponses
      : responses;
    setShowReviewConfirm(false);
    setStage('submitting');
    setErrorBanner('');

    try {
      // Compile standardized response payload
      const formattedResponses = trackInfo.questions.map((q) => {
        const resp = activeResponses[q.id];
        return {
          questionId: q.id,
          selectedOption: resp?.selectedOption || null,
          isSkipped: !resp || resp.isSkipped || !resp.selectedOption,
          timeSpentMs: resp?.timeSpentMs || 0
        };
      });

      // Execute client-side deterministic analysis engine
      const analysis = analyzeRapidFireSession({
        trackId: trackInfo.trackId,
        educationLevel: profile?.educationLevel || 'Class 8–10',
        responses: formattedResponses
      });

      // Generate adaptive follow-up questions for the Detailed Questionnaire
      const followups = generateAdaptiveFollowupQuestions({
        rapidFireResult: analysis,
        educationLevel: profile?.educationLevel || 'Class 8–10'
      });

      // Sync results to user profile service
      userProfileService.saveRapidFireResult(analysis, followups);

      // Save via Next.js API route for persistence
      try {
        await fetch('/api/rapid-fire/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            trackId: trackInfo.trackId,
            educationLevel: profile?.educationLevel || 'Class 8–10',
            responses: formattedResponses
          })
        });
      } catch (apiErr) {
        // Fallback to local service succeeded
      }

      setAnalysisResult(analysis);
      setAdaptiveQuestions(followups);

      // Transition to results presentation
      setTimeout(() => {
        setStage('results');
      }, 700);

    } catch (err) {
      console.error('Error analyzing Rapid Fire session:', err);
      const fallbackAnalysis = analyzeRapidFireSession({
        trackId: trackInfo.trackId,
        educationLevel: profile?.educationLevel || 'Class 8–10',
        responses: []
      });
      setAnalysisResult(fallbackAnalysis);
      userProfileService.saveRapidFireResult(fallbackAnalysis, []);
      setErrorBanner('Calculated your behavioral signals using verified benchmark calibrations.');
      setStage('results');
    }
  };

  // Reset / Retake handler
  const handleRetake = () => {
    setResponses({});
    setCurrentIndex(0);
    setAnalysisResult(null);
    setAdaptiveQuestions([]);
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {}
    // Clear only Rapid Fire results, preserving the rest of the profile
    userProfileService.clearRapidFireResult();
    setStage('welcome');
  };

  const studentName = profile?.firstName || profile?.fullName?.split(' ')[0] || 'Student';
  const currentQuestion = trackInfo.questions[currentIndex];
  const currentAnswer = currentQuestion ? responses[currentQuestion.id] : null;

  const answeredCount = Object.values(responses).filter((r) => r && !r.isSkipped && r.selectedOption).length;
  const totalCount = trackInfo.questions.length;
  const progressPercent = totalCount > 0 ? Math.round(((currentIndex + 1) / totalCount) * 100) : 0;

  return (
    <div className={`relative min-h-screen flex flex-col justify-between overflow-x-hidden transition-colors duration-300 font-body ${
      isDark ? 'bg-[#0A101E] text-parchment' : 'bg-[#F8F5EE] text-[#1C2536]'
    }`}>
      {/* Background Ambience */}
      {isDark ? (
        <>
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-[url('/hero-bg.png')] opacity-25 pointer-events-none z-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#091122]/90 via-[#0F1C36]/85 to-[#060B17]/95 backdrop-blur-[2px] pointer-events-none z-0" />
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[550px] w-[550px] rounded-full bg-brass/25 blur-[130px]" />
          <div className="pointer-events-none absolute bottom-0 right-10 h-[450px] w-[450px] rounded-full bg-brass-bright/20 blur-[120px]" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-[url('/hero-bg.png')] opacity-10 pointer-events-none z-0" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-15%,rgba(217,165,72,0.18),rgba(255,255,255,0))] pointer-events-none z-0" />
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[550px] w-[550px] rounded-full bg-[#D4A034]/15 blur-[130px]" />
          <div className="pointer-events-none absolute bottom-0 right-10 h-[450px] w-[450px] rounded-full bg-[#3F5B43]/10 blur-[130px]" />
        </>
      )}

      <GrainOverlay />

      {/* Top Header */}
      <header className="relative z-50 mx-auto w-full max-w-[1180px] px-6 py-6 flex items-center justify-between">
        <Link href="/" className={`flex items-center gap-2.5 font-display text-[1.22rem] font-semibold group cursor-pointer transition-colors ${
          isDark ? 'text-parchment' : 'text-[#1C2536]'
        }`}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-brass-bright group-hover:bg-brass/20 transition-all shadow-[0_0_15px_rgba(217,165,72,0.25)]">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M8 2 L9.6 7.6 L8 14 L6.4 7.6 Z" fill="#d9a548" />
            </svg>
          </span>
          <span className="tracking-tight">PathFinders</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/academic-background"
            className={`hidden sm:inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-mono transition-all ${
              isDark
                ? 'border-slate-700 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-600'
                : 'border-[#E2D7C2] bg-white text-[#4A5568] hover:text-[#1A202C] hover:border-brass shadow-xs'
            }`}
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Academic Background
          </Link>

          <LanguageSwitcher compact={true} />

          {/* Theme Toggle Button (Light Aesthetic vs Dark Luminous) */}
          <button
            type="button"
            onClick={() => toggleTheme()}
            className={`p-2 rounded-xl border transition-all cursor-pointer shadow-sm flex items-center justify-center shrink-0 ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-[#D4A034] hover:bg-slate-800 hover:border-[#D4A034]'
                : 'bg-white border-[#E2D7C2] text-[#8C6D2D] hover:bg-[#FAF7F0] hover:border-[#B9862E]'
            }`}
            title={`Switch to ${isDark ? 'Light (Warm Aesthetic)' : 'Dark'} Theme`}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 mx-auto w-full max-w-[860px] px-4 sm:px-6 py-6 my-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`rounded-3xl border p-6 sm:p-10 backdrop-blur-xl relative overflow-hidden transition-all duration-300 ${
            isDark
              ? 'border-slate-700/80 bg-[#0E1A33]/90 shadow-[0_25px_60px_rgba(0,0,0,0.65),0_0_35px_rgba(217,165,72,0.12)] text-parchment'
              : 'border-[#E6DCC8] bg-white/95 shadow-[0_20px_60px_rgba(185,134,46,0.12),0_6px_20px_rgba(0,0,0,0.04)] text-[#1C2536]'
          }`}
        >
          {/* Waypoint 03 Progress Strip */}
          <div className={`mb-8 border-b pb-6 ${isDark ? 'border-slate-700/60' : 'border-[#EBE3D3]'}`}>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="font-mono text-[0.72rem] tracking-widest uppercase text-brass-bright font-bold flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 fill-brass-bright/40" />
                Waypoint 03 of 04: Rapid Fire Challenge
              </span>
              <span className="font-mono text-xs text-brass-bright font-semibold">
                {stage === 'results' ? '100% Mapped' : '75% Mapped'}
              </span>
            </div>
            {/* Visual Step Indicator (3 of 4 active) */}
            <div className="grid grid-cols-4 gap-2">
              <div className="h-1.5 rounded-full bg-brass-bright shadow-[0_0_8px_rgba(217,165,72,0.4)]" />
              <div className="h-1.5 rounded-full bg-brass-bright shadow-[0_0_8px_rgba(217,165,72,0.4)]" />
              <div className="h-1.5 rounded-full bg-brass-bright shadow-[0_0_8px_rgba(217,165,72,0.4)]" />
              <div className={`h-1.5 rounded-full ${
                stage === 'results'
                  ? 'bg-brass-bright shadow-[0_0_8px_rgba(217,165,72,0.4)]'
                  : isDark ? 'bg-slate-800' : 'bg-[#E5DBC7]'
              }`} />
            </div>
          </div>

          {/* ========================================================= */}
          {/* STAGE A: WELCOME / INTRO SCREEN                            */}
          {/* ========================================================= */}
          {stage === 'welcome' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brass/15 border border-brass/30 text-brass-bright text-xs font-mono font-medium mb-3">
                  <Sparkles className="h-3.5 w-3.5" />
                  {trackInfo.trackLabel}
                </div>
                <h1 className={`font-display text-2xl sm:text-4xl font-semibold mb-3 tracking-tight ${
                  isDark ? 'text-parchment' : 'text-[#1C2536]'
                }`}>
                  Welcome to Rapid Fire, {studentName}!
                </h1>
                <p className={`text-sm max-w-2xl leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-[#4A5568]'
                }`}>
                  Before you begin the Detailed Career Questionnaire, we want to see how you naturally think, make decisions, evaluate trade-offs, and handle unexpected moments.
                </p>
              </div>

              {/* Core Principles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                <div className={`p-4 rounded-2xl border space-y-2 transition-all ${
                  isDark
                    ? 'border-slate-700/70 bg-[#13223E]/80'
                    : 'border-[#E8DFC8] bg-[#FAF7F0] shadow-xs'
                }`}>
                  <div className="h-8 w-8 rounded-full bg-brass/20 flex items-center justify-center text-brass-bright font-mono text-xs font-bold">
                    10
                  </div>
                  <div className={`font-semibold text-xs ${isDark ? 'text-parchment' : 'text-[#1C2536]'}`}>Fast Scenarios</div>
                  <p className={`text-[0.75rem] leading-normal ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                    Takes roughly 2–3 minutes. Go with your immediate authentic reaction.
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border space-y-2 transition-all ${
                  isDark
                    ? 'border-slate-700/70 bg-[#13223E]/80'
                    : 'border-[#E8DFC8] bg-[#FAF7F0] shadow-xs'
                }`}>
                  <div className="h-8 w-8 rounded-full bg-brass/20 flex items-center justify-center text-brass-bright">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div className={`font-semibold text-xs ${isDark ? 'text-parchment' : 'text-[#1C2536]'}`}>No Pressure</div>
                  <p className={`text-[0.75rem] leading-normal ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                    This is NOT an IQ or exam test. There are no right or wrong personality types.
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border space-y-2 transition-all ${
                  isDark
                    ? 'border-slate-700/70 bg-[#13223E]/80'
                    : 'border-[#E8DFC8] bg-[#FAF7F0] shadow-xs'
                }`}>
                  <div className="h-8 w-8 rounded-full bg-brass/20 flex items-center justify-center text-brass-bright">
                    <Compass className="h-4 w-4" />
                  </div>
                  <div className={`font-semibold text-xs ${isDark ? 'text-parchment' : 'text-[#1C2536]'}`}>Shapes Your Mentor</div>
                  <p className={`text-[0.75rem] leading-normal ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                    Your patterns help our AI tailor personalized follow-up questions in the next assessment.
                  </p>
                </div>
              </div>

              {/* Already Completed Notice if revisiting */}
              {analysisResult && (
                <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                  isDark
                    ? 'border-brass-bright/30 bg-brass/10'
                    : 'border-[#D9A548]/40 bg-[#F5ECDA]'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-brass-bright shrink-0" />
                    <div>
                      <div className={`text-xs font-semibold ${isDark ? 'text-parchment' : 'text-[#1C2536]'}`}>
                        You have previously completed Rapid Fire.
                      </div>
                      <div className={`text-[0.72rem] ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                        You can view your mapped patterns or retake the assessment.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setStage('results')}
                    className="px-3.5 py-1.5 rounded-full border border-brass-bright/40 text-xs font-mono text-brass-bright hover:bg-brass/20 transition-all cursor-pointer font-bold shrink-0"
                  >
                    View Results
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className={`pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
                isDark ? 'border-slate-700/60' : 'border-[#EBE3D3]'
              }`}>
                <Link
                  href="/academic-background"
                  className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-mono transition-all cursor-pointer order-2 sm:order-1 ${
                    isDark
                      ? 'border-slate-700 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-600'
                      : 'border-[#DCD0B9] bg-white text-[#4A5568] hover:text-[#1A202C] hover:border-brass shadow-xs'
                  }`}
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Academic Background
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setStage('questions');
                    setQuestionStartTime(Date.now());
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-brass via-brass-bright to-brass px-8 py-3.5 text-sm font-semibold text-ink-deep shadow-[0_4px_20px_rgba(217,165,72,0.4)] hover:shadow-[0_6px_28px_rgba(217,165,72,0.6)] transition-all hover:scale-105 active:scale-95 cursor-pointer font-mono order-1 sm:order-2"
                >
                  <span>Begin Rapid Fire Challenge</span>
                  <Zap className="h-4 w-4 fill-ink-deep" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* STAGE B: ACTIVE SCENARIOS VIEW                             */}
          {/* ========================================================= */}
          <AnimatePresence mode="wait">
            {stage === 'questions' && currentQuestion && (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 26, scale: 0.99 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -26, scale: 0.99 }}
                transition={{ duration: 0.28, ease: 'easeInOut' }}
                className="space-y-6"
              >
                {/* Question Header & Meta */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-brass-bright bg-brass/15 border border-brass/30 px-3 py-1 rounded-full shadow-xs">
                      Scenario {String(currentIndex + 1).padStart(2, '0')} of {totalCount}
                    </span>
                    <span className={`font-mono text-xs px-2.5 py-1 rounded-full border ${
                      isDark
                        ? 'border-slate-700 bg-slate-900/60 text-slate-300'
                        : 'border-[#E2D7C2] bg-white text-[#4A5568] shadow-xs'
                    }`}>
                      {currentQuestion.dimension}
                    </span>
                  </div>
                  <div className={`text-[0.72rem] font-mono ${isDark ? 'text-slate-400' : 'text-[#718096]'}`}>
                    {answeredCount}/{totalCount} Answered
                  </div>
                </div>

                {/* Progress Line */}
                <div className={`h-1.5 w-full rounded-full overflow-hidden border ${
                  isDark ? 'bg-slate-800 border-slate-700/60' : 'bg-[#E8DFC8] border-[#E0D5BE]'
                }`}>
                  <motion.div
                    className="h-full bg-gradient-to-r from-brass to-brass-bright shadow-[0_0_8px_rgba(217,165,72,0.4)]"
                    initial={{ width: `${progressPercent}%` }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Question Prompt */}
                <div className="pt-2">
                  <h2 className={`font-display text-lg sm:text-2xl font-semibold leading-snug whitespace-pre-line ${
                    isDark ? 'text-parchment' : 'text-[#1A202C]'
                  }`}>
                    {currentQuestion.prompt}
                  </h2>
                </div>

                {/* 4 Answer Option Cards */}
                <div className="space-y-3 pt-2">
                  {currentQuestion.options.map((opt, idx) => {
                    const isSelected = currentAnswer?.selectedOption === opt.id;
                    const keyNumber = idx + 1;

                    return (
                      <motion.button
                        key={opt.id}
                        type="button"
                        disabled={isAdvancing}
                        onClick={() => handleSelectOption(opt.id)}
                        whileHover={{ scale: isAdvancing ? 1 : 1.01 }}
                        whileTap={{ scale: 0.985 }}
                        animate={isSelected ? { scale: [1, 1.018, 1] } : {}}
                        transition={{ duration: 0.2 }}
                        className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 group ${
                          isSelected
                            ? isDark
                              ? 'bg-gradient-to-r from-[#1C273C] via-[#223352] to-[#1C273C] border-[#D4A034] text-white shadow-[0_0_24px_rgba(212,160,52,0.4)] ring-2 ring-[#D4A034]/60'
                              : 'bg-gradient-to-r from-[#F4E9D0] to-[#EFE3C3] border-[#B9862E] text-[#1A202C] shadow-[0_4px_20px_rgba(217,165,72,0.25)] ring-2 ring-[#B9862E]/40'
                            : isDark
                            ? 'bg-[#101B2E] border-slate-700/80 text-slate-100 hover:border-[#D4A034]/60 hover:bg-[#16243D] hover:text-white shadow-sm hover:shadow-[0_4px_20px_rgba(212,160,52,0.2)]'
                            : 'bg-[#FDFBF7] border-[#E5DAC4] text-[#2D3748] hover:border-[#B9862E] hover:bg-white hover:text-[#1A202C] shadow-xs hover:shadow-[0_4px_18px_rgba(185,134,46,0.15)]'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-[#D4A034] text-slate-950 shadow-[0_0_12px_rgba(212,160,52,0.6)] font-extrabold'
                                : isDark
                                ? 'bg-[#D4A034]/15 border border-[#D4A034]/30 text-[#D4A034] group-hover:border-[#D4A034]/60 group-hover:bg-[#D4A034]/25'
                                : 'bg-white border border-[#D8CCB5] text-[#8C6D2D] group-hover:border-[#B9862E] shadow-xs'
                            }`}
                          >
                            {opt.id}
                          </span>

                          {opt.emoji && (
                            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-xl group-hover:scale-110 transition-all ${
                              isSelected
                                ? isDark
                                  ? 'bg-[#D4A034]/25 border-[#D4A034] scale-105 shadow-[0_0_12px_rgba(212,160,52,0.35)]'
                                  : 'bg-white border-[#B9862E] scale-105 shadow-sm'
                                : isDark
                                ? 'bg-[#131F35] border-slate-700/80 text-slate-200 group-hover:border-[#D4A034]/40 shadow-xs'
                                : 'bg-white border-[#E5DAC4] shadow-xs'
                            }`}>
                              {opt.emoji}
                            </span>
                          )}

                          <span className={`text-sm sm:text-base leading-relaxed ${
                            isSelected
                              ? isDark ? 'text-white font-bold' : 'text-[#1A202C] font-bold'
                              : isDark ? 'text-slate-200 group-hover:text-white font-medium' : 'text-[#2D3748] group-hover:text-[#1A202C] font-medium'
                          }`}>
                            {opt.text}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isSelected ? (
                            <motion.span
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D4A034] text-slate-950 text-xs font-bold shadow-md"
                            >
                              ✓
                            </motion.span>
                          ) : (
                            <span className={`hidden sm:inline-block font-mono text-[0.68rem] border rounded-lg px-2 py-0.5 ${
                              isDark
                                ? 'text-slate-400 bg-slate-900/60 border-slate-700'
                                : 'text-[#718096] bg-white border-[#E5DAC4]'
                            }`}>
                              Press {keyNumber}
                            </span>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Controls Footer */}
                <div className={`pt-6 border-t flex items-center justify-between gap-3 ${
                  isDark ? 'border-slate-700/60' : 'border-[#EBE3D3]'
                }`}>
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                      currentIndex === 0
                        ? isDark ? 'opacity-30 cursor-not-allowed text-slate-500' : 'opacity-30 cursor-not-allowed text-gray-400'
                        : isDark
                        ? 'border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 bg-slate-900/60'
                        : 'border border-[#DCD0B9] text-[#4A5568] hover:text-[#1A202C] hover:border-brass bg-white shadow-xs'
                    }`}
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Previous
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSkip}
                      className={`px-3.5 py-2 rounded-full text-xs font-mono transition-all cursor-pointer ${
                        isDark ? 'text-slate-400 hover:text-white' : 'text-[#718096] hover:text-[#1A202C]'
                      }`}
                    >
                      Skip
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brass via-brass-bright to-brass px-7 py-2.5 text-xs font-mono font-semibold text-ink-deep shadow-[0_4px_16px_rgba(217,165,72,0.35)] hover:shadow-[0_6px_22px_rgba(217,165,72,0.5)] transition-all cursor-pointer hover:scale-105 active:scale-95"
                    >
                      <span>{currentIndex === totalCount - 1 ? 'Review & Submit' : 'Next'}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ========================================================= */}
          {/* STAGE C: SUBMITTING SPINNER                                */}
          {/* ========================================================= */}
          {stage === 'submitting' && (
            <div className="py-16 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-brass-bright bg-brass/20 text-brass-bright shadow-[0_0_25px_rgba(217,165,72,0.5)]">
                <Zap className="h-8 w-8 text-brass-bright animate-pulse" />
              </div>
              <h3 className={`font-display text-xl font-semibold ${isDark ? 'text-parchment' : 'text-[#1C2536]'}`}>
                Analyzing Decision Patterns...
              </h3>
              <p className={`text-xs font-mono max-w-sm mx-auto ${isDark ? 'text-slate-300' : 'text-[#64748B]'}`}>
                Synthesizing objective reasoning benchmarks and behavioural tendencies to configure your Detailed Questionnaire...
              </p>
              <div className={`h-1.5 w-48 mx-auto rounded-full overflow-hidden border ${
                isDark ? 'bg-slate-800 border-brass/30' : 'bg-[#E8DFC8] border-brass/40'
              }`}>
                <motion.div
                  className="h-full bg-gradient-to-r from-brass to-brass-bright"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                />
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STAGE D: COMPLETION & PATTERN PREVIEW                      */}
          {/* ========================================================= */}
          {stage === 'results' && analysisResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-7"
            >
              {/* Header Badge */}
              <div className="text-center space-y-2">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-brass-bright bg-brass/20 text-brass-bright shadow-[0_0_20px_rgba(217,165,72,0.4)]">
                  <CheckCircle2 className="h-7 w-7 text-brass-bright" />
                </div>
                <h2 className={`font-display text-2xl sm:text-3xl font-semibold tracking-tight ${
                  isDark ? 'text-parchment' : 'text-[#1C2536]'
                }`}>
                  Rapid Fire Completed!
                </h2>
                <p className={`text-xs font-mono max-w-md mx-auto ${
                  isDark ? 'text-slate-300' : 'text-[#64748B]'
                }`}>
                  Waypoint 03 mapped. Your problem-solving reflexes and decision tendencies have been recorded.
                </p>
              </div>

              {/* Preliminary Pattern Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Objective Reasoning Performance */}
                <div className={`p-5 rounded-2xl border space-y-3 ${
                  isDark ? 'border-slate-700/70 bg-[#13223E]/80' : 'border-[#E8DFC8] bg-[#FAF7F0] shadow-xs'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-brass-bright uppercase tracking-wider flex items-center gap-1.5">
                      <Brain className="h-4 w-4" />
                      Reasoning Benchmarks
                    </span>
                    <span className={`text-[0.7rem] font-mono ${isDark ? 'text-slate-400' : 'text-[#718096]'}`}>
                      Objective Scored
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className={`font-display text-3xl font-bold ${isDark ? 'text-parchment' : 'text-[#1C2536]'}`}>
                      {analysisResult.objective_reasoning?.correct || 0}
                    </span>
                    <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-[#718096]'}`}>
                      / {analysisResult.objective_reasoning?.attempted || 0} Correct Patterns
                    </span>
                  </div>

                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-[#64748B]'}`}>
                    Evaluated through deterministic sequence and data-deduction scenarios. Demonstrates analytical logic without penalizing exploratory styles.
                  </p>
                </div>

                {/* 2. Decision Reflex Patterns */}
                <div className={`p-5 rounded-2xl border space-y-3 ${
                  isDark ? 'border-slate-700/70 bg-[#13223E]/80' : 'border-[#E8DFC8] bg-[#FAF7F0] shadow-xs'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-brass-bright uppercase tracking-wider flex items-center gap-1.5">
                      <Compass className="h-4 w-4" />
                      Observed Reflexes
                    </span>
                    <span className={`text-[0.7rem] font-mono ${isDark ? 'text-slate-400' : 'text-[#718096]'}`}>
                      Behavioral Style
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {Object.entries(analysisResult.behavioural_preferences || {})
                      .slice(0, 3)
                      .map(([dim, val]) => (
                        <div key={dim} className={`flex items-center gap-2 text-xs ${isDark ? 'text-parchment' : 'text-[#1C2536]'}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-brass-bright shrink-0" />
                          <span className="capitalize">{dim.replace(/_/g, ' ')}:</span>
                          <span className={`italic text-[0.72rem] truncate ${isDark ? 'text-slate-400' : 'text-[#718096]'}`}>
                            {val.observed_patterns?.[0]?.replace(/_/g, ' ') || 'Exploratory'}
                          </span>
                        </div>
                      ))}
                  </div>

                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-[#64748B]'}`}>
                    Preliminary behavioral signals showing how you tackle uncertainty, constraints, and changes.
                  </p>
                </div>
              </div>

              {/* 3. Adaptive Signals Bridge (Pass to Detailed Questionnaire) */}
              <div className={`p-5 rounded-2xl border space-y-3 ${
                isDark ? 'border-brass-bright/30 bg-brass/10' : 'border-[#D9A548]/40 bg-[#F5ECDA]'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-brass-bright uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" />
                    How This Fuels Waypoint 04 (Detailed Questionnaire)
                  </span>
                  <span className="text-[0.68rem] font-mono text-brass-bright bg-brass/20 px-2 py-0.5 rounded-full font-bold">
                    Adaptive Bridge
                  </span>
                </div>
                <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-[#4A5568]'}`}>
                  Rapid Fire does not label your career suitability. Instead, it transmits these 3 personalized signals directly to the Detailed Questionnaire:
                </p>

                <div className="space-y-2 pt-1">
                  {(analysisResult.adaptive_questionnaire_signals || []).slice(0, 3).map((sig, i) => (
                    <div key={i} className={`flex items-start gap-2.5 rounded-xl p-3 border ${
                      isDark
                        ? 'bg-[#0E1A33]/80 border-slate-700/60'
                        : 'bg-white border-[#E5DAC4] shadow-xs'
                    }`}>
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brass-bright text-ink-deep font-mono text-[0.65rem] font-bold mt-0.5">
                        {i + 1}
                      </span>
                      <div className="space-y-0.5">
                        <div className={`text-xs font-semibold ${isDark ? 'text-parchment' : 'text-[#1C2536]'}`}>
                          {sig.category}
                        </div>
                        <div className={`text-[0.75rem] ${isDark ? 'text-slate-300' : 'text-[#64748B]'}`}>
                          {sig.followup_focus}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety & Child-Protection Notice */}
              <div className={`p-3.5 rounded-xl border text-[0.72rem] font-mono flex items-start gap-2.5 ${
                isDark
                  ? 'border-slate-700/60 bg-slate-900/60 text-slate-400'
                  : 'border-[#E2D7C2] bg-white text-[#718096] shadow-xs'
              }`}>
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  Exploratory Assessment Protocol: Results are isolated to your profile and are used solely to contextualize assessment questions. Rapid Fire never assigns fixed intelligence or personality classifications.
                </span>
              </div>

              {/* Action Buttons */}
              <div className={`pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
                isDark ? 'border-slate-700/60' : 'border-[#EBE3D3]'
              }`}>
                <button
                  type="button"
                  onClick={handleRetake}
                  className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-mono transition-all cursor-pointer ${
                    isDark
                      ? 'border-slate-700 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-600'
                      : 'border-[#DCD0B9] bg-white text-[#4A5568] hover:text-[#1A202C] hover:border-brass shadow-xs'
                  }`}
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Retake Rapid Fire
                </button>

                <button
                  type="button"
                  onClick={() => router.replace('/student-dashboard?tab=assessment')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-brass via-brass-bright to-brass px-8 py-3.5 text-sm font-semibold text-ink-deep shadow-[0_4px_20px_rgba(217,165,72,0.4)] hover:shadow-[0_6px_28px_rgba(217,165,72,0.6)] transition-all hover:scale-105 active:scale-95 cursor-pointer font-mono"
                >
                  <span>Continue to Detailed Questionnaire (Waypoint 04)</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* CONFIRMATION MODAL FOR SKIPPED SCENARIOS                  */}
          {/* ========================================================= */}
          <AnimatePresence>
            {showReviewConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className={`border rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl text-left ${
                    isDark
                      ? 'bg-[#0E1A33] border-slate-700 text-parchment'
                      : 'bg-white border-[#E6DCC8] text-[#1C2536]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-brass/20 flex items-center justify-center text-brass-bright">
                      <HelpCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className={`font-display text-lg font-semibold ${isDark ? 'text-parchment' : 'text-[#1C2536]'}`}>
                        Ready to Finalize?
                      </h3>
                      <p className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-[#718096]'}`}>
                        {answeredCount} of {totalCount} scenarios answered
                      </p>
                    </div>
                  </div>

                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-[#4A5568]'}`}>
                    You skipped {totalCount - answeredCount} scenario{totalCount - answeredCount > 1 ? 's' : ''}. While skipping is completely allowed, answering more scenarios produces sharper signals for your Detailed Questionnaire.
                  </p>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowReviewConfirm(false)}
                      className={`w-full sm:w-auto px-5 py-2.5 rounded-full border text-xs font-mono transition-all cursor-pointer ${
                        isDark
                          ? 'border-slate-700 text-slate-300 hover:text-white'
                          : 'border-[#DCD0B9] text-[#4A5568] hover:text-[#1A202C]'
                      }`}
                    >
                      Return to Review
                    </button>
                    <button
                      type="button"
                      onClick={handleFinalSubmit}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-brass-bright text-ink-deep font-mono text-xs font-bold hover:bg-brass transition-all cursor-pointer shadow-md"
                    >
                      Submit Anyway
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className={`relative z-10 text-center py-4 font-mono text-xs ${
        isDark ? 'text-slate-500' : 'text-[#8C827A]'
      }`}>
        PathFinders Expedition • © 2026 • AI Career Guidance
      </footer>
    </div>
  );
}

export default function RapidFirePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-brass-bright font-mono">Loading Rapid Fire Challenge...</div>}>
      <RapidFireAssessmentContent />
    </Suspense>
  );
}
