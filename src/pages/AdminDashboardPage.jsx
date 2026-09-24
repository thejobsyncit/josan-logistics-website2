import React, { useState, useEffect, useMemo } from 'react';
import { useLogistics } from '../context/LogisticsContext';

// Modular Admin Components
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { DashboardOverviewTab } from '../components/admin/DashboardOverviewTab';
import { ShipmentsTab } from '../components/admin/ShipmentsTab';
import { AirwayServicesTab } from '../components/admin/AirwayServicesTab';
import { RoadTransportationTab } from '../components/admin/RoadTransportationTab';
import { DocumentationTab } from '../components/admin/DocumentationTab';
import { CustomersTab } from '../components/admin/CustomersTab';
import { TransportationPartnersTab } from '../components/admin/TransportationPartnersTab';
import { ServiceRequestsTab } from '../components/admin/ServiceRequestsTab';
import { ReportsTab } from '../components/admin/ReportsTab';
import { NotificationsTab } from '../components/admin/NotificationsTab';
import { SettingsTab } from '../components/admin/SettingsTab';
import { ShipmentDetailsModal, CreateShipmentModal } from '../components/admin/AdminModals';

export const AdminDashboardPage = ({ setActiveTab: setParentActiveTab }) => {
  const { 
    shipments = [], 
    updateShipmentStatus, 
    addShipment,
    deleteShipment,
    customers = [],
    documents = [],
    uploadShipmentDocument,
    deleteShipmentDocument,
    quotes = [],
    notifications = [],
    markNotificationAsRead,
    markAllNotificationsAsRead,
    showToast,
    logoutUser,
    currentUser
  } = useLogistics();

  // Active admin tab state (defaults to 'overview')
  const [adminTab, setAdminTab] = useState('overview');
  const [adminSearchQuery, setAdminSearchQuery] = useState('');

  // Modals state
  const [selectedDetailShipment, setSelectedDetailShipment] = useState(null);
  const [isCreateShipmentOpen, setIsCreateShipmentOpen] = useState(false);

  // Live Singapore Real-Time Clock
  const [liveDate, setLiveDate] = useState('');
  const [liveTime, setLiveTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setLiveDate(now.toLocaleDateString('en-GB', { 
        weekday: 'short', 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }));
      setLiveTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
      }) + ' SGT');
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Standardized Transportation Partners state (Contracted 3rd-party logistics companies)
  const [transportationPartners, setTransportationPartners] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_transport_partners');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'PRT-101',
        name: 'Woodlands Linehaul Logistics Pte Ltd',
        contactPerson: 'Tan Wei Ming (Partner Lead)',
        phone: '+65 9123 4567',
        email: 'dispatch@woodlandslinehaul.sg',
        vehicleTypes: '14ft Box Trucks, 24ft Heavy Lorries',
        operatingZones: 'Northern & Western Corridors (Woodlands, Jurong, Tuas)',
        agreementStatus: 'Active Partner',
        registeredVehicles: 6,
        designatedDrivers: 8,
        activeDispatches: 3
      },
      {
        id: 'PRT-102',
        name: 'Tuas Prime Haulage Pte Ltd',
        contactPerson: 'Muhammad Rizal (Operations Lead)',
        phone: '+65 8234 5678',
        email: 'ops@tuasprimehaulage.com',
        vehicleTypes: '24ft Lorries, 40ft Prime Movers',
        operatingZones: 'Tuas Mega Port & Heavy Industrial Corridors',
        agreementStatus: 'Active Partner',
        registeredVehicles: 8,
        designatedDrivers: 10,
        activeDispatches: 4
      },
      {
        id: 'PRT-103',
        name: 'Jurong Freight Express Partners',
        contactPerson: 'Gurpreet Singh',
        phone: '+65 9876 5432',
        email: 'express@jurongfreight.sg',
        vehicleTypes: '14ft Box Vans, Curtain-siders',
        operatingZones: 'Central & Jurong Commercial Corridors',
        agreementStatus: 'Active Partner',
        registeredVehicles: 4,
        designatedDrivers: 5,
        activeDispatches: 2
      },
      {
        id: 'PRT-104',
        name: 'Changi Feeder Transport Co.',
        contactPerson: 'Marcus Lim',
        phone: '+65 6543 2100',
        email: 'contact@changifeeder.sg',
        vehicleTypes: '14ft Air Cargo Feeder Box Vans',
        operatingZones: 'Changi Air Cargo Logistics Complex & Airport Transfers',
        agreementStatus: 'Active Partner',
        registeredVehicles: 5,
        designatedDrivers: 6,
        activeDispatches: 3
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('josan_transport_partners', JSON.stringify(transportationPartners));
    } catch (e) {}
  }, [transportationPartners]);

  // Standardized Service Requests state (Inquiries & Customer booking requests)
  const [serviceRequests, setServiceRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_service_requests');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Seed from quotes or defaults
    return [
      {
        id: 'REQ-89210',
        customer: 'Marcus Vance',
        customerName: 'Marcus Vance',
        company: 'TechCorp Solutions SG',
        service: 'Road Transportation',
        email: 'marcus.vance@techcorp.sg',
        phone: '+65 9123 4567',
        date: '2026-09-21',
        message: 'Requires 14-ton highway box truck with hydraulic tailgate for high-tech electronics transfer.',
        status: 'Pending',
        adminNotes: 'Assigned Woodlands Linehaul partner truck #SG-8819.'
      },
      {
        id: 'REQ-74102',
        customer: 'Sarah Lim',
        customerName: 'Sarah Lim',
        company: 'Apex BioPharma Research',
        service: 'Documentation',
        email: 'sarah.lim@biopharma.sg',
        phone: '+65 8123 9876',
        date: '2026-09-20',
        message: 'Customs clearance permit and certificate of origin assistance required for laboratory reagents export.',
        status: 'Under Review',
        adminNotes: 'TradeNet declaration drafted. Awaiting commercial invoice validation.'
      },
      {
        id: 'REQ-61845',
        customer: 'Marcus Lim',
        customerName: 'Marcus Lim',
        company: 'Changi Aviation Cargo Handling',
        service: 'Airway Services',
        email: 'ops@changiair.sg',
        phone: '+65 6543 2100',
        date: '2026-09-19',
        message: 'AWB preparation, terminal handling, and airport feeder transfer for scheduled SQ air cargo.',
        status: 'Quoted',
        adminNotes: 'Singapore Airlines Cargo booking confirmed on flight SQ-782.'
      },
      {
        id: 'REQ-55120',
        customer: 'Tan Wei Ming',
        customerName: 'Tan Wei Ming',
        company: 'Razer Asia-Pacific HQ',
        service: 'Road Transportation',
        email: 'logistics@razer.com',
        phone: '+65 6789 0123',
        date: '2026-09-18',
        message: 'Commercial FTL road transport for high-tech components from Raffles to Jurong Logistics Hub.',
        status: 'Approved',
        adminNotes: 'Converted to active road shipment JOS-88190-SG.'
      },
      {
        id: 'REQ-44910',
        customer: 'Kavita Sharma',
        customerName: 'Kavita Sharma',
        company: 'Singapore Pharma Logistics Hub',
        service: 'Documentation',
        email: 'coldchain@sgpharma.com',
        phone: '+65 6234 5678',
        date: '2026-09-17',
        message: 'Commercial invoice and packing list verification for pharmaceutical consignment.',
        status: 'Completed',
        adminNotes: 'All verification docs archived in Document Vault.'
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('josan_service_requests', JSON.stringify(serviceRequests));
    } catch (e) {}
  }, [serviceRequests]);

  // Standardized document state with confirmed status workflow (Pending → Submitted → Under Review → Completed)
  const [managedDocuments, setManagedDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_documents');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    if (documents.length > 0) return documents;
    return [
      {
        id: 'DOC-88190-01',
        shipmentId: 'JOS-88190-SG',
        customerName: 'Razer Asia-Pacific HQ',
        type: 'Commercial Invoice',
        name: 'Commercial_Invoice_JOS-88190-SG.pdf',
        fileSize: '184 KB',
        uploadDate: '17 Sep 2026',
        status: 'Completed'
      },
      {
        id: 'DOC-88190-02',
        shipmentId: 'JOS-88190-SG',
        customerName: 'Razer Asia-Pacific HQ',
        type: 'Packing List',
        name: 'Packing_List_Pallet_Manifest_88190.pdf',
        fileSize: '95 KB',
        uploadDate: '17 Sep 2026',
        status: 'Completed'
      },
      {
        id: 'DOC-88190-03',
        shipmentId: 'JOS-88190-SG',
        customerName: 'Razer Asia-Pacific HQ',
        type: 'AWB',
        name: 'Air_Waybill_Consignment_Note_88190.pdf',
        fileSize: '120 KB',
        uploadDate: '17 Sep 2026',
        status: 'Submitted'
      },
      {
        id: 'DOC-88190-04',
        shipmentId: 'JOS-88190-SG',
        customerName: 'Razer Asia-Pacific HQ',
        type: 'Customs-related Documents',
        name: 'TradeNet_Clearance_Permit_SG9910.pdf',
        fileSize: '210 KB',
        uploadDate: '17 Sep 2026',
        status: 'Completed'
      },
      {
        id: 'DOC-88190-05',
        shipmentId: 'JOS-88190-SG',
        customerName: 'Razer Asia-Pacific HQ',
        type: 'Insurance Documents',
        name: 'AllRisk_Cargo_Insurance_Policy_88190.pdf',
        fileSize: '315 KB',
        uploadDate: '16 Sep 2026',
        status: 'Under Review'
      },
      {
        id: 'DOC-44021-01',
        shipmentId: 'JOS-44021-SG',
        customerName: 'Singapore Pharma Logistics Hub',
        type: 'Certificate of Origin',
        name: 'Certificate_of_Origin_SG44021.pdf',
        fileSize: '178 KB',
        uploadDate: '17 Sep 2026',
        status: 'Pending'
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('josan_documents', JSON.stringify(managedDocuments));
    } catch (e) {}
  }, [managedDocuments]);

  // Ensure shipments follow confirmed pipeline: New → Documentation → Processing → In Transit → Delivered → Completed
  const standardizedShipments = useMemo(() => {
    return (shipments || []).map(s => {
      // Map legacy statuses to confirmed workflow
      let currentStatus = s.status;
      if (currentStatus === 'Booked') currentStatus = 'New';
      if (currentStatus === 'Confirmed') currentStatus = 'Documentation';
      if (currentStatus === 'Pickup Scheduled') currentStatus = 'Processing';
      if (currentStatus === 'Picked Up') currentStatus = 'Processing';
      if (currentStatus === 'Near Destination') currentStatus = 'In Transit';

      const isAir = s.service === 'Airway Services' || 
        s.serviceType?.toLowerCase().includes('air') || 
        s.type === 'air' ||
        s.mode === 'Air';

      return {
        ...s,
        status: currentStatus,
        service: isAir ? 'Airway Services' : 'Road Transportation',
        awbNumber: s.awbNumber || (isAir ? `AWB-${s.id.replace(/\D/g, '').slice(-7) || '618-29401'}` : null),
        carrierSupport: s.carrierSupport || (isAir ? 'Singapore Airlines Cargo (SQ)' : null),
        transportationPartner: s.transportationPartner || (!isAir ? (s.carrier || 'Woodlands Linehaul Logistics Pte Ltd') : null)
      };
    });
  }, [shipments]);

  // Status update handler for shipments
  const handleUpdateShipmentStatus = (shipmentId, newStatus) => {
    if (updateShipmentStatus) {
      updateShipmentStatus(shipmentId, newStatus);
    }
    if (selectedDetailShipment && selectedDetailShipment.id === shipmentId) {
      setSelectedDetailShipment({
        ...selectedDetailShipment,
        status: newStatus
      });
    }
    if (showToast) {
      showToast(`Shipment #${shipmentId} status updated to ${newStatus}`, 'success');
    }
  };

  // Add new shipment handler
  const handleCreateShipment = (newShipmentData) => {
    if (addShipment) {
      addShipment(newShipmentData);
    }
    if (showToast) {
      showToast(`Consignment #${newShipmentData.id} successfully created!`, 'success');
    }
  };

  // Document upload handler
  const handleUploadDocument = (docData) => {
    const updated = [docData, ...managedDocuments];
    setManagedDocuments(updated);
    if (uploadShipmentDocument) {
      uploadShipmentDocument(docData);
    }
    if (showToast) {
      showToast(`Document "${docData.name}" registered under ${docData.type}.`, 'success');
    }
  };

  // Document status update handler
  const handleUpdateDocStatus = (docId, newStatus) => {
    setManagedDocuments(prev => prev.map(d => d.id === docId ? { ...d, status: newStatus } : d));
    if (showToast) {
      showToast(`Document status changed to ${newStatus}.`, 'success');
    }
  };

  // Document delete handler
  const handleDeleteDocument = (docId) => {
    setManagedDocuments(prev => prev.filter(d => d.id !== docId));
    if (deleteShipmentDocument) {
      deleteShipmentDocument(docId);
    }
    if (showToast) {
      showToast('Document removed from records.', 'info');
    }
  };

  // Service Request status update handler
  const handleUpdateRequestStatus = (reqId, newStatus) => {
    setServiceRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: newStatus } : r));
    if (showToast) {
      showToast(`Service request #${reqId} marked as ${newStatus}.`, 'success');
    }
  };

  // Service Request admin notes handler
  const handleSaveAdminNote = (reqId, noteText) => {
    setServiceRequests(prev => prev.map(r => r.id === reqId ? { ...r, adminNotes: noteText } : r));
    if (showToast) {
      showToast('Admin note saved to request record.', 'success');
    }
  };

  // Transportation Partner add handler
  const handleAddPartner = (partnerData) => {
    setTransportationPartners(prev => [partnerData, ...prev]);
    if (showToast) {
      showToast(`Partner "${partnerData.name}" registered.`, 'success');
    }
  };

  // Navigation from search results
  const handleSelectSearchResult = (type, item) => {
    if (type === 'shipment') {
      setSelectedDetailShipment(item);
    } else if (type === 'customer') {
      setAdminTab('customers');
    } else if (type === 'document') {
      setAdminTab('documentation');
    }
  };

  // Counts for sidebar badges
  const airwayCount = standardizedShipments.filter(s => s.service === 'Airway Services').length;
  const roadCount = standardizedShipments.filter(s => s.service === 'Road Transportation').length;
  const pendingRequestsCount = serviceRequests.filter(r => r.status === 'Pending' || r.status === 'Under Review').length;

  const sidebarCounts = {
    shipments: standardizedShipments.length,
    airway: airwayCount,
    road: roadCount,
    documents: managedDocuments.length,
    customers: customers.length,
    partners: transportationPartners.length,
    requests: pendingRequestsCount,
    notifications: notifications.filter(n => !n.read).length
  };

  // Normalize tab for legacy or direct access
  const normalizedTab = adminTab === 'orders' ? 'shipments'
    : adminTab === 'documents' ? 'documentation'
    : adminTab === 'quotes' ? 'service_requests'
    : adminTab === 'fleet' || adminTab === 'drivers' ? 'transportation_partners'
    : adminTab === 'analytics' ? 'reports'
    : adminTab === 'warehouses' ? 'overview'
    : adminTab;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row font-sans">
      {/* 1. ADMIN SIDEBAR: Exactly the confirmed 11 navigation items */}
      <AdminSidebar
        adminTab={normalizedTab}
        setAdminTab={setAdminTab}
        counts={sidebarCounts}
        onReturnToPublic={() => {
          if (setParentActiveTab) {
            setParentActiveTab('home');
          } else {
            window.location.hash = '#home';
          }
        }}
      />

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
        {/* TOP HEADER: Operations overview & global search (NO tracking search) */}
        <AdminHeader
          searchQuery={adminSearchQuery}
          setSearchQuery={setAdminSearchQuery}
          onSelectSearchResult={handleSelectSearchResult}
          notifications={notifications}
          onOpenNotifications={() => setAdminTab('notifications')}
          onOpenSettings={() => setAdminTab('settings')}
          onOpenOverview={() => setAdminTab('overview')}
          currentUser={currentUser}
          onLogout={() => {
            if (logoutUser) logoutUser();
            if (setParentActiveTab) setParentActiveTab('home');
          }}
          shipments={standardizedShipments}
          customers={customers}
          documents={managedDocuments}
        />

        {/* 3. TAB WORKSPACE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {normalizedTab === 'overview' && (
            <DashboardOverviewTab
              shipments={standardizedShipments}
              serviceRequests={serviceRequests}
              documents={managedDocuments}
              onNavigateTab={(tabKey) => setAdminTab(tabKey)}
              onViewShipment={(s) => setSelectedDetailShipment(s)}
              onViewRequest={(r) => setAdminTab('service_requests')}
              liveDate={liveDate}
              liveTime={liveTime}
            />
          )}

          {/* TAB 2: SHIPMENTS */}
          {normalizedTab === 'shipments' && (
            <ShipmentsTab
              shipments={standardizedShipments}
              onViewShipment={(s) => setSelectedDetailShipment(s)}
              onUpdateStatus={handleUpdateShipmentStatus}
              onCreateShipment={() => setIsCreateShipmentOpen(true)}
            />
          )}

          {/* TAB 3: AIRWAY SERVICES */}
          {normalizedTab === 'airway_services' && (
            <AirwayServicesTab
              shipments={standardizedShipments}
              onViewShipment={(s) => setSelectedDetailShipment(s)}
              onUpdateStatus={handleUpdateShipmentStatus}
            />
          )}

          {/* TAB 4: ROAD TRANSPORTATION */}
          {normalizedTab === 'road_transportation' && (
            <RoadTransportationTab
              shipments={standardizedShipments}
              transportationPartners={transportationPartners}
              onViewShipment={(s) => setSelectedDetailShipment(s)}
              onUpdateStatus={handleUpdateShipmentStatus}
            />
          )}

          {/* TAB 5: DOCUMENTATION */}
          {normalizedTab === 'documentation' && (
            <DocumentationTab
              documents={managedDocuments}
              onUploadDocument={handleUploadDocument}
              onUpdateDocStatus={handleUpdateDocStatus}
              onDeleteDocument={handleDeleteDocument}
              onViewDocument={(d) => showToast(`Opening ${d.name}`, 'info')}
            />
          )}

          {/* TAB 6: CUSTOMERS */}
          {normalizedTab === 'customers' && (
            <CustomersTab
              customers={customers}
              shipments={standardizedShipments}
              serviceRequests={serviceRequests}
              documents={managedDocuments}
              onViewShipment={(s) => setSelectedDetailShipment(s)}
              onViewRequest={(r) => setAdminTab('service_requests')}
            />
          )}

          {/* TAB 7: TRANSPORTATION PARTNERS */}
          {normalizedTab === 'transportation_partners' && (
            <TransportationPartnersTab
              partners={transportationPartners}
              onAddPartner={handleAddPartner}
            />
          )}

          {/* TAB 8: SERVICE REQUESTS */}
          {normalizedTab === 'service_requests' && (
            <ServiceRequestsTab
              requests={serviceRequests}
              onUpdateRequestStatus={handleUpdateRequestStatus}
              onSaveAdminNote={handleSaveAdminNote}
            />
          )}

          {/* TAB 9: REPORTS */}
          {normalizedTab === 'reports' && (
            <ReportsTab
              shipments={standardizedShipments}
              serviceRequests={serviceRequests}
              documents={managedDocuments}
            />
          )}

          {/* TAB 10: NOTIFICATIONS */}
          {normalizedTab === 'notifications' && (
            <NotificationsTab
              notifications={notifications}
              onMarkAsRead={markNotificationAsRead}
              onMarkAllAsRead={markAllNotificationsAsRead}
            />
          )}

          {/* TAB 11: SETTINGS */}
          {normalizedTab === 'settings' && (
            <SettingsTab
              onSaveToast={(msg, type) => showToast && showToast(msg, type)}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {selectedDetailShipment && (
        <ShipmentDetailsModal
          shipment={selectedDetailShipment}
          onClose={() => setSelectedDetailShipment(null)}
          onUpdateStatus={handleUpdateShipmentStatus}
        />
      )}

      {isCreateShipmentOpen && (
        <CreateShipmentModal
          isOpen={isCreateShipmentOpen}
          onClose={() => setIsCreateShipmentOpen(false)}
          onCreateShipment={handleCreateShipment}
          partners={transportationPartners}
        />
      )}
    </div>
  );
};
