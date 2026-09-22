import { supabase, isSupabaseConfigured } from './supabase';

export const supabaseApi = {
  // Authentication
  signUp: async ({ email, password, fullName, phone, company, role = 'customer' }) => {
    if (!isSupabaseConfigured) return { error: 'Supabase credentials not configured in .env' };
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          company,
          role,
        },
      },
    });

    if (error) return { error: error.message };

    // Insert profile entry
    if (data?.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        full_name: fullName,
        phone,
        company,
        role,
      });
    }

    return { data };
  },

  signIn: async ({ email, password }) => {
    if (!isSupabaseConfigured) return { error: 'Supabase credentials not configured in .env' };
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { error: error.message };
    return { data };
  },

  signOut: async () => {
    if (!isSupabaseConfigured) return;
    return await supabase.auth.signOut();
  },

  getSession: async () => {
    if (!isSupabaseConfigured) return null;
    const { data } = await supabase.auth.getSession();
    return data?.session || null;
  },

  // Shipments Database
  getShipments: async () => {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
      .from('shipments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.warn('[Supabase] Fetch shipments error:', error.message);
      return null;
    }
    return data;
  },

  createShipment: async (shipmentData) => {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
      .from('shipments')
      .insert([shipmentData])
      .select();
    
    if (error) {
      console.warn('[Supabase] Create shipment error:', error.message);
      return null;
    }
    return data?.[0];
  },

  updateShipmentStatus: async (shipmentId, statusData) => {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
      .from('shipments')
      .update(statusData)
      .eq('id', shipmentId)
      .select();
    
    if (error) {
      console.warn('[Supabase] Update shipment error:', error.message);
      return null;
    }
    return data?.[0];
  },

  // Drivers Fleet Telematics
  getDrivers: async () => {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.warn('[Supabase] Fetch drivers error:', error.message);
      return null;
    }
    return data;
  },

  updateDriverLocation: async (driverId, coordinates) => {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
      .from('drivers')
      .update({ current_location: coordinates })
      .eq('id', driverId);
    
    if (error) {
      console.warn('[Supabase] Update driver location error:', error.message);
      return null;
    }
    return data;
  },

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
