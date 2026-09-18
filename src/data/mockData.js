export const initialShipments = [
  {
    id: 'JOS-88190-SG',
    sender: 'Razer Asia-Pacific HQ',
    senderPhone: '+65 6789 0123',
    senderAddress: '1 Raffles Place, #20-01, Singapore 048616',
    receiver: 'Jurong Logistics Hub Gate 4',
    receiverPhone: '+65 9123 4567',
    receiverAddress: '10 Jurong Port Road, Singapore 619114',
    origin: 'Jurong Central Highway Freight Hub',
    destination: 'Woodlands Roadways Terminal',
    currentLocation: 'PIE Expressway Telematics Gate (Exit 19)',
    status: 'In Transit',
    statusType: 'active',
    paymentStatus: 'Paid',
    serviceLevel: 'Express Road Freight & Highway Linehaul (FTL)',
    cargoType: 'High-Tech Electronics & Components',
    weight: '2,450 kg',
    pieces: 8,
    declaredValue: 'S$ 68,500',
    price: 'S$ 740.00',
    driverId: 'DRV-101',
    driverName: 'Tan Wei Ming',
    driverPhone: '+65 9123 4567',
    vehicle: 'Josan 14-Ton Highway Linehaul Truck #SG-8819',
    vehiclePlate: 'SG-8819',
    vehicleType: '14-Ton Highway Box Truck',
    estimatedDelivery: 'Today, 4:30 PM (SGT)',
    lastUpdatedTime: '10 mins ago (GPS Telematics Sync)',
    createdDate: '2026-08-31 08:15 AM',
    timeline: [
      { step: 1, title: 'Consignment Booked', location: 'Jurong Central Highway Depot', timestamp: 'Aug 31, 08:15 AM', completed: true },
      { step: 2, title: 'Booking Confirmed by Operations', location: 'Josan Central Dispatch', timestamp: 'Aug 31, 09:00 AM', completed: true },
      { step: 3, title: 'Pickup Scheduled', location: 'Razer Logistics Bay 2', timestamp: 'Aug 31, 09:45 AM', completed: true },
      { step: 4, title: 'Picked Up & Weighed', location: 'Depot Loading Bay 4', timestamp: 'Aug 31, 10:40 AM', completed: true },
      { step: 5, title: 'In Transit on Expressway', location: 'PIE Expressway Telematics Gate', timestamp: 'Aug 31, 01:20 PM', completed: true, current: true },
      { step: 6, title: 'Near Destination Terminal', location: 'Woodlands North Park Approach', timestamp: 'Expected 03:45 PM', completed: false },
      { step: 7, title: 'Delivered & POD Verified', location: 'Woodlands Roadways Terminal', timestamp: 'Expected 04:30 PM', completed: false }
    ],
    coordinates: { origin: [1.3400, 103.7100], current: [1.3521, 103.8200], destination: [1.4380, 103.7890] }
  },
  {
    id: 'JOS-44021-SG',
    sender: 'PSA Pasir Panjang Terminal',
    senderPhone: '+65 6273 8888',
    senderAddress: '33 Harbour Drive, Singapore 117606',
    receiver: 'Woodlands High-Tech Park',
    receiverPhone: '+65 8234 5678',
    receiverAddress: '21 Woodlands Loop, Singapore 738322',
    origin: 'Pasir Panjang Terminal Berth 5',
    destination: 'Woodlands Industrial Estate',
    currentLocation: 'BKE Expressway Exit 7 (1.2 km to Terminal)',
    status: 'Near Destination',
    statusType: 'active',
    paymentStatus: 'Unpaid',
    serviceLevel: 'Land Trucking & Container Line',
    cargoType: 'Industrial Precision Components',
    weight: '1,420 kg',
    pieces: 12,
    declaredValue: 'S$ 145,000',
    price: 'S$ 1,280.00',
    driverId: 'DRV-102',
    driverName: 'Muhammad Rizal',
    driverPhone: '+65 8234 5678',
    vehicle: 'Volvo Heavy Container Truck #SG-4402',
    vehiclePlate: 'SG-4402',
    vehicleType: 'Volvo 24T Container Linehaul',
    estimatedDelivery: 'Today, 5:15 PM (SGT)',
    lastUpdatedTime: '3 mins ago (Checkpoint Signal)',
    createdDate: '2026-08-30 11:30 AM',
    deliveryOtp: '482910',
    otpVerified: false,
    otpGeneratedAt: '2026-08-31 03:45 PM',
    timeline: [
      { step: 1, title: 'Consignment Booked', location: 'PSA Pasir Panjang Hub', timestamp: 'Aug 30, 11:30 AM', completed: true },
      { step: 2, title: 'Booking Confirmed by Operations', location: 'Operations Desk', timestamp: 'Aug 30, 01:15 PM', completed: true },
      { step: 3, title: 'Pickup Scheduled', location: 'PSA Berth 5 Inspection Dock', timestamp: 'Aug 30, 03:00 PM', completed: true },
      { step: 4, title: 'Picked Up & Customs Released', location: 'Pasir Panjang Gate 3', timestamp: 'Aug 31, 09:00 AM', completed: true },
      { step: 5, title: 'In Transit via Expressway', location: 'AYE/BKE Expressway Corridor', timestamp: 'Aug 31, 11:45 AM', completed: true },
      { step: 6, title: 'Near Destination (OTP Issued)', location: 'BKE Expressway Exit 7', timestamp: 'Aug 31, 03:45 PM', completed: true, current: true },
      { step: 7, title: 'Delivered & POD Verified', location: 'Woodlands Industrial Estate', timestamp: 'Expected 05:15 PM', completed: false }
    ],
    coordinates: { origin: [1.2762, 103.7915], current: [1.3412, 103.7712], destination: [1.4382, 103.7890] }
  },
  {
    id: 'JOS-66301-SG',
    sender: 'Tuas Mega Port Terminal',
    senderPhone: '+65 6861 9900',
    senderAddress: '20 Tuas South Ave 2, Singapore 637560',
    receiver: 'Biopolis Medical Research Hub',
    receiverPhone: '+65 9876 5432',
    receiverAddress: '8 Biomedical Grove, Singapore 138665',
    origin: 'Tuas Mega Port Cold Vault',
    destination: 'Biopolis Bio-Hub Research Dock',
    currentLocation: 'Biopolis Dock Bay 2, Singapore',
    status: 'Delivered',
    statusType: 'success',
    paymentStatus: 'Paid',
    serviceLevel: 'Cold Chain Pharma Vault (2°C - 8°C)',
    cargoType: 'Vaccine & Bio-Therapeutic Samples',
    weight: '85.0 kg',
    pieces: 2,
    declaredValue: 'S$ 310,000',
    price: 'S$ 890.00',
    driverId: 'DRV-103',
    driverName: 'Gurpreet Singh (SG Fleet)',
    driverPhone: '+65 9876 5432',
    vehicle: 'Refrigerated Cold-Chain Van #SG-6630',
    vehiclePlate: 'SG-6630',
    vehicleType: 'ThermoKing Multi-Temp Reefer Van',
    estimatedDelivery: 'Delivered Aug 31, 11:15 AM',
    lastUpdatedTime: 'Aug 31, 11:16 AM (POD Stamped)',
    createdDate: '2026-08-31 06:00 AM',
    deliveryOtp: '719204',
    otpVerified: true,
    pod: {
      photo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
      recipientName: 'Dr. Rachel Wee (Lead Virologist)',
      recipientSignature: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="260" height="80" viewBox="0 0 260 80"><path d="M 20 50 Q 60 10 90 45 T 160 30 T 230 40" stroke="%2310182D" stroke-width="3" fill="none" stroke-linecap="round"/><text x="180" y="65" font-family="sans-serif" font-size="12" fill="%2364748B">R. Wee</text></svg>',
      deliveredAt: 'Aug 31, 2026 11:15 AM SGT',
      remarks: 'All tamper-evident cryo seals inspected. Temperature data logger verified at 4.2°C.',
      driverId: 'DRV-103'
    },
    timeline: [
      { step: 1, title: 'Consignment Booked', location: 'Tuas Mega Port Cold Hub', timestamp: 'Aug 31, 06:00 AM', completed: true },
      { step: 2, title: 'Booking Confirmed by Operations', location: 'Pharma Desk', timestamp: 'Aug 31, 06:30 AM', completed: true },
      { step: 3, title: 'Pickup Scheduled', location: 'Tuas Cryo-Bay 1', timestamp: 'Aug 31, 07:15 AM', completed: true },
      { step: 4, title: 'Picked Up & Calibrated', location: 'Tuas Port Gate', timestamp: 'Aug 31, 08:00 AM', completed: true },
      { step: 5, title: 'In Transit (Temp Monitored)', location: 'AYE Expressway Corridor', timestamp: 'Aug 31, 09:30 AM', completed: true },
      { step: 6, title: 'Near Destination Terminal', location: 'Biopolis North Gate', timestamp: 'Aug 31, 10:50 AM', completed: true },
      { step: 7, title: 'Delivered & Digital POD Signed', location: 'Biopolis Bio-Hub Dock Bay 2', timestamp: 'Aug 31, 11:15 AM', completed: true, current: true }
    ],
    coordinates: { origin: [1.2942, 103.6358], current: [1.3015, 103.7915], destination: [1.3015, 103.7915] }
  },
  {
    id: 'JOS-99210-SG',
    sender: 'Singapore Jurong Logistics Hub',
    senderPhone: '+65 6265 4321',
    senderAddress: '15 Jurong Port Road, Singapore 619116',
    receiver: 'Woodlands Checkpoint Distribution Center',
    receiverPhone: '+65 6368 0000',
    receiverAddress: '900 Woodlands Centre Rd, Singapore 738991',
    origin: 'Jurong Logistics Hub',
    destination: 'Woodlands Checkpoint Depot',
    currentLocation: 'KPE Tunnel Corridor (Speed Regulated)',
    status: 'Delayed',
    statusType: 'warning',
    paymentStatus: 'Unpaid',
    serviceLevel: 'Cross-Border Haulage (SG ↔ MY)',
    cargoType: 'Heavy Electrical Machinery & Motors',
    weight: '3,800 kg',
    pieces: 6,
    declaredValue: 'S$ 92,000',
    price: 'S$ 1,650.00',
    driverId: 'DRV-104',
    driverName: 'Robert Martinez',
    driverPhone: '+65 9112 3456',
    vehicle: '18-Wheeler Heavy Freight Carrier #SG-9921',
    vehiclePlate: 'SG-9921',
    vehicleType: '18-Wheeler Heavy Haulage Carrier',
    estimatedDelivery: 'Today, 07:45 PM (Weather Delay Safety Margin)',
    lastUpdatedTime: '25 mins ago (Telemetry Alert)',
    createdDate: '2026-08-31 09:30 AM',
    weatherDelay: {
      active: true,
      condition: 'Heavy Monsoon Rain & PIE Flash Flood Warning (Wind 45 km/h)',
      etaImpact: '+45 Mins Added for Brake Safety',
      smsSent: true,
      emailSent: true,
      timestamp: 'Aug 31, 01:45 PM'
    },
    timeline: [
      { step: 1, title: 'Consignment Booked', location: 'Jurong Logistics Hub', timestamp: 'Aug 31, 09:30 AM', completed: true },
      { step: 2, title: 'Booking Confirmed by Operations', location: 'Operations Desk', timestamp: 'Aug 31, 10:00 AM', completed: true },
      { step: 3, title: 'Pickup Scheduled', location: 'Heavy Loading Bay 8', timestamp: 'Aug 31, 10:30 AM', completed: true },
      { step: 4, title: 'Picked Up & Manifest Registered', location: 'Jurong Port Weighbridge', timestamp: 'Aug 31, 11:15 AM', completed: true },
      { step: 5, title: 'In Transit (Monsoon Safety Speed)', location: 'KPE Expressway Tunnel', timestamp: 'Aug 31, 01:45 PM', completed: true, current: true },
      { step: 6, title: 'Near Destination Terminal', location: 'Woodlands South Approach', timestamp: 'Expected 06:30 PM', completed: false },
      { step: 7, title: 'Delivered & POD Signed', location: 'Woodlands Checkpoint Depot', timestamp: 'Expected 07:45 PM', completed: false }
    ],
    coordinates: { origin: [1.3115, 103.7220], current: [1.3340, 103.8820], destination: [1.4420, 103.7680] }
  },
  {
    id: 'JOS-12094-SG',
    sender: 'SingPost Logistics Center East',
    senderPhone: '+65 6841 2000',
    senderAddress: '10 Eunos Road 8, Singapore 408600',
    receiver: 'Tuas Biomedical Hub',
    receiverPhone: '+65 6712 3456',
    receiverAddress: '51 Tuas View Circuit, Singapore 637777',
    origin: 'Paya Lebar Eastern Depot',
    destination: 'Tuas Biomedical Hub',
    currentLocation: 'Paya Lebar Hub Staging Bay',
    status: 'Pickup Scheduled',
    statusType: 'active',
    paymentStatus: 'Paid',
    serviceLevel: 'Express Overland Parcel Dispatch',
    cargoType: 'Lab Reagents & Testing Cartridges',
    weight: '120 kg',
    pieces: 4,
    declaredValue: 'S$ 24,000',
    price: 'S$ 310.00',
    driverId: 'DRV-101',
    driverName: 'Tan Wei Ming',
    driverPhone: '+65 9123 4567',
    vehicle: 'Josan 14-Ton Highway Linehaul Truck #SG-8819',
    vehiclePlate: 'SG-8819',
    vehicleType: '14-Ton Highway Box Truck',
    estimatedDelivery: 'Tomorrow, 10:00 AM (SGT)',
    lastUpdatedTime: '1 hour ago',
    createdDate: '2026-08-31 02:00 PM',
    timeline: [
      { step: 1, title: 'Consignment Booked', location: 'Online Customer Portal', timestamp: 'Aug 31, 02:00 PM', completed: true },
      { step: 2, title: 'Booking Confirmed by Operations', location: 'Operations Desk', timestamp: 'Aug 31, 02:30 PM', completed: true },
      { step: 3, title: 'Pickup Scheduled', location: 'Paya Lebar Hub Staging Bay', timestamp: 'Scheduled Today, 04:00 PM', completed: true, current: true },
      { step: 4, title: 'Picked Up', location: 'Paya Lebar Dispatch Gate', timestamp: 'Pending', completed: false },
      { step: 5, title: 'In Transit', location: 'PIE/AYE Corridor', timestamp: 'Pending', completed: false },
      { step: 6, title: 'Near Destination', location: 'Tuas Approach Gate', timestamp: 'Pending', completed: false },
      { step: 7, title: 'Delivered', location: 'Tuas Biomedical Hub', timestamp: 'Expected Tomorrow', completed: false }
    ],
    coordinates: { origin: [1.3190, 103.8930], current: [1.3190, 103.8930], destination: [1.2890, 103.6290] }
  }
];
export const initialQuotes = [
  {
    id: 'QTE-89210-SG',
    customerId: 'USR-CUST-01',
    customerName: 'Marcus Vance',
    customerEmail: 'marcus.vance@techcorp.sg',
    customerPhone: '+65 9123 4567',
    company: 'TechCorp Solutions SG',
    origin: 'Jurong West Logistics Hub Gate 4',
    destination: 'Changi Air Cargo Logistics Complex',
    cargoCategory: 'High-Tech Electronics & Microchips',
    cargoWeight: 450,
    freightMode: 'ftl',
    deliverySpeed: 'standard',
    notes: 'Requires temperature logging and high-cube box truck.',
    status: 'Sent',
    createdAt: 'Aug 31, 2026 09:15 AM',
    validUntil: 'Sep 07, 2026',
    lineItems: {
      baseTransportationCharge: 320.00,
      distanceCharge: 55.00,
      cargoCharge: 45.00,
      vehicleCharge: 70.00,
      additionalServices: 30.00,
      taxRate: 0.09,
      taxAmount: 46.80,
      finalAmount: 566.80
    },
    adminNotes: 'Assigned 14-ton highway truck with hydraulic tailgate.'
  },
  {
    id: 'QTE-74102-SG',
    customerId: 'USR-CUST-02',
    customerName: 'Sarah Lim',
    customerEmail: 'sarah.lim@biopharma.sg',
    customerPhone: '+65 8123 9876',
    company: 'Apex BioPharma Research',
    origin: 'Tuas Mega Port Cold Vault',
    destination: 'Biopolis Biomedical Research Hub',
    cargoCategory: 'Vaccines & Lab Reagents',
    cargoWeight: 180,
    freightMode: 'reefer',
    deliverySpeed: 'express',
    notes: 'Strict GDP cold chain 2°C - 8°C with dual temperature data probes.',
    status: 'Accepted',
    createdAt: 'Aug 30, 2026 02:30 PM',
    validUntil: 'Sep 06, 2026',
    lineItems: {
      baseTransportationCharge: 450.00,
      distanceCharge: 80.00,
      cargoCharge: 120.00,
      vehicleCharge: 110.00,
      additionalServices: 50.00,
      taxRate: 0.09,
      taxAmount: 72.90,
      finalAmount: 882.90
    },
    adminNotes: 'Customer approved pricing. Ready to convert to active booking.'
  },
  {
    id: 'QTE-55198-SG',
    customerId: 'USR-CUST-03',
    customerName: 'David Chen',
    customerEmail: 'david.chen@precision.com',
    customerPhone: '+65 9876 1234',
    company: 'Precision Engineering Asia',
    origin: 'Pasir Panjang Terminal Berth 3',
    destination: 'Woodlands Industrial Park E5',
    cargoCategory: 'Industrial Precision Components',
    cargoWeight: 1200,
    freightMode: 'ftl',
    deliverySpeed: 'standard',
    notes: 'Heavy machinery parts on 4 wooden pallets.',
    status: 'Draft',
    createdAt: 'Aug 31, 2026 11:45 AM',
    validUntil: 'Sep 07, 2026',
    lineItems: {
      baseTransportationCharge: 580.00,
      distanceCharge: 95.00,
      cargoCharge: 80.00,
      vehicleCharge: 120.00,
      additionalServices: 40.00,
      taxRate: 0.09,
      taxAmount: 82.35,
      finalAmount: 997.35
    },
    adminNotes: 'Pending driver availability confirmation for 24T prime mover.'
  }
];

