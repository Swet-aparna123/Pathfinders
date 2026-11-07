'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Sparkles,
  BarChart3,
  Brain,
  Target,
  Award,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  RotateCcw,
  Sliders,
  TrendingUp,
  Briefcase,
  Zap,
  CheckCircle2,
  School,
  ChevronRight,
  ShieldCheck,
  Activity,
  Lock,
  Unlock,
  LayoutDashboard,
  Map,
  Bell,
  User,
  ChevronDown,
  Menu,
  X,
  LogOut,
  AlertCircle,
  Check,
  Star,
  ClipboardList,
  HeartHandshake,
  Sun,
  Moon,
  MessageSquare,
  MessageCircle
} from 'lucide-react';
import { linkService } from '@/lib/linkService';
import { userProfileService } from '@/lib/userProfileService';
import ConfettiSparkles from '@/components/ConfettiSparkles';
import ResultsChatbot from '@/components/ResultsChatbot';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LANGUAGES } from '@/lib/i18n/languages';

// RIASEC Holland Code Types Definition
const TYPES = {
  R: { name: 'The Builder', emoji: '🛠️', sub: 'You love making, fixing, and crafting things', color: '#b8860b', lightBg: 'rgba(184, 134, 11, 0.12)', border: 'rgba(184, 134, 11, 0.3)' },
  I: { name: 'The Investigator', emoji: '🔬', sub: 'You love figuring out how things work', color: '#2b6cb0', lightBg: 'rgba(43, 108, 176, 0.12)', border: 'rgba(43, 108, 176, 0.3)' },
  A: { name: 'The Creator', emoji: '🎨', sub: 'You love making things that never existed', color: '#d946ef', lightBg: 'rgba(217, 70, 239, 0.12)', border: 'rgba(217, 70, 239, 0.3)' },
  S: { name: 'The Helper', emoji: '🤝', sub: 'You love supporting the people around you', color: '#059669', lightBg: 'rgba(5, 150, 105, 0.12)', border: 'rgba(5, 150, 105, 0.3)' },
  E: { name: 'The Leader', emoji: '🚀', sub: 'You love starting things and leading the way', color: '#ea580c', lightBg: 'rgba(234, 88, 12, 0.12)', border: 'rgba(234, 88, 12, 0.3)' },
  C: { name: 'The Organizer', emoji: '📋', sub: 'You love making order out of chaos', color: '#7c3aed', lightBg: 'rgba(124, 58, 237, 0.12)', border: 'rgba(124, 58, 237, 0.3)' },
};

// Assessment Questions (10 total)
const QUESTIONS = [
  {
    q: "A robot at the school fair stops working. What's your instinct?",
    opts: [
      { e: '🔧', t: 'Take it apart and fix the wiring', c: 'R' },
      { e: '🎨', t: 'Give it an awesome new paint job', c: 'A' },
      { e: '🧠', t: 'Figure out exactly why it broke', c: 'I' },
      { e: '📣', t: 'Gather a crowd to watch you fix it', c: 'E' },
    ],
  },
  {
    q: 'Your friend is upset because they lost a game. What do you do?',
    opts: [
      { e: '🤗', t: 'Sit with them and talk it out', c: 'S' },
      { e: '🏆', t: 'Hype them up to win next time', c: 'E' },
      { e: '🧩', t: 'Explain exactly what went wrong', c: 'I' },
      { e: '✅', t: 'Help them plan for next time', c: 'C' },
    ],
  },
  {
    q: 'You get to design your dream treehouse. What matters most?',
    opts: [
      { e: '🎨', t: "It looks like nothing you've seen", c: 'A' },
      { e: '🛠️', t: "It's built super sturdy", c: 'R' },
      { e: '📐', t: 'Every measurement is perfect', c: 'C' },
      { e: '🌳', t: "It's a hangout spot for everyone", c: 'S' },
    ],
  },
  {
    q: 'Pick a mission for the weekend!',
    opts: [
      { e: '🔬', t: 'Investigate a total mystery', c: 'I' },
      { e: '🚀', t: 'Launch a lemonade stand', c: 'E' },
      { e: '🎭', t: 'Make a show or a video', c: 'A' },
      { e: '🏕️', t: 'Build an epic fort outside', c: 'R' },
    ],
  },
  {
    q: 'Group project time! Which role do you grab?',
    opts: [
      { e: '👑', t: 'The leader who organizes everyone', c: 'E' },
      { e: '📝', t: 'The one who keeps the plan', c: 'C' },
      { e: '🎨', t: 'The one who makes it look amazing', c: 'A' },
      { e: '🔍', t: 'The one who digs up the facts', c: 'I' },
    ],
  },
  {
    q: 'A new kid joins your class. What do you do?',
    opts: [
      { e: '🤝', t: 'Go say hi and show them around', c: 'S' },
      { e: '📋', t: 'Make them a welcome guide', c: 'C' },
      { e: '🎨', t: 'Draw them a fun map of school', c: 'A' },
      { e: '🔧', t: 'Show them something cool you built', c: 'R' },
    ],
  },
  {
    q: 'Choose your superpower!',
    opts: [
      { e: '🧠', t: 'Instantly know how anything works', c: 'I' },
      { e: '💪', t: 'Build or fix absolutely anything', c: 'R' },
      { e: '🎨', t: 'Create incredible art from nothing', c: 'A' },
      { e: '📣', t: 'Convince anyone of anything', c: 'E' },
    ],
  },
  {
    q: "What's more satisfying?",
    opts: [
      { e: '✅', t: 'Crossing off a whole to-do list', c: 'C' },
      { e: '🧪', t: 'Discovering something brand new', c: 'I' },
      { e: '🎉', t: 'Throwing a party everyone loves', c: 'E' },
      { e: '🌱', t: 'Helping someone get better at something', c: 'S' },
    ],
  },
  {
    q: 'Pick your dream Saturday job (just for a day)!',
    opts: [
      { e: '🐶', t: 'Animal shelter helper', c: 'S' },
      { e: '🏗️', t: 'Building/construction site', c: 'R' },
      { e: '🎬', t: 'Making cool videos', c: 'A' },
      { e: '💼', t: 'Running a mini shop', c: 'E' },
    ],
  },
  {
    q: 'The wifi breaks at home. What do you do?',
    opts: [
      { e: '🔧', t: 'Try fixing it yourself', c: 'R' },
      { e: '📖', t: 'Look up why it happened', c: 'I' },
      { e: '👨‍👩‍👧', t: 'Solve it together as a team', c: 'S' },
      { e: '📞', t: 'Organize who should fix it', c: 'E' },
    ],
  },
];

// Sliders (5 Work & Learning Styles)
const SLIDERS = [
  { id: 'focus', left: 'Tiny details', right: 'Big picture', emojiL: '🔍', emojiR: '🌍', q: 'When you do a task, what do you notice first?' },
  { id: 'energy', left: 'Quiet & solo', right: 'Loud & social', emojiL: '🤫', emojiR: '📣', q: 'Where do you feel most like yourself?' },
  { id: 'structure', left: 'Go with flow', right: 'Love a plan', emojiL: '🌊', emojiR: '📅', q: 'How do you like your day to go?' },
  { id: 'decisions', left: 'Think it through', right: 'Follow heart', emojiL: '🧠', emojiR: '❤️', q: 'How do you make tough calls?' },
  { id: 'pace', left: 'Slow & steady', right: 'Fast & wild', emojiL: '🐢', emojiR: '🐆', q: 'What speed do you like to move at?' },
];

// Career Database based on Holland Trait Dominance (12 Curated Student Pathways - 2 per Holland Code)
const CAREER_DATABASE = {
  R: [
    { id: 'c1', title: 'Automobile Engineer', slug: 'automobile-engineer', trait: 'R', match: 96, skills: ['Vehicle Dynamics', 'EV Systems', 'CAD Design'], outlook: 'High Demand', icon: '🚗', desc: 'Design, test and improve the cars, bikes and trucks we travel in, from the engine and electronics to the safety systems.' },
    { id: 'c3', title: 'Aerospace & Space Hardware Engineer', slug: 'aerospace-space-hardware-engineer', trait: 'R', match: 88, skills: ['Space Systems', 'Avionics', 'Materials'], outlook: 'Exponential', icon: '🚀', desc: 'Assemble satellite payloads, spacecraft propulsion, and space hardware.' },
  ],
  I: [
    { id: 'c49', title: 'AI & Neural Research Scientist', slug: 'ai-neural-research-scientist', trait: 'I', match: 97, skills: ['Deep Learning', 'Neural Networks', 'Algorithmic Research'], outlook: 'Booming', icon: '🧠', desc: 'Pioneer next-generation artificial general intelligence algorithms.' },
    { id: 'c4', title: 'Astrophysicist & Space Scientist', slug: 'astrophysicist-space-scientist', trait: 'I', match: 98, skills: ['Cosmology', 'Orbital Mechanics', 'Astrophysics'], outlook: 'Visionary', icon: '🪐', desc: 'Study deep space telescope data, stellar evolution, and cosmic mechanics.' },
  ],
  A: [
    { id: 'c7', title: 'UI/UX & Interactive Architect', slug: 'ui-ux-interactive-architect', trait: 'A', match: 97, skills: ['Visual Aesthetics', 'User Journeys', 'Wireframing'], outlook: 'Booming', icon: '🎨', desc: 'Design magical digital software interfaces and intuitive user experiences.' },
    { id: 'c8', title: 'Game World & Narrative Designer', slug: 'game-world-narrative-designer', trait: 'A', match: 94, skills: ['3D Modeling', 'Storytelling', 'Level Design'], outlook: 'High Growth', icon: '🎮', desc: 'Build immersive 3D virtual worlds and write compelling gaming narratives.' },
  ],
  S: [
    { id: 'c10', title: 'EduTech & Learning Experience Mentor', slug: 'edutech-learning-mentor', trait: 'S', match: 95, skills: ['Empathy', 'Pedagogy', 'Community Building'], outlook: 'Essential', icon: '🌱', desc: 'Guide students and learners using adaptive, engaging digital learning systems.' },
    { id: 'c12', title: 'Community Health & Wellness Innovator', slug: 'community-health-innovator', trait: 'S', match: 86, skills: ['Social Impact', 'Counseling', 'Outreach'], outlook: 'High Need', icon: '💖', desc: 'Organize community wellness initiatives and accessible health platforms.' },
  ],
  E: [
    { id: 'c13', title: 'Tech Startup Founder & CEO', slug: 'tech-startup-founder-ceo', trait: 'E', match: 99, skills: ['Vision', 'Leadership', 'Product Growth'], outlook: 'High Impact', icon: '⚡', desc: 'Launch transformative tech ventures, rally teams, and scale global products.' },
    { id: 'c14', title: 'Product Expedition Lead', slug: 'product-expedition-lead', trait: 'E', match: 93, skills: ['Strategy', 'Public Speaking', 'Execution'], outlook: 'Top Tier', icon: '🏆', desc: 'Steer product roadmaps, lead cross-functional engineers, and conquer market launches.' },
  ],
  C: [
    { id: 'c16', title: 'Data Logistics & Operations Officer', slug: 'data-logistics-operations-officer', trait: 'C', match: 96, skills: ['Database Mgmt', 'Workflow Optimization', 'Precision'], outlook: 'Stable', icon: '📊', desc: 'Organize enterprise databases, optimize pipelines, and eliminate operational drag.' },
    { id: 'c18', title: 'Financial Tech & Quant Analyst', slug: 'financial-tech-quant-analyst', trait: 'C', match: 86, skills: ['Budgeting', 'Risk Analysis', 'Analytics'], outlook: 'Growing', icon: '📈', desc: 'Analyze markets, build automated financial models, and optimize capital efficiency.' },
  ],
};

