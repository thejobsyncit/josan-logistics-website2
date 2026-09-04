import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { 
  Package, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  DollarSign, 
  Plus, 
  Trash2, 
  Printer, 
  ArrowRight,
  ArrowLeft,
  Layers,
  FileSpreadsheet,
  CreditCard,
  QrCode,
  Landmark,
  Lock,
  Loader2,
  ChevronRight,
  User,
  Building,
  Calendar,
  Sparkles
} from 'lucide-react';

import { countryCodesList, getPhoneLength, getCountryName } from '../data/countryCodes';

const singaporeCities = [
  'Singapore (Changi Air Cargo Hub)',
  'Singapore (Jurong Port & Logistics Hub)',
  'Singapore (Pasir Panjang Terminal)',
  'Singapore (Tuas Mega Port)',
  'Singapore (Woodlands Logistics Hub)',
  'Singapore (Keppel Distripark)',
  'Singapore (Seletar Aerospace Hub)',
  'Singapore (Clementi Logistics Depot)',
  'Singapore (Bedok North Industrial Park)',
  'Singapore (Alexandra Commercial Hub)'
];

const cargoTypeOptions = [
  'General Goods',
  'Automotive Parts',
  'High-Tech Electronics',
  'Industrial Components',
  'Pharma Cold Chain',
  'Textiles & Apparel',
  'Perishable Foods & Beverages',
  'Dangerous Goods / Chemicals'
];