export const initialNotifications = [
  {
    id: 'NOTIF-01',
    role: 'customer',
    userId: 'all',
    type: 'otp',
    title: '🚚 Delivery OTP Ready for Order #JOS-44021-SG',
    message: 'Driver Muhammad Rizal is approaching your destination terminal. Your Delivery OTP is 482910. Provide this OTP to the driver upon delivery.',
    shipmentId: 'JOS-44021-SG',
    timestamp: '15 mins ago',
    read: false
  },
  {
    id: 'NOTIF-02',
    role: 'customer',
    userId: 'all',
    type: 'quote',
    title: '📄 New Quotation #QTE-89210-SG Sent for Review',
    message: 'Admin reviewed your freight route and prepared an itemized quote for S$ 566.80. Review and accept in the Quotes portal.',
    quoteId: 'QTE-89210-SG',
    timestamp: '45 mins ago',
    read: false
  },
  {
    id: 'NOTIF-03',
    role: 'customer',
    userId: 'all',
    type: 'shipment',
    title: '✅ Order #JOS-88190-SG Dispatched (In Transit)',
    message: 'Your shipment has been picked up by Tan Wei Ming (#SG-8819) and is currently en route via PIE Expressway.',
    shipmentId: 'JOS-88190-SG',
    timestamp: '2 hours ago',
    read: true
  },
  {
    id: 'NOTIF-04',
    role: 'admin',
    userId: 'admin',
    type: 'quote_request',
    title: '📥 New Quote Request: Precision Engineering Asia',
    message: 'David Chen submitted a quote request for 1,200 kg industrial cargo from Pasir Panjang to Woodlands.',
    quoteId: 'QTE-55198-SG',
    timestamp: '1 hour ago',
    read: false
  },
  {
    id: 'NOTIF-05',
    role: 'admin',
    userId: 'admin',
    type: 'pod_submitted',
    title: '✍️ Digital POD Stamped for Order #JOS-66301-SG',
    message: 'Driver Gurpreet Singh completed delivery to Biopolis Bio-Hub with digital recipient signature and photo verification.',
    shipmentId: 'JOS-66301-SG',
    timestamp: '3 hours ago',
    read: true
  }
];

