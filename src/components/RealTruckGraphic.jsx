import React from 'react';

export const RealTruckGraphic = () => (
  <div className="relative flex flex-col items-center shrink-0 group">
    {/* Headlight Cone Glow Projection */}
    <div className="absolute left-[82%] top-1/2 -translate-y-1/2 w-24 h-12 bg-gradient-to-r from-amber-300/80 via-amber-200/30 to-transparent pointer-events-none blur-xs z-10"></div>

    {/* Ultra-Vibrant 3D Electric Logistics Semi-Truck Vector */}
    <div className="relative flex items-center justify-center drop-shadow-2xl">
      <svg width="110" height="58" viewBox="0 0 130 65" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Dynamic Ground Shadow */}
        <ellipse cx="65" cy="58" rx="60" ry="5" fill="#000000" fillOpacity="0.5" />

        {/* Cargo Container Body (Glossy Orange 3D Gradient) */}
        <rect x="4" y="6" width="80" height="42" rx="5" fill="url(#truckBodyGrad)" stroke="#FFFFFF" strokeWidth="1.8" />
        
        {/* Container Rib Lines */}
        <line x1="18" y1="8" x2="18" y2="46" stroke="#D95300" strokeWidth="1.8" />
        <line x1="32" y1="8" x2="32" y2="46" stroke="#D95300" strokeWidth="1.8" />
        <line x1="46" y1="8" x2="46" y2="46" stroke="#D95300" strokeWidth="1.8" />
        <line x1="60" y1="8" x2="60" y2="46" stroke="#D95300" strokeWidth="1.8" />
        <line x1="74" y1="8" x2="74" y2="46" stroke="#D95300" strokeWidth="1.8" />

        {/* Josan Logo & Telematics Branding */}
        <rect x="22" y="16" width="44" height="20" rx="3" fill="#0F172A" fillOpacity="0.85" />
        <text x="44" y="27" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.6">JOSAN EXPRESS</text>
        <text x="44" y="34" textAnchor="middle" fill="#FFD700" fontSize="4.5" fontWeight="800" fontFamily="sans-serif">⚡ 100% ELECTRIC EV FLEET</text>

        {/* Heavy Truck Driver Cabin */}
        <path d="M84 16 L104 16 L118 30 L118 48 L84 48 Z" fill="#0F172A" stroke="#FFFFFF" strokeWidth="1.8" />
        <path d="M88 19 L102 19 L112 29 L88 29 Z" fill="#38BDF8" fillOpacity="0.9" stroke="#0284C7" strokeWidth="1" /> {/* Windshield */}
        
        {/* Cabin Front Bumper Accent (Vibrant Orange) */}
        <path d="M104 30 L118 30 L118 48 L104 48 Z" fill="#FF6B00" />
        
        {/* Headlight Bulb */}
        <circle cx="120" cy="38" r="3.5" fill="#FDE047" />
        <circle cx="120" cy="38" r="6" fill="#FDE047" fillOpacity="0.4" />

        {/* 3D Chrome Wheels & Heavy Rubber Tires */}
        <g stroke="#E2E8F0" strokeWidth="2">
          <circle cx="18" cy="50" r="7.5" fill="#020617" />
          <circle cx="18" cy="50" r="3" fill="#94A3B8" />

          <circle cx="35" cy="50" r="7.5" fill="#020617" />
          <circle cx="35" cy="50" r="3" fill="#94A3B8" />

          <circle cx="72" cy="50" r="7.5" fill="#020617" />
          <circle cx="72" cy="50" r="3" fill="#94A3B8" />

          <circle cx="106" cy="50" r="7.5" fill="#020617" />
          <circle cx="106" cy="50" r="3" fill="#94A3B8" />
        </g>

        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="truckBodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF7A1A" />
            <stop offset="50%" stopColor="#FF6B00" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>
        </defs>
      </svg>

      {/* Live Telematics Badge */}
      <span className="absolute -top-2.5 -right-2.5 bg-emerald-500 text-white font-mono font-extrabold text-[9px] px-2 py-0.5 rounded-full border-2 border-white shadow-lg animate-pulse">
        GPS LIVE
      </span>
    </div>
  </div>
);
