/**
 * Production Data Store for Josan Logistics Platform
 * All seeded test/demo data (quotes, shipments, fake drivers, fake customers) has been removed.
 * Actual data is stored and loaded directly from Supabase.
 */

export const initialShipments = [];

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

export const initialTransportationPartners = [];

export const initialShipmentEvents = [];
