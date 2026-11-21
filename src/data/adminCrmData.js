import { COMPANY_INFO, SITE_CONTACT } from '../config/siteConfig';

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
  },
  OPERATIONS: {
    dashboard: true,
    customers: true,
    airway_requests: false,
    road_shipments: true,
    documents: true,
    quotations: false,
    billing: false,
    transportation_partners: true,
    notifications: true,
    reports: true,
    settings: false
  },
  AIRWAY_EXECUTIVE: {
    dashboard: true,
    customers: true,
    airway_requests: true,
    road_shipments: false,
    documents: true,
    quotations: true,
    billing: true,
    transportation_partners: false,
    notifications: true,
    reports: true,
    settings: false
  },
  FINANCE: {
    dashboard: true,
    customers: true,
    airway_requests: true,
    road_shipments: true,
    documents: true,
    quotations: true,
    billing: true,
    transportation_partners: false,
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
    mission: 'We prepare air freight documents correctly and arrange road transport for businesses shipping from Singapore. We keep you informed at each step.',
    vision: 'We want to be the company businesses in Singapore come back to for their air freight paperwork and road transport. We plan to grow our services as our customers ask for them.',
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
    ],
    howWeWork: {
      heading: 'How we work',
      intro: 'The first three steps are the same for every job. What happens next depends on whether you need air freight documents or road transport.',
      steps: [
        {
          number: '1',
          title: 'Send your request',
          desc: 'Tell us what you are shipping and what you need. We prepare a quote.'
        },
        {
          number: '2',
          title: 'We check your documents',
          desc: 'A member of our team checks your shipment documents and emails you the confirmed details and the quote.'
        },
        {
          number: '3',
          title: 'You confirm and pay',
          desc: 'Once you are happy with the quote, you pay by bank transfer or PayNow.'
        }
      ],
      nextHeading: 'What happens next',
      nextOptions: [
        {
          id: 'air',
          title: 'Air freight',
          desc: 'We prepare your Air Waybill and the billing and shipment documents, and contact you by email or phone call.'
        },
        {
          id: 'road',
          title: 'Road transport',
          desc: 'We arrange the transport with our partner carriers and coordinate your shipment until it is delivered.'
        }
      ]
    },
    whereToFindUs: {
      heading: 'Where to find us',
      labels: {
        address: 'Address',
        businessHours: 'Business hours',
        phone: 'Phone',
        email: 'Email'
      },
      openInMapsLabel: 'Open in Google Maps',
      mapTitle: 'Map showing Josan Logistics office at Sim Lim Tower, Jalan Besar',
      mapUnavailableText: 'Google Maps embed could not load.'
    },
    closingCta: {
      heading: 'Send us your shipment details and we will quote.',
      subtext: 'Tell us what you are shipping and what you need: air freight documents, road transport, or both.',
      primaryLabel: 'Get a Quote',
      secondaryLabel: 'Contact us'
    }
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
    phone: SITE_CONTACT.phoneDisplay,
    email: SITE_CONTACT.email,
    address: SITE_CONTACT.address,
    description: 'Phone number, email, office address and opening hours.',
    operatingHours: `${COMPANY_INFO.businessHours} (${COMPANY_INFO.timezoneNote})`
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
  },
  airFreight: {
    hero: {
      title: 'AWB, Billing & Shipment Documentation',
      subtitle: 'We prepare Air Waybills and handle the billing and shipment documents for commercial air freight.',
      ctaLabel: 'Get a Quote',
      image: '/assets/air_background.png',
      imageAlt: 'Commercial air cargo aircraft on an airport tarmac at night'
    },
    intro: {
      heading: 'Air freight paperwork, prepared for you',
      paragraphs: [
        'We prepare your Air Waybill from your shipment details and work out the billing that goes with it. Our team checks your commercial invoice, packing list and other shipment documents before anything is issued.',
        'We handle the paperwork only. We do not book flights or carry cargo, so you or your forwarder arrange the flight with the airline.'
      ],
      linkLabel: 'See what we need from you',
      linkTarget: '#what-we-need',
      image: '/assets/air_freight_documentation_neutral.jpg',
      imageAlt: 'Office desk in front of stacked cargo pallets with shipping paperwork folders, clipboards, a mug, and an open laptop'
    },
    services: {
      heading: 'What we do for air freight',
      subheading: 'We prepare your Air Waybill, work out the billing, and check your shipment documents.',
      cards: [
        {
          id: 'awb-prep',
          title: 'AWB preparation',
          description: 'We prepare your Air Waybill from the details of your shipment.',
          items: [
            'Shipper and consignee details entered from your documents',
            'Cargo description, pieces and weight taken from your invoice and packing list',
            'Air Waybill ready to hand to the airline or your forwarder'
          ]
        },
        {
          id: 'awb-billing',
          title: 'AWB billing',
          description: 'We work out the charges that go with your Air Waybill.',
          items: [
            'Air freight charges listed line by line',
            'Billing sent to you with the Air Waybill'
          ]
        },
        {
          id: 'shipment-doc',
          title: 'Shipment documentation',
          description: 'We check the documents for your air shipment before anything is issued.',
          items: [
            'Commercial invoice and packing list checked against each other',
            'Cargo details recorded for the Air Waybill',
            'Copies of the finished documents sent to you'
          ]
        }
      ]
    },
    showCargoTypes: false, // Set to true only for cargo types we have confirmed we prepare documents for.
    cargoTypes: {
      heading: 'Cargo types we prepare documents for',
      subheading: 'We prepare the Air Waybill and shipment documents for these types of cargo.',
      footnote: 'Some cargo types need extra documents. Contact us and we will tell you what is needed.',
      // Set to true only for cargo types we have confirmed we prepare documents for.
      enabled: {
        general: false,
        fragile: false,
        documentsParcels: false,
        electronics: false,
        perishable: false
      },
      cards: [
        {
          key: 'general',
          title: 'General cargo',
          description: 'Air Waybill and shipment documents for standard commercial cargo and palletised goods.' // [CONFIRM]
        },
        {
          key: 'fragile',
          title: 'Fragile cargo',
          description: 'Air Waybill and shipment documents for fragile commercial shipments.' // [CONFIRM]
        },
        {
          key: 'documentsParcels',
          title: 'Documents and parcels',
          description: 'Air Waybill and shipment documents for business documents and commercial parcels.' // [CONFIRM]
        },
        {
          key: 'electronics',
          title: 'Electronics',
          description: 'Air Waybill and shipment documents for commercial electronics.' // [CONFIRM]
        },
        {
          key: 'perishable',
          title: 'Perishable cargo',
          description: 'Air Waybill and shipment documents for perishable shipments.' // [CONFIRM: do not mention any partner or any cold-chain service]
        }
      ]
    },
    process: {
      heading: 'How an air freight job works',
      subheading: 'From your first request to your finished documents, this is the order we follow.',
      steps: [
        {
          number: '1',
          title: 'Send your request',
          description: 'Tell us what you are shipping and what you need prepared. You can use our quote form or email us.'
        },
        {
          number: '2',
          title: 'We prepare your quote',
          description: 'We work out the cost of preparing your Air Waybill and the billing that goes with it.'
        },
        {
          number: '3',
          title: 'We check your documents',
          description: 'A member of our team checks your shipment documents and emails you the confirmed details and the quote.'
        },
        {
          number: '4',
          title: 'You confirm and pay',
          description: 'Once you are happy with the quote, you pay by bank transfer or PayNow.'
        },
        {
          number: '5',
          title: 'We prepare your Air Waybill',
          description: 'We prepare the Air Waybill and the billing from your confirmed shipment details.'
        },
        {
          number: '6',
          title: 'You receive your documents',
          description: 'We send you the finished documents by email. Booking the flight is handled by you or your forwarder.'
        }
      ]
    },
    whatWeNeed: {
      heading: 'What we need from you',
      subheading: 'To prepare your Air Waybill and billing, we usually ask for:',
      items: [
        'Shipper and consignee details',
        'Cargo description, quantity, weight and dimensions',
        'Commercial invoice',
        'Packing list',
        'Origin and destination',
        'Anything else we should know about your shipment'
      ],
      note: 'The documents we need can vary by shipment. We will tell you what is needed.',
      ctaLabel: 'Get a Quote'
    },
    roadCrossLink: {
      heading: 'Need road transport?',
      text: 'We also arrange commercial road transport through our partner carriers.',
      linkLabel: 'See road transport'
    },
    faqSection: {
      heading: 'Frequently asked questions',
      subheading: 'Answers to common questions about Air Waybills and our billing and document service.',
      cargoTypesQuestion: 'Which types of cargo do you prepare documents for?',
      cargoTypesAnswerPrefix: 'We prepare Air Waybill and shipment documents for ',
      cargoTypesAnswerSuffix: '. Contact us if your cargo is not listed.'
    },
    faqs: [
      {
        q: 'What is an Air Waybill (AWB)?',
        a: 'An Air Waybill is the document that goes with an air cargo shipment. It records what is being shipped, who is sending it and who is receiving it. It is also the contract between the shipper and the airline for carrying the cargo.'
      },
      {
        q: 'What information do you need to prepare an AWB?',
        a: 'We need the shipper and consignee details, a description of the cargo with the quantity, weight and dimensions, your commercial invoice and packing list, and the origin and destination. Tell us anything else we should know about your shipment. The documents we need can vary by shipment, and we will tell you what is needed.'
      },
      {
        q: 'How is air freight billing calculated?',
        // [CONFIRM: verify chargeable weight billing and whether any document preparation fee applies]
        a: 'Air freight charges are based on chargeable weight, which is the higher of the actual weight and the volumetric weight of your shipment. We work out the charges that go with your Air Waybill and confirm them in your quote before you pay.'
      },
      {
        q: 'Do you book flights or carry cargo?',
        // [CONFIRM: verify "Booking the flight is handled by you or your forwarder."]
        a: 'No. We prepare the Air Waybill, the billing and the shipment documents only. Booking the flight is handled by you or your forwarder.'
      }
    ],
    closingCta: {
      heading: 'Send us your shipment details and we will prepare your Air Waybill.',
      subtext: 'Tell us what you are shipping and we will send you a quote for the Air Waybill and billing.',
      primaryLabel: 'Get a Quote',
      contactLabel: 'Contact us',
      callLabel: 'Call us',
      whatsappLabel: 'WhatsApp',
      whatsappHref: ''
    }
  },
  roadFreight: {
    hero: {
      heading: 'Commercial road transport in Singapore',
      paragraph: 'We arrange commercial road transport for businesses through our partner carriers. We do not own vehicles, so each job is matched to a carrier that suits your goods.',
      ctaLabel: 'Get a Quote',
      image: '/assets/road_transportation_hero.jpg',
      imageAlt: 'Commercial road transport vehicle in Singapore'
    },
    intro: {
      heading: 'Road transport through partner carriers',
      paragraphs: [
        'You tell us what you are moving, where it is collected and where it needs to go. We send you a quote. Once you confirm and pay, we arrange a partner carrier for the job.',
        'Our team will send you a tracking number so you can follow your shipment, and you receive proof of delivery when the job is done.'
      ],
      linkLabel: 'See what we need to quote',
      linkTarget: '#what-we-need-road',
      useRealPhoto: false,
      realPhoto: '',
      realPhotoAlt: '',
      whatWeDoBlock: {
        heading: 'What we do and what we do not do',
        doHeading: 'We do',
        doItems: [
          'Arrange commercial road transport in Singapore through partner carriers',
          'Send you a quote before you pay',
          'Email you a tracking number',
          'Give you proof of delivery'
        ],
        doNotHeading: 'We do not',
        doNotItems: [
          'Own or run vehicles',
          'Move oversize goods, dangerous goods or electronics'
        ]
      }
    },
    services: {
      heading: 'What we do for road transport',
      subheading: 'We book your job with a partner carrier in Singapore. We do not own vehicles.',
      cards: [
        {
          id: 'road-transport-singapore',
          title: 'Road transport in Singapore',
          description: 'We arrange the movement of your commercial goods from one place in Singapore to another.',
          items: [
            'Pickup and delivery addresses taken from your request',
            'Goods matched to a carrier that suits their size and weight',
            'Singapore jobs only'
          ]
        },
        {
          id: 'partner-carriers',
          title: 'Partner carriers',
          description: 'We do not own vehicles. We book each job with a partner carrier.',
          items: [
            'Carrier chosen for your goods and route',
            'Booked after you confirm the quote and pay',
            'One contact at our team for your job'
          ]
        },
        {
          id: 'quote-tracking-pod',
          title: 'Quote, tracking and proof of delivery',
          description: 'You know the price before you pay, and you can follow the job afterwards.',
          items: [
            'Quote sent to you before you pay',
            'Tracking number sent to you by email',
            'Proof of delivery when the job is done'
          ]
        }
      ],
      linkLabel: 'Get a Quote',
      linkTarget: '#quote'
    },
    goodsWeMove: {
      heading: 'Goods we move',
      subheading: 'We arrange road transport for these kinds of commercial goods.',
      // Set to true only for goods we have confirmed we move.
      packagedPalletised: true,
      retailWholesale: true,
      industrial: false,
      rawMaterials: true,
      flags: {
        packagedPalletised: true,
        retailWholesale: true,
        industrial: false,
        rawMaterials: true
      },
      items: [
        {
          id: 'packaged-palletised',
          flagKey: 'packagedPalletised',
          title: 'Packaged and palletised goods',
          description: 'Boxed and carton-packed goods, and goods on pallets.'
        },
        {
          id: 'retail-wholesale',
          flagKey: 'retailWholesale',
          title: 'Retail and wholesale goods',
          description: 'Stock moving between suppliers, warehouses and shops.'
        },
        {
          id: 'industrial-products',
          flagKey: 'industrial',
          title: 'Industrial products',
          description: 'Industrial parts and supplies of a normal size and weight.' // [CONFIRM: only enable this card if we really move these; do not mention machinery or equipment]
        },
        {
          id: 'raw-materials',
          flagKey: 'rawMaterials',
          title: 'Raw materials and components',
          description: 'Materials and parts used in production.'
        }
      ],
      notMovedBlock: {
        heading: 'We do not move',
        text: 'Oversize goods, dangerous goods and electronics.',
        footnotePrefix: 'Not sure whether your goods fit? ',
        contactLabel: 'Contact us',
        footnoteSuffix: ' and we will tell you.',
        contactTarget: '#contact'
      }
    },
    process: {
      heading: 'How a road transport job works',
      subheading: 'From your first request to proof of delivery, this is the order we follow.',
      steps: [
        {
          number: '1',
          title: 'Send your request',
          description: 'Tell us what you are moving, where it is collected and where it needs to go. Use our quote form.'
        },
        {
          number: '2',
          title: 'We review your request',
          description: 'A member of our team looks at your request and confirms the details with you if anything is unclear.'
        },
        {
          number: '3',
          title: 'You receive your quote',
          description: 'Once our team has confirmed the job, our team will send you the quote.'
        },
        {
          number: '4',
          title: 'You pay',
          description: 'You pay the quote. We do not book a carrier before payment.'
        },
        {
          number: '5',
          title: 'We book a partner carrier',
          description: 'After payment we book a partner carrier for your job. Our team will send you a tracking number.'
        },
        {
          number: '6',
          title: 'Your goods are delivered',
          descriptionPrefix: 'The carrier delivers your goods and you receive proof of delivery. You can follow the job with your tracking number on our ',
          trackLinkLabel: 'Track road shipment page',
          trackLinkTarget: '#track',
          descriptionSuffix: '.',
          description: 'The carrier delivers your goods and you receive proof of delivery. You can follow the job with your tracking number on our Track road shipment page.'
        }
      ]
    },
    whatWeNeed: {
      heading: 'What we need to quote your job',
      subheading: 'To quote your job, we ask for these details in the quote form:',
      items: [
        'Pickup and delivery addresses',
        'Type of goods and packaging',
        'Weight, size and number of packages',
        'Preferred pickup date'
      ],
      note: 'Our team reviews your request before we send you a quote.',
      buttonLabel: 'Get a Quote',
      // Set to true only when this service is confirmed.
      showDocumentationCard: false,
      documentationCard: {
        heading: 'Shipment documentation support',
        text: 'Help preparing and organising shipment documents.',
        linkLabel: 'See documentation support',
        linkTarget: '#shipment-documentation-support'
      }
    },
    airCrossLink: {
      heading: 'Need air freight documents?',
      text: 'We also prepare Air Waybills and the billing and shipment documents for air freight.',
      linkLabel: 'See air freight documents',
      linkTarget: '#air-freight'
    },
    whereWeOperate: {
      lead: 'Where we operate:',
      text: 'Singapore only.'
    },
    faqSection: {
      heading: 'Frequently asked questions',
      subheading: 'Answers to common questions about our road transport service.',
      goodsQuestion: 'What types of goods can you move?',
      goodsAnswerPrefix: 'We arrange road transport for ',
      goodsAnswerSuffix: '. We do not move oversize goods, dangerous goods or electronics. If you are not sure whether your goods fit, contact us and we will tell you.',
      goodsAnswerEmpty: 'We do not move oversize goods, dangerous goods or electronics. Contact us to ask whether we can move your goods.'
    },
    faqs: [
      {
        id: 'how-get-quote',
        q: 'How do I get a quote?',
        a: 'Fill in our quote form with your pickup and delivery addresses, the type of goods and packaging, and the weight, size and number of packages. A member of our team reviews your request, and our team will send you the quote.'
      },
      {
        id: 'own-vehicles',
        q: 'Do you own the vehicles?',
        a: 'No. We do not own or run vehicles. After you pay the quote, we book a partner carrier for your job.'
      },
      {
        id: 'send-documents',
        q: 'Do I need to send you any documents?',
        a: 'No. We only need the details you enter in the quote form.'
      },
      {
        id: 'track-shipment',
        q: 'How do I track my shipment?',
        aPrefix: 'After we book your carrier, our team will send you a tracking number. Enter it on our ',
        linkLabel: 'Track road shipment page',
        linkTarget: '#track',
        aSuffix: ' to follow your job.',
        a: 'After we book your carrier, our team will send you a tracking number. Enter it on our Track road shipment page to follow your job.'
      },
      {
        id: 'proof-delivery',
        q: 'Do I get proof of delivery?',
        a: 'Yes. When your goods have been delivered, you receive proof of delivery.'
      }
    ],
    closingCta: {
      heading: 'Send us your job details and we will quote.',
      subtext: 'Tell us what you are moving and where it is going. Our team reviews your request and emails you a quote.',
      primaryLabel: 'Get a Quote',
      contactLabel: 'Contact us',
      callLabel: 'Call us',
      whatsappLabel: 'WhatsApp',
      whatsappHref: ''
    }
  },
  tracking: {
    hero: {
      heading: 'Track road shipment',
      subtext: 'Enter your tracking number to see the latest status of your road shipment. Updates are entered by our team, and the time of the last update is shown.'
    },
    form: {
      label: 'Tracking number',
      placeholder: 'Enter tracking number (e.g. JOS-88190 or AWS-29401)',
      buttonLabel: 'Track shipment',
      buttonLoadingLabel: 'Searching...',
      rateLimitWarning: 'Too many lookups. Please try again later. Please wait',
      rateLimitSuffix: 's before querying again.',
      clientRateLimitError: 'Rate limit reached: Maximum 10 tracking queries per minute allowed.'
    },
    guidelines: {
      heading: 'Where to find your tracking number',
      text: 'Our team will send you a tracking number after we book your carrier. Enter it above to see the latest status of your road shipment.',
      // [CONFIRM: that the tracking number is emailed at that stage, after payment and carrier booking]
      airFreightNotice: 'Air freight: we prepare Air Waybills and shipment documents only, so air shipments cannot be tracked here.'
    },
    help: {
      text: 'Need help with your shipment? ',
      linkLabel: 'Contact us'
    },
    notFound: {
      messagePrefix: 'We could not find this tracking number. Check the number or ',
      linkLabel: 'contact us',
      messageSuffix: '.'
    },
    events: {
      heading: 'Tracking events',
      emptyText: 'Shipment is recorded. Updates are entered by our team as they occur.'
    }
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
