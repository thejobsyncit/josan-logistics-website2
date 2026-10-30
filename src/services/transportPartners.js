import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Transport Partners Service (Road Coordination via Partner Carriers)
 * Uses public.transport_partners
 */
export const transportPartnersService = {
  getTransportPartners: async () => {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase
        .from('transport_partners')
        .select('*')
        .order('name', { ascending: true });
      if (error) {
        console.warn('[TransportPartners] Fetch error:', error.message);
        return [];
      }
      return data || [];
    } catch (err) {
      return [];
    }
  },

  createTransportPartner: async (partner) => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('transport_partners')
        .insert([partner])
        .select();
      if (error) {
        console.warn('[TransportPartners] Create error:', error.message);
        return null;
      }
      return data?.[0] || null;
    } catch (err) {
      return null;
    }
  },

  updateTransportPartner: async (id, updates) => {
    if (!isSupabaseConfigured || !id) return null;
    try {
      const { data, error } = await supabase
        .from('transport_partners')
        .update(updates)
        .eq('id', id)
        .select();
      if (error) {
        console.warn('[TransportPartners] Update error:', error.message);
        return null;
      }
      return data?.[0] || null;
    } catch (err) {
      return null;
    }
  },

  deleteTransportPartner: async (id) => {
    if (!isSupabaseConfigured || !id) return false;
    try {
      const { error } = await supabase
        .from('transport_partners')
        .delete()
        .eq('id', id);
      return !error;
    } catch (err) {
      return false;
    }
  }
};
