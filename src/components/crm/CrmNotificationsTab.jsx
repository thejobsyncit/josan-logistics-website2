import React, { useState } from 'react';
import { deduplicateNotifications } from '../../context/LogisticsContext';
import { 
  Bell, 
  Search, 
  Plane, 
  Truck, 
  Receipt, 
  FileSpreadsheet, 
  Trash2, 
  Check 
} from 'lucide-react';

/**
 * Categorizes notifications consistently and case-insensitively
 */
export const getNotificationCategory = (n) => {
  if (!n) return 'general';
  const type = (n.type || '').toLowerCase();
  const title = (n.title || '').toLowerCase();
  const msg = (n.message || '').toLowerCase();

  if (
    type.includes('airway') || 
    title.includes('airway') || 
    title.includes('awb') || 
    msg.includes('awb') ||
    msg.includes('airway')
  ) {
    return 'airway';
  }

  if (
    type.includes('partner') || 
    type.includes('shipment') || 
    type.includes('road') || 
    title.includes('road') || 
    title.includes('partner') || 
    title.includes('consignment') ||
    title.includes('truck') ||
    Boolean(n.shipmentId)
  ) {
    return 'road';
  }

  if (
    type.includes('billing') || 
    type.includes('invoice') || 
    title.includes('invoice') || 
    title.includes('billing') || 
    title.includes('payment') || 
    msg.includes('invoice')
  ) {
    return 'billing';
  }

  if (
    type.includes('quote') || 
    type.includes('quotation') || 
    title.includes('quote') || 
    title.includes('quotation') || 
    Boolean(n.quoteId)
  ) {
    return 'quotes';
  }

  return 'general';
};

export const CrmNotificationsTab = ({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onClearNotifications,
  onNavigateTab
}) => {
  const [filter, setFilter] = useState('All'); // 'All' | 'Unread' | 'Airway' | 'Road' | 'Quotes' | 'Billing'
  const [search, setSearch] = useState('');

  const safeNotifications = deduplicateNotifications(notifications);

  const filteredNotifications = safeNotifications.filter(n => {
    if (!n) return false;
    const term = search.trim().toLowerCase();
    const matchesSearch = !term ||
      (n.title && n.title.toLowerCase().includes(term)) ||
      (n.message && n.message.toLowerCase().includes(term)) ||
      (n.type && n.type.toLowerCase().includes(term)) ||
      (n.shipmentId && String(n.shipmentId).toLowerCase().includes(term)) ||
      (n.quoteId && String(n.quoteId).toLowerCase().includes(term)) ||
      (n.id && String(n.id).toLowerCase().includes(term));

    let matchesFilter = true;
    const category = getNotificationCategory(n);

    if (filter === 'Unread') matchesFilter = !n.read;
    else if (filter === 'Airway') matchesFilter = category === 'airway';
    else if (filter === 'Road') matchesFilter = category === 'road';
    else if (filter === 'Billing') matchesFilter = category === 'billing';
    else if (filter === 'Quotes') matchesFilter = category === 'quotes';

    return matchesSearch && matchesFilter;
  });

  const getNotifIcon = (n) => {
    const category = getNotificationCategory(n);
    if (category === 'airway') {
      return <Plane className="w-4 h-4 text-[#2463EB]" />;
    }
    if (category === 'road') {
      return <Truck className="w-4 h-4 text-blue-600" />;
    }
    if (category === 'billing') {
      return <Receipt className="w-4 h-4 text-emerald-600" />;
    }
    if (category === 'quotes') {
      return <FileSpreadsheet className="w-4 h-4 text-purple-600" />;
    }
    return <Bell className="w-4 h-4 text-slate-600" />;
  };

  const getDestinationTab = (n) => {
    const category = getNotificationCategory(n);
    if (category === 'airway') return 'airway-requests';
    if (category === 'road') return 'road-shipments';
    if (category === 'quotes') return 'quotations';
    if (category === 'billing') return 'billing';
    return null;
  };

  const unreadCount = safeNotifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id) => {
    if (typeof onMarkAsRead === 'function') {
      onMarkAsRead(id);
    }
  };

  const handleMarkAllAsRead = () => {
    if (typeof onMarkAllAsRead === 'function') {
      onMarkAllAsRead();
    }
  };

  const handleClearNotifications = () => {
    if (typeof onClearNotifications === 'function') {
      onClearNotifications();
    }
  };

  const handleNavigate = (tab) => {
    if (typeof onNavigateTab === 'function') {
      onNavigateTab(tab);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900 font-heading">Operations Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#EAF2FF] text-[#2463EB]">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Alerts about quote requests, contact messages and account activity.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mark all read</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleClearNotifications}
            className="px-3 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear alerts</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-1.5 text-xs font-bold">
          {['All', 'Unread', 'Airway', 'Road', 'Quotes', 'Billing'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                filter === f
                  ? 'bg-[#0B1F5B] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notification messages..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2463EB]/20 focus:border-[#2463EB]"
          />
        </div>
      </div>

      {/* Notifications Stream */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card divide-y divide-slate-100 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">
            No notifications match your current filter.
          </div>
        ) : (
          filteredNotifications.map((n, idx) => {
            const destTab = getDestinationTab(n);
            const notifKey = n.id ? `notif-${n.id}` : `notif-${idx}`;
            const isRead = Boolean(n.read);

            return (
              <div
                key={notifKey}
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                  !isRead ? 'bg-[#EAF2FF]/30 hover:bg-[#EAF2FF]/50' : 'hover:bg-slate-50/80'
                }`}
              >
                <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                    {getNotifIcon(n)}
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                        {n.title || 'System Notification'}
                      </h4>
                      {!isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#2463EB] shrink-0"></span>
                      )}
                    </div>

                    <p className="text-slate-600 text-xs leading-relaxed">
                      {n.message || 'Notification alert received.'}
                    </p>

                    <div className="flex items-center space-x-3 text-[10px] text-slate-400 font-mono pt-0.5">
                      <span>{n.timestamp || 'Recent'}</span>
                      {n.shipmentId && (
                        <span className="text-slate-500 font-bold">Consignment: #{n.shipmentId}</span>
                      )}
                      {n.quoteId && (
                        <span className="text-slate-500 font-bold">Quote: #{n.quoteId}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-1.5 shrink-0">
                  {!isRead && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(n.id)}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  {destTab && (
                    <button
                      type="button"
                      onClick={() => handleNavigate(destTab)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      View
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
