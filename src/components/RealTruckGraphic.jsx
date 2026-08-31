import React from 'react';

export const RealTruckGraphic = () => (
  <div className="relative flex flex-col items-center shrink-0">
    {/* Headlight Beam Glow */}
    <div className="absolute left-[80%] top-1/2 -translate-y-1/2 w-16 h-8 bg-gradient-to-r from-amber-400/50 via-amber-300/20 to-transparent clip-triangle pointer-events-none blur-xs"></div>

    {/* Realistic 3D Semi-Truck Vector Illustration */}
    <svg width="84" height="42" viewBox="0 0 110 55" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
      {/* Dynamic Ground Shadow */}
      <ellipse cx="55" cy="50" rx="50" ry="4" fill="#000000" fillOpacity="0.6" />

      {/* Main Cargo Container Body (Electric Orange Gradient) */}
      <rect x="3" y="6" width="68" height="34" rx="4" fill="url(#containerGrad)" stroke="#FFA052" strokeWidth="1.2" />
      
      {/* Container Rib Lines */}
      <line x1="14" y1="8" x2="14" y2="38" stroke="#D95300" strokeWidth="1.5" />
      <line x1="25" y1="8" x2="25" y2="38" stroke="#D95300" strokeWidth="1.5" />
      <line x1="36" y1="8" x2="36" y2="38" stroke="#D95300" strokeWidth="1.5" />
      <line x1="47" y1="8" x2="47" y2="38" stroke="#D95300" strokeWidth="1.5" />
      <line x1="58" y1="8" x2="58" y2="38" stroke="#D95300" strokeWidth="1.5" />

      {/* Josan Logo Branding on Container */}
      <text x="36" y="24" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.8">JOSAN EXPRESS</text>
      <text x="36" y="32" textAnchor="middle" fill="#FFE5D6" fontSize="4" fontWeight="800" fontFamily="sans-serif">🇸🇬 SINGAPORE FLEET</text>

      {/* Driver Cabin (Heavy Truck Front) */}
      <path d="M71 16 L88 16 L100 28 L100 40 L71 40 Z" fill="#0F172A" stroke="#334155" strokeWidth="1.2" />
      <path d="M74 18 L86 18 L95 27 L74 27 Z" fill="#38BDF8" fillOpacity="0.85" stroke="#0284C7" strokeWidth="0.8" /> {/* Windshield */}
      
      {/* Cabin Front Bumper Accent (Vibrant Orange) */}
      <path d="M88 28 L100 28 L100 40 L88 40 Z" fill="#FF6B00" />
      
      {/* Chrome Bumper Grill & Headlight */}
      <rect x="100" y="34" width="5" height="6" rx="1" fill="#E2E8F0" />
      <circle cx="102.5" cy="31" r="2.5" fill="#FDE047" /> {/* Headlight bulb */}
      <circle cx="102.5" cy="31" r="4" fill="#FDE047" fillOpacity="0.3" />

      {/* Wheels */}
      <circle cx="14" cy="42" r="6.5" fill="#020617" stroke="#94A3B8" strokeWidth="1.8" />
      <circle cx="14" cy="42" r="2.5" fill="#E2E8F0" />
      
      <circle cx="28" cy="42" r="6.5" fill="#020617" stroke="#94A3B8" strokeWidth="1.8" />
      <circle cx="28" cy="42" r="2.5" fill="#E2E8F0" />

      <circle cx="62" cy="42" r="6.5" fill="#020617" stroke="#94A3B8" strokeWidth="1.8" />
      <circle cx="62" cy="42" r="2.5" fill="#E2E8F0" />

      <circle cx="90" cy="42" r="6.5" fill="#020617" stroke="#94A3B8" strokeWidth="1.8" />
      <circle cx="90" cy="42" r="2.5" fill="#E2E8F0" />

      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="containerGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF7A1A" />
          <stop offset="50%" stopColor="#FF6B00" />
          <stop offset="100%" stopColor="#D95300" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);
