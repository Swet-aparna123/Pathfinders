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
  Briefcase,
  RotateCcw,
  Sliders,
  TrendingUp,
  Zap,
  CheckCircle2,
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
  ExternalLink,
  Code,
  Layers,
  FileText,
  Clock,
  Building2,
  Search,
  Plus,
  Trash2,
  Share2,
  FolderGit2
} from 'lucide-react';
import ConfettiSparkles from '@/components/ConfettiSparkles';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { userProfileService } from '@/lib/userProfileService';
import LogoutButton from '@/components/LogoutButton';
import {
  ASSESSMENT_QUESTIONS,
  DEFAULT_ASSESSMENT_ANSWERS,
  calculateAssessmentResults,
  PIVOT_TARGETS_CATALOG
} from '@/lib/careerAssessmentEngine';
import { VERIFIED_CAREER_DATABASE } from '@/lib/verifiedCareerDatabase';

// 8 Verified Switcher Careers in PathFinders Database
const SWITCHER_CAREER_SLUGS = [
  'data-bi-analyst',
  'business-analyst',
  'ux-product-designer',
  'digital-marketing-growth-analyst',
  'project-program-manager',
  'ld-instructional-designer',
  'financial-analyst-fpa-risk',
  'ai-application-developer'
];

// Rapid Fire 10 Decision Scenarios for Working Professionals
const RAPID_FIRE_QUESTIONS = [
  {
    id: 'rf1',
    dimension: 'stability_risk',
    title: 'Stability vs. High-Growth Risk',
    prompt: 'A well-funded AI startup offers a 45% pay jump with equity, while an established MNC offers rock-solid job stability and structured hours. Where do you lean?',
    optionA: {
      text: 'The AI Startup — I embrace calculated risk for rapid growth',
      signal: 'High Risk Appetite & Innovation Drive',
      lean: 'risk',
      score: { 'ai-application-developer': 4, 'ux-product-designer': 3, 'digital-marketing-growth-analyst': 3 }
    },
    optionB: {
      text: 'The Established MNC — Predictable trajectory & security first',
      signal: 'System Stability & Structured Governance',
      lean: 'stability',
      score: { 'project-program-manager': 4, 'business-analyst': 4, 'financial-analyst-fpa-risk': 4 }
    }
  },
  {
    id: 'rf2',
    dimension: 'solo_team',
    title: 'Independent Deep-Work vs. Team Synergy',
    prompt: 'How do you do your best work throughout the week?',
    optionA: {
      text: 'In uninterrupted flow state: Head-down deep analysis, code, or design',
      signal: 'Specialist Craft & Deep Execution',
      lean: 'solo',
      score: { 'data-bi-analyst': 4, 'ai-application-developer': 4, 'financial-analyst-fpa-risk': 3 }
    },
    optionB: {
      text: 'In active collaboration: Brainstorming, leading scrums, and aligning teams',
      signal: 'Cross-Functional Leadership & Facilitation',
      lean: 'team',
      score: { 'project-program-manager': 5, 'ld-instructional-designer': 4, 'business-analyst': 3 }
    }
  },
  {
    id: 'rf3',
    dimension: 'technical_creative',
    title: 'Technical Depth vs. Creative Strategy',
    prompt: 'When tackling a new problem, which approach gives you the most satisfaction?',
    optionA: {
      text: 'Mathematical logic, SQL pipelines, and robust system architecture',
      signal: 'Rigorous Analytical Precision',
      lean: 'technical',
      score: { 'ai-application-developer': 5, 'data-bi-analyst': 4, 'financial-analyst-fpa-risk': 4 }
    },
    optionB: {
      text: 'User journey mapping, storytelling, design wireframes, or marketing hooks',
      signal: 'Creative Empathy & Narrative Strategy',
      lean: 'creative',
      score: { 'ux-product-designer': 5, 'digital-marketing-growth-analyst': 4, 'ld-instructional-designer': 4 }
    }
  },
  {
    id: 'rf4',
    dimension: 'leader_specialist',
    title: 'People Leadership vs. Domain Specialist',
    prompt: 'Picture your target role in 24 months. What is your ideal daily impact?',
    optionA: {
      text: 'Leading project milestones, mentoring team members, and clearing roadblocks',
      signal: 'Strategic Orchestration & People Enablement',
      lean: 'leader',
      score: { 'project-program-manager': 5, 'business-analyst': 4, 'ld-instructional-designer': 3 }
    },
    optionB: {
      text: 'Being the go-to subject matter expert whose technical decisions set the standard',
      signal: 'Subject Matter Mastery & Technical Authority',
      lean: 'specialist',
      score: { 'ai-application-developer': 5, 'data-bi-analyst': 4, 'financial-analyst-fpa-risk': 4 }
    }
  },
  {
    id: 'rf5',
    dimension: 'remote_office',
    title: 'Remote Autonomy vs. In-Office Energy',
    prompt: 'What work environment fuels your daily focus and long-term stamina?',
    optionA: {
      text: 'Fully remote with asynchronous tools and location flexibility',
      signal: 'Autonomous Self-Management',
      lean: 'remote',
      score: { 'ai-application-developer': 3, 'data-bi-analyst': 3, 'ux-product-designer': 3 }
    },
    optionB: {
      text: 'Hybrid or on-site with vibrant whiteboard discussions and in-person energy',
      signal: 'Direct Interpersonal Resonance',
      lean: 'office',
      score: { 'project-program-manager': 4, 'ld-instructional-designer': 3, 'business-analyst': 3 }
    }
  },
  {
    id: 'rf6',
    dimension: 'salary_balance',
    title: 'High Compensation Growth vs. Work-Life Balance',
    prompt: 'What matters more for your immediate next chapter?',
    optionA: {
      text: 'Maximum market value: Target top-percentile compensation & rapid promotions',
      signal: 'High Velocity Value Maximizer',
      lean: 'salary',
      score: { 'ai-application-developer': 5, 'financial-analyst-fpa-risk': 4, 'data-bi-analyst': 3 }
    },
    optionB: {
      text: 'Sustainable cadence: Predictable working hours and protected personal time',
      signal: 'Sustainable Long-Term Equilibrium',
      lean: 'balance',
      score: { 'ld-instructional-designer': 5, 'business-analyst': 4, 'ux-product-designer': 3 }
    }
  },
  {
    id: 'rf7',
    dimension: 'structure_flexibility',
    title: 'Structured Operations vs. Flexible Exploration',
    prompt: 'How do you prefer your project backlog to look?',
    optionA: {
      text: 'Well-defined specs, clear Jira acceptance criteria, and organized sprints',
      signal: 'Methodical Process & Clarity',
      lean: 'structured',
      score: { 'project-program-manager': 4, 'financial-analyst-fpa-risk': 4, 'business-analyst': 4 }
    },
    optionB: {
      text: 'Ambiguous, open-ended problem statements where I define the solution path',
      signal: 'Exploratory Problem-Framing',
      lean: 'flexible',
      score: { 'ai-application-developer': 4, 'ux-product-designer': 4, 'digital-marketing-growth-analyst': 4 }
    }
  },
  {
    id: 'rf8',
    dimension: 'people_technology',
    title: 'Human Connections vs. Technology & Code',
    prompt: 'At the end of a successful day, what makes you feel you won?',
    optionA: {
      text: 'A difficult stakeholder agreed on scope, or a mentee had an epiphany',
      signal: 'Human Transformation & Consensus',
      lean: 'people',
      score: { 'ld-instructional-designer': 5, 'project-program-manager': 4, 'business-analyst': 4 }
    },
    optionB: {
      text: 'A clean script ran without errors, or an optimized model beat benchmark loss',
      signal: 'System Optimization & Deterministic Build',
      lean: 'tech',
      score: { 'ai-application-developer': 5, 'data-bi-analyst': 5, 'financial-analyst-fpa-risk': 3 }
    }
  },
  {
    id: 'rf9',
    dimension: 'new_tools_mastery',
    title: 'Continuous New Tooling vs. Deep Domain Mastery',
    prompt: 'How do you approach the modern explosion of tech tools and frameworks?',
    optionA: {
      text: 'I love trying new AI libraries, vector databases, and frameworks every weekend',
      signal: 'Continuous Tool Exploration & Early Adoption',
      lean: 'tools',
      score: { 'ai-application-developer': 5, 'digital-marketing-growth-analyst': 4, 'ux-product-designer': 3 }
    },
    optionB: {
      text: 'I prefer mastering core principles: Business fundamentals, SQL, statistics, and finance',
      signal: 'Foundational Principles & Durability',
      lean: 'mastery',
      score: { 'financial-analyst-fpa-risk': 5, 'business-analyst': 4, 'data-bi-analyst': 4 }
    }
  },
  {
    id: 'rf10',
    dimension: 'build_optimize',
    title: 'Greenfield 0-to-1 Building vs. System Optimization',
    prompt: 'Given your choice of high-impact initiative:',
    optionA: {
      text: 'Starting a brand-new project from scratch with blank canvas autonomy',
      signal: 'Greenfield Creator & 0-to-1 Originator',
      lean: 'build',
      score: { 'ai-application-developer': 4, 'ux-product-designer': 4, 'digital-marketing-growth-analyst': 4 }
    },
    optionB: {
      text: 'Auditing an existing complex workflow to cut waste, boost speed, and scale efficiency',
      signal: 'Systems Optimizer & Scaling Specialist',
      lean: 'optimize',
      score: { 'project-program-manager': 5, 'data-bi-analyst': 5, 'business-analyst': 4 }
    }
  }
];

