'use client';

import React from 'react';

/**
 * Technical Brass Line Illustrations for Career Cards
 *
 * Requirements:
 * - Inline SVG per career in crisp brass strokes (#D9A548 / #B9862E)
 * - Accessible with semantic role="img" and aria-label
 * - Category icon fallback when specific illustration is not defined
 * - No emojis, no gradient fills
 */

export default function CareerIllustration({ slug, className = 'w-40 h-40 sm:w-48 sm:h-48' }) {
  if (slug === 'automobile-engineer') {
    return (
      <svg
        viewBox="0 0 200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Technical vehicle blueprint illustration for Automobile Engineer"
        className={className}
      >
        {/* Chassis Centerline Grid */}
        <line x1="10" y1="125" x2="190" y2="125" stroke="#B9862E" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.4" />
        <line x1="100" y1="20" x2="100" y2="140" stroke="#B9862E" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.25" />

        {/* Aerodynamic Streamlines */}
        <path
          d="M 15 48 C 45 46, 85 35, 135 35 C 165 35, 185 45, 195 50"
          stroke="#D9A548"
          strokeWidth="1"
          strokeDasharray="2 3"
          strokeOpacity="0.5"
        />
        <path
          d="M 20 62 C 60 60, 95 52, 145 52 C 170 52, 185 58, 192 62"
          stroke="#D9A548"
          strokeWidth="1"
          strokeDasharray="3 3"
          strokeOpacity="0.3"
        />

        {/* Main Vehicle Silhouette / Body Frame */}
        <path
          d="M 22 110 
             L 32 110 
             C 32 94, 58 94, 58 110 
             L 138 110 
             C 138 94, 164 94, 164 110 
             L 182 110 
             C 188 110, 192 105, 190 98 
             L 182 78 
             C 178 70, 170 66, 160 65 
             L 130 65 
             L 95 44 
             C 90 41, 84 41, 78 43 
             L 42 62 
             C 34 66, 26 73, 22 82 
             Z"
          stroke="#D9A548"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Cabin Glass / Windows */}
        <path
          d="M 80 47 L 96 47 L 128 65 L 75 65 Z"
          stroke="#D9A548"
          strokeWidth="1.25"
          strokeOpacity="0.8"
        />
        <path
          d="M 48 65 L 72 49 L 72 65 Z"
          stroke="#D9A548"
          strokeWidth="1.25"
          strokeOpacity="0.8"
        />

        {/* Electric Skateboard Battery Pack Floor */}
        <rect
          x="64"
          y="108"
          width="70"
          height="8"
          rx="2"
          stroke="#D9A548"
          strokeWidth="1.2"
          strokeDasharray="4 2"
        />
        <line x1="72" y1="112" x2="126" y2="112" stroke="#B9862E" strokeWidth="1" />

        {/* Front Wheel Assembly */}
        <circle cx="45" cy="110" r="16" stroke="#D9A548" strokeWidth="2" />
        <circle cx="45" cy="110" r="10" stroke="#B9862E" strokeWidth="1.25" />
        <circle cx="45" cy="110" r="3.5" fill="#D9A548" />
        <line x1="45" y1="94" x2="45" y2="126" stroke="#B9862E" strokeWidth="1" />
        <line x1="29" y1="110" x2="61" y2="110" stroke="#B9862E" strokeWidth="1" />

        {/* Rear Wheel Assembly */}
        <circle cx="151" cy="110" r="16" stroke="#D9A548" strokeWidth="2" />
        <circle cx="151" cy="110" r="10" stroke="#B9862E" strokeWidth="1.25" />
        <circle cx="151" cy="110" r="3.5" fill="#D9A548" />
        <line x1="151" y1="94" x2="151" y2="126" stroke="#B9862E" strokeWidth="1" />
        <line x1="135" y1="110" x2="167" y2="110" stroke="#B9862E" strokeWidth="1" />

        {/* Headlight & Taillight Vector Guides */}
        <line x1="184" y1="84" x2="198" y2="84" stroke="#D9A548" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="182" y1="88" x2="194" y2="88" stroke="#D9A548" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7" />
        <line x1="20" y1="92" x2="12" y2="92" stroke="#B9862E" strokeWidth="1.5" strokeLinecap="round" />

        {/* Sensor & Telemetry Dots */}
        <circle cx="95" cy="44" r="2" fill="#D9A548" />
        <circle cx="188" cy="98" r="1.5" fill="#D9A548" />
      </svg>
    );
  }

  if (slug === 'robotics-and-hardware-engineer') {
    return (
      <svg
        viewBox="0 0 200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Robotics and hardware engineering schematic illustration"
        className={className}
      >
        {/* Base Pedestal */}
        <rect x="70" y="130" width="60" height="12" rx="2" stroke="#D9A548" strokeWidth="2" />
        <line x1="55" y1="142" x2="145" y2="142" stroke="#B9862E" strokeWidth="1.5" />

        {/* Articulated Arm Segments */}
        <circle cx="100" cy="120" r="10" stroke="#D9A548" strokeWidth="2" />
        <line x1="100" y1="110" x2="80" y2="70" stroke="#D9A548" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="80" cy="70" r="8" stroke="#B9862E" strokeWidth="2" />
        <line x1="80" y1="62" x2="125" y2="40" stroke="#D9A548" strokeWidth="2" strokeLinecap="round" />
        <circle cx="125" cy="40" r="7" stroke="#B9862E" strokeWidth="2" />

        {/* Gripper Wrist & End Effector */}
        <line x1="125" y1="40" x2="150" y2="40" stroke="#D9A548" strokeWidth="2" />
        <path d="M 150 32 L 165 32 L 170 38" stroke="#D9A548" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M 150 48 L 165 48 L 170 42" stroke="#D9A548" strokeWidth="1.8" strokeLinecap="round" />

        {/* Circuit Traces */}
        <path d="M 30 110 H 55 L 65 120" stroke="#B9862E" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="30" cy="110" r="2.5" fill="#D9A548" />
        <path d="M 170 110 H 145 L 135 120" stroke="#B9862E" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="170" cy="110" r="2.5" fill="#D9A548" />
      </svg>
    );
  }

  // Fallback Category Schematic Illustration
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Technical engineering schematic illustration"
      className={className}
    >
      <circle cx="100" cy="80" r="50" stroke="#D9A548" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.4" />
      <circle cx="100" cy="80" r="32" stroke="#D9A548" strokeWidth="2" />
      <circle cx="100" cy="80" r="12" stroke="#B9862E" strokeWidth="1.5" />
      <line x1="100" y1="20" x2="100" y2="140" stroke="#B9862E" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.4" />
      <line x1="30" y1="80" x2="170" y2="80" stroke="#B9862E" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.4" />
      <path d="M 85 45 L 100 25 L 115 45 Z" stroke="#D9A548" strokeWidth="1.5" />
      <path d="M 85 115 L 100 135 L 115 115 Z" stroke="#D9A548" strokeWidth="1.5" />
      <path d="M 45 85 L 25 100 L 45 115 Z" stroke="#D9A548" strokeWidth="1.5" />
      <path d="M 115 85 L 135 100 L 115 115 Z" stroke="#D9A548" strokeWidth="1.5" />
    </svg>
  );
}