export const initialDrivers = [
  {
    id: 'DRV-101',
    name: 'Tan Wei Ming',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    phone: '+65 9123 4567',
    email: 'tan.weiming@josanlogistics.com',
    password: 'driver123',
    licenseNumber: 'SG-CLASS4-9910',
    vehicleType: 'Josan EV Express Cargo Truck',
    vehicleId: 'SG-8819',
    status: 'On Delivery',
    deliveriesCompleted: 840,
    onTimeRate: '99.6%',
    rating: 4.9,
    assignedHub: 'Changi Air Cargo Logistics Hub',
    safetyScore: '99/100',
    joinedDate: 'Jan 2024'
  },
  {
    id: 'DRV-102',
    name: 'Muhammad Rizal',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+65 8234 5678',
    email: 'm.rizal@josanlogistics.com',
    password: 'driver123',
    licenseNumber: 'SG-CLASS5-8810',
    vehicleType: 'Volvo Heavy Container Truck',
    vehicleId: 'SG-4402',
    status: 'On Delivery',
    deliveriesCompleted: 610,
    onTimeRate: '98.9%',
    rating: 4.8,
    assignedHub: 'Tuas Mega Port Terminal',
    safetyScore: '97/100',
    joinedDate: 'Mar 2023'
  },
  {
    id: 'DRV-103',
    name: 'Gurpreet Singh (SG Fleet)',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+65 9876 5432',
    email: 'gurpreet.sg@josanlogistics.com',
    password: 'driver123',
    licenseNumber: 'SG-CLASS4-7721',
    vehicleType: 'Refrigerated Cold-Chain Van',
    vehicleId: 'SG-6630',
    status: 'Available',
    deliveriesCompleted: 420,
    onTimeRate: '99.8%',
    rating: 5.0,
    assignedHub: 'Jurong Port Logistics Hub',
    safetyScore: '100/100',
    joinedDate: 'Nov 2024'
  }
];