export default function StudentDashboardComponent() {
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const fullName = userProfile.fullName || [userProfile.firstName, userProfile.middleName, userProfile.lastName].filter(Boolean).join(' ') || 'Vani Sharma';

  const getEducationDisplay = (profile) => {
    if (!profile) return 'Class 11–12 • PCM Stream';
    
    const rawLevel = (profile.educationLevel || profile.educationStage || '').toString().trim();
    
    let subjectsStr = '';
    if (Array.isArray(profile.favoriteSubjects) && profile.favoriteSubjects.length > 0) {
      subjectsStr = profile.favoriteSubjects.join(', ');
    } else if (typeof profile.favoriteSubjects === 'string' && profile.favoriteSubjects.trim()) {
      subjectsStr = profile.favoriteSubjects.trim();
    }

    const stream = profile.academicStream || profile.stream || '';
    const degree = profile.degree || '';
    const major = profile.branchMajor || profile.major || '';

    const lowerLvl = rawLevel.toLowerCase();

    if (lowerLvl === 'junior' || lowerLvl.includes('class 8') || lowerLvl.includes('class 6') || lowerLvl.includes('class 7') || lowerLvl.includes('class 9') || lowerLvl.includes('class 10') || lowerLvl.includes('middle')) {
      const stageName = 'Class 8–10';
      return subjectsStr ? `${stageName} • ${subjectsStr}` : stageName;
    }

    if (lowerLvl === 'highschool' || lowerLvl.includes('class 11') || lowerLvl.includes('class 12') || lowerLvl.includes('high school')) {
      const stageName = 'Class 11–12';
      const streamText = stream ? (stream.toLowerCase().includes('stream') ? stream : `${stream} Stream`) : (subjectsStr || 'PCM Stream');
      return `${stageName} • ${streamText}`;
    }

    if (lowerLvl === 'undergraduate' || lowerLvl.includes('undergrad') || lowerLvl.includes('bachelor') || lowerLvl.includes('college')) {
      if (degree || major) {
        return `${degree || 'Undergraduate'}${major ? ` • ${major}` : ''}`;
      }
      return 'Undergraduate';
    }

    if (lowerLvl === 'postgraduate' || lowerLvl.includes('postgrad') || lowerLvl.includes('master')) {
      if (degree || major) {
        return `${degree || 'Postgraduate'}${major ? ` • ${major}` : ''}`;
      }
      return 'Postgraduate';
    }

    if (rawLevel) {
      if (subjectsStr) return `${rawLevel} • ${subjectsStr}`;
      if (stream) return `${rawLevel} • ${stream}`;
      return rawLevel;
    }

    return 'Class 11–12 • PCM Stream';
  };

  const educationStageDisplay = getEducationDisplay(userProfile);

  const getInitials = (nameStr) => {
    if (!nameStr) return 'AS';
    const parts = nameStr.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return nameStr.substring(0, 2).toUpperCase();
  };

  // Assessment state: initialized clean, then restored for the specific active user on client
  const [stage, setStage] = useState('question');
  const [qIndex, setQIndex] = useState(0);
  const [sIndex, setSIndex] = useState(0);

  // Safe clamped question and slider indices (always 0..9 and 0..4)
  const safeQIndex = Math.min(QUESTIONS.length - 1, Math.max(0, qIndex));
  const safeSIndex = Math.min(SLIDERS.length - 1, Math.max(0, sIndex));

  // Pick counts per Holland category
  const [answers, setAnswers] = useState({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });

  // Slider values (0 to 100)
  const [sliderAnswers, setSliderAnswers] = useState({
    focus: 50,
    energy: 50,
    structure: 50,
    decisions: 50,
    pace: 50,
  });

  // Selected option history
  const [selectedHistory, setSelectedHistory] = useState([]);

  // Restore assessment state strictly for the logged-in user
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const uid = userProfileService.getActiveUserId();
    const userAssessmentKey = `pathfinders_student_assessment_${uid}`;

    try {
      let raw = localStorage.getItem(userAssessmentKey);
      if (!raw) {
        // Fallback only if this is an existing legacy session with valid matching answers
        const legacyRaw = localStorage.getItem('pathfinders_student_assessment');
        const profile = userProfileService.getProfile();
        if (legacyRaw && (profile?.assessmentCompleted || (profile?.assessmentAnswers && Object.keys(profile.assessmentAnswers).length > 0))) {
          raw = legacyRaw;
        }
      }

      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.stage) setStage(parsed.stage);
        if (typeof parsed?.qIndex === 'number' && parsed.qIndex >= 0 && parsed.qIndex < QUESTIONS.length) {
          setQIndex(parsed.qIndex);
        }
        if (typeof parsed?.sIndex === 'number' && parsed.sIndex >= 0 && parsed.sIndex < SLIDERS.length) {
          setSIndex(parsed.sIndex);
        }
        if (parsed?.answers) setAnswers(parsed.answers);
        if (parsed?.sliderAnswers) setSliderAnswers(parsed.sliderAnswers);
        if (Array.isArray(parsed?.selectedHistory)) setSelectedHistory(parsed.selectedHistory);
      } else {
        // Fresh user: guarantee clean state
        setStage('question');
        setQIndex(0);
        setSIndex(0);
        setAnswers({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
        setSliderAnswers({ focus: 50, energy: 50, structure: 50, decisions: 50, pace: 50 });
        setSelectedHistory([]);
      }
    } catch (e) {
      console.warn('Failed restoring user assessment state:', e);
    }
  }, [userProfile?.id]);

  // Sparkles trigger state
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  // Active tab on Analytical Board
  const [analyticalTab, setAnalyticalTab] = useState('traits'); // 'traits' | 'style'

  // Selected Career state
  const [selectedCareer, setSelectedCareer] = useState(null);

  // Active Navigation View: 'dashboard' | 'assessment' | 'careers' | 'roadmap'
  const [activeNav, setActiveNav] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        if (tab && ['dashboard', 'assessment', 'careers', 'roadmap'].includes(tab)) {
          return tab;
        }
      } catch (e) {}
    }
    return 'assessment';
  });

  // In-place expanded view toggle on assessment results
  const [showAllInResults, setShowAllInResults] = useState(false);

  // Sync tab with browser URL history and listen for Back/Forward navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = (event) => {
      try {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab') || event.state?.tab || 'assessment';
        if (['dashboard', 'assessment', 'careers', 'roadmap'].includes(tab)) {
          setActiveNav(tab);
        }
      } catch (e) {}
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Menus & Toast state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [topAvatarMenuOpen, setTopAvatarMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Parent linking state synced with linkService
  const [linkState, setLinkState] = useState(() => {
    try {
      return (typeof linkService !== 'undefined' && linkService?.getState)
        ? (linkService.getState() || { status: 'not_linked' })
        : { status: 'not_linked' };
    } catch (e) {
      return { status: 'not_linked' };
    }
  });

  useEffect(() => {
    try {
      if (typeof linkService !== 'undefined' && linkService?.subscribe) {
        const unsub = linkService.subscribe((state) => {
          setLinkState(state || { status: 'not_linked' });
        });
        return () => unsub && unsub();
      }
    } catch (e) {
      console.warn('Failed subscribing to linkService:', e);
    }
  }, []);

  // Analyzing transition state for smooth quiz completion to chatbot
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Settings & Profile Modals state
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [cardModalCareer, setCardModalCareer] = useState(null);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('profile');
  const [activeRoleSettings, setActiveRoleSettings] = useState('student');
  const [parentPrivacyLevel, setParentPrivacyLevel] = useState('summary');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [digestFreq, setDigestFreq] = useState('weekly');
  const [fontSize, setFontSize] = useState('standard');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [counselorStyle, setCounselorStyle] = useState('Empathetic');
  const [soundEffects, setSoundEffects] = useState(true);
  const [chatbotModalOpen, setChatbotModalOpen] = useState(false);

  // Light / Dark Theme state
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('pathfinders_theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  const toggleTheme = (newTheme) => {
    const target = newTheme || (theme === 'dark' ? 'light' : 'dark');
    setTheme(target);
    localStorage.setItem('pathfinders_theme', target);
    showToast(`Switched to ${target === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}`);
  };

  const isDark = theme === 'dark';

  // Calculation of Holland RIASEC traits stats
  const traitStats = useMemo(() => {
    const totalAnswered = selectedHistory.length;

    if (totalAnswered === 0) {
      const sorted = Object.entries(TYPES).map(([cat, info]) => ({
        cat,
        count: 0,
        pct: 0,
        ...info,
      }));

      return {
        isStarted: false,
        sorted,
        dominant: {
          cat: 'NONE',
          name: 'Pending',
          emoji: '🧭',
          sub: 'Pick an option on the left to see this fill in, live.',
          pct: 0,
        },
        secondary: null,
        totalAnswered: 0,
      };
    }

    const sorted = Object.entries(answers).map(([cat, count]) => {
      const pct = Math.round((count / totalAnswered) * 100);
      return { cat, count, pct, ...TYPES[cat] };
    }).sort((a, b) => b.count - a.count || b.pct - a.pct);

    const dominant = sorted[0];
    const secondary = sorted[1];
    return { isStarted: true, sorted, dominant, secondary, totalAnswered };
  }, [answers, selectedHistory]);

  // Chatbot completion & discussion keywords state
  const [chatbotSessionCompleted, setChatbotSessionCompleted] = useState(
  () => Boolean(userProfile?.chatbotCompleted)
);
  const [chatbotKeywords, setChatbotKeywords] = useState(() => userProfile?.chatbotKeywords || []);

  // All 12 careers synthesized across: Assessment (Holland Code), Rapid Fire (Cognitive Reflexes), and Chatbot
  const allScoredCareers = useMemo(() => {
    const allCareers = Object.values(CAREER_DATABASE).flat();

    if (!traitStats?.isStarted) {
      return allCareers;
    }

    const dominantCat = traitStats?.dominant?.cat || 'I';
    const secondaryCat = traitStats?.secondary?.cat || dominantCat;

    // Rapid Fire signals
    const rf = userProfile?.rapidFireResult;
    const rfTrait = rf?.primaryTrait || rf?.dominantCode || '';
    const rfReflex = (rf?.reflexType || '').toLowerCase();

    // Chatbot signals
    const activeKeywords = [
      ...(userProfile?.chatbotKeywords || []),
      ...chatbotKeywords,
      ...(userProfile?.targetGoal ? [userProfile.targetGoal.toLowerCase()] : []),
    ];

    // Score each of the 12 pathways
    const scored = allCareers.map((career) => {
      let score = 50; // base calibration

      // 1. RIASEC Assessment Contribution (up to +35%)
      const traitMatch = traitStats?.sorted?.find((t) => t.cat === career.trait);
      const traitPct = traitMatch?.pct || 0;
      if (career.trait === dominantCat) {
        score += 25 + Math.round((traitPct / 100) * 10);
      } else if (career.trait === secondaryCat) {
        score += 15 + Math.round((traitPct / 100) * 8);
      } else {
        score += Math.round((traitPct / 100) * 10);
      }

      // 2. Rapid Fire Contribution (up to +20%)
      if (rfTrait && rfTrait === career.trait) {
        score += 12;
      }
      if (rfReflex) {
        if ((career.trait === 'I' && (rfReflex.includes('analyt') || rfReflex.includes('investig'))) ||
            (career.trait === 'R' && (rfReflex.includes('build') || rfReflex.includes('pragmat') || rfReflex.includes('action'))) ||
            (career.trait === 'A' && (rfReflex.includes('creati') || rfReflex.includes('intuit') || rfReflex.includes('express'))) ||
            (career.trait === 'E' && (rfReflex.includes('strateg') || rfReflex.includes('lead') || rfReflex.includes('vision'))) ||
            (career.trait === 'S' && (rfReflex.includes('peopl') || rfReflex.includes('empath') || rfReflex.includes('mentor'))) ||
            (career.trait === 'C' && (rfReflex.includes('organ') || rfReflex.includes('struct') || rfReflex.includes('system')))) {
          score += 8;
        }
      }

      // 3. Chatbot Discussion Contribution (up to +20%)
      if (activeKeywords.length > 0) {
        const textToMatch = `${career.title} ${career.desc} ${career.skills.join(' ')}`.toLowerCase();
        let kwHits = 0;
        activeKeywords.forEach((kw) => {
          if (kw && textToMatch.includes(kw.toLowerCase())) {
            kwHits++;
          }
        });
        score += Math.min(18, kwHits * 6);
      }

      // Normalize match percentage between 82% and 99%
      const matchPct = Math.min(99, Math.max(82, score));

      return {
        ...career,
        match: matchPct,
        matchReason: `Calibrated from Assessment (${traitStats?.dominant?.name || 'RIASEC'}), Rapid Fire (${rf?.reflexType || 'Reflexes'}), & Counsellor Chat.`
      };
    });

    // Sort descending by calculated match score
    scored.sort((a, b) => b.match - a.match);

    return scored;
  }, [traitStats, userProfile, chatbotKeywords]);

  const recommendedCareers = useMemo(() => {
    return allScoredCareers.slice(0, 3);
  }, [allScoredCareers]);

  // Total assessment steps
  const totalSteps = QUESTIONS.length + SLIDERS.length;
  const currentStep = stage === 'question' ? safeQIndex + 1 : stage === 'slider' ? QUESTIONS.length + safeSIndex + 1 : totalSteps;
  const progressPct = stage === 'results'
    ? 100
    : selectedHistory.length === 0
    ? 0
    : Math.min(100, Math.round((selectedHistory.length / totalSteps) * 100));

  // Lock logic: Academic Background -> Rapid Fire -> Detailed Assessment -> Chatbot -> Careers -> Roadmap
  const isAcademicCompleted = Boolean(
    userProfile?.academicCompleted ||
    (userProfile?.educationLevel && (userProfile?.schoolName || userProfile?.collegeName || userProfile?.age || userProfile?.academicStream || userProfile?.degree))
  );
  const isRapidFireCompleted = Boolean(userProfile?.rapidFireCompleted && userProfile?.rapidFireResult);
  const isAssessmentUnlocked = isAcademicCompleted && isRapidFireCompleted;
  const isAssessmentCompleted = stage === 'results' && selectedHistory.length >= QUESTIONS.length && Boolean(traitStats?.isStarted);
  const isChatbotCompleted = Boolean(chatbotSessionCompleted || userProfile?.chatbotCompleted);
  // The user can ONLY access Careers AFTER the Chatbot consultation is completed!
  const isCareersUnlocked = isAssessmentCompleted && isRapidFireCompleted && isChatbotCompleted;
  const isRoadmapUnlocked = Boolean(selectedCareer) && isCareersUnlocked;

  // Handler to unlock Career Matches after Chatbot consultation
  const handleUnlockCareerMatches = (chatData = {}) => {
    setChatbotSessionCompleted(true);
    if (chatData?.keywords) {
      setChatbotKeywords(chatData.keywords);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('pathfinders_chatbot_completed', 'true');
    }
    userProfileService.saveChatbotResult(chatData);
    showToast('🎉 Career Matches UNLOCKED! Calibrated across Assessment, Rapid Fire, and your Counsellor chat.');
    handleNavClick('careers');
  };

  // Toast handler
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Nav click handler with lock checks and browser history push
  const handleNavClick = (navKey, skipHistory = false) => {
    if (navKey === 'assessment' && !isAssessmentUnlocked) {
      if (!isAcademicCompleted) {
        showToast('🔒 Detailed Assessment is LOCKED! Complete your Academic Background first.');
      } else {
        showToast('🔒 Detailed Assessment is LOCKED! Complete the Rapid Fire Challenge first.');
      }
      return;
    }
    if (navKey === 'careers' && !isCareersUnlocked) {
      if (!isAcademicCompleted) {
        showToast('🔒 Careers are LOCKED! Complete Academic Background first.');
      } else if (!isRapidFireCompleted) {
        showToast('🔒 Careers are LOCKED! Complete Rapid Fire first.');
      } else if (!isAssessmentCompleted) {
        showToast('🔒 Careers are LOCKED! Complete the Detailed Assessment first.');
      } else if (!isChatbotCompleted) {
        showToast('💬 Careers are LOCKED! Talk with your AI Counsellor below to calibrate your matches.');
      }
      return;
    }
    if (navKey === 'roadmap' && !isRoadmapUnlocked) {
      if (!isCareersUnlocked) {
        showToast('🔒 Roadmap is LOCKED! Complete assessment & choose a career first.');
      } else {
        showToast('🔒 Roadmap is LOCKED! Select a career in the Careers tab to unlock your roadmap.');
      }
      return;
    }
    setActiveNav(navKey);
    setMobileSidebarOpen(false);

    if (typeof window !== 'undefined' && !skipHistory) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('tab', navKey);
        window.history.pushState({ tab: navKey }, '', url.toString());
      } catch (e) {}
    }
  };

  // Sync assessment state to localStorage under user-scoped key
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const uid = userProfileService.getActiveUserId();
      const userKey = `pathfinders_student_assessment_${uid}`;
      const payload = {
        answers,
        sliderAnswers,
        selectedHistory,
        stage,
        qIndex: safeQIndex,
        sIndex: safeSIndex,
        traitStats,
      };
      localStorage.setItem(userKey, JSON.stringify(payload));
      localStorage.setItem('pathfinders_student_assessment', JSON.stringify(payload));
    } catch {
      // ignore storage errors
    }
  }, [answers, sliderAnswers, selectedHistory, stage, safeQIndex, safeSIndex, traitStats, userProfile?.id]);

  // Option pick handler with replacement support for re-answering
  const handlePickOption = (categoryCode, optIdx) => {
    const existingIndex = selectedHistory.findIndex((h) => h.qIndex === safeQIndex);

    setAnswers((prev) => {
      const next = { ...prev };
      if (existingIndex !== -1) {
        const oldCode = selectedHistory[existingIndex].categoryCode;
        next[oldCode] = Math.max(0, (next[oldCode] || 1) - 1);
      }
      next[categoryCode] = (next[categoryCode] || 0) + 1;
      return next;
    });

    setSelectedHistory((prev) => {
      if (existingIndex !== -1) {
        const next = [...prev];
        next[existingIndex] = { qIndex: safeQIndex, categoryCode, optIdx };
        return next;
      }
      return [...prev, { qIndex: safeQIndex, categoryCode, optIdx }];
    });

    setConfettiTrigger((prev) => prev + 1);

    if (safeQIndex + 1 < QUESTIONS.length) {
      setQIndex(safeQIndex + 1);
    } else {
      setStage('slider');
    }
  };

  // Slider change handler
  const handleSliderChange = (id, val) => {
    setSliderAnswers((prev) => ({ ...prev, [id]: Number(val) }));
  };

  // Slider next handler
  const handleNextSlider = () => {
    if (safeSIndex + 1 < SLIDERS.length) {
      setConfettiTrigger((prev) => prev + 1);
      setSIndex(safeSIndex + 1);
    } else {
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setStage('results');
        setConfettiTrigger((prev) => prev + 1);
        userProfileService.saveProfile({
          assessmentCompleted: true,
          assessmentAnswers: answers
        });
        showToast('🎉 Assessment completed! Welcome to your AI Career Counsellor.');
      }, 850);
    }
  };

  // Go back handler
  const handleGoBack = () => {
    if (stage === 'slider') {
      if (safeSIndex > 0) {
        setSIndex(safeSIndex - 1);
      } else {
        setStage('question');
        setQIndex(QUESTIONS.length - 1);
      }
    } else if (stage === 'question' && safeQIndex > 0) {
      setQIndex(safeQIndex - 1);
    }
  };

  // Reset quiz handler
  const handleReset = () => {
    setStage('question');
    setQIndex(0);
    setSIndex(0);
    setAnswers({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
    setSliderAnswers({ focus: 50, energy: 50, structure: 50, decisions: 50, pace: 50 });
    setSelectedHistory([]);
    setSelectedCareer(null);
    setChatbotSessionCompleted(false);
    if (typeof window !== 'undefined') {
      try {
        const uid = userProfileService.getActiveUserId();
        localStorage.removeItem(`pathfinders_student_assessment_${uid}`);
        localStorage.removeItem('pathfinders_student_assessment');
        localStorage.removeItem(`pathfinders_chatbot_completed_${uid}`);
        localStorage.removeItem('pathfinders_chatbot_completed');
      } catch (e) {}
    }
    userProfileService.saveProfile({
      assessmentCompleted: false,
      assessmentAnswers: {},
      chatbotCompleted: false,
      chatbotResult: null,
      chatbotKeywords: []
    });
    showToast('Assessment reset. Starting fresh!');
  };

  // Quick complete assessment (instant test helper for chatbot)
  const handleQuickCompleteAssessment = () => {
    setAnswers({ E: 4, I: 3, R: 1, A: 1, S: 1, C: 0 });
    setSliderAnswers({ focus: 65, energy: 60, structure: 50, decisions: 55, pace: 60 });
    setSelectedHistory(Array(10).fill({ qIndex: 0, categoryCode: 'E', optIdx: 0 }));
    setStage('results');
    setConfettiTrigger((prev) => prev + 1);
    showToast('🎉 Assessment completed! You can now talk through your results.');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0A0F1D] flex items-center justify-center font-body text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 rounded-full border-2 border-[#D4A034] border-t-transparent animate-spin" />
          <span className="font-mono text-xs text-[#D4A034] tracking-wider uppercase font-semibold">
            Loading Student Dashboard...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-body flex flex-col lg:flex-row relative overflow-x-hidden transition-colors duration-300 ${isDark ? 'bg-[#0A0F1D] text-slate-100' : 'bg-[#f3ead3] text-[#1C2536]'}`}>
      <ConfettiSparkles trigger={confettiTrigger} />

      {/* TOAST ALERTS */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[100] max-w-md rounded-xl border border-[#C5922E] bg-[#101B2E] p-4 shadow-2xl text-xs font-semibold text-white flex items-center gap-3 backdrop-blur-xl"
          >
            <AlertCircle className="h-5 w-5 text-[#D4A034] shrink-0 animate-pulse" />
            <span className="flex-1 leading-relaxed">{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white text-sm">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE TOP BAR (lg:hidden) */}
      <div className="lg:hidden sticky top-0 z-50 bg-[#101B2E] border-b border-slate-800 px-4 py-3 flex items-center justify-between backdrop-blur-md text-white">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-lg border border-slate-700 text-white hover:bg-slate-800"
            aria-label="Open Sidebar Menu"
          >
            <Menu className="h-5 w-5 text-[#D4A034]" />
          </button>
          <span className="font-serif font-bold text-white flex items-center gap-2 text-base">
            <span className="h-6 w-6 rounded-full bg-[#C5922E]/20 border border-[#C5922E] flex items-center justify-center text-xs text-[#D4A034]">🧭</span>
            <span>PathFinders</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher compact={true} />
          <button
            type="button"
            onClick={() => toggleTheme()}
            className="p-1.5 rounded-lg border border-slate-700 text-[#D4A034] hover:bg-slate-800 cursor-pointer"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Theme`}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {process.env.NODE_ENV !== 'production' && stage !== 'results' && (
            <button
              type="button"
              onClick={handleQuickCompleteAssessment}
              className="text-[0.7rem] font-mono font-bold bg-[#D4A034]/20 border border-[#D4A034] text-[#D4A034] px-2 py-1 rounded-full hover:bg-[#D4A034] hover:text-slate-950 transition-all cursor-pointer"
              title="One-click finish assessment to test chatbot"
            >
              ⚡ Test: Finish
            </button>
          )}
          <span suppressHydrationWarning className="text-xs font-mono text-[#D4A034] font-bold bg-[#C5922E]/10 border border-[#C5922E]/30 px-2.5 py-1 rounded-full">
            {stage === 'results' ? 'Done' : `Q ${safeQIndex + 1}/10`}
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
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* LEFT SIDEBAR NAVBAR (Exact Screenshot Aesthetic) */}
      {/* ======================================================== */}
      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-64 lg:w-72 bg-[#101B2E] border-r border-slate-800 p-3.5 sm:p-4 flex flex-col justify-between overflow-y-auto overflow-x-hidden transition-transform duration-300 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} shadow-2xl text-white`}>
        
        <div>
          {/* Logo Header */}
          <div className="pb-3 mb-2 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C5922E] bg-[#C5922E]/10 shadow-[0_0_12px_rgba(197,146,46,0.25)]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2 L9.6 7.6 L8 14 L6.4 7.6 Z" fill="#D4A034" />
                </svg>
              </span>
              <div>
                <span className="font-serif font-bold text-base text-white group-hover:text-[#D4A034] transition-colors tracking-wide">PathFinders</span>
                <span className="block text-[0.58rem] font-mono text-slate-400 uppercase tracking-widest">STUDENT DASHBOARD</span>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => toggleTheme()}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-700 text-[#D4A034] hover:bg-slate-800 hover:border-[#D4A034] transition-all cursor-pointer shadow-sm flex items-center justify-center shrink-0"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Theme`}
            >
              {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 font-body">
            
            {/* Dashboard */}
            <button
              type="button"
              onClick={() => handleNavClick('dashboard')}
              className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                activeNav === 'dashboard'
                  ? 'bg-[#1C273C] text-white border border-[#D4A034]/40 shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4A034]/15 border border-[#D4A034]/30 text-[#D4A034] shrink-0 shadow-sm">
                <LayoutDashboard className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-sm block text-white">Dashboard</span>
                <span className="text-[0.65rem] text-slate-400 font-mono block">Overview &amp; Stats</span>
              </div>
            </button>

            {/* Rapid Fire (Waypoint 03) */}
            <Link
              href="/rapid-fire"
              className={`w-full flex flex-col gap-1 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                !isRapidFireCompleted
                  ? 'bg-amber-950/30 border border-amber-500/40 text-amber-200 hover:bg-amber-950/45 shadow-sm ring-1 ring-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    isRapidFireCompleted
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                      : 'bg-[#D4A034]/20 border border-[#D4A034]/40 text-[#D4A034] animate-pulse'
                  } shrink-0 shadow-sm`}>
                    <Zap className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-sm block text-white">Rapid Fire</span>
                    <span className="text-[0.65rem] text-slate-400 font-mono block truncate">
                      {isRapidFireCompleted ? '10 Scenarios Done ✓' : 'Action Required (Wp 03)'}
                    </span>
                  </div>
                </div>
                <span className={`text-[0.65rem] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap ${
                  isRapidFireCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-[#D4A034]/20 text-[#D4A034] border border-[#D4A034]/40'
                }`}>
                  {isRapidFireCompleted ? 'Mapped' : 'Start'}
                </span>
              </div>
            </Link>

            {/* Assessment (Waypoint 04) */}
            <button
              type="button"
              onClick={() => handleNavClick('assessment')}
              className={`w-full flex flex-col gap-1 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                !isAssessmentUnlocked
                  ? 'text-slate-400 bg-slate-900/40 border border-slate-800 hover:bg-slate-900/60'
                  : activeNav === 'assessment'
                  ? 'bg-[#1C273C] text-white border border-[#D4A034]/40 shadow-lg relative overflow-hidden'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    !isAssessmentUnlocked
                      ? 'bg-slate-800 border border-slate-700 text-slate-400'
                      : 'bg-[#D4A034]/15 border border-[#D4A034]/30 text-[#D4A034]'
                  } shrink-0 shadow-sm`}>
                    {!isAssessmentUnlocked ? <Lock className="h-4 w-4 text-slate-400" /> : <ClipboardList className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0">
                    <span className={`font-bold text-sm block ${!isAssessmentUnlocked ? 'text-slate-400' : 'text-[#D4A034]'}`}>
                      Assessment
                    </span>
                    <span suppressHydrationWarning className="text-[0.65rem] text-slate-400 font-mono block truncate">
                      {!isAssessmentUnlocked
                        ? (!isAcademicCompleted ? 'Locked (Academics)' : 'Locked (Rapid Fire)')
                        : stage === 'question' ? `Q ${qIndex + 1}/10` : stage === 'slider' ? `Style ${sIndex + 1}/5` : 'Completed 🎉'}
                    </span>
                  </div>
                </div>

                {!isAssessmentUnlocked ? (
                  <span className="text-[0.62rem] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded-full flex items-center gap-1 shrink-0 whitespace-nowrap">
                    <Lock className="h-2.5 w-2.5" /> Locked
                  </span>
                ) : (
                  <span className="text-[0.65rem] font-mono font-bold bg-[#D4A034]/20 border border-[#D4A034]/40 text-[#D4A034] px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                    {stage === 'results' ? '100%' : `${progressPct}%`}
                  </span>
                )}
              </div>

              {/* Progress Line */}
              {isAssessmentUnlocked && (
                <div className="mt-1 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D4A034] rounded-full transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              )}
            </button>

            {/* Careers (Clean 🔒 Lock Cue) */}
            <button
              type="button"
              onClick={() => handleNavClick('careers')}
              className={`w-full flex flex-col gap-1 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                !isCareersUnlocked
                  ? 'text-slate-400 bg-amber-950/20 border border-amber-500/30 hover:bg-amber-950/30'
                  : activeNav === 'careers'
                  ? 'bg-[#1C273C] text-white border border-[#D4A034]/40 shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    isCareersUnlocked 
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' 
                      : 'bg-amber-500/15 border border-amber-500/30 text-amber-400/80'
                  } shrink-0 shadow-sm`}>
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-sm text-white block">
                      Careers
                    </span>
                    <span className="text-[0.68rem] text-slate-400 font-mono block whitespace-nowrap">
                      {isCareersUnlocked ? `${Object.values(CAREER_DATABASE).flat().length} Pathways` : 'Locked'}
                    </span>
                  </div>
                </div>

                {!isCareersUnlocked ? (
                  <span className="text-[0.65rem] font-mono font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                    LOCKED
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[0.65rem] font-mono font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/40 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                    <Unlock className="h-2.5 w-2.5 text-emerald-400" /> UNLOCKED
                  </span>
                )}
              </div>

              {!isCareersUnlocked ? (
                <div className="mt-0.5 flex items-center gap-1 text-[0.65rem] text-amber-300/90 font-medium bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                  <Lock className="h-3 w-3 text-amber-400 shrink-0" />
                  <span className="truncate">
                    {!isAssessmentCompleted
                      ? 'Complete assessment to unlock'
                      : !isChatbotCompleted
                      ? 'Chat with Counsellor to unlock'
                      : 'Complete previous steps'}
                  </span>
                </div>
              ) : (
                <span className="text-[0.65rem] text-emerald-300/80 font-mono pl-10.5 block truncate">
                  Explore matched pathways
                </span>
              )}
            </button>

            {/* Roadmap (Clean 🔒 Lock Cue) */}
            <button
              type="button"
              onClick={() => handleNavClick('roadmap')}
              className={`w-full flex flex-col gap-1 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                !isRoadmapUnlocked
                  ? 'text-slate-400 bg-amber-950/20 border border-amber-500/30 hover:bg-amber-950/30'
                  : activeNav === 'roadmap'
                  ? 'bg-[#1C273C] text-white border border-[#D4A034]/40 shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    isRoadmapUnlocked 
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' 
                      : 'bg-amber-500/15 border border-amber-500/30 text-amber-400/80'
                  } shrink-0 shadow-sm`}>
                    <Map className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-sm text-white block">
                      Roadmap
                    </span>
                    <span className="text-[0.68rem] text-slate-400 font-mono block whitespace-nowrap">
                      {isRoadmapUnlocked ? 'Custom Plan' : 'Locked'}
                    </span>
                  </div>
                </div>

                {!isRoadmapUnlocked ? (
                  <span className="text-[0.65rem] font-mono font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                    LOCKED
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[0.65rem] font-mono font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/40 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                    <Unlock className="h-2.5 w-2.5 text-emerald-400" /> ACTIVE
                  </span>
                )}
              </div>

              {!isRoadmapUnlocked ? (
                <div className="mt-0.5 flex items-center gap-1 text-[0.65rem] text-amber-300/90 font-medium bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                  <Lock className="h-3 w-3 text-amber-400 shrink-0" />
                  <span className="truncate">Choose a career to unlock</span>
                </div>
              ) : (
                <span className="text-[0.65rem] text-emerald-300/80 font-mono pl-10.5 block truncate">
                  {selectedCareer?.title || 'Active route'}
                </span>
              )}
            </button>

          </nav>
        </div>

        {/* Footer: Notifications & User Profile */}
        <div className="pt-2.5 border-t border-slate-800 space-y-1.5 relative">
          
          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setNotificationsOpen(!notificationsOpen); setAvatarMenuOpen(false); }}
              className="w-full flex items-center justify-between p-2 px-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900/60 transition-all text-xs font-semibold"
            >
              <span>Notifications</span>
              <span className="h-4.5 w-4.5 rounded-full bg-[#E11D48] text-white font-mono text-[0.65rem] font-bold flex items-center justify-center shadow">
                2
              </span>
            </button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-12 left-0 right-0 z-50 rounded-xl border border-slate-700 bg-[#101B2E] p-3 shadow-2xl space-y-2 text-xs text-white backdrop-blur-xl"
                >
                  <div className="font-mono text-[0.65rem] text-[#D4A034] font-bold uppercase tracking-wider border-b border-slate-800 pb-1.5 flex justify-between">
                    <span>Notifications</span>
                    <button onClick={() => setNotificationsOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                  </div>
                  {linkState?.status === 'pending' && (
                    <div className="p-3 rounded-xl border border-[#D4A034]/60 bg-[#C5922E]/15 text-slate-100 space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#D4A034] flex items-center gap-1.5">
                          <HeartHandshake className="h-4 w-4 text-[#D4A034]" />
                          Parent Link Request
                        </span>
                        <span className="text-[0.65rem] bg-[#D4A034]/20 border border-[#D4A034]/40 text-[#D4A034] px-1.5 py-0.5 rounded font-bold">
                          Pending
                        </span>
                      </div>
                      <p className="text-[0.72rem] text-white leading-snug font-body">
                        <strong>{linkState?.parentName || 'Sarah Morgan'}</strong> wants to link as your parent.
                      </p>

                      <div className="space-y-1 pt-1 border-t border-[#D4A034]/20 text-[0.7rem]">
                        <label className="block text-slate-300 font-semibold">Choose Sharing Level:</label>
                        <select
                          value={linkState?.sharingLevel || 'summary_only'}
                          onChange={(e) => linkService.updateSharingLevel(e.target.value)}
                          className="w-full rounded bg-slate-950 border border-slate-700 p-1 text-[#D4A034] font-mono text-[0.7rem] font-bold"
                        >
                          <option value="summary_only">Summary only (Default)</option>
                          <option value="full_results">Full results (Detailed traits &amp; matches)</option>
                        </select>
                        <span className="text-[0.65rem] text-slate-400 block italic">
                          🔒 Raw answers &amp; AI transcripts are NEVER shared.
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={async () => {
                            await linkService.approveLinkRequest(linkState?.sharingLevel || 'summary_only');
                            showToast('🎉 Parent link approved!');
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[0.72rem] text-center cursor-pointer shadow-xs"
                        >
                          Approve Link
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await linkService.declineLinkRequest();
                            showToast('ℹ️ Parent link request declined.');
                          }}
                          className="py-1.5 px-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 text-[0.72rem] text-center cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setNotificationsOpen(false);
                          setSettingsModalOpen(true);
                          setSettingsTab('privacy');
                        }}
                        className="block text-[0.68rem] text-[#D4A034] underline pt-1 text-center w-full font-bold hover:text-white"
                      >
                        Settings → Privacy &amp; Sharing
                      </button>
                    </div>
                  )}

                  <div className="p-2 rounded bg-slate-900/80 text-slate-300 space-y-0.5 text-[0.72rem]">
                    <span className="font-bold text-white block">Assessment Started</span>
                    <span>Question 1 of 10 in progress.</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900/80 text-slate-300 space-y-0.5 text-[0.72rem]">
                    <span className="font-bold text-white block">Career Unlock</span>
                    <span>Finish 10 questions to unlock matches.</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setAvatarMenuOpen(!avatarMenuOpen); setNotificationsOpen(false); }}
              className="w-full flex items-center justify-between p-2 px-2.5 rounded-xl text-left bg-slate-900/60 border border-slate-700/80 hover:border-[#D4A034] hover:bg-slate-900 transition-all cursor-pointer shadow-xs group overflow-hidden"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1 mr-1">
                <span className="h-7 w-7 rounded-full bg-slate-800 text-[#D4A034] font-bold flex items-center justify-center text-xs border border-slate-700 group-hover:border-[#D4A034] overflow-hidden shrink-0 uppercase">
                  {userProfile.avatarUrl ? (
                    <img src={userProfile.avatarUrl} alt={fullName} className="h-full w-full object-cover" />
                  ) : (
                    getInitials(fullName)
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-xs text-white block leading-none truncate" title={fullName}>{fullName}</span>
                  <span className="text-[0.65rem] text-slate-400 block mt-1 font-mono truncate" title={educationStageDisplay}>{educationStageDisplay}</span>
                </div>
              </div>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-400 group-hover:text-[#D4A034] transition-transform duration-200 shrink-0 ${avatarMenuOpen ? 'rotate-180 text-[#D4A034]' : ''}`} />
            </button>

            <AnimatePresence>
              {avatarMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-16 left-0 right-0 z-50 rounded-2xl border border-slate-700/90 bg-[#101B2E] p-2 shadow-2xl space-y-1 text-xs text-white backdrop-blur-xl"
                >
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <span className="font-bold text-sm text-white block truncate" title={fullName}>{fullName}</span>
                    <span className="text-[0.7rem] text-slate-400 font-mono block truncate">{educationStageDisplay}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => { setAvatarMenuOpen(false); setProfileModalOpen(true); }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2.5 transition-all text-xs font-medium cursor-pointer"
                  >
                    <span className="text-base">👤</span>
                    <span>Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setAvatarMenuOpen(false); setSettingsModalOpen(true); }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white flex items-center justify-between transition-all text-xs font-medium cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">⚙️</span>
                      <span>Settings</span>
                    </div>
                    <span className="text-[0.65rem] font-mono bg-[#D4A034]/20 border border-[#D4A034]/40 text-[#D4A034] px-1.5 py-0.5 rounded font-bold">
                      New
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { toggleTheme(); }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white flex items-center justify-between transition-all text-xs font-medium cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{isDark ? '☀️' : '🌙'}</span>
                      <span>{isDark ? 'Light Theme' : 'Dark Theme'}</span>
                    </div>
                    <span className="text-[0.65rem] font-mono bg-[#D4A034]/20 border border-[#D4A034]/40 text-[#D4A034] px-1.5 py-0.5 rounded font-bold">
                      {isDark ? 'DARK' : 'LIGHT'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setAvatarMenuOpen(false); setRoleModalOpen(true); }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2.5 transition-all text-xs font-medium cursor-pointer"
                  >
                    <span className="text-base">🔄</span>
                    <span>Switch role</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { handleReset(); setAvatarMenuOpen(false); showToast('Assessment reset. Ready to retake!'); }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2.5 text-xs font-medium cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-[#D4A034]" />
                    <span>Retake Assessment</span>
                  </button>

                  <div className="pt-1.5 pb-1 border-t border-slate-800">
                    <div className="px-3 py-1 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                        <span>🌐</span>
                        <span>{t('settings.language', {}, 'Language')}</span>
                      </span>
                      <LanguageSwitcher compact={true} direction="up" align="left" />
                    </div>
                  </div>

                  <div className="border-t border-slate-800/80 my-1" />

                  <Link
                    href="/"
                    onClick={() => setAvatarMenuOpen(false)}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 flex items-center gap-2.5 text-xs font-semibold cursor-pointer block"
                  >
                    <span className="text-base">🚪</span>
                    <span>Log out</span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </aside>

      {/* ======================================================== */}
      {/* MAIN CONTENT AREA */}
      {/* ======================================================== */}
      <main className="flex-1 lg:pl-72 py-6 px-4 sm:px-8 max-w-[1400px] mx-auto space-y-7">



        {/* ======================================================== */}
        {/* 1. DASHBOARD OVERVIEW & STATS (activeNav === 'dashboard') */}
        {/* ======================================================== */}
        {activeNav === 'dashboard' && (
          <div className="space-y-8">
            {/* 1. HERO WELCOME & WAYPOINT MILESTONE PROGRESS */}
            <div className={`rounded-3xl border p-6 sm:p-8 relative overflow-hidden transition-all shadow-xl ${
              isDark ? 'bg-[#101B2E] border-slate-700/80 text-white' : 'bg-white border-[#E6DCC8] text-[#1C2536]'
            }`}>
              <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-[#D4A034]/10 blur-3xl" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A034]/15 border border-[#D4A034]/30 text-[#D4A034] text-xs font-mono font-semibold">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Personalized Career Navigation Portal</span>
                  </div>

                  <h2 className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                    Welcome back, {fullName}
                  </h2>

                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                    Active Level: <strong className="text-[#D4A034] font-mono">{educationStageDisplay}</strong>
                    {' • '}
                    Summit Target: <strong className="font-mono text-[#D4A034]">{selectedCareer ? selectedCareer.title : 'Not chosen yet'}</strong>
                    {userProfile?.age ? ` • Age: ${userProfile.age}` : ''}
                  </p>
                </div>

                {/* Quick Status Pill Actions */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {!isRapidFireCompleted ? (
                    <Link
                      href="/rapid-fire"
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#D4A034] text-white font-mono text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-1.5"
                    >
                      <Zap className="h-3.5 w-3.5" />
                      <span>Start Rapid Fire (Waypoint 03)</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : !isAssessmentCompleted ? (
                    <button
                      type="button"
                      onClick={() => setActiveNav('assessment')}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#D4A034] text-white font-mono text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <ClipboardList className="h-3.5 w-3.5" />
                      <span>Complete Assessment (Waypoint 04)</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveNav('assessment')}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#D4A034] text-white font-mono text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Review Results &amp; Chatbot</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveNav('careers')}
                    className={`px-4 py-2.5 rounded-xl border font-mono text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                      isDark
                        ? 'border-slate-700 bg-slate-800/80 text-slate-200 hover:border-[#D4A034]'
                        : 'border-[#E6DCC8] bg-stone-50 text-stone-700 hover:border-[#B8860B]'
                    }`}
                  >
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>View Career Library</span>
                  </button>
                </div>
              </div>

              {/* 5-Waypoint Milestone Stepper */}
              <div className="mt-6 pt-6 border-t border-slate-700/60 grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50 border-stone-200'}`}>
                  <div className="flex items-center gap-1 text-[0.68rem] font-mono font-bold text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> 01. Credentials
                  </div>
                  <div className="text-[0.65rem] text-slate-400 mt-0.5">Account profile configured</div>
                </div>

                <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50 border-stone-200'}`}>
                  <div className="flex items-center gap-1 text-[0.68rem] font-mono font-bold text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> 02. Academics
                  </div>
                  <div className="text-[0.65rem] text-slate-400 mt-0.5">{educationStageDisplay}</div>
                </div>

                <div className={`p-3 rounded-xl border ${
                  isRapidFireCompleted
                    ? (isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50 border-stone-200')
                    : 'bg-amber-950/30 border-amber-500/40 ring-1 ring-amber-500/30'
                }`}>
                  <div className={`flex items-center gap-1 text-[0.68rem] font-mono font-bold ${isRapidFireCompleted ? 'text-emerald-400' : 'text-[#D4A034]'}`}>
                    {isRapidFireCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Zap className="h-3.5 w-3.5" />}
                    03. Rapid Fire
                  </div>
                  <div className="text-[0.65rem] text-slate-400 mt-0.5">
                    {isRapidFireCompleted ? '10 Scenarios Mapped' : 'Action Required (2 mins)'}
                  </div>
                </div>

                <div className={`p-3 rounded-xl border ${
                  isAssessmentCompleted
                    ? (isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50 border-stone-200')
                    : isAssessmentUnlocked
                    ? 'bg-amber-950/20 border-amber-500/30'
                    : 'opacity-50 ' + (isDark ? 'bg-slate-900/30 border-slate-800' : 'bg-stone-50 border-stone-200')
                }`}>
                  <div className={`flex items-center gap-1 text-[0.68rem] font-mono font-bold ${
                    isAssessmentCompleted ? 'text-emerald-400' : isAssessmentUnlocked ? 'text-[#D4A034]' : 'text-slate-500'
                  }`}>
                    {isAssessmentCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : <ClipboardList className="h-3.5 w-3.5" />}
                    04. Assessment
                  </div>
                  <div className="text-[0.65rem] text-slate-400 mt-0.5">
                    {isAssessmentCompleted ? `Code: ${traitStats.dominant?.cat || 'E'}` : isAssessmentUnlocked ? 'Ready to Complete' : 'Locked'}
                  </div>
                </div>

                <div className={`p-3 rounded-xl border ${
                  selectedCareer
                    ? (isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50 border-stone-200')
                    : 'bg-[#D4A034]/10 border-[#D4A034]/30'
                }`}>
                  <div className={`flex items-center gap-1 text-[0.68rem] font-mono font-bold ${selectedCareer ? 'text-emerald-400' : 'text-[#D4A034]'}`}>
                    <Compass className="h-3.5 w-3.5" /> 05. Career & Route
                  </div>
                  <div className="text-[0.65rem] text-slate-400 mt-0.5 truncate">
                    {selectedCareer ? selectedCareer.title : 'Explore Matches Below'}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. EXECUTIVE RESULTS BOARD: HOLLAND PERSONALITY & RAPID FIRE REFLEXES */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* LEFT CARD: HOLLAND TRAITS BREAKDOWN */}
              <div className={`lg:col-span-7 rounded-3xl border p-6 sm:p-7 flex flex-col justify-between shadow-md transition-colors ${
                isDark ? 'bg-[#101B2E] border-slate-700/80 text-white' : 'bg-white border-[#E6DCC8] text-[#1C2536]'
              }`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-[0.68rem] font-mono font-bold uppercase tracking-wider ${isDark ? 'text-[#D4A034]' : 'text-[#8C6D2D]'}`}>
                        WAYPOINT 04 — PERSONALITY &amp; TRAITS BREAKDOWN
                      </div>
                      <h3 className={`font-serif text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                        Holland RIASEC Trait Match
                      </h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                      traitStats.isStarted
                        ? 'bg-[#D4A034]/15 border-[#D4A034]/30 text-[#D4A034]'
                        : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                    }`}>
                      {traitStats.isStarted ? `Dominant: ${traitStats.dominant?.name}` : 'Not Started'}
                    </span>
                  </div>

                  {traitStats.isStarted ? (
                    <>
                      {/* Dominant Trait Banner */}
                      <div className={`p-4 rounded-2xl border transition-colors ${
                        isDark ? 'bg-[#16223B] border-slate-700/70' : 'bg-[#F4E9D0] border-[#E5D7B7]'
                      }`}>
                        <div className="flex items-center justify-between text-xs font-mono font-semibold">
                          <span className={isDark ? 'text-[#D4A034]' : 'text-[#8C6D2D]'}>
                            PRIMARY HOLLAND PROFILE
                          </span>
                          {traitStats.secondary && (
                            <span className="text-slate-400">
                              Secondary: {traitStats.secondary.emoji} {traitStats.secondary.name}
                            </span>
                          )}
                        </div>
                        <h4 className={`text-lg font-bold mt-1 ${isDark ? 'text-white' : 'text-[#2A2113]'}`}>
                          {traitStats.dominant.emoji} {traitStats.dominant.name}
                        </h4>
                        <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-300' : 'text-[#615239]'}`}>
                          {traitStats.dominant.sub}
                        </p>
                      </div>

                      {/* 6 Holland RIASEC Trait Distribution Bars */}
                      <div className="space-y-2.5 pt-1">
                        {traitStats.sorted.map((item) => (
                          <div key={item.cat} className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-semibold">
                              <span className={`flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-stone-700'}`}>
                                <span>{item.emoji}</span>
                                <span>{item.name}</span>
                                <span className="text-[0.65rem] font-mono text-slate-400">({item.cat})</span>
                              </span>
                              <span className="font-mono font-bold" style={{ color: item.color || '#D4A034' }}>
                                {item.pct}%
                              </span>
                            </div>
                            <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-stone-200'}`}>
                              <div
                                className="h-full rounded-full transition-all duration-500 ease-out"
                                style={{
                                  width: item.pct > 0 ? `${item.pct}%` : '0%',
                                  backgroundColor: item.color || '#D4A034',
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Working Style Pills */}
                      <div className="pt-4 mt-4 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                        <span className="text-slate-400">Working Style:</span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[0.7rem]">
                            {sliderAnswers.focus > 60 ? '🌍 Big-Picture' : sliderAnswers.focus < 40 ? '🔍 Detail Analyst' : '⚖️ Balanced Learner'}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[0.7rem]">
                            {sliderAnswers.energy > 60 ? '👥 Team Collaborative' : '⚡ Deep Focus'}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[0.7rem]">
                            {sliderAnswers.decisions > 60 ? '📊 Data-Driven' : '💡 Intuitive Instinct'}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="py-10 px-4 text-center rounded-2xl border border-dashed border-slate-700/80 bg-slate-900/40 flex flex-col items-center justify-center space-y-3">
                      <div className="h-12 w-12 rounded-2xl bg-[#D4A034]/10 border border-[#D4A034]/30 flex items-center justify-center text-[#D4A034]">
                        <Compass className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-base text-white">
                          Finish the assessment to see your profile
                        </h4>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                          Answer the 10 questionnaire scenarios to calculate your RIASEC personality traits and discover your dominant working style.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleNavClick('assessment')}
                        className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#D4A034] text-white font-mono text-xs font-bold shadow-md hover:scale-105 transition-all cursor-pointer"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Start Assessment</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {traitStats.isStarted && (
                  <div className="pt-4 mt-4 border-t border-slate-700/60 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Profile Calibrated</span>
                    <button
                      type="button"
                      onClick={() => handleNavClick('assessment')}
                      className="text-[#D4A034] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Review Details</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* RIGHT CARD: RAPID FIRE COGNITIVE & DECISION REFLEXES */}
              <div className={`lg:col-span-5 rounded-3xl border p-6 sm:p-7 flex flex-col justify-between shadow-md transition-colors ${
                isDark ? 'bg-[#101B2E] border-slate-700/80 text-white' : 'bg-white border-[#E6DCC8] text-[#1C2536]'
              }`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-[0.68rem] font-mono font-bold uppercase tracking-wider ${isDark ? 'text-[#D4A034]' : 'text-[#8C6D2D]'}`}>
                        WAYPOINT 03 — PROBLEM SOLVING &amp; REFLEXES
                      </div>
                      <h3 className={`font-serif text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                        Decision Reflexes
                      </h3>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                      isRapidFireCompleted
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                        : 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                    }`}>
                      {isRapidFireCompleted ? 'Calibrated ✓' : 'Pending'}
                    </span>
                  </div>

                  {isRapidFireCompleted ? (
                    <div className="space-y-3.5">
                      <div className={`p-4 rounded-2xl border ${
                        isDark
                          ? 'bg-[#16223B] border-slate-700/70 shadow-sm'
                          : 'bg-amber-50/70 border-amber-200/90 shadow-xs'
                      }`}>
                        <div className={`text-[0.68rem] font-mono font-bold uppercase tracking-wider ${
                          isDark ? 'text-[#D4A034]' : 'text-[#8C6D2D]'
                        }`}>
                          Primary Dimension
                        </div>
                        <div className={`font-bold text-sm mt-0.5 ${
                          isDark ? 'text-white' : 'text-[#1C2536]'
                        }`}>
                          {userProfile?.rapidFireResult?.primaryDimension || 'Problem-Solving & System Troubleshooting'}
                        </div>
                        <p className={`text-xs mt-1.5 leading-relaxed font-medium ${
                          isDark ? 'text-slate-200' : 'text-[#2D3748]'
                        }`}>
                          {userProfile?.rapidFireResult?.summary || 'Demonstrates strong methodical troubleshooting when faced with unexpected project roadblocks and resource constraints.'}
                        </p>
                      </div>

                      {/* Behavioral Badges Grid */}
                      <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50 border-stone-200 shadow-xs'}`}>
                          <span className={`text-[0.65rem] font-mono uppercase block ${isDark ? 'text-slate-400' : 'text-stone-500 font-semibold'}`}>Adaptability</span>
                          <span className={`text-xs font-bold block mt-0.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>High Agility</span>
                        </div>
                        <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50 border-stone-200 shadow-xs'}`}>
                          <span className={`text-[0.65rem] font-mono uppercase block ${isDark ? 'text-slate-400' : 'text-stone-500 font-semibold'}`}>Risk Evaluation</span>
                          <span className={`text-xs font-bold block mt-0.5 ${isDark ? 'text-[#D4A034]' : 'text-[#8C6D2D]'}`}>Measured &amp; Prudent</span>
                        </div>
                        <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50 border-stone-200 shadow-xs'}`}>
                          <span className={`text-[0.65rem] font-mono uppercase block ${isDark ? 'text-slate-400' : 'text-stone-500 font-semibold'}`}>Critical Thinking</span>
                          <span className={`text-xs font-bold block mt-0.5 ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>Evidence-Driven</span>
                        </div>
                        <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50 border-stone-200 shadow-xs'}`}>
                          <span className={`text-[0.65rem] font-mono uppercase block ${isDark ? 'text-slate-400' : 'text-stone-500 font-semibold'}`}>Collaboration</span>
                          <span className={`text-xs font-bold block mt-0.5 ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>Consultative Lead</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 py-3">
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                        Complete the 10 decision scenarios in Rapid Fire to unlock your cognitive problem-solving reflexes and feed adaptive signals into your recommendations.
                      </p>
                      <Link
                        href="/rapid-fire"
                        className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#D4A034] text-white font-mono text-xs font-bold shadow-md hover:scale-105 transition-all"
                      >
                        <Zap className="h-4 w-4" />
                        <span>Start Rapid Fire Challenge (Waypoint 03)</span>
                      </Link>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-700/60 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">{isRapidFireCompleted ? '10 Scenarios Calibrated' : 'Awaiting Assessment'}</span>
                  <Link href="/rapid-fire" className="text-[#D4A034] hover:underline font-bold flex items-center gap-1">
                    <span>{isRapidFireCompleted ? 'Review Answers' : 'Take Challenge'}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* 3. MATCHED CAREER OPTIONS SECTION */}
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className={`text-[0.68rem] font-mono font-bold uppercase tracking-wider ${isDark ? 'text-[#D4A034]' : 'text-[#8C6D2D]'}`}>
                    AI-CURATED MATCHES
                  </div>
                  <h3 className={`font-serif text-2xl font-bold ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                    Different Matched Career Options
                  </h3>
                  <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                    Synthesized from your academic stream (<strong className="text-[#D4A034] font-mono">{educationStageDisplay}</strong>), Holland personality traits, and problem-solving reflexes.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleNavClick('careers')}
                  className="px-4 py-2 rounded-xl border border-[#D4A034]/40 bg-[#D4A034]/10 text-[#D4A034] font-mono text-xs font-bold hover:bg-[#D4A034]/20 transition-all shrink-0 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {!isCareersUnlocked && <Lock className="h-3.5 w-3.5 text-amber-400" />}
                  <span>Explore All Careers ({Object.values(CAREER_DATABASE).flat().length}+)</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Locked empty state OR 3 Recommended Career Option Cards */}
              {!isCareersUnlocked ? (
                <div className={`p-8 sm:p-12 rounded-3xl border border-dashed text-center flex flex-col items-center justify-center space-y-4 ${
                  isDark ? 'bg-slate-900/40 border-slate-700/80 text-white' : 'bg-stone-50 border-stone-300 text-[#1C2536]'
                }`}>
                  <div className="h-14 w-14 rounded-2xl bg-[#D4A034]/15 border border-[#D4A034]/30 flex items-center justify-center text-[#D4A034] shadow-inner">
                    <Lock className="h-7 w-7" />
                  </div>
                  <div className="max-w-md">
                    <h4 className="font-serif text-xl font-bold">
                      Matched Careers Locked
                    </h4>
                    <p className={`text-xs sm:text-sm mt-1.5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>
                      Finish the assessment to see your profile and unlock your personalized career matches based on your academic coordinates, cognitive reflexes, and RIASEC traits.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    {!isAcademicCompleted ? (
                      <Link
                        href="/academic-background"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#D4A034] text-white font-mono text-xs font-bold shadow-md hover:scale-105 transition-all"
                      >
                        <School className="h-4 w-4" />
                        <span>Step 1: Academic Background</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : !isRapidFireCompleted ? (
                      <Link
                        href="/rapid-fire"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#D4A034] text-white font-mono text-xs font-bold shadow-md hover:scale-105 transition-all"
                      >
                        <Zap className="h-4 w-4" />
                        <span>Step 2: Rapid Fire Challenge</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : !isAssessmentCompleted ? (
                      <button
                        type="button"
                        onClick={() => handleNavClick('assessment')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#D4A034] text-white font-mono text-xs font-bold shadow-md hover:scale-105 transition-all cursor-pointer"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>Step 3: Complete Assessment</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveNav('assessment');
                          setStage('results');
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#D4A034] text-white font-mono text-xs font-bold shadow-md hover:scale-105 transition-all cursor-pointer"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>Step 4: Consult AI Counsellor to Unlock</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendedCareers.map((career) => (
                    <div
                      key={career.title}
                      className={`border rounded-3xl p-6 shadow-md flex flex-col justify-between transition-all hover:scale-[1.01] hover:shadow-xl ${
                        isDark ? 'bg-[#101B2E] border-slate-700/80 text-white hover:border-[#D4A034]' : 'bg-white border-[#E6DCC8] text-[#1C2536] hover:border-[#B8860B]'
                      }`}
                    >
                      <div>
                        {/* Top Header */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <span className="text-4xl p-2 rounded-2xl bg-slate-800/60 border border-slate-700/60 block">{career.icon}</span>
                          <div className="text-right">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#D4A034]/15 border border-[#D4A034]/40 text-[#D4A034]">
                              ★ {career.match || 96}% Match
                            </span>
                            <span className="block text-[0.68rem] font-mono text-emerald-400 mt-1">
                              ● {career.outlook || 'High Demand'}
                            </span>
                          </div>
                        </div>

                        <h4 className={`font-serif text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                          {career.title}
                        </h4>

                        <p className={`text-xs mb-4 leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                          {career.desc}
                        </p>

                        {/* Required Skills */}
                        <div className="space-y-1.5 mb-4">
                          <span className="text-[0.68rem] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                            Core Required Skills:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {career.skills?.map((sk) => (
                              <span
                                key={sk}
                                className={`text-[0.7rem] font-mono px-2 py-0.5 rounded-md border ${
                                  isDark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-stone-100 border-stone-200 text-stone-700'
                                }`}
                              >
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-4 border-t border-slate-700/50 mt-2 space-y-2">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/careers/${career.slug || 'automobile-engineer'}`}
                            className="flex-1 py-2 px-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer font-mono bg-gradient-to-r from-[#B8860B] to-[#D4A034] text-slate-950 hover:from-[#A37609] hover:to-[#C5922E]"
                          >
                            <BookOpen className="h-3.5 w-3.5" />
                            <span>View Career</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCareer(career);
                              showToast(`🚀 Selected ${career.title}! Opening Roadmap...`);
                              setActiveNav('roadmap');
                            }}
                            className={`py-2 px-3 rounded-xl font-semibold text-xs border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                              isDark
                                ? 'border-slate-700 bg-slate-800 text-slate-200 hover:border-[#D4A034] hover:text-white'
                                : 'border-stone-300 bg-white text-stone-700 hover:border-[#B8860B] hover:text-[#B8860B]'
                            }`}
                          >
                            <span>Select Route</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveNav('assessment');
                            setStage('results');
                          }}
                          className={`w-full py-2 px-3 rounded-xl border text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            isDark
                              ? 'border-[#D4A034]/40 bg-[#D4A034]/10 text-[#D4A034] hover:bg-[#D4A034]/20'
                              : 'border-[#B8860B]/40 bg-[#B8860B]/10 text-[#8C6D2D] hover:bg-[#B8860B]/20'
                          }`}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Discuss with AI Counsellor</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. DETAILED ASSESSMENT VIEW (activeNav === 'assessment') */}
        {/* ======================================================== */}
        {activeNav === 'assessment' && (
          <div className="space-y-6">
            {/* TOP BANNER: WAYPOINT 04 — DETAILED CAREER ASSESSMENT */}
            <div className={`rounded-2xl sm:rounded-3xl border p-6 sm:p-8 shadow-sm relative overflow-hidden transition-colors duration-300 ${
              isDark ? 'bg-[#101B2E] border-slate-700/80 text-white' : 'bg-[#F5EBD7] border-[#E6DCC8] text-[#1C2536]'
            }`}>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className={`text-[0.7rem] font-mono font-bold uppercase tracking-widest ${isDark ? 'text-[#D4A034]' : 'text-[#B8860B]'}`}>
                    WAYPOINT 04 — DETAILED CAREER ASSESSMENT
                  </div>
                  <h2 className={`font-serif text-2xl sm:text-3xl font-bold leading-tight ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                    Discover your career direction
                  </h2>
                  <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-[#524636]'}`}>
                    Ten calibrated Holland RIASEC questions &amp; working style spectrum to discover your core personality traits.
                  </p>
                </div>

                {/* Metrics & Quick Profile Action */}
                <div className={`flex flex-wrap items-center gap-4 sm:gap-6 p-3.5 sm:px-6 sm:py-3.5 rounded-xl sm:rounded-2xl backdrop-blur-md shrink-0 shadow-xs border transition-colors duration-300 ${
                  isDark ? 'bg-slate-900/90 border-slate-700 text-white' : 'bg-white/90 border-[#E6DCC8] text-[#1C2536]'
                }`}>
                  <div>
                    <div className={`text-[0.68rem] font-mono uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>Stage</div>
                    <div className={`text-sm font-bold font-mono mt-0.5 ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                      {stage === 'question' ? `Question ${safeQIndex + 1} of 10` : stage === 'slider' ? `Style ${safeSIndex + 1} of 5` : 'Complete 🎉'}
                    </div>
                  </div>
                  <div className={`h-8 w-px hidden sm:block ${isDark ? 'bg-slate-700' : 'bg-stone-300'}`} />
                  <div>
                    <div className={`text-[0.68rem] font-mono uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>Dominant trait</div>
                    <div className={`text-sm font-bold font-mono mt-0.5 ${isDark ? 'text-[#D4A034]' : 'text-[#B8860B]'}`}>
                      {traitStats.isStarted ? traitStats.dominant.name : 'Pending'}
                    </div>
                  </div>

                  {stage !== 'results' ? (
                    <>
                      <div className={`h-8 w-px hidden sm:block ${isDark ? 'bg-slate-700' : 'bg-stone-300'}`} />
                      <button
                        type="button"
                        onClick={handleQuickCompleteAssessment}
                        className="px-3 py-1.5 rounded-lg border border-[#D4A034] text-[#D4A034] hover:bg-[#D4A034] hover:text-slate-950 font-mono text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                        title="Quickly complete assessment to test chatbot"
                      >
                        <span>⚡ Complete &amp; Test Chatbot</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className={`h-8 w-px hidden sm:block ${isDark ? 'bg-slate-700' : 'bg-stone-300'}`} />
                      <button
                        type="button"
                        onClick={() => setActiveNav('dashboard')}
                        className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#B8860B] to-[#D4A034] text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-md hover:from-[#A37609] hover:to-[#C5922E] cursor-pointer"
                      >
                        <LayoutDashboard className="h-3.5 w-3.5" />
                        <span>View Dashboard Overview</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 3-STAGE INTERACTIVE WORKFLOW SWITCHER: 1. QUESTIONNAIRE | 2. WORKING STYLE | 3. RESULTS & AI COUNSELLOR */}
            <div className={`p-1.5 rounded-2xl border flex flex-wrap sm:flex-nowrap gap-2 shadow-xs transition-colors ${
              isDark ? 'bg-[#0E1726] border-slate-700/80' : 'bg-[#EFE4CF] border-[#DFD1B8]'
            }`}>
              <button
                type="button"
                onClick={() => setStage('question')}
                className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  stage === 'question'
                    ? (isDark ? 'bg-[#D4A034] text-slate-950 shadow-md ring-1 ring-[#D4A034]' : 'bg-[#B8860B] text-white shadow-md ring-1 ring-[#B8860B]')
                    : (isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800/60' : 'text-[#524636] hover:bg-[#E5D7BE]')
                }`}
              >
                <ClipboardList className="h-4 w-4" />
                <span>1. Questionnaire ({selectedHistory.length}/10 Qs)</span>
                {selectedHistory.length === 10 && (
                  <CheckCircle2 className={`h-3.5 w-3.5 ${stage === 'question' ? (isDark ? 'text-slate-950' : 'text-white') : 'text-emerald-500'}`} />
                )}
              </button>

              <button
                type="button"
                onClick={() => setStage('slider')}
                className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  stage === 'slider'
                    ? (isDark ? 'bg-[#D4A034] text-slate-950 shadow-md ring-1 ring-[#D4A034]' : 'bg-[#B8860B] text-white shadow-md ring-1 ring-[#B8860B]')
                    : (isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800/60' : 'text-[#524636] hover:bg-[#E5D7BE]')
                }`}
              >
                <Sliders className="h-4 w-4" />
                <span>2. Working Style (5 Sliders)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (selectedHistory.length >= 10 || isAssessmentCompleted) {
                    setStage('results');
                  } else {
                    showToast('💡 Answer the 10 questionnaire questions first to unlock your full results & AI counsellor!');
                  }
                }}
                className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  stage === 'results'
                    ? (isDark ? 'bg-[#D4A034] text-slate-950 shadow-md ring-1 ring-[#D4A034]' : 'bg-[#B8860B] text-white shadow-md ring-1 ring-[#B8860B]')
                    : selectedHistory.length >= 10 || isAssessmentCompleted
                    ? (isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800/60' : 'text-[#524636] hover:bg-[#E5D7BE]')
                    : 'opacity-50 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                <span>3. Results &amp; Counsellor</span>
                {isAssessmentCompleted && (
                  <CheckCircle2 className={`h-3.5 w-3.5 ${stage === 'results' ? (isDark ? 'text-slate-950' : 'text-white') : 'text-emerald-500'}`} />
                )}
              </button>
            </div>


            {/* Dedicated AI Counsellor & Career Assessment Results when stage === 'results' */}
            {stage === 'results' ? (
              <motion.div
                id="results-chatbot-section"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full mt-2"
              >
                <ResultsChatbot
                  studentProfile={userProfile}
                  assessmentResults={{
                    dominantCode: traitStats.dominant?.cat || 'E',
                    dominantTrait: traitStats.dominant?.name || 'The Leader',
                    secondTrait: traitStats.secondary?.name || 'The Investigator',
                    percentages: traitStats.sorted?.reduce((acc, curr) => ({
                      ...acc,
                      [curr.name]: curr.pct,
                      [curr.cat]: curr.pct,
                      [curr.name.replace(/^The\s+/i, '')]: curr.pct
                    }), {}),
                    workingStyle: sliderAnswers,
                    topCareers: recommendedCareers.slice(0, 3).map((c) => ({
                      title: c.title,
                      match: c.match || 96,
                      outlook: c.outlook || 'High Demand',
                      desc: c.desc || '',
                      skills: c.skills || [],
                      matchReason: c.matchReason || ''
                    }))
                  }}
                  onNavigateToCareers={handleUnlockCareerMatches}
                  onBookCounsellor={() => showToast('📅 Opening human counsellor booking calendar...')}
                  onBackToResults={() => setActiveNav('dashboard')}
                  onRetakeAssessment={handleReset}
                  isDark={isDark}
                />
              </motion.div>
            ) : !isAssessmentUnlocked ? (
              /* LOCKED ASSESSMENT HERO VIEW WHEN RAPID FIRE IS PENDING */
              <div className={`rounded-3xl border p-8 sm:p-12 text-center relative overflow-hidden transition-all ${
                isDark
                  ? 'bg-[#101B2E] border-amber-500/30 text-white shadow-2xl'
                  : 'bg-white border-amber-500/40 text-[#1C2536] shadow-md'
              }`}>
                <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-[#D4A034]/10 blur-3xl" />

                <div className="relative z-10 max-w-xl mx-auto space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-[0_0_30px_rgba(217,165,72,0.25)]">
                    <Lock className="h-8 w-8 text-[#D4A034]" />
                  </div>

                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4A034]/15 border border-[#D4A034]/30 text-[#D4A034] text-xs font-mono font-semibold">
                    <Zap className="h-3.5 w-3.5" />
                    {!isAcademicCompleted
                      ? 'Waypoint 02 (Academic Background) Required First'
                      : 'Waypoint 03 (Rapid Fire) Required Before Assessment'}
                  </div>

                  <h2 className={`font-display text-2xl sm:text-3xl font-semibold tracking-tight ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                    Detailed Career Assessment is Locked
                  </h2>

                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                    {!isAcademicCompleted ? (
                      <>
                        Please complete your academic background first so PathFinders can calibrate your profile with the proper education track and difficulty coordinates.
                      </>
                    ) : (
                      <>
                        Your academic background has been configured for <strong className="text-[#D4A034] font-mono">{getEducationDisplay(userProfile)}</strong>.
                        To calibrate these assessment questions to your personal problem-solving style, you must first complete the 10-scenario Rapid Fire challenge.
                      </>
                    )}
                  </p>

                  {/* 3 Step Milestone Flow */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-left">
                    <div className={`p-4 rounded-xl border ${
                      isAcademicCompleted
                        ? (isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-stone-50 border-stone-200')
                        : 'bg-amber-950/30 border border-amber-500/40 ring-1 ring-amber-500/30'
                    }`}>
                      <span className={`text-xs font-mono font-bold block ${isAcademicCompleted ? 'text-emerald-400' : 'text-[#D4A034]'}`}>
                        {isAcademicCompleted ? '✓ 01. Academic Profile' : '⚡ 01. Academic Profile (Action)'}
                      </span>
                      <span className="text-[0.7rem] text-slate-400 block mt-0.5">
                        {isAcademicCompleted ? 'Education coordinates saved.' : 'Configure education & class level.'}
                      </span>
                    </div>

                    <div className={`p-4 rounded-xl border ${
                      isAcademicCompleted
                        ? 'bg-amber-950/30 border border-amber-500/40 ring-1 ring-amber-500/30'
                        : `opacity-50 ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-stone-50 border-stone-200'}`
                    }`}>
                      <span className={`text-xs font-mono font-bold block ${isAcademicCompleted ? 'text-[#D4A034]' : 'text-slate-400'}`}>
                        {isAcademicCompleted ? '⚡ 02. Rapid Fire (Action)' : '🔒 02. Rapid Fire'}
                      </span>
                      <span className="text-[0.7rem] text-amber-200/80 block mt-0.5">
                        {isAcademicCompleted ? '10 decision scenarios (2–3 mins).' : 'Unlocks after academic profile.'}
                      </span>
                    </div>

                    <div className={`p-4 rounded-xl border opacity-50 ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-stone-50 border-stone-200'}`}>
                      <span className="text-xs font-mono text-slate-400 font-bold block">
                        🔒 03. Detailed Assessment
                      </span>
                      <span className="text-[0.7rem] text-slate-500 block mt-0.5">Unlocks after Rapid Fire completion.</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    {!isAcademicCompleted ? (
                      <Link
                        href="/academic-background"
                        className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#B8860B] via-[#D4A034] to-[#B8860B] px-8 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_4px_25px_rgba(217,165,72,0.4)] hover:shadow-[0_6px_32px_rgba(217,165,72,0.6)] transition-all hover:scale-105 active:scale-95 cursor-pointer font-mono font-bold"
                      >
                        <span>Step 1: Configure Academic Background</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <Link
                        href="/rapid-fire"
                        className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#B8860B] via-[#D4A034] to-[#B8860B] px-8 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_4px_25px_rgba(217,165,72,0.4)] hover:shadow-[0_6px_32px_rgba(217,165,72,0.6)] transition-all hover:scale-105 active:scale-95 cursor-pointer font-mono font-bold"
                      >
                        <span>Unlock Assessment: Start Rapid Fire Challenge</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
            
              {/* LEFT CARD: QUESTION CONTAINER */}
              <div className={`lg:col-span-7 rounded-2xl sm:rounded-3xl border p-6 sm:p-8 flex flex-col justify-between min-h-[460px] transition-colors duration-300 ${
                isDark ? 'bg-[#101B2E] border-slate-700/80 text-white shadow-xl' : 'bg-white border-[#E6DCC8] text-[#1C2536] shadow-sm'
              }`}>
              
              <AnimatePresence mode="wait">
                {stage === 'question' && (
                  <motion.div
                    key={`q-${safeQIndex}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col justify-between h-full gap-6"
                  >
                    <div>
                      {/* Top Question Strip: Q1 through Q10 Quick Select */}
                      <div className={`pb-3.5 border-b mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isDark ? 'border-slate-800' : 'border-[#F0E6D2]'
                      }`}>
                        <div>
                          <div className={`text-xs font-mono font-bold tracking-wider uppercase ${isDark ? 'text-[#D4A034]' : 'text-[#B8860B]'}`}>
                            STAGE 1: RIASEC QUESTIONNAIRE
                          </div>
                          <span className={`text-xs font-mono font-medium ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                            Question {safeQIndex + 1} of {QUESTIONS.length}
                          </span>
                        </div>

                        {/* Interactive 10 Question Navigation Pills */}
                        <div className="flex items-center gap-1 flex-wrap">
                          {QUESTIONS.map((_, idx) => {
                            const isAnswered = selectedHistory.some((h) => h.qIndex === idx);
                            const isCurrent = safeQIndex === idx;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setQIndex(idx)}
                                className={`h-7 w-7 rounded-lg text-[0.7rem] font-mono font-bold transition-all cursor-pointer flex items-center justify-center ${
                                  isCurrent
                                    ? (isDark ? 'bg-[#D4A034] text-slate-950 ring-2 ring-[#D4A034]/60 scale-105' : 'bg-[#B8860B] text-white ring-2 ring-[#B8860B]/60 scale-105')
                                    : isAnswered
                                    ? (isDark ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-emerald-100 text-emerald-800 border border-emerald-300')
                                    : (isDark ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white' : 'bg-stone-100 text-stone-500 border border-stone-200 hover:text-stone-800')
                                }`}
                                title={`Jump to Question ${idx + 1}${isAnswered ? ' (Answered)' : ''}`}
                              >
                                {idx + 1}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Question Text */}
                      <h3 className={`font-serif text-xl sm:text-2xl font-bold leading-snug mb-6 ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                        {QUESTIONS[safeQIndex].q}
                      </h3>

                      {/* Options 2x2 Grid with Selected State Highlight */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {QUESTIONS[safeQIndex].opts.map((opt, idx) => {
                          const existingPick = selectedHistory.find((h) => h.qIndex === safeQIndex);
                          const isPicked = existingPick && existingPick.optIdx === idx;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handlePickOption(opt.c, idx)}
                              className={`group p-5 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-sm hover:shadow-md active:scale-98 border relative ${
                                isPicked
                                  ? (isDark
                                      ? 'bg-[#1C2C4E] border-[#D4A034] ring-2 ring-[#D4A034]/50 shadow-md'
                                      : 'bg-[#FBF5E8] border-[#B8860B] ring-2 ring-[#B8860B]/50 shadow-md')
                                  : (isDark
                                      ? 'bg-[#16223B] border-slate-700/80 hover:border-[#D4A034] hover:bg-[#1C2C4E]'
                                      : 'bg-white border-stone-200 hover:border-[#B8860B] hover:bg-[#FDFBF7]')
                              }`}
                            >
                              {isPicked && (
                                <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[0.62rem] font-mono font-bold flex items-center gap-1 shadow-xs ${
                                  isDark ? 'bg-[#D4A034] text-slate-950' : 'bg-[#B8860B] text-white'
                                }`}>
                                  <Check className="h-3 w-3 stroke-[3]" /> Selected
                                </span>
                              )}
                              <span className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">
                                {opt.e}
                              </span>
                              <span className={`font-bold text-sm transition-colors leading-relaxed ${
                                isPicked
                                  ? (isDark ? 'text-[#D4A034]' : 'text-[#B8860B]')
                                  : (isDark ? 'text-slate-100 group-hover:text-[#D4A034]' : 'text-[#1C2536] group-hover:text-[#B8860B]')
                              }`}>
                                {opt.t}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Navigation Footer */}
                    <div className={`flex flex-wrap items-center justify-between gap-3 pt-4 border-t text-xs font-mono ${
                      isDark ? 'border-slate-800 text-slate-400' : 'border-stone-100 text-stone-500'
                    }`}>
                      <button
                        type="button"
                        onClick={handleGoBack}
                        disabled={safeQIndex === 0}
                        className={`inline-flex items-center gap-1 cursor-pointer font-bold ${
                          isDark ? 'hover:text-white disabled:opacity-30' : 'hover:text-stone-800 disabled:opacity-30'
                        }`}
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Previous Question</span>
                      </button>

                      <span className="text-[0.72rem]">
                        Answered: {selectedHistory.length} / {QUESTIONS.length}
                      </span>

                      {safeQIndex + 1 < QUESTIONS.length ? (
                        <button
                          type="button"
                          onClick={() => setQIndex(safeQIndex + 1)}
                          className={`inline-flex items-center gap-1 cursor-pointer font-bold ${
                            isDark ? 'text-[#D4A034] hover:text-[#E5B548]' : 'text-[#B8860B] hover:text-[#9A7009]'
                          }`}
                        >
                          <span>Next Question</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setStage('slider')}
                          className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#B8860B] to-[#D4A034] text-white font-bold shadow-sm hover:scale-105 transition-all inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Continue to Style Sliders (Stage 2)</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

                {stage === 'slider' && (
                  <motion.div
                    key={`slider-${safeSIndex}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col justify-between h-full gap-6"
                  >
                    <div>
                      {/* Header Line */}
                      <div className={`pb-3.5 border-b mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isDark ? 'border-slate-800' : 'border-[#F0E6D2]'
                      }`}>
                        <div>
                          <div className={`text-xs font-mono font-bold tracking-wider uppercase ${isDark ? 'text-[#D4A034]' : 'text-[#B8860B]'}`}>
                            STAGE 2: WORKING &amp; LEARNING STYLE
                          </div>
                          <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                            Preference {safeSIndex + 1} of {SLIDERS.length}
                          </span>
                        </div>

                        {/* Slider Pills Navigator */}
                        <div className="flex items-center gap-1">
                          {SLIDERS.map((s, idx) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => setSIndex(idx)}
                              className={`h-7 px-2.5 rounded-lg text-[0.7rem] font-mono font-bold transition-all cursor-pointer ${
                                safeSIndex === idx
                                  ? (isDark ? 'bg-[#D4A034] text-slate-950 ring-2 ring-[#D4A034]/50' : 'bg-[#B8860B] text-white ring-2 ring-[#B8860B]/50')
                                  : (isDark ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white' : 'bg-stone-100 text-stone-500 border border-stone-200 hover:text-stone-800')
                              }`}
                            >
                              {s.id.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>

                      <h3 className={`font-serif text-xl sm:text-2xl font-bold leading-snug mb-8 text-center ${
                        isDark ? 'text-white' : 'text-[#1C2536]'
                      }`}>
                        {SLIDERS[safeSIndex].q}
                      </h3>

                      <div className="max-w-md mx-auto space-y-6">
                        <div className="flex justify-between items-center text-3xl px-2">
                          <span>{SLIDERS[safeSIndex].emojiL}</span>
                          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[#D4A034]/15 border border-[#D4A034]/30 text-[#D4A034]">
                            {sliderAnswers[SLIDERS[safeSIndex].id] ?? 50}%
                          </span>
                          <span>{SLIDERS[safeSIndex].emojiR}</span>
                        </div>

                        <div className="relative pt-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={sliderAnswers[SLIDERS[safeSIndex].id] ?? 50}
                            onChange={(e) => handleSliderChange(SLIDERS[safeSIndex].id, e.target.value)}
                            className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-slate-700/60 dark:bg-slate-800 border border-slate-600 focus:outline-none accent-[#D4A034]"
                          />
                        </div>

                        <div className={`flex justify-between text-xs sm:text-sm font-semibold font-mono ${
                          isDark ? 'text-slate-300' : 'text-stone-600'
                        }`}>
                          <span className={isDark ? 'text-[#D4A034]' : 'text-[#B8860B]'}>{SLIDERS[safeSIndex].left}</span>
                          <span className={isDark ? 'text-[#D4A034]' : 'text-[#B8860B]'}>{SLIDERS[safeSIndex].right}</span>
                        </div>
                      </div>
                    </div>

                    <div className={`flex flex-wrap items-center justify-between gap-3 pt-4 border-t text-xs font-mono ${
                      isDark ? 'border-slate-800 text-slate-400' : 'border-stone-100 text-stone-500'
                    }`}>
                      <button
                        type="button"
                        onClick={handleGoBack}
                        className={`inline-flex items-center gap-1 cursor-pointer font-bold ${
                          isDark ? 'hover:text-white' : 'hover:text-stone-800'
                        }`}
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>{safeSIndex === 0 ? '← Back to Questionnaire' : 'Previous Style'}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setStage('question')}
                          className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-500 cursor-pointer"
                        >
                          Review 10 Qs
                        </button>
                        <button
                          type="button"
                          disabled={isAnalyzing}
                          onClick={handleNextSlider}
                          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#B8860B] to-[#D4A034] text-slate-950 font-mono font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                        >
                          {isAnalyzing ? (
                            <>
                              <Compass className="h-4 w-4 animate-spin text-slate-950" />
                              <span>Analyzing Coordinates...</span>
                            </>
                          ) : safeSIndex + 1 < SLIDERS.length ? (
                            <span>Next Style →</span>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 text-slate-950" />
                              <span>Submit Assessment &amp; Launch AI Counsellor</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {stage === 'results' && (
                  <motion.div
                    key="results-screen"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6 text-center py-4"
                  >
                    <div className="text-5xl mb-2">{traitStats.dominant?.emoji || '🚀'}</div>
                    <div className="inline-block text-xs font-mono font-bold text-[#D4A034] uppercase tracking-wider bg-[#D4A034]/15 border border-[#D4A034]/30 px-3 py-1 rounded-full">
                      Dominant Archetype
                    </div>
                    <h3 className={`font-serif text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                      {traitStats.dominant?.name || 'The Leader'} ({traitStats.dominant?.cat || 'E'})
                    </h3>
                    <p className={`text-sm max-w-md mx-auto leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                      {traitStats.dominant?.sub}
                    </p>

                    <div className="flex flex-wrap justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setStage('question');
                          setQIndex(0);
                        }}
                        className="px-4 py-2 rounded-xl border border-[#D4A034]/50 text-xs font-mono font-bold text-[#D4A034] hover:bg-[#D4A034]/15 transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <ClipboardList className="h-3.5 w-3.5" />
                        <span>Review &amp; Edit Questionnaire (10 Qs)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setStage('slider');
                          setSIndex(0);
                        }}
                        className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800/80 text-xs font-mono font-bold text-slate-300 hover:text-white transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Sliders className="h-3.5 w-3.5" />
                        <span>Adjust Working Style (5 Sliders)</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-4 py-2 rounded-xl border border-red-500/30 text-xs font-mono font-bold text-red-400 hover:bg-red-500/10 transition-all inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Reset All Answers</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* RIGHT CARD: LIVE RESULTS BOARD */}
            <div className={`lg:col-span-5 rounded-2xl sm:rounded-3xl border p-6 sm:p-8 flex flex-col justify-between min-h-[480px] transition-colors duration-300 ${
              isDark ? 'bg-[#101B2E] border-slate-700/80 text-white shadow-xl' : 'bg-white border-[#E6DCC8] text-[#1C2536] shadow-sm'
            }`}>
              
              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-serif text-xl font-bold ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                      Live results board
                    </h3>
                    <span className={`text-[0.7rem] font-mono ${isDark ? 'text-slate-400' : 'text-stone-400'}`}>
                      Real-time assessment feedback
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-mono font-semibold border ${
                    isDark ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' : 'bg-emerald-100 border-emerald-200 text-emerald-800'
                  }`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" /> Live
                  </span>
                </div>

                {/* Tabs Selector (Traits | Working style) */}
                <div className={`grid grid-cols-2 gap-2 p-1 rounded-xl text-xs font-medium border ${
                  isDark ? 'bg-[#0B132B] border-slate-800' : 'bg-[#F3E7CA] border-[#E5D7B7]'
                }`}>
                  <button
                    type="button"
                    onClick={() => setAnalyticalTab('traits')}
                    className={`py-2 px-3 rounded-lg text-center transition-all cursor-pointer ${
                      analyticalTab === 'traits'
                        ? isDark ? 'bg-[#D4A034] text-slate-950 font-bold shadow-md' : 'bg-[#B8860B] text-white font-bold shadow-md'
                        : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-[#4A3E2A] hover:bg-[#EBDCB8]'
                    }`}
                  >
                    Traits Breakdown
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnalyticalTab('style')}
                    className={`py-2 px-3 rounded-lg text-center transition-all cursor-pointer ${
                      analyticalTab === 'style'
                        ? isDark ? 'bg-[#D4A034] text-slate-950 font-bold shadow-md' : 'bg-[#B8860B] text-white font-bold shadow-md'
                        : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-[#4A3E2A] hover:bg-[#EBDCB8]'
                    }`}
                  >
                    Working Style
                  </button>
                </div>

                {/* CONTENT AREA: TAB 1 (TRAITS) */}
                {analyticalTab === 'traits' && (
                  <div className="space-y-5">
                    {/* STATUS BOX */}
                    <div className={`rounded-xl border p-4 sm:p-5 space-y-1.5 relative overflow-hidden transition-colors ${
                      isDark ? 'bg-[#16223B] border-slate-700/80 text-white' : 'bg-[#F4E9D0] border-[#E5D7B7] text-[#2A2113]'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className={`text-[0.65rem] font-mono font-bold uppercase tracking-wider ${isDark ? 'text-[#D4A034]' : 'text-[#8C6D2D]'}`}>
                          CURRENT DOMINANT TRAIT
                        </div>
                        {traitStats.secondary && (
                          <span className={`text-[0.65rem] font-mono px-2 py-0.5 rounded-md border ${
                            isDark ? 'text-slate-300 bg-slate-900 border-slate-700' : 'text-stone-600 bg-white/70 border-[#E5D7B7]'
                          }`}>
                            2nd: {traitStats.secondary.emoji} {traitStats.secondary.name}
                          </span>
                        )}
                      </div>
                      <h4 className={`font-bold text-base ${isDark ? 'text-white' : 'text-[#2A2113]'}`}>
                        {traitStats.isStarted ? `${traitStats.dominant.emoji} ${traitStats.dominant.name}` : 'Awaiting your first answer'}
                      </h4>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-[#615239]'}`}>
                        {traitStats.isStarted ? traitStats.dominant.sub : 'Pick an option on the left to see this fill in, live.'}
                      </p>
                    </div>

                    {/* SCORE DISTRIBUTION WITH PROGRESS BARS */}
                    <div className="space-y-3 pt-1">
                      <div className={`flex items-center justify-between text-[0.68rem] font-mono font-bold uppercase tracking-wider ${
                        isDark ? 'text-slate-400' : 'text-stone-400'
                      }`}>
                        <span>HOLLAND TRAITS MATCH</span>
                        <span>PERCENTAGE</span>
                      </div>

                      <div className="space-y-3">
                        {traitStats.sorted.map((item) => (
                          <div key={item.cat} className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-semibold">
                              <span className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                                <span className="text-sm">{item.emoji}</span>
                                <span>{item.name}</span>
                              </span>
                              <span className="font-mono font-bold" style={{ color: item.color || (isDark ? '#D4A034' : '#B8860B') }}>
                                {traitStats.isStarted ? `${item.pct}%` : '0%'}
                              </span>
                            </div>

                            {/* Animated Visual Progress Bar */}
                            <div className={`h-2 w-full rounded-full overflow-hidden border ${
                              isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-[#F3E7CA]/60 border-stone-200/60'
                            }`}>
                              <div
                                className="h-full rounded-full transition-all duration-500 ease-out"
                                style={{
                                  width: traitStats.isStarted && item.pct > 0 ? `${item.pct}%` : '0%',
                                  backgroundColor: item.color || '#B8860B',
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* CONTENT AREA: TAB 2 (WORKING STYLE) */}
                {analyticalTab === 'style' && (
                  <div className="space-y-5">
                    {/* STATUS BOX FOR WORKING STYLE */}
                    <div className={`rounded-xl border p-4 sm:p-5 space-y-1 transition-colors ${
                      isDark ? 'bg-[#16223B] border-slate-700/80 text-white' : 'bg-[#F4E9D0] border-[#E5D7B7] text-[#2A2113]'
                    }`}>
                      <div className={`text-[0.65rem] font-mono font-bold uppercase tracking-wider ${isDark ? 'text-[#D4A034]' : 'text-[#8C6D2D]'}`}>
                        WORK &amp; LEARNING SPECTRUM
                      </div>
                      <h4 className={`font-bold text-base ${isDark ? 'text-white' : 'text-[#2A2113]'}`}>
                        {sliderAnswers.focus > 60 ? '🌍 Big-Picture Strategic Mindset' : sliderAnswers.focus < 40 ? '🔍 Precision & Detail Analyst' : '⚖️ Balanced Adaptive Learner'}
                      </h4>
                      <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-[#615239]'}`}>
                        Adjust the sliders on the left during Stage 2 to tailor your working style metrics.
                      </p>
                    </div>

                    {/* SLIDERS METRICS BREAKDOWN */}
                    <div className="space-y-3 pt-1">
                      <div className={`flex items-center justify-between text-[0.68rem] font-mono font-bold uppercase tracking-wider ${
                        isDark ? 'text-slate-400' : 'text-stone-400'
                      }`}>
                        <span>DIMENSION</span>
                        <span>SPECTRUM POSITION</span>
                      </div>

                      <div className="space-y-3">
                        {SLIDERS.map((s) => {
                          const val = sliderAnswers[s.id] ?? 50;
                          return (
                            <div key={s.id} className={`space-y-1 p-2.5 rounded-xl border transition-colors ${
                              isDark ? 'bg-[#16223B] border-slate-800' : 'bg-stone-50 border-stone-100'
                            }`}>
                              <div className="flex items-center justify-between text-xs font-semibold">
                                <span className="flex items-center gap-1.5">
                                  <span>{s.emojiL}</span>
                                  <span className={`text-[0.75rem] ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>{s.left}</span>
                                </span>
                                <span className={`font-mono text-[0.7rem] font-bold ${isDark ? 'text-[#D4A034]' : 'text-[#B8860B]'}`}>
                                  {val}%
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <span className={`text-[0.75rem] ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>{s.right}</span>
                                  <span>{s.emojiR}</span>
                                </span>
                              </div>

                              {/* Progress Track Indicator */}
                              <div className={`h-2 w-full rounded-full overflow-hidden relative ${isDark ? 'bg-slate-800' : 'bg-stone-200'}`}>
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-[#B8860B] to-[#D4A034] transition-all duration-300"
                                  style={{ width: `${val}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom Quick Footer Note */}
              <div className={`pt-4 border-t flex items-center justify-between text-[0.7rem] font-mono ${
                isDark ? 'border-slate-800 text-slate-400' : 'border-stone-100 text-stone-400'
              }`}>
                <span>Completed: {stage === 'results' ? totalSteps : stage === 'slider' ? QUESTIONS.length + sIndex : selectedHistory.length} / {totalSteps} items</span>
                <span className={`font-semibold ${isDark ? 'text-[#D4A034]' : 'text-[#B8860B]'}`}>{progressPct}% Overall</span>
              </div>

            </div>

          </div>
          )}
          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* CAREERS HUB VIEW */}
        {/* -------------------------------------------------------- */}
        {activeNav === 'careers' && (
          <div className="space-y-6">
            {/* Top Navigation Bar: Back to Assessment & AI Counsellor */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleNavClick('assessment')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white font-mono text-xs font-bold transition-all cursor-pointer shadow-sm w-fit"
              >
                <ArrowLeft className="h-4 w-4 text-[#D4A034]" />
                <span>Back to Assessment &amp; AI Counsellor</span>
              </button>

              <span className="text-xs font-mono text-slate-400">
                Displaying all {allScoredCareers.length} calibrated career pathways
              </span>
            </div>

            <div className={`rounded-2xl border p-6 shadow-sm transition-colors ${
              isDark ? 'bg-[#101B2E] border-slate-700/80 text-white' : 'bg-[#F5EBD7] border-[#E6DCC8] text-[#1C2536]'
            }`}>
              <h2 className={`font-serif text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                All Matched Career Pathways ({allScoredCareers.length})
              </h2>
              <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-300' : 'text-[#524636]'}`}>
                Calibrated across RIASEC assessment, Rapid Fire decision reflexes, and AI Counsellor consultation.
              </p>
            </div>

            {!isCareersUnlocked ? (
              <div className={`p-8 sm:p-12 rounded-3xl border border-dashed text-center flex flex-col items-center justify-center space-y-4 ${
                isDark ? 'bg-slate-900/40 border-slate-700/80 text-white' : 'bg-stone-50 border-stone-300 text-[#1C2536]'
              }`}>
                <div className="h-14 w-14 rounded-2xl bg-[#D4A034]/15 border border-[#D4A034]/30 flex items-center justify-center text-[#D4A034] shadow-inner">
                  <Lock className="h-7 w-7" />
                </div>
                <div className="max-w-md">
                  <h4 className="font-serif text-xl font-bold">
                    Career Matches Locked
                  </h4>
                  <p className={`text-xs sm:text-sm mt-1.5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>
                    {!isAssessmentCompleted
                      ? 'Please complete your Detailed Assessment first to discover your traits and consult your AI Counsellor.'
                      : 'Your assessment is complete! Please consult with your AI Counsellor chatbot to calibrate your discussion signals and unlock your matched pathways.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleNavClick('assessment');
                    if (isAssessmentCompleted) {
                      setStage('results');
                    }
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#B8860B] to-[#D4A034] text-white font-mono text-xs font-bold shadow-md hover:scale-105 transition-all cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{!isAssessmentCompleted ? 'Take Assessment' : 'Chat with AI Counsellor to Unlock'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendedCareers.map((career) => (
                  <div key={career.title} className={`border rounded-3xl p-6 shadow-sm flex flex-col justify-between transition-colors ${
                    isDark ? 'bg-[#101B2E] border-slate-700/80 text-white hover:border-[#D4A034]' : 'bg-white border-[#E6DCC8] text-[#1C2536] hover:border-[#B8860B]'
                  }`}>
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="text-4xl p-2 rounded-2xl bg-slate-800/60 border border-slate-700/60 block">{career.icon}</span>
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#D4A034]/15 border border-[#D4A034]/40 text-[#D4A034]">
                            ★ {career.match || 96}% Match
                          </span>
                          <span className="block text-[0.68rem] font-mono text-emerald-400 mt-1">
                            ● {career.outlook || 'High Demand'}
                          </span>
                        </div>
                      </div>
                      <h3 className={`font-serif text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>{career.title}</h3>
                      <p className={`text-xs mb-3 leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>{career.desc}</p>

                      {career.matchReason && (
                        <p className="text-[0.68rem] font-mono text-emerald-400 mb-3 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                          ✓ {career.matchReason}
                        </p>
                      )}

                      <div className="space-y-1.5 mb-4">
                        <span className="text-[0.68rem] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                          Core Required Skills:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {career.skills?.map((sk) => (
                            <span
                              key={sk}
                              className={`text-[0.7rem] font-mono px-2 py-0.5 rounded-md border ${
                                isDark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-stone-100 border-stone-200 text-stone-700'
                              }`}
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-2 mt-4 pt-4 border-t border-slate-700/50">
                      <Link
                        href={`/careers/${career.slug || 'automobile-engineer'}`}
                        className="w-full sm:flex-1 py-2.5 px-3.5 rounded-full font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer font-mono bg-gradient-to-r from-[#B8860B] to-[#D4A034] text-white hover:from-[#A37609] hover:to-[#C5922E]"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>View Career Card</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCareer(career);
                          showToast(`🚀 Selected ${career.title}! Roadmap unlocked.`);
                          setActiveNav('roadmap');
                        }}
                        className={`w-full sm:w-auto py-2.5 px-3.5 rounded-full font-semibold text-xs border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                          isDark
                            ? 'border-slate-700 bg-slate-800 text-slate-200 hover:border-[#D4A034] hover:text-white'
                            : 'border-stone-300 bg-white text-stone-700 hover:border-[#B8860B] hover:text-[#B8860B]'
                        }`}
                      >
                        <span>Select Route</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* ROADMAP VIEW */}
        {/* -------------------------------------------------------- */}
        {activeNav === 'roadmap' && (
          <div className="space-y-6">
            <div className={`rounded-2xl border p-6 shadow-sm transition-colors ${
              isDark ? 'bg-[#101B2E] border-slate-700/80 text-white' : 'bg-[#F5EBD7] border-[#E6DCC8] text-[#1C2536]'
            }`}>
              <h2 className={`font-serif text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                Roadmap: {selectedCareer?.title || 'Target Career'}
              </h2>
              <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-300' : 'text-[#524636]'}`}>
                Step-by-step milestones to achieve your career goal.
              </p>
            </div>

            <div className={`border rounded-2xl p-6 shadow-sm space-y-4 transition-colors ${
              isDark ? 'bg-[#101B2E] border-slate-700/80 text-white' : 'bg-white border-[#E6DCC8] text-[#1C2536]'
            }`}>
              <div className={`p-4 rounded-xl border ${
                isDark ? 'bg-[#16223B] border-slate-700/80 text-white' : 'bg-[#F4E9D0] border-[#E5D7B7] text-[#2A2113]'
              }`}>
                <strong className={`block text-sm ${isDark ? 'text-white' : 'text-[#2A2113]'}`}>Phase 1: Foundations</strong>
                <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-[#615239]'}`}>Focus on core electives and hands-on projects.</span>
              </div>
              <div className={`p-4 rounded-xl border ${
                isDark ? 'bg-[#16223B] border-slate-700/80 text-white' : 'bg-[#F4E9D0] border-[#E5D7B7] text-[#2A2113]'
              }`}>
                <strong className={`block text-sm ${isDark ? 'text-white' : 'text-[#2A2113]'}`}>Phase 2: Specialization</strong>
                <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-[#615239]'}`}>Build competency in {selectedCareer?.skills.join(', ')}.</span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODALS: PROFILE, SETTINGS & SWITCH ROLE */}
        {/* ======================================================== */}
        <AnimatePresence>
          {/* 👤 PROFILE MODAL */}
          {profileModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setProfileModalOpen(false)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm cursor-pointer"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative z-10 w-full max-w-md rounded-3xl border border-slate-700 bg-[#101B2E] p-6 text-white shadow-2xl space-y-5"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-full bg-[#C5922E]/20 text-[#D4A034] font-bold flex items-center justify-center text-lg border border-[#C5922E]/50">
                      👤
                    </span>
                    <div>
                      <h3 className="font-serif font-bold text-lg text-white leading-tight">{fullName}</h3>
                      <span className="text-xs font-mono text-[#D4A034]">Verified Expedition Student</span>
                    </div>
                  </div>
                  <button onClick={() => setProfileModalOpen(false)} className="text-slate-400 hover:text-white text-base">✕</button>
                </div>

                <div className="space-y-3 font-mono text-xs text-slate-300 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                  <div className="flex justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-slate-400">Education Stage:</span>
                    <span className="text-white font-semibold">{educationStageDisplay}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-slate-400">Academic Score:</span>
                    <span className="text-emerald-400 font-semibold">⭐ Excellent (85%+)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dominant Trait:</span>
                    <span className="text-[#D4A034] font-semibold">{traitStats.isStarted ? `${traitStats.dominant.emoji} ${traitStats.dominant.name}` : 'Pending Assessment'}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setProfileModalOpen(false)}
                  className="w-full py-3 rounded-full bg-[#D4A034] text-slate-950 font-bold text-xs hover:bg-yellow-400 transition-all shadow-md cursor-pointer"
                >
                  Close Profile
                </button>
              </motion.div>
            </div>
          )}

          {/* 🎴 LINKED CAREER CARD MODAL */}
          {cardModalCareer && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setCardModalCareer(null)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm cursor-pointer"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className={`relative z-10 w-full max-w-md rounded-3xl border p-6 shadow-2xl space-y-5 transition-colors ${
                  isDark ? 'bg-[#101B2E] border-slate-700 text-white' : 'bg-white border-[#E6DCC8] text-[#1C2536]'
                }`}
              >
                <div className="flex items-center justify-between border-b pb-4 border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{cardModalCareer.icon || '🚀'}</span>
                    <div>
                      <h3 className="font-serif font-bold text-lg leading-tight">{cardModalCareer.title}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-mono text-[#D4A034]">Linked Career Pathway Card</span>
                        {language !== 'en' && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
                            <span>🌐</span>
                            <span>{t('common.availableEnglishOnly', {}, 'Available in English only')}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setCardModalCareer(null)} className="text-slate-400 hover:text-white text-base">✕</button>
                </div>

                <div className="space-y-3 text-xs">
                  <p className={isDark ? 'text-slate-300' : 'text-stone-700'}>{cardModalCareer.desc}</p>
                  
                  <div className={`p-4 rounded-2xl border space-y-2 font-mono ${
                    isDark ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-[#F9F5EC] border-[#E6DCC8] text-[#1C2536]'
                  }`}>
                    <div className="flex justify-between border-b pb-2 border-slate-800/50">
                      <span className="text-slate-400">Industry Outlook:</span>
                      <span className="font-semibold text-[#D4A034]">High Growth (28% YoY)</span>
                    </div>
                    <div className="flex justify-between border-b pb-2 border-slate-800/50">
                      <span className="text-slate-400">Competency Match:</span>
                      <span className="font-semibold text-emerald-400">Strong Alignment (94%)</span>
                    </div>
                    {cardModalCareer.skills && (
                      <div>
                        <span className="text-slate-400 block mb-1.5 mt-2">Core Skills Roadmap:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {cardModalCareer.skills.map((skill, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-full bg-[#D4A034]/20 border border-[#D4A034]/40 text-[#D4A034] text-[0.7rem] font-bold">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2.5 flex-wrap">
                  <Link
                    href={cardModalCareer.slug ? `/careers/${cardModalCareer.slug}` : '/careers/automobile-engineer'}
                    className="px-4 py-3 min-h-[44px] rounded-full border border-slate-700 bg-slate-800/80 text-xs font-semibold text-slate-200 hover:border-[#D4A034] hover:text-white flex items-center justify-center gap-1 focus:outline-none focus:ring-1 focus:ring-[#D4A034]"
                  >
                    <span>Full Career Card</span>
                    <span>→</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCareer(cardModalCareer);
                      showToast(`🚀 Selected ${cardModalCareer.title}! Roadmap unlocked.`);
                      setCardModalCareer(null);
                      setActiveNav('roadmap');
                    }}
                    className="flex-1 py-3 min-h-[44px] rounded-full bg-[#D4A034] text-slate-950 font-bold text-xs hover:bg-yellow-400 transition-all shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  >
                    Select for Roadmap →
                  </button>
                  <button
                    type="button"
                    onClick={() => setCardModalCareer(null)}
                    className={`px-4 py-3 min-h-[44px] rounded-full border text-xs font-semibold cursor-pointer ${
                      isDark ? 'border-slate-700 text-slate-300 hover:text-white' : 'border-stone-300 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* ⚙️ FULL 10-TAB ROLE-ADAPTIVE SETTINGS MODAL */}
          {settingsModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSettingsModalOpen(false)}
                className="fixed inset-0 bg-slate-950/85 backdrop-blur-md cursor-pointer"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative z-10 w-full max-w-4xl max-h-[90vh] rounded-3xl border border-slate-700 bg-[#101B2E] text-white shadow-2xl flex flex-col overflow-hidden"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B1322] shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C5922E]/20 text-[#D4A034] text-lg border border-[#C5922E]/40">
                      ⚙️
                    </span>
                    <div>
                      <h3 className="font-serif font-bold text-lg text-white leading-tight flex items-center gap-2">
                        Settings &amp; Preferences
                        <span className="text-[0.65rem] font-mono bg-[#D4A034]/20 border border-[#D4A034]/40 text-[#D4A034] px-2 py-0.5 rounded-full uppercase">
                          {activeRoleSettings === 'student' ? 'Student' : activeRoleSettings === 'parent' ? 'Parent' : 'Switcher'} View
                        </span>
                      </h3>
                      <span className="text-xs font-mono text-slate-400">Account management, privacy, assessment history &amp; controls</span>
                    </div>
                  </div>

                  {/* Role Adaptation Switcher in Modal Header */}
                  <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl hidden sm:flex">
                    <button
                      type="button"
                      onClick={() => { setActiveRoleSettings('student'); showToast('Role switched to Student in Settings'); }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                        activeRoleSettings === 'student' ? 'bg-[#D4A034] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🎓 Student
                    </button>
                    <button
                      type="button"
                      onClick={() => { setActiveRoleSettings('parent'); showToast('Role switched to Parent in Settings'); }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                        activeRoleSettings === 'parent' ? 'bg-[#D4A034] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      👨‍👩‍👧 Parent
                    </button>
                    <button
                      type="button"
                      onClick={() => { setActiveRoleSettings('switcher'); showToast('Role switched to Career Switcher in Settings'); }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                        activeRoleSettings === 'switcher' ? 'bg-[#D4A034] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🔄 Switcher
                    </button>
                  </div>

                  <button
                    onClick={() => setSettingsModalOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-lg"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Body: Sidebar Tabs + Content Area */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                  
                  {/* LEFT TABS SIDEBAR */}
                  <div className="w-full md:w-64 border-r border-slate-800 bg-[#0D1627] p-3 space-y-1 overflow-y-auto shrink-0 font-body text-xs">
                    
                    {/* Tab 1: Profile */}
                    <button
                      type="button"
                      onClick={() => setSettingsTab('profile')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        settingsTab === 'profile'
                          ? 'bg-[#1C273C] text-white border border-[#D4A034]/40 font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                      }`}
                    >
                      <span className="text-sm">👤</span>
                      <span>Profile</span>
                    </button>

                    {/* Tab 2: Account */}
                    <button
                      type="button"
                      onClick={() => setSettingsTab('account')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        settingsTab === 'account'
                          ? 'bg-[#1C273C] text-white border border-[#D4A034]/40 font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                      }`}
                    >
                      <span className="text-sm">🔒</span>
                      <span>Account</span>
                    </button>

                    {/* Tab 3: Assessment / Linked Children */}
                    <button
                      type="button"
                      onClick={() => setSettingsTab('assessment')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        settingsTab === 'assessment'
                          ? 'bg-[#1C273C] text-white border border-[#D4A034]/40 font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                      }`}
                    >
                      <span className="text-sm">{activeRoleSettings === 'parent' ? '👨‍👩‍👧' : '📋'}</span>
                      <span>{activeRoleSettings === 'parent' ? 'Linked Children' : 'Assessment'}</span>
                    </button>

                    {/* Tab 4: Careers & Roadmap (Hidden if Parent) */}
                    {activeRoleSettings !== 'parent' && (
                      <button
                        type="button"
                        onClick={() => setSettingsTab('careers')}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                          settingsTab === 'careers'
                            ? 'bg-[#1C273C] text-white border border-[#D4A034]/40 font-bold shadow-sm'
                            : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                        }`}
                      >
                        <span className="text-sm">🗺️</span>
                        <span>Careers &amp; Roadmap</span>
                      </button>
                    )}

                    {/* Tab 5: AI Conversation */}
                    <button
                      type="button"
                      onClick={() => setSettingsTab('ai')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        settingsTab === 'ai'
                          ? 'bg-[#1C273C] text-white border border-[#D4A034]/40 font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                      }`}
                    >
                      <span className="text-sm">💬</span>
                      <span>AI Conversation</span>
                    </button>

                    {/* Tab 6: Privacy & Sharing (HIGHLIGHTED BADGE) */}
                    <button
                      type="button"
                      onClick={() => setSettingsTab('privacy')}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        settingsTab === 'privacy'
                          ? 'bg-[#1C273C] text-white border border-amber-500/60 font-bold shadow-md ring-1 ring-amber-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm">🛡️</span>
                        <span>Privacy &amp; Sharing</span>
                      </div>
                      <span className="text-[0.6rem] font-mono font-extrabold text-amber-400 bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.5 rounded shadow-sm">
                        IMPORTANT
                      </span>
                    </button>

                    {/* Tab 7: Notifications */}
                    <button
                      type="button"
                      onClick={() => setSettingsTab('notifications')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        settingsTab === 'notifications'
                          ? 'bg-[#1C273C] text-white border border-[#D4A034]/40 font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                      }`}
                    >
                      <span className="text-sm">🔔</span>
                      <span>Notifications</span>
                    </button>

                    {/* Tab 8: Accessibility */}
                    <button
                      type="button"
                      onClick={() => setSettingsTab('accessibility')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        settingsTab === 'accessibility'
                          ? 'bg-[#1C273C] text-white border border-[#D4A034]/40 font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                      }`}
                    >
                      <span className="text-sm">👁️</span>
                      <span>Accessibility</span>
                    </button>

                    {/* Tab 9: Data */}
                    <button
                      type="button"
                      onClick={() => setSettingsTab('data')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        settingsTab === 'data'
                          ? 'bg-[#1C273C] text-white border border-[#D4A034]/40 font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                      }`}
                    >
                      <span className="text-sm">📁</span>
                      <span>Data</span>
                    </button>

                    {/* Tab: Theme & Visual Style */}
                    <button
                      type="button"
                      onClick={() => setSettingsTab('theme')}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        settingsTab === 'theme'
                          ? 'bg-[#1C273C] text-white border border-[#D4A034]/40 font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm">{isDark ? '🌙' : '☀️'}</span>
                        <span>Theme &amp; Appearance</span>
                      </div>
                      <span className="text-[0.65rem] font-mono font-bold text-[#D4A034] bg-[#D4A034]/15 border border-[#D4A034]/30 px-1.5 py-0.5 rounded">
                        {isDark ? 'DARK' : 'LIGHT'}
                      </span>
                    </button>

                    {/* Tab: Language & Preferences */}
                    <button
                      type="button"
                      onClick={() => setSettingsTab('language')}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        settingsTab === 'language'
                          ? 'bg-[#1C273C] text-white border border-[#D4A034]/40 font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm">🌐</span>
                        <span>{t('settings.language', {}, 'Language & Script')}</span>
                      </div>
                      <span className="text-[0.65rem] font-mono font-bold text-[#D4A034] uppercase">
                        {language}
                      </span>
                    </button>

                    {/* Tab 10: Help & Support */}
                    <button
                      type="button"
                      onClick={() => setSettingsTab('support')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        settingsTab === 'support'
                          ? 'bg-[#1C273C] text-white border border-[#D4A034]/40 font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                      }`}
                    >
                      <span className="text-sm">❓</span>
                      <span>Help &amp; Support</span>
                    </button>

                  </div>

                  {/* RIGHT CONTENT PANEL */}
                  <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs text-slate-200">
                    
                    {/* CONTENT TAB 1: PROFILE */}
                    {settingsTab === 'profile' && (
                      <div className="space-y-5">
                        <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
                          <div className="h-16 w-16 rounded-full bg-[#C5922E]/20 border-2 border-[#D4A034] text-[#D4A034] text-2xl font-bold flex items-center justify-center shadow-md">
                            👤
                          </div>
                          <div>
                            <h4 className="font-serif font-bold text-base text-white">{fullName}</h4>
                            <span className="text-xs font-mono text-slate-400 block">{educationStageDisplay}</span>
                            <button onClick={() => showToast('Avatar uploader opened!')} className="text-xs text-[#D4A034] hover:underline mt-1 font-mono font-semibold">Change photo</button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-slate-400 font-mono uppercase tracking-wider mb-1 text-[0.7rem]">First Name</label>
                            <input
                              type="text"
                              key={userProfile.firstName || 'fn'}
                              defaultValue={userProfile.firstName || (fullName.split(' ')[0] || '')}
                              placeholder="First Name"
                              onBlur={(e) => {
                                const fn = e.target.value.trim();
                                const mn = userProfile.middleName || '';
                                const ln = userProfile.lastName || '';
                                const full = [fn, mn, ln].filter(Boolean).join(' ');
                                const updated = userProfileService.saveProfile({ firstName: fn, fullName: full });
                                setUserProfile(updated);
                                showToast('First Name updated.');
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:border-[#D4A034] outline-none text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 font-mono uppercase tracking-wider mb-1 text-[0.7rem]">Middle Name</label>
                            <input
                              type="text"
                              key={userProfile.middleName || 'mn'}
                              defaultValue={userProfile.middleName || ''}
                              placeholder="Middle Name"
                              onBlur={(e) => {
                                const fn = userProfile.firstName || '';
                                const mn = e.target.value.trim();
                                const ln = userProfile.lastName || '';
                                const full = [fn, mn, ln].filter(Boolean).join(' ');
                                const updated = userProfileService.saveProfile({ middleName: mn, fullName: full });
                                setUserProfile(updated);
                                showToast('Middle Name updated.');
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:border-[#D4A034] outline-none text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 font-mono uppercase tracking-wider mb-1 text-[0.7rem]">Last Name</label>
                            <input
                              type="text"
                              key={userProfile.lastName || 'ln'}
                              defaultValue={userProfile.lastName || (fullName.split(' ').slice(1).join(' ') || '')}
                              placeholder="Last Name"
                              onBlur={(e) => {
                                const fn = userProfile.firstName || '';
                                const mn = userProfile.middleName || '';
                                const ln = e.target.value.trim();
                                const full = [fn, mn, ln].filter(Boolean).join(' ');
                                const updated = userProfileService.saveProfile({ lastName: ln, fullName: full });
                                setUserProfile(updated);
                                showToast('Last Name updated.');
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:border-[#D4A034] outline-none text-xs"
                            />
                          </div>
                        </div>

                        {activeRoleSettings === 'switcher' ? (
                          <div className="space-y-3 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
                            <span className="font-mono text-xs text-[#D4A034] font-bold uppercase tracking-wider block">💼 Work Experience Profile</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-slate-400 font-mono text-[0.68rem] mb-1">Current Sector</label>
                                <input
                                  type="text"
                                  defaultValue={userProfile.currentIndustry || "Software Engineering"}
                                  onBlur={(e) => {
                                    const updated = userProfileService.saveProfile({ currentIndustry: e.target.value.trim() });
                                    setUserProfile(updated);
                                    showToast('Sector updated.');
                                  }}
                                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-slate-400 font-mono text-[0.68rem] mb-1">Target Pivot Role</label>
                                <input
                                  type="text"
                                  defaultValue={userProfile.targetPivot || "AI & Data Science"}
                                  onBlur={(e) => {
                                    const updated = userProfileService.saveProfile({ targetPivot: e.target.value.trim() });
                                    setUserProfile(updated);
                                    showToast('Pivot role updated.');
                                  }}
                                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
                            <span className="font-mono text-xs text-[#D4A034] font-bold uppercase tracking-wider block">🏫 Academic Information &amp; Education Stage</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-slate-400 font-mono text-[0.68rem] mb-1">Education Stage</label>
                                <select
                                  value={userProfile.educationLevel || 'Class 8–10'}
                                  onChange={(e) => {
                                    const updated = userProfileService.saveProfile({ educationLevel: e.target.value });
                                    setUserProfile(updated);
                                    showToast(`Updated Education Stage to: ${e.target.value}`);
                                  }}
                                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs font-bold text-[#D4A034] outline-none"
                                >
                                  <option value="Class 8–10">Class 8–10 (High School)</option>
                                  <option value="Class 11–12">Class 11–12 (Higher Secondary)</option>
                                  <option value="Undergraduate">Undergraduate (College / Degree)</option>
                                  <option value="Postgraduate">Postgraduate (Master’s / Ph.D)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-slate-400 font-mono text-[0.68rem] mb-1">School / Institution</label>
                                <input
                                  type="text"
                                  key={userProfile.schoolName || userProfile.collegeName || 'inst'}
                                  defaultValue={userProfile.schoolName || userProfile.collegeName || ''}
                                  placeholder="School / College Name"
                                  onBlur={(e) => {
                                    const updated = userProfileService.saveProfile({ schoolName: e.target.value });
                                    setUserProfile(updated);
                                    showToast('Saved institution name.');
                                  }}
                                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-[#D4A034]"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-slate-400 font-mono text-[0.68rem] mb-1">Favorite Subjects</label>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {Array.isArray(userProfile.favoriteSubjects) && userProfile.favoriteSubjects.length > 0 ? (
                                  userProfile.favoriteSubjects.map((sub, i) => (
                                    <span key={i} className="px-2.5 py-1 rounded-full bg-[#D4A034]/20 border border-[#D4A034]/40 text-[#D4A034] text-[0.7rem] font-medium">
                                      {sub}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-slate-500 text-[0.7rem] italic">No subjects selected yet</span>
                                )}
                              </div>
                            </div>
                            {userProfile.academicAchievements && (
                              <div>
                                <label className="block text-slate-400 font-mono text-[0.68rem] mb-1">Academic Achievements</label>
                                <div className="text-xs text-amber-200/90 bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 font-mono">
                                  {userProfile.academicAchievements}
                                </div>
                              </div>
                            )}
                            <div className="pt-2 border-t border-slate-800/80 flex justify-end">
                              <Link
                                href="/academic-background"
                                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#D4A034] hover:text-[#e4b245] transition-colors"
                              >
                                <span>Open Full Academic Profile Page</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* CONTENT TAB 2: ACCOUNT */}
                    {settingsTab === 'account' && (
                      <div className="space-y-4">
                        <h4 className="font-serif font-bold text-sm text-white border-b border-slate-800 pb-2">Account Security</h4>
                        <div>
                          <label className="block text-slate-400 font-mono uppercase tracking-wider mb-1">Email Address</label>
                          <input
                            type="email"
                            key={userProfile.email || 'email'}
                            defaultValue={userProfile.email || ''}
                            placeholder="your.email@example.com"
                            onBlur={(e) => {
                              const updated = userProfileService.saveProfile({ email: e.target.value.trim() });
                              setUserProfile(updated);
                              showToast('Email address updated.');
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:border-[#D4A034] outline-none text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 font-mono uppercase tracking-wider mb-1">Phone Number</label>
                          <input
                            type="tel"
                            key={userProfile.phone || 'phone'}
                            defaultValue={userProfile.phone || ''}
                            placeholder="+91 98765 43210"
                            onBlur={(e) => {
                              const updated = userProfileService.saveProfile({ phone: e.target.value.trim() });
                              setUserProfile(updated);
                              showToast('Phone number updated.');
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:border-[#D4A034] outline-none text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 font-mono uppercase tracking-wider mb-1">Password</label>
                          <button onClick={() => showToast('Password reset link sent to email!')} className="w-full text-left bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-2 text-slate-300 font-mono">
                            •••••••••••• (Change Password)
                          </button>
                        </div>
                        <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                          <span className="text-slate-400">Account Security Status: <strong className="text-emerald-400 font-mono">Secured (2FA Active)</strong></span>
                          <button onClick={() => showToast('🔒 Security options opened')} className="text-rose-400 hover:underline text-[0.72rem] font-mono">Delete Account</button>
                        </div>
                      </div>
                    )}

                    {/* CONTENT TAB 3: ASSESSMENT HISTORY / LINKED CHILDREN */}
                    {settingsTab === 'assessment' && (
                      <div className="space-y-4">
                        {activeRoleSettings === 'parent' ? (
                          <div className="space-y-4">
                            <h4 className="font-serif font-bold text-sm text-white border-b border-slate-800 pb-2">👨‍👩‍👧 Linked Children Accounts</h4>
                            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                              <div>
                                <span className="font-bold text-white block">{fullName}</span>
                                <span className="text-slate-400 text-[0.7rem] font-mono">{educationStageDisplay} • Connected</span>
                              </div>
                              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/40 px-2 py-0.5 rounded-full">ACTIVE</span>
                            </div>
                            <button onClick={() => showToast('Invite link generated!')} className="py-2.5 px-4 rounded-xl bg-slate-800 text-white font-mono text-xs hover:bg-slate-700 border border-slate-700">+ Link Another Child Account</button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {/* YOUR ASSESSMENT HISTORY OUTLINE MATCH */}
                            <div className="rounded-2xl border border-slate-700 bg-slate-900/90 p-4 space-y-3">
                              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                <h4 className="font-mono text-xs font-bold text-[#D4A034] uppercase tracking-wider">YOUR ASSESSMENT HISTORY</h4>
                                <span className="text-[0.68rem] text-slate-400 font-mono">3 Attempts Recorded</span>
                              </div>

                              <div className="space-y-2">
                                {/* Attempt 1 */}
                                <div className="p-3 rounded-xl bg-slate-950/80 border border-[#D4A034]/40 flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <span className="text-2xl">🎨</span>
                                    <div>
                                      <span className="font-bold text-white block">The Creator</span>
                                      <span className="text-[0.7rem] text-slate-400">Top match: Artistic (82%)</span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[0.68rem] font-mono font-bold text-amber-400 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-full block mb-1">Latest</span>
                                    <span className="text-[0.65rem] text-slate-400 font-mono">12 Sep 2026</span>
                                  </div>
                                </div>

                                {/* Attempt 2 */}
                                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <span className="text-2xl">🔬</span>
                                    <div>
                                      <span className="font-bold text-slate-200 block">The Investigator</span>
                                      <span className="text-[0.7rem] text-slate-400">Top match: Investigative (78%)</span>
                                    </div>
                                  </div>
                                  <span className="text-[0.65rem] text-slate-400 font-mono">03 Jun 2026</span>
                                </div>

                                {/* Attempt 3 */}
                                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <span className="text-2xl">🛠️</span>
                                    <div>
                                      <span className="font-bold text-slate-200 block">The Builder</span>
                                      <span className="text-[0.7rem] text-slate-400">Top match: Realistic (75%)</span>
                                    </div>
                                  </div>
                                  <span className="text-[0.65rem] text-slate-400 font-mono">15 Jan 2026</span>
                                </div>
                              </div>

                              {/* Growth Insight Line */}
                              <div className="p-2.5 rounded-xl bg-[#C5922E]/10 border border-[#C5922E]/30 text-[0.72rem] text-[#D4A034] font-mono font-medium flex items-center gap-2">
                                <span>📈</span>
                                <span>Growth Insight: Your creative &amp; investigative match scores increased by +14% over your last 3 attempts.</span>
                              </div>

                              {/* Retake Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  handleReset();
                                  setSettingsModalOpen(false);
                                  showToast('🎉 Assessment reset! Starting fresh attempt.');
                                }}
                                className="w-full py-2.5 rounded-xl bg-[#D4A034] text-slate-950 font-bold text-xs hover:bg-yellow-400 transition-all shadow-md cursor-pointer font-mono"
                              >
                                + Retake Assessment
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* CONTENT TAB 4: CAREERS & ROADMAP */}
                    {settingsTab === 'careers' && (
                      <div className="space-y-4">
                        <h4 className="font-serif font-bold text-sm text-white border-b border-slate-800 pb-2">Saved Careers &amp; Active Roadmap Route</h4>
                        <div className="space-y-2">
                          {['Robotics & Hardware Engineer', 'AI & Machine Learning Scientist', 'UI/UX & Interactive Architect'].map((cTitle) => (
                            <div key={cTitle} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                              <span className="font-bold text-white">{cTitle}</span>
                              <button onClick={() => showToast(`Removed ${cTitle}`)} className="text-slate-400 hover:text-rose-400 text-xs font-mono">Remove</button>
                            </div>
                          ))}
                        </div>
                        <div className="pt-3 border-t border-slate-800">
                          <button onClick={() => showToast('Roadmap route reset!')} className="py-2.5 px-4 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono text-xs hover:bg-rose-500/30">Reset Selected Roadmap Route</button>
                        </div>
                      </div>
                    )}

                    {/* CONTENT TAB 5: AI CONVERSATION */}
                    {settingsTab === 'ai' && (
                      <div className="space-y-4">
                        <h4 className="font-serif font-bold text-sm text-white border-b border-slate-800 pb-2">AI Guidance Counselor History</h4>
                        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                          <div className="flex justify-between">
                            <span className="font-bold text-white">Stored Chat Threads</span>
                            <span className="font-mono text-slate-400 text-[0.7rem]">14 Sessions</span>
                          </div>
                          <p className="text-[0.72rem] text-slate-400">All your interactions with the PathFinders AI counselor are stored locally for continuous career guidance context.</p>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => showToast('Chat summary exported as PDF!')} className="py-2.5 px-4 rounded-xl bg-[#D4A034] text-slate-950 font-bold font-mono text-xs">Export Chat Summary (PDF)</button>
                          <button onClick={() => showToast('Chat history cleared!')} className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 font-mono text-xs border border-slate-700 hover:bg-slate-700">Clear History</button>
                        </div>
                      </div>
                    )}

                    {/* CONTENT TAB 6: PRIVACY & SHARING (HIGHLIGHTED) */}
                    {settingsTab === 'privacy' && (
                      <div className="space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <h4 className="font-serif font-bold text-sm text-white flex items-center gap-2">
                            <span>🛡️ Privacy &amp; Sharing Control</span>
                            <span className="text-[0.6rem] font-mono font-extrabold text-amber-400 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-full">RECOMMENDED SETTING</span>
                          </h4>
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-2">What can your linked Parent/Counselor view?</label>
                          <div className="space-y-2">
                            {[
                              { id: 'full', label: 'Full Access', desc: 'Can view detailed Holland scores, questions history & roadmap progress' },
                              { id: 'summary', label: 'Summary Only (Recommended)', desc: 'Can view dominant archetype & top matched careers only' },
                              { id: 'completion', label: 'Completion Status Only', desc: 'Can only view whether assessment is finished or pending' }
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => { setParentPrivacyLevel(opt.id); showToast(`Privacy level updated to: ${opt.label}`); }}
                                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                                  parentPrivacyLevel === opt.id
                                    ? 'border-amber-500 bg-amber-500/15 text-white ring-1 ring-amber-500'
                                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                                }`}
                              >
                                <div>
                                  <span className="font-bold block text-xs">{opt.label}</span>
                                  <span className="text-[0.7rem] text-slate-400 block">{opt.desc}</span>
                                </div>
                                {parentPrivacyLevel === opt.id && <span className="text-amber-400 font-mono text-xs font-bold">✓ SELECTED</span>}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                          <span className="text-slate-400 text-[0.72rem]">Linked Guardian: <strong>sharma.parent@example.com</strong></span>
                          <button onClick={() => showToast('Parent access revoked')} className="text-rose-400 hover:underline text-xs font-mono font-bold">Revoke Access</button>
                        </div>
                      </div>
                    )}

                    {/* CONTENT TAB 7: NOTIFICATIONS */}
                    {settingsTab === 'notifications' && (
                      <div className="space-y-4">
                        <h4 className="font-serif font-bold text-sm text-white border-b border-slate-800 pb-2">Notification Preferences</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900 border border-slate-800">
                            <div>
                              <span className="font-bold text-white block">Email Milestone Alerts</span>
                              <span className="text-[0.7rem] text-slate-400">Receive weekly summaries and milestone reminders</span>
                            </div>
                            <button onClick={() => setEmailNotifs(!emailNotifs)} className={`h-6 w-11 rounded-full p-0.5 ${emailNotifs ? 'bg-[#D4A034]' : 'bg-slate-700'}`}>
                              <div className={`h-5 w-5 rounded-full bg-white transition-transform ${emailNotifs ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                          </div>

                          <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900 border border-slate-800">
                            <div>
                              <span className="font-bold text-white block">Website Push Alerts</span>
                              <span className="text-[0.7rem] text-slate-400">Real-time career match updates</span>
                            </div>
                            <button onClick={() => setPushNotifs(!pushNotifs)} className={`h-6 w-11 rounded-full p-0.5 ${pushNotifs ? 'bg-[#D4A034]' : 'bg-slate-700'}`}>
                              <div className={`h-5 w-5 rounded-full bg-white transition-transform ${pushNotifs ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CONTENT TAB 8: ACCESSIBILITY */}
                    {settingsTab === 'accessibility' && (
                      <div className="space-y-4">
                        <h4 className="font-serif font-bold text-sm text-white border-b border-slate-800 pb-2">Accessibility &amp; Visual Comfort</h4>
                        <div>
                          <label className="block text-slate-400 font-mono uppercase tracking-wider mb-2">Font Size Scaling</label>
                          <div className="grid grid-cols-2 gap-2">
                            {['standard', 'large'].map((sz) => (
                              <button key={sz} onClick={() => setFontSize(sz)} className={`py-2 rounded-xl border text-center uppercase font-mono font-bold text-xs ${fontSize === sz ? 'border-[#D4A034] bg-[#C5922E]/20 text-[#D4A034]' : 'border-slate-800 bg-slate-900 text-slate-400'}`}>{sz}</button>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <div>
                            <span className="font-bold text-white block">Reduced Motion</span>
                            <span className="text-[0.7rem] text-slate-400">Disable UI Framer Motion animations</span>
                          </div>
                          <button onClick={() => setReducedMotion(!reducedMotion)} className={`h-6 w-11 rounded-full p-0.5 ${reducedMotion ? 'bg-[#D4A034]' : 'bg-slate-700'}`}>
                            <div className={`h-5 w-5 rounded-full bg-white transition-transform ${reducedMotion ? 'translate-x-5' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* CONTENT TAB 9: DATA */}
                    {settingsTab === 'data' && (
                      <div className="space-y-4">
                        <h4 className="font-serif font-bold text-sm text-white border-b border-slate-800 pb-2">Data Privacy &amp; Export</h4>
                        <div className="space-y-2">
                          <button onClick={() => showToast('Your data export JSON is downloading...')} className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono text-xs hover:border-[#D4A034] text-left flex justify-between items-center">
                            <span>Download All Profile Data (.JSON)</span>
                            <span>📥</span>
                          </button>
                          <button onClick={() => showToast('Local cache cleared')} className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono text-xs hover:border-slate-700 text-left flex justify-between items-center">
                            <span>Clear Local Activity Cache</span>
                            <span>🧹</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* CONTENT TAB: THEME & APPEARANCE */}
                    {settingsTab === 'theme' && (
                      <div className="space-y-5">
                        <div className="border-b border-slate-800 pb-3">
                          <h4 className="font-serif font-bold text-base text-white flex items-center gap-2">
                            <span>🎨</span> Theme &amp; Visual Style
                          </h4>
                          <p className="text-slate-400 text-xs mt-1">
                            Choose between dark mode and light mode across PathFinders.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Dark Theme Option */}
                          <button
                            type="button"
                            onClick={() => toggleTheme('dark')}
                            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                              isDark
                                ? 'bg-slate-900 border-[#D4A034] shadow-lg ring-2 ring-[#D4A034]/30'
                                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 text-amber-400 flex items-center justify-center text-xl">
                                🌙
                              </span>
                              {isDark && (
                                <span className="text-xs font-mono font-bold text-[#D4A034] bg-[#D4A034]/20 border border-[#D4A034]/40 px-2 py-0.5 rounded-full">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            <div>
                              <strong className="text-sm text-white block font-bold">Midnight Dark Theme</strong>
                              <span className="text-[0.72rem] text-slate-400 block mt-1">Sleek deep navy dashboard with golden accents and high contrast elements.</span>
                            </div>
                          </button>

                          {/* Light Theme Option */}
                          <button
                            type="button"
                            onClick={() => toggleTheme('light')}
                            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                              !isDark
                                ? 'bg-[#F5EBD7] text-[#1C2536] border-[#B8860B] shadow-lg ring-2 ring-[#B8860B]/30'
                                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="h-10 w-10 rounded-full bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center text-xl">
                                ☀️
                              </span>
                              {!isDark && (
                                <span className="text-xs font-mono font-bold text-amber-800 bg-amber-200/80 border border-amber-400 px-2 py-0.5 rounded-full">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            <div>
                              <strong className={`text-sm block font-bold ${!isDark ? 'text-[#1C2536]' : 'text-white'}`}>Warm Gold Light Theme</strong>
                              <span className={`text-[0.72rem] block mt-1 ${!isDark ? 'text-[#524636]' : 'text-slate-400'}`}>Classic warm parchment background with crisp golden headers and dark typography.</span>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* CONTENT TAB: LANGUAGE & PREFERENCES */}
                    {settingsTab === 'language' && (
                      <div className="space-y-4">
                        <div className="border-b border-slate-800 pb-3">
                          <h4 className="font-serif font-bold text-base text-white flex items-center gap-2">
                            <span>🌐</span>
                            <span>{t('settings.language', {}, 'Language & Script')}</span>
                          </h4>
                          <p className="text-xs text-slate-400 mt-1 font-body">
                            {t('settings.languageHelp', {}, 'Select the language you want across PathFinders. Changes apply immediately and are saved to your profile.')}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          {LANGUAGES.map((lang) => {
                            const isSelected = language === lang.code;
                            return (
                              <button
                                key={lang.code}
                                type="button"
                                onClick={() => {
                                  setLanguage(lang.code);
                                  showToast(`Language switched to ${lang.englishName} (${lang.nativeName})`);
                                }}
                                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                  isSelected
                                    ? 'bg-[#D4A034]/15 border-[#D4A034] ring-1 ring-[#D4A034]/40 text-white shadow-md'
                                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-serif font-bold text-lg text-white">
                                    {lang.nativeName}
                                  </span>
                                  {isSelected ? (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D4A034] text-slate-950 text-xs font-bold">
                                      ✓
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                                      {lang.script}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/60">
                                  <span className="text-xs text-slate-400 font-mono">
                                    {lang.englishName}
                                  </span>
                                  <span className="text-[10px] font-mono font-bold text-[#D4A034]">
                                    /{lang.code}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* CONTENT TAB 10: HELP & SUPPORT */}
                    {settingsTab === 'support' && (
                      <div className="space-y-4">
                        <h4 className="font-serif font-bold text-sm text-white border-b border-slate-800 pb-2">Help &amp; Expert Support</h4>
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-brass/20 via-ink-deep to-brass/10 border border-brass/40 flex justify-between items-center">
                          <div>
                            <span className="font-bold text-white block">Need expert human guidance?</span>
                            <span className="text-[0.7rem] text-slate-300">Book 1-on-1 career counselling call with certified advisors.</span>
                          </div>
                          <button onClick={() => showToast('📞 Counsellor booking page opened')} className="py-2 px-4 rounded-full bg-[#D4A034] text-slate-950 font-bold font-mono text-xs shrink-0">Book Call</button>
                        </div>

                        <div className="space-y-2 text-slate-300 text-[0.72rem]">
                          <details className="bg-slate-900 border border-slate-800 rounded-xl p-3 cursor-pointer">
                            <summary className="font-bold text-white">How does Holland RIASEC code matching work?</summary>
                            <p className="mt-2 text-slate-400">Our algorithm measures your traits across 6 psychological categories (Realistic, Investigative, Artistic, Social, Enterprising, Conventional) and ranks 100+ careers by percentage affinity.</p>
                          </details>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-3 border-t border-slate-800 bg-[#0B1322] flex justify-between items-center shrink-0 text-xs">
                  <span className="text-slate-400 font-mono">PathFinders v2.6 • Active Session</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsModalOpen(false);
                      showToast('⚙️ Settings preferences saved successfully!');
                    }}
                    className="py-2 px-6 rounded-full bg-[#D4A034] text-slate-950 font-bold hover:bg-yellow-400 transition-all shadow-md cursor-pointer font-mono"
                  >
                    Save Changes &amp; Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* 🔄 SWITCH ROLE MODAL */}
          {roleModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setRoleModalOpen(false)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm cursor-pointer"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative z-10 w-full max-w-md rounded-3xl border border-slate-700 bg-[#101B2E] p-6 text-white shadow-2xl space-y-5"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔄</span>
                    <div>
                      <h3 className="font-serif font-bold text-lg text-white leading-tight">Switch Portal Role</h3>
                      <span className="text-xs font-mono text-slate-400">Choose your active portal view</span>
                    </div>
                  </div>
                  <button onClick={() => setRoleModalOpen(false)} className="text-slate-400 hover:text-white text-base">✕</button>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl border border-[#D4A034] bg-[#C5922E]/15 text-white flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-[#D4A034] block">🎓 Student Portal</span>
                      <span className="text-[0.7rem] text-slate-300 block">Active Route • Holland Assessment</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#D4A034]">ACTIVE</span>
                  </div>

                  <Link
                    href="/parent-dashboard"
                    onClick={() => setRoleModalOpen(false)}
                    className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between transition-all cursor-pointer block"
                  >
                    <div>
                      <span className="font-bold text-sm block">👨‍👩‍👧 Parent Portal</span>
                      <span className="text-[0.7rem] text-slate-400 block">Milestones &amp; Shared Summary</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </Link>

                  <Link
                    href="/career-switcher-dashboard"
                    onClick={() => setRoleModalOpen(false)}
                    className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between transition-all cursor-pointer block"
                  >
                    <div>
                      <span className="font-bold text-sm block">🔄 Career Switcher</span>
                      <span className="text-[0.7rem] text-slate-400 block">Transferable Skills &amp; Pivot Roadmap</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Floating Action Button for Chatbot (Hidden when the chat is already on screen) */}
        {isAssessmentCompleted && !chatbotModalOpen && !(activeNav === 'assessment' && stage === 'results') && (
          <motion.button
            type="button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChatbotModalOpen(true)}
            className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-[#B8860B] to-[#D4A034] text-white font-bold text-xs shadow-2xl flex items-center gap-2 border border-amber-300/40 hover:from-[#A37609] hover:to-[#C5922E] cursor-pointer"
            aria-label="Open Talk Through Your Results Chatbot"
          >
            <Compass className="h-4 w-4 animate-spin-slow" />
            <span className="hidden sm:inline">Talk Results (Optional)</span>
            <span className="sm:hidden">Talk</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </motion.button>
        )}

        {/* Dedicated Chatbot Modal */}
        <AnimatePresence>
          {chatbotModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="w-full max-w-4xl h-[92vh] max-h-[850px] relative shadow-2xl"
              >
                <ResultsChatbot
                  studentProfile={userProfile}
                  assessmentResults={{
                    dominantCode: traitStats.dominant?.cat || 'E',
                    dominantTrait: traitStats.dominant?.name || 'The Leader',
                    secondTrait: traitStats.secondary?.name || 'The Investigator',
                    percentages: traitStats.sorted?.reduce((acc, curr) => ({
                    ...acc,
                    [curr.name]: curr.pct,
                    [curr.cat]: curr.pct,
                    [curr.name.replace(/^The\s+/i, '')]: curr.pct
                  }), {}),
                    workingStyle: sliderAnswers,
                    topCareers: recommendedCareers.map((c) => ({
                      title: c.title,
                      match: c.match,
                      outlook: c.outlook
                    }))
                  }}
                  onNavigateToCareers={() => {
                    setChatbotModalOpen(false);
                    setActiveNav('careers');
                  }}
                  onBookCounsellor={() => {
                    showToast('📅 Connecting with human counselling team...');
                  }}
                  onBackToResults={() => {
                    setChatbotModalOpen(false);
                    setActiveNav('assessment');
                    setStage('results');
                  }}
                  isDark={isDark}
                  onClose={() => setChatbotModalOpen(false)}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
