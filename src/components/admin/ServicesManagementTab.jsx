import React, { useState } from 'react';
import { 
  Sliders, 
  Plane, 
  Truck, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Edit3, 
  ExternalLink,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const ServicesManagementTab = ({
  managedServices = {},
  onToggleService,
  onUpdateService
}) => {
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', badge: '', description: '' });

  const serviceIcons = {
    airway: Plane,
    road: Truck,
    documentation: FileText
  };

  const serviceRoutes = {
    airway: { label: '/#air-freight (Airway Services)', hash: '#air-freight' },
    road: { label: '/#road-transportation (Road Transportation)', hash: '#road-freight' },
    documentation: { label: '/#customs-clearance (Documentation Support)', hash: '#customs-clearance' }
  };

  const handleStartEdit = (svc) => {
    setEditingServiceId(svc.id);
    setEditForm({
      name: svc.name,
      badge: svc.badge || '',
      description: svc.description || ''
    });
  };

  const handleSaveEdit = (serviceId) => {
    onUpdateService(serviceId, editForm);
    setEditingServiceId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* 1. Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-black text-slate-900 font-heading">Public Website Services Management</h2>
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#2463EB]/10 text-[#2463EB] border border-[#2463EB]/20">
            Availability Controller
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Enable or temporarily pause public customer booking requests for Airway, Road Transportation, or Documentation services.
        </p>
      </div>

      {/* 2. Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(managedServices).map(([key, svc]) => {
          const IconComp = serviceIcons[key] || Sliders;
          const routeInfo = serviceRoutes[key];
          const isEditing = editingServiceId === key;

          return (
            <div
              key={key}
              className={`bg-white rounded-3xl border transition-all p-6 flex flex-col justify-between shadow-card relative overflow-hidden ${
                svc.active ? 'border-slate-200 hover:border-slate-300' : 'border-slate-200 bg-slate-50/70 opacity-90'
              }`}
            >
              {/* Top Accent Strip */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${svc.active ? 'bg-[#2463EB]' : 'bg-slate-300'}`} />

              <div className="space-y-4">
                {/* Header Row: Icon + Toggle */}
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    svc.active ? 'bg-[#EAF2FF] text-[#2463EB]' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <IconComp className="w-6 h-6" />
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => onToggleService(key)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        svc.active ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                      title={svc.active ? 'Click to Pause Service' : 'Click to Activate Service'}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          svc.active ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Service Details / Edit Form */}
                {isEditing ? (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 uppercase">Service Name</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 uppercase">Badge Label</label>
                      <input
                        type="text"
                        value={editForm.badge}
                        onChange={(e) => setEditForm({ ...editForm, badge: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 uppercase">Description</label>
                      <textarea
                        rows="2"
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div className="flex items-center justify-end space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingServiceId(null)}
                        className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(key)}
                        className="px-3.5 py-1 bg-[#2463EB] text-white rounded-lg text-xs font-extrabold shadow-sm"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-extrabold text-slate-900 text-base">{svc.name}</h3>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(svc)}
                        className="p-1 text-slate-400 hover:text-[#2463EB] rounded-lg transition-colors cursor-pointer"
                        title="Edit Service Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                      {svc.badge}
                    </span>

                    <p className="text-xs text-slate-600 leading-relaxed pt-1">
                      {svc.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Status & Public Website Route */}
              <div className="pt-6 border-t border-slate-100 mt-6 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Website Booking:</span>
                  <span className={`font-extrabold flex items-center space-x-1 ${
                    svc.active ? 'text-emerald-600' : 'text-slate-400'
                  }`}>
                    {svc.active ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Enabled & Receiving Requests</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Paused / Under Maintenance</span>
                      </>
                    )}
                  </span>
                </div>

                {routeInfo && (
                  <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-[11px] text-slate-600">
                    <span className="font-mono font-medium truncate">{routeInfo.label}</span>
                    <a
                      href={`/${routeInfo.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2463EB] hover:underline flex items-center space-x-1 shrink-0 font-bold ml-2"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
