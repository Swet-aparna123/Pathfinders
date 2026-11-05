'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import CountryCodeSelect from './CountryCodeSelect';
import {
  GraduationCap,
  HeartHandshake,
  Repeat2,
  Mail,
  Lock,
  User,
  Phone,
  BookOpen,
  Compass,
  Award,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Eye,
  EyeOff,
  Camera,
  Upload,
  Trash2,
  Building2,
  Briefcase,
  X,
} from 'lucide-react';
import GrainOverlay from '@/components/GrainOverlay';
import { useRegister } from '@/components/RegisterContext';
import { userProfileService } from '@/lib/userProfileService';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const ROLES = [
  { id: 'student', title: 'Student', desc: 'High school, college, or recent grad', icon: GraduationCap },
  { id: 'parent', title: 'Parent / Guardian', desc: 'Supporting student route & milestones', icon: HeartHandshake },
  { id: 'switch', title: 'Career Switcher', desc: 'Professional plotting a sector pivot', icon: Repeat2 },
];

const EDUCATION_LEVELS = [
  { id: 'Class 8–10', label: 'Class 8–10', desc: 'High School (Foundational Phase)' },
  { id: 'Class 11–12', label: 'Class 11–12', desc: 'Higher Secondary & Stream Phase' },
  { id: 'Undergraduate', label: 'Undergraduate', desc: 'College / University Degree' },
];

const ACADEMIC_PERFORMANCE_OPTIONS = [
  '⭐ Excellent (85%+)',
  '👍 Good (70–84%)',
  '📘 Average (50–69%)',
  '📈 Improving',
];

const ACADEMIC_STREAMS = [
  'PCM (Physics, Chem, Math)',
  'PCB (Physics, Chem, Biology)',
  'PCMB (Math & Bio Combined)',
  'Commerce with Math',
  'Commerce / Business Studies',
  'Humanities / Arts & Social Sciences',
  'Computer Science / IT',
  'Other / Vocational Stream',
];

const DEGREES = [
  'B.Tech / B.E. (Engineering & Tech)',
  'B.Sc (Bachelor of Science)',
  'B.Com (Commerce & Finance)',
  'B.A. (Arts & Humanities)',
  'BBA / BMS (Management)',
  'BCA / B.Sc CS (Computer Applications)',
  'MBBS / BDS / Health Sciences',
  'B.Des / B.Arch (Design & Architecture)',
  'Other Degree',
];

const COLLEGE_YEARS = [
  '1st Year (Freshman)',
  '2nd Year (Sophomore)',
  '3rd Year (Junior)',
  '4th Year / Final Year (Senior)',
];

const CGPA_OPTIONS = [
  '⭐ 9.0+ CGPA / 90%+ (Top Distinction)',
  '👍 8.0 – 8.9 CGPA / 80–89% (Distinction)',
  '📘 7.0 – 7.9 CGPA / 70–79% (First Class)',
  '📈 6.0 – 6.9 CGPA / 60–69% (Second Class)',
  '🎯 Below 6.0 CGPA / Below 60%',
];

const SUBJECT_TAGS_JUNIOR = [
  'Mathematics',
  'Science (Physics/Chemistry/Biology)',
  'Social Studies / History',
  'English & Literature',
  'Computer Applications / Coding',
  'Languages (Hindi/Regional/Foreign)',
  'Arts & Creative Design',
  'Environmental Studies',
];

const SUBJECT_TAGS_SENIOR = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology / Life Sciences',
  'Computer Science / Coding',
  'Economics & Finance',
  'Business Studies & Accountancy',
  'Psychology',
  'Literature & Writing',
  'Graphic & UI Design',
  'Political Science / Law',
  'Data Analytics',
];

const CURRENT_INDUSTRIES = [
  'IT',
  'Finance',
  'Healthcare',
  'Education',
  'Marketing',
  'Manufacturing',
  'Government',
  'Other',
];

const EXPERIENCE_YEARS = ['0–1', '2–3', '4–6', '7–10', '10+'];