export const initialWarehouses = [
  {
    id: 'SIN-01',
    name: 'Changi Airport Freight Logistics Center',
    location: '1 Freight Close, Changi Air Cargo Complex, Singapore 819830',
    manager: 'Sarah Lin',
    phone: '+65 6789 0123',
    capacity: '85,000 sq ft',
    capacitySqFt: '85,000 sq ft',
    capacityPercentage: 78,
    status: 'Operational',
    utilization: '78%',
    activeParcels: 3420,
    incomingToday: 480,
    outgoingToday: 510,
    bins: [
      { binId: 'BIN-A12', item: 'TechCorp Server Rack', status: 'Staged for Load', priority: 'High' },
      { binId: 'BIN-B04', item: 'Medical Ultrasound Equipment', status: 'In Storage', priority: 'Normal' },
      { binId: 'BIN-C19', item: 'Industrial Electric Motors', status: 'Cleared Dispatch', priority: 'High' },
      { binId: 'BIN-D02', item: 'Precision Fiber Cable Reels', status: 'In Inspection', priority: 'Normal' }
    ]
  },
  {
    id: 'SIN-02',
    name: 'Tuas Mega Port Automated Distribution Hub',
    location: '20 Tuas South Avenue 2, Singapore 637560',
    manager: 'David Ng',
    phone: '+65 6861 9900',
    capacity: '150,000 sq ft',
    capacitySqFt: '150,000 sq ft',
    capacityPercentage: 86,
    status: 'Operational',
    utilization: '84%',
    activeParcels: 8900,
    incomingToday: 1250,
    outgoingToday: 1100,
    bins: [
      { binId: 'BIN-R10', item: 'Automotive Engine Assemblies', status: 'Ready for Trucking', priority: 'Urgent' },
      { binId: 'BIN-R15', item: 'Wind Turbine Components', status: 'Customs Hold', priority: 'Critical' },
      { binId: 'BIN-R22', item: 'Chemical Fluid Storage Drums', status: 'Hazmat Verified', priority: 'Normal' },
      { binId: 'BIN-R35', item: 'Semiconductor Wafer Carriers', status: 'In Storage', priority: 'Normal' }
    ]
  },
  {
    id: 'SIN-03',
    name: 'Jurong Industrial Estate Cold Storage Hub',
    location: '15 Jurong Port Road, Singapore 619116',
    manager: 'Kavita Sharma',
    phone: '+65 6265 4321',
    capacity: '90,000 sq ft',
    capacitySqFt: '90,000 sq ft',
    capacityPercentage: 64,
    status: 'Operational',
    utilization: '91%',
    activeParcels: 2150,
    incomingToday: 320,
    outgoingToday: 390,
    bins: [
      { binId: 'BIN-IN01', item: 'Vaccine Cold Storage Vault', status: 'Dispatched', priority: 'Critical' },
      { binId: 'BIN-IN08', item: 'Garment Export Crate Cargo', status: 'In Storage', priority: 'Normal' },
      { binId: 'BIN-IN14', item: 'Bio-Tech Sample Boxes', status: 'Staged for Load', priority: 'Urgent' }
    ]
  }
];

