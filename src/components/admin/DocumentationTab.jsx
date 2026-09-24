import React, { useState } from 'react';
import { 
  FileCheck, 
  Search, 
  Upload, 
  Download, 
  Eye, 
  Filter, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trash2 
} from 'lucide-react';
import { safeDownloadPdf } from '../../utils/pdfDownload';

export const DocumentationTab = ({
  documents = [],
  onUploadDocument,
  onUpdateDocStatus,
  onDeleteDocument,
  onViewDocument
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // New doc form state
  const [newDocData, setNewDocData] = useState({
    name: '',
    type: 'Commercial Invoice',
    shipmentId: '',
    customerName: '',
    status: 'Pending',
    fileSize: '165 KB'
  });

  const docTypes = [
    'Commercial Invoice',
    'Packing List',
    'AWB',
    'Certificate of Origin',
    'Customs-related Documents',
    'Insurance Documents',
    'Other Shipment Documents'
  ];

  const docStatuses = ['Pending', 'Submitted', 'Under Review', 'Completed'];

  const filtered = documents.filter(d => {
    // Map legacy types or match directly
    const normalizedType = d.type?.includes('Customs') ? 'Customs-related Documents'
      : d.type?.includes('Insurance') ? 'Insurance Documents'
      : d.type?.includes('Invoice') ? 'Commercial Invoice'
      : d.type?.includes('Packing') ? 'Packing List'
      : d.type?.includes('AWB') ? 'AWB'
      : d.type?.includes('Origin') ? 'Certificate of Origin'
      : d.type || 'Other Shipment Documents';

    if (typeFilter !== 'All' && normalizedType !== typeFilter) return false;

    // Map legacy status or match directly
    const normalizedStatus = d.status === 'Verified' ? 'Completed'
      : d.status === 'Active' ? 'Submitted'
      : d.status === 'Active Policy' ? 'Completed'
      : d.status === 'Customs Cleared' ? 'Completed'
      : d.status === 'Completed & Signed' ? 'Completed'
      : d.status || 'Pending';

    if (statusFilter !== 'All' && normalizedStatus !== statusFilter) return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      d.name?.toLowerCase().includes(q) ||
      d.shipmentId?.toLowerCase().includes(q) ||
      d.customerName?.toLowerCase().includes(q) ||
      normalizedType.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Submitted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Under Review':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Completed':
      case 'Verified':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleDownload = (doc) => {
    safeDownloadPdf(doc.name, (pdf) => {
      pdf.setFontSize(16);
      pdf.setTextColor(11, 19, 43);
      pdf.text('JOSAN LOGISTICS PTE. LTD.', 20, 20);
      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139);
      pdf.text('Official Consignment Compliance Document', 20, 28);
      pdf.text(`Document Type: ${doc.type}`, 20, 36);
      pdf.text(`Document Reference: ${doc.id || 'DOC-GEN'}`, 20, 44);
      pdf.text(`Linked Shipment ID: ${doc.shipmentId || 'N/A'}`, 20, 52);
      pdf.text(`Customer Entity: ${doc.customerName || 'N/A'}`, 20, 60);
      pdf.text(`Document Status: ${doc.status || 'Verified'}`, 20, 68);
      pdf.text(`Archived Date: ${doc.uploadDate || '2026-09-21'}`, 20, 76);
      pdf.line(20, 84, 190, 84);
      pdf.setFontSize(11);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Certified authentic commercial logistics documentation under Singapore TradeNet.', 20, 95);
    });
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newDocData.name || !newDocData.shipmentId) return;

    onUploadDocument({
      ...newDocData,
      id: `DOC-${Date.now().toString().slice(-6)}`,
      uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    });

    setIsUploadOpen(false);
    setNewDocData({
      name: '',
      type: 'Commercial Invoice',
      shipmentId: '',
      customerName: '',
      status: 'Pending',
      fileSize: '165 KB'
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black text-purple-600 uppercase tracking-wider bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              Shipment Documentation
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">
              {filtered.length} Documents Registered
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">Documentation Management</h2>
          <p className="text-xs text-slate-500">
            Document status workflow: Pending → Submitted → Under Review → Completed
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="px-4 py-2.5 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-orange-sm transition-all flex items-center space-x-1.5 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by file name, shipment ID, or customer..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-orange shadow-2xs"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-500">Document Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="py-2 px-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus-orange cursor-pointer"
          >
            <option value="All">All Types ({documents.length})</option>
            {docTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
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
            {docStatuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
            <tr>
              <th className="p-3">Document Title & File</th>
              <th className="p-3">Type</th>
              <th className="p-3">Linked Shipment ID</th>
              <th className="p-3">Customer Entity</th>
              <th className="p-3">Size & Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Update Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400">
                  No documents found matching the filter criteria.
                </td>
              </tr>
            ) : (
              filtered.map((doc) => {
                const currentStatus = doc.status === 'Verified' ? 'Completed' 
                  : doc.status === 'Active' ? 'Submitted' 
                  : doc.status || 'Pending';

                return (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                          <FileCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 truncate max-w-[200px]" title={doc.name}>
                            {doc.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">ID: {doc.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-700">{doc.type}</span>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-900">
                      {doc.shipmentId || 'N/A'}
                    </td>
                    <td className="p-3 text-slate-700 truncate max-w-[130px]" title={doc.customerName}>
                      {doc.customerName || 'Corporate Client'}
                    </td>
                    <td className="p-3 text-slate-500 font-mono text-[11px]">
                      <p>{doc.fileSize || '180 KB'}</p>
                      <p className="text-[10px] text-slate-400">{doc.uploadDate || '2026-09-21'}</p>
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusBadge(currentStatus)}`}>
                        {currentStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={currentStatus}
                        onChange={(e) => onUpdateDocStatus(doc.id, e.target.value)}
                        className="py-1 px-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 cursor-pointer focus-orange"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        {onDeleteDocument && (
                          <button
                            onClick={() => onDeleteDocument(doc.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Upload Document Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Upload Shipment Document</h3>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Document File Name *</label>
                <input
                  type="text"
                  value={newDocData.name}
                  onChange={(e) => setNewDocData({ ...newDocData, name: e.target.value })}
                  placeholder="e.g. Commercial_Invoice_JOS-88190.pdf"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus-orange text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Document Type *</label>
                  <select
                    value={newDocData.type}
                    onChange={(e) => setNewDocData({ ...newDocData, type: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus-orange text-xs cursor-pointer"
                  >
                    {docTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Initial Status</label>
                  <select
                    value={newDocData.status}
                    onChange={(e) => setNewDocData({ ...newDocData, status: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus-orange text-xs cursor-pointer"
                  >
                    {docStatuses.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Linked Shipment ID *</label>
                  <input
                    type="text"
                    value={newDocData.shipmentId}
                    onChange={(e) => setNewDocData({ ...newDocData, shipmentId: e.target.value })}
                    placeholder="e.g. JOS-88190-SG"
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-800 focus-orange text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={newDocData.customerName}
                    onChange={(e) => setNewDocData({ ...newDocData, customerName: e.target.value })}
                    placeholder="e.g. Razer Asia-Pacific HQ"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus-orange text-xs"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl font-extrabold shadow-orange-sm transition-all cursor-pointer"
                >
                  Register Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
