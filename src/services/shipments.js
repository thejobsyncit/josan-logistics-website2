import { supabase, isSupabaseConfigured } from './supabase';

// Valid status values defined in public.shipments schema check constraint
export const VALID_SHIPMENT_STATUSES = [
  'Booked',
  'Confirmed',
  'Pickup Scheduled',
  'Picked Up',
  'In Transit',
  'Near Destination',
  'Delivered',
  'Cancelled'
];

export const SHIPMENT_STATUS_MAP = {
  ASSIGNED: 'Booked',
  ACCEPTED: 'Confirmed',
  GOING_TO_PICKUP: 'Pickup Scheduled',
  ARRIVED_AT_PICKUP: 'Pickup Scheduled',
  PICKUP_COMPLETED: 'Picked Up',
  IN_TRANSIT: 'In Transit',
  ARRIVED_AT_DELIVERY: 'Near Destination',
  DELIVERY_COMPLETED: 'Delivered',
  CANCELLED: 'Cancelled',
};

// Normalize any status input to schema check constraint values
export function normalizeStatus(rawStatus) {
  if (!rawStatus) return 'Booked';
  const str = String(rawStatus).trim();

  // If already exactly matching
  if (VALID_SHIPMENT_STATUSES.includes(str)) return str;

  const upper = str.toUpperCase();
  if (SHIPMENT_STATUS_MAP[upper]) return SHIPMENT_STATUS_MAP[upper];

  if (upper.includes('BOOK') || upper.includes('ASSIGN')) return 'Booked';
  if (upper.includes('ACCEPT') || upper.includes('CONFIRM')) return 'Confirmed';
  if (upper.includes('GOING') || upper.includes('PICKUP SCHED') || upper.includes('ARRIVED AT PICKUP')) return 'Pickup Scheduled';
  if (upper.includes('PICKED') || upper.includes('PICKUP COMP')) return 'Picked Up';
  if (upper.includes('TRANSIT')) return 'In Transit';
  if (upper.includes('NEAR') || upper.includes('ARRIVED AT DELIV')) return 'Near Destination';
  if (upper.includes('DELIVER')) return 'Delivered';
  if (upper.includes('CANCEL')) return 'Cancelled';

  return 'Booked';
}

// Normalize service_type to check constraint
export function normalizeServiceType(rawType) {
  if (!rawType) return 'ROAD_TRANSPORT';
  const upper = String(rawType).trim().toUpperCase();
  if (upper.includes('AIR')) return 'AIR_FREIGHT_DOCS';
  if (upper.includes('DOC')) return 'SHIPMENT_DOCS';
  return 'ROAD_TRANSPORT';
}

function mapShipmentToUI(row) {
  if (!row) return null;
  return {
    ...row,
    trackingNumber: row.tracking_number,
    tracking_number: row.tracking_number,
    sender: row.pickup_address || row.origin_city || 'Josan Consignor',
    sender_address: row.pickup_address,
    pickupAddress: row.pickup_address,
    receiver: row.delivery_address || row.destination_city || 'Consignee',
    receiver_address: row.delivery_address,
    deliveryAddress: row.delivery_address,
    origin: row.origin_city || 'Singapore Hub',
    destination: row.destination_city || 'Singapore Delivery',
    current_location: row.origin_city || 'In System',
    service_type: row.service_type || 'ROAD_TRANSPORT',
    serviceLevel: row.service_type === 'AIR_FREIGHT_DOCS' ? 'Commercial Air Freight' : 'Commercial Road Transportation',
    cargo_type: row.cargo_description || 'Commercial Freight',
    weight: row.weight_kg ? `${row.weight_kg} kg` : 'N/A',
    pieces: row.packages || 1,
    declared_value: row.declared_value ? `S$ ${Number(row.declared_value).toLocaleString()}` : null,
    price: row.freight_fee ? `S$ ${Number(row.freight_fee).toFixed(2)}` : 'S$ 0.00',
    status_type: row.status === 'Delivered' ? 'success' : (row.status === 'Cancelled' ? 'error' : 'active'),
    partner_id: row.partner_id,
    driver_id: row.partner_id,
    driver_name: row.transport_partners?.name || 'Partner Carrier',
    estimated_delivery: row.estimated_delivery
  };
}

