import { supabase, isSupabaseConfigured } from './supabase';
import { authService } from './auth';
import { shipmentsService, normalizeStatus, SHIPMENT_STATUS_MAP } from './shipments';
import { transportPartnersService } from './transportPartners';
import { customersService } from './customers';
import { trackingService } from './tracking';
import { notificationsService } from './notifications';
import { documentsService } from './documents';

export {
  authService,
  shipmentsService,
  transportPartnersService,
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

  // Shipments Database (public.shipments & tracking_events)
  getShipments: shipmentsService.getShipments,
  getShipmentById: shipmentsService.getShipmentById,
  createShipment: shipmentsService.createShipment,
  updateShipmentStatus: shipmentsService.updateShipmentStatus,
  assignDriver: shipmentsService.assignDriver,
  deleteShipment: shipmentsService.deleteShipment,

  // Transport Partners (public.transport_partners)
  getTransportPartners: transportPartnersService.getTransportPartners,
  createTransportPartner: transportPartnersService.createTransportPartner,
  updateTransportPartner: transportPartnersService.updateTransportPartner,
  deleteTransportPartner: transportPartnersService.deleteTransportPartner,

  // Customers (public.profiles with role = 'CUSTOMER')
  getCustomers: customersService.getCustomers,

  // Tracking Events Audit Trail (public.tracking_events)
  getTripStatusHistory: trackingService.getTripStatusHistory,
  logTripStatusChange: trackingService.logTripStatusChange,
  getDriverLocationHistory: trackingService.getDriverLocationHistory,
  trackPublicShipment: trackingService.trackPublicShipment,

  // Notifications (public.notifications)
  getNotifications: notificationsService.getNotifications,
  createNotification: notificationsService.createNotification,
  markNotificationAsRead: notificationsService.markAsRead,

  // Documents & Storage (public.shipment_documents)
  submitProofOfDelivery: documentsService.submitProofOfDelivery,
  getProofOfDelivery: documentsService.getProofOfDelivery,
  getShipmentDocuments: documentsService.getShipmentDocuments,
  uploadFile: documentsService.uploadFile,

  // Quote Requests & CRM Leads (public.quote_requests & public.quote_notes)
  getQuoteRequests: async () => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[Supabase] Fetch quote requests error:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.warn('[Supabase] getQuoteRequests error:', err);
      return null;
    }
  },

  createQuoteRequest: async (quoteData) => {
    if (!isSupabaseConfigured) return null;
    try {
      const record = {
        service_type: quoteData.service_type || 'ROAD_TRANSPORT',
        road_load_type: quoteData.road_load_type || null,
        add_documentation: Boolean(quoteData.add_documentation),
        pickup_location: quoteData.pickup_location || quoteData.pickup || 'Singapore',
        delivery_location: quoteData.delivery_location || quoteData.delivery || 'Singapore',
        preferred_pickup_date: quoteData.preferred_pickup_date || null,
        cargo_classification: quoteData.cargo_classification || 'General Cargo',
        cargo_description: quoteData.cargo_description || quoteData.description || 'Commercial Freight',
        packages: parseInt(quoteData.packages || 1, 10),
        gross_weight_kg: parseFloat(quoteData.gross_weight_kg || quoteData.weight || 0) || null,
        contact_name: quoteData.contact_name || quoteData.name || 'Enquirer',
        contact_email: quoteData.contact_email || quoteData.email || 'contact@example.com',
        contact_phone: quoteData.contact_phone || quoteData.phone || null,
        company_name: quoteData.company_name || quoteData.company || null,
        consent_given: Boolean(quoteData.consent_given),
        consent_at: quoteData.consent_given ? new Date().toISOString() : null,
        copy_to_customer: Boolean(quoteData.copy_to_customer),
        status: quoteData.status || 'New',
        is_test: Boolean(quoteData.is_test)
      };

      const { data, error } = await supabase
        .from('quote_requests')
        .insert([record])
        .select();

      if (error) {
        console.warn('[Supabase] Create quote request error:', error.message);
        return null;
      }
      return data?.[0];
    } catch (err) {
      console.warn('[Supabase] createQuoteRequest error:', err);
      return null;
    }
  },

  // Backwards compatibility for CRM leads mapped to quote_requests
  getLeads: async () => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[Supabase] Fetch leads error:', error.message);
        return null;
      }
      return (data || []).map(q => ({
        id: q.id,
        name: q.contact_name,
        email: q.contact_email,
        phone: q.contact_phone,
        company: q.company_name,
        status: q.status,
        service: q.service_type,
        created_at: q.created_at,
        reference: q.reference
      }));
    } catch (err) {
      return null;
    }
  },

  createLead: async (leadData) => {
    return supabaseApi.createQuoteRequest(leadData);
  },

  // Contact Messages & Support Inquiries (public.contact_messages)
  getContactMessages: async () => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[Supabase] Fetch contact messages error:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.warn('[Supabase] getContactMessages error:', err);
      return null;
    }
  },

  createContactMessage: async (msgData) => {
    if (!isSupabaseConfigured) return null;
    try {
      const record = {
        name: msgData.name || 'Website Visitor',
        email: msgData.email,
        phone: msgData.phone || null,
        company: msgData.company || null,
        subject: msgData.subject || 'General Enquiry',
        message: msgData.message || '',
        tracking_ref: msgData.tracking_ref || null,
        consent_given: Boolean(msgData.consent_given),
        consent_at: msgData.consent_given ? new Date().toISOString() : null,
        status: 'New',
        is_test: Boolean(msgData.is_test)
      };

      const { data, error } = await supabase
        .from('contact_messages')
        .insert([record])
        .select();

      if (error) {
        console.warn('[Supabase] Create contact message error:', error.message);
        return null;
      }
      return data?.[0];
    } catch (err) {
      console.warn('[Supabase] createContactMessage error:', err);
      return null;
    }
  },

  // Backwards compatibility for support tickets mapped to contact_messages
  getTickets: async () => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[Supabase] Fetch tickets error:', error.message);
        return null;
      }
      return (data || []).map(m => ({
        id: m.id,
        subject: m.subject || 'Customer Enquiry',
        sender: m.name,
        email: m.email,
        phone: m.phone,
        message: m.message,
        status: m.status === 'New' ? 'Open' : m.status,
        created_at: m.created_at
      }));
    } catch (err) {
      return null;
    }
  },

  createTicketReply: async (ticketId, replyText) => {
    if (!isSupabaseConfigured || !ticketId) return null;
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .update({
          status: 'Replied',
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId)
        .select();

      if (error) {
        console.warn('[Supabase] Reply ticket error:', error.message);
        return null;
      }
      return data?.[0];
    } catch (err) {
      return null;
    }
  },

  // Commercial Invoices (public.invoices)
  getInvoices: async () => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*, profiles(id, name, email, company), shipments(id, tracking_number)')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[Supabase] Fetch invoices error:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.warn('[Supabase] getInvoices error:', err);
      return null;
    }
  },

  // Staff Profiles Directory (public.profiles)
  getStaffProfiles: async () => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['ADMIN', 'CRM', 'READONLY', 'admin', 'crm', 'readonly', 'crm_manager', 'crm_ops', 'crm_finance', 'viewer']);

      if (error) {
        console.warn('[Supabase] Fetch staff profiles note:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.warn('[Supabase] getStaffProfiles error:', err);
      return null;
    }
  },

  upsertProfile: async (profileData) => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert([profileData], { onConflict: 'email' })
        .select();

      if (error) {
        console.warn('[Supabase] upsertProfile note:', error.message);
        return null;
      }
      return data?.[0];
    } catch (err) {
      console.warn('[Supabase] upsertProfile exception:', err);
      return null;
    }
  },

  deleteProfile: async (id) => {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
      return !error;
    } catch (err) {
      return false;
    }
  },

  // Security Audit Logs (public.audit_log)
  getAuditLogs: async () => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.warn('[Supabase] Fetch audit logs note:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.warn('[Supabase] getAuditLogs exception:', err);
      return null;
    }
  },

  createAuditLog: async (logEntry) => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('audit_log')
        .insert([{
          action: logEntry.action || logEntry.eventType || 'SYSTEM_ACTION',
          entity: logEntry.entity || 'STAFF',
          entity_id: logEntry.entity_id || logEntry.targetUser || null,
          details: typeof logEntry.details === 'object' ? logEntry.details : { message: logEntry.details || '' }
        }])
        .select();

      if (error) {
        console.warn('[Supabase] createAuditLog note:', error.message);
        return null;
      }
      return data?.[0];
    } catch (err) {
      console.warn('[Supabase] createAuditLog exception:', err);
      return null;
    }
  },

  // Database-enforced Module Permissions (public.module_permissions)
  getModulePermissions: async () => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('module_permissions')
        .select('*');

      if (error) {
        console.warn('[Supabase] getModulePermissions note:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      return null;
    }
  },

  saveModulePermission: async (perm) => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('module_permissions')
        .upsert([perm], { onConflict: perm.user_id ? 'user_id,module_key' : 'role,module_key' })
        .select();

      if (error) {
        console.warn('[Supabase] saveModulePermission note:', error.message);
        return null;
      }
      return data?.[0];
    } catch (err) {
      return null;
    }
  },

  // Site Settings (public.site_settings)
  getSiteSettings: async () => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) {
        console.warn('[Supabase] getSiteSettings note:', error.message);
        return null;
      }

      const map = {};
      if (Array.isArray(data)) {
        data.forEach(item => {
          map[item.key] = item.value;
        });
      }
      return map;
    } catch (err) {
      console.warn('[Supabase] getSiteSettings exception:', err);
      return null;
    }
  },

  saveSiteSetting: async (key, value, isPublic = true) => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .upsert([{ 
          key, 
          value: String(value ?? ''), 
          is_public: isPublic, 
          updated_at: new Date().toISOString() 
        }], { onConflict: 'key' })
        .select();

      if (error) {
        console.warn('[Supabase] saveSiteSetting error:', error.message);
        return null;
      }
      return data?.[0];
    } catch (err) {
      return null;
    }
  },

  saveSiteSettings: async (settingsObj) => {
    if (!isSupabaseConfigured) return null;
    try {
      const rows = Object.entries(settingsObj).map(([key, value]) => ({
        key,
        value: String(value ?? ''),
        is_public: true,
        updated_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('site_settings')
        .upsert(rows, { onConflict: 'key' })
        .select();

      if (error) {
        console.warn('[Supabase] saveSiteSettings error:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      return null;
    }
  }
};
