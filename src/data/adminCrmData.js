export const initialCargoPricing = [
  {
    id: 'cargo-gen-01',
    name: 'General Cargo',
    code: 'GEN',
    category: 'General',
    description: 'Standard palletized, consolidated dry goods and packaged commercial merchandise.',
    active: true,
    basePricePerKg: 3.50,
    minimumCharge: 50.00,
    weightSlabs: [
      { minWeight: 0, maxWeight: 100, pricePerKg: 3.80 },
      { minWeight: 101, maxWeight: 500, pricePerKg: 3.50 },
      { minWeight: 501, maxWeight: 999999, pricePerKg: 3.00 }
    ]
  },
  {
    id: 'cargo-fra-02',
    name: 'Fragile Cargo',
    code: 'FRG',
    category: 'Fragile',
    description: 'Delicate glassware, optical instruments, calibrated laboratory apparatus and ceramics.',
    active: true,
    basePricePerKg: 4.80,
    minimumCharge: 75.00,
    weightSlabs: [
      { minWeight: 0, maxWeight: 100, pricePerKg: 5.20 },
      { minWeight: 101, maxWeight: 500, pricePerKg: 4.80 },
      { minWeight: 501, maxWeight: 999999, pricePerKg: 4.20 }
    ]
  },
  {
    id: 'cargo-per-03',
    name: 'Perishable Cargo',
    code: 'PER',
    category: 'Perishable',
    description: 'Fresh seafood, agricultural produce, cut flowers and short shelf-life commercial goods.',
    active: true,
    basePricePerKg: 5.50,
    minimumCharge: 90.00,
    weightSlabs: [
      { minWeight: 0, maxWeight: 100, pricePerKg: 6.00 },
      { minWeight: 101, maxWeight: 500, pricePerKg: 5.50 },
      { minWeight: 501, maxWeight: 999999, pricePerKg: 4.90 }
    ]
  },
  {
    id: 'cargo-elec-04',
    name: 'Electronic Goods',
    code: 'ELC',
    category: 'Electronics',
    description: 'Microchips, printed circuit assemblies, consumer technology and communication hardware.',
    active: true,
    basePricePerKg: 4.20,
    minimumCharge: 60.00,
    weightSlabs: [
      { minWeight: 0, maxWeight: 100, pricePerKg: 4.50 },
      { minWeight: 101, maxWeight: 500, pricePerKg: 4.20 },
      { minWeight: 501, maxWeight: 999999, pricePerKg: 3.75 }
    ]
  },
  {
    id: 'cargo-doc-05',
    name: 'Documents',
    code: 'DOC',
    category: 'Documents',
    description: 'Confidential business dossiers, trade agreements, tender blue-prints and shipping manifests.',
    active: true,
    basePricePerKg: 2.50,
    minimumCharge: 25.00,
    weightSlabs: [
      { minWeight: 0, maxWeight: 10, pricePerKg: 2.50 },
      { minWeight: 11, maxWeight: 50, pricePerKg: 2.20 },
      { minWeight: 51, maxWeight: 999999, pricePerKg: 1.90 }
    ]
  },
  {
    id: 'cargo-oth-06',
    name: 'Other',
    code: 'OTH',
    category: 'Other',
    description: 'Custom industrial machinery spares, oversized hardware and non-standard commercial consignments.',
    active: true,
    basePricePerKg: 4.00,
    minimumCharge: 60.00,
    weightSlabs: [
      { minWeight: 0, maxWeight: 100, pricePerKg: 4.20 },
      { minWeight: 101, maxWeight: 500, pricePerKg: 4.00 },
      { minWeight: 501, maxWeight: 999999, pricePerKg: 3.60 }
    ]
  }
];

