import { supabase, isSupabaseConfigured } from './supabase';

export const driversService = {
  /**
   * Get all active drivers in fleet roster.
   */
  getDrivers: async () => {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('[DriversService] Fetch drivers error:', error.message);
      return null;
    }
    return (data || []).map((d) => ({
      ...d,
      licenseNumber: d.license_number || d.licenseNumber || 'SG-CLASS4-991',
      vehicleType: d.vehicle_type || d.vehicleType || '14-Ton Box Truck',
      vehicleId: d.vehicle_id || d.vehicleId || 'SG-8819',
      vehiclePlate: d.vehicle_plate || d.vehiclePlate || d.vehicle_id || 'SG-8819',
      vehicleNumber: d.vehicle_number || d.vehiclePlate || d.vehicle_id || 'SG-8819',
      deliveriesCompleted: d.deliveries_completed ?? d.deliveriesCompleted ?? 0,
      onTimeRate: d.on_time_rate || d.onTimeRate || '100%',
      assignedHub: d.assigned_hub || d.assignedHub || 'Changi Air Cargo Logistics Hub',
      safetyScore: d.safety_score || d.safetyScore || '100/100',
      assignedVehicle: `${d.vehicle_type || d.vehicleType || 'Vehicle'} (${d.vehicle_plate || d.vehicle_id || 'SG-8819'})`,
      currentLatitude: d.current_latitude || 1.3521,
      currentLongitude: d.current_longitude || 103.8200,
    }));
  },

  /**
   * Create new driver profile.
   */
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
      vehicle_number: driverData.vehicleNumber || driverData.vehiclePlate || driverData.vehicleId || 'SG-900',
      status: driverData.status || 'Available',
      deliveries_completed: driverData.deliveriesCompleted ?? driverData.deliveries_completed ?? 0,
      on_time_rate: driverData.onTimeRate || driverData.on_time_rate || '100%',
      rating: driverData.rating ?? 5.0,
      assigned_hub: driverData.assignedHub || driverData.assigned_hub || 'Changi Air Cargo Logistics Hub',
      safety_score: driverData.safetyScore || driverData.safety_score || '100/100',
      current_latitude: driverData.currentLatitude || 1.3521,
      current_longitude: driverData.currentLongitude || 103.8200,
    };

    const { data, error } = await supabase
      .from('drivers')
      .upsert([dbRecord])
      .select();

    if (error) {
      console.warn('[DriversService] Create driver error:', error.message);
      return null;
    }
    return data?.[0];
  },

  /**
   * Update driver attributes.
   */
  updateDriver: async (driverId, updates) => {
    if (!isSupabaseConfigured || !driverId) return null;

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

    const { data, error } = await supabase
      .from('drivers')
      .update(dbUpdates)
      .eq('id', driverId)
      .select();

    if (error) {
      console.warn('[DriversService] Update driver error:', error.message);
      return null;
    }
    return data?.[0];
  },

  /**
   * Delete driver.
   */
  deleteDriver: async (driverId) => {
    if (!isSupabaseConfigured || !driverId) return false;
    const { error } = await supabase
      .from('drivers')
      .delete()
      .eq('id', driverId);

    if (error) {
      console.warn('[DriversService] Delete driver error:', error.message);
      return false;
    }
    return true;
  },

  /**
   * Update driver telematics GPS location stream.
   */
  updateDriverLocation: async (driverId, latitude, longitude, accuracy = 5.0) => {
    if (!isSupabaseConfigured || !driverId) return null;

    // Log to driver_locations table
    await supabase.from('driver_locations').insert([{
      driver_id: driverId,
      latitude,
      longitude,
      accuracy,
      recorded_at: new Date().toISOString()
    }]);

    // Update driver main record
    const { data, error } = await supabase
      .from('drivers')
      .update({
        current_latitude: latitude,
        current_longitude: longitude,
        coordinates: [latitude, longitude],
        last_location_at: new Date().toISOString()
      })
      .eq('id', driverId)
      .select();

    if (error) {
      console.warn('[DriversService] Update driver location error:', error.message);
      return null;
    }
    return data?.[0];
  },
};
