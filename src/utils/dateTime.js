/**
 * Formats a date/timestamp to Singapore Time (SGT, Asia/Singapore):
 * Example: "7 Nov 2026, 8:20 pm"
 */
export function formatSingaporeDateTime(dateInput) {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';

  const str = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Singapore',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(d);

  // Normalize spaces and ensure lower-case am/pm (e.g. "7 Nov 2026, 8:20 pm")
  return str.replace(/[\u202F\u00A0]/g, ' ').replace(/\b(AM|PM)\b/gi, (m) => m.toLowerCase());
}

/**
 * Formats notification created_at time:
 * - Items under one hour old: relative text (e.g. "5 minutes ago", "Just now" for <1 min)
 * - Items one hour or older: real Singapore time (e.g. "7 Nov 2026, 8:20 pm")
 * - Never shows "Just now" for older items.
 */
export function formatNotificationTime(created_at) {
  if (!created_at) return '';
  const d = new Date(created_at);
  if (isNaN(d.getTime())) return '';

  const diffMs = Date.now() - d.getTime();
  const oneHourMs = 60 * 60 * 1000;

  if (diffMs >= 0 && diffMs < oneHourMs) {
    const minutes = Math.floor(diffMs / (60 * 1000));
    if (minutes < 1) return 'Just now';
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }

  return formatSingaporeDateTime(d);
}

