import React, { useState, useMemo } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import {
  Globe,
  Plane,
  Ship,
  Truck,
  FileText,
  Upload,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Building,
  Hash,
  Package
} from 'lucide-react';
import { packageTypeOptions } from './DomesticShipmentPage';

const countryOptions = [
  'Malaysia', 'Indonesia', 'Thailand', 'Vietnam', 'Philippines', 'India',
  'China', 'Japan', 'Australia', 'United Kingdom', 'Germany', 'United States', 'United Arab Emirates'
];

const freightModes = [
  { id: 'air', label: 'Air', icon: Plane, desc: '2 - 5 days · fastest, higher cost' },
  { id: 'sea', label: 'Sea', icon: Ship, desc: '15 - 30 days · best for bulk cargo' },
  { id: 'land', label: 'Land', icon: Truck, desc: 'Via Causeway · Malaysia only, 1 - 3 days' }
];

const incoterms = ['FOB', 'CIF', 'DDP', 'EXW', 'FCA'];

const requiredDocs = [
  'Commercial invoice',
  'Packing list',
  'Singapore TradeNet permit',
  'Certificate of origin (if applicable)'
];

export const InternationalShipmentPage = ({ setActiveTab }) => {
  const { addShipment, showToast } = useLogistics();

  const [form, setForm] = useState({
    exporterName: '',
    exporterAddress: '',
    consigneeName: '',
    consigneePhone: '',
    destinationCountry: countryOptions[0],
    freightMode: 'air',
    incoterm: 'FOB',
    packageType: 'Carton / Box',
    hsCode: '',
    cargoDescription: '',
    weight: '',
    pieces: 1,
    declaredValue: '',
    docsAcknowledged: false
  });
  const [errors, setErrors] = useState({});
  const [confirmedId, setConfirmedId] = useState(null);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const selectedMode = freightModes.find((m) => m.id === form.freightMode) || freightModes[0];

  const estimatedPrice = useMemo(() => {
    const w = parseFloat(form.weight) || 1;
    const modeRate = { air: 9.5, sea: 3.2, land: 4.5 }[form.freightMode];
    const value = parseFloat(form.declaredValue) || 0;
    const total = 40 + w * modeRate + value * 0.015;
    return total.toFixed(2);
  }, [form.weight, form.freightMode, form.declaredValue]);

  const validate = () => {
    const next = {};
    if (!form.exporterName.trim()) next.exporterName = 'Enter exporter name';
    if (!form.exporterAddress.trim()) next.exporterAddress = 'Enter Singapore origin address';
    if (!form.consigneeName.trim()) next.consigneeName = 'Enter consignee name';
    if (!form.consigneePhone.trim()) next.consigneePhone = 'Enter consignee phone';
    if (!form.hsCode.trim()) next.hsCode = 'Enter HS code';
    if (!form.cargoDescription.trim()) next.cargoDescription = 'Describe the cargo';
    if (!form.weight || parseFloat(form.weight) <= 0) next.weight = 'Enter cargo weight';
    if (!form.declaredValue || parseFloat(form.declaredValue) <= 0) next.declaredValue = 'Enter customs value';
    if (form.freightMode === 'land' && form.destinationCountry !== 'Malaysia') {
      next.freightMode = 'Land freight is only available to Malaysia';
    }
    if (!form.docsAcknowledged) next.docsAcknowledged = 'Confirm you can provide these documents';
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
      senderName: form.exporterName,
      pickupAddress: form.exporterAddress,
      pickupCity: 'Singapore',
      receiverName: form.consigneeName,
      receiverPhone: form.consigneePhone,
      deliveryAddress: `${form.consigneeName}, ${form.destinationCountry}`,
      deliveryCity: form.destinationCountry,
      serviceLevel: `International ${selectedMode.label} Freight (${form.incoterm})`,
      cargoType: form.cargoDescription,
      packageType: form.packageType,
      weight: form.weight,
      pieces: form.pieces,
      declaredValue: form.declaredValue,
      estimatedPrice: `S$ ${estimatedPrice}`,
      destinationCountryCode: form.destinationCountry.slice(0, 2).toUpperCase()
    });
    setConfirmedId(shipment.id);
  };

  if (confirmedId) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-slate-900" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">International shipment booked</h1>
        <p className="text-sm text-slate-500 mb-1">
          Freight: <strong className="text-slate-800">{selectedMode.label}</strong> · Package: <strong className="text-slate-800">{form.packageType}</strong>
        </p>
        <p className="text-sm text-slate-500 mb-1 mt-3">Tracking ID</p>
        <p className="text-xl font-black text-orange-600 mb-8">{confirmedId}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setActiveTab && setActiveTab('customs-clearance')}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
          >
            Prepare customs documents
          </button>
          <button
            onClick={() => setActiveTab && setActiveTab('track')}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Track this shipment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
      {/* Scope Switcher: Domestic | International */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shadow-xs">
          <button
            type="button"
            onClick={() => {
              if (setActiveTab) {
                setActiveTab('domestic-shipment');
              }
            }}
            className="px-7 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:text-slate-900 hover:bg-white/70 transition-all cursor-pointer"
          >
            Domestic
          </button>
          <button
            type="button"
            className="px-7 py-2.5 rounded-xl font-extrabold text-sm bg-slate-900 text-white shadow-sm transition-all cursor-pointer"
          >
            International
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-7 sm:p-10 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/30 px-3.5 py-1.5 rounded-full mb-4 relative z-10">
          <Globe className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-xs font-bold text-orange-400 uppercase tracking-wide">Cross-border freight</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2 relative z-10">Book an international shipment</h1>
        <p className="text-sm sm:text-base text-slate-300 relative z-10 max-w-xl">
          Air, sea and land freight forwarding out of Singapore, with customs documentation handled through TradeNet.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card">
            <div className="flex items-center gap-2 mb-5">
              <Building className="w-4 h-4 text-orange-500" />
              <h2 className="text-base font-black text-slate-900">Exporter & consignee</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Exporter name" error={errors.exporterName}>
                <input value={form.exporterName} onChange={update('exporterName')} placeholder="Company or full name" className={inputClass(errors.exporterName)} />
              </Field>
              <Field label="Origin address (Singapore)" error={errors.exporterAddress}>
                <input value={form.exporterAddress} onChange={update('exporterAddress')} placeholder="Block, street, unit number" className={inputClass(errors.exporterAddress)} />
              </Field>
              <Field label="Consignee name" error={errors.consigneeName}>
                <input value={form.consigneeName} onChange={update('consigneeName')} placeholder="Receiving party" className={inputClass(errors.consigneeName)} />
              </Field>
              <Field label="Consignee phone" error={errors.consigneePhone}>
                <input value={form.consigneePhone} onChange={update('consigneePhone')} placeholder="+60 12 345 6789" className={inputClass(errors.consigneePhone)} />
              </Field>
              <Field label="Destination country">
                <select value={form.destinationCountry} onChange={update('destinationCountry')} className={inputClass()}>
                  {countryOptions.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Incoterm">
                <select value={form.incoterm} onChange={update('incoterm')} className={inputClass()}>
                  {incoterms.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card">
            <div className="flex items-center gap-2 mb-5">
              <Plane className="w-4 h-4 text-orange-500" />
              <h2 className="text-base font-black text-slate-900">Freight mode</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
              {freightModes.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setForm((f) => ({ ...f, freightMode: m.id }))}
                    className={`text-left rounded-2xl border-2 p-4 transition-all cursor-pointer ${
                      form.freightMode === m.id ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-slate-700 mb-2" />
                    <p className="text-sm font-black text-slate-900">{m.label}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{m.desc}</p>
                  </button>
                );
              })}
            </div>
            {errors.freightMode && <p className="text-[11px] text-red-500 font-semibold">{errors.freightMode}</p>}
          </section>

          <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card">
            <div className="flex items-center gap-2 mb-5">
              <Hash className="w-4 h-4 text-orange-500" />
              <h2 className="text-base font-black text-slate-900">Cargo & customs</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Field label="Package type">
                <select
                  value={form.packageType}
                  onChange={update('packageType')}
                  className={`${inputClass()} bg-white cursor-pointer`}
                >
                  {packageTypeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="HS code" error={errors.hsCode}>
                <input value={form.hsCode} onChange={update('hsCode')} placeholder="8471.30" className={inputClass(errors.hsCode)} />
              </Field>
              <Field label="Customs value (S$)" error={errors.declaredValue}>
                <input type="number" min="0" value={form.declaredValue} onChange={update('declaredValue')} placeholder="5000" className={inputClass(errors.declaredValue)} />
              </Field>
              <Field label="Weight (kg)" error={errors.weight}>
                <input type="number" min="0" value={form.weight} onChange={update('weight')} placeholder="120" className={inputClass(errors.weight)} />
              </Field>
              <Field label="Pieces">
                <input type="number" min="1" value={form.pieces} onChange={update('pieces')} className={inputClass()} />
              </Field>
              <Field label="Cargo description" error={errors.cargoDescription}>
                <input value={form.cargoDescription} onChange={update('cargoDescription')} placeholder="e.g. Electronic components, retail packaged" className={inputClass(errors.cargoDescription)} />
              </Field>
            </div>

            <div className="rounded-2xl border border-dashed border-slate-300 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Upload className="w-4 h-4 text-slate-500" />
                <p className="text-xs font-bold text-slate-700">Required documents</p>
              </div>
              <ul className="space-y-1 mb-3">
                {requiredDocs.map((d) => (
                  <li key={d} className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <FileText className="w-3 h-3 shrink-0" /> {d}
                  </li>
                ))}
              </ul>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.docsAcknowledged}
                  onChange={(e) => setForm((f) => ({ ...f, docsAcknowledged: e.target.checked }))}
                  className="mt-0.5"
                />
                <span className="text-[11px] text-slate-600">
                  I can provide these documents for customs clearance after booking.
                </span>
              </label>
              {errors.docsAcknowledged && <p className="text-[11px] text-red-500 font-semibold mt-1">{errors.docsAcknowledged}</p>}
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card sticky top-24 space-y-5">
            <div className="flex items-center gap-2 rounded-xl border border-dashed border-slate-200 p-3">
              <ShieldCheck className="w-4 h-4 text-orange-500 shrink-0" />
              <p className="text-[11px] text-slate-500">TradeNet permit is filed on your behalf once documents are uploaded</p>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 mb-1">Estimated price</p>
              <p className="text-3xl font-black text-slate-900">S$ {estimatedPrice}</p>
              <p className="text-[11px] text-slate-400 mt-1">Freight + customs handling, duties billed separately</p>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-orange-500 shrink-0" /> Singapore → {form.destinationCountry}</div>
              <div className="flex items-center gap-2"><selectedMode.icon className="w-3.5 h-3.5 text-orange-500 shrink-0" /> {selectedMode.label} freight · {form.incoterm}</div>
              <div className="flex items-center gap-2"><Package className="w-3.5 h-3.5 text-orange-500 shrink-0" /> {form.pieces} × {form.packageType} ({form.weight || '10'} kg)</div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm py-3.5 rounded-xl shadow-orange-sm transition-colors cursor-pointer"
            >
              Confirm international booking
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab && setActiveTab('domestic-shipment')}
              className="w-full text-center text-xs text-slate-500 hover:text-orange-600 font-semibold transition-colors cursor-pointer"
            >
              Shipping within Singapore instead? Go to Domestic Shipment →
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
