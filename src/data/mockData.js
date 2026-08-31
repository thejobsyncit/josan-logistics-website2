export const initialShipments = [
  {
    id: 'JOS-89421-US',
    sender: 'TechCorp Solutions',
    senderAddress: '100 Silicon Way, San Jose, CA 95110',
    receiver: 'Apex Dynamics',
    receiverAddress: '450 Fifth Ave, New York, NY 10018',
    origin: 'San Jose, CA',
    destination: 'New York, NY',
    currentLocation: 'Chicago Transit Hub, IL',
    status: 'In Transit', // Order Placed, Picked Up, In Transit, Out for Delivery, Delivered, Delayed
    statusType: 'active', // active, success, warning, pending
    serviceLevel: 'Express Air Freight',
    cargoType: 'High-Tech Electronics',
    weight: '245.5 kg',
    pieces: 4,
    declaredValue: '$18,500',
    price: '$890.00',
    driverId: 'DRV-102',
    driverName: 'Robert Martinez',
    driverPhone: '+1 (555) 392-8810',
    vehicle: 'Freight Truck #FL-408',
    estimatedDelivery: 'Tomorrow, 2:30 PM',
    createdDate: '2026-08-27 09:15 AM',
    timeline: [
      { title: 'Order Booked & Labeled', location: 'San Jose Dispatch Depot', timestamp: 'Aug 27, 09:15 AM', completed: true, icon: 'FileCheck' },
      { title: 'Picked Up by Courier', location: 'San Jose, CA Hub', timestamp: 'Aug 27, 02:40 PM', completed: true, icon: 'Truck' },
      { title: 'In Transit & Sorting Center', location: 'Chicago Logistics Terminal', timestamp: 'Aug 28, 11:20 AM', completed: true, current: true, icon: 'PackageCheck' },
      { title: 'Out for Delivery', location: 'New York Metro Depot', timestamp: 'Expected Aug 30, 08:00 AM', completed: false, icon: 'MapPin' },
      { title: 'Delivered & Signature Verified', location: '450 Fifth Ave, NYC', timestamp: 'Expected Aug 30, 02:30 PM', completed: false, icon: 'CheckCircle2' },
    ],
    coordinates: { origin: [37.3382, -121.8863], current: [41.8781, -87.6298], destination: [40.7128, -74.0060] }
  },
  {
    id: 'JOS-33104-EU',
    sender: 'Global Auto Components',
    senderAddress: 'Industriestrasse 14, Stuttgart, DE',
    receiver: 'Josan Logistics Depot Rotterdam',
    receiverAddress: 'Maasvlakte 301, Rotterdam, NL',
    origin: 'Stuttgart, Germany',
    destination: 'Rotterdam, Netherlands',
    currentLocation: 'Eindhoven Highway Checkpoint',
    status: 'Out for Delivery',
    statusType: 'active',
    serviceLevel: 'Land Freight Trucking',
    cargoType: 'Automotive Spare Parts',
    weight: '1,200 kg',
    pieces: 12,
    declaredValue: '$42,000',
    price: '$1,450.00',
    driverId: 'DRV-105',
    driverName: 'Elena Rostova',
    driverPhone: '+49 170 555 0192',
    vehicle: 'Volvo FH16 Truck #EU-991',
    estimatedDelivery: 'Today, 5:00 PM',
    createdDate: '2026-08-28 06:00 AM',
    timeline: [
      { title: 'Order Booked & Labeled', location: 'Stuttgart Factory Hub', timestamp: 'Aug 28, 06:00 AM', completed: true, icon: 'FileCheck' },
      { title: 'Picked Up & Sealed', location: 'Stuttgart Terminal', timestamp: 'Aug 28, 08:30 AM', completed: true, icon: 'Truck' },
      { title: 'Customs Clearance Passed', location: 'DE/NL Border Gate', timestamp: 'Aug 29, 01:10 PM', completed: true, icon: 'ShieldCheck' },
      { title: 'Out for Delivery', location: 'Rotterdam Port Road', timestamp: 'Aug 29, 03:00 PM', completed: true, current: true, icon: 'MapPin' },
      { title: 'Delivered & Signature Verified', location: 'Rotterdam Hub', timestamp: 'Expected Today, 05:00 PM', completed: false, icon: 'CheckCircle2' },
    ],
    coordinates: { origin: [48.7758, 9.1829], current: [51.4416, 5.4697], destination: [51.9244, 4.4777] }
  },
  {
    id: 'JOS-77210-IN',
    sender: 'Vedic Pharma Labs',
    senderAddress: 'Sector 62, Noida, UP, India',
    receiver: 'MediWorld Wholesale',
    receiverAddress: 'Bandra Kurla Complex, Mumbai, MH, India',
    origin: 'Noida, UP',
    destination: 'Mumbai, MH',
    currentLocation: 'Mumbai Airport Cargo Terminal',
    status: 'Delivered',
    statusType: 'success',
    serviceLevel: 'Cold Chain Express Air',
    cargoType: 'Temperature Sensitive Medical Vaccines',
    weight: '85.0 kg',
    pieces: 2,
    declaredValue: '$75,000',
    price: '$620.00',
    driverId: 'DRV-101',
    driverName: 'Gurpreet Singh',
    driverPhone: '+91 98765 43210',
    vehicle: 'Refrigerated Express Van #IN-204',
    estimatedDelivery: 'Delivered Aug 29, 11:30 AM',
    createdDate: '2026-08-28 10:00 AM',
    timeline: [
      { title: 'Order Booked & Cold-Packed', location: 'Noida Biotech Hub', timestamp: 'Aug 28, 10:00 AM', completed: true, icon: 'FileCheck' },
      { title: 'Airport Cold Storage Check', location: 'DEL Cargo Terminal', timestamp: 'Aug 28, 04:00 PM', completed: true, icon: 'PackageCheck' },
      { title: 'Air Transit Flight JOS-501', location: 'Delhi to Mumbai Flight', timestamp: 'Aug 29, 06:30 AM', completed: true, icon: 'Truck' },
      { title: 'Out for Local Dispatch', location: 'Bandra Courier Center', timestamp: 'Aug 29, 09:45 AM', completed: true, icon: 'MapPin' },
      { title: 'Delivered & Signature Verified', location: 'BKC Medical Center', timestamp: 'Aug 29, 11:30 AM', completed: true, current: true, icon: 'CheckCircle2' },
    ],
    coordinates: { origin: [28.6273, 77.3725], current: [19.0760, 72.8777], destination: [19.0760, 72.8777] }
  },
  {
    id: 'JOS-55912-UK',
    sender: 'Highland Luxury Goods',
    senderAddress: '12 Princes St, Edinburgh, UK',
    receiver: 'Harrods Logistics',
    receiverAddress: 'Knightsbridge, London, UK',
    origin: 'Edinburgh, UK',
    destination: 'London, UK',
    currentLocation: 'Birmingham Highway Depot',
    status: 'Delayed',
    statusType: 'warning',
    serviceLevel: 'Standard Ground Freight',
    cargoType: 'Textiles & Luxury Goods',
    weight: '310 kg',
    pieces: 6,
    declaredValue: '$12,000',
    price: '$450.00',
    driverId: 'DRV-104',
    driverName: 'James Sterling',
    driverPhone: '+44 7700 900077',
    vehicle: 'DAF XF Truck #UK-772',
    estimatedDelivery: 'Aug 31, 10:00 AM (Delayed due to M6 Traffic)',
    createdDate: '2026-08-27 14:00 PM',
    timeline: [
      { title: 'Order Created', location: 'Edinburgh Terminal', timestamp: 'Aug 27, 02:00 PM', completed: true, icon: 'FileCheck' },
      { title: 'Picked Up', location: 'Edinburgh Depot', timestamp: 'Aug 27, 05:30 PM', completed: true, icon: 'Truck' },
      { title: 'Traffic Delay Flagged', location: 'M6 Highway Junction 10', timestamp: 'Aug 29, 10:15 AM', completed: true, current: true, icon: 'AlertTriangle' },
      { title: 'Out for Delivery', location: 'North London Hub', timestamp: 'Pending Reschedule', completed: false, icon: 'MapPin' },
      { title: 'Delivered', location: 'London Harrods Gate', timestamp: 'Pending', completed: false, icon: 'CheckCircle2' },
    ],
    coordinates: { origin: [55.9533, -3.1883], current: [52.4862, -1.8904], destination: [51.5074, -0.1278] }
  }
];

