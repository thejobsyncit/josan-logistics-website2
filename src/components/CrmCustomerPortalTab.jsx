import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { 
  Users, 
  Globe, 
  Activity, 
  PlusCircle, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  FileText, 
  ShoppingBag, 
  TrendingUp, 
  ExternalLink, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign,
  Key,
  X,
  Send,
  UserPlus
} from 'lucide-react';

export default function CrmCustomerPortalTab() {
  const { 
    customers = [], 
    leads = [], 
    quotes = [], 
    tickets = [], 
    shipments = [], 
    syncCustomerAppAccount, 
    replySupportTicket, 
    showToast 
  } = useLogistics();

  const [activeSubView, setActiveSubView] = useState('accounts'); // 'accounts' | 'activity' | 'tickets'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketReplyText, setTicketReplyText] = useState('');
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [provisionData, setProvisionData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: 'Mapletree Business City, Singapore 117438',
    tier: 'Enterprise Partner'
  });

  // Filtered customer list
  const filteredCustomers = customers.filter(c => {
    const term = searchQuery.toLowerCase().trim();
    return !term || 
      (c.name && c.name.toLowerCase().includes(term)) ||
      (c.company && c.company.toLowerCase().includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      (c.phone && c.phone.toLowerCase().includes(term));
  });

  // Calculate live customer portal stats
  const totalCustomers = customers.length;
  const totalActiveShipments = shipments.filter(s => s.status !== 'Delivered' && s.status !== 'Cancelled').length;
  const pendingQuotesCount = quotes.filter(q => q.status === 'Draft' || q.status === 'Sent').length;
  const openSupportTicketsCount = tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;

  const handleOpenProvisionModal = (lead = null) => {
    if (lead) {
      setProvisionData({
        name: lead.name || '',
        company: lead.company || '',
        email: lead.email || '',
        phone: lead.phone || '',
        address: 'Pasir Panjang Business District, Singapore',
        tier: 'Enterprise Partner'
      });
    } else {
      setProvisionData({
        name: '',
        company: '',
        email: '',
        phone: '',
        address: 'Pasir Panjang Business District, Singapore',
        tier: 'Enterprise Partner'
      });
    }
    setIsProvisionModalOpen(true);
  };

  const handleConfirmProvision = (e) => {
    e.preventDefault();
    if (!provisionData.email || !provisionData.name) {
      showToast('Name and Email are required to provision Customer App account', 'error');
      return;
    }
    syncCustomerAppAccount(provisionData);
    setIsProvisionModalOpen(false);
  };

  const handleSendTicketReply = (e) => {
    e.preventDefault();
    if (!selectedTicket || !ticketReplyText.trim()) return;
    replySupportTicket(selectedTicket.id, ticketReplyText.trim());
    setTicketReplyText('');
    setSelectedTicket(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Customer App Sync */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-semibold rounded-full flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                Customer App Web & Mobile Portal Link
              </span>
              <span className="text-xs text-slate-400">REST Endpoint: http://13.212.100.125:5000/api</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">Customer App Accounts & Support Hub</h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Seamlessly provision Customer App login accounts for CRM leads, track live booking activities, and respond to support tickets in real time.
            </p>
          </div>

          <button
            onClick={() => handleOpenProvisionModal()}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all self-start lg:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            Provision Customer Account
          </button>
        </div>

        {/* Customer Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Portal Accounts</p>
              <p className="text-base font-bold text-white">{totalCustomers} Corporate Users</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Active Customer Orders</p>
              <p className="text-base font-bold text-emerald-400">{totalActiveShipments} Consignments</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Pending Quote Requests</p>
              <p className="text-base font-bold text-amber-400">{pendingQuotesCount} Quotes</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Open Support Tickets</p>
              <p className="text-base font-bold text-rose-400">{openSupportTicketsCount} Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveSubView('accounts')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubView === 'accounts' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Customer App Accounts ({totalCustomers})
          </button>

          <button
            onClick={() => setActiveSubView('tickets')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubView === 'tickets' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Support Tickets ({openSupportTicketsCount})
          </button>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search accounts or tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* View 1: Customer Accounts Grid */}
      {activeSubView === 'accounts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map(customer => {
            const customerShipments = shipments.filter(s => s.sender === customer.name || s.sender?.includes(customer.company));

            return (
              <div 
                key={customer.id} 
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[10px] font-bold font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                        {customer.id}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-base mt-1">{customer.name}</h3>
                      <p className="text-xs font-semibold text-slate-600">{customer.company || 'Enterprise Corporate'}</p>
                    </div>

                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      App Verified
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-150 mb-4">
                    <p className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {customer.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {customer.phone || '+65 6789 0123'}
                    </p>
                    <p className="flex items-center gap-2 text-slate-500 pt-1 border-t border-slate-200/60">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {customer.address || ' Pasir Panjang Road, Singapore'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs border-y border-slate-100 py-3 mb-4">
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block">Total Shipments</span>
                      <span className="font-extrabold text-slate-900">{customerShipments.length || customer.totalShipments || 12}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block">Account Tier</span>
                      <span className="font-extrabold text-indigo-600">{customer.tier || 'Enterprise'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <a
                    href={`mailto:${customer.email}`}
                    className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200 flex items-center justify-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    Send Email
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View 2: Support Tickets List */}
      {activeSubView === 'tickets' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Customer App Support & Inquiry Inbox</h3>
            <span className="text-xs text-slate-500">Replies sync to Customer App inbox instantly</span>
          </div>

          <div className="divide-y divide-slate-100">
            {tickets.map(ticket => (
              <div key={ticket.id} className="p-4 hover:bg-slate-50/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      #{ticket.id}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{ticket.subject || ticket.title}</h4>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      ticket.status === 'Open' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{ticket.description || ticket.message}</p>
                  <p className="text-[11px] text-slate-400">
                    From: <span className="font-semibold text-slate-700">{ticket.customerName || 'App User'}</span> • {ticket.timestamp || 'Today'}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedTicket(ticket)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start md:self-auto"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Reply via Portal
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Provision Account Modal */}
      {isProvisionModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setIsProvisionModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Provision Customer App Account</h3>
                <p className="text-xs text-slate-500">Generate Customer App login credentials for lead</p>
              </div>
            </div>

            <form onSubmit={handleConfirmProvision} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Contact Name:</label>
                <input
                  type="text"
                  required
                  value={provisionData.name}
                  onChange={(e) => setProvisionData({...provisionData, name: e.target.value})}
                  placeholder="e.g. Darren Vance"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Company Name:</label>
                <input
                  type="text"
                  value={provisionData.company}
                  onChange={(e) => setProvisionData({...provisionData, company: e.target.value})}
                  placeholder="e.g. TechCorp Solutions SG"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address:</label>
                <input
                  type="email"
                  required
                  value={provisionData.email}
                  onChange={(e) => setProvisionData({...provisionData, email: e.target.value})}
                  placeholder="darren@techcorp.sg"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProvisionModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/20"
                >
                  Create & Send Login Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Reply Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Reply to Customer Ticket</h3>
                <p className="text-xs text-slate-500">Ticket #{selectedTicket.id} — {selectedTicket.customerName}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-4 text-xs text-slate-700">
              <p className="font-bold text-slate-900 mb-1">{selectedTicket.subject || selectedTicket.title}</p>
              <p>{selectedTicket.description || selectedTicket.message}</p>
            </div>

            <form onSubmit={handleSendTicketReply} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Response Message:</label>
                <textarea
                  rows={4}
                  required
                  value={ticketReplyText}
                  onChange={(e) => setTicketReplyText(e.target.value)}
                  placeholder="Type your response to the customer..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/20 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Response to Customer App
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
