-- =======================================================================
-- JOSAN LOGISTICS PLATFORM - COMPLETE SUPABASE DATABASE MIGRATION SCRIPT
-- Copy and paste this script into your Supabase SQL Editor (https://app.supabase.com)
-- =======================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =======================================================================
-- TABLE 1: PROFILES (Extends Supabase Auth users)
-- =======================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  company TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'driver', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================================================================
-- TABLE 2: DRIVERS (Driver Fleet Telematics & Roster)
-- =======================================================================
CREATE TABLE IF NOT EXISTS public.drivers (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  photo TEXT,
  phone TEXT NOT NULL,
  email TEXT UNIQUE,
  password TEXT DEFAULT 'driver123',
  license_number TEXT,
  vehicle_type TEXT DEFAULT '14-Ton Box Truck',
  vehicle_id TEXT,
  vehicle_plate TEXT,
  status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'On Delivery', 'In Transit', 'Offline', 'On Break')),
  deliveries_completed INT DEFAULT 0,
  on_time_rate TEXT DEFAULT '99.5%',
  rating NUMERIC(3,2) DEFAULT 4.90,
  assigned_hub TEXT DEFAULT 'Changi Air Cargo Hub',
  safety_score TEXT DEFAULT '99/100',
  coordinates JSONB DEFAULT '[1.3521, 103.8200]'::jsonb,
  last_location TEXT DEFAULT 'Singapore Central Hub',
  speed_kph NUMERIC DEFAULT 0,
  battery_level INT DEFAULT 95,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================================================================
