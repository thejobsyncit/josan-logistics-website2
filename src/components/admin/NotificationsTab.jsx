import React from 'react';
import { Bell, CheckCheck, Clock, ExternalLink } from 'lucide-react';
import { formatNotificationTime } from '../../utils/dateTime';

export const NotificationsTab = ({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onClearNotifications,
  onNotificationClick
}) => {
  const unreadAlertsCount = notifications.filter(n => !n.read_at).length;

  const handleClickItem = (item) => {
    if (typeof onNotificationClick === 'function') {
      onNotificationClick(item);
    } else if (typeof onMarkAsRead === 'function') {
      onMarkAsRead(item.id);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black text-[#2463EB] uppercase tracking-wider bg-[#EAF2FF] px-2.5 py-0.5 rounded-full border border-[#DCE5F0]">
              Operations Center
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">
              {unreadAlertsCount} Unread Alerts
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">Operational Alerts & Notifications</h2>
          <p className="text-xs text-slate-500">
            Alerts about quote requests, contact messages and account activity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadAlertsCount > 0 && onMarkAllAsRead && (
            <button
              type="button"
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
          notifications.map((item) => {
            const isRead = Boolean(item.read_at);
            const timeDisplay = formatNotificationTime(item.created_at || item.createdAt);

            return (
              <div
                key={item.id}
                onClick={() => handleClickItem(item)}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                  isRead 
                    ? 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/60' 
                    : 'bg-[#EAF2FF]/40 border-[#DCE5F0] hover:bg-[#EAF2FF]/80 shadow-2xs'
                }`}
              >
                <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isRead ? 'bg-slate-200 text-slate-600' : 'bg-[#2463EB] text-white shadow-xs'
                  }`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <p className={`text-xs ${isRead ? 'text-slate-700 font-medium' : 'text-slate-900 font-extrabold'}`}>
                      {item.title || 'System Notification'}
                    </p>
                    {item.body && (
                      <p className="text-xs text-slate-600 leading-relaxed break-words">
                        {item.body}
                      </p>
                    )}
                    <p className="text-[10px] text-slate-400 font-mono pt-0.5 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{timeDisplay}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {item.link && (
                    <span className="text-[11px] font-bold text-[#2463EB] flex items-center space-x-1 hover:underline">
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  )}
                  {!isRead && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2463EB] shrink-0" />
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
