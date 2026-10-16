import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  Truck, 
  MapPin, 
  Package, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  DollarSign, 
  Mail, 
  Phone, 
  Building2,
  Lock,
  Scale, 
  Maximize2
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { countryCodesList, getPhoneLength } from '../data/countryCodes';

const CARGO_CLASSIFICATIONS = [
  'General Commercial Goods',
  'Electronics & Technology Components',
  'Industrial Spares & Hardware',
  'Healthcare & Pharmaceutical Supplies',
  'Consumer Retail Products',
  'Commercial Documents & Paperwork',
  'Exhibition & Event Materials',
  'Custom / Specialized Freight'
];

export const QuotePage = ({ setActiveTab }) => {
  const { 
    showToast, 
    currentUser, 
    setIsAuthModalOpen, 
    setAuthRedirectTab, 
    resetShipmentScope, 
    requestQuote, 
    setCustomerSubTab, 
    addLead,
    cargoPricing = [],
    calculateCargoPrice
  } = useLogistics();

  // Strict Authentication Guard
  useEffect(() => {
    if (!currentUser) {
      if (setAuthRedirectTab) setAuthRedirectTab('quote');
      setIsAuthModalOpen(true);
      if (showToast) {
        showToast('Please sign in or create an account to get an instant quote.', 'warning');
      }
      if (setActiveTab) setActiveTab('home');
    }
  }, [currentUser, setActiveTab]);

  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card max-w-md w-full space-y-4">
          <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Customer Login Required</h2>
          <p className="text-xs text-slate-500">
            Please sign in with your customer account to access the instant rate calculator and freight quotation generator.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={() => {
                if (setAuthRedirectTab) setAuthRedirectTab('quote');
                setIsAuthModalOpen(true);
              }}
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
            >
              Sign In to Continue
            </button>
            <button
              onClick={() => setActiveTab && setActiveTab('home')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Form State: Two Registered Business Activities
  const [serviceCategory, setServiceCategory] = useState('documentation'); // 'documentation' | 'road-transport'
  const [roadLoadType, setRoadLoadType] = useState('ltl'); // 'ltl' | 'ftl'

  // Shipment Specifications
  const [cargoWeight, setCargoWeight] = useState(250);
  const [packageCount, setPackageCount] = useState(4);
  const [lengthCm, setLengthCm] = useState(80);
  const [widthCm, setWidthCm] = useState(60);
  const [heightCm, setHeightCm] = useState(50);
  const [cargoCategory, setCargoCategory] = useState('General Commercial Goods');

  // Pickup & Delivery Locations (Simple Road Points)
  const [pickupAddress, setPickupAddress] = useState('10 Tuas South Ave 8, Singapore 637421');
  const [deliveryAddress, setDeliveryAddress] = useState('24 Jurong Port Road, Singapore 619097');

  // Contact State
  const [contactName, setContactName] = useState(currentUser?.name || '');
  const [contactEmail, setContactEmail] = useState(currentUser?.email || '');
  const [contactCompany, setContactCompany] = useState(currentUser?.company || '');

  const parseInitialPhone = (rawPhone) => {
    if (!rawPhone) return { code: '+65', digits: '' };
    const matched = countryCodesList.find(c => rawPhone.startsWith(c.code));
    if (matched) {
      return {
        code: matched.code,
        digits: rawPhone.slice(matched.code.length).replace(/[^0-9]/g, '').slice(0, matched.digits)
      };
    }
    return { code: '+65', digits: rawPhone.replace(/[^0-9]/g, '').slice(0, 8) };
  };

  const [quoteCountryCode, setQuoteCountryCode] = useState(() => parseInitialPhone(currentUser?.phone).code);
  const [quotePhoneDigits, setQuotePhoneDigits] = useState(() => parseInitialPhone(currentUser?.phone).digits);

  useEffect(() => {
    if (currentUser?.phone) {
      const parsed = parseInitialPhone(currentUser.phone);
      setQuoteCountryCode(parsed.code);
      setQuotePhoneDigits(parsed.digits);
    }
    if (currentUser?.name && !contactName) setContactName(currentUser.name);
    if (currentUser?.email && !contactEmail) setContactEmail(currentUser.email);
    if (currentUser?.company && !contactCompany) setContactCompany(currentUser.company);
  }, [currentUser]);

  const handlePhoneDigitsChange = (e) => {
    const cleanDigits = e.target.value.replace(/[^0-9]/g, '').slice(0, getPhoneLength(quoteCountryCode));
    setQuotePhoneDigits(cleanDigits);
  };

  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  // Active Cargo classifications retrieved dynamically from CRM database
  const activeCargoOptions = useMemo(() => {
    const active = (cargoPricing || []).filter(c => c.active);
    return active.length > 0 ? active : [
      { id: 'cargo-gen-01', name: 'General Cargo', basePricePerKg: 3.50 }
    ];
  }, [cargoPricing]);

  // Volumetric & Chargeable Weight Calculations
  const parsedActualWeight = Math.max(0, parseFloat(cargoWeight) || 0);
  const parsedPackages = Math.max(1, parseInt(packageCount) || 1);
  const parsedL = Math.max(0, parseFloat(lengthCm) || 0);
  const parsedW = Math.max(0, parseFloat(widthCm) || 0);
  const parsedH = Math.max(0, parseFloat(heightCm) || 0);

  const volumetricWeight = useMemo(() => {
    return Number(((parsedL * parsedW * parsedH * parsedPackages) / 5000).toFixed(2));
  }, [parsedL, parsedW, parsedH, parsedPackages]);

  const chargeableWeight = serviceCategory === 'road-transport'
    ? Math.max(parsedActualWeight, volumetricWeight)
    : parsedActualWeight;

  // Live Dynamic Pricing from CRM Cargo & Pricing module:
  // Formula: Weight × Applicable Price/KG = Estimated Cargo Charge (using matching tier slab or min charge)
  const dynamicPricing = useMemo(() => {
    if (calculateCargoPrice) {
      return calculateCargoPrice(cargoCategory, chargeableWeight);
    }
    return {
      pricePerKg: 3.50,
      estimatedCargoCharge: Number((chargeableWeight * 3.50).toFixed(2)),
      appliedSlab: null,
      isMinChargeApplied: false,
      minimumCharge: 50
    };
  }, [cargoCategory, chargeableWeight, calculateCargoPrice]);

  const getRatePerKg = () => {
    return dynamicPricing.pricePerKg;
  };

  // Base Rate Computation
  const baseRateCost = useMemo(() => {
    if (serviceCategory === 'documentation') {
      const docItem = cargoPricing.find(c => c.category === 'Documents' || c.name.toLowerCase().includes('document'));
      return docItem ? Math.max(docItem.minimumCharge || 50, Number((docItem.basePricePerKg * 25).toFixed(2))) : 120.00;
    }
    return dynamicPricing.estimatedCargoCharge;
  }, [serviceCategory, dynamicPricing, cargoPricing]);

  const subtotal = baseRateCost.toFixed(2);
  const gst = (parseFloat(subtotal) * 0.09).toFixed(2);
  const grandTotal = (parseFloat(subtotal) + parseFloat(gst)).toFixed(2);

  const handleQuoteSubmit = (e) => {
    e.preventDefault();

    if (serviceCategory === 'road-transport' && (!cargoWeight || parseFloat(cargoWeight) <= 0)) {
      if (showToast) {
        showToast('Please enter a valid cargo weight in kg.', 'warning');
      }
      return;
    }

    if (!pickupAddress.trim()) {
      if (showToast) showToast('Please enter a pickup address.', 'warning');
      return;
    }

    if (!deliveryAddress.trim()) {
      if (showToast) showToast('Please enter a delivery address.', 'warning');
      return;
    }

    const maxDigits = getPhoneLength(quoteCountryCode);
    const minDigits = Math.max(6, maxDigits - 1);
    if (!quotePhoneDigits || quotePhoneDigits.length < minDigits) {
      if (showToast) {
        showToast(`Please enter a valid ${maxDigits}-digit phone number (numbers only).`, 'warning');
      }
      return;
    }

    const fullContactPhone = `${quoteCountryCode} ${quotePhoneDigits}`.trim();

    if (addLead) {
      addLead({
        name: contactName || 'Prospective Client',
        company: contactCompany || 'Website Quote Inquiry',
        email: contactEmail || '',
        phone: fullContactPhone,
        source: 'Website Quote Form',
        stage: 'Quote Sent',
        estimatedValue: parseFloat(grandTotal) || 0,
        tags: [
          'Website Quote',
          serviceCategory === 'documentation' ? 'DOCUMENTATION_SUPPORT' : `ROAD_TRANSPORT_${roadLoadType.toUpperCase()}`,
          cargoCategory
        ].filter(Boolean)
      });
    }

    const quotePayload = {
      serviceCategory,
      roadLoadType: serviceCategory === 'road-transport' ? roadLoadType : null,
      cargoWeight: parsedActualWeight,
      chargeableWeight,
      packageCount: parsedPackages,
      dimensions: `${parsedL}x${parsedW}x${parsedH} cm`,
      cargoCategory,
      originAddress: pickupAddress,
      destinationAddress: deliveryAddress,
      contactName,
      contactEmail,
      contactCompany,
      contactPhone: fullContactPhone,
      subtotal,
      gst,
      grandTotal
    };

    if (requestQuote) {
      const newQuote = requestQuote(quotePayload);
      const refId = newQuote?.id || `QTE-${Math.floor(10000 + Math.random() * 90000)}`;
      setGeneratedQuoteRef(refId);
      setQuoteSubmitted(true);
    } else {
      const refId = `QTE-${Math.floor(10000 + Math.random() * 90000)}`;
      setGeneratedQuoteRef(refId);
      setQuoteSubmitted(true);
      if (showToast) {
        showToast(`Quotation #${refId} generated successfully!`, 'success');
      }
    }
  };

  const handleProceedToBooking = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    if (resetShipmentScope) resetShipmentScope();
    setActiveTab('book');
  };

  const handleViewInCustomerPortal = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    if (setCustomerSubTab) setCustomerSubTab('quotes');
    setActiveTab('customer');
  };

  return (
    <div className="space-y-16 pb-24">
      {/* Header Banner with Organic Curve Transition */}
      <section className="relative bg-[#0B1F3A] text-white pt-14 pb-26 sm:pt-16 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-[#F26B21]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center space-y-3 relative z-10">
          <span className="text-white font-bold uppercase text-xs tracking-widest bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 inline-flex items-center space-x-1.5 backdrop-blur-xs">
            <Calculator className="w-3.5 h-3.5 text-[#B6C2D1]" />
            <span>Instant Service Quotation</span>
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight">
            Get an Instant Service Quote
          </h1>
          <p className="text-[#B6C2D1] font-medium max-w-xl mx-auto text-xs sm:text-sm leading-relaxed">
            Transparent estimates for freight documentation coordination and third-party commercial road transport.
          </p>
        </div>

        {/* Layered Organic Wave Transition merging into the white background */}
        <div className="absolute -bottom-px left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-10">
          <svg 
            className="relative block w-full h-10 sm:h-14 lg:h-20" 
            viewBox="0 0 1440 100" 
            fill="none" 
            preserveAspectRatio="none"
          >
            <path 
              d="M0,45 C380,95 720,90 1080,45 C1240,25 1360,20 1440,15 L1440,100 L0,100 Z" 
              fill="rgba(255, 255, 255, 0.15)" 
            />
            <path 
              d="M0,25 C320,85 720,95 1120,55 C1260,40 1370,25 1440,15 L1440,100 L0,100 Z" 
              fill="#FFFFFF" 
            />
          </svg>
        </div>
      </section>

      {/* Main Quote Calculator & Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left 7 Columns: Interactive Configuration Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Shipment Specifications</h2>
              <p className="text-xs text-slate-500 font-semibold">Select your service type, locations, cargo details, and contact information.</p>
            </div>

            <form onSubmit={handleQuoteSubmit} className="space-y-6 text-xs">
              
              {/* 1. Select Freight Service Type (Two Registered Categories) */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  1. Select Freight Service Type *
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Category 1: Documentation Support */}
                  <button
                    type="button"
                    onClick={() => setServiceCategory('documentation')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                      serviceCategory === 'documentation'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className={`w-4 h-4 ${serviceCategory === 'documentation' ? 'text-white' : 'text-blue-600'}`} />
                        <span className="font-extrabold text-sm block">Documentation Support</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        serviceCategory === 'documentation' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700'
                      }`}>
                        Primary Activity
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${
                      serviceCategory === 'documentation' ? 'text-blue-100' : 'text-slate-500'
                    }`}>
                      AWB preparation, billing calculation, shipment documentation & customs paperwork coordination.
                    </p>
                    <span className={`text-xs font-mono font-bold pt-1 inline-block ${
                      serviceCategory === 'documentation' ? 'text-white' : 'text-blue-600'
                    }`}>
                      From $120.00 / shipment
                    </span>
                  </button>

                  {/* Category 2: Road Transportation Coordination */}
                  <button
                    type="button"
                    onClick={() => setServiceCategory('road-transport')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                      serviceCategory === 'road-transport'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <Truck className={`w-4 h-4 ${serviceCategory === 'road-transport' ? 'text-orange-400' : 'text-slate-700'}`} />
                        <span className="font-extrabold text-sm block">Road Transportation Coordination</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        serviceCategory === 'road-transport' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        Partner Network
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${
                      serviceCategory === 'road-transport' ? 'text-slate-200' : 'text-slate-500'
                    }`}>
                      Arranging road freight (FTL, LTL) from origin to destination via authorized transport partners.
                    </p>
                    <span className={`text-xs font-mono font-bold pt-1 inline-block ${
                      serviceCategory === 'road-transport' ? 'text-orange-400' : 'text-slate-900'
                    }`}>
                      From $3.80 / kg
                    </span>
                  </button>
                </div>

                {/* Road Transport Sub-options (FTL / LTL) */}
                {serviceCategory === 'road-transport' && (
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 animate-fade-in">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
                      Road Load Arrangement
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRoadLoadType('ltl')}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          roadLoadType === 'ltl'
                            ? 'bg-white border-orange-500 shadow-xs ring-1 ring-orange-500'
                            : 'bg-white/60 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="font-bold text-xs text-slate-900 block">LTL — Less Than Truckload</span>
                        <span className="text-[10px] text-slate-500 block">Consolidated commercial road freight</span>
                        <span className="text-[11px] font-mono font-bold text-orange-600 block mt-1">From $3.80 / kg</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRoadLoadType('ftl')}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          roadLoadType === 'ftl'
                            ? 'bg-white border-orange-500 shadow-xs ring-1 ring-orange-500'
                            : 'bg-white/60 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="font-bold text-xs text-slate-900 block">FTL — Full Truckload</span>
                        <span className="text-[10px] text-slate-500 block">Dedicated partner vehicle coordination</span>
                        <span className="text-[11px] font-mono font-bold text-orange-600 block mt-1">From $5.50 / kg</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Pickup & Delivery Locations (Simple Road Points) */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    2. Pickup & Delivery Locations *
                  </label>
                  <p className="text-[11px] text-slate-500 font-medium">Commercial pickup and delivery points for transport coordination.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-600" />
                      <span>Pickup Address / Location *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      placeholder="e.g. 10 Tuas South Ave 8, Singapore 637421"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-orange-500 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Delivery Address / Location *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="e.g. 24 Jurong Port Road, Singapore 619097"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Shipment Specifications */}
              <div className="space-y-3 pt-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  3. Shipment Specifications
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Cargo Classification
                    </label>
                    <select
                      value={cargoCategory}
                      onChange={(e) => setCargoCategory(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-orange-500 cursor-pointer shadow-2xs"
                    >
                      {activeCargoOptions.map(c => (
                        <option key={c.id} value={c.name}>
                          {c.name} (S$ {Number(c.basePricePerKg).toFixed(2)}/kg)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Number of Packages / Cartons *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        required
                        value={packageCount}
                        onChange={(e) => setPackageCount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-orange-500 pr-12 shadow-2xs"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                        pkgs
                      </span>
                    </div>
                  </div>
                </div>

                {/* Weight & Dimensions */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Maximize2 className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-bold uppercase text-slate-800 tracking-wide">
                      Weight & Package Dimensions
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Gross Weight (kg) *
                      </label>
                      <input
                        type="number"
                        min="0.5"
                        step="any"
                        required
                        value={cargoWeight}
                        onChange={(e) => setCargoWeight(e.target.value)}
                        placeholder="e.g. 250"
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 text-xs focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Length (cm)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={lengthCm}
                        onChange={(e) => setLengthCm(e.target.value)}
                        placeholder="80"
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 text-xs focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Width (cm)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={widthCm}
                        onChange={(e) => setWidthCm(e.target.value)}
                        placeholder="60"
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 text-xs focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={heightCm}
                        onChange={(e) => setHeightCm(e.target.value)}
                        placeholder="50"
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 text-xs focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  {/* Chargeable Weight calculation for Road Transport */}
                  {serviceCategory === 'road-transport' && (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <Scale className="w-4 h-4 text-orange-600" />
                        <div>
                          <span className="font-bold text-slate-900 text-xs block">Chargeable Weight (Billable)</span>
                          <span className="text-[10px] text-slate-500">
                            Higher of Gross Weight ({parsedActualWeight} kg) or Volumetric Weight ({volumetricWeight} kg)
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-sm font-extrabold text-orange-700 bg-orange-50 px-3 py-1 rounded-lg border border-orange-200 inline-block">
                          {chargeableWeight.toFixed(2)} kg
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 4. Contact & Company Information */}
              <div className="space-y-3 pt-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  4. Contact & Company Information
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Contact Name *</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Corporate Email *</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={contactCompany}
                      onChange={(e) => setContactCompany(e.target.value)}
                      placeholder="e.g. Apex Commercial Logistics Pte Ltd"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1 flex items-center justify-between">
                      <span>Phone Number *</span>
                      <span className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">Digits only</span>
                    </label>
                    <div className="flex items-center">
                      <select
                        value={quoteCountryCode}
                        onChange={(e) => {
                          const newCode = e.target.value;
                          setQuoteCountryCode(newCode);
                          setQuotePhoneDigits(prev => prev.slice(0, getPhoneLength(newCode)));
                        }}
                        className="p-2.5 bg-slate-100 border border-slate-300 rounded-l-xl text-slate-900 font-extrabold text-xs shrink-0 cursor-pointer border-r-0 focus:outline-none"
                      >
                        {countryCodesList.map((item) => (
                          <option key={item.code} value={item.code}>
                            {item.flag} {item.code} ({item.country})
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        required
                        maxLength={getPhoneLength(quoteCountryCode)}
                        value={quotePhoneDigits}
                        onChange={handlePhoneDigitsChange}
                        onKeyDown={(e) => {
                          const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'];
                          if (!allowed.includes(e.key) && !/^[0-9]$/.test(e.key) && !e.ctrlKey && !e.metaKey) {
                            e.preventDefault();
                          }
                        }}
                        placeholder={`e.g. ${'9'.repeat(getPhoneLength(quoteCountryCode))}`}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-r-xl font-mono font-bold text-slate-900 text-xs focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#F26B21] hover:bg-[#D95A13] text-white rounded-xl font-extrabold text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate Official Freight Quotation</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right 5 Columns: Price Breakdown & Quote Confirmation Card */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            <div className="bg-[#0B1F3A] text-white rounded-3xl p-6 sm:p-8 border border-[#1E3A5F] shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#B6C2D1]">
                    Live Rate Computation
                  </span>
                  <h3 className="text-xl font-extrabold text-white">Quotation Breakdown</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 text-white border border-white/20 flex items-center justify-center font-bold">
                  <DollarSign className="w-5 h-5 text-[#B6C2D1]" />
                </div>
              </div>

              {/* Route & Service Summary */}
              <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl space-y-1.5 text-xs">
                <div className="flex items-center space-x-2 text-slate-300 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span className="truncate">Pickup: {pickupAddress || 'Address not specified'}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">Delivery: {deliveryAddress || 'Address not specified'}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[11px] text-slate-400">
                  <span>
                    Service: {serviceCategory === 'documentation' 
                      ? 'Documentation Support' 
                      : `Road Transport (${roadLoadType.toUpperCase()})`}
                  </span>
                  <span>{packageCount} Packages</span>
                </div>
              </div>

              {/* Itemized Line Items */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Gross Weight:</span>
                  <span className="font-mono text-slate-200">{parsedActualWeight} kg</span>
                </div>

                {serviceCategory === 'road-transport' && (
                  <>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Volumetric Weight:</span>
                      <span className="font-mono text-slate-200">{volumetricWeight} kg</span>
                    </div>

                    <div className="flex justify-between items-center text-orange-300 font-bold bg-orange-950/40 border border-orange-800/40 px-2 py-1 rounded-lg">
                      <span>Chargeable Weight:</span>
                      <span className="font-mono">{chargeableWeight.toFixed(2)} kg</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-300">
                      <span>Rate ({cargoCategory}):</span>
                      <span className="font-mono font-bold text-orange-400">S$ {dynamicPricing.pricePerKg.toFixed(2)}/kg</span>
                    </div>

                    {dynamicPricing.appliedSlab && (
                      <div className="flex justify-between items-center text-slate-400 text-[11px]">
                        <span>Applied Tier Slab:</span>
                        <span className="font-mono text-slate-300">{dynamicPricing.appliedSlab.minWeight} - {dynamicPricing.appliedSlab.maxWeight} kg</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-slate-300">
                      <div>
                        <span>Estimated Cargo Charge:</span>
                        {dynamicPricing.isMinChargeApplied && (
                          <span className="text-[10px] text-amber-400 block font-medium">Min. S$ {dynamicPricing.minimumCharge} applied</span>
                        )}
                      </div>
                      <span className="font-mono font-bold text-white">S$ {baseRateCost.toFixed(2)}</span>
                    </div>
                  </>
                )}

                {serviceCategory === 'documentation' && (
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Base Rate (Documentation & Paperwork):</span>
                    <span className="font-mono font-bold text-white">S$ {baseRateCost.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-slate-400 pt-2 border-t border-slate-700">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold text-slate-200">S$ {subtotal}</span>
                </div>

                <div className="flex justify-between items-center text-slate-400">
                  <span>Singapore GST (9%):</span>
                  <span className="font-mono font-semibold text-slate-200">S$ {gst}</span>
                </div>

                <div className="flex justify-between items-center text-white pt-3 border-t border-slate-600 font-extrabold">
                  <span className="text-sm">Estimated Total Rate:</span>
                  <span className="font-mono text-2xl text-[#FF6B00] font-black">S$ {grandTotal}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-3">
                <button
                  type="button"
                  onClick={handleProceedToBooking}
                  className="w-full py-3.5 bg-[#FF6B00] hover:bg-[#E55C00] text-white rounded-xl font-semibold text-sm shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                >
                  <span>Book This Shipment Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-slate-400 text-center font-medium">
                  Quotations are valid for 14 days. Covers documentation coordination and third-party commercial road transport arrangement.
                </p>
              </div>

              {/* Quote Submitted Success Box */}
              {quoteSubmitted && (
                <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-xs text-emerald-200 space-y-3 animate-fade-in">
                  <div className="flex items-center space-x-2 font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Quote Request #{generatedQuoteRef} Dispatched!</span>
                  </div>
                  <p className="text-[11px] text-emerald-300/80">
                    Your quotation request has been recorded. Our coordination desk will review the documentation and transport route.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleViewInCustomerPortal}
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs text-center transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View in Customer Portal</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleProceedToBooking}
                      className="flex-1 py-2 px-3 bg-[#FF6B00] hover:bg-[#E55C00] text-white rounded-xl font-bold text-xs text-center transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <span>Proceed to Booking</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
