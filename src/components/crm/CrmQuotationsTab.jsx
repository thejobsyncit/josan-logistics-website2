import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Send, 
  Printer, 
  Check, 
  X,
  TrendingUp,
  Save,
  Edit3
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';

export const QUOTE_STATUS_OPTIONS = [
  'Requested',
  'Draft',
  'Sent',
  'Accepted',
  'Rejected',
  'Expired',
  'Test'
];

/**
 * Calculates Base Amount and Total Quoted Amount (without automatic GST)
 */
export const calculateQuoteAmounts = (quote) => {
  if (!quote) return { baseAmount: null, marketSurcharge: 0, gst: 0, totalAmount: null, staffPriced: false };

  const staffPriced = Boolean(quote.staffPriced);
  const total = staffPriced && (quote.total !== null || quote.amount !== null)
    ? Number(quote.total ?? quote.amount ?? 0)
    : null;

  return {
    baseAmount: total,
    marketSurcharge: 0,
    gst: 0,
    totalAmount: total,
    staffPriced
  };
};

/**
 * Generates a unique quotation ID if not provided
 */
export const generateUniqueQuoteId = (existingQuotes = []) => {
  const existingSet = new Set(
    existingQuotes.map(q => (q.id || '').toString().toUpperCase())
  );
  for (let attempt = 0; attempt < 25; attempt++) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const candidate = `QR-${randomSuffix}-${Math.floor(1000 + Math.random() * 9000)}`;
    if (!existingSet.has(candidate)) {
      return candidate;
    }
  }
  return `QR-${Date.now().toString().slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`;
};

