'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Globe, ArrowRight, Check, Sparkles } from 'lucide-react';
import GrainOverlay from '@/components/GrainOverlay';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { userProfileService } from '@/lib/userProfileService';

export default function LanguageSelectionPage() {
  const router = useRouter();
  const { language, setLanguage, languages, t } = useLanguage();
  const [suggestedCode, setSuggestedCode] = useState(null);

  // Detect browser language for the non-intrusive "Suggested" hint
  useEffect(() => {
    if (typeof window !== 'undefined' && window.navigator) {
      const browserLang = (window.navigator.language || 'en').toLowerCase();
      const match = languages.find(
        (l) => browserLang.startsWith(l.code) || browserLang.includes(l.code)
      );
      if (match) {
        setSuggestedCode(match.code);
      }
    }
  }, [languages]);

  const handleSelectLanguage = (code) => {
    setLanguage(code);
    userProfileService.setLanguageForRole('student', code);
  };

  const handleContinue = () => {
    router.push('/register');
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-no-repeat bg-[url('/hero-bg.png')] text-parchment flex flex-col justify-between overflow-x-hidden">
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-ink-deep/80 backdrop-blur-[2px] pointer-events-none z-0" />
      <GrainOverlay />

      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-brass/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-10 h-[400px] w-[400px] rounded-full bg-brass-bright/10 blur-[110px]" />

      {/* Top Header */}
      <header className="relative z-10 mx-auto w-full max-w-[1180px] px-6 py-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-display text-[1.22rem] font-semibold text-parchment group cursor-pointer">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-brass-bright group-hover:bg-brass/20 transition-all shadow-[0_0_15px_rgba(217,165,72,0.2)]">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M8 2 L9.6 7.6 L8 14 L6.4 7.6 Z" fill="#d9a548" />
            </svg>
          </span>
          <span className="tracking-tight">{t('nav.brand', {}, 'PathFinders')}</span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-parchment/20 bg-ink/60 px-4 py-2 text-xs font-semibold text-parchment hover:border-brass hover:text-brass-bright transition-all cursor-pointer shadow-md active:scale-95"
        >
          <span>{t('auth.returnHome', {}, 'Return to Home')}</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="relative z-10 mx-auto w-full max-w-[800px] px-4 sm:px-6 py-6 my-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="rounded-3xl border border-parchment/15 bg-ink-deep/90 p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl relative overflow-hidden"
        >
          {/* Step 1 of 3 Strip */}
          <div className="mb-8 border-b border-parchment/10 pb-6">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="font-mono text-[0.72rem] tracking-widest uppercase text-brass-bright font-bold flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                {t('switcher.step', {}, 'Step 1: Language Selection')} • {t('common.appName', {}, 'PathFinders')}
              </span>
              <span className="font-mono text-xs text-fog/60">33%</span>
            </div>
            {/* Visual Step Indicator */}
            <div className="grid grid-cols-3 gap-2">
              <div className="h-1.5 rounded-full bg-brass-bright shadow-[0_0_8px_rgba(217,165,72,0.4)]" />
              <div className="h-1.5 rounded-full bg-parchment/20" />
              <div className="h-1.5 rounded-full bg-parchment/20" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-brass/50 bg-brass/10 mb-3 text-brass-bright shadow-[0_0_20px_rgba(185,134,46,0.25)]">
              <Globe className="h-7 w-7" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-parchment mb-2">
              {t('switcher.title', {}, 'Choose your language')}
            </h1>
            <p className="text-sm text-fog/75 max-w-lg mx-auto">
              {t('switcher.subtitle', {}, 'Select your preferred language for career counselling, assessments, and guidance.')}
            </p>
          </div>

          {/* Language Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-8">
            {languages.map((lang) => {
              const isSelected = lang.code === language;
              const isSuggested = lang.code === suggestedCode;

              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`relative p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-brass/20 border-brass-bright text-parchment shadow-[0_4px_20px_rgba(217,165,72,0.35)] scale-[1.02]'
                      : 'bg-ink/60 border-parchment/15 text-fog hover:border-brass/40 hover:bg-ink/80 hover:text-parchment'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xl font-bold tracking-wide text-parchment mb-0.5">
                        {lang.nativeName}
                      </div>
                      <div className="text-xs text-fog/70 font-medium">
                        {lang.englishName}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isSuggested && (
                        <span className="font-mono text-[0.62rem] px-2 py-0.5 rounded-full bg-brass-bright/20 border border-brass-bright/50 text-brass-bright uppercase tracking-wider font-bold">
                          {t('common.suggested', {}, 'Suggested')}
                        </span>
                      )}
                      {isSelected && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brass-bright text-ink-deep shrink-0">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-parchment/10 text-[0.68rem] font-mono text-fog/50">
                    <span>{lang.script} script</span>
                    <span className="uppercase">{lang.dir}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Continue Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-parchment/10">
            <div className="text-xs text-fog/60">
              {t('switcher.changeAnytime', {}, 'You can change your language anytime from the menu.')}
            </div>

            <button
              type="button"
              onClick={handleContinue}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brass via-brass-bright to-brass px-8 py-3.5 text-sm font-semibold text-ink-deep shadow-[0_4px_18px_rgba(217,165,72,0.35)] hover:shadow-[0_6px_25px_rgba(217,165,72,0.55)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>{t('auth.continueBtn', {}, 'Continue to Account Creation')}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 font-mono text-xs text-fog/40">
        PathFinders • © 2026 • AI Career Guidance
      </footer>
    </div>
  );
}

