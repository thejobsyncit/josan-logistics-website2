import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { 
  Receipt, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Printer, 
  Download, 
  X
} from 'lucide-react';

export const BILLING_PAYMENT_STATUSES = [
  'Paid',
  'Unpaid',
  'Pending',
  'Refunded'
];

/**
 * Calculates Subtotal, 9% GST, and Total Payable consistently for any invoice object
 */
export const calculateInvoiceAmounts = (inv) => {
  if (!inv) return { subtotal: 0, gst: 0, total: 0 };
  
  let subtotal = 0;
  let gst = 0;
  let total = 0;

  if (typeof inv.subtotal === 'number' || (inv.subtotal !== undefined && inv.subtotal !== null && !isNaN(Number(inv.subtotal)))) {
    subtotal = Number(inv.subtotal);
    gst = inv.taxAmount !== undefined && inv.taxAmount !== null && !isNaN(Number(inv.taxAmount))
      ? Number(inv.taxAmount)
      : Number((subtotal * 0.09).toFixed(2));
    total = inv.total !== undefined && inv.total !== null && !isNaN(Number(inv.total))
      ? Number(inv.total)
      : Number((subtotal + gst).toFixed(2));
  } else if (inv.total !== undefined && inv.total !== null && !isNaN(Number(inv.total))) {
    total = Number(inv.total);
    if (inv.taxAmount !== undefined && inv.taxAmount !== null && !isNaN(Number(inv.taxAmount))) {
      gst = Number(inv.taxAmount);
      subtotal = Number((total - gst).toFixed(2));
    } else {
      subtotal = Number((total / 1.09).toFixed(2));
      gst = Number((total - subtotal).toFixed(2));
    }
  } else if (inv.amount !== undefined && inv.amount !== null && !isNaN(Number(inv.amount))) {
    subtotal = Number(inv.amount);
    gst = Number((subtotal * 0.09).toFixed(2));
    total = Number((subtotal + gst).toFixed(2));
  }

  return { subtotal, gst, total };
};

/**
 * Generates a unique invoice number if none provided
 */
export const generateUniqueInvoiceNumber = (existingInvoices = []) => {
  const existingSet = new Set(
    existingInvoices.map(i => (i.invoiceNumber || i.id || '').toString().toUpperCase())
  );
  const year = new Date().getFullYear();

  for (let attempt = 0; attempt < 25; attempt++) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const candidate = `INV-${year}-${randomSuffix}`;
    if (!existingSet.has(candidate)) {
      return candidate;
    }
  }
  return `INV-${year}-${Date.now().toString().slice(-4)}`;
};

/**
 * Generates and downloads an official Tax Invoice PDF
 */
