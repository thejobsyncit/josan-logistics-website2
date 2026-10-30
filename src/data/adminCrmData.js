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
      { minWeight: 0, maxWeight: 100, pricePerKg: 3.50 },
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
    basePricePerKg: 5.00,
    minimumCharge: 90.00,
    weightSlabs: [
      { minWeight: 0, maxWeight: 100, pricePerKg: 6.00 },
      { minWeight: 101, maxWeight: 500, pricePerKg: 5.00 },
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
    roleTitle: 'Admin',
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
    roleTitle: 'Operations Manager',
    status: 'Active',
    phone: '+65 6789 0123',
    company: 'Josan Logistics Operations',
    lastLogin: '2026-10-06 08:30 AM',
    permissions: ['customers', 'airway_requests', 'road_shipments', 'documents', 'quotations', 'billing', 'transportation_partners', 'reports']
  },
  {
    id: 'USR-OPS-003',
    name: 'David Ng',
    email: 'david.ng@josanlogistics.com',
    role: 'crm_ops',
    roleTitle: 'Coordinator',
    status: 'Active',
    phone: '+65 8234 5678',
    company: 'Singapore Operations Hub',
    lastLogin: '2026-10-05 04:45 PM',
    permissions: ['airway_requests', 'road_shipments', 'documents', 'transportation_partners']
  },
  {
    id: 'USR-FIN-004',
    name: 'Priya Sharma',
    email: 'priya.sharma@josanlogistics.com',
    role: 'crm_finance',
    roleTitle: 'Finance',
    status: 'Active',
    phone: '+65 9876 5432',
    company: 'Josan Finance Department',
    lastLogin: '2026-10-05 02:10 PM',
    permissions: ['customers', 'quotations', 'billing', 'reports']
  },
  {
    id: 'USR-VIEW-006',
    name: 'Michael Lim',
    email: 'michael.lim@josanlogistics.com',
    role: 'viewer',
    roleTitle: 'Read-only',
    status: 'Active',
    phone: '+65 6789 0199',
    company: 'Compliance & Audit SG',
    lastLogin: '2026-10-05 11:30 AM',
    permissions: ['dashboard', 'customers', 'airway_requests', 'road_shipments', 'documents', 'quotations', 'transportation_partners', 'notifications', 'reports']
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
    badge: '',
    title: 'Reliable Logistics Solutions For Every Journey',
    subtitle: 'From Air Waybill preparation and shipment documentation to commercial road transportation, we provide reliable logistics support for businesses moving goods from one location to another.',
    ctaPrimary: 'Get a Freight Quote',
    ctaSecondary: ''
  },
  about: {
    tagline: 'Air freight documentation and road transportation coordination in Singapore',
    mission: 'To provide dependable, practical logistics support that helps businesses move their goods through suitable transportation and documentation solutions.',
    vision: 'To build a trusted logistics service focused on reliable transportation coordination, accurate documentation and professional customer support.',
    highlights: [
      'Air Waybill (AWB) preparation and airline billing coordination',
      'Commercial road transportation via trusted partner transport operators',
      'Shipment checklists and document preparation support for air freight',
      'Clear shipment status updates and responsive communication'
    ],
    stats: [
      { label: 'Reliable Support', value: '100%' },
      { label: 'Commercial Cargo Coverage', value: 'Singapore' },
      { label: 'Shipment Tracking', value: 'Real-Time' },
      { label: 'Commercial Focus', value: 'B2B Cargo' }
    ]
  },
  services: {
    airway: {
      title: 'Air Freight Services',
      shortDesc: 'Air Waybill preparation, billing and shipment documentation support for commercial air freight.'
    },
    road: {
      title: 'Commercial Road Transportation',
      shortDesc: 'Commercial road transportation coordinated through partner carriers, based on your shipment requirements.'
    },
    documentation: {
      title: 'Shipment Documentation Support',
      shortDesc: 'Help preparing and organising shipment documents. Documentation support only; we do not provide customs clearance.'
    }
  },
  contact: {
    phone: '+65 6789 0123',
    email: 'contact@josanlogistics.com.sg',
    address: '10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438',
    description: 'Phone number, email, office address and opening hours.',
    operatingHours: '[ENTER REAL HOURS]'
  },
  faqs: [
    {
      id: 'faq-1',
      q: 'How do I get a quote?',
      a: 'Use the Get a Quote button, or send us a message with your cargo details.'
    },
    {
      id: 'faq-2',
      q: 'How can I track my shipment?',
      a: 'Use Track Shipment with your tracking number; status updates are entered by our operations team and show a "Last updated" time.'
    },
    {
      id: 'faq-3',
      q: 'What information do you need to prepare an Air Waybill?',
      a: 'Shipper and consignee details, cargo description, weight and dimensions, commercial invoice and packing list.'
    },
    {
      id: 'faq-4',
      q: 'Do you own the trucks?',
      a: 'We coordinate road transportation through our partner operators.'
    },
    {
      id: 'faq-5',
      q: 'Can you help with shipping documents?',
      a: 'Yes. We help prepare and organise shipment documents such as the Air Waybill, commercial invoice and packing list. We do not provide customs clearance or act as a customs broker. Required documents vary by cargo, origin and destination.'
    }
  ],
  banner: {
    active: false,
    text: 'Air freight documentation support and road transportation coordination in Singapore.',
    type: 'info'
  }
};

export const initialManagedServices = {
  airway: {
    id: 'airway',
    name: 'Air Freight Services',
    description: 'Air Waybill preparation, billing and shipment documentation support for commercial air freight.',
    badge: 'AWB Preparation & Billing',
    active: true
  },
  road: {
    id: 'road',
    name: 'Commercial Road Transportation',
    description: 'Commercial road transportation coordinated through partner carriers, based on your shipment requirements.',
    badge: 'Partner Carriers',
    active: true
  },
  documentation: {
    id: 'documentation',
    name: 'Shipment Documentation Support',
    description: 'Help preparing and organising shipment documents. Documentation support only; we do not provide customs clearance.',
    badge: 'Documentation Only',
    active: false
  }
};

export const initialAdminActivityLog = [];

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
