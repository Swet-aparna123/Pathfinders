'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  School,
  BookOpen,
  Award,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Check,
  Building2,
  Calendar,
  Trophy,
  AlertCircle
} from 'lucide-react';
import GrainOverlay from '@/components/GrainOverlay';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { userProfileService } from '@/lib/userProfileService';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const EDUCATION_LEVELS = [
  { id: 'Class 8–10', label: 'Class 8–10', desc: 'High School (Foundational Phase)', icon: School },
  { id: 'Class 11–12', label: 'Class 11–12', desc: 'Higher Secondary & Stream Phase', icon: BookOpen },
  { id: 'Undergraduate', label: 'Undergraduate', desc: 'College / University Degree', icon: GraduationCap },
  { id: 'Postgraduate', label: 'Postgraduate', desc: 'Master’s / Ph.D / Postgrad', icon: Award },
];

const BOARDS = [
  'CBSE (Central Board)',
  'ICSE / ISC',
  'State Board',
  'IB / Cambridge (International)',
  'Other / Open Schooling',
];

const UNIVERSITY_TYPES = [
  'Central / State University',
  'Deemed / Autonomous University',
  'Private University / Institute',
  'National Institute (IIT / NIT / IIIT / AIIMS / IIM)',
  'Affiliated College / Polytechnic',
  'Other / International Institution',
];

const STREAMS_SENIOR = [
  'PCM (Physics, Chemistry, Maths)',
  'PCB (Physics, Chemistry, Biology)',
  'PCMB (Maths & Biology Combined)',
  'Commerce with Mathematics',
  'Commerce / Business Studies',
  'Humanities / Arts & Social Sciences',
  'Computer Science / IT Vocational',
  'Other / Vocational',
];

const CLASSES_JUNIOR = [
  'Class 8',
  'Class 9',
  'Class 10',
];

const CLASSES_SENIOR = [
  'Class 11',
  'Class 12',
];

const UNDERGRAD_DEGREES = [
  'B.Tech / B.E. (Engineering & Tech)',
  'B.Sc (Bachelor of Science)',
  'B.Com (Commerce & Finance)',
  'B.A. (Arts & Humanities)',
  'BBA / BMS (Management)',
  'BCA / B.Sc CS (Computer Applications)',
  'MBBS / BDS / Health Sciences',
  'B.Des / B.Arch (Design & Architecture)',
  'Other Professional Degree',
];

const UNDERGRAD_SEMESTERS = [
  'Semester 1 (1st Year)',
  'Semester 2 (1st Year)',
  'Semester 3 (2nd Year)',
  'Semester 4 (2nd Year)',
  'Semester 5 (3rd Year)',
  'Semester 6 (3rd Year)',
  'Semester 7 (Final Year)',
  'Semester 8 (Final Year)',
  'Year 5 / Integrated / Final Year',
];

const POSTGRAD_DEGREES = [
  'M.Tech / M.E. (Engineering & Technology)',
  'M.Sc (Master of Science)',
  'MBA / PGDM (Business & Management)',
  'M.A. (Arts & Humanities)',
  'MCA (Computer Applications)',
  'M.Com (Commerce & Finance)',
  'M.Des / M.Arch (Design & Architecture)',
  'MS / Research Master’s Degree',
  'Ph.D / Doctorate',
  'Postgraduate Diploma / Other',
];

const POSTGRAD_SEMESTERS = [
  'Semester 1 (1st Year)',
  'Semester 2 (1st Year)',
  'Semester 3 (2nd Year)',
  'Semester 4 (2nd Year / Final)',
  'Research / Thesis / Dissertation Phase',
  'Other / Final Stretch',
];

const SUBJECT_TAGS_JUNIOR = [
  'Mathematics',
  'Science (Physics/Chemistry/Biology)',
  'Computer Science & Coding',
  'Social Studies & History',
  'English & Literature',
  'Visual Arts & Design',
  'Languages & Linguistics',
  'Electronics & Mechanics',
  'Environmental Science',
];

const SUBJECT_TAGS_SENIOR = [
  'Mathematics & Calculus',
  'Physics & Mechanics',
  'Chemistry',
  'Biology & Biotechnology',
  'Computer Science & Python',
  'Economics & Commerce',
  'Accountancy & Finance',
  'Business Studies',
  'Psychology & Human Behaviour',
  'Design Thinking & UI/UX',
  'English & Creative Writing',
  'Automobile & Robotics',
];

