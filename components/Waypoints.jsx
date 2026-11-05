'use client';

import { useEffect, useRef } from 'react';
import SpineTrack from './SpineTrack';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Waypoints() {
  const containerRef = useRef(null);
  const { t } = useLanguage();

  const waypoints = [
    {
      id: '01',
      elev: t('waypoints.wp1Elev', {}, 'WAYPOINT 01 — START'),
      title: t('waypoints.wp1Title', {}, 'Tell us about you'),
      body: t(
        'waypoints.wp1Body',
        {},
        "Academic record, personal background, and where you're starting from — the map's first pin."
      ),
      side: 'left',
    },
    {
      id: '02',
      elev: t('waypoints.wp2Elev', {}, 'WAYPOINT 02 — ASCENT'),
      title: t('waypoints.wp2Title', {}, 'Explore your fit'),
      body: t(
        'waypoints.wp2Body',
        {},
        "Interest and personality assessments surface what actually pulls at your attention, not just what you're good at."
      ),
      side: 'right',
    },
    {
      id: '03',
      elev: t('waypoints.wp3Elev', {}, 'WAYPOINT 03 — RIDGE'),
      title: t('waypoints.wp3Title', {}, 'Talk it through'),
      body: t(
        'waypoints.wp3Body',
        {},
        'An AI conversation digs into your goals and doubts the way a good mentor would — patiently, and in your words.'
      ),
      side: 'left',
    },
    {
      id: '04',
      elev: t('waypoints.wp4Elev', {}, 'WAYPOINT 04 — SUMMIT'),
      title: t('waypoints.wp4Title', {}, 'Get your direction'),
      body: t(
        'waypoints.wp4Body',
        {},
        'A shortlist of career paths, matched and ranked, with the reasoning behind every one made visible to you.'
      ),
      side: 'right',
    },
  ];

  useEffect(() => {
    const rows = containerRef.current?.querySelectorAll('[data-row]');
    if (!rows) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const dot = entry.target.querySelector('[data-dot]');
            const card = entry.target.querySelector('[data-card]');
            dot?.setAttribute('data-reached', 'true');
            card?.setAttribute('data-in', 'true');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    rows.forEach((row) => obs.observe(row));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="trail" className="relative z-[2] py-[110px] overflow-hidden">
      <SpineTrack />
      <div className="mx-auto max-w-[1180px] px-6 md:px-8">
        <div className="mx-auto mb-16 max-w-[620px] text-center">
          <div className="mb-3.5 flex justify-center font-mono text-[0.7rem] uppercase tracking-[0.14em] text-trail">
            {t('waypoints.eyebrow', {}, 'The route')}
          </div>
          <h2 className="font-display text-[clamp(1.8rem,2.8vw,2.5rem)] font-semibold leading-[1.15]">
            {t('waypoints.title', {}, 'Four waypoints from confusion to clarity.')}
          </h2>
          <p className="mt-4 text-[1.02rem] text-[#5a5f52]">
            {t(
              'waypoints.subtitle',
              {},
              'No generic quiz. PathFinders builds a picture of you camp by camp, checking its understanding with you at every stop.'
            )}
          </p>
        </div>

        <div ref={containerRef} className="flex flex-col gap-14">
          {waypoints.map((w) => (
            <div
              key={w.id}
              data-row
              className="relative z-[2] grid grid-cols-[44px_1fr] items-center gap-6 md:grid-cols-[1fr_60px_1fr] md:gap-0"
            >
              <div
                data-dot
                data-reached="false"
                className={`relative z-[3] col-start-1 mx-auto flex h-[42px] w-[42px] items-center justify-center rounded-full border-2 border-brass bg-parchment font-mono text-[0.8rem] text-brass transition-colors duration-500 data-[reached=true]:bg-brass data-[reached=true]:text-parchment md:col-start-2`}
              >
                {w.id}
              </div>

              <div
                data-card
                data-in="false"
                className={`col-start-2 translate-y-5 rounded border border-charcoal/10 bg-parchment px-7 py-6 opacity-0 shadow-[3px_4px_0_rgba(36,31,26,0.06)] transition-all duration-700 ease-out data-[in=true]:translate-y-0 data-[in=true]:opacity-100 ${
                  w.side === 'left' ? 'md:col-start-1' : 'md:col-start-3'
                }`}
              >
                <span className="mb-2 block font-mono text-[0.68rem] tracking-[0.08em] text-brass">
                  {w.elev}
                </span>
                <h3 className="mb-2 text-[1.14rem] font-semibold">{w.title}</h3>
                <p className="text-sm text-[#5a5f52]">{w.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
