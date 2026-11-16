-- Migration 005: Dev-only test data for customer.test@example.com
-- Gated by is_test = true. NEVER run in production.
--
-- One-command deletion to completely purge all test data:
-- DELETE FROM public.shipments WHERE is_test = true;
-- DELETE FROM public.quote_requests WHERE is_test = true;

DO $$
BEGIN
  -- Only execute if running in development environment
  IF current_setting('app.environment', true) = 'production' THEN
    RAISE EXCEPTION 'Test data cannot be seeded in production!';
  END IF;

  -- 1. Insert dev test quotes for customer.test@example.com (is_test = true)
  INSERT INTO public.quote_requests (
    id,
    is_test,
    service_type,
    road_load_type,
    pickup_location,
    delivery_location,
    cargo_classification,
    cargo_description,
    gross_weight_kg,
    contact_name,
    contact_email,
    contact_phone,
    company_name,
    status,
    quoted_amount,
    created_at
  ) VALUES 
  (
    '00000000-0000-0000-0000-000000000101',
    true,
    'ROAD_TRANSPORT',
    'consolidated',
    '20 Orchard Road, Singapore 238864',
    'Pioneer Sector 1, Jurong, Singapore 628437',
    'General Cargo',
    'Commercial palletized dry goods',
    450.00,
    'Test Customer',
    'customer.test@example.com',
    '+65 6789 0123',
    'Acme Singapore Pte Ltd',
    'Quoted',
    280.00,
    NOW() - INTERVAL '1 day'
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    true,
    'AIR_FREIGHT_DOCS',
    NULL,
    'Changi Airport, Singapore',
    'London Heathrow (LHR)',
    'Documentation Support',
    'Air Waybill and shipping documentation preparation',
    NULL,
    'Test Customer',
    'customer.test@example.com',
    '+65 6789 0123',
    'Acme Singapore Pte Ltd',
    'Accepted',
    150.00,
    NOW() - INTERVAL '3 days'
  )
  ON CONFLICT (id) DO NOTHING;

  -- 2. Insert dev test shipments for customer.test@example.com (is_test = true)
  -- Shipment 1: TEST-0001 (Delivered, Paid)
  INSERT INTO public.shipments (
    id,
    tracking_number,
    is_test,
    service_type,
    pickup_address,
    delivery_address,
    cargo_description,
    weight_kg,
    freight_fee,
    status,
    created_at
  ) VALUES 
  (
    '00000000-0000-0000-0000-000000000201',
    'TEST-0001',
    true,
    'ROAD_TRANSPORT',
    '10 Jalan Besar, #15-02 Sim Lim Tower, Singapore 208787',
    'Changi Airport Cargo Complex, Singapore 819642',
    'Commercial road transport consignment',
    350.00,
    350.00,
    'Delivered',
    NOW() - INTERVAL '2 days'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Shipment 2: TEST-0002 (In Transit, Pending Payment)
  INSERT INTO public.shipments (
    id,
    tracking_number,
    is_test,
    service_type,
    pickup_address,
    delivery_address,
    cargo_description,
    weight_kg,
    freight_fee,
    status,
    created_at
  ) VALUES 
  (
    '00000000-0000-0000-0000-000000000202',
    'TEST-0002',
    true,
    'ROAD_TRANSPORT',
    '20 Orchard Road, Singapore 238864',
    'Pioneer Sector 1, Jurong, Singapore 628437',
    'Commercial palletized delivery',
    280.00,
    280.00,
    'In Transit',
    NOW() - INTERVAL '5 hours'
  )
  ON CONFLICT (id) DO NOTHING;

END $$;