export const initialSystemUsers = [
  {
    id: 'USR-ADM-001',
    name: 'Alexander Josan',
    email: 'admin@josanlogistics.com',
    role: 'admin',
    roleTitle: 'Chief Administrator',
    status: 'Active',
    phone: '+65 6789 0100',
    company: 'Josan Logistics HQ',
    lastLogin: '2026-10-06 09:15 AM',
    permissions: ['all']
  },
  {
    id: 'USR-CRM-002',
    name: 'Jessica Tan',
    email: 'jessica.tan@josanlogistics.com',
    role: 'crm_manager',
    roleTitle: 'CRM Operations Lead',
    status: 'Active',
    phone: '+65 6789 0123',
    company: 'Josan Logistics Operations',
    lastLogin: '2026-10-06 08:30 AM',
    permissions: ['customers', 'airway_requests', 'road_shipments', 'cargo_pricing', 'documents', 'quotations', 'billing', 'transportation_partners', 'reports']
  },
  {
    id: 'USR-OPS-003',
    name: 'David Ng',
    email: 'david.ng@josanlogistics.com',
    role: 'crm_ops',
    roleTitle: 'Logistics Dispatch Coordinator',
    status: 'Active',
    phone: '+65 8234 5678',
    company: 'Singapore Operations Hub',
    lastLogin: '2026-10-05 04:45 PM',
    permissions: ['airway_requests', 'road_shipments', 'cargo_pricing', 'documents', 'transportation_partners']
  },
  {
    id: 'USR-FIN-004',
    name: 'Priya Sharma',
    email: 'priya.sharma@josanlogistics.com',
    role: 'crm_finance',
    roleTitle: 'Billing & Commercial Accounts',
    status: 'Active',
    phone: '+65 9876 5432',
    company: 'Josan Finance Department',
    lastLogin: '2026-10-05 02:10 PM',
    permissions: ['customers', 'quotations', 'billing', 'reports']
  },
  {
    id: 'USR-CUST-005',
    name: 'Marcus Vance',
    email: 'shipping@techcorp.com',
    role: 'customer',
    roleTitle: 'Corporate Client Contact',
    status: 'Active',
    phone: '+65 9112 3456',
    company: 'TechCorp Solutions SG',
    lastLogin: '2026-10-04 11:20 AM',
    permissions: ['customer_portal']
  }
];

export const initialCrmRolePermissions = {
  admin: {
    dashboard: true,
    customers: true,
    airway_requests: true,
    road_shipments: true,
    cargo_pricing: true,
    documents: true,
    quotations: true,
    billing: true,
    transportation_partners: true,
    notifications: true,
    reports: true,
    settings: true
  },
  crm_manager: {
    dashboard: true,
    customers: true,
    airway_requests: true,
    road_shipments: true,
    cargo_pricing: true,
    documents: true,
    quotations: true,
    billing: true,
    transportation_partners: true,
    notifications: true,
    reports: true,
    settings: false
  },
  crm_ops: {
    dashboard: true,
    customers: true,
    airway_requests: true,
    road_shipments: true,
    cargo_pricing: true,
    documents: true,
    quotations: false,
    billing: false,
    transportation_partners: true,
    notifications: true,
    reports: false,
    settings: false
  },
  crm_finance: {
    dashboard: true,
    customers: true,
    airway_requests: false,
    road_shipments: false,
    cargo_pricing: true,
    documents: true,
    quotations: true,
    billing: true,
    transportation_partners: false,
    notifications: true,
    reports: true,
    settings: false
  },
  viewer: {
    dashboard: true,
    customers: true,
    airway_requests: true,
    road_shipments: true,
    cargo_pricing: true,
    documents: true,
    quotations: true,
    billing: false,
    transportation_partners: true,
    notifications: true,
    reports: true,
    settings: false
  }
};

export const initialWebsiteContent = {
  hero: {
    badge: 'IATA & ACRA Compliant Commercial Logistics',
    title: 'Precision Airway & Commercial Road Freight Logistics',
    subtitle: 'Streamlining Singapore cargo transport with dedicated master AWB preparation, customs documentation, TradeNet declarations, and haulage partner coordination.',
    ctaPrimary: 'Request Air Freight Service',
    ctaSecondary: 'Book Road Consignment'
  },
  about: {
    tagline: 'Singapore Commercial Logistics Specialist',
    mission: 'Providing transparent, high-integrity air freight documentation and third-party road transportation dispatch for Singapore enterprises.',
    vision: 'To be the most reliable documentation and commercial road freight coordinator across Singapore industrial corridors.',
    highlights: [
      'Comprehensive Master Air Waybill (AWB) preparation & airline billing',
      'End-to-end commercial road freight via trusted 3rd-party haulage partners',
      'TradeNet export/import documentation & Certificate of Origin processing',
      'Real-time status transparency across all operational milestones'
    ],
    stats: [
      { label: 'Active Enterprise Clients', value: '450+' },
      { label: 'Monthly Consignments Coordinated', value: '2,800+' },
      { label: 'Documentation Compliance Rate', value: '99.8%' },
      { label: 'Singapore Industrial Corridors', value: '100%' }
    ]
  },
  services: {
    airway: {
      title: 'Air Freight Services & AWB Preparation',
      shortDesc: 'Master AWB documentation, airline coordination, and airport feeder transportation support for Changi Air Cargo Complex.'
    },
    road: {
      title: 'Commercial Road Transportation',
      shortDesc: 'Domestic linehaul trucking, FTL container movements, and dedicated partner dispatches across Singapore industrial zones.'
    },
    documentation: {
      title: 'Customs & Shipment Documentation Support',
      shortDesc: 'TradeNet export/import declarations, commercial invoice generation, packing lists, and Certificates of Origin.'
    }
  },
  contact: {
    phone: '+65 6789 0123',
    email: 'operations@josanlogistics.com',
    supportEmail: 'support@josanlogistics.com',
    address: '10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438',
    operatingHours: 'Mon - Fri: 08:00 AM - 07:00 PM (SGT) | Sat: 08:00 AM - 01:00 PM',
    emergencyHotline: '+65 6789 0123'
  },
  faqs: [
    {
      id: 'faq-1',
      q: 'Does Josan Logistics own aircraft or airline terminals?',
      a: 'No. Josan Logistics provides Air Waybill (AWB) preparation, AWB billing, shipment documentation, and airport feeder transportation support in coordination with scheduled commercial air carriers.'
    },
    {
      id: 'faq-2',
      q: 'Does Josan Logistics operate its own private vehicle fleet?',
      a: 'Josan coordinates commercial road transportation through contracted, third-party logistics and haulage partner carriers across Singapore industrial corridors.'
    },
    {
      id: 'faq-3',
      q: 'How are freight quotes calculated?',
      a: 'Quotes are calculated based on shipment route, cargo type, dimensions, weight, and partner availability after you submit a quote request. We reply with a formal quote, and payment is arranged only after you accept.'
    },
    {
      id: 'faq-4',
      q: 'What documentation assistance is provided?',
      a: 'We assist with Commercial Invoices, Packing Lists, Certificates of Origin, and Air Waybills. We provide documentation support only and do not provide customs clearance or act as a customs broker.'
    }
  ],
  banner: {
    active: false,
    text: 'Standardized Air Freight Documentation & Domestic Linehaul Support available across all Singapore hubs.',
    type: 'info'
  }
};

