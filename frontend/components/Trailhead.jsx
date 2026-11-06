'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

import { useRegister } from '@/components/RegisterContext';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Trailhead() {
  const { openRegister, openLogin } = useRegister();
  const { t } = useLanguage();

  return (
    <section id="trailhead" className="bg-parchment py-[100px] overflow-hidden">
      <div className="mx-auto max-w-[1000px] px-6 md:px-0">
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-wrap items-center justify-between gap-9 rounded-2xl bg-ink px-8 py-12 text-parchment md:px-[60px] md:py-14 shadow-2xl overflow-hidden"
        >
          {/* Animated Glowing Accent */}
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brass/20 blur-3xl"
          />

          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-4 top-4 h-3.5 w-3.5 rounded-full bg-brass-bright shadow-[0_0_10px_#d9a548]"
          />
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            className="absolute bottom-4 right-4 h-3.5 w-3.5 rounded-full bg-brass-bright shadow-[0_0_10px_#d9a548]"
          />

          <div className="relative z-10 max-w-[480px]">
            <div className="mb-3 inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-widest text-brass-bright font-semibold">
              <Sparkles className="h-3.5 w-3.5" /> {t('trailhead.badge', {}, 'Start Your Trail Today')}
            </div>
            <h2 className="font-display text-[clamp(1.6rem,2.6vw,2.15rem)] font-semibold leading-tight">
              {t('trailhead.title', {}, "Your direction is somewhere in the data. Let's go find it.")}
            </h2>
          </div>

          <div className="relative z-10 flex flex-wrap gap-3.5">
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
              <button
                type="button"
                onClick={() => openRegister('student')}
                className="inline-flex items-center gap-2 rounded-full bg-brass px-7 py-3.5 text-sm font-semibold text-ink-deep hover:bg-brass-bright hover:shadow-[0_10px_25px_rgba(185,134,46,0.4)] transition-all cursor-pointer"
              >
                <span>{t('trailhead.createProfile', {}, 'Create your free profile')}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
              <button
                type="button"
                onClick={openLogin}
                className="inline-flex items-center gap-2 rounded-full border border-parchment/35 px-7 py-3.5 text-sm font-semibold text-parchment hover:border-parchment hover:bg-parchment/10 transition-all cursor-pointer"
              >
                {t('trailhead.loginAccount', {}, 'Log in to account')}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

