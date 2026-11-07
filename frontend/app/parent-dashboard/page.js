'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartHandshake,
  GraduationCap,
  Users,
  ShieldCheck,
  BookOpen,
  Calendar,
  MessageSquare,
  TrendingUp,
  Award,
  Compass,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Briefcase,
  Sparkles,
  PhoneCall,
  Brain,
  ClipboardList,
  Target,
  BarChart3,
  Check,
  Star,
  User,
  Sliders,
  Menu,
  X,
  Lock,
  Unlock,
  AlertCircle,
  LayoutDashboard,
  LogOut,
  Clock,
  Copy
} from 'lucide-react';
import GrainOverlay from '@/components/GrainOverlay';
import Footer from '@/components/Footer';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { linkService } from '@/lib/linkService';
import { userProfileService } from '@/lib/userProfileService';
import LogoutButton from '@/components/LogoutButton';
import LinkChildModal from '@/components/LinkChildModal';

// 12 Parent Perspective Assessment Questions (4 Dimensions, 3 Questions Each)
const PARENT_QUESTIONS = [
  // Dimension: Security & Stability
  {
    id: 1,
    dimension: 'Security & Stability',
    q: 'A stable, secure job matters more to me than a highly rewarding but unpredictable one.',
  },
  {
    id: 2,
    dimension: 'Security & Stability',
    q: 'I worry about my child choosing a career path with uncertain income.',
  },
  {
    id: 3,
    dimension: 'Security & Stability',
    q: "I'd feel reassured if my child chose a government job or a well-established profession.",
  },

  // Dimension: Achievement & Status
  {
    id: 4,
    dimension: 'Achievement & Status',
    q: "I care about what relatives or neighbors think of my child's career choice.",
  },
  {
    id: 5,
    dimension: 'Achievement & Status',
    q: 'I want my child to attend a well-known, prestigious institution.',
  },
  {
    id: 6,
    dimension: 'Achievement & Status',
    q: 'Marks and rankings are a strong indicator of future success, in my view.',
  },

  // Dimension: Autonomy Support
  {
    id: 7,
    dimension: 'Autonomy Support',
    q: 'I believe my child should make the final decision about their career.',
  },
  {
    id: 8,
    dimension: 'Autonomy Support',
    q: "I've asked my child what they enjoy, not just what they're good at.",
  },
  {
    id: 9,
    dimension: 'Autonomy Support',
    q: "I would support my child even if I didn't fully agree with their choice.",
  },

  // Dimension: Communication
  {
    id: 10,
    dimension: 'Communication',
    q: 'My child and I talk openly about their doubts and fears about the future.',
  },
  {
    id: 11,
    dimension: 'Communication',
    q: 'In career conversations, I ask more questions than I give answers.',
  },
  {
    id: 12,
    dimension: 'Communication',
    q: "I check in on how my child is feeling, not just what they've decided.",
  },
];

const LIKERT_OPTIONS = [
  { label: 'Strongly Disagree', value: 1, color: 'border-rose-200 bg-rose-50/80 text-rose-900 hover:bg-rose-100 hover:border-rose-300' },
  { label: 'Disagree', value: 2, color: 'border-amber-200 bg-amber-50/80 text-amber-900 hover:bg-amber-100 hover:border-amber-300' },
  { label: 'Neutral', value: 3, color: 'border-stone-200 bg-stone-50/80 text-stone-800 hover:bg-stone-100 hover:border-stone-300' },
  { label: 'Agree', value: 4, color: 'border-blue-200 bg-blue-50/80 text-blue-900 hover:bg-blue-100 hover:border-blue-300' },
  { label: 'Strongly Agree', value: 5, color: 'border-emerald-200 bg-emerald-50/80 text-emerald-900 hover:bg-emerald-100 hover:border-emerald-300' },
];

