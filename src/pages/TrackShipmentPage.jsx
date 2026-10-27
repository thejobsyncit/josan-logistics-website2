import React, { useState, useEffect, useRef } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { RealTruckGraphic } from '../components/RealTruckGraphic';
import { SingaporeGoogleMapBackground } from '../components/SingaporeGoogleMapBackground';
import { TurnstileCaptcha } from '../components/TurnstileCaptcha';
import { getRateLimitStatus, recordRateLimitAttempt, checkServerIpRateLimit } from '../utils/rateLimiter';
import { 
  Search, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck, 
  ShieldCheck, 
  Phone, 
  Printer, 
  Navigation,
  Package,
  User,
  ExternalLink,
  ChevronRight,
  X,
  Maximize2,
  ArrowLeft,
  RotateCw,
  Lock,
  Plane,
  Copy,
  Check,
  Mail,
  AlertCircle
} from 'lucide-react';

const DEMO_SHIPMENTS_MAP = {
  'AWB-880-49201844': {
    id: 'AWB-880-49201844',
    awbNumber: '880-49201844',
    referenceNumber: 'AWB-880-49201844',
    mode: 'Air Freight',
    status: 'In Flight',
    origin: 'Singapore Changi Airfreight Centre (SIN)',
    destination: 'Frankfurt CargoCity South (FRA)',
    originCity: 'Singapore (SIN)',
    destinationCity: 'Frankfurt (FRA)',
    currentLocation: 'In Flight — B777F Freighter (Cruising FL340, Bay of Bengal)',
    flightNumber: 'SQ-7922 Cargo Freighter',
    estimatedDelivery: 'Tomorrow, 08:30 AM (CET)',
    lastUpdatedTime: '12 mins ago (ACARS Telemetry)',
    lastUpdatedTimestamp: '2026-10-22T17:25:00+08:00',
    serviceLevel: 'Express Air Freight (Next Flight Out)',
    cargoType: 'Temperature-Controlled Pharmaceuticals (2°C - 8°C)',
    transportPartner: 'Singapore Airlines Cargo (SQ)',
    vehicle: 'Boeing 777-200F Cargo Freighter',
    vehiclePlate: '9V-SFP',
    vehicleType: 'Commercial Widebody Freighter',
    sender: 'Novartis Biome Changi Park',
    senderAddress: '8 Changi Business Park Ave 1, Singapore 486018',
    receiver: 'Bayer AG Distribution Center Frankfurt',
    receiverAddress: 'CargoCity Süd, Geb. 558, 60549 Frankfurt am Main, Germany',
    weight: '3,850 kg',
    chargeableWeight: '4,200 kg',
    pieces: 14,
    declaredValue: 'S$ 420,000',
    price: 'S$ 32,760.00',
    timeline: [
      { step: 1, title: 'Booked', location: 'Singapore Changi Desk', timestamp: '21 Oct 2026, 09:00 AM', completed: true },
      { step: 2, title: 'Documents Prepared', location: 'TradeNet e-AWB Validation Desk', timestamp: '21 Oct 2026, 02:00 PM', completed: true },
      { step: 3, title: 'Handed to Airline', location: 'SATS Apron ULD Cargo Bay', timestamp: '22 Oct 2026, 01:30 AM', completed: true },
      { step: 4, title: 'In Flight', location: 'SIN Runway 02L → Cruising FL340 (SQ-7922)', timestamp: '22 Oct 2026, 04:15 AM', completed: true, current: true },
      { step: 5, title: 'Arrived', location: 'Frankfurt Airport Runway 25C (FRA)', timestamp: 'Expected 22 Oct 2026, 06:00 PM', completed: false },
      { step: 6, title: 'Cleared', location: 'Zollamt Frankfurt Flughafen Customs', timestamp: 'Expected 22 Oct 2026, 09:00 PM', completed: false },
      { step: 7, title: 'Delivered', location: 'Bayer AG Receiving Dock Frankfurt', timestamp: 'Expected 23 Oct 2026, 08:30 AM', completed: false }
    ]
  },
  'JOS-AIR-7720-SG': {
    id: 'JOS-AIR-7720-SG',
    awbNumber: '618-77209142',
    referenceNumber: 'AWB-618-77209142',
    mode: 'Air Freight',
    status: 'Handed to Airline',
    origin: 'Singapore Changi Airfreight Centre (SIN)',
    destination: 'Tokyo Narita Air Cargo Terminal (NRT)',
    originCity: 'Singapore (SIN)',
    destinationCity: 'Tokyo (NRT)',
    currentLocation: 'Changi Airfreight Terminal 2 — Pallet Inspection Bay',
    flightNumber: 'NH-8422 Freighter',
    estimatedDelivery: 'Tomorrow, 02:00 PM (JST)',
    lastUpdatedTime: '4 mins ago (Ramp RFID Scan)',
    lastUpdatedTimestamp: '2026-10-22T17:35:00+08:00',
    serviceLevel: 'Airport-to-Airport Air Cargo Service',
    cargoType: 'High-Value Semiconductor Wafers & Sensors',
    transportPartner: 'All Nippon Airways Cargo (NH)',
    vehicle: 'Boeing 767-300BCF Freighter',
    vehiclePlate: 'JA604F',
    vehicleType: 'Dedicated Cargo Freighter',
    sender: 'Silicon Systems Singapore Pte Ltd',
    senderAddress: '12 Science Park Drive, Singapore 118225',
    receiver: 'Tokyo Electron Logistics Center Narita',
    receiverAddress: 'Narita Airport Cargo Area Gate 3, Chiba, Japan',
    weight: '1,420 kg',
    chargeableWeight: '1,650 kg',
    pieces: 6,
    declaredValue: 'S$ 280,000',
    price: 'S$ 12,870.00',
    timeline: [
      { step: 1, title: 'Booked', location: 'Changi Logistics Operations Desk', timestamp: '22 Oct 2026, 06:00 AM', completed: true },
      { step: 2, title: 'Documents Prepared', location: 'e-AWB & Security Documentation', timestamp: '22 Oct 2026, 11:30 AM', completed: true },
      { step: 3, title: 'Handed to Airline', location: 'DNATA Changi Air Cargo CFS 2 Apron', timestamp: '22 Oct 2026, 02:30 PM', completed: true, current: true },
      { step: 4, title: 'In Flight', location: 'SIN Runway 20R (NH-8422)', timestamp: 'Expected 22 Oct 2026, 05:45 PM', completed: false },
      { step: 5, title: 'Arrived', location: 'NRT Cargo Runway 16R', timestamp: 'Expected 23 Oct 2026, 01:30 AM', completed: false },
      { step: 6, title: 'Cleared', location: 'Tokyo Customs Air Terminal', timestamp: 'Expected 23 Oct 2026, 05:00 AM', completed: false },
      { step: 7, title: 'Delivered', location: 'Tokyo Electron Facility Narita', timestamp: 'Expected 23 Oct 2026, 02:00 PM', completed: false }
    ]
  },
  'JOS-77102-SG': {
    id: 'JOS-77102-SG',
    referenceNumber: 'REF-7710-SG',
    status: 'In Transit',
    origin: 'Changi Air Cargo Freight Hub',
    destination: 'Woodlands Roadways Terminal',
    currentLocation: 'PIE Expressway Telematics Gate (Exit 19)',
    estimatedDelivery: 'Today, 4:30 PM (SGT)',
    lastUpdatedTime: '5 mins ago (Telematics Ping)',
    serviceLevel: 'Express Road Freight & Highway Linehaul (FTL)',
    cargoType: 'High-Tech Electronics & Components',
    driverName: 'Tan Wei Ming',
    driver: 'Tan Wei Ming',
    driverPhone: '+65 6789 0123',
    vehicle: 'Josan 14-Ton Highway Linehaul Truck #SG-8819',
    vehiclePlate: 'SG-8819',
    vehicleType: '14-Ton Highway Box Truck',
    sender: 'Razer Asia-Pacific Distribution Hub',
    senderAddress: '1 Raffles Place, #20-01, Singapore 048616',
    receiver: 'Woodlands North Logistics Park Gate 4',
    receiverAddress: '10 Woodlands Industrial Park, Singapore 738322',
    weight: '2,450 kg',
    pieces: 8,
    declaredValue: 'S$ 68,500',
    price: 'S$ 740.00',
    timeline: [
      { step: 1, title: 'Book Shipment', location: 'Changi Air Cargo Depot', timestamp: 'Today 08:15 AM', completed: true },
      { step: 2, title: 'Confirmed', location: 'Operations Desk Hub', timestamp: 'Today 09:00 AM', completed: true },
      { step: 3, title: 'Pickup Scheduled', location: 'Changi Air Cargo Depot', timestamp: 'Today 09:45 AM', completed: true },
      { step: 4, title: 'Picked Up', location: 'Depot Loading Bay 4', timestamp: 'Today 10:40 AM', completed: true },
      { step: 5, title: 'In Transit', location: 'PIE Expressway Telematics Gate', timestamp: 'Today 01:20 PM', completed: true, current: true },
      { step: 6, title: 'Near Destination', location: 'Woodlands North Park Bay 2', timestamp: 'Expected 03:45 PM', completed: false },
      { step: 7, title: 'Delivered', location: 'Woodlands Industrial Depot', timestamp: 'Expected 04:30 PM', completed: false }
    ]
  },
  'JOS-44021-SG': {
    id: 'JOS-44021-SG',
    referenceNumber: 'REF-4402-SG',
    status: 'Near Destination',
    origin: 'Pasir Panjang Terminal Gate',
    destination: 'Woodlands Tech Park',
    currentLocation: 'BKE Expressway Exit 3 (Approaching Tech Park)',
    estimatedDelivery: 'Today, 5:15 PM (SGT)',
    lastUpdatedTime: '3 mins ago (Proximity Checkpoint)',
    serviceLevel: 'Container Road Trucking & Trailer Haulage',
    cargoType: 'Industrial Precision Components & Dies',
    driverName: 'Muhammad Rizal',
    driver: 'Muhammad Rizal',
    driverPhone: '+65 8234 5678',
    vehicle: 'Volvo Heavy Container Truck #SG-4402',
    vehiclePlate: 'SG-4402',
    vehicleType: 'Heavy Prime Mover Haulier',
    sender: 'PSA Pasir Panjang Road Gate',
    senderAddress: '33 Harbour Drive, Singapore 117606',
    receiver: 'Woodlands High-Tech Industrial Park',
    receiverAddress: '21 Woodlands Loop, Singapore 738322',
    weight: '14,200 kg',
    pieces: 12,
    declaredValue: 'S$ 145,000',
    price: 'S$ 1,280.00',
    otpActive: '749201',
    timeline: [
      { step: 1, title: 'Book Shipment', location: 'Pasir Panjang Terminal Berth 5', timestamp: 'Today 08:30 AM', completed: true },
      { step: 2, title: 'Confirmed', location: 'Port Gate Operations', timestamp: 'Today 09:15 AM', completed: true },
      { step: 3, title: 'Pickup Scheduled', location: 'Berth 5 Inspection Bay', timestamp: 'Today 10:00 AM', completed: true },
      { step: 4, title: 'Picked Up', location: 'Port Gate Weighbridge', timestamp: 'Today 11:30 AM', completed: true },
      { step: 5, title: 'In Transit', location: 'Expressway Route Corridor', timestamp: 'Today 01:15 PM', completed: true },
      { step: 6, title: 'Near Destination', location: 'BKE Expressway Exit 3 Gate', timestamp: 'Today 02:45 PM', completed: true, current: true },
      { step: 7, title: 'Delivered', location: 'Woodlands Loop Depot Dock 3', timestamp: 'Expected Today, 05:15 PM', completed: false }
    ]
  },
  'JOS-66301-SG': {
    id: 'JOS-66301-SG',
    referenceNumber: 'REF-6630-SG',
    status: 'Delivered',
    origin: 'Pasir Panjang Logistics Terminal',
    destination: 'Biopolis Bio-Hub Research Dock',
    currentLocation: 'Biopolis Biomedical Dock Bay 2, Singapore',
    estimatedDelivery: 'Delivered Today, 11:15 AM (SGT)',
    lastUpdatedTime: 'Today, 11:15 AM (Handover Signed)',
    serviceLevel: 'Refrigerated Road Cold-Chain (2°C - 8°C)',
    cargoType: 'Vaccine & Temperature-Sensitive Pharma',
    driverName: 'Gurpreet Singh',
    driver: 'Gurpreet Singh',
    driverPhone: '+65 9876 5432',
    vehicle: 'Josan Reefer Highway Truck #SG-6630',
    vehiclePlate: 'SG-6630',
    vehicleType: 'Refrigerated Cold-Chain Van',
    sender: 'Pasir Panjang Cold Storage Hub',
    senderAddress: '10 Pasir Panjang Road, Singapore 117438',
    receiver: 'Biopolis Medical Research Hub',
    receiverAddress: '8 Biomedical Grove, Singapore 138665',
    weight: '1,850 kg',
    pieces: 18,
    declaredValue: 'S$ 310,000',
    price: 'S$ 890.00',
    pod: {
      recipientName: 'Dr. Evelyn Tan (Biopolis Receiving Head)',
      recipientSignature: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60"><path d="M 10 40 Q 50 10 90 35 T 180 20" fill="none" stroke="%2310182D" stroke-width="3"/></svg>',
      photo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
      deliveredAt: 'Today, 11:15 AM (SGT)',
      remarks: 'Vaccine cold chain unbroken at 3.8°C. Seals intact, e-POD confirmed.'
    },
    timeline: [
      { step: 1, title: 'Book Shipment', location: 'Pasir Panjang Cold Hub', timestamp: 'Today 05:30 AM', completed: true },
      { step: 2, title: 'Confirmed', location: 'Quality Assurance Desk', timestamp: 'Today 06:00 AM', completed: true },
      { step: 3, title: 'Pickup Scheduled', location: 'Pasir Panjang Bay 1', timestamp: 'Today 06:45 AM', completed: true },
      { step: 4, title: 'Picked Up', location: 'Pasir Panjang Cold Hub Bay 1', timestamp: 'Today 07:15 AM', completed: true },
      { step: 5, title: 'In Transit', location: 'AYE Expressway Highway Corridor', timestamp: 'Today 08:30 AM', completed: true },
      { step: 6, title: 'Near Destination', location: 'Biopolis Biomedical Grove', timestamp: 'Today 10:50 AM', completed: true },
      { step: 7, title: 'Delivered', location: 'Biopolis Vault Bay 2', timestamp: 'Today 11:15 AM', completed: true, current: true }
    ]
  },
  'JOS-99210-SG': {
    id: 'JOS-99210-SG',
    referenceNumber: 'REF-9921-SG',
    status: 'Delayed',
    origin: 'Woodlands Heavy Logistics Hub',
    destination: 'Woodlands Border Checkpoint Hub',
    currentLocation: 'KPE Expressway Highway (Rain Speed Advisory in Effect)',
    estimatedDelivery: 'Today, 07:45 PM (SGT)',
    lastUpdatedTime: '8 mins ago (Telematics Advisory)',
    serviceLevel: 'Commercial Highway Haulage',
    cargoType: 'Heavy Electrical Machinery & 18W Motors',
    driverName: 'Robert Martinez',
    driver: 'Robert Martinez',
    driverPhone: '+65 9112 3456',
    vehicle: '18-Wheeler Multi-Axle Heavy Haulier #SG-9921',
    vehiclePlate: 'SG-9921',
    vehicleType: '18-Wheeler Heavy Lowbed Haulier',
    sender: 'Woodlands Heavy Industrial Yard',
    senderAddress: '20 Woodlands Sector 1, Singapore 738344',
    receiver: 'Woodlands Checkpoint Border Distribution Hub',
    receiverAddress: '900 Woodlands Centre Rd, Singapore 738991',
    weight: '24,800 kg',
    pieces: 3,
    declaredValue: 'S$ 192,000',
    price: 'S$ 1,650.00',
    weatherDelay: {
      active: true,
      condition: 'Heavy Monsoon Rain & Expressway Highway Surface Water Advisory',
      etaImpact: '+45 Mins Buffer Added for Highway Brake Safety Protocol',
      smsSent: true,
      emailSent: true,
      timestamp: 'Today, 01:45 PM'
    },
    timeline: [
      { step: 1, title: 'Book Shipment', location: 'Woodlands Industrial Yard', timestamp: 'Today 07:30 AM', completed: true },
      { step: 2, title: 'Confirmed', location: 'Heavy Haulage Operations', timestamp: 'Today 08:30 AM', completed: true },
      { step: 3, title: 'Pickup Scheduled', location: 'Woodlands Depot Loading Bay', timestamp: 'Today 09:15 AM', completed: true },
      { step: 4, title: 'Picked Up', location: 'Woodlands Heavy Industrial Depot', timestamp: 'Today 09:45 AM', completed: true },
      { step: 5, title: 'In Transit', location: 'KPE Expressway Corridor', timestamp: 'Today 01:45 PM', completed: true, current: true },
      { step: 6, title: 'Near Destination', location: 'Woodlands Centre Gate', timestamp: 'Expected 06:30 PM', completed: false },
      { step: 7, title: 'Delivered', location: 'Woodlands Checkpoint Hub', timestamp: 'Expected 07:45 PM', completed: false }
    ]
  }
};

