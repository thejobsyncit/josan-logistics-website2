import React, { useState, useEffect, useRef } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { 
  Package, 
  MapPin, 
  Truck, 
  Globe,
  ShieldCheck, 
  CheckCircle2, 
  DollarSign, 
  Plus, 
  Trash2, 
  Printer, 
  ArrowRight,
  ArrowLeft,
  ArrowRightLeft,
  Layers,
  FileSpreadsheet,
  CreditCard,
  QrCode,
  Landmark,
  Lock,
  Loader2,
  ChevronRight,
  User,
  Building,
  Calendar,
  Sparkles,
  Mail,
  Phone,
  Info,
  FileText,
  Navigation,
  Send,
  HelpCircle,
  AlertTriangle,
  Pencil,
  ChevronDown,
  Upload,
  Search,
  ChevronsRight,
  ChevronsLeft,
  Building2
} from 'lucide-react';

import { countryCodesList, getPhoneLength, getCountryName } from '../data/countryCodes';
import { DomesticShipmentPage } from './DomesticShipmentPage';

const countryOptions = [
  'India',
  'Singapore',
  'Malaysia',
  'United States',
  'China',
  'Indonesia',
  'Australia',
  'United Kingdom',
  'Germany',
  'Japan',
  'Vietnam',
  'Thailand',
  'United Arab Emirates',
  'Canada'
];

const cargoTypeOptions = [
  'General Cargo',
  'Fragile',
  'Perishable',
  'Temperature-Controlled',
  'Valuable',
  'Dangerous Goods',
  'Documents',
  'Electronics',
  'Healthcare/Pharmaceutical',
  'Road Freight / Express Haulage',
  'Bulk Shipment (FTL)',
  'Consolidated Road Freight (LTL)'
];

const handlingRequirementOptions = [
  'Standard IATA Cargo Handling',
  'Active Temperature Controlled (2°C - 8°C)',
  'Deep Frozen (-20°C)',
  'Fragile & Shock Sensitive',
  'Dangerous Goods (IATA DGR Compliance)',
  'High-Value Vault & Armed Escort',
  'Keep Upright / No Stacking',
  'Forklift / Heavy Lift Equipment Required'
];

const documentDescriptionOptions = [
  'Annual reports',
  'Bill of lading',
  'Certificates',
  'Completed Forms',
  'Contract',
  'Credit note',
  'Deeds',
  'Diplomatic mail',
  'Documents - general business',
  'Educational material - printed',
  'Examination papers',
  'Identity document',
  'Invoices - not blank',
  'Letter, correspondence',
  'Medical Examination Result',
  'Passports',
  'Photographs - as part of business reports',
  'Printed matter',
  'Shipping schedules',
  'Unactivated Credit/Debit/ATM Card',
  'Visa applications',
  'Other / Custom Description'
];

const packageDescriptionOptions = [
  'Electronics & Accessories',
  'Garments, Apparel & Textiles',
  'Automotive Spare Parts',
  'Commercial Samples & Models',
  'Footwear & Leather Goods',
  'Cosmetics & Personal Care Products',
  'Foodstuffs & Packaged Snacks (Non-Perishable)',
  'Medical Devices & Health Supplies',
  'Toys, Games & Hobby Items',
  'Books, Stationery & Printed Media',
  'Home Decor, Handicrafts & Furnishings',
  'Jewelry & Watch Accessories (Non-Precious)',
  'Hardware Tools & Machinery Parts',
  'Sports Goods & Fitness Equipment',
  'Kitchenware & Small Appliances',
  'Other / Custom Description'
];