const ACHIEVEMENT_SUGGESTIONS = [
  'Olympiad / NTSE Scholar',
  'School / College Rank Holder',
  'Competitive Exam Rank Holder (JEE/NEET/CET)',
  'Hackathon / Coding Winner',
  'Science Fair / Innovation Award',
  'Merit Scholarship Awardee',
  'Published Paper / Research Project',
];

function AcademicBackgroundContent() {
  const router = useRouter();
  const { t } = useLanguage();
  const [profile, setProfile] = useState(null);

  // Form State
  const [educationLevel, setEducationLevel] = useState('Class 8–10');
  const [age, setAge] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [boardAffiliation, setBoardAffiliation] = useState(BOARDS[0]);
  const [universityAffiliation, setUniversityAffiliation] = useState(UNIVERSITY_TYPES[0]);
  
  // Specific Level States
  const [schoolClass, setSchoolClass] = useState('Class 10');
  const [stream, setStream] = useState(STREAMS_SENIOR[0]);
  const [undergradDegree, setUndergradDegree] = useState(UNDERGRAD_DEGREES[0]);
  const [undergradBranchMajor, setUndergradBranchMajor] = useState('');
  const [undergradSemester, setUndergradSemester] = useState(UNDERGRAD_SEMESTERS[0]);
  const [postgradDegree, setPostgradDegree] = useState(POSTGRAD_DEGREES[0]);
  const [postgradSpecialization, setPostgradSpecialization] = useState('');
  const [postgradSemester, setPostgradSemester] = useState(POSTGRAD_SEMESTERS[0]);

  // Favorite Subjects & Achievements
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [academicAchievements, setAcademicAchievements] = useState('');

  // Validation & Animation State
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Load existing profile if available
  useEffect(() => {
    const existing = userProfileService.getProfile();
    if (existing) {
      setProfile(existing);
      if (existing.educationLevel) setEducationLevel(existing.educationLevel);
      if (existing.age) setAge(String(existing.age));
      if (existing.schoolName) setInstitutionName(existing.schoolName);
      else if (existing.collegeName) setInstitutionName(existing.collegeName);
      
      if (existing.academicStream) setStream(existing.academicStream);
      if (existing.classYear) setSchoolClass(existing.classYear);
      
      if (existing.degree) {
        if (existing.educationLevel === 'Postgraduate') {
          setPostgradDegree(existing.degree);
        } else {
          setUndergradDegree(existing.degree);
        }
      }
      if (existing.branchMajor) {
        if (existing.educationLevel === 'Postgraduate') {
          setPostgradSpecialization(existing.branchMajor);
        } else {
          setUndergradBranchMajor(existing.branchMajor);
        }
      }
      if (existing.currentSemester || existing.semesterClass || existing.currentYear) {
        const sem = existing.currentSemester || existing.semesterClass || existing.currentYear;
        if (existing.educationLevel === 'Postgraduate') {
          setPostgradSemester(sem);
        } else {
          setUndergradSemester(sem);
        }
      }
      if (existing.favoriteSubjects && existing.favoriteSubjects.length > 0) {
        const lvl = existing.educationLevel || 'Class 8–10';
        const targetTags = lvl === 'Class 8–10' ? SUBJECT_TAGS_JUNIOR : SUBJECT_TAGS_SENIOR;
        const validExisting = existing.favoriteSubjects.filter((s) => targetTags.includes(s));
        if (validExisting.length > 0) {
          setSelectedSubjects(validExisting.slice(0, 5));
        } else {
          setSelectedSubjects(
            lvl === 'Class 8–10'
              ? ['Mathematics', 'Science (Physics/Chemistry/Biology)']
              : ['Mathematics & Calculus', 'Physics & Mechanics']
          );
        }
      }
      if (existing.academicAchievements) {
        setAcademicAchievements(existing.academicAchievements);
      }
    }
  }, []);

  const addAchievementTag = (tag) => {
    setAcademicAchievements((prev) => {
      if (!prev || !prev.trim()) return tag;
      if (prev.includes(tag)) return prev;
      return `${prev.trim()}, ${tag}`;
    });
  };

  const handleLevelChange = (newLevelId) => {
    setEducationLevel(newLevelId);
    setError('');

    // Dynamically prune subjects to only those valid in the new track
    const targetTags = newLevelId === 'Class 8–10' ? SUBJECT_TAGS_JUNIOR : SUBJECT_TAGS_SENIOR;
    setSelectedSubjects((prev) => {
      const retained = prev.filter((s) => targetTags.includes(s));
      if (retained.length > 0) return retained.slice(0, 5);
      return newLevelId === 'Class 8–10'
        ? ['Mathematics', 'Science (Physics/Chemistry/Biology)']
        : ['Mathematics & Calculus', 'Physics & Mechanics'];
    });
  };

  const toggleSubject = (sub) => {
    setError('');
    const targetTags = educationLevel === 'Class 8–10' ? SUBJECT_TAGS_JUNIOR : SUBJECT_TAGS_SENIOR;
    setSelectedSubjects((prev) => {
      const cleanPrev = prev.filter((s) => targetTags.includes(s));
      if (cleanPrev.includes(sub)) {
        return cleanPrev.filter((s) => s !== sub);
      }
      if (cleanPrev.length >= 5) {
        setError('You can select up to 5 favorite subjects.');
        return cleanPrev;
      }
      return [...cleanPrev, sub];
    });
  };

  const isHigherEd = educationLevel === 'Undergraduate' || educationLevel === 'Postgraduate';

  const handleSaveAndProceed = (e) => {
    e.preventDefault();

    // Age validation
    if (!age || isNaN(Number(age)) || Number(age) < 10 || Number(age) > 85) {
      setError('Please enter a valid student age (between 10 and 85).');
      return;
    }

    // Institution Name validation
    if (!institutionName.trim() || institutionName.trim().length < 2) {
      setError(
        isHigherEd
          ? 'Please enter your College / University name.'
          : 'Please enter your School / Junior College name.'
      );
      return;
    }

    // Major / Branch validation for Higher Education
    if (educationLevel === 'Undergraduate' && (!undergradBranchMajor.trim() || undergradBranchMajor.trim().length < 2)) {
      setError('Please enter your Branch / Major or Specialization (e.g. Computer Science, Mechanical).');
      return;
    }

    if (educationLevel === 'Postgraduate' && (!postgradSpecialization.trim() || postgradSpecialization.trim().length < 2)) {
      setError('Please enter your Postgraduate Specialization or Research Discipline.');
      return;
    }

    const visibleSelectedSubjects = selectedSubjects.filter((s) => 
      (educationLevel === 'Class 8–10' ? SUBJECT_TAGS_JUNIOR : SUBJECT_TAGS_SENIOR).includes(s)
    );

    if (visibleSelectedSubjects.length === 0) {
      setError('Please select at least 1 favorite subject or curiosity area.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    const activeDegree = educationLevel === 'Postgraduate' 
      ? postgradDegree 
      : educationLevel === 'Undergraduate' 
        ? undergradDegree 
        : '';

    const activeBranchMajor = educationLevel === 'Postgraduate'
      ? postgradSpecialization.trim()
      : educationLevel === 'Undergraduate'
        ? undergradBranchMajor.trim()
        : '';

    const activeSemester = educationLevel === 'Postgraduate'
      ? postgradSemester
      : educationLevel === 'Undergraduate'
        ? undergradSemester
        : '';

    const activeClassYear = !isHigherEd ? schoolClass : '';

    // Save to userProfileService
    userProfileService.saveProfile({
      educationLevel,
      academicCompleted: true,
      age: Number(age),
      schoolName: !isHigherEd ? institutionName.trim() : '',
      collegeName: isHigherEd ? institutionName.trim() : '',
      academicBoard: !isHigherEd ? boardAffiliation : '',
      universityAffiliation: isHigherEd ? universityAffiliation : '',
      academicStream: educationLevel === 'Class 11–12' ? stream : '',
      classYear: activeClassYear,
      degree: activeDegree,
      branchMajor: activeBranchMajor,
      currentYear: activeSemester,
      currentSemester: activeSemester,
      semesterClass: isHigherEd ? activeSemester : activeClassYear,
      academicAchievements: academicAchievements.trim(),
      favoriteSubjects: visibleSelectedSubjects,
    });

    // Trigger departure animation before routing to Rapid Fire Challenge
    setIsTransitioning(true);
    setTimeout(() => {
      router.push('/rapid-fire');
    }, 1100);
  };

  const subjectList = educationLevel === 'Class 8–10' ? SUBJECT_TAGS_JUNIOR : SUBJECT_TAGS_SENIOR;
  const visibleSelectedSubjects = selectedSubjects.filter((s) => subjectList.includes(s));
  const displayName = profile?.firstName || profile?.fullName?.split(' ')[0] || 'Student';

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-no-repeat bg-[url('/hero-bg.png')] text-parchment flex flex-col justify-between overflow-x-hidden">
      {/* Dark tint overlay & grain */}
      <div className="absolute inset-0 bg-ink-deep/80 backdrop-blur-[2px] pointer-events-none z-0" />
      <GrainOverlay />

      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[550px] w-[550px] rounded-full bg-brass/15 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 right-10 h-[450px] w-[450px] rounded-full bg-brass-bright/10 blur-[120px]" />

      {/* Top Header */}
      <header className="relative z-50 mx-auto w-full max-w-[1180px] px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-display text-[1.22rem] font-semibold text-parchment group cursor-pointer">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-brass-bright group-hover:bg-brass/20 transition-all shadow-[0_0_15px_rgba(217,165,72,0.2)]">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M8 2 L9.6 7.6 L8 14 L6.4 7.6 Z" fill="#d9a548" />
            </svg>
          </span>
          <span className="tracking-tight">{t('nav.brand', {}, 'PathFinders')}</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/register"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-parchment/20 bg-ink/50 px-3.5 py-1.5 text-xs font-mono text-fog hover:text-parchment hover:border-parchment/40 transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Account Info
          </Link>
          <LanguageSwitcher compact={true} />
        </div>
      </header>

      {/* Main Form Container */}
      <main className="relative z-10 mx-auto w-full max-w-[800px] px-4 sm:px-6 py-6 my-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="rounded-3xl border border-parchment/15 bg-ink-deep/90 p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl relative overflow-hidden"
        >
          {/* Waypoint 02 Progress Strip */}
          <div className="mb-8 border-b border-parchment/10 pb-6">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="font-mono text-[0.72rem] tracking-widest uppercase text-brass-bright font-bold flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Waypoint 02 of 04: Academic Profile &amp; Strengths
              </span>
              <span className="font-mono text-xs text-brass-bright font-semibold">50% Mapped</span>
            </div>
            {/* Visual Step Indicator */}
            <div className="grid grid-cols-4 gap-2">
              <div className="h-1.5 rounded-full bg-brass-bright shadow-[0_0_8px_rgba(217,165,72,0.4)]" />
              <div className="h-1.5 rounded-full bg-brass-bright shadow-[0_0_8px_rgba(217,165,72,0.4)]" />
              <div className="h-1.5 rounded-full bg-parchment/20" />
              <div className="h-1.5 rounded-full bg-parchment/20" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center sm:text-left mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brass/15 border border-brass/30 text-brass-bright text-xs font-mono font-medium mb-3">
              <GraduationCap className="h-3.5 w-3.5" />
              Student Academic Background
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-parchment mb-2">
              Welcome, {displayName}! Map your academic coordinates.
            </h1>
            <p className="text-sm text-fog/75 max-w-xl">
              PathFinders weighs your education level, semester/class, and favorite subjects together so the career roadmaps recommended for you fit who you truly are.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 text-xs font-mono flex items-start gap-2.5"
            >
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSaveAndProceed} className="space-y-7">
            {/* 1. Education Level (Includes Postgraduate) */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-fog/80 mb-2.5 font-semibold">
                1. Where are you currently studying? *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {EDUCATION_LEVELS.map((lvl) => {
                  const Icon = lvl.icon;
                  const isSelected = educationLevel === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => handleLevelChange(lvl.id)}
                      className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2.5 ${
                        isSelected
                          ? 'bg-brass/20 border-brass-bright text-parchment shadow-[0_4px_20px_rgba(217,165,72,0.3)] ring-1 ring-brass-bright/50 scale-[1.02]'
                          : 'bg-ink/50 border-parchment/15 text-fog hover:border-brass/40 hover:bg-ink/75 hover:text-parchment'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className={`h-5 w-5 ${isSelected ? 'text-brass-bright' : 'text-fog/60'}`} />
                        {isSelected && (
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brass-bright text-ink-deep text-[0.65rem] font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                      <div>
                        <div className={`font-semibold text-sm ${isSelected ? 'text-parchment' : 'text-fog'}`}>
                          {lvl.label}
                        </div>
                        <div className="text-[0.7rem] text-fog/60 leading-tight mt-0.5">
                          {lvl.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Personal Coordinates & Institution Details (With Age) */}
            <div className="space-y-4 pt-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-fog/80 font-semibold">
                2. Personal Coordinates &amp; Institution Details *
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                {/* Age Input */}
                <div className="sm:col-span-3">
                  <label className="block text-xs text-fog/70 mb-1.5 font-medium">
                    Age *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-fog/50" />
                    <input
                      type="number"
                      required
                      min="10"
                      max="85"
                      value={age}
                      onChange={(e) => {
                        setAge(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="e.g. 19"
                      className="w-full rounded-xl border border-parchment/20 bg-ink/60 pl-10 pr-3 py-3 text-sm text-parchment placeholder-fog/30 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass transition-all"
                    />
                  </div>
                </div>

                {/* Institution Name Input */}
                <div className="sm:col-span-5">
                  <label className="block text-xs text-fog/70 mb-1.5 font-medium">
                    {isHigherEd ? 'College / University Name *' : 'School / Junior College Name *'}
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-fog/50" />
                    <input
                      type="text"
                      required
                      value={institutionName}
                      onChange={(e) => {
                        setInstitutionName(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder={
                        isHigherEd
                          ? 'e.g. IIT Bombay / SRM / Delhi University'
                          : 'e.g. Delhi Public School / Kendriya Vidyalaya'
                      }
                      className="w-full rounded-xl border border-parchment/20 bg-ink/60 pl-10 pr-4 py-3 text-sm text-parchment placeholder-fog/30 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass transition-all"
                    />
                  </div>
                </div>

                {/* Affiliation / Board */}
                <div className="sm:col-span-4">
                  <label className="block text-xs text-fog/70 mb-1.5 font-medium">
                    {isHigherEd ? 'University Affiliation' : 'Education Board / Curriculum'}
                  </label>
                  {isHigherEd ? (
                    <select
                      value={universityAffiliation}
                      onChange={(e) => setUniversityAffiliation(e.target.value)}
                      className="w-full rounded-xl border border-parchment/20 bg-ink/70 px-3.5 py-3 text-sm text-parchment focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass transition-all cursor-pointer"
                    >
                      {UNIVERSITY_TYPES.map((u) => (
                        <option key={u} value={u} className="bg-ink-deep text-parchment">
                          {u}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      value={boardAffiliation}
                      onChange={(e) => setBoardAffiliation(e.target.value)}
                      className="w-full rounded-xl border border-parchment/20 bg-ink/70 px-3.5 py-3 text-sm text-parchment focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass transition-all cursor-pointer"
                    >
                      {BOARDS.map((b) => (
                        <option key={b} value={b} className="bg-ink-deep text-parchment">
                          {b}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Degree / Stream & Semester / Class Details */}
            {educationLevel === 'Undergraduate' && (
              <div className="space-y-4 pt-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-fog/80 font-semibold">
                  3. Degree, Major &amp; Semester / Class *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-fog/70 mb-1.5 font-medium">Degree Programme *</label>
                    <select
                      value={undergradDegree}
                      onChange={(e) => setUndergradDegree(e.target.value)}
                      className="w-full rounded-xl border border-parchment/20 bg-ink/70 px-3.5 py-3 text-sm text-parchment focus:border-brass focus:outline-none transition-all cursor-pointer"
                    >
                      {UNDERGRAD_DEGREES.map((d) => (
                        <option key={d} value={d} className="bg-ink-deep text-parchment">
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-fog/70 mb-1.5 font-medium">Branch / Major *</label>
                    <input
                      type="text"
                      required
                      value={undergradBranchMajor}
                      onChange={(e) => {
                        setUndergradBranchMajor(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="e.g. Mechanical / Computer Science"
                      className="w-full rounded-xl border border-parchment/20 bg-ink/60 px-4 py-3 text-sm text-parchment placeholder-fog/30 focus:border-brass focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-fog/70 mb-1.5 font-medium">Semester / Class *</label>
                    <select
                      value={undergradSemester}
                      onChange={(e) => setUndergradSemester(e.target.value)}
                      className="w-full rounded-xl border border-parchment/20 bg-ink/70 px-3.5 py-3 text-sm text-parchment focus:border-brass focus:outline-none transition-all cursor-pointer"
                    >
                      {UNDERGRAD_SEMESTERS.map((s) => (
                        <option key={s} value={s} className="bg-ink-deep text-parchment">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {educationLevel === 'Postgraduate' && (
              <div className="space-y-4 pt-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-fog/80 font-semibold">
                  3. Postgraduate Degree, Specialization &amp; Semester / Class *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-fog/70 mb-1.5 font-medium">Master’s / PG Programme *</label>
                    <select
                      value={postgradDegree}
                      onChange={(e) => setPostgradDegree(e.target.value)}
                      className="w-full rounded-xl border border-parchment/20 bg-ink/70 px-3.5 py-3 text-sm text-parchment focus:border-brass focus:outline-none transition-all cursor-pointer"
                    >
                      {POSTGRAD_DEGREES.map((d) => (
                        <option key={d} value={d} className="bg-ink-deep text-parchment">
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-fog/70 mb-1.5 font-medium">Specialization / Discipline *</label>
                    <input
                      type="text"
                      required
                      value={postgradSpecialization}
                      onChange={(e) => {
                        setPostgradSpecialization(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="e.g. Machine Learning / Structural Engg"
                      className="w-full rounded-xl border border-parchment/20 bg-ink/60 px-4 py-3 text-sm text-parchment placeholder-fog/30 focus:border-brass focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-fog/70 mb-1.5 font-medium">Semester / Class *</label>
                    <select
                      value={postgradSemester}
                      onChange={(e) => setPostgradSemester(e.target.value)}
                      className="w-full rounded-xl border border-parchment/20 bg-ink/70 px-3.5 py-3 text-sm text-parchment focus:border-brass focus:outline-none transition-all cursor-pointer"
                    >
                      {POSTGRAD_SEMESTERS.map((s) => (
                        <option key={s} value={s} className="bg-ink-deep text-parchment">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {educationLevel === 'Class 11–12' && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono uppercase tracking-wider text-fog/80 font-semibold">
                    3. Academic Stream &amp; Class *
                  </label>
                  <div className="flex items-center gap-2">
                    {CLASSES_SENIOR.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSchoolClass(c)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                          schoolClass === c
                            ? 'bg-brass-bright text-ink-deep font-bold shadow-xs'
                            : 'bg-ink/50 text-fog border border-parchment/20 hover:text-parchment'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {STREAMS_SENIOR.map((st) => {
                    const isSel = stream === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStream(st)}
                        className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                          isSel
                            ? 'bg-brass/20 border-brass-bright text-parchment font-semibold'
                            : 'bg-ink/40 border-parchment/15 text-fog hover:text-parchment hover:border-parchment/30'
                        }`}
                      >
                        <span>{st}</span>
                        {isSel && <Check className="h-4 w-4 text-brass-bright" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {educationLevel === 'Class 8–10' && (
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-fog/80 font-semibold">
                  3. Current Class / Standard *
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {CLASSES_JUNIOR.map((c) => {
                    const isSel = schoolClass === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSchoolClass(c)}
                        className={`px-4 py-2 rounded-xl text-xs font-mono font-medium border transition-all cursor-pointer flex items-center gap-2 ${
                          isSel
                            ? 'bg-brass/20 border-brass-bright text-parchment font-bold ring-1 ring-brass-bright/40'
                            : 'bg-ink/40 border-parchment/15 text-fog hover:border-parchment/30 hover:text-parchment'
                        }`}
                      >
                        <span>{c}</span>
                        {isSel && <Check className="h-3.5 w-3.5 text-brass-bright" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. Favorite Subjects & Intellectual Curiosities */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono uppercase tracking-wider text-fog/80 font-semibold">
                  4. Favorite Subjects &amp; Natural Curiosities *
                </label>
                <span className="text-[0.7rem] font-mono text-brass-bright font-bold">
                  {visibleSelectedSubjects.length}/5 selected
                </span>
              </div>
              <p className="text-xs text-fog/60">
                Choose the subjects you genuinely enjoy or find yourself researching in your free time (up to 5).
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {subjectList.map((sub) => {
                  const isSelected = visibleSelectedSubjects.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => toggleSubject(sub)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-brass-bright text-ink-deep border-brass-bright font-semibold shadow-xs'
                          : 'bg-ink/50 border-parchment/20 text-fog hover:border-brass/50 hover:text-parchment'
                      }`}
                    >
                      <span>{isSelected ? '✓' : '+'}</span>
                      <span>{sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Academic Achievements & Honours (Optional) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono uppercase tracking-wider text-fog/80 font-semibold flex items-center gap-1.5">
                  <Trophy className="h-3.5 w-3.5 text-brass-bright" />
                  5. Academic Achievements &amp; Honours (Optional)
                </label>
                <span className="text-[0.7rem] font-mono text-fog/50 bg-ink/50 border border-parchment/10 px-2 py-0.5 rounded-full">
                  Optional
                </span>
              </div>
              <p className="text-xs text-fog/60">
                Mention any competitive exam percentiles, Olympiads, scholarships, hackathons, or academic distinctions.
              </p>

              <div className="relative">
                <textarea
                  rows={3}
                  value={academicAchievements}
                  onChange={(e) => setAcademicAchievements(e.target.value)}
                  placeholder="e.g. Qualified NTSE Stage 1, JEE Main 98.4 Percentile, 1st place in Inter-College Robotics Hackathon, School topper in Class 10th Science..."
                  className="w-full rounded-xl border border-parchment/20 bg-ink/60 px-4 py-3 text-sm text-parchment placeholder-fog/30 focus:border-brass focus:outline-none transition-all resize-y min-h-[84px]"
                />
              </div>

              {/* Quick Suggestion Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[0.68rem] font-mono text-fog/50 mr-1">Quick add:</span>
                {ACHIEVEMENT_SUGGESTIONS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addAchievementTag(tag)}
                    className="px-2.5 py-1 rounded-full text-[0.7rem] font-mono bg-ink/40 border border-parchment/15 text-fog hover:text-brass-bright hover:border-brass/40 transition-all cursor-pointer"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-parchment/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full border border-parchment/20 bg-ink/40 px-5 py-2.5 text-xs font-mono text-fog hover:text-parchment hover:border-parchment/40 transition-all cursor-pointer order-2 sm:order-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Account Info
              </Link>

              <button
                type="submit"
                disabled={isSubmitting || isTransitioning}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brass via-brass-bright to-brass px-8 py-3.5 text-sm font-semibold text-ink-deep shadow-[0_4px_20px_rgba(217,165,72,0.4)] hover:shadow-[0_6px_28px_rgba(217,165,72,0.6)] transition-all hover:scale-105 active:scale-95 cursor-pointer font-mono order-1 sm:order-2"
              >
                <span>Complete Academic Profile &amp; Start Rapid Fire</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Departure Route Transition Overlay */}
          <AnimatePresence>
            {isTransitioning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-ink-deep/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4 max-w-sm"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-brass-bright bg-brass/20 text-brass-bright shadow-[0_0_25px_rgba(217,165,72,0.5)]">
                    <CheckCircle2 className="h-8 w-8 text-brass-bright" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-parchment">
                    Academic Coordinates Mapped!
                  </h3>
                  <p className="text-xs text-fog/80 font-mono">
                    Initializing your customized Rapid Fire Challenge...
                  </p>
                  <div className="h-1.5 w-full bg-ink rounded-full overflow-hidden border border-brass/30">
                    <motion.div
                      className="h-full bg-gradient-to-r from-brass to-brass-bright"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.9, ease: 'easeInOut' }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-4 font-mono text-xs text-fog/40">
        PathFinders Expedition • © 2026 • AI Career Guidance
      </footer>
    </div>
  );
}

export default function AcademicBackgroundPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-parchment font-mono">Loading Academic Profile...</div>}>
      <AcademicBackgroundContent />
    </Suspense>
  );
}
