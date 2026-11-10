import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Josan Logistics - Tracking Service
 * Directly invokes the Supabase Edge Function "track-shipment" calling database function track_shipment().
 * The browser never queries the database or calls local server endpoints for shipment tracking.
 */
export const trackingService = {
  /**
   * Track shipment publicly via Edge Function "track-shipment"
   */
  trackPublicShipment: async (trackingNumber, turnstileToken = '') => {
    if (!trackingNumber) return null;
    const cleanNum = String(trackingNumber).trim().toUpperCase();
    if (!cleanNum) return null;

    if (!isSupabaseConfigured || !supabase?.functions) {
      console.warn('[TrackingService] Supabase functions client unavailable');
      return null;
    }

    try {
      const { data, error } = await supabase.functions.invoke('track-shipment', {
        body: { 
          tracking_number: cleanNum,
          turnstile_token: turnstileToken || ''
        }
      });

      if (!error && data !== undefined && data !== null) {
        return data?.data !== undefined ? data.data : data;
      }
    } catch (edgeErr) {
      console.warn('[TrackingService] Edge function notice:', edgeErr?.message || edgeErr);
    }

    return null;
  }
};
