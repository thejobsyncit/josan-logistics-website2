import React, { useState, useEffect } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { countryCodesList, getPhoneLength } from '../data/countryCodes';
import { 
  Plane, 
  FileText, 
  CreditCard, 
  FileCheck, 
  Truck, 
  Upload, 
  CheckCircle2, 
  Check, 
  AlertCircle, 
  ArrowLeft, 
  Info, 
  ShieldCheck, 
  Building2, 
  User, 
  UserCheck,
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  DollarSign, 
  FileUp, 
  X, 
  Copy, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';

// Preset Destination Airports by Global Region
const DESTINATION_OPTIONS = [
  {
    group: 'Southeast Asia (Regional Air Cargo Hubs)',
    options: [
      'BKK - Bangkok Suvarnabhumi Airport, Thailand',
      'DMK - Don Mueang International Airport, Thailand',
      'KUL - Kuala Lumpur International Airport, Malaysia',
      'PEN - Penang International Airport, Malaysia',
      'CGK - Jakarta Soekarno-Hatta Airport, Indonesia',
      'DPS - Ngurah Rai (Bali) International Airport, Indonesia',
      'MNL - Manila Ninoy Aquino International Airport, Philippines',
      'SGN - Ho Chi Minh City Tan Son Nhat Airport, Vietnam',
      'HAN - Hanoi Noi Bai International Airport, Vietnam',
      'PNH - Phnom Penh International Airport, Cambodia',
      'RGN - Yangon International Airport, Myanmar'
    ]
  },
  {
    group: 'East Asia (Key Trade Partners)',
    options: [
      'HKG - Hong Kong International Airport',
      'TPE - Taipei Taoyuan International Airport, Taiwan',
      'PVG - Shanghai Pudong International Airport, China',
      'CAN - Guangzhou Baiyun International Airport, China',
      'PEK - Beijing Capital International Airport, China',
      'SZX - Shenzhen Bao\'an International Airport, China',
      'ICN - Seoul Incheon International Airport, South Korea',
      'NRT - Tokyo Narita International Airport, Japan',
      'HND - Tokyo Haneda International Airport, Japan',
      'KIX - Osaka Kansai International Airport, Japan'
    ]
  },
  {
    group: 'South Asia & Middle East',
    options: [
      'DEL - Indira Gandhi International Airport (Delhi), India',
      'BOM - Chhatrapati Shivaji Maharaj Airport (Mumbai), India',
      'BLR - Kempegowda International Airport (Bengaluru), India',
      'MAA - Chennai International Airport, India',
      'DXB - Dubai International Airport, UAE',
      'DOH - Doha Hamad International Airport, Qatar',
      'AUH - Abu Dhabi Zayed International Airport, UAE',
      'RUH - King Khalid International Airport (Riyadh), Saudi Arabia'
    ]
  },
  {
    group: 'Australia & Oceania',
    options: [
      'SYD - Sydney Kingsford Smith Airport, Australia',
      'MEL - Melbourne Tullamarine Airport, Australia',
      'BNE - Brisbane Airport, Australia',
      'PER - Perth Airport, Australia',
      'AKL - Auckland Airport, New Zealand'
    ]
  },
  {
    group: 'Europe & Americas',
    options: [
      'FRA - Frankfurt Airport, Germany',
      'LHR - London Heathrow Airport, United Kingdom',
      'AMS - Amsterdam Schiphol Airport, Netherlands',
      'CDG - Paris Charles de Gaulle Airport, France',
      'ZRH - Zurich Airport, Switzerland',
      'JFK - New York John F. Kennedy Airport, USA',
      'LAX - Los Angeles International Airport, USA',
      'ORD - Chicago O\'Hare International Airport, USA',
      'SFO - San Francisco International Airport, USA'
    ]
  }
];

// Preset Cargo & Product Categories
const CARGO_OPTIONS = [
  {
    group: 'Aerospace & High-Tech Components',
    options: [
      'Precision aircraft replacement components & avionics',
      'Semiconductors & integrated circuit wafers',
      'High-tech electronic testing & calibration equipment',
      'Optics, lasers & precision sensory instruments'
    ]
  },
  {
    group: 'Biomedical & Pharmaceutical Supplies',
    options: [
      'Biomedical reagents & temperature-controlled test kits',
      'Pharmaceutical formulations & clinical trial consignments',
      'Medical diagnostic devices & hospital surgical equipment',
      'Life sciences laboratory consumables'
    ]
  },
  {
    group: 'Consumer Electronics & Hardware',
    options: [
      'High-value consumer electronics & mobile devices',
      'Computer enterprise servers, storage arrays & networking modules',
      'Audio-visual systems & high-resolution display hardware'
    ]
  },
  {
    group: 'Industrial & Automotive Spares',
    options: [
      'Precision CNC machine replacement parts & tooling',
      'Automotive components, sensors & assembly units',
      'Robotics automation modules & industrial controllers'
    ]
  },
  {
    group: 'General Commercial Cargo & Textiles',
    options: [
      'Textiles, apparel & luxury designer fashion samples',
      'Commercial exhibition, trade show displays & demo units',
      'Perishable high-grade foodstuffs & temperature-controlled cargo',
      'General commercial dry cargo (non-hazardous)'
    ]
  }
];

export const AirwayRequestPage = ({ setActiveTab }) => {
  const { currentUser, addAirwayRequest, showToast } = useLogistics();

  const parseInitialPhone = (rawPhone) => {
    if (!rawPhone) return { code: '+65', digits: '' };
    const matched = countryCodesList.find(c => rawPhone.startsWith(c.code));
    if (matched) {
      return {
        code: matched.code,
        digits: rawPhone.slice(matched.code.length).replace(/[^0-9]/g, '').slice(0, matched.digits)
      };
    }
    return { code: '+65', digits: rawPhone.replace(/[^0-9]/g, '').slice(0, 8) };
  };

  const initialShipperPhone = parseInitialPhone(currentUser?.phone);
  const [shipperCountryCode, setShipperCountryCode] = useState(initialShipperPhone.code);
  const [shipperPhoneDigits, setShipperPhoneDigits] = useState(initialShipperPhone.digits);

  const [receiverCountryCode, setReceiverCountryCode] = useState('+65');
  const [receiverPhoneDigits, setReceiverPhoneDigits] = useState('');

  // Pre-fill if user logged in with field sanitization
  const [formData, setFormData] = useState({
    fullName: (currentUser?.name || '').replace(/[^a-zA-Z\s]/g, '').slice(0, 50),
    companyName: (currentUser?.company || '').slice(0, 80),
    email: currentUser?.email || '',
    phone: initialShipperPhone.digits ? `${initialShipperPhone.code} ${initialShipperPhone.digits}` : '',
    receiverName: '',
    receiverCompany: '',
    receiverEmail: '',
    receiverPhone: '',
    incoterm: 'FOB',
    origin: 'SIN - Singapore Changi Airport (Air Cargo Complex)',
    destination: '',
    cargoDescription: '',
    packagesCount: '',
    totalWeight: '',
    dimensions: '',
    approximateValue: 'SGD '
  });

  useEffect(() => {
    if (currentUser?.phone) {
      const parsed = parseInitialPhone(currentUser.phone);
      setShipperCountryCode(parsed.code);
      setShipperPhoneDigits(parsed.digits);
      setFormData(prev => ({
        ...prev,
        phone: parsed.digits ? `${parsed.code} ${parsed.digits}` : prev.phone
      }));
    }
  }, [currentUser]);

  // Services multi-selection state
  const availableServices = [
    {
      id: 'AWB Preparation',
      title: 'AWB Preparation',
      desc: 'Preparation of Air Waybill details based on shipment info & consignee verification.',
      icon: FileText
    },
    {
      id: 'AWB Billing',
      title: 'AWB Billing',
      desc: 'Consolidated airline freight rate calculations, terminal disbursements & handling charges.',
      icon: CreditCard
    },
    {
      id: 'Shipment Documentation',
      title: 'Shipment Documentation',
      desc: 'Commercial invoice, packing list, certificate of origin & Singapore customs permit coordination.',
      icon: FileCheck
    },
    {
      id: 'Transportation Support',
      title: 'Transportation Support',
      desc: 'Commercial first-mile feeder transport between your facility & Changi Airport cargo terminal.',
      icon: Truck
    }
  ];

  const [selectedServices, setSelectedServices] = useState([
    'AWB Preparation',
    'Shipment Documentation'
  ]);

  // Uploaded Documents state
  const [uploadedFiles, setUploadedFiles] = useState({
    commercialInvoice: null,
    packingList: null,
    certificateOfOrigin: null,
    otherDocuments: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  // Dropdown states for Destination and Cargo Description
  const [destinationOption, setDestinationOption] = useState('');
  const [customDestination, setCustomDestination] = useState('');
  const [cargoOption, setCargoOption] = useState('');
  const [customCargo, setCustomCargo] = useState('');

  const handleDestinationChange = (e) => {
    const val = e.target.value;
    setDestinationOption(val);
    if (val === 'OTHER') {
      setFormData(prev => ({ ...prev, destination: customDestination }));
    } else {
      setFormData(prev => ({ ...prev, destination: val }));
      setCustomDestination('');
    }
    if (errors.destination) {
      setErrors(prev => ({ ...prev, destination: null }));
    }
  };

  const handleCustomDestinationChange = (e) => {
    const val = e.target.value;
    setCustomDestination(val);
    setFormData(prev => ({ ...prev, destination: val }));
    if (errors.destination) {
      setErrors(prev => ({ ...prev, destination: null }));
    }
  };

  const handleCargoChange = (e) => {
    const val = e.target.value;
    setCargoOption(val);
    if (val === 'OTHER') {
      setFormData(prev => ({ ...prev, cargoDescription: customCargo }));
    } else {
      setFormData(prev => ({ ...prev, cargoDescription: val }));
      setCustomCargo('');
    }
    if (errors.cargoDescription) {
      setErrors(prev => ({ ...prev, cargoDescription: null }));
    }
  };

  const handleCustomCargoChange = (e) => {
    const val = e.target.value;
    setCustomCargo(val);
    setFormData(prev => ({ ...prev, cargoDescription: val }));
    if (errors.cargoDescription) {
      setErrors(prev => ({ ...prev, cargoDescription: null }));
    }
  };

  const toggleService = (serviceId) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        if (prev.length === 1) {
          if (showToast) showToast('At least one air freight service must be selected.', 'warning');
          return prev;
        }
        return prev.filter(s => s !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleFileUpload = (docKey, e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const fileSizeKb = Math.round(file.size / 1024);
      setUploadedFiles(prev => ({
        ...prev,
        [docKey]: {
          name: file.name,
          size: `${fileSizeKb} KB`,
          type: docKey === 'commercialInvoice' ? 'Commercial Invoice'
            : docKey === 'packingList' ? 'Packing List'
            : docKey === 'certificateOfOrigin' ? 'Certificate of Origin'
            : 'Other Shipment Documents'
        }
      }));
      if (showToast) showToast(`Uploaded "${file.name}"`, 'success');
    }
  };

  const removeFile = (docKey) => {
    setUploadedFiles(prev => ({ ...prev, [docKey]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName.trim())) {
      newErrors.fullName = 'Full Name must contain only alphabetic characters.';
    }

    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Valid Email is required.';

    const maxShipperDigits = getPhoneLength(shipperCountryCode);
    const minShipperDigits = Math.max(6, maxShipperDigits - 1);
    if (!shipperPhoneDigits || shipperPhoneDigits.length < minShipperDigits) {
      newErrors.phone = `Valid ${maxShipperDigits}-digit phone number is required for ${shipperCountryCode}.`;
    }

    // Receiver Details Validation
    if (!formData.receiverName.trim()) {
      newErrors.receiverName = 'Receiver name is required.';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.receiverName.trim())) {
      newErrors.receiverName = 'Receiver name must contain only alphabetic characters.';
    }

    if (!formData.receiverEmail.trim() || !formData.receiverEmail.includes('@')) newErrors.receiverEmail = 'Valid Receiver Email is required.';

    const maxReceiverDigits = getPhoneLength(receiverCountryCode);
    const minReceiverDigits = Math.max(6, maxReceiverDigits - 1);
    if (!receiverPhoneDigits || receiverPhoneDigits.length < minReceiverDigits) {
      newErrors.receiverPhone = `Valid ${maxReceiverDigits}-digit mobile number is required for ${receiverCountryCode}.`;
    }

    if (!formData.origin.trim()) newErrors.origin = 'Shipment origin is required.';
    if (!destinationOption) {
      newErrors.destination = 'Please select a destination airport / country.';
    } else if (destinationOption === 'OTHER' && !customDestination.trim()) {
      newErrors.destination = 'Please enter your custom destination airport or country.';
    } else if (!formData.destination.trim()) {
      newErrors.destination = 'Shipment destination is required.';
    }

    if (!cargoOption) {
      newErrors.cargoDescription = 'Please select a cargo / product description.';
    } else if (cargoOption === 'OTHER' && !customCargo.trim()) {
      newErrors.cargoDescription = 'Please specify your custom cargo description.';
    } else if (!formData.cargoDescription.trim()) {
      newErrors.cargoDescription = 'Cargo/Product description is required.';
    }

    if (!formData.packagesCount.trim()) {
      newErrors.packagesCount = 'Number of packages is required.';
    } else if (!/^[0-9]+$/.test(formData.packagesCount.trim())) {
      newErrors.packagesCount = 'Number of packages must be a numerical value.';
    }

    if (!formData.totalWeight.trim()) {
      newErrors.totalWeight = 'Total weight is required.';
    } else if (!/^[0-9]+(\.[0-9]+)?$/.test(formData.totalWeight.trim())) {
      newErrors.totalWeight = 'Total weight must be a numerical value.';
    }

    if (formData.dimensions.trim() && !/^[0-9xX\s*.-]+$/.test(formData.dimensions.trim())) {
      newErrors.dimensions = 'Dimensions must contain only numerical values.';
    }

    if (selectedServices.length === 0) newErrors.services = 'Select at least one required service.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      if (showToast) showToast('Please fill in all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);

    const docList = Object.values(uploadedFiles).filter(Boolean);
    const fullShipperPhone = `${shipperCountryCode} ${shipperPhoneDigits}`.trim();
    const fullReceiverPhone = `${receiverCountryCode} ${receiverPhoneDigits}`.trim();

    const payload = {
      customerName: formData.fullName.trim(),
      companyName: formData.companyName.trim() || 'Commercial Consignor',
      email: formData.email.trim().toLowerCase(),
      phone: fullShipperPhone,
      receiverName: formData.receiverName.trim(),
      receiverCompany: formData.receiverCompany.trim() || 'Consignee Recipient',
      receiverEmail: formData.receiverEmail.trim().toLowerCase(),
      receiverPhone: fullReceiverPhone,
      incoterm: formData.incoterm || 'FOB',
      origin: formData.origin.trim(),
      destination: formData.destination.trim(),
      cargoDescription: formData.cargoDescription.trim(),
      packagesCount: formData.packagesCount.trim(),
      totalWeight: formData.totalWeight.trim(),
      dimensions: formData.dimensions.trim() || 'Standard Commercial Dimensions',
      approximateValue: formData.approximateValue.trim() || 'SGD 10,000',
      services: selectedServices,
      documents: docList
    };

    setTimeout(() => {
      let created = null;
      if (addAirwayRequest) {
        created = addAirwayRequest(payload);
      } else {
        created = {
          id: `AIR-${Math.floor(1000 + Math.random() * 9000)}`,
          ...payload,
          date: new Date().toISOString().split('T')[0],
          status: 'New'
        };
      }
      setIsSubmitting(false);
      setSubmittedRequest(created);
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, 400);
  };

  const copyRequestId = () => {
    if (submittedRequest?.id) {
      navigator.clipboard.writeText(submittedRequest.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Back Link */}
        <div>
          <button
            onClick={() => setActiveTab ? setActiveTab('air-freight') : (window.location.hash = '#air-freight')}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-[#2463EB] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Air Freight Services Overview</span>
          </button>
        </div>

        {/* SUBMISSION SUCCESS CONFIRMATION VIEW */}
        {submittedRequest ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8 animate-fade-in">
            {/* Header */}
            <div className="text-center space-y-3 border-b border-slate-100 pb-8">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25">
                <Check className="w-9 h-9 stroke-[3]" />
              </div>
              <span className="text-xs font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                Submission Confirmed
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Air Freight Service Request Submitted
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
                Your air freight coordination request has been registered in the Josan Operations Desk at Changi Air Cargo Complex.
              </p>

              {/* Request ID Badge */}
              <div className="pt-2">
                <div className="inline-flex items-center space-x-3 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-md border border-slate-800">
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">
                      Airway Request ID
                    </span>
                    <span className="text-lg sm:text-xl font-mono font-black text-[#2463EB]">
                      {submittedRequest.id}
                    </span>
                  </div>
                  <button
                    onClick={copyRequestId}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Copy Request ID"
                  >
                    {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Request Summary Card */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-5 text-xs">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2 border-b border-slate-200 pb-3">
                <Plane className="w-4 h-4 text-blue-600" />
                <span>Request & Consignment Overview</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Customer / Shipper (Consignor)</span>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">{submittedRequest.customerName}</p>
                  <p className="text-slate-500">{submittedRequest.company || submittedRequest.companyName}</p>
                  <p className="text-slate-400 font-mono mt-0.5">{submittedRequest.email} • {submittedRequest.phone}</p>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Receiver / Consignee</span>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">{submittedRequest.receiverName || 'Consignee Recipient'}</p>
                  <p className="text-slate-500">{submittedRequest.receiverCompany || 'Designated Company'}</p>
                  <p className="text-slate-400 font-mono mt-0.5">{submittedRequest.receiverEmail} • {submittedRequest.receiverPhone}</p>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Airway Route & Trade Terms</span>
                  <p className="font-bold text-slate-800 mt-0.5">{submittedRequest.origin}</p>
                  <p className="font-bold text-[#2463EB]">↳ {submittedRequest.destination}</p>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Incoterm: {submittedRequest.incoterm || 'FOB'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Cargo Specifications & Value</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{submittedRequest.cargoDescription}</p>
                  <p className="text-slate-500 font-mono">
                    {submittedRequest.packagesCount} • {submittedRequest.totalWeight} • {submittedRequest.dimensions}
                  </p>
                  <p className="font-mono font-bold text-slate-900 text-xs mt-1">Est. Value: {submittedRequest.approximateValue}</p>
                </div>
              </div>

              {/* Selected Services */}
              <div className="pt-3 border-t border-slate-200">
                <span className="text-slate-400 text-[10px] font-bold uppercase block mb-2">Requested Air Freight Services</span>
                <div className="flex flex-wrap gap-2">
                  {submittedRequest.services?.map((svc) => (
                    <span
                      key={svc}
                      className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-blue-600" />
                      <span>{svc}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Uploaded Documents */}
              {submittedRequest.documents?.length > 0 && (
                <div className="pt-3 border-t border-slate-200">
                  <span className="text-slate-400 text-[10px] font-bold uppercase block mb-2">Submitted Shipment Documents</span>
                  <div className="space-y-1.5">
                    {submittedRequest.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-slate-700 font-medium">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono font-bold text-slate-900">{doc.name}</span>
                        <span className="text-slate-400 text-[11px]">({doc.type} - {doc.size})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Next Steps Notification */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start space-x-3 text-xs">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-slate-700">
                <p className="font-bold text-slate-900">What happens next?</p>
                <p className="leading-relaxed">
                  Our airway operations team will review your cargo manifest, verify shipper/consignee data, and coordinate with international airline carriers for AWB issuance and local terminal transfer. You will receive an official update via email within 2 business hours.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  setSubmittedRequest(null);
                  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Submit Another Request
              </button>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab ? setActiveTab('air-freight') : (window.location.hash = '#air-freight')}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-[#2463EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer"
                >
                  Return to Air Freight Services
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* AIRWAY SERVICE REQUEST FORM */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8">
            
            {/* Header Section */}
            <div className="border-b border-slate-100 pb-6 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Air Freight Services &amp; AWB Coordination
                </span>
                <span className="text-xs font-semibold text-slate-400">Singapore Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Request Air Freight Service
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl">
                Submit your shipment details and documentation requirements. Our team will review your request and coordinate the required air freight services.
              </p>
            </div>

            {/* Scope / Business Notice Banner */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-start space-x-3 text-xs">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-slate-700">
                <p className="font-bold text-slate-900">Commercial Airway Logistics Support</p>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  Josan Logistics provides Air Waybill preparation, billing, export documentation, and airport transportation coordination for commercial air cargo. Josan partners with scheduled commercial air carriers at Changi Cargo Complex and does not operate aircraft.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 text-xs font-medium">

              {/* 1. CUSTOMER DETAILS */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                  <User className="w-4 h-4 text-[#2463EB]" />
                  <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                    1. Customer Details (Shipper / Consignor)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 flex items-center space-x-1">
                      <span>Full Name</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={50}
                      placeholder="e.g. Marcus Lim"
                      value={formData.fullName}
                      onChange={(e) => {
                        const clean = e.target.value.replace(/[^a-zA-Z\s]/g, '').slice(0, 50);
                        setFormData({ ...formData, fullName: clean });
                        if (errors.fullName) setErrors({ ...errors, fullName: null });
                      }}
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl font-bold text-slate-900 focus-blue shadow-2xs ${
                        errors.fullName ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                      }`}
                    />
                    {errors.fullName && <p className="text-[10px] text-red-500 font-bold">{errors.fullName}</p>}
                  </div>

                  {/* Company Name */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Company Name</label>
                    <input
                      type="text"
                      maxLength={80}
                      placeholder="e.g. Changi Aviation Logistics Pte Ltd"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value.slice(0, 80) })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus-blue shadow-2xs"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 flex items-center space-x-1">
                      <span>Email Address</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      maxLength={60}
                      placeholder="e.g. ops@changiaviation.sg"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value.slice(0, 60) });
                        if (errors.email) setErrors({ ...errors, email: null });
                      }}
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl font-medium text-slate-900 focus-blue shadow-2xs ${
                        errors.email ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                      }`}
                    />
                    {errors.email && <p className="text-[10px] text-red-500 font-bold">{errors.email}</p>}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center space-x-1">
                        <span>Phone Number</span>
                        <span className="text-red-500">*</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {getPhoneLength(shipperCountryCode)} digits max
                      </span>
                    </label>
                    <div className="flex items-center">
                      <select
                        value={shipperCountryCode}
                        onChange={(e) => {
                          const newCode = e.target.value;
                          setShipperCountryCode(newCode);
                          const maxLen = getPhoneLength(newCode);
                          const trimmed = shipperPhoneDigits.slice(0, maxLen);
                          setShipperPhoneDigits(trimmed);
                          setFormData(prev => ({
                            ...prev,
                            phone: trimmed ? `${newCode} ${trimmed}` : ''
                          }));
                          if (errors.phone) setErrors(prev => ({ ...prev, phone: null }));
                        }}
                        className="h-[42px] px-2.5 bg-slate-100 border border-slate-200 rounded-l-xl text-slate-800 font-bold text-xs shrink-0 cursor-pointer border-r-0 focus:outline-none focus:ring-1 focus:ring-[#2463EB]"
                      >
                        {countryCodesList.map((item) => (
                          <option key={item.code} value={item.code}>
                            {item.flag} {item.code} ({item.country})
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        required
                        maxLength={getPhoneLength(shipperCountryCode)}
                        placeholder={`e.g. ${'9'.repeat(getPhoneLength(shipperCountryCode))}`}
                        value={shipperPhoneDigits}
                        onChange={(e) => {
                          const clean = e.target.value.replace(/[^0-9]/g, '').slice(0, getPhoneLength(shipperCountryCode));
                          setShipperPhoneDigits(clean);
                          setFormData(prev => ({
                            ...prev,
                            phone: clean ? `${shipperCountryCode} ${clean}` : ''
                          }));
                          if (errors.phone) setErrors(prev => ({ ...prev, phone: null }));
                        }}
                        onKeyDown={(e) => {
                          const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'];
                          if (!allowed.includes(e.key) && !/^[0-9]$/.test(e.key) && !e.ctrlKey && !e.metaKey) {
                            e.preventDefault();
                          }
                        }}
                        className={`w-full h-[42px] px-3.5 bg-slate-50 border rounded-r-xl font-mono font-medium text-slate-900 focus-blue shadow-2xs ${
                          errors.phone ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {errors.phone && <p className="text-[10px] text-red-500 font-bold">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* 2. RECEIVER DETAILS */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                  <UserCheck className="w-4 h-4 text-[#2463EB]" />
                  <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                    2. Receiver Details (Consignee)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Receiver Name */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 flex items-center space-x-1">
                      <span>Receiver Name</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={50}
                      placeholder="e.g. Kenji Takahashi"
                      value={formData.receiverName}
                      onChange={(e) => {
                        const clean = e.target.value.replace(/[^a-zA-Z\s]/g, '').slice(0, 50);
                        setFormData({ ...formData, receiverName: clean });
                        if (errors.receiverName) setErrors({ ...errors, receiverName: null });
                      }}
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl font-bold text-slate-900 focus-blue shadow-2xs ${
                        errors.receiverName ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                      }`}
                    />
                    {errors.receiverName && <p className="text-[10px] text-red-500 font-bold">{errors.receiverName}</p>}
                  </div>

                  {/* Receiver Company */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Company Name (Optional)</label>
                    <input
                      type="text"
                      maxLength={80}
                      placeholder="e.g. Narita Tech Logistics Co."
                      value={formData.receiverCompany}
                      onChange={(e) => setFormData({ ...formData, receiverCompany: e.target.value.slice(0, 80) })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus-blue shadow-2xs"
                    />
                  </div>

                  {/* Receiver Email */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 flex items-center space-x-1">
                      <span>Receiver Email Address</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      maxLength={60}
                      placeholder="e.g. receiving@naritatech.co.jp"
                      value={formData.receiverEmail}
                      onChange={(e) => {
                        setFormData({ ...formData, receiverEmail: e.target.value.slice(0, 60) });
                        if (errors.receiverEmail) setErrors({ ...errors, receiverEmail: null });
                      }}
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl font-medium text-slate-900 focus-blue shadow-2xs ${
                        errors.receiverEmail ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                      }`}
                    />
                    {errors.receiverEmail && <p className="text-[10px] text-red-500 font-bold">{errors.receiverEmail}</p>}
                  </div>

                  {/* Receiver Mobile Number */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center space-x-1">
                        <span>Receiver Mobile No</span>
                        <span className="text-red-500">*</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {getPhoneLength(receiverCountryCode)} digits max
                      </span>
                    </label>
                    <div className="flex items-center">
                      <select
                        value={receiverCountryCode}
                        onChange={(e) => {
                          const newCode = e.target.value;
                          setReceiverCountryCode(newCode);
                          const maxLen = getPhoneLength(newCode);
                          const trimmed = receiverPhoneDigits.slice(0, maxLen);
                          setReceiverPhoneDigits(trimmed);
                          setFormData(prev => ({
                            ...prev,
                            receiverPhone: trimmed ? `${newCode} ${trimmed}` : ''
                          }));
                          if (errors.receiverPhone) setErrors(prev => ({ ...prev, receiverPhone: null }));
                        }}
                        className="h-[42px] px-2.5 bg-slate-100 border border-slate-200 rounded-l-xl text-slate-800 font-bold text-xs shrink-0 cursor-pointer border-r-0 focus:outline-none focus:ring-1 focus:ring-[#2463EB]"
                      >
                        {countryCodesList.map((item) => (
                          <option key={item.code} value={item.code}>
                            {item.flag} {item.code} ({item.country})
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        required
                        maxLength={getPhoneLength(receiverCountryCode)}
                        placeholder={`e.g. ${'9'.repeat(getPhoneLength(receiverCountryCode))}`}
                        value={receiverPhoneDigits}
                        onChange={(e) => {
                          const clean = e.target.value.replace(/[^0-9]/g, '').slice(0, getPhoneLength(receiverCountryCode));
                          setReceiverPhoneDigits(clean);
                          setFormData(prev => ({
                            ...prev,
                            receiverPhone: clean ? `${receiverCountryCode} ${clean}` : ''
                          }));
                          if (errors.receiverPhone) setErrors(prev => ({ ...prev, receiverPhone: null }));
                        }}
                        onKeyDown={(e) => {
                          const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'];
                          if (!allowed.includes(e.key) && !/^[0-9]$/.test(e.key) && !e.ctrlKey && !e.metaKey) {
                            e.preventDefault();
                          }
                        }}
                        className={`w-full h-[42px] px-3.5 bg-slate-50 border rounded-r-xl font-mono font-medium text-slate-900 focus-blue shadow-2xs ${
                          errors.receiverPhone ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {errors.receiverPhone && <p className="text-[10px] text-red-500 font-bold">{errors.receiverPhone}</p>}
                  </div>
                </div>
              </div>

              {/* 3. SHIPMENT DETAILS */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                  <MapPin className="w-4 h-4 text-[#2463EB]" />
                  <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                    3. Shipment Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Origin */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 flex items-center space-x-1">
                      <span>Origin Airport / Cargo Bay</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SIN - Singapore Changi Airport (Air Cargo Complex)"
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl font-semibold text-slate-900 focus-blue shadow-2xs ${
                        errors.origin ? 'border-red-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.origin && <p className="text-[10px] text-red-500 font-bold">{errors.origin}</p>}
                  </div>

                  {/* Destination Dropdown */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center space-x-1">
                        <span>Destination Airport / Country</span>
                        <span className="text-red-500">*</span>
                      </span>
                      {destinationOption && (
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          {destinationOption === 'OTHER' ? 'Custom' : 'Selected'}
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={destinationOption}
                        onChange={handleDestinationChange}
                        className={`w-full appearance-none px-3.5 py-2.5 bg-slate-50 border rounded-xl font-semibold text-slate-900 focus-blue shadow-2xs cursor-pointer pr-10 ${
                          errors.destination ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                        }`}
                      >
                        <option value="">-- Select Destination Airport / Country --</option>
                        {DESTINATION_OPTIONS.map((cat, i) => (
                          <optgroup key={i} label={cat.group} className="font-bold text-slate-800 bg-slate-100">
                            {cat.options.map((opt, j) => (
                              <option key={j} value={opt} className="font-medium text-slate-900 bg-white">
                                {opt}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                        <optgroup label="Other / Unlisted" className="font-bold text-slate-800 bg-slate-100">
                          <option value="OTHER" className="font-bold text-[#2463EB] bg-white">
                            + Other (Specify Custom Destination Airport / Country)
                          </option>
                        </optgroup>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* Custom Destination input when 'OTHER' selected */}
                    {destinationOption === 'OTHER' && (
                      <div className="pt-2 animate-fade-in space-y-1">
                        <input
                          type="text"
                          required
                          placeholder="e.g. SYD - Sydney Kingsford Smith Airport, Australia"
                          value={customDestination}
                          onChange={handleCustomDestinationChange}
                          className="w-full px-3.5 py-2.5 bg-white border border-[#2463EB]/40 rounded-xl font-semibold text-slate-900 focus-blue shadow-2xs placeholder:text-slate-400"
                          autoFocus
                        />
                        <p className="text-[10px] text-slate-400">
                          Specify the destination airport code, airport name, or country.
                        </p>
                      </div>
                    )}
                    {errors.destination && <p className="text-[10px] text-red-500 font-bold">{errors.destination}</p>}
                  </div>

                  {/* Incoterms (Terms of Trade - FOB Only) */}
                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-bold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center space-x-1">
                        <span>Incoterms (Terms of Trade)</span>
                        <span className="text-red-500">*</span>
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        FOB Only
                      </span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="FOB - Free on Board"
                      className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-900 shadow-2xs cursor-default select-none"
                    />
                    <p className="text-[10px] text-slate-400">
                      Standard trade term for this air freight service is strictly FOB (Free on Board).
                    </p>
                  </div>

                  {/* Cargo/Product Description Dropdown */}
                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-bold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center space-x-1">
                        <span>Cargo / Product Description</span>
                        <span className="text-red-500">*</span>
                      </span>
                      {cargoOption && (
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          {cargoOption === 'OTHER' ? 'Custom' : 'Selected'}
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={cargoOption}
                        onChange={handleCargoChange}
                        className={`w-full appearance-none px-3.5 py-2.5 bg-slate-50 border rounded-xl font-semibold text-slate-900 focus-blue shadow-2xs cursor-pointer pr-10 ${
                          errors.cargoDescription ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                        }`}
                      >
                        <option value="">-- Select Cargo / Product Description --</option>
                        {CARGO_OPTIONS.map((cat, i) => (
                          <optgroup key={i} label={cat.group} className="font-bold text-slate-800 bg-slate-100">
                            {cat.options.map((opt, j) => (
                              <option key={j} value={opt} className="font-medium text-slate-900 bg-white">
                                {opt}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                        <optgroup label="Other / Custom Category" className="font-bold text-slate-800 bg-slate-100">
                          <option value="OTHER" className="font-bold text-[#2463EB] bg-white">
                            + Other (Specify Custom Cargo / Product Description)
                          </option>
                        </optgroup>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* Custom Cargo input when 'OTHER' selected */}
                    {cargoOption === 'OTHER' && (
                      <div className="pt-2 animate-fade-in space-y-1">
                        <input
                          type="text"
                          required
                          placeholder="e.g. Temperature-sensitive pharmaceuticals, specialized drone parts, etc."
                          value={customCargo}
                          onChange={handleCustomCargoChange}
                          className="w-full px-3.5 py-2.5 bg-white border border-[#2463EB]/40 rounded-xl font-semibold text-slate-900 focus-blue shadow-2xs placeholder:text-slate-400"
                          autoFocus
                        />
                        <p className="text-[10px] text-slate-400">
                          Describe your cargo, product category, or special packaging specifications.
                        </p>
                      </div>
                    )}
                    {errors.cargoDescription && <p className="text-[10px] text-red-500 font-bold">{errors.cargoDescription}</p>}
                  </div>

                  {/* Number of Packages */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 flex items-center space-x-1">
                      <span>Number of Packages</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={8}
                      placeholder="e.g. 15"
                      value={formData.packagesCount}
                      onChange={(e) => {
                        const clean = e.target.value.replace(/[^0-9]/g, '').slice(0, 8);
                        setFormData({ ...formData, packagesCount: clean });
                        if (errors.packagesCount) setErrors({ ...errors, packagesCount: null });
                      }}
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl font-medium text-slate-900 focus-blue shadow-2xs ${
                        errors.packagesCount ? 'border-red-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.packagesCount && <p className="text-[10px] text-red-500 font-bold">{errors.packagesCount}</p>}
                  </div>

                  {/* Total Weight */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 flex items-center space-x-1">
                      <span>Total Weight (kg)</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      placeholder="e.g. 320"
                      value={formData.totalWeight}
                      onChange={(e) => {
                        let val = e.target.value.replace(/[^0-9.]/g, '');
                        const parts = val.split('.');
                        if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('');
                        val = val.slice(0, 10);
                        setFormData({ ...formData, totalWeight: val });
                        if (errors.totalWeight) setErrors({ ...errors, totalWeight: null });
                      }}
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl font-mono font-bold text-slate-900 focus-blue shadow-2xs ${
                        errors.totalWeight ? 'border-red-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.totalWeight && <p className="text-[10px] text-red-500 font-bold">{errors.totalWeight}</p>}
                  </div>

                  {/* Dimensions */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Dimensions (L x W x H)</label>
                    <input
                      type="text"
                      maxLength={30}
                      placeholder="e.g. 120 x 80 x 75 cm"
                      value={formData.dimensions}
                      onChange={(e) => {
                        const clean = e.target.value.replace(/[^0-9xX\s*.-]/g, '').slice(0, 30);
                        setFormData({ ...formData, dimensions: clean });
                        if (errors.dimensions) setErrors({ ...errors, dimensions: null });
                      }}
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl font-mono text-slate-900 focus-blue shadow-2xs ${
                        errors.dimensions ? 'border-red-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.dimensions && <p className="text-[10px] text-red-500 font-bold">{errors.dimensions}</p>}
                  </div>

                  {/* Approximate Shipment Value */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Approximate Shipment Value</label>
                    <input
                      type="text"
                      maxLength={20}
                      placeholder="e.g. SGD 45,000"
                      value={formData.approximateValue}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (!val.startsWith('SGD ')) {
                          val = 'SGD ' + val.replace(/^SGD\s*/i, '');
                        }
                        const numPart = val.slice(4).replace(/[^0-9,.]/g, '').slice(0, 15);
                        setFormData({ ...formData, approximateValue: 'SGD ' + numPart });
                      }}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus-blue shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* 4. SERVICE REQUIRED (MULTIPLE SELECTIONS) */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2463EB]" />
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                      4. Service Required
                    </h3>
                    <p className="text-[11px] text-slate-400 font-normal">Select all services needed for this consignment</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableServices.map((svc) => {
                    const isSelected = selectedServices.includes(svc.id);
                    const IconComp = svc.icon;

                    return (
                      <div
                        key={svc.id}
                        onClick={() => toggleService(svc.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 group ${
                          isSelected
                            ? 'bg-blue-50/70 border-blue-500 shadow-xs'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isSelected ? 'bg-blue-600 text-white' : 'border border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center space-x-1.5 font-extrabold text-slate-900 text-xs">
                            <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                            <span>{svc.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                            {svc.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 5. DOCUMENT UPLOAD */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                  <Upload className="w-4 h-4 text-[#2463EB]" />
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                      5. Document Upload
                    </h3>
                    <p className="text-[11px] text-slate-400 font-normal">
                      Upload available paperwork for review (optional for initial submission)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'commercialInvoice', title: 'Commercial Invoice', tip: 'PDF, JPG or PNG up to 10MB' },
                    { key: 'packingList', title: 'Packing List', tip: 'Itemized consignment manifest' },
                    { key: 'certificateOfOrigin', title: 'Certificate of Origin', tip: 'Chamber / Customs issued certificate' },
                    { key: 'otherDocuments', title: 'Other Shipment Documents', tip: 'MSDS, permits, licenses' },
                  ].map((doc) => {
                    const uploaded = uploadedFiles[doc.key];

                    return (
                      <div key={doc.key} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 text-xs">{doc.title}</span>
                          {uploaded ? (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              Uploaded
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium">Optional</span>
                          )}
                        </div>

                        {uploaded ? (
                          <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                            <div className="flex items-center space-x-2 truncate">
                              <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="font-mono font-bold text-slate-800 text-xs truncate">
                                {uploaded.name}
                              </span>
                              <span className="text-[10px] text-slate-400 shrink-0">({uploaded.size})</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(doc.key)}
                              className="p-1 text-slate-400 hover:text-red-500 cursor-pointer ml-1"
                              title="Remove file"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="p-3 bg-white hover:bg-slate-100/80 rounded-xl border border-dashed border-slate-300 hover:border-[#2463EB] transition-colors flex items-center justify-center space-x-2 cursor-pointer text-center">
                            <FileUp className="w-4 h-4 text-slate-400" />
                            <span className="text-[11px] font-bold text-slate-600">Choose or Drop File</span>
                            <input
                              type="file"
                              onChange={(e) => handleFileUpload(doc.key, e)}
                              className="hidden"
                              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                            />
                          </label>
                        )}
                        <p className="text-[10px] text-slate-400">{doc.tip}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[11px] text-slate-400 max-w-sm">
                  By submitting, your consignment info is sent to Josan Logistics Air Cargo Desk for verification.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#2463EB] to-[#1D4ED8] hover:from-[#2463EB] hover:to-[#1E40AF] text-white rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
                >
                  <Plane className="w-4 h-4" />
                  <span>{isSubmitting ? 'Processing Request...' : 'Submit Air Freight Service Request'}</span>
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
