import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  FileCheck, 
  ClipboardList, 
  ChevronRight, 
  X, 
  Plane, 
  Truck,
  MessageSquare,
  Trash2,
  Clock 
} from 'lucide-react';
import { 
  getAdminChatSessions, 
  deleteCustomerChatsOnRequest 
} from '../../services/chatStorageService';

export const CustomersTab = ({
  customers = [],
  shipments = [],
  serviceRequests = [],
  documents = [],
  onViewShipment,
  onViewRequest
}) => {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeCustomerSubTab, setActiveCustomerSubTab] = useState('profile'); // 'profile' | 'shipments' | 'requests' | 'documents'

  const filtered = customers.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.company?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q)
    );
  });

  // Calculate linked items for a selected customer
  const getCustomerShipments = (cust) => {
    if (!cust) return [];
    const name = cust.name?.toLowerCase();
    const comp = cust.company?.toLowerCase();
    return shipments.filter(s => {
      const cName = (s.customer || s.customerName || s.sender || '').toLowerCase();
      return (name && cName.includes(name)) || (comp && cName.includes(comp));
    });
  };

  const getCustomerRequests = (cust) => {
    if (!cust) return [];
    const name = cust.name?.toLowerCase();
    const comp = cust.company?.toLowerCase();
    return serviceRequests.filter(r => {
      const cName = (r.customer || r.customerName || '').toLowerCase();
      const cEmail = (r.email || r.customerEmail || '').toLowerCase();
      return (name && cName.includes(name)) || (comp && cName.includes(comp)) || (cEmail && cEmail === cust.email?.toLowerCase());
    });
  };

  const getCustomerDocuments = (cust) => {
    if (!cust) return [];
    const name = cust.name?.toLowerCase();
    const comp = cust.company?.toLowerCase();
    return documents.filter(d => {
      const cName = (d.customerName || '').toLowerCase();
      return (name && cName.includes(name)) || (comp && cName.includes(comp));
    });
  };

  const [chatRefreshKey, setChatRefreshKey] = useState(0);
  const [chatActionMsg, setChatActionMsg] = useState(null);

  const getCustomerChats = (cust) => {
    if (!cust) return [];
    const all = getAdminChatSessions();
    const name = cust.name?.toLowerCase();
    const email = cust.email?.toLowerCase();
    return all.filter(s => {
      const cEmail = s.customerEmail?.toLowerCase();
      const cName = s.customerName?.toLowerCase();
      return (email && cEmail && (cEmail === email || cEmail.includes(email))) ||
             (name && cName && (cName === name || cName.includes(name)));
    });
  };

  const activeShipments = selectedCustomer ? getCustomerShipments(selectedCustomer) : [];
  const activeRequests = selectedCustomer ? getCustomerRequests(selectedCustomer) : [];
  const activeDocs = selectedCustomer ? getCustomerDocuments(selectedCustomer) : [];
  const activeChats = selectedCustomer ? getCustomerChats(selectedCustomer) : [];

  const handleDeleteThisCustomerChats = () => {
    if (!selectedCustomer) return;
    const identifier = selectedCustomer.email || selectedCustomer.name;
    const deletedCount = deleteCustomerChatsOnRequest(identifier);
    setChatRefreshKey(k => k + 1);
    setChatActionMsg(`Deleted ${deletedCount} chat session(s) for ${selectedCustomer.name} on request.`);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black text-[#2463EB] uppercase tracking-wider bg-[#EAF2FF] px-2.5 py-0.5 rounded-full border border-[#DCE5F0]">
              Corporate Accounts
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">
              {customers.length} Client Profiles
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">Customer Relationship Management</h2>
          <p className="text-xs text-slate-500">
            Customer profile, company, contact details, shipment history, service requests, and compliance documents.
          </p>
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
            placeholder="Search customer by name, company, email or phone..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-blue shadow-2xs"
          />
        </div>
      </div>

      {/* Customer Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => {
          const custShipments = getCustomerShipments(c);
          const custRequests = getCustomerRequests(c);
          const custDocs = getCustomerDocuments(c);

          return (
            <div
              key={c.id || c.name}
              onClick={() => {
                setSelectedCustomer(c);
                setActiveCustomerSubTab('profile');
              }}
              className="p-5 rounded-2xl border border-slate-200 hover:border-[#2463EB] hover:shadow-md transition-all cursor-pointer bg-white group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-[#EAF2FF] text-[#2463EB] flex items-center justify-center font-black text-sm group-hover:bg-[#2463EB] group-hover:text-white transition-colors">
                    {(c.name || 'C')[0]}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {c.tier || 'Enterprise Account'}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#2463EB] transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-600 flex items-center space-x-1.5 mt-0.5">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    <span>{c.company || 'Corporate Client'}</span>
                  </p>
                </div>

                <div className="space-y-1 text-xs text-slate-500">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{c.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{c.phone}</span>
                  </div>
                </div>
              </div>

              {/* Summary Badges */}
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                <div className="bg-slate-50 p-1.5 rounded-lg">
                  <span className="text-slate-400 block">Shipments</span>
                  <span className="text-slate-800 text-xs font-mono">{custShipments.length}</span>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-lg">
                  <span className="text-slate-400 block">Requests</span>
                  <span className="text-slate-800 text-xs font-mono">{custRequests.length}</span>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-lg">
                  <span className="text-slate-400 block">Docs</span>
                  <span className="text-slate-800 text-xs font-mono">{custDocs.length}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Customer Modal / 360 View */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B1F5B] to-slate-800 text-white font-black text-lg flex items-center justify-center shadow-xs">
                  {selectedCustomer.name[0]}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{selectedCustomer.name}</h3>
                  <p className="text-xs font-bold text-slate-500">{selectedCustomer.company}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2 text-xs font-bold">
              {[
                { id: 'profile', label: 'Profile & Account' },
                { id: 'shipments', label: `Shipment History (${activeShipments.length})` },
                { id: 'requests', label: `Service Requests (${activeRequests.length})` },
                { id: 'documents', label: `Documents (${activeDocs.length})` },
                { id: 'chats', label: `Support Chats (${activeChats.length})` },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCustomerSubTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                    activeCustomerSubTab === tab.id
                      ? 'bg-[#2463EB] text-white shadow-xs font-extrabold'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: PROFILE */}
            {activeCustomerSubTab === 'profile' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 font-bold block mb-1">Contact Email</span>
                    <span className="font-semibold text-slate-800 font-mono">{selectedCustomer.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block mb-1">Contact Phone</span>
                    <span className="font-semibold text-slate-800 font-mono">{selectedCustomer.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block mb-1">Registered Address</span>
                    <span className="font-semibold text-slate-800">{selectedCustomer.address || 'Singapore Commercial District'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block mb-1">Account Tier & Terms</span>
                    <span className="font-semibold text-slate-800">{selectedCustomer.tier || 'Enterprise'} ({selectedCustomer.paymentTerms || 'Net 30 Days'})</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: SHIPMENT HISTORY */}
            {activeCustomerSubTab === 'shipments' && (
              <div className="space-y-3 text-xs">
                {activeShipments.length === 0 ? (
                  <p className="text-center py-6 text-slate-400">No shipments found for this customer.</p>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                    {activeShipments.map(s => (
                      <div key={s.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50">
                        <div className="flex items-center space-x-3">
                          {s.service?.includes('Air') ? <Plane className="w-4 h-4 text-blue-500" /> : <Truck className="w-4 h-4 text-[#2463EB]" />}
                          <div>
                            <p className="font-mono font-bold text-slate-900">{s.id}</p>
                            <p className="text-[10px] text-slate-400">{s.origin} ➔ {s.destination}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                            {s.status}
                          </span>
                          <button
                            onClick={() => {
                              setSelectedCustomer(null);
                              onViewShipment(s);
                            }}
                            className="text-xs font-bold text-blue-600 hover:underline"
                          >
                            Details →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: SERVICE REQUESTS */}
            {activeCustomerSubTab === 'requests' && (
              <div className="space-y-3 text-xs">
                {activeRequests.length === 0 ? (
                  <p className="text-center py-6 text-slate-400">No service requests on file.</p>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                    {activeRequests.map(r => (
                      <div key={r.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50">
                        <div>
                          <p className="font-mono font-bold text-slate-900">#{r.id} - {r.service}</p>
                          <p className="text-[10px] text-slate-400">{r.date || r.createdAt} • {r.message || r.notes || 'Inquiry'}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {r.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: DOCUMENTS */}
            {activeCustomerSubTab === 'documents' && (
              <div className="space-y-3 text-xs">
                {activeDocs.length === 0 ? (
                  <p className="text-center py-6 text-slate-400">No documents on file for this customer.</p>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                    {activeDocs.map(d => (
                      <div key={d.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50">
                        <div className="flex items-center space-x-2.5">
                          <FileCheck className="w-4 h-4 text-purple-600" />
                          <div>
                            <p className="font-bold text-slate-900">{d.name}</p>
                            <p className="text-[10px] text-slate-400">{d.type} • Shipment: {d.shipmentId || 'N/A'}</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {d.status || 'Verified'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: SUPPORT CHATS */}
            {activeCustomerSubTab === 'chats' && (
              <div className="space-y-4 text-xs animate-fade-in">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-[#2463EB]" />
                      <span>JOSAN AI Stored Customer Chats</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Chats are stored only upon quote/contact request or user submission, and deleted after 30 days. Visible to admin staff only.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDeleteThisCustomerChats}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs self-start sm:self-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Customer's Chats on Request</span>
                  </button>
                </div>

                {chatActionMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold text-[11px]">
                    {chatActionMsg}
                  </div>
                )}

                {activeChats.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
                    <p className="font-bold">No stored support chats found for this customer.</p>
                    <p className="text-[11px] mt-1">Chats are stored to follow up on enquiry or quote requests and deleted after 30 days, visible to admin staff only.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeChats.map(session => (
                      <div key={session.sessionId} className="p-4 border border-slate-200 rounded-2xl bg-white space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-slate-900 text-[11px]">
                            Session: {session.sessionId}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(session.updatedAt || session.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-700 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono text-[11px]">
                          "{session.preview || 'Customer logistics inquiry'}"
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                          <span>{session.messageCount || 0} messages recorded</span>
                          <span className="font-medium text-slate-500">{session.purpose}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
