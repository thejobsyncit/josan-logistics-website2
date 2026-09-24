import React, { useState } from 'react';
import { 
  X, 
  Package, 
  Plane, 
  Truck, 
  MapPin, 
  User, 
  Building2, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  Download 
} from 'lucide-react';
import { safeDownloadPdf } from '../../utils/pdfDownload';

export const ShipmentDetailsModal = ({
  shipment,
  onClose,
  onUpdateStatus
}) => {
  if (!shipment) return null;

  const isAir = shipment.service === 'Airway Services' || 
    shipment.serviceType?.toLowerCase().includes('air') || 
    shipment.type === 'air' ||
    shipment.mode === 'Air';

  const customerName = shipment.customer || shipment.customerName || shipment.sender || 'Corporate Account';
  const partnerName = shipment.transportationPartner || shipment.carrier || (isAir ? 'Singapore Airlines Cargo (SQ)' : 'Woodlands Linehaul Logistics Pte Ltd');

  const statuses = ['New', 'Documentation', 'Processing', 'In Transit', 'Delivered', 'Completed'];

  const handleDownloadSummary = () => {
    safeDownloadPdf(`Consignment_${shipment.id}`, (pdf) => {
      pdf.setFontSize(16);
      pdf.setTextColor(11, 19, 43);
      pdf.text('JOSAN LOGISTICS PTE. LTD.', 20, 20);
      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`Shipment Consignment Note: #${shipment.id}`, 20, 28);
      pdf.text(`Service: ${isAir ? 'Airway Services' : 'Road Transportation'}`, 20, 36);
      pdf.text(`Customer / Shipper: ${customerName}`, 20, 44);
      pdf.text(`Origin: ${shipment.origin || 'Singapore Central Freight Bay'}`, 20, 52);
      pdf.text(`Destination: ${shipment.destination || 'Singapore Receiving Bay'}`, 20, 60);
      pdf.text(`Status: ${shipment.status}`, 20, 68);
      pdf.text(`Operator: ${partnerName}`, 20, 76);
      pdf.line(20, 84, 190, 84);
      pdf.setFontSize(11);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Official dispatch verification record issued by Josan Logistics Admin Portal.', 20, 95);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${
              isAir ? 'bg-blue-600' : 'bg-orange-500'
            }`}>
              {isAir ? <Plane className="w-6 h-6" /> : <Truck className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-black text-lg text-slate-900">#{shipment.id}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  isAir ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'
                }`}>
                  {isAir ? 'Airway Services' : 'Road Transportation'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Customer: {customerName}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadSummary}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Download Consignment Summary"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 6-Stage Pipeline Progress Bar */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Shipment Pipeline Status
          </label>
          <div className="grid grid-cols-6 gap-1 bg-slate-100 p-1.5 rounded-xl">
            {statuses.map((st, idx) => {
              const currentIdx = statuses.indexOf(shipment.status);
              const isPastOrCurrent = currentIdx >= idx;
              const isCurrent = shipment.status === st;

              return (
                <button
                  key={st}
                  onClick={() => onUpdateStatus(shipment.id, st)}
                  className={`py-1.5 px-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer text-center truncate ${
                    isCurrent
                      ? 'bg-[#FF6B00] text-white shadow-xs'
                      : isPastOrCurrent
                      ? 'bg-slate-300 text-slate-800'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title={`Set status to ${st}`}
                >
                  {st}
                </button>
              );
            })}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
            <h4 className="font-extrabold text-slate-900 flex items-center space-x-1.5 border-b border-slate-200 pb-2">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              <span>Route & Locations</span>
            </h4>
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase block">Origin Location</span>
              <span className="font-semibold text-slate-800">{shipment.origin || 'Singapore Logistics Hub'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase block">Destination Location</span>
              <span className="font-semibold text-slate-800">{shipment.destination || 'Singapore Receiving Bay'}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
            <h4 className="font-extrabold text-slate-900 flex items-center space-x-1.5 border-b border-slate-200 pb-2">
              <Building2 className="w-3.5 h-3.5 text-blue-500" />
              <span>{isAir ? 'Carrier & AWB' : 'Transportation Partner'}</span>
            </h4>
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase block">
                {isAir ? 'Airline Carrier Support' : 'Transportation Partner'}
              </span>
              <span className="font-semibold text-slate-800">{partnerName}</span>
            </div>
            {isAir ? (
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase block">AWB Number</span>
                <span className="font-mono font-bold text-blue-600">{shipment.awbNumber || `AWB-${shipment.id.slice(-6)}`}</span>
              </div>
            ) : (
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Partner Vehicle & Driver</span>
                <span className="font-semibold text-slate-800">
                  {shipment.vehiclePlate || 'SG-8819'} • {shipment.driverName || 'Partner Driver'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Cargo & Goods Info */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
          <h4 className="font-extrabold text-slate-900 flex items-center space-x-1.5">
            <Package className="w-3.5 h-3.5 text-slate-500" />
            <span>Commercial Cargo Information</span>
          </h4>
          <div className="grid grid-cols-3 gap-2 pt-1 font-semibold text-slate-700">
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase block">Cargo Type</span>
              <span>{shipment.cargoType || 'Commercial Goods'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase block">Total Weight</span>
              <span>{shipment.weight || '1,850 kg'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase block">Billing Total</span>
              <span className="font-mono font-bold text-slate-900">{shipment.price || 'S$ 740.00'}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export const CreateShipmentModal = ({
  isOpen,
  onClose,
  onCreateShipment,
  partners = []
}) => {
  const [formData, setFormData] = useState({
    service: 'Road Transportation',
    customer: '',
    senderPhone: '',
    origin: '',
    destination: '',
    cargoType: 'Commercial Electronics',
    weight: '1,200 kg',
    price: 'S$ 650.00',
    transportationPartner: 'Woodlands Linehaul Logistics Pte Ltd',
    vehiclePlate: 'SG-8819',
    driverName: 'Tan Wei Ming',
    awbNumber: '',
    carrierSupport: 'Singapore Airlines Cargo (SQ)'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customer || !formData.origin || !formData.destination) return;

    const isAir = formData.service === 'Airway Services';
    const newId = isAir 
      ? `AWB-${Math.floor(100000 + Math.random() * 900000)}` 
      : `JOS-${Math.floor(10000 + Math.random() * 90000)}-SG`;

    onCreateShipment({
      ...formData,
      id: newId,
      status: 'New',
      createdDate: new Date().toISOString()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-900">Create New Consignment</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-medium">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Service Type *</label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-orange cursor-pointer"
              >
                <option value="Road Transportation">Road Transportation</option>
                <option value="Airway Services">Airway Services</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Customer / Shipper *</label>
              <input
                type="text"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                placeholder="e.g. Razer Asia-Pacific HQ"
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-orange"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Pickup / Origin *</label>
              <input
                type="text"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                placeholder="e.g. Jurong Logistics Hub"
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 text-xs focus-orange"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Delivery / Destination *</label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="e.g. Woodlands Industrial Estate"
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 text-xs focus-orange"
              />
            </div>
          </div>

          {formData.service === 'Road Transportation' ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Transportation Partner</label>
                <select
                  value={formData.transportationPartner}
                  onChange={(e) => setFormData({ ...formData, transportationPartner: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 text-xs focus-orange cursor-pointer"
                >
                  <option value="Woodlands Linehaul Logistics Pte Ltd">Woodlands Linehaul Logistics</option>
                  <option value="Tuas Prime Haulage Pte Ltd">Tuas Prime Haulage</option>
                  <option value="Jurong Freight Express Partners">Jurong Freight Express Partners</option>
                  <option value="Changi Feeder Transport Co.">Changi Feeder Transport Co.</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Partner Vehicle Plate</label>
                <input
                  type="text"
                  value={formData.vehiclePlate}
                  onChange={(e) => setFormData({ ...formData, vehiclePlate: e.target.value })}
                  placeholder="e.g. SG-8819"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-800 text-xs focus-orange"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Airline Carrier Support</label>
                <input
                  type="text"
                  value={formData.carrierSupport}
                  onChange={(e) => setFormData({ ...formData, carrierSupport: e.target.value })}
                  placeholder="e.g. Singapore Airlines Cargo (SQ)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 text-xs focus-orange"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">AWB Number (Optional)</label>
                <input
                  type="text"
                  value={formData.awbNumber}
                  onChange={(e) => setFormData({ ...formData, awbNumber: e.target.value })}
                  placeholder="e.g. AWB-618-992102"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 text-xs focus-orange"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Goods Description</label>
              <input
                type="text"
                value={formData.cargoType}
                onChange={(e) => setFormData({ ...formData, cargoType: e.target.value })}
                placeholder="e.g. Precision Machinery"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 text-xs focus-orange"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Billing Amount (S$)</label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g. S$ 750.00"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 text-xs focus-orange"
              />
            </div>
          </div>

          <div className="flex space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl font-extrabold shadow-orange-sm transition-all cursor-pointer"
            >
              Create Shipment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