export const initialManagedServices = {
  airway: {
    id: 'airway',
    name: 'Air Freight Services',
    description: 'Master AWB documentation, airline coordination, and airport feeder transportation support.',
    badge: 'AWB Preparation & Billing',
    active: true
  },
  road: {
    id: 'road',
    name: 'Road Transportation',
    description: 'Commercial domestic trucking, FTL & LTL linehaul via 3rd-party logistics partner carriers.',
    badge: 'Third-Party Linehaul',
    active: true
  },
  documentation: {
    id: 'documentation',
    name: 'Customs & Shipment Documentation Support',
    description: 'TradeNet clearance declarations, commercial invoices, packing lists, and certificate of origin.',
    badge: 'TradeNet Ready',
    active: true
  }
};

export const initialAdminActivityLog = [
  {
    id: 'act-101',
    action: 'System Initialized',
    details: 'Admin Portal & CRM separation verified with unified logistics database.',
    timestamp: '2026-10-06 09:00 AM',
    user: 'Alexander Josan'
  },
  {
    id: 'act-102',
    action: 'Cargo Pricing Verified',
    details: 'CRM Cargo & Pricing module initialized with 6 standardized cargo classifications.',
    timestamp: '2026-10-06 09:30 AM',
    user: 'System'
  },
  {
    id: 'act-103',
    action: 'Public Services Active',
    details: 'Air Freight Services, Road Transportation, and Documentation Support set to active status.',
    timestamp: '2026-10-06 10:00 AM',
    user: 'Alexander Josan'
  }
];

export const calculateCargoPricingHelper = (cargoItem, weightKg = 0) => {
  const weight = Math.max(0, Number(weightKg) || 0);
  if (!cargoItem || !cargoItem.active) {
    return {
      pricePerKg: 0,
      estimatedCargoCharge: 0,
      appliedSlab: null,
      isMinChargeApplied: false,
      minimumCharge: 0
    };
  }

  let effectiveRate = Number(cargoItem.basePricePerKg) || 0;
  let appliedSlab = null;

  if (Array.isArray(cargoItem.weightSlabs) && cargoItem.weightSlabs.length > 0) {
    const matchedSlab = cargoItem.weightSlabs.find(
      slab => weight >= Number(slab.minWeight) && weight <= Number(slab.maxWeight)
    );
    if (matchedSlab && Number(matchedSlab.pricePerKg) > 0) {
      effectiveRate = Number(matchedSlab.pricePerKg);
      appliedSlab = matchedSlab;
    }
  }

  const rawCharge = weight * effectiveRate;
  const minCharge = Number(cargoItem.minimumCharge) || 0;
  const isMinChargeApplied = minCharge > 0 && rawCharge < minCharge;
  const estimatedCargoCharge = isMinChargeApplied ? minCharge : Number(rawCharge.toFixed(2));

  return {
    pricePerKg: effectiveRate,
    estimatedCargoCharge,
    appliedSlab,
    isMinChargeApplied,
    minimumCharge: minCharge
  };
};
