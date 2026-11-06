'use client';

import { ArrowRight, GraduationCap, HeartHandshake, Repeat2 } from 'lucide-react';
import { useRegister } from '@/components/RegisterContext';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const THEME_STYLES = {
  dark: {
    card: 'bg-ink text-parchment',
    eyebrow: 'text-brass-bright',
    icon: 'text-brass-bright',
    divider: 'border-parchment/[0.14]',
    arrow: 'text-brass',
    button: 'border-parchment/35 text-parchment hover:border-parchment',
    tag: 'border-brass-bright text-brass-bright',
  },
  parent: {
    card: 'bg-parchment-dim border border-brass/35 text-charcoal',
    eyebrow: 'text-brass',
    icon: 'text-brass',
    divider: 'border-charcoal/[0.1]',
    arrow: 'text-trail',
    button: 'border-ink/25 text-ink hover:border-ink',
    tag: 'border-brass text-brass',
  },
  light: {
    card: 'bg-white border border-charcoal/[0.12] text-charcoal',
    eyebrow: 'text-trail',
    icon: 'text-trail',
    divider: 'border-neutral-200',
    arrow: 'text-trail',
    button: 'border-ink/25 text-ink hover:border-ink',
    tag: 'border-trail text-trail',
  },
};

export default function Portals() {
  const { openRegister } = useRegister();
  const { t } = useLanguage();

  const portals = [
    {
      id: 'student',
      icon: GraduationCap,
      routeTag: t('portals.studentTag', {}, 'GUIDED ROUTE'),
      eyebrow: t('portals.studentEyebrow', {}, 'For students'),
      title: t('portals.studentTitle', {}, 'Student portal'),
      body: t(
        'portals.studentBody',
        {},
        'Turn academic performance and curiosity into a shortlist of degrees and careers worth pursuing.'
      ),
      items: [
        t('portals.studentItem1', {}, 'Stream & course matching after 10th/12th'),
        t('portals.studentItem2', {}, 'Entrance exam and college guidance'),
        t('portals.studentItem3', {}, 'Early skill-building recommendations'),
      ],
      cta: t('portals.studentCta', {}, 'Open student portal'),
      theme: 'dark',
    },
    {
      id: 'parent',
      icon: HeartHandshake,
      routeTag: t('portals.parentTag', {}, 'SUPPORT ROUTE'),
      eyebrow: t('portals.parentEyebrow', {}, 'For parents'),
      title: t('portals.parentTitle', {}, 'Parent portal'),
      body: t(
        'portals.parentBody',
        {},
        "See your child's assessment summary, so conversations at home start from the same page."
      ),
      items: [
        t('portals.parentItem1', {}, 'Shared progress & assessment summaries'),
        t('portals.parentItem2', {}, 'Plain-language recommendation notes'),
        t('portals.parentItem3', {}, 'Optional AI conversation summaries'),
      ],
      cta: t('portals.parentCta', {}, 'Open parent portal'),
      theme: 'parent',
    },
    {
      id: 'switch',
      icon: Repeat2,
      routeTag: t('portals.switchTag', {}, 'SWITCHBACK ROUTE'),
      eyebrow: t('portals.switchEyebrow', {}, 'For professionals'),
      title: t('portals.switchTitle', {}, 'Career switch'),
      body: t(
        'portals.switchBody',
        {},
        'See how your experience transfers, and what the realistic next step actually looks like.'
      ),
      items: [
        t('portals.switchItem1', {}, 'Transferable-skills mapping'),
        t('portals.switchItem2', {}, 'Upskilling and certification routes'),
        t('portals.switchItem3', {}, 'Career-change risk & timeline planning'),
      ],
      cta: t('portals.switchCta', {}, 'Open career switch'),
      theme: 'light',
    },
  ];

  return (
    <section id="routes" className="relative z-[2] bg-parchment py-[110px]">
      <div className="mx-auto max-w-[1180px] px-6 md:px-8">
        <div className="mx-auto mb-16 max-w-[620px] text-center">
          <div className="mb-3.5 flex justify-center font-mono text-[0.7rem] uppercase tracking-[0.14em] text-trail">
            {t('portals.eyebrow', {}, 'Three routes up')}
          </div>
          <h2 className="font-display text-[clamp(1.8rem,2.8vw,2.5rem)] font-semibold leading-[1.15]">
            {t('portals.title', {}, 'Wherever you’re setting out from.')}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {portals.map((p) => {
            const styles = THEME_STYLES[p.theme];
            const Icon = p.icon;
            return (
              <div key={p.id} className={`relative overflow-hidden rounded-md px-7 py-8 ${styles.card}`}>
                <span
                  className={`absolute right-[18px] top-[18px] rounded-full border px-2.5 py-[5px] font-mono text-[0.62rem] tracking-[0.06em] opacity-75 ${styles.tag}`}
                >
                  {p.routeTag}
                </span>
                <Icon className={`mb-4 h-7 w-7 ${styles.icon}`} strokeWidth={1.6} />
                <div className={`mb-2.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] ${styles.eyebrow}`}>
                  {p.eyebrow}
                </div>
                <h3 className="mb-3 font-display text-[1.28rem] font-semibold">{p.title}</h3>
                <p className="mb-[22px] text-[0.9rem] opacity-85">{p.body}</p>
                <ul className="mb-6">
                  {p.items.map((item, i) => (
                    <li
                      key={item}
                      className={`flex items-center gap-[9px] py-2 text-[0.85rem] ${i !== 0 ? `border-t ${styles.divider}` : ''}`}
                    >
                      <ArrowRight className={`h-4 w-4 shrink-0 ${styles.arrow}`} />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => openRegister(p.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 cursor-pointer ${styles.button}`}
                >
                  {p.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
