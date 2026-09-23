import { supabase, isSupabaseConfigured } from './supabase';

// Map of standard statuses to human display labels
export const SHIPMENT_STATUS_MAP = {
  ASSIGNED: 'Assigned',
  ACCEPTED: 'Accepted',
  GOING_TO_PICKUP: 'Going to Pickup',
  ARRIVED_AT_PICKUP: 'Arrived at Pickup',
  PICKUP_COMPLETED: 'Pickup Completed',
  IN_TRANSIT: 'In Transit',
  ARRIVED_AT_DELIVERY: 'Arrived at Delivery',
  DELIVERY_COMPLETED: 'Delivered',
  CANCELLED: 'Cancelled',
};

// Normalize input status into valid standard enum key
export function normalizeStatus(rawStatus) {
  if (!rawStatus) return 'ASSIGNED';
  const upper = String(rawStatus).trim().toUpperCase();
  if (SHIPMENT_STATUS_MAP[upper]) return upper;

  if (upper.includes('ASSIGN')) return 'ASSIGNED';
  if (upper.includes('ACCEPT')) return 'ACCEPTED';
  if (upper.includes('GOING') || upper.includes('EN ROUTE TO PICKUP')) return 'GOING_TO_PICKUP';
  if (upper.includes('ARRIVED AT PICKUP') || upper.includes('PICKUP ARRIVED')) return 'ARRIVED_AT_PICKUP';
  if (upper.includes('PICKUP COMPLETED') || upper.includes('PICKED UP')) return 'PICKUP_COMPLETED';
  if (upper.includes('TRANSIT')) return 'IN_TRANSIT';
  if (upper.includes('ARRIVED AT DELIVERY') || upper.includes('NEAR DESTINATION')) return 'ARRIVED_AT_DELIVERY';
  if (upper.includes('DELIVERED') || upper.includes('DELIVERY COMPLETED')) return 'DELIVERY_COMPLETED';
  if (upper.includes('CANCEL')) return 'CANCELLED';

  return 'ASSIGNED';
}

