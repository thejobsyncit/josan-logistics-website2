import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Upload, 
  Download, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trash2, 
  X, 
  Printer, 
  FileCheck, 
  Building2, 
  ShieldCheck, 
  FileSpreadsheet,
  Layers,
  FileQuestion,
  LayoutGrid,
  List,
  ArrowUpDown,
  Filter,
  Check
} from 'lucide-react';

export const DOCUMENT_CATEGORIES = [
  'All',
  'Commercial Invoice',
  'Packing List',
  'Certificate of Origin',
  'AWB documents',
  'Other shipment documents'
];

/**
 * Format raw file name into clean, human-readable title
 */
const formatDocTitle = (rawName = '') => {
  if (!rawName) return 'Untitled Document';
  // Remove .pdf or other extension for title display
  const withoutExt = rawName.replace(/\.[a-zA-Z0-9]+$/, '');
  // Replace underscores and multiple dashes with clean spaces
  return withoutExt.replace(/[_-]+/g, ' ').trim();
};

/**
 * Extract file extension
 */
const getFileExtension = (name = '') => {
  const match = name.match(/\.([a-zA-Z0-9]+)$/);
  return match ? match[1].toUpperCase() : 'PDF';
};

export const CrmDocumentsTab = ({
  documents = [],
  customers = [],
  airwayRequests = [],
  shipments = [],
  onUploadDocument,
  onDeleteDocument,
  onUpdateDocumentStatus,
  selectedDocFromSearch = null
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'name'
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = viewMode === 'table' ? 10 : 9;

  // Modals state
  const [viewingDoc, setViewingDoc] = useState(selectedDocFromSearch);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // New Document Upload State
  const [newDocData, setNewDocData] = useState({
    name: '',
    type: 'Commercial Invoice',
    customerName: '',
    shipmentId: '',
    fileSize: '240 KB',
    status: 'Verified',
    notes: ''
  });

  // Calculate summary counts
  const stats = useMemo(() => {
    const total = documents.length;
    const verified = documents.filter(d => d.status === 'Verified' || d.status === 'Completed & Signed').length;
    const cleared = documents.filter(d => d.status === 'Customs Cleared' || d.status === 'Cleared').length;
    const pending = documents.filter(d => d.status === 'Pending Review' || d.status === 'Draft' || d.status === 'Active').length;
    return { total, verified, cleared, pending };
  }, [documents]);

  // Filter and sort logic
  const filteredDocuments = useMemo(() => {
    let result = documents.filter(doc => {
      const term = search.trim().toLowerCase();
      const matchesSearch = !term ||
        doc.name?.toLowerCase().includes(term) ||
        doc.type?.toLowerCase().includes(term) ||
        doc.customerName?.toLowerCase().includes(term) ||
        doc.shipmentId?.toLowerCase().includes(term);

      const matchesCategory = categoryFilter === 'All' || doc.type === categoryFilter ||
        (categoryFilter === 'AWB documents' && (doc.type?.includes('AWB') || doc.docCategory === 'awb')) ||
        (categoryFilter === 'Other shipment documents' && !['Commercial Invoice', 'Packing List', 'Certificate of Origin'].includes(doc.type));

      const matchesStatus = statusFilter === 'All' || doc.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    if (sortBy === 'name') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => (a.id || 0) - (b.id || 0));
    } else {
      // Default: newest first (higher ID or later upload)
      result.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return result;
  }, [documents, search, categoryFilter, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredDocuments.length / pageSize));
  const paginatedDocs = filteredDocuments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getDocTypeIcon = (type) => {
    switch (type) {
      case 'Commercial Invoice':
        return <FileSpreadsheet className="w-4 h-4 text-blue-600" />;
      case 'Packing List':
        return <Layers className="w-4 h-4 text-emerald-600" />;
      case 'Certificate of Origin':
        return <ShieldCheck className="w-4 h-4 text-amber-600" />;
      case 'AWB documents':
      case 'Air Waybill (AWB)':
        return <FileCheck className="w-4 h-4 text-purple-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };

  const getDocTypeBg = (type) => {
    switch (type) {
      case 'Commercial Invoice':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Packing List':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Certificate of Origin':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'AWB documents':
      case 'Air Waybill (AWB)':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified':
      case 'Completed & Signed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Customs Cleared':
      case 'Cleared':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending Review':
      case 'Active':
      case 'Draft':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!newDocData.name || !newDocData.type) return;

    onUploadDocument({
      ...newDocData,
      customerName: newDocData.customerName || 'Commercial Client',
      shipmentId: newDocData.shipmentId || 'GENERAL'
    });

    setIsUploadOpen(false);
    setNewDocData({
      name: '',
      type: 'Commercial Invoice',
      customerName: '',
      shipmentId: '',
      fileSize: '240 KB',
      status: 'Verified',
      notes: ''
    });
  };

  const handleDownloadMockFile = (doc) => {
    const element = document.createElement('a');
    const file = new Blob([
      `JOSAN LOGISTICS OFFICIAL SHIPMENT DOCUMENT\n` +
      `-----------------------------------------\n` +
      `Document Name: ${doc.name}\n` +
      `Document Type: ${doc.type}\n` +
      `Document ID: ${doc.id}\n` +
      `Reference Consignment/Request: ${doc.shipmentId || 'N/A'}\n` +
      `Customer Account: ${doc.customerName}\n` +
      `Verification Status: ${doc.status}\n` +
      `Upload Date: ${doc.uploadDate}\n` +
      `Certified by: Josan Logistics Pte Ltd (Singapore)\n`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = doc.name.endsWith('.pdf') ? doc.name.replace('.pdf', '.txt') : `${doc.name}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Top Banner & Quick Metrics */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading tracking-tight">
                Shipment Documents Vault
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-purple-100 text-purple-700 border border-purple-200">
                {documents.length} Files
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Archived commercial invoices, packing lists, certificates of origin, and clearance permits.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2.5 bg-[#2463EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-black shadow-sm transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Stored</p>
              <p className="text-base font-black text-slate-900 leading-tight">{stats.total} Files</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verified</p>
              <p className="text-base font-black text-emerald-700 leading-tight">{stats.verified} Files</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customs Cleared</p>
              <p className="text-base font-black text-blue-700 leading-tight">{stats.cleared} Files</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Review</p>
              <p className="text-base font-black text-amber-700 leading-tight">{stats.pending} Files</p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Categories & View Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none text-xs font-bold">
          {DOCUMENT_CATEGORIES.map((cat) => {
            const isSelected = categoryFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => { setCategoryFilter(cat); setCurrentPage(1); }}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B1F5B] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* View Switcher Toggle */}
        <div className="flex items-center space-x-1.5 bg-white p-1 rounded-xl border border-slate-200 self-end lg:self-auto shrink-0 shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-[#0B1F5B] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="List / Table View (Recommended)"
          >
            <List className="w-3.5 h-3.5" />
            <span>Table View</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-[#0B1F5B] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Cards / Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid View</span>
          </button>
        </div>
      </div>

      {/* Search, Status & Sorting Bar */}
      <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap gap-2.5 items-center justify-between">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search documents by title, shipper name, or reference ID..."
            className="w-full pl-9 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2463EB]/20 focus:border-[#2463EB]"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Customs Cleared">Customs Cleared</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Active">Active</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name (A-Z)</option>
          </select>

          {(search || categoryFilter !== 'All' || statusFilter !== 'All' || sortBy !== 'newest') && (
            <button
              type="button"
              onClick={() => { setSearch(''); setCategoryFilter('All'); setStatusFilter('All'); setSortBy('newest'); }}
              className="text-slate-500 hover:text-slate-900 font-bold px-2 py-1 text-xs cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ======================================================================= */}
      {/* VIEW 1: CLEAN TABLE / LIST VIEW (RECOMMENDED)                           */}
      {/* ======================================================================= */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Document Title</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Shipper & Ref</th>
                  <th className="py-3 px-3">File Size & Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {paginatedDocs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                      No documents found matching the filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedDocs.map((doc) => {
                    const ext = getFileExtension(doc.name);
                    const cleanTitle = formatDocTitle(doc.name);

                    return (
                      <tr 
                        key={doc.id} 
                        className="hover:bg-slate-50/70 transition-colors group"
                      >
                        {/* Title & Type */}
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                              {getDocTypeIcon(doc.type)}
                            </div>
                            <div className="min-w-0 max-w-xs sm:max-w-sm">
                              <div className="flex items-center space-x-1.5">
                                <span 
                                  onClick={() => setViewingDoc(doc)}
                                  className="font-extrabold text-slate-900 hover:text-[#2463EB] transition-colors truncate cursor-pointer text-xs"
                                  title={doc.name}
                                >
                                  {cleanTitle}
                                </span>
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-black uppercase bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                                  {ext}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                                {doc.name}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getDocTypeBg(doc.type)}`}>
                            {doc.type}
                          </span>
                        </td>

                        {/* Shipper & Ref */}
                        <td className="py-3 px-3">
                          <div className="space-y-0.5">
                            <div className="flex items-center space-x-1 text-slate-800 font-bold truncate max-w-[180px]">
                              <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{doc.customerName || 'Standard Client'}</span>
                            </div>
                            <p className="text-[10px] font-mono text-slate-400">
                              Ref: #{doc.shipmentId || 'GENERAL'}
                            </p>
                          </div>
                        </td>

                        {/* Size & Date */}
                        <td className="py-3 px-3">
                          <div className="text-slate-600">
                            <span className="font-mono text-[11px] font-bold text-slate-700">{doc.fileSize}</span>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {doc.uploadDate?.split(',')[0] || 'Recent'}
                            </p>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3">
                          <select
                            value={doc.status}
                            onChange={(e) => onUpdateDocumentStatus(doc.id, e.target.value)}
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border cursor-pointer ${getStatusBadge(doc.status)} focus:outline-none`}
                          >
                            <option value="Verified">Verified</option>
                            <option value="Customs Cleared">Cleared</option>
                            <option value="Pending Review">Pending</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              type="button"
                              onClick={() => setViewingDoc(doc)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-[#2463EB] hover:text-white text-slate-700 font-bold text-[11px] rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
                              title="Preview Document"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Preview</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDownloadMockFile(doc)}
                              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="Download Document"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete document "${doc.name}"?`)) {
                                  onDeleteDocument(doc.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Document"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ======================================================================= */
        /* VIEW 2: CLEAN 3-COLUMN CARD / GRID VIEW                                 */
        /* ======================================================================= */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginatedDocs.length === 0 ? (
            <div className="col-span-full bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400 font-medium">
              No documents found matching the filter criteria.
            </div>
          ) : (
            paginatedDocs.map((doc) => {
              const ext = getFileExtension(doc.name);
              const cleanTitle = formatDocTitle(doc.name);

              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group space-y-3.5"
                >
                  {/* Card Top: Icon, Tag & Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                        {getDocTypeIcon(doc.type)}
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase bg-slate-100 text-slate-600 border border-slate-200">
                        {ext}
                      </span>
                    </div>

                    <select
                      value={doc.status}
                      onChange={(e) => onUpdateDocumentStatus(doc.id, e.target.value)}
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border cursor-pointer ${getStatusBadge(doc.status)} focus:outline-none`}
                    >
                      <option value="Verified">Verified</option>
                      <option value="Customs Cleared">Cleared</option>
                      <option value="Pending Review">Pending</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Document Title & Category */}
                  <div className="space-y-1">
                    <h4 
                      onClick={() => setViewingDoc(doc)}
                      className="font-black text-sm text-slate-900 group-hover:text-[#2463EB] transition-colors line-clamp-1 cursor-pointer tracking-tight"
                      title={doc.name}
                    >
                      {cleanTitle}
                    </h4>
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${getDocTypeBg(doc.type)}`}>
                      {doc.type}
                    </span>
                  </div>

                  {/* Metadata Box */}
                  <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100 space-y-1 text-[11px]">
                    <div className="flex items-center space-x-1.5 text-slate-700 font-bold truncate">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{doc.customerName || 'Commercial Client'}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-0.5">
                      <span>Ref: #{doc.shipmentId || 'GENERAL'}</span>
                      <span>{doc.fileSize}</span>
                    </div>
                  </div>

                  {/* Card Bottom: Date & Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {doc.uploadDate?.split(',')[0] || 'Recent'}
                    </span>

                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => setViewingDoc(doc)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-[#2463EB] hover:text-white text-slate-700 font-bold text-[11px] rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Preview</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadMockFile(doc)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete document "${doc.name}"?`)) {
                            onDeleteDocument(doc.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredDocuments.length)} of {filteredDocuments.length} files
          </span>
          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="px-3 py-1.5 bg-slate-100 disabled:opacity-40 rounded-lg font-bold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Previous
            </button>
            <span className="font-bold text-slate-800 px-2">{currentPage} / {totalPages}</span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 bg-slate-100 disabled:opacity-40 rounded-lg font-bold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 1: DOCUMENT PREVIEW MODAL                                         */}
      {/* ======================================================================= */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-fade-in space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF2FF] text-[#2463EB] flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900 line-clamp-1">{viewingDoc.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">ID: #{viewingDoc.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingDoc(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Digital Dossier Preview */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 font-sans">
                <div>
                  <span className="font-black text-sm text-[#0B1F5B] tracking-tight block">JOSAN LOGISTICS PTE LTD</span>
                  <span className="text-[10px] text-slate-500">Official Document Repository • Singapore</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${getStatusBadge(viewingDoc.status)}`}>
                  {viewingDoc.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px]">DOCUMENT TYPE</span>
                  <span className="font-bold text-slate-900">{viewingDoc.type}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">ASSOCIATED SHIPPER</span>
                  <span className="font-bold text-slate-900">{viewingDoc.customerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">CONSIGNMENT / REQ ID</span>
                  <span className="font-bold text-slate-900">#{viewingDoc.shipmentId || 'GENERAL'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">UPLOAD TIMESTAMP</span>
                  <span className="font-bold text-slate-900">{viewingDoc.uploadDate}</span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 text-center py-8 space-y-2">
                <FileCheck className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-sans font-extrabold text-slate-900 text-xs">Digital Verification Stamp Verified</p>
                <p className="text-[11px] text-slate-500 font-sans">
                  Digitally archived and verified under Josan Logistics compliance protocols.
                </p>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setViewingDoc(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center space-x-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadMockFile(viewingDoc)}
                  className="px-4 py-2 bg-[#2463EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold text-xs shadow-sm flex items-center space-x-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Document</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 2: UPLOAD SHIPMENT DOCUMENT                                       */}
      {/* ======================================================================= */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-fade-in space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-lg text-slate-900 font-heading">Upload Logistics Document</h3>
                <p className="text-xs text-slate-500">Commercial invoices, AWB manifests, and certificates</p>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs font-bold">
              <div>
                <label className="text-slate-700 block mb-1">Document Category *</label>
                <select
                  value={newDocData.type}
                  onChange={(e) => setNewDocData({ ...newDocData, type: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium cursor-pointer"
                >
                  <option value="Commercial Invoice">Commercial Invoice</option>
                  <option value="Packing List">Packing List</option>
                  <option value="Certificate of Origin">Certificate of Origin</option>
                  <option value="AWB documents">AWB documents (Master / House AWB)</option>
                  <option value="Customs Clearance Permit">Customs Clearance Permit</option>
                  <option value="Proof of Delivery (POD)">Proof of Delivery (POD)</option>
                  <option value="Other shipment documents">Other shipment documents</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">File Name *</label>
                <input
                  type="text"
                  required
                  value={newDocData.name}
                  onChange={(e) => setNewDocData({ ...newDocData, name: e.target.value })}
                  placeholder="e.g. Commercial_Invoice_77102.pdf"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#2463EB]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">Associated Customer</label>
                  <input
                    type="text"
                    value={newDocData.customerName}
                    onChange={(e) => setNewDocData({ ...newDocData, customerName: e.target.value })}
                    placeholder="e.g. Razer Asia-Pacific HQ"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Consignment / Request ID</label>
                  <input
                    type="text"
                    value={newDocData.shipmentId}
                    onChange={(e) => setNewDocData({ ...newDocData, shipmentId: e.target.value })}
                    placeholder="Your tracking number or AIR-0001"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">Document Status</label>
                  <select
                    value={newDocData.status}
                    onChange={(e) => setNewDocData({ ...newDocData, status: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium cursor-pointer"
                  >
                    <option value="Verified">Verified</option>
                    <option value="Customs Cleared">Customs Cleared</option>
                    <option value="Pending Review">Pending Review</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Simulated Size</label>
                  <input
                    type="text"
                    value={newDocData.fileSize}
                    onChange={(e) => setNewDocData({ ...newDocData, fileSize: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2463EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold cursor-pointer shadow-sm"
                >
                  Upload & Archive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
