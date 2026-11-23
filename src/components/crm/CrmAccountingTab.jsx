import React, { useState } from 'react';
import { 
  Landmark, 
  Receipt, 
  DollarSign, 
  CreditCard, 
  FileSpreadsheet, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
  FileText
} from 'lucide-react';
import { COMPANY_INFO } from '../../config/siteConfig';

export const CrmAccountingTab = ({
  invoices = [],
  customers = [],
  shipments = [],
  currentUser
}) => {
  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview' | 'receivables' | 'credit_notes' | 'payables'

  // Monetary calculations
  const totalInvoiced = invoices.reduce((acc, inv) => acc + Number(inv.total || 0), 0);
  const totalPaid = invoices
    .filter(inv => inv.paymentStatus === 'Paid' || inv.status === 'Paid')
    .reduce((acc, inv) => acc + Number(inv.amount_paid || inv.total || 0), 0);
  const totalOutstanding = Math.max(0, totalInvoiced - totalPaid);
  const totalGst = invoices.reduce((acc, inv) => acc + Number(inv.gst || inv.taxAmount || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-12">
      {/* 1. Module Header */}
      <div className="bg-[#10182D] text-white p-6 rounded-3xl border border-slate-800 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6B00] flex items-center justify-center text-white shadow-orange-glow">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white font-heading">
                Financial Accounting &amp; Ledger
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                Singapore GST compliance, accounts receivable, payments, credit notes &amp; payables
              </p>
            </div>
          </div>
        </div>

        {/* Currency badge */}
        <div className="flex items-center space-x-2 text-xs font-mono bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700">
          <span className="text-[#FF6B00] font-bold">BASE CURRENCY:</span>
          <span className="text-white font-bold">SGD ($)</span>
          <span className="text-slate-400">| Standard GST 9%</span>
        </div>
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Receivables */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Total Invoiced</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            SGD {totalInvoiced.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400">{invoices.length} total tax invoices</p>
        </div>

        {/* Total Collected */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Collected / Paid</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-600 font-mono">
            SGD {totalPaid.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400">Reconciled payments</p>
        </div>

        {/* Outstanding Balance */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Balance Due</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 font-mono">
            SGD {totalOutstanding.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400">Receivables pending settlement</p>
        </div>

        {/* Singapore GST (9%) */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Output Tax (GST 9%)</span>
            <FileSpreadsheet className="w-4 h-4 text-[#FF6B00]" />
          </div>
          <div className="text-2xl font-black text-[#FF6B00] font-mono">
            SGD {totalGst.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400">Standard-rated output tax</p>
        </div>
      </div>

      {/* 3. Sub-tabs / Navigation */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex border-b border-slate-100 gap-6">
          <button
            type="button"
            onClick={() => setActiveSubTab('overview')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeSubTab === 'overview'
                ? 'border-[#FF6B00] text-[#FF6B00]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Accounting Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('receivables')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeSubTab === 'receivables'
                ? 'border-[#FF6B00] text-[#FF6B00]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Receivables &amp; Ageing
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('credit_notes')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeSubTab === 'credit_notes'
                ? 'border-[#FF6B00] text-[#FF6B00]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Credit Notes
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('payables')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeSubTab === 'payables'
                ? 'border-[#FF6B00] text-[#FF6B00]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Payables (Vendor Bills)
          </button>
        </div>

        {/* Overview Tab Content */}
        {activeSubTab === 'overview' && (
          <div className="space-y-6">
            <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200/80 flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 leading-relaxed">
                <p className="font-bold text-slate-900 text-sm mb-0.5">Accountant Workspace Activated (Phase 1)</p>
                <p>
                  Database sequential invoice generation, line-item Singapore GST tax codes (SR, ZR, ES, OS), and database-level RLS policies are active.
                  Detailed ageing buckets, vendor bill tracking, and GST F5 reporting activate in Phase 2 &amp; 3.
                </p>
              </div>
            </div>

            {/* Invoices List Quick Preview */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Subtotal</th>
                    <th className="py-3 px-4 text-right">GST</th>
                    <th className="py-3 px-4 text-right">Total (SGD)</th>
                    <th className="py-3 px-4 text-right">Balance Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-400">
                        No invoices recorded in database yet.
                      </td>
                    </tr>
                  ) : (
                    invoices.slice(0, 10).map((inv) => {
                      const subtotal = Number(inv.subtotal || inv.amount_excl_gst || 0);
                      const gst = Number(inv.gst || inv.taxAmount || 0);
                      const total = Number(inv.total || 0);
                      const amountPaid = Number(inv.amount_paid || 0);
                      const balanceDue = Number(inv.balance_due ?? (total - amountPaid));

                      return (
                        <tr key={inv.id || inv.invoiceNumber} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-[#FF6B00]">
                            {inv.invoiceNumber || inv.id}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-900">
                            {inv.customerName || 'Commercial Client'}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              (inv.status === 'Paid' || inv.paymentStatus === 'Paid')
                                ? 'bg-emerald-100 text-emerald-700'
                                : (inv.status === 'Partially Paid' || inv.paymentStatus === 'Partially Paid')
                                  ? 'bg-blue-100 text-blue-700'
                                  : (inv.status === 'Overdue' || inv.paymentStatus === 'Overdue')
                                    ? 'bg-rose-100 text-rose-700'
                                    : 'bg-amber-100 text-amber-700'
                            }`}>
                              {inv.status || inv.paymentStatus || 'Draft'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono">${subtotal.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right font-mono">${gst.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">${total.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-rose-600">${balanceDue.toFixed(2)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Phase 2 Sub-Tabs Preview */}
        {activeSubTab !== 'overview' && (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#FF6B00] flex items-center justify-center mx-auto">
              <Landmark className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {activeSubTab === 'receivables' ? 'Receivables & Ageing Buckets' : activeSubTab === 'credit_notes' ? 'Credit Notes Management' : 'Vendor Payables'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              This sub-tab activates in <strong>Phase 2</strong>. In Phase 1, database schemas, tax codes, payments, and invoice structures are fully integrated below.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

