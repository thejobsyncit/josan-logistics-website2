import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { cargoCategories } from '../components/CargoTypeSelector';

export const QuotePage = ({ setActiveTab }) => {
  const { showToast, currentUser, setIsAuthModalOpen, resetShipmentScope, requestQuote, setCustomerSubTab } = useLogistics();

  // Form State
  const [freightMode, setFreightMode] = useState('ftl');
  const [cargoWeight, setCargoWeight] = useState(250);
  const [cargoCategory, setCargoCategory] = useState(cargoCategories[0]?.name || 'Industrial Products');
  const [originZone, setOriginZone] = useState('Jurong / West Industrial District');
  const [destinationZone, setDestinationZone] = useState('Changi / East Cargo Logistics Complex');
  const [tailgateRequired, setTailgateRequired] = useState(false);
  const [insuranceRequired, setInsuranceRequired] = useState(true);
  const [declaredValue, setDeclaredValue] = useState(15000);
  const [deliverySpeed, setDeliverySpeed] = useState('standard');

  // Contact State
  const [contactName, setContactName] = useState(currentUser?.name || '');
  const [contactEmail, setContactEmail] = useState(currentUser?.email || '');
  const [contactCompany, setContactCompany] = useState(currentUser?.company || '');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [generatedQuoteRef, setGeneratedQuoteRef] = useState('');

  // Rate Matrix
  const getRatePerKg = () => {
    switch (freightMode) {
      case 'ftl': return 5.50;
      case 'ltl': return 3.80;
      case 'reefer': return 6.50;
      case 'express': return 8.00;
      case 'customs': return 4.20;
      default: return 5.00;
    }
  };

  const getSpeedMultiplier = () => {
    return deliverySpeed === 'express' ? 1.35 : 1.0;
  };

  const baseFreightCost = (cargoWeight * getRatePerKg() * getSpeedMultiplier()).toFixed(2);
  const tailgateCost = tailgateRequired ? 35.00 : 0.00;
  const insuranceCost = insuranceRequired ? Math.max(25, declaredValue * 0.004).toFixed(2) : '0.00';
  const customsFee = freightMode === 'customs' ? 120.00 : 0.00;
  const subtotal = (
    parseFloat(baseFreightCost) + 
    tailgateCost + 
    parseFloat(insuranceCost) + 
    customsFee
  ).toFixed(2);
  const gst = (parseFloat(subtotal) * 0.09).toFixed(2);
  const grandTotal = (parseFloat(subtotal) + parseFloat(gst)).toFixed(2);

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    if (requestQuote) {
      const newQuote = requestQuote({
        freightMode,
        cargoWeight,
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
        contactPhone,
        specialInstructions
      });
      const refId = newQuote?.id || `QTE-${Math.floor(10000 + Math.random() * 90000)}-SG`;
      setGeneratedQuoteRef(refId);
      setQuoteSubmitted(true);
    } else {
      const refId = `QTE-${Math.floor(10000 + Math.random() * 90000)}-SG`;
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
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <span className="text-[#FF6B00] font-bold uppercase text-xs tracking-widest bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 inline-flex items-center space-x-1.5">
            <Calculator className="w-3.5 h-3.5" />
            <span>Instant Rate Estimator & Quotation</span>
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight">
            Get an Instant Freight Quote
          </h1>
          <p className="text-white/90 font-medium max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Obtain instant transparent pricing for your road freight, FTL, LTL, and temperature-controlled cargo shipments across Singapore and regional cross-border corridors.
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
              <p className="text-xs text-slate-500 font-semibold">Select your required transport service, cargo details, and route.</p>
            </div>

            <form onSubmit={handleQuoteSubmit} className="space-y-6 text-xs">
              {/* Freight Mode Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  1. Select Freight Service Mode *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'ftl', label: 'FTL Truckload', sub: 'Exclusive dedicated lorry', rate: '$5.50/kg' },
                    { id: 'ltl', label: 'LTL Consolidation', sub: 'Shared pallet freight', rate: '$3.80/kg' },
                    { id: 'reefer', label: 'Cold Chain Reefer', sub: '-25°C to +25°C active', rate: '$6.50/kg' },
                    { id: 'express', label: 'Express Courier', sub: 'Same-day rapid dispatch', rate: '$8.00/kg' },
                    { id: 'customs', label: 'Customs + Road Freight', sub: 'TradeNet documentation', rate: '$4.20/kg' }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setFreightMode(mode.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        freightMode === mode.id
                          ? 'bg-orange-500 text-white border-orange-500 shadow-orange-sm'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-orange-300'
                      }`}
                    >
                      <div>
                        <span className="font-extrabold text-xs block">{mode.label}</span>
                        <span className={`text-[10px] block mt-0.5 ${freightMode === mode.id ? 'text-orange-100' : 'text-slate-500'}`}>
                          {mode.sub}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold mt-2 inline-block ${freightMode === mode.id ? 'text-white' : 'text-orange-600'}`}>
                        From {mode.rate}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight & Cargo Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700 uppercase">Cargo Weight (kg) *</label>
                    <span className="font-mono font-black text-orange-600 text-sm">{cargoWeight} kg</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="15000"
                    step="25"
                    value={cargoWeight}
                    onChange={(e) => setCargoWeight(Number(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>5 kg</span>
                    <span>5,000 kg</span>
                    <span>15,000 kg</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cargo Classification</label>
                  <select
                    value={cargoCategory}
                    onChange={(e) => setCargoCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus-orange cursor-pointer"
                  >
                    {cargoCategories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Origin and Destination Zones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Pickup Zone / Terminal</label>
                  <select
                    value={originZone}
                    onChange={(e) => setOriginZone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus-orange cursor-pointer"
                  >
                    <option value="Jurong / West Industrial District">Jurong / West Industrial District</option>
                    <option value="Changi / East Cargo Logistics Complex">Changi / East Cargo Logistics Complex</option>
                    <option value="Woodlands / North Link Highway Depot">Woodlands / North Link Highway Depot</option>
                    <option value="Tuas Megaport Container Depot">Tuas Megaport Container Depot</option>
                    <option value="Central Business District (CBD)">Central Business District (CBD)</option>
                    <option value="Johor Bahru Cross-Border Gateway">Johor Bahru Cross-Border Gateway</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Delivery Zone / Terminal</label>
                  <select
                    value={destinationZone}
                    onChange={(e) => setDestinationZone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus-orange cursor-pointer"
                  >
                    <option value="Changi / East Cargo Logistics Complex">Changi / East Cargo Logistics Complex</option>
                    <option value="Jurong / West Industrial District">Jurong / West Industrial District</option>
                    <option value="Woodlands / North Link Highway Depot">Woodlands / North Link Highway Depot</option>
                    <option value="Tuas Megaport Container Depot">Tuas Megaport Container Depot</option>
                    <option value="Central Business District (CBD)">Central Business District (CBD)</option>
                    <option value="Johor Bahru Cross-Border Gateway">Johor Bahru Cross-Border Gateway</option>
                  </select>
                </div>
              </div>

              {/* Service Speed & Addons */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="block text-[11px] font-black uppercase text-slate-500 tracking-wider">
                  Additional Transport Options
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tailgateRequired}
                      onChange={(e) => setTailgateRequired(e.target.checked)}
                      className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-400 accent-orange-500"
                    />
                    <span className="font-bold text-slate-800">Hydraulic Tailgate Required (+S$35)</span>
                  </label>

                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={insuranceRequired}
                      onChange={(e) => setInsuranceRequired(e.target.checked)}
                      className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-400 accent-orange-500"
                    />
                    <span className="font-bold text-slate-800">Full Cargo All-Risk Insurance</span>
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
                    <label className="block font-bold text-slate-600 mb-1">Transit Speed</label>
                    <select
                      value={deliverySpeed}
                      onChange={(e) => setDeliverySpeed(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 cursor-pointer"
                    >
                      <option value="standard">Standard Highway Route (24h SLA)</option>
                      <option value="express">Priority Express Highway (Under 4h SLA +35%)</option>
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
                      placeholder="e.g. Razer Asia-Pacific Pte Ltd"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+65 8765 4321"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-extrabold text-sm shadow-orange-sm transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate Official Quotation Summary</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right 5 Columns: Price Breakdown & Quote Confirmation Card */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-orange-400">
                    Live Rate Computation
                  </span>
                  <h3 className="text-xl font-extrabold text-white">Quotation Breakdown</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>

              {/* Route Summary */}
              <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl space-y-1.5 text-xs">
                <div className="flex items-center space-x-2 text-slate-300 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span className="truncate">From: {originZone}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">To: {destinationZone}</span>
                </div>
              </div>

              {/* Itemized Line Items */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Base Freight ({cargoWeight}kg × ${getRatePerKg()}/kg):</span>
                  <span className="font-mono font-bold text-white">S$ {baseFreightCost}</span>
                </div>

                {tailgateRequired && (
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Hydraulic Tailgate Fee:</span>
                    <span className="font-mono font-bold text-white">S$ {tailgateCost.toFixed(2)}</span>
                  </div>
                )}

                {insuranceRequired && (
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Cargo Protection (All-Risk):</span>
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
                  <span className="font-mono text-2xl text-orange-400 font-black">S$ {grandTotal}</span>
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
                  Quotes are guaranteed for 14 days from time of generation. SLA tracked by Josan Logistics dispatch.
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
                    A formalized itemized quotation with distance, cargo, and vehicle breakdown has been recorded. Admin operations review is in progress.
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
                      className="flex-1 py-2 px-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs text-center transition-all cursor-pointer flex items-center justify-center space-x-1.5"
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
