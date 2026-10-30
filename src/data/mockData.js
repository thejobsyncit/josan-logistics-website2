/**
 * Production Data Store for Josan Logistics Platform
 * All seeded test/demo data (quotes, shipments, fake drivers, fake customers) has been removed.
 * Actual data is stored and loaded directly from Supabase.
 */

export const initialShipments = [];

export const initialQuotes = [];

export const initialNotifications = [];

export const initialDrivers = [];

export const initialWarehouses = [];

export const analyticsData = {
  kpis: {
    totalShipments: '0',
    activeDeliveries: '0',
    monthlyRevenue: 'S$ 0',
    onTimeRate: '100%',
    onTimeDeliveryRate: '100%'
  },
  monthlyRevenue: [],
  monthlyRevenueChart: [],
  delaysBreakdown: [],
  serviceBreakdown: [],
  serviceDistribution: []
};

export const initialCustomers = [];

export const initialDocuments = [];

export const initialInvoices = [];

export const initialTickets = [];

export const initialLeads = [];

export const initialCommunications = [];

export const initialTasks = [];

export const initialTransportationPartners = [
  {
    id: 'PRT-101',
    name: 'Woodlands Roadways Logistics Pte Ltd',
    contactPerson: 'Tan Wei Ming (Partner Lead)',
    phone: '+65 6789 0123',
    email: 'dispatch@woodlandsroadways.sg',
    vehicleTypes: '14ft Box Trucks, 24ft Heavy Lorries',
    operatingZones: 'Northern & Eastern Corridors (Woodlands, Changi, Pasir Panjang)',
    agreementStatus: 'Active Partner',
    registeredVehicles: 6,
    designatedDrivers: 8,
    activeDispatches: 0,
    address: '12 Woodlands Industrial Park E1, Singapore 757740',
    notes: 'Primary transport partner for heavy electronics and container drayage.'
  },
  {
    id: 'PRT-102',
    name: 'Apex Prime Haulage Pte Ltd',
    contactPerson: 'Muhammad Rizal (Operations Lead)',
    phone: '+65 8234 5678',
    email: 'ops@apexprimehaulage.sg',
    vehicleTypes: '24ft Lorries, 40ft Prime Movers',
    operatingZones: 'Pasir Panjang Port & Heavy Industrial Corridors',
    agreementStatus: 'Active Partner',
    registeredVehicles: 8,
    designatedDrivers: 10,
    activeDispatches: 0,
    address: '10 Pasir Panjang Road, Singapore 117438',
    notes: 'Handles heavy machinery and industrial container line transfers.'
  },
  {
    id: 'PRT-103',
    name: 'Island Freight Express Partners',
    contactPerson: 'Gurpreet Singh',
    phone: '+65 9876 5432',
    email: 'express@islandfreight.sg',
    vehicleTypes: '14ft Box Vans, Curtain-siders, Reefer Vans',
    operatingZones: 'Central & Northern Commercial Corridors',
    agreementStatus: 'Active Partner',
    registeredVehicles: 4,
    designatedDrivers: 5,
    activeDispatches: 0,
    address: '20 Woodlands Sector 1, Singapore 738344',
    notes: 'Specializes in temperature-controlled reefer hauls and GDP certified pharma.'
  },
  {
    id: 'PRT-104',
    name: 'Changi Feeder Transport Co.',
    contactPerson: 'Marcus Lim',
    phone: '+65 6543 2100',
    email: 'contact@changifeeder.sg',
    vehicleTypes: '14ft Air Cargo Feeder Box Vans',
    operatingZones: 'Changi Air Cargo Logistics Complex & Airport Transfers',
    agreementStatus: 'Active Partner',
    registeredVehicles: 5,
    designatedDrivers: 6,
    activeDispatches: 0,
    address: '9 Airline Road, Cargo Complex D, Singapore 819827',
    notes: 'Scheduled ramp-to-hub express feeder transportation arrangement.'
  }
];

export const initialShipmentEvents = [];
