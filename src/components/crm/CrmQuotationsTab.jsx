import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Send, 
  Printer, 
  Check, 
  X 
} from 'lucide-react';

export const QUOTE_STATUS_OPTIONS = [
  'Draft',
  'Sent',
  'Accepted',
  'Rejected',
  'Expired'
];

/**
 * Calculates Base Amount, 9% GST, and Total Quoted Amount consistently
 */
export const calculateQuoteAmounts = (quote) => {
  if (!quote) return { baseAmount: 0, gst: 0, totalAmount: 0 };

  const lineItems = quote.lineItems || {};
  let baseAmount = 0;
  let gst = 0;
  let totalAmount = 0;

  if (lineItems.finalAmount !== undefined && lineItems.finalAmount !== null && !isNaN(Number(lineItems.finalAmount))) {
    totalAmount = Number(lineItems.finalAmount);
    if (lineItems.taxAmount !== undefined && !isNaN(Number(lineItems.taxAmount))) {
      gst = Number(lineItems.taxAmount);
      baseAmount = Number((totalAmount - gst).toFixed(2));
    } else {
      baseAmount = Number((totalAmount / 1.09).toFixed(2));
      gst = Number((totalAmount - baseAmount).toFixed(2));
    }
  } else if (lineItems.baseTransportationCharge !== undefined && !isNaN(Number(lineItems.baseTransportationCharge))) {
    baseAmount = Number(lineItems.baseTransportationCharge);
    gst = Number((baseAmount * 0.09).toFixed(2));
    totalAmount = Number((baseAmount + gst).toFixed(2));
  } else if (quote.amount !== undefined && quote.amount !== null && !isNaN(Number(quote.amount))) {
    baseAmount = Number(quote.amount);
    gst = Number((baseAmount * 0.09).toFixed(2));
    totalAmount = Number((baseAmount + gst).toFixed(2));
  }

  return {
    baseAmount,
    gst,
    totalAmount
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
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const candidate = `QTE-${randomSuffix}-SG`;
    if (!existingSet.has(candidate)) {
      return candidate;
    }
  }
  return `QTE-${Date.now().toString().slice(-5)}-SG`;
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
  selectedQuoteFromSearch = null
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals state
  const [viewingQuote, setViewingQuote] = useState(selectedQuoteFromSearch);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Sync selectedQuoteFromSearch whenever the prop changes
  useEffect(() => {
    if (selectedQuoteFromSearch) {
      setViewingQuote(selectedQuoteFromSearch);
    }
  }, [selectedQuoteFromSearch]);

  // Sync viewingQuote status if quotes array is updated by parent
  useEffect(() => {
    if (viewingQuote) {
      const fresh = quotes.find(q => q.id === viewingQuote.id);
      if (fresh && fresh.status !== viewingQuote.status) {
        setViewingQuote(fresh);
      }
    }
  }, [quotes, viewingQuote]);

  // New Quote Form State
  const [newQuoteData, setNewQuoteData] = useState({
    customerName: '',
    company: '',
    email: '',
    phone: '',
    requestId: '',
    service: 'Airway Services (AWB Preparation, Billing & Documentation)',
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
    const reqId = (q.requestId || q.id || '').toLowerCase();
    const service = (q.service || q.cargoCategory || '').toLowerCase();
    const notes = (q.notes || '').toLowerCase();

    const matchesSearch = !term ||
      (q.id && q.id.toLowerCase().includes(term)) ||
      customer.includes(term) ||
      reqId.includes(term) ||
      service.includes(term) ||
      notes.includes(term);

    const matchesStatus = statusFilter === 'All' || q.status === statusFilter;
    const matchesService = serviceFilter === 'All' || q.service === serviceFilter ||
      (serviceFilter === 'Airway' && (q.service?.toLowerCase().includes('air') || q.cargoCategory?.toLowerCase().includes('air'))) ||
      (serviceFilter === 'Road' && (q.service?.toLowerCase().includes('road') || q.freightMode === 'ftl' || q.freightMode === 'ltl'));

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
      case 'Draft':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Expired':
        return 'bg-slate-100 text-slate-500 border-slate-200';
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
    const gstVal = Number((baseVal * 0.09).toFixed(2));
    const totalVal = Number((baseVal + gstVal).toFixed(2));
    const quoteId = generateUniqueQuoteId(quotes);

    const quoteToCreate = {
      ...newQuoteData,
      id: quoteId,
      company: newQuoteData.company || newQuoteData.customerName,
      createdAt: newQuoteData.quotationDate,
      amount: totalVal,
      lineItems: {
        baseTransportationCharge: baseVal,
        taxRate: 0.09,
        taxAmount: gstVal,
        finalAmount: totalVal
      }
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
      service: 'Airway Services (AWB Preparation, Billing & Documentation)',
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
    const { baseAmount, gst, totalAmount } = calculateQuoteAmounts(q);
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
            .qte-title { font-size: 16px; font-weight: 800; color: #2463EB; margin: 0; text-align: right; }
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
              <h1 class="company">JOSAN LOGISTICS PTE LTD</h1>
              <p class="subtext">UEN: 202412345K • GST Registered: M90384721</p>
              <p class="subtext">Changi Air Cargo Logistics Hub • Singapore</p>
            </div>
            <div>
              <div class="qte-title">OFFICIAL QUOTATION</div>
              <div style="font-family: monospace; font-weight: bold; text-align: right;">#${q.id}</div>
              <div style="text-align: right;"><span class="badge">${q.status || 'Draft'}</span></div>
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
                <td style="text-align: right; font-family: monospace; font-weight: bold;">S$ ${baseAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="text-align: right; color: #64748b;">Subtotal</td>
                <td style="text-align: right; font-family: monospace; font-weight: bold;">S$ ${baseAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="text-align: right; color: #64748b;">Singapore GST (9%)</td>
                <td style="text-align: right; font-family: monospace; font-weight: bold;">S$ ${gst.toFixed(2)}</td>
              </tr>
              <tr class="total-row">
                <td style="text-align: right;">Total Quoted Amount</td>
                <td style="text-align: right; font-family: monospace;">S$ ${totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          ${q.notes ? `
            <div class="notes">
              <strong>Notes & Special Conditions:</strong><br />
              ${q.notes}
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
      printWindow.print();
      printWindow.close();
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
            Prepare, review, dispatch, and track itemized pricing quotations for airway services and commercial road transportation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 bg-[#2463EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
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
            placeholder="Search by Quote ID, customer, request ID, or service..."
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
            <option value="Airway">Airway Services</option>
            <option value="Road">Road Transportation</option>
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
                        {q.requestId || (q.notes?.includes('JOS') ? q.notes.split('JOS')[1].slice(0, 10) : 'Direct Intake')}
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
                        S$ {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${getStatusBadge(q.status)}`}>
                          {q.status || 'Draft'}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="p-4 text-slate-500 font-mono text-[11px]">
                        {q.createdAt?.split(',')[0] || q.quotationDate || 'Recent'}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right space-x-1.5">
                        {q.status === 'Draft' && (
                          <button
                            type="button"
                            onClick={() => handleSendQuote(q.id)}
                            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                            title="Send to Customer"
                          >
                            Send
                          </button>
                        )}
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
        const { baseAmount, gst, totalAmount } = calculateQuoteAmounts(viewingQuote);

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-fade-in space-y-6 text-xs text-slate-700">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-black text-[#2463EB]">#{viewingQuote.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${getStatusBadge(viewingQuote.status)}`}>
                      {viewingQuote.status || 'Draft'}
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

              {/* Itemized Pricing */}
              <div className="space-y-2 border-t border-b border-slate-100 py-3">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Base Logistics & Transportation Fee</span>
                  <span className="font-mono font-bold">S$ {baseAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Singapore GST (9%)</span>
                  <span className="font-mono font-bold">S$ {gst.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between font-black text-sm text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Quoted Amount</span>
                  <span className="font-mono text-base text-[#2463EB]">S$ {totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Notes */}
              {viewingQuote.notes && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-700 block mb-0.5">Notes:</span>
                  {viewingQuote.notes}
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

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handlePrintQuotation(viewingQuote)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>

                  {/* Status transitions: Draft -> Sent */}
                  {viewingQuote.status === 'Draft' && (
                    <button
                      type="button"
                      onClick={() => handleSendQuote(viewingQuote.id)}
                      className="px-4 py-2 bg-[#2463EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold shadow-sm flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send to Customer</span>
                    </button>
                  )}

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
                    placeholder="e.g. AIR-0001 or JOS-88190-SG"
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
                  <option value="Airway Services (AWB Preparation, Billing & Documentation)">Airway Services (AWB Preparation, Billing & Documentation)</option>
                  <option value="Road Transportation Linehaul (FTL)">Road Transportation Linehaul (FTL)</option>
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
                  className="px-5 py-2 bg-[#2463EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold cursor-pointer shadow-sm"
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
