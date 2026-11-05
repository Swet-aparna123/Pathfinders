'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function FieldNotes() {
  const { t } = useLanguage();

  const notes = [
    {
      value: t('stats.stat1Value', {}, '73%'),
      label: t('stats.stat1Label', {}, 'of students choose a course with little career guidance'),
      rotate: '-1.2deg',
    },
    {
      value: t('stats.stat2Value', {}, '4 in 10'),
      label: t('stats.stat2Label', {}, 'professionals consider switching fields within 5 years'),
      rotate: '0.8deg',
    },
    {
      value: t('stats.stat3Value', {}, '1'),
      label: t('stats.stat3Label', {}, 'conversation is often all it takes to see a path clearly'),
      rotate: '-0.6deg',
    },
  ];

  return (
    <div className="relative z-10 border-b border-charcoal/[0.08] bg-parchment-dim py-6">
      <div className="mx-auto flex max-w-[1180px] flex-wrap justify-center gap-6 px-6 md:px-8">
        {notes.map((n, i) => (
          <div
            key={i}
            style={{ transform: `rotate(${n.rotate})` }}
            className="flex items-baseline gap-2 rounded-sm border border-charcoal/[0.12] bg-parchment px-[18px] py-[10px] text-sm text-[#4a453c] shadow-[0_2px_6px_rgba(36,31,26,0.08)]"
          >
            <b className="font-display text-xl text-charcoal">{n.value}</b>
            {n.label}
          </div>
        ))}
      </div>
    </div>
  );
}
