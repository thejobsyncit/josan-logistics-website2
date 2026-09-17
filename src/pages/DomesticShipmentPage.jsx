import React, { useState, useMemo } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import {
  Truck,
  MapPin,
  Package,
  Clock,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Check,
  User,
  Phone,
  Info,
  Building,
  Navigation,
  Search,
  X,
  ChevronDown,
  ChevronLeft,
  CreditCard,
  FileText,
  Lock,
  Loader2,
  Receipt,
  Download,
  ChevronRight,
  Zap,
  Thermometer,
  Gem,
  Wrench,
  BookOpen,
  Cable,
  Shirt,
  Laptop,
  Pill,
  Utensils,
  Home,
  Boxes,
  AlertCircle
} from 'lucide-react';
import { CargoTypeSelector } from '../components/CargoTypeSelector';

export const contentCategories = [
  { id: 'documents', name: 'DOCUMENTS', icon: FileText },
  { id: 'artificial-jewellery', name: 'ARTIFICIAL JEWELLERY', icon: Gem },
  { id: 'auto-machine-parts', name: 'AUTO / MACHINE PARTS', icon: Wrench },
  { id: 'books', name: 'BOOKS', icon: BookOpen },
  { id: 'cables-wires', name: 'CABLES/WIRES (USB)', icon: Cable },
  { id: 'clothes-apparel', name: 'CLOTHES / APPAREL', icon: Shirt },
  { id: 'electronic-items', name: 'ELECTRONIC ITEMS', icon: Laptop },
  { id: 'medicines-healthcare', name: 'MEDICINES / HEALTHCARE', icon: Pill },
  { id: 'food-dry-snacks', name: 'FOOD / DRY SNACKS', icon: Utensils },
  { id: 'household-goods', name: 'HOUSEHOLD GOODS', icon: Home },
  { id: 'other-commodity', name: 'OTHER COMMODITY', icon: Boxes }
];

export const vehicleOptions = [
  {
    id: 'motorbike',
    label: 'Motorbike',
    maxWeight: 8,
    rate: 8,
    image: '/assets/vehicle_motorbike.jpg'
  },
  {
    id: 'mpv',
    label: 'MPV / SUV',
    maxWeight: 120,
    rate: 18,
    image: '/assets/vehicle_mpv.jpg'
  },
  {
    id: 'van',
    label: '1.7m Van',
    maxWeight: 500,
    rate: 28,
    image: '/assets/van_1_7m.jpg'
  },
  {
    id: 'large_van',
    label: '2.4m Van',
    maxWeight: 900,
    rate: 42,
    image: '/assets/van_2_4m_highroof.jpg'
  },
  {
    id: 'lorry_10ft',
    label: '10ft Lorry',
    maxWeight: 1500,
    rate: 60,
    image: '/assets/vehicle_10ft_lorry.jpg'
  },
  {
    id: 'lorry',
    label: '14ft Lorry',
    maxWeight: 3500,
    rate: 90,
    image: '/assets/lorry_14ft_tailgate.jpg'
  },
  {
    id: 'truck_24ft',
    label: '24ft Lorry',
    maxWeight: 10000,
    rate: 150,
    image: '/assets/lorry_24ft_heavy.jpg'
  },
  {
    id: 'cold_chain',
    label: 'Cold-Chain Van',
    maxWeight: 800,
    rate: 65,
    image: '/assets/vehicle_cold_chain.jpg'
  }
];

export const packageTypeOptions = [
  'Carton / Box',
  'Pallet / Skid',
  'Crate / Wooden Case',
  'Document / Envelope',
  'Bag / Polymailer',
  'Drum / Barrel',
  'Roll / Bundle',
  'Irregular / Loose Cargo'
];

const timeSlots = ['9:00 AM - 11:00 AM', '11:00 AM - 1:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 6:00 PM'];

export const detectCityFromPincode = (code) => {
  if (!code) return null;
  const clean = String(code).trim();
  if (clean.length < 3) return null;

  // Major Indian logistics hubs & postal zones
  if (clean.startsWith('600') || clean.startsWith('601') || clean.startsWith('602') || clean.startsWith('603')) return 'CHENNAI';
  if (clean.startsWith('641') || clean.startsWith('642')) return 'COIMBATORE';
  if (clean.startsWith('625')) return 'MADURAI';
  if (clean.startsWith('620')) return 'TIRUCHIRAPPALLI';
  if (clean.startsWith('636')) return 'SALEM';
  if (clean.startsWith('682') || clean.startsWith('683')) return 'KOCHI';
  if (clean.startsWith('695')) return 'THIRUVANANTHAPURAM';
  if (clean.startsWith('560') || clean.startsWith('561') || clean.startsWith('562')) return 'BENGALURU';
  if (clean.startsWith('570')) return 'MYSURU';
  if (clean.startsWith('500') || clean.startsWith('501') || clean.startsWith('502')) return 'HYDERABAD';
  if (clean.startsWith('530')) return 'VISAKHAPATNAM';
  if (clean.startsWith('520')) return 'VIJAYAWADA';
  if (clean.startsWith('400') || clean.startsWith('401')) return 'MUMBAI';
  if (clean.startsWith('411') || clean.startsWith('412')) return 'PUNE';
  if (clean.startsWith('440')) return 'NAGPUR';
  if (clean.startsWith('422')) return 'NASHIK';
  if (clean.startsWith('380') || clean.startsWith('382')) return 'AHMEDABAD';
  if (clean.startsWith('395') || clean.startsWith('394')) return 'SURAT';
  if (clean.startsWith('390')) return 'VADODARA';
  if (clean.startsWith('302')) return 'JAIPUR';
  if (clean.startsWith('342')) return 'JODHPUR';
  if (clean.startsWith('110')) return 'NEW DELHI';
  if (clean.startsWith('201')) return 'NOIDA / NCR';
  if (clean.startsWith('122')) return 'GURUGRAM';
  if (clean.startsWith('121')) return 'FARIDABAD';
  if (clean.startsWith('160')) return 'CHANDIGARH';
  if (clean.startsWith('141')) return 'LUDHIANA';
  if (clean.startsWith('143')) return 'AMRITSAR';
  if (clean.startsWith('700') || clean.startsWith('711')) return 'KOLKATA';
  if (clean.startsWith('800')) return 'PATNA';
  if (clean.startsWith('226')) return 'LUCKNOW';
  if (clean.startsWith('208')) return 'KANPUR';
  if (clean.startsWith('282')) return 'AGRA';
  if (clean.startsWith('221')) return 'VARANASI';
  if (clean.startsWith('452')) return 'INDORE';
  if (clean.startsWith('462')) return 'BHOPAL';
  if (clean.startsWith('751')) return 'BHUBANESWAR';
  if (clean.startsWith('781')) return 'GUWAHATI';
  if (clean.startsWith('834')) return 'RANCHI';
  if (clean.startsWith('492')) return 'RAIPUR';

  // Singapore postal districts
  if (clean.startsWith('01') || clean.startsWith('02') || clean.startsWith('03') || clean.startsWith('04')) return 'SINGAPORE CBD / MARINA';
  if (clean.startsWith('22') || clean.startsWith('23')) return 'ORCHARD';
  if (clean.startsWith('56') || clean.startsWith('57')) return 'ANG MO KIO';
  if (clean.startsWith('60') || clean.startsWith('61') || clean.startsWith('62')) return 'JURONG / WEST';
  if (clean.startsWith('46') || clean.startsWith('47')) return 'BEDOK / EAST';
  if (clean.startsWith('52') || clean.startsWith('53')) return 'TAMPINES';
  if (clean.startsWith('82')) return 'PUNGGOL';
  if (clean.startsWith('73')) return 'WOODLANDS';

  if (/^\d{6}$/.test(clean)) {
    return 'EXPRESS HUB';
  }
  return null;
};

