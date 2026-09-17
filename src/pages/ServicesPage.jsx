import React, { useState, useEffect, useRef } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { cargoCategories } from '../components/CargoTypeSelector';
import { 
  Plane, 
  Truck, 
  Ship, 
  Thermometer, 
  ArrowRight, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  Package,
  Layers,
  ShieldCheck,
  Box,
  Compass
} from 'lucide-react';

const DynamicServiceGallery = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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
      <div className="relative group overflow-hidden rounded-2xl border border-slate-200 shadow-md h-80 bg-slate-900">
        <img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${title} view ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-700 ease-in-out transform group-hover:scale-105 animate-fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60"></div>
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
  const { setIsAuthModalOpen, setAuthModalHideClose, isAuthModalOpen, currentUser, setAuthRedirectTab } = useLogistics();

  const [calculatorWeight, setCalculatorWeight] = useState(25);
  const [calculatorService, setCalculatorService] = useState('ground');
  const [calculatorInsurance, setCalculatorInsurance] = useState(false);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState(cargoCategories[0]?.id || 'beverages-food-plants');

  // When page loads, clicking or scrolling the kg button prompts log-in if not signed in
  const [isKgAuthenticated, setIsKgAuthenticated] = useState(false);

  const openLoginModal = () => {
    if (setAuthModalHideClose) {
      setAuthModalHideClose(false);
    }
    if (setIsAuthModalOpen) {
      setIsAuthModalOpen(true);
    }
  };

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
      case 'ground': return 4;
      case 'ftl': return 6;
      case 'express-road': return 8;
      default: return 4;
    }
  };

  const estimatedTotal = (calculatorWeight * getRatePerKg() + (calculatorInsurance ? 25 : 0)).toFixed(2);

  const handleBookServiceClick = () => {
    if (!currentUser) {
      if (setAuthRedirectTab) {
        setAuthRedirectTab('book');
      }
      openLoginModal();
    } else {
      setActiveTab('book');
    }
  };

  const servicesData = [
    {
      id: 'road-transportation',
      anchorId: 'road-transportation',
      tabName: 'Road Transportation',
      title: 'Road Transportation & Land Haulage',
      subtitle: 'Primary Domestic & Cross-Border Highway Corridor Network',
      icon: Truck,
      images: [
        'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80'
      ],
      desc: 'Modern roadway transport fleet equipped with satellite GPS telematics for seamless highway freight and door-to-door road transport across Singapore, ports, and regional expressway gateways.',
      features: [
        'Door-to-door pickup & scheduled drops',
        'Automated AI route optimization',
        'Hydraulic lift-gate vans & lorries available',
        '24/7 driver telemetry feed & live ETA'
      ]
    },
    {
      id: 'ftl-transportation',
      anchorId: 'ftl-transportation',
      tabName: 'FTL Transportation',
      title: 'Full Truckload (FTL) Dedicated Transportation',
      subtitle: 'Exclusive Point-to-Point Bulk Haulage without Intermediate Stops',
      icon: Layers,
      images: [
        '/assets/lorry_24ft_heavy.jpg',
        '/assets/clean_domestic_truck.jpg',
        'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&auto=format&fit=crop&q=80'
      ],
      desc: 'Exclusive full-capacity truckload services for bulk shipments, palletized merchandise, and industrial machinery. Your cargo occupies the entire vehicle, ensuring direct, untranshipped routing with maximum security and the fastest highway transit times.',
      features: [
        'Dedicated 24ft–40ft lorries & prime movers',
        'Direct origin-to-destination non-stop delivery',
        'Up to 24,000 kg payload capacity',
        'Sealed container & anti-tamper security locks'
      ]
    },
    {
      id: 'ltl-transportation',
      anchorId: 'ltl-transportation',
      tabName: 'LTL Transportation',
      title: 'Less-Than-Truckload (LTL) Consolidated Freight',
      subtitle: 'Cost-Optimized Shared Capacity with Scheduled Linehaul Runs',
      icon: Package,
      images: [
        '/assets/vehicle_10ft_lorry.jpg',
        '/assets/lorry_14ft_tailgate.jpg',
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80'
      ],
      desc: 'Economical consolidated road freight for businesses shipping 1 to 10 pallets. Share trailer space while benefiting from computerized manifests, scheduled daily departures, and automated warehouse sorting across our regional hubs.',
      features: [
        'Tiered volumetric and pallet pricing',
        'Daily scheduled linehaul departures',
        'Automated cross-dock sorting & scanning',
        'Individual pallet barcode tracking'
      ]
    },
    {
      id: 'express-delivery',
      anchorId: 'express-delivery',
      tabName: 'Express Delivery',
      title: 'Express Highway & City Delivery',
      subtitle: 'Priority Same-Day Dispatch for Time-Critical Consignments',
      icon: Zap,
      images: [
        '/assets/van_1_7m.jpg',
        '/assets/vehicle_motorbike.jpg',
        '/assets/vehicle_mpv.jpg'
      ],
      desc: 'Rapid express courier and dedicated sprinter dispatch for mission-critical parts, urgent medical samples, legal documentation, and time-sensitive customer orders with guaranteed SLA turnaround.',
      features: [
        'Under 4-hour direct point-to-point delivery',
        'Immediate priority driver dispatch',
        'Real-time minute-by-minute satellite telemetry',
        'Digital Proof-of-Delivery (POD) with signature'
      ]
    },
    {
      id: 'specialized-cargo',
      anchorId: 'specialized-cargo',
      tabName: 'Specialized Cargo',
      title: 'Specialized & Cold Chain Temperature Cargo',
      subtitle: 'Active Thermoregulation (-25°C to +25°C) & High-Care Logistics',
      icon: Thermometer,
      images: [
        '/assets/vehicle_cold_chain.jpg',
        'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80'
      ],
      desc: 'Engineered transport solutions for pharmaceuticals, perishables, and delicate industrial materials. Active climate-controlled reefer vans equipped with dual-probe IoT dataloggers maintain continuous compliance throughout transit.',
      features: [
        'Precise multi-temp control (-25°C to +25°C)',
        'Continuous IoT datalogger temperature reports',
        'GDP pharmaceutical & cold chain certified',
        'Thermal air curtain doors & standby power'
      ]
    }
  ];

  const activeCategory = cargoCategories.find(c => c.id === selectedCategoryTab) || cargoCategories[0];

  return (
    <div className="space-y-20 pb-24">
      
      {/* Header Banner */}
      <section className="bg-[#10182D] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <span className="text-[#FF6B00] font-bold uppercase text-xs tracking-widest bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 inline-flex items-center space-x-1.5">
            <Truck className="w-3.5 h-3.5" />
            <span>Integrated Logistics Services</span>
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight">
            Comprehensive Road & Freight Services
          </h1>
          <p className="text-white/90 font-medium max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            From dedicated full truckload linehaul and consolidated LTL runs to express couriers, specialized cold chain, and customs clearance, Josan Logistics provides premier overland transport with dynamic live telematics.
          </p>

          {/* Quick Sub-Navigation Pills */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            {servicesData.map(s => (
              <a
                key={s.id}
                href={`#${s.anchorId}`}
                className="px-3.5 py-1.5 bg-white/10 hover:bg-orange-500 text-white text-xs font-bold rounded-xl border border-white/10 hover:border-orange-500 transition-all cursor-pointer"
              >
                {s.tabName}
              </a>
            ))}
            <button
              onClick={() => {
                setActiveTab('customs-clearance');
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-orange-500 text-white text-xs font-bold rounded-xl border border-white/10 hover:border-orange-500 transition-all cursor-pointer"
            >
              Customs Clearance
            </button>
            <a
              href="#cargo-types"
              className="px-3.5 py-1.5 bg-white/10 hover:bg-orange-500 text-white text-xs font-bold rounded-xl border border-white/10 hover:border-orange-500 transition-all cursor-pointer"
            >
              Cargo Types
            </a>
          </div>
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
                  <option value="ground">Roadways Freight & Land Haulage ($4/kg)</option>
                  <option value="ftl">Full Truckload (FTL) Dedicated ($6/kg)</option>
                  <option value="express-road">Express Highway Road Courier ($8/kg)</option>
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

      {/* Services Detailed Sections (with IDs corresponding to Navbar Dropdown) */}
      <section id="freight-services-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 scroll-mt-28">
        {servicesData.map((service, index) => {
          const IconComp = service.icon;
          const isEven = index % 2 === 0;
          return (
            <div 
              key={service.id} 
              id={service.anchorId}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-card scroll-mt-28 hover:border-orange-200 transition-all ${
                !isEven ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Details Column */}
              <div className={`lg:col-span-6 space-y-4 ${!isEven ? 'lg:order-2' : ''}`}>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold shadow-sm">
                    <IconComp className="w-6 h-6 stroke-[2]" />
                  </div>
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                    {service.tabName}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{service.title}</h3>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{service.subtitle}</p>
                <p className="text-slate-800 font-medium text-sm sm:text-base leading-relaxed">{service.desc}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {service.features.map((feat, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs sm:text-[13px] font-bold text-slate-900">
                      <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex items-center space-x-3">
                  <button
                    onClick={handleBookServiceClick}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-orange-sm transition-all inline-flex items-center space-x-1.5 cursor-pointer"
                  >
                    <span>Book This Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setActiveTab('quote')}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Get Instant Quote
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
      </section>

      {/* CARGO TYPES SECTION (Interactive Industry Cargo Classification Showcase) */}
      <section id="cargo-types" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-card space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-orange-600 font-bold uppercase text-xs tracking-widest bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200 inline-block">
              Commodity Classification
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Supported Cargo Types & Industries
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Josan Logistics handles over 10 major commercial cargo categories and hundreds of subcategories, with customized securing protocols, temperature logs, and specialized handling equipment.
            </p>
          </div>

          {/* Industry Category Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-100 pb-4">
            {cargoCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryTab(cat.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                    selectedCategoryTab === cat.id
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-50 text-slate-700 hover:bg-orange-50 hover:text-orange-600'
                  }`}
                >
                  <Icon className="w-4 h-4 text-orange-400" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Category Display Box */}
          <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-sm">
                  {React.createElement(activeCategory.icon, { className: 'w-6 h-6' })}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">{activeCategory.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">Approved for Road Transport, FTL, LTL & Cross-Border Delivery</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('quote')}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-orange-sm transition-all inline-flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
              >
                <span>Quote for {activeCategory.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="pt-6">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">
                Accepted Cargo Subcategories:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {activeCategory.subcategories.map((sub, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-3 bg-white rounded-xl border border-slate-200 flex items-center space-x-2.5 text-xs font-bold text-slate-800 shadow-2xs hover:border-orange-300 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
                Roadways Customs Clearance
              </h3>
              <p className="text-orange-400 font-bold text-sm sm:text-base">
                Smooth Overland Customs Clearance, From Documentation to Highway Delivery
              </p>
              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Simplify road freight customs clearance with documentation support, border checkpoint declarations, duty assessment, highway inspection coordination, compliance support, and cargo release for overland roadways freight.
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
                <span className="text-xs text-slate-300 font-semibold block">Border Clearance</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="block text-xl font-black text-white">Roadways</span>
                <span className="text-xs text-slate-300 font-semibold block">Dedicated Overland Service</span>
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
