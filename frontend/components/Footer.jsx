'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="mb-4 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-brass-bright">{title}</h4>
      {links.map((l) => (
        <Link key={l.label} href={l.href} className="block py-[5px] text-[0.88rem] text-fog transition-colors hover:text-parchment">
          {l.label}
        </Link>
      ))}
    </div>
  );
}

export default function Footer() {
  const { t } = useLanguage();

  const productLinks = [
    { label: t('nav.trail', {}, 'The trail'), href: '#trail' },
    { label: t('nav.kit', {}, 'The kit'), href: '#kit' },
    { label: t('nav.routes', {}, 'Routes'), href: '#routes' },
    { label: t('footer.linkStudentReg', {}, 'Student Registration'), href: '/register' },
    { label: t('footer.linkParentPortal', {}, 'Parent Counseling Portal'), href: '/register?role=parent' },
    { label: t('footer.linkSignIn', {}, 'Account Sign In'), href: '/login' },
  ];

  const companyLinks = [
    { label: t('footer.linkAbout', {}, 'About'), href: '#' },
    { label: t('footer.linkCareers', {}, 'Careers'), href: '#' },
    { label: t('footer.linkContact', {}, 'Contact'), href: '#' },
  ];

  const legalLinks = [
    { label: t('footer.linkPrivacy', {}, 'Privacy'), href: '#' },
    { label: t('footer.linkTerms', {}, 'Terms'), href: '#' },
  ];

  return (
    <footer className="bg-ink-deep pb-9 pt-[70px] text-fog">
      <div className="mx-auto max-w-[1180px] px-6 md:px-8">
        <div className="grid grid-cols-2 gap-9 border-b border-parchment/10 pb-11 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-3.5 flex items-center gap-2.5 font-display text-[1.22rem] font-semibold text-parchment">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-[1.5px] border-brass-bright">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2 L9.6 7.6 L8 14 L6.4 7.6 Z" fill="#d9a548" />
                </svg>
              </span>
              {t('nav.brand', {}, 'PathFinders')}
            </div>
            <p className="max-w-[270px] text-[0.86rem] text-fog/55 mb-5">
              {t(
                'footer.description',
                {},
                'AI-powered career counselling that starts with who you are, not a template of who you should be.'
              )}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-brass-bright/80">
                {t('footer.languageLabel', {}, 'Language')}:
              </span>
              <LanguageSwitcher compact={false} direction="up" align="left" />
            </div>
          </div>
          <FooterCol title={t('footer.colProduct', {}, 'Product')} links={productLinks} />
          <FooterCol title={t('footer.colCompany', {}, 'Company')} links={companyLinks} />
          <FooterCol title={t('footer.colLegal', {}, 'Legal')} links={legalLinks} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-[10px] pt-[26px] text-[0.8rem] text-fog/50">
          <span>{t('footer.copyright', {}, '© 2026 PathFinders. Where dreams meet direction.')}</span>
          <span>{t('footer.tagline', {}, 'Made for students and professionals everywhere.')}</span>
        </div>
      </div>
    </footer>
  );
}
