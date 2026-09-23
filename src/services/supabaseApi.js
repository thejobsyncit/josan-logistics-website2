import { supabase, isSupabaseConfigured } from './supabase';
import { authService } from './auth';
import { shipmentsService, normalizeStatus, SHIPMENT_STATUS_MAP } from './shipments';
import { driversService } from './drivers';
import { customersService } from './customers';
import { trackingService } from './tracking';
import { notificationsService } from './notifications';
import { documentsService } from './documents';

export {
  authService,
  shipmentsService,
  driversService,
  customersService,
  trackingService,
  notificationsService,
  documentsService,
  normalizeStatus,
  SHIPMENT_STATUS_MAP
};

export const supabaseApi = {
  // Authentication
  signUp: authService.signUp,
  signIn: authService.signIn,
  signOut: authService.signOut,
  getSession: authService.getSession,
  onAuthStateChange: authService.onAuthStateChange,

  // Shipments Database
  getShipments: shipmentsService.getShipments,
  getShipmentById: shipmentsService.getShipmentById,
  createShipment: shipmentsService.createShipment,
  updateShipmentStatus: shipmentsService.updateShipmentStatus,
  assignDriver: shipmentsService.assignDriver,
  deleteShipment: shipmentsService.deleteShipment,

  // Drivers Fleet Telematics
  getDrivers: driversService.getDrivers,
  createDriver: driversService.createDriver,
  updateDriver: driversService.updateDriver,
  deleteDriver: driversService.deleteDriver,
  updateDriverLocation: driversService.updateDriverLocation,

  // Customers
  getCustomers: customersService.getCustomers,
  createCustomer: customersService.createCustomer,

  // Tracking & Location Audit Log
  getTripStatusHistory: trackingService.getTripStatusHistory,
  logTripStatusChange: trackingService.logTripStatusChange,
  getDriverLocationHistory: trackingService.getDriverLocationHistory,

  // Notifications
  getNotifications: notificationsService.getNotifications,
  createNotification: notificationsService.createNotification,
  markNotificationAsRead: notificationsService.markAsRead,

  // Proof of Delivery & Storage
  submitProofOfDelivery: documentsService.submitProofOfDelivery,
  getProofOfDelivery: documentsService.getProofOfDelivery,
  uploadFile: documentsService.uploadFile,

  // CRM Leads
  getLeads: async () => {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
      .from('crm_leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.warn('[Supabase] Fetch leads error:', error.message);
      return null;
    }
    return data;
  },

  createLead: async (leadData) => {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
      .from('crm_leads')
      .insert([leadData])
      .select();
    
    if (error) {
      console.warn('[Supabase] Create lead error:', error.message);
      return null;
    }
    return data?.[0];
  },

  // Support Tickets
  getTickets: async () => {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.warn('[Supabase] Fetch tickets error:', error.message);
      return null;
    }
    return data;
  },

  createTicketReply: async (ticketId, replies) => {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
      .from('support_tickets')
      .update({ replies })
      .eq('id', ticketId)
      .select();
    
    if (error) {
      console.warn('[Supabase] Reply ticket error:', error.message);
      return null;
    }
    return data?.[0];
  },
};
