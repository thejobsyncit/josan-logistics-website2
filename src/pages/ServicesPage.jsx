import React, { useState, useEffect, useRef } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { Plane, Truck, Ship, Thermometer, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

const DynamicServiceGallery = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatic smooth auto-scroll slideshow (every 3 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="w-full">
      {/* Main Auto-Scrolling Image Container */}
      <div className="relative group overflow-hidden rounded-2xl border border-slate-200 shadow-md h-80 bg-slate-900">
        <img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${title} view ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-700 ease-in-out transform group-hover:scale-105 animate-fade-in"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60"></div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-orange-500 text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 backdrop-blur-sm cursor-pointer z-10"
          title="Previous Image"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-orange-500 text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 backdrop-blur-sm cursor-pointer z-10"
          title="Next Image"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicator Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                idx === currentIndex
                  ? 'bg-orange-500 w-6'
                  : 'bg-white/60 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const ServicesPage = ({ setActiveTab }) => {
  const { setIsAuthModalOpen, setAuthModalHideClose, isAuthModalOpen, currentUser } = useLogistics();

  const [calculatorWeight, setCalculatorWeight] = useState(25);
  const [calculatorService, setCalculatorService] = useState('express');
  const [calculatorInsurance, setCalculatorInsurance] = useState(false);

  // When page loads, clicking or scrolling the kg button prompts log-in
  const [isKgAuthenticated, setIsKgAuthenticated] = useState(false);

  const openLoginModal = () => {
    if (setAuthModalHideClose) {
      setAuthModalHideClose(false);
    }
    if (setIsAuthModalOpen) {
      setIsAuthModalOpen(true);
    }
  };

  // Once the login modal opens and closes (e.g. customer signs in), unlock weight adjustments
  const prevModalOpen = useRef(false);
  useEffect(() => {
    if (prevModalOpen.current && !isAuthModalOpen) {
      setIsKgAuthenticated(true);
    }
    prevModalOpen.current = isAuthModalOpen;
  }, [isAuthModalOpen]);

  const handleKgInteraction = (e) => {
    if (!isKgAuthenticated) {
      if (e) {
        if (typeof e.preventDefault === 'function') e.preventDefault();
        if (typeof e.stopPropagation === 'function') e.stopPropagation();
      }
      openLoginModal();
    }
  };

  const getRatePerKg = () => {
    switch (calculatorService) {
      case 'express': return 12;
      case 'ground': return 4;
      case 'sea': return 2;
      case 'cold': return 15;
      default: return 5;
    }
  };

  const estimatedTotal = (calculatorWeight * getRatePerKg() + (calculatorInsurance ? 25 : 0)).toFixed(2);

  const handleBookServiceClick = () => {
    if (!currentUser) {
      openLoginModal();
    } else {
      setActiveTab('book');
    }
  };

  const servicesData = [
    {
      id: 'express-air',
      tabName: 'Air Freight',
      title: 'Express Air Cargo & Priority Charter',
      icon: Plane,
      images: [
        'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1542296332-2e4473faf563?w=800&auto=format&fit=crop&q=80'
      ],
      desc: 'Dedicated priority air freight servicing major global hubs with guaranteed next-day delivery SLAs and real-time flight tracking.',
      features: ['Next-Day & Same-Day Priority Flights', 'Airport-to-Door Telematics Tracking', 'Hazmat & High-Value Secured Vaults', 'Customs Clearance Fast-Track']
    },
    {
      id: 'ocean-freight',
      tabName: 'Ocean Freight',
      title: 'Ocean Cargo Shipping & Container Lines',
      icon: Ship,
      images: [
        'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80'
      ],
      desc: 'Cost-effective global sea freight handling 20ft/40ft containers, oversized machinery, and consolidated ocean cargo.',
      features: ['FCL (Full Container) & LCL Shipping', 'Port Terminal Intermodal Transfer', 'Automated Ocean Bill of Lading', 'Global Customs Brokerage']
    },
    {
      id: 'land-haulage',
      tabName: 'Land Transport',
      title: 'Freight Trucking & Land Haulage (FTL / LTL)',
      icon: Truck,
      images: [
        'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80'
      ],
      desc: 'Modern fleet of 18-wheeler semi-trucks and sprinter vans equipped with satellite GPS telematics for seamless highway freight.',
      features: ['Full Truckload (FTL) & Partial (LTL)', 'Automated Route Optimization', 'Hydraulic Lift-gate Vans Available', '24/7 Driver Telemetry Feed']
    },
    {
      id: 'cold-chain',
      tabName: 'Cold Pharma Logistics',
      title: 'Pharma Cold Chain & Refrigerated Transit',
      icon: Thermometer,
      images: [
        'https://images.unsplash.com/photo-1586528116493-a029325540fa?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&auto=format&fit=crop&q=80'
      ],
      desc: 'Precision temperature-controlled transport ranging from -20°C to +8°C for pharmaceuticals, medical vaccines, and perishables.',
      features: ['Continuous Temperature Data-Logger', 'ISO 9001 & GDP Compliant', 'Emergency Backup Refrigeration', 'Sterile Sealed Packaging']
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <span className="text-orange-400 font-bold uppercase text-xs tracking-widest bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            Logistics & Freight Services
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-sans">
            End-To-End Multimodal Shipping
          </h1>
          <p className="text-slate-200 font-medium max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Mainly focusing on Singapore and surrounding countries, Josan Logistics provides full supply chain execution with dynamic live tracking.
          </p>
        </div>
      </section>

      {/* Instant Shipping Rate Estimator Widget */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-orange-subtle-gradient rounded-3xl p-8 sm:p-10 border-2 border-orange-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <span className="text-orange-600 font-bold uppercase text-xs tracking-widest bg-white px-3 py-1 rounded-full border border-orange-200">
              Interactive Estimator
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900">Calculate Instant Freight Rate</h3>
            <p className="text-slate-800 font-semibold text-xs sm:text-sm">Adjust weight and service speed to get an instant estimate.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            
            {/* Weight Slider */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Cargo Weight: <span className="text-orange-600 font-mono text-sm font-black">{calculatorWeight} kg</span>
              </label>

              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="5"
                  value={calculatorWeight}
                  onChange={(e) => {
                    if (!isKgAuthenticated) {
                      openLoginModal();
                      return;
                    }
                    setCalculatorWeight(Number(e.target.value));
                  }}
                  className="w-full accent-orange-500 cursor-pointer"
                />

                {/* Click / scroll interceptor until login is triggered */}
                {!isKgAuthenticated && (
                  <div
                    onClick={handleKgInteraction}
                    onPointerDown={handleKgInteraction}
                    onMouseDown={handleKgInteraction}
                    onTouchStart={handleKgInteraction}
                    className="absolute inset-0 cursor-pointer z-10"
                  />
                )}
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0 kg</span>
                <span>250 kg</span>
                <span>500 kg</span>
              </div>
            </div>

            {/* Service Speed & Addons */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Service Mode</label>
                <select
                  value={calculatorService}
                  onChange={(e) => setCalculatorService(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus-orange cursor-pointer"
                >
                  <option value="express">Express Air Freight ($12/kg)</option>
                  <option value="ground">Land Trucking ($4/kg)</option>
                  <option value="sea">Ocean Shipping ($2/kg)</option>
                  <option value="cold">Cold Chain Pharma ($15/kg)</option>
                </select>
              </div>

              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={calculatorInsurance}
                  onChange={(e) => setCalculatorInsurance(e.target.checked)}
                  className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-400 accent-orange-500 cursor-pointer"
                />
                <span>Add Full Cargo Insurance (+$25)</span>
              </label>
            </div>

            {/* Total Estimated Box */}
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 text-center flex flex-col justify-center">
              <span className="text-[10px] font-bold uppercase text-orange-800 tracking-wider">Estimated Total Rate</span>
              <span className="text-3xl font-extrabold text-orange-600 font-mono">${estimatedTotal}</span>
              <span className="text-[10px] text-slate-500 mt-0.5">
                {calculatorWeight}kg × ${getRatePerKg()}/kg {calculatorInsurance ? '+ $25 insurance' : ''}
              </span>
            </div>

          </div>

          <div className="text-center pt-2">
            <button
              onClick={handleBookServiceClick}
              className="px-8 py-3.5 bg-orange-gradient hover:bg-orange-600 text-white font-extrabold text-sm rounded-xl shadow-orange-glow transition-all inline-flex items-center space-x-2 cursor-pointer"
            >
              <span>Proceed To Book</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="freight-services-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
        <div className="space-y-12">
          {servicesData.map((service, index) => {
            const IconComp = service.icon;
            const isEven = index % 2 === 0;
            return (
              <div key={service.id} className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-8 rounded-3xl border border-slate-200 shadow-card ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
                
                {/* Details Column */}
                <div className={`lg:col-span-6 space-y-4 ${!isEven ? 'lg:order-2' : ''}`}>
                  <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                    <IconComp className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900">{service.title}</h3>
                  <p className="text-slate-800 font-medium text-sm leading-relaxed">{service.desc}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {service.features.map((feat, i) => (
                      <div key={i} className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleBookServiceClick}
                      className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-orange-sm transition-all inline-flex items-center space-x-1.5 cursor-pointer"
                    >
                      <span>Book This Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Dynamic Image Gallery Column */}
                <div className={`lg:col-span-6 ${!isEven ? 'lg:order-1' : ''}`}>
                  <DynamicServiceGallery images={service.images} title={service.title} />
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* Customs Clearance Spotlight Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4 text-center sm:text-left">
              <span className="text-orange-400 font-bold uppercase text-xs tracking-widest bg-slate-800/90 px-3 py-1 rounded-full border border-slate-700 inline-block">
                Regulatory Compliance & Brokerage
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Customs Clearance Services
              </h3>
              <p className="text-orange-400 font-bold text-sm sm:text-base">
                Smooth Customs Clearance, From Documentation to Delivery
              </p>
              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Simplify customs clearance with documentation support, customs declarations, duty assessment, inspection coordination, compliance support, and cargo release for import and export shipments across Air, Sea, Road, Rail, and Courier.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('customs-clearance');
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center space-x-2 cursor-pointer active:scale-95"
                >
                  <span>Explore Customs Clearance</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleBookServiceClick}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 transition-all cursor-pointer"
                >
                  <span>Request Customs Clearance</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 grid grid-cols-2 gap-3 text-left">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="block text-xl font-black text-orange-400">99.4%</span>
                <span className="text-xs text-slate-300 font-semibold block">First-Pass Release</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="block text-xl font-black text-white">&lt; 24h</span>
                <span className="text-xs text-slate-300 font-semibold block">Port Clearance</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="block text-xl font-black text-white">5 Modes</span>
                <span className="text-xs text-slate-300 font-semibold block">Air, Sea, Road, Rail, Courier</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="block text-xl font-black text-emerald-400">100%</span>
                <span className="text-xs text-slate-300 font-semibold block">AEO Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
