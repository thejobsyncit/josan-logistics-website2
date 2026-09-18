import React, { useState, useEffect, useRef } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { RealTruckGraphic } from '../components/RealTruckGraphic';
import { SingaporeGoogleMapBackground } from '../components/SingaporeGoogleMapBackground';
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
  RotateCw
} from 'lucide-react';

const DEMO_SHIPMENTS_MAP = {
  'JOS-88190-SG': {
    id: 'JOS-88190-SG',
    referenceNumber: 'REF-8819-SG',
    status: 'In Transit',
    origin: 'Jurong Central Highway Freight Hub',
    destination: 'Woodlands Roadways Terminal',
    currentLocation: 'PIE Expressway Telematics Gate (Exit 19)',
    estimatedDelivery: 'Today, 4:30 PM (SGT)',
    lastUpdatedTime: '5 mins ago (Telematics Ping)',
    serviceLevel: 'Express Road Freight & Highway Linehaul (FTL)',
    cargoType: 'High-Tech Electronics & Components',
    driverName: 'Tan Wei Ming',
    driver: 'Tan Wei Ming',
    driverPhone: '+65 9123 4567',
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
      { step: 1, title: 'Book Shipment', location: 'Jurong Central Highway Depot', timestamp: 'Today 08:15 AM', completed: true },
      { step: 2, title: 'Confirmed', location: 'Operations Desk Hub', timestamp: 'Today 09:00 AM', completed: true },
      { step: 3, title: 'Pickup Scheduled', location: 'Jurong Central Highway Depot', timestamp: 'Today 09:45 AM', completed: true },
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
    origin: 'Tuas Mega Logistics Depot',
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
    sender: 'Tuas Pharma Cold Storage Hub',
    senderAddress: '20 Tuas South Ave 2, Singapore 637560',
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
      { step: 1, title: 'Book Shipment', location: 'Tuas Mega Cold Hub', timestamp: 'Today 05:30 AM', completed: true },
      { step: 2, title: 'Confirmed', location: 'Quality Assurance Desk', timestamp: 'Today 06:00 AM', completed: true },
      { step: 3, title: 'Pickup Scheduled', location: 'Tuas Bay 1', timestamp: 'Today 06:45 AM', completed: true },
      { step: 4, title: 'Picked Up', location: 'Tuas Mega Cold Hub Bay 1', timestamp: 'Today 07:15 AM', completed: true },
      { step: 5, title: 'In Transit', location: 'AYE Expressway Highway Corridor', timestamp: 'Today 08:30 AM', completed: true },
      { step: 6, title: 'Near Destination', location: 'Biopolis Biomedical Grove', timestamp: 'Today 10:50 AM', completed: true },
      { step: 7, title: 'Delivered', location: 'Biopolis Vault Bay 2', timestamp: 'Today 11:15 AM', completed: true, current: true }
    ]
  },
  'JOS-99210-SG': {
    id: 'JOS-99210-SG',
    referenceNumber: 'REF-9921-SG',
    status: 'Delayed',
    origin: 'Jurong Heavy Logistics Hub',
    destination: 'Woodlands Border Checkpoint Hub',
    currentLocation: 'KPE Expressway Highway (Rain Speed Advisory in Effect)',
    estimatedDelivery: 'Today, 07:45 PM (SGT)',
    lastUpdatedTime: '8 mins ago (Telematics Advisory)',
    serviceLevel: 'Cross-Border Highway Haulage (SG ↔ MY)',
    cargoType: 'Heavy Electrical Machinery & 18W Motors',
    driverName: 'Robert Martinez',
    driver: 'Robert Martinez',
    driverPhone: '+65 9112 3456',
    vehicle: '18-Wheeler Multi-Axle Heavy Haulier #SG-9921',
    vehiclePlate: 'SG-9921',
    vehicleType: '18-Wheeler Heavy Lowbed Haulier',
    sender: 'Singapore Jurong Heavy Industrial Yard',
    senderAddress: '15 Jurong Port Road, Singapore 619116',
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
      { step: 1, title: 'Book Shipment', location: 'Jurong Industrial Yard', timestamp: 'Today 07:30 AM', completed: true },
      { step: 2, title: 'Confirmed', location: 'Heavy Haulage Operations', timestamp: 'Today 08:30 AM', completed: true },
      { step: 3, title: 'Pickup Scheduled', location: 'Jurong Depot Loading Bay', timestamp: 'Today 09:15 AM', completed: true },
      { step: 4, title: 'Picked Up', location: 'Jurong Heavy Industrial Depot', timestamp: 'Today 09:45 AM', completed: true },
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
    showToast
  } = useLogistics();

  const generateRandomCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const [searchInput, setSearchInput] = useState(activeTrackingId || '');
  const [trackType, setTrackType] = useState('shipment');
  const [captchaCode, setCaptchaCode] = useState(generateRandomCaptcha);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  const generateNewCaptcha = () => {
    const code = generateRandomCaptcha();
    setCaptchaCode(code);
    setCaptchaInput('');
    setCaptchaError('');
    return code;
  };

  // Generate a fresh randomized captcha on mount
  useEffect(() => {
    generateNewCaptcha();
  }, []);

  const renderCaptchaSvg = (text) => {
    const colors = ['#1e40af', '#b91c1c', '#047857', '#c2410c', '#4338ca', '#0f172a', '#7c2d12', '#0284c7'];
    const currentCode = text || generateRandomCaptcha();
    const chars = currentCode.split('');
    return (
      <svg viewBox="0 0 220 50" className="w-full h-full select-none" preserveAspectRatio="none">
        <rect width="220" height="50" fill="#f8fafc" />
        
        {/* Subtle background security grid */}
        <line x1="0" y1="12" x2="220" y2="12" stroke="#e2e8f0" strokeWidth="0.8" />
        <line x1="0" y1="25" x2="220" y2="25" stroke="#e2e8f0" strokeWidth="0.8" />
        <line x1="0" y1="38" x2="220" y2="38" stroke="#e2e8f0" strokeWidth="0.8" />
        <line x1="45" y1="0" x2="45" y2="50" stroke="#f1f5f9" strokeWidth="1" />
        <line x1="90" y1="0" x2="90" y2="50" stroke="#f1f5f9" strokeWidth="1" />
        <line x1="135" y1="0" x2="135" y2="50" stroke="#f1f5f9" strokeWidth="1" />
        <line x1="180" y1="0" x2="180" y2="50" stroke="#f1f5f9" strokeWidth="1" />

        {/* Diagonal strike noise lines matching screenshot */}
        <line x1="15" y1="42" x2="195" y2="10" stroke="#3b82f6" strokeWidth="1.2" opacity="0.75" />
        <line x1="30" y1="8" x2="185" y2="44" stroke="#ef4444" strokeWidth="1.2" opacity="0.65" />
        <line x1="10" y1="24" x2="210" y2="28" stroke="#10b981" strokeWidth="1.5" opacity="0.5" />
        <line x1="75" y1="6" x2="155" y2="45" stroke="#f59e0b" strokeWidth="1.2" opacity="0.6" />
        <line x1="120" y1="46" x2="170" y2="8" stroke="#8b5cf6" strokeWidth="1" opacity="0.7" />

        {/* Characters with distinct rotation, colors and font sizing */}
        {chars.map((char, index) => {
          const charCodeVal = char.charCodeAt(0) || 65;
          const x = 22 + index * 31;
          const y = 33 + ((charCodeVal % 5) - 2);
          const rot = ((charCodeVal * 7 + index * 11) % 27) - 13;
          const color = colors[(charCodeVal + index * 3) % colors.length];
          return (
            <text
              key={`${char}-${index}`}
              x={x}
              y={y}
              transform={`rotate(${rot}, ${x}, ${y})`}
              fill={color}
              fontFamily="'Courier New', Courier, monospace, 'Times New Roman'"
              fontSize="28"
              fontWeight="900"
              letterSpacing="2"
            >
              {char}
            </text>
          );
        })}

        {/* Foreground squiggly strike line */}
        <path d="M 12 30 Q 60 10 110 32 T 208 22" fill="none" stroke="#64748b" strokeWidth="1.2" opacity="0.5" />
      </svg>
    );
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

    // 1. Highest Priority: Exact Demo Map matches for default parcel cards
    if (DEMO_SHIPMENTS_MAP[key]) {
      return { ...DEMO_SHIPMENTS_MAP[key] };
    }

    // Match demo by referenceNumber
    const demoByRef = Object.values(DEMO_SHIPMENTS_MAP).find(
      d => d.referenceNumber && d.referenceNumber.toUpperCase() === key
    );
    if (demoByRef) {
      return { ...demoByRef };
    }

    // 2. Second Priority: Find in context shipments array
    let found = (shipments || []).find(
      s => s?.id?.toUpperCase() === key || (s?.referenceNumber && s.referenceNumber.toUpperCase() === key)
    );
    if (found) {
      const driverNameVal = found.driverName || found.driver || (typeof sampleOrId === 'object' ? (sampleOrId.driverName || sampleOrId.driver) : null) || 'Tan Wei Ming';
      return {
        ...found,
        driverName: driverNameVal,
        driver: driverNameVal,
        driverPhone: found.driverPhone || (typeof sampleOrId === 'object' ? sampleOrId.driverPhone : null) || '+65 9123 4567',
        vehicle: found.vehicle || (typeof sampleOrId === 'object' ? sampleOrId.vehicle : null) || 'Josan EV Express Cargo Truck (SG-8819)',
        currentLocation: found.currentLocation || 'Singapore Telematics Central Hub',
        estimatedDelivery: found.estimatedDelivery || 'Today, 5:00 PM (SGT)',
        serviceLevel: found.serviceLevel || 'Express Freight (SG Same-Day)'
      };
    }

    // 3. Third Priority: Direct sample object passed
    if (typeof sampleOrId === 'object' && sampleOrId.id) {
      const driverNameVal = sampleOrId.driverName || sampleOrId.driver || 'Tan Wei Ming';
      return {
        id: sampleOrId.id || 'JOS-88190-SG',
        referenceNumber: sampleOrId.referenceNumber || 'REF-8819-SG',
        origin: sampleOrId.origin || 'Jurong Central Highway Depot',
        destination: sampleOrId.dest || sampleOrId.destination || 'Woodlands Roadways Terminal',
        status: sampleOrId.status || 'In Transit',
        currentLocation: sampleOrId.currentLocation || 'PIE Expressway Highway Corridor',
        driverName: driverNameVal,
        driver: driverNameVal,
        driverPhone: sampleOrId.driverPhone || '+65 9123 4567',
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
          { title: 'Consignment Booked & Lorry Receipt (LR) Issued', timestamp: 'Today 08:30 AM', location: 'Jurong Fleet Depot', completed: true },
          { title: 'Highway Linehaul En Route (GPS Telematics Active)', timestamp: 'Today 11:30 AM', location: 'PIE Expressway Corridor', completed: true, current: true },
          { title: 'Delivered & Digital Proof of Delivery (POD) Signed', timestamp: 'Pending', location: 'Destination Terminal', completed: false }
        ]
      };
    }

    // 4. Default fallback for custom tracking numbers (Roadway Trucking)
    const trackingCode = searchStr.toUpperCase();
    return {
      id: trackingCode,
      referenceNumber: `REF-${trackingCode.replace(/[^0-9]/g, '').slice(-4) || '8819'}-RD`,
      origin: 'Jurong Central Highway Freight Hub',
      destination: 'Woodlands Roadways Terminal',
      status: 'In Transit',
      currentLocation: 'PIE Expressway Telematics Gate (Exit 19)',
      driverName: 'Tan Wei Ming',
      driver: 'Tan Wei Ming',
      driverPhone: '+65 9123 4567',
      vehicle: 'Josan 14-Ton Highway Linehaul Truck #SG-8819',
      sender: 'TechCorp Solutions SG',
      senderAddress: '10 Pasir Panjang Road, Singapore 117438',
      receiver: 'Apex Dynamics SG Hub',
      receiverAddress: '89 Orchard Road, Singapore 238854',
      weight: '1,850 kg',
      pieces: 6,
      cargoType: 'Industrial Commercial Cargo',
      serviceLevel: 'Express Road Freight & Highway Linehaul (FTL)',
      declaredValue: 'S$ 42,000',
      price: 'S$ 580.00',
      createdDate: 'Aug 29, 2026',
      estimatedDelivery: 'Today, 4:30 PM (SGT)',
      timeline: [
        { title: 'Consignment Booked & Lorry Receipt (LR) Issued', timestamp: 'Today 08:30 AM', location: 'Jurong Fleet Depot Bay 3', completed: true },
        { title: 'Dispatched via Expressway Highway Corridor (GPS Locked)', timestamp: 'Today 10:15 AM', location: 'PIE Expressway Telematics Gate', completed: true, current: true },
        { title: 'Toll & Waypoint Checkpoint Inspected', location: 'Expressway Interchange 5', timestamp: 'Expected 02:45 PM', completed: false },
        { title: 'Delivered & Digital LR E-Signature Confirmed', timestamp: 'Expected 04:30 PM', location: 'Woodlands Roadways Terminal', completed: false }
      ]
    };
  };

  const [currentShipment, setCurrentShipment] = useState(() => (activeTrackingId ? resolveShipmentData(activeTrackingId) : null));
  const [fullscreenMapShipment, setFullscreenMapShipment] = useState(null);
  const mapSectionRef = useRef(null);

  // Live Moving Anime Truck animation state
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
    if (activeTrackingId) {
      setSearchInput(activeTrackingId);
      const found = resolveShipmentData(activeTrackingId);
      if (found) setCurrentShipment(found);
    }
  }, [activeTrackingId, shipments]);

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
      if (showToast) showToast(`Loaded Live Satellite Tracking Feed for #${found.id}`);
      setTimeout(() => {
        const el = document.getElementById('shipment-details');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  const closeFullscreenMap = () => {
    setFullscreenMapShipment(null);
  };

  const handleTrackingSubmit = (e) => {
    if (e) e.preventDefault();
    const query = searchInput.trim();
    if (!query) {
      setCaptchaError('Please enter a shipment or reference number');
      return;
    }
    if (!captchaInput.trim()) {
      setCaptchaError('Please enter the captcha shown above');
      return;
    }
    if (captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setCaptchaError('Invalid captcha. Please enter the characters shown above.');
      generateNewCaptcha();
      return;
    }

    setCaptchaError('');
    const found = resolveShipmentData(query);
    if (found) {
      setCurrentShipment(found);
      setActiveTrackingId(found.id);
      if (showToast) showToast(`Found Tracking Record for #${query.toUpperCase()}`);
      generateNewCaptcha();
      setTimeout(() => {
        const el = document.getElementById('shipment-details');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } else {
      setCaptchaError(`No shipment found matching "${query}". Please check the number.`);
      generateNewCaptcha();
    }
  };

  const handleViewInvoice = () => {
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
        <span className="text-orange-600 font-bold uppercase text-xs tracking-widest bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200 inline-block">
          Highway Fleet GPS Telematics
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Track Your Roadway Shipment
        </h1>
        <p className="text-slate-600 font-medium text-sm sm:text-base leading-relaxed">
          Monitor real-time highway telematics, toll & checkpoint releases, expressway transits, and live truck delivery milestones.
        </p>
      </div>

      {/* Centered, Clean "Track By" Card (Seamlessly Integrated with Page Design) */}
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all text-left">
          
          {/* Track By: Header */}
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Track By:
          </h3>

          {/* Radio Options with Brand Orange Indicator */}
          <div className="flex items-center space-x-6 mb-5">
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
                  trackType === 'shipment' ? 'border-orange-500 bg-white' : 'border-slate-300'
                }`}>
                  {trackType === 'shipment' && <div className="w-2 h-2 rounded-full bg-orange-500"></div>}
                </div>
              </div>
              <span className={`text-sm font-bold transition-colors ${
                trackType === 'shipment' ? 'text-slate-900' : 'text-slate-500'
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
                  trackType === 'reference' ? 'border-orange-500 bg-white' : 'border-slate-300'
                }`}>
                  {trackType === 'reference' && <div className="w-2 h-2 rounded-full bg-orange-500"></div>}
                </div>
              </div>
              <span className={`text-sm font-bold transition-colors ${
                trackType === 'reference' ? 'text-slate-900' : 'text-slate-500'
              }`}>
                Reference / Waybill No.
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
                  setSearchInput(e.target.value);
                  setCaptchaError('');
                  if (!e.target.value.trim()) {
                    setCurrentShipment(null);
                    setActiveTrackingId('');
                  }
                }}
                placeholder={trackType === 'shipment' ? 'Enter Shipment ID (e.g. JOS-88190-SG)' : 'Enter Reference / Waybill Number (e.g. REF-8819-SG)'}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200/90 rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 font-mono transition-all pr-10"
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

            {/* Captcha Image Display */}
            <div className="h-11 border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-2xs">
              {renderCaptchaSvg(captchaCode)}
            </div>

            {/* Captcha Input & Refresh Button */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => {
                  setCaptchaInput(e.target.value);
                  setCaptchaError('');
                }}
                placeholder="Enter captcha"
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-sm font-bold uppercase tracking-widest text-slate-900 placeholder:normal-case placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                required
              />
              <button
                type="button"
                onClick={generateNewCaptcha}
                title="Refresh Captcha"
                className="w-11 h-11 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200/80 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {captchaError && (
              <p className="text-xs text-rose-600 font-bold flex items-center space-x-1.5 animate-fade-in">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{captchaError}</span>
              </p>
            )}

            {/* Brand Orange TRACK SHIPMENT Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-extrabold text-sm tracking-wider uppercase rounded-xl shadow-orange-sm transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>TRACK SHIPMENT</span>
            </button>
          </form>

          {/* Bottom Info Section */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Can't Find Your Shipment ID?
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5 leading-relaxed">
                Your Consignment Note (CN) or Lorry Receipt (LR) number was sent via SMS or Email at booking confirmation.
              </p>
            </div>

            <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold shrink-0 self-start sm:self-auto">
              <Phone className="w-3 h-3 text-orange-500" />
              <span>24/7 Road Support Active</span>
            </span>
          </div>

        </div>
      </div>

      {/* Quick Test Queue Chips */}
      <div className="max-w-4xl mx-auto space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
            Sample Roadway Fleet Feeds (Click to test):
          </span>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-orange-600 font-bold">4 Active Roadway Trucks</span>
            <button
              type="button"
              onClick={handleViewInvoice}
              className="text-xs font-bold text-slate-600 hover:text-orange-600 flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-orange-500" />
              <span>View LR / Waybill</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { id: 'JOS-88190-SG', ref: 'REF-8819-SG', name: 'Express Road Freight (FTL)', status: 'In Transit', statusColor: 'bg-orange-50 text-orange-700 border-orange-200' },
            { id: 'JOS-44021-SG', ref: 'REF-4402-SG', name: 'Container Haulage (40ft)', status: 'Out for Delivery', statusColor: 'bg-blue-50 text-blue-700 border-blue-200' },
            { id: 'JOS-66301-SG', ref: 'REF-6630-SG', name: 'Reefer Road Truck (Cold-Chain)', status: 'Delivered', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            { id: 'JOS-99210-SG', ref: 'REF-9921-SG', name: '18-Wheeler Heavy Haulage', status: 'Monsoon Delay', statusColor: 'bg-amber-50 text-amber-700 border-amber-200' }
          ].map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => {
                setSearchInput(trackType === 'reference' ? sample.ref : sample.id);
                handleSelectDemo(sample.id);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 group ${
                currentShipment?.id === sample.id
                  ? 'bg-orange-50/50 border-orange-500 shadow-sm ring-1 ring-orange-500/40'
                  : 'bg-white border-slate-200/90 hover:border-orange-400 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{sample.id}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sample.statusColor}`}>
                  {sample.status}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium truncate block">{sample.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Shipment Details Section */}
      <div id="shipment-details" className="scroll-mt-24">
      {currentShipment && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Status & Interactive Timeline */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Status Header Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <p className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Roadway Tracking / LR Number</p>
                  <h2 className="text-2xl font-extrabold text-slate-900 font-mono">{currentShipment.id}</h2>
                  {currentShipment.referenceNumber && (
                    <p className="text-xs text-slate-500 font-mono mt-0.5">Waybill Ref: {currentShipment.referenceNumber}</p>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase flex items-center space-x-2 ${
                    currentShipment.status === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : currentShipment.status === 'Delayed'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                      : 'bg-orange-100 text-orange-800 border border-orange-300 pulse-badge'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      currentShipment.status === 'Delivered' ? 'bg-emerald-500' : currentShipment.status === 'Delayed' ? 'bg-amber-500' : 'bg-orange-500'
                    }`}></span>
                    <span>{currentShipment.status}</span>
                  </span>
                </div>
              </div>

              {/* 9 Required Display Fields Grid: ID, Status, Pickup, Destination, Current Location, Driver, Vehicle, ETA, Last Updated */}
              <div className="bg-[#F5F6F8] p-5 rounded-2xl border border-[#E2E8F0] space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
                  <div>
                    <p className="text-[#64748B] font-semibold uppercase text-[10px] tracking-wider">Shipment ID</p>
                    <p className="font-mono font-bold text-[#10182D] text-xs sm:text-sm mt-0.5">{currentShipment.id}</p>
                  </div>
                  <div>
                    <p className="text-[#64748B] font-semibold uppercase text-[10px] tracking-wider">Current Status</p>
                    <p className="font-bold text-orange text-xs sm:text-sm mt-0.5">{currentShipment.status}</p>
                  </div>
                  <div>
                    <p className="text-[#64748B] font-semibold uppercase text-[10px] tracking-wider">Pickup Location</p>
                    <p className="font-bold text-[#10182D] text-xs sm:text-sm mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                      <span className="truncate">{currentShipment.origin || 'Jurong Central Hub'}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[#64748B] font-semibold uppercase text-[10px] tracking-wider">Destination</p>
                    <p className="font-bold text-[#10182D] text-xs sm:text-sm mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                      <span className="truncate">{currentShipment.destination || 'Woodlands Terminal'}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[#64748B] font-semibold uppercase text-[10px] tracking-wider">Current Location</p>
                    <p className="font-bold text-[#FF6B00] text-xs sm:text-sm mt-0.5 flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{currentShipment.currentLocation || 'Expressway Corridor'}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[#64748B] font-semibold uppercase text-[10px] tracking-wider">Assigned Driver</p>
                    <p className="font-bold text-[#10182D] text-xs sm:text-sm mt-0.5 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                      <span className="truncate">{currentShipment.driverName || currentShipment.driver || 'Tan Wei Ming'}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[#64748B] font-semibold uppercase text-[10px] tracking-wider">Vehicle Plate / Class</p>
                    <p className="font-bold text-[#10182D] text-xs sm:text-sm mt-0.5 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                      <span className="truncate">{currentShipment.vehiclePlate || 'SG-8819'}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[#64748B] font-semibold uppercase text-[10px] tracking-wider">Estimated Delivery</p>
                    <p className="font-bold text-[#10182D] text-xs sm:text-sm mt-0.5 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                      <span>{currentShipment.estimatedDelivery || 'Today, Scheduled'}</span>
                    </p>
                  </div>
                </div>

                {/* Sub-bar: Last Updated Time & Telematics Architecture Notice */}
                <div className="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Last Updated: <strong className="text-slate-800">{currentShipment.lastUpdatedTime || 'Just now'}</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="italic text-slate-400">Structured for Regional GPS / IoT Telematics API</span>
                    <button
                      type="button"
                      onClick={() => setSelectedDetailShipment(currentShipment)}
                      className="text-orange font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Open Full Dossier & POD</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Standardized 7-Stage Timeline: Booked → Confirmed → Pickup Scheduled → Picked Up → In Transit → Near Destination → Delivered */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#10182D] uppercase tracking-wider block">
                    7-Stage Consignment Progression Timeline
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Stage {(() => {
                      const st = currentShipment.status;
                      if (st === 'Delivered') return '7 of 7';
                      if (st === 'Near Destination') return '6 of 7';
                      if (st === 'In Transit' || st === 'Delayed') return '5 of 7';
                      if (st === 'Picked Up') return '4 of 7';
                      if (st === 'Pickup Scheduled') return '3 of 7';
                      if (st === 'Confirmed') return '2 of 7';
                      return '1 of 7';
                    })()}
                  </span>
                </div>

                {(() => {
                  const status = currentShipment.status || '';
                  const getStepNum = (s) => {
                    switch (s) {
                      case 'Booked': return 1;
                      case 'Confirmed': return 2;
                      case 'Pickup Scheduled': return 3;
                      case 'Picked Up': return 4;
                      case 'In Transit':
                      case 'Delayed': return 5;
                      case 'Near Destination': return 6;
                      case 'Delivered': return 7;
                      default: return 5;
                    }
                  };
                  const activeStep = getStepNum(status);
                  const stages7 = [
                    { num: 1, label: 'Book Shipment' },
                    { num: 2, label: 'Confirmed' },
                    { num: 3, label: 'Pickup Scheduled' },
                    { num: 4, label: 'Picked Up' },
                    { num: 5, label: 'In Transit' },
                    { num: 6, label: 'Near Destination' },
                    { num: 7, label: 'Delivered' }
                  ];

                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                      {stages7.map((st) => {
                        const isDone = activeStep >= st.num;
                        const isCurrent = activeStep === st.num;
                        return (
                          <div
                            key={st.num}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              isCurrent
                                ? 'bg-[#FFF8F2] border-[#FF6B00] shadow-xs'
                                : isDone
                                ? 'bg-white border-[#16A34A]/40'
                                : 'bg-[#F5F6F8] border-[#E2E8F0] opacity-60'
                            }`}
                          >
                            <div className={`w-5 h-5 mx-auto rounded-full text-[10px] font-bold flex items-center justify-center mb-1 ${
                              isCurrent
                                ? 'bg-[#FF6B00] text-white ring-2 ring-orange/20'
                                : isDone
                                ? 'bg-[#16A34A] text-white'
                                : 'bg-[#CBD5E1] text-[#64748B]'
                            }`}>
                              {isDone && !isCurrent ? '✓' : st.num}
                            </div>
                            <span className={`text-[11px] font-bold block truncate ${isCurrent ? 'text-[#FF6B00]' : 'text-[#10182D]'}`}>
                              {st.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* AUTOMATED WEATHER & TELEMATICS RADAR ALERT BANNER */}
              {(currentShipment.status === 'Delayed' || currentShipment.weatherDelay?.active) && (
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
                      <span>📧 <strong>Email Alert Issued:</strong> Live roadway telemetry log delivered</span>
                    </div>
                  </div>
                </div>
              )}


              {/* DELIVERY TIMELINE (ORANGE PROGRESS INDICATORS) */}
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-6">Highway Delivery Stepper</h3>
                
                <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3.5 sm:before:left-4 before:top-3 before:bottom-3 before:w-1 before:bg-slate-200">
                  {currentShipment.timeline.map((step, idx) => {
                    const isCompleted = step.completed;
                    const isCurrent = step.current;

                    return (
                      <div key={idx} className="relative flex items-start space-x-4 group">
                        
                        {/* Timeline Node Icon */}
                        <div className={`absolute -left-6 sm:-left-8 top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10 ${
                          isCurrent
                            ? 'bg-orange-500 text-white ring-4 ring-orange-100 pulse-badge scale-110 shadow-orange-sm'
                            : isCompleted
                            ? 'bg-orange-500 text-white'
                            : 'bg-slate-200 text-slate-400'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> : idx + 1}
                        </div>

                        {/* Step Details */}
                        <div className={`flex-1 p-4 rounded-xl border transition-all ${
                          isCurrent
                            ? 'bg-orange-50/70 border-orange-200 shadow-sm'
                            : isCompleted
                            ? 'bg-white border-slate-200'
                            : 'bg-slate-50 border-slate-200 opacity-60'
                        }`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <h4 className={`text-sm font-extrabold ${isCurrent ? 'text-orange-600' : 'text-slate-900'}`}>
                              {step.title}
                            </h4>
                            <span className="text-[11px] font-semibold text-slate-500 font-mono">{step.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{step.location}</span>
                          </p>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* DIGITAL PROOF OF DELIVERY (POD) CALLOUT */}
              {currentShipment.status === 'Delivered' && (
                <div className="bg-[#FFF8F2] border-2 border-orange/40 rounded-2xl p-5 space-y-3 shadow-sm animate-fade-in">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[#10182D] font-extrabold text-sm font-outfit">
                      <ShieldCheck className="w-5 h-5 text-orange" />
                      <span>Electronic Proof of Delivery (e-POD) Verified</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedDetailShipment(currentShipment)}
                      className="px-4 py-2 bg-orange hover:bg-orange/90 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>View & Download Official POD PDF</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-orange/20 text-xs">
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

          {/* Right Sidebar Specs & Driver Info */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Driver Specs Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Assigned Driver & Commercial Vehicle</h3>
              
              <div className="flex items-center space-x-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center border-2 border-orange-300">
                  {(currentShipment.driverName || currentShipment.driver || 'D').charAt(0)}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{currentShipment.driverName || currentShipment.driver || 'Tan Wei Ming'}</h4>
                  <p className="text-xs text-orange-600 font-semibold">{currentShipment.vehicle || 'Josan 14-Ton Highway Linehaul Truck #SG-8819'}</p>
                  <p className="text-[10px] text-slate-500">Commercial License: Valid & Verified (Class 4/5)</p>
                </div>
              </div>

              <a
                href={`tel:${currentShipment.driverPhone || '+65 9123 4567'}`}
                className="w-full py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl font-bold text-xs border border-orange-200 transition-colors flex items-center justify-center space-x-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call Driver ({currentShipment.driverPhone || '+65 9123 4567'})</span>
              </a>
            </div>

            {/* Parcel Freight Details */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4 text-xs">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Roadway Consignment Specifications</h3>
              
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-700 font-extrabold">Sender / Origin Depot:</span>
                  <span className="font-extrabold text-slate-900">{currentShipment.sender || 'Razer (Asia-Pacific)'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-700 font-extrabold">Receiver / Destination Dock:</span>
                  <span className="font-extrabold text-slate-900">{currentShipment.receiver}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-700 font-extrabold">Cargo Classification:</span>
                  <span className="font-extrabold text-slate-900">{currentShipment.cargoType || 'Industrial Road Freight'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-700 font-extrabold">Gross Weight & Units:</span>
                  <span className="font-extrabold text-slate-900">{currentShipment.weight}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-700 font-extrabold">Declared Cargo Value:</span>
                  <span className="font-extrabold text-emerald-700">{currentShipment.declaredValue || '$45,000 USD'}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-700 font-extrabold">Roadway Freight Fee:</span>
                  <span className="font-mono font-extrabold text-orange-600">{currentShipment.price}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleViewInvoice}
                  className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs shadow-orange-sm transition-all text-center cursor-pointer"
                >
                  Generate Official Lorry Receipt (LR) / Waybill
                </button>
              </div>
            </div>

          </div>

        </div>
      )}
      </div>

      {/* FULL-SCREEN INTERACTIVE LIVE GPS SATELLITE TRACKING MODAL FOR CUSTOMERS */}
      {fullscreenMapShipment && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col animate-fade-in">
          {/* Top Header Bar */}
          <div className="bg-slate-900 border-b border-slate-800 p-4 px-6 flex items-center justify-between shadow-2xl text-white">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-orange-glow text-lg">
                🚛
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base font-extrabold font-mono text-white">{fullscreenMapShipment.id}</h2>
                  <span className="text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>HIGHWAY GPS SIGNAL ACTIVE</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  {fullscreenMapShipment.origin || 'Jurong Central Highway Freight Hub'} → {fullscreenMapShipment.destination || fullscreenMapShipment.dest || 'Woodlands Roadways Terminal'} (Driver: {fullscreenMapShipment.driverName || 'Tan Wei Ming'})
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
              <p className="text-[10px] text-slate-400 font-bold uppercase">Live Vehicle Telemetry</p>
              <p className="text-sm font-extrabold text-orange-400 font-mono mt-0.5">
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