const PIVOT_TARGETS = [
  'Data Scientist',
  'UX Designer',
  'Product Manager',
  'Cybersecurity Analyst',
  'AI & Machine Learning Engineer',
  'Cloud Architect',
  'Digital Marketing Lead',
  'Management Consultant',
  'Software Engineer',
  'Other',
];

const COUNTRY_CODES = [
  { code: '+91', label: '🇮🇳 +91 (India)' },
  { code: '+1', label: '🇺🇸 +1 (US/CA)' },
  { code: '+44', label: '🇬🇧 +44 (UK)' },
  { code: '+61', label: '🇦🇺 +61 (AU)' },
  { code: '+971', label: '🇦🇪 +971 (UAE)' },
  { code: '+65', label: '🇸🇬 +65 (SG)' },
  { code: '+49', label: '🇩🇪 +49 (DE)' },
  { code: '+33', label: '🇫🇷 +33 (FR)' },
  { code: '+81', label: '🇯🇵 +81 (JP)' },
  { code: '+86', label: '🇨🇳 +86 (CN)' },
  { code: '+966', label: '🇸🇦 +966 (KSA)' },
  { code: '+27', label: '🇿🇦 +27 (ZA)' },
  { code: '+55', label: '🇧🇷 +55 (BR)' },
  { code: '+7', label: '🇷🇺 +7 (RU)' },
  { code: '+82', label: '🇰🇷 +82 (KR)' },
];