export const initialDrivers = [
  {
    id: 'DRV-101',
    name: 'Gurpreet Singh',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 43210',
    email: 'gurpreet.singh@josanlogistics.com',
    licenseNumber: 'DL-9820119283',
    vehicleType: 'Refrigerated Van',
    vehicleId: 'IN-204',
    status: 'Available', // Available, On Delivery, Off-Duty
    deliveriesCompleted: 482,
    onTimeRate: '99.4%',
    rating: 4.9,
    assignedHub: 'Delhi / Noida Airport Hub',
    safetyScore: '98/100',
    joinedDate: 'Jan 2024'
  },
  {
    id: 'DRV-102',
    name: 'Robert Martinez',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 392-8810',
    email: 'robert.m@josanlogistics.com',
    licenseNumber: 'CA-91823901',
    vehicleType: 'Heavy 18-Wheeler Truck',
    vehicleId: 'FL-408',
    status: 'On Delivery',
    deliveriesCompleted: 610,
    onTimeRate: '98.8%',
    rating: 4.8,
    assignedHub: 'West Coast / San Jose Hub',
    safetyScore: '96/100',
    joinedDate: 'Mar 2023'
  },
  {
    id: 'DRV-103',
    name: 'Sarah Chen',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 441-9023',
    email: 'sarah.chen@josanlogistics.com',
    licenseNumber: 'NY-8821039',
    vehicleType: 'Sprinter Express Cargo',
    vehicleId: 'NY-502',
    status: 'Available',
    deliveriesCompleted: 340,
    onTimeRate: '99.7%',
    rating: 5.0,
    assignedHub: 'New York Metro Logistics Terminal',
    safetyScore: '100/100',
    joinedDate: 'Nov 2024'
  },
  {
    id: 'DRV-104',
    name: 'James Sterling',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+44 7700 900077',
    email: 'j.sterling@josanlogistics.com',
    licenseNumber: 'UK-7721094A',
    vehicleType: 'DAF Heavy Freight',
    vehicleId: 'UK-772',
    status: 'On Delivery',
    deliveriesCompleted: 520,
    onTimeRate: '97.5%',
    rating: 4.7,
    assignedHub: 'UK Central London Hub',
    safetyScore: '94/100',
    joinedDate: 'Feb 2023'
  },
  {
    id: 'DRV-105',
    name: 'Elena Rostova',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    phone: '+49 170 555 0192',
    email: 'elena.rostova@josanlogistics.com',
    licenseNumber: 'DE-49102930',
    vehicleType: 'Volvo Heavy Semi-Truck',
    vehicleId: 'EU-991',
    status: 'On Delivery',
    deliveriesCompleted: 780,
    onTimeRate: '99.9%',
    rating: 4.95,
    assignedHub: 'Rotterdam Ocean Port Depot',
    safetyScore: '99/100',
    joinedDate: 'Aug 2022'
  }
];