export const BookShipmentPage = ({ setActiveTab }) => {
  const { addShipment, setSelectedInvoiceShipment, showToast, addressList = [] } = useLogistics();

  const pickupLocations = addressList.filter(a => a.type === 'pickup');
  const dropLocations = addressList.filter(a => a.type === 'drop');

  const defaultPickupStr = pickupLocations.length > 0 
    ? `${pickupLocations[0].label} - ${pickupLocations[0].address}`
    : '10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438';

  const defaultDropStr = dropLocations.length > 0 
    ? `${dropLocations[0].label} - ${dropLocations[0].address}`
    : '89 Orchard Road, Singapore 238854';

  const [bookingMode, setBookingMode] = useState('single'); // 'single' | 'bulk'
  const [currentStep, setCurrentStep] = useState(1); // 1: Cargo & Speed | 2: Pickup | 3: Destination | 4: Review & Pay
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'paynow'
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  // Single Booking Form State
  const [formData, setFormData] = useState({
    senderName: '',
    senderCountryCode: '+65',
    senderPhone: '',
    pickupAddress: defaultPickupStr,
    pickupCity: 'Singapore (Changi Air Cargo Hub)',
    receiverName: '',
    receiverCountryCode: '+65',
    receiverPhone: '',
    deliveryAddress: defaultDropStr,
    deliveryCity: 'Singapore (Jurong Port & Logistics Hub)',
    destinationCountryCode: 'SG',
    weight: 15,
    lengthCm: 40,
    widthCm: 30,
    heightCm: 25,
    pieces: 1,
    cargoType: 'High-Tech Microchips',
    serviceLevel: 'Express Air Freight (SG Same-Day)',
    declaredValue: '15,000',
    includeInsurance: true
  });

  // Bulk Booking State (Multiple Parcels)
  const [bulkParcels, setBulkParcels] = useState([
    { id: 1, receiverName: 'Apex Corp SG', deliveryCity: 'Singapore (Jurong Port & Logistics Hub)', weight: 45, cargoType: 'Industrial Components', serviceLevel: 'Express Air Freight' },
    { id: 2, receiverName: 'Changi Logistics Hub', deliveryCity: 'Singapore (Changi Air Cargo Hub)', weight: 240, cargoType: 'Automotive Parts', serviceLevel: 'Ocean Shipping' }
  ]);

  // Step Definitions for Wizard Header (Cargo & Speed SLA First)
  const steps = [
    { number: 1, title: 'Cargo & Speed SLA', desc: 'Weight, Mode & Cover' },
    { number: 2, title: 'Pickup Details', desc: 'Sender & Origin Address' },
    { number: 3, title: 'Destination Details', desc: 'Recipient & Drop Address' },
    { number: 4, title: 'Review & Pay', desc: 'Summary & Payment' }
  ];

  // Price Calculation Logic
  const calculateEstimatedPrice = () => {
    let ratePerKg = 8;
    if (formData.serviceLevel.includes('Express')) ratePerKg = 14;
    if (formData.serviceLevel.includes('Ocean')) ratePerKg = 3;
    if (formData.serviceLevel.includes('Cold')) ratePerKg = 18;

    const base = formData.weight * ratePerKg;
    const piecesSurcharge = (formData.pieces - 1) * 15;
    const insuranceFee = formData.includeInsurance ? 35 : 0;
    const subtotal = base + piecesSurcharge + insuranceFee;
    return `$${subtotal.toFixed(2)}`;
  };

  // Step Validation Helper
  const validateStep = (stepNumber) => {
    if (stepNumber === 1) {
      if (formData.weight <= 0) {
        showToast('Cargo weight must be greater than 0 kg', 'warning');
        return false;
      }
      if (!formData.serviceLevel) {
        showToast('Please select a preferred Speed SLA', 'warning');
        return false;
      }
      return true;
    }

    if (stepNumber === 2) {
      if (!formData.senderName.trim()) {
        showToast('Please enter Sender Name / Company', 'warning');
        return false;
      }
      if (!formData.senderPhone) {
        showToast('Please enter Sender Contact Phone Number', 'warning');
        return false;
      }
      const senderMax = getPhoneLength(formData.senderCountryCode);
      if (formData.senderPhone.length !== senderMax) {
        showToast(`Sender contact number must be exactly ${senderMax} digits for ${formData.senderCountryCode} (${getCountryName(formData.senderCountryCode)})`, 'warning');
        return false;
      }
      if (!formData.pickupAddress) {
        showToast('Please select a Saved Pickup Location', 'warning');
        return false;
      }
      return true;
    }

    if (stepNumber === 3) {
      if (!formData.receiverName.trim()) {
        showToast('Please enter Receiver Name', 'warning');
        return false;
      }
      if (!formData.receiverPhone) {
        showToast('Please enter Receiver Contact Phone Number', 'warning');
        return false;
      }
      const receiverMax = getPhoneLength(formData.receiverCountryCode);
      if (formData.receiverPhone.length !== receiverMax) {
        showToast(`Receiver contact number must be exactly ${receiverMax} digits for ${formData.receiverCountryCode} (${getCountryName(formData.receiverCountryCode)})`, 'warning');
        return false;
      }
      if (!formData.deliveryAddress) {
        showToast('Please select a Saved Drop-off Location', 'warning');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJumpToStep = (targetStep) => {
    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      let canAdvance = true;
      for (let s = 1; s < targetStep; s++) {
        if (!validateStep(s)) {
          canAdvance = false;
          break;
        }
      }
      if (canAdvance) {
        setCurrentStep(targetStep);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleFinalPaymentSubmit = (e) => {
    e.preventDefault();
    if (isProcessingPayment || isPaymentSuccess) return;

    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsPaymentSuccess(true);

      setTimeout(() => {
        const estimatedPrice = calculateEstimatedPrice();
        const createdShipment = addShipment({
          ...formData,
          senderPhone: `${formData.senderCountryCode} ${formData.senderPhone}`,
          receiverPhone: `${formData.receiverCountryCode} ${formData.receiverPhone}`,
          estimatedPrice,
          paymentMethod: paymentMethod === 'card' ? 'Credit Card' : 'PayNow QR'
        });

        const methodText = paymentMethod === 'card' ? 'Credit Card' : 'PayNow SG QR';
        showToast(`Payment confirmed via ${methodText}! Shipment dispatched.`);
        setSelectedInvoiceShipment(createdShipment);
        setActiveTab('track');
      }, 1200);

    }, 1500);
  };

  const handleAddBulkRow = () => {
    setBulkParcels([
      ...bulkParcels,
      { id: Date.now(), receiverName: '', deliveryCity: 'Singapore (Woodlands Logistics Hub)', weight: 20, cargoType: 'General Goods', serviceLevel: 'Land Trucking' }
    ]);
  };

  const handleRemoveBulkRow = (id) => {
    if (bulkParcels.length === 1) return;
    setBulkParcels(bulkParcels.filter(p => p.id !== id));
  };

  const handleBulkSubmit = () => {
    let count = 0;
    bulkParcels.forEach((parcel) => {
      if (parcel.receiverName) {
        addShipment({
          senderName: 'Enterprise Bulk Account',
          senderPhone: '+65 91123456',
          pickupAddress: 'Central Warehouse Hub Gate 4',
          pickupCity: 'Singapore (Changi Air Cargo Hub)',
          receiverName: parcel.receiverName,
          receiverPhone: '+65 81234567',
          deliveryAddress: `${parcel.deliveryCity} Commercial Dock`,
          deliveryCity: parcel.deliveryCity,
          weight: parcel.weight,
          cargoType: parcel.cargoType,
          serviceLevel: parcel.serviceLevel,
          estimatedPrice: `$${(parcel.weight * 6 + 40).toFixed(2)}`
        });
        count++;
      }
    });

    showToast(`Successfully booked batch of ${count} freight shipments!`);
    setActiveTab('admin-dashboard');
  };

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 animate-fade-in">
      
      {/* Header & Mode Switcher */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold mb-2 border border-orange-200">
            <Package className="w-3.5 h-3.5" />
            <span>Step-by-Step Freight Booking Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Book A Freight Shipment</h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">Complete your shipment details in 4 simple procedure steps.</p>
        </div>

        {/* Mode Toggle Pills */}
        <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex items-center space-x-1 shrink-0">
          <button
            type="button"
            onClick={() => setBookingMode('single')}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 cursor-pointer ${
              bookingMode === 'single'
                ? 'bg-orange-500 text-white shadow-orange-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Step-by-Step Single Booking</span>
          </button>
          <button
            type="button"
            onClick={() => setBookingMode('bulk')}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 cursor-pointer ${
              bookingMode === 'bulk'
                ? 'bg-orange-500 text-white shadow-orange-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Enterprise Bulk Booking</span>
          </button>
        </div>
      </div>

      {bookingMode === 'single' ? (
        <div className="space-y-8">
          {/* STEP PROGRESS WIZARD BAR */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {steps.map((step) => (
                <button
                  key={step.number}
                  type="button"
                  onClick={() => handleJumpToStep(step.number)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-center space-x-3 cursor-pointer ${
                    currentStep === step.number
                      ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-400 shadow-sm'
                      : currentStep > step.number
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl font-extrabold flex items-center justify-center text-xs shrink-0 ${
                    currentStep === step.number
                      ? 'bg-orange-500 text-white shadow-orange-sm'
                      : currentStep > step.number
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {currentStep > step.number ? <CheckCircle2 className="w-4.5 h-4.5" /> : step.number}
                  </div>
                  <div className="overflow-hidden">
                    <p className={`text-xs font-bold leading-tight truncate ${
                      currentStep === step.number ? 'text-slate-900' : currentStep > step.number ? 'text-emerald-900' : 'text-slate-500'
                    }`}>
                      Step {step.number}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-500 truncate">{step.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* MAIN STEP FORM CONTAINER */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Step Active Content Area */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* STEP 1: CARGO & SERVICE LEVEL SPECS */}
              {currentStep === 1 && (
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
                  <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white font-extrabold flex items-center justify-center text-base shadow-orange-sm">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900">Step 1: Cargo & Service Level Specs</h3>
                      <p className="text-xs text-slate-500">Specify package weight, piece count, cargo type, and speed SLA</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Weight (kg) *</label>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                        className="w-full p-3 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange font-bold font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Number of Pieces</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={formData.pieces}
                        onChange={(e) => setFormData({ ...formData, pieces: Number(e.target.value) })}
                        className="w-full p-3 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Cargo Type</label>
                      <select
                        value={formData.cargoType}
                        onChange={(e) => setFormData({ ...formData, cargoType: e.target.value })}
                        className="w-full p-3 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange font-semibold cursor-pointer"
                      >
                        {cargoTypeOptions.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Service Level Options */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Select Preferred Speed SLA Mode</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { title: 'Express Air Freight', desc: '1-2 Days SLA (Fastest)', rate: '$14/kg' },
                        { title: 'Land Freight Trucking', desc: '3-5 Days SLA (Standard)', rate: '$8/kg' },
                        { title: 'Ocean Container Cargo', desc: '10-15 Days SLA (Economy)', rate: '$3/kg' }
                      ].map((level) => (
                        <button
                          key={level.title}
                          type="button"
                          onClick={() => setFormData({ ...formData, serviceLevel: level.title })}
                          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                            formData.serviceLevel === level.title
                              ? 'border-orange-500 bg-orange-50/80 ring-2 ring-orange-400'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <p className="font-extrabold text-slate-900 text-xs">{level.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{level.desc}</p>
                          <span className="inline-block mt-2 font-mono font-bold text-xs text-orange-600">{level.rate}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Insurance Checkbox */}
                  <div className="flex items-center space-x-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <input
                      type="checkbox"
                      id="insuranceCheck"
                      checked={formData.includeInsurance}
                      onChange={(e) => setFormData({ ...formData, includeInsurance: e.target.checked })}
                      className="w-4 h-4 text-orange-500 rounded focus-orange accent-orange-500 cursor-pointer"
                    />
                    <label htmlFor="insuranceCheck" className="text-xs text-slate-700 font-semibold cursor-pointer">
                      Include 100% Cargo Protection Guarantee ($35 policy cover)
                    </label>
                  </div>

                  {/* Step 1 Footer Action */}
                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div></div>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-extrabold text-sm shadow-orange-sm transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
                    >
                      <span>Next: Pickup Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: PICKUP LOCATION DETAILS */}
              {currentStep === 2 && (
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
                  <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white font-extrabold flex items-center justify-center text-base shadow-orange-sm">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900">Step 2: Sender & Pickup Details</h3>
                      <p className="text-xs text-slate-500">Provide sender contact info and origin address where courier will collect parcel</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Sender Name / Company *</label>
                      <input
                        type="text"
                        value={formData.senderName}
                        onChange={(e) => {
                          const lettersOnly = e.target.value.replace(/[0-9]/g, '');
                          setFormData({ ...formData, senderName: lettersOnly });
                        }}
                        placeholder="e.g. TechCorp Solutions Inc"
                        className="w-full p-3 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange font-medium"
                        required
                      />
                      <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Strictly letters only (no numbers)</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Sender Contact Phone Number *</label>
                      <div className="flex items-center">
                        <select
                          value={formData.senderCountryCode}
                          onChange={(e) => {
                            const newCode = e.target.value;
                            const maxLen = getPhoneLength(newCode);
                            setFormData((prev) => ({
                              ...prev,
                              senderCountryCode: newCode,
                              senderPhone: prev.senderPhone.slice(0, maxLen)
                            }));
                          }}
                          className="p-3 text-xs font-bold bg-slate-100 border border-slate-300 rounded-l-xl text-slate-900 focus-orange border-r-0 shrink-0 cursor-pointer"
                        >
                          {countryCodesList.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.flag} {c.code} ({c.country})
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={getPhoneLength(formData.senderCountryCode)}
                          value={formData.senderPhone}
                          onChange={(e) => {
                            const maxLen = getPhoneLength(formData.senderCountryCode);
                            const numericOnly = e.target.value.replace(/[^0-9]/g, '').slice(0, maxLen);
                            setFormData({ ...formData, senderPhone: numericOnly });
                          }}
                          placeholder={`e.g. ${'8'.repeat(getPhoneLength(formData.senderCountryCode))}`}
                          className="w-full p-3 text-sm bg-white border border-slate-300 rounded-r-xl text-slate-900 focus-orange font-mono font-bold"
                          required
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                        Strictly max {getPhoneLength(formData.senderCountryCode)} digits for {formData.senderCountryCode} ({getCountryName(formData.senderCountryCode)})
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Pickup City / Hub *</label>
                      <select
                        value={formData.pickupCity}
                        onChange={(e) => setFormData({ ...formData, pickupCity: e.target.value })}
                        className="w-full p-3 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange font-semibold cursor-pointer"
                        required
                      >
                        {singaporeCities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Saved Pickup Location *</label>
                      <select
                        value={formData.pickupAddress}
                        onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                        className="w-full p-3 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange font-semibold cursor-pointer"
                        required
                      >
                        {pickupLocations.map((item) => {
                          const fullVal = `${item.label} - ${item.address}`;
                          return (
                            <option key={item.id} value={fullVal}>
                              📍 {item.label}: {item.address}
                            </option>
                          );
                        })}
                      </select>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Strictly selected from your Saved Pickup Locations ({pickupLocations.length} locations)</span>
                    </div>
                  </div>

                  {/* Step 2 Footer Action */}
                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-extrabold text-sm transition-all flex items-center space-x-2 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Step 1</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-extrabold text-sm shadow-orange-sm transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
                    >
                      <span>Next: Destination Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: DESTINATION LOCATION DETAILS */}
              {currentStep === 3 && (
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
                  <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white font-extrabold flex items-center justify-center text-base shadow-orange-sm">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900">Step 3: Recipient & Destination Details</h3>
                      <p className="text-xs text-slate-500">Provide recipient contact details and destination dropoff location</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Receiver Name *</label>
                      <input
                        type="text"
                        value={formData.receiverName}
                        onChange={(e) => {
                          const lettersOnly = e.target.value.replace(/[0-9]/g, '');
                          setFormData({ ...formData, receiverName: lettersOnly });
                        }}
                        placeholder="e.g. Apex Dynamics SG"
                        className="w-full p-3 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange font-medium"
                        required
                      />
                      <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Strictly letters only (no numbers)</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Receiver Contact Phone Number *</label>
                      <div className="flex items-center">
                        <select
                          value={formData.receiverCountryCode}
                          onChange={(e) => {
                            const newCode = e.target.value;
                            const maxLen = getPhoneLength(newCode);
                            setFormData((prev) => ({
                              ...prev,
                              receiverCountryCode: newCode,
                              receiverPhone: prev.receiverPhone.slice(0, maxLen)
                            }));
                          }}
                          className="p-3 text-xs font-bold bg-slate-100 border border-slate-300 rounded-l-xl text-slate-900 focus-orange border-r-0 shrink-0 cursor-pointer"
                        >
                          {countryCodesList.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.flag} {c.code} ({c.country})
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={getPhoneLength(formData.receiverCountryCode)}
                          value={formData.receiverPhone}
                          onChange={(e) => {
                            const maxLen = getPhoneLength(formData.receiverCountryCode);
                            const numericOnly = e.target.value.replace(/[^0-9]/g, '').slice(0, maxLen);
                            setFormData({ ...formData, receiverPhone: numericOnly });
                          }}
                          placeholder={`e.g. ${'8'.repeat(getPhoneLength(formData.receiverCountryCode))}`}
                          className="w-full p-3 text-sm bg-white border border-slate-300 rounded-r-xl text-slate-900 focus-orange font-mono font-bold"
                          required
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                        Strictly max {getPhoneLength(formData.receiverCountryCode)} digits for {formData.receiverCountryCode} ({getCountryName(formData.receiverCountryCode)})
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Destination City *</label>
                      <select
                        value={formData.deliveryCity}
                        onChange={(e) => setFormData({ ...formData, deliveryCity: e.target.value })}
                        className="w-full p-3 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange font-semibold cursor-pointer"
                        required
                      >
                        {singaporeCities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Saved Drop-off Location *</label>
                      <select
                        value={formData.deliveryAddress}
                        onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                        className="w-full p-3 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange font-semibold cursor-pointer"
                        required
                      >
                        {dropLocations.map((item) => {
                          const fullVal = `${item.label} - ${item.address}`;
                          return (
                            <option key={item.id} value={fullVal}>
                              🏢 {item.label}: {item.address}
                            </option>
                          );
                        })}
                      </select>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Strictly selected from your Saved Drop-off Locations ({dropLocations.length} locations)</span>
                    </div>
                  </div>

                  {/* Step 3 Footer Action */}
                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-extrabold text-sm transition-all flex items-center space-x-2 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Step 2</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-extrabold text-sm shadow-orange-sm transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
                    >
                      <span>Next: Review & Payment</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW & PAYMENT CONFIRMATION */}
              {currentStep === 4 && (
                <form onSubmit={handleFinalPaymentSubmit} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
                  <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white font-extrabold flex items-center justify-center text-base shadow-orange-sm">
                      4
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900">Step 4: Review Order & Confirm Payment</h3>
                      <p className="text-xs text-slate-500">Verify your shipment details and select payment method to dispatch</p>
                    </div>
                  </div>

                  {/* Order Details Review Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Pickup Summary Card */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                        <span className="text-xs font-extrabold text-orange-600 uppercase tracking-wider flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Pickup Info</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="text-[11px] font-bold text-orange-600 hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="text-xs font-bold text-slate-900">{formData.senderName || 'Not specified'}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{formData.senderCountryCode} {formData.senderPhone}</p>
                      <p className="text-[11px] text-slate-600 font-medium line-clamp-2">{formData.pickupAddress}</p>
                    </div>

                    {/* Destination Summary Card */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                        <span className="text-xs font-extrabold text-orange-600 uppercase tracking-wider flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Destination Info</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="text-[11px] font-bold text-orange-600 hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="text-xs font-bold text-slate-900">{formData.receiverName || 'Not specified'}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{formData.receiverCountryCode} {formData.receiverPhone}</p>
                      <p className="text-[11px] text-slate-600 font-medium line-clamp-2">{formData.deliveryAddress}</p>
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                        <Lock className="w-4 h-4 text-orange-500" />
                        <span>Select Secure Payment Method</span>
                      </label>
                    </div>

                    {/* Method Choice Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1.5 ${
                          paymentMethod === 'card'
                            ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-400 text-slate-900'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-orange-600' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold">Credit / Debit Card</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('paynow')}
                        className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1.5 ${
                          paymentMethod === 'paynow'
                            ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-400 text-slate-900'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <QrCode className={`w-6 h-6 ${paymentMethod === 'paynow' ? 'text-orange-600' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold">PayNow SG QR</span>
                      </button>
                    </div>

                    {/* Payment Inputs Card */}
                    <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4">
                      {paymentMethod === 'card' && (
                        <div className="space-y-3">
                          <p className="text-xs font-bold text-orange-400 uppercase tracking-wider">Credit Card Information</p>
                          <div>
                            <label className="block text-[11px] text-slate-400 mb-1">Card Number</label>
                            <input
                              type="text"
                              placeholder="4532 •••• •••• 8892"
                              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-orange-500"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] text-slate-400 mb-1">Expiry Date</label>
                              <input
                                type="text"
                                placeholder="MM/YY"
                                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-orange-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-slate-400 mb-1">CVV / CVC</label>
                              <input
                                type="password"
                                maxLength={4}
                                placeholder="•••"
                                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-orange-500"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {paymentMethod === 'paynow' && (
                        <div className="flex flex-col items-center justify-center text-center space-y-2 py-2">
                          <p className="text-xs font-bold text-orange-400 uppercase tracking-wider">Scan SG PayNow QR</p>
                          <div className="bg-white p-3.5 rounded-2xl border-2 border-orange-500 shadow-md">
                            <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="100" height="100" fill="white"/>
                              <rect x="10" y="10" width="30" height="30" fill="#0f172a"/>
                              <rect x="15" y="15" width="20" height="20" fill="white"/>
                              <rect x="20" y="20" width="10" height="10" fill="#f97316"/>
                              <rect x="60" y="10" width="30" height="30" fill="#0f172a"/>
                              <rect x="65" y="15" width="20" height="20" fill="white"/>
                              <rect x="70" y="20" width="10" height="10" fill="#f97316"/>
                              <rect x="10" y="60" width="30" height="30" fill="#0f172a"/>
                              <rect x="15" y="65" width="20" height="20" fill="white"/>
                              <rect x="20" y="70" width="10" height="10" fill="#f97316"/>
                              <rect x="45" y="10" width="10" height="10" fill="#0f172a"/>
                              <rect x="45" y="25" width="10" height="15" fill="#f97316"/>
                              <rect x="10" y="45" width="15" height="10" fill="#0f172a"/>
                              <rect x="30" y="45" width="20" height="10" fill="#0f172a"/>
                              <rect x="55" y="45" width="15" height="10" fill="#f97316"/>
                              <rect x="75" y="45" width="15" height="10" fill="#0f172a"/>
                              <rect x="45" y="60" width="10" height="20" fill="#0f172a"/>
                              <rect x="60" y="60" width="15" height="15" fill="#0f172a"/>
                              <rect x="80" y="60" width="10" height="10" fill="#f97316"/>
                              <rect x="60" y="80" width="30" height="10" fill="#0f172a"/>
                            </svg>
                          </div>
                          <p className="text-xs text-slate-200 font-bold">PayNow UEN: <span className="font-mono text-orange-400">202012345M-JOS</span></p>
                          <p className="text-[11px] text-slate-400">Supported Apps: DBS PayLah!, OCBC, UOB, GrabPay</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step 4 Footer Action */}
                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-extrabold text-sm transition-all flex items-center space-x-2 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Step 3</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isProcessingPayment || isPaymentSuccess}
                      className={`px-8 py-4 rounded-2xl font-extrabold text-sm transition-all flex items-center space-x-2 cursor-pointer shadow-lg active:scale-95 ${
                        isPaymentSuccess
                          ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                          : isProcessingPayment
                          ? 'bg-orange-600/90 text-white cursor-wait ring-2 ring-orange-400'
                          : 'bg-orange-gradient hover:bg-orange-600 text-white shadow-orange-glow'
                      }`}
                    >
                      {isPaymentSuccess ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-white animate-bounce" />
                          <span>Payment Successful! Redirecting...</span>
                        </>
                      ) : isProcessingPayment ? (
                        <>
                          <Loader2 className="w-5 h-5 text-white animate-spin" />
                          <span>Confirming payment & dispatching...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4.5 h-4.5 text-white" />
                          <span>Confirm & Pay {calculateEstimatedPrice()}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

            </div>

            {/* Sticky Order Summary Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-6 sticky top-28 shadow-xl border-t-4 border-orange-500">
                <h3 className="text-xl font-extrabold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
                  <span>Order Summary</span>
                  <DollarSign className="w-5 h-5 text-orange-400" />
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Step:</span>
                    <span className="font-bold text-orange-400">Step {currentStep} of 4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Selected SLA:</span>
                    <span className="font-bold text-white truncate max-w-[150px]">{formData.serviceLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Weight:</span>
                    <span className="font-mono text-white">{formData.weight} kg ({formData.pieces} Pcs)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cargo Type:</span>
                    <span className="text-white truncate max-w-[150px]">{formData.cargoType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Insurance Cover:</span>
                    <span className="text-white">{formData.includeInsurance ? 'Included ($35)' : 'None'}</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-center space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Estimated Rate Total</span>
                  <p className="text-4xl font-extrabold text-orange-500 font-mono">{calculateEstimatedPrice()}</p>
                  <p className="text-[10px] text-slate-400">Includes fuel surcharges & customs VAT</p>
                </div>

                <div className="flex items-center space-x-2 text-[11px] text-slate-400 justify-center pt-2 border-t border-slate-800">
                  <ShieldCheck className="w-4 h-4 text-orange-400" />
                  <span>Instant Tracking ID Generated Upon Dispatch</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* BULK BOOKING TABULAR INTERFACE */
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Batch Freight Entry Table</h2>
              <p className="text-xs text-slate-500">Book multiple parcels simultaneously for enterprise account billing.</p>
            </div>
            <button
              onClick={handleAddBulkRow}
              className="px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Shipment Row</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Receiver Name</th>
                  <th className="p-3">Destination City</th>
                  <th className="p-3">Weight (kg)</th>
                  <th className="p-3">Cargo Type</th>
                  <th className="p-3">Service Speed</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bulkParcels.map((parcel, idx) => (
                  <tr key={parcel.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-400">{idx + 1}</td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={parcel.receiverName}
                        onChange={(e) => {
                          const lettersOnly = e.target.value.replace(/[0-9]/g, '');
                          const updated = [...bulkParcels];
                          updated[idx].receiverName = lettersOnly;
                          setBulkParcels(updated);
                        }}
                        placeholder="Receiver name..."
                        className="w-full p-2 border border-slate-300 rounded-lg focus-orange text-xs"
                      />
                    </td>
                    <td className="p-3">
                      <select
                        value={parcel.deliveryCity}
                        onChange={(e) => {
                          const updated = [...bulkParcels];
                          updated[idx].deliveryCity = e.target.value;
                          setBulkParcels(updated);
                        }}
                        className="w-full p-2 border border-slate-300 rounded-lg focus-orange text-xs font-semibold cursor-pointer"
                      >
                        {singaporeCities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        value={parcel.weight}
                        onChange={(e) => {
                          const updated = [...bulkParcels];
                          updated[idx].weight = Number(e.target.value);
                          setBulkParcels(updated);
                        }}
                        className="w-24 p-2 border border-slate-300 rounded-lg focus-orange text-xs font-mono font-bold"
                      />
                    </td>
                    <td className="p-3">
                      <select
                        value={parcel.cargoType}
                        onChange={(e) => {
                          const updated = [...bulkParcels];
                          updated[idx].cargoType = e.target.value;
                          setBulkParcels(updated);
                        }}
                        className="w-full p-2 border border-slate-300 rounded-lg focus-orange text-xs font-semibold cursor-pointer"
                      >
                        {cargoTypeOptions.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3">
                      <select
                        value={parcel.serviceLevel}
                        onChange={(e) => {
                          const updated = [...bulkParcels];
                          updated[idx].serviceLevel = e.target.value;
                          setBulkParcels(updated);
                        }}
                        className="p-2 border border-slate-300 rounded-lg focus-orange text-xs font-semibold cursor-pointer"
                      >
                        <option value="Express Air Freight">Express Air Freight</option>
                        <option value="Land Trucking">Land Trucking</option>
                        <option value="Ocean Shipping">Ocean Shipping</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleRemoveBulkRow(parcel.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleBulkSubmit}
              className="px-8 py-3.5 bg-orange-gradient hover:bg-orange-600 text-white font-extrabold text-sm rounded-xl shadow-orange-glow transition-all flex items-center space-x-2 cursor-pointer"
            >
              <span>Submit Batch ({bulkParcels.length} Parcels)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