export const BookShipmentPage = ({ setActiveTab }) => {
  const { 
    addShipment, 
    setSelectedInvoiceShipment, 
    showToast, 
    currentUser, 
    setIsAuthModalOpen,
    setAuthRedirectTab,
    shipmentScope, 
    setShipmentScope,
    resetShipmentScope 
  } = useLogistics();

  const [bookingMode, setBookingMode] = useState('single'); // 'single' | 'bulk'
  const [currentStep, setCurrentStep] = useState(1); // 1: Sender & Recipient | 2: Cargo & Speed | 3: Review & Pay | 4: Print
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'paynow'
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [showFromOptional, setShowFromOptional] = useState(false);
  const [showToOptional, setShowToOptional] = useState(false);

  // Custom dropdown states & click-outside refs
  const [isDocDropdownOpen, setIsDocDropdownOpen] = useState(false);
  const [isPkgDropdownOpen, setIsPkgDropdownOpen] = useState(false);
  const [isPurposeDropdownOpen, setIsPurposeDropdownOpen] = useState(false);
  const [isCargoDropdownOpen, setIsCargoDropdownOpen] = useState(false);
  const [isTaxDropdownOpen, setIsTaxDropdownOpen] = useState(false);

  const docDropdownRef = useRef(null);
  const pkgDropdownRef = useRef(null);
  const purposeDropdownRef = useRef(null);
  const cargoDropdownRef = useRef(null);
  const taxDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (docDropdownRef.current && !docDropdownRef.current.contains(event.target)) {
        setIsDocDropdownOpen(false);
      }
      if (pkgDropdownRef.current && !pkgDropdownRef.current.contains(event.target)) {
        setIsPkgDropdownOpen(false);
      }
      if (purposeDropdownRef.current && !purposeDropdownRef.current.contains(event.target)) {
        setIsPurposeDropdownOpen(false);
      }
      if (cargoDropdownRef.current && !cargoDropdownRef.current.contains(event.target)) {
        setIsCargoDropdownOpen(false);
      }
      if (taxDropdownRef.current && !taxDropdownRef.current.contains(event.target)) {
        setIsTaxDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Single Booking Form State (Auto-saved to localStorage)
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_draft_shipment');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.uniqueShipmentItems || parsed.uniqueShipmentItems.length === 0) {
          parsed.uniqueShipmentItems = [{
            id: 1,
            description: parsed.customItemDescription || '',
            commodityCode: parsed.commodityCode || '',
            quantity: 1,
            units: 'Pieces',
            valuePerItem: '',
            weightPerItem: '',
            madeIn: '',
            taxPaid: false,
            addLineItemReference: false,
            lineItemReference: ''
          }];
        }
        return parsed;
      }
    } catch (err) {
      console.error('Failed to load saved shipment draft from localStorage:', err);
    }
    return {
      // From / Sender Details
      senderName: '',
      senderIsBusiness: false,
      senderCompany: '',
      senderCountry: 'India',
      senderAddress1: '',
      senderAddress2: '',
      senderAddress3: '',
      senderPostalCode: '',
      senderCity: '',
      senderState: '',
      senderIsResidential: false,
      senderEmail: '',
      senderPhoneType: 'Mobile',
      senderCountryCode: '+91',
      senderPhone: '',
      senderSmsEnabled: true,
      senderTaxIdType: 'PAN',
      senderTaxIdNumber: '',

      // To / Recipient Details
      receiverName: '',
      receiverIsBusiness: false,
      receiverCompany: '',
      receiverCountry: 'Singapore',
      receiverAddress1: '',
      receiverAddress2: '',
      receiverAddress3: '',
      receiverPostalCode: '',
      receiverCity: '',
      receiverState: '',
      receiverIsResidential: false,
      receiverEmail: '',
      receiverPhoneType: 'Mobile',
      receiverCountryCode: '+65',
      receiverPhone: '',
      receiverSmsEnabled: true,
      receiverTaxIdType: 'GSTIN',
      receiverTaxIdNumber: '',

      // Cargo Specs & SLA
      shipmentCategory: 'packages', // default to packages for gift/sample workflow
      packageShipmentType: 'gift_sample', // 'gift_sample' | 'cargo'
      shipmentPurpose: 'Gift',
      itemDetailMethod: 'describe', // 'describe' | 'upload'
      taxPaymentOption: '',
      showEstimatedDuties: false,
      customItemDescription: '',
      commodityCode: '',
      itemDescription: '',
      uniqueShipmentItems: [
        {
          id: 1,
          description: '',
          commodityCode: '',
          quantity: 1,
          units: 'Pieces',
          valuePerItem: '',
          weightPerItem: '',
          madeIn: '',
          taxPaid: false,
          addLineItemReference: false,
          lineItemReference: ''
        }
      ],
      shipmentReferences: [''],
      shipmentMode: 'air', // 'air' (default/primary) | 'road'
      handlingRequirements: 'Standard IATA Cargo Handling',
      pickupLocation: '',
      deliveryLocation: '',
      weight: 15,
      lengthCm: 40,
      widthCm: 30,
      heightCm: 25,
      pieces: 1,
      cargoType: 'General Cargo',
      serviceLevel: 'Express Air Freight',
      declaredValue: '15,000',
      includeInsurance: true
    };
  });

  const [isCreateDescModalOpen, setIsCreateDescModalOpen] = useState(false);
  const [isLookupCodeModalOpen, setIsLookupCodeModalOpen] = useState(false);
  const [isQuickGuideModalOpen, setIsQuickGuideModalOpen] = useState(false);
  const [isProductListModalOpen, setIsProductListModalOpen] = useState(false);
  const [activeItemIndexForModal, setActiveItemIndexForModal] = useState(0);
  const [hsCodeSearch, setHsCodeSearch] = useState('');





  const defaultItems = [
    {
      id: 1,
      description: '',
      commodityCode: '',
      quantity: 1,
      units: 'Pieces',
      valuePerItem: '',
      weightPerItem: '',
      madeIn: '',
      taxPaid: false,
      addLineItemReference: false,
      lineItemReference: ''
    }
  ];

  const uniqueItemsList = formData.uniqueShipmentItems && formData.uniqueShipmentItems.length > 0 
    ? formData.uniqueShipmentItems 
    : defaultItems;

  const handleAddUniqueItem = () => {
    const nextId = uniqueItemsList.length + 1;
    const newItem = {
      id: nextId,
      description: '',
      commodityCode: '',
      quantity: 1,
      units: 'Pieces',
      valuePerItem: '',
      weightPerItem: '',
      madeIn: '',
      taxPaid: false,
      addLineItemReference: false,
      lineItemReference: ''
    };
    setFormData(prev => ({
      ...prev,
      uniqueShipmentItems: [...(prev.uniqueShipmentItems && prev.uniqueShipmentItems.length > 0 ? prev.uniqueShipmentItems : defaultItems), newItem]
    }));
    showToast(`Added Unique Item #${nextId}`, 'info');
  };

  const handleCopyUniqueItem = (index) => {
    const source = uniqueItemsList[index] || uniqueItemsList[0];
    const copied = { ...source, id: Date.now() };
    const updated = [...uniqueItemsList];
    updated.splice(index + 1, 0, copied);
    setFormData(prev => ({ ...prev, uniqueShipmentItems: updated }));
    showToast(`Copied Item #${index + 1} to Item #${index + 2}`, 'info');
  };

  const handleRemoveUniqueItem = (index) => {
    if (uniqueItemsList.length <= 1) return;
    const updated = uniqueItemsList.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, uniqueShipmentItems: updated }));
    showToast(`Removed Item #${index + 1}`, 'info');
  };

  const handleUniqueItemChange = (index, field, value) => {
    const updated = [...uniqueItemsList];
    updated[index] = { ...updated[index], [field]: value };

    const computedTotalWeight = updated.reduce((acc, curr) => acc + ((parseFloat(curr.weightPerItem) || 0) * (parseInt(curr.quantity) || 1)), 0);

    setFormData(prev => ({
      ...prev,
      uniqueShipmentItems: updated,
      customItemDescription: updated[0]?.description || prev.customItemDescription,
      commodityCode: updated[0]?.commodityCode || prev.commodityCode,
      weight: computedTotalWeight > 0 ? Math.max(1, Math.round(computedTotalWeight)) : prev.weight
    }));
  };

  const totalUnitsCount = uniqueItemsList.reduce((acc, curr) => acc + (parseInt(curr.quantity) || 0), 0);
  const totalWeightKg = uniqueItemsList.reduce((acc, curr) => acc + ((parseFloat(curr.weightPerItem) || 0) * (parseInt(curr.quantity) || 1)), 0);
  const totalValueInr = uniqueItemsList.reduce((acc, curr) => acc + ((parseFloat(curr.valuePerItem) || 0) * (parseInt(curr.quantity) || 1)), 0);

  // Autosave useEffect on formData changes
  useEffect(() => {
    try {
      localStorage.setItem('josan_draft_shipment', JSON.stringify(formData));
      const now = new Date();
      setLastSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error('Failed to autosave shipment draft:', err);
    }
  }, [formData]);

  // Synchronize country when domestic scope is active
  useEffect(() => {
    if (shipmentScope === 'domestic') {
      const country = formData.senderCountry || 'Singapore';
      const matched = countryCodesList.find(c => c.country && country && c.country.toLowerCase() === country.toLowerCase());
      const code = matched ? matched.code : (country === 'India' ? '+91' : '+65');
      if (formData.receiverCountry !== country) {
        setFormData(prev => ({
          ...prev,
          receiverCountry: country,
          receiverCountryCode: code
        }));
      }
    }
  }, [shipmentScope]);

  // Credit Card Form Input States & Handlers
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const handleCardNumberChange = (e) => {
    const rawDigits = e.target.value.replace(/[^0-9]/g, '').slice(0, 16);
    const formatted = rawDigits.match(/.{1,4}/g)?.join(' ') || rawDigits;
    setCardNumber(formatted);
  };

  const handleCardExpiryChange = (e) => {
    let clean = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    if (clean.length >= 3) {
      clean = `${clean.slice(0, 2)}/${clean.slice(2)}`;
    }
    setCardExpiry(clean);
  };

  const handleCardCvvChange = (e) => {
    const rawDigits = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setCardCvv(rawDigits);
  };

  // Address Swap / Switch Handler (⇄ Switch Button)
  const handleSwapAddresses = () => {
    setFormData(prev => ({
      ...prev,
      senderName: prev.receiverName,
      senderIsBusiness: prev.receiverIsBusiness,
      senderCompany: prev.receiverCompany,
      senderCountry: prev.receiverCountry,
      senderAddress1: prev.receiverAddress1,
      senderAddress2: prev.receiverAddress2,
      senderAddress3: prev.receiverAddress3,
      senderPostalCode: prev.receiverPostalCode,
      senderCity: prev.receiverCity,
      senderState: prev.receiverState,
      senderIsResidential: prev.receiverIsResidential,
      senderEmail: prev.receiverEmail,
      senderPhoneType: prev.receiverPhoneType,
      senderCountryCode: prev.receiverCountryCode,
      senderPhone: prev.receiverPhone,
      senderSmsEnabled: prev.receiverSmsEnabled,
      senderTaxIdType: prev.receiverTaxIdType,
      senderTaxIdNumber: prev.receiverTaxIdNumber,

      receiverName: prev.senderName,
      receiverIsBusiness: prev.senderIsBusiness,
      receiverCompany: prev.senderCompany,
      receiverCountry: prev.senderCountry,
      receiverAddress1: prev.senderAddress1,
      receiverAddress2: prev.senderAddress2,
      receiverAddress3: prev.senderAddress3,
      receiverPostalCode: prev.senderPostalCode,
      receiverCity: prev.senderCity,
      receiverState: prev.senderState,
      receiverIsResidential: prev.senderIsResidential,
      receiverEmail: prev.senderEmail,
      receiverPhoneType: prev.senderPhoneType,
      receiverCountryCode: prev.senderCountryCode,
      receiverPhone: prev.senderPhone,
      receiverSmsEnabled: prev.senderSmsEnabled,
      receiverTaxIdType: prev.senderTaxIdType,
      receiverTaxIdNumber: prev.senderTaxIdNumber
    }));
    showToast('Swapped From (Sender) and To (Recipient) details!', 'info');
  };

  const handleClearSenderAddress = () => {
    setFormData(prev => ({
      ...prev,
      senderName: '',
      senderCompany: '',
      senderAddress1: '',
      senderAddress2: '',
      senderAddress3: '',
      senderPostalCode: '',
      senderCity: '',
      senderState: '',
      senderEmail: '',
      senderPhone: '',
      senderTaxIdNumber: ''
    }));
    showToast('Sender (From) address fields cleared.', 'info');
  };

  const handleClearReceiverAddress = () => {
    setFormData(prev => ({
      ...prev,
      receiverName: '',
      receiverCompany: '',
      receiverAddress1: '',
      receiverAddress2: '',
      receiverAddress3: '',
      receiverPostalCode: '',
      receiverCity: '',
      receiverState: '',
      receiverEmail: '',
      receiverPhone: '',
      receiverTaxIdNumber: ''
    }));
    showToast('Recipient (To) address fields cleared.', 'info');
  };

  const handleSaveForLater = () => {
    showToast('Shipment draft saved for later! You can resume anytime from your dashboard.', 'info');
  };

  // Price Calculation Logic
  const getServiceModeDetails = (serviceLevelStr) => {
    if (!serviceLevelStr) return { name: 'Express Air Freight', baseFee: 45, ratePerKg: 14 };
    if (serviceLevelStr.includes('Ocean') || serviceLevelStr.includes('Sea')) {
      return { name: 'Ocean Container Cargo', baseFee: 15, ratePerKg: 3 };
    }
    if (serviceLevelStr.includes('Land') || serviceLevelStr.includes('Trucking') || serviceLevelStr.includes('ground')) {
      return { name: 'Land Freight Trucking', baseFee: 25, ratePerKg: 8 };
    }
    if (serviceLevelStr.includes('Cold')) {
      return { name: 'Cold Chain Pharma Vault', baseFee: 50, ratePerKg: 18 };
    }
    return { name: 'Express Air Freight', baseFee: 45, ratePerKg: 14 };
  };

  const getCargoTypeSurcharge = (type) => {
    switch (type) {
      case 'Pharma Cold Chain': return 35;
      case 'Dangerous Goods / Chemicals': return 45;
      case 'Perishable Foods & Beverages': return 25;
      case 'High-Tech Electronics': return 20;
      case 'Automotive Parts': return 15;
      case 'Industrial Components': return 15;
      case 'Textiles & Apparel': return 5;
      case 'General Goods':
      default: return 0;
    }
  };

  const calculateDeliveryDate = (dispatchDateStr = 'September 14', slaDays = 2) => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let baseDate = new Date(2026, 8, 14); // default Sept 14, 2026

    if (dispatchDateStr && dispatchDateStr !== 'More +') {
      const parts = dispatchDateStr.trim().split(' ');
      if (parts.length >= 2) {
        const monthIdx = monthNames.findIndex(m => m.toLowerCase() === parts[0].toLowerCase());
        const dayNum = parseInt(parts[1], 10);
        if (monthIdx !== -1 && !isNaN(dayNum)) {
          baseDate = new Date(2026, monthIdx, dayNum);
        }
      }
    }

    baseDate.setDate(baseDate.getDate() + slaDays);

    const monthDay = `${monthNames[baseDate.getMonth()]} ${baseDate.getDate()}`;
    const dayOfWeek = dayNames[baseDate.getDay()];

    return { monthDay, dayOfWeek };
  };

  const calculatePricingDetails = () => {
    const serviceInfo = getServiceModeDetails(formData.serviceLevel);
    const baseFee = serviceInfo.baseFee;
    const ratePerKg = serviceInfo.ratePerKg;
    const weightCost = (Number(formData.weight) || 0) * ratePerKg;
    const cargoSurcharge = getCargoTypeSurcharge(formData.cargoType);
    const piecesSurcharge = Math.max(0, (formData.pieces - 1)) * 15;
    
    const transportCost = baseFee + weightCost + cargoSurcharge + piecesSurcharge;
    const insuranceFee = formData.includeInsurance ? 35 : 0;
    const subtotal = transportCost + insuranceFee;

    return {
      baseFee,
      ratePerKg,
      weightCost,
      cargoSurcharge,
      piecesSurcharge,
      transportCost,
      insuranceFee,
      total: subtotal
    };
  };

  const calculateEstimatedPrice = () => {
    const details = calculatePricingDetails();
    return `$${details.total.toFixed(2)}`;
  };

  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // Step Validation Helper - Strict Mandatory Field Checks
  const validateStep = (stepNumber) => {
    // STEP 1 Validation: Routing (From & To)
    if (stepNumber === 1) {
      // From (Origin) Validation
      if (!formData.senderCompany || !formData.senderCompany.trim()) {
        showToast('Please enter Company Name (From)', 'warning');
        return false;
      }
      if (!formData.senderCountry) {
        showToast('Please select Country (From)', 'warning');
        return false;
      }
      if (!formData.senderPostalCode || !formData.senderPostalCode.trim()) {
        showToast('Please enter Zip-Code (From)', 'warning');
        return false;
      }
      if (!formData.senderCity || !formData.senderCity.trim()) {
        showToast('Please enter City (From)', 'warning');
        return false;
      }
      if (!formData.senderAddress1 || !formData.senderAddress1.trim()) {
        showToast('Please enter Street & Number (From)', 'warning');
        return false;
      }

      // To (Destination) Validation
      if (!formData.receiverCompany || !formData.receiverCompany.trim()) {
        showToast('Please enter Company Name (To)', 'warning');
        return false;
      }
      if (!formData.receiverCountry) {
        showToast('Please select Country (To)', 'warning');
        return false;
      }
      if (!formData.receiverPostalCode || !formData.receiverPostalCode.trim()) {
        showToast('Please enter Zip-Code (To)', 'warning');
        return false;
      }
      if (!formData.receiverCity || !formData.receiverCity.trim()) {
        showToast('Please enter City (To)', 'warning');
        return false;
      }
      if (!formData.receiverAddress1 || !formData.receiverAddress1.trim()) {
        showToast('Please enter Street & Number (To)', 'warning');
        return false;
      }

      // Auto-populate compatible fields for downstream customs, invoices & waybill generation
      if (!formData.senderName || !formData.senderName.trim()) {
        formData.senderName = formData.senderCompany;
      }
      if (!formData.senderEmail || !formData.senderEmail.trim()) {
        formData.senderEmail = currentUser?.email || `dispatch@${(formData.senderCompany || 'company').toLowerCase().replace(/[^a-z0-9]/g, '') || 'josan'}.com`;
      }
      if (!formData.senderPhone || !formData.senderPhone.trim()) {
        formData.senderPhone = '9876543210';
      }
      if (!formData.senderState || !formData.senderState.trim()) {
        formData.senderState = formData.senderCity;
      }

      if (!formData.receiverName || !formData.receiverName.trim()) {
        formData.receiverName = formData.receiverCompany;
      }
      if (!formData.receiverEmail || !formData.receiverEmail.trim()) {
        formData.receiverEmail = `receiving@${(formData.receiverCompany || 'company').toLowerCase().replace(/[^a-z0-9]/g, '') || 'client'}.com`;
      }
      if (!formData.receiverPhone || !formData.receiverPhone.trim()) {
        formData.receiverPhone = '9123456780';
      }
      if (!formData.receiverState || !formData.receiverState.trim()) {
        formData.receiverState = formData.receiverCity;
      }

      return true;
    }

    // STEP 2 Validation: Cargo & Package Specs
    if (stepNumber === 2) {
      if (formData.shipmentCategory === 'documents') {
        if (!formData.itemDescription) {
          showToast('Please select a Document Description', 'warning');
          return false;
        }
        if (formData.itemDescription === 'Other / Custom Description' && (!formData.customDocumentDescription || !formData.customDocumentDescription.trim())) {
          showToast('Please specify custom document description', 'warning');
          return false;
        }
      } else {
        if (!formData.itemDescription) {
          showToast('Please select a Package Description', 'warning');
          return false;
        }
        if (formData.itemDescription === 'Other / Custom Description' && (!formData.customPackageDescription || !formData.customPackageDescription.trim())) {
          showToast('Please specify custom package contents description', 'warning');
          return false;
        }
        if (!formData.shipmentPurpose) {
          showToast('Please select the purpose of your shipment', 'warning');
          return false;
        }
        if (!formData.taxPaymentOption) {
          showToast('Please select a Tax Payment option for this shipment', 'warning');
          return false;
        }

        if ((formData.itemDetailMethod || 'describe') === 'describe') {
          for (let i = 0; i < uniqueItemsList.length; i++) {
            const item = uniqueItemsList[i];
            if (!item.description || !item.description.trim()) {
              showToast(`Item #${i + 1}: Description is required`, 'warning');
              return false;
            }
            if (!item.valuePerItem || parseFloat(item.valuePerItem) <= 0) {
              showToast(`Item #${i + 1}: Value per item is required`, 'warning');
              return false;
            }
            if (!item.weightPerItem || parseFloat(item.weightPerItem) <= 0) {
              showToast(`Item #${i + 1}: Weight per item is required`, 'warning');
              return false;
            }
            if (!item.madeIn || !item.madeIn.trim()) {
              showToast(`Item #${i + 1}: Country where item was made is required`, 'warning');
              return false;
            }
          }
        }
      }

      if (formData.includeInsurance) {
        const val = formData.insuredValue !== undefined ? formData.insuredValue : totalValueInr;
        if (!val || parseFloat(val) <= 0) {
          showToast('Please enter the insured value for your shipment', 'warning');
          return false;
        }
      }

      if (!formData.gstTaxIdType || formData.gstTaxIdType === 'Select One') {
        showToast('Please select Tax ID/Personal ID type', 'warning');
        return false;
      }
      if (!formData.gstTaxIdNumber || !formData.gstTaxIdNumber.trim()) {
        showToast('Tax ID / Personal ID Number is required', 'warning');
        return false;
      }
      if (!formData.gstInvoiceNumber || !formData.gstInvoiceNumber.trim()) {
        showToast('GST Invoice Number is required', 'warning');
        return false;
      }
      if (!formData.gstInvoiceDate) {
        showToast('GST Invoice Date is required', 'warning');
        return false;
      }
      if (!formData.companyInvoiceNumber || !formData.companyInvoiceNumber.trim()) {
        showToast('Company Invoice Number is required', 'warning');
        return false;
      }
      if (!formData.companyInvoiceDate) {
        showToast('Company Invoice Date is required', 'warning');
        return false;
      }

      if (!formData.weight || Number(formData.weight) <= 0) {
        showToast('Cargo weight must be greater than 0 kg', 'warning');
        return false;
      }
      if (!formData.serviceLevel) {
        showToast('Please select a preferred Speed SLA Mode', 'warning');
        return false;
      }
      return true;
    }

    // STEP 3 Validation: Customs Invoice & Parties
    if (stepNumber === 3) {
      if (shipmentScope === 'domestic') {
        return true; // Customs invoice exempt for intra-country domestic
      }
      if (formData.customsInvoiceOption === 'own' && !formData.uploadedInvoiceName) {
        showToast('Please upload your commercial customs invoice file', 'warning');
        return false;
      }
      if ((formData.customsInvoiceOption || 'create') === 'create' && (!formData.companyInvoiceNumber || !formData.companyInvoiceNumber.trim())) {
        showToast('Invoice Number is required', 'warning');
        return false;
      }
      if (formData.hasAdditionalParties) {
        if (!formData.additionalPartyName || !formData.additionalPartyName.trim()) {
          showToast('Additional Party Contact Name is required', 'warning');
          return false;
        }
      }
      return true;
    }

    // STEP 4 Validation: Select Packaging Dimensions
    if (stepNumber === 4) {
      const pkgRows = formData.packagingRows || [{ id: 1, quantity: 1, weightKg: formData.weight }];
      for (let i = 0; i < pkgRows.length; i++) {
        const row = pkgRows[i];
        if (!row.weightKg || parseFloat(row.weightKg) <= 0) {
          showToast(`Package #${i + 1}: Weight (kg) is required`, 'warning');
          return false;
        }
        if (!row.lengthCm || parseFloat(row.lengthCm) <= 0) {
          showToast(`Package #${i + 1}: Length (cm) is required`, 'warning');
          return false;
        }
        if (!row.widthCm || parseFloat(row.widthCm) <= 0) {
          showToast(`Package #${i + 1}: Width (cm) is required`, 'warning');
          return false;
        }
        if (!row.heightCm || parseFloat(row.heightCm) <= 0) {
          showToast(`Package #${i + 1}: Height (cm) is required`, 'warning');
          return false;
        }
      }
      return true;
    }

    // STEP 5 Validation: How Will You Pay & Incoterms
    if (stepNumber === 5) {
      if (!formData.paymentMethodType || formData.paymentMethodType === 'Select One') {
        showToast('Please select a Payment Method', 'warning');
        return false;
      }
      if (!formData.dutiesPaymentOption) {
        showToast('Please select how duties and taxes will be paid', 'warning');
        return false;
      }
      if (!formData.incoterm || formData.incoterm === 'Select One') {
        showToast('Please select Customs Terms of Trade (Incoterm)', 'warning');
        return false;
      }
      return true;
    }

    // STEP 6 Validation: Dispatch Date & Rates
    if (stepNumber === 6) {
      if (!formData.selectedDispatchDate) {
        showToast('Please select a shipment dispatch date', 'warning');
        return false;
      }
      if (!formData.serviceLevel) {
        showToast('Please select a freight service rate option', 'warning');
        return false;
      }
      return true;
    }

    return true;
  };

  // Helper checking if all mandatory sender details are completed
  const isSenderComplete = Boolean(
    formData.senderName && formData.senderName.trim().length > 0 &&
    (!formData.senderIsBusiness || (formData.senderCompany && formData.senderCompany.trim().length > 0)) &&
    formData.senderCountry &&
    formData.senderAddress1 && formData.senderAddress1.trim().length > 0 &&
    formData.senderPostalCode && formData.senderPostalCode.trim().length > 0 &&
    formData.senderCity && formData.senderCity.trim().length > 0 &&
    formData.senderEmail && formData.senderEmail.trim().length > 0 && formData.senderEmail.includes('@') &&
    formData.senderPhone && (formData.senderPhone || '').replace(/\D/g, '').length >= 7
  );

  // Helper checking if all mandatory recipient details are completed
  const isReceiverComplete = Boolean(
    formData.receiverName && formData.receiverName.trim().length > 0 &&
    (!formData.receiverIsBusiness || (formData.receiverCompany && formData.receiverCompany.trim().length > 0)) &&
    formData.receiverCountry &&
    formData.receiverAddress1 && formData.receiverAddress1.trim().length > 0 &&
    formData.receiverPostalCode && formData.receiverPostalCode.trim().length > 0 &&
    formData.receiverCity && formData.receiverCity.trim().length > 0 &&
    formData.receiverEmail && formData.receiverEmail.trim().length > 0 && formData.receiverEmail.includes('@') &&
    formData.receiverPhone && (formData.receiverPhone || '').replace(/\D/g, '').length >= 7
  );

  const shipmentDetailsRef = useRef(null);
  const prevReceiverCompleteRef = useRef(false);

  useEffect(() => {
    if (isReceiverComplete && !prevReceiverCompleteRef.current) {
      setTimeout(() => {
        shipmentDetailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
    prevReceiverCompleteRef.current = isReceiverComplete;
  }, [isReceiverComplete]);

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setShowValidationErrors(false);
      setCurrentStep(prev => Math.min(prev + 1, 7));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowValidationErrors(true);
    }
  };

  const handleStepPillClick = (targetStep) => {
    if (targetStep === currentStep) return;
    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    for (let s = 1; s < targetStep; s++) {
      if (!validateStep(s)) {
        setShowValidationErrors(true);
        setCurrentStep(s);
        return;
      }
    }
    setShowValidationErrors(false);
    setCurrentStep(targetStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper for dynamic input border styling (rose red when missing on error attempt, standard clean border otherwise)
  const getInputClass = (val, isRequired = true, defaultStyle = 'border-slate-300 focus-orange') => {
    const isFilled = typeof val === 'string' ? val && val.trim().length > 0 : (typeof val === 'number' ? val > 0 : Boolean(val));
    if (isRequired && showValidationErrors && !isFilled) {
      return 'border-rose-500 ring-2 ring-rose-400 bg-rose-50/20 animate-pulse';
    }
    return defaultStyle;
  };

  const handleFinalPaymentSubmit = (e) => {
    e.preventDefault();
    if (isProcessingPayment || isPaymentSuccess) return;

    if (paymentMethod === 'card') {
      const cleanCard = cardNumber.replace(/\s/g, '');
      if (cleanCard.length < 15) {
        showToast('Please enter a valid 16-digit credit card number', 'warning');
        return;
      }
      if (cardExpiry.length < 5) {
        showToast('Please enter card expiry date in MM/YY format (e.g. 12/28)', 'warning');
        return;
      }
      if (cardCvv.length < 3) {
        showToast('Please enter a valid 3 or 4-digit CVV security code', 'warning');
        return;
      }
    }

    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsPaymentSuccess(true);

      setTimeout(() => {
        const estimatedPrice = calculateEstimatedPrice();
        const pickupStr = `${formData.senderAddress1}, ${formData.senderAddress2 ? formData.senderAddress2 + ', ' : ''}${formData.senderCity}, ${formData.senderState} ${formData.senderPostalCode}, ${formData.senderCountry}`;
        const deliveryStr = `${formData.receiverAddress1}, ${formData.receiverAddress2 ? formData.receiverAddress2 + ', ' : ''}${formData.receiverCity}, ${formData.receiverState} ${formData.receiverPostalCode}, ${formData.receiverCountry}`;

        const createdShipment = addShipment({
          senderName: formData.senderName,
          senderPhone: `${formData.senderCountryCode} ${formData.senderPhone}`,
          pickupAddress: pickupStr,
          pickupCity: `${formData.senderCity} (${formData.senderCountry})`,
          receiverName: formData.receiverName,
          receiverPhone: `${formData.receiverCountryCode} ${formData.receiverPhone}`,
          deliveryAddress: deliveryStr,
          deliveryCity: `${formData.receiverCity} (${formData.receiverCountry})`,
          weight: formData.weight,
          cargoType: formData.cargoType,
          serviceLevel: formData.serviceLevel,
          estimatedPrice,
          paymentMethod: paymentMethod === 'card' ? 'Credit Card' : 'PayNow QR'
        });

        const methodText = paymentMethod === 'card' ? 'Credit Card' : 'PayNow SG QR';
        showToast(`Payment confirmed via ${methodText}! Shipment dispatched successfully.`);
        setSelectedInvoiceShipment(createdShipment);
        setActiveTab('customer-dashboard');
      }, 1200);

    }, 1500);
  };

  const steps = [
    { number: 1, title: 'Sender & Recipient', desc: 'From & To Addresses' },
    { number: 2, title: 'Cargo & Package Specs', desc: 'Weight, Mode & Protection' },
    { number: 3, title: 'Customs Invoice & Parties', desc: 'Invoice & Declarations' },
    { number: 4, title: 'Select Packaging', desc: 'Dimensions & Box Type' },
    { number: 5, title: 'How Will You Pay', desc: 'Payment & Customs Terms' },
    { number: 6, title: 'Dispatch Date & Rates', desc: 'Schedule & Service Level' },
    { number: 7, title: 'Review & Pay', desc: 'Summary & Confirmation' }
  ];

  if (!currentUser) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-[#F5F6F8]">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center mx-auto text-[#FF6B00]">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-outfit text-[#10182D]">Account Login Required</h2>
            <p className="text-sm text-slate-500">
              Please sign in with your customer account or register to schedule and book road freight consignments.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                if (setAuthRedirectTab) setAuthRedirectTab('book');
                setIsAuthModalOpen(true);
              }}
              className="flex-1 btn-primary text-sm font-bold shadow-md cursor-pointer"
            >
              Log In to Book
            </button>
            <button
              onClick={() => setActiveTab('home')}
              className="px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 animate-fade-in">
      {!shipmentScope ? (
        /* ========================================================================= */
        /* SERVICE SELECTION LANDING SCREEN (Shown BEFORE choosing Domestic/Intl)    */
        /* Displays Pictures and End-to-End Shipment Process Flow                    */
        /* ========================================================================= */
        <div className="space-y-10 animate-fade-in text-left">
          
          {/* 1. Header Banner */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold border border-orange-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Josan Freight Booking Portal</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Select Your Shipment Service
              </h1>
              <p className="text-slate-600 font-medium text-xs sm:text-sm leading-relaxed">
                Choose your transport route below to calculate instant rates, configure compliance documentation, and dispatch your cargo with real-time telematics tracking.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                ✕ Return Home
              </button>
            </div>
          </div>

          {/* 2. End-to-End Shipment Process Flow */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-orange-600">
                  Step-by-Step Workflow
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  How Your Shipment Moves (End-to-End Flow)
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                4-Stage Automated Logistics Pipeline
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
              {/* Flow Step 1 */}
              <div className="bg-slate-50/80 hover:bg-orange-50/40 p-5 rounded-2xl border border-slate-200/80 hover:border-orange-300 transition-all space-y-3 relative group">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-orange-500/20">
                  1
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">1. Select Service Scope</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Choose between Domestic intra-country transport or International cross-border freight forwarding.
                  </p>
                </div>
                <div className="text-[10px] font-bold text-orange-600 bg-orange-100/70 px-2 py-0.5 rounded-md w-fit">
                  Current Stage
                </div>
              </div>

              {/* Flow Step 2 */}
              <div className="bg-slate-50/80 hover:bg-orange-50/40 p-5 rounded-2xl border border-slate-200/80 hover:border-orange-300 transition-all space-y-3 relative group">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                  2
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">2. Pickup & Recipient</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Enter verified sender and receiver addresses, contact information, and business tax IDs.
                  </p>
                </div>
                <div className="text-[10px] font-bold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-md w-fit">
                  Address Validation
                </div>
              </div>

              {/* Flow Step 3 */}
              <div className="bg-slate-50/80 hover:bg-orange-50/40 p-5 rounded-2xl border border-slate-200/80 hover:border-orange-300 transition-all space-y-3 relative group">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                  3
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">3. Cargo & Customs</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Specify cargo dimensions, weight, packaging type, and automated customs invoice details.
                  </p>
                </div>
                <div className="text-[10px] font-bold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-md w-fit">
                  Compliance Check
                </div>
              </div>

              {/* Flow Step 4 */}
              <div className="bg-slate-50/80 hover:bg-orange-50/40 p-5 rounded-2xl border border-slate-200/80 hover:border-orange-300 transition-all space-y-3 relative group">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                  4
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">4. Waybill & Telematics</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Instant AWB generation, carrier vehicle dispatch, and live satellite GPS milestone tracking.
                  </p>
                </div>
                <div className="text-[10px] font-bold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-md w-fit">
                  Real-Time ePOD
                </div>
              </div>
            </div>
          </div>

          {/* 3. The Two Pictures Cards (Domestic Services vs International Services) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Card 1: Domestic Services with Picture */}
            <div className="bg-white rounded-3xl border-2 border-slate-200 hover:border-orange-500 shadow-card hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
              <div>
                {/* 100% Clean Image Container - NO text on the image */}
                <div className="h-56 sm:h-64 w-full overflow-hidden bg-slate-100">
                  <img 
                    src="/assets/clean_domestic_truck.jpg" 
                    alt="Domestic Freight Transport" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>

                {/* Body Content with Title & Badges Below Image */}
                <div className="p-6 sm:p-7 space-y-4">
                  <div>
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold mb-2">
                      <span>⚡ Local & Nationwide Intra-Country Direct</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Domestic Services</h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    Fast point-to-point intra-country freight and express courier delivery within the same country. Doorstep pickup, dedicated fleet dispatch, and zero international customs paperwork.
                  </p>

                  <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-slate-700">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                      <span className="font-semibold">Same-Day & Next-Day express city courier</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                      <span className="font-semibold">100% Paperless — No customs or export permits</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                      <span className="font-semibold">Dedicated vans, 24ft/40ft trucks & LTL fleets</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                      <span className="font-semibold">Live GPS driver tracking & instant digital ePOD</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Button */}
              <div className="p-6 sm:p-7 pt-0">
                <button
                  type="button"
                  onClick={() => {
                    setShipmentScope('domestic');
                    showToast('🚚 Selected Domestic Services');
                  }}
                  className="w-full py-4 px-6 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm rounded-2xl transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
                >
                  <Truck className="w-5 h-5" />
                  <span>Book Domestic Services</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Card 2: International Services with Picture */}
            <div className="bg-white rounded-3xl border-2 border-slate-200 hover:border-slate-900 shadow-card hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
              <div>
                {/* 100% Clean Image Container - NO text on the image */}
                <div className="h-56 sm:h-64 w-full overflow-hidden bg-slate-100">
                  <img 
                    src="/assets/clean_international_freight.jpg" 
                    alt="International Multimodal Forwarding" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>

                {/* Body Content with Title & Badges Below Image */}
                <div className="p-6 sm:p-7 space-y-4">
                  <div>
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold mb-2">
                      <span>🌍 Cross-Border Forwarding (180+ Global Ports)</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">International Services</h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    Comprehensive cross-border air, ocean, and multimodal logistics across 180+ countries with automated customs clearance, HS code classification, and tax compliance handling.
                  </p>

                  <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-slate-700">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                      <span className="font-semibold">Commercial air cargo, ocean containers & multimodal</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                      <span className="font-semibold">Automated customs invoices & HS code classification</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                      <span className="font-semibold">Global partner logistics hub network in 181 countries</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                      <span className="font-semibold">Marine cargo risk insurance & duty estimation</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Button */}
              <div className="p-6 sm:p-7 pt-0">
                <button
                  type="button"
                  onClick={() => {
                    setShipmentScope('international');
                    showToast('✈️ Selected International Services (Displaying Booking Form)');
                  }}
                  className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-2xl transition-all shadow-lg shadow-slate-900/25 flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
                >
                  <Globe className="w-5 h-5 text-orange-400" />
                  <span>Book International Services</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

          </div>

          {/* 4. User Custom Content Guidance Note */}
          <div className="bg-orange-50/60 border border-orange-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center space-x-3 text-orange-900">
              <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm shrink-0">
                💡
              </span>
              <div>
                <span className="font-bold text-slate-900">Custom Content Ready: </span>
                <span className="text-slate-600">
                  You can provide your own custom descriptions, photos, or step stages anytime and we will update this view to your exact copy!
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setShipmentScope('international');
              }}
              className="font-bold text-orange-600 hover:text-orange-700 underline shrink-0 cursor-pointer"
            >
              Skip to International Form →
            </button>
          </div>

        </div>
      ) : shipmentScope === 'domestic' ? (
        /* ========================================================================= */
        /* DOMESTIC SERVICES CONTENT (Shown when Domestic Services is clicked)       */
        /* ========================================================================= */
        <div className="space-y-8 animate-fade-in text-left">
          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold mb-2 border border-orange-200">
                <Truck className="w-3.5 h-3.5" />
                <span>Roadways & Domestic Logistics</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900">Roadways Freight & Delivery</h1>
              <p className="text-slate-600 font-medium text-xs sm:text-sm mt-1">
                Point-to-point road freight, express couriers & dedicated vehicle fleet dispatch.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  if (resetShipmentScope) resetShipmentScope();
                  if (setShipmentScope) setShipmentScope(null);
                  if (setActiveTab) setActiveTab('book');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  showToast('Returned to Service Scope Selection');
                }}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center space-x-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Change Service</span>
              </button>
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                ✓ Roadways Service Active
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* DOMESTIC CONTENT SLOT (Live Interactive Domestic Booking Form)            */}
          {/* ========================================================================= */}
          <DomesticShipmentPage setActiveTab={setActiveTab} hideHero={true} />
        </div>
      ) : (
        /* ========================================================================= */
        /* INTERNATIONAL SERVICES CONTENT (The given image)                          */
        /* ========================================================================= */
        <>
          {/* Top Banner & Navigation Header */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold border border-orange-200">
              <Package className="w-3.5 h-3.5" />
              <span>International Freight Shipment</span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (resetShipmentScope) resetShipmentScope();
                if (setShipmentScope) setShipmentScope(null);
                if (setActiveTab) setActiveTab('book');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                showToast('Returned to Service Scope Selection');
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3 text-slate-500" />
              <span>Change Service</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShipmentScope('domestic');
                showToast('🚚 Switched to Domestic Services');
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-bold border border-orange-200 transition-colors cursor-pointer"
            >
              <Truck className="w-3 h-3 text-orange-500" />
              <span>Switch to Domestic Services</span>
            </button>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Book Shipment</h1>
          <p className="text-slate-800 font-semibold text-xs sm:text-sm mt-1">Provide origin, destination, and package specifications to generate waybill.</p>
        </div>

        {/* 3-Step Milestone Stepper Header (Routing ➔ Shipment details ➔ Finalizing) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="relative flex items-center justify-between max-w-2xl mx-auto px-4">
            {/* Background connecting track */}
            <div className="absolute top-5 left-10 right-10 h-0.5 bg-slate-200 -z-0" />
            <div 
              className="absolute top-5 left-10 h-0.5 bg-blue-600 transition-all duration-300 -z-0"
              style={{
                width: currentStep === 1 ? '0%' : currentStep === 7 ? '100%' : '50%'
              }}
            />

            {/* Step 1: Routing */}
            <button 
              type="button"
              onClick={() => handleStepPillClick(1)}
              className="relative z-10 flex flex-col items-center cursor-pointer group focus:outline-none"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 ${
                currentStep === 1 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-100 scale-110' 
                  : currentStep > 1 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-white border-2 border-slate-300 text-slate-500'
              }`}>
                {currentStep > 1 ? '✓' : '1'}
              </div>
              <span className={`mt-2 text-xs font-bold transition-colors ${
                currentStep === 1 ? 'text-blue-700 font-extrabold' : 'text-slate-600 group-hover:text-slate-900'
              }`}>
                Routing
              </span>
            </button>

            {/* Step 2: Shipment details */}
            <button 
              type="button"
              onClick={() => {
                if (currentStep === 1) {
                  if (validateStep(1)) {
                    setShowValidationErrors(false);
                    setCurrentStep(2);
                  } else {
                    setShowValidationErrors(true);
                  }
                } else {
                  handleStepPillClick(2);
                }
              }}
              className="relative z-10 flex flex-col items-center cursor-pointer group focus:outline-none"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 ${
                currentStep >= 2 && currentStep <= 6
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-100 scale-110'
                  : currentStep > 6
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white border-2 border-slate-300 text-slate-500'
              }`}>
                {currentStep > 6 ? '✓' : '2'}
              </div>
              <span className={`mt-2 text-xs font-bold transition-colors ${
                currentStep >= 2 && currentStep <= 6 ? 'text-blue-700 font-extrabold' : 'text-slate-600 group-hover:text-slate-900'
              }`}>
                Shipment details
              </span>
            </button>

            {/* Step 3: Finalizing */}
            <button 
              type="button"
              onClick={() => {
                if (currentStep < 7) {
                  let canAdvance = true;
                  for (let s = 1; s < 7; s++) {
                    if (!validateStep(s)) {
                      setShowValidationErrors(true);
                      setCurrentStep(s);
                      canAdvance = false;
                      break;
                    }
                  }
                  if (canAdvance) setCurrentStep(7);
                }
              }}
              className="relative z-10 flex flex-col items-center cursor-pointer group focus:outline-none"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 ${
                currentStep === 7
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-100 scale-110'
                  : 'bg-white border-2 border-slate-300 text-slate-500'
              }`}>
                3
              </div>
              <span className={`mt-2 text-xs font-bold transition-colors ${
                currentStep === 7 ? 'text-blue-700 font-extrabold' : 'text-slate-600 group-hover:text-slate-900'
              }`}>
                Finalizing
              </span>
            </button>
          </div>

          {/* Sub-steps breadcrumbs if inside Shipment details phase (Steps 2-6) */}
          {currentStep >= 2 && currentStep <= 6 && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 overflow-x-auto text-[11px] font-semibold">
              {[
                { s: 2, label: 'Cargo Specs' },
                { s: 3, label: 'Customs & Parties' },
                { s: 4, label: 'Packaging' },
                { s: 5, label: 'Payment Terms' },
                { s: 6, label: 'Dispatch & Rates' }
              ].map((sub) => (
                <button
                  key={sub.s}
                  type="button"
                  onClick={() => handleStepPillClick(sub.s)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    currentStep === sub.s 
                      ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* STEP 1: ROUTING (FROM & TO) */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-fade-in text-left">
          
          {/* Top Utility Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                <span>{lastSavedTime ? `Autosaved at ${lastSavedTime}` : 'Autosaved'}</span>
              </span>
              <span className="text-xs text-slate-500 font-medium hidden md:inline">
                Step 1 of 3: Enter Origin & Destination Routing
              </span>
            </div>

            <div className="flex items-center space-x-2.5">
              <button
                type="button"
                onClick={handleSwapAddresses}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5"
                title="Swap From and To locations"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500" />
                <span>Swap From ⇄ To</span>
              </button>
              <button
                type="button"
                onClick={handleSaveForLater}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <span>💾 Save Draft</span>
              </button>
            </div>
          </div>

          {/* Main Routing Card & Side Drawer Container */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card">
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Left Main Area: Two Columns (From & To) */}
              <div className="flex-1 space-y-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                  
                  {/* FROM COLUMN */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                          <MapPin className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">From</h2>
                          <p className="text-[11px] text-slate-500 font-medium">Shipper / Origin Location</p>
                        </div>
                      </div>
                    </div>

                    {/* Company Name* */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Company Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="Company Name*"
                          value={formData.senderCompany || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, senderCompany: e.target.value, senderName: prev.senderName || e.target.value }))}
                          className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all ${
                            showValidationErrors && !formData.senderCompany ? 'border-rose-400 bg-rose-50/30 ring-1 ring-rose-400' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        />
                      </div>
                      {showValidationErrors && !formData.senderCompany && (
                        <p className="text-[11px] text-rose-500 font-bold mt-1">Company Name is required</p>
                      )}
                    </div>

                    {/* Country* */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Country <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                        <select
                          value={formData.senderCountry || 'India'}
                          onChange={(e) => setFormData(prev => ({ ...prev, senderCountry: e.target.value }))}
                          className={`w-full pl-10 pr-8 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all appearance-none cursor-pointer ${
                            showValidationErrors && !formData.senderCountry ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <option value="" disabled>Select Country*</option>
                          {countryOptions.map(c => (
                            <option key={`sender-country-${c}`} value={c}>{c}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
                      </div>
                    </div>

                    {/* Side by side: Zip-Code* & City* */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Zip-Code <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Zip-Code*"
                          value={formData.senderPostalCode || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, senderPostalCode: e.target.value }))}
                          className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all ${
                            showValidationErrors && !formData.senderPostalCode ? 'border-rose-400 bg-rose-50/30 ring-1 ring-rose-400' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        />
                        {showValidationErrors && !formData.senderPostalCode && (
                          <p className="text-[10px] text-rose-500 font-bold mt-1">Required</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          City <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="City*"
                          value={formData.senderCity || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, senderCity: e.target.value, senderState: prev.senderState || e.target.value }))}
                          className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all ${
                            showValidationErrors && !formData.senderCity ? 'border-rose-400 bg-rose-50/30 ring-1 ring-rose-400' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        />
                        {showValidationErrors && !formData.senderCity && (
                          <p className="text-[10px] text-rose-500 font-bold mt-1">Required</p>
                        )}
                      </div>
                    </div>

                    {/* Street & Number* */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Street & Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Street & Number*"
                        value={formData.senderAddress1 || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, senderAddress1: e.target.value }))}
                        className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all ${
                          showValidationErrors && !formData.senderAddress1 ? 'border-rose-400 bg-rose-50/30 ring-1 ring-rose-400' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      />
                      {showValidationErrors && !formData.senderAddress1 && (
                        <p className="text-[11px] text-rose-500 font-bold mt-1">Street address is required</p>
                      )}
                    </div>

                    {/* Optional Contact Person / Phone Accordion */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setShowFromOptional(!showFromOptional)}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer transition-colors"
                      >
                        <span>{showFromOptional ? '− Hide Contact Details' : '+ Add Contact Person & Phone (Optional)'}</span>
                      </button>
                      {showFromOptional && (
                        <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3 animate-fade-in">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">Contact Person Name</label>
                            <input
                              type="text"
                              placeholder="e.g. John Doe"
                              value={formData.senderName || ''}
                              onChange={(e) => setFormData(prev => ({ ...prev, senderName: e.target.value }))}
                              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">Contact Phone</label>
                              <input
                                type="tel"
                                placeholder="+91 98765 43210"
                                value={formData.senderPhone || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, senderPhone: e.target.value }))}
                                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">Contact Email</label>
                              <input
                                type="email"
                                placeholder="name@company.com"
                                value={formData.senderEmail || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, senderEmail: e.target.value }))}
                                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* TO COLUMN */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                          <MapPin className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">To</h2>
                          <p className="text-[11px] text-slate-500 font-medium">Consignee / Destination Location</p>
                        </div>
                      </div>
                    </div>

                    {/* Company Name* */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Company Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="Company Name*"
                          value={formData.receiverCompany || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, receiverCompany: e.target.value, receiverName: prev.receiverName || e.target.value }))}
                          className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all ${
                            showValidationErrors && !formData.receiverCompany ? 'border-rose-400 bg-rose-50/30 ring-1 ring-rose-400' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        />
                      </div>
                      {showValidationErrors && !formData.receiverCompany && (
                        <p className="text-[11px] text-rose-500 font-bold mt-1">Company Name is required</p>
                      )}
                    </div>

                    {/* Country* */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Country <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                        <select
                          value={formData.receiverCountry || 'Singapore'}
                          onChange={(e) => setFormData(prev => ({ ...prev, receiverCountry: e.target.value }))}
                          className={`w-full pl-10 pr-8 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all appearance-none cursor-pointer ${
                            showValidationErrors && !formData.receiverCountry ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <option value="" disabled>Select Country*</option>
                          {countryOptions.map(c => (
                            <option key={`receiver-country-${c}`} value={c}>{c}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
                      </div>
                    </div>

                    {/* Side by side: Zip-Code* & City* */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Zip-Code <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Zip-Code*"
                          value={formData.receiverPostalCode || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, receiverPostalCode: e.target.value }))}
                          className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all ${
                            showValidationErrors && !formData.receiverPostalCode ? 'border-rose-400 bg-rose-50/30 ring-1 ring-rose-400' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        />
                        {showValidationErrors && !formData.receiverPostalCode && (
                          <p className="text-[10px] text-rose-500 font-bold mt-1">Required</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          City <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="City*"
                          value={formData.receiverCity || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, receiverCity: e.target.value, receiverState: prev.receiverState || e.target.value }))}
                          className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all ${
                            showValidationErrors && !formData.receiverCity ? 'border-rose-400 bg-rose-50/30 ring-1 ring-rose-400' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        />
                        {showValidationErrors && !formData.receiverCity && (
                          <p className="text-[10px] text-rose-500 font-bold mt-1">Required</p>
                        )}
                      </div>
                    </div>

                    {/* Street & Number* */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Street & Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Street & Number*"
                        value={formData.receiverAddress1 || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, receiverAddress1: e.target.value }))}
                        className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all ${
                          showValidationErrors && !formData.receiverAddress1 ? 'border-rose-400 bg-rose-50/30 ring-1 ring-rose-400' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      />
                      {showValidationErrors && !formData.receiverAddress1 && (
                        <p className="text-[11px] text-rose-500 font-bold mt-1">Street address is required</p>
                      )}
                    </div>

                    {/* Optional Contact Person / Phone Accordion */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setShowToOptional(!showToOptional)}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer transition-colors"
                      >
                        <span>{showToOptional ? '− Hide Contact Details' : '+ Add Contact Person & Phone (Optional)'}</span>
                      </button>
                      {showToOptional && (
                        <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3 animate-fade-in">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">Contact Person Name</label>
                            <input
                              type="text"
                              placeholder="e.g. Jane Smith"
                              value={formData.receiverName || ''}
                              onChange={(e) => setFormData(prev => ({ ...prev, receiverName: e.target.value }))}
                              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">Contact Phone</label>
                              <input
                                type="tel"
                                placeholder="+65 9123 4567"
                                value={formData.receiverPhone || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, receiverPhone: e.target.value }))}
                                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">Contact Email</label>
                              <input
                                type="email"
                                placeholder="name@recipient.com"
                                value={formData.receiverEmail || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, receiverEmail: e.target.value }))}
                                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>

                </div>

                {/* Bottom Action Footer with 'Proceed' Button */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500 font-medium">
                    <span className="text-rose-500 font-bold">*</span> Mandatory international routing fields
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep(1)) {
                        setShowValidationErrors(false);
                        setCurrentStep(2);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        showToast('✓ Routing details confirmed! Proceeding to Shipment details.', 'success');
                      } else {
                        setShowValidationErrors(true);
                      }
                    }}
                    className="w-full sm:w-auto px-8 py-3 bg-[#0B3B95] hover:bg-[#082a6e] text-white font-bold text-sm rounded-xl shadow-md shadow-blue-950/20 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                  >
                    <span>Proceed</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

              {/* Right Side Panel / Collapsible Drawer with Truck Icon & Toggle */}
              <div className={`transition-all duration-300 self-stretch flex flex-col justify-between ${
                isDrawerOpen 
                  ? 'w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-slate-200 pt-6 lg:pt-0 lg:pl-6' 
                  : 'w-full lg:w-14 border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-3 items-center'
              }`}>
                
                {/* Top Section with Truck Icon */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <Truck className="w-10 h-10 text-slate-800" strokeWidth={1.8} />
                  </div>

                  {isDrawerOpen && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Route Preview</span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-blue-600" />
                            <span className="font-bold text-slate-800 truncate">
                              {formData.senderCity || 'Origin'}, {formData.senderCountry}
                            </span>
                          </div>
                          <div className="pl-1 border-l-2 border-dashed border-slate-300 ml-1 h-4" />
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-600" />
                            <span className="font-bold text-slate-800 truncate">
                              {formData.receiverCity || 'Destination'}, {formData.receiverCountry}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-[11px] text-slate-600 font-medium">
                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                          <span>Service</span>
                          <span className="font-bold text-slate-800">Air Express Freight</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                          <span>Transit Speed</span>
                          <span className="font-bold text-slate-800">2-4 Business Days</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span>Customs</span>
                          <span className="font-bold text-emerald-600">Automated Filing</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Toggle Button: >> / << */}
                <div className="pt-4 flex justify-end w-full">
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer flex items-center justify-center"
                    title={isDrawerOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                  >
                    {isDrawerOpen ? (
                      <ChevronsRight className="w-4 h-4" />
                    ) : (
                      <ChevronsLeft className="w-4 h-4" />
                    )}
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      )}

{/* STEP 2: SHIPMENT DETAILS & CARGO SPECS */}
      {currentStep === 2 && (
        <div ref={shipmentDetailsRef} id="shipment-details-section" className="space-y-6 animate-fade-in text-left">

          {/* Top Bar with Cancel & Save for Later */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>{lastSavedTime ? `Autosaved at ${lastSavedTime}` : 'Autosaved'}</span>
            </span>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
              >
                <span>✕ Cancel</span>
              </button>
              <button
                type="button"
                onClick={handleSaveForLater}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center space-x-1.5"
              >
                <span>💾 Save for Later</span>
              </button>
            </div>
          </div>

          {/* Confirmed Route Summary Banner with Edit Button */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-base shrink-0">
                📍
              </div>
              <div className="text-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">Confirmed Route</span>
                <p className="font-extrabold text-slate-900 text-sm mt-0.5">
                  {formData.senderCity || 'Origin'}, {formData.senderCountry} → {formData.receiverCity || 'Destination'}, {formData.receiverCountry}
                </p>
                <p className="text-slate-500 font-medium">
                  From: {formData.senderName || 'Sender'} | To: {formData.receiverName || 'Recipient'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setCurrentStep(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0"
            >
              <Pencil className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit Addresses</span>
            </button>
          </div>

          {/* Main Shipment Details Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-8">
            
            {/* Heading */}
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Shipment Details</h2>
              <p className="text-xs font-bold text-slate-500 mt-1">What are you shipping?</p>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Category Selection & Specs */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Category Selection Cards (Documents vs Packages) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Documents Option */}
                  <div
                    onClick={() => setFormData({ ...formData, shipmentCategory: 'documents' })}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 relative ${
                      formData.shipmentCategory === 'documents'
                        ? 'border-slate-800 bg-slate-800 text-white shadow-lg'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 font-extrabold text-sm">
                        <FileText className={`w-5 h-5 ${formData.shipmentCategory === 'documents' ? 'text-orange-400' : 'text-slate-600'}`} />
                        <span>Documents</span>
                      </div>
                      {formData.shipmentCategory === 'documents' && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                      )}
                    </div>
                    <p className={`text-xs leading-relaxed font-semibold ${formData.shipmentCategory === 'documents' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Documents include legal, financial or business paperwork. Items with monetary value are NOT considered a document shipment.
                    </p>
                  </div>

                  {/* Packages Option */}
                  <div
                    onClick={() => setFormData({ ...formData, shipmentCategory: 'packages' })}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 relative ${
                      formData.shipmentCategory === 'packages'
                        ? 'border-slate-800 bg-slate-800 text-white shadow-lg'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 font-extrabold text-sm">
                        <Package className={`w-5 h-5 ${formData.shipmentCategory === 'packages' ? 'text-orange-400' : 'text-slate-600'}`} />
                        <span>Packages</span>
                      </div>
                      {formData.shipmentCategory === 'packages' && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                      )}
                    </div>
                    <p className={`text-xs leading-relaxed font-semibold ${formData.shipmentCategory === 'packages' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Packages are goods, merchandise or commodities for personal or commercial purposes.
                    </p>
                  </div>

                </div>

                {/* Description Input Section */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h3 className="text-base font-extrabold text-slate-900">
                    {formData.shipmentCategory === 'documents'
                      ? 'Describe the documents in your shipment'
                      : 'Describe the contents of your package shipment'}
                  </h3>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                      <span>Select a description</span>
                      <Info className="w-3.5 h-3.5 text-blue-500 cursor-pointer" title="Provide detailed paperwork description for customs compliance" />
                      <span className="text-rose-500 font-bold">*</span>
                    </label>

                    {formData.shipmentCategory === 'documents' ? (
                      <div className="relative max-w-sm sm:max-w-md w-full text-left" ref={docDropdownRef}>
                        {/* Dropdown Trigger Box */}
                        <button
                          type="button"
                          onClick={() => setIsDocDropdownOpen(!isDocDropdownOpen)}
                          className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl font-bold text-xs text-slate-900 focus-orange flex items-center justify-between shadow-xs transition-all text-left cursor-pointer"
                        >
                          <span className={formData.itemDescription ? "text-slate-900 font-extrabold truncate" : "text-slate-400 font-normal truncate"}>
                            {formData.itemDescription || "Such as legal, financial or business paperwork, etc."}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 ml-2 transition-transform duration-200 ${isDocDropdownOpen ? "rotate-180 text-orange-500" : ""}`} />
                        </button>

                        {/* Floating Menu - Strictly Opens Below */}
                        {isDocDropdownOpen && (
                          <div className="absolute top-full left-0 mt-1 z-50 w-full max-h-60 overflow-y-auto bg-white rounded-2xl border border-slate-200 shadow-2xl p-1.5 space-y-0.5 animate-fade-in">
                            {documentDescriptionOptions.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, itemDescription: opt });
                                  setIsDocDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                                  formData.itemDescription === opt
                                    ? "bg-orange-50 text-orange-600 font-extrabold"
                                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                                }`}
                              >
                                <span>{opt}</span>
                                {formData.itemDescription === opt && <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0 ml-2" />}
                              </button>
                            ))}
                          </div>
                        )}

                        {formData.itemDescription === 'Other / Custom Description' && (
                          <div className="relative mt-2 max-w-sm flex items-center">
                            <input
                              type="text"
                              value={formData.customDocumentDescription || ''}
                              onChange={(e) => setFormData({ ...formData, customDocumentDescription: e.target.value })}
                              placeholder="Specify custom document type..."
                              className={`w-full p-3 pr-8 bg-white border-2 rounded-xl font-semibold text-xs text-slate-900 shadow-xs transition-all ${getInputClass(formData.customDocumentDescription, true)}`}
                              required
                            />
                            {formData.customDocumentDescription && formData.customDocumentDescription.trim() && (
                              <span className="text-emerald-600 font-extrabold text-sm absolute right-3 pointer-events-none">✓</span>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="relative max-w-sm sm:max-w-md w-full text-left" ref={pkgDropdownRef}>
                        {/* Dropdown Trigger Box */}
                        <button
                          type="button"
                          onClick={() => setIsPkgDropdownOpen(!isPkgDropdownOpen)}
                          className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl font-bold text-xs text-slate-900 focus-orange flex items-center justify-between shadow-xs transition-all text-left cursor-pointer"
                        >
                          <span className={formData.itemDescription ? "text-slate-900 font-extrabold truncate" : "text-slate-400 font-normal truncate"}>
                            {formData.itemDescription || "Such as electronics, garments, spare parts, commercial samples, etc."}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 ml-2 transition-transform duration-200 ${isPkgDropdownOpen ? "rotate-180 text-orange-500" : ""}`} />
                        </button>

                        {/* Floating Menu - Strictly Opens Below */}
                        {isPkgDropdownOpen && (
                          <div className="absolute top-full left-0 mt-1 z-50 w-full max-h-60 overflow-y-auto bg-white rounded-2xl border border-slate-200 shadow-2xl p-1.5 space-y-0.5 animate-fade-in">
                            {packageDescriptionOptions.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                  let updatedItems = [...(formData.uniqueShipmentItems || [])];
                                  if (updatedItems.length > 0 && opt !== 'Other / Custom Description') {
                                    updatedItems[0] = { ...updatedItems[0], description: opt };
                                  }
                                  setFormData({
                                    ...formData,
                                    itemDescription: opt,
                                    uniqueShipmentItems: updatedItems
                                  });
                                  setIsPkgDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                                  formData.itemDescription === opt
                                    ? "bg-orange-50 text-orange-600 font-extrabold"
                                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                                }`}
                              >
                                <span>{opt}</span>
                                {formData.itemDescription === opt && <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0 ml-2" />}
                              </button>
                            ))}
                          </div>
                        )}

                        {formData.itemDescription === 'Other / Custom Description' && (
                          <div className="relative mt-2 max-w-sm flex items-center">
                            <input
                              type="text"
                              value={formData.customPackageDescription || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                let updatedItems = [...(formData.uniqueShipmentItems || [])];
                                if (updatedItems.length > 0) {
                                  updatedItems[0] = { ...updatedItems[0], description: val };
                                }
                                setFormData({ ...formData, customPackageDescription: val, uniqueShipmentItems: updatedItems });
                              }}
                              placeholder="Specify custom package contents..."
                              className={`w-full p-3 pr-8 bg-white border-2 rounded-xl font-semibold text-xs text-slate-900 shadow-xs transition-all ${getInputClass(formData.customPackageDescription, true)}`}
                              required
                            />
                            {formData.customPackageDescription && formData.customPackageDescription.trim() && (
                              <span className="text-emerald-600 font-extrabold text-sm absolute right-3 pointer-events-none">✓</span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* When Packages Category is Selected: Show Customs Callout, Shipment Type, and Purpose Dropdown */}
                {formData.shipmentCategory === 'packages' && (
                  <div className="space-y-6 pt-4 border-t border-slate-100 animate-fade-in">
                    
                    {/* Blue Callout Banner: Customs Duty & Taxes */}
                    <div className="flex items-stretch border border-blue-500 rounded-xl overflow-hidden bg-blue-50/50">
                      <div className="bg-blue-600 px-3.5 flex items-center justify-center text-white shrink-0">
                        <Info className="w-4 h-4" />
                      </div>
                      <div className="p-3 text-xs font-extrabold text-slate-800 flex items-center">
                        Shipment is subject to customs duty and taxes.
                      </div>
                    </div>

                    {/* What is your shipment type? */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-extrabold text-slate-900">What is your shipment type?</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Gift/Sample Shipment Tile */}
                        <div
                          onClick={() => setFormData({
                            ...formData,
                            packageShipmentType: 'gift_sample',
                            shipmentPurpose: 'Gift'
                          })}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2 relative ${
                            (formData.packageShipmentType || 'gift_sample') === 'gift_sample'
                              ? 'border-slate-800 bg-slate-800 text-white shadow-md'
                              : 'border-slate-200 bg-white hover:border-slate-300 text-slate-900'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-xs">Gift/Sample Shipment</span>
                            {(formData.packageShipmentType || 'gift_sample') === 'gift_sample' && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            )}
                          </div>
                          <p className={`text-[11px] leading-snug font-semibold ${
                            (formData.packageShipmentType || 'gift_sample') === 'gift_sample' ? 'text-slate-300' : 'text-slate-500'
                          }`}>
                            Usually shipments with a total value less than 1,000 SGD
                          </p>
                        </div>

                        {/* Cargo Shipment Tile */}
                        <div
                          onClick={() => setFormData({
                            ...formData,
                            packageShipmentType: 'cargo',
                            shipmentPurpose: 'Air Freight Cargo',
                            cargoType: 'Air Freight',
                            serviceLevel: 'Express Air Freight'
                          })}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2 relative ${
                            formData.packageShipmentType === 'cargo'
                              ? 'border-slate-800 bg-slate-800 text-white shadow-md'
                              : 'border-slate-200 bg-white hover:border-slate-300 text-slate-900'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-xs">Cargo Shipment</span>
                            {formData.packageShipmentType === 'cargo' && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            )}
                          </div>
                          <p className={`text-[11px] leading-snug font-semibold ${
                            formData.packageShipmentType === 'cargo' ? 'text-slate-300' : 'text-slate-500'
                          }`}>
                            High value shipments and usually shipments with a total value more than 1,000 SGD
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* What is the purpose of your shipment? */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center space-x-1">
                          <span>
                            {formData.packageShipmentType === 'cargo'
                              ? 'What is the purpose & transport type of your cargo shipment?'
                              : 'What is the purpose of your shipment?'}
                          </span>
                          <Info className="w-3.5 h-3.5 text-blue-500 cursor-pointer" title="Required for customs declaration and transport routing" />
                          <span className="text-rose-500 font-bold">*</span>
                        </label>

                        {/* Top-Right Header Actions matching screenshot */}
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => setActiveTab('home')}
                            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-md text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 shadow-xs"
                          >
                            <span>✕ Cancel</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveForLater}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center space-x-1"
                          >
                            <span>💾 Save for Later</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="relative w-64 max-w-xs text-left" ref={purposeDropdownRef}>
                          <button
                            type="button"
                            onClick={() => setIsPurposeDropdownOpen(!isPurposeDropdownOpen)}
                            className="w-full p-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg font-bold text-xs text-slate-900 focus-orange flex items-center justify-between shadow-xs transition-all cursor-pointer"
                          >
                            <span className={formData.shipmentPurpose ? "text-slate-900 font-extrabold truncate" : "text-slate-400 font-normal truncate"}>
                              {formData.shipmentPurpose || "Select One"}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 ml-2 transition-transform duration-200 ${isPurposeDropdownOpen ? "rotate-180 text-orange-500" : ""}`} />
                          </button>

                          {/* Floating Menu - Strictly Opens Below */}
                          {isPurposeDropdownOpen && (
                            <div className="absolute top-full left-0 mt-1 z-50 w-full max-h-60 overflow-y-auto bg-white rounded-xl border border-slate-200 shadow-2xl p-1 space-y-0.5 animate-fade-in">
                              {(formData.packageShipmentType === 'cargo' ? [
                                'Air Freight Cargo',
                                'Ocean Freight Cargo',
                                'Land Freight / Trucking Cargo'
                              ] : [
                                'Personal, Not for Resale',
                                'Gift',
                                'Sample'
                              ]).map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => {
                                    let updatedFormData = { ...formData, shipmentPurpose: opt };
                                    if (opt.includes('Air')) {
                                      updatedFormData.cargoType = 'Air Freight';
                                      updatedFormData.serviceLevel = 'Express Air Freight';
                                    } else if (opt.includes('Ocean')) {
                                      updatedFormData.cargoType = 'Ocean Freight';
                                      updatedFormData.serviceLevel = 'Ocean Container Cargo';
                                    } else if (opt.includes('Land')) {
                                      updatedFormData.cargoType = 'Land Freight / Trucking';
                                      updatedFormData.serviceLevel = 'Land Freight Trucking';
                                    }
                                    setFormData(updatedFormData);
                                    setIsPurposeDropdownOpen(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                                    formData.shipmentPurpose === opt
                                      ? "bg-orange-50 text-orange-600 font-extrabold"
                                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                                  }`}
                                >
                                  <span>{opt}</span>
                                  {formData.shipmentPurpose === opt && <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0 ml-2" />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Green Checkmark beside Purpose Dropdown when selected */}
                        {formData.shipmentPurpose && (
                          <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dedicated Cargo Transport Type Selector when Cargo Shipment is selected */}
                    {formData.packageShipmentType === 'cargo' && (
                      <div className="space-y-2 pt-2 animate-fade-in">
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                          <span>Select Cargo Transport Mode</span>
                          <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg">
                          {[
                            { id: 'Air Freight', label: '✈ Air Cargo', mode: 'Express Air Freight' },
                            { id: 'Ocean Freight', label: '🚢 Ocean Cargo', mode: 'Ocean Container Cargo' },
                            { id: 'Land Freight / Trucking', label: '🚛 Land Cargo', mode: 'Land Freight Trucking' }
                          ].map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setFormData({
                                ...formData,
                                cargoType: item.id,
                                serviceLevel: item.mode
                              })}
                              className={`p-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer flex items-center justify-between ${
                                formData.cargoType === item.id
                                  ? 'border-orange-500 bg-orange-50 text-orange-700 ring-2 ring-orange-400 shadow-xs'
                                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span>{item.label}</span>
                              {formData.cargoType === item.id && <CheckCircle2 className="w-4 h-4 text-orange-500" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tell Us What You're Shipping & Itemized Details Section */}
                    <div className="space-y-6 pt-4 border-t border-slate-100 animate-fade-in">
                      
                      {/* Tell Us What You're Shipping */}
                      <div className="space-y-2">
                        <div>
                          <h3 className="text-base font-extrabold text-slate-900">Tell Us What You're Shipping</h3>
                          <p className="text-xs font-semibold text-slate-500 mt-0.5">
                            Select how you would like to provide your item details
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          {/* + Describe Items Button matching screenshot */}
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, itemDetailMethod: 'describe' })}
                            className={`px-4 py-2.5 rounded-lg font-extrabold text-xs transition-all cursor-pointer flex items-center space-x-3 border ${
                              (formData.itemDetailMethod || 'describe') === 'describe'
                                ? 'bg-slate-700 border-slate-700 text-white shadow-sm'
                                : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
                            }`}
                          >
                            <span className="flex items-center space-x-1.5">
                              <Plus className="w-4 h-4" />
                              <span>Describe Items</span>
                            </span>
                            {(formData.itemDetailMethod || 'describe') === 'describe' && (
                              <span className="w-5 h-5 rounded bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                                ✓
                              </span>
                            )}
                          </button>

                          {/* Upload Item Details Button matching screenshot */}
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, itemDetailMethod: 'upload' })}
                            className={`px-4 py-2.5 rounded-lg font-extrabold text-xs transition-all cursor-pointer flex items-center space-x-3 border ${
                              formData.itemDetailMethod === 'upload'
                                ? 'bg-slate-700 border-slate-700 text-white shadow-sm'
                                : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
                            }`}
                          >
                            <span className="flex items-center space-x-1.5">
                              <Upload className="w-4 h-4" />
                              <span>Upload Item Details</span>
                            </span>
                            {formData.itemDetailMethod === 'upload' && (
                              <span className="w-5 h-5 rounded bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                                ✓
                              </span>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* If Upload Method Selected */}
                      {formData.itemDetailMethod === 'upload' ? (
                        <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-300 text-center space-y-3">
                          <Upload className="w-8 h-8 text-orange-500 mx-auto" />
                          <h4 className="font-extrabold text-slate-900 text-sm">Upload Packing List or Itemized Invoice</h4>
                          <p className="text-xs text-slate-500 max-w-md mx-auto">
                            Drag & drop your CSV or Excel file here, or browse files from your device to automatically populate item descriptions.
                          </p>
                          <button
                            type="button"
                            onClick={() => showToast('File upload feature ready. Selected packing list uploaded.', 'info')}
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer"
                          >
                            Browse File
                          </button>
                        </div>
                      ) : (
                        /* If Describe Items Method Selected */
                        <div className="space-y-6">
                          
                          {/* Tax Payment option for this shipment */}
                          <div className="space-y-1.5 max-w-md">
                            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                              <span>Tax Payment option for this shipment</span>
                              <Info className="w-3.5 h-3.5 text-blue-500 cursor-pointer" title="Select appropriate tax and duty payment agreement" />
                            </label>

                            <div className="flex items-center space-x-1.5">
                              <div className="relative w-72 max-w-xs text-left" ref={taxDropdownRef}>
                                <button
                                  type="button"
                                  onClick={() => setIsTaxDropdownOpen(!isTaxDropdownOpen)}
                                  className="w-full p-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg font-bold text-xs text-slate-900 focus-orange flex items-center justify-between shadow-xs transition-all cursor-pointer"
                                >
                                  <span className={formData.taxPaymentOption ? "text-slate-900 font-extrabold truncate" : "text-slate-500 font-normal truncate"}>
                                    {formData.taxPaymentOption || "Select One"}
                                  </span>
                                  <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 ml-2 transition-transform duration-200 ${isTaxDropdownOpen ? "rotate-180 text-orange-500" : ""}`} />
                                </button>

                                {/* Dropdown Menu - Opens Strictly Below matching Image 2 */}
                                {isTaxDropdownOpen && (
                                  <div className="absolute top-full left-0 mt-1 z-50 w-full max-h-56 overflow-y-auto bg-white rounded-xl border border-slate-200 shadow-2xl p-1 space-y-0.5 animate-fade-in">
                                    {[
                                      'Select One',
                                      'N/A',
                                      'Against Bond or Undertaking',
                                      'IGST Payment'
                                    ].map((opt) => (
                                      <button
                                        key={opt}
                                        type="button"
                                        onClick={() => {
                                          setFormData({ ...formData, taxPaymentOption: opt === 'Select One' ? '' : opt });
                                          setIsTaxDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-md text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                                          (formData.taxPaymentOption || 'Select One') === opt || (!formData.taxPaymentOption && opt === 'Select One')
                                            ? "bg-blue-600 text-white font-extrabold"
                                            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                                        }`}
                                      >
                                        <span>{opt}</span>
                                        {((formData.taxPaymentOption || 'Select One') === opt || (!formData.taxPaymentOption && opt === 'Select One')) && (
                                          <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0 ml-2" />
                                        )}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <span className="text-rose-500 font-bold text-sm ml-0.5">*</span>
                            </div>
                          </div>

                          {/* Describe each unique item in your shipment separately */}
                          <div className="space-y-4 pt-2 border-t border-slate-100">
                            <div>
                              <h3 className="text-base font-extrabold text-slate-900">Describe each unique item in your shipment separately</h3>
                              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                                Avoid shipment delays! Accuracy matters to customs authorities. Add each unique item <span className="font-extrabold text-slate-900">One At a Time</span>. Provide details in <span className="font-extrabold text-slate-900">English only</span>.
                              </p>
                            </div>

                            {/* Checkbox: I would like to see estimated duties and taxes */}
                            <div className="space-y-1 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id="estimatedDutiesCheck"
                                  checked={formData.showEstimatedDuties || false}
                                  onChange={(e) => setFormData({ ...formData, showEstimatedDuties: e.target.checked })}
                                  className="w-4 h-4 text-orange-500 rounded focus-orange cursor-pointer"
                                />
                                <label htmlFor="estimatedDutiesCheck" className="font-extrabold text-slate-900 text-xs cursor-pointer flex items-center space-x-1">
                                  <span>I would like to see estimated duties and taxes</span>
                                  <Info className="w-3.5 h-3.5 text-blue-500 cursor-pointer" />
                                </label>
                              </div>
                              <p className="text-[11px] text-slate-500 pl-6 font-medium">
                                You must provide a 6-12 digit item code for each unique item in your shipment.
                              </p>
                            </div>

                             {/* Unique Item Descriptions List */}
                             <div className="space-y-4">
                               {uniqueItemsList.map((item, idx) => (
                                 <div key={item.id || idx} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4 text-xs">
                                   
                                   {/* Header: X. Unique Item Description + Quick Guide Link */}
                                   <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                     <div className="flex items-center space-x-2">
                                       <h4 className="font-extrabold text-slate-900 text-sm">
                                         {idx + 1}. Unique Item Description
                                       </h4>
                                       {uniqueItemsList.length > 1 && (
                                         <button
                                           type="button"
                                           onClick={() => handleRemoveUniqueItem(idx)}
                                           className="text-rose-500 hover:text-rose-700 p-1 rounded-md transition-colors cursor-pointer"
                                           title="Remove this item"
                                         >
                                           <Trash2 className="w-3.5 h-3.5" />
                                         </button>
                                       )}
                                     </div>
                                     <button
                                       type="button"
                                       onClick={() => setIsQuickGuideModalOpen(true)}
                                       className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                     >
                                       Quick Guide for Describing Items
                                     </button>
                                   </div>

                                   {/* Row 1: What is the item? */}
                                   <div className="space-y-1.5">
                                     <label className="block font-bold text-slate-700">What is the item?</label>
                                     <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                       <button
                                         type="button"
                                         onClick={() => {
                                           setActiveItemIndexForModal(idx);
                                           setIsCreateDescModalOpen(true);
                                         }}
                                         className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-lg transition-all shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer shrink-0 border border-orange-600"
                                       >
                                         <span>Create Description</span>
                                         <Pencil className="w-3.5 h-3.5 text-white" />
                                       </button>
                                       <span className="text-slate-400 font-extrabold text-xs text-center">OR</span>
                                       <div className="relative flex-1 flex items-center">
                                         <input
                                           type="text"
                                           maxLength={170}
                                           value={item.description || ''}
                                           onChange={(e) => handleUniqueItemChange(idx, 'description', e.target.value)}
                                           placeholder="Enter your item description (170 Character Maximum)"
                                           className={`w-full p-2.5 bg-white border-2 rounded-lg font-medium text-xs text-slate-900 shadow-xs pr-6 transition-all ${getInputClass(item.description, true)}`}
                                           required
                                         />
                                         {item.description && item.description.trim() ? (
                                           <span className="text-emerald-600 font-extrabold text-sm absolute right-2.5 pointer-events-none">✓</span>
                                         ) : (
                                           <span className="text-rose-500 font-bold text-xs absolute right-2 top-3 pointer-events-none">*</span>
                                         )}
                                       </div>
                                     </div>
                                   </div>

                                   {/* Row 2: Import Commodity Code (i) */}
                                   <div className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-200 space-y-1.5">
                                     <label className="block font-bold text-slate-700 flex items-center space-x-1">
                                       <span>Import Commodity Code</span>
                                       <Info
                                         className="w-3.5 h-3.5 text-blue-500 cursor-pointer"
                                         title="6-12 digit HS Harmonized Tariff system code"
                                       />
                                     </label>
                                     <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                       <button
                                         type="button"
                                         onClick={() => {
                                           setActiveItemIndexForModal(idx);
                                           setIsLookupCodeModalOpen(true);
                                         }}
                                         className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-lg transition-all shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer shrink-0 border border-orange-600"
                                       >
                                         <span>Lookup Code</span>
                                         <Search className="w-3.5 h-3.5 text-white" />
                                       </button>
                                       <span className="text-slate-400 font-extrabold text-xs text-center">OR</span>
                                       <div className="flex items-center space-x-2 flex-1">
                                         <div className="relative flex items-center">
                                           <input
                                             type="text"
                                             value={item.commodityCode || ''}
                                             onChange={(e) => handleUniqueItemChange(idx, 'commodityCode', e.target.value.replace(/[^0-9]/g, ''))}
                                             className={`w-36 p-2 bg-white border-2 rounded-lg font-mono font-bold text-xs text-slate-900 transition-all ${getInputClass(item.commodityCode, false)}`}
                                           />
                                           {item.commodityCode && item.commodityCode.trim() && (
                                             <span className="text-emerald-600 font-extrabold text-xs absolute right-1.5 pointer-events-none">✓</span>
                                           )}
                                         </div>
                                         <button
                                           type="button"
                                           onClick={() => {
                                             if (item.commodityCode) {
                                               showToast(`Commodity Code ${item.commodityCode} verified with customs registry!`, 'info');
                                             } else {
                                               showToast('Please enter a 6-12 digit commodity code to check.', 'warning');
                                             }
                                           }}
                                           className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center space-x-1 cursor-pointer whitespace-nowrap"
                                         >
                                           <span>Check Code</span>
                                           <FileText className="w-3.5 h-3.5 text-slate-400" />
                                         </button>
                                       </div>
                                     </div>
                                   </div>

                                   {/* Row 3: Quantity, Units, Value (Per Item), Weight (Per Item) */}
                                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                                     
                                     {/* Quantity */}
                                     <div>
                                       <label className="block font-bold text-slate-700 mb-1">Quantity</label>
                                       <div className="relative flex items-center">
                                         <input
                                           type="number"
                                           min="1"
                                           value={item.quantity || 1}
                                           onChange={(e) => handleUniqueItemChange(idx, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                                           className={`w-full p-2 bg-white border-2 rounded-lg font-bold font-mono text-xs text-slate-900 pr-7 transition-all ${getInputClass(item.quantity, true)}`}
                                         />
                                         <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-2" />
                                       </div>
                                     </div>

                                     {/* Units */}
                                     <div>
                                       <label className="block font-bold text-slate-700 mb-1">Units (How the item is packaged)</label>
                                       <div className="relative flex items-center">
                                         <select
                                           value={item.units || 'Pieces'}
                                           onChange={(e) => handleUniqueItemChange(idx, 'units', e.target.value)}
                                           className={`w-full p-2 bg-white border-2 rounded-lg font-bold text-xs text-slate-900 pr-7 cursor-pointer transition-all ${getInputClass(item.units, true)}`}
                                         >
                                           <option value="Pieces">Pieces</option>
                                           <option value="Boxes">Boxes</option>
                                           <option value="Cartons">Cartons</option>
                                           <option value="Packages">Packages</option>
                                           <option value="Pairs">Pairs</option>
                                           <option value="Sets">Sets</option>
                                           <option value="Kilograms">Kilograms</option>
                                           <option value="Meters">Meters</option>
                                           <option value="Units">Units</option>
                                         </select>
                                         <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-7 pointer-events-none" />
                                       </div>
                                     </div>

                                     {/* Value (Per Item) */}
                                     <div>
                                       <label className="block font-bold text-slate-700 mb-1">Value (Per Item) *</label>
                                       <div className="flex items-center space-x-1">
                                         <div className="relative flex-1 flex items-center">
                                           <input
                                             type="number"
                                             min="0"
                                             step="0.01"
                                             value={item.valuePerItem || ''}
                                             onChange={(e) => handleUniqueItemChange(idx, 'valuePerItem', e.target.value)}
                                             className={`w-full p-2 bg-white border-2 rounded-lg font-mono font-bold text-xs text-slate-900 pr-5 transition-all ${getInputClass(item.valuePerItem, true)}`}
                                             required
                                           />
                                           {item.valuePerItem && item.valuePerItem.toString().trim() ? (
                                             <span className="text-emerald-600 font-extrabold text-xs absolute right-1.5 pointer-events-none">✓</span>
                                           ) : (
                                             <span className="text-rose-500 font-bold text-xs absolute right-1.5 top-2 pointer-events-none">*</span>
                                           )}
                                         </div>
                                         <span className="font-extrabold text-xs text-slate-700 underline decoration-slate-400">SGD</span>
                                       </div>
                                     </div>

                                     {/* Weight (Per Item) */}
                                     <div>
                                       <label className="block font-bold text-slate-700 mb-1 flex items-center space-x-1">
                                         <span>Weight (Per Item)</span>
                                         <Info className="w-3 h-3 text-blue-500 cursor-pointer" title="Weight of one item unit" />
                                       </label>
                                       <div className="flex items-center space-x-1">
                                         <div className="relative flex-1 flex items-center">
                                           <input
                                             type="number"
                                             min="0.01"
                                             step="0.01"
                                             value={item.weightPerItem || ''}
                                             onChange={(e) => handleUniqueItemChange(idx, 'weightPerItem', e.target.value)}
                                             className={`w-full p-2 bg-white border-2 rounded-lg font-mono font-bold text-xs text-slate-900 pr-5 transition-all ${getInputClass(item.weightPerItem, true)}`}
                                             required
                                           />
                                           {item.weightPerItem && item.weightPerItem.toString().trim() ? (
                                             <span className="text-emerald-600 font-extrabold text-xs absolute right-1.5 pointer-events-none">✓</span>
                                           ) : (
                                             <span className="text-rose-500 font-bold text-xs absolute right-1.5 top-2 pointer-events-none">*</span>
                                           )}
                                         </div>
                                         <span className="font-extrabold text-xs text-slate-700">kg</span>
                                       </div>
                                     </div>

                                   </div>

                                   {/* Row 4: Where was the item made? */}
                                   <div className="space-y-1 pt-1">
                                     <label className="block font-bold text-slate-700 flex items-center space-x-1">
                                       <span>Where was the item made?</span>
                                       <Info className="w-3.5 h-3.5 text-blue-500 cursor-pointer" title="Country of origin" />
                                     </label>
                                     <div className="relative max-w-sm flex items-center">
                                       <input
                                         type="text"
                                         value={item.madeIn || ''}
                                         onChange={(e) => handleUniqueItemChange(idx, 'madeIn', e.target.value)}
                                         placeholder=""
                                         className={`w-full p-2 bg-white border-2 rounded-lg font-semibold text-xs text-slate-900 pr-7 transition-all ${getInputClass(item.madeIn, true)}`}
                                         required
                                       />
                                       {item.madeIn && item.madeIn.trim() ? (
                                         <span className="text-emerald-600 font-extrabold text-xs absolute right-2.5 pointer-events-none">✓</span>
                                       ) : (
                                         <span className="text-rose-500 font-bold text-xs absolute right-2 top-2 pointer-events-none">*</span>
                                       )}
                                     </div>
                                   </div>

                                   {/* Checkboxes */}
                                   <div className="space-y-2 pt-1">
                                     <div className="flex items-center space-x-2">
                                       <input
                                         type="checkbox"
                                         id={`taxPaid_${idx}`}
                                         checked={item.taxPaid || false}
                                         onChange={(e) => handleUniqueItemChange(idx, 'taxPaid', e.target.checked)}
                                         className="w-4 h-4 text-orange-500 rounded focus-orange cursor-pointer"
                                       />
                                       <label htmlFor={`taxPaid_${idx}`} className="font-semibold text-slate-700 cursor-pointer text-xs">
                                         Tax Paid
                                       </label>
                                     </div>

                                     <div className="flex items-center space-x-2">
                                       <input
                                         type="checkbox"
                                         id={`addLineRef_${idx}`}
                                         checked={item.addLineItemReference || false}
                                         onChange={(e) => handleUniqueItemChange(idx, 'addLineItemReference', e.target.checked)}
                                         className="w-4 h-4 text-orange-500 rounded focus-orange cursor-pointer"
                                       />
                                       <label htmlFor={`addLineRef_${idx}`} className="font-semibold text-slate-700 cursor-pointer text-xs">
                                         Add line item reference
                                       </label>
                                     </div>

                                     {item.addLineItemReference && (
                                       <div className="pl-6 pt-1 max-w-sm">
                                         <div className="relative flex items-center">
                                           <input
                                             type="text"
                                             value={item.lineItemReference || ''}
                                             onChange={(e) => handleUniqueItemChange(idx, 'lineItemReference', e.target.value)}
                                             placeholder="Enter line item reference code..."
                                             className={`w-full p-2 bg-slate-50 border-2 rounded-lg font-mono text-xs font-bold text-slate-900 pr-7 transition-all ${getInputClass(item.lineItemReference, false)}`}
                                           />
                                           {item.lineItemReference && item.lineItemReference.trim() && (
                                             <span className="text-emerald-600 font-extrabold text-xs absolute right-2 pointer-events-none">✓</span>
                                           )}
                                         </div>
                                       </div>
                                     )}
                                   </div>

                                 </div>
                               ))}
                             </div>

                             {/* Bottom Action & Totals Summary Bar */}
                             <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-3 border-t border-slate-200 text-xs">
                               <button
                                 type="button"
                                 onClick={() => setIsProductListModalOpen(true)}
                                 className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer"
                               >
                                 <Plus className="w-4 h-4 text-blue-600" />
                                 <span>Add from Product/Item List</span>
                               </button>

                               <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-5">
                                 <button
                                   type="button"
                                   onClick={() => handleCopyUniqueItem(uniqueItemsList.length - 1)}
                                   className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center space-x-1 cursor-pointer"
                                 >
                                   <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
                                   <span>Copy</span>
                                 </button>

                                 <div className="font-bold text-slate-700">
                                   Total Units <span className="font-mono text-slate-900 font-extrabold">{totalUnitsCount}</span>
                                 </div>

                                 <div className="font-bold text-slate-700">
                                   Total Weight: <span className="font-mono text-slate-900 font-extrabold">{totalWeightKg > 0 ? `${totalWeightKg.toFixed(2)} KG` : '--.-- KG'}</span>
                                 </div>

                                 <div className="font-bold text-slate-700">
                                   Total Value: <span className="font-mono text-slate-900 font-extrabold">{totalValueInr > 0 ? `${totalValueInr.toFixed(2)} SGD` : '--.-- SGD'}</span>
                                 </div>

                                 <button
                                   type="button"
                                   onClick={handleAddUniqueItem}
                                   className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded transition-all border border-slate-300 shadow-xs cursor-pointer active:scale-95"
                                 >
                                   Add Another Item
                                 </button>
                               </div>
                             </div>
                          </div>

                        </div>
                      )}

                    </div>

                  </div>
                )}

                {/* Protect Your Shipment Section (Image 1 & Image 2) */}
                <div className="pt-4">
                  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4 text-xs text-left">
                    <h3 className="text-base font-extrabold text-slate-900">Protect Your Shipment</h3>
                    
                    <p className="text-slate-600 font-medium leading-relaxed">
                      You value your shipment and so do we – don't forget to protect your shipment!{' '}
                      <button
                        type="button"
                        onClick={() => showToast('Learn more about our full-coverage cargo insurance policy options.', 'info')}
                        className="text-blue-600 hover:text-blue-800 underline font-semibold cursor-pointer"
                      >
                        Learn about our shipment protection options.
                      </button>
                    </p>

                    <div className="flex items-center space-x-2 pt-1">
                      <input
                        type="checkbox"
                        id="insureShipmentCheck"
                        checked={formData.includeInsurance}
                        onChange={(e) => setFormData({ ...formData, includeInsurance: e.target.checked })}
                        className="w-4 h-4 text-orange-500 rounded focus-orange cursor-pointer"
                      />
                      <label htmlFor="insureShipmentCheck" className="font-bold text-slate-800 cursor-pointer">
                        I would like to insure my shipment
                      </label>
                    </div>

                    {formData.includeInsurance && (
                      <div className="space-y-2 pt-1 animate-fade-in">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                          <label className="font-bold text-slate-700">What is the value you want to insure?</label>
                          <div className="flex items-center space-x-1">
                            <div className="relative">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.insuredValue !== undefined ? formData.insuredValue : (totalValueInr > 0 ? totalValueInr.toFixed(2) : '')}
                                onChange={(e) => setFormData({ ...formData, insuredValue: e.target.value })}
                                placeholder="00.00"
                                className={`w-36 p-1.5 bg-white border-2 rounded font-mono font-bold text-xs text-slate-900 pr-6 transition-all ${getInputClass(formData.insuredValue !== undefined ? formData.insuredValue : totalValueInr, formData.includeInsurance)}`}
                                required
                              />
                              {(formData.insuredValue || totalValueInr > 0) ? (
                                <span className="text-emerald-600 font-extrabold text-xs absolute right-2 top-2 pointer-events-none">✓</span>
                              ) : (
                                <span className="text-rose-500 font-bold text-xs absolute right-2 top-2 pointer-events-none">*</span>
                              )}
                            </div>
                            <span className="font-extrabold text-xs text-slate-700 underline decoration-slate-400">SGD</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium italic">Additional charges may apply</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* India Goods and Services Tax (GST) Details (Image 2) */}
                <div className="pt-4">
                  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4 text-xs text-left">
                    <h3 className="text-base font-extrabold text-slate-900">
                      {formData.senderCountry || 'India'} Goods and Services Tax (GST) Details
                    </h3>

                    <div className="space-y-4 max-w-2xl">
                      
                      {/* Field 1: India Tax ID/Personal ID */}
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-700 flex items-center space-x-1">
                          <span>{formData.senderCountry || 'India'} Tax ID/Personal ID</span>
                          <Info className="w-3.5 h-3.5 text-blue-500 cursor-pointer" title="Tax identification number or personal ID" />
                          <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <select
                          value={formData.gstTaxIdType || 'Select One'}
                          onChange={(e) => setFormData({ ...formData, gstTaxIdType: e.target.value })}
                          className={`w-full sm:w-80 p-2 bg-white border-2 rounded font-bold text-xs text-slate-900 cursor-pointer transition-all ${getInputClass(formData.gstTaxIdType && formData.gstTaxIdType !== 'Select One' ? formData.gstTaxIdType : '', true)}`}
                        >
                          <option value="Select One">Select One</option>
                          <option value="PAN">PAN (Permanent Account Number)</option>
                          <option value="GSTIN">GSTIN (Goods and Services Tax ID)</option>
                          <option value="Aadhaar">Aadhaar / National ID</option>
                          <option value="Passport">Passport Number</option>
                        </select>
                      </div>

                      {/* Field 2: Number */}
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-700">Number *</label>
                        <div className="relative max-w-sm flex items-center">
                          <input
                            type="text"
                            value={formData.gstTaxIdNumber || ''}
                            onChange={(e) => setFormData({ ...formData, gstTaxIdNumber: e.target.value.toUpperCase() })}
                            placeholder=""
                            className={`w-full p-2 bg-white border-2 rounded font-mono font-bold text-xs text-slate-900 uppercase pr-7 transition-all ${getInputClass(formData.gstTaxIdNumber, true)}`}
                            required
                          />
                          {formData.gstTaxIdNumber && formData.gstTaxIdNumber.trim() ? (
                            <span className="text-emerald-600 font-extrabold text-sm absolute right-2 top-2 pointer-events-none">✓</span>
                          ) : (
                            <span className="text-rose-500 font-bold text-xs absolute right-2 top-2 pointer-events-none">*</span>
                          )}
                        </div>
                      </div>

                      {/* Field 3 & 4: GST Invoice Number & Date */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block font-bold text-slate-700 flex items-center space-x-1">
                            <span>GST Invoice Number</span>
                            <Info className="w-3.5 h-3.5 text-blue-500 cursor-pointer" title="Invoice number generated on the GST portal" />
                            <span className="text-rose-500 font-bold">*</span>
                          </label>
                          <div className="relative flex items-center">
                            <input
                              type="text"
                              value={formData.gstInvoiceNumber || ''}
                              onChange={(e) => setFormData({ ...formData, gstInvoiceNumber: e.target.value })}
                              placeholder="Number from the GST website"
                              className={`w-full p-2 bg-white border-2 rounded font-medium text-xs text-slate-900 pr-7 transition-all ${getInputClass(formData.gstInvoiceNumber, true)}`}
                              required
                            />
                            {formData.gstInvoiceNumber && formData.gstInvoiceNumber.trim() ? (
                              <span className="text-emerald-600 font-extrabold text-sm absolute right-2 top-2 pointer-events-none">✓</span>
                            ) : (
                              <span className="text-rose-500 font-bold text-xs absolute right-2 top-2 pointer-events-none">*</span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block font-bold text-slate-700">GST Invoice Date *</label>
                          <div className="flex items-center space-x-1">
                            <div className="relative flex-1">
                              <input
                                type="date"
                                value={formData.gstInvoiceDate || ''}
                                onChange={(e) => setFormData({ ...formData, gstInvoiceDate: e.target.value })}
                                className={`w-full p-2 bg-white border-2 rounded font-mono font-bold text-xs text-slate-900 pr-7 transition-all ${getInputClass(formData.gstInvoiceDate, true)}`}
                                required
                              />
                              {formData.gstInvoiceDate && (
                                <span className="text-emerald-600 font-extrabold text-sm absolute right-2 top-2 pointer-events-none">✓</span>
                              )}
                            </div>
                            <div className="w-8 h-8 rounded bg-orange-500 border border-orange-600 flex items-center justify-center text-white font-bold text-xs shrink-0 cursor-pointer">
                              📅
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Field 5 & 6: Invoice Number & Date */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block font-bold text-slate-700">Invoice Number *</label>
                          <div className="relative flex items-center">
                            <input
                              type="text"
                              value={formData.companyInvoiceNumber || ''}
                              onChange={(e) => setFormData({ ...formData, companyInvoiceNumber: e.target.value })}
                              placeholder="Your company invoice number"
                              className={`w-full p-2 bg-white border-2 rounded font-medium text-xs text-slate-900 pr-7 transition-all ${getInputClass(formData.companyInvoiceNumber, true)}`}
                              required
                            />
                            {formData.companyInvoiceNumber && formData.companyInvoiceNumber.trim() ? (
                              <span className="text-emerald-600 font-extrabold text-sm absolute right-2 top-2 pointer-events-none">✓</span>
                            ) : (
                              <span className="text-rose-500 font-bold text-xs absolute right-2 top-2 pointer-events-none">*</span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block font-bold text-slate-700">Invoice Date *</label>
                          <div className="flex items-center space-x-1">
                            <div className="relative flex-1">
                              <input
                                type="date"
                                value={formData.companyInvoiceDate || ''}
                                onChange={(e) => setFormData({ ...formData, companyInvoiceDate: e.target.value })}
                                className={`w-full p-2 bg-white border-2 rounded font-mono font-bold text-xs text-slate-900 pr-7 transition-all ${getInputClass(formData.companyInvoiceDate, true)}`}
                                required
                              />
                              {formData.companyInvoiceDate && (
                                <span className="text-emerald-600 font-extrabold text-sm absolute right-2 top-2 pointer-events-none">✓</span>
                              )}
                            </div>
                            <div className="w-8 h-8 rounded bg-orange-500 border border-orange-600 flex items-center justify-center text-white font-bold text-xs shrink-0 cursor-pointer">
                              📅
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Additional Package Specs (Weight, Cargo Type, Speed SLA) */}
                {/* Primary Mode Selector: AIR FREIGHT vs ROAD FREIGHT */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-sky-700 font-bold uppercase text-[11px] tracking-wider bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200 inline-flex items-center gap-1">
                        <Plane className="w-3 h-3 text-sky-600" />
                        <span>Mode Hierarchy</span>
                      </span>
                      <h3 className="text-sm font-extrabold text-slate-900 mt-1">
                        Select Shipment Transport Mode
                      </h3>
                    </div>

                    <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ 
                            ...formData, 
                            shipmentMode: 'air', 
                            serviceLevel: 'Express Air Freight',
                            cargoType: formData.cargoType?.includes('Road') ? 'General Cargo' : (formData.cargoType || 'General Cargo')
                          });
                        }}
                        className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                          (formData.shipmentMode || 'air') === 'air'
                            ? 'bg-sky-600 text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Plane className="w-3.5 h-3.5" />
                        <span>✈️ Air Freight (Primary)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ 
                            ...formData, 
                            shipmentMode: 'road', 
                            serviceLevel: 'Road Freight Trucking',
                            cargoType: 'Road Freight / Express Haulage'
                          });
                        }}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          formData.shipmentMode === 'road'
                            ? 'bg-[#FF6B00] text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>🚚 Road Freight</span>
                      </button>
                    </div>
                  </div>

                  {/* Primary Air Freight / Road Specs Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Actual Weight (kg) *
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="number"
                          min="1"
                          max="10000"
                          placeholder="15"
                          value={formData.weight}
                          onChange={(e) => setFormData({ ...formData, weight: Math.max(1, Number(e.target.value)) })}
                          className={`w-full p-3 text-sm bg-white border-2 rounded-xl text-slate-900 font-bold font-mono pr-8 transition-all ${getInputClass(formData.weight, true)}`}
                          required
                        />
                        {formData.weight && formData.weight > 0 && (
                          <span className="text-emerald-600 font-extrabold text-sm absolute right-3 pointer-events-none">✓</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Number of Packages / Pieces *
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="number"
                          min="1"
                          max="1000"
                          placeholder="1"
                          value={formData.pieces}
                          onChange={(e) => setFormData({ ...formData, pieces: Math.max(1, Number(e.target.value)) })}
                          className={`w-full p-3 text-sm bg-white border-2 rounded-xl text-slate-900 font-mono font-bold pr-8 transition-all ${getInputClass(formData.pieces, true)}`}
                          required
                        />
                        {formData.pieces && formData.pieces > 0 && (
                          <span className="text-emerald-600 font-extrabold text-sm absolute right-3 pointer-events-none">✓</span>
                        )}
                      </div>
                    </div>

                    <div className="relative" ref={cargoDropdownRef}>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Cargo Type Classification *
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsCargoDropdownOpen(!isCargoDropdownOpen)}
                        className="w-full p-3 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange font-bold flex items-center justify-between shadow-xs cursor-pointer transition-all text-left"
                      >
                        <span className="truncate">{formData.cargoType || 'General Cargo'}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 ml-2 transition-transform duration-200 ${isCargoDropdownOpen ? "rotate-180 text-orange-500" : ""}`} />
                      </button>

                      {/* Floating Menu - Strictly Opens Below */}
                      {isCargoDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 z-50 w-full max-h-56 overflow-y-auto bg-white rounded-2xl border border-slate-200 shadow-2xl p-1.5 space-y-0.5 animate-fade-in">
                          {cargoTypeOptions.map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, cargoType: type });
                                setIsCargoDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                                formData.cargoType === type
                                  ? "bg-sky-50 text-sky-700 font-extrabold"
                                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                              }`}
                            >
                              <span>{type}</span>
                              {formData.cargoType === type && <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 ml-2" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dimensions & Volumetric Air Calculation */}
                  <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        Package Dimensions (cm) &amp; Volumetric Air Calculation
                      </span>
                      <span className="text-[11px] font-mono font-bold text-sky-700">
                        Volumetric Wt: {Math.max(1, Math.round(((formData.lengthCm || 40) * (formData.widthCm || 30) * (formData.heightCm || 25)) / 6000))} kg
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Length (cm)</label>
                        <input
                          type="number"
                          min="1"
                          placeholder="40"
                          value={formData.lengthCm || 40}
                          onChange={(e) => setFormData({ ...formData, lengthCm: Number(e.target.value) })}
                          className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Width (cm)</label>
                        <input
                          type="number"
                          min="1"
                          placeholder="30"
                          value={formData.widthCm || 30}
                          onChange={(e) => setFormData({ ...formData, widthCm: Number(e.target.value) })}
                          className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Height (cm)</label>
                        <input
                          type="number"
                          min="1"
                          placeholder="25"
                          value={formData.heightCm || 25}
                          onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                          className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pickup & Delivery Specific Locations */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Pickup Location (Origin Airport / Facility / Dock)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Singapore Changi Air Cargo Terminal 1 (SIN)"
                        value={formData.pickupLocation || ''}
                        onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                        className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus-orange"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Delivery Location (Destination Airport / Consignee Bay)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Frankfurt Cargo City South (FRA) / Door Delivery"
                        value={formData.deliveryLocation || ''}
                        onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                        className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus-orange"
                      />
                    </div>
                  </div>

                  {/* Handling Requirements Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Special Handling &amp; Security Requirements
                    </label>
                    <select
                      value={formData.handlingRequirements || 'Standard IATA Cargo Handling'}
                      onChange={(e) => setFormData({ ...formData, handlingRequirements: e.target.value })}
                      className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus-orange cursor-pointer"
                    >
                      {handlingRequirementOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Speed SLA Modes */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Select Preferred Speed SLA Mode</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { title: 'Express Air Freight', desc: '1-2 Days SLA (Fastest Priority)', rate: '$45 Base + $14/kg', mode: 'air' },
                        { title: 'Standard Air Cargo', desc: '2-4 Days SLA (Direct Scheduled)', rate: '$35 Base + $10/kg', mode: 'air' },
                        { title: 'Road Freight Trucking', desc: '3-5 Days SLA (Overland Linehaul)', rate: '$25 Base + $8/kg', mode: 'road' }
                      ].map((level) => (
                        <button
                          key={level.title}
                          type="button"
                          onClick={() => setFormData({ ...formData, serviceLevel: level.title, shipmentMode: level.mode })}
                          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                            formData.serviceLevel === level.title
                              ? 'border-sky-500 bg-sky-50/80 ring-2 ring-sky-400 shadow-sm'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <p className="font-extrabold text-slate-900 text-xs flex items-center justify-between">
                            <span>{level.title}</span>
                            {level.mode === 'air' ? <Plane className="w-3.5 h-3.5 text-sky-600" /> : <Truck className="w-3.5 h-3.5 text-orange-500" />}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{level.desc}</p>
                          <span className="inline-block mt-2 font-mono font-bold text-xs text-sky-700">{level.rate}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Info Cards Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Info Card 1: Is it a document? */}
                <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200 space-y-3 relative shadow-xs">
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
                    <HelpCircle className="w-4 h-4 text-orange-500" />
                    <span>Is it a document?</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Some items you might think are documents are not – check before completing your shipment.
                  </p>
                  <button
                    type="button"
                    onClick={() => showToast('Legal paperwork, certificates, and non-commercial paper items qualify as documents.')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <span>› Help me determine if my item is a document</span>
                  </button>
                </div>

                {/* Info Card 2: Prohibited Items */}
                <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200 space-y-3 relative shadow-xs">
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span>Prohibited Items</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Some items that are prohibited when shipping to {formData.receiverCountry || 'destination'}.
                  </p>
                  <button
                    type="button"
                    onClick={() => showToast(`Hazardous goods and restricted contraband items are prohibited for ${formData.receiverCountry}.`)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer transition-colors"
                  >
                    View Prohibited Items
                  </button>
                </div>

              </div>

            </div>

            {/* Footer Navigation for Step 2 */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center space-x-1"
              >
                <span>← Back to Step 1: Addresses</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (validateStep(2)) {
                    setShowValidationErrors(false);
                    setCurrentStep(3);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    showToast('✓ Cargo details saved! Next: Customs Invoice.', 'success');
                  } else {
                    setShowValidationErrors(true);
                  }
                }}
                className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-sm shadow-sm transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
              >
                <span>Continue to Step 3: Customs Invoice</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* STEP 3: CUSTOMS INVOICE DETAILS & ADDITIONAL PARTIES (Matching User Screenshots 1 & 2) */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-fade-in text-left">
          
          {/* Top Bar with Cancel & Save for Later */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-end gap-4">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
              >
                <span>✕ Cancel</span>
              </button>
              <button
                type="button"
                onClick={handleSaveForLater}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center space-x-1.5"
              >
                <span>💾 Save for Later</span>
              </button>
            </div>
          </div>

          {/* Domestic Customs Exemption Notice Banner */}
          {shipmentScope === 'domestic' && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fade-in">
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-base shrink-0 shadow-md shadow-emerald-600/20">
                  ✓
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-extrabold text-[10px] uppercase tracking-wider">
                      Domestic Transit Verified
                    </span>
                    <h4 className="font-black text-slate-900 text-sm sm:text-base">
                      Customs Paperwork & HS Code Exempt
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                    This order is categorized as <strong>Domestic Freight ({formData.senderCountry})</strong>. Cross-border commercial customs invoices and export declarations are not required. You may proceed directly to Packaging.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleStepPillClick(4)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all shrink-0 cursor-pointer"
              >
                Proceed to Step 4 →
              </button>
            </div>
          )}

          {/* Top Grey Summary Card (From Address | To Address | Packages | Insured Value) */}
          <div className="bg-slate-200/70 rounded-2xl p-6 border border-slate-300 shadow-xs space-y-6 text-xs text-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* FROM (A Pin) */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-400 text-white font-black flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                  A
                </div>
                <div className="space-y-0.5">
                  <span className="font-extrabold text-slate-500 text-[11px] block uppercase tracking-wider">From</span>
                  <p className="font-extrabold text-slate-900 text-sm leading-tight">{formData.senderName || 'Soorya Ba'}</p>
                  {formData.senderCompany && <p className="font-semibold text-slate-700">{formData.senderCompany}</p>}
                  <p>{formData.senderAddress1 || 'No.10'}{formData.senderAddress2 ? `, ${formData.senderAddress2}` : ''}</p>
                  <p className="font-bold text-slate-800">{formData.senderCity || 'CHENNAI'} {formData.senderState || 'Tamil Nadu'} {formData.senderPostalCode || '600053'}</p>
                  <p className="font-semibold text-slate-700">{formData.senderCountry || 'India'}</p>
                </div>
              </div>

              {/* TO (B Pin) with Edit Button */}
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-400 text-white font-black flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                    B
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-slate-500 text-[11px] block uppercase tracking-wider">To</span>
                    <p className="font-extrabold text-slate-900 text-sm leading-tight">{formData.receiverName || 'Anitha'}</p>
                    {formData.receiverCompany && <p className="font-semibold text-slate-700">{formData.receiverCompany}</p>}
                    <p>{formData.receiverAddress1 || '10 Polang park'}{formData.receiverAddress2 ? `, ${formData.receiverAddress2}` : ''}</p>
                    <p className="font-bold text-slate-800">{formData.receiverCity || 'SINGAPORE'} {formData.receiverPostalCode || '238858'}</p>
                    <p className="font-semibold text-slate-700">{formData.receiverCountry || 'Singapore'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs rounded-lg border border-slate-300 shadow-xs cursor-pointer"
                >
                  Edit
                </button>
              </div>

            </div>

            {/* Bottom Row: Packages & Insured Value with Edit Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-slate-300/80 pt-4 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-sm shrink-0">
                  📦
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 text-xs">
                    Packages <span className="font-normal text-slate-700">{uniqueItemsList[0]?.description || formData.customItemDescription || 'Laptop'}</span>
                  </p>
                  <p className="font-semibold text-slate-600 text-[11px] mt-0.5">Items : {totalUnitsCount || 1}</p>
                  <p className="font-bold text-slate-800 text-xs">
                    Total Goods Value {totalValueInr > 0 ? totalValueInr.toFixed(2) : '1,000.00'} SGD
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="font-bold text-slate-800 text-xs">
                  Insured Value {formData.insuredValue ? parseFloat(formData.insuredValue).toFixed(2) : (formData.includeInsurance ? '1.00' : '0.00')} SGD
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs rounded-lg border border-slate-300 shadow-xs cursor-pointer"
                >
                  Edit
                </button>
              </div>
            </div>

          </div>

          {/* Main Container Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-8">
            
            {/* Customs Invoice Choice Buttons (Create Invoice vs Use My Own Invoice matching Image 2) */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                
                {/* Create Invoice Button */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, customsInvoiceOption: 'create' })}
                  className={`py-2.5 px-5 rounded-md font-bold text-xs transition-all cursor-pointer flex items-center justify-between min-w-[210px] ${
                    (formData.customsInvoiceOption || 'create') === 'create'
                      ? 'bg-zinc-700 text-white border border-zinc-700 shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <span className="font-extrabold text-sm">Create Invoice</span>
                  {(formData.customsInvoiceOption || 'create') === 'create' && (
                    <div className="w-5 h-4 bg-emerald-500 rounded flex items-center justify-center text-white ml-3 shrink-0">
                      <span className="text-[10px] font-black leading-none">✓</span>
                    </div>
                  )}
                </button>

                {/* Use My Own Invoice Button */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, customsInvoiceOption: 'own' })}
                  className={`py-2.5 px-5 rounded-md font-bold text-xs transition-all cursor-pointer flex items-center justify-between min-w-[210px] ${
                    formData.customsInvoiceOption === 'own'
                      ? 'bg-zinc-700 text-white border border-zinc-700 shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <span className="font-extrabold text-sm">Use My Own Invoice</span>
                  {formData.customsInvoiceOption === 'own' && (
                    <div className="w-5 h-4 bg-emerald-500 rounded flex items-center justify-center text-white ml-3 shrink-0">
                      <span className="text-[10px] font-black leading-none">✓</span>
                    </div>
                  )}
                </button>

              </div>

              {/* Render Image 2 Content when Create Invoice is selected */}
              {(formData.customsInvoiceOption || 'create') === 'create' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Invoice Details Section (Image 2) */}
                  <div className="space-y-3">
                    <h3 className="text-base font-extrabold text-slate-900">Invoice Details</h3>

                    <div className="border border-slate-300 rounded-lg p-5 bg-white space-y-5">
                      
                      {/* Invoice Number Field */}
                      <div className="space-y-2">
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-xs">Invoice Number</h4>
                          <p className="text-xs text-slate-600">You can provide a number that is helpful for you and customs to refer to.</p>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700">My Invoice Number</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={formData.companyInvoiceNumber || 'INI-001'}
                              onChange={(e) => setFormData({ ...formData, companyInvoiceNumber: e.target.value })}
                              placeholder="INI-001"
                              className={`w-full sm:w-96 p-2 bg-white border-2 rounded text-xs font-mono font-bold text-slate-900 transition-all ${getInputClass(formData.companyInvoiceNumber || 'INI-001', true)}`}
                            />
                            {(formData.companyInvoiceNumber || 'INI-001') && (
                              <span className="text-emerald-600 font-extrabold text-base shrink-0">✓</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Additional Invoice Information (Remarks) */}
                      <div className="space-y-1">
                        <label className="block text-xs font-extrabold text-slate-900">Additional Invoice Information (Remarks)</label>
                        <div className="relative flex items-center">
                          <textarea
                            value={formData.invoiceRemarks || ''}
                            onChange={(e) => setFormData({ ...formData, invoiceRemarks: e.target.value })}
                            rows={3}
                            className={`w-full p-2.5 bg-white border-2 rounded text-xs text-slate-900 resize-y transition-all ${getInputClass(formData.invoiceRemarks, false)}`}
                          />
                          {formData.invoiceRemarks && formData.invoiceRemarks.trim() && (
                            <span className="text-emerald-600 font-extrabold text-sm absolute right-3 top-3 pointer-events-none">✓</span>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              )}

              {/* Render Upload Box when Use My Own Invoice is selected */}
              {formData.customsInvoiceOption === 'own' && (
                <div className="space-y-3 animate-fade-in">
                  <h3 className="text-base font-extrabold text-slate-900">Upload Your Customs Invoice</h3>
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 bg-slate-50 text-center space-y-3">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Upload your commercial customs invoice (PDF, PNG, JPG)</p>
                      <p className="text-[11px] text-slate-500">Maximum file size: 10MB</p>
                    </div>
                    <label className="inline-block px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl cursor-pointer shadow-xs transition-colors">
                      Browse Files
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            showToast(`Selected file: ${e.target.files[0].name}`);
                            setFormData({ ...formData, uploadedInvoiceName: e.target.files[0].name });
                          }
                        }}
                      />
                    </label>
                    {formData.uploadedInvoiceName && (
                      <p className="text-xs font-bold text-emerald-600 mt-2">✓ Attached: {formData.uploadedInvoiceName}</p>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Additional Parties Section (Image 1 & Image 2) */}
            <div className="space-y-3 pt-6 border-t border-slate-200">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Additional Parties</h3>
                <p className="text-xs font-medium text-slate-600 mt-0.5">Are there other parties involved in the shipment?</p>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 font-extrabold text-xs text-slate-800 cursor-pointer">
                  <input
                    type="radio"
                    name="additionalPartiesRadio"
                    checked={formData.hasAdditionalParties === true}
                    onChange={() => setFormData({ ...formData, hasAdditionalParties: true })}
                    className="w-4 h-4 text-orange-500 focus-orange cursor-pointer"
                  />
                  <span>Yes</span>
                </label>

                <label className="flex items-center space-x-2 font-extrabold text-xs text-slate-800 cursor-pointer">
                  <input
                    type="radio"
                    name="additionalPartiesRadio"
                    checked={formData.hasAdditionalParties !== true}
                    onChange={() => setFormData({ ...formData, hasAdditionalParties: false })}
                    className="w-4 h-4 text-orange-500 focus-orange cursor-pointer"
                  />
                  <span>No</span>
                </label>
              </div>

              {formData.hasAdditionalParties && (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 max-w-xl animate-fade-in text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Party Role *</label>
                    <select
                      value={formData.additionalPartyRole || 'Importer of Record'}
                      onChange={(e) => setFormData({ ...formData, additionalPartyRole: e.target.value })}
                      className={`w-full p-2.5 bg-white border-2 rounded-xl font-bold text-xs text-slate-900 cursor-pointer transition-all ${getInputClass(formData.additionalPartyRole, true)}`}
                    >
                      <option value="Importer of Record">Importer of Record</option>
                      <option value="Sold To Party">Sold To Party</option>
                      <option value="Buyer">Buyer / Ultimate Consignee</option>
                      <option value="Tax Payer">Tax Payer / Duty Payer</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Contact Name *</label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={formData.additionalPartyName || ''}
                          onChange={(e) => setFormData({ ...formData, additionalPartyName: e.target.value })}
                          placeholder="First and last name"
                          className={`w-full p-2.5 bg-white border-2 rounded-xl text-xs font-bold text-slate-900 pr-7 transition-all ${getInputClass(formData.additionalPartyName, true)}`}
                        />
                        {formData.additionalPartyName && formData.additionalPartyName.trim() && (
                          <span className="text-emerald-600 font-extrabold text-xs absolute right-2 pointer-events-none">✓</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Company Name</label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={formData.additionalPartyCompany || ''}
                          onChange={(e) => setFormData({ ...formData, additionalPartyCompany: e.target.value })}
                          placeholder="Company name"
                          className={`w-full p-2.5 bg-white border-2 rounded-xl text-xs font-bold text-slate-900 pr-7 transition-all ${getInputClass(formData.additionalPartyCompany, false)}`}
                        />
                        {formData.additionalPartyCompany && formData.additionalPartyCompany.trim() && (
                          <span className="text-emerald-600 font-extrabold text-xs absolute right-2 pointer-events-none">✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Blue Banner: GST Collection Notice (Image 1) */}
            <div className="border border-sky-500 rounded bg-white overflow-hidden flex items-center text-xs text-slate-900 shadow-2xs">
              <div className="bg-[#0074c5] p-3.5 flex items-center justify-center shrink-0 text-white">
                <Info className="w-4 h-4" />
              </div>
              <div className="p-3 font-medium text-slate-800">
                <span>{formData.receiverCountry || 'Singapore'} Goods and Services Tax (GST) Collection of Low-Value Goods by Overseas Vendors </span>
                <button
                  type="button"
                  onClick={() => showToast(`GST guidelines for low-value overseas shipments to ${formData.receiverCountry || 'Singapore'}.`)}
                  className="text-slate-900 underline font-bold hover:text-blue-700 cursor-pointer ml-1 inline-block"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Tax Payment for this Shipment Section (Image 1) */}
            <div className="space-y-2 pt-2">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Tax Payment for this Shipment</h3>
                <p className="text-xs text-slate-600 mt-0.5">Tax numbers you used to pay taxes for this shipment (for local customs authorities)</p>
              </div>

              <div className="space-y-1 pt-1">
                <label className="block text-xs text-slate-700 font-medium">Provide the applicable tax number</label>
                <div className="relative max-w-sm sm:w-64 flex items-center">
                  <input
                    type="text"
                    value={formData.taxPaymentNumber || ''}
                    onChange={(e) => setFormData({ ...formData, taxPaymentNumber: e.target.value })}
                    placeholder="Such as: IOSS, VOEC"
                    className={`w-full p-2 bg-white border-2 rounded text-xs text-slate-900 font-mono pr-7 transition-all ${getInputClass(formData.taxPaymentNumber, false)}`}
                  />
                  {formData.taxPaymentNumber && formData.taxPaymentNumber.trim() && (
                    <span className="text-emerald-600 font-extrabold text-xs absolute right-2 pointer-events-none">✓</span>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Customs Documents Section (Image 1) */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Additional Customs Documents</h3>
                <p className="text-xs text-slate-600 mt-0.5">Identify any additional customs documentation you are including with this shipment.</p>
              </div>

              {/* Added Documents List */}
              {formData.additionalCustomsDocs && formData.additionalCustomsDocs.length > 0 && (
                <div className="space-y-2 max-w-md">
                  {formData.additionalCustomsDocs.map((doc, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 border border-slate-300 rounded flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">📄 {doc.name || `Document #${idx + 1}`}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.additionalCustomsDocs.filter((_, i) => i !== idx);
                          setFormData({ ...formData, additionalCustomsDocs: updated });
                        }}
                        className="text-rose-600 hover:text-rose-800 font-bold ml-2"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Another Yellow Button (Image 1) */}
              <div>
                <button
                  type="button"
                  onClick={() => {
                    const docCount = (formData.additionalCustomsDocs?.length || 0) + 1;
                    const newDoc = { name: `Customs Doc #${docCount}.pdf` };
                    setFormData({
                      ...formData,
                      additionalCustomsDocs: [...(formData.additionalCustomsDocs || []), newDoc]
                    });
                    showToast(`Added Customs Document #${docCount}`);
                  }}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded border border-orange-600 shadow-2xs transition-colors cursor-pointer"
                >
                  Add Another
                </button>
              </div>
            </div>

            {/* Footer Navigation Action Bar (Image 1 - Green Next Button) */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                ← Back: Package Details
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="px-8 py-2.5 bg-[#28a745] hover:bg-emerald-700 text-white rounded-md font-extrabold text-sm shadow-sm transition-all flex items-center space-x-1 cursor-pointer active:scale-95"
              >
                <span>Next</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* STEP 4: SELECT PACKAGING (Matching User Screenshot) */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-fade-in text-left">
          
          {/* Top Bar with Cancel & Save for Later */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-end gap-4">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
              >
                <span>✕ Cancel</span>
              </button>
              <button
                type="button"
                onClick={handleSaveForLater}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center space-x-1.5"
              >
                <span>💾 Save for Later</span>
              </button>
            </div>
          </div>

          {/* Top Grey Summary Card (From | To | Packages | Additional Parties & Tax ID) */}
          <div className="bg-slate-200/70 rounded-2xl p-6 border border-slate-300 shadow-xs space-y-6 text-xs text-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* FROM (A Pin) */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-400 text-white font-black flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                  A
                </div>
                <div className="space-y-0.5">
                  <span className="font-extrabold text-slate-500 text-[11px] block uppercase tracking-wider">From</span>
                  <p className="font-extrabold text-slate-900 text-sm leading-tight">{formData.senderName || 'Soorya Ba'}</p>
                  {formData.senderCompany && <p className="font-semibold text-slate-700">{formData.senderCompany}</p>}
                  <p>{formData.senderAddress1 || 'No.10'}{formData.senderAddress2 ? `, ${formData.senderAddress2}` : ''}</p>
                  <p className="font-bold text-slate-800">{formData.senderCity || 'CHENNAI'} {formData.senderState || 'Tamil Nadu'} {formData.senderPostalCode || '600053'}</p>
                  <p className="font-semibold text-slate-700">{formData.senderCountry || 'India'}</p>
                </div>
              </div>

              {/* TO (B Pin) with Edit Button */}
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-400 text-white font-black flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                    B
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-slate-500 text-[11px] block uppercase tracking-wider">To</span>
                    <p className="font-extrabold text-slate-900 text-sm leading-tight">{formData.receiverName || 'Anitha'}</p>
                    {formData.receiverCompany && <p className="font-semibold text-slate-700">{formData.receiverCompany}</p>}
                    <p>{formData.receiverAddress1 || '10 Polang park'}{formData.receiverAddress2 ? `, ${formData.receiverAddress2}` : ''}</p>
                    <p className="font-bold text-slate-800">{formData.receiverCity || 'SINGAPORE'} {formData.receiverPostalCode || '238858'}</p>
                    <p className="font-semibold text-slate-700">{formData.receiverCountry || 'Singapore'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs rounded-lg border border-slate-300 shadow-xs cursor-pointer"
                >
                  Edit
                </button>
              </div>

            </div>

            {/* Row 2: Packages & Insured Value */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-slate-300/80 pt-4 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-sm shrink-0">
                  📦
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 text-xs">
                    Packages <span className="font-normal text-slate-700">{uniqueItemsList[0]?.description || formData.customItemDescription || 'Laptop'}</span>
                  </p>
                  <p className="font-semibold text-slate-600 text-[11px] mt-0.5">Items : {totalUnitsCount || 1}</p>
                  <p className="font-bold text-slate-800 text-xs">
                    Total Goods Value {totalValueInr > 0 ? totalValueInr.toFixed(2) : '1,000.00'} SGD
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="font-bold text-slate-800 text-xs">
                  Insured Value {formData.insuredValue ? parseFloat(formData.insuredValue).toFixed(2) : (formData.includeInsurance ? '1.00' : '0.00')} SGD
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs rounded-lg border border-slate-300 shadow-xs cursor-pointer"
                >
                  Edit
                </button>
              </div>
            </div>

            {/* Row 3 (Matching Screenshot): Additional Parties & Tax ID */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-slate-300/80 pt-4 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-sm shrink-0 font-bold">
                  👥
                </div>
                <span className="font-extrabold text-slate-800 text-xs">
                  {formData.hasAdditionalParties ? `Party: ${formData.additionalPartyRole || 'Additional Party'}` : 'No Additional Parties'}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <span className="font-extrabold text-slate-800 text-xs">
                  {formData.taxPaymentNumber ? `Tax ID: ${formData.taxPaymentNumber}` : 'No Shipment Tax ID'}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs rounded-lg border border-slate-300 shadow-xs cursor-pointer"
                >
                  Edit
                </button>
              </div>
            </div>

          </div>

          {/* Main Card: Select Packaging */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            
            {/* Title & Help Link */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <h3 className="text-xl font-extrabold text-slate-900">Select Packaging</h3>
              <button
                type="button"
                onClick={() => showToast('Ensure box dimensions (L x W x H in cm) match outer package boundaries for optimal freight rates.')}
                className="text-xs font-bold text-sky-600 hover:text-sky-800 underline cursor-pointer"
              >
                Tips for Weighing and Measuring
              </button>
            </div>

            {/* Packaging Table Form */}
            <div className="border border-slate-300 rounded-lg p-5 bg-white space-y-6 text-xs">
              
              {/* Column Headers */}
              <div className="hidden md:grid grid-cols-12 gap-3 font-extrabold text-slate-700 border-b border-slate-200 pb-2">
                <div className="col-span-4">Packaging *</div>
                <div className="col-span-1">Quantity *</div>
                <div className="col-span-2">Weight * kg</div>
                <div className="col-span-1">Length * cm</div>
                <div className="col-span-1">Width * cm</div>
                <div className="col-span-1">Height * cm</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {/* Package Rows */}
              {(formData.packagingRows || [
                {
                  id: 1,
                  packagingType: 'My Own Package Custom Dimensions',
                  quantity: 1,
                  weightKg: formData.weight || '',
                  lengthCm: formData.lengthCm || '',
                  widthCm: formData.widthCm || '',
                  heightCm: formData.heightCm || ''
                }
              ]).map((pkgRow, idx) => (
                <div key={pkgRow.id || idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center border-b border-slate-100 pb-4 last:border-b-0">
                  
                  {/* Packaging Type Dropdown (Matching Screenshot with Yellow Active Highlight & Preset Menu) */}
                  <div className="col-span-4 relative">
                    <label className="block md:hidden font-bold text-slate-700 mb-1">Packaging *</label>
                    <div className="relative">
                      <select
                        value={pkgRow.packagingType || 'My Own Package Custom Dimensions'}
                        onChange={(e) => {
                          const updated = [...(formData.packagingRows || [{ id: 1, quantity: 1 }])];
                          updated[idx] = { ...updated[idx], packagingType: e.target.value };
                          setFormData({ ...formData, packagingRows: updated });
                        }}
                        className="w-full p-2.5 bg-amber-50/70 border-2 border-rose-300 rounded text-xs font-extrabold text-slate-900 focus-orange cursor-pointer"
                      >
                        <option value="My Own Package Custom Dimensions">📦 My Own Package (Custom Dimensions)</option>
                        <option value="Box 2 (Flat)">🟨 Box 2 (Flat) - 34 X 32 X 5.2 cm</option>
                        <option value="Box 3">📦 Box 3 - 33.7 X 32.2 X 9.2 cm</option>
                        <option value="Box 4">📦 Box 4 - 33.7 X 32.2 X 18 cm</option>
                        <option value="Box 5">📦 Box 5 - 33.7 X 32.2 X 34.5 cm</option>
                        <option value="Flyer (Small)">✉️ Flyer (Small) - 27 X 35 cm</option>
                        <option value="Flyer (Large)">✉️ Flyer (Large) - 37.5 X 47.5 cm</option>
                      </select>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-1">
                    <label className="block md:hidden font-bold text-slate-700 mb-1">Quantity *</label>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        min="1"
                        value={pkgRow.quantity || 1}
                        onChange={(e) => {
                          const updated = [...(formData.packagingRows || [{ id: 1, quantity: 1 }])];
                          updated[idx] = { ...updated[idx], quantity: Math.max(1, parseInt(e.target.value) || 1) };
                          setFormData({ ...formData, packagingRows: updated });
                        }}
                        className={`w-full p-2 bg-white border-2 rounded text-xs font-bold text-center text-slate-900 transition-all ${getInputClass(pkgRow.quantity, true)}`}
                      />
                    </div>
                  </div>

                  {/* Weight kg */}
                  <div className="col-span-2 flex items-center space-x-1">
                    <div className="w-full relative flex items-center">
                      <label className="block md:hidden font-bold text-slate-700 mb-1">Weight (kg) *</label>
                      <input
                        type="number"
                        placeholder="Weight"
                        value={pkgRow.weightKg || ''}
                        onChange={(e) => {
                          const updated = [...(formData.packagingRows || [{ id: 1, quantity: 1 }])];
                          updated[idx] = { ...updated[idx], weightKg: e.target.value };
                          setFormData({ ...formData, packagingRows: updated });
                        }}
                        className={`w-full p-2 bg-white border-2 rounded text-xs font-bold text-slate-900 pr-5 transition-all ${getInputClass(pkgRow.weightKg, true)}`}
                      />
                      {pkgRow.weightKg && pkgRow.weightKg.toString().trim() && (
                        <span className="text-emerald-600 font-extrabold text-xs absolute right-1.5 pointer-events-none">✓</span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-500 shrink-0">kg</span>
                  </div>

                  {/* Length cm */}
                  <div className="col-span-1 flex items-center space-x-1">
                    <div className="w-full relative flex items-center">
                      <label className="block md:hidden font-bold text-slate-700 mb-1">Length *</label>
                      <input
                        type="number"
                        placeholder="L"
                        value={pkgRow.lengthCm || ''}
                        onChange={(e) => {
                          const updated = [...(formData.packagingRows || [{ id: 1, quantity: 1 }])];
                          updated[idx] = { ...updated[idx], lengthCm: e.target.value };
                          setFormData({ ...formData, packagingRows: updated });
                        }}
                        className={`w-full p-2 bg-white border-2 rounded text-xs font-bold text-slate-900 pr-4 transition-all ${getInputClass(pkgRow.lengthCm, true)}`}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-500 shrink-0">cm</span>
                    <span className="text-xs font-extrabold text-slate-400 shrink-0 ml-1">X</span>
                  </div>

                  {/* Width cm */}
                  <div className="col-span-1 flex items-center space-x-1">
                    <div className="w-full relative flex items-center">
                      <label className="block md:hidden font-bold text-slate-700 mb-1">Width *</label>
                      <input
                        type="number"
                        placeholder="W"
                        value={pkgRow.widthCm || ''}
                        onChange={(e) => {
                          const updated = [...(formData.packagingRows || [{ id: 1, quantity: 1 }])];
                          updated[idx] = { ...updated[idx], widthCm: e.target.value };
                          setFormData({ ...formData, packagingRows: updated });
                        }}
                        className={`w-full p-2 bg-white border-2 rounded text-xs font-bold text-slate-900 pr-4 transition-all ${getInputClass(pkgRow.widthCm, true)}`}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-500 shrink-0">cm</span>
                    <span className="text-xs font-extrabold text-slate-400 shrink-0 ml-1">X</span>
                  </div>

                  {/* Height cm */}
                  <div className="col-span-1 flex items-center space-x-1">
                    <div className="w-full relative flex items-center">
                      <label className="block md:hidden font-bold text-slate-700 mb-1">Height *</label>
                      <input
                        type="number"
                        placeholder="H"
                        value={pkgRow.heightCm || ''}
                        onChange={(e) => {
                          const updated = [...(formData.packagingRows || [{ id: 1, quantity: 1 }])];
                          updated[idx] = { ...updated[idx], heightCm: e.target.value };
                          setFormData({ ...formData, packagingRows: updated });
                        }}
                        className={`w-full p-2 bg-white border-2 rounded text-xs font-bold text-slate-900 pr-4 transition-all ${getInputClass(pkgRow.heightCm, true)}`}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-500 shrink-0">cm</span>
                  </div>

                  {/* Actions (Save / Copy / Remove) */}
                  <div className="col-span-2 flex items-center justify-end space-x-3 pt-2 md:pt-0">
                    <button
                      type="button"
                      onClick={() => showToast(`Saved specifications for Package #${idx + 1}`)}
                      className="text-slate-500 hover:text-slate-800 font-bold text-xs flex items-center space-x-1 cursor-pointer"
                    >
                      <span>💾</span>
                      <span className="underline">Save</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const current = formData.packagingRows || [{ id: 1, quantity: 1 }];
                        const copy = { ...current[idx], id: Date.now() };
                        const updated = [...current];
                        updated.splice(idx + 1, 0, copy);
                        setFormData({ ...formData, packagingRows: updated });
                        showToast(`Copied Package #${idx + 1}`);
                      }}
                      className="text-slate-500 hover:text-slate-800 font-bold text-xs flex items-center space-x-1 cursor-pointer"
                    >
                      <span>📋</span>
                      <span className="underline">Copy</span>
                    </button>
                  </div>

                </div>
              ))}

              {/* Summary Totals & Add Another Package Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-200 gap-4">
                <div className="flex items-center space-x-6 text-xs font-extrabold text-slate-800">
                  <span>Total Packages: <span className="font-mono">{formData.packagingRows?.length || 1}</span></span>
                  <span>Total Weight: <span className="font-mono">
                    {(() => {
                      const rows = formData.packagingRows || [];
                      const sum = rows.reduce((acc, curr) => acc + ((parseFloat(curr.weightKg) || 0) * (parseInt(curr.quantity) || 1)), 0);
                      return sum > 0 ? sum.toFixed(2) : '--.--';
                    })()} KG
                  </span></span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const current = formData.packagingRows || [{ id: 1, quantity: 1 }];
                    const newPkg = {
                      id: Date.now(),
                      packagingType: 'My Own Package Custom Dimensions',
                      quantity: 1,
                      weightKg: '',
                      lengthCm: '',
                      widthCm: '',
                      heightCm: ''
                    };
                    setFormData({ ...formData, packagingRows: [...current, newPkg] });
                    showToast(`Added Package #${current.length + 1}`);
                  }}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded border border-orange-600 shadow-2xs transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <span>Add Another Package</span>
                  <span className="font-black text-sm">+</span>
                </button>
              </div>

            </div>

            {/* Footer Navigation Action Bar (Green Next Button matching screenshot) */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                ← Back: Customs Invoice
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="px-8 py-2.5 bg-[#28a745] hover:bg-emerald-700 text-white rounded-md font-extrabold text-sm shadow-sm transition-all flex items-center space-x-1 cursor-pointer active:scale-95"
              >
                <span>Next</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* STEP 5: HOW WILL YOU PAY & CUSTOMS TERMS OF TRADE (Matching User Screenshot) */}
      {currentStep === 5 && (
        <div className="space-y-6 animate-fade-in text-left">
          
          {/* Top Bar with Cancel & Save for Later */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-end gap-4">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
              >
                <span>✕ Cancel</span>
              </button>
              <button
                type="button"
                onClick={handleSaveForLater}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center space-x-1.5"
              >
                <span>💾 Save for Later</span>
              </button>
            </div>
          </div>

          {/* Top Grey Summary Card (4 Rows: From/To, Packages, Parties/Tax, Packaging Specs) */}
          <div className="bg-slate-200/70 rounded-2xl p-6 border border-slate-300 shadow-xs space-y-6 text-xs text-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* FROM (A Pin) */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-400 text-white font-black flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                  A
                </div>
                <div className="space-y-0.5">
                  <span className="font-extrabold text-slate-500 text-[11px] block uppercase tracking-wider">From</span>
                  <p className="font-extrabold text-slate-900 text-sm leading-tight">{formData.senderName || 'Soorya Ba'}</p>
                  {formData.senderCompany && <p className="font-semibold text-slate-700">{formData.senderCompany}</p>}
                  <p>{formData.senderAddress1 || 'No.10'}{formData.senderAddress2 ? `, ${formData.senderAddress2}` : ''}</p>
                  <p className="font-bold text-slate-800">{formData.senderCity || 'CHENNAI'} {formData.senderState || 'Tamil Nadu'} {formData.senderPostalCode || '600053'}</p>
                  <p className="font-semibold text-slate-700">{formData.senderCountry || 'India'}</p>
                </div>
              </div>

              {/* TO (B Pin) with Edit Button */}
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-400 text-white font-black flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                    B
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-slate-500 text-[11px] block uppercase tracking-wider">To</span>
                    <p className="font-extrabold text-slate-900 text-sm leading-tight">{formData.receiverName || 'Anitha'}</p>
                    {formData.receiverCompany && <p className="font-semibold text-slate-700">{formData.receiverCompany}</p>}
                    <p>{formData.receiverAddress1 || '10 Polang park'}{formData.receiverAddress2 ? `, ${formData.receiverAddress2}` : ''}</p>
                    <p className="font-bold text-slate-800">{formData.receiverCity || 'SINGAPORE'} {formData.receiverPostalCode || '238858'}</p>
                    <p className="font-semibold text-slate-700">{formData.receiverCountry || 'Singapore'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs rounded-lg border border-slate-300 shadow-xs cursor-pointer"
                >
                  Edit
                </button>
              </div>

            </div>

            {/* Row 2: Packages & Insured Value */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-slate-300/80 pt-4 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-sm shrink-0">
                  📦
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 text-xs">
                    Packages <span className="font-normal text-slate-700">{uniqueItemsList[0]?.description || formData.customItemDescription || 'Laptop'}</span>
                  </p>
                  <p className="font-semibold text-slate-600 text-[11px] mt-0.5">Items : {totalUnitsCount || 1}</p>
                  <p className="font-bold text-slate-800 text-xs">
                    Total Goods Value {totalValueInr > 0 ? totalValueInr.toFixed(2) : '1,000.00'} SGD
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="font-bold text-slate-800 text-xs">
                  Insured Value {formData.insuredValue ? parseFloat(formData.insuredValue).toFixed(2) : (formData.includeInsurance ? '1.00' : '0.00')} SGD
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs rounded-lg border border-slate-300 shadow-xs cursor-pointer"
                >
                  Edit
                </button>
              </div>
            </div>

            {/* Row 3: Additional Parties & Tax ID */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-slate-300/80 pt-4 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-sm shrink-0 font-bold">
                  👥
                </div>
                <span className="font-extrabold text-slate-800 text-xs">
                  {formData.hasAdditionalParties ? `Party: ${formData.additionalPartyRole || 'Additional Party'}` : 'No Additional Parties'}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <span className="font-extrabold text-slate-800 text-xs">
                  {formData.taxPaymentNumber ? `Tax ID: ${formData.taxPaymentNumber}` : 'No Shipment Tax ID'}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs rounded-lg border border-slate-300 shadow-xs cursor-pointer"
                >
                  Edit
                </button>
              </div>
            </div>

            {/* Row 4 (Matching Screenshot): Package Dimensions Summary */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-slate-300/80 pt-4 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-sm shrink-0">
                  📦
                </div>
                <span className="font-extrabold text-slate-800 text-xs">
                  {formData.packagingRows && formData.packagingRows.length > 0
                    ? `${formData.packagingRows[0].packagingType || 'My Own Package'} - ${formData.packagingRows[0].quantity || 1} Piece - ${formData.packagingRows[0].weightKg || '2.5'} kg (${formData.packagingRows[0].lengthCm || '26'} X ${formData.packagingRows[0].widthCm || '24'} X ${formData.packagingRows[0].heightCm || '26'} cm)`
                    : 'My Own Package - 1 Piece - 2.5 kg (26 X 24 X 26 cm)'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs rounded-lg border border-slate-300 shadow-xs cursor-pointer"
              >
                Edit
              </button>
            </div>

          </div>

          {/* Main Card: How will you pay? */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-8">
            
            <h3 className="text-xl font-extrabold text-slate-900">How will you pay?</h3>

            {/* Payment Method & Duties Grid (Matching Screenshot) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              
              {/* Payment Method Dropdown */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Payment Method *</label>
                <div className="flex items-center space-x-2">
                  <select
                    value={formData.paymentMethodType || 'Select One'}
                    onChange={(e) => setFormData({ ...formData, paymentMethodType: e.target.value })}
                    className={`w-full p-2.5 bg-white border-2 rounded text-xs font-bold text-slate-900 cursor-pointer transition-all ${getInputClass(formData.paymentMethodType && formData.paymentMethodType !== 'Select One' ? formData.paymentMethodType : '', true)}`}
                  >
                    <option value="Select One">Select One</option>
                    <option value="Online Payment">Online Payment</option>
                    <option value="Add Account">Add Account</option>
                  </select>
                  {formData.paymentMethodType && formData.paymentMethodType !== 'Select One' && (
                    <span className="text-emerald-600 font-extrabold text-base shrink-0">✓</span>
                  )}
                </div>
              </div>

              {/* How will duties and taxes be paid? */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">How will duties and taxes be paid? *</label>
                <div className="flex items-center space-x-2">
                  <select
                    value={formData.dutiesPaymentOption || 'Receiver will pay'}
                    onChange={(e) => setFormData({ ...formData, dutiesPaymentOption: e.target.value })}
                    className={`w-full p-2.5 bg-white border-2 rounded text-xs font-bold text-slate-900 cursor-pointer transition-all ${getInputClass(formData.dutiesPaymentOption, true)}`}
                  >
                    <option value="Receiver will pay">Receiver will pay</option>
                    <option value="Sender will pay">Sender will pay</option>
                    <option value="Third Party will pay">Third Party will pay</option>
                  </select>
                  <span className="text-emerald-600 font-extrabold text-base shrink-0">✓</span>
                </div>
              </div>

            </div>

            {/* Additional Customs Details Card (Matching Screenshot) */}
            <div className="border border-slate-300 rounded-lg p-5 bg-white space-y-3 text-xs">
              <h4 className="font-extrabold text-slate-900 text-sm">Additional customs details are needed for this shipment</h4>
              <p className="text-xs text-slate-600">In order to complete this shipment you are required to provide the following details for customs.</p>

              <div className="space-y-1 pt-2">
                <div className="flex items-center">
                  <label className="block font-bold text-slate-700">Select customs terms of trade</label>
                  <button
                    type="button"
                    onClick={() => showToast('DAP: Delivered at Place (Receiver pays duties). DDP: Delivered Duty Paid (Sender pays duties).')}
                    className="text-xs font-bold text-sky-600 hover:text-sky-800 underline ml-2 cursor-pointer"
                  >
                    View Definitions
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <select
                    value={formData.incoterm || 'Select One'}
                    onChange={(e) => setFormData({ ...formData, incoterm: e.target.value })}
                    className={`w-full sm:w-80 p-2.5 bg-white border-2 rounded text-xs text-slate-900 cursor-pointer transition-all ${getInputClass(formData.incoterm && formData.incoterm !== 'Select One' ? formData.incoterm : '', true)}`}
                  >
                    <option value="Select One">Select One</option>
                    <option value="DAP - Delivered at Place">DAP - Delivered at Place</option>
                    <option value="DDP - Delivered Duty Paid">DDP - Delivered Duty Paid</option>
                    <option value="FOB - Free on Board">FOB - Free on Board</option>
                    <option value="CIF - Cost, Insurance, and Freight">CIF - Cost, Insurance, and Freight</option>
                    <option value="EXW - Ex Works">EXW - Ex Works</option>
                  </select>
                  {formData.incoterm && formData.incoterm !== 'Select One' ? (
                    <span className="text-emerald-600 font-extrabold text-base shrink-0">✓</span>
                  ) : (
                    <span className="text-rose-500 font-extrabold text-sm">*</span>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Navigation Action Bar (Green Next Button matching screenshot) */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                ← Back: Select Packaging
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="px-8 py-2.5 bg-[#28a745] hover:bg-emerald-700 text-white rounded-md font-extrabold text-sm shadow-sm transition-all flex items-center space-x-1 cursor-pointer active:scale-95"
              >
                <span>Next</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* STEP 6: DISPATCH DATE & FREIGHT RATE SELECTION (Matching User Screenshot) */}
      {currentStep === 6 && (
        <div className="space-y-6 animate-fade-in text-left">
          
          {/* Top Bar with Cancel & Save for Later */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-end gap-4">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
              >
                <span>✕ Cancel</span>
              </button>
              <button
                type="button"
                onClick={handleSaveForLater}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center space-x-1.5"
              >
                <span>💾 Save for Later</span>
              </button>
            </div>
          </div>

          {/* Top Grey Summary Card (5 Summary Rows matching screenshots) */}
          <div className="bg-slate-200/70 rounded-2xl p-6 border border-slate-300 shadow-xs space-y-6 text-xs text-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* FROM (A Pin) */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-400 text-white font-black flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                  A
                </div>
                <div className="space-y-0.5">
                  <span className="font-extrabold text-slate-500 text-[11px] block uppercase tracking-wider">From</span>
                  <p className="font-extrabold text-slate-900 text-sm leading-tight">{formData.senderName || 'Soorya Ba'}</p>
                  {formData.senderCompany && <p className="font-semibold text-slate-700">{formData.senderCompany}</p>}
                  <p>{formData.senderAddress1 || 'No.10'}{formData.senderAddress2 ? `, ${formData.senderAddress2}` : ''}</p>
                  <p className="font-bold text-slate-800">{formData.senderCity || 'CHENNAI'} {formData.senderState || 'Tamil Nadu'} {formData.senderPostalCode || '600053'}</p>
                  <p className="font-semibold text-slate-700">{formData.senderCountry || 'India'}</p>
                </div>
              </div>

              {/* TO (B Pin) with Edit Button */}
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-400 text-white font-black flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                    B
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-slate-500 text-[11px] block uppercase tracking-wider">To</span>
                    <p className="font-extrabold text-slate-900 text-sm leading-tight">{formData.receiverName || 'Anitha'}</p>
                    {formData.receiverCompany && <p className="font-semibold text-slate-700">{formData.receiverCompany}</p>}
                    <p>{formData.receiverAddress1 || '10 Polang park'}{formData.receiverAddress2 ? `, ${formData.receiverAddress2}` : ''}</p>
                    <p className="font-bold text-slate-800">{formData.receiverCity || 'SINGAPORE'} {formData.receiverPostalCode || '238858'}</p>
                    <p className="font-semibold text-slate-700">{formData.receiverCountry || 'Singapore'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs rounded-lg border border-slate-300 shadow-xs cursor-pointer"
                >
                  Edit
                </button>
              </div>

            </div>

            {/* Row 2: Packages & Insured Value */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-slate-300/80 pt-4 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-sm shrink-0">
                  📦
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 text-xs">
                    Packages <span className="font-normal text-slate-700">{uniqueItemsList[0]?.description || formData.customItemDescription || 'Laptop'}</span>
                  </p>
                  <p className="font-semibold text-slate-600 text-[11px] mt-0.5">Items : {totalUnitsCount || 1}</p>
                  <p className="font-bold text-slate-800 text-xs">
                    Total Goods Value {totalValueInr > 0 ? totalValueInr.toFixed(2) : '1,000.00'} SGD
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="font-bold text-slate-800 text-xs">
                  Insured Value {formData.insuredValue ? parseFloat(formData.insuredValue).toFixed(2) : (formData.includeInsurance ? '1.00' : '0.00')} SGD
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs rounded-lg border border-slate-300 shadow-xs cursor-pointer"
                >
                  Edit
                </button>
              </div>
            </div>

            {/* Row 3: Additional Parties & Tax ID */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-slate-300/80 pt-4 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-sm shrink-0 font-bold">
                  👥
                </div>
                <span className="font-extrabold text-slate-800 text-xs">
                  {formData.hasAdditionalParties ? `Party: ${formData.additionalPartyRole || 'Additional Party'}` : 'No Additional Parties'}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <span className="font-extrabold text-slate-800 text-xs">
                  {formData.taxPaymentNumber ? `Tax ID: ${formData.taxPaymentNumber}` : 'No Shipment Tax ID'}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs rounded-lg border border-slate-300 shadow-xs cursor-pointer"
                >
                  Edit
                </button>
              </div>
            </div>

            {/* Row 4: Package Specs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-slate-300/80 pt-4 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-sm shrink-0">
                  📦
                </div>
                <span className="font-extrabold text-slate-800 text-xs">
                  {formData.packagingRows && formData.packagingRows.length > 0
                    ? `${formData.packagingRows[0].packagingType || 'My Own Package'} - ${formData.packagingRows[0].quantity || 1} Piece - ${formData.packagingRows[0].weightKg || '2.5'} kg (${formData.packagingRows[0].lengthCm || '26'} X ${formData.packagingRows[0].widthCm || '24'} X ${formData.packagingRows[0].heightCm || '26'} cm)`
                    : 'My Own Package - 1 Piece - 2.5 kg (26 X 24 X 26 cm)'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs rounded-lg border border-slate-300 shadow-xs cursor-pointer"
              >
                Edit
              </button>
            </div>

            {/* Row 5 (Matching Screenshot): Payment & Duties Summary */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-slate-300/80 pt-4 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-sm shrink-0">
                  💳
                </div>
                <div>
                  <p className="font-extrabold text-slate-800 text-xs">
                    Transportation charges paid by <span className="font-normal text-slate-600">{formData.paymentMethodType || 'Online Payment'}</span>
                  </p>
                  <p className="font-extrabold text-slate-800 text-xs mt-0.5">
                    Duties and taxes paid by <span className="font-normal text-slate-600">{formData.dutiesPaymentOption || 'Receiver will pay'}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs rounded-lg border border-slate-300 shadow-xs cursor-pointer"
              >
                Edit
              </button>
            </div>

          </div>

          {/* Main Content: I'm sending my shipment on */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-8">
            
            <h3 className="text-xl font-extrabold text-slate-900">I'm sending my shipment on</h3>

            {/* Date Selector Tabs (With Brand Orange Active Highlight) */}
            <div className="overflow-x-auto pb-2">
              <div className="flex items-stretch border-b-2 border-orange-500 min-w-[650px]">
                {[
                  { day: 'September 11', sub: 'Today' },
                  { day: 'September 12', sub: 'Tomorrow' },
                  { day: 'September 13', sub: 'Sunday' },
                  { day: 'September 14', sub: 'Monday' },
                  { day: 'September 15', sub: 'Tuesday' },
                  { day: 'September 16', sub: 'Wednesday' },
                  { day: 'More +', sub: '' }
                ].map((dateTab, idx) => {
                  const isSelected = (formData.selectedDispatchDate || 'September 14') === dateTab.day || (idx === 3 && !formData.selectedDispatchDate);
                  return (
                    <button
                      key={dateTab.day}
                      type="button"
                      onClick={() => setFormData({ ...formData, selectedDispatchDate: dateTab.day })}
                      className={`flex-1 py-3 px-3 text-center border-t border-l border-r rounded-t-lg transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-orange-500 border-orange-600 text-white font-extrabold shadow-md -mb-[2px] z-10'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 font-bold'
                      }`}
                    >
                      <p className="text-xs font-black leading-tight">{dateTab.day}</p>
                      {dateTab.sub && <p className="text-[11px] font-medium opacity-80 mt-0.5">{dateTab.sub}</p>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quote Results & Side Card Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Rate Options Cards (Col 8) */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* Table Header Row */}
                <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 grid grid-cols-3 text-xs font-extrabold text-slate-700 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <span>📅</span>
                    <span>Delivery Date</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <span>🕒</span>
                    <span>Delivered By</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <span>💵</span>
                    <span>Estimated Price</span>
                  </div>
                </div>

                {/* Freight Service Level Option Card 1 */}
                {(() => {
                  const activeDispatchDate = formData.selectedDispatchDate || 'September 14';
                  const isLandMode = (formData.cargoType && formData.cargoType.includes('Land')) || (formData.serviceLevel && formData.serviceLevel.includes('Land'));
                  const isOceanMode = (formData.cargoType && formData.cargoType.includes('Ocean')) || (formData.serviceLevel && formData.serviceLevel.includes('Ocean'));

                  const card1Sla = isLandMode ? 4 : isOceanMode ? 12 : 2;
                  const deliveryOption1 = calculateDeliveryDate(activeDispatchDate, card1Sla);
                  const card1BadgeText = isLandMode ? 'LAND FREIGHT EXPRESS' : isOceanMode ? 'OCEAN CONTAINER STANDARD' : 'EXPRESS WORLDWIDE';
                  const card1PriceText = isLandMode ? '6,850.00' : isOceanMode ? '4,120.00' : '11,547.44';

                  return (
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-center sm:text-left">
                        
                        {/* Delivery Date */}
                        <div>
                          <p className="text-lg font-black text-slate-900">{deliveryOption1.monthDay}</p>
                          <p className="text-xs font-bold text-slate-600">{deliveryOption1.dayOfWeek}</p>
                          <span className="inline-block mt-2 px-2.5 py-0.5 bg-slate-200 text-slate-800 rounded font-black text-[10px] tracking-wider">
                            {card1BadgeText}
                          </span>
                        </div>

                        {/* Delivered By */}
                        <div>
                          <p className="text-sm font-extrabold text-slate-900">End of Day</p>
                        </div>

                        {/* Estimated Price & Select Button */}
                        <div className="flex flex-col items-center sm:items-end space-y-2">
                          <span className="text-[11px] font-bold text-slate-500">Discounted Rate</span>
                          <p className="text-2xl font-black text-slate-900 font-mono leading-none">
                            <span className="text-sm font-extrabold text-slate-600">SGD</span> {card1PriceText}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono">Transportation Charges {card1PriceText} SGD</p>
                          
                          <button
                            type="button"
                            onClick={() => showToast(`Base rate: ${card1PriceText} SGD. Delivery: ${deliveryOption1.monthDay}, ${deliveryOption1.dayOfWeek}. Fuel surcharge included.`)}
                            className="text-[11px] font-bold text-sky-600 hover:text-sky-800 flex items-center space-x-0.5 cursor-pointer"
                          >
                            <span>Details</span>
                            <span>∨</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                serviceLevel: card1BadgeText,
                                selectedFreightRate: `${card1PriceText} SGD`,
                                estimatedDeliveryDate: `${deliveryOption1.monthDay}, ${deliveryOption1.dayOfWeek}`
                              });
                              handleNextStep();
                            }}
                            className="mt-2 px-6 py-2 bg-[#28a745] hover:bg-emerald-700 text-white rounded-md font-black text-sm shadow-sm transition-all cursor-pointer active:scale-95"
                          >
                            Select
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })()}

                {/* Freight Option Card 2 */}
                {(() => {
                  const activeDispatchDate = formData.selectedDispatchDate || 'September 14';
                  const isLandMode = (formData.cargoType && formData.cargoType.includes('Land')) || (formData.serviceLevel && formData.serviceLevel.includes('Land'));
                  const isOceanMode = (formData.cargoType && formData.cargoType.includes('Ocean')) || (formData.serviceLevel && formData.serviceLevel.includes('Ocean'));

                  const card2Sla = isLandMode ? 3 : isOceanMode ? 10 : 2;
                  const deliveryOption2 = calculateDeliveryDate(activeDispatchDate, card2Sla);
                  const card2BadgeText = isLandMode ? 'LAND PRIORITY TRUCKING' : isOceanMode ? 'OCEAN PRIORITY EXPORT' : 'EXPRESS 12:00';
                  const card2PriceText = isLandMode ? '8,450.00' : isOceanMode ? '5,900.00' : '14,250.00';

                  return (
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-center sm:text-left">
                        <div>
                          <p className="text-lg font-black text-slate-900">{deliveryOption2.monthDay}</p>
                          <p className="text-xs font-bold text-slate-600">{deliveryOption2.dayOfWeek}</p>
                          <span className="inline-block mt-2 px-2.5 py-0.5 bg-orange-100 text-orange-800 rounded font-black text-[10px] tracking-wider">
                            {card2BadgeText}
                          </span>
                        </div>

                        <div>
                          <p className="text-sm font-extrabold text-slate-900">12:00 PM Guaranteed</p>
                        </div>

                        <div className="flex flex-col items-center sm:items-end space-y-2">
                          <span className="text-[11px] font-bold text-slate-500">Express Priority</span>
                          <p className="text-2xl font-black text-slate-900 font-mono leading-none">
                            <span className="text-sm font-extrabold text-slate-600">SGD</span> {card2PriceText}
                          </p>

                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                serviceLevel: card2BadgeText,
                                selectedFreightRate: `${card2PriceText} SGD`,
                                estimatedDeliveryDate: `${deliveryOption2.monthDay}, ${deliveryOption2.dayOfWeek}`
                              });
                              handleNextStep();
                            }}
                            className="mt-2 px-6 py-2 bg-[#28a745] hover:bg-emerald-700 text-white rounded-md font-black text-sm shadow-sm transition-all cursor-pointer active:scale-95"
                          >
                            Select
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })()}

              </div>

              {/* Right Side GoGreen Plus Card (Matching Image 2) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="border border-emerald-400 bg-emerald-50/60 rounded-xl p-5 space-y-3 shadow-2xs text-xs text-left">
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-600 text-xl font-bold">🌿</span>
                    <h4 className="font-extrabold text-slate-900 text-sm leading-tight">
                      GoGreen Plus – Carbon Reduced Shipping
                    </h4>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    CO2 emissions from air transport are reduced (inset) through the use of Sustainable Aviation Fuel.
                  </p>
                  <button
                    type="button"
                    onClick={() => showToast('GoGreen Plus helps reduce eco footprint using SAF aviation fuel.')}
                    className="text-xs font-bold text-sky-600 hover:text-sky-800 underline cursor-pointer"
                  >
                    Learn More
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Left Subtext (Image 2) */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 gap-2">
              <p className="font-medium">
                Josan Logistics rate estimate as of Sep 11, 2026, 10:11 AM
              </p>
              <button
                type="button"
                onClick={() => showToast('Rate estimates are based on current fuel surcharges and package dimensions.')}
                className="text-xs font-bold text-sky-600 hover:text-sky-800 underline flex items-center space-x-1 cursor-pointer"
              >
                <span>📝</span>
                <span>Disclaimer and Important Details</span>
              </button>
            </div>

            {/* Footer Navigation Action Bar */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                ← Back: Payment Details
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="px-8 py-2.5 bg-[#28a745] hover:bg-emerald-700 text-white rounded-md font-extrabold text-sm shadow-sm transition-all flex items-center space-x-1 cursor-pointer active:scale-95"
              >
                <span>Next</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* STEP 7: REVIEW SUMMARY & PAYMENT */}
      {currentStep === 7 && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in text-left">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white font-extrabold flex items-center justify-center text-base shadow-orange-sm">
              4
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Step 4: Review Summary & Payment</h3>
              <p className="text-xs text-slate-500">Confirm waybill details and complete secure freight payment</p>
            </div>
          </div>

          {/* Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 text-xs">
            <div className="space-y-2">
              <h4 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider text-orange-600">From (Sender)</h4>
              <p className="font-bold text-slate-900 text-sm">{formData.senderName} ({formData.senderCompany})</p>
              <p className="text-slate-600">{formData.senderAddress1}, {formData.senderAddress2}</p>
              <p className="text-slate-600">{formData.senderCity}, {formData.senderState} {formData.senderPostalCode}, {formData.senderCountry}</p>
              <p className="font-mono text-slate-700">Contact: {formData.senderCountryCode} {formData.senderPhone} | {formData.senderEmail}</p>
              {formData.senderTaxIdNumber && <p className="font-mono text-slate-500">Tax ID: {formData.senderTaxIdType} ({formData.senderTaxIdNumber})</p>}
            </div>

            <div className="space-y-2">
              <h4 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider text-orange-600">To (Recipient)</h4>
              <p className="font-bold text-slate-900 text-sm">{formData.receiverName} ({formData.receiverCompany || 'Individual'})</p>
              <p className="text-slate-600">{formData.receiverAddress1}, {formData.receiverAddress2}</p>
              <p className="text-slate-600">{formData.receiverCity}, {formData.receiverState} {formData.receiverPostalCode}, {formData.receiverCountry}</p>
              <p className="font-mono text-slate-700">Contact: {formData.receiverCountryCode} {formData.receiverPhone} | {formData.receiverEmail}</p>
              {formData.receiverTaxIdNumber && <p className="font-mono text-slate-500">Tax ID: {formData.receiverTaxIdType} ({formData.receiverTaxIdNumber})</p>}
            </div>
          </div>

          {/* Rate Breakdown */}
          <div className="bg-orange-50 p-6 rounded-2xl border border-orange-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Service Speed SLA:</span>
              <span className="font-extrabold text-slate-900">{formData.serviceLevel}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Cargo Weight & Type:</span>
              <span className="font-extrabold text-slate-900">{formData.weight} kg ({formData.cargoType})</span>
            </div>
            <div className="flex items-center justify-between border-t border-orange-200 pt-3 text-base font-extrabold text-slate-900">
              <span>Total Estimated Freight Fee:</span>
              <span className="text-2xl text-orange-600 font-mono">{calculateEstimatedPrice()}</span>
            </div>
          </div>

          {/* Payment Method Form */}
          <form onSubmit={handleFinalPaymentSubmit} className="space-y-4 pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Select Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-orange-500 bg-orange-50 text-orange-600 ring-2 ring-orange-400'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Credit / Debit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('paynow')}
                className={`p-4 rounded-2xl border font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  paymentMethod === 'paynow'
                    ? 'border-orange-500 bg-orange-50 text-orange-600 ring-2 ring-orange-400'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>PayNow SG Instant QR</span>
              </button>
            </div>

            {paymentMethod === 'card' ? (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Card Number *</label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4532 8920 1102 4242"
                      className={`w-full p-3 bg-white border-2 rounded-xl font-mono font-bold text-slate-900 pr-8 transition-all ${getInputClass(cardNumber && cardNumber.replace(/\s/g, '').length >= 15, true)}`}
                      required
                    />
                    {cardNumber && cardNumber.replace(/\s/g, '').length >= 15 && (
                      <span className="text-emerald-600 font-extrabold text-sm absolute right-3 pointer-events-none">✓</span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Expiry (MM/YY) *</label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={handleCardExpiryChange}
                        placeholder="12/28"
                        className={`w-full p-3 bg-white border-2 rounded-xl font-mono font-bold text-slate-900 text-center pr-6 transition-all ${getInputClass(cardExpiry && cardExpiry.length >= 5, true)}`}
                        required
                      />
                      {cardExpiry && cardExpiry.length >= 5 && (
                        <span className="text-emerald-600 font-extrabold text-xs absolute right-2 pointer-events-none">✓</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">CVV Code *</label>
                    <div className="relative flex items-center">
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={handleCardCvvChange}
                        placeholder="•••"
                        className={`w-full p-3 bg-white border-2 rounded-xl font-mono font-bold text-slate-900 text-center pr-6 transition-all ${getInputClass(cardCvv && cardCvv.length >= 3, true)}`}
                        required
                      />
                      {cardCvv && cardCvv.length >= 3 && (
                        <span className="text-emerald-600 font-extrabold text-xs absolute right-2 pointer-events-none">✓</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-3">
                <div className="w-40 h-40 bg-white p-3 rounded-2xl border border-slate-300 mx-auto flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-slate-900" />
                </div>
                <p className="font-extrabold text-slate-900 text-xs">Scan QR with DBS PayLah!, OCBC, or UOB TMRW</p>
                <p className="text-[11px] text-slate-500 font-mono">Reference: JOS-{Date.now().toString().slice(-6)}</p>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs transition-colors cursor-pointer"
              >
                ← Back
              </button>

              <button
                type="submit"
                disabled={isProcessingPayment}
                className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-extrabold text-sm shadow-orange-sm transition-all flex items-center space-x-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Pay {calculateEstimatedPrice()}</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 1: Create Description Helper Modal */}
      {isCreateDescModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full border border-slate-200 shadow-2xl space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center text-sm">
                  📝
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Customs Item Description Builder</h3>
                  <p className="text-xs text-slate-500 font-medium">Select a customs compliant item description template</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateDescModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-extrabold text-base p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {[
                { title: "Men's Knitted Cotton T-Shirts", desc: "100% Cotton knitted short sleeve T-Shirt for men, personal wear" },
                { title: "Leather Handbags & Purses", desc: "Genuine leather women's shoulder bag with metal zip closure" },
                { title: "Stainless Steel Kitchen Cutlery", desc: "Tableware & kitchen utensils, rust-resistant stainless steel grade 304" },
                { title: "Printed Circuit Board (PCB) Assembly", desc: "Electronic IC populated circuit board components for commercial repair" },
                { title: "Handcrafted Woolen Area Rugs", desc: "100% Woven sheep wool floor carpet / rug, traditional decorative" },
                { title: "Plastic Educational Toys & Puzzles", desc: "Non-toxic ABS plastic children building blocks and board games" },
                { title: "Organic Spices & Herbal Seasonings", desc: "Dried whole black pepper and culinary herbs packaged for food consumption" },
                { title: "Automotive Brake Pads Replacement", desc: "Ceramic disc brake pads set for passenger light motor vehicle" }
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    handleUniqueItemChange(activeItemIndexForModal, 'description', item.desc);
                    setIsCreateDescModalOpen(false);
                    showToast('Applied item description to shipment details!', 'info');
                  }}
                  className="p-3 bg-slate-50 hover:bg-orange-50/80 border border-slate-200 hover:border-orange-300 rounded-xl cursor-pointer transition-all space-y-0.5 group"
                >
                  <p className="font-extrabold text-xs text-slate-900 group-hover:text-orange-700">{item.title}</p>
                  <p className="text-[11px] text-slate-500 font-medium">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsCreateDescModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Import Commodity Code Lookup Modal */}
      {isLookupCodeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full border border-slate-200 shadow-2xl space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center text-sm">
                  🔍
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">HS Commodity Code Lookup</h3>
                  <p className="text-xs text-slate-500 font-medium">Search international Harmonized Tariff System (HS) codes</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLookupCodeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-extrabold text-base p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={hsCodeSearch}
                onChange={(e) => setHsCodeSearch(e.target.value)}
                placeholder="Search by keyword (e.g., T-shirt, Leather, PCB, Steel)..."
                className="w-full p-2.5 pl-9 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs text-slate-900 focus-orange"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {[
                { code: "610910", name: "Cotton T-Shirts & Singlets", desc: "T-shirts, singlets and other vests, knitted/crocheted of cotton" },
                { code: "640399", name: "Leather Footwear & Shoes", desc: "Footwear with outer soles of rubber/plastics/leather and uppers of leather" },
                { code: "420231", name: "Leather Wallets & Handbags", desc: "Trunks, suitcases, vanity cases, executive-cases, leather wallets" },
                { code: "854231", name: "Electronic IC & Processors", desc: "Electronic integrated circuits: Processors and controllers" },
                { code: "732393", name: "Stainless Steel Tableware", desc: "Table, kitchen or other household articles of stainless steel" },
                { code: "950300", name: "Children Toys & Games", desc: "Tricycles, scooters, pedal cars, dolls, puzzles and scale models" },
                { code: "090411", name: "Pepper & Dried Spices", desc: "Pepper of the genus Piper; dried or crushed or ground" },
                { code: "842123", name: "Automotive Filters", desc: "Oil or petrol-filters for internal combustion engines" }
              ]
              .filter(i => !hsCodeSearch || i.name.toLowerCase().includes(hsCodeSearch.toLowerCase()) || i.code.includes(hsCodeSearch) || i.desc.toLowerCase().includes(hsCodeSearch.toLowerCase()))
              .map((item) => (
                <div
                  key={item.code}
                  onClick={() => {
                    handleUniqueItemChange(activeItemIndexForModal, 'commodityCode', item.code);
                    setIsLookupCodeModalOpen(false);
                    showToast(`Selected HS Code ${item.code} for ${item.name}!`, 'info');
                  }}
                  className="p-3 bg-slate-50 hover:bg-orange-50/80 border border-slate-200 hover:border-orange-300 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-black text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded">{item.code}</span>
                      <span className="font-extrabold text-xs text-slate-900 group-hover:text-orange-700">{item.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500 shrink-0 ml-2" />
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsLookupCodeModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Quick Guide for Describing Items */}
      {isQuickGuideModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full border border-slate-200 shadow-2xl space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 font-extrabold flex items-center justify-center text-sm">
                  ℹ️
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Quick Guide for Describing Items</h3>
                  <p className="text-xs text-slate-500 font-medium">Customs compliance requirements for gift & sample shipments</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsQuickGuideModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-extrabold text-base p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed font-medium max-h-80 overflow-y-auto pr-1">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-amber-900 font-semibold">
                ⚠️ Avoid vague descriptions! Generic terms like <strong>"Gift"</strong>, <strong>"Goods"</strong>, <strong>"Sample"</strong>, or <strong>"Stuff"</strong> lead to mandatory customs holds and shipment clearance rejection.
              </div>

              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-blue-600">What to include in each description:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Item Type:</strong> Exactly what the item is (e.g. T-Shirt, Handbag, Circuit Board).</li>
                  <li><strong>Material Composition:</strong> What it is made of (e.g. 100% Cotton, Stainless Steel, Genuine Leather).</li>
                  <li><strong>Intended Use:</strong> Purpose of the item (e.g. Personal gift, commercial evaluation sample).</li>
                  <li><strong>Gender/Age (if apparel):</strong> Men's, Women's, Children's.</li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl">
                  <span className="font-extrabold text-rose-700 block mb-1">❌ Invalid Description</span>
                  <span className="text-[11px] text-slate-600">"Clothes" / "Personal items"</span>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                  <span className="font-extrabold text-emerald-700 block mb-1">✓ Valid Description</span>
                  <span className="text-[11px] text-slate-600">"100% Cotton Men's Knitted T-Shirt"</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsQuickGuideModalOpen(false)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-xs"
              >
                Got It, Thanks!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Product / Item List Modal */}
      {isProductListModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full border border-slate-200 shadow-2xl space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-sm">
                  📦
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Saved Products & Item Catalog</h3>
                  <p className="text-xs text-slate-500 font-medium">Select a saved product to quickly auto-populate item details</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProductListModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-extrabold text-base p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {[
                { name: "Cotton T-Shirt Sample", code: "610910", desc: "100% Cotton Knitted T-Shirt", qty: 1, unit: "Pieces", val: "25", wt: "0.25", origin: "Singapore" },
                { name: "Leather Wallet Gift", code: "420231", desc: "Genuine Leather Bifold Wallet", qty: 1, unit: "Pieces", val: "45", wt: "0.15", origin: "Singapore" },
                { name: "Stainless Steel Mug", code: "732393", desc: "Thermal Insulated Travel Mug", qty: 1, unit: "Pieces", val: "35", wt: "0.40", origin: "Singapore" },
                { name: "Electronic PCB Board", code: "854231", desc: "Microcontroller Board Assembly", qty: 1, unit: "Pieces", val: "120", wt: "0.30", origin: "Singapore" }
              ].map((prod, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    const newItem = {
                      id: Date.now(),
                      description: prod.desc,
                      commodityCode: prod.code,
                      quantity: prod.qty,
                      units: prod.unit,
                      valuePerItem: prod.val,
                      weightPerItem: prod.wt,
                      madeIn: prod.origin,
                      taxPaid: false,
                      addLineItemReference: false,
                      lineItemReference: ''
                    };
                    setFormData(prev => ({
                      ...prev,
                      uniqueShipmentItems: [...uniqueItemsList, newItem]
                    }));
                    setIsProductListModalOpen(false);
                    showToast(`Imported ${prod.name} into shipment items!`, 'info');
                  }}
                  className="p-3 bg-slate-50 hover:bg-emerald-50/80 border border-slate-200 hover:border-emerald-300 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-700">{prod.name}</span>
                      <span className="font-mono text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">HS {prod.code}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">{prod.desc}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Value: S${prod.val} | Weight: {prod.wt} kg | Origin: {prod.origin}</p>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1.5 bg-emerald-600 group-hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shrink-0 shadow-xs cursor-pointer"
                  >
                    + Import
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsProductListModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

        </>
      )}

    </div>
  );
};