// Professional Upskilling Courses & Project Labs
const UPSKILLING_COURSES = [
  {
    id: 'sql-bi-mastery',
    title: 'Enterprise SQL, Data Modeling & Power BI Architecture',
    coversGap: 'SQL & Relational Databases',
    provider: 'PathFinders Professional Data Lab',
    certName: 'Certified Enterprise BI & SQL Architect',
    duration: '6 Weeks • 6–8 hrs/week',
    level: 'Beginner to Advanced',
    desc: 'Master complex multi-table joins, window functions, star schema modeling, and executive KPI dashboard creation.',
    syllabus: [
      { week: 'Week 1–2', topic: 'Advanced SQL: Window Functions, CTEs, Recursive Queries & Indexing' },
      { week: 'Week 3–4', topic: 'Dimensional Modeling: Kimball Star Schemas, Fact vs Dimension Design' },
      { week: 'Week 5–6', topic: 'Power BI & Tableau Executive Dashboards with Real-time Postgres Feeds' }
    ],
    projectLab: {
      name: 'E-Commerce 10M-Record Revenue & Churn Analytics Pipeline',
      stack: ['PostgreSQL', 'Power BI / Tableau', 'dbt', 'Python'],
      deliverable: 'Automated revenue attribution dashboard and warehouse schema published to portfolio.'
    }
  },
  {
    id: 'ai-app-dev',
    title: 'Applied Generative AI & Full-Stack LLM Engineering',
    coversGap: 'AI / LLM Integration & Modern APIs',
    provider: 'PathFinders Tech & DeepLearning.AI',
    certName: 'Certified AI Application Developer',
    duration: '8 Weeks • 8–10 hrs/week',
    level: 'Intermediate',
    desc: 'Build production-ready Retrieval-Augmented Generation (RAG) pipelines, LangChain agents, and vector search microservices.',
    syllabus: [
      { week: 'Week 1–2', topic: 'Python Async APIs, FastAPI microservices, and OpenAI / Claude SDKs' },
      { week: 'Week 3–4', topic: 'Vector Embeddings, ChromaDB / Pinecone, Chunking Strategies' },
      { week: 'Week 5–6', topic: 'Hybrid Search RAG, Citation Tracing, and Prompt Guardrails' },
      { week: 'Week 7–8', topic: 'Docker Containerization & Cloud Deployment on AWS / Render' }
    ],
    projectLab: {
      name: 'Enterprise Multi-Document Financial RAG Search Agent',
      stack: ['Python', 'FastAPI', 'LangChain', 'Pinecone', 'Next.js'],
      deliverable: 'Live web app allowing users to upload corporate 10-K PDFs and get verified answers with page citations.'
    }
  },
  {
    id: 'agile-pm-mastery',
    title: 'Agile Project & Program Delivery with Jira & Scrum',
    coversGap: 'Agile Execution & Stakeholder Leadership',
    provider: 'PathFinders Leadership Institute',
    certName: 'PathFinders Agile Delivery Professional (CAPM / PMI-PMP aligned)',
    duration: '5 Weeks • 5 hrs/week',
    level: 'All Experience Levels',
    desc: 'Translate business goals into sprint backlogs, manage risk registers, run sprint ceremonies, and align engineering leads with executive stakeholders.',
    syllabus: [
      { week: 'Week 1', topic: 'Scrum vs Kanban: Workflows, User Story Mapping & Acceptance Criteria' },
      { week: 'Week 2', topic: 'Jira Software Masterclass: Epics, Components, Burndown & Velocity Metrics' },
      { week: 'Week 3–4', topic: 'Cross-Functional Stakeholder Management & Conflict Resolution' },
      { week: 'Week 5', topic: 'PMP / CAPM Exam Preparation & Real-World Portfolio Defense' }
    ],
    projectLab: {
      name: 'FinTech Mobile Banking 0-to-1 Sprint Delivery Blueprint',
      stack: ['Jira Software', 'Confluence', 'Miro', 'Risk Matrix Tool'],
      deliverable: 'Complete product launch playbook with PRD, sprint board setup, burn-down reports, and stakeholder slide deck.'
    }
  },
  {
    id: 'ux-design-systems',
    title: 'UX / Product Design Systems & Human-Centered Research',
    coversGap: 'UX / Wireframing & Interaction Design',
    provider: 'PathFinders Design Guild',
    certName: 'Certified Digital Product Designer',
    duration: '7 Weeks • 7 hrs/week',
    level: 'Beginner to Intermediate',
    desc: 'Master qualitative user interviews, Figma auto-layout design systems, interactive prototyping, and usability testing protocols.',
    syllabus: [
      { week: 'Week 1–2', topic: 'User Research, Empathy Maps & Jobs-To-Be-Done (JTBD) Frameworks' },
      { week: 'Week 3–4', topic: 'Figma Mastery: Components, Variants, Auto-Layout 5.0, Design Tokens' },
      { week: 'Week 5–6', topic: 'Interactive Prototyping, Micro-interactions, and Accessibility Standards (WCAG 2.1)' },
      { week: 'Week 7', topic: 'Design System Case Study & Portfolio Presentation' }
    ],
    projectLab: {
      name: 'Healthcare Patient Portal Redesign & Design System Spec',
      stack: ['Figma', 'FigJam', 'Useberry', 'Storybook UI'],
      deliverable: 'Complete clickable Figma mobile & web prototype with interactive components and research deck.'
    }
  }
];