export const analyticsData = {
  kpis: {
    totalShipments: '3,840',
    activeDeliveries: '412',
    monthlyRevenue: 'S$ 1,480,000',
    onTimeRate: '99.4%',
    onTimeDeliveryRate: '99.4%'
  },
  monthlyRevenue: [
    { month: 'Jan', revenue: 980000, shipments: 2100 },
    { month: 'Feb', revenue: 1050000, shipments: 2300 },
    { month: 'Mar', revenue: 1120000, shipments: 2500 },
    { month: 'Apr', revenue: 1250000, shipments: 2800 },
    { month: 'May', revenue: 1380000, shipments: 3100 },
    { month: 'Jun', revenue: 1480000, shipments: 3400 },
  ],
  monthlyRevenueChart: [
    { month: 'Jan', revenue: 980000, shipments: 2100 },
    { month: 'Feb', revenue: 1050000, shipments: 2300 },
    { month: 'Mar', revenue: 1120000, shipments: 2500 },
    { month: 'Apr', revenue: 1250000, shipments: 2800 },
    { month: 'May', revenue: 1380000, shipments: 3100 },
    { month: 'Jun', revenue: 1480000, shipments: 3400 },
  ],
  delaysBreakdown: [
    { reason: 'Weather SLA', percentage: 42 },
    { reason: 'Customs Hold', percentage: 28 },
    { reason: 'Traffic Loop', percentage: 18 },
    { reason: 'Dock Congestion', percentage: 12 }
  ],
  serviceBreakdown: [
    { service: 'Express Air Freight (Changi SIN)', share: 40 },
    { service: 'Tuas Mega Port Container Sea Cargo', share: 30 },
    { service: 'Jurong Industrial Land Haulage', share: 20 },
    { service: 'Cold Chain Vaccine & Pharma', share: 10 }
  ],
  serviceDistribution: [
    { name: 'Express Air Freight (SIN)', value: 40, color: '#FF6B00' },
    { name: 'Tuas Mega Port Sea Cargo', value: 30, color: '#1E3A8A' },
    { name: 'Jurong Land Haulage', value: 20, color: '#10B981' },
    { name: 'Pharma Cold Chain', value: 10, color: '#8B5CF6' },
  ]
};

// ==========================================
// PHASE 3: BUSINESS & OPERATIONS MOCK DATA
// ==========================================

