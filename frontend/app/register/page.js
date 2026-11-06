'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import CountryCodeSelect from '@/components/CountryCodeSelect';
import {
  GraduationCap,
  HeartHandshake,
  Repeat2,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Camera,
  Upload,
  Trash2,
  AlertCircle,
  Sparkles,
  Compass
} from 'lucide-react';
import GrainOverlay from '@/components/GrainOverlay';
import { formatPhoneNumber, registerWithSupabase } from '@/lib/supabase/registration';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const ROLES = [
  { id: 'student', title: 'Student', desc: 'High school, college, or recent grad', icon: GraduationCap },
  { id: 'parent', title: 'Parent / Guardian', desc: 'Supporting student route & milestones', icon: HeartHandshake },
  { id: 'switch', title: 'Career Switcher', desc: 'Professional plotting a sector pivot', icon: Repeat2 },
];

const getPasswordRules = (pass) => {
  return {
    minLength: pass.length >= 8,
    hasUpper: /[A-Z]/.test(pass),
    hasNumber: /[0-9]/.test(pass),
    hasSymbol: /[^A-Za-z0-9]/.test(pass),
  };
};

const validatePhone = (phoneStr) => {
  const cleaned = phoneStr.replace(/\D/g, '');
  return cleaned.length >= 7 && cleaned.length <= 15;
};

