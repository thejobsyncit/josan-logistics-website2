import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  Truck, 
  MapPin, 
  Package, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Clock, 
  DollarSign, 
  Layers, 
  Mail, 
  Phone, 
  Building2,
  Sparkles,
  Lock,
  Plane,
  Box,
  Scale,
  Maximize2
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { cargoCategories, airFreightCargoTypes } from '../components/CargoTypeSelector';
import { countryCodesList, getPhoneLength } from '../data/countryCodes';

export const QuotePage = ({ setActiveTab }) => {
  const { showToast, currentUser, setIsAuthModalOpen, setAuthRedirectTab, resetShipmentScope, requestQuote, setCustomerSubTab, addLead } = useLogistics();

  // Strict Authentication Guard: Never allow unauthenticated visitors to view the quote generator
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

  // Form State - Air Freight as Primary Default
  const [freightMode, setFreightMode] = useState('express-air');
  const [transportCategory, setTransportCategory] = useState('air'); // 'air' | 'road'
  const [cargoWeight, setCargoWeight] = useState(250);
  const [packageCount, setPackageCount] = useState(4);
  const [lengthCm, setLengthCm] = useState(80);
  const [widthCm, setWidthCm] = useState(60);
  const [heightCm, setHeightCm] = useState(50);
  const [pickupDeliveryOption, setPickupDeliveryOption] = useState('airport-to-airport');
  const [cargoCategory, setCargoCategory] = useState('General Cargo');
  const [originZone, setOriginZone] = useState('Singapore Changi Cargo Hub (SIN)');
  const [destinationZone, setDestinationZone] = useState('Hong Kong International Cargo Terminal (HKG)');
  const [tailgateRequired, setTailgateRequired] = useState(false);
  const [insuranceRequired, setInsuranceRequired] = useState(true);
  const [declaredValue, setDeclaredValue] = useState(15000);
  const [deliverySpeed, setDeliverySpeed] = useState('standard');

  // Contact State
  const [contactName, setContactName] = useState(currentUser?.name || '');
  const [contactEmail, setContactEmail] = useState(currentUser?.email || '');
  const [contactCompany, setContactCompany] = useState(currentUser?.company || '');

  // Helper to extract country code and clean numeric digits
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
    // Strictly filter out any alphabets, whitespace, and special characters
    const cleanDigits = e.target.value.replace(/[^0-9]/g, '').slice(0, getPhoneLength(quoteCountryCode));
    setQuotePhoneDigits(cleanDigits);
  };

  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [generatedQuoteRef, setGeneratedQuoteRef] = useState('');

  // Rate Matrix
  const getRatePerKg = () => {
    switch (freightMode) {
      case 'express-air': return 12.50;
      case 'standard-air': return 7.80;
      case 'temp-air': return 14.20;
      case 'charter-air': return 9.50;
      case 'ftl': return 5.50;
      case 'ltl': return 3.80;
      case 'reefer': return 6.50;
      case 'customs': return 4.20;
      default: return 7.80;
    }
  };

  const getSpeedMultiplier = () => {
    return deliverySpeed === 'express' ? 1.35 : 1.0;
  };

  // Volumetric & Chargeable Weight Calculations
  const parsedActualWeight = Math.max(0, parseFloat(cargoWeight) || 0);
  const parsedPackages = Math.max(1, parseInt(packageCount) || 1);
  const parsedL = Math.max(0, parseFloat(lengthCm) || 0);
  const parsedW = Math.max(0, parseFloat(widthCm) || 0);
  const parsedH = Math.max(0, parseFloat(heightCm) || 0);

  // International Air IATA Volumetric standard: (L x W x H in cm * Packages) / 6000
  const volumetricWeight = useMemo(() => {
    return Number(((parsedL * parsedW * parsedH * parsedPackages) / 6000).toFixed(2));
  }, [parsedL, parsedW, parsedH, parsedPackages]);

  // In Air Freight, Chargeable Weight is max of gross weight or volumetric weight
  const isAirMode = freightMode.includes('air');
  const chargeableWeight = isAirMode 
    ? Math.max(parsedActualWeight, volumetricWeight) 
    : parsedActualWeight;

  const baseFreightCost = (chargeableWeight * getRatePerKg() * getSpeedMultiplier()).toFixed(2);
  const tailgateCost = tailgateRequired ? 35.00 : 0.00;
  const insuranceCost = insuranceRequired ? Math.max(25, declaredValue * 0.004).toFixed(2) : '0.00';
  const customsFee = freightMode === 'customs' ? 120.00 : 0.00;
  const pickupDeliveryFee = pickupDeliveryOption === 'door-to-door' ? 95.00 
    : (pickupDeliveryOption === 'door-to-airport' || pickupDeliveryOption === 'airport-to-door') ? 50.00 
    : 0.00;

  const subtotal = (
    parseFloat(baseFreightCost) + 
    tailgateCost + 
    parseFloat(insuranceCost) + 
    customsFee +
    pickupDeliveryFee
  ).toFixed(2);
  const gst = (parseFloat(subtotal) * 0.09).toFixed(2);
  const grandTotal = (parseFloat(subtotal) + parseFloat(gst)).toFixed(2);

  const handleQuoteSubmit = (e) => {
    e.preventDefault();

    if (!cargoWeight || parseFloat(cargoWeight) <= 0) {
      if (showToast) {
        showToast('Please enter a valid cargo weight in kg.', 'warning');
      }
      return;
    }

    // Strict phone number validation: digits only and minimum length
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
        name: contactName || 'Prospective Shipper',
        company: contactCompany || (contactName ? `${contactName} Logistics` : 'Website Quote Inquiry'),
        email: contactEmail || '',
        phone: fullContactPhone,
        source: 'Website Quote Form',
        stage: 'Quote Sent',
        estimatedValue: parseFloat(grandTotal) || 0,
        tags: [
          'Website Quote',
          freightMode ? freightMode.toUpperCase() : 'AIR',
          cargoCategory
        ].filter(Boolean)
      });
    }

    if (requestQuote) {
      const newQuote = requestQuote({
        freightMode,
        cargoWeight: parsedActualWeight,
        chargeableWeight,
        packageCount: parsedPackages,
        dimensions: `${parsedL}x${parsedW}x${parsedH} cm`,
        pickupDeliveryOption,
        cargoCategory,
        originZone,
        destinationZone,
        tailgateRequired,
        insuranceRequired,
        declaredValue,
        deliverySpeed,
        contactName,
        contactEmail,
        contactCompany,
        contactPhone: fullContactPhone,
        specialInstructions
      });
      const refId = newQuote?.id || `QTE-${Math.floor(10000 + Math.random() * 90000)}-AIR`;
      setGeneratedQuoteRef(refId);
      setQuoteSubmitted(true);
    } else {
      const refId = `QTE-${Math.floor(10000 + Math.random() * 90000)}-AIR`;
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
      {/* Header Banner */}
      <section className="bg-[#10182D] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <span className="text-[#FF6B00] font-bold uppercase text-xs tracking-widest bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 inline-flex items-center space-x-1.5">
            <Plane className="w-3.5 h-3.5" />
            <span>Air Freight Rate Calculator & Quotation</span>
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight">
            Get an Instant Freight Quote
          </h1>
          <p className="text-white/90 font-medium max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Obtain immediate transparent pricing for international air cargo with volumetric weight analysis, standard air freight, cross-border road logistics, and customs documentation.
          </p>
        </div>
      </section>

      {/* Main Quote Calculator & Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left 7 Columns: Interactive Configuration Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Shipment Specifications</h2>
              <p className="text-xs text-slate-500 font-semibold">Select your freight mode, cargo dimensions, weight, and delivery route.</p>
            </div>

            <form onSubmit={handleQuoteSubmit} className="space-y-6 text-xs">
              {/* Freight Mode Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    1. Select Freight Service Type *
                  </label>
                  <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">
                    Air Freight Primary
                  </span>
                </div>
                
                {/* Air Freight Services (Primary) */}
                <div className="mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    ✈️ Air Freight Services
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'express-air', label: 'Express Air', sub: 'Next Flight Out', rate: '$12.50/kg' },
                      { id: 'standard-air', label: 'Standard Air', sub: 'Consolidation', rate: '$7.80/kg' },
                      { id: 'temp-air', label: 'Pharma / Reefer Air', sub: 'Cold Chain Pallet', rate: '$14.20/kg' },
                      { id: 'charter-air', label: 'Airport-to-Airport', sub: 'Scheduled Cargo', rate: '$9.50/kg' }
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => {
                          setFreightMode(mode.id);
                          setTransportCategory('air');
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          freightMode === mode.id
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <div>
                          <span className="font-extrabold text-[11px] block">{mode.label}</span>
                          <span className={`text-[9px] block mt-0.5 ${freightMode === mode.id ? 'text-blue-100' : 'text-slate-500'}`}>
                            {mode.sub}
                          </span>
                        </div>
                        <span className={`text-[10px] font-mono font-bold mt-1.5 inline-block ${freightMode === mode.id ? 'text-white' : 'text-blue-600'}`}>
                          From {mode.rate}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Road & Customs Services (Secondary & Supporting) */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    🚚 Road Freight & Brokerage Services
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'ftl', label: 'Road FTL', sub: 'Dedicated lorry', rate: '$5.50/kg' },
                      { id: 'ltl', label: 'Road LTL', sub: 'Consolidation', rate: '$3.80/kg' },
                      { id: 'reefer', label: 'Reefer Truck', sub: 'Chilled & Frozen', rate: '$6.50/kg' },
                      { id: 'customs', label: 'Customs Clearance', sub: 'TradeNet + Permit', rate: '$4.20/kg' }
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => {
                          setFreightMode(mode.id);
                          setTransportCategory('road');
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          freightMode === mode.id
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <div>
                          <span className="font-extrabold text-[11px] block">{mode.label}</span>
                          <span className={`text-[9px] block mt-0.5 ${freightMode === mode.id ? 'text-slate-200' : 'text-slate-500'}`}>
                            {mode.sub}
                          </span>
                        </div>
                        <span className={`text-[10px] font-mono font-bold mt-1.5 inline-block ${freightMode === mode.id ? 'text-orange-400' : 'text-slate-700'}`}>
                          From {mode.rate}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Origin and Destination */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>Origin / Departure Hub *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={originZone}
                    onChange={(e) => setOriginZone(e.target.value)}
                    placeholder="e.g. Singapore Changi Cargo Hub (SIN)"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Destination / Arrival Hub *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={destinationZone}
                    onChange={(e) => setDestinationZone(e.target.value)}
                    placeholder="e.g. Hong Kong Cargo Terminal (HKG)"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Cargo Classification & Number of Packages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Cargo Classification (IATA/General)
                  </label>
                  <select
                    value={cargoCategory}
                    onChange={(e) => setCargoCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {airFreightCargoTypes.map(c => (
                      <option key={c.id} value={c.name}>{c.name} — {c.desc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center justify-between">
                    <span>Number of Packages / Cartons *</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      required
                      value={packageCount}
                      onChange={(e) => setPackageCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 pr-12"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                      pkgs
                    </span>
                  </div>
                </div>
              </div>

              {/* Weight & Dimensions (Crucial for Air Freight Volumetric Calculation) */}
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Maximize2 className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-black uppercase text-blue-900 tracking-wide">
                      Weight & Package Dimensions
                    </span>
                  </div>
                  <span className="text-[10px] text-blue-700 font-semibold bg-blue-100 px-2.5 py-0.5 rounded-full">
                    IATA Ratio: 1:6000
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
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 text-xs focus:ring-2 focus:ring-blue-500"
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
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 text-xs focus:ring-2 focus:ring-blue-500"
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
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 text-xs focus:ring-2 focus:ring-blue-500"
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
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Highlighted Chargeable Weight Display */}
                <div className="p-3 bg-white rounded-xl border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <Scale className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">Chargeable Weight (Billable)</span>
                      <span className="text-[10px] text-slate-500">
                        Higher of Gross Weight ({parsedActualWeight} kg) or Volumetric Weight ({volumetricWeight} kg)
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-base font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200 inline-block">
                      {chargeableWeight.toFixed(2)} kg
                    </span>
                  </div>
                </div>
              </div>

              {/* Pickup / Delivery Options & Addons */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="block text-[11px] font-black uppercase text-slate-500 tracking-wider">
                  Pickup & Delivery Handling
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'airport-to-airport', label: 'Airport-to-Airport', fee: 'Included' },
                    { id: 'door-to-airport', label: 'Door-to-Airport', fee: '+S$50' },
                    { id: 'airport-to-door', label: 'Airport-to-Door', fee: '+S$50' },
                    { id: 'door-to-door', label: 'Door-to-Door', fee: '+S$95' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPickupDeliveryOption(opt.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        pickupDeliveryOption === opt.id
                          ? 'bg-slate-900 text-white border-slate-900 font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-[11px] block">{opt.label}</span>
                      <span className="text-[9px] text-blue-500 font-semibold">{opt.fee}</span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={insuranceRequired}
                      onChange={(e) => setInsuranceRequired(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-400 accent-blue-600"
                    />
                    <span className="font-bold text-slate-800">IATA Air Cargo All-Risk Insurance</span>
                  </label>

                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tailgateRequired}
                      onChange={(e) => setTailgateRequired(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-400 accent-blue-600"
                    />
                    <span className="font-bold text-slate-800">Hydraulic Tailgate for Ground Leg (+S$35)</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Declared Cargo Value (S$)</label>
                    <input
                      type="number"
                      value={declaredValue}
                      onChange={(e) => setDeclaredValue(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Flight Routing Speed</label>
                    <select
                      value={deliverySpeed}
                      onChange={(e) => setDeliverySpeed(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 cursor-pointer"
                    >
                      <option value="standard">Standard Scheduled Air Routing (24-48h SLA)</option>
                      <option value="express">Priority Next Flight Out Express (&lt;24h SLA +35%)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="space-y-3 pt-2">
                <span className="block text-xs font-bold text-slate-700 uppercase">
                  2. Contact & Company Information
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Contact Name *</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
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
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={contactCompany}
                      onChange={(e) => setContactCompany(e.target.value)}
                      placeholder="e.g. Apex Global Trading Pte Ltd"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1 flex items-center justify-between">
                      <span>Phone Number *</span>
                      <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Digits only</span>
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

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold text-sm shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate Official Freight Quotation</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right 5 Columns: Price Breakdown & Quote Confirmation Card */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">
                    Live Rate Computation
                  </span>
                  <h3 className="text-xl font-extrabold text-white">Quotation Breakdown</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>

              {/* Route Summary */}
              <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl space-y-1.5 text-xs">
                <div className="flex items-center space-x-2 text-slate-300 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">Origin: {originZone}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">Destination: {destinationZone}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[11px] text-slate-400">
                  <span>Routing: {pickupDeliveryOption.replace(/-/g, ' ').toUpperCase()}</span>
                  <span>{packageCount} Packages</span>
                </div>
              </div>

              {/* Itemized Line Items */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Gross Weight:</span>
                  <span className="font-mono text-slate-200">{parsedActualWeight} kg</span>
                </div>

                <div className="flex justify-between items-center text-slate-300">
                  <span>Volumetric Weight:</span>
                  <span className="font-mono text-slate-200">{volumetricWeight} kg</span>
                </div>

                <div className="flex justify-between items-center text-blue-300 font-bold bg-blue-900/30 px-2 py-1 rounded-lg">
                  <span>Chargeable Weight:</span>
                  <span className="font-mono">{chargeableWeight.toFixed(2)} kg</span>
                </div>

                <div className="flex justify-between items-center text-slate-300">
                  <span>Base Freight ({chargeableWeight.toFixed(2)}kg × ${getRatePerKg()}/kg):</span>
                  <span className="font-mono font-bold text-white">S$ {baseFreightCost}</span>
                </div>

                {pickupDeliveryFee > 0 && (
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Pickup / Ground Delivery Leg:</span>
                    <span className="font-mono font-bold text-white">S$ {pickupDeliveryFee.toFixed(2)}</span>
                  </div>
                )}

                {tailgateRequired && (
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Hydraulic Tailgate Ground Fee:</span>
                    <span className="font-mono font-bold text-white">S$ {tailgateCost.toFixed(2)}</span>
                  </div>
                )}

                {insuranceRequired && (
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Air Cargo All-Risk Insurance:</span>
                    <span className="font-mono font-bold text-white">S$ {insuranceCost}</span>
                  </div>
                )}

                {freightMode === 'customs' && (
                  <div className="flex justify-between items-center text-slate-300">
                    <span>TradeNet Documentation Permit:</span>
                    <span className="font-mono font-bold text-white">S$ {customsFee.toFixed(2)}</span>
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
                  onClick={handleProceedToBooking}
                  className="w-full py-3.5 bg-[#FF6B00] hover:bg-[#E55C00] text-white rounded-xl font-semibold text-sm shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                >
                  <span>Book This Shipment Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-slate-400 text-center font-medium">
                  Air freight quotations guaranteed for 14 days. Final billable weight determined at airport terminal cargo acceptance scale.
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
                    A formalized itemized quotation with chargeable weight, route breakdown, and service tier has been recorded. Logistics operations review is underway.
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

