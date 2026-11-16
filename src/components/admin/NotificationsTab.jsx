import React from 'react';
import { Bell } from 'lucide-react';
import { formatSingaporeDateTime } from '../../utils/dateTime';

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
    <div className="space-y-5 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs text-slate-500 font-medium">
            Operations Center / Notifications
          </p>
          <h2 className="text-2xl font-black text-slate-900 font-heading tracking-tight">
            Operational Alerts &amp; Notifications
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Alerts about quote requests and account activity · {unreadAlertsCount} unread
          </p>
        </div>

        {onMarkAllAsRead && (
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer self-start sm:self-auto py-1"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-700">All caught up!</p>
            <p className="text-xs text-slate-400 mt-0.5">No operational alerts at this time.</p>
          </div>
        ) : (
          notifications.map((item) => {
            const isRead = Boolean(item.read_at);
            const timeDisplay = formatSingaporeDateTime(item.created_at || item.createdAt) || 'Recent';
            const actionText = (item.title?.toLowerCase().includes('quote') || item.body?.includes('QR-') || item.link?.includes('quote'))
              ? 'View quote →'
              : 'View →';

            return (
              <div
                key={item.id}
                onClick={() => handleClickItem(item)}
                className={`p-4 sm:px-6 sm:py-4.5 flex items-center justify-between gap-4 transition-colors cursor-pointer group ${
                  isRead ? 'hover:bg-slate-50/70 bg-white' : 'hover:bg-blue-50/40 bg-blue-50/20'
                }`}
              >
                <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                  {/* Indicator Dot */}
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <span className={`w-1.5 h-1.5 rounded-full ${isRead ? 'bg-slate-400' : 'bg-[#2563EB]'}`} />
                  </div>

                  {/* Title & Metadata Line */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {item.title || 'System Notification'}
                    </p>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate">
                      {item.body ? `${item.body} · ` : ''}
                      <span>{isRead ? 'Read' : 'Unread'}</span>
                      {' · '}
                      <span>{timeDisplay}</span>
                    </p>
                  </div>
                </div>

                {/* Right Action */}
                <div className="shrink-0">
                  <span className="text-xs font-bold text-[#2563EB] group-hover:underline">
                    {actionText}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
