'use client';

import { Target, MessageSquare, Eye, ClipboardList, Users2, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Features() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Target,
      title: t('features.feat1Title', {}, 'Whole-profile matching'),
      body: t(
        'features.feat1Body',
        {},
        'Academics, interests, personality, and goals are weighed together, not scored in separate silos.'
      ),
    },
    {
      icon: MessageSquare,
      title: t('features.feat2Title', {}, 'Living AI conversations'),
      body: t(
        'features.feat2Body',
        {},
        'Ask questions, push back, change your mind — the guidance adapts in real time as you talk.'
      ),
    },
    {
      icon: Eye,
      title: t('features.feat3Title', {}, 'Transparent reasoning'),
      body: t(
        'features.feat3Body',
        {},
        'Every recommendation comes with the "why" behind it, so you can trust it or challenge it.'
      ),
    },
    {
      icon: ClipboardList,
      title: t('features.feat4Title', {}, 'A plan, not just a title'),
      body: t(
        'features.feat4Body',
        {},
        'Courses, certifications, and milestones laid out as a route you can actually follow.'
      ),
    },
    {
      icon: Users2,
      title: t('features.feat5Title', {}, 'For every life stage'),
      body: t(
        'features.feat5Body',
        {},
        'The same rigor for a student picking a stream and a professional plotting a pivot.'
      ),
    },
    {
      icon: Sparkles,
      title: t('features.feat6Title', {}, 'Revisited, not one-off'),
      body: t(
        'features.feat6Body',
        {},
        'Interests shift. Your plan updates with you instead of freezing you at day one.'
      ),
    },
  ];

  return (
    <section id="kit" className="relative z-[2] bg-parchment-dim py-[110px]">
      <div className="mx-auto max-w-[1180px] px-6 md:px-8">
        <div className="mx-auto mb-16 max-w-[620px] text-center">
          <div className="mb-3.5 flex justify-center font-mono text-[0.7rem] uppercase tracking-[0.14em] text-trail">
            {t('features.eyebrow', {}, "What's in the kit")}
          </div>
          <h2 className="font-display text-[clamp(1.8rem,2.8vw,2.5rem)] font-semibold leading-[1.15]">
            {t('features.title', {}, 'Built to understand the whole person, not just the transcript.')}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="feature-tab rounded border border-charcoal/10 bg-parchment px-[26px] py-[30px] transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_8px_0_rgba(36,31,26,0.08)]"
            >
              <Icon className="mb-[18px] h-8 w-8 text-trail" strokeWidth={1.6} />
              <h3 className="mb-2 text-[1.02rem] font-semibold">{title}</h3>
              <p className="text-[0.87rem] text-[#5a5f52]">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