export const DomesticShipmentPage = ({ setActiveTab, hideHero = false }) => {
  const { addShipment, showToast, setShipmentScope } = useLogistics();

  // Multi-step flow: Step 1 (Pincodes & Sender/Receiver Details) -> Step 2 (Vehicle & Package Specs)
  const [currentStep, setCurrentStep] = useState(1);

  const [form, setForm] = useState({
    originPincode: '',
    destinationPincode: '',
    senderName: '',
    senderPhone: '',
    pickupAddress: '',
    pickupPostal: '',
    receiverName: '',
    receiverPhone: '',
    deliveryAddress: '',
    deliveryPostal: '',
    content: '',
    weight: '',
    weightUnit: 'kg',
    length: '',
    width: '',
    height: '',
    declaredValue: '',
    packageType: 'Carton / Box',
    pieces: 1,
    cargoType: 'General Cargo',
    vehicle: 'van',
    timeSlot: timeSlots[0]
  });

  const [contentSearch, setContentSearch] = useState('');
  const [activeInfoModal, setActiveInfoModal] = useState(null);
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [confirmedId, setConfirmedId] = useState(null);

  // Payment & Checkout State
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: '',
    saveCard: true
  });
  const [corporateData, setCorporateData] = useState({
    poNumber: '',
    department: 'Logistics Operations'
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [confirmedPaymentInfo, setConfirmedPaymentInfo] = useState(null);

  // Road Fleet Vehicle Dimensions & Payload Guide Active Tab
  const [selectedGuideVehicleId, setSelectedGuideVehicleId] = useState('van');

  const vehicleFleetSpecs = [
    {
      id: 'van',
      vehicleOptionId: 'van',
      name: '1.7T Sprinter Delivery Van',
      category: 'City Express & Parcel Logistics',
      badge: 'Light Commercial (LCV)',
      payload: '1,500 kg',
      volume: '12.5 m³',
      pallets: '2 Standard Pallets',
      dimensions: '3.2m (L) × 1.7m (W) × 1.8m (H)',
      access: 'Dual Rear 270° Barn Doors & Side Sliding Door',
      telematics: 'Live GPS Telemetry, Geo-fence Alerting',
      idealFor: ['High-value retail cartons', 'Urgent biomedical supplies', 'E-Commerce last-mile drops']
    },
    {
      id: 'lorry',
      vehicleOptionId: 'lorry_10ft',
      name: '10T Rigid Box Lorry',
      category: 'Medium-Duty LTL Consolidation',
      badge: 'Medium Commercial (MCV)',
      payload: '8,500 kg',
      volume: '38.0 m³',
      pallets: '10 - 12 Standard Pallets',
      dimensions: '7.2m (L) × 2.4m (W) × 2.5m (H)',
      access: 'Hydraulic 1.5-Ton Cantilever Tail-Lift',
      telematics: 'Electronic Waybill, Fleet Speed Governors',
      idealFor: ['Consolidated pallet distribution', 'FMCG supermarket stocks', 'Wholesale manufacturing parts']
    },
    {
      id: 'trailer',
      vehicleOptionId: 'truck_24ft',
      name: '24T Multi-Axle Prime Mover',
      category: 'Heavy-Duty FTL & Industrial Haulage',
      badge: 'Heavy Articulated (FTL)',
      payload: '24,000 kg',
      volume: '76.0 m³',
      pallets: '24 - 26 Standard Pallets',
      dimensions: '13.6m (L) × 2.45m (W) × 2.7m (H)',
      access: 'Full Side Curtain-Slider & Rear Dock Loading',
      telematics: '24/7 Satellite Telemetry, Axle Weight Sensors',
      idealFor: ['Full container load (FCL)', 'Heavy industrial machinery', 'Port-to-depot container haulage']
    },
    {
      id: 'reefer',
      vehicleOptionId: 'cold_chain',
      name: 'Multi-Temp Reefer Van',
      category: 'Cold Chain & Active Thermoregulation',
      badge: 'Temperature-Controlled (-25°C to +25°C)',
      payload: '5,000 kg',
      volume: '26.0 m³',
      pallets: '6 - 8 Euro Pallets',
      dimensions: '5.8m (L) × 2.2m (W) × 2.2m (H)',
      access: 'Insulated Double Gasket Sealed Doors with Thermal Curtains',
      telematics: 'Dual-Probe IoT Datalogger, Real-Time Chilled Telemetry',
      idealFor: ['Vaccines & pharmaceutical vials', 'Fresh produce & seafood', 'Temperature-critical chemicals']
    }
  ];

  const activeFleetSpec = vehicleFleetSpecs.find(v => v.id === selectedGuideVehicleId) || vehicleFleetSpecs[0];

  const handleApplyGuideVehicle = (vehicleOptionId, vehicleName) => {
    setForm(f => ({ ...f, vehicle: vehicleOptionId }));
    showToast(`Selected ${vehicleName} for your shipment`, 'success');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleCardNumberChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    setCardData((prev) => ({ ...prev, number: formatted }));
    if (errors.cardNumber) setErrors((prev) => ({ ...prev, cardNumber: undefined }));
  };

  const handleCardExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setCardData((prev) => ({ ...prev, expiry: val }));
    if (errors.cardExpiry) setErrors((prev) => ({ ...prev, cardExpiry: undefined }));
  };

  const handleCardCvvChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardData((prev) => ({ ...prev, cvv: val }));
    if (errors.cardCvv) setErrors((prev) => ({ ...prev, cardCvv: undefined }));
  };

  const update = (field) => (e) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleNameChange = (field) => (e) => {
    // Strictly block digits and numbers, only allow letters, spaces, hyphens, and apostrophes
    const val = e.target.value.replace(/[^a-zA-Z\s.'-]/g, '');
    setForm((f) => ({ ...f, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleNameKeyDown = (e) => {
    // Allow editing/navigation keys
    if (
      ['Backspace', 'Tab', 'Delete', 'ArrowLeft', 'ArrowRight', 'Enter', ' '].includes(e.key) ||
      e.ctrlKey ||
      e.metaKey
    ) {
      return;
    }
    // Block numbers and non-alphabetic characters
    if (!/^[a-zA-Z\s.'-]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handlePhoneChange = (field) => (e) => {
    // Strip everything that is not a digit
    let val = e.target.value.replace(/\D/g, '');
    // If user pasted with 65 country code (e.g. 6591234567), strip the leading 65
    if (val.startsWith('65') && val.length > 8) {
      val = val.slice(2);
    }
    // Strictly cap at 8 digits
    val = val.slice(0, 8);
    setForm((f) => ({ ...f, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePhoneKeyDown = (e) => {
    // Allow navigation/editing keys (Backspace, Tab, Delete, Arrow keys, Copy/Paste)
    if (
      ['Backspace', 'Tab', 'Delete', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key) ||
      e.ctrlKey ||
      e.metaKey
    ) {
      return;
    }
    // Block any non-digit
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const selectedVehicle = vehicleOptions.find((v) => v.id === form.vehicle) || vehicleOptions[2];

  const estimatedPrice = useMemo(() => {
    const w = parseFloat(form.weight) || 1;
    const base = selectedVehicle.rate;
    // Tiered weight allowance included with each vehicle type
    const freeAllowance = Math.min(selectedVehicle.maxWeight * 0.4, 250);
    const excessWeight = Math.max(0, w - freeAllowance);
    const excessRate = selectedVehicle.maxWeight >= 1500 ? 0.04 : selectedVehicle.maxWeight >= 500 ? 0.08 : 0.25;
    const total = base + excessWeight * excessRate;
    return total.toFixed(2);
  }, [form.weight, selectedVehicle]);

  const originCity = detectCityFromPincode(form.originPincode || form.pickupPostal);
  const destinationCity = detectCityFromPincode(form.destinationPincode || form.deliveryPostal);

  const validateStep1 = () => {
    const next = {};
    const originPin = (form.originPincode || form.pickupPostal || '').trim();
    if (!originPin) {
      next.originPincode = 'Sender Pincode is required!';
    } else if (!/^\d{6}$/.test(originPin)) {
      next.originPincode = 'Enter a valid 6-digit pincode';
    }

    const destPin = (form.destinationPincode || form.deliveryPostal || '').trim();
    if (!destPin) {
      next.destinationPincode = 'Receiver Pincode is required!';
    } else if (!/^\d{6}$/.test(destPin)) {
      next.destinationPincode = 'Enter a valid 6-digit pincode';
    }

    if (!form.senderName.trim()) {
      next.senderName = 'Sender name is required';
    } else if (/\d/.test(form.senderName)) {
      next.senderName = 'Name must only contain letters (no numbers)';
    }
    
    // Singapore phone validation (8 digits)
    const cleanSenderPhone = (form.senderPhone || '').replace(/\D/g, '');
    if (!cleanSenderPhone) {
      next.senderPhone = 'Sender mobile number is required';
    } else if (cleanSenderPhone.length !== 8) {
      next.senderPhone = 'Singapore mobile number must be exactly 8 digits';
    }

    if (!form.pickupAddress.trim()) next.pickupAddress = 'Pickup street address is required';

    if (!form.receiverName.trim()) {
      next.receiverName = 'Receiver name is required';
    } else if (/\d/.test(form.receiverName)) {
      next.receiverName = 'Name must only contain letters (no numbers)';
    }

    // Singapore phone validation (8 digits)
    const cleanReceiverPhone = (form.receiverPhone || '').replace(/\D/g, '');
    if (!cleanReceiverPhone) {
      next.receiverPhone = 'Receiver mobile number is required';
    } else if (cleanReceiverPhone.length !== 8) {
      next.receiverPhone = 'Singapore mobile number must be exactly 8 digits';
    }

    if (!form.deliveryAddress.trim()) next.deliveryAddress = 'Delivery street address is required';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateStep2ShipmentDetails = () => {
    const next = {};
    if (!form.content) {
      next.content = 'Please select shipment content';
    }
    if (!form.weight || parseFloat(form.weight) <= 0) {
      next.weight = 'Please enter weight in kg';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateStep3 = () => {
    const next = {};
    if (!form.weight || parseFloat(form.weight) <= 0) next.weight = 'Enter parcel weight';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleProceedToStep2 = () => {
    if (!validateStep1()) {
      showToast('Please provide origin & destination pincodes and contact details', 'warning');
      return;
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToStep3 = () => {
    if (!validateStep2ShipmentDetails()) {
      showToast('Please select shipment content and enter weight', 'warning');
      return;
    }
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToStep4 = (e) => {
    if (e) e.preventDefault();
    if (!validateStep3()) {
      showToast('Please fix the highlighted vehicle and package fields', 'warning');
      return;
    }
    if (!cardData.name) {
      setCardData((prev) => ({ ...prev, name: form.senderName || 'Valued Customer' }));
    }
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProcessPayment = (e) => {
    if (e) e.preventDefault();
    if (isProcessingPayment) return;

    if (paymentMethod === 'card') {
      const cleanNum = (cardData.number || '').replace(/\s/g, '');
      if (cleanNum.length < 15) {
        setErrors((prev) => ({ ...prev, cardNumber: 'Enter valid 16-digit card number' }));
        showToast('Please enter a valid credit/debit card number', 'warning');
        return;
      }
      if (!cardData.expiry || cardData.expiry.length < 5) {
        setErrors((prev) => ({ ...prev, cardExpiry: 'Enter MM/YY' }));
        showToast('Please enter card expiry date (MM/YY)', 'warning');
        return;
      }
      if (!cardData.cvv || cardData.cvv.length < 3) {
        setErrors((prev) => ({ ...prev, cardCvv: 'Enter 3-digit CVV' }));
        showToast('Please enter CVV security code', 'warning');
        return;
      }
    }

    if (paymentMethod === 'corporate') {
      if (!corporateData.poNumber.trim()) {
        setErrors((prev) => ({ ...prev, poNumber: 'Enter PO Reference' }));
        showToast('Please enter a Purchase Order (PO) Reference', 'warning');
        return;
      }
    }

    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);

      const pickupCityName = originCity || 'Origin Hub';
      const deliveryCityName = destinationCity || 'Destination Hub';
      const txnNumber = `TXN-SG-${Math.floor(100000 + Math.random() * 900000)}`;

      const methodLabel =
        paymentMethod === 'card'
          ? 'Credit/Debit Card'
          : 'Corporate Net-30 Invoice';

      const statusLabel = paymentMethod === 'corporate' ? 'Invoiced (Net-30)' : 'Paid';

      const shipment = addShipment({
        senderName: form.senderName,
        senderPhone: `+65 ${form.senderPhone}`,
        pickupAddress: `${form.pickupAddress}, ${pickupCityName} ${form.originPincode || form.pickupPostal}`,
        pickupCity: pickupCityName,
        receiverName: form.receiverName,
        receiverPhone: `+65 ${form.receiverPhone}`,
        deliveryAddress: `${form.deliveryAddress}, ${deliveryCityName} ${form.destinationPincode || form.deliveryPostal}`,
        deliveryCity: deliveryCityName,
        serviceLevel: `Domestic Road Freight (${selectedVehicle.label})`,
        cargoType: form.content || form.cargoType,
        packageType: form.packageType,
        weight: form.weight,
        pieces: form.pieces,
        declaredValue: form.declaredValue || '500',
        estimatedPrice: `S$ ${estimatedPrice}`,
        destinationCountryCode: 'SG',
        originPincode: form.originPincode || form.pickupPostal,
        destinationPincode: form.destinationPincode || form.deliveryPostal,
        vehicleId: selectedVehicle.id,
        vehicleName: selectedVehicle.label,
        paymentStatus: statusLabel,
        paymentMethod: methodLabel,
        transactionId: txnNumber
      });

      setConfirmedPaymentInfo({
        status: statusLabel,
        method: methodLabel,
        amount: `S$ ${estimatedPrice}`,
        txnId: txnNumber,
        date: new Date().toLocaleDateString('en-SG', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      });

      showToast(`Payment authorized via ${methodLabel}! Road shipment booked successfully.`, 'success');
      setConfirmedId(shipment.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  if (confirmedId) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-5 shadow-sm">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Road Shipment Booked Successfully</h1>

        {/* Payment Confirmation Badge */}
        {confirmedPaymentInfo && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-5 shadow-xs flex-wrap justify-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Payment: <strong className="text-emerald-950 uppercase">{confirmedPaymentInfo.status}</strong> via {confirmedPaymentInfo.method} ({confirmedPaymentInfo.amount}) · Ref: <strong>{confirmedPaymentInfo.txnId}</strong>
            </span>
          </div>
        )}

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6 text-left space-y-2 max-w-lg mx-auto shadow-xs">
          <div className="flex justify-between text-xs pb-2 border-b border-slate-200">
            <span className="text-slate-500 font-semibold">Route:</span>
            <span className="font-bold text-slate-900">{originCity || form.originPincode} ➔ {destinationCity || form.destinationPincode}</span>
          </div>
          <div className="flex justify-between text-xs pb-2 border-b border-slate-200">
            <span className="text-slate-500 font-semibold">Vehicle & Package:</span>
            <span className="font-bold text-slate-900">{selectedVehicle.label} · {form.packageType} ({form.weight} kg)</span>
          </div>
          <div className="flex justify-between text-xs pb-2 border-b border-slate-200">
            <span className="text-slate-500 font-semibold">Content:</span>
            <span className="font-bold text-slate-900">{form.content || 'General Cargo'}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 font-semibold">Total Paid / Due:</span>
            <span className="font-black text-orange-600">{confirmedPaymentInfo?.amount || `S$ ${estimatedPrice}`}</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-1">Lorry Receipt / Consignment No.</p>
        <p className="text-2xl sm:text-3xl font-black text-orange-600 mb-8 tracking-wider">{confirmedId}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setActiveTab && setActiveTab('track')}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl shadow-orange-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Track road shipment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => showToast('Tax invoice receipt generated for download', 'success')}
            className="px-5 py-3 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Download receipt</span>
          </button>
          <button
            onClick={() => setActiveTab && setActiveTab('customer-dashboard')}
            className="px-5 py-3 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Go to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-in pb-16">
      
      {/* Hero Header when not inside a parent wrapper */}
      {!hideHero && (
        <div className="w-full bg-[#10182D] border-b border-slate-800 relative overflow-hidden text-white shadow-md mb-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 relative z-10 text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 bg-[#FF6B00]/15 border border-[#FF6B00]/30 px-3.5 py-1.5 rounded-full mb-3">
              <Truck className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span className="text-xs font-bold text-[#FF6B00] uppercase tracking-wide">Roadways & City Logistics</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-2 text-center">Book Road Shipment</h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed text-center">
              Point-to-point road freight, express courier vans, and full truckload highway telematics dispatch.
            </p>
          </div>
        </div>
      )}

      {/* Main Content Area - Reduced width on both sides with max-w-5xl mx-auto */}
      <div className={hideHero ? "w-full" : "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"}>



      {/* ========================================================================= */}
      {/* STEP 1: SENDER & RECEIVER CONTACT AND ADDRESS DETAILS (FIRST PAGE)         */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
            
            {/* Complete Sender & Receiver Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Sender Details Card */}
              <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200/80">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Sender / Shipper Details</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Pickup contact, street address & pincode</p>
                  </div>
                </div>

                <Field label="Sender Full Name *" error={errors.senderName}>
                  <input
                    value={form.senderName}
                    onChange={handleNameChange('senderName')}
                    onKeyDown={handleNameKeyDown}
                    placeholder="e.g. John Tan"
                    className={inputClass(errors.senderName)}
                  />
                </Field>

                <Field label="Mobile Number (Singapore +65) *" error={errors.senderPhone}>
                  <div className={`relative flex items-center rounded-xl border bg-white transition-all overflow-hidden ${
                    errors.senderPhone ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20'
                  }`}>
                    {/* Fixed Singapore Country Code Prefix */}
                    <div className="flex items-center gap-1.5 px-3 py-3 border-r border-slate-200 bg-slate-50 text-xs font-black text-slate-700 select-none shrink-0">
                      <span className="text-sm leading-none">🇸🇬</span>
                      <span>+65</span>
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={8}
                      value={form.senderPhone}
                      onChange={handlePhoneChange('senderPhone')}
                      onKeyDown={handlePhoneKeyDown}
                      placeholder="e.g. 9123 4567"
                      className="w-full py-3 px-3 text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
                    />
                    <div className="pr-3 text-slate-400 shrink-0">
                      {form.senderPhone.length === 8 ? (
                        <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : (
                        <span className="text-[11px] font-bold text-slate-400">
                          {form.senderPhone.length}/8
                        </span>
                      )}
                    </div>
                  </div>
                </Field>

                <Field label="Complete Pickup Address *" error={errors.pickupAddress}>
                  <input
                    value={form.pickupAddress}
                    onChange={update('pickupAddress')}
                    placeholder="Door / Flat No, Street, Landmark, Area"
                    className={inputClass(errors.pickupAddress)}
                  />
                </Field>

                <Field label="Sender Pincode *" error={errors.originPincode}>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={form.originPincode || form.pickupPostal}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setForm((f) => ({ ...f, originPincode: val, pickupPostal: val }));
                        if (errors.originPincode) setErrors((prev) => ({ ...prev, originPincode: undefined }));
                      }}
                      placeholder="Enter 6-digit Pincode"
                      className={`${inputClass(errors.originPincode)} pl-10 pr-32 font-bold`}
                    />
                    {originCity && (
                      <div className="absolute right-3 flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-[11px] rounded-lg border border-emerald-200 uppercase pointer-events-none animate-fade-in">
                        <span>{originCity}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      </div>
                    )}
                  </div>
                </Field>
              </div>

              {/* Receiver Details Card */}
              <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200/80">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Receiver / Consignee Details</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Delivery recipient, address & pincode</p>
                  </div>
                </div>

                <Field label="Receiver Full Name *" error={errors.receiverName}>
                  <input
                    value={form.receiverName}
                    onChange={handleNameChange('receiverName')}
                    onKeyDown={handleNameKeyDown}
                    placeholder="e.g. Rachel Lim"
                    className={inputClass(errors.receiverName)}
                  />
                </Field>

                <Field label="Mobile Number (Singapore +65) *" error={errors.receiverPhone}>
                  <div className={`relative flex items-center rounded-xl border bg-white transition-all overflow-hidden ${
                    errors.receiverPhone ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20'
                  }`}>
                    {/* Fixed Singapore Country Code Prefix */}
                    <div className="flex items-center gap-1.5 px-3 py-3 border-r border-slate-200 bg-slate-50 text-xs font-black text-slate-700 select-none shrink-0">
                      <span className="text-sm leading-none">🇸🇬</span>
                      <span>+65</span>
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={8}
                      value={form.receiverPhone}
                      onChange={handlePhoneChange('receiverPhone')}
                      onKeyDown={handlePhoneKeyDown}
                      placeholder="e.g. 9123 4567"
                      className="w-full py-3 px-3 text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
                    />
                    <div className="pr-3 text-slate-400 shrink-0">
                      {form.receiverPhone.length === 8 ? (
                        <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : (
                        <span className="text-[11px] font-bold text-slate-400">
                          {form.receiverPhone.length}/8
                        </span>
                      )}
                    </div>
                  </div>
                </Field>

                <Field label="Complete Delivery Address *" error={errors.deliveryAddress}>
                  <input
                    value={form.deliveryAddress}
                    onChange={update('deliveryAddress')}
                    placeholder="Door / Flat No, Building, Street, Landmark"
                    className={inputClass(errors.deliveryAddress)}
                  />
                </Field>

                <Field label="Receiver Pincode *" error={errors.destinationPincode}>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={form.destinationPincode || form.deliveryPostal}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setForm((f) => ({ ...f, destinationPincode: val, deliveryPostal: val }));
                        if (errors.destinationPincode) setErrors((prev) => ({ ...prev, destinationPincode: undefined }));
                      }}
                      placeholder="Enter 6-digit Pincode"
                      className={`${inputClass(errors.destinationPincode)} pl-10 pr-32 font-bold`}
                    />
                    {destinationCity && (
                      <div className="absolute right-3 flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-[11px] rounded-lg border border-emerald-200 uppercase pointer-events-none animate-fade-in">
                        <span>{destinationCity}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      </div>
                    )}
                  </div>
                </Field>
              </div>
            </div>

            {/* Action Button: Ship Now */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleProceedToStep2}
                className="w-full py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-base transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer group hover:shadow-lg"
              >
                <span>Ship Now · Shipment Details</span>
                <ArrowRight className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: SHIPMENT DETAILS (EXACT MATCH TO USER SCREENSHOT 3)                */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="w-full max-w-5xl mx-auto py-4 animate-fade-in space-y-6">
          {/* Website Dark Navy Blue Header Bar */}
          <div className="bg-[#10182D] text-white px-5 sm:px-6 py-4 rounded-t-2xl sm:rounded-t-3xl flex items-center gap-3 shadow-sm border-b border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="p-1 -ml-1 text-white hover:text-[#FF6B00] rounded-lg transition-colors cursor-pointer flex items-center"
              title="Back to addresses"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
            <h1 className="text-base sm:text-lg font-bold tracking-wide">Shipment Details</h1>
          </div>

          {/* Form Card Body */}
          <div className="bg-white border border-slate-200 border-t-0 rounded-b-2xl sm:rounded-b-3xl p-6 sm:p-8 shadow-card space-y-5">
            {/* Field 1: Content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-900">Content</label>
                <button
                  type="button"
                  onClick={() => setActiveInfoModal('content')}
                  className="text-slate-900 hover:text-orange-500 transition-colors cursor-pointer p-0.5"
                  title="Content Info"
                >
                  <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-serif font-black italic">
                    i
                  </div>
                </button>
              </div>

              {/* Input trigger */}
              <button
                type="button"
                onClick={() => setIsContentOpen(!isContentOpen)}
                className={`w-full text-left rounded-xl border px-4 py-3.5 transition-all flex items-center justify-between cursor-pointer ${
                  errors.content
                    ? 'border-red-400 ring-2 ring-red-100 bg-red-50/20'
                    : form.content
                    ? 'border-[#FF6B00] bg-orange-50/30 text-slate-900 font-bold'
                    : 'border-slate-300 hover:border-[#FF6B00]/60 bg-white text-slate-500 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  {(() => {
                    const sel = contentCategories.find((c) => c.name === form.content);
                    if (sel) {
                      const SelIcon = sel.icon;
                      return (
                        <div className="w-7 h-7 rounded-lg bg-[#FF6B00]/15 text-[#FF6B00] flex items-center justify-center shrink-0">
                          <SelIcon className="w-4 h-4 stroke-[2.2]" />
                        </div>
                      );
                    }
                    return null;
                  })()}
                  <span className={`text-sm ${form.content ? 'font-bold text-slate-900' : 'font-medium text-slate-400'}`}>
                    {form.content || 'Select Content'}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isContentOpen ? 'rotate-180 text-[#FF6B00]' : ''}`} />
              </button>

              {errors.content && (
                <p className="text-xs font-bold text-red-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.content}</span>
                </p>
              )}

              {/* Dropdown for Content */}
              {isContentOpen && (
                <div className="mt-2 rounded-2xl border border-slate-200 shadow-xl overflow-hidden bg-white animate-fade-in z-20">
                  <div className="p-3 border-b border-slate-100 bg-slate-50/70">
                    <div className="relative flex items-center">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        value={contentSearch}
                        onChange={(e) => setContentSearch(e.target.value)}
                        placeholder="Search shipment contents..."
                        className="w-full pl-10 pr-4 py-2 text-sm font-medium rounded-xl border border-slate-300 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 outline-none placeholder:text-slate-400 bg-white"
                      />
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {contentCategories
                      .filter((c) => c.name.toLowerCase().includes(contentSearch.toLowerCase()))
                      .map((item) => {
                        const isSelected = form.content === item.name;
                        const CategoryIcon = item.icon;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setForm((f) => ({ ...f, content: item.name, cargoType: item.name }));
                              setIsContentOpen(false);
                              if (errors.content) setErrors((prev) => ({ ...prev, content: undefined }));
                            }}
                            className={`w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#FFF8F2] transition-colors cursor-pointer group ${
                              isSelected ? 'bg-[#FFF8F2]' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                isSelected
                                  ? 'bg-[#FF6B00] text-white shadow-xs'
                                  : 'bg-[#FFF8F2] text-[#FF6B00] border border-[#FF6B00]/20 group-hover:bg-[#FF6B00] group-hover:text-white'
                              }`}>
                                <CategoryIcon className="w-4 h-4 stroke-[2.2]" />
                              </div>
                              <span className={`text-sm font-bold tracking-wide uppercase transition-colors ${
                                isSelected ? 'text-[#FF6B00]' : 'text-slate-900 group-hover:text-[#FF6B00]'
                              }`}>
                                {item.name}
                              </span>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              isSelected ? 'border-[#FF6B00] bg-[#FF6B00]' : 'border-slate-300'
                            }`}>
                              {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            {/* Field 2: Weight */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-900">Weight</label>
                <button
                  type="button"
                  onClick={() => setActiveInfoModal('weight')}
                  className="text-slate-900 hover:text-orange-500 transition-colors cursor-pointer p-0.5"
                  title="Weight Info"
                >
                  <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-serif font-black italic">
                    i
                  </div>
                </button>
              </div>

              <div className={`flex items-center border rounded-xl overflow-hidden transition-colors ${
                errors.weight ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-300 focus-within:border-slate-900'
              }`}>
                <input
                  type="number"
                  placeholder="Weight"
                  min="0.1"
                  step="0.1"
                  value={form.weight}
                  onChange={update('weight')}
                  className="w-full px-4 py-3.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
                />
                <div className="flex items-center gap-1 px-4 py-3.5 bg-white border-l border-slate-200 text-sm font-bold text-slate-700 select-none">
                  <span>kg</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
              </div>
              {errors.weight && (
                <p className="text-xs font-bold text-red-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.weight}</span>
                </p>
              )}
            </div>

            {/* Field 3: Measurement (cm) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-900">Measurement (cm)</label>
                <button
                  type="button"
                  onClick={() => setActiveInfoModal('measurement')}
                  className="text-slate-900 hover:text-orange-500 transition-colors cursor-pointer p-0.5"
                  title="Measurement Info"
                >
                  <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-serif font-black italic">
                    i
                  </div>
                </button>
              </div>

              <div className="border border-slate-300 rounded-xl grid grid-cols-3 divide-x divide-slate-300 overflow-hidden focus-within:border-slate-900 transition-colors">
                <input
                  type="number"
                  placeholder="Length"
                  value={form.length}
                  onChange={update('length')}
                  className="w-full px-3 sm:px-4 py-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none text-center bg-transparent"
                />
                <input
                  type="number"
                  placeholder="Width"
                  value={form.width}
                  onChange={update('width')}
                  className="w-full px-3 sm:px-4 py-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none text-center bg-transparent"
                />
                <input
                  type="number"
                  placeholder="Height"
                  value={form.height}
                  onChange={update('height')}
                  className="w-full px-3 sm:px-4 py-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none text-center bg-transparent"
                />
              </div>
            </div>

            {/* Field 4: Shipment Value (SGD S$) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-900">Shipment Value (SGD S$)</label>
                <button
                  type="button"
                  onClick={() => setActiveInfoModal('value')}
                  className="text-slate-900 hover:text-[#FF6B00] transition-colors cursor-pointer p-0.5"
                  title="Shipment Value Info"
                >
                  <div className="w-5 h-5 rounded-full bg-[#10182D] text-white flex items-center justify-center text-xs font-serif font-black italic">
                    i
                  </div>
                </button>
              </div>

              <input
                type="number"
                placeholder="e.g. 150"
                value={form.declaredValue}
                onChange={update('declaredValue')}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition-all bg-transparent"
              />
            </div>

            {/* Footer Notice */}
            <p className="text-center text-[12px] sm:text-[13px] text-slate-700 font-medium leading-relaxed pt-2 px-2">
              For sending heavy cargo weighing over 100 kg or shipments valued above S$ 10,000, please contact our dispatch team at{' '}
              <a href="mailto:support@josanlogistics.com" className="text-[#FF6B00] font-bold hover:underline">
                support@josanlogistics.com
              </a>
            </p>

            {/* Action Button: Next */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleProceedToStep3}
                className="w-full py-4 rounded-full bg-[#FF6B00] hover:bg-[#e05e00] text-white font-black text-base shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Next</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: VEHICLE FLEET SELECTION & PARCEL SPECIFICATIONS                   */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div className="space-y-8 animate-fade-in">
          <form onSubmit={handleProceedToStep4} className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8">
          <div className="lg:col-span-8 xl:col-span-8 2xl:col-span-9 space-y-6">

            {/* Route & Address Summary Banner */}
            <div className="bg-orange-50/90 border border-orange-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-black text-slate-900 uppercase">
                      {originCity || form.originPincode} ({form.originPincode || form.pickupPostal})
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-xs sm:text-sm font-black text-slate-900 uppercase">
                      {destinationCity || form.destinationPincode} ({form.destinationPincode || form.deliveryPostal})
                    </span>
                    {form.content && (
                      <span className="px-2.5 py-0.5 rounded-md bg-orange-500 text-white font-black text-[11px] uppercase tracking-wide">
                        {form.content}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Shipper: <strong>{form.senderName}</strong> (+65 {form.senderPhone}) ➔ Consignee: <strong>{form.receiverName}</strong> (+65 {form.receiverPhone})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:border-orange-400 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-xs shrink-0 cursor-pointer flex items-center gap-1.5"
                >
                  <Package className="w-3.5 h-3.5 text-orange-500" />
                  <span>Change Content</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:border-orange-400 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-xs shrink-0 cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Edit Addresses</span>
                </button>
              </div>
            </div>

            {/* Select Vehicle Type */}
            <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-orange-500" />
                  <h2 className="text-base font-black text-slate-900">Vehicle Type</h2>
                </div>
                <span className="text-xs font-semibold text-slate-400">{vehicleOptions.length} Available Fleet Types</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                {vehicleOptions.map((v) => {
                  const isSelected = form.vehicle === v.id;
                  return (
                    <button
                      type="button"
                      key={v.id}
                      onClick={() => setForm((f) => ({ ...f, vehicle: v.id }))}
                      className={`text-left rounded-2xl border-2 transition-all cursor-pointer overflow-hidden flex flex-col justify-between group relative ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20 shadow-sm'
                          : 'border-slate-200 hover:border-orange-300 bg-white'
                      }`}
                    >
                      <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-slate-100">
                        <img
                          src={v.image}
                          alt={v.label}
                          onError={(e) => { e.target.src = '/assets/clean_domestic_truck.jpg'; }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div className="p-3">
                        <div className="flex items-baseline justify-between gap-1 mb-1">
                          <p className={`text-xs sm:text-sm font-black truncate ${isSelected ? 'text-orange-600' : 'text-slate-900'}`}>
                            {v.label}
                          </p>
                          <span className="text-xs sm:text-sm font-black text-slate-900 shrink-0">
                            S$ {v.rate}
                          </span>
                        </div>

                        <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold">
                          Max {v.maxWeight.toLocaleString()} kg
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Parcel Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <Field label="Package type">
                  <select
                    value={form.packageType}
                    onChange={update('packageType')}
                    className={`${inputClass()} bg-white cursor-pointer`}
                  >
                    {packageTypeOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Weight (kg)" error={errors.weight}>
                  <input
                    type="number"
                    min="0"
                    value={form.weight}
                    onChange={update('weight')}
                    placeholder="10"
                    className={inputClass(errors.weight)}
                  />
                </Field>

                <Field label="Pieces">
                  <input
                    type="number"
                    min="1"
                    value={form.pieces}
                    onChange={update('pieces')}
                    className={inputClass()}
                  />
                </Field>

                <Field label="Cargo type" error={errors.cargoType}>
                  <CargoTypeSelector
                    value={form.cargoType}
                    onChange={(val) => {
                      setForm((f) => ({ ...f, cargoType: val }));
                      if (errors.cargoType) setErrors((prev) => ({ ...prev, cargoType: undefined }));
                    }}
                    error={errors.cargoType}
                  />
                </Field>
              </div>

              <Field label="Preferred time slot">
                <select value={form.timeSlot} onChange={update('timeSlot')} className={`${inputClass()} bg-white cursor-pointer`}>
                  {timeSlots.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
            </section>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4 xl:col-span-4 2xl:col-span-3">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card sticky top-24 space-y-5">
              <div className="flex items-center gap-2 rounded-xl border border-dashed border-slate-200 p-3">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <p className="text-[11px] text-slate-500">Live GPS highway telematics & verified driver dispatch</p>
              </div>

              {/* Selected Vehicle Thumbnail */}
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-200 p-3">
                <img
                  src={selectedVehicle.image}
                  alt={selectedVehicle.label}
                  onError={(e) => { e.target.src = '/assets/clean_domestic_truck.jpg'; }}
                  className="w-14 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-900 truncate">{selectedVehicle.label}</p>
                  <p className="text-[11px] font-bold text-slate-500">Max {selectedVehicle.maxWeight} kg · Base S$ {selectedVehicle.rate}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 mb-1">Estimated road freight price</p>
                <p className="text-3xl font-black text-slate-900">S$ {estimatedPrice}</p>
                <p className="text-[11px] text-slate-400 mt-1">Based on {selectedVehicle.label.toLowerCase()} rate & load specs</p>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Navigation className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span className="truncate">Route: {originCity || form.originPincode || 'Origin'} ➔ {destinationCity || form.destinationPincode || 'Destination'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>{form.timeSlot}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>{selectedVehicle.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>{form.pieces} × {form.packageType} ({form.weight || '10'} kg)</span>
                </div>
                {form.content && (
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span>Content: <strong className="text-slate-800">{form.content}</strong></span>
                  </div>
                )}
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleProceedToStep4}
                  className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black text-sm py-3.5 rounded-xl shadow-orange-sm transition-colors cursor-pointer"
                >
                  <span>Proceed to Payment (S$ {estimatedPrice})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                  >
                    ← Edit Shipment Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
                  >
                    Edit Addresses →
                  </button>
                </div>
              </div>
            </div>
          </div>
          </form>

          {/* Road Fleet Vehicle Dimensions & Capacity Guide */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card flex flex-col justify-between space-y-6 pt-2">
            
            <div className="space-y-5">
              {/* Header & Badges */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[#FF6B00] font-bold uppercase text-[10px] tracking-widest bg-[#FFF8F2] px-2.5 py-0.5 rounded-full border border-[#FF6B00]/20">
                    Fleet Specifications
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">Vehicle Dimensions & Payload Guide</h3>
                </div>
                <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-bold text-slate-700">All Vehicles Road-Ready</span>
                </div>
              </div>

              {/* Vehicle Tab Switcher */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {vehicleFleetSpecs.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedGuideVehicleId(v.id)}
                    className={`py-2.5 px-4 rounded-xl text-center text-xs font-bold transition-all cursor-pointer border ${
                      selectedGuideVehicleId === v.id
                        ? 'bg-[#10182D] text-white border-[#10182D] shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-[#FFF8F2] hover:border-[#FF6B00]/30 hover:text-[#FF6B00]'
                    }`}
                  >
                    {v.name.split(' ')[0]} {v.name.split(' ')[1]}
                  </button>
                ))}
              </div>

              {/* Active Vehicle Detailed Display */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-lg font-extrabold text-slate-900">{activeFleetSpec.name}</h4>
                    <p className="text-xs font-semibold text-slate-500">{activeFleetSpec.category}</p>
                  </div>
                  <span className="text-xs font-bold text-orange-700 bg-orange-100 border border-orange-200 px-3 py-1 rounded-full">
                    {activeFleetSpec.badge}
                  </span>
                </div>

                {/* 4 Technical Metric Blocks */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Max Payload</span>
                    <span className="text-sm font-black text-slate-900 font-mono">{activeFleetSpec.payload}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Cargo Volume</span>
                    <span className="text-sm font-black text-slate-900 font-mono">{activeFleetSpec.volume}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Pallet Limit</span>
                    <span className="text-sm font-black text-slate-900 font-mono">{activeFleetSpec.pallets}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Cargo Dimensions</span>
                    <span className="text-[11px] font-bold text-slate-900 font-mono leading-tight">{activeFleetSpec.dimensions}</span>
                  </div>
                </div>

                {/* Access & Telematics Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-start space-x-2 text-slate-700">
                    <span className="font-bold text-slate-900 shrink-0">Loading Access:</span>
                    <span className="text-slate-600">{activeFleetSpec.access}</span>
                  </div>
                  <div className="flex items-start space-x-2 text-slate-700">
                    <span className="font-bold text-slate-900 shrink-0">Telematics & Safety:</span>
                    <span className="text-slate-600">{activeFleetSpec.telematics}</span>
                  </div>
                </div>

                {/* Ideal Cargo Tags */}
                <div className="pt-2 border-t border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">Recommended Cargo Types:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeFleetSpec.idealFor.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] font-medium bg-white text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-md"
                      >
                        ✓ {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action to Select Vehicle in Form */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-xs text-slate-600">
                <ShieldCheck className="w-4 h-4 text-[#FF6B00] shrink-0" />
                <span>All vehicles inspected daily with full transit cargo insurance coverage.</span>
              </div>
              <button
                type="button"
                onClick={() => handleApplyGuideVehicle(activeFleetSpec.vehicleOptionId, activeFleetSpec.name)}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#10182D] hover:bg-[#FF6B00] text-white font-bold text-xs rounded-xl shadow-sm transition-all duration-200 shrink-0 cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <span>Dispatch This Vehicle</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: PAYMENT OPTIONS & CHECKOUT                                        */}
      {/* ========================================================================= */}
      {currentStep === 4 && (
        <div className="animate-fade-in space-y-6">
          {/* Header Bar matching Book Road Shipment Bar */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white px-6 sm:px-8 py-5 sm:py-6 rounded-2xl sm:rounded-3xl flex items-center justify-between shadow-card relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="flex items-center gap-3 relative z-10">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="p-1.5 -ml-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white hover:text-orange-400 transition-colors cursor-pointer flex items-center"
                title="Back to fleet selection"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-black tracking-tight">Payment & Checkout</h1>
                <p className="text-xs text-slate-300 font-medium">Select a payment option to complete your road shipment booking</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-full relative z-10 shadow-xs">
              <Lock className="w-3.5 h-3.5" />
              <span className="font-bold">256-Bit SSL</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8">
            {/* Left: Payment Method Selection and Input Form */}
            <div className="lg:col-span-8 space-y-5">
              <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-1">Choose Payment Method</h2>
                  <p className="text-xs text-slate-500">All transactions are encrypted and secured in accordance with Singapore financial regulations.</p>
                </div>

                {/* 2 Selectable Payment Option Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, subtitle: 'Instant online payment via Visa, Master, AMEX' },
                    { id: 'corporate', label: 'Corporate Invoice', icon: FileText, subtitle: 'Consolidated Net-30 monthly invoicing for companies' }
                  ].map((m) => {
                    const isSelected = paymentMethod === m.id;
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between relative ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                          isSelected ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={`text-sm font-black leading-tight ${isSelected ? 'text-orange-600' : 'text-slate-900'}`}>
                            {m.label}
                          </p>
                          <p className="text-xs font-semibold text-slate-400 mt-1">{m.subtitle}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Form: Credit / Debit Card */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 pt-3 border-t border-slate-100 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Card Details</h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700 font-extrabold">VISA</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700 font-extrabold">MC</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700 font-extrabold">AMEX</span>
                      </div>
                    </div>

                    <Field label="Cardholder Name *" error={errors.cardName}>
                      <input
                        type="text"
                        value={cardData.name}
                        onChange={(e) => setCardData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Name as printed on card"
                        className={inputClass(errors.cardName)}
                      />
                    </Field>

                    <Field label="Card Number *" error={errors.cardNumber}>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          maxLength={19}
                          value={cardData.number}
                          onChange={handleCardNumberChange}
                          placeholder="4532 •••• •••• ••••"
                          className={`${inputClass(errors.cardNumber)} font-mono tracking-widest pl-11`}
                        />
                        <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      </div>
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Expiration Date *" error={errors.cardExpiry}>
                        <input
                          type="text"
                          maxLength={5}
                          value={cardData.expiry}
                          onChange={handleCardExpiryChange}
                          placeholder="MM/YY (e.g. 12/28)"
                          className={`${inputClass(errors.cardExpiry)} font-mono`}
                        />
                      </Field>

                      <Field label="CVV / CVC *" error={errors.cardCvv}>
                        <div className="relative flex items-center">
                          <input
                            type="password"
                            maxLength={4}
                            value={cardData.cvv}
                            onChange={handleCardCvvChange}
                            placeholder="•••"
                            className={`${inputClass(errors.cardCvv)} font-mono tracking-widest pl-9`}
                          />
                          <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                        </div>
                      </Field>
                    </div>

                    <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={cardData.saveCard}
                        onChange={(e) => setCardData((prev) => ({ ...prev, saveCard: e.target.checked }))}
                        className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-xs font-semibold text-slate-600">Save card securely for 1-click highway telematics billing</span>
                    </label>
                  </div>
                )}

                {/* Form: Corporate Invoice Net-30 */}
                {paymentMethod === 'corporate' && (
                  <div className="space-y-4 pt-3 border-t border-slate-100 animate-fade-in">
                    <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 flex items-start gap-3">
                      <Building className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div className="text-xs leading-relaxed text-blue-900">
                        <p className="font-extrabold">Active Corporate Facility: CORP-JOSAN-8892</p>
                        <p className="text-blue-700 mt-0.5">Approved Credit Line: <strong>S$ 25,000.00</strong> · Payment terms: <strong>Net 30 Days</strong> from tax invoice date.</p>
                      </div>
                    </div>

                    <Field label="Purchase Order (PO) / Internal Cost Center Reference *" error={errors.poNumber}>
                      <input
                        type="text"
                        value={corporateData.poNumber}
                        onChange={(e) => {
                          setCorporateData((prev) => ({ ...prev, poNumber: e.target.value }));
                          if (errors.poNumber) setErrors((prev) => ({ ...prev, poNumber: undefined }));
                        }}
                        placeholder="e.g. PO-2026-LOG-891"
                        className={inputClass(errors.poNumber)}
                      />
                    </Field>

                    <Field label="Department / Cost Unit">
                      <input
                        type="text"
                        value={corporateData.department}
                        onChange={(e) => setCorporateData((prev) => ({ ...prev, department: e.target.value }))}
                        placeholder="Logistics Operations / Procurement"
                        className={inputClass()}
                      />
                    </Field>

                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
                      <p className="font-bold text-slate-800">💡 How Corporate Invoicing Works:</p>
                      <p className="text-[11px] leading-relaxed text-slate-500">
                        Corporate customers do not need to pay per shipment with individual credit cards. Charges will be billed to your corporate credit account and itemized on your monthly IRAS-compliant GST tax statement with 30-day payment credit.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Order Fare Breakdown & Submit */}
            <div className="lg:col-span-4">
              <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-6 shadow-card sticky top-24 space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Receipt className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-black text-slate-900">Fare Breakdown</h3>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Base Vehicle ({selectedVehicle.label}):</span>
                    <span className="font-bold text-slate-900">S$ {selectedVehicle.rate}.00</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Cargo Weight ({form.weight} kg):</span>
                    <span className="font-bold text-slate-900">
                      S$ {(parseFloat(estimatedPrice) - selectedVehicle.rate).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Highway Toll & Telematics:</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>GST (9% included):</span>
                    <span className="font-bold text-slate-900">
                      S$ {(parseFloat(estimatedPrice) * 0.09).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-200 pt-3 flex items-baseline justify-between">
                  <span className="text-sm font-black text-slate-900">Total Payable:</span>
                  <span className="text-2xl font-black text-orange-600">S$ {estimatedPrice}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 space-y-1 border border-slate-200">
                  <p><strong>Route:</strong> {originCity || form.originPincode} ➔ {destinationCity || form.destinationPincode}</p>
                  <p><strong>Content:</strong> {form.content || 'General Cargo'} · {form.pieces} pcs</p>
                  <p><strong>Vehicle:</strong> {selectedVehicle.label}</p>
                </div>

                <button
                  type="button"
                  onClick={handleProcessPayment}
                  disabled={isProcessingPayment}
                  className={`w-full py-4 rounded-xl text-white font-black text-sm shadow-orange-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isProcessingPayment ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
                  }`}
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authorizing Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        {paymentMethod === 'corporate'
                          ? 'Confirm & Generate Corporate Invoice'
                          : `Pay S$ ${estimatedPrice} & Confirm Booking`}
                      </span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="text-slate-500 hover:text-slate-900 font-bold cursor-pointer"
                  >
                    ← Edit Fleet & Cargo
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-slate-400 hover:text-slate-700 font-medium cursor-pointer"
                  >
                    Addresses
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      </div>

      {/* Dynamic Field Info Modal */}
      {activeInfoModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-black text-base">
                <Info className="w-5 h-5 text-orange-500" />
                <span>
                  {activeInfoModal === 'content' && 'Content Guidelines'}
                  {activeInfoModal === 'weight' && 'Weight Guidelines'}
                  {activeInfoModal === 'measurement' && 'Dimensions & Volumetric Info'}
                  {activeInfoModal === 'value' && 'Declared Shipment Value'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveInfoModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              {activeInfoModal === 'content' && (
                <>
                  <p><strong>Permitted Goods:</strong> Non-hazardous parcels, business documents, apparel, artificial jewellery, books, consumer electronics, auto spare parts, and packaged dry items.</p>
                  <p><strong>Prohibited Items:</strong> Flammables, explosives, toxic chemicals, liquid contraband, currency, bullion, live organisms, and dangerous weapons.</p>
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-orange-900 text-[11px] leading-relaxed">
                    <strong>Heavy or High-Value Freight:</strong> Shipments above <strong>100 kg</strong> or valuation over <strong>S$ 10,000</strong> require advance freight declaration. Email us at <a href="mailto:support@josanlogistics.com" className="font-bold underline text-[#FF6B00]">support@josanlogistics.com</a>.
                  </div>
                </>
              )}

              {activeInfoModal === 'weight' && (
                <>
                  <p>Enter the actual dead weight of the cargo in <strong>kilograms (kg)</strong>.</p>
                  <p>Chargeable weight is taken as the greater of actual physical weight or volumetric weight based on standard highway carrier tariffs.</p>
                </>
              )}

              {activeInfoModal === 'measurement' && (
                <>
                  <p>Specify the parcel outer dimensions: <strong>Length</strong>, <strong>Width</strong>, and <strong>Height</strong> in centimeters (cm).</p>
                  <p>Volumetric weight formula: <code>(L × W × H in cm) / 5000</code>.</p>
                </>
              )}

              {activeInfoModal === 'value' && (
                <>
                  <p>Declare the invoice replacement value of the contents in Singapore Dollars (SGD) for road transit compliance and insurance risk coverage.</p>
                  <p>For high-value cargo exceeding <strong>S$ 10,000</strong>, supporting tax invoice documentation may be required.</p>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setActiveInfoModal(null)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, error, full, children }) => (
  <div className={full ? 'sm:col-span-2' : ''}>
    <label className="block text-xs font-extrabold text-slate-600 mb-1.5">{label}</label>
    {children}
    {error && <p className="text-[11px] text-red-500 mt-1 font-semibold">{error}</p>}
  </div>
);

const inputClass = (error) =>
  `w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 outline-none transition-colors focus:ring-2 focus:ring-orange-500/20 ${
    error ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200 focus:border-orange-400'
  }`;