export const generateInvoicePdf = (inv) => {
  const { subtotal, gst, total } = calculateInvoiceAmounts(inv);
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header background banner (Josan dark blue / navy)
  doc.setFillColor(16, 24, 45); // #0B1F5B
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Orange accent strip
  doc.setFillColor(255, 107, 0); // #2463EB
  doc.rect(0, 38, pageWidth, 2, 'F');

  // Company Name & Singapore Details
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('JOSAN LOGISTICS PTE LTD', 15, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('UEN: 202412345K  |  GST Reg: M90384721', 15, 22);
  doc.text('Changi Air Cargo Logistics Hub  |  Singapore Corridors', 15, 28);

  // TAX INVOICE header on right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 107, 0);
  doc.text('TAX INVOICE', pageWidth - 15, 15, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(`#${inv.invoiceNumber || inv.id || 'INV-GENERAL'}`, pageWidth - 15, 22, { align: 'right' });

  // Status badge indicator
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  const status = (inv.paymentStatus || 'Unpaid').toUpperCase();
  if (status === 'PAID') {
    doc.setTextColor(52, 211, 153);
  } else if (status === 'PENDING') {
    doc.setTextColor(251, 191, 36);
  } else {
    doc.setTextColor(248, 113, 113);
  }
  doc.text(`STATUS: ${status}`, pageWidth - 15, 28, { align: 'right' });

  // Billed To & Invoice Metadata
  const metaY = 48;

  // Billed To Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, metaY, 95, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('BILLED TO', 20, metaY + 7);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(inv.customerName || 'Commercial Client', 20, metaY + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Email: ${inv.customerEmail || 'Accounts Payable'}`, 20, metaY + 20);
  doc.text(`Phone: ${inv.customerPhone || 'Singapore Corporate Client'}`, 20, metaY + 26);
  doc.text('Entity: Singapore Corporate Account', 20, metaY + 32);

  // Specifications Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(115, metaY, 80, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('INVOICE SPECIFICATIONS', 120, metaY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Invoice Date:', 120, metaY + 14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(inv.issueDate || 'Recent', 190, metaY + 14, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Payment Due:', 120, metaY + 21);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(inv.dueDate || 'Net 30 Days', 190, metaY + 21, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Reference ID:', 120, metaY + 28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`#${inv.shipmentId || inv.requestId || 'REQ-GENERAL'}`, 190, metaY + 28, { align: 'right' });

  // Line Items Table
  const tableY = 94;
  doc.setFillColor(241, 245, 249);
  doc.rect(15, tableY, 180, 8, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.line(15, tableY, 195, tableY);
  doc.line(15, tableY + 8, 195, tableY + 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('DESCRIPTION OF SERVICES', 20, tableY + 5.5);
  doc.text('AMOUNT (SGD)', 190, tableY + 5.5, { align: 'right' });

  // Line item detail
  const rowY = tableY + 16;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(inv.service || 'Air Freight Services & Documentation', 20, rowY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Consignment handling, freight coordination, documentation SLA', 20, rowY + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`S$ ${subtotal.toFixed(2)}`, 190, rowY, { align: 'right' });

  doc.setDrawColor(241, 245, 249);
  doc.line(15, rowY + 9, 195, rowY + 9);

  // Financial Summary Breakdown
  const calcBoxY = rowY + 16;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Subtotal:', 135, calcBoxY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`S$ ${subtotal.toFixed(2)}`, 190, calcBoxY, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Singapore GST (9%):', 135, calcBoxY + 7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`S$ ${gst.toFixed(2)}`, 190, calcBoxY + 7, { align: 'right' });

  doc.setDrawColor(203, 213, 225);
  doc.line(135, calcBoxY + 11, 195, calcBoxY + 11);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(255, 107, 0);
  doc.text('Total Payable:', 135, calcBoxY + 18);
  doc.text(`S$ ${total.toFixed(2)}`, 190, calcBoxY + 18, { align: 'right' });

  // Bank Remittance Section
  const remitY = calcBoxY + 28;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, remitY, 180, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('Payment & Settlement Remittance Instructions', 20, remitY + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('PayNow UEN: 202412345K (Josan Logistics Pte Ltd)', 20, remitY + 13);
  doc.text('Bank Transfer: DBS Bank Singapore  |  Account No: 012-987654-3  |  Marina Bay Financial Centre', 20, remitY + 19);

  // Footer notes
  const footerY = 275;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Computer-generated tax invoice. No signature required. Thank you for your partnership with Josan Logistics.', 105, footerY, { align: 'center' });

  doc.save(`${inv.invoiceNumber || inv.id || 'Invoice'}_TaxInvoice.pdf`);
};

export const CrmBillingTab = ({
  invoices = [],
  customers = [],
  airwayRequests = [],
  shipments = [],
  onCreateInvoice,
  onUpdatePaymentStatus,
  selectedInvoiceFromSearch = null
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals state
  const [viewingInvoice, setViewingInvoice] = useState(selectedInvoiceFromSearch);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Sync selectedInvoiceFromSearch when prop changes
  useEffect(() => {
    if (selectedInvoiceFromSearch) {
      setViewingInvoice(selectedInvoiceFromSearch);
    }
  }, [selectedInvoiceFromSearch]);

  // Sync viewing invoice when invoices list updates
  useEffect(() => {
    if (viewingInvoice) {
      const fresh = invoices.find(i => 
        (i.id && i.id === viewingInvoice.id) || 
        (i.invoiceNumber && i.invoiceNumber === viewingInvoice.invoiceNumber)
      );
      if (fresh && fresh.paymentStatus !== viewingInvoice.paymentStatus) {
        setViewingInvoice(fresh);
      }
    }
  }, [invoices, viewingInvoice]);

  // New Invoice Form State
  const [newInvData, setNewInvData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    requestId: '',
    service: 'Air Freight Services (AWB Preparation & Billing)',
    amount: 520,
    paymentStatus: 'Unpaid',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    notes: 'Tax Invoice for logistics services performed under SLA agreement.'
  });

  // Filter logic
  const filteredInvoices = invoices.filter(inv => {
    const term = search.trim().toLowerCase();
    const invNum = (inv.invoiceNumber || inv.id || '').toLowerCase();
    const cust = (inv.customerName || '').toLowerCase();
    const req = (inv.shipmentId || inv.requestId || '').toLowerCase();
    const srv = (inv.service || '').toLowerCase();
    const email = (inv.customerEmail || '').toLowerCase();

    const matchesSearch = !term ||
      invNum.includes(term) ||
      cust.includes(term) ||
      req.includes(term) ||
      srv.includes(term) ||
      email.includes(term);

    const matchesStatus = statusFilter === 'All' || inv.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedInvoices = filteredInvoices.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  // Computed summary metrics with correct Subtotal, 9% GST, and Total Payable logic
  const totalBilled = invoices.reduce((sum, i) => sum + calculateInvoiceAmounts(i).total, 0);
  const collectedPaid = invoices
    .filter(i => i.paymentStatus === 'Paid')
    .reduce((sum, i) => sum + calculateInvoiceAmounts(i).total, 0);
  const pendingReceivables = invoices
    .filter(i => i.paymentStatus === 'Unpaid' || i.paymentStatus === 'Pending')
    .reduce((sum, i) => sum + calculateInvoiceAmounts(i).total, 0);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Unpaid':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Refunded':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleStatusChange = (invoiceId, newStatus) => {
    if (onUpdatePaymentStatus) {
      onUpdatePaymentStatus(invoiceId, newStatus);
    }
    if (viewingInvoice && (viewingInvoice.id === invoiceId || viewingInvoice.invoiceNumber === invoiceId)) {
      setViewingInvoice(prev => prev ? { ...prev, paymentStatus: newStatus } : null);
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newInvData.customerName.trim()) return;

    const subtotal = Number(newInvData.amount) || 0;
    const gst = Number((subtotal * 0.09).toFixed(2));
    const total = Number((subtotal + gst).toFixed(2));
    const invoiceNumber = generateUniqueInvoiceNumber(invoices);

    const invoiceToCreate = {
      ...newInvData,
      id: invoiceNumber,
      invoiceNumber: invoiceNumber,
      amount: subtotal,
      subtotal,
      taxRate: 0.09,
      taxAmount: gst,
      total
    };

    if (onCreateInvoice) {
      onCreateInvoice(invoiceToCreate);
    }

    setIsCreateModalOpen(false);
    setNewInvData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      requestId: '',
      service: 'Air Freight Services (AWB Preparation & Billing)',
      amount: 520,
      paymentStatus: 'Unpaid',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      notes: 'Tax Invoice for logistics services performed under SLA agreement.'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900 font-heading">Billing & Accounts Receivable</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
              {invoices.length} Invoices
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage customer tax invoices, settlement records, AWB billings, and commercial haulage accounts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 bg-[#2463EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Invoice</span>
        </button>
      </div>

      {/* KPI Financial Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Invoiced</span>
            <p className="text-2xl font-black font-mono text-slate-900 mt-1">
              S$ {totalBilled.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-slate-500 font-medium">{invoices.length} Registered Invoices</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider">Settled & Collected</span>
            <p className="text-2xl font-black font-mono text-emerald-600 mt-1">
              S$ {collectedPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-emerald-600 font-medium">
              {invoices.filter(i => i.paymentStatus === 'Paid').length} Fully Settled
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider">Outstanding Receivables</span>
            <p className="text-2xl font-black font-mono text-amber-600 mt-1">
              S$ {pendingReceivables.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-amber-600 font-medium">
              {invoices.filter(i => i.paymentStatus === 'Unpaid' || i.paymentStatus === 'Pending').length} Awaiting Settlement
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search by invoice number, customer, request ID, service..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2463EB]/20 focus:border-[#2463EB]"
          />
        </div>

        <div className="flex items-center space-x-2.5">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Payment Statuses</option>
            {BILLING_PAYMENT_STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {(search || statusFilter !== 'All') && (
            <button
              type="button"
              onClick={() => { setSearch(''); setStatusFilter('All'); setCurrentPage(1); }}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold px-2 py-1 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Invoice Number</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Request / Consignment ID</th>
                <th className="p-4">Service Rendered</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment Status</th>
                <th className="p-4">Invoice Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {paginatedInvoices.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center text-slate-400 font-medium">
                    No invoices match your search filters.
                  </td>
                </tr>
              ) : (
                paginatedInvoices.map((inv) => {
                  const { total } = calculateInvoiceAmounts(inv);
                  const invoiceIdKey = inv.id || inv.invoiceNumber;

                  return (
                    <tr key={invoiceIdKey} className="hover:bg-slate-50/80 transition-colors">
                      {/* Invoice Number */}
                      <td className="p-4">
                        <span className="font-mono font-black text-slate-900 text-xs block">
                          #{inv.invoiceNumber || inv.id}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                          Due: {inv.dueDate || 'Net 30'}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="p-4">
                        <p className="font-extrabold text-slate-900 text-xs hover:text-[#2463EB] cursor-pointer" onClick={() => setViewingInvoice(inv)}>
                          {inv.customerName}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{inv.customerEmail || '—'}</p>
                      </td>

                      {/* Request ID */}
                      <td className="p-4 font-mono font-bold text-slate-700">
                        #{inv.shipmentId || inv.requestId || 'REQ-GENERAL'}
                      </td>

                      {/* Service */}
                      <td className="p-4 text-slate-700">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-bold text-[10px] border border-slate-200 block w-fit">
                          {inv.service || 'Logistics Service'}
                        </span>
                      </td>

                      {/* Total Amount */}
                      <td className="p-4 font-mono font-black text-slate-900 text-sm">
                        S$ {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      {/* Payment Status Dropdown */}
                      <td className="p-4">
                        <select
                          value={inv.paymentStatus || 'Unpaid'}
                          onChange={(e) => handleStatusChange(invoiceIdKey, e.target.value)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-extrabold border cursor-pointer ${getStatusBadge(inv.paymentStatus)}`}
                        >
                          {BILLING_PAYMENT_STATUSES.map(st => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>

                      {/* Invoice Date */}
                      <td className="p-4 text-slate-500 font-mono text-[11px]">
                        {inv.issueDate || 'Recent'}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right space-x-1.5">
                        <button
                          type="button"
                          onClick={() => setViewingInvoice(inv)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Invoice
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
            <span>Showing {((safeCurrentPage - 1) * pageSize) + 1} to {Math.min(safeCurrentPage * pageSize, filteredInvoices.length)} of {filteredInvoices.length} invoices</span>
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
      {/* MODAL 1: OFFICIAL TAX INVOICE PRINTABLE / DOWNLOAD VIEW                */}
      {/* ======================================================================= */}
      {viewingInvoice && (() => {
        const { subtotal, gst, total } = calculateInvoiceAmounts(viewingInvoice);
        const invoiceIdKey = viewingInvoice.id || viewingInvoice.invoiceNumber;

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-fade-in space-y-6 text-xs text-slate-700 my-8">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="font-black text-base text-[#0B1F5B] tracking-tight block">JOSAN LOGISTICS PTE LTD</span>
                  <p className="text-[11px] text-slate-500">UEN: 202412345K • GST Registered: M90384721</p>
                  <p className="text-[11px] text-slate-400">Changi Air Cargo Logistics Hub • Singapore</p>
                </div>

                <div className="text-right">
                  <span className="font-mono text-sm font-black text-slate-900 block">
                    TAX INVOICE #{viewingInvoice.invoiceNumber || viewingInvoice.id}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border mt-1 inline-block ${getStatusBadge(viewingInvoice.paymentStatus)}`}>
                    {viewingInvoice.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Billed To & Dates */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">BILLED TO</span>
                  <p className="font-extrabold text-slate-900 text-sm mt-0.5">{viewingInvoice.customerName}</p>
                  <p className="text-slate-500 text-[11px]">{viewingInvoice.customerEmail || 'Accounts Payable'}</p>
                  <p className="text-slate-500 text-[11px]">{viewingInvoice.customerPhone || 'Singapore Corporate Client'}</p>
                </div>
                <div className="space-y-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">INVOICE DATE</span>
                    <span className="font-mono font-bold text-slate-800">{viewingInvoice.issueDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">PAYMENT DUE DATE</span>
                    <span className="font-mono font-bold text-slate-800">{viewingInvoice.dueDate || 'Net 30 Days'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">REFERENCE CONSIGNMENT</span>
                    <span className="font-mono font-bold text-slate-800">#{viewingInvoice.shipmentId || viewingInvoice.requestId || 'REQ-GENERAL'}</span>
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold text-[10px] uppercase">
                    <tr>
                      <th className="p-3">Description</th>
                      <th className="p-3 text-right">Amount (SGD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr>
                      <td className="p-3">
                        <p className="font-bold text-slate-900">{viewingInvoice.service || 'Air Freight Services & Documentation'}</p>
                        <p className="text-[10px] text-slate-400">Consignment handling, freight coordination, documentation SLA</p>
                      </td>
                      <td className="p-3 text-right font-mono font-bold">
                        S$ {subtotal.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-slate-50/70 border-t border-slate-200 font-medium">
                    <tr>
                      <td className="p-2.5 text-right font-bold text-slate-600">Subtotal</td>
                      <td className="p-2.5 text-right font-mono font-bold">S$ {subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-right font-bold text-slate-600">Singapore GST (9%)</td>
                      <td className="p-2.5 text-right font-mono font-bold">S$ {gst.toFixed(2)}</td>
                    </tr>
                    <tr className="border-t border-slate-200 font-black text-sm text-slate-900">
                      <td className="p-3 text-right">Total Payable</td>
                      <td className="p-3 text-right font-mono text-base text-[#2463EB]">S$ {total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Bank Remittance Details */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] space-y-1">
                <p className="font-extrabold text-slate-900">Payment & Settlement Remittance</p>
                <p className="text-slate-600">PayNow UEN: <span className="font-mono font-bold">202412345K</span> (Josan Logistics Pte Ltd)</p>
                <p className="text-slate-600">Bank Transfer: <span className="font-mono font-bold">DBS Bank Ltd</span> • Account No: <span className="font-mono font-bold">012-987654-3</span></p>
              </div>

              {/* Modal Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setViewingInvoice(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Close
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => generateInvoicePdf(viewingInvoice)}
                    className="px-4 py-2 bg-[#2463EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold shadow-sm flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================================================================= */}
      {/* MODAL 2: GENERATE INVOICE                                               */}
      {/* ======================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-fade-in space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-lg text-slate-900 font-heading">Generate Tax Invoice</h3>
                <p className="text-xs text-slate-500">Issue official tax invoice for logistics service</p>
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
                <label className="text-slate-700 block mb-1">Customer / Entity Name *</label>
                <input
                  type="text"
                  required
                  list="billing-customer-datalist"
                  value={newInvData.customerName}
                  onChange={(e) => {
                    const val = e.target.value;
                    const matched = customers.find(c => (c.company || c.name) === val || c.name === val);
                    if (matched) {
                      setNewInvData({
                        ...newInvData,
                        customerName: matched.company || matched.name,
                        customerEmail: matched.email || newInvData.customerEmail,
                        customerPhone: matched.phone || newInvData.customerPhone
                      });
                    } else {
                      setNewInvData({ ...newInvData, customerName: val });
                    }
                  }}
                  placeholder="e.g. Razer Asia-Pacific HQ"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-[#2463EB]"
                />
                <datalist id="billing-customer-datalist">
                  {customers.map((c) => (
                    <option key={c.id} value={c.company || c.name} />
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">Customer Email</label>
                  <input
                    type="email"
                    value={newInvData.customerEmail}
                    onChange={(e) => setNewInvData({ ...newInvData, customerEmail: e.target.value })}
                    placeholder="accounts@company.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Consignment / Request ID</label>
                  <input
                    type="text"
                    list="billing-request-datalist"
                    value={newInvData.requestId}
                    onChange={(e) => setNewInvData({ ...newInvData, requestId: e.target.value })}
                    placeholder="Your tracking number or AIR-0001"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium font-mono"
                  />
                  <datalist id="billing-request-datalist">
                    {airwayRequests.map(a => (
                      <option key={a.id} value={a.id}>{a.customerName} ({a.cargoDescription?.slice(0, 30)})</option>
                    ))}
                    {shipments.map(s => (
                      <option key={s.id} value={s.id}>{s.sender} → {s.receiver}</option>
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Service Rendered *</label>
                <select
                  value={newInvData.service}
                  onChange={(e) => setNewInvData({ ...newInvData, service: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium cursor-pointer"
                >
                  <option value="Air Freight Services (AWB Preparation & Billing)">Air Freight Services (AWB Preparation & Billing)</option>
                  <option value="Commercial Road Freight Linehaul">Commercial Road Freight Linehaul</option>
                  <option value="Transportation Support">Transportation Support</option>
                  <option value="Shipment Documentation">Shipment Documentation</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">Subtotal (SGD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={newInvData.amount}
                    onChange={(e) => setNewInvData({ ...newInvData, amount: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={newInvData.issueDate}
                    onChange={(e) => setNewInvData({ ...newInvData, issueDate: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newInvData.dueDate}
                    onChange={(e) => setNewInvData({ ...newInvData, dueDate: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              {/* Tax & Total Calculation Preview */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="text-slate-500 font-medium block">
                    Subtotal: S$ {(Number(newInvData.amount) || 0).toFixed(2)}
                  </span>
                  <span className="text-slate-500 font-medium block">
                    Singapore GST (9%): S$ {((Number(newInvData.amount) || 0) * 0.09).toFixed(2)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-black block tracking-wider">Total Payable</span>
                  <span className="font-mono font-black text-sm text-[#2463EB]">
                    S$ {((Number(newInvData.amount) || 0) * 1.09).toFixed(2)}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Payment Status</label>
                <select
                  value={newInvData.paymentStatus}
                  onChange={(e) => setNewInvData({ ...newInvData, paymentStatus: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium cursor-pointer"
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid / Settled</option>
                  <option value="Pending">Pending Clearance</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Invoice Notes</label>
                <textarea
                  value={newInvData.notes}
                  onChange={(e) => setNewInvData({ ...newInvData, notes: e.target.value })}
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
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
