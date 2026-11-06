'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass, Sparkles, Navigation } from 'lucide-react';

const DOMAINS = [
  { id: 'tech', label: 'TECHNOLOGY', angle: 0, desc: 'AI, Software & Engineering' },
  { id: 'biz', label: 'BUSINESS', angle: 45, desc: 'Strategy, Finance & Entrepreneurship' },
  { id: 'health', label: 'HEALTH', angle: 90, desc: 'Medicine, Biotech & Care' },
  { id: 'arts', label: 'ARTS & DESIGN', angle: 135, desc: 'UI/UX, Media & Creative' },
  { id: 'science', label: 'SCIENCE', angle: 180, desc: 'Research, Physics & Climate' },
  { id: 'edu', label: 'EDUCATION', angle: 225, desc: 'Academia, Pedagogy & Mentorship' },
  { id: 'law', label: 'LAW & POLICY', angle: 270, desc: 'Governance, Rights & Ethics' },
  { id: 'media', label: 'COMMUNICATION', angle: 315, desc: 'Journalism, PR & Storytelling' },
];

function Ticks() {
  const cx = 200;
  const cy = 200;
  const rOuter = 192;
  const rInner = 182;
  const rMajor = 177;
  const ticks = [];

  for (let i = 0; i < 72; i++) {
    const angle = (i / 72) * 2 * Math.PI;
    const isMajor = i % 9 === 0;
    const isMedium = i % 3 === 0;
    const rIn = isMajor ? rMajor : isMedium ? rInner - 2 : rInner;
    
    const x1 = cx + rOuter * Math.sin(angle);
    const y1 = cy - rOuter * Math.cos(angle);
    const x2 = cx + rIn * Math.sin(angle);
    const y2 = cy - rIn * Math.cos(angle);
    
    ticks.push(
      <line
        key={i}
        x1={x1.toFixed(1)}
        y1={y1.toFixed(1)}
        x2={x2.toFixed(1)}
        y2={y2.toFixed(1)}
        stroke={isMajor ? '#d9a548' : isMedium ? 'rgba(217, 165, 72, 0.5)' : 'rgba(243, 234, 211, 0.2)'}
        strokeWidth={isMajor ? 1.8 : isMedium ? 1.2 : 0.75}
      />
    );
  }

  return <g>{ticks}</g>;
}

const HEADINGS = [0, 45, 90, 135, 180, 225, 270, 315];

