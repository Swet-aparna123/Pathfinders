'use client';

import { useEffect, useRef } from 'react';

export default function SpineTrack() {
  const trackRef = useRef(null);
  const fillRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    const fill = fillRef.current;
    const marker = markerRef.current;
    if (!track || !fill || !marker) return;

    let ticking = false;

    function update() {
      const rect = track.getBoundingClientRect();
      const total = rect.height;
      const viewportRef = window.innerHeight * 0.5;
      let progress = (viewportRef - rect.top) / total;
      progress = Math.max(0, Math.min(1, progress));
      fill.style.height = `${progress * 100}%`;
      const markerPos = Math.min(progress * total, Math.max(0, total - 16));
      marker.style.top = `${markerPos}px`;
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <>
      <div
        ref={trackRef}
        className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-[repeating-linear-gradient(to_bottom,rgba(63,91,67,0.35)_0px,rgba(63,91,67,0.35)_6px,transparent_6px,transparent_14px)] md:block pointer-events-none"
      >
        <div ref={fillRef} className="absolute left-0 top-0 h-0 w-full bg-gradient-to-b from-brass-bright to-brass" />
      </div>
      <div
        ref={markerRef}
        className="absolute left-1/2 top-0 hidden h-[30px] w-[30px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-brass-bright bg-ink shadow-[0_0_0_5px_rgba(217,165,72,0.14)] md:flex pointer-events-none"
        style={{ zIndex: 3 }}
      >
        <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
          <path d="M8 1 L9.8 7.8 L8 15 L6.2 7.8 Z" fill="#d9a548" />
        </svg>
      </div>
    </>
  );
}
