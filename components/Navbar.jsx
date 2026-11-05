'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';

import { useRegister } from '@/components/RegisterContext';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openRegister, openLogin } = useRegister();
  const { t } = useLanguage();

  const links = [
    { label: t('nav.trail', {}, 'The trail'), href: '/#trail' },
    { label: t('nav.kit', {}, 'The kit'), href: '/#kit' },
    { label: t('nav.routes', {}, 'Routes'), href: '/#routes' },
  ];

  return (
    <nav className="fixed inset-x-0 top-0 z-[100] bg-ink-deep/95 py-[18px] backdrop-blur-md border-b border-parchment/10">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-6 md:px-8">
        <Link href="/" className="flex items-center gap-2.5 font-display text-[1.22rem] font-semibold text-parchment group cursor-pointer">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border-[1.5px] border-brass-bright group-hover:bg-brass/20 transition-all shadow-[0_0_12px_rgba(217,165,72,0.2)]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2 L9.6 7.6 L8 14 L6.4 7.6 Z" fill="#d9a548" />
            </svg>
          </span>
          <span>{t('nav.brand', {}, 'PathFinders')}</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-[30px] md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[0.88rem] font-medium text-fog transition-colors hover:text-parchment cursor-pointer"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3.5 md:flex">
          <LanguageSwitcher compact={true} />

          <button
            type="button"
            onClick={openLogin}
            className="px-3 py-2 text-sm font-semibold text-fog transition-all hover:text-brass-bright hover:scale-105 active:scale-95 cursor-pointer bg-transparent border-0"
          >
            {t('nav.login', {}, 'Log in')}
          </button>
          <button
            type="button"
            onClick={() => openRegister('student')}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brass via-brass-bright to-brass px-6 py-2.5 text-sm font-semibold text-ink-deep shadow-[0_4px_18px_rgba(217,165,72,0.35)] hover:shadow-[0_6px_25px_rgba(217,165,72,0.55)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            {t('nav.getStarted', {}, 'Get started')}
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-parchment/20 text-parchment hover:bg-parchment/10 md:hidden cursor-pointer active:scale-95 transition-all"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5 text-brass-bright" /> : <Menu className="h-5 w-5 text-parchment" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-parchment/15 bg-ink-deep/95 px-6 pb-6 pt-4 backdrop-blur-lg md:hidden overflow-visible"
          >
            <div className="flex flex-col gap-4">
              <div className="pb-2 border-b border-parchment/10 flex justify-between items-center">
                <span className="font-mono text-xs text-fog/70 uppercase tracking-wider">
                  {t('switcher.label', {}, 'Language')}
                </span>
                <LanguageSwitcher compact={false} />
              </div>

              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-fog transition-colors hover:text-parchment cursor-pointer"
                >
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openLogin();
                }}
                className="text-left text-base font-medium text-fog transition-colors hover:text-parchment cursor-pointer bg-transparent border-0"
              >
                {t('nav.login', {}, 'Log in')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openRegister('student');
                }}
                className="mt-2 inline-flex justify-center items-center gap-2 rounded-full bg-gradient-to-r from-brass via-brass-bright to-brass px-6 py-3 text-center text-sm font-semibold text-ink-deep shadow-[0_4px_18px_rgba(217,165,72,0.35)] transition-all hover:brightness-110 active:scale-95 cursor-pointer"
              >
                <span>{t('nav.getStarted', {}, 'Get started')}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