function RegisterFormContent() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const [role, setRole] = useState('student');
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam && ['student', 'parent', 'switch'].includes(roleParam)) {
      setRole(roleParam);
    }
    if (searchParams.get('error') === 'email_verification_failed') {
      setPassError('That email verification link is invalid or expired. Request a new link or start registration again.');
    } else if (searchParams.get('error') === 'verification_session_missing') {
      setPassError('Your verification session expired. Sign in or start registration again.');
    }
  }, [searchParams]);

  // Account Info State
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

  // Profile Picture Upload State
  const [profilePic, setProfilePic] = useState(null);
  const [isDraggingPic, setIsDraggingPic] = useState(false);

  // Transition & Animation State
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitMessage, setTransitMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const passRules = getPasswordRules(password);
  const isPassValid = passRules.minLength && passRules.hasUpper && passRules.hasNumber && passRules.hasSymbol;

  const handleImageUpload = (file) => {
    if (file && file.type.startsWith('image/') && file.size <= 150_000) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePic(e.target.result);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      setPassError('Choose an image smaller than 150 KB.');
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

  const validateForm = () => {
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
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
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

  const handleContinue = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsTransitioning(true);
    setTransitMessage('Creating your account and sending an email verification link...');
    try {
      const { data } = await registerWithSupabase({
        email,
        password,
        profile: {
          fullName: fullName.trim(),
          firstName: firstName.trim(),
          middleName: middleName.trim(),
          lastName: lastName.trim(),
          phone: formatPhoneNumber(countryCode, phone),
          role,
          createdAt: new Date().toISOString(),
          avatarUrl: profilePic || null,
        },
      });
      if (data.session) {
        window.location.assign('/register/verify-phone');
      } else {
        setIsTransitioning(false);
        setEmailSent(true);
      }
    } catch (error) {
      setIsTransitioning(false);
      setPassError(error.message || 'Unable to create your account. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-no-repeat bg-[url('/hero-bg.png')] text-parchment flex flex-col justify-between overflow-x-hidden">
      {/* Background tint overlay */}
      <div className="absolute inset-0 bg-ink-deep/75 backdrop-blur-[2px] pointer-events-none z-0" />
      <GrainOverlay />

      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-brass/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-10 h-[400px] w-[400px] rounded-full bg-brass-bright/10 blur-[110px]" />

      {/* Top Header */}
      <header className="relative z-50 mx-auto w-full max-w-[1180px] px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-display text-[1.22rem] font-semibold text-parchment group cursor-pointer">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-brass-bright group-hover:bg-brass/20 transition-all shadow-[0_0_15px_rgba(217,165,72,0.2)]">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M8 2 L9.6 7.6 L8 14 L6.4 7.6 Z" fill="#d9a548" />
            </svg>
          </span>
          <span>PathFinders</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-fog/60 uppercase tracking-widest hidden sm:inline">
            {role === 'switch' ? 'Career Switch Registration' : role === 'parent' ? 'Parent Registration' : 'Student Registration'}
          </span>
          <LanguageSwitcher compact={true} />
          <Link href="/login" className="text-xs font-semibold text-brass-bright hover:underline">
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 mx-auto w-full max-w-[680px] px-4 sm:px-6 py-6 my-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="rounded-3xl border border-parchment/15 bg-ink-deep/90 p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl relative overflow-hidden"
        >
          {/* Header Banner */}
          <div className="mb-6 flex items-center justify-between border-b border-parchment/10 pb-4">
            <span className="font-mono text-xs tracking-wider uppercase text-brass-bright font-semibold flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Account Registration
            </span>
            <span className="font-mono text-xs text-fog/60">
              Profile Setup
            </span>
          </div>

          {/* Form */}
          {emailSent ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-brass-bright bg-brass/10 text-brass-bright">
                <Mail className="h-8 w-8" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-parchment">Verify your email</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-fog/80">
                We sent a verification link to <strong className="text-brass-bright">{email.trim()}</strong>.
                Open it to continue to mobile OTP verification and finish creating your account.
              </p>
              <button
                type="button"
                onClick={async () => {
                  setPassError('');
                  setTransitMessage('');
                  try {
                    await resendSignupConfirmation(email);
                    setTransitMessage('A new verification email has been sent.');
                  } catch (error) {
                    setPassError(error.message);
                  }
                }}
                className="mt-6 rounded-full border border-brass/50 px-5 py-2.5 text-sm font-semibold text-brass-bright hover:bg-brass/10"
              >
                Resend verification email
              </button>
              {passError && <p role="alert" className="mt-4 text-sm text-red-300">{passError}</p>}
              {transitMessage.includes('new verification') && <p role="status" className="mt-3 text-sm text-emerald-300">{transitMessage}</p>}
            </div>
          ) : (
          <form onSubmit={handleContinue} className="space-y-6">
            <div className="space-y-5">
              <div className="text-center sm:text-left mb-4">
                <h2 className="font-display text-xl sm:text-2xl font-semibold text-parchment">
                  Account Info &amp; Role Selection
                </h2>
                <p className="text-xs text-fog/60">
                  Set up your secure credentials to begin your PathFinders journey.
                </p>
              </div>

              {/* Role Selector */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-fog/75 mb-2 font-semibold">
                  I am registering as a *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {ROLES.map((r) => {
                    const Icon = r.icon;
                    const isSel = role === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRole(r.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSel
                            ? 'border-brass-bright bg-brass/15 shadow-[0_0_15px_rgba(217,165,72,0.25)] ring-1 ring-brass-bright/40'
                            : 'border-parchment/15 bg-ink/40 hover:border-parchment/30'
                        }`}
                      >
                        <Icon className={`h-5 w-5 mb-2 ${isSel ? 'text-brass-bright' : 'text-fog/60'}`} />
                        <div>
                          <div className={`font-semibold text-xs ${isSel ? 'text-parchment' : 'text-fog'}`}>{r.title}</div>
                          <div className="text-[0.68rem] text-fog/50 leading-tight mt-0.5">{r.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Validation Error Banner */}
              {passError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 text-xs font-mono flex items-start gap-2"
                >
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{passError}</span>
                </motion.div>
              )}

              {/* Profile Photo Upload */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-fog/75 mb-2 font-semibold">
                  Profile Picture (Optional)
                </label>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingPic(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDraggingPic(false); }}
                  className={`relative flex flex-col sm:flex-row items-center gap-4 rounded-2xl border-2 border-dashed p-4 transition-all ${
                    isDraggingPic ? 'border-brass-bright bg-brass/20 shadow-[0_0_20px_rgba(217,165,72,0.35)]' : 'border-parchment/20 bg-ink/40 hover:border-brass/40'
                  }`}
                >
                  <div className="relative group shrink-0">
                    <label
                      htmlFor="page-avatar-input"
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
                      id="page-avatar-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                      <label
                        htmlFor="page-avatar-input"
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-brass/20 border border-brass/40 px-3.5 py-1 text-xs font-semibold text-brass-bright hover:bg-brass hover:text-ink-deep transition-all"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        {profilePic ? 'Change Photo' : 'Upload Photo'}
                      </label>
                      {profilePic && (
                        <button
                          type="button"
                          onClick={() => setProfilePic(null)}
                          className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" /> Remove
                        </button>
                      )}
                    </div>
                    <p className="text-[0.72rem] text-fog/60 leading-normal">
                      Drag &amp; drop an avatar photo here, or click to browse.
                    </p>
                  </div>
                </div>
              </div>

              {/* Full Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-fog/75 mb-1.5 font-semibold">
                    First Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-fog/50" />
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        if (passError) setPassError('');
                      }}
                      placeholder="First Name"
                      className="w-full rounded-xl border border-parchment/20 bg-ink/60 pl-10 pr-3 py-3 text-sm text-parchment placeholder-fog/30 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-fog/75 mb-1.5 font-semibold">
                    Middle Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-fog/50" />
                    <input
                      type="text"
                      value={middleName}
                      onChange={(e) => {
                        setMiddleName(e.target.value);
                        if (passError) setPassError('');
                      }}
                      placeholder="Middle Name"
                      className="w-full rounded-xl border border-parchment/20 bg-ink/60 pl-10 pr-3 py-3 text-sm text-parchment placeholder-fog/30 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-fog/75 mb-1.5 font-semibold">
                    Last Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-fog/50" />
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        if (passError) setPassError('');
                      }}
                      placeholder="Last Name"
                      className="w-full rounded-xl border border-parchment/20 bg-ink/60 pl-10 pr-3 py-3 text-sm text-parchment placeholder-fog/30 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-fog/75 mb-1.5 font-semibold">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-fog/50" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (passError) setPassError('');
                      }}
                      placeholder="name@example.com"
                      className="w-full rounded-xl border border-parchment/20 bg-ink/60 pl-10 pr-4 py-3 text-sm text-parchment placeholder-fog/30 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-fog/75 mb-1.5 font-semibold">
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
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (passError) setPassError('');
                        }}
                        placeholder="Phone Number"
                        className="w-full rounded-xl border border-parchment/20 bg-ink/60 pl-10 pr-4 py-3 text-sm text-parchment placeholder-fog/30 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass transition-colors font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-fog/75 mb-1.5 font-semibold">
                    Create Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-fog/50" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passError) setPassError('');
                      }}
                      placeholder="Create Password"
                      className="w-full rounded-xl border border-parchment/20 bg-ink/60 pl-10 pr-10 py-3 text-sm text-parchment placeholder-fog/30 focus:border-brass focus:outline-none"
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

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-fog/75 mb-1.5 font-semibold">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-fog/50" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (passError) setPassError('');
                      }}
                      placeholder="Confirm Password"
                      className={`w-full rounded-xl border bg-ink/60 pl-10 pr-10 py-3 text-sm text-parchment placeholder-fog/30 focus:outline-none ${
                        confirmPassword && confirmPassword !== password
                          ? 'border-red-500 text-red-300'
                          : confirmPassword && confirmPassword === password
                          ? 'border-emerald-500 text-emerald-300'
                          : 'border-parchment/20 focus:border-brass'
                      }`}
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

              {/* Continue Route Button with Animated Action */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-parchment/10">
                <div className="text-xs text-fog/60">
                  Your credentials are encrypted &amp; stored securely
                </div>

                <button
                  type="submit"
                  disabled={isTransitioning}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brass via-brass-bright to-brass px-8 py-3.5 text-sm font-semibold text-ink-deep shadow-[0_4px_20px_rgba(217,165,72,0.4)] hover:shadow-[0_6px_28px_rgba(217,165,72,0.6)] transition-all hover:scale-105 active:scale-95 cursor-pointer font-mono"
                >
                  {isTransitioning ? (
                    <>
                      <Compass className="h-4 w-4 animate-spin text-ink-deep" />
                      <span>Calibrating Trail...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue Route</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
          )}

          {/* Animated Route Transition Overlay on Clicking Continue */}
          <AnimatePresence>
            {isTransitioning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-ink-deep/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0.82, opacity: 0, y: 15 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="space-y-4 max-w-sm"
                >
                  <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-brass-bright bg-brass/20 text-brass-bright shadow-[0_0_30px_rgba(217,165,72,0.5)]">
                    <Compass className="h-10 w-10 text-brass-bright animate-spin [animation-duration:3s]" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="inline-block px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-bold">
                      ✓ Secure Registration
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl font-semibold text-parchment">
                      Sending Verification
                    </h3>
                    <p className="text-xs text-fog/80 font-mono">
                      {transitMessage}
                    </p>
                  </div>

                  {/* Animated Gold Trail Progress Bar */}
                  <div className="h-1.5 w-full bg-ink rounded-full overflow-hidden border border-brass/40 shadow-inner">
                    <motion.div
                      className="h-full bg-gradient-to-r from-brass via-brass-bright to-brass"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.95, ease: 'easeInOut' }}
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

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-parchment font-mono">Loading Registration...</div>}>
      <RegisterFormContent />
    </Suspense>
  );
}
