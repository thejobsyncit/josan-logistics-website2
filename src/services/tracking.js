import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Josan Logistics - Tracking Service
 * Rebuilt to use Edge Function "track-shipment" calling database function track_shipment().
 * The browser never queries the shipments table directly.
 */
export const trackingService = {
  /**
   * Track shipment publicly via Edge Function "track-shipment"
   * which executes public.track_shipment(p_tracking text) via service_role.
   */
  trackPublicShipment: async (trackingNumber) => {
    if (!trackingNumber) return null;
    const cleanNum = String(trackingNumber).trim().toUpperCase();
    if (!cleanNum) return null;

    // 1. Invoke Supabase Edge Function 'track-shipment'
    try {
      if (isSupabaseConfigured && supabase?.functions) {
        const { data, error } = await supabase.functions.invoke('track-shipment', {
          body: { tracking_number: cleanNum }
        });
        if (!error && data !== undefined && data !== null) {
          return data?.data !== undefined ? data.data : data;
        }
      }
    } catch (edgeErr) {
      console.warn('[TrackingService] Edge function notice:', edgeErr?.message || edgeErr);
    }

    // 2. Fallback to server endpoint /api/track-shipment
    try {
      const resp = await fetch('/api/track-shipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracking_number: cleanNum })
      });
      if (resp.ok) {
        const resJson = await resp.json();
        return resJson?.data !== undefined ? resJson.data : resJson;
      }
    } catch (apiErr) {
      console.warn('[TrackingService] /api/track-shipment error:', apiErr?.message || apiErr);
    }

    return null;
  },

  /**
   * Fetch public tracking events for a shipment
   */
  getTripStatusHistory: async (shipmentId) => {
    if (!isSupabaseConfigured || !shipmentId) return [];
    try {
      const { data, error } = await supabase
        .from('tracking_events')
        .select('*')
        .eq('shipment_id', shipmentId)
        .eq('is_public', true)
        .order('occurred_at', { ascending: true });

      if (error) {
        console.warn('[TrackingService] Fetch tracking events error:', error.message);
        return [];
      }
      return data || [];
    } catch (err) {
      return [];
    }
  }
};