export const initialCustomers = [
  {
    id: 'CUST-001',
    name: 'Razer Asia-Pacific HQ',
    contactPerson: 'Tan Wei Ming (Supply Chain Lead)',
    email: 'logistics@razer.com',
    phone: '+65 6789 0123',
    company: 'Razer (Asia-Pacific) Pte Ltd',
    address: '10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438',
    tier: 'Enterprise Key Account',
    creditLimit: 'S$ 50,000',
    paymentTerms: 'Net 30 Days',
    totalOrders: 14,
    totalSpent: 5320.00,
    activeShipments: 1,
    status: 'Active',
    registeredDate: '15 Jan 2025',
    tags: ['Key Account', 'Electronics', 'Express Logistics', 'Net-30']
  },
  {
    id: 'CUST-002',
    name: 'Singapore Pharma Logistics Hub',
    contactPerson: 'Kavita Sharma (Quality Assurance)',
    email: 'coldchain@sgpharma.com',
    phone: '+65 6234 5678',
    company: 'Singapore Pharma Logistics Pte Ltd',
    address: '8 Changi South Street 1, JTC Logistics Hub, Singapore 486772',
    tier: 'GDP Certified Medical Shipper',
    creditLimit: 'S$ 75,000',
    paymentTerms: 'Net 15 Days',
    totalOrders: 9,
    totalSpent: 4180.00,
    activeShipments: 1,
    status: 'Active',
    registeredDate: '02 Mar 2025',
    tags: ['Cold Chain', 'Pharma GDP', 'High Priority', 'Audited']
  },
  {
    id: 'CUST-003',
    name: 'Changi Aviation Cargo Handling',
    contactPerson: 'Marcus Lim (Ramp Cargo Supt)',
    email: 'ops@changiair.sg',
    phone: '+65 6543 2100',
    company: 'Changi Air Cargo Logistics Hub',
    address: '1 Freight Close, Changi Air Cargo Complex, Singapore 819830',
    tier: 'Aviation Express Client',
    creditLimit: 'S$ 100,000',
    paymentTerms: 'Prepaid / Corporate Account',
    totalOrders: 22,
    totalSpent: 8950.00,
    activeShipments: 1,
    status: 'Active',
    registeredDate: '10 Nov 2024',
    tags: ['Aviation Cargo', 'Air Freight Feeder', 'Prepaid', '24/7 Ramp']
  },
  {
    id: 'CUST-004',
    name: 'Advanced Bio-Tech Systems',
    contactPerson: 'Dr. Elaine Wong (Lab Logistics)',
    email: 'biotech@systems.sg',
    phone: '+65 6111 2233',
    company: 'Advanced Bio-Tech Systems Asia',
    address: '21 Biopolis Drive, Nucleos #04-01, Singapore 138567',
    tier: 'Standard Corporate',
    creditLimit: 'S$ 30,000',
    paymentTerms: 'Net 30 Days',
    totalOrders: 6,
    totalSpent: 2640.00,
    activeShipments: 1,
    status: 'Active',
    registeredDate: '28 Jul 2025',
    tags: ['Biotech', 'Standard Corporate', 'Biopolis', 'Net-30']
  }
];

export const initialDocuments = [
  {
    id: 'DOC-88190-01',
    shipmentId: 'JOS-88190-SG',
    customerName: 'Razer Asia-Pacific HQ',
    type: 'Commercial Invoice',
    name: 'Commercial_Invoice_JOS-88190-SG.pdf',
    fileSize: '184 KB',
    uploadedBy: 'Josan Billing System',
    uploadDate: '17 Sep 2026, 08:30 SGT',
    status: 'Verified',
    docCategory: 'invoice'
  },
  {
    id: 'DOC-88190-02',
    shipmentId: 'JOS-88190-SG',
    customerName: 'Razer Asia-Pacific HQ',
    type: 'Packing List',
    name: 'Packing_List_Pallet_Manifest_88190.pdf',
    fileSize: '95 KB',
    uploadedBy: 'Shipper Warehouse Dock',
    uploadDate: '17 Sep 2026, 08:45 SGT',
    status: 'Verified',
    docCategory: 'packing_list'
  },
  {
    id: 'DOC-88190-03',
    shipmentId: 'JOS-88190-SG',
    customerName: 'Razer Asia-Pacific HQ',
    type: 'Delivery Note (LR)',
    name: 'Consignment_Note_LR_88190.pdf',
    fileSize: '120 KB',
    uploadedBy: 'Operations Dispatch Lead',
    uploadDate: '17 Sep 2026, 09:00 SGT',
    status: 'Active',
    docCategory: 'delivery_note'
  },
  {
    id: 'DOC-88190-04',
    shipmentId: 'JOS-88190-SG',
    customerName: 'Razer Asia-Pacific HQ',
    type: 'Customs Clearance Permit',
    name: 'TradeNet_Clearance_Permit_SG9910.pdf',
    fileSize: '210 KB',
    uploadedBy: 'Customs Brokerage Division',
    uploadDate: '17 Sep 2026, 07:15 SGT',
    status: 'Customs Cleared',
    docCategory: 'customs'
  },
  {
    id: 'DOC-88190-05',
    shipmentId: 'JOS-88190-SG',
    customerName: 'Razer Asia-Pacific HQ',
    type: 'Cargo Insurance Policy',
    name: 'AllRisk_Cargo_Insurance_Policy_88190.pdf',
    fileSize: '315 KB',
    uploadedBy: 'Underwriter Portal',
    uploadDate: '16 Sep 2026, 18:00 SGT',
    status: 'Active Policy',
    docCategory: 'insurance'
  },
  {
    id: 'DOC-66301-01',
    shipmentId: 'JOS-66301-SG',
    customerName: 'Advanced Bio-Tech Systems',
    type: 'Proof of Delivery (POD)',
    name: 'Josan_POD_JOS-66301-SG.pdf',
    fileSize: '412 KB',
    uploadedBy: 'Driver Gurpreet Singh',
    uploadDate: '16 Sep 2026, 14:15 SGT',
    status: 'Completed & Signed',
    docCategory: 'pod'
  },
  {
    id: 'DOC-44021-01',
    shipmentId: 'JOS-44021-SG',
    customerName: 'Singapore Pharma Logistics Hub',
    type: 'Commercial Invoice',
    name: 'Commercial_Invoice_JOS-44021-SG.pdf',
    fileSize: '178 KB',
    uploadedBy: 'Josan Billing System',
    uploadDate: '17 Sep 2026, 10:10 SGT',
    status: 'Verified',
    docCategory: 'invoice'
  },
  {
    id: 'DOC-44021-02',
    shipmentId: 'JOS-44021-SG',
    customerName: 'Singapore Pharma Logistics Hub',
    type: 'Temperature Datalogger Certificate',
    name: 'Reefer_ColdChain_Calibration_Cert.pdf',
    fileSize: '260 KB',
    uploadedBy: 'GDP Quality Officer',
    uploadDate: '17 Sep 2026, 10:20 SGT',
    status: 'Verified',
    docCategory: 'customs'
  }
];