export default function RegisterDrawer() {
  const router = useRouter();
  const { isRegisterOpen, registerRole, closeRegister, switchToLogin } = useRegister();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(registerRole);

  useEffect(() => {
    if (registerRole) {
      setRole(registerRole);
    }
  }, [registerRole]);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passError, setPassError] = useState('');

  // Password strength helper
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '', activeDots: 0 };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8 && (/[A-Z]/.test(pass) || /[0-9]/.test(pass))) score++;
    if (pass.length >= 10 && /[^A-Za-z0-9]/.test(pass)) score++;

    const finalScore = Math.max(1, score);
    if (finalScore === 1) return { score: 1, label: 'Weak Password', color: 'text-red-400', activeDots: 1 };
    if (finalScore === 2) return { score: 2, label: 'Medium Strength', color: 'text-yellow-400', activeDots: 2 };
    return { score: 3, label: 'Strong Password', color: 'text-green-400', activeDots: 3 };
  };

  const strength = getPasswordStrength(password);

  // Profile Picture State
  const [profilePic, setProfilePic] = useState(null);
  const [isDraggingPic, setIsDraggingPic] = useState(false);

  const handleImageUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePic(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) handleImageUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingPic(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  // Student Fields State
  const [educationLevel, setEducationLevel] = useState('Class 8–10');
  const [schoolName, setSchoolName] = useState('');
  const [stream, setStream] = useState(ACADEMIC_STREAMS[0]);
  const [selectedSubjects, setSelectedSubjects] = useState(['Mathematics', 'Science (Physics/Chemistry/Biology)']);
  const [academicPerformance, setAcademicPerformance] = useState(ACADEMIC_PERFORMANCE_OPTIONS[0]);
  const [collegeName, setCollegeName] = useState('');
  const [degree, setDegree] = useState(DEGREES[0]);
  const [branchMajor, setBranchMajor] = useState('');
  const [currentYear, setCurrentYear] = useState(COLLEGE_YEARS[0]);
  const [cgpa, setCgpa] = useState(CGPA_OPTIONS[1]);
  const [targetGoal, setTargetGoal] = useState(PIVOT_TARGETS[0]);

  // Parent Fields State
  const [hasChildAccount, setHasChildAccount] = useState('yes');
  const [parentRelation, setParentRelation] = useState('Parent');
  const [studentName, setStudentName] = useState('');
  const [studentIdentifier, setStudentIdentifier] = useState('');
  const [noAccountChoice, setNoAccountChoice] = useState('invite');
  const [inviteChildName, setInviteChildName] = useState('');
  const [inviteChildContact, setInviteChildContact] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Career Switcher Fields State
  const [currentJobRole, setCurrentJobRole] = useState('Software Developer');
  const [currentIndustry, setCurrentIndustry] = useState('IT');
  const [expYears, setExpYears] = useState('2–3');
  const [targetPivot, setTargetPivot] = useState('Data Scientist');

  // Submit State
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleSubject = (sub) => {
    if (selectedSubjects.includes(sub)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== sub));
    } else {
      if (selectedSubjects.length < 5) {
        setSelectedSubjects([...selectedSubjects, sub]);
      }
    }
  };

  const validateFullName = (nameStr) => {
    const trimmed = nameStr.trim();
    if (trimmed.length < 3) return false;
    if (!/^[a-zA-Z\s'.]{3,}$/.test(trimmed)) return false;
    const uniqueLetters = new Set(trimmed.toLowerCase().replace(/[^a-z]/g, ''));
    if (uniqueLetters.size < 2) return false;
    return true;
  };

  const validatePhone = (phoneStr) => {
    const cleaned = phoneStr.replace(/\D/g, '');
    return cleaned.length >= 7 && cleaned.length <= 15;
  };

  const getPasswordRules = (pass) => {
    return {
      minLength: pass.length >= 8,
      hasUpper: /[A-Z]/.test(pass),
      hasNumber: /[0-9]/.test(pass),
      hasSymbol: /[^A-Za-z0-9]/.test(pass),
    };
  };

  const passRules = getPasswordRules(password);
  const isPassValid = passRules.minLength && passRules.hasUpper && passRules.hasNumber && passRules.hasSymbol;

  const validateStep1 = () => {
    if (!firstName.trim() || firstName.trim().length < 2) {
      setPassError('Please enter a valid First Name (at least 2 letters).');
      return false;
    }
    if (!lastName.trim() || lastName.trim().length < 1) {
      setPassError('Please enter a valid Last Name.');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      setPassError('Please enter a valid email address.');
      return false;
    }
    if (!validatePhone(phone)) {
      setPassError('Please enter a valid contact number (7 to 15 digits).');
      return false;
    }
    if (!isPassValid) {
      setPassError('Password must satisfy all rules: 8+ characters, uppercase letter, number, and special symbol.');
      return false;
    }
    if (!confirmPassword) {
      setPassError('Please confirm your password.');
      return false;
    }
    if (password !== confirmPassword) {
      setPassError('Passwords do not match. Please ensure both password fields match.');
      return false;
    }
    setPassError('');
    return true;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!validateStep1()) return;

      // When registering as student, start completely fresh user and navigate directly to dedicated Academic Background page
      if (role === 'student') {
        userProfileService.createNewUser({
          fullName: fullName.trim(),
          firstName: firstName.trim(),
          middleName: middleName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: `${countryCode} ${phone.trim()}`,
          role: 'student',
          avatarUrl: profilePic || null,
        });

        setLoading(true);
        setTimeout(() => {
          window.location.assign('/academic-background');
        }, 350);
        return;
      }
    }

    if (step < 2) {
      setStep(step + 1);
    } else {
      setLoading(true);
      userProfileService.createNewUser({
        fullName: fullName.trim(),
        firstName: firstName.trim(),
        middleName: middleName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: `${countryCode} ${phone.trim()}`,
        role: role,
        educationLevel: educationLevel,
        academicStream: stream,
        favoriteSubjects: selectedSubjects,
        schoolName: schoolName,
        collegeName: collegeName,
        degree: degree,
        branchMajor: branchMajor,
        targetGoal: targetGoal,
        currentJobRole: currentJobRole || 'Software Engineering',
        currentIndustry: currentIndustry || 'IT',
        expYears: `${expYears} Years`,
        targetPivot: targetPivot || targetGoal || 'AI & Data Science Specialist',
        avatarUrl: profilePic || null,
      });

      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
      }, 300);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <AnimatePresence>
      {isRegisterOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 200 }}
          className="fixed inset-0 z-[100] w-full h-full bg-cover bg-center bg-no-repeat bg-[url('/hero-bg.png')] text-parchment flex flex-col justify-between overflow-y-auto overflow-x-hidden"
        >
          {/* Dark overlay for contrast */}
          <div className="absolute inset-0 bg-ink-deep/75 backdrop-blur-[2px] pointer-events-none z-0" />
          <GrainOverlay />

          {/* Ambient background light */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-brass/15 blur-[110px]"
          />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-[380px] w-[380px] rounded-full bg-brass-bright/15 blur-[90px]" />

          {/* Full Screen Header */}
          <header className="relative z-50 mx-auto w-full max-w-[1180px] px-6 py-6 flex items-center justify-between">
            <button onClick={closeRegister} className="flex items-center gap-2.5 font-display text-[1.22rem] font-semibold text-parchment group cursor-pointer">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-brass-bright group-hover:bg-brass/20 transition-all shadow-[0_0_15px_rgba(217,165,72,0.2)]">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2 L9.6 7.6 L8 14 L6.4 7.6 Z" fill="#d9a548" />
                </svg>
              </span>
              <span>PathFinders</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-fog/60 uppercase tracking-widest hidden sm:inline">
                {role === 'switch' ? 'Career Switch Portal' : role === 'parent' ? 'Parent Portal' : 'Official Student Intake'}
              </span>
              <LanguageSwitcher compact={true} />
              <button
                type="button"
                onClick={switchToLogin}
                className="text-xs font-semibold text-brass-bright hover:underline cursor-pointer bg-transparent border-0"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={closeRegister}
                className="inline-flex items-center gap-2 rounded-full border border-parchment/20 bg-ink/60 px-4 py-2 text-xs font-semibold text-parchment hover:border-brass hover:text-brass-bright transition-all cursor-pointer shadow-md active:scale-95"
              >
                <span>Return to Home</span>
                <X className="h-4 w-4 text-brass-bright" />
              </button>
            </div>
          </header>

          {/* Full Page Registration Container */}
          <main className="relative z-10 mx-auto w-full max-w-[680px] px-6 py-6 my-auto">
            <div className="rounded-2xl border border-parchment/15 bg-ink-deep/85 p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl relative overflow-hidden">
              {/* Decorative Corner Accent */}
              <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-brass/20 to-transparent pointer-events-none rounded-bl-full" />
              {/* Stepper Progress Bar */}
              {!submitted && (
                role === 'student' ? (
                  <div className="mb-6 flex items-center justify-between border-b border-parchment/10 pb-4">
                    <span className="font-mono text-xs tracking-wider uppercase text-brass-bright font-semibold flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      Account Registration
                    </span>
                    <span className="font-mono text-xs text-fog/60">
                      Profile Setup
                    </span>
                  </div>
                ) : (
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-mono text-xs tracking-wider uppercase text-brass-bright font-semibold">
                        Waypoint 0{step} of 02 — {
                          step === 1 
                            ? (role === 'parent' ? 'Parent Account' : 'Account Info') 
                            : (role === 'switch' ? 'Current Experience' : 'Child Connection')
                        }
                      </span>
                      <span className="font-mono text-xs text-fog/50">
                        {step === 1 ? '50%' : '100%'} Complete
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-ink/80 rounded-full overflow-hidden border border-parchment/10">
                      <motion.div
                        className="h-full bg-gradient-to-r from-brass via-brass-bright to-brass"
                        initial={{ width: '50%' }}
                        animate={{ width: `${(step / 2) * 100}%` }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                      />
                    </div>

                    {/* Waypoint Badges */}
                    <div className="grid grid-cols-2 gap-2 mt-4 text-center">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className={`py-1.5 px-2 rounded text-[0.72rem] font-mono transition-all cursor-pointer ${
                          step >= 1 ? 'text-brass-bright font-semibold bg-brass/10 border border-brass/30' : 'text-fog/40 border border-transparent'
                        }`}
                      >
                        1. {role === 'parent' ? 'Parent Account' : 'Account Info'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className={`py-1.5 px-2 rounded text-[0.72rem] font-mono transition-all cursor-pointer ${
                          step >= 2 ? 'text-brass-bright font-semibold bg-brass/10 border border-brass/30' : 'text-fog/40 border border-transparent'
                        }`}
                      >
                        2. {role === 'switch' ? 'Current Career' : 'Child Connection'}
                      </button>
                    </div>
                  </div>
                )
              )}

              {submitted ? (
                /* Submission Success Screen */
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="py-8 text-center"
                >
                  <div className="mx-auto mb-4 relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-brass-bright bg-brass/10 text-brass-bright shadow-[0_0_25px_rgba(217,165,72,0.4)] overflow-hidden">
                    {profilePic ? (
                      <img src={profilePic} alt={fullName} className="h-full w-full object-cover" />
                    ) : (
                      <CheckCircle2 className="h-10 w-10" />
                    )}
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-parchment mb-2">
                    {role === 'switch' ? 'Career Switch Strategy Mapped!' : role === 'parent' ? 'Parent Account Initialized!' : 'Expedition Profile Initialized!'}
                  </h2>
                  <p className="text-sm text-fog/80 max-w-[460px] mx-auto mb-6 leading-relaxed">
                    Welcome, <strong className="text-brass-bright">{fullName}</strong>. Registration completed successfully.
                  </p>

                  <div className="rounded-xl border border-brass/30 bg-ink/60 p-5 text-left mb-8 max-w-[460px] mx-auto space-y-2 text-xs font-mono text-fog shadow-lg">
                    <div className="flex justify-between border-b border-parchment/10 pb-1.5">
                      <span className="text-fog/50">Full Name:</span>
                      <span className="text-parchment font-semibold">{fullName}</span>
                    </div>
                    <div className="flex justify-between border-b border-parchment/10 pb-1.5">
                      <span className="text-fog/50">Email:</span>
                      <span className="text-brass-bright font-semibold">{email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-fog/50">Account Role:</span>
                      <span className="text-parchment font-semibold capitalize">{role}</span>
                    </div>
                  </div>

                  <Link
                    href={role === 'switch' ? '/career-switcher-dashboard' : role === 'parent' ? '/parent-dashboard' : '/student-dashboard'}
                    onClick={closeRegister}
                    className="inline-flex items-center gap-2 rounded-full bg-brass px-7 py-3 text-sm font-semibold text-ink-deep hover:bg-brass-bright hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(185,134,46,0.35)] transition-all cursor-pointer"
                  >
                    <span>Enter Expedition Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              ) : (
                <form onSubmit={handleNext} className="space-y-6">
                  {/* STEP 1 */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <div className="text-center sm:text-left mb-4">
                        <h2 className="font-display text-xl font-semibold text-parchment">
                          {role === 'parent' ? 'Step 1 — Parent Account' : 'Step 1: Account Credentials & Role'}
                        </h2>
                        <p className="text-xs text-fog/60">
                          Select your intake mode to access tailored career features.
                        </p>
                      </div>

                      {/* Role Selector */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-fog/75 mb-2">
                          I am registering as a
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {ROLES.map((r) => {
                            const Icon = r.icon;
                            const selected = role === r.id;
                            return (
                              <button
                                key={r.id}
                                type="button"
                                onClick={() => setRole(r.id)}
                                className={`flex flex-col items-center text-center p-3.5 rounded-xl border transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.97] ${
                                  selected
                                    ? 'border-brass bg-brass/15 text-parchment ring-1 ring-brass shadow-[0_4px_12px_rgba(185,134,46,0.25)]'
                                    : 'border-parchment/15 bg-ink/40 text-fog/60 hover:border-parchment/30 hover:text-fog'
                                }`}
                              >
                                <Icon className={`h-6 w-6 mb-2 ${selected ? 'text-brass-bright' : 'text-fog/40'}`} />
                                <span className="text-xs font-semibold mb-0.5">{r.title}</span>
                                <span className="text-[0.68rem] text-fog/50 leading-tight">{r.desc}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Profile Photo Upload */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-fog/75 mb-2">
                          Profile Picture
                        </label>
                        <div
                          onDrop={handleDrop}
                          onDragOver={(e) => { e.preventDefault(); setIsDraggingPic(true); }}
                          onDragLeave={(e) => { e.preventDefault(); setIsDraggingPic(false); }}
                          className={`relative flex flex-col sm:flex-row items-center gap-4 rounded-xl border-2 border-dashed p-4 transition-all ${
                            isDraggingPic ? 'border-brass-bright bg-brass/20 shadow-[0_0_20px_rgba(217,165,72,0.35)]' : 'border-parchment/20 bg-ink/40 hover:border-brass/40'
                          }`}
                        >
                          <div className="relative group shrink-0">
                            <label
                              htmlFor="drawer-avatar-input"
                              className="relative flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-brass-bright/70 bg-ink-deep text-brass-bright shadow-lg transition-all group-hover:scale-105"
                            >
                              {profilePic ? (
                                <img src={profilePic} alt="Profile Avatar" className="h-full w-full object-cover" />
                              ) : (
                                <User className="h-8 w-8 text-fog/50 group-hover:text-brass-bright" />
                              )}
                              <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="h-5 w-5 text-parchment" />
                              </div>
                            </label>
                            <input
                              id="drawer-avatar-input"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </div>

                          <div className="flex-1 text-center sm:text-left">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                              <label
                                htmlFor="drawer-avatar-input"
                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-brass/20 border border-brass/40 px-3.5 py-1 text-xs font-semibold text-brass-bright hover:bg-brass hover:text-ink-deep transition-all"
                              >
                                <Upload className="h-3.5 w-3.5" />
                                {profilePic ? 'Change Photo' : 'Upload Photo'}
                              </label>
                              {profilePic && (
                                <button
                                  type="button"
                                  onClick={() => setProfilePic(null)}
                                  className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-all"
                                >
                                  <Trash2 className="h-3 w-3" /> Remove
                                </button>
                              )}
                            </div>
                            <p className="text-[0.72rem] text-fog/60 leading-normal">
                              Drag &amp; drop your avatar photo here, or click to browse (JPG, PNG).
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* First, Middle, Last Name */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-fog/75 mb-1.5">
                            First Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-fog/50" />
                            <input
                              type="text"
                              required
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              placeholder="First Name"
                              className="w-full rounded-lg border border-parchment/20 bg-ink/60 pl-10 pr-3 py-3 text-sm text-parchment placeholder-fog/30 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-fog/75 mb-1.5">
                            Middle Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-fog/50" />
                            <input
                              type="text"
                              value={middleName}
                              onChange={(e) => setMiddleName(e.target.value)}
                              placeholder="Middle Name"
                              className="w-full rounded-lg border border-parchment/20 bg-ink/60 pl-10 pr-3 py-3 text-sm text-parchment placeholder-fog/30 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-fog/75 mb-1.5">
                            Last Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-fog/50" />
                            <input
                              type="text"
                              required
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              placeholder="Last Name"
                              className="w-full rounded-lg border border-parchment/20 bg-ink/60 pl-10 pr-3 py-3 text-sm text-parchment placeholder-fog/30 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass transition-colors"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Email & Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-fog/75 mb-1.5">
                            Email Address *
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-fog/50" />
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Email Address"
                              className="w-full rounded-lg border border-parchment/20 bg-ink/60 pl-10 pr-4 py-3 text-sm text-parchment placeholder-fog/30 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-fog/75 mb-1.5">
                            Contact / Phone Number *
                          </label>
                          <div className="flex items-center gap-2">
                            <CountryCodeSelect value={countryCode} onChange={setCountryCode} />
                            <div className="relative flex-1">
                              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-fog/50" />
                              <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Phone Number"
                                className="w-full rounded-lg border border-parchment/20 bg-ink/60 pl-10 pr-4 py-3 text-sm text-parchment placeholder-fog/30 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass transition-colors font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Password & Confirm */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-xs font-mono uppercase tracking-wider text-fog/75">
                              Create Password *
                            </label>
                            {password && <span className={`text-[0.68rem] font-mono font-semibold ${strength.color}`}>{strength.label}</span>}
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-fog/50" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Create Password"
                              className="w-full rounded-lg border border-parchment/20 bg-ink/60 pl-10 pr-10 py-3 text-sm text-parchment placeholder-fog/30 focus:border-brass focus:outline-none transition-colors"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-fog/50 hover:text-parchment"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>

                          {/* Password Requirements Checklist */}
                          <div className="mt-2.5 p-3 rounded-xl border border-parchment/15 bg-ink/70 space-y-1.5 font-mono text-[0.72rem]">
                            <div className="font-semibold text-fog/80 mb-1">Password Requirements:</div>
                            <div className="grid grid-cols-2 gap-1.5">
                              <div className={`flex items-center gap-1.5 ${passRules.minLength ? 'text-emerald-400 font-bold' : 'text-fog/50'}`}>
                                <span>{passRules.minLength ? '✓' : '○'}</span>
                                <span>At least 8 characters</span>
                              </div>
                              <div className={`flex items-center gap-1.5 ${passRules.hasUpper ? 'text-emerald-400 font-bold' : 'text-fog/50'}`}>
                                <span>{passRules.hasUpper ? '✓' : '○'}</span>
                                <span>Uppercase letter (A-Z)</span>
                              </div>
                              <div className={`flex items-center gap-1.5 ${passRules.hasNumber ? 'text-emerald-400 font-bold' : 'text-fog/50'}`}>
                                <span>{passRules.hasNumber ? '✓' : '○'}</span>
                                <span>Number (0-9)</span>
                              </div>
                              <div className={`flex items-center gap-1.5 ${passRules.hasSymbol ? 'text-emerald-400 font-bold' : 'text-fog/50'}`}>
                                <span>{passRules.hasSymbol ? '✓' : '○'}</span>
                                <span>Special symbol (!@#$)</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-xs font-mono uppercase tracking-wider text-fog/75">
                              Confirm Password *
                            </label>
                            {confirmPassword && (
                              <span className={`text-[0.68rem] font-mono font-semibold ${password === confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                                {password === confirmPassword ? '✓ Passwords match' : '✕ Passwords do not match'}
                              </span>
                            )}
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-fog/50" />
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              required
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Re-enter your password"
                              className="w-full rounded-lg border border-parchment/20 bg-ink/60 pl-10 pr-10 py-3 text-sm text-parchment placeholder-fog/30 focus:border-brass focus:outline-none transition-colors"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-fog/50 hover:text-parchment"
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: SWITCHER */}
                  {step === 2 && role === 'switch' && (
                    <div className="space-y-5">
                      <div className="text-center sm:text-left mb-4">
                        <h2 className="font-display text-xl font-semibold text-parchment uppercase tracking-wide">
                          Step 2 — Current Career
                        </h2>
                        <p className="text-xs text-fog/60">Tell us about your current job role, experience, and industry.</p>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-fog/75 mb-1.5">
                          Current Job Role *
                        </label>
                        <div className="relative">
                          <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-fog/50" />
                          <input
                            type="text"
                            required
                            value={currentJobRole}
                            onChange={(e) => setCurrentJobRole(e.target.value)}
                            placeholder="Current Job Role"
                            className="w-full rounded-lg border border-parchment/20 bg-ink/60 pl-10 pr-4 py-3 text-sm text-parchment focus:border-brass focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-fog/75 mb-2">
                            Years of Experience *
                          </label>
                          <select
                            value={expYears}
                            onChange={(e) => setExpYears(e.target.value)}
                            className="w-full rounded-lg border border-parchment/20 bg-ink/80 px-4 py-3 text-sm text-parchment focus:border-brass focus:outline-none"
                          >
                            {EXPERIENCE_YEARS.map((y) => (
                              <option key={y} value={y} className="bg-ink-deep text-parchment">{y} Years</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: PARENT */}
                  {step === 2 && role === 'parent' && (
                    <div className="space-y-5">
                      <div className="text-center sm:text-left mb-4">
                        <h2 className="font-display text-xl font-semibold text-parchment">
                          STEP 2 — CHILD CONNECTION
                        </h2>
                        <p className="text-xs text-fog/60">Connect your parent portal to your child&apos;s PathFinders account.</p>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-fog/75 mb-2.5">
                          Do you have a child/student using PathFinders? *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setHasChildAccount('yes')}
                            className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                              hasChildAccount === 'yes'
                                ? 'border-brass bg-brass/20 text-parchment ring-1 ring-brass'
                                : 'border-parchment/15 bg-ink/40 text-fog/60 hover:text-fog'
                            }`}
                          >
                            <span className="text-lg">🟡</span>
                            <div>
                              <span className="block text-xs font-bold text-parchment mb-0.5">Yes, child has account</span>
                              <span className="text-[0.68rem] text-fog/50 block">Link existing profile</span>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setHasChildAccount('no')}
                            className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                              hasChildAccount === 'no'
                                ? 'border-brass bg-brass/20 text-parchment ring-1 ring-brass'
                                : 'border-parchment/15 bg-ink/40 text-fog/60 hover:text-fog'
                            }`}
                          >
                            <span className="text-lg">⚪</span>
                            <div>
                              <span className="block text-xs font-bold text-parchment mb-0.5">No, child hasn&apos;t joined</span>
                              <span className="text-[0.68rem] text-fog/50 block">Invite or parent counselling</span>
                            </div>
                          </button>
                        </div>
                      </div>

                      {hasChildAccount === 'yes' ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-mono uppercase tracking-wider text-fog/75 mb-1.5">
                              Student&apos;s Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={studentName}
                              onChange={(e) => setStudentName(e.target.value)}
                              placeholder="Child's Full Name"
                              className="w-full rounded-lg border border-parchment/20 bg-ink/60 px-4 py-3 text-sm text-parchment focus:border-brass focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-mono uppercase tracking-wider text-fog/75 mb-1.5">
                              Student ID / Email *
                            </label>
                            <input
                              type="text"
                              required
                              value={studentIdentifier}
                              onChange={(e) => setStudentIdentifier(e.target.value)}
                              placeholder="Student ID or Email"
                              className="w-full rounded-lg border border-parchment/20 bg-ink/60 px-4 py-3 text-sm text-parchment focus:border-brass focus:outline-none"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="pt-2">
                          <label className="flex items-start gap-3 cursor-pointer group rounded-xl border border-parchment/15 bg-ink/40 p-4 hover:border-brass/40 transition-all">
                            <input
                              type="checkbox"
                              required
                              checked={agreeToTerms}
                              onChange={(e) => setAgreeToTerms(e.target.checked)}
                              className="mt-0.5 rounded border-parchment/30 bg-ink text-brass focus:ring-brass/40 h-4 w-4 cursor-pointer"
                            />
                            <span className="text-xs text-parchment group-hover:text-brass-bright transition-colors font-medium">
                              I agree to the Terms &amp; Parent Counselling Guidelines
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between pt-6 border-t border-parchment/15">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-parchment/20 text-xs font-semibold text-fog hover:text-parchment transition-all cursor-pointer"
                      >
                        <ArrowLeft className="h-4 w-4" /> Back
                      </button>
                    ) : (
                      <div />
                    )}

                    <button
                      type="submit"
                      disabled={loading || (step === 1 && (!fullName || !email || !password))}
                      className="inline-flex items-center gap-2 rounded-full bg-brass px-7 py-3 text-sm font-semibold text-ink-deep hover:bg-brass-bright shadow-[0_4px_20px_rgba(185,134,46,0.35)] transition-all disabled:opacity-40 cursor-pointer"
                    >
                      {loading ? (
                        <span>Processing Profile...</span>
                      ) : step < 2 ? (
                        <>
                          <span>Continue Route</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          <span>Complete Account Setup</span>
                          <Sparkles className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </main>

          <footer className="relative z-10 text-center py-5 font-mono text-xs text-fog/40">
            PathFinders Official Intake • © 2026
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
