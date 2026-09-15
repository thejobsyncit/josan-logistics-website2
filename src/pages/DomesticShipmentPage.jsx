import React, { useState, useMemo } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import {
  Truck,
  MapPin,
  Package,
  Clock,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Check
} from 'lucide-react';
import { CargoTypeSelector } from '../components/CargoTypeSelector';

export const vehicleOptions = [
  {
    id: 'motorbike',
    label: 'Motorbike',
    maxWeight: 8,
    rate: 8,
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'mpv',
    label: 'MPV / SUV',
    maxWeight: 120,
    rate: 18,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'van',
    label: '1.7m Van',
    maxWeight: 500,
    rate: 28,
    image: '/assets/van_1_7m.jpg'
  },
  {
    id: 'large_van',
    label: '2.4m Van',
    maxWeight: 900,
    rate: 42,
    image: '/assets/van_2_4m_highroof.jpg'
  },
  {
    id: 'lorry_10ft',
    label: '10ft Lorry',
    maxWeight: 1500,
    rate: 60,
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'lorry',
    label: '14ft Lorry',
    maxWeight: 3500,
    rate: 90,
    image: '/assets/lorry_14ft_tailgate.jpg'
  },
  {
    id: 'truck_24ft',
    label: '24ft Lorry',
    maxWeight: 10000,
    rate: 150,
    image: '/assets/lorry_24ft_heavy.jpg'
  },
  {
    id: 'cold_chain',
    label: 'Cold-Chain Van',
    maxWeight: 800,
    rate: 65,
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=500&auto=format&fit=crop&q=80'
  }
];

const timeSlots = ['9:00 AM - 11:00 AM', '11:00 AM - 1:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 6:00 PM'];

