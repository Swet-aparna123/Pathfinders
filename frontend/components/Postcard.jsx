'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Postcard() {
  const { t } = useLanguage();

  return (
    <div className="relative z-[2] flex justify-center bg-ink-deep py-[100px]">
      <div className="postcard-inset relative w-full max-w-[640px] -rotate-1 rounded-sm border border-charcoal/[0.15] bg-parchment px-11 py-10 text-charcoal shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
        <div className="absolute -top-4 right-6 flex h-[70px] w-[56px] rotate-6 items-center justify-center border-[3px] border-parchment bg-rust">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6 text-parchment">
            <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" />
          </svg>
        </div>
        <blockquote className="mb-[18px] font-display text-[1.28rem] font-medium italic leading-[1.5]">
          &ldquo;{t(
            'postcard.quote',
            {},
            "I didn't need another quiz that called me an 'ENFP creative type.' I needed something to ask why I actually kept opening those biology tabs at 1am."
          )}&rdquo;
        </blockquote>
        <cite className="font-mono text-[0.75rem] not-italic text-trail">
          {t('postcard.author', {}, '— A PathFinders student, three months before choosing her major')}
        </cite>
      </div>
    </div>
  );
}
