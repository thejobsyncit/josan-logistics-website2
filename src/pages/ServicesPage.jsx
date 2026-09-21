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
  Compass,
  Lock
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
      <div className="relative group overflow-hidden rounded-2xl border border-slate-200 shadow-md h-80 bg-slate-950 flex items-center justify-center">
        {/* Ambient blurred backdrop for consistent edge filling */}
        <img
          key={`bg-${currentIndex}`}
          src={images[currentIndex]}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-125 opacity-35 pointer-events-none"
        />

        {/* Shrunk, fully uncropped image displaying 100% of the graphic */}
        <img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${title} view ${currentIndex + 1}`}
          className="relative z-1 max-h-full max-w-full object-contain p-2 transition-all duration-500 transform group-hover:scale-[1.02] animate-fade-in drop-shadow-md"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none z-2"></div>
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-orange-500 text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 backdrop-blur-sm cursor-pointer z-10"
          title="Previous Image"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-orange-500 text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 backdrop-blur-sm cursor-pointer z-10"
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
  const { 
    setIsAuthModalOpen, 
    setAuthModalHideClose, 
    isAuthModalOpen, 
    currentUser, 
    setAuthRedirectTab,
    showToast 
  } = useLogistics();

  const [calculatorWeight, setCalculatorWeight] = useState(25);
  const [calculatorService, setCalculatorService] = useState('parcel');
  const [calculatorInsurance, setCalculatorInsurance] = useState(false);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState(cargoCategories[0]?.id || 'beverages-food-plants');

  // Rate calculator: strict customer login and keep price as zero ($0.00)
  const estimatedTotal = "0.00";

  const requireLoginForCalculator = () => {
    if (!currentUser) {
      if (setAuthRedirectTab) setAuthRedirectTab('services');
      if (setAuthModalHideClose) setAuthModalHideClose(false);
      setIsAuthModalOpen(true);
      if (showToast) {
        showToast('Please sign in or create an account to use the freight rate calculator.', 'warning');
      }
      return false;
    }
    return true;
  };

  const handleBookServiceClick = () => {
    if (!currentUser) {
      if (setAuthRedirectTab) {
        setAuthRedirectTab('book');
      }
      if (setAuthModalHideClose) {
        setAuthModalHideClose(false);
      }
      setIsAuthModalOpen(true);
      if (showToast) {
        showToast('Please sign in or create an account to book your shipment.', 'info');
      }
      return;
    }
    setActiveTab('book');
  };

  const servicesData = [
    {
      id: 'parcel-delivery',
      anchorId: 'parcel-delivery',
      tabName: 'Parcel Delivery',
      title: 'Parcel Delivery & Express Courier',
      subtitle: 'Fast, secure door-to-door courier service for small to medium road shipments',
      icon: Package,
      images: [
        '/assets/parcel_delivery_handover.png',
        '/assets/vehicle_motorbike.jpg',
        '/assets/vehicle_mpv.jpg'
      ],
      desc: [
        'Fast and secure door-to-door parcel delivery across Singapore, designed for businesses and individuals who need dependable last-mile logistics.',
        'From documents to retail packages, every delivery is handled with care and real-time visibility.'
      ],
      features: [
        'Same-day and scheduled delivery options',
        'Real-time tracking updates',
        'Electronic proof of delivery (POD)'
      ]
    },
    {
      id: 'bulk-shipment',
      anchorId: 'bulk-shipment',
      tabName: 'Bulk Shipment',
      title: 'Bulk Shipment & Dedicated Truckloads',
      subtitle: 'Full Truckload (FTL) and multi-axle trailers for high-volume commercial freight',
      icon: Layers,
      images: [
        '/assets/bulk_shipment_containers.png',
        '/assets/clean_domestic_truck.jpg',
        'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&auto=format&fit=crop&q=80'
      ],
      desc: 'Exclusive full-capacity truckload transport for bulk goods, palletized industrial cargo, construction materials, and raw commodities. Direct non-stop transit from loading facility to consignee without intermediate handling.',
      features: [
        'Dedicated 24ft to 40ft heavy lorries and prime movers',
        'Up to 24,000 kg payload capacity with sealed containers',
        'Direct point-to-point non-stop highway transport',
        'Weighbridge certification and axle-load compliance'
      ]
    },
    {
      id: 'intra-city-transport',
      anchorId: 'intra-city-transport',
      tabName: 'Intra-city Transport',
      title: 'Intra-city Transport & Metro Delivery',
      subtitle: 'Scheduled local distribution, store replenishment, and multi-drop delivery within the city',
      icon: Truck,
      images: [
        '/assets/intra_city_logistics_route.png',
        '/assets/lorry_14ft_tailgate.jpg',
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80'
      ],
      desc: 'High-frequency metropolitan road delivery connecting local warehouses, retail stores, fulfillment hubs, and residential drop points. Optimized multi-stop delivery routes ensure minimal transit times in urban traffic.',
      features: [
        'Automated AI route optimization for city traffic',
        'Multi-drop scheduling and store restocking',
        'Tailgate-equipped lorries for easy ground loading',
        'Flexible same-day intra-city delivery slots'
      ]
    },
    {
      id: 'inter-city-logistics',
      anchorId: 'inter-city-logistics',
      tabName: 'Inter-city Logistics',
      title: 'Inter-city Logistics & Highway Corridors',
      subtitle: 'Long-haul road freight connecting major industrial hubs, state lines, and regional corridors',
      icon: Compass,
      images: [
        '/assets/inter_city_highway_corridor.png',
        'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80'
      ],
      desc: 'Reliable long-distance linehaul operations across national highway corridors. Operating daily scheduled departures with 24/7 telematics, verified checkpoint clearances, and team driver rotations for uninterrupted road transit.',
      features: [
        'Daily scheduled linehaul departures along major corridors',
        'Real-time GPS telematics and waypoint geofencing',
        'Consolidated LTL and dedicated FTL road options',
        'Inter-state transport documentation and clearance'
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

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            
            {/* Strict Login Required Overlay when not logged in */}
            {!currentUser && (
              <div 
                onClick={requireLoginForCalculator}
                className="absolute inset-0 z-20 bg-slate-950/70 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 text-center text-white cursor-pointer transition-all hover:bg-slate-950/75 animate-fade-in"
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg mb-3">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="text-base font-extrabold text-white">Customer Login Required</h4>
                <p className="text-xs text-slate-300 max-w-xs mt-1 leading-relaxed">
                  Please sign in with your customer account to access the interactive rate estimator.
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    requireLoginForCalculator();
                  }}
                  className="mt-4 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
                >
                  Sign In to Calculate
                </button>
              </div>
            )}

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
                  disabled={!currentUser}
                  onChange={(e) => {
                    if (!requireLoginForCalculator()) return;
                    setCalculatorWeight(Number(e.target.value));
                  }}
                  className="w-full accent-orange-500 cursor-pointer disabled:opacity-40"
                />
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
                  disabled={!currentUser}
                  onChange={(e) => {
                    if (!requireLoginForCalculator()) return;
                    setCalculatorService(e.target.value);
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus-orange cursor-pointer disabled:opacity-40"
                >
                  <option value="parcel">Parcel Delivery</option>
                  <option value="bulk">Bulk Shipment &amp; FTL</option>
                  <option value="intra">Intra-city Transport</option>
                  <option value="inter">Inter-city Logistics</option>
                </select>
              </div>

              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={calculatorInsurance}
                  disabled={!currentUser}
                  onChange={(e) => {
                    if (!requireLoginForCalculator()) return;
                    setCalculatorInsurance(e.target.checked);
                  }}
                  className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-400 accent-orange-500 cursor-pointer disabled:opacity-40"
                />
                <span>Add Full Cargo Insurance</span>
              </label>
            </div>

            {/* Total Estimated Box */}
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 text-center flex flex-col justify-center">
              <span className="text-[10px] font-bold uppercase text-orange-800 tracking-wider">Estimated Total Rate</span>
              <span className="text-3xl font-extrabold text-orange-600 font-mono">${estimatedTotal}</span>
              <span className="text-[10px] text-slate-500 mt-0.5 font-medium">
                $0.00 (Custom quote provided upon booking)
              </span>
            </div>

          </div>

          <div className="text-center pt-2">
            <button
              onClick={handleBookServiceClick}
              className="px-8 py-3.5 bg-orange-gradient hover:bg-orange-600 text-white font-extrabold text-sm rounded-xl shadow-orange-glow transition-all inline-flex items-center space-x-2 cursor-pointer"
            >
              <span>Book Shipment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Services Detailed Sections (with IDs corresponding to Navbar Dropdown) */}
      <section id="road-transportation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 scroll-mt-28">
        <div id="freight-services-grid" className="sr-only" />
          {servicesData.map((service, index) => {
            const IconComp = service.icon;
            const isEven = index % 2 === 0;
            return (
              <div 
                key={service.id} 
                id={service.anchorId}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-card scroll-mt-28 hover:border-orange-200 transition-all relative ${
                  !isEven ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Direct ID Aliases for Navbar Dropdown items */}
                {service.id === 'parcel-delivery' && <div id="express-delivery" className="scroll-mt-28 -top-28 absolute" />}
                {service.id === 'bulk-shipment' && <div id="ftl-transportation" className="scroll-mt-28 -top-28 absolute" />}
                {service.id === 'inter-city-logistics' && <div id="ltl-transportation" className="scroll-mt-28 -top-28 absolute" />}

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
                {Array.isArray(service.desc) ? (
                  <div className="space-y-2">
                    {service.desc.map((para, pIdx) => (
                      <p key={pIdx} className="text-slate-800 font-medium text-sm sm:text-base leading-relaxed">
                        {para}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-800 font-medium text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {service.desc}
                  </p>
                )}
                
                <div className="pt-2 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Key Features:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {service.features.map((feat, i) => (
                      <div key={i} className="flex items-center space-x-2 text-xs sm:text-[13px] font-bold text-slate-900">
                        <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center space-x-3">
                  <button
                    onClick={handleBookServiceClick}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-orange-sm transition-all inline-flex items-center space-x-1.5 cursor-pointer"
                  >
                    <span>Book Shipment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        if (setAuthRedirectTab) setAuthRedirectTab('quote');
                        setIsAuthModalOpen(true);
                        if (showToast) showToast('Please sign in or create an account to get an instant quote.', 'warning');
                        return;
                      }
                      setActiveTab('quote');
                    }}
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
      <section id="cargo-types" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28 relative">
        <div id="specialized-cargo" className="scroll-mt-28 -top-28 absolute" />
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
                onClick={() => {
                  if (!currentUser) {
                    if (setAuthRedirectTab) setAuthRedirectTab('quote');
                    setIsAuthModalOpen(true);
                    if (showToast) showToast('Please sign in or create an account to get an instant quote.', 'warning');
                    return;
                  }
                  setActiveTab('quote');
                }}
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
