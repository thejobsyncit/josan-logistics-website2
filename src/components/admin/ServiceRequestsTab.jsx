import React, { useState } from 'react';
import { 
  ClipboardList, 
  Search, 
  Clock, 
  CheckCircle2, 
  Eye, 
  Edit3, 
  Send, 
  Mail, 
  Phone, 
  X, 
  MessageSquare 
} from 'lucide-react';

export const ServiceRequestsTab = ({
  requests = [],
  onUpdateRequestStatus,
  onSaveAdminNote
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editingNote, setEditingNote] = useState('');

  const filtered = requests.filter(r => {
    if (statusFilter !== 'All' && r.status !== statusFilter) return false;
    if (serviceFilter !== 'All' && r.service !== serviceFilter) return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const cust = r.customer || r.customerName || '';
    return (
      r.id?.toLowerCase().includes(q) ||
      cust.toLowerCase().includes(q) ||
      r.service?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.message?.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Under Review':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Quoted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Completed':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleOpenReview = (req) => {
    setSelectedRequest(req);
    setEditingNote(req.adminNotes || '');
  };

  const handleSaveNoteSubmit = (e) => {
    e.preventDefault();
    if (!selectedRequest) return;
    onSaveAdminNote(selectedRequest.id, editingNote);
    setSelectedRequest({
      ...selectedRequest,
      adminNotes: editingNote
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black text-amber-600 uppercase tracking-wider bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Customer Inquiries
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">
              {filtered.length} Requests
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">Service Requests & Inquiries</h2>
          <p className="text-xs text-slate-500">
            Review Request ID, customer, service, contact information, date, message, status, and admin notes.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Request ID, customer, service, email, notes..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-orange shadow-2xs"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-500">Service:</span>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="py-2 px-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-orange cursor-pointer"
          >
            <option value="All">All Services</option>
            <option value="Airway Services">Airway Services</option>
            <option value="Road Transportation">Road Transportation</option>
            <option value="Documentation">Documentation</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-orange cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Quoted">Quoted</option>
            <option value="Approved">Approved</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Service Requests Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
            <tr>
              <th className="p-3">Request ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Service</th>
              <th className="p-3">Contact Information</th>
              <th className="p-3">Date</th>
              <th className="p-3">Message / Details</th>
              <th className="p-3">Status</th>
              <th className="p-3">Admin Notes</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-slate-400">
                  No service requests found.
                </td>
              </tr>
            ) : (
              filtered.map((req) => {
                const custName = req.customer || req.customerName || 'Inquiry Contact';
                const custEmail = req.email || req.customerEmail || 'N/A';
                const custPhone = req.phone || req.customerPhone || 'N/A';
                const reqDate = req.date || req.createdAt?.split(' ')[0] || '2026-09-21';
                const messageText = req.message || req.notes || req.cargoCategory || 'Service inquiry submission';

                return (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-900">
                      <button
                        onClick={() => handleOpenReview(req)}
                        className="text-blue-600 hover:text-orange-600 hover:underline cursor-pointer"
                      >
                        #{req.id}
                      </button>
                    </td>
                    <td className="p-3 font-bold text-slate-900">
                      {custName}
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-700">{req.service}</span>
                    </td>
                    <td className="p-3 text-slate-600">
                      <p className="font-mono text-[11px]">{custEmail}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{custPhone}</p>
                    </td>
                    <td className="p-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {reqDate}
                    </td>
                    <td className="p-3 text-slate-600 max-w-[160px] truncate" title={messageText}>
                      {messageText}
                    </td>
                    <td className="p-3">
                      <select
                        value={req.status}
                        onChange={(e) => onUpdateRequestStatus(req.id, e.target.value)}
                        className={`py-1 px-2 rounded-lg text-[10px] font-extrabold border cursor-pointer ${getStatusBadge(req.status)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Quoted">Quoted</option>
                        <option value="Approved">Approved</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="p-3 text-slate-600 max-w-[140px] truncate" title={req.adminNotes || 'No notes'}>
                      {req.adminNotes ? (
                        <span className="font-medium text-slate-800 bg-amber-50 px-2 py-0.5 rounded text-[10px] border border-amber-200">
                          {req.adminNotes}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Add note...</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleOpenReview(req)}
                        className="px-3 py-1 bg-slate-100 hover:bg-[#FF6B00] hover:text-white text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono text-orange-600 font-extrabold">#{selectedRequest.id}</span>
                <h3 className="text-base font-extrabold text-slate-900">Service Request Details</h3>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block font-bold">Customer</span>
                  <span className="font-bold text-slate-900">{selectedRequest.customer || selectedRequest.customerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">Requested Service</span>
                  <span className="font-bold text-slate-900">{selectedRequest.service}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">Contact Email</span>
                  <span className="font-mono text-slate-800">{selectedRequest.email || selectedRequest.customerEmail || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">Contact Phone</span>
                  <span className="font-mono text-slate-800">{selectedRequest.phone || selectedRequest.customerPhone || 'N/A'}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block font-bold mb-1">Inquiry Details / Message</span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 leading-relaxed font-medium">
                  {selectedRequest.message || selectedRequest.notes || 'Inquiry details regarding shipment and support.'}
                </div>
              </div>

              <div>
                <label className="text-slate-700 block font-bold mb-1">Status</label>
                <select
                  value={selectedRequest.status}
                  onChange={(e) => {
                    onUpdateRequestStatus(selectedRequest.id, e.target.value);
                    setSelectedRequest({
                      ...selectedRequest,
                      status: e.target.value
                    });
                  }}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus-orange text-xs cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Quoted">Quoted</option>
                  <option value="Approved">Approved</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <form onSubmit={handleSaveNoteSubmit} className="space-y-2">
                <label className="text-slate-700 block font-bold">Admin Notes</label>
                <textarea
                  rows={3}
                  value={editingNote}
                  onChange={(e) => setEditingNote(e.target.value)}
                  placeholder="Internal notes regarding partner assignment, quote calculations, or customer requirements..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus-orange text-xs"
                />
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl font-extrabold shadow-orange-sm cursor-pointer"
                  >
                    Save Notes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