export const DomesticShipmentPage = ({ setActiveTab, hideHero = false }) => {
  const { addShipment, showToast, setShipmentScope } = useLogistics();

  const [form, setForm] = useState({
    senderName: '',
    senderPhone: '',
    pickupAddress: '',
    pickupPostal: '',
    receiverName: '',
    receiverPhone: '',
    deliveryAddress: '',
    deliveryPostal: '',
    weight: '',
    pieces: 1,
    cargoType: '',
    vehicle: 'van',
    timeSlot: timeSlots[0],
    declaredValue: ''
  });
  const [errors, setErrors] = useState({});
  const [confirmedId, setConfirmedId] = useState(null);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const selectedVehicle = vehicleOptions.find((v) => v.id === form.vehicle) || vehicleOptions[3];

  const estimatedPrice = useMemo(() => {
    const w = parseFloat(form.weight) || 1;
    const base = selectedVehicle.rate;
    // Generous tiered weight allowance included with each vehicle type
    const freeAllowance = Math.min(selectedVehicle.maxWeight * 0.4, 250);
    const excessWeight = Math.max(0, w - freeAllowance);
    const excessRate = selectedVehicle.maxWeight >= 1500 ? 0.04 : selectedVehicle.maxWeight >= 500 ? 0.08 : 0.25;
    const total = base + excessWeight * excessRate;
    return total.toFixed(2);
  }, [form.weight, selectedVehicle]);

  const validate = () => {
    const next = {};
    if (!form.senderName.trim()) next.senderName = 'Enter sender name';
    if (!form.senderPhone.trim()) next.senderPhone = 'Enter sender phone';
    if (!form.pickupAddress.trim()) next.pickupAddress = 'Enter pickup address';
    if (!/^\d{6}$/.test(form.pickupPostal.trim())) next.pickupPostal = '6-digit Singapore postal code';
    if (!form.receiverName.trim()) next.receiverName = 'Enter receiver name';
    if (!form.receiverPhone.trim()) next.receiverPhone = 'Enter receiver phone';
    if (!form.deliveryAddress.trim()) next.deliveryAddress = 'Enter delivery address';
    if (!/^\d{6}$/.test(form.deliveryPostal.trim())) next.deliveryPostal = '6-digit Singapore postal code';
    if (!form.weight || parseFloat(form.weight) <= 0) next.weight = 'Enter parcel weight';
    if (!form.cargoType || !form.cargoType.trim()) next.cargoType = 'Please select a cargo type';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the highlighted fields', 'warning');
      return;
    }
    const shipment = addShipment({
      senderName: form.senderName,
      senderPhone: form.senderPhone,
      pickupAddress: `${form.pickupAddress}, Singapore ${form.pickupPostal}`,
      pickupCity: 'Singapore',
      receiverName: form.receiverName,
      receiverPhone: form.receiverPhone,
      deliveryAddress: `${form.deliveryAddress}, Singapore ${form.deliveryPostal}`,
      deliveryCity: 'Singapore',
      serviceLevel: `Domestic ${selectedVehicle.label}`,
      cargoType: form.cargoType,
      weight: form.weight,
      pieces: form.pieces,
      declaredValue: form.declaredValue || '200',
      estimatedPrice: `S$ ${estimatedPrice}`,
      destinationCountryCode: 'SG',
      vehicleId: selectedVehicle.id,
      vehicleName: selectedVehicle.label
    });
    setConfirmedId(shipment.id);
  };

  if (confirmedId) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Domestic shipment booked</h1>
        <p className="text-sm text-slate-500 mb-1">Vehicle: <strong className="text-slate-800">{selectedVehicle.label}</strong> (Max {selectedVehicle.maxWeight} kg)</p>
        <p className="text-xs text-slate-400 mb-1 mt-4">Tracking ID</p>
        <p className="text-2xl font-black text-orange-600 mb-8">{confirmedId}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setActiveTab && setActiveTab('track')}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl shadow-orange-sm transition-colors cursor-pointer"
          >
            Track this shipment
          </button>
          <button
            onClick={() => setActiveTab && setActiveTab('customer-dashboard')}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Go to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={hideHero ? "w-full animate-fade-in" : "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-fade-in"}>
      {!hideHero && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-7 sm:p-10 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/30 px-3.5 py-1.5 rounded-full mb-4 relative z-10">
            <Truck className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wide">Within Singapore</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2 relative z-10">Book a domestic shipment</h1>
          <p className="text-sm sm:text-base text-slate-300 relative z-10 max-w-xl">
            Island-wide pickup and delivery with same-day and next-day slots. No customs paperwork required.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Pickup Details */}
          <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card">
            <div className="flex items-center gap-2 mb-5">
              <MapPin className="w-4 h-4 text-orange-500" />
              <h2 className="text-base font-black text-slate-900">Pickup details</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Sender name" error={errors.senderName}>
                <input value={form.senderName} onChange={update('senderName')} placeholder="Full name" className={inputClass(errors.senderName)} />
              </Field>
              <Field label="Sender phone" error={errors.senderPhone}>
                <input value={form.senderPhone} onChange={update('senderPhone')} placeholder="+65 9123 4567" className={inputClass(errors.senderPhone)} />
              </Field>
              <Field label="Pickup address" error={errors.pickupAddress} full>
                <input value={form.pickupAddress} onChange={update('pickupAddress')} placeholder="Block, street, unit number" className={inputClass(errors.pickupAddress)} />
              </Field>
              <Field label="Postal code" error={errors.pickupPostal}>
                <input value={form.pickupPostal} onChange={update('pickupPostal')} placeholder="569933" maxLength={6} className={inputClass(errors.pickupPostal)} />
              </Field>
            </div>
          </section>

          {/* Delivery Details */}
          <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card">
            <div className="flex items-center gap-2 mb-5">
              <MapPin className="w-4 h-4 text-orange-500" />
              <h2 className="text-base font-black text-slate-900">Delivery details</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Receiver name" error={errors.receiverName}>
                <input value={form.receiverName} onChange={update('receiverName')} placeholder="Full name" className={inputClass(errors.receiverName)} />
              </Field>
              <Field label="Receiver phone" error={errors.receiverPhone}>
                <input value={form.receiverPhone} onChange={update('receiverPhone')} placeholder="+65 8123 4567" className={inputClass(errors.receiverPhone)} />
              </Field>
              <Field label="Delivery address" error={errors.deliveryAddress} full>
                <input value={form.deliveryAddress} onChange={update('deliveryAddress')} placeholder="Block, street, unit number" className={inputClass(errors.deliveryAddress)} />
              </Field>
              <Field label="Postal code" error={errors.deliveryPostal}>
                <input value={form.deliveryPostal} onChange={update('deliveryPostal')} placeholder="238859" maxLength={6} className={inputClass(errors.deliveryPostal)} />
              </Field>
            </div>
          </section>

          {/* Select Vehicle Type (Clean: Image, Weight, Price) */}
          <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-orange-500" />
                <h2 className="text-base font-black text-slate-900">Vehicle Type</h2>
              </div>
              <span className="text-xs font-semibold text-slate-400">{vehicleOptions.length} Available Options</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {vehicleOptions.map((v) => {
                const isSelected = form.vehicle === v.id;
                return (
                  <button
                    type="button"
                    key={v.id}
                    onClick={() => setForm((f) => ({ ...f, vehicle: v.id }))}
                    className={`text-left rounded-2xl border-2 transition-all cursor-pointer overflow-hidden flex flex-col justify-between group relative ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20 shadow-sm'
                        : 'border-slate-200 hover:border-orange-300 bg-white'
                    }`}
                  >
                    {/* Vehicle Image */}
                    <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-slate-100">
                      <img
                        src={v.image}
                        alt={v.label}
                        onError={(e) => { e.target.src = '/assets/clean_domestic_truck.jpg'; }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Minimal Information: Name, Weight & Price */}
                    <div className="p-2.5 sm:p-3 w-full">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <p className={`text-xs sm:text-sm font-black truncate ${isSelected ? 'text-orange-600' : 'text-slate-900'}`}>
                          {v.label}
                        </p>
                        <span className="text-xs sm:text-sm font-black text-slate-900 shrink-0">
                          S$ {v.rate}
                        </span>
                      </div>

                      <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold">
                        Max {v.maxWeight.toLocaleString()} kg
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Parcel Specs & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <Field label="Weight (kg)" error={errors.weight}>
                <input type="number" min="0" value={form.weight} onChange={update('weight')} placeholder="10" className={inputClass(errors.weight)} />
              </Field>
              <Field label="Pieces">
                <input type="number" min="1" value={form.pieces} onChange={update('pieces')} className={inputClass()} />
              </Field>
              <Field label="Cargo type" error={errors.cargoType}>
                <CargoTypeSelector
                  value={form.cargoType}
                  onChange={(val) => {
                    setForm((f) => ({ ...f, cargoType: val }));
                    if (errors.cargoType) setErrors((prev) => ({ ...prev, cargoType: undefined }));
                  }}
                  error={errors.cargoType}
                />
              </Field>
            </div>

            <Field label="Preferred time slot">
              <select value={form.timeSlot} onChange={update('timeSlot')} className={inputClass()}>
                {timeSlots.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
          </section>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card sticky top-24 space-y-5">
            <div className="flex items-center gap-2 rounded-xl border border-dashed border-slate-200 p-3">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <p className="text-[11px] text-slate-500">No customs documents required for domestic delivery</p>
            </div>

            {/* Selected Vehicle Thumbnail */}
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-200 p-3">
              <img
                src={selectedVehicle.image}
                alt={selectedVehicle.label}
                onError={(e) => { e.target.src = '/assets/clean_domestic_truck.jpg'; }}
                className="w-14 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-black text-slate-900 truncate">{selectedVehicle.label}</p>
                <p className="text-[11px] font-bold text-slate-500">Max {selectedVehicle.maxWeight} kg · Base S$ {selectedVehicle.rate}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 mb-1">Estimated price</p>
              <p className="text-3xl font-black text-slate-900">S$ {estimatedPrice}</p>
              <p className="text-[11px] text-slate-400 mt-1">Based on {selectedVehicle.label.toLowerCase()} rate & weight</p>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> {form.timeSlot}</div>
              <div className="flex items-center gap-2"><Truck className="w-3.5 h-3.5" /> {selectedVehicle.label}</div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm py-3.5 rounded-xl shadow-orange-sm transition-colors cursor-pointer"
            >
              Confirm domestic booking
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const Field = ({ label, error, full, children }) => (
  <div className={full ? 'sm:col-span-2' : ''}>
    <label className="block text-xs font-bold text-slate-500 mb-1.5">{label}</label>
    {children}
    {error && <p className="text-[11px] text-red-500 mt-1 font-semibold">{error}</p>}
  </div>
);

const inputClass = (error) =>
  `w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 outline-none transition-colors focus:ring-2 focus:ring-orange-500/20 ${
    error ? 'border-red-400' : 'border-slate-200 focus:border-orange-400'
  }`;
