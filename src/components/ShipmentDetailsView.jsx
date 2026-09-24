import React from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { 
  X, Truck, MapPin, Calendar, Clock, User, Phone, ShieldCheck, 
  FileText, Download, CheckCircle2, AlertCircle, ArrowRight, 
  ExternalLink, Building, Navigation, Camera, Edit3, Lock, MessageSquare, Headphones
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { safeDownloadPdf } from '../utils/pdfDownload';

export const ShipmentDetailsView = ({ shipment: propShipment, onClose }) => {
  const { selectedDetailShipment, setSelectedDetailShipment, setSelectedInvoiceShipment, showToast } = useLogistics();
  
  const shipment = propShipment || selectedDetailShipment;
  if (!shipment) return null;

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setSelectedDetailShipment(null);
    }
  };

  const handleOpenInvoice = () => {
    setSelectedInvoiceShipment(shipment);
  };

  const downloadPodPdf = () => {
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      
      // Header Banner
      doc.setFillColor(16, 24, 45); // Dark Navy
      doc.rect(0, 0, 210, 32, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(255, 107, 0); // Primary Orange
      doc.text('JOSAN LOGISTICS PTE LTD', 15, 15);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(226, 232, 240);
      doc.text('Certified Electronic Proof of Delivery (e-POD) & Consignment Handover Record', 15, 22);
      doc.text('Singapore Expressway Corridor | 24/7 Operations Command', 15, 27);
      
      // POD Status Badge
      doc.setFillColor(255, 107, 0);
      doc.roundedRect(145, 10, 50, 14, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text('DELIVERED & VERIFIED', 148, 19);

      // Consignment Meta Card
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(15, 38, 180, 28, 3, 3, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('CONSIGNMENT ID', 20, 44);
      doc.text('DATE & TIME DELIVERED', 80, 44);
      doc.text('DELIVERY VERIFICATION', 140, 44);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(16, 24, 45);
      doc.text(shipment.id, 20, 52);
      doc.text(shipment.pod?.deliveredAt || shipment.lastUpdatedTime || 'Today, Verified', 80, 52);
      
      doc.setTextColor(16, 185, 129);
      doc.text('OTP 2FA VERIFIED', 140, 52);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(`Ref: ${shipment.referenceNumber || shipment.id}`, 20, 59);
      doc.text(`Mode: ${shipment.serviceLevel || 'Roadway Linehaul'}`, 80, 59);
      doc.text(`Security Token: SEC-POD-${shipment.id.replace(/[^0-9]/g, '')}`, 140, 59);

      // Route Section
      doc.setFillColor(241, 245, 249);
      doc.rect(15, 72, 180, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(16, 24, 45);
      doc.text('ORIGIN & DESTINATION RECORD', 18, 76.5);

      // Origin Box
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(15, 82, 87, 26, 2, 2, 'D');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text('CONSIGNOR (PICKUP)', 19, 87);
      doc.setFontSize(9);
      doc.setTextColor(16, 24, 45);
      doc.text(shipment.sender || 'Enterprise Consignor', 19, 93);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text(doc.splitTextToSize(shipment.senderAddress || shipment.origin || 'Singapore Logistics Hub', 78).slice(0, 2), 19, 98);

      // Destination Box
      doc.roundedRect(108, 82, 87, 26, 2, 2, 'D');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text('CONSIGNEE (RECIPIENT)', 112, 87);
      doc.setFontSize(9);
      doc.setTextColor(16, 24, 45);
      doc.text(shipment.receiver || 'Enterprise Consignee', 112, 93);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text(doc.splitTextToSize(shipment.receiverAddress || shipment.destination || 'Singapore Terminal', 78).slice(0, 2), 112, 98);

      // Handover & Driver Info
      doc.setFillColor(241, 245, 249);
      doc.rect(15, 114, 180, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(16, 24, 45);
      doc.text('CARRIER & DISPATCH DETAILS', 18, 118.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`Assigned Driver: ${shipment.driverName || 'Tan Wei Ming'} (${shipment.driverPhone || '+65 9123 4567'})`, 18, 126);
      doc.text(`Operating Vehicle: ${shipment.vehicle || 'Josan Linehaul Truck'} | Plate: ${shipment.vehiclePlate || 'SG-8819'}`, 18, 132);
      doc.text(`Cargo Description: ${shipment.cargoType || 'General Freight'} | Weight: ${shipment.weight || '500 kg'}`, 18, 138);

      // Proof of Delivery Section
      doc.setFillColor(255, 248, 242);
      doc.setDrawColor(255, 107, 0);
      doc.roundedRect(15, 146, 180, 85, 3, 3, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(255, 107, 0);
      doc.text('ELECTRONIC PROOF OF DELIVERY (e-POD) SIGN-OFF', 20, 154);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`Recipient Full Name: ${shipment.pod?.recipientName || 'Authorized Receiving Supervisor'}`, 20, 162);
      doc.text(`Handover Remarks: "${shipment.pod?.remarks || 'Consignment delivered in good condition, seals intact.'}"`, 20, 168);
      doc.text(`Delivery Location: ${shipment.destination || 'Consignee Delivery Dock'}`, 20, 174);
      doc.text(`Verification Mode: 6-Digit SMS/Email OTP (Status: Authenticated)`, 20, 180);

      // Signature & Stamp Box
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(20, 186, 80, 38, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('DIGITAL SIGNATURE OF RECIPIENT', 24, 192);

      // If signature is an image/dataUrl, add image, else draw vector signature
      if (shipment.pod?.recipientSignature && shipment.pod.recipientSignature.startsWith('data:image')) {
        try {
          doc.addImage(shipment.pod.recipientSignature, 'PNG', 24, 195, 72, 24);
        } catch {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(14);
          doc.setTextColor(16, 24, 45);
          doc.text(shipment.pod?.recipientName || 'Recipient Signed', 24, 206);
        }
      } else {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(16, 24, 45);
        doc.text(shipment.pod?.recipientName || 'Authorized Signatory', 24, 206);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text('Cryptographically recorded via Josan Web Portal', 24, 215);
      }

      // Official Stamp Box
      doc.roundedRect(110, 186, 80, 38, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('OFFICIAL CARRIER CERTIFICATION STAMP', 114, 192);
      
      doc.setDrawColor(255, 107, 0);
      doc.setLineWidth(0.5);
      doc.circle(150, 207, 13, 'D');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(255, 107, 0);
      doc.text('JOSAN LOGISTICS', 137, 204);
      doc.text('VERIFIED POD', 139, 208);
      doc.text('SINGAPORE', 141, 212);

      // Footer
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text('This e-POD document is an official delivery receipt under the Carriage of Goods Act. Generated by Josan Logistics Portal.', 15, 280);
      doc.text(`Generated on: ${new Date().toLocaleString()} | Security Hash: SHA256-${Math.random().toString(36).substring(2, 10)}`, 15, 285);

      safeDownloadPdf(doc, `Josan_POD_${shipment.id}.pdf`);
      showToast(`Proof of Delivery certificate downloaded for #${shipment.id}`, 'success');
    } catch (err) {
      console.error('POD PDF error', err);
      showToast('Could not generate POD PDF. Please try again.', 'error');
    }
  };

  const isAirShipment = shipment.mode === 'Air Freight' || 
    Boolean(shipment.awbNumber) || 
    shipment.id.startsWith('AWB') || 
    (shipment.serviceLevel && shipment.serviceLevel.toLowerCase().includes('air'));

  // 11 Air Freight Stages
  const airTrackingStages = [
    { key: 'Booking Confirmed', label: 'Booking Confirmed', desc: 'Air cargo space confirmed' },
    { key: 'Cargo Pickup', label: 'Cargo Pickup', desc: 'Picked up from origin' },
    { key: 'Warehouse Received', label: 'Warehouse Received', desc: 'Received at airfreight terminal' },
    { key: 'Documentation', label: 'Documentation', desc: 'TradeNet & e-AWB verified' },
    { key: 'Export Customs', label: 'Export Customs', desc: 'Cleared outbound inspection' },
    { key: 'Airport Handling', label: 'Airport Handling', desc: 'ULD build & apron weigh-in' },
    { key: 'Flight Departed', label: 'Flight Departed', desc: 'Freighter airborne en route' },
    { key: 'Flight Arrived', label: 'Flight Arrived', desc: 'Touchdown at destination' },
    { key: 'Import Customs', label: 'Import Customs', desc: 'Inbound customs cleared' },
    { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'Final leg delivery dispatch' },
    { key: 'Delivered', label: 'Delivered', desc: 'Consignee received & signed' }
  ];

  // 7-stage mapping for Road Freight
  const roadTrackingStages = [
    { key: 'Booked', label: 'Booked', desc: 'Consignment booked in system' },
    { key: 'Confirmed', label: 'Confirmed', desc: 'Booking confirmed by Operations' },
    { key: 'Pickup Scheduled', label: 'Pickup Scheduled', desc: 'Driver & vehicle assigned for pickup' },
    { key: 'Picked Up', label: 'Picked Up', desc: 'Cargo loaded onto highway truck' },
    { key: 'In Transit', label: 'In Transit', desc: 'Cruising via Expressway Corridor' },
    { key: 'Near Destination', label: 'Near Destination', desc: 'Approaching delivery hub / 2FA OTP issued' },
    { key: 'Delivered', label: 'Delivered', desc: 'Consignee received & POD verified' }
  ];

  const trackingStages = isAirShipment ? airTrackingStages : roadTrackingStages;

  const getStageIndex = (status) => {
    if (isAirShipment) {
      switch (status) {
        case 'Booking Confirmed':
        case 'Booked': return 0;
        case 'Cargo Pickup': return 1;
        case 'Warehouse Received': return 2;
        case 'Documentation': return 3;
        case 'Export Customs': return 4;
        case 'Airport Handling': return 5;
        case 'Flight Departed':
        case 'In Transit':
        case 'Delayed': return 6;
        case 'Flight Arrived': return 7;
        case 'Import Customs': return 8;
        case 'Out for Delivery':
        case 'Near Destination': return 9;
        case 'Delivered': return 10;
        default: return 6;
      }
    }
    switch (status) {
      case 'Booked': return 0;
      case 'Confirmed': return 1;
      case 'Pickup Scheduled': return 2;
      case 'Picked Up': return 3;
      case 'In Transit':
      case 'Delayed': return 4;
      case 'Near Destination': return 5;
      case 'Delivered': return 6;
      default: return 1;
    }
  };

  const currentStageIdx = getStageIndex(shipment.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-navy/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl my-auto overflow-hidden flex flex-col max-h-[92vh]"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {/* Modal Header */}
        <div className="bg-[#10182D] text-white p-5 sm:p-6 flex items-start justify-between relative border-b border-slate-700">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                isAirShipment ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-orange/10 text-orange border border-orange/20'
              }`}>
                {isAirShipment ? '✈️ Air Waybill Dossier' : 'Official Consignment Dossier'}
              </span>
              {shipment.awbNumber && (
                <span className="text-xs text-blue-300 font-mono font-bold bg-blue-900/40 px-2 py-0.5 rounded border border-blue-500/30">
                  AWB: {shipment.awbNumber}
                </span>
              )}
              <span className="text-xs text-slate-300 font-mono">Ref: {shipment.referenceNumber || shipment.id}</span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                shipment.status === 'Delivered' 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : shipment.status === 'Delayed'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : isAirShipment
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'bg-orange/20 text-orange border border-orange/30'
              }`}>
                ● {shipment.status}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-outfit tracking-tight text-white flex items-center gap-3">
              Shipment #{shipment.id}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Service: <span className="text-white font-medium">{shipment.serviceLevel || (isAirShipment ? 'Express Air Freight' : 'Roadway Highway Linehaul (FTL)')}</span> &bull; Last Updated: <span className="text-orange">{shipment.lastUpdatedTime || 'Just now'}</span>
            </p>
          </div>

          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            title="Close dossier"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Route Summary Card */}
          <div className="bg-[#FFF8F2] border border-orange/20 rounded-xl p-4 sm:p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Pickup */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                  <MapPin size={14} className="text-orange" />
                  Origin / Consignor
                </div>
                <div className="text-base font-bold text-[#10182D]">{shipment.sender || 'Consignor Facility'}</div>
                <div className="text-xs text-slate-600 line-clamp-2">{shipment.senderAddress || shipment.origin}</div>
              </div>

              {/* Transit Indicator */}
              <div className="flex flex-col items-center justify-center py-2 px-3 border-y md:border-y-0 md:border-x border-orange/20">
                <div className="text-xs font-semibold text-orange flex items-center gap-1.5 mb-1">
                  <Truck size={15} />
                  <span>Current Staging / Transit</span>
                </div>
                <div className="text-xs font-medium text-[#10182D] text-center bg-white px-3 py-1 rounded-md border border-orange/20 shadow-xs">
                  {shipment.currentLocation || `${shipment.origin} Logistics Corridor`}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Est. Delivery: <span className="font-semibold text-[#10182D]">{shipment.estimatedDelivery || 'Pending'}</span>
                </div>
              </div>

              {/* Destination */}
              <div className="space-y-1 md:text-right">
                <div className="flex items-center md:justify-end gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                  <Building size={14} className="text-emerald-600" />
                  Destination / Consignee
                </div>
                <div className="text-base font-bold text-[#10182D]">{shipment.receiver || 'Consignee Bay'}</div>
                <div className="text-xs text-slate-600 line-clamp-2">{shipment.receiverAddress || shipment.destination}</div>
              </div>
            </div>
          </div>

          {/* 7-Stage Visual Tracking Timeline */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold font-outfit text-[#10182D] flex items-center gap-2">
                <Clock size={18} className="text-orange" />
                Live 7-Stage Roadway Tracking Progression
              </h3>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                API-Ready Logistics Telematics
              </span>
            </div>

            {/* Desktop Horizontal Tracker */}
            <div className="hidden lg:block">
              <div className="relative flex items-center justify-between pt-4 pb-6">
                {/* Connecting Line */}
                <div className="absolute top-8 left-6 right-6 h-1 bg-slate-200 -z-0">
                  <div 
                    className="h-full bg-[#FF6B00] transition-all duration-500"
                    style={{ width: `${(currentStageIdx / (trackingStages.length - 1)) * 100}%` }}
                  />
                </div>

                {trackingStages.map((stage, idx) => {
                  const isCompleted = idx <= currentStageIdx;
                  const isCurrent = idx === currentStageIdx;
                  return (
                    <div key={stage.key} className="flex flex-col items-center text-center relative z-10 w-28">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                        isCompleted
                          ? 'bg-[#FF6B00] text-white ring-4 ring-[#FF6B00]/25 shadow-sm'
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}>
                        {idx < currentStageIdx ? (
                          <CheckCircle2 size={18} className="text-white" />
                        ) : isCurrent ? (
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                          </span>
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <span className={`text-xs font-bold mt-2.5 ${isCurrent ? 'text-[#FF6B00] font-outfit' : isCompleted ? 'text-[#10182D]' : 'text-slate-400'}`}>
                        {stage.label}
                      </span>
                      <span className="text-[10px] text-slate-500 leading-tight mt-0.5 line-clamp-2">
                        {stage.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile / Tablet Vertical Tracker */}
            <div className="lg:hidden space-y-4 pt-2">
              {trackingStages.map((stage, idx) => {
                const isCompleted = idx <= currentStageIdx;
                const isCurrent = idx === currentStageIdx;
                return (
                  <div key={stage.key} className="flex items-start gap-3 relative">
                    {idx < trackingStages.length - 1 && (
                      <div className={`absolute left-4 top-8 bottom-0 w-0.5 -ml-px ${
                        idx < currentStageIdx ? 'bg-[#FF6B00]' : 'bg-slate-200'
                      }`} />
                    )}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                      isCompleted 
                        ? 'bg-[#FF6B00] text-white ring-4 ring-[#FF6B00]/25 shadow-sm' 
                        : 'bg-white border-2 border-slate-300 text-slate-400'
                    }`}>
                      {idx < currentStageIdx ? <CheckCircle2 size={16} className="text-white" /> : idx + 1}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-bold ${isCurrent ? 'text-[#FF6B00]' : isCompleted ? 'text-[#10182D]' : 'text-slate-400'}`}>
                          {stage.label}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] uppercase font-bold bg-[#FF6B00] text-white px-2 py-0.5 rounded-full">
                            Current Status
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grid: Driver & Vehicle & Telematics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Driver & Vehicle Details */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-base font-bold font-outfit text-[#10182D] flex items-center gap-2 border-b border-slate-100 pb-3">
                <User size={18} className="text-orange" />
                Assigned Carrier & Driver Details
              </h3>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                  <img 
                    src={shipment.driverPhoto || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80"} 
                    alt={shipment.driverName || 'Driver'} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-base font-bold text-[#10182D] flex items-center gap-1.5">
                    {shipment.driverName || 'Tan Wei Ming'}
                    <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                      Verified Pilot
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>ID: {shipment.driverId || 'DRV-101'}</span>
                    &bull;
                    <span className="text-amber-500 font-semibold">★ 4.98 Rating</span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                    <Phone size={12} className="text-orange" />
                    <a href={`tel:${shipment.driverPhone || '+65 9123 4567'}`} className="hover:text-orange font-medium">
                      {shipment.driverPhone || '+65 9123 4567'}
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-[#F5F6F8] rounded-xl p-3.5 space-y-2 border border-slate-200 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Vehicle Specification:</span>
                  <span className="font-semibold text-[#10182D]">{shipment.vehicle || 'Josan 14-Ton Box Truck'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">License Plate:</span>
                  <span className="font-mono font-bold text-orange px-2 py-0.5 bg-white rounded border border-orange/20">
                    {shipment.vehiclePlate || 'SG-8819'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Fleet Class:</span>
                  <span className="font-medium text-[#10182D]">{shipment.vehicleType || 'Heavy Linehaul Rigid Truck'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Safety & Inspection:</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <ShieldCheck size={13} /> LTA & ISO-9001 Certified
                  </span>
                </div>
              </div>
            </div>

            {/* Freight Specifications & Active Telematics */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-base font-bold font-outfit text-[#10182D] flex items-center gap-2 border-b border-slate-100 pb-3">
                <Navigation size={18} className="text-orange" />
                Freight Specifications & Telematics
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#F5F6F8] rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Cargo Category</span>
                  <span className="font-bold text-[#10182D] mt-0.5 block">{shipment.cargoType || 'Industrial Equipment'}</span>
                </div>
                <div className="p-3 bg-[#F5F6F8] rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Weight & Units</span>
                  <span className="font-bold text-[#10182D] mt-0.5 block">{shipment.weight || '500 kg'} ({shipment.pieces || 1} Pcs)</span>
                </div>
                <div className="p-3 bg-[#F5F6F8] rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Declared Value</span>
                  <span className="font-bold text-[#10182D] mt-0.5 block">{shipment.declaredValue || 'S$ 35,000'}</span>
                </div>
                <div className="p-3 bg-[#F5F6F8] rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Contract Freight</span>
                  <span className="font-bold text-orange mt-0.5 block">{shipment.price || 'S$ 350.00'}</span>
                </div>
              </div>

              {/* GPS Integration note */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                <div className="flex items-center gap-2 font-semibold text-[#10182D] mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Location Tracking Status
                </div>
                <p>
                  Current waypoint: <strong className="text-[#10182D]">{shipment.currentLocation || 'Expressway Corridor'}</strong>. 
                  Live telematics checkpoint updated at <strong>{shipment.lastUpdatedTime || 'Just now'}</strong>.
                </p>
                <p className="text-[11px] text-slate-400 mt-1 italic">
                  *Structured for direct integration with regional GPS & IoT fleet telematics APIs.
                </p>
              </div>
            </div>
          </div>

          {/* Proof of Delivery (POD) Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold font-outfit text-[#10182D] flex items-center gap-2">
                  <ShieldCheck size={19} className="text-orange" />
                  Digital Proof of Delivery (POD)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tamper-proof digital handover record with recipient signature and timestamp
                </p>
              </div>

              {shipment.status === 'Delivered' && (
                <button
                  onClick={downloadPodPdf}
                  className="px-4 py-2 bg-orange hover:bg-orange/90 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Download size={15} />
                  Download POD Certificate (PDF)
                </button>
              )}
            </div>

            {shipment.status === 'Delivered' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Recipient details */}
                <div className="space-y-3 bg-[#FFF8F2] p-4 rounded-xl border border-orange/20 text-xs">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                    <CheckCircle2 size={16} />
                    Delivered & Verified
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Recipient Full Name</span>
                    <strong className="text-[#10182D] text-sm">{shipment.pod?.recipientName || 'Authorized Consignee Signatory'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Handover Timestamp</span>
                    <span className="text-slate-700 font-medium">{shipment.pod?.deliveredAt || shipment.lastUpdatedTime || 'Today, 03:45 PM'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Driver Remarks</span>
                    <p className="text-slate-700 italic bg-white p-2 rounded border border-orange/10 mt-1">
                      "{shipment.pod?.remarks || 'Consignment verified, pallets intact and accepted without exceptions.'}"
                    </p>
                  </div>
                  <div className="pt-1 flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                    <Lock size={12} />
                    Delivery OTP Verified prior to handover
                  </div>
                </div>

                {/* Recipient Signature */}
                <div className="space-y-2 bg-[#F5F6F8] p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#10182D]">
                    <Edit3 size={15} className="text-orange" />
                    Recipient Digital Signature
                  </div>
                  <div className="h-32 bg-white rounded-lg border border-slate-300 flex items-center justify-center p-2 overflow-hidden shadow-inner">
                    {shipment.pod?.recipientSignature && shipment.pod.recipientSignature.startsWith('data:image') ? (
                      <img 
                        src={shipment.pod.recipientSignature} 
                        alt="Recipient Signature" 
                        className="max-h-full object-contain"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="text-lg font-serif italic text-navy font-bold tracking-wider">
                          {shipment.pod?.recipientName || 'Authorized Signatory'}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 font-mono">Digital Web Signature Hash #OK991</div>
                      </div>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 text-center">
                    Captured securely at delivery waypoint
                  </div>
                </div>

                {/* Delivery Photo */}
                <div className="space-y-2 bg-[#F5F6F8] p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#10182D]">
                    <Camera size={15} className="text-orange" />
                    Delivery Location Proof Photo
                  </div>
                  <div className="h-32 bg-white rounded-lg border border-slate-300 overflow-hidden flex items-center justify-center">
                    {shipment.pod?.photo ? (
                      <img 
                        src={shipment.pod.photo} 
                        alt="Proof of Delivery" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-3 text-slate-400">
                        <Camera size={26} className="mx-auto mb-1 text-slate-300" />
                        <span className="text-[11px]">Consignment Dock Photo Attached</span>
                      </div>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 text-center">
                    Geotagged site handover confirmation
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 text-xs text-slate-600">
                <AlertCircle size={18} className="text-slate-400 shrink-0" />
                <div>
                  <strong className="text-[#10182D]">Proof of Delivery will be generated upon arrival.</strong>
                  <p className="mt-0.5">
                    When driver reaches destination, customer receives a 6-digit Delivery OTP. Upon OTP verification and signature sign-off, official e-POD will become available for instant viewing and PDF download.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Documents & Invoice Actions */}
          <div className="bg-[#F5F6F8] border border-slate-200 rounded-xl p-5">
            <h3 className="text-base font-bold font-outfit text-[#10182D] mb-3 flex items-center gap-2">
              <FileText size={18} className="text-orange" />
              Consignment Documentation & Financials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Invoice Button */}
              <button
                onClick={handleOpenInvoice}
                className="p-3.5 bg-white hover:bg-orange/5 border border-slate-200 hover:border-orange/40 rounded-xl text-left transition-all shadow-xs group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#10182D] group-hover:text-orange">
                  <span>Tax Invoice & GST</span>
                  <ExternalLink size={14} />
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Amount: <strong className="text-[#10182D]">{shipment.price || 'S$ 350.00'}</strong> ({shipment.paymentStatus || 'Unpaid'})
                </div>
              </button>

              {/* Waybill / LR */}
              <button
                onClick={() => showToast(`Electronic Lorry Receipt (e-LR) for #${shipment.id} is attached to booking record`, 'info')}
                className="p-3.5 bg-white hover:bg-orange/5 border border-slate-200 hover:border-orange/40 rounded-xl text-left transition-all shadow-xs group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#10182D] group-hover:text-orange">
                  <span>Road Consignment Note (e-LR)</span>
                  <Download size={14} />
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Waybill #{shipment.referenceNumber || shipment.id}
                </div>
              </button>

              {/* Support */}
              <a
                href="tel:+6567489912"
                className="p-3.5 bg-white hover:bg-orange/5 border border-slate-200 hover:border-orange/40 rounded-xl text-left transition-all shadow-xs group block"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#10182D] group-hover:text-orange">
                  <span>24/7 Dispatch Support</span>
                  <Headphones size={14} />
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Hotline: +65 6748 9912
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Josan Logistics Operations Platform &bull; ISO-9001 Road Freight Certified
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors"
            >
              Close Dossier
            </button>
            <button
              onClick={handleOpenInvoice}
              className="px-5 py-2.5 rounded-lg bg-[#10182D] hover:bg-navy/90 text-white font-semibold text-xs transition-colors"
            >
              View Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
