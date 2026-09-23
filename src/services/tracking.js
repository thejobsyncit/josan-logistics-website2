import { supabase, isSupabaseConfigured } from './supabase';

export const trackingService = {
  /**
   * Fetch trip status history audit trail for a shipment.
   */
  getTripStatusHistory: async (shipmentId) => {
    if (!isSupabaseConfigured || !shipmentId) return [];

    const { data, error } = await supabase
      .from('trip_status_history')
      .select('*')
      .eq('shipment_id', shipmentId)
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('[TrackingService] Fetch status history error:', error.message);
      return [];
    }
    return data || [];
  },

  /**
   * Log new status history entry.
   */
  logTripStatusChange: async ({ shipmentId, driverId, status, latitude, longitude, notes }) => {
    if (!isSupabaseConfigured || !shipmentId) return null;

    const { data, error } = await supabase
      .from('trip_status_history')
      .insert([{
        shipment_id: shipmentId,
        driver_id: driverId || null,
        status,
        latitude: latitude || null,
        longitude: longitude || null,
        notes: notes || `Status updated to ${status}`
      }])
      .select();

    if (error) {
      console.warn('[TrackingService] Log status change error:', error.message);
      return null;
    }
    return data?.[0];
  },

  /**
   * Fetch driver location logs.
   */
  getDriverLocationHistory: async (driverId) => {
    if (!isSupabaseConfigured || !driverId) return [];

    const { data, error } = await supabase
      .from('driver_locations')
      .select('*')
      .eq('driver_id', driverId)
      .order('recorded_at', { ascending: false })
      .limit(50);

    if (error) {
      console.warn('[TrackingService] Fetch driver locations error:', error.message);
      return [];
    }
    return data || [];
  }
};