export default function ParentDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'assessment' | 'counseling' | 'streams'
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // User Profile state synced with userProfileService
  const [userProfile, setUserProfile] = useState(() => userProfileService.getProfile());

  useEffect(() => {
    const profile = userProfileService.getProfile();
    if (profile) setUserProfile(profile);

    const handleProfileUpdated = (e) => {
      const updated = e.detail || userProfileService.getProfile();
      if (updated) setUserProfile(updated);
    };

    window.addEventListener('pathfinders_profile_updated', handleProfileUpdated);
    return () => window.removeEventListener('pathfinders_profile_updated', handleProfileUpdated);
  }, []);

  const fullName = userProfile.fullName || 'Parent Guardian';

  const getInitials = (nameStr) => {
    if (!nameStr) return 'PG';
    const parts = nameStr.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return nameStr.substring(0, 2).toUpperCase();
  };

  // Link Service state subscription
  const [linkState, setLinkState] = useState(linkService.getState());
  const [parentProvidedGrade, setParentProvidedGrade] = useState('Class 9–10 (Stream Selection Phase)');
  const [parentProvidedStream, setParentProvidedStream] = useState('PCM (Engineering & Tech Focus)');
  const [showLinkModal, setShowLinkModal] = useState(false);

  useEffect(() => {
    const unsubscribe = linkService.subscribe((state) => {
      setLinkState(state);
    });
    return () => unsubscribe();
  }, []);

  // Parent Assessment State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [parentAnswers, setParentAnswers] = useState([]);
  const [assessmentDone, setAssessmentDone] = useState(false);
  const [mindsetResult, setMindsetResult] = useState(null);
  const [previousMindsetResult, setPreviousMindsetResult] = useState(null);

  // Toast alert state
  const [toast, setToast] = useState(null);

  const showNotification = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // Handle Parent Assessment Pick (1 to 5 scale)
  const handleSelectAnswer = (scoreVal) => {
    const updated = [...parentAnswers, scoreVal];
    setParentAnswers(updated);

    if (currentQIndex + 1 < PARENT_QUESTIONS.length) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // Calculate scores for 4 dimensions (3 questions each)
      const securityScore = Number(((updated[0] + updated[1] + updated[2]) / 3).toFixed(1));
      const achievementScore = Number(((updated[3] + updated[4] + updated[5]) / 3).toFixed(1));
      const autonomyScore = Number(((updated[6] + updated[7] + updated[8]) / 3).toFixed(1));
      const commScore = Number(((updated[9] + updated[10] + updated[11]) / 3).toFixed(1));

      const scoresObj = {
        security: securityScore,
        achievement: achievementScore,
        autonomy: autonomyScore,
        communication: commScore,
      };

      setMindsetResult(scoresObj);
      setAssessmentDone(true);
      showNotification('🎉 Parent Perspective Assessment completed! Mindset report generated below.');
    }
  };

  const resetParentAssessment = () => {
    if (mindsetResult) {
      setPreviousMindsetResult(mindsetResult);
    }
    setCurrentQIndex(0);
    setParentAnswers([]);
    setAssessmentDone(false);
    setMindsetResult(null);
  };

  // Score band helper: 'low' (< 2.5), 'moderate' (2.5 - 3.5), 'high' (> 3.5)
  const getScoreBand = (score) => {
    const num = Number(score);
    if (num < 2.5) return 'low';
    if (num <= 3.5) return 'moderate';
    return 'high';
  };

  const getDynamicRecommendations = () => {
    if (!mindsetResult) return null;

    const secBand = getScoreBand(mindsetResult.security);
    const autBand = getScoreBand(mindsetResult.autonomy);
    const commBand = getScoreBand(mindsetResult.communication);
    const achBand = getScoreBand(mindsetResult.achievement);

    const childName = linkState.status === 'linked' ? linkState.childProfile.firstName : 'your child';
    const childNamePossessive = linkState.status === 'linked' ? `${linkState.childProfile.firstName}’s` : 'your child’s';

    // 1. Autonomy & Stability
    let item1Text = '';
    if (autBand === 'high') {
      item1Text = `Your high Autonomy support score (${mindsetResult.autonomy.toFixed(1)}/5.0) empowers ${childName} to take strong ownership of their career direction. Ensure you complement their freedom by co-evaluating practical job market demand and long-term financial stability.`;
    } else if (autBand === 'moderate') {
      item1Text = `Your moderate Autonomy support score (${mindsetResult.autonomy.toFixed(1)}/5.0) offers guided independence. Encourage ${childName} to voice their personal preferences while collaboratively testing stream options against realistic career outcomes.`;
    } else {
      item1Text = `Your lower Autonomy support score (${mindsetResult.autonomy.toFixed(1)}/5.0) indicates a protective approach. Try giving ${childName} more agency in selecting subject electives to build self-directed decision confidence.`;
    }

    // 2. Communication & Dialogue
    let item2Text = '';
    if (commBand === 'high') {
      item2Text = `Strong Communication foundation (${mindsetResult.communication.toFixed(1)}/5.0)! Continue facilitating reflective discussions about how ${childName} feels regarding stream workloads, entrance exam pressures, and personal aspirations.`;
    } else if (commBand === 'moderate') {
      item2Text = `Moderate Communication score (${mindsetResult.communication.toFixed(1)}/5.0). Schedule dedicated non-judgmental check-ins to ask open-ended questions like "What part of this stream excites you most?" rather than focusing strictly on marks.`;
    } else {
      item2Text = `Communication is your primary growth opportunity (${mindsetResult.communication.toFixed(1)}/5.0). Focus on active listening during career talks—ask questions without dictating outcomes, and validate ${childNamePossessive} feelings and doubts about the future.`;
    }

    // Lowest dimension identification
    const dims = [
      { name: 'Security & Stability', score: mindsetResult.security, band: secBand, icon: '🛡️' },
      { name: 'Achievement & Status', score: mindsetResult.achievement, band: achBand, icon: '🏆' },
      { name: 'Autonomy Support', score: mindsetResult.autonomy, band: autBand, icon: '🕊️' },
      { name: 'Communication', score: mindsetResult.communication, band: commBand, icon: '💬' },
    ];
    dims.sort((a, b) => a.score - b.score);
    const lowestDim = dims[0];

    return { item1Text, item2Text, lowestDim, secBand, autBand, commBand, achBand };
  };

  // Compute live real-time dimension statistics for Live Perspective Board
  const getLiveDimensionStats = () => {
    const dimensions = [
      {
        key: 'security',
        label: 'Security & Stability',
        icon: ShieldCheck,
        indices: [0, 1, 2],
      },
      {
        key: 'achievement',
        label: 'Achievement & Status',
        icon: Award,
        indices: [3, 4, 5],
      },
      {
        key: 'autonomy',
        label: 'Autonomy Support',
        icon: Compass,
        indices: [6, 7, 8],
      },
      {
        key: 'communication',
        label: 'Communication',
        icon: MessageSquare,
        indices: [9, 10, 11],
      },
    ];

    const hasAnswers = parentAnswers.length > 0;

    const stats = dimensions.map((dim) => {
      const answeredVals = dim.indices
        .filter((idx) => idx < parentAnswers.length)
        .map((idx) => parentAnswers[idx]);

      if (answeredVals.length === 0) {
        return {
          ...dim,
          answeredCount: 0,
          score: null,
          percentage: null,
        };
      }

      const sum = answeredVals.reduce((a, b) => a + b, 0);
      const avg = sum / answeredVals.length;
      const pct = Math.round((avg / 5) * 100);

      return {
        ...dim,
        answeredCount: answeredVals.length,
        score: avg.toFixed(1),
        percentage: pct,
      };
    });

    return { hasAnswers, stats };
  };

  const { hasAnswers, stats: liveStats } = getLiveDimensionStats();

  // Assessment Progress Pct (Count answered questions out of 12)
  const assessmentProgressPct = assessmentDone
    ? 100
    : Math.round((parentAnswers.length / PARENT_QUESTIONS.length) * 100);

  const getGuidanceTargetLabel = () => {
    if (linkState.status === 'linked') return `${linkState.childProfile.grade} (${linkState.childProfile.streamCode})`;
    if (linkState.status === 'pending') return 'Pending Approval';

    let gradeLabel = 'Class 9–10';
    if (parentProvidedGrade.includes('9') || parentProvidedGrade.includes('10')) {
      gradeLabel = 'Class 9–10';
    } else if (parentProvidedGrade.includes('11')) {
      gradeLabel = 'Class 11';
    } else if (parentProvidedGrade.includes('12')) {
      gradeLabel = 'Class 12';
    } else if (parentProvidedGrade.toLowerCase().includes('undergraduate') || parentProvidedGrade.toLowerCase().includes('college')) {
      gradeLabel = 'College';
    }

    let streamLabel = parentProvidedStream.split(' ')[0];
    if (parentProvidedStream.includes('Arts')) streamLabel = 'Arts';
    if (parentProvidedStream.includes('Commerce')) streamLabel = 'Commerce';
    if (parentProvidedStream.includes('Undecided')) streamLabel = 'Undecided';

    return `${gradeLabel} (${streamLabel})`;
  };

  return (
    <div className="min-h-screen bg-[#f3ead3] text-[#1C2536] font-body flex flex-col lg:flex-row relative overflow-x-hidden">
      <GrainOverlay />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[100] max-w-md rounded-xl border border-brass bg-ink-deep/95 p-4 shadow-2xl text-xs font-semibold text-parchment flex items-center gap-3 backdrop-blur-xl"
          >
            <AlertCircle className="h-5 w-5 text-brass-bright shrink-0 animate-pulse" />
            <span className="flex-1 leading-relaxed">{toast}</span>
            <button onClick={() => setToast(null)} className="text-fog hover:text-parchment text-sm">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient background light */}
      <div className="pointer-events-none fixed -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-brass/10 blur-[120px] z-0" />
      <div className="pointer-events-none fixed bottom-0 right-10 h-[450px] w-[450px] rounded-full bg-brass-bright/10 blur-[130px] z-0" />

      {/* ======================================================== */}
      {/* MOBILE TOP BAR (lg:hidden) */}
      {/* ======================================================== */}
      <div className="lg:hidden sticky top-0 z-50 bg-ink-deep border-b border-parchment/15 px-4 py-3 flex items-center justify-between backdrop-blur-md text-parchment">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-lg border border-parchment/20 text-parchment hover:bg-ink/60"
            aria-label="Open Parent Portal Sidebar"
          >
            <Menu className="h-5 w-5 text-brass-bright" />
          </button>
          <span className="font-display font-bold text-parchment flex items-center gap-2 text-base">
            <span className="h-7 w-7 rounded-full bg-brass/20 border border-brass-bright flex items-center justify-center text-brass-bright">
              <HeartHandshake className="h-4 w-4" />
            </span>
            <span>PathFinders</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher compact={true} />
          <span className={`text-[0.68rem] font-mono font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
            linkState.status === 'linked'
              ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
              : linkState.status === 'pending'
              ? 'text-amber-300 bg-amber-500/10 border border-amber-500/30'
              : 'text-stone-300 bg-stone-500/10 border border-stone-500/30'
          }`}>
            {linkState.status === 'linked' ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" /> {linkState.childProfile.fullName}
              </>
            ) : linkState.status === 'pending' ? (
              <>
                <Clock className="h-3 w-3 text-amber-300 animate-spin" /> Pending Approval
              </>
            ) : (
              <>
                <ShieldCheck className="h-3 w-3 text-amber-300" /> Parent Mode
              </>
            )}
          </span>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* LEFT SIDEBAR NAVBAR */}
      {/* ======================================================== */}
      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-64 lg:w-72 bg-ink/95 border-r border-parchment/15 p-5 flex flex-col justify-between transition-transform duration-300 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} shadow-2xl text-parchment backdrop-blur-xl`}>
        
        <div>
          {/* Logo & Portal Identity Header */}
          <div className="pb-6 mb-4 border-b border-parchment/10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-brass-bright bg-brass/15 shadow-[0_0_12px_rgba(217,165,72,0.25)]">
                <HeartHandshake className="h-5 w-5 text-brass-bright" />
              </span>
              <div>
                <span className="font-display font-bold text-lg text-parchment group-hover:text-brass-bright transition-colors tracking-wide">PathFinders</span>
                <span className="block text-[0.62rem] font-mono text-brass-bright uppercase tracking-widest mt-0.5 font-semibold">PARENT PORTAL</span>
              </div>
            </Link>
            <LanguageSwitcher compact={true} />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-3 font-body">
            
            {/* 1. Parent Guidance / Child Progress */}
            <button
              type="button"
              onClick={() => { setActiveTab('overview'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-ink-deep text-parchment border border-brass/50 shadow-lg'
                  : 'text-fog hover:text-parchment hover:bg-ink-deep/60 border border-transparent'
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brass/15 border border-brass/30 text-brass-bright shrink-0 shadow-sm">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <span className="font-bold text-sm block text-parchment">
                  {linkState.status === 'linked' ? 'Child Progress' : 'Parent Guidance'}
                </span>
                <span className="text-[0.7rem] text-fog/60 font-mono block">
                  {linkState.status === 'linked' ? 'Status & Milestones' : 'Overview & Setup'}
                </span>
              </div>
            </button>

            {/* 2. Parent Assessment */}
            <button
              type="button"
              onClick={() => { setActiveTab('assessment'); setMobileSidebarOpen(false); }}
              className={`w-full flex flex-col gap-1.5 p-3 rounded-xl text-left transition-all cursor-pointer ${
                activeTab === 'assessment'
                  ? 'bg-ink-deep text-parchment border border-brass/50 shadow-lg relative overflow-hidden'
                  : 'text-fog hover:text-parchment hover:bg-ink-deep/60 border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brass/15 border border-brass/30 text-brass-bright shrink-0 shadow-sm">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-brass-bright block">Parent Assessment</span>
                    <span className="text-[0.7rem] text-fog/60 font-mono block">
                      {assessmentDone ? 'Report Done 🎉' : `Q ${currentQIndex + 1}/${PARENT_QUESTIONS.length} Evaluation`}
                    </span>
                  </div>
                </div>
                <span className="text-[0.68rem] font-mono font-bold bg-brass/20 border border-brass/40 text-brass-bright px-2 py-0.5 rounded-full">
                  {assessmentProgressPct}%
                </span>
              </div>

              {/* Progress Line */}
              <div className="mt-1 h-1.5 w-full bg-ink/80 rounded-full overflow-hidden border border-parchment/10">
                <div
                  className="h-full bg-brass-bright rounded-full transition-all duration-300"
                  style={{ width: `${assessmentProgressPct}%` }}
                />
              </div>
            </button>

            {/* 3. Book Counsellor */}
            <button
              type="button"
              onClick={() => {
                if (!assessmentDone) {
                  showNotification('🔒 Counselling is LOCKED! Please complete the 12-question Parent Perspective Assessment first so your counsellor has background context before your session.');
                  setActiveTab('assessment');
                  setMobileSidebarOpen(false);
                } else {
                  setActiveTab('counseling');
                  setMobileSidebarOpen(false);
                }
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer ${
                !assessmentDone
                  ? 'text-amber-300 bg-amber-950/30 border border-amber-500/30 hover:bg-amber-950/40'
                  : activeTab === 'counseling'
                  ? 'bg-[#1C273C] text-white border border-brass/50 shadow-lg'
                  : 'text-fog hover:text-parchment hover:bg-ink-deep/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  assessmentDone
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                    : 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                } shrink-0 shadow-sm`}>
                  {assessmentDone ? <PhoneCall className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                </div>
                <div>
                  <span className="font-bold text-sm block text-parchment">Book Counsellor</span>
                  <span className="text-[0.7rem] font-mono block">
                    {assessmentDone ? '1-on-1 Consultation' : 'Locked (Assessment Required)'}
                  </span>
                </div>
              </div>

              {!assessmentDone ? (
                <span className="text-[0.65rem] font-mono font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Lock className="h-3 w-3 text-amber-400" /> LOCKED
                </span>
              ) : (
                <span className="text-[0.65rem] font-mono font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Unlock className="h-3 w-3 text-emerald-400" /> ACTIVE
                </span>
              )}
            </button>

            {/* 4. Stream Matrix */}
            <button
              type="button"
              onClick={() => { setActiveTab('streams'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all cursor-pointer ${
                activeTab === 'streams'
                  ? 'bg-ink-deep text-parchment border border-brass/50 shadow-lg'
                  : 'text-fog hover:text-parchment hover:bg-ink-deep/60 border border-transparent'
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400 shrink-0 shadow-sm">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <span className="font-bold text-sm block text-parchment">Stream Matrix</span>
                <span className="text-[0.7rem] text-fog/60 font-mono block">Class 11 Subject Routes</span>
              </div>
            </button>

          </nav>
          <LogoutButton className="mt-4 flex w-full items-center gap-2 rounded-xl border border-rose-500/30 px-3 py-2 text-left text-xs font-semibold text-rose-300 hover:bg-rose-500/10" />
        </div>

        {/* Footer: Sidebar Profile Card Reflecting 4 Link States */}
        <div className="pt-4 border-t border-parchment/10 space-y-3">
          
          {linkState.status === 'linked' ? (
            /* Linked Student Card */
            <div className="p-3 rounded-xl bg-ink-deep/80 border border-parchment/15 space-y-2">
              <div className="flex items-center gap-3">
                <span className="h-9 w-9 rounded-full bg-brass/20 text-brass-bright font-bold flex items-center justify-center text-xs border border-brass/40 shrink-0">
                  🎓
                </span>
                <div className="flex-1 overflow-hidden">
                  <span className="font-bold text-sm text-parchment block truncate">{linkState.childProfile.fullName}</span>
                  <span className="text-[0.68rem] text-fog/60 block font-mono">{linkState.childProfile.grade} • {linkState.childProfile.streamCode}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[0.68rem] font-mono border-t border-parchment/10 pt-2">
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" /> Connected
                </span>
                <button
                  type="button"
                  onClick={async () => {
                    await linkService.unlinkChild();
                    showNotification('Child account unlinked. Operating in Standalone Parent Mode.');
                  }}
                  className="text-fog/60 hover:text-amber-300 transition-colors"
                >
                  Unlink
                </button>
              </div>
            </div>
          ) : linkState.status === 'pending' ? (
            /* Pending Request Card */
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="h-8 w-8 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-xs border border-amber-500/40 shrink-0">
                  ⏳
                </span>
                <div className="flex-1 overflow-hidden">
                  <span className="font-bold text-xs text-parchment block truncate">Request Pending</span>
                  <span className="text-[0.65rem] text-amber-300/80 block font-mono">Waiting for child</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[0.68rem] font-mono border-t border-parchment/10 pt-2">
                <span className="text-amber-300 font-semibold flex items-center gap-1">
                  ⏳ Pending Approval
                </span>
                <button
                  type="button"
                  onClick={() => setShowLinkModal(true)}
                  className="text-amber-300 underline hover:text-white font-bold"
                >
                  View Status
                </button>
              </div>
            </div>
          ) : (
            /* Standalone Parent Card (Not Linked / Declined) */
            <div className="p-3 rounded-xl bg-ink-deep/90 border border-brass/30 space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="h-8 w-8 rounded-full bg-brass/20 text-brass-bright font-bold flex items-center justify-center text-xs border border-brass/40 shrink-0 uppercase">
                  {userProfile.avatarUrl ? (
                    <Image src={userProfile.avatarUrl} alt={fullName} width={32} height={32} unoptimized className="h-full w-full object-cover rounded-full" />
                  ) : (
                    getInitials(fullName)
                  )}
                </span>
                <div className="flex-1 overflow-hidden">
                  <span className="font-bold text-xs text-parchment block truncate" title={fullName}>{fullName}</span>
                  <span className="text-[0.65rem] text-fog/60 block font-mono">
                    {linkState.status === 'declined' ? 'Request Not Approved' : 'Parent Account Active'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[0.68rem] font-mono border-t border-parchment/10 pt-2">
                <span className="text-amber-300 font-semibold flex items-center gap-1">
                  ⚪ Parent Counselling Mode
                </span>
              </div>
            </div>
          )}

          {/* Trigger 1: Unified Sidebar Link Button */}
          <button
            type="button"
            onClick={() => setShowLinkModal(true)}
            className="w-full text-center py-2.5 rounded-xl border border-brass/40 bg-brass/10 hover:bg-brass hover:text-ink-deep transition-all text-xs font-mono font-bold text-brass-bright block cursor-pointer"
          >
            {linkState.status === 'linked'
              ? `🎓 ${linkState.childProfile.fullName} (Linked)`
              : linkState.status === 'pending'
              ? `⏳ Request Pending (View Status)`
              : linkState.status === 'declined'
              ? `➕ Link Child Account`
              : `➕ Link Child Account (Optional)`}
          </button>

        </div>

      </aside>

      {/* ======================================================== */}
      {/* MAIN CONTENT AREA */}
      {/* ======================================================== */}
      <main className="flex-1 lg:pl-72 py-8 px-4 sm:px-8 max-w-[1400px] mx-auto space-y-8 relative z-10">

        {/* Top Header Banner */}
        <div className="rounded-2xl border border-[#E6DCC8] bg-[#F5EBD7] p-6 sm:p-8 text-[#1C2536] shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B8860B] mb-2 font-bold">
                <HeartHandshake className="h-4 w-4 text-[#B8860B]" /> Official Parent Guidance Portal
                {linkState.status !== 'linked' && (
                  <span className="text-[0.68rem] bg-amber-200/80 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full font-bold lowercase">
                    {linkState.status === 'pending' ? 'link request pending' : 'standalone mode (no child account)'}
                  </span>
                )}
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C2536] mb-2">
                Parent Expedition Dashboard
              </h1>
              <p className="text-sm text-[#524636] max-w-2xl leading-relaxed">
                {linkState.status === 'linked'
                  ? `Take the Parent Perspective Assessment, balance security with student autonomy, and monitor real-time academic milestones for ${linkState.childProfile.fullName}.`
                  : 'Take the Parent Perspective Assessment to evaluate your own career mindset, explore stream options for your child, and book 1-on-1 expert counsellor sessions.'}
              </p>
            </div>

            {/* Quick Stats Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white/90 border border-[#E6DCC8] p-3.5 rounded-xl backdrop-blur-md shrink-0 shadow-xs">
              <div className="text-center px-2">
                <div className="text-[0.68rem] font-mono text-stone-500">Child Account</div>
                <div className="text-xs font-bold text-emerald-700 font-mono mt-0.5 flex items-center justify-center gap-1">
                  {linkState.status === 'linked' ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Linked: {linkState.childProfile.firstName}
                    </>
                  ) : linkState.status === 'pending' ? (
                    <span className="text-amber-700 font-bold">⏳ Request Pending</span>
                  ) : (
                    <span className="text-stone-600">⚪ Standalone Mode</span>
                  )}
                </div>
              </div>
              <div className="text-center px-2 border-l border-stone-200">
                <div className="text-[0.68rem] font-mono text-stone-500">Guidance Target</div>
                <div className="text-xs font-bold text-[#B8860B] font-mono mt-0.5 truncate max-w-[130px]" title={getGuidanceTargetLabel()}>
                  {getGuidanceTargetLabel()}
                </div>
              </div>
              <div className="text-center px-2 border-l border-stone-200 col-span-2 sm:col-span-1">
                <div className="text-[0.68rem] font-mono text-stone-500">Parent Mindset</div>
                <div className="text-xs font-bold text-[#1C2536] font-mono mt-0.5">
                  {assessmentDone ? '✓ Profile Done' : 'Pending (12 Qs)'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: CHILD PROGRESS & STATUS TRACKER / PARENT GUIDANCE CENTER */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              
              {linkState.status !== 'linked' ? (
                /* Standalone Parent Guidance Overview (No Child Account Required) */
                <div className="rounded-2xl border border-[#E6DCC8] bg-white p-6 shadow-sm space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-widest text-[#B8860B] font-semibold flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-[#B8860B]" /> Parent Guidance &amp; Counselling Mode
                      </span>
                      <h2 className="font-serif text-2xl font-bold text-[#1C2536] flex items-center gap-2 mt-0.5">
                        <HeartHandshake className="h-6 w-6 text-[#B8860B]" /> Independent Parent Center
                      </h2>
                    </div>
                    <span className="text-xs font-mono text-amber-800 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full font-semibold flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-amber-500" /> Standalone (No Child Account Required)
                    </span>
                  </div>

                  {/* Explicit Explanation Card */}
                  <div className="p-4 rounded-xl border border-[#E5D7B7] bg-[#F8F3E6] space-y-2 text-xs">
                    <div className="font-bold text-[#1C2536] text-sm flex items-center gap-2">
                      <span>💡 Direct Parent Counselling &amp; Support Mode</span>
                    </div>
                    <p className="text-[#524636] leading-relaxed">
                      You are using the Parent Portal for direct counselling and stream advisory. Your child does <strong>not</strong> need to have a PathFinders account for you to complete parent assessments, explore stream options, or book 1-on-1 counsellor calls.
                    </p>
                  </div>

                  {/* Interactive Child Context Selector (Filled by Parent) */}
                  <div className="p-5 rounded-xl border border-stone-200 bg-[#FAF5E8] space-y-4">
                    <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                      <span className="font-serif font-bold text-sm text-[#1C2536] flex items-center gap-2">
                        <Brain className="h-4 w-4 text-[#B8860B]" /> Child Profile Context (For Counsellor Reference)
                      </span>
                      <span className="text-[0.68rem] font-mono text-stone-500">Self-specified by Parent</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <label className="block text-stone-600 mb-1 font-semibold">Child&apos;s Current Grade / Stage</label>
                        <select
                          value={parentProvidedGrade}
                          onChange={(e) => setParentProvidedGrade(e.target.value)}
                          className="w-full rounded-lg border border-stone-300 bg-white p-2.5 text-xs text-[#1C2536] font-bold"
                        >
                          <option value="Class 9–10 (Stream Selection Phase)">Class 9–10 (Stream Selection Phase)</option>
                          <option value="Class 11 (Higher Secondary Stream)">Class 11 (Higher Secondary Stream)</option>
                          <option value="Class 12 (College Entrance Phase)">Class 12 (College Entrance Phase)</option>
                          <option value="Undergraduate / Degree College">Undergraduate / Degree College</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-stone-600 mb-1 font-semibold">Child&apos;s Dominant Domain Interest</label>
                        <select
                          value={parentProvidedStream}
                          onChange={(e) => setParentProvidedStream(e.target.value)}
                          className="w-full rounded-lg border border-stone-300 bg-white p-2.5 text-xs text-[#1C2536] font-bold"
                        >
                          <option value="PCM (Engineering & Tech Focus)">PCM (Engineering, Tech &amp; CS)</option>
                          <option value="PCB (Healthcare & Medical Focus)">PCB (Medical, Biology &amp; Health)</option>
                          <option value="Commerce & Finance">Commerce (Finance, CA &amp; Business)</option>
                          <option value="Arts, Design & Humanities">Arts, UI/UX Design &amp; Humanities</option>
                          <option value="Undecided / Exploring Options">Undecided / Exploring Options</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Recommended Parent Steps */}
                  <div>
                    <h3 className="text-xs font-mono text-stone-500 uppercase tracking-wider mb-3 font-semibold">
                      Parent Guidance Action Plan
                    </h3>
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl border border-stone-200 bg-[#FAF5E8] text-xs text-stone-600 flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-[#B8860B]/20 text-[#B8860B] font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                          1
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-0.5">
                            <strong className="text-[#1C2536] font-semibold">Parent Perspective Assessment (12 Qs)</strong>
                            <span className={`text-[0.68rem] font-mono px-2 py-0.5 rounded ${assessmentDone ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-amber-100 text-amber-800'}`}>
                              {assessmentDone ? 'Completed ✓' : 'Recommended Step 1'}
                            </span>
                          </div>
                          <p className="text-stone-600">Understand your own mindset across Security, Autonomy, Status, and Family Communication.</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl border border-stone-200 bg-[#FAF5E8] text-xs text-stone-600 flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-[#B8860B]/20 text-[#B8860B] font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                          2
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-0.5">
                            <strong className="text-[#1C2536] font-semibold">Review Subject Stream Matrix</strong>
                            <button
                              type="button"
                              onClick={() => setActiveTab('streams')}
                              className="px-3 py-1 rounded-lg bg-[#B8860B] text-white font-mono font-bold text-[0.68rem] hover:bg-[#A37609] transition-all cursor-pointer shadow-xs shrink-0"
                            >
                              Open Stream Matrix →
                            </button>
                          </div>
                          <p className="text-stone-600">Compare degrees, entrance exams, and career demand for PCM, PCB, Commerce &amp; Humanities.</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl border border-stone-200 bg-[#FAF5E8] text-xs text-stone-600 flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-[#B8860B]/20 text-[#B8860B] font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                          3
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-0.5">
                            <strong className="text-[#1C2536] font-semibold">Book 1-on-1 Senior Counsellor Call</strong>
                            <span className={`text-[0.68rem] font-mono px-2 py-0.5 rounded ${assessmentDone ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-stone-200 text-stone-600'}`}>
                              {assessmentDone ? 'Unlocked ✅' : 'Locked until Assessment'}
                            </span>
                          </div>
                          <p className="text-stone-600">Discuss higher education options, entrance exam timelines, and family budgets with an expert.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trigger 2: Action Plan Card Invite Option */}
                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 text-xs text-blue-900 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600 shrink-0" />
                      <span>Want your child to create a PathFinders account later? You can link their account or send an invite link.</span>
                    </div>
                    <button
                      onClick={() => setShowLinkModal(true)}
                      className="px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold font-mono hover:bg-blue-700 transition-all cursor-pointer shadow-xs"
                    >
                      {linkState.status === 'pending' ? '⏳ Request Pending' : '+ Link Child Account'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Connected Student Profile View (When child is linked) */
                <div className="rounded-2xl border border-[#E6DCC8] bg-white p-6 shadow-sm space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-widest text-[#B8860B] font-semibold">
                        Connected Student Profile
                      </span>
                      <h2 className="font-serif text-2xl font-bold text-[#1C2536] flex items-center gap-2 mt-0.5">
                        <GraduationCap className="h-6 w-6 text-[#B8860B]" /> {linkState.childProfile.fullName}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full font-bold">
                        Sharing: {linkState.sharingLevel === 'summary_only' ? 'Summary Only (Default)' : 'Full Results'}
                      </span>
                      <span className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Connection Active
                      </span>
                    </div>
                  </div>

                  {/* Grid Info Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                    <div className="p-4 rounded-xl border border-stone-200 bg-[#FAF5E8]">
                      <span className="text-stone-500 block mb-1">Academic Grade &amp; School</span>
                      <span className="font-bold text-[#1C2536] text-sm">{linkState.childProfile.grade} • {linkState.childProfile.school}</span>
                    </div>
                    <div className="p-4 rounded-xl border border-stone-200 bg-[#FAF5E8]">
                      <span className="text-stone-500 block mb-1">Chosen Stream</span>
                      <span className="font-bold text-[#B8860B] text-sm">{linkState.childProfile.stream}</span>
                    </div>
                    <div className="p-4 rounded-xl border border-stone-200 bg-[#FAF5E8]">
                      <span className="text-stone-500 block mb-1">Student Dominant Trait</span>
                      <span className="font-bold text-emerald-700 text-sm">{linkState.childProfile.dominantTraitIcon} {linkState.childProfile.dominantTrait}</span>
                    </div>
                  </div>

                  {/* Progress Bar Milestone */}
                  <div className="p-5 rounded-xl border border-[#E5D7B7] bg-[#F8F3E6] space-y-3">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="font-semibold text-[#B8860B]">Academic Milestone Progress</span>
                      <span className="text-[#1C2536] font-bold">{linkState.childProfile.milestoneProgress}% Completed</span>
                    </div>
                    <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden border border-stone-300/60">
                      <div className="h-full bg-gradient-to-r from-[#B8860B] to-emerald-600" style={{ width: `${linkState.childProfile.milestoneProgress}%` }} />
                    </div>
                  </div>

                  {/* Sharing Level Details */}
                  {linkState.sharingLevel === 'full_results' ? (
                    <div className="space-y-4 pt-2 border-t border-stone-100">
                      <h3 className="text-xs font-mono text-stone-500 uppercase tracking-wider font-semibold flex items-center justify-between">
                        <span>Detailed Domain Scores &amp; Matches</span>
                        <span className="text-[0.65rem] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-bold lowercase">
                          unlocked by student (full results)
                        </span>
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-stone-200 bg-[#FAF5E8] space-y-2 text-xs font-mono">
                          <strong className="text-[#1C2536] block font-bold text-sm">Domain Interest Scores</strong>
                          {linkState.childProfile.interestScores.map((item) => (
                            <div key={item.domain} className="flex justify-between items-center">
                              <span className="text-stone-600">{item.domain}</span>
                              <span className="font-bold text-[#B8860B]">{item.score}%</span>
                            </div>
                          ))}
                        </div>

                        <div className="p-4 rounded-xl border border-stone-200 bg-[#FAF5E8] space-y-2 text-xs font-mono">
                          <strong className="text-[#1C2536] block font-bold text-sm">Top Career Pathways</strong>
                          {linkState.childProfile.topCareerMatches.map((career) => (
                            <div key={career.title} className="flex justify-between items-center">
                              <span className="text-stone-600 font-semibold">{career.title}</span>
                              <span className="font-bold text-emerald-700">{career.matchPct}% match</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl border border-stone-200 bg-[#FAF5E8] text-xs text-stone-600 font-mono flex items-center gap-2">
                      <Lock className="h-4 w-4 text-stone-400 shrink-0" />
                      <span>Sharing Level: <strong>Summary Only</strong> (Default). Detailed domain scores, raw answers, and AI transcripts remain private by student preference.</span>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Right Side: Parent Assessment Quick Action Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-2xl border border-[#E6DCC8] bg-gradient-to-br from-[#F5EBD7] to-white p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-[#B8860B] uppercase tracking-wider font-bold">
                  <ClipboardList className="h-4 w-4" /> Parent Perspective Assessment
                </div>
                <h3 className="font-serif text-xl font-bold text-[#1C2536]">
                  Evaluate Your Parent Mindset &amp; Approach
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Take our 12-question Parent Perspective Assessment (covering Security, Status, Autonomy &amp; Communication) to prepare pre-session context for counsellor advisory calls.
                </p>

                <button
                  onClick={() => setActiveTab('assessment')}
                  className="w-full py-3.5 rounded-full bg-[#B8860B] text-white text-xs font-bold font-mono hover:bg-[#A37609] transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{assessmentDone ? 'View Mindset Profile' : 'Start Parent Assessment (12 Qs)'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Book Counsellor Card */}
              <div className={`rounded-2xl border p-6 shadow-sm space-y-4 transition-all ${
                !assessmentDone
                  ? 'border-amber-300 bg-[#FDF8EE] text-[#1C2536]'
                  : 'border-[#E6DCC8] bg-white text-[#1C2536]'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#B8860B]">
                    <PhoneCall className="h-4 w-4" /> 1-on-1 Expert Advisor
                  </div>
                  {!assessmentDone ? (
                    <span className="text-[0.68rem] font-mono font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Lock className="h-3.5 w-3.5 text-amber-700" /> LOCKED
                    </span>
                  ) : (
                    <span className="text-[0.68rem] font-mono font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Unlock className="h-3.5 w-3.5 text-emerald-700" /> UNLOCKED
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-lg font-bold text-[#1C2536]">
                  Schedule Parent-Counsellor Call
                </h3>

                {!assessmentDone ? (
                  <div className="space-y-3">
                    <p className="text-xs text-amber-900 bg-amber-100/70 border border-amber-300/80 p-3 rounded-xl leading-relaxed">
                      🔒 <strong>Locked:</strong> Complete the 12-question Parent Perspective Assessment first so our senior counsellor has background context before your 1-on-1 call.
                    </p>
                    <button
                      onClick={() => {
                        setActiveTab('assessment');
                        showNotification('📋 Complete Parent Perspective Assessment to unlock 1-on-1 Counsellor Booking!');
                      }}
                      className="w-full py-3 rounded-full bg-[#B8860B] text-white text-xs font-bold font-mono hover:bg-[#A37609] transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
                    >
                      <span>Complete Parent Assessment to Unlock →</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Discuss stream selection, entrance exam strategies, and higher education budgets with senior career advisors.
                    </p>
                    <button
                      onClick={() => setActiveTab('counseling')}
                      className="w-full py-3 rounded-full border border-[#B8860B] bg-[#B8860B] text-[#1C2536] text-xs font-bold font-mono hover:bg-[#A37609] transition-all cursor-pointer shadow-sm"
                    >
                      Book 30-Min Consultation →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: PARENT ASSESSMENT */}
        {/* ======================================================== */}
        {activeTab === 'assessment' && (
          <div className="max-w-[1280px] mx-auto space-y-8">
            {!assessmentDone ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7">
                  <motion.div
                    key={currentQIndex}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-[#E6DCC8] bg-white p-6 sm:p-8 shadow-sm space-y-7"
                  >
                    <div className="border-b border-stone-200 pb-5 space-y-2">
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <span className="text-xs font-mono uppercase tracking-widest text-[#B8860B] font-bold">
                          Parent Perspective Assessment • Question {currentQIndex + 1} of {PARENT_QUESTIONS.length}
                        </span>
                        <span className="text-xs font-mono text-stone-500 font-bold bg-[#FAF5E8] border border-stone-200 px-3 py-1 rounded-full">
                          {assessmentProgressPct}% Completed
                        </span>
                      </div>
                      
                      <div className="inline-block px-3 py-1 rounded-lg bg-[#F4E9D0] border border-[#E5D7B7] text-[#B8860B] text-xs font-mono font-bold">
                        Dimension: {PARENT_QUESTIONS[currentQIndex].dimension}
                      </div>
                    </div>

                    <div className="py-2">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1C2536] leading-relaxed">
                        &ldquo;{PARENT_QUESTIONS[currentQIndex].q}&rdquo;
                      </h3>
                      <p className="text-xs text-stone-500 mt-2 font-mono">
                        Select the option that best reflects your personal mindset as a parent:
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-1">
                      {LIKERT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleSelectAnswer(opt.value)}
                          className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between group shadow-xs hover:scale-[1.01] active:scale-[0.99] ${opt.color}`}
                        >
                          <span className="font-bold text-sm sm:text-base">{opt.label}</span>
                          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full border border-stone-300 bg-white text-stone-700 group-hover:border-[#B8860B]">
                            Scale {opt.value} / 5
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-stone-200 text-xs font-mono text-stone-500">
                      <div className="flex items-center gap-1.5">
                        {PARENT_QUESTIONS.map((q, idx) => (
                          <span
                            key={q.id}
                            className={`h-2 rounded-full transition-all ${
                              idx === currentQIndex
                                ? 'w-6 bg-[#B8860B]'
                                : idx < currentQIndex
                                ? 'w-2 bg-emerald-600'
                                : 'w-2 bg-stone-200'
                            }`}
                          />
                        ))}
                      </div>

                      {currentQIndex > 0 && (
                        <button
                          onClick={() => {
                            setCurrentQIndex(currentQIndex - 1);
                            setParentAnswers(parentAnswers.slice(0, -1));
                          }}
                          className="hover:text-[#1C2536] underline cursor-pointer font-bold"
                        >
                          ← Previous Question
                        </button>
                      )}
                    </div>
                  </motion.div>
                </div>

                <div className="lg:col-span-5">
                  <motion.div
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-2xl border border-[#E6DCC8] bg-white p-6 shadow-sm space-y-6"
                  >
                    <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-[#B8860B]" />
                        <h3 className="font-serif text-lg font-bold text-[#1C2536]">
                          Live Perspective Board
                        </h3>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border border-[#c6dfca] bg-[#e9f1ea] text-[#3f5b43]">
                        <span className="h-2 w-2 rounded-full bg-[#3f5b43] animate-pulse" />
                        Live
                      </span>
                    </div>

                    {!hasAnswers ? (
                      <div className="p-4 rounded-xl border border-[#d9cdab] bg-[#e8dcb8] space-y-1">
                        <h4 className="font-serif text-sm font-bold text-[#1C2536]">
                          Awaiting your first answer
                        </h4>
                        <p className="font-body text-xs text-[#524636]">
                          Pick an option on the left to see this fill in, live.
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-[#c6dfca] bg-[#e9f1ea] space-y-1">
                        <h4 className="font-serif text-sm font-bold text-[#244528]">
                          Updating live
                        </h4>
                        <p className="font-body text-xs text-[#3f5b43]">
                          Scores recalculate as you answer more questions
                        </p>
                      </div>
                    )}

                    <div className="space-y-5">
                      {liveStats.map((dim) => {
                        const Icon = dim.icon;
                        const scoreDisplay = dim.score !== null ? `${dim.score} / 5.0` : '— / 5.0';

                        return (
                          <div key={dim.key} className="space-y-2">
                            <div className="flex items-center justify-between font-mono text-xs">
                              <div className="flex items-center gap-2 font-bold text-[#1C2536]">
                                <Icon className="h-4 w-4 text-[#B8860B]" />
                                <span>{dim.label}</span>
                              </div>
                              <span className="font-bold text-[#B8860B]">{scoreDisplay}</span>
                            </div>

                            <div className="h-2.5 w-full bg-[#e8dcb8] rounded-full overflow-hidden border border-[#d8cba4]/50">
                              <motion.div
                                className="h-full bg-gradient-to-r from-[#d9a548] to-[#b9862e] rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: dim.percentage !== null ? `${dim.percentage}%` : '0%' }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="rounded-2xl border border-[#E6DCC8] bg-[#F5EBD7] p-6 sm:p-8 shadow-sm relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                    <div>
                      <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-800 font-bold mb-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Parent Perspective Mindset Profile Generated
                      </div>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C2536] mb-2">
                        Parenting Approach &amp; Mindset Analysis
                      </h2>
                      <p className="text-xs sm:text-sm text-[#524636] max-w-2xl leading-relaxed">
                        Evaluated across 4 key dimensions to help you balance career stability, student autonomy, and open family communication.
                      </p>
                    </div>

                    <button
                      onClick={resetParentAssessment}
                      className="self-start sm:self-auto px-4 py-2 rounded-full border border-stone-300 bg-white text-xs font-mono text-stone-700 hover:text-[#1C2536] hover:bg-stone-50 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <RotateCcw className="h-3.5 w-3.5 text-stone-600" /> Retake Assessment
                    </button>
                  </div>
                </div>

                {mindsetResult && (() => {
                  const recs = getDynamicRecommendations();

                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        
                        <div className="p-6 rounded-2xl border border-[#E6DCC8] bg-white shadow-sm space-y-3">
                          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                            <div className="flex items-center gap-2.5">
                              <span className="text-xl">🛡️</span>
                              <h3 className="font-serif font-bold text-base text-[#1C2536]">Security &amp; Stability</h3>
                            </div>
                            <span className="text-sm font-mono font-bold text-[#B8860B] bg-[#F4E9D0] px-3 py-1 rounded-full border border-[#E5D7B7]">
                              {Number(mindsetResult.security).toFixed(1)} / 5.0
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 leading-relaxed">
                            Measures how strongly you prioritize financial security, job predictability, and risk avoidance for your child.
                          </p>
                          <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#B8860B] rounded-full"
                              style={{ width: `${(mindsetResult.security / 5) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div className="p-6 rounded-2xl border border-[#E6DCC8] bg-white shadow-sm space-y-3">
                          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                            <div className="flex items-center gap-2.5">
                              <span className="text-xl">🏆</span>
                              <h3 className="font-serif font-bold text-base text-[#1C2536]">Achievement &amp; Status</h3>
                            </div>
                            <span className="text-sm font-mono font-bold text-purple-800 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                              {Number(mindsetResult.achievement).toFixed(1)} / 5.0
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 leading-relaxed">
                            Measures your focus on institutional prestige, academic marks, and societal validation of career choices.
                          </p>
                          <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-600 rounded-full"
                              style={{ width: `${(mindsetResult.achievement / 5) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div className="p-6 rounded-2xl border border-[#E6DCC8] bg-white shadow-sm space-y-3">
                          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                            <div className="flex items-center gap-2.5">
                              <span className="text-xl">🕊️</span>
                              <h3 className="font-serif font-bold text-base text-[#1C2536]">Autonomy Support</h3>
                            </div>
                            <span className="text-sm font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                              {Number(mindsetResult.autonomy).toFixed(1)} / 5.0
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 leading-relaxed">
                            Measures your willingness to let your child lead their own career decisions and support their personal choices.
                          </p>
                          <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-600 rounded-full"
                              style={{ width: `${(mindsetResult.autonomy / 5) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div className="p-6 rounded-2xl border border-[#E6DCC8] bg-white shadow-sm space-y-3">
                          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                            <div className="flex items-center gap-2.5">
                              <span className="text-xl">💬</span>
                              <h3 className="font-serif font-bold text-base text-[#1C2536]">Communication</h3>
                            </div>
                            <span className="text-sm font-mono font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                              {Number(mindsetResult.communication).toFixed(1)} / 5.0
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 leading-relaxed">
                            Measures open emotional dialogue, active listening, and asking questions vs dictating career outcomes.
                          </p>
                          <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{ width: `${(mindsetResult.communication / 5) * 100}%` }}
                            />
                          </div>
                        </div>

                      </div>

                      {/* Guidance Recommendations */}
                      <div className="rounded-2xl border border-[#E6DCC8] bg-white p-6 sm:p-8 shadow-sm space-y-5">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <h4 className="text-xs font-mono uppercase tracking-wider text-[#B8860B] font-bold">
                            Key Recommendations for Family Career Discussions
                          </h4>
                          {recs && (
                            <span className="text-[0.68rem] font-mono bg-[#FAF5E8] border border-[#E5D7B7] text-[#B8860B] px-2.5 py-0.5 rounded-full font-bold">
                              {recs.lowestDim.icon} Primary Focus Area: {recs.lowestDim.name} ({recs.lowestDim.score.toFixed(1)}/5.0)
                            </span>
                          )}
                        </div>

                        <div className="space-y-3 font-body text-xs text-stone-700">
                          <div className="p-4 rounded-xl border border-stone-200 bg-[#FAF5E8] space-y-1">
                            <div className="flex items-center justify-between">
                              <strong className="text-[#1C2536] text-sm block">Balancing Security &amp; Student Autonomy</strong>
                              {recs && (
                                <span className={`text-[0.65rem] font-mono font-bold px-2 py-0.5 rounded uppercase ${recs.autBand === 'high' ? 'bg-emerald-100 text-emerald-800' : recs.autBand === 'moderate' ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-800'}`}>
                                  Autonomy: {recs.autBand} ({mindsetResult.autonomy.toFixed(1)}/5.0)
                                </span>
                              )}
                            </div>
                            <p className="leading-relaxed text-stone-700 pt-1">
                              {recs ? recs.item1Text : ''}
                            </p>
                          </div>

                          <div className="p-4 rounded-xl border border-stone-200 bg-[#FAF5E8] space-y-1">
                            <div className="flex items-center justify-between">
                              <strong className="text-[#1C2536] text-sm block">Strengthening Parent-Child Dialogue</strong>
                              {recs && (
                                <span className={`text-[0.65rem] font-mono font-bold px-2 py-0.5 rounded uppercase ${recs.commBand === 'high' ? 'bg-emerald-100 text-emerald-800' : recs.commBand === 'moderate' ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-800'}`}>
                                  Communication: {recs.commBand} ({mindsetResult.communication.toFixed(1)}/5.0)
                                </span>
                              )}
                            </div>
                            <p className="leading-relaxed text-stone-700 pt-1">
                              {recs ? recs.item2Text : ''}
                            </p>
                          </div>

                          {/* Trigger 3: Recommendation Card Nudge */}
                          {linkState.status !== 'linked' && (
                            <div className="p-3.5 rounded-xl border border-amber-300 bg-amber-50/90 text-xs text-amber-950 flex items-center justify-between flex-wrap gap-2.5 font-mono">
                              <div className="flex items-center gap-2 flex-1">
                                <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
                                <span>
                                  {linkState.status === 'pending'
                                    ? `Link request sent to your child. Once approved, recommendations will adapt to their live profile.`
                                    : `Link your child's account to turn generic suggestions into recommendations tailored directly to their profile.`}
                                </span>
                              </div>
                              <button
                                onClick={() => setShowLinkModal(true)}
                                className="px-3 py-1.5 rounded-lg bg-[#B8860B] text-white font-bold hover:bg-[#A37609] transition-all text-xs cursor-pointer shadow-xs shrink-0"
                              >
                                {linkState.status === 'pending' ? 'View Request Status →' : 'Link Child Account →'}
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50 text-xs text-emerald-900 space-y-2">
                          <div className="flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-2 font-mono font-bold">
                              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                              <span>Pre-session Counsellor Context Ready &amp; Attached</span>
                            </div>
                            <button
                              onClick={() => setActiveTab('counseling')}
                              className="px-5 py-2 rounded-full bg-[#B8860B] text-white text-xs font-bold font-mono hover:bg-[#A37609] transition-all cursor-pointer shadow-xs"
                            >
                              Book Counsellor Call Now →
                            </button>
                          </div>
                          <div className="text-[0.7rem] font-mono text-emerald-800 bg-white/70 p-2.5 rounded-lg border border-emerald-200/80 flex flex-wrap items-center justify-between gap-2">
                            <div>📋 <strong>Attached Profile:</strong> Mindset Score: Security ({mindsetResult.security.toFixed(1)}), Autonomy ({mindsetResult.autonomy.toFixed(1)}), Comm ({mindsetResult.communication.toFixed(1)})</div>
                            <div>🎯 <strong>Target Selections:</strong> {linkState.status === 'linked' ? `${linkState.childProfile.fullName} (${linkState.childProfile.grade} ${linkState.childProfile.streamCode})` : `${parentProvidedGrade} | Stream: ${parentProvidedStream}`}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: BOOK 1-ON-1 COUNSELLOR CONSULTATION */}
        {/* ======================================================== */}
        {activeTab === 'counseling' && (
          !assessmentDone ? (
            <div className="max-w-3xl mx-auto rounded-2xl border border-amber-300 bg-[#FFFDF9] p-8 sm:p-10 shadow-md text-center space-y-6">
              <div className="h-16 w-16 rounded-full border border-amber-400 bg-amber-100 mx-auto flex items-center justify-center text-amber-800 shadow-sm">
                <Lock className="h-8 w-8 text-amber-800" />
              </div>
              
              <div className="inline-block px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-mono font-bold">
                🔒 COUNSELLING TAB LOCKED
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C2536]">
                Parent Assessment Required Before Booking
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
                To ensure your 1-on-1 counselling session is highly effective, our certified senior advisors require background context from your Parent Assessment prior to booking your call.
              </p>

              <div className="bg-[#FAF5E8] border border-[#E6DCC8] p-5 rounded-2xl max-w-md mx-auto space-y-3 text-left">
                <div className="flex items-center gap-3 text-xs font-semibold text-amber-900">
                  <span className="h-6 w-6 rounded-full bg-amber-200 flex items-center justify-center font-bold text-amber-900 shrink-0">1</span>
                  <span>Complete 12-Question Parent Assessment (Pending ⚠️)</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-stone-400 border-t border-stone-200 pt-2">
                  <span className="h-6 w-6 rounded-full bg-stone-200 flex items-center justify-center font-bold text-stone-500 shrink-0">2</span>
                  <span>Schedule 1-on-1 Video Consultation (Locked 🔒)</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('assessment')}
                className="inline-flex items-center gap-2 rounded-full bg-[#B8860B] px-8 py-3.5 text-sm font-bold text-white hover:bg-[#A37609] transition-all shadow-md cursor-pointer font-mono"
              >
                <span>Start 12-Question Parent Assessment Now →</span>
              </button>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto rounded-2xl border border-[#E6DCC8] bg-white p-6 sm:p-10 shadow-md text-center space-y-6">
              <div className="h-16 w-16 rounded-full border border-[#B8860B]/40 bg-[#F4E9D0] mx-auto flex items-center justify-center text-[#B8860B] shadow-xs">
                <PhoneCall className="h-8 w-8" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C2536]">
                Schedule Parent-Counsellor Consultation
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                Connect 1-on-1 with certified senior career strategists to review {linkState.status === 'linked' ? linkState.childProfile.firstName : "your child's"} academic standing, stream selection, competitive entrance exams, and higher education planning.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left font-mono text-xs">
                <div className="p-4 rounded-xl border border-stone-200 bg-[#FAF5E8] space-y-1">
                  <span className="text-stone-500 block">Available Advisor</span>
                  <span className="font-bold text-[#1C2536] text-sm block">Dr. Aris Thorne</span>
                  <span className="text-[#B8860B] text-[0.7rem] block font-semibold">Lead STEM &amp; Higher Education Advisor</span>
                </div>
                <div className="p-4 rounded-xl border border-stone-200 bg-[#FAF5E8] space-y-1">
                  <span className="text-stone-500 block">Session Format &amp; Duration</span>
                  <span className="font-bold text-[#1C2536] text-sm block">30 Minutes 1-on-1</span>
                  <span className="text-emerald-700 text-[0.7rem] block font-semibold">Private Video Call or Phone Session</span>
                </div>
              </div>

              <button
                onClick={() => showNotification('📞 Counsellor session request submitted! Our team will contact you within 24 hours to confirm your slot.')}
                className="inline-flex items-center gap-2 rounded-full bg-[#B8860B] px-8 py-3.5 text-sm font-bold text-white hover:bg-[#A37609] transition-all shadow-md cursor-pointer"
              >
                <span>Confirm Advisory Session Request</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )
        )}

        {/* ======================================================== */}
        {/* TAB 4: SUBJECT & STREAM MATRIX */}
        {/* ======================================================== */}
        {activeTab === 'streams' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1C2536]">
                  Higher Secondary Stream &amp; Subject Matrix
                </h2>
                <p className="text-xs text-stone-600 font-medium">Explore Class 11 stream combinations, degree opportunities, and career outlooks.</p>
              </div>

              <div className="p-3 rounded-xl border border-amber-300 bg-amber-50/90 text-xs text-amber-950 flex items-center gap-2 font-mono shrink-0 shadow-xs">
                <Target className="h-4 w-4 text-amber-700 shrink-0" />
                <div>
                  <div className="font-bold text-[0.7rem] uppercase tracking-wider text-amber-900">Active Parent Profile Filter</div>
                  <div className="text-[#1C2536] font-bold">
                    {linkState.status === 'linked' ? `${linkState.childProfile.fullName} (${linkState.childProfile.streamCode})` : `${parentProvidedGrade} • ${parentProvidedStream.split(' ')[0]}`}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PCM */}
              {(() => {
                const isMatch = linkState.status === 'linked' || parentProvidedStream.includes('PCM');
                return (
                  <div className={`p-6 rounded-2xl bg-white shadow-sm space-y-3 relative overflow-hidden transition-all ${
                    isMatch ? 'border-2 border-[#B8860B] ring-2 ring-[#B8860B]/20 bg-[#FFFDF9]' : 'border border-[#E6DCC8]'
                  }`}>
                    {isMatch && (
                      <div className="bg-[#B8860B] text-white text-[0.68rem] font-mono font-bold px-3 py-1 -mx-6 -mt-6 mb-3 flex items-center justify-between shadow-xs">
                        <span>⭐ MATCHES YOUR SELECTED PARENT TARGET: PCM FOCUS</span>
                        <span>{linkState.status === 'linked' ? linkState.childProfile.grade : parentProvidedGrade.split(' ')[0]}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <h3 className="font-serif text-lg font-bold text-[#1C2536]">
                        PCM Stream (Physics, Chem, Math)
                      </h3>
                      <span className="text-xs font-mono text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full font-semibold">
                        High Demand
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      The foundational technical stream for engineering, computer science, robotics, data science, and architecture.
                    </p>
                    <div className="font-mono text-xs text-stone-500 space-y-1 bg-[#FAF5E8] p-3 rounded-xl border border-stone-200/70">
                      <div><strong className="text-[#1C2536]">Key Entrance Exams:</strong> JEE Main, JEE Advanced, BITSAT, CUET</div>
                      <div><strong className="text-[#1C2536]">Top Degrees:</strong> B.Tech, B.E., B.Arch, Integrated M.Tech</div>
                    </div>
                  </div>
                );
              })()}

              {/* PCB */}
              {(() => {
                const isMatch = linkState.status !== 'linked' && parentProvidedStream.includes('PCB');
                return (
                  <div className={`p-6 rounded-2xl bg-white shadow-sm space-y-3 relative overflow-hidden transition-all ${
                    isMatch ? 'border-2 border-[#B8860B] ring-2 ring-[#B8860B]/20 bg-[#FFFDF9]' : 'border border-[#E6DCC8]'
                  }`}>
                    {isMatch && (
                      <div className="bg-[#B8860B] text-white text-[0.68rem] font-mono font-bold px-3 py-1 -mx-6 -mt-6 mb-3 flex items-center justify-between shadow-xs">
                        <span>⭐ MATCHES YOUR SELECTED PARENT TARGET: PCB FOCUS</span>
                        <span>{parentProvidedGrade.split(' ')[0]}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <h3 className="font-serif text-lg font-bold text-[#1C2536]">
                        PCB Stream (Physics, Chem, Biology)
                      </h3>
                      <span className="text-xs font-mono text-[#B8860B] bg-[#F4E9D0] border border-[#E5D7B7] px-2.5 py-0.5 rounded-full font-semibold">
                        Healthcare &amp; Life Sciences
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Designed for medical sciences, biotechnology, pharmacy, psychology, and biomedical research careers.
                    </p>
                    <div className="font-mono text-xs text-stone-500 space-y-1 bg-[#FAF5E8] p-3 rounded-xl border border-stone-200/70">
                      <div><strong className="text-[#1C2536]">Key Entrance Exams:</strong> NEET-UG, CUET, IISER Aptitude</div>
                      <div><strong className="text-[#1C2536]">Top Degrees:</strong> MBBS, BDS, B.Sc Biotechnology, B.Pharm</div>
                    </div>
                  </div>
                );
              })()}

              {/* Commerce */}
              {(() => {
                const isMatch = linkState.status !== 'linked' && parentProvidedStream.includes('Commerce');
                return (
                  <div className={`p-6 rounded-2xl bg-white shadow-sm space-y-3 relative overflow-hidden transition-all ${
                    isMatch ? 'border-2 border-[#B8860B] ring-2 ring-[#B8860B]/20 bg-[#FFFDF9]' : 'border border-[#E6DCC8]'
                  }`}>
                    {isMatch && (
                      <div className="bg-[#B8860B] text-white text-[0.68rem] font-mono font-bold px-3 py-1 -mx-6 -mt-6 mb-3 flex items-center justify-between shadow-xs">
                        <span>⭐ MATCHES YOUR SELECTED PARENT TARGET: COMMERCE FOCUS</span>
                        <span>{parentProvidedGrade.split(' ')[0]}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <h3 className="font-serif text-lg font-bold text-[#1C2536]">
                        Commerce Stream with Math
                      </h3>
                      <span className="text-xs font-mono text-[#B8860B] bg-[#F4E9D0] border border-[#E5D7B7] px-2.5 py-0.5 rounded-full font-semibold">
                        Finance &amp; Business
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Focuses on financial markets, business management, economics, accounting, and data analytics.
                    </p>
                    <div className="font-mono text-xs text-stone-500 space-y-1 bg-[#FAF5E8] p-3 rounded-xl border border-stone-200/70">
                      <div><strong className="text-[#1C2536]">Key Entrance Exams:</strong> IPMAT (IIM 5-yr MBA), CUET, NPAT</div>
                      <div><strong className="text-[#1C2536]">Top Degrees:</strong> B.Com (Hons), BBA, B.Sc Economics</div>
                    </div>
                  </div>
                );
              })()}

              {/* Humanities */}
              {(() => {
                const isMatch = linkState.status !== 'linked' && parentProvidedStream.includes('Arts');
                return (
                  <div className={`p-6 rounded-2xl bg-white shadow-sm space-y-3 relative overflow-hidden transition-all ${
                    isMatch ? 'border-2 border-[#B8860B] ring-2 ring-[#B8860B]/20 bg-[#FFFDF9]' : 'border border-[#E6DCC8]'
                  }`}>
                    {isMatch && (
                      <div className="bg-[#B8860B] text-white text-[0.68rem] font-mono font-bold px-3 py-1 -mx-6 -mt-6 mb-3 flex items-center justify-between shadow-xs">
                        <span>⭐ MATCHES YOUR SELECTED PARENT TARGET: ARTS &amp; DESIGN FOCUS</span>
                        <span>{parentProvidedGrade.split(' ')[0]}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <h3 className="font-serif text-lg font-bold text-[#1C2536]">
                        Humanities &amp; Social Sciences
                      </h3>
                      <span className="text-xs font-mono text-purple-800 bg-purple-100 border border-purple-300 px-2.5 py-0.5 rounded-full font-semibold">
                        Media &amp; Design
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Empowers careers in graphic UI/UX design, mass communication, psychology, law, and international relations.
                    </p>
                    <div className="font-mono text-xs text-stone-500 space-y-1 bg-[#FAF5E8] p-3 rounded-xl border border-stone-200/70">
                      <div><strong className="text-[#1C2536]">Key Entrance Exams:</strong> CLAT (Law), NID DAT, UCEED, CUET</div>
                      <div><strong className="text-[#1C2536]">Top Degrees:</strong> B.Des, BA LLB, BA Mass Communication</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Accessible Link Child Account Modal */}
        <LinkChildModal
          isOpen={showLinkModal}
          onClose={() => setShowLinkModal(false)}
          onNotification={showNotification}
        />

      </main>
    </div>
  );
}
