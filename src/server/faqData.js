/**
 * Josan Logistics Approved Knowledge Base Data Store
 * Structured FAQ repository containing all 210 approved company questions
 * across 11 operational categories.
 *
 * Supports persistent local storage with optional Supabase synchronization.
 */

import { supabase, isSupabaseConfigured } from '../services/supabase.js';

export const INITIAL_FAQS = [
  // =========================================================================
  // 1. BOOKING & SCHEDULING (1–25)
  // =========================================================================
  {
    id: 'faq_b1_book_shipment',
    category: 'Booking & Scheduling',
    mainQuestion: 'How can I book a shipment?',
    alternativeQuestions: ['How do I book transport?', 'How can I arrange a shipment with you?', 'I want to book a delivery'],
    keywords: ['book', 'shipment', 'procedure', 'schedule', 'arrange', 'delivery'],
    approvedAnswer: 'To book a shipment with Josan Logistics, please submit your cargo details on our [Request a Quote](/quote) page. Our operations team reviews your specifications, confirms vehicle availability with our partner carriers, and issues a formal quotation. For urgent inquiries, [Contact our team](/contact).',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 1
  },
  {
    id: 'faq_b2_send_goods',
    category: 'Booking & Scheduling',
    mainQuestion: 'How do I send goods with Josan Logistics?',
    alternativeQuestions: ['How to send goods?', 'How do I ship cargo with you?', 'Can I send products with Josan?'],
    keywords: ['send', 'goods', 'products', 'cargo', 'dispatch', 'freight'],
    approvedAnswer: 'You can send commercial goods by submitting your pickup address, delivery destination, cargo nature, weight, and dimensions on our [Request a Quote](/quote) page. We coordinate commercial road transportation and air freight documentation support across Singapore.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 2
  },
  {
    id: 'faq_b3_booking_procedure',
    category: 'Booking & Scheduling',
    mainQuestion: 'What is the booking procedure?',
    alternativeQuestions: ['What are the steps to book?', 'How does the booking process work?', 'Booking flow'],
    keywords: ['booking', 'procedure', 'steps', 'process', 'flow'],
    approvedAnswer: 'Our booking procedure has four simple steps: 1) Submit your cargo specifications via [Request a Quote](/quote). 2) Our operations team checks paperwork and issues a quotation. 3) Confirm your quote acceptance and pay via PayNow or bank transfer. 4) Transport coordination and documentation commence.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 3
  },
  {
    id: 'faq_b4_arrange_commercial_delivery',
    category: 'Booking & Scheduling',
    mainQuestion: 'How do I arrange a commercial delivery?',
    alternativeQuestions: ['Arrange B2B delivery', 'How to set up business delivery?', 'Commercial logistics booking'],
    keywords: ['arrange', 'commercial', 'delivery', 'b2b', 'business'],
    approvedAnswer: 'Commercial B2B deliveries can be arranged by providing your commercial invoice, delivery order (DO), pickup/drop-off dock details, and schedule via our [Request a Quote](/quote) form or by emailing contact@josanlogistics.com.sg.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 4
  },
  {
    id: 'faq_b5_transport_warehouse',
    category: 'Booking & Scheduling',
    mainQuestion: 'How can I transport products from my warehouse?',
    alternativeQuestions: ['Warehouse pickup booking', 'Can you pick up from my warehouse?', 'Transport goods from factory'],
    keywords: ['transport', 'products', 'warehouse', 'factory', 'pickup', 'dock'],
    approvedAnswer: 'We coordinate 14ft, 24ft, and prime mover vehicles to pick up palletized or boxed products directly from your warehouse loading bay or ground facility anywhere in Singapore. Submit your warehouse address on [Request a Quote](/quote).',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 5
  },
  {
    id: 'faq_b6_info_needed_book_truck',
    category: 'Booking & Scheduling',
    mainQuestion: 'What information do I need to book a truck?',
    alternativeQuestions: ['What details are required for booking a lorry?', 'Info needed for truck hire'],
    keywords: ['information', 'needed', 'book', 'truck', 'details', 'lorry', 'requirements'],
    approvedAnswer: 'To book a partner truck, we need: 1) Pickup and delivery postal codes and contact persons, 2) Cargo nature and dimensions, 3) Total weight and pallet count, 4) Loading dock conditions (e.g. tailgate required?), and 5) Target pickup date/time.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 6
  },
  {
    id: 'faq_b7_book_online',
    category: 'Booking & Scheduling',
    mainQuestion: 'Can I book a shipment online?',
    alternativeQuestions: ['Is online booking available?', 'Can I submit booking on the website?'],
    keywords: ['book', 'shipment', 'online', 'website', 'form'],
    approvedAnswer: 'Yes, you can submit your complete shipment inquiry and booking request online 24/7 using our [Request a Quote](/quote) form. Our team reviews all submissions during operating hours.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 7
  },
  {
    id: 'faq_b8_advance_booking_notice',
    category: 'Booking & Scheduling',
    mainQuestion: 'How far in advance should I book a lorry?',
    alternativeQuestions: ['Lead time for truck booking', 'When should I book transport?'],
    keywords: ['advance', 'book', 'lorry', 'truck', 'notice', 'lead time'],
    approvedAnswer: 'We recommend booking 24 to 48 hours in advance for standard commercial road transport to ensure optimal partner vehicle allocation and preferred dispatch time slots.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 8
  },
  {
    id: 'faq_b9_same_day_bookings',
    category: 'Booking & Scheduling',
    mainQuestion: 'Do you accept same-day bookings?',
    alternativeQuestions: ['Can I book for today?', 'Is same day truck booking possible?'],
    keywords: ['same-day', 'today', 'urgent', 'booking', 'dispatch'],
    approvedAnswer: 'Same-day transport coordination is subject to partner carrier fleet availability. For urgent same-day requirements, please submit your request before 11:00 AM or call our hotline directly at +65 6789 0123.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 9
  },
  {
    id: 'faq_b10_urgent_express_pickup',
    category: 'Booking & Scheduling',
    mainQuestion: 'Can I schedule an urgent or express pickup?',
    alternativeQuestions: ['Express pickup service', 'Urgent transport request', 'Expedited collection'],
    keywords: ['schedule', 'urgent', 'express', 'pickup', 'expedited', 'rush'],
    approvedAnswer: 'Yes, urgent express pickups can be arranged when partner vehicles are in proximity. Please call our operations team directly at +65 6789 0123 for live dispatch confirmation.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 10
  },
  {
    id: 'faq_b11_confirm_booking_after_quote',
    category: 'Booking & Scheduling',
    mainQuestion: 'How do I confirm my booking after getting a quote?',
    alternativeQuestions: ['How to accept a quote?', 'Confirming my shipment booking'],
    keywords: ['confirm', 'booking', 'quote', 'accept', 'acceptance'],
    approvedAnswer: 'You can confirm your booking by replying to your formal quote email with your acceptance, or by making payment via PayNow / bank transfer referencing your quotation number.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 11
  },
  {
    id: 'faq_b12_booking_confirmation_email',
    category: 'Booking & Scheduling',
    mainQuestion: 'Will I receive a booking confirmation email?',
    alternativeQuestions: ['Do you send a confirmation email?', 'How do I know my booking is confirmed?'],
    keywords: ['receive', 'booking', 'confirmation', 'email', 'ack'],
    approvedAnswer: 'Yes, once details and payment or corporate account terms are validated, our operations team issues a formal confirmation email containing your tracking reference and dispatch details.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 12
  },
  {
    id: 'faq_b13_recurring_deliveries',
    category: 'Booking & Scheduling',
    mainQuestion: 'Can I book recurring weekly or monthly deliveries?',
    alternativeQuestions: ['Scheduled weekly deliveries', 'Contract recurring trucking', 'Regular distribution runs'],
    keywords: ['recurring', 'weekly', 'monthly', 'deliveries', 'scheduled', 'contract'],
    approvedAnswer: 'Yes, we regularly coordinate recurring scheduled transport schedules (daily, weekly, or monthly) for commercial clients. Discuss your schedule on our [Contact our team](/contact) page.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 13
  },
  {
    id: 'faq_b14_multi_stop_delivery',
    category: 'Booking & Scheduling',
    mainQuestion: 'Can I book a multi-stop delivery route?',
    alternativeQuestions: ['Multiple drop offs booking', 'Can truck stop at multiple locations?'],
    keywords: ['multi-stop', 'multiple', 'drop-offs', 'route', 'stops'],
    approvedAnswer: 'Yes, multi-drop commercial delivery runs across Singapore can be coordinated. Please list all pickup and delivery drop-off addresses when requesting your quotation.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 14
  },
  {
    id: 'faq_b15_reschedule_pickup',
    category: 'Booking & Scheduling',
    mainQuestion: 'How do I reschedule my pickup time?',
    alternativeQuestions: ['Change pickup time', 'Rescheduling booking', 'Move pickup date'],
    keywords: ['reschedule', 'pickup', 'time', 'date', 'change'],
    approvedAnswer: 'To reschedule, notify our operations team at contact@josanlogistics.com.sg or call +65 6789 0123 at least 4 hours before the scheduled pickup window with your booking reference.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 15
  },
  {
    id: 'faq_b16_cancel_booking',
    category: 'Booking & Scheduling',
    mainQuestion: 'How do I cancel a confirmed booking?',
    alternativeQuestions: ['Cancellation procedure', 'How to cancel transport?'],
    keywords: ['cancel', 'confirmed', 'booking', 'cancellation'],
    approvedAnswer: 'To cancel, email contact@josanlogistics.com.sg or call +65 6789 0123 immediately quoting your reference number. Early notification allows us to release the partner vehicle without penalties.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 16
  },
  {
    id: 'faq_b17_cancellation_fee',
    category: 'Booking & Scheduling',
    mainQuestion: 'Is there a cancellation fee if I cancel last minute?',
    alternativeQuestions: ['What is the cancellation charge?', 'Penalty for cancelling truck'],
    keywords: ['cancellation', 'fee', 'charge', 'penalty', 'last minute'],
    approvedAnswer: 'If cancellation occurs after a partner vehicle has already been dispatched to your facility, a vehicle-on-location fee may apply as per partner transport operator terms.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 17
  },
  {
    id: 'faq_b18_change_delivery_address',
    category: 'Booking & Scheduling',
    mainQuestion: 'Can I change the delivery address after booking?',
    alternativeQuestions: ['Update drop off address', 'Change destination after dispatch'],
    keywords: ['change', 'delivery', 'address', 'destination', 'reroute'],
    approvedAnswer: 'Yes, contact our operations desk promptly. If the vehicle is already en route, additional distance or re-routing charges may apply depending on the new delivery location.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 18
  },
  {
    id: 'faq_b19_saturday_pickup',
    category: 'Booking & Scheduling',
    mainQuestion: 'Can I book a pickup on a Saturday?',
    alternativeQuestions: ['Do you operate on Saturdays?', 'Weekend Saturday transport', 'Can I book a lorry for a Saturday?', 'Can I book a 14ft lorry for a Saturday?', 'Can I book a truck on Saturday?', 'Saturday pickup service'],
    keywords: ['saturday', 'weekend', 'pickup', 'operating'],
    approvedAnswer: 'Yes, Saturday commercial collections can be arranged with advance booking. Please confirm your booking by Friday afternoon (before 3:00 PM).',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 19
  },
  {
    id: 'faq_b20_sunday_holiday_pickups',
    category: 'Booking & Scheduling',
    mainQuestion: 'Do you arrange pickups on Sundays or public holidays?',
    alternativeQuestions: ['Sunday delivery service', 'Public holiday transport'],
    keywords: ['sundays', 'public holidays', 'holiday', 'weekend'],
    approvedAnswer: 'Pickups on Sundays and Singapore Gazetted Public Holidays are available strictly by special prior arrangement for contracted commercial shippers, subject to after-hours surcharges.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 20
  },
  {
    id: 'faq_b21_cutoff_time_sameday',
    category: 'Booking & Scheduling',
    mainQuestion: 'What is the cutoff time for same-day dispatch?',
    alternativeQuestions: ['Same day cutoff hour', 'Latest time to book for today'],
    keywords: ['cutoff', 'time', 'same-day', 'dispatch', 'deadline'],
    approvedAnswer: 'The cutoff time for same-day dispatch inquiries is 11:00 AM Singapore time. Requests submitted after 11:00 AM are scheduled for the next business day morning.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 21
  },
  {
    id: 'faq_b22_third_party_handover',
    category: 'Booking & Scheduling',
    mainQuestion: 'Can someone else hand over the cargo on my behalf?',
    alternativeQuestions: ['Can supplier release goods?', 'Third party handover'],
    keywords: ['someone else', 'hand over', 'behalf', 'representative', 'supplier'],
    approvedAnswer: 'Yes, an authorized warehouse supervisor, supplier, or site representative may release the cargo to the driver, provided they sign the consignment note.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 22
  },
  {
    id: 'faq_b23_presence_at_pickup',
    category: 'Booking & Scheduling',
    mainQuestion: 'Do I need to be present at the pickup location?',
    alternativeQuestions: ['Must I be there during collection?', 'Do I need to be on site?'],
    keywords: ['present', 'pickup', 'location', 'on site', 'supervise'],
    approvedAnswer: 'You do not personally need to be present, but an authorized representative must be on site to grant access, verify package counts, and sign the driver’s transport paperwork.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 23
  },
  {
    id: 'faq_b24_book_air_and_road_together',
    category: 'Booking & Scheduling',
    mainQuestion: 'Can I book both air freight and road transport together?',
    alternativeQuestions: ['Combined air and road booking', 'Pickup from factory to airport and air freight'],
    keywords: ['air freight', 'road transport', 'together', 'combined', 'changi'],
    approvedAnswer: 'Yes! We frequently coordinate factory/warehouse collection via road lorry and transport directly to Changi Airfreight Centre alongside complete Air Waybill (AWB) preparation.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 24
  },
  {
    id: 'faq_b25_response_time_booking',
    category: 'Booking & Scheduling',
    mainQuestion: 'How quickly will your team respond to my booking request?',
    alternativeQuestions: ['Response speed', 'When will you reply to my quote?'],
    keywords: ['quickly', 'respond', 'booking', 'response time', 'reply'],
    approvedAnswer: 'Our operations team responds to quote and booking requests within 2 to 4 business hours during operating hours (Monday to Friday, 9:00 AM to 6:00 PM).',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 25
  },

  // =========================================================================
  // 2. PRICING, QUOTES & BILLING (26–50)
  // =========================================================================
  {
    id: 'faq_p26_freight_cost',
    category: 'Pricing, Quotes & Billing',
    mainQuestion: 'How much does freight cost?',
    alternativeQuestions: ['How much for freight?', 'Pricing inquiry', 'What are typical freight costs?'],
    keywords: ['cost', 'freight', 'how much', 'pricing', 'charge'],
    approvedAnswer: 'Freight costs depend on cargo volume, gross weight, vehicle type (14ft, 24ft, prime mover), loading dock requirements, and route. Submit your cargo details on our [Request a Quote](/quote) page for a custom quote.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 26
  },
  {
    id: 'faq_p27_shipping_rates',
    category: 'Pricing, Quotes & Billing',
    mainQuestion: 'What are your shipping rates?',
    alternativeQuestions: ['Shipping rates', 'Transport rates in Singapore', 'What do you charge?'],
    keywords: ['shipping', 'rates', 'charges', 'prices', 'tariff'],
    approvedAnswer: 'Rates are priced per assignment based on equipment needs and carrier partner availability. We do not maintain standard flat rates. Request a free quote on our [Request a Quote](/quote) page.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 27
  },
  {
    id: 'faq_p28_fixed_price_list',
    category: 'Pricing, Quotes & Billing',
    mainQuestion: 'Do you have a fixed price list?',
    alternativeQuestions: ['Do you have a rate card?', 'Can I see your price list?'],
    keywords: ['fixed', 'price list', 'rate card', 'pricing list'],
    approvedAnswer: 'No, we do not publish fixed price lists or standard rate cards because commercial transport rates fluctuate with diesel fuel surcharges, cargo dimensions, and specific equipment requirements.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 28
  },
  {
    id: 'faq_p29_rate_per_kg',
    category: 'Pricing, Quotes & Billing',
    mainQuestion: 'What is your rate per kilogram?',
    alternativeQuestions: ['Cost per kg', 'Price per kilo', 'How much per kg for air freight?'],
    keywords: ['rate', 'per kilogram', 'per kg', 'kilo', 'weight charge'],
    approvedAnswer: 'We do not offer a flat online per-kilogram rate. For air cargo, chargeable weight is evaluated based on volume versus actual weight according to airline tariffs. Submit your specifications via [Request a Quote](/quote).',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 29
  },
  {
    id: 'faq_p30_request_quote',
    category: 'Pricing, Quotes & Billing',
    mainQuestion: 'How do I request a quote?',
    alternativeQuestions: ['Get a quote', 'How to ask for a quotation?'],
    keywords: ['request', 'quote', 'quotation', 'get a quote'],
    approvedAnswer: 'Simply visit our [Request a Quote](/quote) page and fill in your origin, destination, cargo nature, weight, and dimensions. Our operations team will calculate pricing and email you promptly.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 30
  },
  {
    id: 'faq_p31_quote_turnaround_time',
    category: 'Pricing, Quotes & Billing',
    mainQuestion: 'How long does it take to receive a quotation?',
    alternativeQuestions: ['When will I get my quote?', 'Quotation turnaround speed'],
    keywords: ['long', 'receive', 'quotation', 'turnaround', 'speed'],
    approvedAnswer: 'Standard commercial quotations are typically prepared and emailed within 2 to 4 business hours during operating hours.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 31
  },
  {
    id: 'faq_p32_quote_free_non_binding',
    category: 'Pricing, Quotes & Billing',
    mainQuestion: 'Is the quote free and non-binding?',
    alternativeQuestions: ['Are quotes free?', 'Do I have to pay for a quote?'],
    keywords: ['quote', 'free', 'non-binding', 'obligation'],
    approvedAnswer: 'Yes, requesting a quotation is 100% free with absolutely no payment obligation. You decide whether to proceed after reviewing our confirmed quote.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 32
  },
  {
    id: 'faq_p33_quote_validity_period',
    category: 'Pricing, Quotes & Billing',
    mainQuestion: 'How long is a quotation valid for?',
    alternativeQuestions: ['Quote expiry date', 'How long is rate valid?'],
    keywords: ['how long', 'quotation', 'valid', 'expiry', 'validity'],
    approvedAnswer: 'Standard quotations are typically valid for 7 to 14 days, as explicitly stated on your quotation document. Partner transport capacity and airline fuel indices can affect validity.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 33
  },
  {
    id: 'faq_p34_why_no_fixed_prices',
    category: 'Pricing, Quotes & Billing',
    mainQuestion: "Why don't you show fixed prices on your website?",
    alternativeQuestions: ['Why no public prices?', 'Why are rates not listed online?'],
    keywords: ['why', 'fixed prices', 'website', 'online rates'],
    approvedAnswer: 'Commercial freight pricing varies depending on cargo volume, heavy lifting tailgates, security zone permits (e.g. Jurong Island), and schedule constraints. Individual quotations ensure you never overpay for unused vehicle capacity.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 34
  },
  {
    id: 'faq_p35_factors_affecting_quote',
    category: 'Pricing, Quotes & Billing',
    mainQuestion: 'What factors affect my freight quote?',
    alternativeQuestions: ['What determines freight cost?', 'Price calculation variables'],
    keywords: ['factors', 'affect', 'freight quote', 'cost determinants'],
    approvedAnswer: 'Key factors include: 1) Cargo weight and cubic volume, 2) Vehicle class required (14ft, 24ft, prime mover), 3) Tailgate or manual labor requirements, 4) Pickup/drop-off zone surcharges (PSA, ALPS, Jurong Island), and 5) Schedule timing.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 35
  },
  {
    id: 'faq_p36_tailgate_charges',
    category: 'Pricing, Quotes & Billing',
    mainQuestion: 'Are there extra charges for tailgate use?',
    alternativeQuestions: ['Is there a fee for tailgate truck?', 'Tailgate surcharge'],
    keywords: ['extra charges', 'tailgate', 'hydraulic', 'surcharge'],
    approvedAnswer: 'If your loading or unloading facility lacks a raised dock and requires a hydraulic tailgate lorry, a modest equipment surcharge is included in your confirmed quotation.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 36
  },
  {
    id: 'faq_p37_driver_waiting_time_charge',
    category: 'Pricing, Quotes & Billing',
    mainQuestion: 'Do you charge for driver waiting time?',
    alternativeQuestions: ['Is waiting time chargeable?', 'Driver delay charge'],
    keywords: ['driver', 'waiting time', 'demurrage', 'delay fee'],
    approvedAnswer: 'Complimentary grace loading time is included. If warehouse loading or unloading is delayed beyond the agreed grace period, standard partner driver waiting fees apply at hourly increments.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 37
  },
  {
    id: 'faq_p38_free_waiting_time',
    category: 'Pricing, Quotes & Billing',
    mainQuestion: 'How much free waiting time is included for loading and unloading?',
    alternativeQuestions: ['Grace period for loading', 'Free waiting time per stop'],
    keywords: ['free waiting time', 'grace period', 'loading', 'unloading'],
    approvedAnswer: 'Standard bookings include 30 to 45 minutes of complimentary loading/unloading time per location, depending on the vehicle class booked.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 38
  },
  {
    id: 'faq_p39_erp_and_parking_fees',
    category: 'Pricing, Quotes & Billing',
    mainQuestion: 'Are ERP and parking fees included in the quote?',
    alternativeQuestions: ['Does quote include ERP?', 'Who pays loading bay parking?'],
    keywords: ['erp', 'parking fees', 'tolls', 'loading bay'],
    approvedAnswer: 'Electronic Road Pricing (ERP) tolls are usually factored into your quotation. Commercial loading bay entry or parking fees levied by private building management are billed at cost if incurred.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 39
  },
  {
    id: 'faq_p40_after_hours_weekend_surcharges',
    category: 'Pricing, Quotes & Billing',
    mainQuestion: 'Are there surcharges for after-hours or weekend deliveries?',
    alternativeQuestions: ['Night delivery surcharge', 'Sunday transport fee'],
    keywords: ['surcharges', 'after-hours', 'weekend', 'night fee'],
    approvedAnswer: 'Yes, dispatches requested outside standard business hours (after 6:00 PM), on Saturday afternoons, or on Sundays carry partner carrier after-hours surcharges, stated clearly in your quote.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 40
  },
  {
    id: 'faq_p41_restricted_zone_fees',
    category: 'Pricing, Quotes & Billing',
    mainQuestion: 'Are there extra fees for Jurong Island, PSA, or airport pickups?',
    alternativeQuestions: ['Jurong Island surcharge', 'PSA port entry fee', 'Changi cargo zone fee'],
    keywords: ['jurong island', 'psa', 'airport', 'restricted zone', 'fees'],
    approvedAnswer: 'Yes, restricted industrial and security zones (Jurong Island checkpoints, PSA container terminals, and ALPS Airport Logistics Park) incur standard security clearance and access pass surcharges.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 41
  },
  {
    id: 'faq_p42_payment_methods',
    category: 'Pricing, Quotes & Billing',
    mainQuestion: 'What payment methods do you accept?',
    alternativeQuestions: ['How can I pay?', 'Accepted payment types'],
    keywords: ['payment methods', 'pay', 'paynow', 'bank transfer'],
    approvedAnswer: 'We accept PayNow (Corporate UEN), FAST interbank transfer, direct bank wire, and approved corporate 30-day credit accounts.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 42
  },
  {
    id: 'faq_p43_paynow_bank_transfer',
    category: 'Pricing, Quotes & Billing',
    mainQuestion: 'Can I pay via PayNow or bank transfer?',
    alternativeQuestions: ['Do you take PayNow?', 'Can I transfer funds to bank?'],
    keywords: ['paynow', 'bank transfer', 'uen'],
    approvedAnswer: 'Yes, PayNow and FAST bank transfer are our primary payment channels. Our UEN and bank details are stated directly on your confirmed quotation and invoice.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 43
  },
  {
    id: 'faq_p44_cheque_credit_card',
    category: 'Pricing, Quotes & Billing',
    mainQuestion: 'Do you accept corporate cheques or credit cards?',
    alternativeQuestions: ['Can I pay by cheque?', 'Do you take credit cards?'],
    keywords: ['corporate cheques', 'credit cards', 'cheque'],
    approvedAnswer: 'Electronic bank transfer and PayNow are our preferred methods. Corporate cheques are accepted from pre-approved corporate account clients. We do not accept consumer credit cards directly online.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 44
  },
  {
    id: 'faq_p45_upfront_payment_requirement',
    category: 'Pricing, Quotes & Billing',
    mainQuestion: 'Do I need to pay upfront before pickup?',
    alternativeQuestions: ['Must I pay in advance?', 'When is payment due?'],
    keywords: ['pay upfront', 'advance payment', 'deposit'],
    approvedAnswer: 'First-time commercial customers pay prior to dispatch or upon quotation confirmation. Registered corporate accounts can apply for 30-day credit billing terms.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 45
  },
  {
    id: 'faq_p46_credit_terms',
    category: 'Pricing, Quotes & Billing',
    mainQuestion: 'Do you offer 30-day credit terms for corporate accounts?',
    alternativeQuestions: ['Can we get 30 days credit?', 'Corporate billing terms'],
    keywords: ['30-day', 'credit terms', 'corporate accounts', 'invoice billing'],
    approvedAnswer: 'Yes, 30-day net credit terms are available for ACRA-registered Singapore companies, subject to credit evaluation and regular shipping volume.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 46
  },
  {
    id: 'faq_p47_tax_invoice_receipt',
    category: 'Pricing, Quotes & Billing',
    mainQuestion: 'Will you issue a tax invoice / official receipt?',
    alternativeQuestions: ['Do I get a tax invoice?', 'Can you provide official receipt?'],
    keywords: ['tax invoice', 'official receipt', 'receipt', 'invoice'],
    approvedAnswer: 'Yes, official tax invoices and formal payment receipts complying with Singapore ACRA and IRAS standards are issued for all completed jobs.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 47
  },
  {
    id: 'faq_p48_gst_inclusive',
    category: 'Pricing, Quotes & Billing',
    mainQuestion: 'Are your quoted prices inclusive of GST?',
    alternativeQuestions: ['Does quote include GST?', 'Is GST added on top?'],
    keywords: ['gst', 'inclusive', 'tax', 'exclusive'],
    approvedAnswer: 'Quotations clearly itemize the freight subtotal and the prevailing Singapore Goods and Services Tax (GST) breakdown for transparent accounting.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 48
  },
  {
    id: 'faq_p49_volume_discounts',
    category: 'Pricing, Quotes & Billing',
    mainQuestion: 'Do you offer volume discounts for frequent shipments?',
    alternativeQuestions: ['Bulk shipment discount', 'Discounts for regular customers'],
    keywords: ['volume discounts', 'discount', 'frequent shipments', 'regular'],
    approvedAnswer: 'Yes, clients with regular recurring weekly dispatches or high monthly container volume qualify for preferential contracted pricing tiers.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 49
  },
  {
    id: 'faq_p50_invoice_differ_from_estimate',
    category: 'Pricing, Quotes & Billing',
    mainQuestion: 'Why did my final invoice differ from the initial estimate?',
    alternativeQuestions: ['Why is final bill different?', 'Discrepancy between quote and invoice'],
    keywords: ['invoice differ', 'estimate', 'discrepancy', 'extra charges'],
    approvedAnswer: 'Final invoices differ from estimates only if actual cargo weight/dimensions exceeded initial declarations, unexpected loading waiting time was incurred, or additional drop-off stops were added.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 50
  },

  // =========================================================================
  // 3. ROAD TRANSPORT, FLEET & VEHICLES (51–75)
  // =========================================================================
  {
    id: 'faq_r51_own_trucks',
    category: 'Road Transport, Fleet & Vehicles',
    mainQuestion: 'Do you own your own trucks?',
    alternativeQuestions: ['Does Josan own vehicles?', 'Are the trucks yours?'],
    keywords: ['own', 'trucks', 'fleet', 'vehicles', 'coordinator'],
    approvedAnswer: 'Josan Logistics is a freight coordinator based in Singapore. We coordinate commercial road transport through our established network of vetted independent partner transport operators across Singapore. We do not own trucks.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 51
  },
  {
    id: 'faq_r52_vehicle_types',
    category: 'Road Transport, Fleet & Vehicles',
    mainQuestion: 'What types of vehicles do you coordinate?',
    alternativeQuestions: [
      'What trucks can I book?',
      'Fleet options available',
      'Road transport details',
      'Road transportation details',
      'Commercial road transportation',
      'Road freight details',
      'Trucking services available'
    ],
    keywords: [
      'types of vehicles',
      'fleet',
      'box trucks',
      'lorries',
      'prime movers',
      'road transport',
      'road transportation',
      'road freight',
      'trucking services',
      'road details'
    ],
    approvedAnswer: 'We coordinate 14ft covered box trucks (with hydraulic tailgates), 24ft heavy lorries (box, open-sided, curtain-side), flatbed trailers, and prime movers for container haulage across Singapore and cross-border road trucking to Malaysia. For full details on fleet capacity and services, visit our [Road Transportation](/road-freight) page or [Request a Quote](/quote).',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 52
  },
  {
    id: 'faq_r53_14ft_box_trucks',
    category: 'Road Transport, Fleet & Vehicles',
    mainQuestion: 'Do you have 14ft box trucks available?',
    alternativeQuestions: [
      'Can I hire a 14ft truck?',
      '14ft lorry availability',
      'Do you have 14ft truck',
      '14ft truck available',
      'Can I book a 14ft truck',
      '14ft truck'
    ],
    keywords: ['14ft', 'box trucks', 'lorry', 'available', '14ft truck', '14ft trucks', 'hire 14ft truck'],
    approvedAnswer: 'Yes, 14ft covered box trucks are widely available daily across Singapore for commercial cargo and palletized consignments.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 53
  },
  {
    id: 'faq_r54_14ft_trucks_tailgate',
    category: 'Road Transport, Fleet & Vehicles',
    mainQuestion: 'Do your 14ft trucks have hydraulic tailgates?',
    alternativeQuestions: ['Can I get a tailgate on a 14ft truck?', '14ft with hydraulic lift', 'Do your trucks have tailgates?', 'Do you have tailgate trucks?'],
    keywords: ['hydraulic tailgates', 'tailgate', 'lift', '14ft'],
    approvedAnswer: 'Yes, partner 14ft trucks equipped with hydraulic tailgates can be specified for locations without a loading dock. Please mention this when requesting your quote.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 54
  },
  {
    id: 'faq_r55_24ft_heavy_lorry',
    category: 'Road Transport, Fleet & Vehicles',
    mainQuestion: 'Can I book a 24ft heavy lorry?',
    alternativeQuestions: ['Hire 24ft lorry', '24ft truck booking'],
    keywords: ['24ft', 'heavy lorry', 'heavy truck', 'book'],
    approvedAnswer: 'Yes, 24ft heavy lorries with payloads up to 10 tonnes are coordinated for larger commercial shipments, industrial hardware, and multi-pallet loads.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 55
  },
  {
    id: 'faq_r56_prime_movers_containers',
    category: 'Road Transport, Fleet & Vehicles',
    mainQuestion: 'Do you coordinate prime movers for containers?',
    alternativeQuestions: ['Container trucking', 'Prime mover hire', 'Container drayage'],
    keywords: ['prime movers', 'containers', 'drayage', 'chassis', 'trailer'],
    approvedAnswer: 'Yes, we coordinate prime movers and skeletal trailer chassis for transporting laden or empty shipping containers between ports, yards, and customer warehouses.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 56
  },
  {
    id: 'faq_r57_20ft_40ft_containers',
    category: 'Road Transport, Fleet & Vehicles',
    mainQuestion: 'Can you transport 20ft or 40ft containers?',
    alternativeQuestions: ['20ft container transport', '40ft container haulage'],
    keywords: ['20ft', '40ft', 'containers', 'haulage'],
    approvedAnswer: 'Yes, both 20ft and 40ft (standard and high-cube) shipping containers are coordinated via PSA-licensed port trucking partner operators.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 57
  },
  {
    id: 'faq_r58_open_top_crane_lorries',
    category: 'Road Transport, Fleet & Vehicles',
    mainQuestion: 'Do you offer open-top lorries or lorry cranes?',
    alternativeQuestions: ['Hiab crane lorry', 'Open top truck for machinery'],
    keywords: ['open-top', 'lorry cranes', 'hiab', 'crane lorry'],
    approvedAnswer: 'Yes, open-top lorries and lorry crane (hiab) vehicles can be coordinated for overhead crane loading of heavy machinery or construction equipment.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 58
  },
  {
    id: 'faq_r59_refrigerated_chiller_trucks',
    category: 'Road Transport, Fleet & Vehicles',
    mainQuestion: 'Do you provide chiller or refrigerated trucks?',
    alternativeQuestions: ['Reefer trucks', 'Cold transport', 'Chiller van'],
    keywords: ['chiller', 'refrigerated', 'reefer', 'cold chain'],
    approvedAnswer: 'We do not transport fresh or frozen food. However, temperature-controlled GDP-certified reefer vans can be coordinated for approved commercial/pharmaceutical cargo with prior written arrangement.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 59
  },
  {
    id: 'faq_r60_payload_14ft_truck',
    category: 'Road Transport, Fleet & Vehicles',
    mainQuestion: 'What is the maximum payload of a 14ft truck?',
    alternativeQuestions: ['How much weight can a 14ft lorry carry?', '14ft payload capacity'],
    keywords: ['maximum payload', '14ft truck', 'weight capacity', 'limit'],
    approvedAnswer: 'The maximum payload capacity of a standard 14ft commercial box truck is approximately 2.0 to 2.5 tonnes (subject to specific vehicle model and tailgate weight).',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 60
  },
  {
    id: 'faq_r61_payload_24ft_lorry',
    category: 'Road Transport, Fleet & Vehicles',
    mainQuestion: 'What is the maximum weight capacity of a 24ft lorry?',
    alternativeQuestions: ['24ft lorry weight limit', 'How heavy can a 24ft truck carry?'],
    keywords: ['maximum weight capacity', '24ft lorry', 'tonnes limit'],
    approvedAnswer: 'A standard 24ft heavy lorry typically accommodates a maximum payload capacity between 8.0 and 10.0 tonnes.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 61
  },
  {
    id: 'faq_r62_pallet_capacity_14ft',
    category: 'Road Transport, Fleet & Vehicles',
    mainQuestion: 'How many standard pallets fit in a 14ft box truck?',
    alternativeQuestions: ['14ft pallet count', 'How many pallets in 14ft?'],
    keywords: ['standard pallets', '14ft box truck', 'pallet capacity'],
    approvedAnswer: 'A standard 14ft box truck can comfortably fit 4 to 6 standard industrial pallets (1.2m x 1.0m) on the floor, assuming single-tier non-stacked loading.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 62
  },
  {
    id: 'faq_r63_pallet_capacity_24ft',
    category: 'Road Transport, Fleet & Vehicles',
    mainQuestion: 'How many pallets fit in a 24ft lorry?',
    alternativeQuestions: ['24ft pallet count', 'How many pallets in 24ft truck?'],
    keywords: ['pallets fit', '24ft lorry', 'pallet count'],
    approvedAnswer: 'A standard 24ft heavy lorry can comfortably fit 10 to 12 standard industrial pallets on the floor.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 63
  },
  {
    id: 'faq_r64_ftl_services',
    category: 'Road Transport, Fleet & Vehicles',
    mainQuestion: 'Do you offer Full Truck Load (FTL) services?',
    alternativeQuestions: ['Dedicated truck hire', 'Full load transport'],
    keywords: ['full truck load', 'ftl', 'dedicated vehicle'],
    approvedAnswer: 'Yes, the majority of our commercial road bookings are Full Truck Load (FTL), giving you a dedicated point-to-point vehicle exclusively for your consignment.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 64
  },
  {
    id: 'faq_r65_ptl_services',
    category: 'Road Transport, Fleet & Vehicles',
    mainQuestion: 'Do you offer Part Truck Load (PTL) or shared truck space?',
    alternativeQuestions: ['Shared truck space', 'Part load transport', 'Less than truckload'],
    keywords: ['part truck load', 'ptl', 'shared space', 'ltl'],
    approvedAnswer: 'Part truck load arrangements can be coordinated when route schedules align, though dedicated point-to-point FTL dispatch is our primary standard service.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 65
  },
  {
    id: 'faq_r66_residential_pickups',
    category: 'Road Transport, Fleet & Vehicles',
    mainQuestion: 'Can you pick up from a residential HDB or condo address?',
    alternativeQuestions: ['Pick up from home', 'Residential address pickup'],
    keywords: ['residential', 'hdb', 'condo', 'home pickup'],
    approvedAnswer: 'Josan Logistics specializes in B2B commercial cargo. Pickups from commercial buildings and industrial estates are standard; residential address collections require prior operational verification.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 66
  },
  {
    id: 'faq_r67_deliver_shopping_malls',
    category: 'Road Transport, Fleet & Vehicles',
    mainQuestion: 'Do you deliver to shopping malls or commercial buildings?',
    alternativeQuestions: ['Mall loading bay delivery', 'Deliver to office tower'],
    keywords: ['deliver', 'shopping malls', 'commercial buildings', 'loading bay'],
    approvedAnswer: 'Yes, our partner drivers routinely deliver to shopping mall loading bays, CBD office towers, and commercial complexes, observing building height and security limits.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 67
  },
  {
    id: 'faq_r68_industrial_zones_coverage',
    category: 'Road Transport, Fleet & Vehicles',
    mainQuestion: 'Do you deliver to Tuas, Jurong, or Changi industrial zones?',
    alternativeQuestions: ['Tuas delivery', 'Jurong Industrial coverage', 'Changi cargo deliveries'],
    keywords: ['tuas', 'jurong', 'changi', 'industrial zones', 'coverage'],
    approvedAnswer: 'Yes, Tuas, Jurong Industrial Estate, Pioneer, Changi North/South, Woodlands, and Tampines are our core daily commercial transit corridors.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 68
  },
  {
    id: 'faq_r69_driver_loading_help',
    category: 'Road Transport, Fleet & Vehicles',
    mainQuestion: 'Does the driver help with loading and unloading?',
    alternativeQuestions: ['Will driver carry goods?', 'Does driver unload truck?'],
    keywords: ['driver help', 'loading', 'unloading', 'manpower'],
    approvedAnswer: 'Partner drivers operate the hydraulic tailgate and supervise pallet stowage inside the truck. Moving cargo inside your warehouse or facility is the shipper/consignee’s responsibility unless extra labor is booked.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 69
  },
  {
    id: 'faq_r70_extra_manpower',
    category: 'Road Transport, Fleet & Vehicles',
    mainQuestion: 'Can I request extra manpower for heavy lifting?',
    alternativeQuestions: ['Book additional helper', 'Need extra loaders'],
    keywords: ['extra manpower', 'heavy lifting', 'helpers', 'loaders'],
    approvedAnswer: 'Yes, delivery assistants (laborers) can be requested when booking your shipment for an additional manpower fee per helper.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 70
  },
  {
    id: 'faq_r71_pallet_jacks_on_truck',
    category: 'Road Transport, Fleet & Vehicles',
    mainQuestion: 'Do your partner trucks carry pallet jacks or trolleys?',
    alternativeQuestions: ['Does truck have pallet jack?', 'Is manual pallet jack provided?'],
    keywords: ['pallet jacks', 'trolleys', 'equipment on truck'],
    approvedAnswer: 'Tailgate-equipped box trucks generally carry a manual hydraulic pallet jack. Please state on your quote if a pallet jack is required so dispatch assigns a suitably equipped vehicle.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 71
  },
  {
    id: 'faq_r72_dock_height_loading',
    category: 'Road Transport, Fleet & Vehicles',
    mainQuestion: 'Can you handle dock-height warehouse loading?',
    alternativeQuestions: ['Warehouse loading dock access', 'Reverse into loading bay'],
    keywords: ['dock-height', 'warehouse loading', 'loading bay dock'],
    approvedAnswer: 'Yes, standard 14ft, 24ft box lorries, and container prime movers can reverse directly into raised warehouse loading docks.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 72
  },
  {
    id: 'faq_r73_cross_border_malaysia',
    category: 'Road Transport, Fleet & Vehicles',
    mainQuestion: 'Do you offer cross-border road trucking to Malaysia?',
    alternativeQuestions: ['Ship to Malaysia by road', 'Causeway trucking to JB'],
    keywords: ['cross-border', 'malaysia', 'trucking', 'johor'],
    approvedAnswer: 'Josan Logistics specializes in domestic road transport coordination within Singapore and Changi Airport cargo handovers. We do not provide cross-border trucking to Malaysia.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 73
  },
  {
    id: 'faq_r74_psa_port_entry_license',
    category: 'Road Transport, Fleet & Vehicles',
    mainQuestion: 'Are your partner drivers licensed for PSA port entry?',
    alternativeQuestions: ['PSA port pass drivers', 'Can trucks enter port?'],
    keywords: ['psa port entry', 'licensed', 'port pass', 'drivers'],
    approvedAnswer: 'Yes, our container haulage and port feeder partner drivers possess valid PSA port entry passes and port safety clearance credentials.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 74
  },
  {
    id: 'faq_r75_driver_contact_plate_info',
    category: 'Road Transport, Fleet & Vehicles',
    mainQuestion: "Can I get the driver's contact number and vehicle plate before pickup?",
    alternativeQuestions: ['Vehicle number before delivery', 'Driver contact details'],
    keywords: ['driver contact', 'vehicle plate', 'driver number', 'license plate'],
    approvedAnswer: 'Yes, vehicle registration numbers and driver phone numbers are released to your site contact prior to the pickup window once the dispatch roster is assigned.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 75
  },

  // =========================================================================
  // 4. AIR FREIGHT & AWB DOCUMENTATION (76–100)
  // =========================================================================
  {
    id: 'faq_a76_offer_air_freight',
    category: 'Air Freight & AWB Documentation',
    mainQuestion: 'Do you offer air freight services?',
    alternativeQuestions: ['Do you handle air cargo?', 'Air freight support in Singapore'],
    keywords: ['air freight', 'air cargo', 'services', 'awb'],
    approvedAnswer: 'Yes, we provide air freight documentation support, Air Waybill (AWB) preparation, billing coordination, and airport cargo terminal handover via Changi Airport partner airlines.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 76
  },
  {
    id: 'faq_a77_documents_required_air_freight',
    category: 'Air Freight & AWB Documentation',
    mainQuestion: 'What documents are required for air freight?',
    alternativeQuestions: ['Paperwork needed for air shipping', 'Air freight documentation checklist'],
    keywords: ['documents required', 'air freight', 'air cargo paperwork', 'checklist'],
    approvedAnswer: 'Common documents required include the Commercial Invoice, Packing List, and Air Waybill (AWB). Specific destinations or cargo may also require Certificates of Origin or export declarations.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 77
  },
  {
    id: 'faq_a78_prepare_awb',
    category: 'Air Freight & AWB Documentation',
    mainQuestion: 'Can Josan Logistics prepare an Air Waybill (AWB)?',
    alternativeQuestions: ['Can you issue an AWB?', 'AWB preparation service'],
    keywords: ['prepare awb', 'air waybill', 'issue awb', 'draft awb'],
    approvedAnswer: 'Yes, our documentation team prepares and verifies standard IATA Air Waybills from your confirmed shipment details for airline cargo acceptance.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 78
  },
  {
    id: 'faq_a79_info_needed_for_awb',
    category: 'Air Freight & AWB Documentation',
    mainQuestion: 'What information do you need to prepare an AWB?',
    alternativeQuestions: ['Details required for AWB', 'What info on Air Waybill?'],
    keywords: ['information', 'needed', 'prepare awb', 'details'],
    approvedAnswer: 'We require: 1) Shipper full name, address, and phone, 2) Consignee full details, 3) Airport of departure (SIN) and destination, 4) Piece count, gross weight, and dimensions, and 5) Description of goods.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 79
  },
  {
    id: 'faq_a80_master_vs_house_awb',
    category: 'Air Freight & AWB Documentation',
    mainQuestion: 'What is the difference between a Master AWB and a House AWB?',
    alternativeQuestions: ['MAWB vs HAWB difference', 'House Air Waybill explanation'],
    keywords: ['master awb', 'house awb', 'mawb', 'hawb', 'difference'],
    approvedAnswer: 'A Master AWB (MAWB) is the airline’s main contract covering a consolidated consignment. A House AWB (HAWB) is issued by the freight forwarder to an individual shipper detailing specific customer cargo.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 80
  },
  {
    id: 'faq_a81_commercial_invoice_needed',
    category: 'Air Freight & AWB Documentation',
    mainQuestion: 'Do I need to provide a Commercial Invoice?',
    alternativeQuestions: ['Is commercial invoice mandatory?', 'Do you need my invoice for air freight?'],
    keywords: ['commercial invoice', 'mandatory', 'invoice required'],
    approvedAnswer: 'Yes, an itemized Commercial Invoice is mandatory for all international commercial air cargo, specifying item descriptions, unit values, quantities, and currencies.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 81
  },
  {
    id: 'faq_a82_packing_list_needed',
    category: 'Air Freight & AWB Documentation',
    mainQuestion: 'Do I need a Packing List for air cargo?',
    alternativeQuestions: ['Is packing list necessary?', 'Packing list requirement'],
    keywords: ['packing list', 'air cargo', 'necessary', 'required'],
    approvedAnswer: 'Yes, an accurate Packing List itemizing carton counts, net and gross weights, package dimensions, and contents is required for airline cargo acceptance and security screening.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 82
  },
  {
    id: 'faq_a83_verify_shipping_documents',
    category: 'Air Freight & AWB Documentation',
    mainQuestion: 'Can you verify my shipping documents before dispatch?',
    alternativeQuestions: ['Check my shipping paperwork', 'Review shipment documents'],
    keywords: ['verify', 'shipping documents', 'check paperwork', 'review'],
    approvedAnswer: 'Yes, our team cross-checks your Commercial Invoice, Packing List, and cargo details against airline acceptance rules before cargo handover to prevent terminal rejections.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 83
  },
  {
    id: 'faq_a84_airport_to_airport',
    category: 'Air Freight & AWB Documentation',
    mainQuestion: 'Do you offer airport-to-airport air freight?',
    alternativeQuestions: ['Airport to airport air shipping', 'Terminal to terminal freight'],
    keywords: ['airport-to-airport', 'terminal to terminal', 'air freight'],
    approvedAnswer: 'Yes, airport-to-airport air cargo coordination from Singapore Changi Airport (SIN) to international destination airports is our core air freight service.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 84
  },
  {
    id: 'faq_a85_door_to_door_international',
    category: 'Air Freight & AWB Documentation',
    mainQuestion: 'Do you offer door-to-door international air shipping?',
    alternativeQuestions: ['International door to door delivery', 'Door to door air cargo'],
    keywords: ['door-to-door', 'international', 'destination delivery'],
    approvedAnswer: 'We handle Singapore factory pickup and export documentation. Destination customs clearance and final door delivery depend on destination partner arrangements and import regulations.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 85
  },
  {
    id: 'faq_a86_destination_countries',
    category: 'Air Freight & AWB Documentation',
    mainQuestion: 'Which countries do you ship air cargo to?',
    alternativeQuestions: ['International destinations covered', 'Where do you fly cargo?'],
    keywords: ['countries', 'destinations', 'international air shipping'],
    approvedAnswer: 'Through partner airlines operating from Singapore Changi Airport (SIN), cargo documentation can be arranged to major international hubs across Asia, Europe, North America, and Australia.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 86
  },
  {
    id: 'faq_a87_air_freight_imports',
    category: 'Air Freight & AWB Documentation',
    mainQuestion: 'Can you handle air freight imports into Singapore?',
    alternativeQuestions: ['Import cargo at Changi', 'Air cargo arrival in Singapore'],
    keywords: ['air freight imports', 'changi arrival', 'inbound cargo'],
    approvedAnswer: 'Yes, we assist with inbound consignment document verification and coordinate local road lorry delivery from Changi Airfreight Centre directly to your warehouse.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 87
  },
  {
    id: 'faq_a88_air_freight_exports',
    category: 'Air Freight & AWB Documentation',
    mainQuestion: 'Can you coordinate air freight exports from Changi Airport?',
    alternativeQuestions: ['Export cargo from Changi', 'Changi airport export coordination'],
    keywords: ['exports', 'changi airport', 'air cargo export'],
    approvedAnswer: 'Yes, outbound export document preparation, AWB issuance, and cargo handover coordination at Changi Airfreight Centre cargo terminals are core services.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 88
  },
  {
    id: 'faq_a89_air_freight_transit_time',
    category: 'Air Freight & AWB Documentation',
    mainQuestion: 'What is the typical transit time for air freight?',
    alternativeQuestions: ['How long does air freight take?', 'Flight transit duration'],
    keywords: ['transit time', 'air freight', 'how long', 'duration'],
    approvedAnswer: 'Airport-to-airport air transit typically takes 1 to 3 days for direct regional flights, or 3 to 5 days for international connecting flights, subject to airline schedules.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 89
  },
  {
    id: 'faq_a90_express_next_flight_out',
    category: 'Air Freight & AWB Documentation',
    mainQuestion: 'Do you offer express or next-flight-out air cargo?',
    alternativeQuestions: ['Next flight out air cargo', 'Urgent air shipping'],
    keywords: ['express', 'next-flight-out', 'urgent air cargo'],
    approvedAnswer: 'Urgent next-available-flight coordination depends on airline partner space allocation. Contact our team immediately at +65 6789 0123 for urgent air consignments.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 90
  },
  {
    id: 'faq_a91_chargeable_weight_calc',
    category: 'Air Freight & AWB Documentation',
    mainQuestion: 'How is chargeable weight calculated for air freight?',
    alternativeQuestions: ['How do airlines charge weight?', 'Chargeable weight formula'],
    keywords: ['chargeable weight', 'calculated', 'air freight formula'],
    approvedAnswer: 'Under IATA rules, chargeable weight is whichever is greater: the actual gross scale weight (in kg) or the volumetric weight (Length x Width x Height in cm divided by 6,000).',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 91
  },
  {
    id: 'faq_a92_volumetric_weight',
    category: 'Air Freight & AWB Documentation',
    mainQuestion: 'What is volumetric weight?',
    alternativeQuestions: ['Dimensional weight definition', 'What does volumetric weight mean?'],
    keywords: ['volumetric weight', 'dimensional weight', 'cubic weight'],
    approvedAnswer: 'Volumetric weight reflects cargo density. Lightweight bulky boxes occupy significant aircraft hold space, so airlines charge based on: (L x W x H in cm) / 6,000 = Volumetric Weight in kg.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 92
  },
  {
    id: 'faq_a93_minimum_weight_air_freight',
    category: 'Air Freight & AWB Documentation',
    mainQuestion: 'Is there a minimum weight for air freight shipments?',
    alternativeQuestions: ['Minimum charge for air cargo', 'Smallest air shipment size'],
    keywords: ['minimum weight', 'minimum charge', 'air freight minimum'],
    approvedAnswer: 'Airlines enforce a minimum freight charge tier (often equivalent to a minimum 20kg to 45kg rate), meaning lighter packages are billed at the minimum freight threshold.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 93
  },
  {
    id: 'faq_a94_consolidated_air_cargo',
    category: 'Air Freight & AWB Documentation',
    mainQuestion: 'Do you handle consolidated air cargo?',
    alternativeQuestions: ['Air freight consolidation', 'Consolidated cargo booking'],
    keywords: ['consolidated', 'air cargo', 'consolidation'],
    approvedAnswer: 'Yes, documentation support and AWB processing are provided for commercial consignments moving under standard airline consolidation schedules.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 94
  },
  {
    id: 'faq_a95_office_to_changi_pickup',
    category: 'Air Freight & AWB Documentation',
    mainQuestion: 'Can you arrange pickup from my office to Changi Airfreight Centre?',
    alternativeQuestions: ['Deliver cargo to Changi airport terminal', 'Pickup and deliver to Changi cargo', 'Changi airport pickup', 'Pickup to Changi airport'],
    keywords: ['pickup', 'changi airfreight centre', 'office pickup', 'changi airport pickup', 'changi pickup'],
    approvedAnswer: 'Yes, our road transport partner trucks pick up directly from your commercial facility and transport into Changi Airfreight Centre terminal handling bays.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 95
  },
  {
    id: 'faq_a96_awb_spelling_mistake',
    category: 'Air Freight & AWB Documentation',
    mainQuestion: 'What happens if my AWB has a spelling mistake?',
    alternativeQuestions: ['Error on Air Waybill', 'Change name on AWB'],
    keywords: ['awb', 'spelling mistake', 'error', 'amendment', 'cca'],
    approvedAnswer: 'Contact us immediately. Corrections requested before airline terminal acceptance are amended at no charge. Changes after export require an official airline CCA (Cargo Correction Advice) fee.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 96
  },
  {
    id: 'faq_a97_certificate_of_origin',
    category: 'Air Freight & AWB Documentation',
    mainQuestion: 'Do I need a Certificate of Origin for my shipment?',
    alternativeQuestions: ['Is COO required?', 'Certificate of Origin air cargo'],
    keywords: ['certificate of origin', 'coo', 'origin document'],
    approvedAnswer: 'Certificates of Origin (COO) are required by certain destination customs authorities under Free Trade Agreements. Shippers can obtain COOs through authorized Singapore business chambers.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 97
  },
  {
    id: 'faq_a98_templates_invoice_packing_list',
    category: 'Air Freight & AWB Documentation',
    mainQuestion: 'Do you provide blank templates for Commercial Invoices or Packing Lists?',
    alternativeQuestions: ['Shipping document templates', 'Sample commercial invoice format'],
    keywords: ['templates', 'commercial invoice', 'packing list', 'sample form'],
    approvedAnswer: 'Yes, we provide standard commercial invoice and packing list spreadsheet templates to help you format compliant documentation.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 98
  },
  {
    id: 'faq_a99_ship_samples_prototypes',
    category: 'Air Freight & AWB Documentation',
    mainQuestion: 'Can I ship samples or prototypes by air?',
    alternativeQuestions: ['Sending commercial samples by air', 'Prototype air shipment'],
    keywords: ['samples', 'prototypes', 'commercial samples', 'testing'],
    approvedAnswer: 'Yes, commercial prototypes and samples can be shipped provided the invoice clearly states "Commercial Samples for Evaluation Only - No Commercial Value" with nominal declaration values.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 99
  },
  {
    id: 'faq_a100_cutoff_time_air_cargo',
    category: 'Air Freight & AWB Documentation',
    mainQuestion: 'What is the cutoff time for air cargo drop-off?',
    alternativeQuestions: ['Air cargo tender deadline', 'When must cargo be at Changi?'],
    keywords: ['cutoff time', 'air cargo drop-off', 'tender deadline', 'changi cutoff'],
    approvedAnswer: 'Cargo and finalized AWBs must typically be lodged at the Changi Airfreight Centre cargo handling terminal (SATS or dnata) at least 4 to 6 hours prior to scheduled flight departure.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 100
  },

  // =========================================================================
  // 5. TRACKING, STATUS & MILESTONES (101–120)
  // =========================================================================
  {
    id: 'faq_t101_track_shipment',
    category: 'Tracking, Status & Milestones',
    mainQuestion: 'How can I track my shipment?',
    alternativeQuestions: ['Track shipment', 'Check cargo status', 'Tracking portal'],
    keywords: ['track', 'tracking', 'status', 'milestones'],
    approvedAnswer: 'You can check your status anytime on our website [Track Shipment](/track) page by entering your Josan tracking reference (e.g. JL-XXXX-XXXX) or Air Waybill number.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 101
  },
  {
    id: 'faq_t102_where_is_cargo_now',
    category: 'Tracking, Status & Milestones',
    mainQuestion: 'Where is my cargo right now?',
    alternativeQuestions: ['Current cargo location', 'Check where my delivery is'],
    keywords: ['where is', 'cargo', 'location', 'right now'],
    approvedAnswer: 'Please enter your tracking number on our [Track Shipment](/track) page to see the latest registered milestone (Booked, Received at Hub, In Transit, Delivered) and update timestamp.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 102
  },
  {
    id: 'faq_t103_where_enter_tracking_number',
    category: 'Tracking, Status & Milestones',
    mainQuestion: 'Where do I enter my tracking number?',
    alternativeQuestions: ['Where to input tracking number', 'Track search box location'],
    keywords: ['where', 'enter tracking number', 'tracking page'],
    approvedAnswer: 'Navigate to the [Track Shipment](/track) link on our website header, type your reference into the tracking input box, and click "Track Shipment".',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 103
  },
  {
    id: 'faq_t104_tracking_number_format',
    category: 'Tracking, Status & Milestones',
    mainQuestion: 'What format is a Josan Logistics tracking number?',
    alternativeQuestions: ['Tracking ID format', 'What does tracking number look like?'],
    keywords: ['format', 'tracking number', 'jl reference'],
    approvedAnswer: 'Josan Logistics reference numbers typically follow the format JL-YYYY-NNNN (e.g., JL-2026-1042) or standard 11-digit airline AWB numbers (e.g., 016-12345678).',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 104
  },
  {
    id: 'faq_t105_track_using_awb',
    category: 'Tracking, Status & Milestones',
    mainQuestion: 'Can I track my shipment using my Air Waybill (AWB) number?',
    alternativeQuestions: ['Track by AWB', 'Use AWB on tracking page'],
    keywords: ['track', 'air waybill', 'awb number'],
    approvedAnswer: 'Yes, entering your 11-digit AWB number directly into our [Track Shipment](/track) page displays your airline handover and dispatch milestones.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 105
  },
  {
    id: 'faq_t106_tracking_not_working',
    category: 'Tracking, Status & Milestones',
    mainQuestion: 'My tracking number is not working—what should I do?',
    alternativeQuestions: ['Tracking error', 'Cannot find tracking reference'],
    keywords: ['tracking not working', 'error', 'invalid tracking number'],
    approvedAnswer: 'Check for extra spaces or typos. If the shipment was booked within the last 1–2 hours, please allow time for operations dispatch to register the record, or contact us at +65 6789 0123.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 106
  },
  {
    id: 'faq_t107_status_not_updating',
    category: 'Tracking, Status & Milestones',
    mainQuestion: "Why hasn't my tracking status updated?",
    alternativeQuestions: ['Tracking stuck', 'No status updates'],
    keywords: ['status not updated', 'tracking stuck', 'no updates'],
    approvedAnswer: 'Milestones update when cargo reaches physical transfer checkpoints (e.g. pickup completed, arrival at airport terminal, delivery confirmed). In-transit road legs show the timestamp of the last checkpoint.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 107
  },
  {
    id: 'faq_t108_live_gps_tracking',
    category: 'Tracking, Status & Milestones',
    mainQuestion: 'Do you provide live GPS tracking of trucks?',
    alternativeQuestions: ['Can I see truck on live map?', 'Real-time GPS feed'],
    keywords: ['live gps tracking', 'gps', 'real-time map'],
    approvedAnswer: 'We provide discrete milestone status updates (Booked, Received at Hub, In Transit, Delivered) with verified timestamps rather than public real-time GPS map feeds.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 108
  },
  {
    id: 'faq_t109_milestone_update_frequency',
    category: 'Tracking, Status & Milestones',
    mainQuestion: 'How often are tracking milestones updated?',
    alternativeQuestions: ['Milestone refresh frequency', 'When do tracking statuses update?'],
    keywords: ['how often', 'tracking milestones', 'frequency'],
    approvedAnswer: 'Milestones are updated immediately upon driver completion of pickup, arrival at sorting hubs or airport terminals, and delivery sign-off.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 109
  },
  {
    id: 'faq_t110_delivery_notification_email',
    category: 'Tracking, Status & Milestones',
    mainQuestion: 'Will I get an email or SMS when my cargo is delivered?',
    alternativeQuestions: ['Delivery alert email', 'SMS on delivery completion'],
    keywords: ['email notification', 'delivery alert', 'sms confirmation'],
    approvedAnswer: 'Yes, automated email delivery notifications can be enabled for the contact person designated on the quotation and consignment paperwork.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 110
  },
  {
    id: 'faq_t111_proof_of_delivery_pod',
    category: 'Tracking, Status & Milestones',
    mainQuestion: 'Can I get a Proof of Delivery (POD)?',
    alternativeQuestions: ['Request POD', 'Signed delivery proof'],
    keywords: ['proof of delivery', 'pod', 'signed proof'],
    approvedAnswer: 'Yes, signed physical or electronic Proof of Delivery (POD) consignment notes are archived and available upon request from our operations desk.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 111
  },
  {
    id: 'faq_t112_download_signed_do',
    category: 'Tracking, Status & Milestones',
    mainQuestion: 'How do I download a signed Delivery Order (DO)?',
    alternativeQuestions: ['Get signed DO copy', 'Download delivery order'],
    keywords: ['download', 'signed delivery order', 'signed do'],
    approvedAnswer: 'Email contact@josanlogistics.com.sg with your shipment reference number to request a scanned copy of the recipient-endorsed Delivery Order.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 112
  },
  {
    id: 'faq_t113_meaning_of_dispatched',
    category: 'Tracking, Status & Milestones',
    mainQuestion: 'What does "Dispatched" mean on the tracking page?',
    alternativeQuestions: ['Meaning of dispatched status', 'What is dispatched?'],
    keywords: ['dispatched', 'meaning', 'tracking status'],
    approvedAnswer: '"Dispatched" indicates the transport partner lorry has collected your cargo from the origin and departed towards the destination or transit hub.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 113
  },
  {
    id: 'faq_t114_meaning_of_in_transit',
    category: 'Tracking, Status & Milestones',
    mainQuestion: 'What does "In Transit" mean?',
    alternativeQuestions: ['In transit definition', 'What does in transit status mean?'],
    keywords: ['in transit', 'meaning', 'status definition'],
    approvedAnswer: '"In Transit" means the consignment is actively moving along the road network or undergoing airport terminal transfer toward the consignee.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 114
  },
  {
    id: 'faq_t115_delivered_but_not_received',
    category: 'Tracking, Status & Milestones',
    mainQuestion: "My shipment says delivered, but I haven't received it.",
    alternativeQuestions: ['Says delivered but missing', 'Cargo not received'],
    keywords: ['delivered but not received', 'missing package', 'undelivered'],
    approvedAnswer: 'Please verify with your building’s security counter, receiving dock, or reception. If the cargo is still unlocated, call our operations desk immediately at +65 6789 0123.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 115
  },
  {
    id: 'faq_t116_track_multiple_shipments',
    category: 'Tracking, Status & Milestones',
    mainQuestion: 'Can I track multiple shipments at once?',
    alternativeQuestions: ['Batch tracking', 'Track several packages'],
    keywords: ['track multiple', 'batch tracking', 'multiple shipments'],
    approvedAnswer: 'Corporate clients with active accounts can view their consolidated dispatch overview on the Customer Dashboard, or query individual references on `/track`.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 116
  },
  {
    id: 'faq_t117_contact_for_stuck_shipment',
    category: 'Tracking, Status & Milestones',
    mainQuestion: 'Who do I contact if my shipment is stuck?',
    alternativeQuestions: ['Cargo delay contact', 'Who to call if delivery delayed?'],
    keywords: ['contact', 'stuck', 'delayed shipment', 'escalation'],
    approvedAnswer: 'Please call our central operations desk at +65 6789 0123 or email contact@josanlogistics.com.sg with your JL tracking reference for immediate investigation.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 117
  },
  {
    id: 'faq_t118_customer_can_track',
    category: 'Tracking, Status & Milestones',
    mainQuestion: 'Can my customer also track the shipment?',
    alternativeQuestions: ['Can recipient track?', 'Share tracking link with client'],
    keywords: ['customer track', 'recipient track', 'share tracking'],
    approvedAnswer: 'Yes! Simply share your tracking reference number with your customer; they can track milestone progress on our public [Track Shipment](/track) page without logging in.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 118
  },
  {
    id: 'faq_t119_tracking_history_duration',
    category: 'Tracking, Status & Milestones',
    mainQuestion: 'How long does tracking history stay available online?',
    alternativeQuestions: ['Tracking record retention', 'How long is tracking stored?'],
    keywords: ['how long', 'tracking history', 'available online', 'retention'],
    approvedAnswer: 'Tracking milestone data remains searchable online on our website for up to 90 days following completion of delivery.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 119
  },
  {
    id: 'faq_t120_lost_tracking_number',
    category: 'Tracking, Status & Milestones',
    mainQuestion: 'I lost my tracking number—can you look it up for me?',
    alternativeQuestions: ['Forgot tracking ID', 'Find my tracking number'],
    keywords: ['lost tracking number', 'look up', 'find reference'],
    approvedAnswer: 'Yes, email contact@josanlogistics.com.sg with your company name, pickup date, and delivery location. Our team will verify your identity and retrieve your reference.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 120
  },

  // =========================================================================
  // 6. PROHIBITED, REGULATED & SPECIAL CARGO (121–140)
  // =========================================================================
  {
    id: 'faq_c121_prohibited_items_list',
    category: 'Prohibited, Regulated & Special Cargo',
    mainQuestion: 'What items are prohibited from shipping?',
    alternativeQuestions: ['What items cannot be shipped?', 'Banned cargo list'],
    keywords: ['prohibited items', 'banned cargo', 'restrictions', 'illegal goods'],
    approvedAnswer: 'Josan Logistics strictly does NOT handle tobacco/vapes, alcohol/spirits, hazardous chemicals/DG, raw/frozen food products, pharmaceuticals, or illegal/contraband commodities.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 121
  },
  {
    id: 'faq_c122_tobacco_cigarettes',
    category: 'Prohibited, Regulated & Special Cargo',
    mainQuestion: 'Do you handle tobacco or cigarettes?',
    alternativeQuestions: ['Can I ship tobacco?', 'Cigarettes transport'],
    keywords: ['tobacco', 'cigarettes', 'vape', 'cigars', 'nicotine'],
    approvedAnswer: 'No. We strictly do NOT coordinate, carry, or handle tobacco, cigars, cigarettes, or electronic vaporizers/vaping supplies under any circumstances.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 122
  },
  {
    id: 'faq_c123_alcohol_wine_liquor',
    category: 'Prohibited, Regulated & Special Cargo',
    mainQuestion: 'Can I ship alcohol, wine, or liquor?',
    alternativeQuestions: ['Ship wine bottles', 'Alcoholic beverages transport', 'Can I ship alcohol or wine?', 'Can I ship alcohol?', 'Can I ship wine?'],
    keywords: ['alcohol', 'wine', 'liquor', 'spirits', 'beer'],
    approvedAnswer: 'No. We do NOT transport alcoholic beverages, wines, beers, or liquors requiring dutiable liquor transport licenses.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 123
  },
  {
    id: 'faq_c124_hazardous_chemicals_flammable',
    category: 'Prohibited, Regulated & Special Cargo',
    mainQuestion: 'Do you transport hazardous chemicals or flammable goods?',
    alternativeQuestions: ['Hazardous chemicals transport', 'Can you ship flammable liquids?'],
    keywords: ['hazardous chemicals', 'flammable goods', 'hazmat', 'dangerous goods'],
    approvedAnswer: 'No. We do NOT handle Class 1 to 9 Dangerous Goods (flammable liquids, toxic substances, corrosives, explosives, or radioactive material).',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 124
  },
  {
    id: 'faq_c125_lithium_batteries_powerbanks',
    category: 'Prohibited, Regulated & Special Cargo',
    mainQuestion: 'Can you ship lithium batteries or power banks?',
    alternativeQuestions: ['Ship power banks', 'Lithium battery transport'],
    keywords: ['lithium batteries', 'power banks', 'batteries', 'un3480'],
    approvedAnswer: 'Loose lithium-ion batteries and standalone power banks are heavily restricted by airlines and excluded from standard coordination. Equipment with small embedded batteries requires prior technical evaluation.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 125
  },
  {
    id: 'faq_c126_pharmaceuticals_medical',
    category: 'Prohibited, Regulated & Special Cargo',
    mainQuestion: 'Do you transport pharmaceuticals or medical supplies?',
    alternativeQuestions: ['Medical supplies transport', 'Medicine shipping'],
    keywords: ['pharmaceuticals', 'medical supplies', 'medicine', 'gdp'],
    approvedAnswer: 'General dry medical consumables (PPE, non-medicated devices) can be transported. Prescription pharmaceuticals and cold-chain clinical drugs requiring specialized HSA GDP licenses are excluded.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 126
  },
  {
    id: 'faq_c127_fresh_frozen_food',
    category: 'Prohibited, Regulated & Special Cargo',
    mainQuestion: 'Can you ship fresh or frozen food products?',
    alternativeQuestions: ['Transport frozen meat', 'Frozen food delivery'],
    keywords: ['fresh food', 'frozen food', 'meat', 'seafood'],
    approvedAnswer: 'No. Josan Logistics does not transport fresh meat, seafood, frozen food products, or temperature-sensitive groceries.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 127
  },
  {
    id: 'faq_c128_perishable_goods',
    category: 'Prohibited, Regulated & Special Cargo',
    mainQuestion: 'Do you handle perishable goods?',
    alternativeQuestions: ['Perishable cargo', 'Fresh flowers shipping'],
    keywords: ['perishable goods', 'perishables', 'fresh flowers', 'produce'],
    approvedAnswer: 'No. We do not transport perishable goods, fresh cut flowers, or short-shelf-life agricultural produce.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 128
  },
  {
    id: 'faq_c129_live_animals_plants',
    category: 'Prohibited, Regulated & Special Cargo',
    mainQuestion: 'Can you transport live animals or plants?',
    alternativeQuestions: ['Ship pets', 'Live plants delivery'],
    keywords: ['live animals', 'plants', 'pets', 'livestock'],
    approvedAnswer: 'No. Live animals, household pets, livestock, and live botanical plants are strictly excluded from our services.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 129
  },
  {
    id: 'faq_c130_fragile_glass_electronics',
    category: 'Prohibited, Regulated & Special Cargo',
    mainQuestion: 'Do you ship fragile items like glass or electronics?',
    alternativeQuestions: ['Fragile electronics transport', 'Glassware shipping'],
    keywords: ['fragile items', 'glass', 'electronics'],
    approvedAnswer: 'Packaged commercial electronics are handled daily. Fragile glassware, ceramics, or scientific instruments must be securely crated and cushioned by the shipper prior to pickup.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 130
  },
  {
    id: 'faq_c131_heavy_machinery_oversized',
    category: 'Prohibited, Regulated & Special Cargo',
    mainQuestion: 'Can you transport heavy machinery or oversized equipment?',
    alternativeQuestions: ['Machinery haulage', 'Industrial equipment transport'],
    keywords: ['heavy machinery', 'oversized equipment', 'industrial transport'],
    approvedAnswer: 'Yes, commercial industrial equipment fitting standard 24ft heavy lorries or flatbed trailers can be coordinated. Please submit exact dimensions and weights on [Request a Quote](/quote).',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 131
  },
  {
    id: 'faq_c132_household_moves_furniture',
    category: 'Prohibited, Regulated & Special Cargo',
    mainQuestion: 'Do you handle personal household moves or furniture?',
    alternativeQuestions: ['Home moving service', 'Residential furniture move'],
    keywords: ['household moves', 'furniture', 'residential moving', 'home move'],
    approvedAnswer: 'No. Josan Logistics focuses on commercial B2B freight. We do not provide residential house moving, home furniture relocation, or disposal services.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 132
  },
  {
    id: 'faq_c133_personal_luggage_excess_baggage',
    category: 'Prohibited, Regulated & Special Cargo',
    mainQuestion: 'Can I ship personal luggage or excess baggage?',
    alternativeQuestions: ['Send suitcases by air', 'Excess baggage shipping'],
    keywords: ['personal luggage', 'excess baggage', 'suitcases'],
    approvedAnswer: 'No. We coordinate commercial trade freight with commercial invoices, not unaccompanied personal effects or passenger excess baggage.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 133
  },
  {
    id: 'faq_c134_jewelry_cash_high_value',
    category: 'Prohibited, Regulated & Special Cargo',
    mainQuestion: 'Do you transport high-value items like jewelry or cash?',
    alternativeQuestions: ['Ship gold bullion', 'Valuable jewelry courier'],
    keywords: ['jewelry', 'cash', 'high-value', 'gold', 'bullion'],
    approvedAnswer: 'No. Cash, currency notes, bearer bonds, precious bullion, fine jewelry, and luxury watches are strictly prohibited from carriage.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 134
  },
  {
    id: 'faq_c135_aerosols_paints_pressurized',
    category: 'Prohibited, Regulated & Special Cargo',
    mainQuestion: 'Can you ship aerosols, paints, or pressurized cans?',
    alternativeQuestions: ['Spray cans transport', 'Aerosol shipping'],
    keywords: ['aerosols', 'paints', 'pressurized cans', 'spray cans'],
    approvedAnswer: 'No. Pressurized spray cans and solvent-based paints are classified as flammable gas/liquid Dangerous Goods and cannot be transported under standard terms.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 135
  },
  {
    id: 'faq_c136_dry_ice_shipments',
    category: 'Prohibited, Regulated & Special Cargo',
    mainQuestion: 'Do you handle dry ice shipments?',
    alternativeQuestions: ['Ship with dry ice', 'Dry ice air freight'],
    keywords: ['dry ice', 'un1845', 'carbon dioxide solid'],
    approvedAnswer: 'Dry ice is regulated under IATA Dangerous Goods regulations (UN 1845) due to suffocation risk and is excluded from our standard air coordination.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 136
  },
  {
    id: 'faq_c137_cosmetics_liquids',
    category: 'Prohibited, Regulated & Special Cargo',
    mainQuestion: 'Can you transport cosmetics or liquids?',
    alternativeQuestions: ['Ship beauty products', 'Liquid cosmetics transport'],
    keywords: ['cosmetics', 'liquids', 'skincare', 'beauty products'],
    approvedAnswer: 'Non-hazardous commercial skincare creams and non-flammable cosmetic products are accepted. Alcohol-based perfumes and acetone-based nail polish are excluded.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 137
  },
  {
    id: 'faq_c138_msds_sds_requirement',
    category: 'Prohibited, Regulated & Special Cargo',
    mainQuestion: 'Do you require an MSDS (Material Safety Data Sheet) for chemical-based products?',
    alternativeQuestions: ['When is SDS needed?', 'Do I need safety data sheet?'],
    keywords: ['msds', 'sds', 'safety data sheet', 'chemical products'],
    approvedAnswer: 'Yes, any chemical compound, liquid formulation, powder, or synthetic paste requires a standard 16-section Safety Data Sheet (SDS) to confirm it is non-hazardous for transport.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 138
  },
  {
    id: 'faq_c139_automotive_parts_engine_oil',
    category: 'Prohibited, Regulated & Special Cargo',
    mainQuestion: 'Can I ship automotive parts or engine oil?',
    alternativeQuestions: ['Car parts shipping', 'Can I transport motor oil?'],
    keywords: ['automotive parts', 'engine oil', 'car parts', 'lubricant'],
    approvedAnswer: 'Clean, drained mechanical vehicle parts are welcomed. Used engines containing residual fuel, loose motor oils, and car batteries are classified as hazardous and excluded.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 139
  },
  {
    id: 'faq_c140_restricted_items_found',
    category: 'Prohibited, Regulated & Special Cargo',
    mainQuestion: 'What happens if restricted items are found in my cargo?',
    alternativeQuestions: ['Penalties for undeclared prohibited cargo', 'What if dangerous goods found?'],
    keywords: ['restricted items found', 'quarantine', 'undeclared goods'],
    approvedAnswer: 'Undisclosed prohibited goods will be immediately rejected or quarantined at the terminal. Any carrier detention costs or regulatory fines will be charged entirely to the shipper.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 140
  },

  // =========================================================================
  // 7. CUSTOMS, GST & COMPLIANCE (141–155)
  // =========================================================================
  {
    id: 'faq_cu141_customs_clearance_services',
    category: 'Customs, GST & Compliance',
    mainQuestion: 'Do you provide customs clearance services?',
    alternativeQuestions: ['Can you clear customs?', 'Customs clearance support'],
    keywords: ['customs clearance', 'clear customs', 'brokerage'],
    approvedAnswer: 'No. Josan Logistics provides documentation support only and does not act as a customs broker or clearance agent. Customs clearance must be arranged directly with Singapore Customs or your licensed declaring agent.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 141
  },
  {
    id: 'faq_cu142_licensed_customs_broker',
    category: 'Customs, GST & Compliance',
    mainQuestion: 'Are you a licensed customs broker?',
    alternativeQuestions: ['Are you customs agents?', 'Licensed broker status'],
    keywords: ['licensed customs broker', 'customs agent', 'brokerage'],
    approvedAnswer: 'No, we are not licensed customs brokers. We assist with preparing transport paperwork like Air Waybills and packing lists, but do not declare customs entries.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 142
  },
  {
    id: 'faq_cu143_tradenet_permit_filing',
    category: 'Customs, GST & Compliance',
    mainQuestion: 'Can you file a TradeNet permit for me?',
    alternativeQuestions: ['Apply for TradeNet permit', 'Declare permit on TradeNet'],
    keywords: ['tradenet permit', 'declare permit', 'customs permit'],
    approvedAnswer: 'No. We do not lodge permit declarations on Singapore TradeNet. Shippers must declare permits through their appointed TradeNet declaring agent.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 143
  },
  {
    id: 'faq_cu144_gst_permit_declarations',
    category: 'Customs, GST & Compliance',
    mainQuestion: 'Do you handle GST permit declarations?',
    alternativeQuestions: ['Declare In-Payment permit', 'GST permit submission'],
    keywords: ['gst permit', 'in-payment permit', 'customs gst declaration'],
    approvedAnswer: 'No. In-Payment (GST) and In-Non-Payment permits must be filed by the importer through an authorized TradeNet declaring agent.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 144
  },
  {
    id: 'faq_cu145_gst_advice_import_export',
    category: 'Customs, GST & Compliance',
    mainQuestion: 'Can you give me GST advice for my import/export?',
    alternativeQuestions: ['Tax advice on shipping', 'GST rate on imports'],
    keywords: ['gst advice', 'tax advice', 'import gst'],
    approvedAnswer: 'No, we do not provide tax, tariff classification, or GST advice. Please consult Singapore Customs (www.customs.gov.sg) or the Inland Revenue Authority of Singapore (IRAS).',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 145
  },
  {
    id: 'faq_cu146_find_hs_code',
    category: 'Customs, GST & Compliance',
    mainQuestion: 'Can you help me find the HS code for my products?',
    alternativeKeywords: ['Determine HS code', 'Tariff code search'],
    keywords: ['hs code', 'harmonized system', 'tariff code'],
    approvedAnswer: 'Shippers must classify their own commodities. You can search official tariff classifications on the Singapore Customs TradeNet HS/CA Product Code Search portal.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 146
  },
  {
    id: 'faq_cu147_tariff_classification_advice',
    category: 'Customs, GST & Compliance',
    mainQuestion: 'Do you provide tariff classification advice?',
    alternativeQuestions: ['Tariff code advice', 'Duty rate advice'],
    keywords: ['tariff classification', 'duty advice', 'customs tariff'],
    approvedAnswer: 'No. Official tariff classification advice should be obtained directly from Singapore Customs or your certified trade compliance advisor.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 147
  },
  {
    id: 'faq_cu148_who_pays_duties_taxes',
    category: 'Customs, GST & Compliance',
    mainQuestion: 'Who pays the customs duties and import taxes?',
    alternativeQuestions: ['Responsible for import tax', 'Paying Singapore duties', 'Who is responsible for paying import GST?', 'Who pays import GST?', 'Import GST responsibility'],
    keywords: ['who pays', 'customs duties', 'import taxes', 'gst payment', 'import gst', 'import gst responsibility', 'gst responsibility', 'responsible for gst'],
    approvedAnswer: 'Import duties and Singapore GST are the direct legal responsibility of the Importer of Record, payable directly to Singapore Customs via their Inter-Bank GIRO (IBG) account.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 148
  },
  {
    id: 'faq_cu149_arrange_customs_if_you_dont',
    category: 'Customs, GST & Compliance',
    mainQuestion: "How do I arrange customs clearance if you don't do it?",
    alternativeQuestions: ['Finding a customs broker in Singapore', 'How to clear goods without you?'],
    keywords: ['arrange customs clearance', 'declaring agent', 'broker list'],
    approvedAnswer: 'You can appoint a registered Singapore declaring agent, a dedicated customs clearance broker, or your third-party freight forwarder to file your TradeNet declaration.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 149
  },
  {
    id: 'faq_cu150_work_with_own_declaring_agent',
    category: 'Customs, GST & Compliance',
    mainQuestion: 'Can you work with my own declaring agent?',
    alternativeQuestions: ['Cooperate with my customs broker', 'Hand over documents to my agent'],
    keywords: ['work with declaring agent', 'own broker', 'cooperation'],
    approvedAnswer: 'Yes! We routinely coordinate with our clients’ appointed declaring agents, sharing AWB copies and flight schedules to ensure synchronized customs clearance.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 150
  },
  {
    id: 'faq_cu151_documents_needed_singapore_customs',
    category: 'Customs, GST & Compliance',
    mainQuestion: 'What documents do I need for Singapore Customs?',
    alternativeQuestions: ['Customs permit paperwork checklist', 'Import export documents required'],
    keywords: ['documents needed', 'singapore customs', 'customs checklist'],
    approvedAnswer: 'Standard documentation includes the Commercial Invoice, Packing List, Bill of Lading / Air Waybill, and an approved Singapore Customs TradeNet permit.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 151
  },
  {
    id: 'faq_cu152_ata_carnet_temporary_import',
    category: 'Customs, GST & Compliance',
    mainQuestion: 'Do you handle temporary import/export carnets (ATA Carnet)?',
    alternativeQuestions: ['ATA Carnet shipments', 'Exhibition goods temporary import'],
    keywords: ['ata carnet', 'temporary import', 'carnet shipment'],
    approvedAnswer: 'We coordinate road and air transport for ATA Carnet shipments (e.g. exhibition equipment) provided the physical carnet document is endorsed at customs checkpoints by the shipper.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 152
  },
  {
    id: 'faq_cu153_legal_compliance_advice',
    category: 'Customs, GST & Compliance',
    mainQuestion: 'Do you provide legal or regulatory compliance advice?',
    alternativeQuestions: ['Trade compliance advice', 'Legal shipping guidance'],
    keywords: ['legal advice', 'compliance advice', 'regulatory guidance'],
    approvedAnswer: 'No. Josan Logistics does not provide legal, export control, sanctions, or regulatory compliance opinions.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 153
  },
  {
    id: 'faq_cu154_shipment_held_by_customs',
    category: 'Customs, GST & Compliance',
    mainQuestion: 'What happens if my shipment is held by customs?',
    alternativeQuestions: ['Customs hold resolution', 'Cargo detained by customs'],
    keywords: ['shipment held', 'customs hold', 'detained cargo'],
    approvedAnswer: 'Customs holds must be resolved directly between the importer/declaring agent and Singapore Customs. We can supply duplicate consignment documentation if requested.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 154
  },
  {
    id: 'faq_cu155_transshipment_permits',
    category: 'Customs, GST & Compliance',
    mainQuestion: 'Do you handle transshipment permits?',
    alternativeQuestions: ['Transshipment cargo permit', 'Air-to-air transshipment'],
    keywords: ['transshipment permits', 'transshipment declaration'],
    approvedAnswer: 'Transshipment permits for through-air cargo must be filed by the airline handling terminal (SATS or dnata) at Changi Airport.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 155
  },

  // =========================================================================
  // 8. PACKAGING, WEIGHT & DIMENSIONS (156–175)
  // =========================================================================
  {
    id: 'faq_pk156_pack_goods_before_pickup',
    category: 'Packaging, Weight & Dimensions',
    mainQuestion: 'How should I pack my goods before pickup?',
    alternativeQuestions: ['Packaging guidelines', 'How to pack boxes?'],
    keywords: ['pack goods', 'packaging guidelines', 'how to pack'],
    approvedAnswer: 'Goods should be packed in durable double-walled cardboard cartons, secured with strong tape, and palletized with stretch film. Fragile items require internal cushioning (bubble wrap or foam).',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 156
  },
  {
    id: 'faq_pk157_packing_materials_boxes',
    category: 'Packaging, Weight & Dimensions',
    mainQuestion: 'Do you provide packing materials or cardboard boxes?',
    alternativeQuestions: ['Do you sell carton boxes?', 'Supply bubble wrap'],
    keywords: ['packing materials', 'cardboard boxes', 'supplies'],
    approvedAnswer: 'Shippers must provide their own packaging materials and cartons. Josan Logistics coordinates transport and documentation and does not sell packaging supplies.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 157
  },
  {
    id: 'faq_pk158_palletizing_shrink_wrapping',
    category: 'Packaging, Weight & Dimensions',
    mainQuestion: 'Do you offer palletizing or shrink-wrapping services?',
    alternativeQuestions: ['Pallet wrap service', 'Can you palletize my cargo?'],
    keywords: ['palletizing', 'shrink-wrapping', 'stretch wrap'],
    approvedAnswer: 'Cargo must be fully palletized and wrapped prior to driver arrival. On-site warehouse palletizing can only be arranged by prior written agreement for contracted corporate accounts.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 158
  },
  {
    id: 'faq_pk159_wooden_crating',
    category: 'Packaging, Weight & Dimensions',
    mainQuestion: 'Do you provide wooden crating for heavy cargo?',
    alternativeQuestions: ['Crate heavy machinery', 'Export wooden crating'],
    keywords: ['wooden crating', 'heavy cargo', 'crates'],
    approvedAnswer: 'No, shippers must engage an industrial packaging specialist to crate heavy or sensitive machinery before booking transport.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 159
  },
  {
    id: 'faq_pk160_ispm15_heat_treated_pallets',
    category: 'Packaging, Weight & Dimensions',
    mainQuestion: 'Do wooden pallets need to be ISPM-15 heat-treated for air export?',
    alternativeQuestions: ['ISPM 15 wooden pallets', 'Heat treated pallet stamp required'],
    keywords: ['ispm-15', 'heat-treated', 'wooden pallets', 'ippc'],
    approvedAnswer: 'Yes, international phytosanitary standards require all solid raw wood packaging material (pallets, dunnage, crates) exported by air to be ISPM-15 heat-treated and IPPC stamped.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 160
  },
  {
    id: 'faq_pk161_maximum_weight_box_pallet',
    category: 'Packaging, Weight & Dimensions',
    mainQuestion: 'What is the maximum weight per box or pallet?',
    alternativeQuestions: ['Pallet weight limit', 'Box weight maximum'],
    keywords: ['maximum weight', 'per box', 'per pallet', 'weight limit'],
    approvedAnswer: 'For manual safety, individual loose cartons should not exceed 25kg. Heavy industrial pallets should generally not exceed 1,000kg per pallet for standard tailgate and pallet jack handling.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 161
  },
  {
    id: 'faq_pk162_maximum_dimensions_air_freight',
    category: 'Packaging, Weight & Dimensions',
    mainQuestion: 'What are the maximum dimensions for air freight?',
    alternativeQuestions: ['Air cargo size limits', 'Maximum parcel size air freight'],
    keywords: ['maximum dimensions', 'air freight', 'size limit', 'height limit'],
    approvedAnswer: 'Standard passenger aircraft lower holds accommodate cargo up to 300cm x 220cm x 160cm (height limit 160cm). Dedicated cargo freighters can accept taller cargo up to 300cm height.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 162
  },
  {
    id: 'faq_pk163_dimensions_14ft_box_truck',
    category: 'Packaging, Weight & Dimensions',
    mainQuestion: 'What are the interior dimensions of a 14ft box truck?',
    alternativeQuestions: ['14ft truck cargo dimensions', 'How big inside 14ft lorry?'],
    keywords: ['interior dimensions', '14ft box truck', 'length width height'],
    approvedAnswer: 'Approximate interior dimensions of a standard 14ft box truck: Length 4.2m x Width 2.0m x Height 2.1m (approx. 17.6 cubic meters of volume).',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 163
  },
  {
    id: 'faq_pk164_dimensions_24ft_lorry',
    category: 'Packaging, Weight & Dimensions',
    mainQuestion: 'What are the interior dimensions of a 24ft lorry?',
    alternativeQuestions: ['24ft lorry volume size', 'Internal dimensions 24ft truck'],
    keywords: ['interior dimensions', '24ft lorry', 'capacity dimensions'],
    approvedAnswer: 'Approximate interior dimensions of a standard 24ft heavy lorry: Length 7.2m x Width 2.3m x Height 2.4m (approx. 39.7 cubic meters of volume).',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 164
  },
  {
    id: 'faq_pk165_label_every_carton',
    category: 'Packaging, Weight & Dimensions',
    mainQuestion: 'Do I need to label every carton before pickup?',
    alternativeQuestions: ['Must every box have a label?', 'Carton labeling requirement'],
    keywords: ['label every carton', 'shipping labels', 'carton labels'],
    approvedAnswer: 'Yes, every individual carton should display a clear shipping label showing consignee name, destination address, and piece count (e.g., Box 1 of 6) to prevent split shipments.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 165
  },
  {
    id: 'faq_pk166_info_on_shipping_label',
    category: 'Packaging, Weight & Dimensions',
    mainQuestion: 'What information should be on the shipping label?',
    alternativeQuestions: ['What to write on shipping label?', 'Label format'],
    keywords: ['information', 'shipping label', 'consignee name', 'address'],
    approvedAnswer: 'Each label should include: Shipper Name, Consignee Company & Name, Delivery Address & Postal Code, Contact Phone Number, Tracking / AWB Reference, and Piece Count (e.g. 1/10).',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 166
  },
  {
    id: 'faq_pk167_ship_loose_cartons',
    category: 'Packaging, Weight & Dimensions',
    mainQuestion: 'Can I ship loose unpalletized cartons?',
    alternativeQuestions: ['Ship individual boxes', 'Unpalletized freight'],
    keywords: ['loose cartons', 'unpalletized', 'loose boxes'],
    approvedAnswer: 'Yes, loose cartons can be accommodated in 14ft dedicated box trucks. If shipping by air freight or in large volumes, palletization is strongly advised for security.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 167
  },
  {
    id: 'faq_pk168_stackable_pallets',
    category: 'Packaging, Weight & Dimensions',
    mainQuestion: 'Can my pallets be stacked during transport?',
    alternativeQuestions: ['Double stack pallets in truck', 'Is pallet stacking allowed?'],
    keywords: ['pallets be stacked', 'stackable pallets', 'double stack'],
    approvedAnswer: 'Pallets are only stacked if specifically labeled "Stackable" and structurally flat. Fragile or non-stackable pallets should display "Do Not Stack" cone protectors.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 168
  },
  {
    id: 'faq_pk169_dont_know_exact_weight',
    category: 'Packaging, Weight & Dimensions',
    mainQuestion: "What if I don't know the exact weight of my cargo?",
    alternativeQuestions: ['Estimate weight on quote', 'Do not have exact weight'],
    keywords: ['dont know exact weight', 'estimate weight', 'approximate weight'],
    approvedAnswer: 'Provide an estimated weight when requesting your quote. Final billing will be adjusted to actual scale weights recorded at the warehouse or airport cargo terminal.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 169
  },
  {
    id: 'faq_pk170_weighed_again_at_airport',
    category: 'Packaging, Weight & Dimensions',
    mainQuestion: 'Will the cargo be weighed again at the airport or warehouse?',
    alternativeQuestions: ['Do airlines weigh cargo?', 'Weighing scale check'],
    keywords: ['weighed again', 'airport scale', 'terminal scale'],
    approvedAnswer: 'Yes, all air cargo is weighed on calibrated airport scales and passed through volumetric dimension scanners at the Changi cargo terminal before airline flight manifest acceptance.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 170
  },
  {
    id: 'faq_pk171_measure_dimensions_accurately',
    category: 'Packaging, Weight & Dimensions',
    mainQuestion: 'How do I measure my cargo dimensions accurately?',
    alternativeQuestions: ['Measuring boxes', 'How to measure length width height'],
    keywords: ['measure dimensions', 'accurately', 'length width height'],
    approvedAnswer: 'Measure the extreme outer points: Length, Width, and Height in centimeters. For palletized cargo, measure from the floor (including the wooden pallet) to the highest package point.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 171
  },
  {
    id: 'faq_pk172_fragile_stickers',
    category: 'Packaging, Weight & Dimensions',
    mainQuestion: 'Should I use "Fragile" or "This Side Up" stickers?',
    alternativeQuestions: ['Use fragile labels', 'Orientation stickers on boxes'],
    keywords: ['fragile stickers', 'this side up', 'handling labels'],
    approvedAnswer: 'Yes, prominent "Fragile" and "This Side Up" orientation arrows alert warehouse operators and drivers to handle your cargo upright and with care.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 172
  },
  {
    id: 'faq_pk173_odd_shaped_cargo',
    category: 'Packaging, Weight & Dimensions',
    mainQuestion: 'Can you transport odd-shaped or non-standard cargo?',
    alternativeQuestions: ['Irregular shape freight', 'Long pipes or drums transport'],
    keywords: ['odd-shaped', 'non-standard cargo', 'irregular shape'],
    approvedAnswer: 'Yes, non-standard items like industrial piping, structural metal, or crated equipment can be accommodated on flatbed or 24ft open-sided lorries with prior review.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 173
  },
  {
    id: 'faq_pk174_supply_own_pallets',
    category: 'Packaging, Weight & Dimensions',
    mainQuestion: 'Do I need to supply my own pallets?',
    alternativeQuestions: ['Do you provide pallets?', 'Must shipper provide wooden pallets?'],
    keywords: ['supply own pallets', 'provide pallets', 'pallet supply'],
    approvedAnswer: 'Yes, shippers are responsible for supplying their own industrial or heat-treated export pallets. Our partner trucks transport pre-palletized cargo.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 174
  },
  {
    id: 'faq_pk175_charges_oversized_pallets',
    category: 'Packaging, Weight & Dimensions',
    mainQuestion: 'Are there extra charges for oversized or non-stackable pallets?',
    alternativeQuestions: ['Oversized pallet fee', 'Non stackable pallet charge'],
    keywords: ['extra charges', 'oversized pallets', 'non-stackable'],
    approvedAnswer: 'Pallets that exceed standard 1.2m x 1.0m footprints or cannot be stacked take up extra truck floor area and are billed based on the total vehicle capacity consumed.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 175
  },

  // =========================================================================
  // 9. INSURANCE, CLAIMS & DELAYS (176–190)
  // =========================================================================
  {
    id: 'faq_i176_automatic_cargo_insurance',
    category: 'Insurance, Claims & Delays',
    mainQuestion: 'Is my cargo automatically insured during transit?',
    alternativeQuestions: ['Is insurance included in quote?', 'Are goods automatically insured?'],
    keywords: ['automatically insured', 'cargo insurance', 'transit insurance'],
    approvedAnswer: 'No, cargo is not automatically insured. All carriage is conducted under standard carrier terms of carriage and statutory liability limitations.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 176
  },
  {
    id: 'faq_i177_offer_cargo_insurance',
    category: 'Insurance, Claims & Delays',
    mainQuestion: 'Do you offer cargo insurance?',
    alternativeQuestions: ['Can I buy insurance from Josan?', 'Do you sell marine insurance?'],
    keywords: ['offer cargo insurance', 'buy insurance', 'marine policy'],
    approvedAnswer: 'Josan Logistics does not sell insurance directly. Shippers must procure commercial Marine Cargo / Goods-in-Transit insurance through an authorized insurance underwriter or broker.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 177
  },
  {
    id: 'faq_i178_buy_own_marine_insurance',
    category: 'Insurance, Claims & Delays',
    mainQuestion: 'Should I buy my own marine or transit insurance?',
    alternativeQuestions: ['Is private cargo insurance recommended?', 'Why buy marine insurance?'],
    keywords: ['buy own marine insurance', 'transit insurance', 'recommend insurance'],
    approvedAnswer: 'Yes, we strongly recommend that all commercial shippers maintain an active marine cargo insurance policy covering full invoice value against loss, damage, or accidents during transit.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 178
  },
  {
    id: 'faq_i179_liability_limit',
    category: 'Insurance, Claims & Delays',
    mainQuestion: 'What is your liability limit if goods are damaged?',
    alternativeQuestions: ['Carrier liability limits', 'How much do you pay if goods damaged?'],
    keywords: ['liability limit', 'damaged goods', 'maximum payout', 'terms'],
    approvedAnswer: 'Coordinator and carrier liability is strictly limited under our [Terms of Service](/terms) and applicable transport conventions (typically calculated per kilogram of damaged gross weight).',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 179
  },
  {
    id: 'faq_i180_report_damaged_cargo',
    category: 'Insurance, Claims & Delays',
    mainQuestion: 'How do I report damaged cargo?',
    alternativeQuestions: ['Report broken goods', 'Damage claim notification'],
    keywords: ['report damaged cargo', 'damage claim', 'broken goods'],
    approvedAnswer: 'Endorse the physical delivery order / POD immediately upon delivery noting the damage, take detailed photos before moving the goods, and email contact@josanlogistics.com.sg within 24 hours.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 180
  },
  {
    id: 'faq_i181_claim_lost_missing_items',
    category: 'Insurance, Claims & Delays',
    mainQuestion: 'How do I file a claim for lost or missing items?',
    alternativeQuestions: ['File missing items claim', 'Claim for lost package'],
    keywords: ['file a claim', 'lost items', 'missing goods'],
    approvedAnswer: 'Submit written notice within 48 hours containing your shipment reference, signed consignment note, itemized Commercial Invoice, and photos of intact external cartons.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 181
  },
  {
    id: 'faq_i182_time_limit_reporting_damage',
    category: 'Insurance, Claims & Delays',
    mainQuestion: 'What is the time limit for reporting cargo damage?',
    alternativeQuestions: ['Damage reporting deadline', 'How long to report broken goods?'],
    keywords: ['time limit', 'reporting cargo damage', 'deadline'],
    approvedAnswer: 'Visible exterior damage must be noted immediately at the time of delivery on the POD. Formal written claims with photographic evidence must be filed within 24 to 48 hours.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 182
  },
  {
    id: 'faq_i183_proof_needed_damage_claim',
    category: 'Insurance, Claims & Delays',
    mainQuestion: 'What proof do I need to submit a damage claim?',
    alternativeQuestions: ['Evidence for damage claim', 'Documents needed for claim'],
    keywords: ['proof needed', 'damage claim', 'evidence', 'photos'],
    approvedAnswer: 'Required evidence includes: 1) Endorsed Delivery Order noting damage, 2) High-resolution photos of external cartons and damaged internal items, 3) Packing list, and 4) Original commercial invoice.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 183
  },
  {
    id: 'faq_i184_delivery_delayed_what_happens',
    category: 'Insurance, Claims & Delays',
    mainQuestion: 'What happens if my delivery is delayed?',
    alternativeQuestions: ['Delivery delay handling', 'Delayed truck notification'],
    keywords: ['delivery is delayed', 'delay handling', 'late truck'],
    approvedAnswer: 'Operations monitors active dispatches and alerts you promptly if unexpected delays arise from traffic congestion, port gate queues, or bad weather, providing revised delivery estimates.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 184
  },
  {
    id: 'faq_i185_guarantee_delivery_times',
    category: 'Insurance, Claims & Delays',
    mainQuestion: 'Do you guarantee delivery times?',
    alternativeQuestions: ['Guaranteed delivery hour', 'Do you offer time guarantees?'],
    keywords: ['guarantee delivery times', 'time guarantee', 'delivery promise'],
    approvedAnswer: 'No, delivery times are estimates and cannot be guaranteed, as road traffic, weather conditions, port security queues, and customer loading bay bottlenecks are beyond carrier control.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 185
  },
  {
    id: 'faq_i186_recipient_not_available',
    category: 'Insurance, Claims & Delays',
    mainQuestion: 'What if the recipient is not available when the truck arrives?',
    alternativeQuestions: ['Consignee not at delivery dock', 'No one to receive cargo'],
    keywords: ['recipient not available', 'consignee absent', 'nobody at dock'],
    approvedAnswer: 'The driver will attempt contact via the provided site phone. If no authorized personnel can receive the cargo within the grace period, the vehicle must depart to prevent network delays.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 186
  },
  {
    id: 'faq_i187_redelivery_fee',
    category: 'Insurance, Claims & Delays',
    mainQuestion: 'Is there a redelivery fee if the first attempt fails?',
    alternativeQuestions: ['Redelivery charge', 'Cost for second delivery attempt'],
    keywords: ['redelivery fee', 'second attempt fee', 'failed delivery charge'],
    approvedAnswer: 'Yes, if a delivery attempt fails due to recipient unavailability, dock closure, or incorrect site addresses, a standard partner redelivery fee is charged for the second dispatch trip.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 187
  },
  {
    id: 'faq_i188_wrong_item_delivered',
    category: 'Insurance, Claims & Delays',
    mainQuestion: 'What happens if the wrong item is delivered?',
    alternativeQuestions: ['Wrong cargo received', 'Incorrect delivery delivered'],
    keywords: ['wrong item delivered', 'incorrect delivery', 'wrong goods'],
    approvedAnswer: 'Please notify our operations team immediately at +65 6789 0123. Do not sign for or unpack the goods; our dispatch team will intercept the vehicle and correct the dispatch routing.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 188
  },
  {
    id: 'faq_i189_delays_weather_customs',
    category: 'Insurance, Claims & Delays',
    mainQuestion: 'Are you responsible for delays caused by weather or customs?',
    alternativeQuestions: ['Force majeure delays', 'Customs delay liability'],
    keywords: ['responsible for delays', 'weather', 'customs delays', 'force majeure'],
    approvedAnswer: 'No, coordinators and carriers are not legally liable for delays resulting from Force Majeure events, severe monsoon weather, airport security halts, or customs audit inspections.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 189
  },
  {
    id: 'faq_i190_urgent_delivery_escalation',
    category: 'Insurance, Claims & Delays',
    mainQuestion: 'Who do I escalate an urgent delivery issue to?',
    alternativeQuestions: ['Emergency delivery escalation', 'Urgent logistics issue contact'],
    keywords: ['escalate', 'urgent delivery issue', 'emergency contact'],
    approvedAnswer: 'For urgent in-transit escalations, call our operations management desk directly at +65 6789 0123 or email contact@josanlogistics.com.sg with subject "URGENT ESCALATION".',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 190
  },

  // =========================================================================
  // 10. COMPANY INFO, LOCATION & CONTACT (191–205)
  // =========================================================================
  {
    id: 'faq_co191_where_located',
    category: 'Company Info, Location & Contact',
    mainQuestion: 'Where is Josan Logistics located?',
    alternativeQuestions: ['Where is your office?', 'Josan Logistics location'],
    keywords: ['where located', 'office location', 'sim lim tower'],
    approvedAnswer: 'Josan Logistics is located at Sim Lim Tower, 10 Jalan Besar, #10-01, Singapore 208787.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 191
  },
  {
    id: 'faq_co192_exact_office_address',
    category: 'Company Info, Location & Contact',
    mainQuestion: 'What is your exact office address?',
    alternativeQuestions: ['Company full address', 'Office postal code'],
    keywords: ['exact office address', 'postal code', 'registered address'],
    approvedAnswer: 'Our registered office address is: Sim Lim Tower, 10 Jalan Besar, #10-01, Singapore 208787.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 192
  },
  {
    id: 'faq_co193_operating_hours',
    category: 'Company Info, Location & Contact',
    mainQuestion: 'What are your operating hours?',
    alternativeQuestions: ['Opening hours', 'Business hours', 'When are you open?'],
    keywords: ['operating hours', 'business hours', 'opening hours'],
    approvedAnswer: 'Our standard customer support and operations hours are Monday to Friday, 9:00 AM to 6:00 PM (Singapore Time, SGT). Please check our [Contact our team](/contact) page for details.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 193
  },
  {
    id: 'faq_co194_open_weekends_holidays',
    category: 'Company Info, Location & Contact',
    mainQuestion: 'Are you open on Saturdays, Sundays, or public holidays?',
    alternativeQuestions: ['Open on weekends?', 'Holiday opening hours'],
    keywords: ['saturdays', 'sundays', 'public holidays', 'weekend hours'],
    approvedAnswer: 'We are open on Saturday mornings for pre-arranged dispatches. Our office is closed on Sundays and Singapore Gazetted Public Holidays.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 194
  },
  {
    id: 'faq_co195_24_7_customer_support',
    category: 'Company Info, Location & Contact',
    mainQuestion: 'Do you offer 24/7 customer support?',
    alternativeQuestions: ['24 hour customer service', 'Are you 24/7?'],
    keywords: ['24/7', 'customer support', '24 hours'],
    approvedAnswer: 'No, Josan Logistics does not provide 24/7 customer support. Messages submitted outside business hours are answered promptly on the next business day morning.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 195
  },
  {
    id: 'faq_co196_phone_number',
    category: 'Company Info, Location & Contact',
    mainQuestion: 'What is your phone number?',
    alternativeQuestions: ['Hotline number', 'Customer service phone'],
    keywords: ['phone number', 'hotline', 'contact number', 'call'],
    approvedAnswer: 'You can reach our main office and operations team by phone at +65 6789 0123 during business hours.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 196
  },
  {
    id: 'faq_co197_whatsapp_number',
    category: 'Company Info, Location & Contact',
    mainQuestion: 'Do you have a WhatsApp number for quick inquiries?',
    alternativeQuestions: ['Can I WhatsApp you?', 'WhatsApp support'],
    keywords: ['whatsapp', 'quick inquiries', 'mobile chat'],
    approvedAnswer: 'Commercial quote inquiries and bookings can be submitted directly via our online form on [Request a Quote](/quote) or by emailing contact@josanlogistics.com.sg.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 197
  },
  {
    id: 'faq_co198_customer_support_email',
    category: 'Company Info, Location & Contact',
    mainQuestion: 'What is your customer support email address?',
    alternativeQuestions: ['Company email', 'Where to send inquiries?'],
    keywords: ['customer support email', 'email address', 'inbox'],
    approvedAnswer: 'Our general inquiries and support email is contact@josanlogistics.com.sg.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 198
  },
  {
    id: 'faq_co199_walk_in_sim_lim_office',
    category: 'Company Info, Location & Contact',
    mainQuestion: 'Can I walk into your Sim Lim Tower office?',
    alternativeQuestions: ['Can I visit your office?', 'Office walk in visit'],
    keywords: ['walk into', 'sim lim office', 'visit office', 'appointment'],
    approvedAnswer: 'Visits to our administrative office at Sim Lim Tower are by appointment only. Please contact our team in advance before visiting.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 199
  },
  {
    id: 'faq_co200_cargo_drop_off_at_office',
    category: 'Company Info, Location & Contact',
    mainQuestion: 'Can I drop off cargo at your Sim Lim Tower office?',
    alternativeQuestions: ['Can I bring parcels to Sim Lim Tower?', 'Drop off goods at office'],
    keywords: ['drop off cargo', 'sim lim tower', 'drop off office'],
    approvedAnswer: 'No. Sim Lim Tower is an administrative and documentation office, not a cargo depot. All cargo is collected directly from your premises or delivered directly to Changi Airport terminals.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 200
  },
  {
    id: 'faq_co201_warehouse_storage_self_collection',
    category: 'Company Info, Location & Contact',
    mainQuestion: 'Do you have a warehouse for storage or self-collection?',
    alternativeQuestions: ['Do you offer warehousing?', 'Self-collection point'],
    keywords: ['warehouse', 'storage', 'self-collection'],
    approvedAnswer: 'We coordinate direct point-to-point road deliveries and airline cargo terminal drop-offs; we do not operate a public walk-in self-collection warehouse.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 201
  },
  {
    id: 'faq_co202_business_uen',
    category: 'Company Info, Location & Contact',
    mainQuestion: "What is Josan Logistics' business registration / UEN?",
    alternativeQuestions: ['Company UEN number', 'ACRA registration number'],
    keywords: ['business registration', 'uen', 'acra', 'company number'],
    approvedAnswer: 'Josan Logistics Pte. Ltd. is incorporated and registered under Singapore ACRA laws. Our UEN is stated on all official tax invoices and our [Terms of Service](/terms).',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 202
  },
  {
    id: 'faq_co203_operating_history',
    category: 'Company Info, Location & Contact',
    mainQuestion: 'How long has Josan Logistics been operating?',
    alternativeQuestions: ['Company history', 'How many years operating?'],
    keywords: ['how long', 'operating', 'history', 'company profile'],
    approvedAnswer: 'Josan Logistics has been providing commercial freight coordination and documentation services in Singapore, connecting businesses with vetted carrier partners.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 203
  },
  {
    id: 'faq_co204_freight_coordinator_vs_carrier',
    category: 'Company Info, Location & Contact',
    mainQuestion: 'What is the difference between a freight coordinator and a carrier?',
    alternativeQuestions: ['Why use a freight coordinator?', 'Coordinator vs transport operator'],
    keywords: ['freight coordinator', 'carrier', 'difference'],
    approvedAnswer: 'A carrier physically owns and operates vehicles. A freight coordinator manages logistics documentation (AWBs, DOs), audits compliance, schedules partner fleets, and manages end-to-end transport execution for shippers.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 204
  },
  {
    id: 'faq_co205_hiring_drivers_staff',
    category: 'Company Info, Location & Contact',
    mainQuestion: 'Are you hiring drivers or logistics staff?',
    alternativeQuestions: ['Job vacancies at Josan', 'Are you hiring?'],
    keywords: ['hiring', 'drivers', 'staff', 'careers', 'jobs'],
    approvedAnswer: 'For career opportunities and transport partner collaborations, please email your resume or company credentials to contact@josanlogistics.com.sg.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 205
  },

  // =========================================================================
  // 11. CORPORATE ACCOUNTS & PARTNERSHIPS (206–210)
  // =========================================================================
  {
    id: 'faq_cp206_open_corporate_account',
    category: 'Corporate Accounts & Partnerships',
    mainQuestion: 'How do I open a corporate account with Josan Logistics?',
    alternativeQuestions: ['Corporate account application', 'Open business account'],
    keywords: ['open corporate account', 'business account', 'corporate application'],
    approvedAnswer: 'To open a corporate credit account, email contact@josanlogistics.com.sg with your ACRA BizFile, company contact details, and projected monthly shipping volume for credit review.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 206
  },
  {
    id: 'faq_cp207_work_with_ecommerce_wholesalers',
    category: 'Corporate Accounts & Partnerships',
    mainQuestion: 'Do you work with e-commerce businesses or B2B wholesalers?',
    alternativeQuestions: ['B2B wholesale logistics', 'Support for ecommerce distributors'],
    keywords: ['e-commerce', 'b2b wholesalers', 'distributors', 'merchants'],
    approvedAnswer: 'Yes, we specialize in bulk pallet distribution, warehouse replenishment, and airport freight documentation for B2B wholesalers, industrial manufacturers, and commercial trade distributors.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 207
  },
  {
    id: 'faq_cp208_long_term_contracts',
    category: 'Corporate Accounts & Partnerships',
    mainQuestion: 'Can we sign a long-term logistics contract?',
    alternativeQuestions: ['Annual transport contract', 'Service level agreement SLA'],
    keywords: ['long-term contract', 'sla', 'service level agreement', 'contracted rates'],
    approvedAnswer: 'Yes, we enter into tailored long-term Service Level Agreements (SLAs) with regular commercial shippers, providing fixed schedule allocations and priority partner dispatch.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 208
  },
  {
    id: 'faq_cp209_trucking_partner_operator',
    category: 'Corporate Accounts & Partnerships',
    mainQuestion: 'How can my trucking company become a partner operator?',
    alternativeQuestions: ['Join Josan as transport partner', 'Truck owner partnership'],
    keywords: ['trucking company', 'partner operator', 'carrier partner', 'subcontractor'],
    approvedAnswer: 'Licensed commercial transport operators with compliant 14ft, 24ft box trucks, or prime movers can email ops@josanlogistics.com.sg with company profile, fleet list, and insurance coverage.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 209
  },
  {
    id: 'faq_cp210_business_partnerships_tenders',
    category: 'Corporate Accounts & Partnerships',
    mainQuestion: 'Who should I contact for business partnerships or tenders?',
    alternativeQuestions: ['Corporate tenders contact', 'Logistics tender invitation'],
    keywords: ['business partnerships', 'tenders', 'rfp', 'proposals'],
    approvedAnswer: 'Corporate partnership proposals, commercial logistics tenders, and RFPs should be directed to our commercial management team at contact@josanlogistics.com.sg.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 210
  },
  {
    id: 'faq_cp211_create_customer_account',
    category: 'Corporate Accounts & Partnerships',
    mainQuestion: 'How do I create an account with Josan Logistics?',
    alternativeQuestions: [
      'How to create an account',
      'How to sign up',
      'Account registration',
      'Create account on website',
      'How to register'
    ],
    keywords: [
      'create account',
      'sign up',
      'register',
      'registration',
      'new account',
      'details needed',
      'account creation'
    ],
    approvedAnswer: 'To create a customer account, click "Sign In / Register" in the top navigation bar or visit our [Request a Quote](/quote) page and select "Create Account". Enter your Name, Company Name, Email Address, Contact Number, and password to instantly manage quotes, bookings, and active tracking.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 211
  },
  {
    id: 'faq_cp212_do_i_need_an_account',
    category: 'Corporate Accounts & Partnerships',
    mainQuestion: 'Do I need an account to book or track cargo with Josan Logistics?',
    alternativeQuestions: [
      'Do I need an account?',
      'Can I track without an account?',
      'Is an account required to request a quote?'
    ],
    keywords: [
      'need account',
      'account required',
      'track without account',
      'book without account'
    ],
    approvedAnswer: 'No account is required to track cargo—you can track shipments 24/7 on our public [Track Shipment](/track) page using your reference number. For requesting quotes and booking transport, creating a free account is recommended to save your details, view booking records, and receive formal quotations.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 212
  },
  {
    id: 'faq_cp213_forgot_reset_password',
    category: 'Corporate Accounts & Partnerships',
    mainQuestion: 'How do I reset my password if I cannot log in?',
    alternativeQuestions: [
      'Forgot password',
      'How to reset password',
      'Cannot login to my account',
      'Change password'
    ],
    keywords: [
      'forgot password',
      'reset password',
      'cannot login',
      'change password',
      'password recovery'
    ],
    approvedAnswer: 'If you forgot your password, click "Sign In" in the top navigation bar, then click the "Forgot Password?" link below the password field. Enter your registered email to receive a password reset link. For urgent assistance, reach out via our [Contact our team](/contact) page.',
    hasQuoteAction: false,
    isActive: true,
    displayOrder: 213
  },
  {
    id: 'faq_cp214_how_josan_works',
    category: 'Company Info, Location & Contact',
    mainQuestion: 'How does Josan Logistics work?',
    alternativeQuestions: [
      'How josan works',
      'How do you operate?',
      'What is Josan Logistics?',
      'Tell me about Josan Logistics',
      'How does shipping with you work?',
      'How does this work?'
    ],
    keywords: [
      'how',
      'works',
      'work',
      'operate',
      'process',
      'about',
      'josan',
      'coordinator',
      'overview'
    ],
    approvedAnswer: 'Josan Logistics is a Singapore-based freight coordinator that arranges commercial road transport (14ft and 24ft box trucks, prime movers) and air freight documentation through vetted partner operators. Customers submit cargo details on our [Request a Quote](/quote) page, our operations team confirms vehicle availability and pricing, and we coordinate dispatch, tracking, and electronic proof of delivery (e-POD). For custom freight assistance, visit our [Services](/services) page or reach out on our [Contact our team](/contact) page.',
    hasQuoteAction: true,
    isActive: true,
    displayOrder: 214
  }
];

