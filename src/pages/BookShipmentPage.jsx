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
  Layers,
  FileSpreadsheet
} from 'lucide-react';

const countryCodes = [
  { code: '+65', flag: '🇸🇬', name: 'SG', length: 8 },
  { code: '+91', flag: '🇮🇳', name: 'IN', length: 10 },
  { code: '+1', flag: '🇺🇸', name: 'US/CA', length: 10 },
  { code: '+60', flag: '🇲🇾', name: 'MY', length: 10 },
  { code: '+44', flag: '🇬🇧', name: 'UK', length: 10 },
  { code: '+61', flag: '🇦🇺', name: 'AU', length: 9 },
  { code: '+81', flag: '🇯🇵', name: 'JP', length: 10 },
  { code: '+86', flag: '🇨🇳', name: 'CN', length: 11 }
];

const getPhoneLength = (code) => {
  const found = countryCodes.find((c) => c.code === code);
  return found ? found.length : 10;
};

const getCountryName = (code) => {
  const found = countryCodes.find((c) => c.code === code);
  return found ? found.name : 'Country';
};

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

  const handleSingleSubmit = (e) => {
    e.preventDefault();
    if (!formData.senderName || !formData.senderPhone || !formData.pickupAddress || !formData.receiverName || !formData.receiverPhone || !formData.deliveryAddress) {
      showToast('Please complete all required fields including Sender & Receiver Contact Numbers', 'warning');
      return;
    }

    const senderMax = getPhoneLength(formData.senderCountryCode);
    if (formData.senderPhone.length !== senderMax) {
      showToast(`Sender contact number must be exactly ${senderMax} digits for ${formData.senderCountryCode} (${getCountryName(formData.senderCountryCode)})`, 'warning');
      return;
    }

    const receiverMax = getPhoneLength(formData.receiverCountryCode);
    if (formData.receiverPhone.length !== receiverMax) {
      showToast(`Receiver contact number must be exactly ${receiverMax} digits for ${formData.receiverCountryCode} (${getCountryName(formData.receiverCountryCode)})`, 'warning');
      return;
    }

    const estimatedPrice = calculateEstimatedPrice();
    const createdShipment = addShipment({
      ...formData,
      senderPhone: `${formData.senderCountryCode} ${formData.senderPhone}`,
      receiverPhone: `${formData.receiverCountryCode} ${formData.receiverPhone}`,
      estimatedPrice
    });

    // Prompt user to view invoice or track
    setSelectedInvoiceShipment(createdShipment);
    setActiveTab('track');
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
    <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      
      {/* Header & Mode Switcher */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold mb-2 border border-orange-200">
            <Package className="w-3.5 h-3.5" />
            <span>Instant Dispatch Booking Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Book A Freight Shipment</h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">Schedule instant pickup, choose speed level, and get real-time price quotes.</p>
        </div>

        {/* Mode Toggle Pills */}
        <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex items-center space-x-1 shrink-0">
          <button
            type="button"
            onClick={() => setBookingMode('single')}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 ${
              bookingMode === 'single'
                ? 'bg-orange-500 text-white shadow-orange-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Single Parcel Booking</span>
          </button>
          <button
            type="button"
            onClick={() => setBookingMode('bulk')}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 ${
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
        /* SINGLE BOOKING FORM */
        <form onSubmit={handleSingleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Form Left Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Step 1: Pickup Location */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-6">
              <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                <div className="w-9 h-9 rounded-xl bg-orange-500 text-white font-extrabold flex items-center justify-center text-sm shadow-orange-sm">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Pickup Location Details</h3>
                  <p className="text-xs text-slate-500">Origin address where courier will retrieve cargo</p>
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
                    className="w-full p-3 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange"
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
                      {countryCodes.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code} ({c.length} digits)
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
            </div>

            {/* Step 2: Delivery Location */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-6">
              <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                <div className="w-9 h-9 rounded-xl bg-orange-500 text-white font-extrabold flex items-center justify-center text-sm shadow-orange-sm">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Destination Location Details</h3>
                  <p className="text-xs text-slate-500">Recipient contact & dropoff address</p>
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
                    className="w-full p-3 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange"
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
                      {countryCodes.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code} ({c.length} digits)
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
            </div>

            {/* Step 3: Package Specs & Speed */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-6">
              <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                <div className="w-9 h-9 rounded-xl bg-orange-500 text-white font-extrabold flex items-center justify-center text-sm shadow-orange-sm">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Cargo & Service Level Specs</h3>
                  <p className="text-xs text-slate-500">Specify package weight, dimensions, and speed class</p>
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

              {/* Service Level Radios */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Select Preferred Speed SLA</label>
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
                      className={`p-4 rounded-2xl border text-left transition-all ${
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
              <div className="flex items-center space-x-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="insuranceCheck"
                  checked={formData.includeInsurance}
                  onChange={(e) => setFormData({ ...formData, includeInsurance: e.target.checked })}
                  className="w-4 h-4 text-orange-500 rounded focus-orange accent-orange-500"
                />
                <label htmlFor="insuranceCheck" className="text-xs text-slate-700 font-semibold cursor-pointer">
                  Include 100% Cargo Protection Guarantee ($35 policy cover)
                </label>
              </div>

            </div>

          </div>

          {/* Pricing Estimation & Dispatch Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-6 sticky top-28 shadow-xl border-t-4 border-orange-500">
              <h3 className="text-xl font-extrabold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
                <span>Shipping Summary</span>
                <DollarSign className="w-5 h-5 text-orange-400" />
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Selected SLA:</span>
                  <span className="font-bold text-orange-400">{formData.serviceLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Weight:</span>
                  <span className="font-mono text-white">{formData.weight} kg ({formData.pieces} Pcs)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cargo Insurance:</span>
                  <span className="text-white">{formData.includeInsurance ? 'Included ($35)' : 'None'}</span>
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-center space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Estimated Total Rate</span>
                <p className="text-4xl font-extrabold text-orange-500 font-mono">{calculateEstimatedPrice()}</p>
                <p className="text-[10px] text-slate-400">Includes fuel surcharges & customs VAT</p>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-orange-gradient hover:bg-orange-600 text-white rounded-2xl font-extrabold text-sm shadow-orange-glow transition-all flex items-center justify-center space-x-2 active:scale-95"
              >
                <span>Confirm & Dispatch Freight</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-2 text-[11px] text-slate-400 justify-center">
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                <span>Instant Tracking ID Generated Upon Dispatch</span>
              </div>
            </div>
          </div>

        </form>
      ) : (
        /* BULK BOOKING TABULAR INTERFACE */
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Batch Freight Entry Table</h2>
              <p className="text-xs text-slate-500">Book multiple parcels simultaneously for enterprise account billing.</p>
            </div>
            <button
              onClick={handleAddBulkRow}
              className="px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5"
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
                        className="p-2 border border-slate-300 rounded-lg focus-orange text-xs font-semibold"
                      >
                        <option value="Express Air Freight">Express Air Freight</option>
                        <option value="Land Trucking">Land Trucking</option>
                        <option value="Ocean Shipping">Ocean Shipping</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleRemoveBulkRow(parcel.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
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
              className="px-8 py-3.5 bg-orange-gradient hover:bg-orange-600 text-white font-extrabold text-sm rounded-xl shadow-orange-glow transition-all flex items-center space-x-2"
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