export const shipmentsService = {
  /**
   * Fetch all shipments ordered by created_at descending from public.shipments.
   */
  getShipments: async () => {
    if (!isSupabaseConfigured) return null;

    try {
      const { data, error } = await supabase
        .from('shipments')
        .select('*, transport_partners(id, name, contact_name, contact_phone)')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[ShipmentsService] Fetch shipments error:', error.message);
        return null;
      }
      return (data || []).map(mapShipmentToUI);
    } catch (err) {
      console.warn('[ShipmentsService] Error fetching shipments:', err);
      return null;
    }
  },

  /**
   * Fetch single shipment by ID or tracking number.
   */
  getShipmentById: async (idOrTracking) => {
    if (!isSupabaseConfigured || !idOrTracking) return null;

    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idOrTracking);
      let query = supabase
        .from('shipments')
        .select('*, transport_partners(id, name, contact_name, contact_phone)');

      if (isUUID) {
        query = query.or(`id.eq.${idOrTracking},tracking_number.eq.${idOrTracking}`);
      } else {
        query = query.eq('tracking_number', idOrTracking);
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        console.warn('[ShipmentsService] Fetch shipment by ID error:', error.message);
        return null;
      }
      return mapShipmentToUI(data);
    } catch (err) {
      console.warn('[ShipmentsService] Error in getShipmentById:', err);
      return null;
    }
  },

  /**
   * Create or update a shipment in public.shipments.
   */
  createShipment: async (shipmentData) => {
    if (!isSupabaseConfigured) return null;

    try {
      const status = normalizeStatus(shipmentData.status);
      const serviceType = normalizeServiceType(shipmentData.service_type || shipmentData.serviceType);

      // Clean numeric fields
      const parseNum = (val) => {
        if (!val) return null;
        const num = parseFloat(String(val).replace(/[^0-9.]/g, ''));
        return isNaN(num) ? null : num;
      };

      const dbRecord = {
        service_type: serviceType,
        status: status,
        origin_city: shipmentData.origin || shipmentData.pickupCity || 'Singapore',
        destination_city: shipmentData.destination || shipmentData.deliveryCity || 'Singapore',
        pickup_address: shipmentData.pickup_address || shipmentData.pickupAddress || shipmentData.senderAddress || 'Singapore Pickup',
        delivery_address: shipmentData.delivery_address || shipmentData.deliveryAddress || shipmentData.receiverAddress || 'Singapore Delivery',
        cargo_description: shipmentData.cargo_description || shipmentData.package_description || shipmentData.cargoType || 'Commercial Freight',
        packages: parseInt(shipmentData.packages || shipmentData.pieces || 1, 10),
        weight_kg: parseNum(shipmentData.weight_kg || shipmentData.weight),
        declared_value: parseNum(shipmentData.declared_value || shipmentData.declaredValue),
        freight_fee: parseNum(shipmentData.freight_fee || shipmentData.price),
        awb_number: shipmentData.awb_number || shipmentData.awbNumber || null,
        road_reference: shipmentData.road_reference || null,
        updated_at: new Date().toISOString()
      };

      if (shipmentData.partner_id || shipmentData.driver_id || shipmentData.driverId) {
        dbRecord.partner_id = shipmentData.partner_id || shipmentData.driver_id || shipmentData.driverId;
      }
      if (shipmentData.customer_id || shipmentData.customerId) {
        dbRecord.customer_id = shipmentData.customer_id || shipmentData.customerId;
      }
      if (shipmentData.quote_id || shipmentData.quoteId) {
        dbRecord.quote_id = shipmentData.quote_id || shipmentData.quoteId;
      }

      // If valid UUID exists, use it
      if (shipmentData.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(shipmentData.id)) {
        dbRecord.id = shipmentData.id;
      }

      const { data, error } = await supabase
        .from('shipments')
        .upsert([dbRecord])
        .select('*, transport_partners(id, name, contact_name, contact_phone)');

      if (error) {
        console.warn('[ShipmentsService] Upsert shipment error:', error.message);
        return null;
      }

      const created = data?.[0];
      if (created) {
        // Record initial tracking event
        await supabase.from('tracking_events').insert([{
          shipment_id: created.id,
          stage: status,
          location: created.origin_city || 'Singapore',
          note: `Shipment registered: ${status}`,
          source: 'manual',
          is_public: true
        }]);
      }

      return mapShipmentToUI(created);
    } catch (err) {
      console.error('[ShipmentsService] Error creating shipment:', err);
      return null;
    }
  },

  /**
   * Update shipment status and insert audit event into public.tracking_events.
   */
  updateShipmentStatus: async (shipmentId, rawStatus, location, notes) => {
    if (!isSupabaseConfigured || !shipmentId) return null;

    try {
      const status = normalizeStatus(rawStatus);
      const updates = {
        status: status,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('shipments')
        .update(updates)
        .eq('id', shipmentId)
        .select('*, transport_partners(id, name, contact_name, contact_phone)');

      if (error) {
        console.warn('[ShipmentsService] Update status error:', error.message);
        return null;
      }

      // Record stage into tracking_events table (replaces old trip_status_history)
      await supabase.from('tracking_events').insert([{
        shipment_id: shipmentId,
        stage: status,
        location: location || null,
        note: notes || `Shipment stage updated to ${status}`,
        source: 'manual',
        is_public: true
      }]);

      return mapShipmentToUI(data?.[0]);
    } catch (err) {
      console.error('[ShipmentsService] Error updating status:', err);
      return null;
    }
  },

  /**
   * Assign transport partner to shipment.
   */
  assignDriver: async (shipmentId, partnerId) => {
    if (!isSupabaseConfigured || !shipmentId) return null;

    try {
      const updates = {
        partner_id: partnerId || null,
        status: 'Confirmed',
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('shipments')
        .update(updates)
        .eq('id', shipmentId)
        .select('*, transport_partners(id, name, contact_name, contact_phone)');

      if (error) {
        console.warn('[ShipmentsService] Assign transport partner error:', error.message);
        return null;
      }

      // Record event in tracking_events
      await supabase.from('tracking_events').insert([{
        shipment_id: shipmentId,
        stage: 'Confirmed',
        note: 'Transport partner assigned to consignment dispatch.',
        source: 'manual',
        is_public: true
      }]);

      return mapShipmentToUI(data?.[0]);
    } catch (err) {
      console.error('[ShipmentsService] Error assigning partner:', err);
      return null;
    }
  },

  /**
   * Delete shipment.
   */
  deleteShipment: async (shipmentId) => {
    if (!isSupabaseConfigured || !shipmentId) return false;
    try {
      const { error } = await supabase
        .from('shipments')
        .delete()
        .eq('id', shipmentId);

      if (error) {
        console.warn('[ShipmentsService] Delete shipment error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('[ShipmentsService] Error deleting shipment:', err);
      return false;
    }
  },
};
