import React, { useState } from 'react';
import { 
  Handshake, 
  Search, 
  Plus, 
  Building2, 
  Phone, 
  Mail, 
  Truck, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

export const TransportationPartnersTab = ({
  partners = [],
  onAddPartner,
  onUpdatePartner
}) => {
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    vehicleTypes: '14ft Box Trucks, 24ft Lorries',
    agreementStatus: 'Active Partner',
    operatingZones: 'Singapore Corridors'
  });

  const filtered = partners.filter(p => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.contactPerson?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.phone?.toLowerCase().includes(q)
    );
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newPartner.name || !newPartner.contactPerson) return;

    onAddPartner({
      ...newPartner,
      id: `PRT-${Date.now().toString().slice(-4)}`,
      registeredVehicles: 4,
      designatedDrivers: 4,
      activeDispatches: 2
    });

    setIsAddOpen(false);
    setNewPartner({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      vehicleTypes: '14ft Box Trucks, 24ft Lorries',
      agreementStatus: 'Active Partner',
      operatingZones: 'Singapore Corridors'
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
              Commercial Road Freight
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">
              {partners.length} Vetted Transportation Partners
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">Transportation Partners Network</h2>
          <p className="text-xs text-slate-500">
            Contracted third-party transportation companies executing commercial goods road transport across Singapore.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-orange-sm transition-all flex items-center space-x-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Transportation Partner</span>
        </button>
      </div>

      {/* Information Banner */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-slate-700">
            Josan engages contracted Transportation Partners for all linehaul and commercial road distribution, ensuring optimal capacity without fleet ownership overhead.
          </span>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transportation partner name, contact person, or email..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-orange shadow-2xs"
          />
        </div>
      </div>

      {/* Partners Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((p) => (
          <div
            key={p.id || p.name}
            className="p-5 rounded-2xl border border-slate-200 hover:border-orange-500 hover:shadow-md transition-all bg-white space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                  <Handshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">{p.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">Ref: {p.id}</p>
                </div>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                p.agreementStatus === 'Active Partner' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'
              }`}>
                {p.agreementStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1 text-slate-600">
                <div className="flex items-center space-x-1.5">
                  <User className="w-3 h-3 text-slate-400" />
                  <span className="font-semibold">{p.contactPerson}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span className="font-mono">{p.phone}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span className="truncate">{p.email}</span>
                </div>
              </div>

              <div className="space-y-1 text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Capacity & Service</p>
                <p className="text-[11px] font-semibold text-slate-800">{p.vehicleTypes}</p>
                <p className="text-[10px] text-slate-500">{p.operatingZones || 'Singapore Regional Roadways'}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
              <span className="flex items-center space-x-1">
                <Truck className="w-3.5 h-3.5 text-slate-400" />
                <span>Partner Vehicle Support</span>
              </span>
              <span className="text-orange-600 font-bold">Standard Commercial SLA</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Partner Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Add Transportation Partner</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Company / Partner Name *</label>
                <input
                  type="text"
                  value={newPartner.name}
                  onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                  placeholder="e.g. Jurong Expressway Haulage Pte Ltd"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus-orange text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Contact Person *</label>
                  <input
                    type="text"
                    value={newPartner.contactPerson}
                    onChange={(e) => setNewPartner({ ...newPartner, contactPerson: e.target.value })}
                    placeholder="e.g. Tan Ah Hock"
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus-orange text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={newPartner.phone}
                    onChange={(e) => setNewPartner({ ...newPartner, phone: e.target.value })}
                    placeholder="e.g. +65 6789 0123"
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus-orange text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email *</label>
                  <input
                    type="email"
                    value={newPartner.email}
                    onChange={(e) => setNewPartner({ ...newPartner, email: e.target.value })}
                    placeholder="dispatch@partner.com"
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus-orange text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Vehicle / Fleet Types</label>
                  <input
                    type="text"
                    value={newPartner.vehicleTypes}
                    onChange={(e) => setNewPartner({ ...newPartner, vehicleTypes: e.target.value })}
                    placeholder="e.g. 14ft Box Vans, 24ft Lorries"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus-orange text-xs"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl font-extrabold shadow-orange-sm transition-all cursor-pointer"
                >
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