export default function CompassRose() {
  const [activeDomain, setActiveDomain] = useState(null);
  const [index, setIndex] = useState(0);

  // Continuous living magnetic movement (swings every 3.2s with realistic overshoot)
  useEffect(() => {
    if (activeDomain) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % HEADINGS.length);
    }, 3200);

    return () => clearInterval(id);
  }, [activeDomain]);

  const currentAngle = activeDomain ? activeDomain.angle : HEADINGS[index];
  const currentAutoDomain = DOMAINS.find((d) => d.angle === HEADINGS[index]) || DOMAINS[0];

  const handleDomainHover = (domain) => {
    setActiveDomain(domain);
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* Outer Glow Halo & Ambient Backdrop */}
      <div className="absolute inset-0 -m-6 rounded-full bg-gradient-to-tr from-brass/15 via-brass-bright/10 to-transparent blur-3xl pointer-events-none animate-pulse" />

      {/* Main Glassmorphism Card Container */}
      <div className="relative rounded-full border border-brass/35 bg-ink-deep/60 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_30px_rgba(185,134,46,0.15)] backdrop-blur-md">
        
        {/* SVG Astrolabe Container */}
        <svg viewBox="0 0 400 400" className="h-auto w-full max-w-[380px] sm:max-w-[420px] select-none overflow-visible">
          <defs>
            {/* Rich Gold Gradient */}
            <linearGradient id="goldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff2cf" />
              <stop offset="30%" stopColor="#e5b458" />
              <stop offset="70%" stopColor="#b9862e" />
              <stop offset="100%" stopColor="#694812" />
            </linearGradient>

            {/* Dark Platinum Gradient */}
            <linearGradient id="darkPlatinum" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7a889b" />
              <stop offset="50%" stopColor="#3c4656" />
              <stop offset="100%" stopColor="#182030" />
            </linearGradient>

            {/* Glowing Center Core */}
            <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffe699" stopOpacity="1" />
              <stop offset="40%" stopColor="#d9a548" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10182b" stopOpacity="0" />
            </radialGradient>

            {/* Glow Filter */}
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer Ring & Micro Ticks */}
          <circle cx="200" cy="200" r="194" fill="none" stroke="url(#goldMetallic)" strokeWidth="1.5" opacity="0.6" />
          <circle cx="200" cy="200" r="182" fill="none" stroke="rgba(243,234,211,0.15)" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(217,165,72,0.25)" strokeWidth="1" />

          {/* Degree Ticks */}
          <Ticks />

          {/* Cardinal Directions (N, E, S, W) */}
          <g fontFamily="var(--font-fraunces), serif" fontWeight="700" fontSize="15" fill="#f3ead3">
            <text x="200" y="32" textAnchor="middle" fill="#ffe082" filter="url(#glowFilter)">N</text>
            <text x="372" y="205" textAnchor="middle">E</text>
            <text x="200" y="380" textAnchor="middle">S</text>
            <text x="28" y="205" textAnchor="middle">W</text>
          </g>

          {/* Rotating Astrolabe Pattern Layer */}
          <g className="animate-[spin_90s_linear_infinite]" style={{ transformOrigin: '200px 200px' }}>
            <circle cx="200" cy="200" r="130" fill="none" stroke="rgba(217, 165, 72, 0.15)" strokeWidth="0.8" strokeDasharray="6 6" />
            <circle cx="200" cy="200" r="105" fill="none" stroke="rgba(243, 234, 211, 0.1)" strokeWidth="0.8" />
            {/* Geometric Inner Star Framework */}
            <rect x="130" y="130" width="140" height="140" fill="none" stroke="rgba(217, 165, 72, 0.12)" strokeWidth="0.8" transform="rotate(45 200 200)" />
            <rect x="130" y="130" width="140" height="140" fill="none" stroke="rgba(217, 165, 72, 0.12)" strokeWidth="0.8" />
          </g>

          {/* 8-Point Astrolabe Compass Rose Points */}
          <g style={{ transformOrigin: '200px 200px' }}>
            {/* Main North Spire */}
            <polygon points="200,60 208,190 200,200" fill="url(#goldMetallic)" />
            <polygon points="200,60 192,190 200,200" fill="#7a5513" />

            {/* Main South Spire */}
            <polygon points="200,340 208,210 200,200" fill="url(#goldMetallic)" />
            <polygon points="200,340 192,210 200,200" fill="#7a5513" />

            {/* Main East Spire */}
            <polygon points="340,200 210,208 200,200" fill="url(#goldMetallic)" />
            <polygon points="340,200 210,192 200,200" fill="#7a5513" />

            {/* Main West Spire */}
            <polygon points="60,200 190,208 200,200" fill="url(#goldMetallic)" />
            <polygon points="60,200 190,192 200,200" fill="#7a5513" />

            {/* Diagonal Intermediate Spires (NE, NW, SE, SW) */}
            <g transform="rotate(45 200 200)">
              <polygon points="200,90 205,193 200,200" fill="url(#darkPlatinum)" />
              <polygon points="200,90 195,193 200,200" fill="#242c3b" />
              <polygon points="200,310 205,207 200,200" fill="url(#darkPlatinum)" />
              <polygon points="200,310 195,207 200,200" fill="#242c3b" />
              <polygon points="310,200 207,205 200,200" fill="url(#darkPlatinum)" />
              <polygon points="310,200 207,195 200,200" fill="#242c3b" />
              <polygon points="90,200 193,205 200,200" fill="url(#darkPlatinum)" />
              <polygon points="90,200 193,195 200,200" fill="#242c3b" />
            </g>
          </g>

          {/* Interactive Constellation Threads & Domain Nodes */}
          {DOMAINS.map((d) => {
            const rad = ((d.angle - 90) * Math.PI) / 180;
            const rNode = 135;
            const nx = 200 + rNode * Math.cos(rad);
            const ny = 200 + rNode * Math.sin(rad);
            const isActive = activeDomain ? activeDomain.id === d.id : currentAutoDomain?.id === d.id;

            return (
              <g key={d.id} className="cursor-pointer group" onMouseEnter={() => handleDomainHover(d)} onMouseLeave={() => handleDomainHover(null)}>
                {/* Ray line from center to node */}
                <line
                  x1="200"
                  y1="200"
                  x2={nx}
                  y2={ny}
                  stroke={isActive ? '#ffe082' : 'rgba(217, 165, 72, 0.25)'}
                  strokeWidth={isActive ? '1.8' : '0.8'}
                  strokeDasharray={isActive ? 'none' : '3 3'}
                  className="transition-all duration-300"
                />

                {/* Domain Outer Pulse Ring */}
                <circle
                  cx={nx}
                  cy={ny}
                  r={isActive ? '14' : '9'}
                  fill={isActive ? 'rgba(217, 165, 72, 0.25)' : 'rgba(16, 24, 43, 0.6)'}
                  stroke={isActive ? '#ffe082' : '#d9a548'}
                  strokeWidth={isActive ? '2' : '1'}
                  className="transition-all duration-300"
                  filter={isActive ? 'url(#glowFilter)' : undefined}
                />

                {/* Center Node Dot */}
                <circle
                  cx={nx}
                  cy={ny}
                  r={isActive ? '5' : '3'}
                  fill={isActive ? '#fff' : '#d9a548'}
                  className="transition-all duration-300"
                />
              </g>
            );
          })}

          {/* Dynamic Magnetic Needle in Perpetual Living Motion */}
          <g>
            {/* Target Heading Rotation Layer */}
            <motion.g
              animate={{ rotate: currentAngle }}
              transition={{ duration: 1.8, ease: [0.34, 1.1, 0.4, 1] }}
              style={{ transformOrigin: '200px 200px' }}
            >
              {/* Continuous Liquid-Magnetic Tremor & Float Layer */}
              <motion.g
                animate={{ rotate: [-3.5, 3.5, -2, 2.8, -3.5] }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                }}
                style={{ transformOrigin: '200px 200px' }}
              >
                {/* North Arrow Pointer (Gold) */}
                <polygon points="200,45 207,192 200,200" fill="url(#goldMetallic)" filter="url(#glowFilter)" />
                <polygon points="200,45 193,192 200,200" fill="#996a1a" filter="url(#glowFilter)" />
                <circle cx="200" cy="45" r="3.5" fill="#ffffff" filter="url(#glowFilter)" />

                {/* South Arrow Pointer (Dark Platinum) */}
                <polygon points="200,355 207,208 200,200" fill="url(#darkPlatinum)" />
                <polygon points="200,355 193,208 200,200" fill="#1e2636" />
              </motion.g>
            </motion.g>
          </g>

          {/* Center Brass Hub & Ruby Gemstone Cap */}
          <circle cx="200" cy="200" r="32" fill="url(#coreGlow)" />
          <circle cx="200" cy="200" r="16" fill="#10182b" stroke="url(#goldMetallic)" strokeWidth="2.5" />
          <circle cx="200" cy="200" r="8" fill="url(#goldMetallic)" />
          <circle cx="200" cy="200" r="4" fill="#ffffff" />
        </svg>

        {/* Floating Domain Label Badges Ring */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {DOMAINS.map((d) => {
            const isActive = activeDomain ? activeDomain.id === d.id : currentAutoDomain?.id === d.id;
            return (
              <motion.div
                key={d.id}
                animate={{
                  scale: isActive ? 1.12 : 1,
                  opacity: isActive ? 1 : 0.7,
                }}
                className={`absolute px-2 py-0.5 rounded-full font-mono text-[0.6rem] tracking-wider transition-all pointer-events-auto cursor-pointer border ${
                  isActive
                    ? 'bg-brass text-ink-deep font-bold border-brass-bright shadow-[0_0_15px_rgba(217,165,72,0.5)] z-20'
                    : 'bg-ink/80 text-parchment/80 border-parchment/15 hover:border-brass/50 hover:text-brass-bright'
                }`}
                style={{
                  top: `${50 + 44 * Math.sin(((d.angle - 90) * Math.PI) / 180)}%`,
                  left: `${50 + 44 * Math.cos(((d.angle - 90) * Math.PI) / 180)}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onMouseEnter={() => handleDomainHover(d)}
                onMouseLeave={() => handleDomainHover(null)}
              >
                {d.label}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Status / Selected Domain Info */}
      <div className="mt-4 flex items-center gap-2 rounded-full border border-brass/30 bg-ink-deep/80 px-4 py-1.5 backdrop-blur-md shadow-md text-center">
        <Sparkles className="h-3.5 w-3.5 text-brass-bright animate-pulse" />
        <span className="font-mono text-[0.72rem] tracking-wider text-parchment">
          {activeDomain ? (
            <>
              <strong className="text-brass-bright">{activeDomain.label}:</strong> {activeDomain.desc}
            </>
          ) : (
            <>
              <span className="text-fog/60">Scanning: </span>
              <strong className="text-brass-bright">{currentAutoDomain?.label}</strong> — <span className="text-fog/80">{currentAutoDomain?.desc}</span>
            </>
          )}
        </span>
      </div>
    </div>
  );
}

