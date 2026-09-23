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
    const dbRecord = {
      id: shipmentData.id,
      sender: shipmentData.sender,
      sender_phone: shipmentData.senderPhone || shipmentData.sender_phone,
      sender_address: shipmentData.senderAddress || shipmentData.sender_address,
      receiver: shipmentData.receiver,
      receiver_phone: shipmentData.receiverPhone || shipmentData.receiver_phone,
      receiver_address: shipmentData.receiverAddress || shipmentData.receiver_address,
      origin: shipmentData.origin,
      destination: shipmentData.destination,
      current_location: shipmentData.currentLocation || shipmentData.current_location || shipmentData.origin,
      status: shipmentData.status || 'Booking Confirmed',
      status_type: shipmentData.statusType || shipmentData.status_type || 'active',
      payment_status: shipmentData.paymentStatus || shipmentData.payment_status || 'Paid',
      service_level: shipmentData.serviceLevel || shipmentData.service_level || 'Express Road Freight',
      cargo_type: shipmentData.cargoType || shipmentData.cargo_type || 'General Freight',
      weight: shipmentData.weight || '500 kg',
      pieces: shipmentData.pieces || 1,
      declared_value: shipmentData.declaredValue || shipmentData.declared_value || 'S$ 10,000',
      price: shipmentData.price || 'S$ 450.00',
      driver_id: shipmentData.driverId || shipmentData.driver_id || null,
      driver_name: shipmentData.driverName || shipmentData.driver_name || null,
      driver_phone: shipmentData.driverPhone || shipmentData.driver_phone || null,
      vehicle: shipmentData.vehicle || null,
      estimated_delivery: shipmentData.estimatedDelivery || shipmentData.estimated_delivery || 'Today, 5:00 PM',
      timeline: shipmentData.timeline || [],
      coordinates: shipmentData.coordinates || {}
    };
    const { data, error } = await supabase
      .from('shipments')
      .upsert([dbRecord])
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

  deleteShipment: async (shipmentId) => {
    if (!isSupabaseConfigured) return null;
    const { error } = await supabase
      .from('shipments')
      .delete()
      .eq('id', shipmentId);
    if (error) {
      console.warn('[Supabase] Delete shipment error:', error.message);
      return false;
    }
    return true;
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
    return (data || []).map(d => ({
      ...d,
      licenseNumber: d.license_number || d.licenseNumber || 'SG-CLASS4-991',
      vehicleType: d.vehicle_type || d.vehicleType || '14-Ton Box Truck',
      vehicleId: d.vehicle_id || d.vehicleId || 'SG-8819',
      vehiclePlate: d.vehicle_plate || d.vehiclePlate || d.vehicle_id || d.vehicleId || 'SG-8819',
      deliveriesCompleted: d.deliveries_completed ?? d.deliveriesCompleted ?? 0,
      onTimeRate: d.on_time_rate || d.onTimeRate || '100%',
      assignedHub: d.assigned_hub || d.assignedHub || 'Changi Air Cargo Logistics Hub',
      safetyScore: d.safety_score || d.safetyScore || '100/100',
      assignedVehicle: `${d.vehicle_type || d.vehicleType || 'Vehicle'} (${d.vehicle_plate || d.vehicle_id || d.vehiclePlate || 'SG-8819'})`,
    }));
  },

  createDriver: async (driverData) => {
    if (!isSupabaseConfigured) return null;
    const dbRecord = {
      id: driverData.id || `DRV-${Math.floor(100 + Math.random() * 900)}`,
      name: driverData.name,
      photo: driverData.photo || null,
      phone: driverData.phone,
      email: driverData.email || null,
      password: driverData.password || 'driver123',
      license_number: driverData.licenseNumber || driverData.license_number || 'SG-CLASS4-991',
      vehicle_type: driverData.vehicleType || driverData.vehicle_type || 'Refrigerated Van',
      vehicle_id: driverData.vehicleId || driverData.vehicle_id || 'SG-900',
      vehicle_plate: driverData.vehiclePlate || driverData.vehicle_plate || driverData.vehicleId || 'SG-900',
      status: driverData.status || 'Available',
      deliveries_completed: driverData.deliveriesCompleted ?? driverData.deliveries_completed ?? 0,
      on_time_rate: driverData.onTimeRate || driverData.on_time_rate || '100%',
      rating: driverData.rating ?? 5.0,
      assigned_hub: driverData.assignedHub || driverData.assigned_hub || 'Changi Air Cargo Logistics Hub',
      safety_score: driverData.safetyScore || driverData.safety_score || '100/100'
    };
    const { data, error } = await supabase
      .from('drivers')
      .upsert([dbRecord])
      .select();
    
    if (error) {
      console.warn('[Supabase] Create driver error:', error.message);
      return null;
    }
    return data?.[0];
  },

  updateDriver: async (driverId, updates) => {
    if (!isSupabaseConfigured) return null;
    const dbUpdates = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.password !== undefined) dbUpdates.password = updates.password;
    if (updates.photo !== undefined) dbUpdates.photo = updates.photo;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.vehicleType !== undefined || updates.vehicle_type !== undefined) dbUpdates.vehicle_type = updates.vehicleType || updates.vehicle_type;
    if (updates.vehicleId !== undefined || updates.vehicle_id !== undefined) dbUpdates.vehicle_id = updates.vehicleId || updates.vehicle_id;
    if (updates.vehiclePlate !== undefined || updates.vehicle_plate !== undefined) dbUpdates.vehicle_plate = updates.vehiclePlate || updates.vehicle_plate;
    if (updates.licenseNumber !== undefined || updates.license_number !== undefined) dbUpdates.license_number = updates.licenseNumber || updates.license_number;
    if (updates.assignedHub !== undefined || updates.assigned_hub !== undefined) dbUpdates.assigned_hub = updates.assignedHub || updates.assigned_hub;
    if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
    if (updates.safetyScore !== undefined || updates.safety_score !== undefined) dbUpdates.safety_score = updates.safetyScore || updates.safety_score;
    if (updates.onTimeRate !== undefined || updates.on_time_rate !== undefined) dbUpdates.on_time_rate = updates.onTimeRate || updates.on_time_rate;
    if (updates.deliveriesCompleted !== undefined || updates.deliveries_completed !== undefined) dbUpdates.deliveries_completed = updates.deliveriesCompleted ?? updates.deliveries_completed;

    const { data, error } = await supabase
      .from('drivers')
      .update(dbUpdates)
      .eq('id', driverId)
      .select();
      
    if (error) {
      console.warn('[Supabase] Update driver error:', error.message);
      return null;
    }
    return data?.[0];
  },

  deleteDriver: async (driverId) => {
    if (!isSupabaseConfigured) return null;
    const { error } = await supabase
      .from('drivers')
      .delete()
      .eq('id', driverId);
    
    if (error) {
      console.warn('[Supabase] Delete driver error:', error.message);
      return false;
    }
    return true;
  },

  updateDriverLocation: async (driverId, coordinates) => {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
      .from('drivers')
      .update({ coordinates })
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
