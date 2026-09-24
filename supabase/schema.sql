-- =======================================================================
-- JOSAN LOGISTICS PLATFORM - COMPLETE SUPABASE DATABASE MIGRATION SCRIPT
-- Shared Backend Migration for Admin Website & Driver App
-- Copy and paste this complete script into your Supabase SQL Editor (https://app.supabase.com)
-- =======================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =======================================================================
-- TABLE 1: PROFILES (Extends Supabase Auth users)
-- =======================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  user_id UUID DEFAULT auth.uid(),
  name TEXT NOT NULL DEFAULT 'User',
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'CUSTOMER',
  status TEXT DEFAULT 'Active',
  company TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure missing columns exist if table was previously created
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_id UUID DEFAULT auth.uid();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS name TEXT DEFAULT 'User';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'CUSTOMER';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- =======================================================================
-- TABLE 2: DRIVERS (Driver Fleet Telematics & Roster)
-- =======================================================================
CREATE TABLE IF NOT EXISTS public.drivers (
  id TEXT PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  employee_id TEXT,
  phone TEXT NOT NULL DEFAULT '+65 9000 0000',
  vehicle_number TEXT,
  vehicle_type TEXT DEFAULT '14-Ton Box Truck',
  status TEXT DEFAULT 'Available',
  current_latitude DOUBLE PRECISION DEFAULT 1.3521,
  current_longitude DOUBLE PRECISION DEFAULT 103.8200,
  last_location_at TIMESTAMPTZ DEFAULT NOW(),

  -- Additional Fleet Roster Metadata
  name TEXT NOT NULL DEFAULT 'Fleet Driver',
  email TEXT UNIQUE,
  password TEXT DEFAULT 'driver123',
  photo TEXT,
  license_number TEXT,
  vehicle_id TEXT,
  vehicle_plate TEXT,
  deliveries_completed INT DEFAULT 0,
  on_time_rate TEXT DEFAULT '99.5%',
  rating NUMERIC(3,2) DEFAULT 4.90,
  assigned_hub TEXT DEFAULT 'Changi Air Cargo Hub',
  safety_score TEXT DEFAULT '99/100',
  coordinates JSONB DEFAULT '[1.3521, 103.8200]'::jsonb,
  last_location TEXT DEFAULT 'Singapore Central Hub',
  speed_kph NUMERIC DEFAULT 0,
  battery_level INT DEFAULT 95,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure missing columns exist on existing drivers table
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS employee_id TEXT;
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS vehicle_number TEXT;
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS vehicle_type TEXT DEFAULT '14-Ton Box Truck';
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS current_latitude DOUBLE PRECISION DEFAULT 1.3521;
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS current_longitude DOUBLE PRECISION DEFAULT 103.8200;
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS last_location_at TIMESTAMPTZ DEFAULT NOW();

-- =======================================================================
-- TABLE 3: CUSTOMERS (Corporate Shippers Directory)
-- =======================================================================
CREATE TABLE IF NOT EXISTS public.customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Customer',
  company_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  postal_code TEXT,
  
  -- Additional Corporate Account Metadata
  company TEXT,
  tier TEXT DEFAULT 'Standard Corporate',
  total_spent TEXT DEFAULT 'S$ 0.00',
  total_shipments INT DEFAULT 0,
  status TEXT DEFAULT 'Active',
  tags TEXT[] DEFAULT ARRAY['Corporate'],
  credit_limit TEXT DEFAULT 'S$ 50,000',
  payment_terms TEXT DEFAULT 'Net 30 Days',
  password TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure missing columns exist on existing customers table
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS name TEXT DEFAULT 'Customer';
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'Standard Corporate';
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS total_spent TEXT DEFAULT 'S$ 0.00';
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS total_shipments INT DEFAULT 0;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ARRAY['Corporate'];
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS credit_limit TEXT DEFAULT 'S$ 50,000';
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS payment_terms TEXT DEFAULT 'Net 30 Days';
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- =======================================================================
-- TABLE 4: SHIPMENTS (Consignments & Live Telematics)
-- =======================================================================
CREATE TABLE IF NOT EXISTS public.shipments (
  id TEXT PRIMARY KEY,
  tracking_number TEXT,
  customer_id TEXT REFERENCES public.customers(id) ON DELETE SET NULL,
  driver_id TEXT REFERENCES public.drivers(id) ON DELETE SET NULL,
  pickup_address TEXT,
  pickup_postal_code TEXT DEFAULT '048616',
  delivery_address TEXT,
  delivery_postal_code TEXT DEFAULT '619114',
  package_description TEXT DEFAULT 'General Freight Cargo',
  weight TEXT DEFAULT '500 kg',
  dimensions TEXT DEFAULT '120x80x100 cm',
  scheduled_date TEXT DEFAULT 'Today',
  time_slot TEXT DEFAULT '09:00 AM - 05:00 PM',
  status TEXT DEFAULT 'ASSIGNED',

  -- UI Compatibility & Telematics Fields
  sender TEXT,
  sender_phone TEXT,
  sender_address TEXT,
  receiver TEXT,
  receiver_phone TEXT,
  receiver_address TEXT,
  origin TEXT,
  destination TEXT,
  current_location TEXT DEFAULT 'Singapore Central Freight Hub',
  status_type TEXT DEFAULT 'active',
  payment_status TEXT DEFAULT 'Paid',
  service_level TEXT DEFAULT 'Express Road Freight',
  cargo_type TEXT DEFAULT 'General Freight',
  pieces INT DEFAULT 1,
  declared_value TEXT DEFAULT 'S$ 10,000',
  price TEXT DEFAULT 'S$ 450.00',
  driver_name TEXT,
  driver_phone TEXT,
  vehicle TEXT,
  vehicle_plate TEXT,
  vehicle_type TEXT,
  estimated_delivery TEXT DEFAULT 'Today, 5:00 PM',
  last_updated_time TEXT DEFAULT 'Just now',
  delivery_otp TEXT,
  otp_verified BOOLEAN DEFAULT FALSE,
  otp_generated_at TEXT,
  coordinates JSONB DEFAULT '{"origin": [1.3400, 103.7100], "current": [1.3521, 103.8200], "destination": [1.4380, 103.7890]}'::jsonb,
  timeline JSONB DEFAULT '[]'::jsonb,
  weather_delay JSONB,
  pod JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure missing columns exist on existing shipments table
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS customer_id TEXT REFERENCES public.customers(id) ON DELETE SET NULL;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS driver_id TEXT REFERENCES public.drivers(id) ON DELETE SET NULL;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS pickup_address TEXT;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS pickup_postal_code TEXT DEFAULT '048616';
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS delivery_address TEXT;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS delivery_postal_code TEXT DEFAULT '619114';
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS package_description TEXT DEFAULT 'General Freight Cargo';
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS weight TEXT DEFAULT '500 kg';
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS dimensions TEXT DEFAULT '120x80x100 cm';
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS scheduled_date TEXT DEFAULT 'Today';
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS time_slot TEXT DEFAULT '09:00 AM - 05:00 PM';
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ASSIGNED';
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS sender TEXT;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS sender_phone TEXT;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS sender_address TEXT;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS receiver TEXT;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS receiver_phone TEXT;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS receiver_address TEXT;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS origin TEXT;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS destination TEXT;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS current_location TEXT DEFAULT 'Singapore Central Freight Hub';
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS status_type TEXT DEFAULT 'active';
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'Paid';
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS service_level TEXT DEFAULT 'Express Road Freight';
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS cargo_type TEXT DEFAULT 'General Freight';
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS pieces INT DEFAULT 1;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS declared_value TEXT DEFAULT 'S$ 10,000';
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS price TEXT DEFAULT 'S$ 450.00';
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS driver_name TEXT;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS driver_phone TEXT;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS vehicle TEXT;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS vehicle_plate TEXT;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS vehicle_type TEXT;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS estimated_delivery TEXT DEFAULT 'Today, 5:00 PM';
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS last_updated_time TEXT DEFAULT 'Just now';
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS delivery_otp TEXT;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS otp_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS otp_generated_at TEXT;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS coordinates JSONB DEFAULT '{"origin": [1.3400, 103.7100], "current": [1.3521, 103.8200], "destination": [1.4380, 103.7890]}'::jsonb;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS timeline JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS weather_delay JSONB;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS pod JSONB;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Remove legacy CHECK constraints on shipments.status if any exist to support standard status names
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_schema = 'public' 
          AND table_name = 'shipments' 
          AND constraint_type = 'CHECK'
    ) LOOP
        EXECUTE 'ALTER TABLE public.shipments DROP CONSTRAINT IF EXISTS ' || quote_ident(r.constraint_name);
    END LOOP;
END $$;

-- Sync tracking_number and fallback addresses if null
CREATE OR REPLACE FUNCTION sync_shipment_tracking_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tracking_number IS NULL THEN
    NEW.tracking_number := NEW.id;
  END IF;
  IF NEW.pickup_address IS NULL THEN
    NEW.pickup_address := COALESCE(NEW.sender_address, NEW.origin, 'Singapore Pickup Address');
  END IF;
  IF NEW.delivery_address IS NULL THEN
    NEW.delivery_address := COALESCE(NEW.receiver_address, NEW.destination, 'Singapore Delivery Address');
  END IF;
  IF NEW.sender IS NULL THEN
    NEW.sender := 'Josan Client';
  END IF;
  IF NEW.receiver IS NULL THEN
    NEW.receiver := 'Recipient';
  END IF;
  IF NEW.origin IS NULL THEN
    NEW.origin := NEW.pickup_address;
  END IF;
  IF NEW.destination IS NULL THEN
    NEW.destination := NEW.delivery_address;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sync_shipment_tracking_number ON public.shipments;
CREATE TRIGGER trigger_sync_shipment_tracking_number
BEFORE INSERT OR UPDATE ON public.shipments
FOR EACH ROW EXECUTE FUNCTION sync_shipment_tracking_number();

-- =======================================================================
-- TABLE 5: TRIP_STATUS_HISTORY (Consignment Timeline Audit Log)
-- =======================================================================
CREATE TABLE IF NOT EXISTS public.trip_status_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id TEXT REFERENCES public.shipments(id) ON DELETE CASCADE NOT NULL,
  driver_id TEXT REFERENCES public.drivers(id) ON DELETE SET NULL,
  status TEXT NOT NULL,
  latitude NUMERIC(10, 6),
  longitude NUMERIC(10, 6),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================================================================
-- TABLE 6: DRIVER_LOCATIONS (GPS Telemetry Stream)
-- =======================================================================
CREATE TABLE IF NOT EXISTS public.driver_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id TEXT REFERENCES public.drivers(id) ON DELETE CASCADE NOT NULL,
  latitude NUMERIC(10, 6) NOT NULL,
  longitude NUMERIC(10, 6) NOT NULL,
  accuracy NUMERIC(8, 2) DEFAULT 5.0,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to update driver current location upon telemetry ping
CREATE OR REPLACE FUNCTION update_driver_current_location()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.drivers
  SET current_latitude = NEW.latitude,
      current_longitude = NEW.longitude,
      last_location_at = NEW.recorded_at,
      coordinates = jsonb_build_array(NEW.latitude, NEW.longitude),
      updated_at = NOW()
  WHERE id = NEW.driver_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_driver_location ON public.driver_locations;
CREATE TRIGGER trigger_update_driver_location
AFTER INSERT ON public.driver_locations
FOR EACH ROW EXECUTE FUNCTION update_driver_current_location();

-- =======================================================================
-- TABLE 7: PROOF_OF_DELIVERY (Digital POD Certificates)
-- =======================================================================
CREATE TABLE IF NOT EXISTS public.proof_of_delivery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id TEXT REFERENCES public.shipments(id) ON DELETE CASCADE NOT NULL,
  driver_id TEXT REFERENCES public.drivers(id) ON DELETE SET NULL,
  receiver_name TEXT NOT NULL,
  signature_url TEXT,
  photo_url TEXT,
  notes TEXT,
  delivered_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to log shipment status change into trip_status_history
CREATE OR REPLACE FUNCTION log_shipment_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') OR (OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO public.trip_status_history (shipment_id, driver_id, status, latitude, longitude, notes)
    VALUES (
      NEW.id,
      NEW.driver_id,
      NEW.status,
      (NEW.coordinates->'current'->>0)::numeric,
      (NEW.coordinates->'current'->>1)::numeric,
      'Shipment status updated to ' || NEW.status
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_log_shipment_status ON public.shipments;
CREATE TRIGGER trigger_log_shipment_status
AFTER INSERT OR UPDATE ON public.shipments
FOR EACH ROW EXECUTE FUNCTION log_shipment_status_change();

-- =======================================================================
-- TABLE 8: NOTIFICATIONS (System & User Alerts)
-- =======================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT DEFAULT 'all',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'general',
  read BOOLEAN DEFAULT FALSE,
  role TEXT DEFAULT 'customer',
  shipment_id TEXT,
  quote_id TEXT,
  timestamp TEXT DEFAULT 'Just now',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================================================================
-- TABLE 9: WAREHOUSES & OTHER MODULES
-- =======================================================================
CREATE TABLE IF NOT EXISTS public.warehouses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  manager TEXT,
  phone TEXT,
  capacity TEXT DEFAULT '85,000 sq ft',
  capacity_percentage INT DEFAULT 75,
  status TEXT DEFAULT 'Operational',
  utilization TEXT DEFAULT '75%',
  active_parcels INT DEFAULT 1000,
  incoming_today INT DEFAULT 200,
  outgoing_today INT DEFAULT 180,
  bins JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.quotes (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  company TEXT,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  cargo_category TEXT DEFAULT 'General Freight',
  cargo_weight NUMERIC DEFAULT 500,
  freight_mode TEXT DEFAULT 'ftl',
  delivery_speed TEXT DEFAULT 'standard',
  notes TEXT,
  status TEXT DEFAULT 'Sent',
  valid_until TEXT DEFAULT 'Sep 07, 2026',
  line_items JSONB DEFAULT '{}'::jsonb,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.crm_leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  source TEXT DEFAULT 'Website Quote Form',
  stage TEXT DEFAULT 'New',
  estimated_value NUMERIC DEFAULT 10000,
  tags TEXT[] DEFAULT ARRAY['Singapore-Roadways'],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.crm_communications (
  id TEXT PRIMARY KEY,
  target_type TEXT DEFAULT 'lead',
  target_id TEXT NOT NULL,
  type TEXT DEFAULT 'call',
  staff_name TEXT DEFAULT 'Darren Josan',
  summary TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.crm_tasks (
  id TEXT PRIMARY KEY,
  target_type TEXT DEFAULT 'lead',
  target_id TEXT,
  title TEXT NOT NULL,
  due_date TEXT DEFAULT '2026-09-30',
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending',
  assigned_to TEXT DEFAULT 'Sales Specialist',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.invoices (
  id TEXT PRIMARY KEY,
  shipment_id TEXT REFERENCES public.shipments(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_company TEXT,
  amount TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  issue_date TEXT DEFAULT '2026-08-31',
  due_date TEXT DEFAULT '2026-09-30',
  items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.support_tickets (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'Open',
  priority TEXT DEFAULT 'Medium',
  replies JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.documents (
  id TEXT PRIMARY KEY,
  shipment_id TEXT REFERENCES public.shipments(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  document_type TEXT DEFAULT 'e-Waybill',
  file_url TEXT,
  uploaded_by TEXT DEFAULT 'Operations',
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =======================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proof_of_delivery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create Open Policies for Client Access
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Profiles Policy" ON public.profiles;
    DROP POLICY IF EXISTS "Drivers Policy" ON public.drivers;
    DROP POLICY IF EXISTS "Customers Policy" ON public.customers;
    DROP POLICY IF EXISTS "Shipments Policy" ON public.shipments;
    DROP POLICY IF EXISTS "Trip Status History Policy" ON public.trip_status_history;
    DROP POLICY IF EXISTS "Driver Locations Policy" ON public.driver_locations;
    DROP POLICY IF EXISTS "Proof of Delivery Policy" ON public.proof_of_delivery;
    DROP POLICY IF EXISTS "Notifications Policy" ON public.notifications;
    DROP POLICY IF EXISTS "Warehouses Policy" ON public.warehouses;
    DROP POLICY IF EXISTS "Quotes Policy" ON public.quotes;
    DROP POLICY IF EXISTS "CRM Leads Policy" ON public.crm_leads;
    DROP POLICY IF EXISTS "CRM Comms Policy" ON public.crm_communications;
    DROP POLICY IF EXISTS "CRM Tasks Policy" ON public.crm_tasks;
    DROP POLICY IF EXISTS "Invoices Policy" ON public.invoices;
    DROP POLICY IF EXISTS "Tickets Policy" ON public.support_tickets;
    DROP POLICY IF EXISTS "Documents Policy" ON public.documents;
END $$;

CREATE POLICY "Profiles Policy" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Drivers Policy" ON public.drivers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Customers Policy" ON public.customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Shipments Policy" ON public.shipments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Trip Status History Policy" ON public.trip_status_history FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Driver Locations Policy" ON public.driver_locations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Proof of Delivery Policy" ON public.proof_of_delivery FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Notifications Policy" ON public.notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Warehouses Policy" ON public.warehouses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Quotes Policy" ON public.quotes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "CRM Leads Policy" ON public.crm_leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "CRM Comms Policy" ON public.crm_communications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "CRM Tasks Policy" ON public.crm_tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Invoices Policy" ON public.invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Tickets Policy" ON public.support_tickets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Documents Policy" ON public.documents FOR ALL USING (true) WITH CHECK (true);

-- =======================================================================
-- SUPABASE REALTIME PUBLICATION
-- =======================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.shipments;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.drivers;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.driver_locations;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.trip_status_history;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.proof_of_delivery;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

-- =======================================================================
-- INITIAL SEED DATA
-- =======================================================================
INSERT INTO public.customers (id, name, company_name, email, phone, address, postal_code, tier)
VALUES 
  ('CUST-001', 'Razer Asia-Pacific HQ', 'Razer Asia-Pacific', 'shipping@razer.com', '+65 6789 0123', '1 Raffles Place, #20-01, Singapore', '048616', 'Tier 1 Corporate'),
  ('CUST-002', 'PSA Pasir Panjang Terminal', 'PSA Singapore', 'logistics@psa.sg', '+65 6273 8888', '33 Harbour Drive, Singapore', '117606', 'Enterprise Key Account')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.drivers (id, name, phone, email, license_number, vehicle_type, vehicle_id, vehicle_plate, status, deliveries_completed, on_time_rate, rating, safety_score, current_latitude, current_longitude)
VALUES 
  ('DRV-101', 'Tan Wei Ming', '+65 9123 4567', 'tan.weiming@josanlogistics.com', 'SG-CLASS4-9910', 'Josan EV Express Cargo Truck', 'SG-8819', 'SG-8819', 'On Delivery', 840, '99.6%', 4.9, '99/100', 1.3521, 103.8200),
  ('DRV-102', 'Muhammad Rizal', '+65 8234 5678', 'm.rizal@josanlogistics.com', 'SG-CLASS5-8810', 'Volvo Heavy Container Truck', 'SG-4402', 'SG-4402', 'On Delivery', 610, '98.9%', 4.8, '97/100', 1.3412, 103.7712),
  ('DRV-103', 'Gurpreet Singh', '+65 9876 5432', 'gurpreet.sg@josanlogistics.com', 'SG-CLASS4-7721', 'Refrigerated Cold-Chain Van', 'SG-6630', 'SG-6630', 'Available', 420, '99.8%', 5.0, '100/100', 1.3000, 103.8000)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.shipments (
  id, tracking_number, customer_id, driver_id, sender, sender_phone, sender_address, pickup_address, pickup_postal_code,
  receiver, receiver_phone, receiver_address, delivery_address, delivery_postal_code, origin, destination,
  current_location, status, status_type, payment_status, service_level, cargo_type, weight, pieces, declared_value,
  price, driver_name, driver_phone, vehicle, vehicle_plate, estimated_delivery
)
VALUES 
  (
    'JOS-88190-SG', 'JOS-88190-SG', 'CUST-001', 'DRV-101',
    'Razer Asia-Pacific HQ', '+65 6789 0123', '1 Raffles Place, #20-01, Singapore 048616', '1 Raffles Place, #20-01, Singapore', '048616',
    'Jurong Logistics Hub Gate 4', '+65 9123 4567', '10 Jurong Port Road, Singapore 619114', '10 Jurong Port Road, Singapore', '619114',
    'Jurong Central Highway Freight Hub', 'Woodlands Roadways Terminal',
    'PIE Expressway Telematics Gate', 'IN_TRANSIT', 'active', 'Paid', 'Express Road Freight (FTL)',
    'High-Tech Electronics & Components', '2,450 kg', 8, 'S$ 68,500', 'S$ 740.00', 'Tan Wei Ming', '+65 9123 4567',
    'Josan 14-Ton Highway Linehaul Truck #SG-8819', 'SG-8819', 'Today, 4:30 PM (SGT)'
  ),
  (
    'JOS-44021-SG', 'JOS-44021-SG', 'CUST-002', 'DRV-102',
    'PSA Pasir Panjang Terminal', '+65 6273 8888', '33 Harbour Drive, Singapore 117606', '33 Harbour Drive, Singapore', '117606',
    'Woodlands High-Tech Park', '+65 8234 5678', '21 Woodlands Loop, Singapore 738322', '21 Woodlands Loop, Singapore', '738322',
    'Pasir Panjang Terminal Berth 5', 'Woodlands Industrial Estate',
    'BKE Expressway Exit 7', 'ARRIVED_AT_DELIVERY', 'active', 'Unpaid', 'Land Trucking & Container Line',
    'Industrial Precision Components', '1,420 kg', 12, 'S$ 145,000', 'S$ 1,280.00', 'Muhammad Rizal', '+65 8234 5678',
    'Volvo Heavy Container Truck #SG-4402', 'SG-4402', 'Today, 5:15 PM (SGT)'
  )
ON CONFLICT (id) DO NOTHING;

-- Ensure unique constraint on customers email if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'customers_email_key'
    ) THEN
        ALTER TABLE public.customers ADD CONSTRAINT customers_email_key UNIQUE (email);
    END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- =======================================================================
-- AUTOMATIC NEW USER SYNC TRIGGER (auth.users -> profiles & customers)
-- Exception-safe database trigger for Supabase Auth signups
-- =======================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_name TEXT;
  user_role TEXT;
  user_company TEXT;
  user_phone TEXT;
BEGIN
  user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1));
  user_role := UPPER(COALESCE(NEW.raw_user_meta_data->>'role', 'CUSTOMER'));
  user_company := COALESCE(NEW.raw_user_meta_data->>'company', 'Global Client Corp');
  user_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '+65 6789 0123');

  -- 1. Insert/Update public.profiles safely
  BEGIN
    INSERT INTO public.profiles (id, user_id, name, email, phone, role, company, status)
    VALUES (NEW.id, NEW.id, user_name, NEW.email, user_phone, user_role, user_company, 'Active')
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      phone = EXCLUDED.phone,
      company = EXCLUDED.company,
      role = EXCLUDED.role;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Profiles sync error: %', SQLERRM;
  END;

  -- 2. Insert/Update public.customers safely if user role includes CUSTOMER
  IF user_role LIKE '%CUSTOMER%' THEN
    BEGIN
      INSERT INTO public.customers (id, name, company_name, email, phone, company, status, tier, password)
      VALUES (NEW.id::text, user_name, user_company, NEW.email, user_phone, user_company, 'Active', 'Standard Corporate', 'customer123')
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        company_name = EXCLUDED.company_name,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone,
        company = EXCLUDED.company,
        password = EXCLUDED.password;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Customers sync error: %', SQLERRM;
    END;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create database trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


