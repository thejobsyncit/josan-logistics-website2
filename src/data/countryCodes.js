export const countryCodesList = [
  { code: '+65', country: 'Singapore', flag: '🇸🇬', digits: 8 },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾', digits: 9 },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩', digits: 10 },
  { code: '+66', country: 'Thailand', flag: '🇹🇭', digits: 9 },
  { code: '+84', country: 'Vietnam', flag: '🇻🇳', digits: 9 },
  { code: '+63', country: 'Philippines', flag: '🇵🇭', digits: 10 },
  { code: '+91', country: 'India', flag: '🇮🇳', digits: 10 },
  { code: '+61', country: 'Australia', flag: '🇦🇺', digits: 9 },
  { code: '+86', country: 'China', flag: '🇨🇳', digits: 11 },
  { code: '+81', country: 'Japan', flag: '🇯🇵', digits: 10 },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧', digits: 10 },
  { code: '+1', country: 'United States', flag: '🇺🇸', digits: 10 }
];

export const getCountryName = (code) => {
  const item = countryCodesList.find(c => c.code === code);
  return item ? `${item.flag} ${item.country}` : code;
};

export const getPhoneLength = (code) => {
  const item = countryCodesList.find(c => c.code === code);
  return item ? item.digits : 8;
};
