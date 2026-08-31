import React, { useState, useRef, useEffect } from 'react';
import { RealTruckGraphic } from './RealTruckGraphic';

export const SingaporeGoogleMapBackground = ({
  origin = 'Changi Air Cargo Complex',
  destination = 'Jurong Port Industrial Estate',
  vehicle = 'Josan EV Express Semi-Truck #SG-8819',
  truckProgress: externalProgress,
  currentSpeed: externalSpeed,
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });

  // Internal progress animation fallback if external not passed
  const [internalProgress, setInternalProgress] = useState(25);
  const [internalSpeed, setInternalSpeed] = useState(65);

  useEffect(() => {
    if (externalProgress !== undefined) return;
    const timer = setInterval(() => {
      setInternalProgress((prev) => (prev >= 85 ? 15 : prev + 0.35));
      setInternalSpeed(62 + Math.floor(Math.random() * 8));
    }, 100);
    return () => clearInterval(timer);
  }, [externalProgress]);

  const progress = externalProgress !== undefined ? externalProgress : internalProgress;
  const speed = externalSpeed !== undefined ? externalSpeed : internalSpeed;

  // Compute position (x, y) along the curved PIE Expressway path (0 to 100%)
  const getExpresswayPoint = (p) => {
    // Map p (0..100) to t (0..1)
    const t = Math.min(Math.max(p / 100, 0), 1);
    
    // Segment 1 (t: 0 to 0.5) or Segment 2 (t: 0.5 to 1)
    if (t <= 0.5) {
      const u = t * 2; // normalize to 0..1
      const p0 = { x: 80, y: 220 };
      const p1 = { x: 300, y: 180 };
      const p2 = { x: 520, y: 200 };
      const x = (1 - u) * (1 - u) * p0.x + 2 * (1 - u) * u * p1.x + u * u * p2.x;
      const y = (1 - u) * (1 - u) * p0.y + 2 * (1 - u) * u * p1.y + u * u * p2.y;
      return { x, y };
    } else {
      const u = (t - 0.5) * 2; // normalize to 0..1
      const p0 = { x: 520, y: 200 };
      const p1 = { x: 750, y: 160 };
      const p2 = { x: 950, y: 110 };
      const x = (1 - u) * (1 - u) * p0.x + 2 * (1 - u) * u * p1.x + u * u * p2.x;
      const y = (1 - u) * (1 - u) * p0.y + 2 * (1 - u) * u * p1.y + u * u * p2.y;
      return { x, y };
    }
  };

  const truckPos = getExpresswayPoint(progress);

  // Mouse Wheel Zooming
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.15 : -0.15;
    setZoom((prev) => Math.min(Math.max(0.8, prev + delta), 3.5));
  };

  // Mouse Click & Drag Panning
  const handleMouseDown = (e) => {
    // Only drag if clicking the map background (not control buttons)
    if (e.target.closest('button')) return;
    setIsDragging(true);
    startPos.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - startPos.current.x,
      y: e.clientY - startPos.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetMap = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full h-full select-none overflow-hidden bg-[#eef1ec] ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Dynamic Map Canvas Layer (Background Terrain + Expressways + Truck Route + Markers all move together!) */}
      <div
        className="w-full h-full transition-transform duration-75 ease-out origin-center"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 1000 500"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base Landmass (Google Maps Light Greenish-Beige) */}
          <rect width="1000" height="500" fill="#edf0eb" />

          {/* Ocean / Singapore Straits Water Body */}
          <path
            d="M 0 380 Q 200 370, 450 375 Q 700 365, 1000 320 L 1000 500 L 0 500 Z"
            fill="#92c5f7"
            stroke="#7ab7f5"
            strokeWidth="2"
          />

          {/* Parks & Greenery Areas */}
          <path
            d="M 120 365 Q 350 360, 600 355 Q 800 340, 950 305 L 940 325 Q 750 360, 500 370 Z"
            fill="#bde8bc"
            stroke="#a3dfa1"
            strokeWidth="1.5"
          />
          <ellipse cx="450" cy="150" rx="60" ry="30" fill="#85c2ff" stroke="#66b3ff" strokeWidth="1.5" />
          <path
            d="M 380 140 Q 450 110, 520 130 Q 530 170, 460 190 Q 370 170, 380 140 Z"
            fill="#bde8bc"
            fillOpacity="0.8"
            stroke="#9cd99a"
            strokeWidth="1"
          />

          <rect x="700" y="50" width="80" height="40" rx="10" fill="#bde8bc" fillOpacity="0.7" />
          <rect x="150" y="80" width="70" height="50" rx="8" fill="#cdecca" fillOpacity="0.7" />

          {/* Local City Streets */}
          <g stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.9">
            <line x1="0" y1="100" x2="1000" y2="100" />
            <line x1="0" y1="160" x2="1000" y2="160" />
            <line x1="0" y1="230" x2="1000" y2="230" />
            <line x1="0" y1="300" x2="1000" y2="300" />
            <line x1="0" y1="340" x2="1000" y2="340" />

            <line x1="120" y1="0" x2="120" y2="400" />
            <line x1="260" y1="0" x2="260" y2="400" />
            <line x1="400" y1="0" x2="400" y2="400" />
            <line x1="580" y1="0" x2="580" y2="400" />
            <line x1="720" y1="0" x2="720" y2="400" />
            <line x1="860" y1="0" x2="860" y2="400" />
          </g>

          {/* Primary Expressways Background Lines */}
          <path
            d="M 0 240 Q 300 180, 520 200 Q 750 160, 1000 110"
            fill="none"
            stroke="#f97316"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M 0 350 Q 350 340, 600 330 Q 800 310, 1000 240"
            fill="none"
            stroke="#f97316"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path d="M 120 400 L 120 0" fill="none" stroke="#fbbf24" strokeWidth="6" opacity="0.9" />
          <path d="M 650 0 Q 780 80, 1000 90" fill="none" stroke="#fbbf24" strokeWidth="6" opacity="0.9" />

          {/* Dynamic Active Trailing Route Line on PIE Expressway */}
          <path
            d="M 80 220 Q 300 180, 520 200 Q 750 160, 950 110"
            fill="none"
            stroke="#0f172a"
            strokeWidth="10"
            strokeDasharray="12 8"
            opacity="0.5"
          />
          <path
            d="M 80 220 Q 300 180, 520 200 Q 750 160, 950 110"
            fill="none"
            stroke="#ff6b00"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Highway Shield Badges */}
          <g fontFamily="sans-serif" fontSize="9" fontWeight="900" textAnchor="middle">
            <rect x="220" y="195" width="26" height="14" rx="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="1" />
            <text x="233" y="206" fill="#ffffff">PIE</text>

            <rect x="520" y="190" width="26" height="14" rx="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="1" />
            <text x="533" y="201" fill="#ffffff">PIE</text>

            <rect x="880" y="125" width="26" height="14" rx="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="1" />
            <text x="893" y="136" fill="#ffffff">PIE</text>

            <rect x="280" y="335" width="28" height="14" rx="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="1" />
            <text x="294" y="346" fill="#ffffff">ECP</text>

            <rect x="580" y="325" width="28" height="14" rx="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="1" />
            <text x="594" y="336" fill="#ffffff">ECP</text>

            <rect x="107" y="120" width="26" height="14" rx="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="1" />
            <text x="120" y="131" fill="#ffffff">KPE</text>

            <rect x="790" y="60" width="26" height="14" rx="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="1" />
            <text x="803" y="71" fill="#ffffff">TPE</text>
          </g>

          {/* Google Maps POI Labels */}
          <g fontFamily="sans-serif" fontSize="10" fontWeight="700">
            <text x="475" y="152" fill="#166534">🌲 Bedok Reservoir Park</text>

            <rect x="470" y="240" width="75" height="18" rx="9" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="480" y="253" fill="#2563eb" fontSize="9.5">🛍️ Bedok Mall</text>

            <rect x="620" y="45" width="85" height="18" rx="9" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="628" y="58" fill="#2563eb" fontSize="9.5">🛍️ Tampines Mall</text>

            <rect x="150" y="260" width="95" height="18" rx="9" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="158" y="273" fill="#2563eb" fontSize="9.5">🏬 SingPost Centre</text>

            <rect x="780" y="150" width="95" height="18" rx="9" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="788" y="163" fill="#2563eb" fontSize="9.5">✈️ Changi City Point</text>

            <text x="330" y="365" fill="#15803d" fontSize="10.5">🌳 East Coast Park</text>

            <text x="350" y="225" fill="#475569" fontSize="8.5" fontWeight="600">Sims Avenue E</text>
            <text x="370" y="322" fill="#475569" fontSize="8.5" fontWeight="600">Marine Parade Road</text>
            <text x="680" y="260" fill="#475569" fontSize="8.5" fontWeight="600">Bedok Road</text>
          </g>
        </svg>

        {/* Origin Pin A (Changi Cargo Hub) - Moved WITH Map */}
        <div
          className="absolute z-20 flex flex-col items-center pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{ left: '8%', top: '44%' }}
        >
          <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center text-xs font-extrabold shadow-2xl">
            A
          </div>
          <span className="text-[11px] text-white font-extrabold mt-1 bg-slate-900/95 px-2.5 py-0.5 rounded-lg border border-slate-700 shadow-xl whitespace-nowrap">
            {origin}
          </span>
        </div>

        {/* Real 3D Semi-Truck Graphic Riding Exactly on PIE Expressway - Moved WITH Map */}
        <div
          className="absolute z-30 flex flex-col items-center pointer-events-none transition-all duration-100 ease-linear -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${(truckPos.x / 1000) * 100}%`,
            top: `${(truckPos.y / 500) * 100}%`,
          }}
        >
          <div className="relative flex items-center justify-center">
            <span className="absolute w-20 h-20 rounded-full bg-orange-500/35 animate-ping"></span>
            <RealTruckGraphic />
          </div>
          <span className="text-[11px] text-orange-300 font-mono font-extrabold mt-1 bg-slate-900/95 px-3 py-0.5 rounded-full border border-orange-500/60 shadow-2xl whitespace-nowrap">
            🚛 {vehicle} ({Math.round(progress)}% En Route)
          </span>
        </div>

        {/* Destination Pin B (Tuas / Jurong Port) - Moved WITH Map */}
        <div
          className="absolute z-20 flex flex-col items-center pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{ left: '95%', top: '22%' }}
        >
          <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-rose-500 text-rose-400 flex items-center justify-center text-xs font-extrabold shadow-2xl">
            B
          </div>
          <span className="text-[11px] text-white font-extrabold mt-1 bg-slate-900/95 px-2.5 py-0.5 rounded-lg border border-slate-700 shadow-xl whitespace-nowrap">
            {destination}
          </span>
        </div>
      </div>

      {/* Floating Header Overlay (Passes Mouse Clicks Through with pointer-events-none) */}
      <div className="absolute top-4 left-4 right-16 z-40 pointer-events-none flex items-center justify-between bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700 text-xs text-white shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-orange-glow shrink-0">
            📍
          </div>
          <div>
            <p className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">
              Singapore Live GPS Telematics Route
            </p>
            <p className="font-extrabold text-slate-100">{origin} → {destination}</p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Speed & Telemetry</p>
          <p className="font-extrabold text-orange-400 font-mono">{speed} KM/H (PIE Expressway)</p>
        </div>
      </div>

      {/* Floating Map Controls (Top Right) */}
      <div className="absolute top-4 right-4 z-50 flex flex-col items-center space-y-1.5 pointer-events-auto">
        <button
          onClick={resetMap}
          className="w-8 h-8 rounded-lg bg-white border border-slate-300 shadow-md flex items-center justify-center text-slate-700 text-xs font-bold hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
          title="Reset View"
        >
          🗺️
        </button>
        <button
          onClick={resetMap}
          className="w-8 h-8 rounded-lg bg-white border border-slate-300 shadow-md flex items-center justify-center text-orange-600 text-xs font-bold hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
          title="Center Map on Singapore"
        >
          🎯
        </button>
        <div className="bg-white rounded-lg border border-slate-300 shadow-md flex flex-col items-center overflow-hidden divide-y text-slate-800 font-extrabold text-sm">
          <button
            onClick={() => setZoom((prev) => Math.min(3.5, prev + 0.3))}
            className="w-8 h-7 flex items-center justify-center hover:bg-slate-100 active:bg-slate-200 cursor-pointer"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={() => setZoom((prev) => Math.max(0.8, prev - 0.3))}
            className="w-8 h-7 flex items-center justify-center hover:bg-slate-100 active:bg-slate-200 cursor-pointer"
            title="Zoom Out"
          >
            −
          </button>
        </div>
      </div>

      {/* Floating Footer Telematics Overlay (Bottom Left) */}
      <div className="absolute bottom-3 left-4 right-4 z-40 pointer-events-none grid grid-cols-3 gap-2 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700 text-center text-xs text-white shadow-2xl">
        <div>
          <span className="text-slate-400 text-[10px] block font-bold uppercase">Est. Arrival</span>
          <span className="font-extrabold text-white font-mono">Today, 4:30 PM (SGT)</span>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] block font-bold uppercase">Distance Remaining</span>
          <span className="font-extrabold text-orange-400 font-mono">18.4 km (Expressway SLA)</span>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] block font-bold uppercase">Battery & Efficiency</span>
          <span className="font-extrabold text-emerald-400 font-mono">94% (EV Cargo SLA)</span>
        </div>
      </div>
    </div>
  );
};