export const CrmQuotationsTab = ({
  quotes = [],
  customers = [],
  airwayRequests = [],
  shipments = [],
  onCreateQuotation,
  onSendQuote,
  onUpdateQuoteStatus,
  onConvertQuote,
  onUpdateQuotePricing,
  selectedQuoteFromSearch = null
}) => {
  const { siteSettings, updateAdminQuote, showToast } = useLogistics?.() || {};
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals state
  const [viewingQuote, setViewingQuote] = useState(selectedQuoteFromSearch);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Staff Price Editing State (Single "Quoted amount (S$)" saved by staff)
  const [quotedAmountInput, setQuotedAmountInput] = useState('');
  const [staffNotesInput, setStaffNotesInput] = useState('');

  // Sync selectedQuoteFromSearch whenever the prop changes
  useEffect(() => {
    if (selectedQuoteFromSearch) {
      setViewingQuote(selectedQuoteFromSearch);
    }
  }, [selectedQuoteFromSearch]);

  // Sync viewingQuote status and amounts if quotes array is updated by parent
  useEffect(() => {
    if (viewingQuote) {
      const fresh = quotes.find(q => q.id === viewingQuote.id);
      if (fresh && (fresh.status !== viewingQuote.status || fresh.amount !== viewingQuote.amount || fresh.staffPriced !== viewingQuote.staffPriced)) {
        setViewingQuote(fresh);
      }
    }
  }, [quotes, viewingQuote]);

  // Sync quoted amount input when viewingQuote changes
  useEffect(() => {
    if (viewingQuote) {
      const isPriced = Boolean(viewingQuote.staffPriced);
      const currentPrice = isPriced && (viewingQuote.total !== null || viewingQuote.amount !== null)
        ? (viewingQuote.total ?? viewingQuote.amount)
        : '';
      setQuotedAmountInput(currentPrice !== '' ? String(currentPrice) : '');
      setStaffNotesInput(viewingQuote.notes || viewingQuote.adminNotes || '');
    }
  }, [viewingQuote?.id, viewingQuote?.staffPriced, viewingQuote?.total, viewingQuote?.amount]);

  const handleSaveStaffPrice = () => {
    if (!viewingQuote) return;
    const amountVal = Number(quotedAmountInput);
    if (isNaN(amountVal) || amountVal <= 0) {
      if (showToast) showToast('Please enter a valid quoted amount above 0', 'error');
      return;
    }

    if (typeof updateAdminQuote === 'function') {
      updateAdminQuote(viewingQuote.id, amountVal, staffNotesInput);
    } else if (typeof onUpdateQuotePricing === 'function') {
      onUpdateQuotePricing(viewingQuote.id, amountVal, staffNotesInput);
    }

    setViewingQuote(prev => ({
      ...prev,
      amount: amountVal,
      total: amountVal,
      staffPriced: true,
      notes: staffNotesInput,
      adminNotes: staffNotesInput
    }));

    if (showToast) {
      showToast(`Quotation #${viewingQuote.id} price saved: S$ ${amountVal.toFixed(2)}`, 'success');
    }
  };

  // New Quote Form State
  const [newQuoteData, setNewQuoteData] = useState({
    customerName: '',
    company: '',
    email: '',
    phone: '',
    requestId: '',
    service: 'Air Freight Services (AWB Preparation, Billing & Documentation)',
    amount: 650,
    status: 'Draft',
    quotationDate: new Date().toISOString().split('T')[0],
    validDays: 14,
    notes: 'Quotation for specialized logistics coordination and handling.'
  });

  // Filter logic
  const filteredQuotes = quotes.filter(q => {
    if (!q) return false;
    const term = search.trim().toLowerCase();
    const customer = (q.customerName || q.company || '').toLowerCase();
    const reqId = (q.requestId || q.id || q.referenceNumber || '').toLowerCase();
    const refNum = (q.referenceNumber || '').toLowerCase();
    const service = (q.service || q.cargoCategory || '').toLowerCase();
    const notes = (q.notes || '').toLowerCase();

    const matchesSearch = !term ||
      (q.id && q.id.toLowerCase().includes(term)) ||
      refNum.includes(term) ||
      customer.includes(term) ||
      (q.customerEmail && q.customerEmail.toLowerCase().includes(term)) ||
      (q.customerPhone && q.customerPhone.toLowerCase().includes(term)) ||
      reqId.includes(term) ||
      service.includes(term) ||
      notes.includes(term);

    const matchesStatus = statusFilter === 'All' 
      ? true 
      : statusFilter === 'Real Only' 
        ? (!q.isTest && q.status !== 'Test') 
        : q.status === statusFilter;
    const matchesService = serviceFilter === 'All' || q.service === serviceFilter ||
      (serviceFilter === 'Airway' && (q.service?.toLowerCase().includes('air') || q.cargoCategory?.toLowerCase().includes('air'))) ||
      (serviceFilter === 'Road' && (q.service?.toLowerCase().includes('road') || q.freightMode === 'ftl' || q.freightMode === 'ltl')) ||
      (serviceFilter === 'Documentation' && (q.service?.toLowerCase().includes('doc') || q.cargoCategory?.toLowerCase().includes('doc')));

    return matchesSearch && matchesStatus && matchesService;
  });

  const totalPages = Math.max(1, Math.ceil(filteredQuotes.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedQuotes = filteredQuotes.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  // Keep pagination within valid boundaries
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Sent':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Requested':
      case 'Draft':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Expired':
        return 'bg-slate-100 text-slate-500 border-slate-200';
      case 'Test':
        return 'bg-purple-50 text-purple-700 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleSendQuote = (quoteId) => {
    if (typeof onSendQuote === 'function') {
      onSendQuote(quoteId);
    } else if (typeof onUpdateQuoteStatus === 'function') {
      onUpdateQuoteStatus(quoteId, 'Sent');
    }
    if (viewingQuote && viewingQuote.id === quoteId) {
      setViewingQuote(prev => prev ? { ...prev, status: 'Sent' } : null);
    }
  };

  const handleAcceptQuote = (quoteId) => {
    if (typeof onUpdateQuoteStatus === 'function') {
      onUpdateQuoteStatus(quoteId, 'Accepted');
    }
    if (viewingQuote && viewingQuote.id === quoteId) {
      setViewingQuote(prev => prev ? { ...prev, status: 'Accepted' } : null);
    }
  };

  const handleStatusTransition = (quoteId, nextStatus) => {
    if (typeof onUpdateQuoteStatus === 'function') {
      onUpdateQuoteStatus(quoteId, nextStatus);
    }
    if (viewingQuote && viewingQuote.id === quoteId) {
      setViewingQuote(prev => prev ? { ...prev, status: nextStatus } : null);
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newQuoteData.customerName.trim()) return;

    const baseVal = Number(newQuoteData.amount) || 0;
    const isPriced = baseVal > 0;
    const quoteId = generateUniqueQuoteId(quotes);

    const quoteToCreate = {
      ...newQuoteData,
      id: quoteId,
      company: newQuoteData.company || newQuoteData.customerName,
      createdAt: newQuoteData.quotationDate,
      staffPriced: isPriced,
      total: isPriced ? baseVal : null,
      amount: isPriced ? baseVal : null,
      status: isPriced ? (newQuoteData.status || 'Draft') : 'Requested',
      lineItems: isPriced ? {
        baseTransportationCharge: baseVal,
        taxRate: 0,
        taxAmount: 0,
        finalAmount: baseVal
      } : null
    };

    if (typeof onCreateQuotation === 'function') {
      onCreateQuotation(quoteToCreate);
    }

    setIsCreateModalOpen(false);
    setNewQuoteData({
      customerName: '',
      company: '',
      email: '',
      phone: '',
      requestId: '',
      service: 'Air Freight Services (AWB Preparation, Billing & Documentation)',
      amount: 650,
      status: 'Draft',
      quotationDate: new Date().toISOString().split('T')[0],
      validDays: 14,
      notes: 'Quotation for specialized logistics coordination and handling.'
    });
  };

  // Dedicated Print handler that prints ONLY the quotation
  const handlePrintQuotation = (q) => {
    if (!q) return;
    const isPriced = Boolean(q.staffPriced) && (q.total !== null || q.amount !== null);
    const totalDisplay = isPriced ? `S$ ${Number(q.total ?? q.amount).toFixed(2)}` : 'Not quoted yet';
    const statusDisplay = !q.staffPriced || q.status === 'Draft' ? 'Requested' : q.status;
    const printWindow = window.open('', '_blank', 'width=800,height=700');
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Quotation #${q.id} - Josan Logistics</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
            .header { border-bottom: 2px solid #2463EB; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
            .company { font-size: 20px; font-weight: 900; color: #0B1F5B; margin: 0; }
            .subtext { font-size: 11px; color: #64748b; margin: 4px 0 0 0; }
            .quote-title { font-size: 16px; font-weight: 800; color: #2463EB; margin: 0; text-align: right; }
            .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: 800; text-transform: uppercase; background: #f1f5f9; border: 1px solid #cbd5e1; margin-top: 4px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 24px; font-size: 12px; }
            .grid-title { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px; }
            .grid-val { font-weight: 800; color: #0f172a; margin: 0; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 12px; }
            .table th { background: #f1f5f9; padding: 8px 12px; text-align: left; font-size: 10px; text-transform: uppercase; color: #64748b; border-bottom: 1px solid #cbd5e1; }
            .table td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
            .total-row { font-size: 14px; font-weight: 900; color: #2463EB; }
            .notes { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; font-size: 11px; color: #526581; margin-bottom: 24px; }
            .footer { text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 32px; }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="company">${(siteSettings?.company_name || 'JOSAN LOGISTICS PTE LTD').toUpperCase()}</h1>
              <p class="subtext">${[
                siteSettings?.uen && siteSettings.uen !== '202412345K' ? `UEN: ${siteSettings.uen}` : 'UEN: [Pending]',
                'Non-GST Registered'
              ].join(' • ')}</p>
              <p class="subtext">${siteSettings?.registered_office || '10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438'}</p>
            </div>
            <div>
              <div class="quote-title">OFFICIAL QUOTATION</div>
              <div style="font-family: monospace; font-weight: bold; text-align: right;">#${q.id}</div>
              <div style="text-align: right;"><span class="badge">${statusDisplay}</span></div>
            </div>
          </div>

          <div class="grid">
            <div>
              <div class="grid-title">CUSTOMER / SHIPPER</div>
              <p class="grid-val">${q.company || q.customerName || 'Commercial Client'}</p>
              <p style="margin: 2px 0 0 0; color: #64748b;">${q.customerName || ''}</p>
              ${q.customerEmail ? `<p style="margin: 2px 0 0 0; color: #64748b;">${q.customerEmail}</p>` : ''}
            </div>
            <div>
              <div class="grid-title">SERVICE SCOPE & REFERENCE</div>
              <p class="grid-val">${q.service || q.cargoCategory || 'Airway & Transportation'}</p>
              <p style="margin: 2px 0 0 0; color: #64748b;">Ref: #${q.requestId || 'DIRECT'}</p>
              <p style="margin: 2px 0 0 0; color: #64748b;">Date: ${q.createdAt?.split(',')[0] || q.quotationDate || 'Recent'}</p>
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: right;">Amount (SGD)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>${q.service || 'Logistics Coordination & Handling'}</strong>
                  <div style="font-size: 11px; color: #64748b;">Consignment freight handling, documentation SLA & operational coordination</div>
                </td>
                <td style="text-align: right; font-family: monospace; font-weight: bold;">${totalDisplay}</td>
              </tr>
              <tr class="total-row">
                <td style="text-align: right;">Total Quoted Amount</td>
                <td style="text-align: right; font-family: monospace;">${totalDisplay}</td>
              </tr>
            </tbody>
          </table>

          ${q.notes || q.adminNotes ? `
            <div class="notes">
              <strong>Notes & Special Conditions:</strong><br />
              ${q.notes || q.adminNotes}
            </div>
          ` : ''}

          <div class="footer">
            This is an official computer-generated quotation proposal issued by Josan Logistics Pte Ltd.<br />
            Valid for 14 days from issue date. Subject to standard logistics terms and conditions.
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      try {
        printWindow.print();
        printWindow.close();
      } catch (e) {}
    }, 250);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900 font-heading">Quotations Management</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-100 text-amber-800">
              {quotes.length} Quotes
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Prepare, review, dispatch, and track itemized pricing quotations for air freight services and commercial road transportation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white rounded-xl text-xs font-extrabold shadow-md shadow-orange-500/20 active:scale-95 transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Quotation</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search by quote reference (e.g. QR-8K3F-92XD, TQ-...), customer, ID..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2463EB]/20 focus:border-[#2463EB]"
          />
        </div>

        <div className="flex items-center space-x-2.5">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Real Only">Real Only (Exclude Test)</option>
            {QUOTE_STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={serviceFilter}
            onChange={(e) => { setServiceFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Services</option>
            <option value="Airway">Air Freight Services</option>
            <option value="Road">Road Transportation</option>
            <option value="Documentation">Shipment Documentation</option>
          </select>

          {(search || statusFilter !== 'All' || serviceFilter !== 'All') && (
            <button
              type="button"
              onClick={() => { setSearch(''); setStatusFilter('All'); setServiceFilter('All'); setCurrentPage(1); }}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold px-2 py-1 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Quotations Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Quotation ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Request / Ref ID</th>
                <th className="p-4">Service Scope</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Quotation Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {paginatedQuotes.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center text-slate-400 font-medium">
                    No quotations found matching your search.
                  </td>
                </tr>
              ) : (
                paginatedQuotes.map((q) => {
                  const { totalAmount } = calculateQuoteAmounts(q);

                  return (
                    <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Quotation ID */}
                      <td className="p-4 font-mono font-black text-slate-900 text-xs">
                        #{q.id}
                      </td>

                      {/* Customer */}
                      <td className="p-4">
                        <p className="font-extrabold text-slate-900 text-xs hover:text-[#2463EB] cursor-pointer" onClick={() => setViewingQuote(q)}>
                          {q.company || q.customerName || 'Commercial Client'}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{q.customerName || '—'}</p>
                      </td>

                      {/* Request ID */}
                      <td className="p-4 font-mono font-bold text-slate-600">
                        {q.requestId || q.referenceNumber || (q.notes?.includes('JOS') ? q.notes.split('JOS')[1].slice(0, 10) : 'Direct Intake')}
                      </td>

                      {/* Service Scope */}
                      <td className="p-4 text-slate-700">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-bold text-[10px] border border-slate-200 block w-fit">
                          {q.service || (q.cargoCategory ? `${q.cargoCategory}` : 'Airway & Transportation')}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5 truncate max-w-[160px]">
                          {q.origin && q.destination ? `${q.origin} → ${q.destination}` : 'Singapore Logistics Route'}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="p-4 font-mono font-black text-slate-900 text-sm">
                        {q.staffPriced && (q.total !== null || q.amount !== null) ? (
                          `S$ ${Number(q.total ?? q.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        ) : (
                          <span className="text-slate-400 font-sans font-medium text-xs">Not quoted yet</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {q.isTest || q.status === 'Test' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase border bg-purple-50 text-purple-700 border-purple-300">
                            Test
                          </span>
                        ) : (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${getStatusBadge(!q.staffPriced && q.status !== 'Test' ? 'Requested' : q.status)}`}>
                            {!q.staffPriced || q.status === 'Draft' ? 'Requested' : q.status}
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="p-4 text-slate-500 font-mono text-[11px]">
                        {q.createdAt?.split(',')[0] || q.quotationDate || 'Recent'}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right space-x-1.5">
                        {(q.status === 'Draft' || q.status === 'Requested') && (() => {
                          const isPriced = Boolean(q.staffPriced) && Number(q.total || q.amount || 0) > 0;
                          return (
                            <button
                              type="button"
                              disabled={!isPriced}
                              onClick={() => handleSendQuote(q.id)}
                              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-bold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-50"
                              title={!isPriced ? "Enter a price first" : "Mark as sent"}
                            >
                              Mark as sent
                            </button>
                          );
                        })()}
                        {q.status === 'Sent' && (
                          <button
                            type="button"
                            onClick={() => handleAcceptQuote(q.id)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                            title="Accept Quotation"
                          >
                            Accept
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setViewingQuote(q)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {filteredQuotes.length === 0 ? 0 : ((safeCurrentPage - 1) * pageSize) + 1} to {Math.min(safeCurrentPage * pageSize, filteredQuotes.length)} of {filteredQuotes.length} quotations
            </span>
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                disabled={safeCurrentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-3 py-1 bg-slate-100 disabled:opacity-40 rounded-lg font-bold hover:bg-slate-200 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="font-bold text-slate-800 px-2">{safeCurrentPage} / {totalPages}</span>
              <button
                type="button"
                disabled={safeCurrentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1 bg-slate-100 disabled:opacity-40 rounded-lg font-bold hover:bg-slate-200 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================================= */}
      {/* MODAL 1: VIEW ITEMIZED QUOTATION                                        */}
      {/* ======================================================================= */}
      {viewingQuote && (() => {
        const { baseAmount, marketSurcharge, gst, totalAmount } = calculateQuoteAmounts(viewingQuote);

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-fade-in space-y-5 text-xs text-slate-700 max-h-[92vh] overflow-y-auto my-auto">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-black text-[#2463EB]">#{viewingQuote.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${getStatusBadge(!viewingQuote.staffPriced && viewingQuote.status !== 'Test' ? 'Requested' : viewingQuote.status)}`}>
                      {viewingQuote.isTest || viewingQuote.status === 'Test' ? 'Test' : (!viewingQuote.staffPriced || viewingQuote.status === 'Draft' ? 'Requested' : viewingQuote.status)}
                    </span>
                  </div>
                  <h3 className="font-black text-base text-slate-900 font-heading mt-1">Official Quotation Proposal</h3>
                  <p className="text-[11px] text-slate-400">Josan Logistics Pte Ltd • Singapore</p>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingQuote(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customer & Route Details */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Customer</span>
                  <p className="font-extrabold text-slate-900">{viewingQuote.company || viewingQuote.customerName || 'Commercial Client'}</p>
                  <p className="text-slate-500 text-[11px]">{viewingQuote.customerName || ''}</p>
                  {viewingQuote.customerEmail && (
                    <p className="text-slate-400 text-[10px] mt-0.5">{viewingQuote.customerEmail}</p>
                  )}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Service Scope</span>
                  <p className="font-extrabold text-slate-900">{viewingQuote.service || viewingQuote.cargoCategory || 'Airway & Logistics'}</p>
                  <p className="text-slate-500 text-[11px] font-mono">Ref: #{viewingQuote.requestId || 'DIRECT'}</p>
                  {viewingQuote.origin && viewingQuote.destination && (
                    <p className="text-slate-400 text-[10px] mt-0.5">{viewingQuote.origin} → {viewingQuote.destination}</p>
                  )}
                </div>
              </div>

              {/* Quoted Amount & Staff Pricing */}
              <div className="border border-slate-200 bg-slate-50/70 rounded-2xl p-4 space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                  <div>
                    <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">
                      Quotation Pricing
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Enter the price for this quotation. No automatic GST is added.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Quoted Amount</span>
                    <span className="font-mono text-sm font-black text-[#2463EB]">
                      {viewingQuote.staffPriced && (viewingQuote.total !== null || viewingQuote.amount !== null) ? (
                        `S$ ${Number(viewingQuote.total ?? viewingQuote.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      ) : (
                        <span className="text-slate-400 font-sans font-medium text-xs">Not quoted yet</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Quoted amount (S$)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 font-mono text-slate-400 text-xs">S$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={quotedAmountInput}
                        onChange={(e) => setQuotedAmountInput(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 text-xs focus:ring-2 focus:ring-[#2463EB]/20 focus:border-[#2463EB] outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Staff Notes / Remarks
                    </label>
                    <input
                      type="text"
                      value={staffNotesInput}
                      onChange={(e) => setStaffNotesInput(e.target.value)}
                      placeholder="e.g. Rate confirmed with haulier"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-[#2463EB]/20 focus:border-[#2463EB] outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400">
                    * No automatic GST added (GST registration pending).
                  </span>
                  <button
                    type="button"
                    onClick={handleSaveStaffPrice}
                    className="px-4 py-1.5 bg-[#2463EB] hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs active:scale-95 flex items-center space-x-1.5 cursor-pointer text-xs transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Quoted Amount</span>
                  </button>
                </div>
              </div>

              {/* Notes */}
              {(viewingQuote.notes || viewingQuote.adminNotes) && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  {viewingQuote.notes && (
                    <div>
                      <span className="font-bold text-slate-700 block mb-0.5">Customer / Shipment Notes:</span>
                      {viewingQuote.notes}
                    </div>
                  )}
                  {viewingQuote.adminNotes && viewingQuote.adminNotes !== viewingQuote.notes && (
                    <div className="pt-1 border-t border-slate-200">
                      <span className="font-bold text-amber-800 block mb-0.5">Staff & Operations Notes:</span>
                      {viewingQuote.adminNotes}
                    </div>
                  )}
                </div>
              )}

              {/* Footer Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setViewingQuote(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Close
                </button>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => handlePrintQuotation(viewingQuote)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>

                  {/* Status transitions: Draft/Requested -> Sent */}
                  {(viewingQuote.status === 'Draft' || viewingQuote.status === 'Requested') && (() => {
                    const isPriced = Boolean(viewingQuote.staffPriced) && Number(viewingQuote.total || viewingQuote.amount || 0) > 0;
                    return (
                      <div className="flex flex-col items-end">
                        <button
                          type="button"
                          disabled={!isPriced}
                          onClick={() => handleSendQuote(viewingQuote.id)}
                          className="px-4 py-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white rounded-xl font-bold shadow-md shadow-orange-500/20 active:scale-95 flex items-center space-x-1.5 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#FF6B00]"
                          title={!isPriced ? "Enter a price first" : "Mark as sent"}
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Mark as sent</span>
                        </button>
                        {!isPriced && (
                          <span className="text-[10px] text-amber-600 font-semibold mt-1">Enter a price first</span>
                        )}
                        <span className="text-[10px] text-slate-400 mt-0.5">Email is not connected yet</span>
                      </div>
                    );
                  })()}

                  {/* Status transitions: Sent -> Accepted or Rejected */}
                  {viewingQuote.status === 'Sent' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleStatusTransition(viewingQuote.id, 'Rejected')}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold cursor-pointer transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAcceptQuote(viewingQuote.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Proposal</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================================================================= */}
      {/* MODAL 2: CREATE QUOTATION                                               */}
      {/* ======================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-fade-in space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-lg text-slate-900 font-heading">Create Quotation</h3>
                <p className="text-xs text-slate-500">Calculate itemized rate proposal for shipper</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs font-bold">
              <div>
                <label className="text-slate-700 block mb-1">Customer / Company *</label>
                <input
                  type="text"
                  required
                  list="crm-quote-customers"
                  value={newQuoteData.customerName}
                  onChange={(e) => {
                    const val = e.target.value;
                    const matched = customers.find(c => (c.company || c.name) === val || c.name === val);
                    if (matched) {
                      setNewQuoteData({
                        ...newQuoteData,
                        customerName: matched.name,
                        company: matched.company || matched.name,
                        email: matched.email || newQuoteData.email,
                        phone: matched.phone || newQuoteData.phone
                      });
                    } else {
                      setNewQuoteData({ ...newQuoteData, customerName: val, company: val });
                    }
                  }}
                  placeholder="e.g. Razer Asia-Pacific HQ"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#2463EB]"
                />
                <datalist id="crm-quote-customers">
                  {customers.map(c => (
                    <option key={c.id} value={c.company || c.name} />
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">Request ID / Ref</label>
                  <input
                    type="text"
                    list="crm-quote-requests"
                    value={newQuoteData.requestId}
                    onChange={(e) => setNewQuoteData({ ...newQuoteData, requestId: e.target.value })}
                    placeholder="e.g. AIR-0001 or Your tracking number"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium font-mono"
                  />
                  <datalist id="crm-quote-requests">
                    {airwayRequests.map(a => (
                      <option key={a.id} value={a.id}>{a.customerName} - {a.cargoDescription?.slice(0, 30)}</option>
                    ))}
                    {shipments.map(s => (
                      <option key={s.id} value={s.id}>{s.sender} → {s.receiver}</option>
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Quotation Date</label>
                  <input
                    type="date"
                    value={newQuoteData.quotationDate}
                    onChange={(e) => setNewQuoteData({ ...newQuoteData, quotationDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Service Scope *</label>
                <select
                  value={newQuoteData.service}
                  onChange={(e) => setNewQuoteData({ ...newQuoteData, service: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium cursor-pointer"
                >
                  <option value="Air Freight Services (AWB Preparation, Billing & Documentation)">Air Freight Services (AWB Preparation, Billing & Documentation)</option>
                  <option value="Commercial Road Transportation (Partner Carriers)">Commercial Road Transportation (Partner Carriers)</option>
                  <option value="Consolidated Road Haulage (LTL)">Consolidated Road Haulage (LTL)</option>
                  <option value="Airport Transfer & Cargo Feeder">Airport Transfer & Cargo Feeder</option>
                  <option value="Shipment Documentation Support">Shipment Documentation Support</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">Quoted Base Amount (SGD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={newQuoteData.amount}
                    onChange={(e) => setNewQuoteData({ ...newQuoteData, amount: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Initial Status</label>
                  <select
                    value={newQuoteData.status}
                    onChange={(e) => setNewQuoteData({ ...newQuoteData, status: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium cursor-pointer"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent to Customer</option>
                    <option value="Accepted">Accepted</option>
                  </select>
                </div>
              </div>

              {/* Pricing Live Preview */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="text-slate-500 font-medium block">
                    Base: S$ {(Number(newQuoteData.amount) || 0).toFixed(2)}
                  </span>
                  <span className="text-slate-500 font-medium block">
                    Singapore GST (9%): S$ {((Number(newQuoteData.amount) || 0) * 0.09).toFixed(2)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-black block tracking-wider">Total Quoted Amount</span>
                  <span className="font-mono font-black text-sm text-[#2463EB]">
                    S$ {((Number(newQuoteData.amount) || 0) * 1.09).toFixed(2)}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Proposal Notes & Terms</label>
                <textarea
                  value={newQuoteData.notes}
                  onChange={(e) => setNewQuoteData({ ...newQuoteData, notes: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#2463EB]"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white rounded-xl font-bold cursor-pointer shadow-md shadow-orange-500/20 active:scale-95 transition-all"
                >
                  Create Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