// In-Memory Database Cache initialized with all 210 approved FAQs
let inMemoryFaqs = [...INITIAL_FAQS];
let inMemoryUnanswered = [];

/**
 * Get all FAQs (Active and Inactive) for Admin Management
 */
export async function getAllFaqs() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('chatbot_faqs')
        .select('*')
        .order('display_order', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map(row => ({
          id: row.id,
          category: row.category,
          mainQuestion: row.main_question,
          alternativeQuestions: Array.isArray(row.alternative_questions) ? row.alternative_questions : [],
          keywords: Array.isArray(row.keywords) ? row.keywords : [],
          approvedAnswer: row.approved_answer,
          hasQuoteAction: Boolean(row.has_quote_action),
          isActive: Boolean(row.is_active),
          displayOrder: row.display_order || 0,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        }));
      }
    } catch (_err) {}
  }
  return inMemoryFaqs;
}

/**
 * Get Active FAQs for Public Matching Engine
 */
export async function getActiveFaqs() {
  const all = await getAllFaqs();
  return all.filter(f => f.isActive);
}

/**
 * Add New FAQ Entry (Admin)
 */
export async function addFaq(faqInput) {
  const id = faqInput.id || `faq_${Date.now()}`;
  const newFaq = {
    id,
    category: faqInput.category || 'General',
    mainQuestion: (faqInput.mainQuestion || faqInput.q || '').trim(),
    alternativeQuestions: Array.isArray(faqInput.alternativeQuestions) 
      ? faqInput.alternativeQuestions.map(s => String(s).trim()).filter(Boolean)
      : [],
    keywords: Array.isArray(faqInput.keywords)
      ? faqInput.keywords.map(k => String(k).trim().toLowerCase()).filter(Boolean)
      : [],
    approvedAnswer: (faqInput.approvedAnswer || faqInput.a || '').trim(),
    hasQuoteAction: Boolean(faqInput.hasQuoteAction),
    isActive: faqInput.isActive !== undefined ? Boolean(faqInput.isActive) : true,
    displayOrder: faqInput.displayOrder || inMemoryFaqs.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  inMemoryFaqs.push(newFaq);

  if (isSupabaseConfigured) {
    try {
      await supabase.from('chatbot_faqs').insert([{
        id: newFaq.id,
        category: newFaq.category,
        main_question: newFaq.mainQuestion,
        alternative_questions: newFaq.alternativeQuestions,
        keywords: newFaq.keywords,
        approved_answer: newFaq.approvedAnswer,
        has_quote_action: newFaq.hasQuoteAction,
        is_active: newFaq.isActive,
        display_order: newFaq.displayOrder,
        created_at: newFaq.createdAt,
        updated_at: newFaq.updatedAt
      }]);
    } catch (_err) {}
  }

  return newFaq;
}

/**
 * Update Existing FAQ Entry (Admin)
 */
export async function updateFaq(id, updates) {
  const existingIdx = inMemoryFaqs.findIndex(f => f.id === id);
  if (existingIdx === -1) {
    return { error: 'FAQ not found' };
  }

  const updated = {
    ...inMemoryFaqs[existingIdx],
    ...(updates.category ? { category: updates.category } : {}),
    ...(updates.mainQuestion ? { mainQuestion: updates.mainQuestion.trim() } : {}),
    ...(updates.alternativeQuestions !== undefined ? {
      alternativeQuestions: updates.alternativeQuestions.map(s => String(s).trim()).filter(Boolean)
    } : {}),
    ...(updates.keywords !== undefined ? {
      keywords: updates.keywords.map(k => String(k).trim().toLowerCase()).filter(Boolean)
    } : {}),
    ...(updates.approvedAnswer ? { approvedAnswer: updates.approvedAnswer.trim() } : {}),
    ...(updates.hasQuoteAction !== undefined ? { hasQuoteAction: Boolean(updates.hasQuoteAction) } : {}),
    ...(updates.isActive !== undefined ? { isActive: Boolean(updates.isActive) } : {}),
    ...(updates.displayOrder !== undefined ? { displayOrder: updates.displayOrder } : {}),
    updatedAt: new Date().toISOString()
  };

  inMemoryFaqs[existingIdx] = updated;

  if (isSupabaseConfigured) {
    try {
      await supabase.from('chatbot_faqs').update({
        category: updated.category,
        main_question: updated.mainQuestion,
        alternative_questions: updated.alternativeQuestions,
        keywords: updated.keywords,
        approved_answer: updated.approvedAnswer,
        has_quote_action: updated.hasQuoteAction,
        is_active: updated.isActive,
        display_order: updated.displayOrder,
        updated_at: updated.updatedAt
      }).eq('id', id);
    } catch (_err) {}
  }

  return updated;
}

/**
 * Delete FAQ Entry (Admin)
 */
export async function deleteFaq(id) {
  inMemoryFaqs = inMemoryFaqs.filter(f => f.id !== id);

  if (isSupabaseConfigured) {
    try {
      await supabase.from('chatbot_faqs').delete().eq('id', id);
    } catch (_err) {}
  }

  return { success: true, deletedId: id };
}

/**
 * Log an Unanswered Question (Privacy Conscious)
 */
export async function logUnansweredQuestion({ question, normalizedQuestion, confidenceScore = 0, closestFaqId = null, sessionId = null, ipHash = null }) {
  const logEntry = {
    id: `unans_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    rawQuestion: question,
    normalizedQuestion,
    confidenceScore: Number(confidenceScore).toFixed(3),
    closestFaqId,
    sessionId: sessionId || 'anonymous',
    ipHash: ipHash || 'anonymous',
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  inMemoryUnanswered.unshift(logEntry);
  if (inMemoryUnanswered.length > 500) {
    inMemoryUnanswered = inMemoryUnanswered.slice(0, 500);
  }

  if (isSupabaseConfigured) {
    try {
      await supabase.from('chatbot_unanswered_logs').insert([{
        id: crypto.randomUUID(),
        raw_question: logEntry.rawQuestion,
        normalized_question: logEntry.normalizedQuestion,
        confidence_score: parseFloat(logEntry.confidenceScore),
        closest_faq_id: logEntry.closestFaqId,
        session_id: logEntry.sessionId,
        ip_hash: logEntry.ipHash,
        status: logEntry.status,
        created_at: logEntry.createdAt
      }]);
    } catch (_err) {}
  }

  return logEntry;
}

/**
 * Get All Unanswered Questions (Admin)
 */
export async function getUnansweredQuestions() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('chatbot_unanswered_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (!error && data && data.length > 0) {
        return data.map(row => ({
          id: row.id,
          rawQuestion: row.raw_question,
          normalizedQuestion: row.normalized_question,
          confidenceScore: row.confidence_score,
          closestFaqId: row.closest_faq_id,
          sessionId: row.session_id,
          ipHash: row.ip_hash,
          status: row.status,
          createdAt: row.created_at
        }));
      }
    } catch (_err) {}
  }
  return inMemoryUnanswered;
}

/**
 * Delete / Dismiss an Unanswered Question Log (Admin)
 */
export async function deleteUnansweredQuestion(id) {
  inMemoryUnanswered = inMemoryUnanswered.filter(item => item.id !== id);

  if (isSupabaseConfigured) {
    try {
      await supabase.from('chatbot_unanswered_logs').delete().eq('id', id);
    } catch (_err) {}
  }

  return { success: true, deletedId: id };
}
