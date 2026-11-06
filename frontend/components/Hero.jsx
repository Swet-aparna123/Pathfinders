'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import CompassRose from './CompassRose';
import Starfield from './Starfield';
import { useRegister } from './RegisterContext';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Hero() {
  const { openRegister } = useRegister();
  const { t } = useLanguage();

  return (
    <header className="relative overflow-hidden bg-cover bg-center bg-no-repeat bg-[url('/hero-bg.png')] pb-[80px] pt-[140px] text-parchment md:pb-[90px] md:pt-[150px]">
      {/* Dark overlay for rich contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-deep/70 via-ink-deep/40 to-ink-deep/85 pointer-events-none z-0" />
      <Starfield />

      <div className="absolute right-[6%] top-[110px] hidden h-[82px] w-[82px] -rotate-12 items-center justify-center rounded-full border border-dashed border-brass-bright/50 text-center font-mono text-[0.58rem] leading-tight tracking-[0.08em] text-brass-bright opacity-80 md:flex">
        {t('hero.badgeEst', {}, 'EST.\n2026\n№ 001')}
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-9 px-6 md:grid-cols-[1.05fr_0.95fr] md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center md:text-left"
        >
          <div className="mb-5 inline-flex items-center gap-2.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-brass-bright">
            <span className="inline-block h-px w-6 bg-brass-bright" />
            {t('hero.badge', {}, 'AI-powered career guidance')}
          </div>

          <h1 className="mb-6 font-display text-[clamp(2.5rem,4.4vw,3.9rem)] font-semibold leading-[1.05]">
            {t('hero.titlePart1', {}, 'Where')}{' '}
            <em className="italic text-brass-bright">{t('hero.titleHighlight', {}, 'dreams')}</em>
            <br />
            {t('hero.titlePart2', {}, 'meet direction.')}
          </h1>

          <p className="mx-auto mb-8 max-w-[470px] text-lg text-fog md:mx-0">
            {t(
              'hero.description',
              {},
              'PathFinders reads your academics, interests, and personality, then talks it through with you — so the career path you choose is actually yours.'
            )}
          </p>

          <div className="flex flex-wrap justify-center gap-4 md:justify-start">
            <button
              type="button"
              onClick={() => openRegister('student')}
              className="inline-flex items-center gap-2 rounded-full bg-brass px-7 py-3.5 text-sm font-semibold text-ink-deep transition-all hover:-translate-y-0.5 hover:-rotate-1 hover:bg-brass-bright hover:shadow-[0_10px_24px_rgba(185,134,46,0.35)] cursor-pointer"
            >
              {t('hero.ctaPrimary', {}, 'Begin the ascent')}
            </button>
            <Link
              href="#trail"
              className="inline-flex items-center gap-2 rounded-full border border-parchment/35 px-7 py-3.5 text-sm font-semibold text-parchment transition-all hover:-translate-y-0.5 hover:border-parchment"
            >
              {t('hero.ctaSecondary', {}, 'See the map')}
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
        >
          <CompassRose />
        </motion.div>
      </div>
    </header>
  );
}
