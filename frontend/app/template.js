'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Template({ children }) {
  const [animDone, setAnimDone] = useState(false);
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setIsReduced(mediaQuery.matches);
    }
  }, []);

  return (
    <>
      {/* Top Expedition Route Progress Beam - runs on every new page opening */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#B8860B] via-[#D4A034] to-[#F3E5AB] z-[9999] pointer-events-none origin-left shadow-[0_0_12px_rgba(212,160,52,0.85)]"
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: [0, 0.65, 1], opacity: [1, 1, 0] }}
        transition={{
          duration: 0.55,
          times: [0, 0.7, 1],
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      {/* Page Content Opening Animation */}
      <motion.div
        initial={isReduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
        animate={isReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{
          duration: 0.38,
          ease: [0.16, 1, 0.3, 1],
        }}
        onAnimationComplete={() => setAnimDone(true)}
        style={animDone ? { transform: 'none' } : undefined}
        className="w-full min-h-screen"
      >
        {children}
      </motion.div>
    </>
  );
}