export const initialInvoices = [
  {
    id: 'INV-2026-8819',
    invoiceNumber: 'INV-2026-8819',
    shipmentId: 'JOS-88190-SG',
    customerName: 'Razer Asia-Pacific HQ',
    customerEmail: 'logistics@razer.com',
    customerPhone: '+65 6789 0123',
    subtotal: 380.00,
    taxRate: 0.09,
    taxAmount: 34.20,
    total: 414.20,
    paymentStatus: 'Paid',
    issueDate: '17 Sep 2026',
    dueDate: '17 Oct 2026',
    notes: 'Paid via Corporate Wire Transfer (Ref: RAZ-SG-8819). Invoice settled.'
  },
  {
    id: 'INV-2026-4402',
    invoiceNumber: 'INV-2026-4402',
    shipmentId: 'JOS-44021-SG',
    customerName: 'Singapore Pharma Logistics Hub',
    customerEmail: 'coldchain@sgpharma.com',
    customerPhone: '+65 6234 5678',
    subtotal: 490.00,
    taxRate: 0.09,
    taxAmount: 44.10,
    total: 534.10,
    paymentStatus: 'Unpaid',
    issueDate: '17 Sep 2026',
    dueDate: '24 Sep 2026',
    notes: 'Pending customer accounts payable clearance.'
  },
  {
    id: 'INV-2026-6630',
    invoiceNumber: 'INV-2026-6630',
    shipmentId: 'JOS-66301-SG',
    customerName: 'Advanced Bio-Tech Systems',
    customerEmail: 'biotech@systems.sg',
    customerPhone: '+65 6111 2233',
    subtotal: 580.00,
    taxRate: 0.09,
    taxAmount: 52.20,
    total: 632.20,
    paymentStatus: 'Paid',
    issueDate: '15 Sep 2026',
    dueDate: '15 Oct 2026',
    notes: 'Settled on delivery verification.'
  },
  {
    id: 'INV-2026-9921',
    invoiceNumber: 'INV-2026-9921',
    shipmentId: 'JOS-99210-SG',
    customerName: 'Changi Aviation Cargo Handling',
    customerEmail: 'ops@changiair.sg',
    customerPhone: '+65 6543 2100',
    subtotal: 750.00,
    taxRate: 0.09,
    taxAmount: 67.50,
    total: 817.50,
    paymentStatus: 'Pending',
    issueDate: '16 Sep 2026',
    dueDate: '23 Sep 2026',
    notes: 'Scheduled for batch disbursement via FAST transfer.'
  },
  {
    id: 'INV-2026-3105',
    invoiceNumber: 'INV-2026-3105',
    shipmentId: 'JOS-31055-SG',
    customerName: 'Global Maritime Supplies',
    customerEmail: 'accounts@maritime.sg',
    customerPhone: '+65 6888 9999',
    subtotal: 290.00,
    taxRate: 0.09,
    taxAmount: 26.10,
    total: 316.10,
    paymentStatus: 'Refunded',
    issueDate: '10 Sep 2026',
    dueDate: '17 Sep 2026',
    notes: 'Consignment route altered; cancellation refund issued to original corporate card.'
  }
];

export const initialTickets = [
  {
    id: 'TCK-901',
    shipmentId: 'JOS-88190-SG',
    customerName: 'Razer Asia-Pacific HQ',
    customerEmail: 'logistics@razer.com',
    customerPhone: '+65 6789 0123',
    subject: 'Delivery window clarification for urgent Microchip load',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'Sarah Lin (Operations Dispatch Lead)',
    createdAt: '17 Sep 2026, 09:30 SGT',
    lastUpdated: '15 mins ago',
    messages: [
      {
        id: 'msg-01',
        sender: 'Razer Asia-Pacific HQ',
        role: 'customer',
        text: 'Hi operations team, please ensure driver arrives before 5:00 PM at Bay 4 dock due to receiving crew shift transition.',
        timestamp: '09:30 AM'
      },
      {
        id: 'msg-02',
        sender: 'Sarah Lin (Josan Operations)',
        role: 'admin',
        text: 'Hello Tan, driver Tan Wei Ming is currently en route on PIE Highway Exit 19 with no traffic delays. Expected docking is 4:15 PM, well ahead of the 5:00 PM shift deadline.',
        timestamp: '09:42 AM'
      }
    ]
  },
  {
    id: 'TCK-902',
    shipmentId: 'JOS-44021-SG',
    customerName: 'Singapore Pharma Logistics Hub',
    customerEmail: 'coldchain@sgpharma.com',
    customerPhone: '+65 6234 5678',
    subject: 'Cold-chain calibration datalogger certificate request',
    priority: 'Urgent',
    status: 'Open',
    assignedTo: 'Unassigned',
    createdAt: '17 Sep 2026, 11:15 SGT',
    lastUpdated: 'Just now',
    messages: [
      {
        id: 'msg-01',
        sender: 'Singapore Pharma Logistics Hub',
        role: 'customer',
        text: 'Please upload the digital GDP calibration cert for refrigerated van #SG-4402 before we authorize receiving.',
        timestamp: '11:15 AM'
      }
    ]
  },
  {
    id: 'TCK-903',
    shipmentId: 'JOS-66301-SG',
    customerName: 'Advanced Bio-Tech Systems',
    customerEmail: 'biotech@systems.sg',
    customerPhone: '+65 6111 2233',
    subject: 'Proof of Delivery (POD) signature copy request',
    priority: 'Medium',
    status: 'Resolved',
    assignedTo: 'David Ng (Fleet Auditor)',
    createdAt: '16 Sep 2026, 14:30 SGT',
    lastUpdated: 'Yesterday, 15:45 SGT',
    messages: [
      {
        id: 'msg-01',
        sender: 'Advanced Bio-Tech Systems',
        role: 'customer',
        text: 'Could you confirm if the POD has been signed and archived?',
        timestamp: '14:30 PM'
      },
      {
        id: 'msg-02',
        sender: 'David Ng (Josan Fleet Auditor)',
        role: 'admin',
        text: 'Yes, delivery completed with verified recipient signature and cargo photo. The official POD PDF is now downloadable directly from your portal.',
        timestamp: '15:45 PM'
      }
    ]
  }
];