export const initialWarehouses = [
  {
    id: 'WH-USA-01',
    name: 'Chicago Central Logistics Hub',
    location: 'Chicago, IL, USA',
    manager: 'David Vance',
    capacitySqFt: '250,000 sq ft',
    capacityPercentage: 78,
    activeParcels: 3420,
    incomingToday: 480,
    outgoingToday: 510,
    bins: [
      { binId: 'BIN-A12', packageId: 'JOS-89421-US', item: 'TechCorp Server Rack', status: 'Staged for Load', priority: 'High' },
      { binId: 'BIN-B04', packageId: 'JOS-11092-US', item: 'Medical Ultrasound Scanner', status: 'In Storage', priority: 'Urgent' },
      { binId: 'BIN-C19', packageId: 'JOS-99214-US', item: 'Industrial Motors (x4)', status: 'Cleared Dispatch', priority: 'Normal' },
      { binId: 'BIN-D02', packageId: 'JOS-33012-US', item: 'Precision Fiber Cable Reels', status: 'In Inspection', priority: 'Normal' }
    ]
  },
  {
    id: 'WH-EUR-02',
    name: 'Rotterdam Ocean Cargo Hub',
    location: 'Rotterdam Port, Netherlands',
    manager: 'Hans Van Berg',
    capacitySqFt: '400,000 sq ft',
    capacityPercentage: 86,
    activeParcels: 8900,
    incomingToday: 1250,
    outgoingToday: 1100,
    bins: [
      { binId: 'BIN-R10', packageId: 'JOS-33104-EU', item: 'Automotive Engine Blocks', status: 'Ready for Trucking', priority: 'High' },
      { binId: 'BIN-R15', packageId: 'JOS-44021-EU', item: 'Wind Turbine Components', status: 'Customs Hold', priority: 'Normal' },
      { binId: 'BIN-R22', packageId: 'JOS-55102-EU', item: 'Chemical Fluid Drums', status: 'Hazmat Verified', priority: 'High' }
    ]
  },
  {
    id: 'WH-ASIA-03',
    name: 'Delhi NCR Airport Mega Depot',
    location: 'Noida, UP, India',
    manager: 'Rajesh Sharma',
    capacitySqFt: '180,000 sq ft',
    capacityPercentage: 64,
    activeParcels: 2150,
    incomingToday: 320,
    outgoingToday: 390,
    bins: [
      { binId: 'BIN-IN01', packageId: 'JOS-77210-IN', item: 'Vaccine Cold Storage Containers', status: 'Dispatched', priority: 'Critical' },
      { binId: 'BIN-IN08', packageId: 'JOS-88120-IN', item: 'Garment Export Crates', status: 'In Storage', priority: 'Normal' }
    ]
  }
];