export default function CareerSwitcherDashboard() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Navigation State
  const [activeNav, setActiveNav] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  // Theme State (Dark Navy #0A0F1D default, Parchment #f3ead3 optional)
  const [isDark, setIsDark] = useState(true);

  // User Profile State
  const [profile, setProfile] = useState(() => userProfileService.getProfile());

  // Assessment State (12 Questions from careerAssessmentEngine.js)
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [assessmentAnswers, setAssessmentAnswers] = useState(() => {
    return profile?.assessmentAnswers || { ...DEFAULT_ASSESSMENT_ANSWERS };
  });
  const [assessmentCompleted, setAssessmentCompleted] = useState(() => {
    return Boolean(profile?.assessmentResults && Object.keys(profile.assessmentAnswers || {}).length >= 10);
  });

  // Rapid Fire State (10 Dilemma Scenarios)
  const [rapidFireStep, setRapidFireStep] = useState(0);
  const [rapidFireAnswers, setRapidFireAnswers] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('pathfinders_switcher_rapid_fire');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return {};
  });
  const [rapidFireCompleted, setRapidFireCompleted] = useState(() => {
    return Boolean(profile?.rapidFireCompleted || (typeof window !== 'undefined' && localStorage.getItem('pathfinders_switcher_rapid_fire_done')));
  });
  const [rfSecondsLeft, setRfSecondsLeft] = useState(15);
  const [rfTimerActive, setRfTimerActive] = useState(false);

  // Selected Career for Customized Roadmap
  const [selectedCareerSlug, setSelectedCareerSlug] = useState('data-bi-analyst');
  const [targetTransitionMonths, setTargetTransitionMonths] = useState(6);
  const [activeLabModal, setActiveLabModal] = useState(null);

  // Career Explorer Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('all');
  const [savedCareers, setSavedCareers] = useState(['data-bi-analyst', 'ai-application-developer']);

  // Sync with profile service on mount
  useEffect(() => {
    const handleProfileUpdate = (e) => {
      if (e.detail) setProfile(e.detail);
    };
    window.addEventListener('pathfinders_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('pathfinders_profile_updated', handleProfileUpdate);
  }, []);

  // Rapid Fire countdown timer effect
  useEffect(() => {
    let timer;
    if (activeNav === 'rapid-fire' && !rapidFireCompleted && rfTimerActive && rfSecondsLeft > 0) {
      timer = setInterval(() => {
        setRfSecondsLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeNav, rapidFireCompleted, rfTimerActive, rfSecondsLeft]);

  // Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Switcher Assessment Calculations
  const calculatedAssessment = useMemo(() => {
    return calculateAssessmentResults(assessmentAnswers, profile?.targetPivot || 'Data & Business Intelligence Analyst');
  }, [assessmentAnswers, profile?.targetPivot]);

  // Rapid Fire Behavioral Reflex Dimensions calculation
  const rapidFireMetrics = useMemo(() => {
    let riskCount = 0;
    let teamCount = 0;
    let techCount = 0;
    let leaderCount = 0;
    let salaryCount = 0;
    let structuredCount = 0;
    const scores = {};

    SWITCHER_CAREER_SLUGS.forEach((slug) => {
      scores[slug] = 0;
    });

    Object.entries(rapidFireAnswers).forEach(([qId, choice]) => {
      const q = RAPID_FIRE_QUESTIONS.find((item) => item.id === qId);
      if (!q) return;
      const chosenOpt = choice === 'A' ? q.optionA : q.optionB;
      if (chosenOpt.lean === 'risk') riskCount++;
      if (chosenOpt.lean === 'team') teamCount++;
      if (chosenOpt.lean === 'technical' || chosenOpt.lean === 'tech') techCount++;
      if (chosenOpt.lean === 'leader') leaderCount++;
      if (chosenOpt.lean === 'salary') salaryCount++;
      if (chosenOpt.lean === 'structured') structuredCount++;

      if (chosenOpt.score) {
        Object.entries(chosenOpt.score).forEach(([slug, val]) => {
          scores[slug] = (scores[slug] || 0) + val;
        });
      }
    });

    let archetype = 'Strategic Problem-Solver';
    if (techCount >= 3 && riskCount >= 2) archetype = 'Agile AI & Tech Pioneer';
    else if (leaderCount >= 3) archetype = 'Executive Program Orchestrator';
    else if (techCount >= 3) archetype = 'Analytical Systems Architect';
    else if (teamCount >= 3) archetype = 'Human-Centered Growth Catalyst';

    return {
      riskPct: Math.round((riskCount / 4) * 100),
      teamPct: Math.round((teamCount / 4) * 100),
      techPct: Math.round((techCount / 5) * 100),
      leaderPct: Math.round((leaderCount / 3) * 100),
      archetype,
      scores
    };
  }, [rapidFireAnswers]);

  // Scored Career Recommendations (8 Switcher Careers from verifiedCareerDatabase.js)
  const scoredCareers = useMemo(() => {
    const list = SWITCHER_CAREER_SLUGS.map((slug) => {
      const verified = VERIFIED_CAREER_DATABASE[slug] || {};
      let baseMatch = 82;

      // Match calibration from 12-Q assessment answers
      if (calculatedAssessment?.pivotTarget && verified.title?.toLowerCase().includes(calculatedAssessment.pivotTarget.toLowerCase().slice(0, 8))) {
        baseMatch += 14;
      }

      // Add rapid fire reflex bonus (up to +8%)
      const rfBonus = (rapidFireMetrics.scores[slug] || 0) * 1.5;
      const finalMatch = Math.min(99, Math.max(74, Math.round(baseMatch + rfBonus)));

      return {
        slug,
        title: verified.title || slug.replace(/-/g, ' ').toUpperCase(),
        traitCode: verified.traitCode || 'Professional Pivot',
        suits: verified.suits || 'Working professionals seeking modern, future-proof domain progression.',
        pathway: verified.pathway || 'Current Role → Skill Gap Upskilling → Project Labs → Verification → Junior/Mid Pivot',
        growth: verified.growth || 'Junior Specialist → Mid Lead → Senior Principal → Director / Head of Domain',
        backup: verified.backup || 'Related analyst or operations track with overlapping tools.',
        abroad: verified.abroad || 'High global demand in EU, UK, Middle East, and North America.',
        salary: slug === 'ai-application-developer' ? '₹14L – ₹32L/yr' : slug === 'financial-analyst-fpa-risk' ? '₹10L – ₹26L/yr' : '₹8L – ₹22L/yr',
        timeline: slug === 'ai-application-developer' ? '6–8 Months' : slug === 'business-analyst' ? '3–5 Months' : '4–6 Months',
        match: finalMatch,
        keySkills: slug === 'ai-application-developer'
          ? ['Python', 'FastAPI', 'Vector Databases', 'LangChain', 'Docker']
          : slug === 'data-bi-analyst'
          ? ['SQL Queries', 'Power BI / Tableau', 'Data Modeling', 'Excel', 'Pandas']
          : slug === 'ux-product-designer'
          ? ['Figma', 'Wireframing', 'User Research', 'Design Systems', 'Usability Testing']
          : slug === 'project-program-manager'
          ? ['Agile & Scrum', 'Jira Software', 'Risk Mitigation', 'Stakeholder Comms', 'PMP Standards']
          : slug === 'business-analyst'
          ? ['Requirements Gathering', 'Process Mapping (BPMN)', 'SQL', 'User Stories', 'KPI Dashboards']
          : slug === 'digital-marketing-growth-analyst'
          ? ['Performance Marketing', 'Google Analytics 4', 'SQL Funnels', 'A/B Testing', 'SEO Strategy']
          : slug === 'financial-analyst-fpa-risk'
          ? ['Financial Modeling', 'DCF Valuation', 'Variance Analysis', 'Advanced Excel', 'Risk Profiling']
          : ['Instructional Design (ADDIE)', 'Curriculum Architecture', 'LMS Platforms', 'Corporate Upskilling', 'Miro']
      };
    });

    return list.sort((a, b) => b.match - a.match);
  }, [calculatedAssessment, rapidFireMetrics]);

  // Selected Career Object
  const activeCareer = useMemo(() => {
    return scoredCareers.find((c) => c.slug === selectedCareerSlug) || scoredCareers[0];
  }, [scoredCareers, selectedCareerSlug]);

  // Handle Assessment Answer Selection
  const handleSelectAssessmentOption = (qId, optId) => {
    const nextAnswers = { ...assessmentAnswers, [qId]: optId };
    setAssessmentAnswers(nextAnswers);

    // Save to userProfileService
    userProfileService.saveProfile({
      assessmentAnswers: nextAnswers
    });

    // Auto-advance
    if (currentQIndex + 1 < ASSESSMENT_QUESTIONS.length) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setAssessmentCompleted(true);
      setConfettiTrigger((p) => p + 1);
      showToast('🎉 Career Switch Assessment completed! AI recommendations calibrated.');
    }
  };

  // Handle Rapid Fire Option Selection
  const handleSelectRapidFireOption = (choiceLetter) => {
    const currentQ = RAPID_FIRE_QUESTIONS[rapidFireStep];
    const next = { ...rapidFireAnswers, [currentQ.id]: choiceLetter };
    setRapidFireAnswers(next);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('pathfinders_switcher_rapid_fire', JSON.stringify(next));
      } catch (e) {}
    }

    if (rapidFireStep + 1 < RAPID_FIRE_QUESTIONS.length) {
      setRapidFireStep(rapidFireStep + 1);
      setRfSecondsLeft(15);
    } else {
      setRapidFireCompleted(true);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('pathfinders_switcher_rapid_fire_done', 'true');
        } catch (e) {}
      }
      userProfileService.saveRapidFireResult({
        primaryDimension: rapidFireMetrics.archetype,
        summary: `Demonstrates high agility and ${rapidFireMetrics.archetype} problem-solving reflexes under pressure.`
      });
      setConfettiTrigger((p) => p + 1);
      showToast('⚡ Rapid Fire Discovery Completed! Professional behavioral reflexes mapped.');
    }
  };

  // Reset Assessment
  const handleResetAssessment = () => {
    setAssessmentAnswers({ ...DEFAULT_ASSESSMENT_ANSWERS });
    setAssessmentCompleted(false);
    setCurrentQIndex(0);
    userProfileService.saveProfile({
      assessmentAnswers: { ...DEFAULT_ASSESSMENT_ANSWERS }
    });
    showToast('Assessment reset. Starting fresh!');
  };

  // Reset Rapid Fire
  const handleResetRapidFire = () => {
    setRapidFireAnswers({});
    setRapidFireCompleted(false);
    setRapidFireStep(0);
    setRfSecondsLeft(15);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('pathfinders_switcher_rapid_fire');
        localStorage.removeItem('pathfinders_switcher_rapid_fire_done');
      } catch (e) {}
    }
    showToast('Rapid Fire reset. Ready to test again!');
  };

  // Filtered Explorer Careers
  const filteredCareers = useMemo(() => {
    return scoredCareers.filter((career) => {
      const matchSearch =
        career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        career.suits.toLowerCase().includes(searchQuery.toLowerCase()) ||
        career.keySkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      if (domainFilter === 'all') return matchSearch;
      if (domainFilter === 'tech' && (career.slug.includes('ai') || career.slug.includes('data'))) return matchSearch;
      if (domainFilter === 'business' && (career.slug.includes('business') || career.slug.includes('project'))) return matchSearch;
      if (domainFilter === 'design' && career.slug.includes('ux')) return matchSearch;
      if (domainFilter === 'finance' && career.slug.includes('financial')) return matchSearch;
      return matchSearch;
    });
  }, [scoredCareers, searchQuery, domainFilter]);

  // User display name & initials
  const displayName = profile?.fullName || profile?.firstName ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : 'Professional Pivot';
  const displayRole = profile?.currentJobRole || 'Software Professional';
  const displayIndustry = profile?.currentIndustry || 'Technology & Services';
  const displayExp = profile?.expYears || '4+ Years';

  const getInitials = (str) => {
    if (!str) return 'CS';
    const parts = str.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0A0F1D] flex items-center justify-center font-body text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 rounded-full border-2 border-[#D4A034] border-t-transparent animate-spin" />
          <span className="font-mono text-xs text-[#D4A034] tracking-wider uppercase font-semibold">
            Loading Career Switcher Portal...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-body flex flex-col lg:flex-row relative overflow-x-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#0A0F1D] text-slate-100' : 'bg-[#f3ead3] text-[#1C2536]'
    }`}>
      <ConfettiSparkles trigger={confettiTrigger} />

      {/* TOAST ALERTS */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[100] max-w-md rounded-xl border border-[#D4A034] bg-[#101B2E] p-4 shadow-2xl text-xs font-semibold text-white flex items-center gap-3 backdrop-blur-xl"
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
            <span className="h-6 w-6 rounded-full bg-[#D4A034]/20 border border-[#D4A034] flex items-center justify-center text-xs text-[#D4A034]">🧭</span>
            <span>PathFinders</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher compact={true} />
          <button
            type="button"
            onClick={() => setIsDark(!isDark)}
            className="p-1.5 rounded-lg border border-slate-700 text-[#D4A034] hover:bg-slate-800 cursor-pointer"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Theme`}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4 text-amber-500" />}
          </button>
          <span className="text-xs font-mono text-[#D4A034] font-bold bg-[#D4A034]/10 border border-[#D4A034]/30 px-2.5 py-1 rounded-full">
            {assessmentCompleted ? 'Ready' : `Q ${currentQIndex + 1}/12`}
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
      {/* LEFT SIDEBAR (Identical Structure to Student Portal)     */}
      {/* ======================================================== */}
      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-64 lg:w-72 bg-[#101B2E] border-r border-slate-800 p-3.5 sm:p-4 flex flex-col justify-between overflow-y-auto overflow-x-hidden transition-transform duration-300 ${
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } shadow-2xl text-white`}>
        
        <div>
          {/* Logo Header */}
          <div className="pb-3 mb-2 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D4A034] bg-[#D4A034]/15 shadow-[0_0_12px_rgba(212,160,52,0.3)]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2 L9.6 7.6 L8 14 L6.4 7.6 Z" fill="#D4A034" />
                </svg>
              </span>
              <div>
                <span className="font-serif font-bold text-base text-white group-hover:text-[#D4A034] transition-colors tracking-wide">PathFinders</span>
                <span className="block text-[0.58rem] font-mono text-[#D4A034] uppercase tracking-widest font-semibold">CAREER SWITCHER PORTAL</span>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setIsDark(!isDark)}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-700 text-[#D4A034] hover:bg-slate-800 hover:border-[#D4A034] transition-all cursor-pointer shadow-sm flex items-center justify-center shrink-0"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Theme`}
            >
              {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 font-body">
            
            {/* 1. Dashboard Overview */}
            <button
              type="button"
              onClick={() => { setActiveNav('dashboard'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                activeNav === 'dashboard'
                  ? 'bg-[#1C273C] text-white border border-[#D4A034]/50 shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4A034]/15 border border-[#D4A034]/30 text-[#D4A034] shrink-0 shadow-sm">
                <LayoutDashboard className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-sm block text-white">Dashboard</span>
                <span className="text-[0.65rem] text-slate-400 font-mono block">Milestones &amp; Pivot Stats</span>
              </div>
            </button>

            {/* 2. Rapid Fire Discovery */}
            <button
              type="button"
              onClick={() => { setActiveNav('rapid-fire'); setMobileSidebarOpen(false); }}
              className={`w-full flex flex-col gap-1 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                activeNav === 'rapid-fire'
                  ? 'bg-[#1C273C] text-white border border-[#D4A034]/50 shadow-lg'
                  : !rapidFireCompleted
                  ? 'bg-amber-950/30 border border-amber-500/40 text-amber-200 hover:bg-amber-950/45 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    rapidFireCompleted
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                      : 'bg-[#D4A034]/20 border border-[#D4A034]/40 text-[#D4A034] animate-pulse'
                  } shrink-0 shadow-sm`}>
                    <Zap className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-sm block text-white">Rapid Fire</span>
                    <span className="text-[0.65rem] text-slate-400 font-mono block truncate">
                      {rapidFireCompleted ? '10 Scenarios Done ✓' : 'Action Required (2 mins)'}
                    </span>
                  </div>
                </div>
                <span className={`text-[0.65rem] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap ${
                  rapidFireCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-[#D4A034]/20 text-[#D4A034] border border-[#D4A034]/40'
                }`}>
                  {rapidFireCompleted ? 'Mapped' : 'Start'}
                </span>
              </div>
            </button>

            {/* 3. Detailed Pivot Assessment (Original 12 Questions Preserved) */}
            <button
              type="button"
              onClick={() => { setActiveNav('assessment'); setMobileSidebarOpen(false); }}
              className={`w-full flex flex-col gap-1 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                activeNav === 'assessment'
                  ? 'bg-[#1C273C] text-white border border-[#D4A034]/50 shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4A034]/15 border border-[#D4A034]/30 text-[#D4A034] shrink-0 shadow-sm">
                    <ClipboardList className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-sm block text-white">Pivot Assessment</span>
                    <span className="text-[0.65rem] text-slate-400 font-mono block truncate">
                      {assessmentCompleted ? 'Completed (12 Qs) ✓' : `Question ${currentQIndex + 1} of 12`}
                    </span>
                  </div>
                </div>
                <span className="text-[0.65rem] font-mono font-bold bg-[#D4A034]/20 border border-[#D4A034]/40 text-[#D4A034] px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                  {assessmentCompleted ? '100%' : `${Math.round(((currentQIndex) / 12) * 100)}%`}
                </span>
              </div>
            </button>

            {/* 4. AI Career Recommendations */}
            <button
              type="button"
              onClick={() => { setActiveNav('recommendations'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                activeNav === 'recommendations'
                  ? 'bg-[#1C273C] text-white border border-[#D4A034]/50 shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0 shadow-sm">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-sm block text-white">Recommendations</span>
                  <span className="text-[0.65rem] text-slate-400 font-mono block">8 Verified Switcher Paths</span>
                </div>
              </div>
              <span className="flex items-center gap-1 text-[0.65rem] font-mono font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                <Unlock className="h-2.5 w-2.5" /> 8 Matches
              </span>
            </button>

            {/* 5. Transferable Skills & Gap Analysis */}
            <button
              type="button"
              onClick={() => { setActiveNav('skills'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                activeNav === 'skills'
                  ? 'bg-[#1C273C] text-white border border-[#D4A034]/50 shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4A034]/15 border border-[#D4A034]/30 text-[#D4A034] shrink-0 shadow-sm">
                <Activity className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-sm block text-white">Skills &amp; Gap Matrix</span>
                <span className="text-[0.65rem] text-slate-400 font-mono block">9 Core Competencies</span>
              </div>
            </button>

            {/* 6. Transition Roadmap */}
            <button
              type="button"
              onClick={() => { setActiveNav('roadmap'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                activeNav === 'roadmap'
                  ? 'bg-[#1C273C] text-white border border-[#D4A034]/50 shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0 shadow-sm">
                <Map className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-sm block text-white">Transition Roadmap</span>
                <span className="text-[0.65rem] text-slate-400 font-mono block truncate">6-Phase Customized Pivot</span>
              </div>
            </button>

            {/* 7. Career Explorer */}
            <button
              type="button"
              onClick={() => { setActiveNav('explorer'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                activeNav === 'explorer'
                  ? 'bg-[#1C273C] text-white border border-[#D4A034]/50 shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4A034]/15 border border-[#D4A034]/30 text-[#D4A034] shrink-0 shadow-sm">
                <Compass className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-sm block text-white">Career Explorer</span>
                <span className="text-[0.65rem] text-slate-400 font-mono block">Filter &amp; Salary Tiers</span>
              </div>
            </button>

            {/* 8. Upskilling & Project Labs */}
            <button
              type="button"
              onClick={() => { setActiveNav('resources'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                activeNav === 'resources'
                  ? 'bg-[#1C273C] text-white border border-[#D4A034]/50 shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4A034]/15 border border-[#D4A034]/30 text-[#D4A034] shrink-0 shadow-sm">
                <Code className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-sm block text-white">Upskilling &amp; Labs</span>
                <span className="text-[0.65rem] text-slate-400 font-mono block">4 Hands-on Projects</span>
              </div>
            </button>

            {/* 9. Professional Profile */}
            <button
              type="button"
              onClick={() => { setActiveNav('profile'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                activeNav === 'profile'
                  ? 'bg-[#1C273C] text-white border border-[#D4A034]/50 shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4A034]/15 border border-[#D4A034]/30 text-[#D4A034] shrink-0 shadow-sm">
                <User className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-sm block text-white">Professional Profile</span>
                <span className="text-[0.65rem] text-slate-400 font-mono block">Experience &amp; Skills</span>
              </div>
            </button>

          </nav>
        </div>

        {/* Sidebar Footer: Notifications & User Profile Dropdown */}
        <div className="pt-2.5 border-t border-slate-800 space-y-1.5 relative">
          
          {/* Notifications Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setNotificationsOpen(!notificationsOpen); setAvatarMenuOpen(false); }}
              className="w-full flex items-center justify-between p-2 px-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900/60 transition-all text-xs font-semibold"
            >
              <span className="flex items-center gap-2">
                <Bell className="h-3.5 w-3.5 text-[#D4A034]" />
                <span>Pivot Notifications</span>
              </span>
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
                    <span>Active Notifications</span>
                    <button onClick={() => setNotificationsOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                  </div>
                  <div className="p-2 rounded bg-slate-900/80 text-slate-300 space-y-0.5 text-[0.72rem]">
                    <span className="font-bold text-emerald-400 flex items-center gap-1">✓ Career Matches Ready</span>
                    <span>8 switcher pathways calibrated across your experience &amp; assessment.</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900/80 text-slate-300 space-y-0.5 text-[0.72rem]">
                    <span className="font-bold text-[#D4A034] flex items-center gap-1">⚡ Rapid Fire Calibrated</span>
                    <span>Archetype: {rapidFireMetrics.archetype}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setAvatarMenuOpen(!avatarMenuOpen); setNotificationsOpen(false); }}
              className="w-full flex items-center justify-between p-2 px-2.5 rounded-xl text-left bg-slate-900/60 border border-slate-700/80 hover:border-[#D4A034] hover:bg-slate-900 transition-all cursor-pointer shadow-xs group overflow-hidden"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1 mr-1">
                <span className="h-7 w-7 rounded-full bg-slate-800 text-[#D4A034] font-bold flex items-center justify-center text-xs border border-slate-700 group-hover:border-[#D4A034] overflow-hidden shrink-0 uppercase">
                  {getInitials(displayName)}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-xs text-white block leading-none truncate" title={displayName}>{displayName}</span>
                  <span className="text-[0.65rem] text-slate-400 block mt-1 font-mono truncate" title={displayRole}>{displayRole}</span>
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
                  className="absolute bottom-16 left-0 right-0 z-50 rounded-2xl border border-slate-700/90 bg-[#101B2E] p-2 shadow-2xl space-y-1 text-xs text-white backdrop-blur-xl"
                >
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <span className="font-bold text-sm text-white block truncate">{displayName}</span>
                    <span className="text-[0.7rem] text-slate-400 font-mono block truncate">{displayIndustry} • {displayExp}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => { setAvatarMenuOpen(false); setActiveNav('profile'); }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2.5 transition-all text-xs font-medium cursor-pointer"
                  >
                    <span>👤</span>
                    <span>Edit Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setIsDark(!isDark); }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white flex items-center justify-between transition-all text-xs font-medium cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span>{isDark ? '☀️' : '🌙'}</span>
                      <span>{isDark ? 'Light Theme' : 'Dark Theme'}</span>
                    </div>
                    <span className="text-[0.65rem] font-mono bg-[#D4A034]/20 border border-[#D4A034]/40 text-[#D4A034] px-1.5 py-0.5 rounded font-bold">
                      {isDark ? 'DARK' : 'LIGHT'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { handleResetAssessment(); setAvatarMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2.5 text-xs font-medium cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-[#D4A034]" />
                    <span>Retake 12-Q Assessment</span>
                  </button>

                  <div className="border-t border-slate-800/80 my-1" />

                  <LogoutButton
                    onLoggedOut={() => setAvatarMenuOpen(false)}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 flex items-center gap-2.5 text-xs font-semibold cursor-pointer block"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </aside>

      {/* ======================================================== */}
      {/* MAIN CONTENT AREA                                        */}
      {/* ======================================================== */}
      <main className="flex-1 lg:pl-72 py-6 px-4 sm:px-8 max-w-[1400px] mx-auto space-y-7">

        {/* ======================================================== */}
        {/* VIEW 1: DASHBOARD OVERVIEW (activeNav === 'dashboard')    */}
        {/* ======================================================== */}
        {activeNav === 'dashboard' && (
          <div className="space-y-7">

            {/* Welcome Banner */}
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm relative overflow-hidden transition-all duration-300 ${
              isDark ? 'bg-[#101B2E] border-slate-700/80 text-white' : 'bg-[#FDFBF7] border-[#E6DCC8] text-[#1C2536]'
            }`}>
              <div className="relative z-10 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A034]/15 border border-[#D4A034]/30 text-[#D4A034] text-xs font-mono font-bold">
                    <Briefcase className="h-3.5 w-3.5" />
                    PROFESSIONAL TRANSITION EXPEDITION
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono px-3 py-1 rounded-full border ${
                      isDark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-stone-100 border-stone-300 text-stone-700'
                    }`}>
                      Current: <strong>{displayRole}</strong> ({displayExp})
                    </span>
                  </div>
                </div>

                <h1 className={`font-serif text-2xl sm:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                  Welcome back, {displayName}
                </h1>

                <p className={`text-sm sm:text-base max-w-3xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>
                  Your personalized career transition portal maps your current professional baseline to high-growth target roles. Review your transferable competencies, verify critical skill gaps, and explore concrete milestone roadmaps.
                </p>

                {/* 5-Waypoint Milestone Stepper */}
                <div className={`mt-6 pt-6 border-t grid grid-cols-2 sm:grid-cols-5 gap-3 ${
                  isDark ? 'border-slate-800' : 'border-[#E6DCC8]'
                }`}>
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50 border-stone-200'}`}>
                    <div className="flex items-center gap-1 text-[0.68rem] font-mono font-bold text-emerald-500">
                      <CheckCircle2 className="h-3.5 w-3.5" /> 01. Profile
                    </div>
                    <div className={`text-[0.65rem] mt-0.5 truncate ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>
                      {displayRole}
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50 border-stone-200'}`}>
                    <div className="flex items-center gap-1 text-[0.68rem] font-mono font-bold text-emerald-500">
                      <CheckCircle2 className="h-3.5 w-3.5" /> 02. Skills Matrix
                    </div>
                    <div className={`text-[0.65rem] mt-0.5 truncate ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>
                      9 Competencies Calibrated
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border ${
                    rapidFireCompleted
                      ? (isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50 border-stone-200')
                      : 'bg-amber-950/30 border-amber-500/40 ring-1 ring-amber-500/30'
                  }`}>
                    <div className={`flex items-center gap-1 text-[0.68rem] font-mono font-bold ${rapidFireCompleted ? 'text-emerald-500' : 'text-[#D4A034]'}`}>
                      {rapidFireCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Zap className="h-3.5 w-3.5" />}
                      03. Rapid Fire
                    </div>
                    <div className={`text-[0.65rem] mt-0.5 truncate ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>
                      {rapidFireCompleted ? '10 Scenarios Done' : 'Action Required'}
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border ${
                    assessmentCompleted
                      ? (isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50 border-stone-200')
                      : 'bg-amber-950/20 border-amber-500/30'
                  }`}>
                    <div className={`flex items-center gap-1 text-[0.68rem] font-mono font-bold ${assessmentCompleted ? 'text-emerald-500' : 'text-[#D4A034]'}`}>
                      {assessmentCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : <ClipboardList className="h-3.5 w-3.5" />}
                      04. Assessment
                    </div>
                    <div className={`text-[0.65rem] mt-0.5 truncate ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>
                      {assessmentCompleted ? '12 Qs Analyzed' : `Q ${currentQIndex + 1}/12`}
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50 border-stone-200'}`}>
                    <div className="flex items-center gap-1 text-[0.68rem] font-mono font-bold text-emerald-500">
                      <Target className="h-3.5 w-3.5" /> 05. Target Pivot
                    </div>
                    <div className={`text-[0.65rem] mt-0.5 truncate font-semibold text-[#D4A034]`}>
                      {activeCareer.title}
                    </div>
                  </div>
                </div>

                {/* Quick Call to Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveNav('recommendations')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#B8860B] to-[#D4A034] text-white font-mono text-xs font-bold shadow-md hover:scale-105 transition-all cursor-pointer"
                  >
                    <Briefcase className="h-4 w-4" />
                    <span>View 8 Career Matches</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveNav('rapid-fire')}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-mono font-bold transition-all cursor-pointer ${
                      isDark
                        ? 'border-slate-700 bg-slate-900 text-slate-200 hover:border-[#D4A034]'
                        : 'border-stone-300 bg-white text-stone-800 hover:border-[#B8860B]'
                    }`}
                  >
                    <Zap className="h-4 w-4 text-[#D4A034]" />
                    <span>{rapidFireCompleted ? 'Review Rapid Fire Reflexes' : 'Take 2-Min Rapid Fire'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveNav('skills')}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-mono font-bold transition-all cursor-pointer ${
                      isDark
                        ? 'border-slate-700 bg-slate-900 text-slate-300 hover:text-white'
                        : 'border-stone-300 bg-white text-stone-700 hover:text-stone-900'
                    }`}
                  >
                    <Activity className="h-3.5 w-3.5" />
                    <span>Inspect Skill Gaps</span>
                  </button>
                </div>

              </div>
            </div>

            {/* Quick Metrics & Top Recommended Path */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
              
              {/* Left Column: Top Match Highlight */}
              <div className="lg:col-span-7 space-y-5">
                <div className={`p-6 sm:p-7 rounded-3xl border shadow-sm transition-all ${
                  isDark ? 'bg-[#101B2E] border-slate-700/80 text-white' : 'bg-[#FDFBF7] border-[#E6DCC8] text-[#1C2536]'
                }`}>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                      <span className="text-[0.68rem] font-mono font-bold uppercase tracking-wider text-[#D4A034] block">
                        #1 RECOMMENDED TRANSITION ROUTE
                      </span>
                      <h2 className={`font-serif text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                        {activeCareer.title}
                      </h2>
                    </div>
                    <span className="px-3.5 py-1.5 rounded-full bg-[#D4A034]/15 border border-[#D4A034]/40 text-[#D4A034] font-mono font-bold text-sm">
                      ★ {activeCareer.match}% Match
                    </span>
                  </div>

                  <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>
                    {activeCareer.suits}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                    <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50 border-stone-200'}`}>
                      <span className={`text-[0.65rem] font-mono uppercase block ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>Market Salary Range</span>
                      <span className="text-xs font-bold text-emerald-500 block mt-0.5">{activeCareer.salary}</span>
                    </div>
                    <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50 border-stone-200'}`}>
                      <span className={`text-[0.65rem] font-mono uppercase block ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>Estimated Timeline</span>
                      <span className="text-xs font-bold text-[#D4A034] block mt-0.5">{activeCareer.timeline}</span>
                    </div>
                    <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50 border-stone-200'}`}>
                      <span className={`text-[0.65rem] font-mono uppercase block ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>Global Demand</span>
                      <span className="text-xs font-bold text-cyan-500 block mt-0.5">High Growth (EU/US/India)</span>
                    </div>
                  </div>

                  {/* Key Skills Tags */}
                  <div className="space-y-2 mb-6">
                    <span className={`text-xs font-mono font-semibold block ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                      Critical Target Skills:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {activeCareer.keySkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-[#D4A034]/10 border border-[#D4A034]/30 text-[#D4A034]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Link
                      href={`/careers/${activeCareer.slug}`}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#B8860B] to-[#D4A034] text-white font-mono text-xs font-bold shadow-md hover:scale-105 transition-all"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>View Full Career Card</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => { setActiveNav('roadmap'); }}
                      className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-xs font-mono font-bold transition-all cursor-pointer ${
                        isDark ? 'border-slate-700 bg-slate-800 text-slate-200 hover:text-white' : 'border-stone-300 bg-white text-stone-800 hover:text-stone-900'
                      }`}
                    >
                      <Map className="h-3.5 w-3.5 text-[#D4A034]" />
                      <span>Configure Transition Roadmap</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Rapid Fire Behavioral Profile */}
              <div className="lg:col-span-5 space-y-5">
                <div className={`p-6 sm:p-7 rounded-3xl border shadow-sm transition-all ${
                  isDark ? 'bg-[#101B2E] border-slate-700/80 text-white' : 'bg-[#FDFBF7] border-[#E6DCC8] text-[#1C2536]'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[0.68rem] font-mono font-bold uppercase tracking-wider text-[#D4A034] block">
                        BEHAVIORAL REFLEX ARCHETYPE
                      </span>
                      <h3 className={`font-serif text-xl font-bold mt-0.5 ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                        {rapidFireCompleted ? rapidFireMetrics.archetype : 'Calibrating Archetype...'}
                      </h3>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
                      rapidFireCompleted ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-500' : 'bg-amber-500/15 border-amber-500/30 text-[#D4A034]'
                    }`}>
                      {rapidFireCompleted ? 'Calibrated ✓' : '2 Mins'}
                    </span>
                  </div>

                  <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                    Rapid Fire maps how you make high-stakes tradeoffs across risk, leadership, technical craft, and work environment.
                  </p>

                  {/* Reflex Metric Bars */}
                  <div className="space-y-3.5 pt-1">
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <span className={isDark ? 'text-slate-300' : 'text-stone-700'}>Risk &amp; Innovation Appetite</span>
                        <span className="font-bold text-[#D4A034]">{rapidFireMetrics.riskPct}%</span>
                      </div>
                      <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-stone-200'}`}>
                        <div className="h-full bg-gradient-to-r from-[#B8860B] to-[#D4A034] rounded-full" style={{ width: `${Math.max(25, rapidFireMetrics.riskPct)}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <span className={isDark ? 'text-slate-300' : 'text-stone-700'}>Technical Depth Bias</span>
                        <span className="font-bold text-cyan-500">{rapidFireMetrics.techPct}%</span>
                      </div>
                      <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-stone-200'}`}>
                        <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${Math.max(30, rapidFireMetrics.techPct)}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <span className={isDark ? 'text-slate-300' : 'text-stone-700'}>Cross-Functional Leadership</span>
                        <span className="font-bold text-emerald-500">{rapidFireMetrics.leaderPct}%</span>
                      </div>
                      <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-stone-200'}`}>
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.max(20, rapidFireMetrics.leaderPct)}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-700/60 flex items-center justify-between text-xs font-mono">
                    <span className={isDark ? 'text-slate-400' : 'text-stone-500'}>
                      {rapidFireCompleted ? '10/10 Tradeoffs Mapped' : 'Awaiting Responses'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveNav('rapid-fire')}
                      className="text-[#D4A034] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>{rapidFireCompleted ? 'Review Choices' : 'Launch Rapid Fire'}</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Quick 8 Switcher Careers Carousel / Grid Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[0.68rem] font-mono font-bold uppercase tracking-wider text-[#D4A034] block">
                    TRANSITION CATALOG
                  </span>
                  <h3 className={`font-serif text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                    All 8 Verified Switcher Pathways
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveNav('recommendations')}
                  className="px-3.5 py-1.5 rounded-xl border border-[#D4A034]/40 bg-[#D4A034]/10 text-[#D4A034] font-mono text-xs font-bold hover:bg-[#D4A034]/20 transition-all cursor-pointer"
                >
                  View All Detailed ➔
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {scoredCareers.slice(0, 4).map((career) => (
                  <div
                    key={career.slug}
                    className={`p-5 rounded-2xl border flex flex-col justify-between transition-all hover:scale-[1.01] hover:border-[#D4A034] ${
                      isDark ? 'bg-[#101B2E] border-slate-700/70 text-white' : 'bg-white border-[#E6DCC8] text-[#1C2536]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-[#D4A034]">★ {career.match}% Match</span>
                        <span className={`text-[0.65rem] font-mono px-2 py-0.5 rounded-full ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-stone-100 text-stone-700'}`}>
                          {career.timeline}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-base line-clamp-1">{career.title}</h4>
                      <p className={`text-xs mt-1.5 line-clamp-2 ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                        {career.suits}
                      </p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-700/40 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-500 font-mono">{career.salary.split('–')[0]}</span>
                      <Link
                        href={`/careers/${career.slug}`}
                        className="text-xs font-mono font-bold text-[#D4A034] hover:underline flex items-center gap-1"
                      >
                        <span>Card</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: 12-QUESTION PIVOT ASSESSMENT                     */}
        {/* ======================================================== */}
        {activeNav === 'assessment' && (
          <div className="space-y-6">
            
            {/* Assessment Header Banner */}
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm relative overflow-hidden transition-all ${
              isDark ? 'bg-[#101B2E] border-slate-700/80 text-white' : 'bg-[#FDFBF7] border-[#E6DCC8] text-[#1C2536]'
            }`}>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4A034]/15 border border-[#D4A034]/30 text-[#D4A034] text-xs font-mono font-bold">
                    <ClipboardList className="h-3.5 w-3.5" />
                    WAYPOINT 04 — PROFESSIONAL PIVOT ASSESSMENT
                  </div>
                  <h2 className={`font-serif text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                    Evaluate Your Transition Baseline
                  </h2>
                  <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                    12 calibrated questions evaluating your motivation, technical baseline, preferred environment, and weekly readiness to compute your exact transferable skills.
                  </p>
                </div>

                <div className={`flex items-center gap-4 p-3 rounded-2xl border ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-stone-50 border-stone-200'
                }`}>
                  <div className="text-center">
                    <span className="text-[0.65rem] font-mono text-slate-400 block uppercase">Answered</span>
                    <span className="text-base font-bold text-[#D4A034] font-mono">
                      {assessmentCompleted ? 12 : Object.keys(assessmentAnswers).length}/12
                    </span>
                  </div>
                  <div className="h-8 w-px bg-slate-700" />
                  <div className="text-center">
                    <span className="text-[0.65rem] font-mono text-slate-400 block uppercase">Match Status</span>
                    <span className="text-base font-bold text-emerald-500 font-mono">
                      {assessmentCompleted ? 'Ready' : 'In Progress'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Jump Pills Strip (Q1–Q12) */}
              <div className="pt-6 mt-6 border-t border-slate-700/60">
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {ASSESSMENT_QUESTIONS.map((q, idx) => {
                    const isAnswered = Boolean(assessmentAnswers[q.id]);
                    const isCurrent = idx === currentQIndex;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentQIndex(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
                          isCurrent
                            ? 'bg-gradient-to-r from-[#B8860B] to-[#D4A034] text-white shadow-md'
                            : isAnswered
                            ? (isDark ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/40' : 'bg-emerald-50 text-emerald-700 border border-emerald-200')
                            : (isDark ? 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white' : 'bg-stone-100 text-stone-600 border border-stone-300')
                        }`}
                      >
                        {isAnswered && !isCurrent ? `✓ Q${idx + 1}` : `Q${idx + 1}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Active Question Card */}
            {(() => {
              const q = ASSESSMENT_QUESTIONS[currentQIndex];
              const selectedOptId = assessmentAnswers[q.id];

              return (
                <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6 transition-all ${
                  isDark ? 'bg-[#101B2E] border-slate-700/80 text-white' : 'bg-[#FDFBF7] border-[#E6DCC8] text-[#1C2536]'
                }`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#D4A034]/15 border border-[#D4A034]/30 text-[#D4A034]">
                      {q.categoryLabel}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Question {currentQIndex + 1} of {ASSESSMENT_QUESTIONS.length}
                    </span>
                  </div>

                  <h3 className={`font-serif text-xl sm:text-2xl font-bold leading-snug ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                    {q.question}
                  </h3>

                  {/* Options List */}
                  <div className="grid grid-cols-1 gap-3.5">
                    {q.options.map((opt) => {
                      const isSelected = selectedOptId === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectAssessmentOption(q.id, opt.id)}
                          className={`w-full p-4 sm:p-5 rounded-2xl border text-left transition-all flex items-start gap-3.5 cursor-pointer ${
                            isSelected
                              ? 'bg-[#D4A034]/15 border-[#D4A034] shadow-md ring-1 ring-[#D4A034]/30'
                              : isDark
                              ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                              : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                          }`}
                        >
                          <div className={`h-6 w-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-[#D4A034] border-[#D4A034] text-slate-950 font-bold'
                              : isDark ? 'border-slate-700' : 'border-stone-300'
                          }`}>
                            {isSelected && <Check className="h-3.5 w-3.5" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <span className={`font-bold text-sm sm:text-base block ${
                              isSelected ? 'text-[#D4A034]' : isDark ? 'text-white' : 'text-[#1C2536]'
                            }`}>
                              {opt.label}
                            </span>
                            {opt.desc && (
                              <span className={`text-xs mt-1 block leading-relaxed ${
                                isDark ? 'text-slate-300' : 'text-stone-600'
                              }`}>
                                {opt.desc}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Previous / Next Controls */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700/60">
                    <button
                      type="button"
                      disabled={currentQIndex === 0}
                      onClick={() => setCurrentQIndex(Math.max(0, currentQIndex - 1))}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-700 text-xs font-mono font-bold text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Previous Question</span>
                    </button>

                    {currentQIndex + 1 < ASSESSMENT_QUESTIONS.length ? (
                      <button
                        type="button"
                        onClick={() => setCurrentQIndex(currentQIndex + 1)}
                        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#D4A034] text-white font-mono text-xs font-bold shadow-md hover:scale-105 transition-all cursor-pointer"
                      >
                        <span>Next Question</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setAssessmentCompleted(true);
                          setActiveNav('recommendations');
                          showToast('🎉 All 12 questions analyzed! Navigating to your career recommendations.');
                        }}
                        className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold shadow-lg transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Complete &amp; View Matches</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}

          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: RAPID FIRE CAREER DISCOVERY                      */}
        {/* ======================================================== */}
        {activeNav === 'rapid-fire' && (
          <div className="space-y-6">

            {/* Rapid Fire Banner */}
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm relative overflow-hidden transition-all ${
              isDark ? 'bg-[#101B2E] border-slate-700/80 text-white' : 'bg-[#FDFBF7] border-[#E6DCC8] text-[#1C2536]'
            }`}>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[#D4A034] text-xs font-mono font-bold">
                    <Zap className="h-3.5 w-3.5" />
                    RAPID FIRE DISCOVERY — 10 PROFESSIONAL SCENARIOS
                  </div>
                  <h2 className={`font-serif text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                    High-Velocity Decision Tradeoffs
                  </h2>
                  <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                    Test your instant problem-solving reflexes across 10 strategic workplace dilemmas. Pick your instinctive reaction without overthinking.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetRapidFire}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700 text-xs font-mono font-bold text-slate-300 hover:text-white cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Retake</span>
                  </button>
                  <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-[#D4A034]/20 border border-[#D4A034]/40 text-[#D4A034]">
                    {rapidFireCompleted ? '10/10 Mapped' : `Scenario ${rapidFireStep + 1}/10`}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-5 h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#B8860B] to-[#D4A034] rounded-full transition-all duration-300"
                  style={{ width: `${rapidFireCompleted ? 100 : ((rapidFireStep + 1) / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Dilemma Card */}
            {!rapidFireCompleted ? (
              (() => {
                const q = RAPID_FIRE_QUESTIONS[rapidFireStep];
                return (
                  <div className={`p-6 sm:p-10 rounded-3xl border shadow-lg space-y-6 transition-all ${
                    isDark ? 'bg-[#101B2E] border-slate-700/80 text-white' : 'bg-[#FDFBF7] border-[#E6DCC8] text-[#1C2536]'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#D4A034]/15 border border-[#D4A034]/30 text-[#D4A034]">
                        {q.title}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {10 - rapidFireStep} remaining
                      </span>
                    </div>

                    <h3 className={`font-serif text-xl sm:text-2xl font-bold leading-relaxed ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                      &ldquo;{q.prompt}&rdquo;
                    </h3>

                    {/* Dilemma Option A vs Option B */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
                      <button
                        type="button"
                        onClick={() => handleSelectRapidFireOption('A')}
                        className={`p-6 rounded-2xl border text-left transition-all hover:scale-[1.02] flex flex-col justify-between space-y-4 cursor-pointer ${
                          isDark
                            ? 'bg-slate-900/80 border-slate-700 hover:border-[#D4A034] hover:bg-slate-900'
                            : 'bg-white border-stone-200 hover:border-[#B8860B] hover:bg-amber-50/50'
                        }`}
                      >
                        <div>
                          <span className="h-7 w-7 rounded-full bg-[#D4A034]/20 border border-[#D4A034]/40 text-[#D4A034] font-mono font-bold text-xs flex items-center justify-center mb-3">
                            A
                          </span>
                          <p className={`font-bold text-base leading-snug ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                            {q.optionA.text}
                          </p>
                        </div>
                        <span className="text-[0.68rem] font-mono text-[#D4A034] uppercase tracking-wider block font-semibold">
                          Signal: {q.optionA.signal}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectRapidFireOption('B')}
                        className={`p-6 rounded-2xl border text-left transition-all hover:scale-[1.02] flex flex-col justify-between space-y-4 cursor-pointer ${
                          isDark
                            ? 'bg-slate-900/80 border-slate-700 hover:border-[#D4A034] hover:bg-slate-900'
                            : 'bg-white border-stone-200 hover:border-[#B8860B] hover:bg-amber-50/50'
                        }`}
                      >
                        <div>
                          <span className="h-7 w-7 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center mb-3">
                            B
                          </span>
                          <p className={`font-bold text-base leading-snug ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                            {q.optionB.text}
                          </p>
                        </div>
                        <span className="text-[0.68rem] font-mono text-cyan-400 uppercase tracking-wider block font-semibold">
                          Signal: {q.optionB.signal}
                        </span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-700/60 text-xs font-mono text-slate-400">
                      <span>Click either option to lock in your reaction</span>
                      <button
                        type="button"
                        onClick={() => handleSelectRapidFireOption('A')}
                        className="text-[#D4A034] hover:underline cursor-pointer"
                      >
                        Skip Scenario ➔
                      </button>
                    </div>
                  </div>
                );
              })()
            ) : (
              /* Rapid Fire Results Board */
              <div className={`p-8 sm:p-10 rounded-3xl border shadow-xl text-center space-y-6 transition-all ${
                isDark ? 'bg-[#101B2E] border-slate-700/80 text-white' : 'bg-[#FDFBF7] border-[#E6DCC8] text-[#1C2536]'
              }`}>
                <div className="h-16 w-16 rounded-full bg-[#D4A034]/20 border border-[#D4A034] text-[#D4A034] flex items-center justify-center mx-auto shadow-lg">
                  <Zap className="h-8 w-8" />
                </div>

                <div className="max-w-xl mx-auto space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4A034]">
                    RAPID FIRE DECISION REFLEXES MAPPED
                  </span>
                  <h3 className={`font-serif text-3xl font-bold ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                    Archetype: {rapidFireMetrics.archetype}
                  </h3>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                    Your 10 decision reflexes reveal strong execution stamina, calculated risk appetite, and natural affinity for cross-functional impact.
                  </p>
                </div>

                {/* Behavioral Grid Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-left pt-2">
                  <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-stone-50 border-stone-200'}`}>
                    <span className="text-[0.65rem] font-mono text-slate-400 block uppercase">Risk Stance</span>
                    <span className="text-xs font-bold text-[#D4A034] block mt-0.5">{rapidFireMetrics.riskPct}% Dynamic</span>
                  </div>
                  <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-stone-50 border-stone-200'}`}>
                    <span className="text-[0.65rem] font-mono text-slate-400 block uppercase">Tech Lean</span>
                    <span className="text-xs font-bold text-cyan-500 block mt-0.5">{rapidFireMetrics.techPct}% Precision</span>
                  </div>
                  <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-stone-50 border-stone-200'}`}>
                    <span className="text-[0.65rem] font-mono text-slate-400 block uppercase">Leadership</span>
                    <span className="text-xs font-bold text-emerald-500 block mt-0.5">{rapidFireMetrics.leaderPct}% Facilitator</span>
                  </div>
                  <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-stone-50 border-stone-200'}`}>
                    <span className="text-[0.65rem] font-mono text-slate-400 block uppercase">Collaboration</span>
                    <span className="text-xs font-bold text-purple-400 block mt-0.5">{rapidFireMetrics.teamPct}% Synergy</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveNav('recommendations')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#B8860B] to-[#D4A034] text-white font-mono text-xs font-bold shadow-lg hover:scale-105 transition-all cursor-pointer"
                  >
                    <span>Proceed to Calibrated Recommendations</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleResetRapidFire}
                    className="px-5 py-3 rounded-full border border-slate-700 text-xs font-mono font-bold text-slate-300 hover:text-white cursor-pointer"
                  >
                    Retake Scenarios
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 4: AI CAREER RECOMMENDATIONS                        */}
        {/* ======================================================== */}
        {activeNav === 'recommendations' && (
          <div className="space-y-6">

            <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm relative overflow-hidden transition-all ${
              isDark ? 'bg-[#101B2E] border-slate-700/80 text-white' : 'bg-[#FDFBF7] border-[#E6DCC8] text-[#1C2536]'
            }`}>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                    <Briefcase className="h-3.5 w-3.5" />
                    AI-CURATED PIVOT MATCHES
                  </div>
                  <h2 className={`font-serif text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                    Personalized Career Switch Options
                  </h2>
                  <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                    Synthesized from your 12 assessment answers, 10 Rapid Fire behavioral signals, and verified salary &amp; hiring benchmarks across India and global tech hubs.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveNav('roadmap')}
                    className="px-4 py-2 rounded-xl bg-[#D4A034]/20 border border-[#D4A034]/40 text-[#D4A034] font-mono text-xs font-bold hover:bg-[#D4A034]/30 transition-all cursor-pointer"
                  >
                    Active Route: {activeCareer.title} ➔
                  </button>
                </div>
              </div>
            </div>

            {/* 8 Career Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scoredCareers.map((career, index) => {
                const isSelected = selectedCareerSlug === career.slug;

                return (
                  <div
                    key={career.slug}
                    className={`p-6 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all hover:border-[#D4A034] shadow-sm ${
                      isSelected
                        ? 'border-[#D4A034] ring-1 ring-[#D4A034]/40 bg-[#16223B]/90'
                        : isDark
                        ? 'bg-[#101B2E] border-slate-700/80 text-white'
                        : 'bg-white border-[#E6DCC8] text-[#1C2536]'
                    }`}
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <span className="text-[0.65rem] font-mono font-bold uppercase tracking-wider text-[#D4A034] block">
                            MATCH #{index + 1} • {career.traitCode}
                          </span>
                          <h3 className={`font-serif text-xl sm:text-2xl font-bold mt-0.5 ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                            {career.title}
                          </h3>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-[#D4A034]/15 border border-[#D4A034]/40 text-[#D4A034] font-mono font-bold text-xs shrink-0">
                          ★ {career.match}% Match
                        </span>
                      </div>

                      {/* Who it suits */}
                      <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                        {career.suits}
                      </p>

                      {/* Metrics Pill Grid */}
                      <div className="grid grid-cols-2 gap-2.5 mb-4">
                        <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50 border-stone-200'}`}>
                          <span className="text-[0.62rem] font-mono text-slate-400 block uppercase">Typical Compensation</span>
                          <span className="text-xs font-bold text-emerald-500 block mt-0.5">{career.salary}</span>
                        </div>
                        <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50 border-stone-200'}`}>
                          <span className="text-[0.62rem] font-mono text-slate-400 block uppercase">Transition Horizon</span>
                          <span className="text-xs font-bold text-[#D4A034] block mt-0.5">{career.timeline}</span>
                        </div>
                      </div>

                      {/* Growth Ladder */}
                      <div className={`p-3 rounded-xl border mb-4 text-xs font-mono ${
                        isDark ? 'bg-slate-900/40 border-slate-800 text-slate-300' : 'bg-stone-50 border-stone-200 text-stone-700'
                      }`}>
                        <span className="text-[0.65rem] uppercase text-slate-400 block mb-0.5">Growth Ladder</span>
                        <span className="font-semibold">{career.growth}</span>
                      </div>

                      {/* Key Skills Tags */}
                      <div className="space-y-1.5 mb-5">
                        <span className="text-[0.68rem] font-mono text-slate-400 uppercase tracking-wider block">
                          Core Competencies
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {career.keySkills.map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded-md text-[0.7rem] font-mono bg-[#D4A034]/10 border border-[#D4A034]/25 text-[#D4A034]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-slate-700/60 flex items-center gap-3">
                      <Link
                        href={`/careers/${career.slug}`}
                        className="flex-1 py-2.5 px-4 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#B8860B] to-[#D4A034] text-white shadow-md hover:scale-[1.02] transition-all"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>View Career Card</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCareerSlug(career.slug);
                          setActiveNav('roadmap');
                          showToast(`🚀 Selected ${career.title}! Customized Roadmap unlocked.`);
                        }}
                        className={`py-2.5 px-4 rounded-xl border font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : isDark
                            ? 'border-slate-700 bg-slate-800 text-slate-200 hover:text-white'
                            : 'border-stone-300 bg-white text-stone-700 hover:text-stone-900'
                        }`}
                      >
                        <Map className="h-3.5 w-3.5" />
                        <span>{isSelected ? 'Active Route ✓' : 'Select Target'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 5: TRANSFERABLE SKILLS & GAP MATRIX                 */}
        {/* ======================================================== */}
        {activeNav === 'skills' && (
          <div className="space-y-6">

            <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm relative overflow-hidden transition-all ${
              isDark ? 'bg-[#101B2E] border-slate-700/80 text-white' : 'bg-[#FDFBF7] border-[#E6DCC8] text-[#1C2536]'
            }`}>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4A034]/15 border border-[#D4A034]/30 text-[#D4A034] text-xs font-mono font-bold">
                  <Activity className="h-3.5 w-3.5" />
                  TRANSFERABLE SKILLS &amp; GAP ANALYSIS
                </div>
                <h2 className={`font-serif text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                  9 Core Professional Competencies
                </h2>
                <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                  Your assessment responses categorize competencies into strengths you can immediately leverage, moderate skills to sharpen, and critical gaps to bridge through project labs.
                </p>
              </div>
            </div>

            {/* 3 Categories: Have, Sharpen, Learn */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* 1. Transferable Strengths (Have) */}
              <div className={`p-6 rounded-3xl border space-y-4 ${
                isDark ? 'bg-[#101B2E] border-slate-700/80 text-white' : 'bg-[#FDFBF7] border-[#E6DCC8] text-[#1C2536]'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-lg text-emerald-500 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Skills You Have</span>
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                    Leverage Now
                  </span>
                </div>
                <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                  Competencies where your existing experience provides an immediate advantage:
                </p>

                <div className="space-y-3 pt-2">
                  {calculatedAssessment.skillsList
                    .filter((s) => s.currentScore >= 65)
                    .map((s) => (
                      <div key={s.name} className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50 border-stone-200'}`}>
                        <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                          <span className={isDark ? 'text-white' : 'text-[#1C2536]'}>{s.name}</span>
                          <span className="text-emerald-500">{s.currentScore}%</span>
                        </div>
                        <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-stone-200'}`}>
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s.currentScore}%` }} />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* 2. Skills to Sharpen (Moderate Gap) */}
              <div className={`p-6 rounded-3xl border space-y-4 ${
                isDark ? 'bg-[#101B2E] border-slate-700/80 text-white' : 'bg-[#FDFBF7] border-[#E6DCC8] text-[#1C2536]'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-lg text-[#D4A034] flex items-center gap-2">
                    <Sliders className="h-5 w-5" />
                    <span>Skills to Sharpen</span>
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#D4A034]/20 text-[#D4A034]">
                    2–4 Weeks
                  </span>
                </div>
                <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                  Familiar tools that require modern upskilling or practical portfolio proof:
                </p>

                <div className="space-y-3 pt-2">
                  {calculatedAssessment.skillsList
                    .filter((s) => s.currentScore >= 45 && s.currentScore < 65)
                    .map((s) => (
                      <div key={s.name} className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50 border-stone-200'}`}>
                        <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                          <span className={isDark ? 'text-white' : 'text-[#1C2536]'}>{s.name}</span>
                          <span className="text-[#D4A034]">{s.currentScore}%</span>
                        </div>
                        <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-stone-200'}`}>
                          <div className="h-full bg-[#D4A034] rounded-full" style={{ width: `${s.currentScore}%` }} />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* 3. Critical Upgrades (Need to Learn) */}
              <div className={`p-6 rounded-3xl border space-y-4 ${
                isDark ? 'bg-[#101B2E] border-slate-700/80 text-white' : 'bg-[#FDFBF7] border-[#E6DCC8] text-[#1C2536]'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-lg text-rose-400 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    <span>Critical Upgrades</span>
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400">
                    Project Lab Focus
                  </span>
                </div>
                <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                  Core technical gaps that recruiters screen for during technical rounds:
                </p>

                <div className="space-y-3 pt-2">
                  {calculatedAssessment.skillsList
                    .filter((s) => s.currentScore < 45)
                    .map((s) => (
                      <div key={s.name} className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50 border-stone-200'}`}>
                        <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                          <span className={isDark ? 'text-white' : 'text-[#1C2536]'}>{s.name}</span>
                          <span className="text-rose-400">{s.currentScore}%</span>
                        </div>
                        <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-stone-200'}`}>
                          <div className="h-full bg-rose-500 rounded-full" style={{ width: `${s.currentScore}%` }} />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

            </div>

            {/* Direct Link to Project Labs */}
            <div className={`p-6 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              isDark ? 'bg-[#16223B]/80 border-slate-700' : 'bg-amber-50/80 border-amber-200'
            }`}>
              <div>
                <h4 className={`font-serif font-bold text-lg ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                  Bridge Your Critical Skill Gaps with Hands-on Project Labs
                </h4>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                  Every identified gap is paired with a production-grade portfolio project lab and syllabus.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveNav('resources')}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#D4A034] text-white font-mono text-xs font-bold shadow-md hover:scale-105 transition-all shrink-0 cursor-pointer"
              >
                <Code className="h-3.5 w-3.5" />
                <span>Explore Project Labs</span>
              </button>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 6: CUSTOMIZED TRANSITION ROADMAP                    */}
        {/* ======================================================== */}
        {activeNav === 'roadmap' && (
          <div className="space-y-6">

            <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm relative overflow-hidden transition-all ${
              isDark ? 'bg-[#101B2E] border-slate-700/80 text-white' : 'bg-[#FDFBF7] border-[#E6DCC8] text-[#1C2536]'
            }`}>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                    <Map className="h-3.5 w-3.5" />
                    TARGET TRANSITION ROADMAP
                  </div>
                  <h2 className={`font-serif text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                    6-Phase Pivot Blueprint: {activeCareer.title}
                  </h2>
                  <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                    Structured progression taking you from domain audit to verified portfolio, resume pivot, and technical interview offer negotiation.
                  </p>
                </div>

                {/* Timeline Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">Pace:</span>
                  {[3, 6, 12].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setTargetTransitionMonths(m)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        targetTransitionMonths === m
                          ? 'bg-[#D4A034] text-slate-950 font-bold shadow'
                          : isDark ? 'bg-slate-800 text-slate-300 hover:text-white' : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {m} Months
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 6 Phases Timeline List */}
            <div className="space-y-4">
              {[
                {
                  phase: 'Phase 01',
                  title: 'Domain Audit & Transferable Skills Inventory',
                  weeks: targetTransitionMonths === 3 ? 'Weeks 1–2' : targetTransitionMonths === 6 ? 'Weeks 1–4' : 'Weeks 1–6',
                  desc: 'Audit your current experience, document transferable accomplishments with metrics, and map exact missing tools.',
                  tasks: ['Inventory past projects with measurable business impact', 'Set up GitHub / portfolio repository structure', 'Join domain Discord / Slack communities for peer review']
                },
                {
                  phase: 'Phase 02',
                  title: 'Core Technical Upskilling & Tool Mastery',
                  weeks: targetTransitionMonths === 3 ? 'Weeks 3–5' : targetTransitionMonths === 6 ? 'Weeks 5–10' : 'Weeks 7–16',
                  desc: 'Targeted study covering primary domain tools without fluff or unnecessary academic derivations.',
                  tasks: ['Complete hands-on SQL and data modeling track', 'Master modern framework (FastAPI/LangChain for AI, Figma for UX, Jira for PM)', 'Pass industry certification baseline (Google / AWS / PMI)']
                },
                {
                  phase: 'Phase 03',
                  title: 'Applied Project Labs & Portfolio Construction',
                  weeks: targetTransitionMonths === 3 ? 'Weeks 6–8' : targetTransitionMonths === 6 ? 'Weeks 11–16' : 'Weeks 17–28',
                  desc: 'Build two end-to-end, production-grade projects demonstrating real-world problem-solving under constraints.',
                  tasks: ['Build Portfolio Project #1 (Production-level pipeline or design system)', 'Deploy live interactive demo with public code repository', 'Write detailed architectural case study breakdown on Medium / LinkedIn']
                },
                {
                  phase: 'Phase 04',
                  title: 'Industry Proof & Peer Verification',
                  weeks: targetTransitionMonths === 3 ? 'Weeks 9–10' : targetTransitionMonths === 6 ? 'Weeks 17–20' : 'Weeks 29–36',
                  desc: 'Obtain recognized industry credentials to validate your skills to senior recruiters and hiring managers.',
                  tasks: ['Obtain specialized certification credential', 'Conduct mock technical interview with senior domain lead', 'Refactor portfolio based on mentor code review feedback']
                },
                {
                  phase: 'Phase 05',
                  title: 'Resume Translation & LinkedIn Positioning',
                  weeks: targetTransitionMonths === 3 ? 'Weeks 11' : targetTransitionMonths === 6 ? 'Weeks 21–22' : 'Weeks 37–42',
                  desc: 'Translate your past job title into domain-aligned impact metrics so ATS filters and recruiters instantly recognize your value.',
                  tasks: ['Rewrite resume summary to highlight target domain competencies', 'Optimize LinkedIn headline, featured projects, and skill endorsements', 'Collect recommendations from past managers on execution speed']
                },
                {
                  phase: 'Phase 06',
                  title: 'Targeted Outreach & Offer Negotiation',
                  weeks: targetTransitionMonths === 3 ? 'Weeks 12' : targetTransitionMonths === 6 ? 'Weeks 23–24' : 'Weeks 43–48',
                  desc: 'Direct outreach to hiring managers, referral networking, and structuring competitive compensation discussions.',
                  tasks: ['Direct outreach to 25 engineering / product hiring managers weekly', 'Complete 5 full-loop technical interviews', 'Negotiate compensation benchmark using PathFinders salary data']
                }
              ].map((p, idx) => (
                <div
                  key={p.phase}
                  className={`p-6 rounded-3xl border transition-all ${
                    isDark ? 'bg-[#101B2E] border-slate-700/80 text-white' : 'bg-[#FDFBF7] border-[#E6DCC8] text-[#1C2536]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="h-8 w-8 rounded-full bg-[#D4A034]/20 border border-[#D4A034]/40 text-[#D4A034] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        0{idx + 1}
                      </span>
                      <h3 className={`font-serif text-lg font-bold ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                        {p.title}
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-[#D4A034] font-semibold px-3 py-1 rounded-full bg-[#D4A034]/10 border border-[#D4A034]/20 self-start sm:self-auto">
                      {p.weeks}
                    </span>
                  </div>

                  <p className={`text-xs sm:text-sm leading-relaxed mb-4 pl-11 ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                    {p.desc}
                  </p>

                  <div className="pl-11 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {p.tasks.map((task) => (
                      <div
                        key={task}
                        className={`p-3 rounded-xl border flex items-start gap-2 text-xs ${
                          isDark ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-stone-50 border-stone-200 text-stone-700'
                        }`}
                      >
                        <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 7: CAREER EXPLORER                                  */}
        {/* ======================================================== */}
        {activeNav === 'explorer' && (
          <div className="space-y-6">

            <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm relative overflow-hidden transition-all ${
              isDark ? 'bg-[#101B2E] border-slate-700/80 text-white' : 'bg-[#FDFBF7] border-[#E6DCC8] text-[#1C2536]'
            }`}>
              <div className="space-y-4">
                <div>
                  <span className="text-[0.68rem] font-mono font-bold uppercase tracking-wider text-[#D4A034] block">
                    CAREER DIRECTORY &amp; BENCHMARKS
                  </span>
                  <h2 className={`font-serif text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                    Explore Transition Pathways
                  </h2>
                </div>

                {/* Search Bar & Filters */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <div className={`flex-1 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border ${
                    isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-stone-300'
                  }`}>
                    <Search className="h-4 w-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search career, skill (e.g. SQL, Python, Figma, Jira)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full bg-transparent text-xs font-mono outline-none ${
                        isDark ? 'text-white placeholder:text-slate-500' : 'text-[#1C2536] placeholder:text-stone-400'
                      }`}
                    />
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {[
                      { id: 'all', label: 'All Roles' },
                      { id: 'tech', label: 'Tech & Data' },
                      { id: 'business', label: 'Product & PM' },
                      { id: 'design', label: 'UX Design' },
                      { id: 'finance', label: 'Finance' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setDomainFilter(tab.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
                          domainFilter === tab.id
                            ? 'bg-[#D4A034] text-slate-950 shadow'
                            : isDark ? 'bg-slate-900 border border-slate-700 text-slate-300' : 'bg-stone-100 border border-stone-300 text-stone-700'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Filtered Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCareers.map((career) => (
                <div
                  key={career.slug}
                  className={`p-6 rounded-3xl border flex flex-col justify-between transition-all hover:border-[#D4A034] shadow-sm ${
                    isDark ? 'bg-[#101B2E] border-slate-700/80 text-white' : 'bg-white border-[#E6DCC8] text-[#1C2536]'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-mono font-bold text-[#D4A034]">★ {career.match}% Match</span>
                      <span className="text-xs font-mono font-bold text-emerald-500">{career.salary}</span>
                    </div>

                    <h3 className={`font-serif text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                      {career.title}
                    </h3>

                    <p className={`text-xs mt-2 line-clamp-3 leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                      {career.suits}
                    </p>

                    <div className="space-y-1.5 mt-4">
                      <span className="text-[0.65rem] font-mono text-slate-400 uppercase tracking-wider block">
                        Skills Required
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {career.keySkills.slice(0, 4).map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded text-[0.68rem] font-mono bg-[#D4A034]/10 border border-[#D4A034]/30 text-[#D4A034]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-700/60 flex items-center justify-between">
                    <Link
                      href={`/careers/${career.slug}`}
                      className="text-xs font-mono font-bold text-[#D4A034] hover:underline flex items-center gap-1"
                    >
                      <span>View Career Card</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCareerSlug(career.slug);
                        setActiveNav('roadmap');
                        showToast(`Selected ${career.title} as target roadmap!`);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono text-slate-300 hover:text-white hover:border-[#D4A034] cursor-pointer"
                    >
                      Choose Route
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 8: UPSKILLING COURSES & 4 PROJECT LABS              */}
        {/* ======================================================== */}
        {activeNav === 'resources' && (
          <div className="space-y-6">

            <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm relative overflow-hidden transition-all ${
              isDark ? 'bg-[#101B2E] border-slate-700/80 text-white' : 'bg-[#FDFBF7] border-[#E6DCC8] text-[#1C2536]'
            }`}>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4A034]/15 border border-[#D4A034]/30 text-[#D4A034] text-xs font-mono font-bold">
                  <Code className="h-3.5 w-3.5" />
                  PRACTICAL PROJECT LABS &amp; CURATED CREDENTIALS
                </div>
                <h2 className={`font-serif text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                  Industry-Grade Project Labs
                </h2>
                <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                  Each lab is engineered to address the top skill gaps discovered in your assessment, producing working code and live artifacts for your portfolio.
                </p>
              </div>
            </div>

            {/* Courses and Labs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {UPSKILLING_COURSES.map((course) => (
                <div
                  key={course.id}
                  className={`p-6 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all hover:border-[#D4A034] shadow-sm ${
                    isDark ? 'bg-[#101B2E] border-slate-700/80 text-white' : 'bg-white border-[#E6DCC8] text-[#1C2536]'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[0.65rem] font-mono font-bold uppercase tracking-wider text-emerald-500 block">
                          BRIDGES: {course.coversGap}
                        </span>
                        <h3 className={`font-serif text-xl font-bold mt-1 ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                          {course.title}
                        </h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-[#D4A034]/15 border border-[#D4A034]/40 text-[#D4A034] font-mono font-bold text-xs shrink-0">
                        {course.duration.split('•')[0]}
                      </span>
                    </div>

                    <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                      {course.desc}
                    </p>

                    {/* Project Lab Details Box */}
                    <div className={`p-4 rounded-2xl border ${
                      isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50 border-stone-200'
                    }`}>
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#D4A034] mb-1">
                        <FolderGit2 className="h-4 w-4" />
                        <span>Featured Lab: {course.projectLab.name}</span>
                      </div>
                      <p className={`text-xs mt-1 ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                        {course.projectLab.deliverable}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {course.projectLab.stack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded text-[0.65rem] font-mono bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-700/60 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400">{course.provider}</span>
                    <button
                      type="button"
                      onClick={() => setActiveLabModal(course)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#D4A034] text-white font-mono text-xs font-bold shadow hover:scale-105 transition-all cursor-pointer"
                    >
                      View Syllabus &amp; Lab Specs ➔
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Syllabus Modal */}
            <AnimatePresence>
              {activeLabModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
                  onClick={() => setActiveLabModal(null)}
                >
                  <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="max-w-2xl w-full rounded-3xl border border-slate-700 bg-[#101B2E] p-6 sm:p-8 text-white space-y-5 max-h-[90vh] overflow-y-auto"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-mono font-bold text-[#D4A034]">LAB CURRICULUM</span>
                        <h3 className="font-serif text-2xl font-bold mt-1">{activeLabModal.title}</h3>
                        <span className="text-xs font-mono text-slate-400 block mt-0.5">{activeLabModal.provider}</span>
                      </div>
                      <button
                        onClick={() => setActiveLabModal(null)}
                        className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-sm"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-3">
                      <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block font-bold">
                        Weekly Module Breakdown:
                      </span>
                      {activeLabModal.syllabus.map((s) => (
                        <div key={s.week} className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/80 text-xs">
                          <span className="font-mono font-bold text-[#D4A034] block mb-0.5">{s.week}</span>
                          <span className="text-slate-200">{s.topic}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 text-xs text-emerald-200">
                      <strong className="block text-emerald-400 font-mono mb-1">Portfolio Deliverable:</strong>
                      {activeLabModal.projectLab.deliverable}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          showToast(`Enrolled in ${activeLabModal.title} project workspace!`);
                          setActiveLabModal(null);
                        }}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#D4A034] text-white font-mono text-xs font-bold shadow-md hover:scale-105 transition-all cursor-pointer"
                      >
                        Enroll in Lab Workspace
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 9: PROFESSIONAL PROFILE EDITABLE                    */}
        {/* ======================================================== */}
        {activeNav === 'profile' && (
          <div className="space-y-6">

            <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm relative overflow-hidden transition-all ${
              isDark ? 'bg-[#101B2E] border-slate-700/80 text-white' : 'bg-[#FDFBF7] border-[#E6DCC8] text-[#1C2536]'
            }`}>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4A034]/15 border border-[#D4A034]/30 text-[#D4A034] text-xs font-mono font-bold">
                  <User className="h-3.5 w-3.5" />
                  PROFESSIONAL IDENTITY &amp; PIVOT COORDINATES
                </div>
                <h2 className={`font-serif text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-[#1C2536]'}`}>
                  Professional Profile
                </h2>
                <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
                  Manage your verified background coordinates. Changes automatically calibrate your skill matches and roadmap timelines.
                </p>
              </div>
            </div>

            <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${
              isDark ? 'bg-[#101B2E] border-slate-700/80 text-white' : 'bg-[#FDFBF7] border-[#E6DCC8] text-[#1C2536]'
            }`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-400 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile?.fullName || ''}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className={`w-full p-3 rounded-xl border text-sm font-medium outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-stone-300 text-stone-800'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-400 mb-1.5">
                    Current Professional Role
                  </label>
                  <input
                    type="text"
                    value={profile?.currentJobRole || ''}
                    onChange={(e) => setProfile({ ...profile, currentJobRole: e.target.value })}
                    className={`w-full p-3 rounded-xl border text-sm font-medium outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-stone-300 text-stone-800'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-400 mb-1.5">
                    Current Industry
                  </label>
                  <input
                    type="text"
                    value={profile?.currentIndustry || ''}
                    onChange={(e) => setProfile({ ...profile, currentIndustry: e.target.value })}
                    className={`w-full p-3 rounded-xl border text-sm font-medium outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-stone-300 text-stone-800'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-400 mb-1.5">
                    Total Years of Work Experience
                  </label>
                  <input
                    type="text"
                    value={profile?.expYears || ''}
                    onChange={(e) => setProfile({ ...profile, expYears: e.target.value })}
                    className={`w-full p-3 rounded-xl border text-sm font-medium outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-stone-300 text-stone-800'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-400 mb-1.5">
                    Target Pivot Direction
                  </label>
                  <select
                    value={activeCareer.title}
                    onChange={(e) => {
                      const found = scoredCareers.find((c) => c.title === e.target.value);
                      if (found) setSelectedCareerSlug(found.slug);
                    }}
                    className={`w-full p-3 rounded-xl border text-sm font-medium outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-stone-300 text-stone-800'
                    }`}
                  >
                    {scoredCareers.map((c) => (
                      <option key={c.slug} value={c.title}>
                        {c.title} ({c.match}% match)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-400 mb-1.5">
                    Primary Pivot Motivation
                  </label>
                  <input
                    type="text"
                    value={profile?.switchReason || 'Higher Salary & Industry Growth'}
                    onChange={(e) => setProfile({ ...profile, switchReason: e.target.value })}
                    className={`w-full p-3 rounded-xl border text-sm font-medium outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-stone-300 text-stone-800'
                    }`}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700/60 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    userProfileService.saveProfile(profile);
                    showToast('🎉 Professional profile saved successfully!');
                  }}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#B8860B] to-[#D4A034] text-white font-mono text-xs font-bold shadow-md hover:scale-105 transition-all cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </div>

          </div>
        )}

      </main>

    </div>
  );
}