export const shipmentsService = {
  /**
   * Fetch all shipments ordered by created_at descending.
   */
  getShipments: async () => {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
      .from('shipments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[ShipmentsService] Fetch shipments error:', error.message);
      return null;
    }
    return data;
  },

  /**
   * Fetch single shipment by ID or tracking number.
   */
  getShipmentById: async (id) => {
    if (!isSupabaseConfigured || !id) return null;
    const { data, error } = await supabase
      .from('shipments')
      .select('*')
      .or(`id.eq.${id},tracking_number.eq.${id}`)
      .maybeSingle();

    if (error) {
      console.warn('[ShipmentsService] Fetch shipment by ID error:', error.message);
      return null;
    }
    return data;
  },

  /**
   * Create or update a shipment.
   */
  createShipment: async (shipmentData) => {
    if (!isSupabaseConfigured) return null;

    const stdStatus = normalizeStatus(shipmentData.status);

    const dbRecord = {
      id: shipmentData.id,
      tracking_number: shipmentData.tracking_number || shipmentData.trackingNumber || shipmentData.id,
      customer_id: shipmentData.customer_id || shipmentData.customerId || null,
      driver_id: shipmentData.driver_id || shipmentData.driverId || null,
      pickup_address: shipmentData.pickup_address || shipmentData.pickupAddress || shipmentData.senderAddress || shipmentData.origin || 'Singapore Pickup Address',
      pickup_postal_code: shipmentData.pickup_postal_code || shipmentData.pickupPostalCode || '048616',
      delivery_address: shipmentData.delivery_address || shipmentData.deliveryAddress || shipmentData.receiverAddress || shipmentData.destination || 'Singapore Delivery Address',
      delivery_postal_code: shipmentData.delivery_postal_code || shipmentData.deliveryPostalCode || '619114',
      package_description: shipmentData.package_description || shipmentData.packageDescription || shipmentData.cargoType || 'General Freight',
      weight: shipmentData.weight || '500 kg',
      dimensions: shipmentData.dimensions || '120x80x100 cm',
      scheduled_date: shipmentData.scheduled_date || shipmentData.scheduledDate || 'Today',
      time_slot: shipmentData.time_slot || shipmentData.timeSlot || '09:00 AM - 05:00 PM',
      status: stdStatus,

      // Front-end UI Compatibility
      sender: shipmentData.sender || shipmentData.senderName || 'Josan Client',
      sender_phone: shipmentData.sender_phone || shipmentData.senderPhone || '+65 9123 4567',
      sender_address: shipmentData.sender_address || shipmentData.senderAddress || shipmentData.pickupAddress || 'Singapore',
      receiver: shipmentData.receiver || shipmentData.receiverName || 'Recipient',
      receiver_phone: shipmentData.receiver_phone || shipmentData.receiverPhone || '+65 8123 4567',
      receiver_address: shipmentData.receiver_address || shipmentData.receiverAddress || shipmentData.deliveryAddress || 'Singapore',
      origin: shipmentData.origin || shipmentData.pickupCity || 'Singapore Central Hub',
      destination: shipmentData.destination || shipmentData.deliveryCity || 'Singapore Regional Hub',
      current_location: shipmentData.current_location || shipmentData.currentLocation || 'Dispatch Terminal',
      status_type: shipmentData.status_type || shipmentData.statusType || 'active',
      payment_status: shipmentData.payment_status || shipmentData.paymentStatus || 'Paid',
      service_level: shipmentData.service_level || shipmentData.serviceLevel || 'Express Road Freight',
      cargo_type: shipmentData.cargo_type || shipmentData.cargoType || 'General Freight',
      pieces: shipmentData.pieces || 1,
      declared_value: shipmentData.declared_value || shipmentData.declaredValue || 'S$ 10,000',
      price: shipmentData.price || 'S$ 450.00',
      driver_name: shipmentData.driver_name || shipmentData.driverName || null,
      driver_phone: shipmentData.driver_phone || shipmentData.driverPhone || null,
      vehicle: shipmentData.vehicle || null,
      estimated_delivery: shipmentData.estimated_delivery || shipmentData.estimatedDelivery || 'Today, 5:00 PM',
      timeline: shipmentData.timeline || [],
      coordinates: shipmentData.coordinates || {}
    };

    const { data, error } = await supabase
      .from('shipments')
      .upsert([dbRecord])
      .select();

    if (error) {
      console.warn('[ShipmentsService] Create shipment error:', error.message);
      return null;
    }
    return data?.[0];
  },

  /**
   * Update shipment status and optional location/notes.
   */
  updateShipmentStatus: async (shipmentId, status, location, notes) => {
    if (!isSupabaseConfigured || !shipmentId) return null;

    const stdStatus = normalizeStatus(status);
    const updates = {
      status: stdStatus,
      updated_at: new Date().toISOString()
    };

    if (location) {
      updates.current_location = location;
    }

    if (stdStatus === 'DELIVERY_COMPLETED') {
      updates.status_type = 'success';
      updates.otp_verified = true;
    }

    const { data, error } = await supabase
      .from('shipments')
      .update(updates)
      .eq('id', shipmentId)
      .select();

    if (error) {
      console.warn('[ShipmentsService] Update status error:', error.message);
      return null;
    }

    // Explicitly add to trip_status_history
    const shipment = data?.[0];
    if (shipment) {
      await supabase.from('trip_status_history').insert([{
        shipment_id: shipmentId,
        driver_id: shipment.driver_id,
        status: stdStatus,
        notes: notes || `Status changed to ${stdStatus}`
      }]);
    }

    return shipment;
  },

  /**
   * Assign driver to shipment.
   */
  assignDriver: async (shipmentId, driverId, driverName, driverPhone, vehicle) => {
    if (!isSupabaseConfigured || !shipmentId) return null;

    const updates = {
      driver_id: driverId,
      driver_name: driverName,
      driver_phone: driverPhone,
      vehicle: vehicle,
      status: 'ASSIGNED',
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('shipments')
      .update(updates)
      .eq('id', shipmentId)
      .select();

    if (error) {
      console.warn('[ShipmentsService] Assign driver error:', error.message);
      return null;
    }
    return data?.[0];
  },

  /**
   * Delete shipment.
   */
  deleteShipment: async (shipmentId) => {
    if (!isSupabaseConfigured || !shipmentId) return false;
    const { error } = await supabase
      .from('shipments')
      .delete()
      .eq('id', shipmentId);

    if (error) {
      console.warn('[ShipmentsService] Delete shipment error:', error.message);
      return false;
    }
    return true;
  },
};