export const analyticsData = {
  kpis: {
    totalShipments: '12,845',
    activeDeliveries: '1,420',
    onTimeDeliveryRate: '98.6%',
    monthlyRevenue: '$1,845,900',
    activeDrivers: 48,
    activeWarehouses: 12
  },
  monthlyRevenueChart: [
    { month: 'Jan', revenue: 1200000, volume: 8400 },
    { month: 'Feb', revenue: 1350000, volume: 9200 },
    { month: 'Mar', revenue: 1420000, volume: 9800 },
    { month: 'Apr', revenue: 1510000, volume: 10400 },
    { month: 'May', revenue: 1680000, volume: 11200 },
    { month: 'Jun', revenue: 1740000, volume: 11800 },
    { month: 'Jul', revenue: 1810000, volume: 12200 },
    { month: 'Aug', revenue: 1845900, volume: 12845 }
  ],
  delaysBreakdown: [
    { reason: 'Adverse Weather', percentage: 42, count: 76 },
    { reason: 'Highway Traffic Congestion', percentage: 28, count: 51 },
    { reason: 'Customs Clearance Inspections', percentage: 18, count: 33 },
    { reason: 'Vehicle Technical Maintenance', percentage: 12, count: 22 }
  ],
  serviceBreakdown: [
    { service: 'Express Air Freight', share: 38 },
    { service: 'Land Haulage & Trucking', share: 42 },
    { service: 'Ocean Container Cargo', share: 15 },
    { service: 'Cold Chain Pharma', share: 5 }
  ]
};