// ==========================================
// CRM MODULE MOCK DATA
// ==========================================

export const initialLeads = [
  {
    id: 'LEAD-101',
    name: 'Derrick Tan',
    company: 'Nordic Sea Foods Asia Pte Ltd',
    email: 'derrick.tan@nordicseafoods.sg',
    phone: '+65 6778 9912',
    source: 'Website Quote Form',
    stage: 'Negotiating',
    estimatedValue: 18500,
    tags: ['Cold Chain', 'Reefer', 'High Value', 'Tuas Fisheries'],
    createdDate: '2026-09-10',
    convertedCustomerId: null
  },
  {
    id: 'LEAD-102',
    name: 'Siti Rahmah',
    company: 'Apex Precision Engineering Pte Ltd',
    email: 'siti@apexprecision.com.sg',
    phone: '+65 6892 3341',
    source: 'Referral',
    stage: 'Quote Sent',
    estimatedValue: 12000,
    tags: ['Industrial', 'Heavy Machinery', 'Monthly Contract'],
    createdDate: '2026-09-12',
    convertedCustomerId: null
  },
  {
    id: 'LEAD-103',
    name: 'Michael Chang',
    company: 'MediLife Pharma Distribution',
    email: 'mchang@medilife.sg',
    phone: '+65 6334 1109',
    source: 'Cold Outreach',
    stage: 'Contacted',
    estimatedValue: 24000,
    tags: ['Pharma GDP', 'Temperature Controlled', 'Urgent'],
    createdDate: '2026-09-14',
    convertedCustomerId: null
  },
  {
    id: 'LEAD-104',
    name: 'Clara Teo',
    company: 'Zenith Semiconductor Corp',
    email: 'clara.teo@zenithsemi.com',
    phone: '+65 6901 8823',
    source: 'Website Quote Form',
    stage: 'Won',
    estimatedValue: 35000,
    tags: ['Electronics', 'Cleanroom', 'Enterprise'],
    createdDate: '2026-08-25',
    convertedCustomerId: 'CUST-001'
  },
  {
    id: 'LEAD-105',
    name: 'Raymond Koh',
    company: 'Sentosa Hospitality Supplies',
    email: 'raymond.koh@sentosasupplies.sg',
    phone: '+65 6451 0092',
    source: 'Cold Outreach',
    stage: 'New',
    estimatedValue: 6500,
    tags: ['FMCG', 'Daily Deliveries'],
    createdDate: '2026-09-16',
    convertedCustomerId: null
  },
  {
    id: 'LEAD-106',
    name: 'Jason Patel',
    company: 'BioChemical Express Pte Ltd',
    email: 'jason@biochemexpress.sg',
    phone: '+65 6744 5510',
    source: 'Referral',
    stage: 'Lost',
    estimatedValue: 15000,
    tags: ['Hazardous', 'Chemicals'],
    createdDate: '2026-08-20',
    convertedCustomerId: null
  },
  {
    id: 'LEAD-107',
    name: 'Benjamin Lee',
    company: 'Pacific Rim Solar Components',
    email: 'b.lee@pacificsolar.com.sg',
    phone: '+65 6812 9044',
    source: 'Website Quote Form',
    stage: 'New',
    estimatedValue: 21000,
    tags: ['Renewable Energy', 'FTL', 'Jurong Hub'],
    createdDate: '2026-09-17',
    convertedCustomerId: null
  }
];

export const initialCommunications = [];

export const initialTasks = [
  {
    id: 'TASK-301',
    leadId: 'LEAD-101',
    customerId: null,
    title: 'Send finalized service contract with 30-day payment term rider',
    dueDate: '2026-09-18',
    assignedTo: 'Darren Josan',
    status: 'pending',
    priority: 'high'
  },
  {
    id: 'TASK-302',
    leadId: 'LEAD-102',
    customerId: null,
    title: 'Follow up on CNC machinery route clearance quote',
    dueDate: '2026-09-19',
    assignedTo: 'Sherry Lim',
    status: 'pending',
    priority: 'medium'
  },
  {
    id: 'TASK-303',
    leadId: null,
    customerId: 'CUST-001',
    title: 'Review Q4 peak season reserved fleet allocation',
    dueDate: '2026-09-22',
    assignedTo: 'Darren Josan',
    status: 'pending',
    priority: 'high'
  },
  {
    id: 'TASK-304',
    leadId: null,
    customerId: 'CUST-002',
    title: 'Upload GDP vehicle audit certificate to customer documents vault',
    dueDate: '2026-09-16',
    assignedTo: 'David Ng',
    status: 'done',
    priority: 'medium'
  }
];

