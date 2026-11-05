'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import GrainOverlay from '@/components/GrainOverlay';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function LoginPage() {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 200);
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-no-repeat bg-[url('/hero-bg.png')] text-parchment flex flex-col justify-between overflow-hidden">
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-ink-deep/75 backdrop-blur-[2px] pointer-events-none z-0" />
      <GrainOverlay />

      {/* Ambient background glow orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[450px] w-[450px] rounded-full bg-brass/20 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-[380px] w-[380px] rounded-full bg-brass-bright/15 blur-[90px]" />

      {/* Top Bar */}
      <header className="relative z-50 mx-auto w-full max-w-[1180px] px-6 py-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-display text-[1.22rem] font-semibold text-parchment group cursor-pointer">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-brass-bright group-hover:bg-brass/20 transition-all shadow-[0_0_15px_rgba(217,165,72,0.2)]">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M8 2 L9.6 7.6 L8 14 L6.4 7.6 Z" fill="#d9a548" />
            </svg>
          </span>
          <span className="tracking-tight">{t('nav.brand', {}, 'PathFinders')}</span>
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher compact={true} />
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-parchment/20 bg-ink/60 px-4 py-2 text-xs font-semibold text-parchment hover:border-brass hover:text-brass-bright transition-all cursor-pointer shadow-md active:scale-95"
          >
            <span>{t('auth.returnHome', {}, 'Return to Home')}</span>
          </Link>
        </div>
      </header>

      {/* Main Content Form Card */}
      <main className="relative z-10 mx-auto w-full max-w-[440px] px-6 py-10 my-auto">
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="rounded-2xl border border-parchment/15 bg-ink-deep/85 p-8 sm:p-9 shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl relative overflow-hidden"
        >
          {/* Decorative Corner Accent */}
          <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-brass/20 to-transparent pointer-events-none rounded-bl-full" />

          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-brass/50 bg-brass/10 mb-3 text-brass-bright shadow-[0_0_20px_rgba(185,134,46,0.25)]">
              <Compass className="h-7 w-7 animate-pulse" />
            </div>
            <h1 className="font-display text-2xl font-semibold text-parchment mb-1.5">
              {t('auth.loginTitle', {}, 'Welcome Back')}
            </h1>
            <p className="text-sm text-fog/75">
              {t('auth.loginSubtitle', {}, 'Enter your credentials to resume your journey')}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="submitted-success"
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="py-6 text-center"
              >
                <div className="mx-auto h-16 w-16 items-center justify-center rounded-full bg-brass/20 border-2 border-brass-bright text-brass-bright flex mb-4 shadow-[0_0_25px_rgba(217,165,72,0.4)]">
                  <CheckCircle2 className="h-10 w-10" />
                </div>

                <h2 className="font-display text-xl font-semibold text-parchment mb-2 flex items-center justify-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-brass-bright" /> Pathfinder
                </h2>
                <p className="text-xs text-fog/75 mb-6 leading-relaxed">
                  Authentication verified. Redirecting you to your personal expedition dashboard...
                </p>

                <div className="space-y-3 font-mono text-xs">
                  <Link
                    href="/student-dashboard"
                    className="w-full flex items-center justify-between gap-2 rounded-xl bg-brass px-5 py-3 text-sm font-semibold text-ink-deep hover:bg-brass-bright hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_16px_rgba(185,134,46,0.3)] transition-all cursor-pointer"
                  >
                    <span>🎓 {t('auth.studentRole', {}, 'Student')} Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/parent-dashboard"
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-parchment/20 bg-ink/60 px-3 py-2.5 text-fog hover:text-parchment hover:border-brass/40 transition-all cursor-pointer"
                    >
                      <span>👨‍👩‍👧 {t('auth.parentRole', {}, 'Parent')}</span>
                    </Link>
                    <Link
                      href="/career-switcher-dashboard"
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-parchment/20 bg-ink/60 px-3 py-2.5 text-fog hover:text-parchment hover:border-brass/40 transition-all cursor-pointer"
                    >
                      <span>🔄 {t('auth.switcherRole', {}, 'Career Switcher')}</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-fog/75 mb-2">
                    {t('auth.emailLabel', {}, 'Email Address')}
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-fog/50 group-focus-within:text-brass-bright transition-colors" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="explorer@pathfinders.ai"
                      className="w-full rounded-lg border border-parchment/20 bg-ink/60 pl-10 pr-4 py-3 text-sm text-parchment placeholder-fog/30 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-fog/75 mb-2">
                    {t('auth.passwordLabel', {}, 'Password')}
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-fog/50 group-focus-within:text-brass-bright transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-lg border border-parchment/20 bg-ink/60 pl-10 pr-10 py-3 text-sm text-parchment placeholder-fog/30 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-fog/50 hover:text-parchment transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-fog/70 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-parchment/30 bg-ink text-brass focus:ring-brass/40 h-4 w-4 cursor-pointer"
                    />
                    <span className="group-hover:text-parchment transition-colors">
                      {t('auth.rememberMe', {}, 'Remember me')}
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-brass py-3.5 text-sm font-semibold text-ink-deep hover:bg-brass-bright hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-3 shadow-[0_4px_16px_rgba(185,134,46,0.25)] cursor-pointer"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-ink-deep" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      ...
                    </span>
                  ) : (
                    <>
                      <span>{t('auth.loginButton', {}, 'Sign In')}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-parchment/15" />
                  </div>
                  <span className="relative bg-ink-deep px-3 font-mono text-[0.7rem] text-fog/50 uppercase tracking-widest">
                    Or
                  </span>
                </div>

                <p className="text-center text-xs text-fog/70">
                  {t('auth.noAccount', {}, "Don't have a profile yet?")}{' '}
                  <Link href="/register" className="font-semibold text-brass-bright hover:underline cursor-pointer">
                    {t('auth.createOne', {}, 'Create an account')}
                  </Link>
                </p>
              </form>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Footer link back to home */}
      <footer className="relative z-10 text-center py-6 font-mono text-xs text-fog/40">
        PathFinders © 2026 • <Link href="/" className="hover:underline hover:text-parchment transition-colors cursor-pointer">Return to Home</Link>
      </footer>
    </div>
  );
}