-- TABLE 3: SHIPMENTS (Consignments & Live GPS Tracking)
-- =======================================================================
CREATE TABLE IF NOT EXISTS public.shipments (
  id TEXT PRIMARY KEY,
  sender TEXT NOT NULL,
  sender_phone TEXT,
  sender_address TEXT NOT NULL,
  receiver TEXT NOT NULL,
  receiver_phone TEXT,
  receiver_address TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  current_location TEXT DEFAULT 'Jurong Central Highway Freight Hub',
  status TEXT DEFAULT 'Booking Confirmed',
  status_type TEXT DEFAULT 'active',
  payment_status TEXT DEFAULT 'Unpaid',
  service_level TEXT DEFAULT 'Express Road Freight',
  cargo_type TEXT DEFAULT 'General Freight',
  weight TEXT DEFAULT '500 kg',
  pieces INT DEFAULT 1,
  declared_value TEXT DEFAULT 'S$ 10,000',
  price TEXT DEFAULT 'S$ 450.00',
  driver_id TEXT REFERENCES public.drivers(id) ON DELETE SET NULL,
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

-- =======================================================================
-- TABLE 4: WAREHOUSES (Logistics Hubs & Bins)
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

-- =======================================================================
-- TABLE 5: QUOTES (Customer Freight Quotation Requests)
-- =======================================================================
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
  status TEXT DEFAULT 'Sent' CHECK (status IN ('Draft', 'Sent', 'Accepted', 'Rejected', 'Converted')),
  valid_until TEXT DEFAULT 'Sep 07, 2026',
  line_items JSONB DEFAULT '{}'::jsonb,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================================================================
-- TABLE 6: CUSTOMERS (Corporate Shippers Directory)
-- =======================================================================
CREATE TABLE IF NOT EXISTS public.customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  tier TEXT DEFAULT 'Standard Corporate',
  total_spent TEXT DEFAULT 'S$ 0.00',
  total_shipments INT DEFAULT 0,
  status TEXT DEFAULT 'Active',
  tags TEXT[] DEFAULT ARRAY['Corporate'],
  credit_limit TEXT DEFAULT 'S$ 50,000',
  payment_terms TEXT DEFAULT 'Net 30 Days',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================================================================
-- TABLE 7: CRM LEADS (Sales Pipeline & Qualification)
-- =======================================================================
CREATE TABLE IF NOT EXISTS public.crm_leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  source TEXT DEFAULT 'Website Quote Form',
  stage TEXT DEFAULT 'New' CHECK (stage IN ('New', 'Contacted', 'Quote Sent', 'Negotiating', 'Won', 'Lost')),
  estimated_value NUMERIC DEFAULT 10000,
  tags TEXT[] DEFAULT ARRAY['Singapore-Roadways'],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================================================================
-- TABLE 8: CRM COMMUNICATIONS (Logs & Notes)
-- =======================================================================
CREATE TABLE IF NOT EXISTS public.crm_communications (
  id TEXT PRIMARY KEY,
  target_type TEXT DEFAULT 'lead',
  target_id TEXT NOT NULL,
  type TEXT DEFAULT 'call',
  staff_name TEXT DEFAULT 'Darren Josan',
  summary TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================================================================
-- TABLE 9: CRM TASKS (Action Items & Follow-ups)
-- =======================================================================
CREATE TABLE IF NOT EXISTS public.crm_tasks (
  id TEXT PRIMARY KEY,
  target_type TEXT DEFAULT 'lead',
  target_id TEXT,
  title TEXT NOT NULL,
  due_date TEXT DEFAULT '2026-09-30',
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'done')),
  assigned_to TEXT DEFAULT 'Sales Specialist',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================================================================
-- TABLE 10: INVOICES (Billing & Freight Charges)
-- =======================================================================
CREATE TABLE IF NOT EXISTS public.invoices (
  id TEXT PRIMARY KEY,
  shipment_id TEXT REFERENCES public.shipments(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_company TEXT,
  amount TEXT NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Paid', 'Pending', 'Overdue')),
  issue_date TEXT DEFAULT '2026-08-31',
  due_date TEXT DEFAULT '2026-09-30',
  items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================================================================
-- TABLE 11: SUPPORT TICKETS (Customer App Support Inbox)
-- =======================================================================
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed')),
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
  replies JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================================================================
-- TABLE 12: CUSTOMS CLEARANCE REQUESTS (Permits & Trade Compliance)
-- =======================================================================
CREATE TABLE IF NOT EXISTS public.customs_clearance_requests (
  id TEXT PRIMARY KEY,
  importer_exporter TEXT NOT NULL,
  country TEXT DEFAULT 'Singapore',
  declaration_type TEXT DEFAULT 'Import Declaration',
  hs_code TEXT,
  permit_number TEXT,
  status TEXT DEFAULT 'Under Review' CHECK (status IN ('Under Review', 'Approved', 'Inspection Required', 'Cleared')),
  duty_amount TEXT DEFAULT 'S$ 0.00',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================================================================
-- TABLE 13: NOTIFICATIONS (System & In-App Alerts)
-- =======================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  role TEXT DEFAULT 'customer',
  user_id TEXT DEFAULT 'all',
  type TEXT DEFAULT 'general',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  shipment_id TEXT,
  quote_id TEXT,
  timestamp TEXT DEFAULT 'Just now',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================================================================
-- TABLE 14: DOCUMENTS (Shipment Waybills, PODs, Invoices)
-- =======================================================================
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
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customs_clearance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Allow Client App Data Access
CREATE POLICY "Allow All Profiles" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Allow All Drivers" ON public.drivers FOR ALL USING (true);
CREATE POLICY "Allow All Shipments" ON public.shipments FOR ALL USING (true);
CREATE POLICY "Allow All Warehouses" ON public.warehouses FOR ALL USING (true);
CREATE POLICY "Allow All Quotes" ON public.quotes FOR ALL USING (true);
CREATE POLICY "Allow All Customers" ON public.customers FOR ALL USING (true);
CREATE POLICY "Allow All CRM Leads" ON public.crm_leads FOR ALL USING (true);
CREATE POLICY "Allow All CRM Comms" ON public.crm_communications FOR ALL USING (true);
CREATE POLICY "Allow All CRM Tasks" ON public.crm_tasks FOR ALL USING (true);
CREATE POLICY "Allow All Invoices" ON public.invoices FOR ALL USING (true);
CREATE POLICY "Allow All Tickets" ON public.support_tickets FOR ALL USING (true);
CREATE POLICY "Allow All Customs" ON public.customs_clearance_requests FOR ALL USING (true);
CREATE POLICY "Allow All Notifications" ON public.notifications FOR ALL USING (true);
CREATE POLICY "Allow All Documents" ON public.documents FOR ALL USING (true);

-- =======================================================================
-- SUPABASE REALTIME MULTI-APP SYNC PUBLICATION
-- =======================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.shipments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.drivers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quotes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.crm_leads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- =======================================================================
-- INITIAL SEED DATA
-- =======================================================================
INSERT INTO public.drivers (id, name, photo, phone, email, license_number, vehicle_type, vehicle_id, vehicle_plate, status, deliveries_completed, on_time_rate, rating, safety_score)
VALUES 
  ('DRV-101', 'Tan Wei Ming', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80', '+65 9123 4567', 'tan.weiming@josanlogistics.com', 'SG-CLASS4-9910', 'Josan EV Express Cargo Truck', 'SG-8819', 'SG-8819', 'On Delivery', 840, '99.6%', 4.9, '99/100'),
  ('DRV-102', 'Muhammad Rizal', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', '+65 8234 5678', 'm.rizal@josanlogistics.com', 'SG-CLASS5-8810', 'Volvo Heavy Container Truck', 'SG-4402', 'SG-4402', 'On Delivery', 610, '98.9%', 4.8, '97/100'),
  ('DRV-103', 'Gurpreet Singh', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', '+65 9876 5432', 'gurpreet.sg@josanlogistics.com', 'SG-CLASS4-7721', 'Refrigerated Cold-Chain Van', 'SG-6630', 'SG-6630', 'Available', 420, '99.8%', 5.0, '100/100')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.shipments (id, sender, sender_phone, sender_address, receiver, receiver_phone, receiver_address, origin, destination, current_location, status, status_type, payment_status, service_level, cargo_type, weight, pieces, declared_value, price, driver_id, driver_name, driver_phone, vehicle, vehicle_plate, estimated_delivery)
VALUES 
  ('JOS-88190-SG', 'Razer Asia-Pacific HQ', '+65 6789 0123', '1 Raffles Place, #20-01, Singapore 048616', 'Jurong Logistics Hub Gate 4', '+65 9123 4567', '10 Jurong Port Road, Singapore 619114', 'Jurong Central Highway Freight Hub', 'Woodlands Roadways Terminal', 'PIE Expressway Telematics Gate', 'In Transit', 'active', 'Paid', 'Express Road Freight (FTL)', 'High-Tech Electronics & Components', '2,450 kg', 8, 'S$ 68,500', 'S$ 740.00', 'DRV-101', 'Tan Wei Ming', '+65 9123 4567', 'Josan 14-Ton Highway Linehaul Truck #SG-8819', 'SG-8819', 'Today, 4:30 PM (SGT)'),
  ('JOS-44021-SG', 'PSA Pasir Panjang Terminal', '+65 6273 8888', '33 Harbour Drive, Singapore 117606', 'Woodlands High-Tech Park', '+65 8234 5678', '21 Woodlands Loop, Singapore 738322', 'Pasir Panjang Terminal Berth 5', 'Woodlands Industrial Estate', 'BKE Expressway Exit 7', 'Near Destination', 'active', 'Unpaid', 'Land Trucking & Container Line', 'Industrial Precision Components', '1,420 kg', 12, 'S$ 145,000', 'S$ 1,280.00', 'DRV-102', 'Muhammad Rizal', '+65 8234 5678', 'Volvo Heavy Container Truck #SG-4402', 'SG-4402', 'Today, 5:15 PM (SGT)')
ON CONFLICT (id) DO NOTHING;