export const TrackShipmentPage = ({ setActiveTab }) => {
  const { 
    shipments, 
    activeTrackingId, 
    setActiveTrackingId, 
    setSelectedInvoiceShipment,
    setSelectedDetailShipment,
    showToast,
    currentUser,
    setIsAuthModalOpen,
    setAuthRedirectTab,
    shipmentEvents,
    addShipmentEvent,
    getShipmentEvents,
    getLatestShipmentEvent
  } = useLogistics();

  // Check if current user is authorized staff or administrator
  const isStaffOrAdmin = Boolean(
    currentUser && (
      currentUser.role === 'admin' ||
      currentUser.role === 'staff' ||
      currentUser.role === 'crm_manager' ||
      currentUser.role === 'operations_staff' ||
      currentUser.role === 'manager' ||
      currentUser.email?.endsWith('@josanlogistics.com')
    )
  );

  const [searchInput, setSearchInput] = useState(activeTrackingId || '');
  const [trackType, setTrackType] = useState('awb');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [captchaError, setCaptchaError] = useState('');
  const [rateLimitSeconds, setRateLimitSeconds] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Rate limit countdown timer
  useEffect(() => {
    if (rateLimitSeconds <= 0) return;
    const timer = setInterval(() => {
      setRateLimitSeconds((prev) => {
        if (prev <= 1) {
          setCaptchaError('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [rateLimitSeconds]);

  // Check rate limit status on mount
  useEffect(() => {
    const status = getRateLimitStatus('track_shipment', 10, 60000);
    if (!status.allowed) {
      setRateLimitSeconds(status.retryAfter);
      setCaptchaError(`Rate limit active (max 10 attempts/min). Please wait ${status.retryAfter}s.`);
    }
  }, []);

  // Automatically detect tracking type from user input format
  const detectTrackType = (val) => {
    const clean = (val || '').trim().toUpperCase();
    if (!clean) return null;
    if (clean.startsWith('AWB') || /^\d{3}-?\d{4,8}/.test(clean)) {
      return 'awb';
    }
    if (clean.startsWith('REF') || clean.startsWith('LR') || clean.includes('-RD')) {
      return 'reference';
    }
    if (clean.startsWith('JOS') || clean.startsWith('SHP') || clean.includes('-SG')) {
      return 'shipment';
    }
    return null;
  };

  // Format Singapore Time (SGT, UTC+8)
  const formatSingaporeTime = (dateInput) => {
    try {
      const d = dateInput ? new Date(dateInput) : new Date();
      const validDate = isNaN(d.getTime()) ? new Date() : d;
      return new Intl.DateTimeFormat('en-SG', {
        timeZone: 'Asia/Singapore',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(validDate) + ' (SGT)';
    } catch (e) {
      return new Date().toLocaleDateString('en-SG') + ' (SGT)';
    }
  };

  // Get current Singapore time formatted for HTML datetime-local input (YYYY-MM-DDTHH:mm)
  const getCurrentSingaporeDateTimeLocal = () => {
    try {
      const now = new Date();
      const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Singapore',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).formatToParts(now);
      const partMap = {};
      parts.forEach(p => { partMap[p.type] = p.value; });
      return `${partMap.year}-${partMap.month}-${partMap.day}T${partMap.hour}:${partMap.minute}`;
    } catch (e) {
      return new Date().toISOString().slice(0, 16);
    }
  };

  // Helper to extract vehicle type only (e.g. Lorry, Van, Commercial Widebody Freighter), excluding vehicle plate numbers
  const getVehicleTypeDisplay = (shipment) => {
    if (!shipment) return 'Not available yet';
    if (shipment.vehicleType) {
      const cleaned = shipment.vehicleType
        .replace(/#?[A-Z0-9]{2,4}-?[A-Z0-9]{2,6}/gi, '')
        .replace(/\([A-Z0-9-]+\)/gi, '')
        .trim();
      if (cleaned && !cleaned.toLowerCase().includes('cargo unit')) return cleaned;
    }
    if (shipment.mode === 'Air Freight' || shipment.flightNumber || shipment.awbNumber) {
      return 'Commercial Air Freighter';
    }
    if (shipment.vehicle) {
      let cleaned = shipment.vehicle
        .replace(/^Josan\s+/i, '')
        .replace(/#?[A-Z0-9]{2,4}-?[A-Z0-9]{2,6}/gi, '')
        .replace(/\([A-Z0-9-]+\)/gi, '')
        .trim();
      if (cleaned && !cleaned.toLowerCase().includes('cargo unit')) return cleaned;
    }
    return 'Lorry';
  };

  // Helper to safely format real tracking values or supply a clean fallback
  const getRealValueOrFallback = (val, fallback = 'Pending update') => {
    if (val === undefined || val === null || val === '') return fallback;
    if (typeof val === 'string' && !val.trim()) return fallback;
    return val;
  };

  // Standard 7-stage road transportation progression stages
  const ROAD_PROGRESS_STAGES = [
    { num: 1, key: 'Booked', title: 'Booked', defaultLocation: (s) => s.origin || 'Josan Booking Operations' },
    { num: 2, key: 'Confirmed', title: 'Confirmed', defaultLocation: () => 'Josan Operations Dispatch Desk' },
    { num: 3, key: 'Pickup Scheduled', title: 'Pickup Scheduled', defaultLocation: (s) => s.senderAddress || s.origin || 'Consignor Facility' },
    { num: 4, key: 'Picked Up', title: 'Picked Up', defaultLocation: (s) => s.origin || 'Consignment Loading Bay' },
    { num: 5, key: 'In Transit', title: 'In Transit', defaultLocation: (s) => s.currentLocation || 'Expressway Transit Corridor' },
    { num: 6, key: 'Near Destination', title: 'Near Destination', defaultLocation: (s) => s.destination || 'Destination Terminal Approach' },
    { num: 7, key: 'Delivered', title: 'Delivered', defaultLocation: (s) => s.receiverAddress || s.destination || 'Consignee Receiving Dock' }
  ];

  const getRoadStageIndex = (status) => {
    const s = (status || '').trim().toLowerCase();
    if (s.includes('delivered')) return 7;
    if (s.includes('near destination')) return 6;
    if (s.includes('in transit') || s.includes('transit') || s.includes('delayed')) return 5;
    if (s.includes('picked up') || s.includes('weighed') || s.includes('loading')) return 4;
    if (s.includes('pickup scheduled') || s.includes('scheduled')) return 3;
    if (s.includes('confirmed')) return 2;
    if (s.includes('booked')) return 1;
    return 5;
  };

  // 7-stage air freight progression stages (matching actual operational update milestones)
  const AIR_PROGRESS_STAGES = [
    { num: 1, key: 'Booked', title: 'Booked', defaultLocation: (s) => s.origin || 'Changi Airfreight Centre (SIN)' },
    { num: 2, key: 'Documents Prepared', title: 'Documents Prepared', defaultLocation: () => 'e-AWB & Customs Documentation Bay' },
    { num: 3, key: 'Handed to Airline', title: 'Handed to Airline', defaultLocation: () => 'Apron Cargo Terminal / Airline Ramp' },
    { num: 4, key: 'In Flight', title: 'In Flight', defaultLocation: (s) => s.currentLocation || 'Cruising Scheduled Flight Corridor' },
    { num: 5, key: 'Arrived', title: 'Arrived', defaultLocation: (s) => s.destination || 'Destination Airport Runway' },
    { num: 6, key: 'Cleared', title: 'Cleared', defaultLocation: () => 'Destination Customs Cargo Inspection' },
    { num: 7, key: 'Delivered', title: 'Delivered', defaultLocation: (s) => s.receiverAddress || 'Consignee Receiving Dock' }
  ];

  const getAirStageIndex = (status) => {
    const s = (status || '').trim().toLowerCase();
    if (s.includes('delivered')) return 7;
    if (s.includes('cleared') || s.includes('customs') || s.includes('out for delivery')) return 6;
    if (s.includes('arrived') || s.includes('flight arrived') || s.includes('near destination')) return 5;
    if (s.includes('in flight') || s.includes('flight departed') || s.includes('departed') || s.includes('in transit') || s.includes('delayed')) return 4;
    if (s.includes('handed to airline') || s.includes('airline') || s.includes('airport handling') || s.includes('warehouse')) return 3;
    if (s.includes('documents prepared') || s.includes('documentation') || s.includes('confirmed')) return 2;
    if (s.includes('booked')) return 1;
    return 4;
  };

  // Helper to format stage timestamp into "22 Oct 2026, 08:30 AM"
  const getStageDateTimeFormatted = (stageNum, shipment, customStep) => {
    if (customStep && customStep.timestamp && !customStep.timestamp.toLowerCase().includes('expected')) {
      const raw = customStep.timestamp.trim();
      if (/^\d{1,2}\s+[A-Za-z]{3}\s+\d{4},\s+\d{1,2}:\d{2}\s+(AM|PM)/i.test(raw)) {
        return raw;
      }
      const matchMonthDay = raw.match(/^([A-Za-z]{3})\s+(\d{1,2}),?\s+(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
      if (matchMonthDay) {
        const [, m, d, time] = matchMonthDay;
        const dayPadded = d.padStart(2, '0');
        return `${dayPadded} ${m} 2026, ${time}`;
      }
      const matchRel = raw.match(/^(Today|Yesterday),\s*(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
      if (matchRel) {
        const isYesterday = matchRel[1].toLowerCase() === 'yesterday';
        const time = matchRel[2];
        const targetDate = new Date();
        if (isYesterday) targetDate.setDate(targetDate.getDate() - 1);
        const day = String(targetDate.getDate()).padStart(2, '0');
        const month = targetDate.toLocaleString('en-SG', { month: 'short' });
        const year = targetDate.getFullYear();
        return `${day} ${month} ${year}, ${time}`;
      }
      return raw;
    }

    const base = shipment?.createdDate ? new Date(shipment.createdDate) : new Date('2026-10-22T08:00:00+08:00');
    const valid = isNaN(base.getTime()) ? new Date('2026-10-22T08:00:00+08:00') : base;
    const offsetsMin = [0, 45, 90, 150, 240, 390, 510, 600, 720, 840, 960];
    const t = new Date(valid.getTime() + (offsetsMin[stageNum - 1] || 0) * 60000);
    
    const day = String(t.getDate()).padStart(2, '0');
    const month = t.toLocaleString('en-SG', { month: 'short' });
    const year = t.getFullYear();
    let hours = t.getHours();
    const minutes = String(t.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const hoursStr = String(hours).padStart(2, '0');
    return `${day} ${month} ${year}, ${hoursStr}:${minutes} ${ampm}`;
  };

  // Helper to check whether logged-in user is an authorized owner of the shipment (or Admin)
  const checkIsShipmentOwner = (shipment, user) => {
    if (!user || !shipment) return false;
    // Admins have full access to all consignments
    if (user.role === 'admin') return true;

    // Driver assigned to the consignment
    if (user.role === 'driver') {
      const email = (user.email || '').trim().toLowerCase();
      const name = (user.name || '').trim().toLowerCase();
      return Boolean(
        (shipment.driverEmail && shipment.driverEmail.toLowerCase() === email) ||
        (shipment.driverName && shipment.driverName.toLowerCase() === name) ||
        (shipment.driver && shipment.driver.toLowerCase() === name)
      );
    }

    // Customer accounts: must match sender, receiver, company, or customer account details
    const userEmail = (user.email || '').trim().toLowerCase();
    const userName = (user.name || '').trim().toLowerCase();
    const userComp = (user.company || '').trim().toLowerCase();

    const senderEmail = (shipment.senderEmail || shipment.customerEmail || shipment.email || '').trim().toLowerCase();
    const receiverEmail = (shipment.receiverEmail || '').trim().toLowerCase();
    const sender = (shipment.sender || shipment.customer || shipment.customerName || '').trim().toLowerCase();
    const receiver = (shipment.receiver || '').trim().toLowerCase();

    if (userEmail && (senderEmail === userEmail || receiverEmail === userEmail)) return true;
    if (userName && (sender.includes(userName) || receiver.includes(userName))) return true;
    if (userComp && (sender.includes(userComp) || receiver.includes(userComp))) return true;
    if (shipment.customerId && (shipment.customerId === user.id || shipment.customerId === user.customerId)) return true;

    return false;
  };


  
  // Check if a shipment candidate is marked as a test shipment
  const isShipmentTest = (s) => {
    if (!s) return false;
    if (s.isTest) return true;
    const cleanId = (s.id || s.referenceNumber || s.awbNumber || '').toUpperCase();
    const latestEvt = getLatestShipmentEvent ? getLatestShipmentEvent(cleanId) : null;
    return Boolean(latestEvt?.isTest);
  };

  const resolveShipmentData = (sampleOrId) => {
    let searchStr = '';
    if (typeof sampleOrId === 'string') {
      searchStr = sampleOrId.trim();
    } else if (sampleOrId && sampleOrId.id) {
      searchStr = sampleOrId.id.trim();
    }

    if (!searchStr) {
      return null;
    }

    const key = searchStr.toUpperCase();
    let resolved = null;

    // 1. Highest Priority: Exact Demo Map matches for default parcel cards
    if (DEMO_SHIPMENTS_MAP[key]) {
      resolved = { ...DEMO_SHIPMENTS_MAP[key] };
    } else {
      // Match demo by referenceNumber
      const demoByRef = Object.values(DEMO_SHIPMENTS_MAP).find(
        d => d.referenceNumber && d.referenceNumber.toUpperCase() === key
      );
      if (demoByRef) {
        resolved = { ...demoByRef };
      } else {
        // 2. Second Priority: Find in context shipments array
        let found = (shipments || []).find(
          s => s?.id?.toUpperCase() === key || (s?.referenceNumber && s.referenceNumber.toUpperCase() === key)
        );
        if (found) {
          const driverNameVal = found.driverName || found.driver || (typeof sampleOrId === 'object' ? (sampleOrId.driverName || sampleOrId.driver) : null) || 'Tan Wei Ming';
          resolved = {
            ...found,
            driverName: driverNameVal,
            driver: driverNameVal,
            driverPhone: found.driverPhone || (typeof sampleOrId === 'object' ? sampleOrId.driverPhone : null) || '+65 6789 0123',
            vehicle: found.vehicle || (typeof sampleOrId === 'object' ? sampleOrId.vehicle : null) || 'Josan EV Express Cargo Truck (SG-8819)',
            currentLocation: found.currentLocation || 'Singapore Central Dispatch Hub',
            estimatedDelivery: found.estimatedDelivery || 'Today, 5:00 PM (SGT)',
            serviceLevel: found.serviceLevel || 'Express Freight (SG Same-Day)'
          };
        } else if (typeof sampleOrId === 'object' && sampleOrId.id) {
          // 3. Third Priority: Direct sample object passed
          const driverNameVal = sampleOrId.driverName || sampleOrId.driver || 'Tan Wei Ming';
          resolved = {
            id: sampleOrId.id || 'JOS-44021-SG',
            referenceNumber: sampleOrId.referenceNumber || 'REF-8819-SG',
            origin: sampleOrId.origin || 'Changi Air Cargo Depot',
            destination: sampleOrId.dest || sampleOrId.destination || 'Woodlands Roadways Terminal',
            status: sampleOrId.status || 'In Transit',
            currentLocation: sampleOrId.currentLocation || 'PIE Expressway Highway Corridor',
            driverName: driverNameVal,
            driver: driverNameVal,
            driverPhone: sampleOrId.driverPhone || '+65 6789 0123',
            vehicle: sampleOrId.vehicle || 'Josan 14-Ton Highway Linehaul Truck #SG-8819',
            sender: sampleOrId.sender || 'TechCorp Solutions SG',
            senderAddress: sampleOrId.senderAddress || '10 Pasir Panjang Road, Singapore 117438',
            receiver: sampleOrId.receiver || 'Apex Dynamics SG Hub',
            receiverAddress: sampleOrId.receiverAddress || '89 Orchard Road, Singapore 238854',
            weight: sampleOrId.weight || '1,450 kg',
            pieces: sampleOrId.pieces || 4,
            cargoType: sampleOrId.cargoType || 'Industrial Road Freight',
            serviceLevel: sampleOrId.serviceLevel || 'Express Road Freight & Highway Linehaul (FTL)',
            declaredValue: sampleOrId.declaredValue || 'S$ 35,000',
            price: sampleOrId.price || 'S$ 520.00',
            createdDate: sampleOrId.createdDate || 'Aug 29, 2026',
            estimatedDelivery: sampleOrId.estimatedDelivery || 'Today, 5:00 PM (SGT)',
            timeline: sampleOrId.timeline || [
              { title: 'Consignment Booked & Lorry Receipt (LR) Issued', timestamp: 'Today 08:30 AM', location: 'Commercial Logistics Hub', completed: true },
              { title: 'Commercial Linehaul En Route', timestamp: 'Today 11:30 AM', location: 'Expressway Route Corridor', completed: true, current: true },
              { title: 'Delivered & Digital Proof of Delivery (POD) Signed', timestamp: 'Pending', location: 'Destination Facility', completed: false }
            ]
          };
        }
      }
    }

    if (!resolved) return null;

    // Attach latest event from event-driven model (Requirement 5)
    const latestEvt = getLatestShipmentEvent ? getLatestShipmentEvent(resolved.id || resolved.referenceNumber) : null;
    if (latestEvt) {
      resolved.status = latestEvt.stage;
      resolved.currentLocation = latestEvt.location;
      resolved.lastUpdatedTimestamp = latestEvt.timestamp;
      if (latestEvt.isTest !== undefined) {
        resolved.isTest = latestEvt.isTest;
      }
    }

    // REQUIREMENT 3: Hide all shipments marked "test" from public tracking, so only real shipments can be searched.
    if (isShipmentTest(resolved) && !isStaffOrAdmin) {
      return null;
    }

    return resolved;
  };

  const [currentShipment, setCurrentShipment] = useState(() => (activeTrackingId ? resolveShipmentData(activeTrackingId) : null));
  const [fullscreenMapShipment, setFullscreenMapShipment] = useState(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const mapSectionRef = useRef(null);

  // Staff Admin Tracking Update Form State (Requirement 2)
  const [adminFormShipmentId, setAdminFormShipmentId] = useState(() => activeTrackingId || '');
  const [adminFormMode, setAdminFormMode] = useState('Road Freight');
  const [adminFormStage, setAdminFormStage] = useState('In Transit');
  const [adminFormLocation, setAdminFormLocation] = useState('');
  const [adminFormTimestamp, setAdminFormTimestamp] = useState(() => getCurrentSingaporeDateTimeLocal());
  const [adminFormNote, setAdminFormNote] = useState('');
  const [adminFormIsTest, setAdminFormIsTest] = useState(false);
  const [isAdminFormOpen, setIsAdminFormOpen] = useState(true);

  // Sync admin form fields whenever currentShipment changes
  useEffect(() => {
    if (currentShipment) {
      const targetId = currentShipment.id || currentShipment.awbNumber || currentShipment.referenceNumber || '';
      setAdminFormShipmentId(targetId);
      const isAirMode = currentShipment.mode === 'Air Freight' || (targetId && targetId.startsWith('AWB')) || Boolean(currentShipment.awbNumber);
      setAdminFormMode(isAirMode ? 'Air Freight' : 'Road Freight');
      setAdminFormStage(currentShipment.status || (isAirMode ? 'In Flight' : 'In Transit'));
      setAdminFormLocation(currentShipment.currentLocation || '');
      setAdminFormIsTest(Boolean(currentShipment.isTest));
    }
  }, [currentShipment]);

  // Moving Anime Truck animation state
  const [truckProgress, setTruckProgress] = useState(20);
  const [currentSpeed, setCurrentSpeed] = useState(68);

  useEffect(() => {
    const timer = setInterval(() => {
      setTruckProgress(prev => (prev >= 80 ? 20 : prev + 0.35));
      setCurrentSpeed(64 + Math.floor(Math.random() * 8));
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Check URL parameters first (?id= or ?tracking=)
    const params = new URLSearchParams(window.location.search);
    const urlId = params.get('id') || params.get('tracking');
    const targetId = urlId || activeTrackingId;

    if (targetId) {
      setSearchInput(targetId);
      const found = resolveShipmentData(targetId);
      if (found) {
        setCurrentShipment(found);
        setIsNotFound(false);
      }
    }
  }, [activeTrackingId, shipments]);

  // Copy tracking link handler
  const handleCopyTrackingLink = () => {
    if (!currentShipment) return;
    const url = new URL(window.location.href);
    url.searchParams.set('id', currentShipment.id);
    const linkStr = url.toString();

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(linkStr).then(() => {
        setIsCopied(true);
        if (showToast) showToast('Tracking link copied to clipboard!');
        setTimeout(() => setIsCopied(false), 2500);
      }).catch(() => {
        fallbackCopyText(linkStr);
      });
    } else {
      fallbackCopyText(linkStr);
    }
  };

  const fallbackCopyText = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setIsCopied(true);
      if (showToast) showToast('Tracking link copied to clipboard!');
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {}
    document.body.removeChild(textArea);
  };

  // Handle browser back button (popstate) to close fullscreen GPS modal safely without leaving app
  useEffect(() => {
    const handlePopState = () => {
      if (!window.location.hash.startsWith('#track-map-')) {
        setFullscreenMapShipment(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openFullscreenMap = (sampleOrId) => {
    const found = resolveShipmentData(sampleOrId);
    setFullscreenMapShipment(found);
  };

  const handleSelectDemo = (sampleOrId) => {
    const found = resolveShipmentData(sampleOrId);
    if (found) {
      setCurrentShipment(found);
      const val = trackType === 'reference' && found.referenceNumber ? found.referenceNumber : found.id;
      setSearchInput(val);
      setActiveTrackingId(found.id);
      setCaptchaError('');
      generateNewCaptcha();
      if (showToast) showToast(`Loaded tracking updates for #${found.id}`);
      setTimeout(() => {
        const el = document.getElementById('shipment-details');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  const closeFullscreenMap = () => {
    setFullscreenMapShipment(null);
  };

  // Staff Admin Tracking Update Form Handler (Requirement 2)
  const handleAdminUpdateSubmit = (e) => {
    if (e) e.preventDefault();
    const cleanShipmentNum = adminFormShipmentId.trim().toUpperCase();
    if (!cleanShipmentNum) {
      if (showToast) showToast('Please enter a shipment or AWB number.', 'warning');
      return;
    }
    if (!adminFormLocation.trim()) {
      if (showToast) showToast('Please enter an update location.', 'warning');
      return;
    }

    const eventTimestamp = adminFormTimestamp ? new Date(adminFormTimestamp).toISOString() : new Date().toISOString();

    const createdEvent = addShipmentEvent({
      shipmentNumber: cleanShipmentNum,
      stage: adminFormStage,
      location: adminFormLocation.trim(),
      timestamp: eventTimestamp,
      source: 'manual',
      staffUser: currentUser?.name || 'Staff User',
      note: adminFormNote.trim(),
      isTest: adminFormIsTest
    });

    if (createdEvent) {
      if (DEMO_SHIPMENTS_MAP[cleanShipmentNum]) {
        DEMO_SHIPMENTS_MAP[cleanShipmentNum].status = createdEvent.stage;
        DEMO_SHIPMENTS_MAP[cleanShipmentNum].currentLocation = createdEvent.location;
        DEMO_SHIPMENTS_MAP[cleanShipmentNum].lastUpdatedTimestamp = createdEvent.timestamp;
        DEMO_SHIPMENTS_MAP[cleanShipmentNum].isTest = createdEvent.isTest;
      }

      if (currentShipment && (
        (currentShipment.id && currentShipment.id.toUpperCase() === cleanShipmentNum) ||
        (currentShipment.referenceNumber && currentShipment.referenceNumber.toUpperCase() === cleanShipmentNum) ||
        (currentShipment.awbNumber && currentShipment.awbNumber.toUpperCase() === cleanShipmentNum)
      )) {
        setCurrentShipment(prev => ({
          ...prev,
          status: createdEvent.stage,
          currentLocation: createdEvent.location,
          lastUpdatedTimestamp: createdEvent.timestamp,
          isTest: createdEvent.isTest
        }));
      } else {
        const refreshed = resolveShipmentData(cleanShipmentNum);
        if (refreshed) {
          setCurrentShipment(refreshed);
          setActiveTrackingId(refreshed.id);
          setIsNotFound(false);
        }
      }

      setAdminFormNote('');
    }
  };

  const handleTrackingSubmit = async (e) => {
    if (e) e.preventDefault();
    const query = searchInput.trim();
    if (!query) {
      setCaptchaError('Please enter an Air Waybill (AWB), Shipment ID, or delivery reference.');
      return;
    }

    // 0. Do not let anyone open a quote request on a public tracking page using quote reference alone
    const cleanQuery = query.toUpperCase();
    if (cleanQuery.startsWith('QR-') || cleanQuery.startsWith('TQ-')) {
      setCaptchaError('Quote reference numbers cannot be opened on public tracking pages. Our team will review your request and reply directly by email or phone. Please keep your reference number.');
      setIsNotFound(false);
      return;
    }

    // 1. Rate Limiting Check (Client & Local Storage: max 10 requests / min)
    const clientRate = getRateLimitStatus('track_shipment', 10, 60000);
    if (!clientRate.allowed) {
      setRateLimitSeconds(clientRate.retryAfter);
      setCaptchaError('Too many attempts. Please wait a minute and try again.');
      return;
    }

    // 2. Server-side IP Rate Limit & Security Delay Check
    setIsSubmitting(true);
    try {
      const serverRate = await checkServerIpRateLimit({ queryNumber: query });
      if (!serverRate.allowed) {
        setRateLimitSeconds(serverRate.retryAfter || 60);
        setCaptchaError(serverRate.message || 'Too many attempts. Please wait a minute and try again.');
        setIsSubmitting(false);
        return;
      }
    } catch (err) {
      // Gracefully continue with client-side rate limiter if API is unreachable
    }

    // 3. One-click / Invisible Turnstile Captcha verification check
    if (!captchaVerified) {
      setCaptchaError('Please complete the one-click security verification.');
      setIsSubmitting(false);
      return;
    }

    // Record attempt for rate limiting
    recordRateLimitAttempt('track_shipment', 60000);
    setCaptchaError('');

    const found = resolveShipmentData(query);
    setIsSubmitting(false);

    if (found) {
      setFailedAttempts(0);
      try {
        checkServerIpRateLimit({ queryNumber: query, status: 'success' });
      } catch (e) {}

      setCurrentShipment(found);
      setActiveTrackingId(found.id);
      setIsNotFound(false);
      if (showToast) showToast(`Found Tracking Record for #${query.toUpperCase()}`);
      setTimeout(() => {
        const el = document.getElementById('shipment-details');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } else {
      const nextFailed = failedAttempts + 1;
      setFailedAttempts(nextFailed);
      try {
        checkServerIpRateLimit({ queryNumber: query, status: 'failed' });
      } catch (e) {}

      // Progressive delay after repeated failed tries (3 -> 5s, 5 -> 15s, 7+ -> 30s)
      if (nextFailed >= 3) {
        const progressiveDelay = nextFailed >= 7 ? 30 : nextFailed >= 5 ? 15 : 5;
        setRateLimitSeconds(progressiveDelay);
        setCaptchaError(`Security delay active: Please wait ${progressiveDelay}s after repeated failed attempts.`);
      }

      setCurrentShipment(null);
      setActiveTrackingId('');
      setIsNotFound(true);
    }
  };

  const handleViewInvoice = () => {
    const isOwner = checkIsShipmentOwner(currentShipment, currentUser);
    if (!isOwner) {
      if (showToast) showToast('Log in to view full shipment details and documents.', 'warning');
      if (setAuthRedirectTab) setAuthRedirectTab('track');
      setIsAuthModalOpen(true);
      return;
    }
    const shipmentToView = currentShipment || shipments[0];
    if (!shipmentToView) {
      setCaptchaError('Please enter a tracking number first to view invoice');
      if (showToast) showToast('Please enter a tracking number first to view invoice');
      return;
    }
    setSelectedInvoiceShipment(shipmentToView);
    if (showToast) showToast(`Viewing Official Freight Bill & Invoice for #${shipmentToView.id}`);
  };

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      
      {/* Clean Light Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
          Track Your Shipment
        </h1>
        <p className="text-slate-600 font-medium text-sm sm:text-base leading-relaxed">
          Enter your tracking number to see the latest status of your air or road shipment.
        </p>
      </div>

      {/* Centered, Clean "Track By" Card (Seamlessly Integrated with Page Design) */}
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all text-left">
          
          {/* Track By: Header */}
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Track By:
          </h3>

          {/* Radio Options: Air Waybill (AWB) number | Shipment ID | Road delivery reference */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-5">
            <label className="flex items-center space-x-2.5 cursor-pointer select-none">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="trackType"
                  value="awb"
                  checked={trackType === 'awb'}
                  onChange={() => {
                    setTrackType('awb');
                    setCaptchaError('');
                  }}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  trackType === 'awb' ? 'border-[#FF6B00] bg-white' : 'border-slate-300'
                }`}>
                  {trackType === 'awb' && <div className="w-2 h-2 rounded-full bg-[#FF6B00]"></div>}
                </div>
              </div>
              <span className={`text-sm font-bold transition-colors flex items-center space-x-1.5 ${
                trackType === 'awb' ? 'text-[#FF6B00] font-extrabold' : 'text-slate-600'
              }`}>
                <Plane className="w-3.5 h-3.5" />
                <span>Air Waybill (AWB) number</span>
              </span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer select-none">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="trackType"
                  value="shipment"
                  checked={trackType === 'shipment'}
                  onChange={() => {
                    setTrackType('shipment');
                    setCaptchaError('');
                  }}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  trackType === 'shipment' ? 'border-[#FF6B00] bg-white' : 'border-slate-300'
                }`}>
                  {trackType === 'shipment' && <div className="w-2 h-2 rounded-full bg-[#FF6B00]"></div>}
                </div>
              </div>
              <span className={`text-sm font-bold transition-colors ${
                trackType === 'shipment' ? 'text-slate-900 font-extrabold' : 'text-slate-600'
              }`}>
                Shipment ID
              </span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer select-none">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="trackType"
                  value="reference"
                  checked={trackType === 'reference'}
                  onChange={() => {
                    setTrackType('reference');
                    setCaptchaError('');
                  }}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  trackType === 'reference' ? 'border-[#FF6B00] bg-white' : 'border-slate-300'
                }`}>
                  {trackType === 'reference' && <div className="w-2 h-2 rounded-full bg-[#FF6B00]"></div>}
                </div>
              </div>
              <span className={`text-sm font-bold transition-colors ${
                trackType === 'reference' ? 'text-slate-900 font-extrabold' : 'text-slate-600'
              }`}>
                Road delivery reference
              </span>
            </label>
          </div>

          {/* Form */}
          <form onSubmit={handleTrackingSubmit} className="space-y-4">
            {/* Tracking Number Input */}
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchInput(val);
                  setCaptchaError('');
                  setIsNotFound(false);
                  const detected = detectTrackType(val);
                  if (detected) {
                    setTrackType(detected);
                  }
                  if (!val.trim()) {
                    setCurrentShipment(null);
                    setActiveTrackingId('');
                  }
                }}
                placeholder={
                  trackType === 'awb' 
                    ? 'Enter Air Waybill Number (e.g. AWB-XXXXX)' 
                    : trackType === 'shipment' 
                    ? 'Enter Shipment ID (e.g. JOS-XXXXX)' 
                    : 'Enter Road delivery reference'
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200/90 rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-300 transition-all pr-10"
                required
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    setCurrentShipment(null);
                    setActiveTrackingId('');
                    setCaptchaError('');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Hint under input */}
            <p className="text-xs text-slate-500 font-medium pt-0.5">
              Your tracking number is in your booking confirmation email or SMS.
            </p>

            {/* Admin / Test Environment Only Demo Feeds */}
            {currentUser?.role === 'admin' && (
              <div className="pt-2 border-t border-dashed border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>Admin / Test Environment Samples:</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectDemo('AWB-880-49201844')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] font-bold rounded-lg border border-slate-200 transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <Plane className="w-3 h-3 text-[#FF6B00]" />
                    <span>AWB-880-49201844 (Air Freight)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectDemo('JOS-77102-SG')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] font-bold rounded-lg border border-slate-200 transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <Truck className="w-3 h-3 text-[#FF6B00]" />
                    <span>JOS-77102-SG (Road FTL)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectDemo('JOS-66301-SG')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] font-bold rounded-lg border border-slate-200 transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <Truck className="w-3 h-3 text-emerald-600" />
                    <span>JOS-66301-SG (Reefer)</span>
                  </button>
                </div>
              </div>
            )}

            {/* One-Click / Invisible Turnstile Captcha Section */}
            <div className="pt-1">
              <TurnstileCaptcha
                isVerified={captchaVerified}
                onVerify={(token) => {
                  setCaptchaVerified(true);
                  setCaptchaToken(token);
                  setCaptchaError('');
                }}
                onExpire={() => {
                  setCaptchaVerified(false);
                  setCaptchaToken(null);
                }}
              />
            </div>

            {/* 1. Not Found Alert */}
            {isNotFound && !currentShipment && (
              <div className="p-4 bg-amber-50/90 border border-amber-200/90 rounded-2xl text-xs text-slate-800 flex items-start space-x-3 animate-fade-in shadow-xs">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-slate-900 leading-relaxed text-xs sm:text-sm">
                    We couldn't find a shipment with that number. Please check the number and try again, or contact us at{' '}
                    <a href="tel:+6567890123" className="text-[#FF6B00] font-extrabold hover:underline whitespace-nowrap">
                      +65 6789 0123
                    </a>.
                  </p>
                </div>
              </div>
            )}

            {/* 2. Rate Limit Active Warning Alert (Too many attempts) */}
            {rateLimitSeconds > 0 && (
              <div className="p-4 bg-rose-50 border border-rose-200/90 rounded-2xl text-xs text-rose-950 flex items-start space-x-3 animate-fade-in shadow-xs">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-extrabold text-sm text-rose-950">
                    Too many attempts. Please wait a minute and try again.
                  </p>
                  <p className="text-rose-700 font-medium">
                    You can try again in <strong className="font-mono text-rose-950 font-bold">{rateLimitSeconds}s</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* 3. Validation / Quote Reference / Captcha Error (Displayed ONCE) */}
            {captchaError && rateLimitSeconds <= 0 && !isNotFound && (
              <div className="p-3.5 bg-rose-50/90 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-start space-x-2.5 animate-fade-in">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{captchaError}</span>
              </div>
            )}

            {/* Brand Orange TRACK Button */}
            <button
              type="submit"
              disabled={rateLimitSeconds > 0 || isSubmitting}
              className={`w-full py-3.5 ${
                rateLimitSeconds > 0 || isSubmitting
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-[#FF6B00] hover:bg-[#E55C00] active:scale-[0.99] text-white cursor-pointer shadow-sm'
              } font-extrabold text-sm tracking-wide rounded-xl transition-all flex items-center justify-center space-x-2`}
            >
              {isSubmitting ? (
                <span>Verifying...</span>
              ) : rateLimitSeconds > 0 ? (
                <span>Too many attempts ({rateLimitSeconds}s)</span>
              ) : (
                <span>Track</span>
              )}
            </button>
          </form>

          {/* Bottom Assistance & Contact Section */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900">
                Can't find your tracking number?
              </h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Check your booking confirmation email or SMS, or contact us at{' '}
                <a href="tel:+6567890123" className="text-slate-800 font-bold hover:text-[#FF6B00] transition-colors underline">
                  +65 6789 0123
                </a>{' '}/{' '}
                <a href="mailto:contact@josanlogistics.com.sg" className="text-slate-800 font-bold hover:text-[#FF6B00] transition-colors underline">
                  contact@josanlogistics.com.sg
                </a>.
              </p>
            </div>

            {/* Quick Contact Actions: Call & WhatsApp */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="tel:+6567890123"
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF6B00] border border-orange-200 text-xs font-bold transition-all shadow-sm active:scale-95"
                title="Call Support Hotline"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>

              <a
                href="https://wa.me/6567890123"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all shadow-sm active:scale-95"
                title="Message on WhatsApp"
              >
                <svg className="w-3.5 h-3.5 fill-current text-emerald-600" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

        </div>
      </div>



      {/* Staff Operations Admin Form for Adding Tracking Updates (Requirement 2) */}
      {isStaffOrAdmin && (
        <div className="max-w-4xl mx-auto bg-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-slate-700 shadow-xl space-y-5 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/30 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-[#FF6B00]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>Staff Operations: Add Tracking Update</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FF6B00] text-white">
                    Manual Source
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Logged in as <strong className="text-slate-200">{currentUser?.name || 'Staff User'}</strong> ({currentUser?.role || 'Operations Staff'}). Updates are stored as audit events.
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => setIsAdminFormOpen(prev => !prev)}
              className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {isAdminFormOpen ? 'Collapse Form' : 'Expand Form'}
            </button>
          </div>

          {isAdminFormOpen && (
            <form onSubmit={handleAdminUpdateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                {/* Shipment Number */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                    Shipment Number *
                  </label>
                  <input
                    type="text"
                    value={adminFormShipmentId}
                    onChange={(e) => setAdminFormShipmentId(e.target.value)}
                    placeholder="Your tracking number"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono font-bold text-xs focus:outline-hidden focus:border-[#FF6B00]"
                    required
                  />
                </div>

                {/* Freight Mode Toggle / Indicator */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                    Transportation Mode
                  </label>
                  <select
                    value={adminFormMode}
                    onChange={(e) => {
                      const newMode = e.target.value;
                      setAdminFormMode(newMode);
                      setAdminFormStage(newMode === 'Air Freight' ? 'In Flight' : 'In Transit');
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-semibold text-xs focus:outline-hidden focus:border-[#FF6B00]"
                  >
                    <option value="Road Freight">🚚 Road Freight (7 Stages)</option>
                    <option value="Air Freight">✈️ Air Freight (7 Stages)</option>
                  </select>
                </div>

                {/* Stage Dropdown (Fixed List) */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                    Stage (Fixed List) *
                  </label>
                  <select
                    value={adminFormStage}
                    onChange={(e) => setAdminFormStage(e.target.value)}
                    className="w-full bg-slate-800 border border-[#FF6B00]/40 rounded-xl px-3.5 py-2.5 text-white font-bold text-xs focus:outline-hidden focus:border-[#FF6B00]"
                    required
                  >
                    {(adminFormMode === 'Air Freight' 
                      ? ['Booked', 'Documents Prepared', 'Handed to Airline', 'In Flight', 'Arrived', 'Cleared', 'Delivered']
                      : ['Booked', 'Confirmed', 'Pickup Scheduled', 'Picked Up', 'In Transit', 'Near Destination', 'Delivered']
                    ).map(stg => (
                      <option key={stg} value={stg}>{stg}</option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={adminFormLocation}
                    onChange={(e) => setAdminFormLocation(e.target.value)}
                    placeholder="e.g. PIE Expressway Telematics Gate (Exit 19) or Changi Cargo Bay 4"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-hidden focus:border-[#FF6B00]"
                    required
                  />
                </div>

                {/* Timestamp (Singapore Time) */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                    Timestamp (Singapore Time) *
                  </label>
                  <input
                    type="datetime-local"
                    value={adminFormTimestamp}
                    onChange={(e) => setAdminFormTimestamp(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-hidden focus:border-[#FF6B00]"
                    required
                  />
                </div>
              </div>

              {/* Optional Note */}
              <div className="space-y-1.5 text-xs">
                <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                  Operational Note (Optional)
                </label>
                <input
                  type="text"
                  value={adminFormNote}
                  onChange={(e) => setAdminFormNote(e.target.value)}
                  placeholder="e.g. Handed over to partner ramp team with validated airway documentation"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-hidden focus:border-[#FF6B00]"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                {/* Test Shipment Checkbox */}
                <label className="flex items-center space-x-2 text-xs font-semibold text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={adminFormIsTest}
                    onChange={(e) => setAdminFormIsTest(e.target.checked)}
                    className="w-4 h-4 rounded text-[#FF6B00] border-slate-600 focus:ring-[#FF6B00] bg-slate-800"
                  />
                  <span>Mark as test shipment (hidden from public tracking search)</span>
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white rounded-xl text-xs font-extrabold transition-all shadow-md active:scale-95 flex items-center space-x-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Record Tracking Update</span>
                </button>
              </div>
            </form>
          )}

          {/* Compact Event Audit List for Currently Viewed Shipment */}
          {currentShipment && getShipmentEvents && getShipmentEvents(currentShipment.id || currentShipment.awbNumber || currentShipment.referenceNumber).length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-800">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Recorded Event History for #{currentShipment.id}
              </p>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {getShipmentEvents(currentShipment.id || currentShipment.awbNumber || currentShipment.referenceNumber).map(evt => (
                  <div key={evt.id} className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 text-xs flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#FF6B00]/20 text-[#FF6B00] font-bold text-[10px]">
                        {evt.stage}
                      </span>
                      <span className="text-slate-300 font-medium truncate max-w-xs">{evt.location}</span>
                      {evt.isTest && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-400/20 text-amber-300">TEST</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center space-x-3">
                      <span>By: <strong className="text-slate-300">{evt.staffUser}</strong> ({evt.source})</span>
                      <span className="font-mono text-slate-400">{formatSingaporeTime(evt.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Shipment Details Section */}
      <div id="shipment-details" className="scroll-mt-24">
      {currentShipment && (() => {
        const isAir = currentShipment.mode === 'Air Freight' || 
          Boolean(currentShipment.awbNumber) || 
          currentShipment.id.startsWith('AWB') || 
          (currentShipment.serviceLevel && currentShipment.serviceLevel.toLowerCase().includes('air'));
        const isAuthorizedOwner = checkIsShipmentOwner(currentShipment, currentUser);
        const currentShipmentId = currentShipment.id || currentShipment.awbNumber || currentShipment.referenceNumber;
        const currentShipmentEvents = (getShipmentEvents && currentShipmentId) ? getShipmentEvents(currentShipmentId) : [];
        const latestShipmentEvent = (getLatestShipmentEvent && currentShipmentId) ? getLatestShipmentEvent(currentShipmentId) : null;
        const latestTimestamp = latestShipmentEvent?.timestamp || currentShipment.lastUpdatedTimestamp || currentShipment.createdDate;

        return (
          <>
            <div className={`grid grid-cols-1 ${isAuthorizedOwner ? 'lg:grid-cols-12' : 'max-w-4xl mx-auto'} gap-8`}>
          
          {/* Main Status & Interactive Timeline */}
          <div className={`${isAuthorizedOwner ? 'lg:col-span-8' : 'w-full'} space-y-8`}>
            
            {/* Status Header Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      isAir 
                        ? 'bg-orange-100 text-orange-950 border border-orange-200' 
                        : 'bg-orange-50 text-[#10182D] border border-orange-200'
                    }`}>
                      {isAir ? '✈️ AIR FREIGHT' : '🚚 ROAD TRANSPORTATION'}
                    </span>
                  </div>
                  <p className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    {isAir ? 'Air Waybill (AWB) Tracking' : 'Road Delivery Reference'}
                  </p>
                  {/* Single Tracking Number on Page: Page Heading & Copy Link Button */}
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono break-words">
                      {currentShipment.id}
                    </h2>
                    <button
                      type="button"
                      onClick={handleCopyTrackingLink}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-orange-50 hover:text-[#FF6B00] text-slate-700 text-xs font-bold rounded-xl border border-slate-200 hover:border-orange-200 transition-all cursor-pointer active:scale-95"
                      title="Copy tracking link to clipboard"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy tracking link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-start sm:items-end">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase flex items-center space-x-2 ${
                    currentShipment.status === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : currentShipment.status === 'Delayed'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                      : isAir
                      ? 'bg-orange-100 text-orange-950 border border-orange-300 pulse-badge'
                      : 'bg-orange-50 text-[#10182D] border border-[#FF6B00]/40 pulse-badge'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      currentShipment.status === 'Delivered' ? 'bg-emerald-500' : currentShipment.status === 'Delayed' ? 'bg-amber-500' : 'bg-[#FF6B00]'
                    }`}></span>
                    <span>{currentShipment.status || 'Active'}</span>
                  </span>
                  <p className="text-[11px] text-slate-500 font-medium mt-1.5 text-left sm:text-right">
                    Last updated: {formatSingaporeTime(latestTimestamp)}
                  </p>
                  {currentShipment.isTest && (
                    <span className="mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300 flex items-center space-x-1">
                      <span>🧪 Test Shipment (Hidden from Public)</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Display Fields Grid */}
              {isAuthorizedOwner ? (
                /* Full Authorized Grid for Logged-In Account Owner */
                <div className="bg-[#F5F6F8] p-5 sm:p-6 rounded-2xl border border-orange-200 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-xs">
                    <div>
                      <p className="text-[#64748B] font-semibold uppercase text-[10px] tracking-wider">Current Status</p>
                      <p className="font-bold text-xs sm:text-sm mt-0.5 text-[#FF6B00] break-words">
                        {getRealValueOrFallback(currentShipment.status)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#64748B] font-semibold uppercase text-[10px] tracking-wider">
                        {isAir ? 'Departure Airport / City' : 'Pickup City'}
                      </p>
                      <p className="font-bold text-[#10182D] text-xs sm:text-sm mt-0.5 flex items-start gap-1.5 break-words leading-snug">
                        <MapPin className="w-3.5 h-3.5 text-[#64748B] shrink-0 mt-0.5" />
                        <span className="break-words">{getRealValueOrFallback(currentShipment.originCity || currentShipment.origin)}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[#64748B] font-semibold uppercase text-[10px] tracking-wider">
                        {isAir ? 'Destination Airport / City' : 'Delivery City'}
                      </p>
                      <p className="font-bold text-[#10182D] text-xs sm:text-sm mt-0.5 flex items-start gap-1.5 break-words leading-snug">
                        <MapPin className="w-3.5 h-3.5 text-[#64748B] shrink-0 mt-0.5" />
                        <span className="break-words">{getRealValueOrFallback(currentShipment.destinationCity || currentShipment.destination)}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[#64748B] font-semibold uppercase text-[10px] tracking-wider">Current Location</p>
                      <p className="font-bold text-[#10182D] text-xs sm:text-sm mt-0.5 flex items-start gap-1.5 break-words leading-snug">
                        {isAir ? <Plane className="w-3.5 h-3.5 text-[#64748B] shrink-0 mt-0.5" /> : <Navigation className="w-3.5 h-3.5 text-[#64748B] shrink-0 mt-0.5" />}
                        <span className="break-words">{getRealValueOrFallback(currentShipment.currentLocation)}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[#64748B] font-semibold uppercase text-[10px] tracking-wider">
                        {isAir ? 'Air Carrier' : 'Transport Partner'}
                      </p>
                      <p className="font-bold text-[#10182D] text-xs sm:text-sm mt-0.5 flex items-start gap-1.5 break-words leading-snug">
                        {isAir ? <Plane className="w-3.5 h-3.5 text-[#64748B] shrink-0 mt-0.5" /> : <Truck className="w-3.5 h-3.5 text-[#64748B] shrink-0 mt-0.5" />}
                        <span className="break-words">
                          {getRealValueOrFallback(currentShipment.transportPartner || currentShipment.transportationPartner || currentShipment.carrier || (isAir ? 'Commercial Airline Partner' : 'Licensed Transport Partner'))}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[#64748B] font-semibold uppercase text-[10px] tracking-wider">
                        Vehicle
                      </p>
                      <p className="font-bold text-[#10182D] text-xs sm:text-sm mt-0.5 flex items-start gap-1.5 break-words leading-snug">
                        {isAir ? <Plane className="w-3.5 h-3.5 text-[#64748B] shrink-0 mt-0.5" /> : <Truck className="w-3.5 h-3.5 text-[#64748B] shrink-0 mt-0.5" />}
                        <span className="break-words">{getVehicleTypeDisplay(currentShipment)}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[#64748B] font-semibold uppercase text-[10px] tracking-wider">Estimated Delivery</p>
                      <p className="font-bold text-[#10182D] text-xs sm:text-sm mt-0.5 flex items-start gap-1.5 break-words leading-snug">
                        <Clock className="w-3.5 h-3.5 text-[#64748B] shrink-0 mt-0.5" />
                        <span className="break-words">{getRealValueOrFallback(currentShipment.estimatedDelivery || currentShipment.eta)}</span>
                      </p>
                    </div>
                  </div>

                  {/* Sub-bar */}
                  <div className="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Status Record: <strong className="text-slate-800">{currentShipment.status || 'Active'}</strong></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="italic text-slate-400">
                        {isAir ? 'Air Freight Consignment Record' : 'Commercial Road Transportation Record'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedDetailShipment(currentShipment)}
                        className="text-[#FF6B00] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Delivery Documents</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Public Visitor View: Real values without plate numbers, no duplicate tracking number, wrapped text */
                <div className="space-y-4">
                  <div className="bg-[#F5F6F8] p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-xs">
                      <div>
                        <p className="text-[#64748B] font-semibold uppercase text-[10px] tracking-wider">Status</p>
                        <p className="font-bold text-xs sm:text-sm mt-0.5 text-[#FF6B00] break-words">
                          {getRealValueOrFallback(currentShipment.status)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#64748B] font-semibold uppercase text-[10px] tracking-wider">
                          {isAir ? 'Departure Airport / City' : 'Pickup City'}
                        </p>
                        <p className="font-bold text-[#10182D] text-xs sm:text-sm mt-0.5 flex items-start gap-1.5 break-words leading-snug">
                          <MapPin className="w-3.5 h-3.5 text-[#64748B] shrink-0 mt-0.5" />
                          <span className="break-words">{getRealValueOrFallback(currentShipment.originCity || currentShipment.origin)}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[#64748B] font-semibold uppercase text-[10px] tracking-wider">
                          {isAir ? 'Destination Airport / City' : 'Delivery City'}
                        </p>
                        <p className="font-bold text-[#10182D] text-xs sm:text-sm mt-0.5 flex items-start gap-1.5 break-words leading-snug">
                          <MapPin className="w-3.5 h-3.5 text-[#64748B] shrink-0 mt-0.5" />
                          <span className="break-words">{getRealValueOrFallback(currentShipment.destinationCity || currentShipment.destination)}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[#64748B] font-semibold uppercase text-[10px] tracking-wider">Current Location</p>
                        <p className="font-bold text-[#10182D] text-xs sm:text-sm mt-0.5 flex items-start gap-1.5 break-words leading-snug">
                          {isAir ? <Plane className="w-3.5 h-3.5 text-[#64748B] shrink-0 mt-0.5" /> : <Navigation className="w-3.5 h-3.5 text-[#64748B] shrink-0 mt-0.5" />}
                          <span className="break-words">{getRealValueOrFallback(currentShipment.currentLocation)}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[#64748B] font-semibold uppercase text-[10px] tracking-wider">{isAir ? 'Aircraft' : 'Vehicle'}</p>
                        <p className="font-bold text-[#10182D] text-xs sm:text-sm mt-0.5 flex items-start gap-1.5 break-words leading-snug">
                          {isAir ? <Plane className="w-3.5 h-3.5 text-[#64748B] shrink-0 mt-0.5" /> : <Truck className="w-3.5 h-3.5 text-[#64748B] shrink-0 mt-0.5" />}
                          <span className="break-words">{getVehicleTypeDisplay(currentShipment)}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[#64748B] font-semibold uppercase text-[10px] tracking-wider">Estimated Delivery</p>
                        <p className="font-bold text-[#10182D] text-xs sm:text-sm mt-0.5 flex items-start gap-1.5 break-words leading-snug">
                          <Clock className="w-3.5 h-3.5 text-[#64748B] shrink-0 mt-0.5" />
                          <span className="break-words">{getRealValueOrFallback(currentShipment.estimatedDelivery || currentShipment.eta)}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Public Visitors Line & CTA */}
                  <div className="bg-orange-50/80 border border-orange-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                    <div className="flex items-start space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-orange-200 flex items-center justify-center text-[#FF6B00] shrink-0 shadow-2xs mt-0.5">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-slate-900">
                          Log in to view full shipment details and documents.
                        </p>
                        <p className="text-xs text-slate-600 font-medium">
                          {isAir
                            ? 'Official Air Waybills (AWB), declared cargo values, carrier pricing, and airline handover files are restricted to verified account holders.'
                            : 'Official Lorry Receipts (LR), declared cargo values, carrier pricing, and driver contact info are restricted to verified account holders.'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (setAuthRedirectTab) setAuthRedirectTab('track');
                        setIsAuthModalOpen(true);
                      }}
                      className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#E55C00] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 shrink-0 flex items-center justify-center space-x-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Log In to Account</span>
                    </button>
                  </div>
                </div>
              )}

              {/* AUTOMATED WEATHER & TELEMATICS RADAR ALERT BANNER - Only for Authorized Owner */}
              {isAuthorizedOwner && (currentShipment.status === 'Delayed' || currentShipment.weatherDelay?.active) && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 space-y-3 shadow-sm animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5 text-amber-900 font-extrabold text-sm">
                      <AlertTriangle className="w-5 h-5 text-amber-600 animate-bounce" />
                      <span>Highway Weather & Telematics Radar Advisory</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase font-mono text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
                      Road Safety Alert Active
                    </span>
                  </div>

                  <p className="text-xs text-amber-900 leading-relaxed font-semibold">
                    ⛈️ <strong>Roadway Hazard Flagged:</strong> {currentShipment.weatherDelay?.condition || 'Heavy Monsoon Rain & Expressway Highway Surface Water Advisory'}. Automated vehicle telematics adjusted convoy speed SLA for wet asphalt safety.
                  </p>

                  <div className="bg-white p-3 rounded-xl border border-amber-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700 font-medium">
                    <div className="flex items-center space-x-1.5 text-emerald-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      <span>📱 <strong>SMS Notification Sent:</strong> Recipient notified of highway safety buffer</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-slate-800">
                      <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                      <span>📧 <strong>Email Alert Issued:</strong> Shipment telemetry log recorded</span>
                    </div>
                  </div>
                </div>
              )}

              {/* UNIFIED VERTICAL TIMELINE: "Shipment Progress" */}
              {(() => {
                const stages = isAir ? AIR_PROGRESS_STAGES : ROAD_PROGRESS_STAGES;
                const activeStageIndex = latestShipmentEvent
                  ? (isAir ? getAirStageIndex(latestShipmentEvent.stage) : getRoadStageIndex(latestShipmentEvent.stage))
                  : (isAir ? getAirStageIndex(currentShipment.status) : getRoadStageIndex(currentShipment.status));

                return (
                  <div className="space-y-6 pt-2">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FF6B00]">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight font-heading">
                            Shipment Progress
                          </h3>
                          <p className="text-xs text-slate-500 font-medium">
                            {isAir ? '7-Stage International Air Freight Workflow' : '7-Stage Commercial Road Transportation'}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        Stage {activeStageIndex} of {stages.length}
                      </span>
                    </div>

                    {/* Unified Vertical Stepper (Driven by Event Store - Requirement 5) */}
                    <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3.5 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                      {stages.map((st) => {
                        const isCompleted = st.num < activeStageIndex;
                        const isCurrent = st.num === activeStageIndex;
                        const isFuture = st.num > activeStageIndex;

                        const customStep = (currentShipment.timeline || []).find((t) => {
                          if (t.step === st.num) return true;
                          const tTitle = (t.title || '').toLowerCase();
                          const sTitle = st.title.toLowerCase();
                          return tTitle.includes(sTitle) || sTitle.includes(tTitle);
                        }) || currentShipment.timeline?.[st.num - 1];

                        // Find matching event from event store (Requirement 5)
                        const matchingEvent = (currentShipmentEvents || []).find((e) => {
                          const eStage = (e.stage || '').toLowerCase().trim();
                          const stTitle = st.title.toLowerCase().trim();
                          const stKey = st.key.toLowerCase().trim();
                          return eStage === stTitle || eStage === stKey;
                        });

                        const dateTimeStr = matchingEvent
                          ? formatSingaporeTime(matchingEvent.timestamp)
                          : (isCompleted || isCurrent)
                          ? getStageDateTimeFormatted(st.num, currentShipment, customStep)
                          : null;

                        const locationStr = matchingEvent?.location || customStep?.location || st.defaultLocation(currentShipment);

                        return (
                          <div key={st.num} className="relative flex items-start space-x-4 group">
                            
                            {/* Timeline Node Icon */}
                            <div className={`absolute -left-6 sm:-left-8 top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10 ${
                              isCurrent
                                ? 'bg-[#FF6B00] text-white ring-4 ring-orange-200 pulse-badge scale-105 shadow-sm'
                                : isCompleted
                                ? 'bg-[#FF6B00] text-white shadow-2xs'
                                : 'bg-slate-200 text-slate-400'
                            }`}>
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                              ) : isCurrent ? (
                                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
                              ) : (
                                <span>{st.num}</span>
                              )}
                            </div>

                            {/* Stage Details Card */}
                            <div className={`flex-1 p-4 sm:p-4.5 rounded-2xl border transition-all ${
                              isCurrent
                                ? 'bg-orange-50/80 border-orange-300 shadow-sm'
                                : isCompleted
                                ? 'bg-white border-slate-200 shadow-2xs'
                                : 'bg-slate-50/80 border-slate-200/70 opacity-60'
                            }`}>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                                <div className="flex items-center space-x-2">
                                  <h4 className={`text-sm font-extrabold ${
                                    isCurrent ? 'text-[#FF6B00]' : isCompleted ? 'text-slate-900' : 'text-slate-400 font-semibold'
                                  }`}>
                                    {st.title}
                                  </h4>
                                  {isCurrent && (
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#FF6B00] text-white px-2 py-0.5 rounded-full shadow-2xs">
                                      Current Status
                                    </span>
                                  )}
                                </div>

                                {/* Formatted Date & Time for Completed / Current Stages */}
                                {dateTimeStr ? (
                                  <span className="text-xs font-bold text-slate-700 font-mono">
                                    {dateTimeStr}
                                  </span>
                                ) : (
                                  <span className="text-[11px] font-medium text-slate-400 italic">
                                    Pending
                                  </span>
                                )}
                              </div>

                              {locationStr && (
                                <p className={`text-xs mt-1.5 flex items-center space-x-1.5 ${
                                  isFuture ? 'text-slate-400' : 'text-slate-600 font-medium'
                                }`}>
                                  <MapPin className={`w-3.5 h-3.5 shrink-0 ${isFuture ? 'text-slate-300' : 'text-[#FF6B00]'}`} />
                                  <span>{locationStr}</span>
                                </p>
                              )}

                              {matchingEvent?.note && (
                                <p className="text-[11px] text-slate-600 italic mt-1.5 bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200 inline-block">
                                  Note: {matchingEvent.note}
                                </p>
                              )}
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* DIGITAL PROOF OF DELIVERY (POD) CALLOUT - Only for Authorized Owner */}
              {isAuthorizedOwner && currentShipment.status === 'Delivered' && (
                <div className="bg-orange-50 border-2 border-[#FF6B00]/40 rounded-2xl p-5 space-y-3 shadow-sm animate-fade-in">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[#10182D] font-extrabold text-sm font-outfit">
                      <ShieldCheck className="w-5 h-5 text-[#FF6B00]" />
                      <span>Electronic Proof of Delivery (e-POD) Verified</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedDetailShipment(currentShipment)}
                      className="px-4 py-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>View & Download Official POD PDF</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-[#FF6B00]/20 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Consignee Signatory</span>
                      <strong className="text-[#10182D]">{currentShipment.pod?.recipientName || 'Authorized Consignee Signatory'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Handover Completed</span>
                      <span className="text-slate-700">{currentShipment.pod?.deliveredAt || currentShipment.lastUpdatedTime || 'Today, Verified'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">2FA Security Status</span>
                      <span className="text-emerald-700 font-bold">✓ 6-Digit OTP Authenticated</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Right Sidebar Specs & Driver Info - ONLY SHOWN TO AUTHORIZED OWNER */}
          {isAuthorizedOwner && (
            <div className="lg:col-span-4 space-y-6">
              
              {/* Transport Partner Panel */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Transport Partner</h3>
                
                <div className="flex items-center space-x-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="w-11 h-11 rounded-2xl bg-orange-50 text-[#FF6B00] flex items-center justify-center border border-orange-200 shrink-0">
                    {isAir ? <Plane className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Partner Operator</p>
                    <h4 className="font-extrabold text-slate-900 text-sm truncate">
                      {currentShipment.transportPartner || currentShipment.transportationPartner || currentShipment.carrier || (isAir ? 'Commercial Airline Partner' : 'Licensed Transport Partner')}
                    </h4>
                    <p className="text-xs text-[#FF6B00] font-semibold mt-0.5">
                      Vehicle: {getVehicleTypeDisplay(currentShipment)}
                    </p>
                  </div>
                </div>

                {/* Contact Josan Support (Direct customer to Josan rather than driver) */}
                <div className="space-y-2 pt-1">
                  <a
                    href="tel:+6567890123"
                    className="w-full py-2.5 px-3 bg-orange-50 hover:bg-orange-100 text-[#10182D] rounded-xl font-bold text-xs border border-orange-200 transition-colors flex items-center justify-center space-x-2 text-center"
                    title="Call Josan Support"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                    <span>Contact Josan Support (+65 6789 0123)</span>
                  </a>

                  <a
                    href="https://wa.me/6567890123"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs border border-emerald-200 transition-colors flex items-center justify-center space-x-2 text-center"
                    title="WhatsApp Josan Support"
                  >
                    <svg className="w-3.5 h-3.5 fill-current text-emerald-600 shrink-0" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    <span>WhatsApp Josan Support</span>
                  </a>
                </div>
              </div>

              {/* Parcel Freight Details */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4 text-xs">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Shipment Details</h3>
                
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-700 font-extrabold">From:</span>
                    <span className="font-extrabold text-slate-900">{currentShipment.sender || 'Razer (Asia-Pacific)'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-700 font-extrabold">To:</span>
                    <span className="font-extrabold text-slate-900">{currentShipment.receiver}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-700 font-extrabold">Goods:</span>
                    <span className="font-extrabold text-slate-900">{currentShipment.cargoType || 'Industrial Road Freight'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-700 font-extrabold">Weight:</span>
                    <span className="font-extrabold text-slate-900">{currentShipment.weight}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-700 font-extrabold">Declared Cargo Value:</span>
                    <span className="font-extrabold text-emerald-700">{currentShipment.declaredValue || '$45,000 USD'}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-700 font-extrabold">{isAir ? 'Air Freight Fee:' : 'Roadway Freight Fee:'}</span>
                    <span className="font-mono font-extrabold text-[#FF6B00]">{currentShipment.price}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleViewInvoice}
                    className="w-full py-2.5 bg-[#FF6B00] hover:bg-[#E55C00] text-white rounded-xl font-bold text-xs shadow-sm transition-all text-center cursor-pointer"
                  >
                    {isAir ? 'View Official Air Waybill (e-AWB)' : 'Generate Official Lorry Receipt (LR) / Waybill'}
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* 4. Small "Need help with this shipment?" Box Under Result */}
        <div className={`mt-8 ${isAuthorizedOwner ? 'max-w-7xl' : 'max-w-4xl mx-auto'}`}>
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-fade-in">
            <div className="space-y-1">
              <div className="flex items-center space-x-2.5">
                <span className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center font-bold text-sm">
                  💬
                </span>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Need help with this shipment?
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium pl-10">
                Contact our customer support desk for dispatch updates or queries:
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              {/* Phone */}
              <a
                href="tel:+6567890123"
                className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#10182D] text-xs font-bold border border-orange-200 transition-all active:scale-95"
                title="Call Josan Support"
              >
                <Phone className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>+65 6789 0123</span>
              </a>

              {/* Email */}
              <a
                href="mailto:contact@josanlogistics.com.sg"
                className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-all active:scale-95"
                title="Email Josan Support"
              >
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>contact@josanlogistics.com.sg</span>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/6567890123"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-all active:scale-95"
                title="Message on WhatsApp"
              >
                <svg className="w-3.5 h-3.5 fill-current text-emerald-600" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
          </>
        );
      })()}
      </div>

      {/* FULL-SCREEN INTERACTIVE GPS SATELLITE TRACKING MODAL FOR CUSTOMERS */}
      {fullscreenMapShipment && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col animate-fade-in">
          {/* Top Header Bar */}
          <div className="bg-slate-900 border-b border-slate-800 p-4 px-6 flex items-center justify-between shadow-2xl text-white">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-2xl bg-[#FF6B00] text-white flex items-center justify-center font-bold shadow-sm text-lg">
                🚛
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base font-extrabold font-mono text-white">{fullscreenMapShipment.id}</h2>
                  <span className="text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <span>SCHEDULED TRANSIT ROUTE</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  {fullscreenMapShipment.origin || 'Changi Air Cargo Freight Hub'} → {fullscreenMapShipment.destination || fullscreenMapShipment.dest || 'Woodlands Roadways Terminal'} (Driver: {fullscreenMapShipment.driverName || 'Tan Wei Ming'})
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={closeFullscreenMap}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs border border-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Close Highway View</span>
              </button>
            </div>
          </div>

          {/* Main Full-Screen Map Container */}
          <div className="flex-1 relative overflow-hidden bg-slate-900">
            <SingaporeGoogleMapBackground
              origin={fullscreenMapShipment.origin}
              destination={fullscreenMapShipment.destination || fullscreenMapShipment.dest}
              vehicle={fullscreenMapShipment.vehicle || 'Josan EV Express Truck #SG-8819'}
              truckProgress={truckProgress}
              currentSpeed={currentSpeed}
              showTruck={true}
            />
          </div>

          {/* Bottom Telematics Control Dashboard */}
          <div className="bg-slate-900 border-t border-slate-800 p-4 px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-300">
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Vehicle Telemetry</p>
              <p className="text-sm font-extrabold text-[#FF6B00] font-mono mt-0.5">
                {currentSpeed} KM/H (PIE Highway)
              </p>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <p className="text-[10px] text-slate-400 font-bold uppercase">GPS Satellite Coordinates</p>
              <p className="text-xs font-extrabold text-white font-mono mt-0.5">
                1.3521° N, 103.8198° E
              </p>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Estimated SLA Arrival</p>
              <p className="text-xs font-extrabold text-white font-mono mt-0.5">
                Today, 4:30 PM (SGT)
              </p>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Battery & Efficiency</p>
              <p className="text-xs font-extrabold text-emerald-400 font-mono mt-0.5">
                94% (EV SLA Active)
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
