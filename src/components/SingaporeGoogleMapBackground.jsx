import React, { useState, useRef, useEffect } from 'react';
import { RealTruckGraphic } from './RealTruckGraphic';

export const SingaporeGoogleMapBackground = ({
  origin = 'Changi Air Cargo Complex',
  destination = 'Jurong Port Industrial Estate',
  vehicle = 'Josan EV Express Semi-Truck #SG-8819',
  truckProgress: externalProgress,
  currentSpeed: externalSpeed,
  showTruck = true,
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

  const safeOrigin = origin || 'Changi Air Cargo Complex';
  const safeDestination = destination || 'Jurong Port Industrial Estate';
  const safeVehicle = vehicle || 'Josan EV Express Semi-Truck #SG-8819';

  const progressVal = typeof externalProgress === 'number' && !isNaN(externalProgress) ? externalProgress : internalProgress;
  const speedVal = typeof externalSpeed === 'number' && !isNaN(externalSpeed) ? externalSpeed : internalSpeed;
  const safeProgress = typeof progressVal === 'number' && !isNaN(progressVal) ? progressVal : 25;
  const safeSpeed = typeof speedVal === 'number' && !isNaN(speedVal) ? speedVal : 65;

  // Compute position (x, y) along the curved PIE Expressway path (0 to 100%)
  const getExpresswayPoint = (p) => {
    const numericP = typeof p === 'number' && !isNaN(p) ? p : 25;
    // Map p (0..100) to t (0..1)
    const t = Math.min(Math.max(numericP / 100, 0), 1);
    
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

  const rawTruckPos = getExpresswayPoint(safeProgress);
  const truckPos = {
    x: typeof rawTruckPos?.x === 'number' && !isNaN(rawTruckPos.x) ? rawTruckPos.x : 520,
    y: typeof rawTruckPos?.y === 'number' && !isNaN(rawTruckPos.y) ? rawTruckPos.y : 200
  };

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
          {/* High Resolution Realistic Google Maps Satellite & Terrain Background Image */}
          <image
            href="/assets/singapore_google_map_hd.jpg"
            x="0"
            y="0"
            width="1000"
            height="500"
            preserveAspectRatio="none"
          />

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

          {/* Dynamic Active Trailing Route Line on PIE Expressway with Marching Flow Effect */}
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
          <path
            d="M 80 220 Q 300 180, 520 200 Q 750 160, 950 110"
            fill="none"
            stroke="#ffffff"
            strokeWidth="4"
            strokeLinecap="round"
            className="animate-route-flow"
            opacity="0.9"
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

          {/* Origin Pin A (Changi Cargo Hub) - Locked to SVG Route Start */}
          <g transform="translate(80, 220)">
            <circle r="14" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" />
            <text textAnchor="middle" dy="4" fill="#10b981" fontSize="12" fontWeight="900" fontFamily="sans-serif">A</text>
            <rect x="-75" y="18" width="150" height="22" rx="6" fill="#0f172a" fillOpacity="0.95" stroke="#334155" strokeWidth="1" />
            <text x="0" y="33" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="800" fontFamily="sans-serif">{safeOrigin}</text>
          </g>

          {/* Destination Pin B (Jurong Port / Tuas) - Locked to SVG Route End */}
          <g transform="translate(950, 110)">
            <circle r="14" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.5" />
            <text textAnchor="middle" dy="4" fill="#f43f5e" fontSize="12" fontWeight="900" fontFamily="sans-serif">B</text>
            <rect x="-75" y="-36" width="150" height="22" rx="6" fill="#0f172a" fillOpacity="0.95" stroke="#334155" strokeWidth="1" />
            <text x="0" y="-21" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="800" fontFamily="sans-serif">{safeDestination}</text>
          </g>

          {/* Real 3D Semi-Truck Graphic Riding Exactly on PIE Expressway - Dual Vector + Image Guarantee */}
          {showTruck && (
            <g transform={`translate(${truckPos.x}, ${truckPos.y})`}>
              {/* Pulse Radar Glow */}
              <circle r="36" fill="#f97316" fillOpacity="0.35">
                <animate attributeName="r" values="22;42;22" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="fill-opacity" values="0.6;0.1;0.6" dur="1.5s" repeatCount="indefinite" />
              </circle>

              {/* Headlight Beam Vector Projection */}
              <polygon points="35,-5 85,-18 85,10 35,5" fill="#fde047" fillOpacity="0.4" />

              {/* 3D Semi-Truck Container Body */}
              <rect x="-45" y="-22" width="60" height="32" rx="4" fill="#ff6b00" stroke="#ffffff" strokeWidth="1.5" />
              <rect x="-42" y="-20" width="54" height="28" rx="2" fill="#ea580c" />
              <text x="-15" y="-3" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900" fontFamily="sans-serif">JOSAN</text>
              <text x="-15" y="5" textAnchor="middle" fill="#ffedd5" fontSize="5" fontWeight="800" fontFamily="sans-serif">EXPRESS EV</text>

              {/* Truck Driver Cabin */}
              <path d="M15 -18 L32 -18 L42 -8 L42 10 L15 10 Z" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
              <path d="M18 -15 L30 -15 L37 -8 L18 -8 Z" fill="#38bdf8" />
              <rect x="32" y="0" width="10" height="10" fill="#ff6b00" />
              <circle cx="40" cy="-2" r="3" fill="#fde047" />

              {/* 3D Wheel Tires */}
              <circle cx="-32" cy="12" r="6" fill="#020617" stroke="#cbd5e1" strokeWidth="1.5" />
              <circle cx="-32" cy="12" r="2" fill="#ffffff" />
              <circle cx="-18" cy="12" r="6" fill="#020617" stroke="#cbd5e1" strokeWidth="1.5" />
              <circle cx="-18" cy="12" r="2" fill="#ffffff" />
              <circle cx="12" cy="12" r="6" fill="#020617" stroke="#cbd5e1" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="2" fill="#ffffff" />
              <circle cx="32" cy="12" r="6" fill="#020617" stroke="#cbd5e1" strokeWidth="1.5" />
              <circle cx="32" cy="12" r="2" fill="#ffffff" />

              {/* Live Telematics Badge Overlay */}
              <rect x="-65" y="24" width="130" height="20" rx="10" fill="#0f172a" fillOpacity="0.95" stroke="#f97316" strokeWidth="1.5" />
              <text x="0" y="37" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="900" fontFamily="monospace">
                🚛 {Math.round(safeProgress)}% EN ROUTE
              </text>

              {/* Pulsing GPS LIVE Pill */}
              <rect x="18" y="-34" width="48" height="16" rx="8" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
              <text x="42" y="-23" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900" fontFamily="sans-serif">
                GPS LIVE
              </text>
            </g>
          )}

        </svg>

        {/* 100% BULLETPROOF HTML OVERLAY 3D TRUCK BADGE (GUARANTEED VISIBILITY IN ALL BROWSERS) */}
        {showTruck && (
          <div
            className="absolute z-50 flex flex-col items-center pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-all duration-100 ease-linear"
            style={{
              left: `${isNaN(truckPos.x) ? 50 : (truckPos.x / 1000) * 100}%`,
              top: `${isNaN(truckPos.y) ? 40 : (truckPos.y / 500) * 100}%`,
            }}
          >
            <div className="relative flex items-center justify-center">
              <span className="absolute w-24 h-24 rounded-full bg-orange-500/40 animate-ping"></span>
              <RealTruckGraphic />
            </div>
            <span className="mt-1 bg-slate-900/95 text-orange-400 font-mono font-extrabold text-[11px] px-3.5 py-0.5 rounded-full border border-orange-500/80 shadow-2xl whitespace-nowrap">
              📍 {Math.round(safeProgress)}% EN ROUTE (PIE Expressway)
            </span>
          </div>
        )}
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
            <p className="font-extrabold text-slate-100">{safeOrigin} → {safeDestination}</p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Speed & Telemetry</p>
          <p className="font-extrabold text-orange-400 font-mono">{safeSpeed} KM/H (PIE Expressway)</p>
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
