'use client';

import { useEffect, useRef } from 'react';

export default function TornDivider() {
  const shapeRef = useRef(null);

  useEffect(() => {
    const el = shapeRef.current;
    if (!el) return;

    function build() {
      const w = el.parentElement?.offsetWidth || window.innerWidth;
      const teeth = Math.max(16, Math.round(w / 34));
      const step = w / teeth;
      const depth = 14;
      const pts = [];

      for (let i = 0; i <= teeth; i++) {
        const x = i * step;
        const y = i % 2 === 0 ? 0 : depth;
        pts.push(`${x}px ${y}px`);
      }
      pts.push(`${w}px 22px`, `0px 22px`);
      el.style.clipPath = `polygon(${pts.join(',')})`;
    }

    build();
    window.addEventListener('resize', build);
    return () => window.removeEventListener('resize', build);
  }, []);

  return (
    <div className="relative h-[22px] bg-parchment" aria-hidden="true">
      <div ref={shapeRef} className="absolute -top-[22px] left-0 h-[22px] w-full bg-ink-deep" />
    </div>
  );
}
