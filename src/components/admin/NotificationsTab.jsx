import React from 'react';
import { Bell, CheckCheck, Trash2, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export const NotificationsTab = ({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onClearNotifications
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
              Operations Center
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">
              {notifications.filter(n => !n.read).length} Unread Alerts
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">Operational Alerts & Notifications</h2>
          <p className="text-xs text-slate-500">
            Real-time updates on customer service requests, documentation verification, and road dispatch milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {notifications.length > 0 && onMarkAllAsRead && (
            <button
              onClick={onMarkAllAsRead}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-600">All caught up!</p>
            <p className="text-xs text-slate-400 mt-0.5">No unread operational alerts at this time.</p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => onMarkAsRead && onMarkAsRead(item.id)}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between cursor-pointer ${
                item.read 
                  ? 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/60' 
                  : 'bg-orange-50/40 border-orange-200 hover:bg-orange-50/80 shadow-2xs'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  item.read ? 'bg-slate-200 text-slate-600' : 'bg-[#FF6B00] text-white shadow-xs'
                }`}>
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <p className={`text-xs ${item.read ? 'text-slate-700 font-medium' : 'text-slate-900 font-extrabold'}`}>
                    {item.title || item.message}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-1 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{item.time || item.timestamp || 'Just now'}</span>
                  </p>
                </div>
              </div>

              {!item.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00] shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
