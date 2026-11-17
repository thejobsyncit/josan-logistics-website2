export const PLACEHOLDER_PHONE = '';
export const PHONE_PLACEHOLDER_LABEL = '[+65 XXXX XXXX]';
export const LEGACY_PLACEHOLDER_HOURS = 'Mon - Fri: 08:00 AM - 07:00 PM (SGT) | Sat: 08:00 AM - 01:00 PM';
export const CUSTOMER_DEMO_TABS = false;

export const COMPANY_INFO = {
  legalName: 'Josan Logistics Pte. Ltd.',
  uen: '202619465E',
  yearIncorporated: 2026,
  address: '10 Jalan Besar, #15-02, Sim Lim Tower, Singapore 208787',
  businessHours: 'Monday to Friday, 9:00 am to 6:00 pm',
  timezoneNote: 'Singapore time',
  // Replace with your confirmed Singapore business phone number in this single place
  phone: PHONE_PLACEHOLDER_LABEL,
  email: 'contact@josanlogistics.com.sg',
};

export function isLegacyOfficeAddress(address) {
  if (!address || typeof address !== 'string') return true;
  const trimmed = address.trim();
  if (!trimmed) return true;
  if (trimmed.toUpperCase() === COMPANY_INFO.address.toUpperCase() && trimmed !== COMPANY_INFO.address) {
    return true;
  }
  return (/business\s+city/i.test(trimmed) || /#12-01/i.test(trimmed)) && /singapore/i.test(trimmed);
}

export const SITE_CONTACT = {
  legalName: COMPANY_INFO.legalName,
  uen: COMPANY_INFO.uen,
  yearIncorporated: COMPANY_INFO.yearIncorporated,
  phoneDisplay: COMPANY_INFO.phone,
  email: COMPANY_INFO.email,
  address: COMPANY_INFO.address,
  businessHours: COMPANY_INFO.businessHours,
  timezoneNote: COMPANY_INFO.timezoneNote,
};

/**
 * Checks if a phone number string is valid to display to visitors.
 * If empty, contains "X" or contains "[", returns false.
 */
export function isDisplayablePhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const trimmed = phone.trim();
  if (!trimmed) return false;
  if (trimmed.includes('X') || trimmed.includes('[')) return false;
  const digits = trimmed.replace(/\D/g, '');
  if (digits === '6567890123' || digits === '67890123') return false;
  return true;
}

/**
 * Returns formatted display label, tel: href, WhatsApp href, and confirmation flag from shared phone config.
 */
export function getPhoneLinks(overridePhone) {
  const cleanOverride = typeof overridePhone === 'string' ? overridePhone.trim() : '';
  const useOverride =
    cleanOverride &&
    isDisplayablePhone(cleanOverride) &&
    cleanOverride !== PLACEHOLDER_PHONE &&
    cleanOverride !== PHONE_PLACEHOLDER_LABEL;
  const display = useOverride ? cleanOverride : COMPANY_INFO.phone;
  const hasConfirmedPhone = Boolean(display && isDisplayablePhone(display) && display !== PLACEHOLDER_PHONE);
  const tel = hasConfirmedPhone ? display.replace(/[\s()-]/g, '') : '';
  const whatsappDigits = hasConfirmedPhone ? display.replace(/[^0-9]/g, '') : '';

  return {
    display,
    hasConfirmedPhone,
    telHref: hasConfirmedPhone ? `tel:${tel}` : undefined,
    whatsappHref: hasConfirmedPhone ? `https://wa.me/${whatsappDigits}` : undefined,
  };
}

