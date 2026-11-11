import React, { useState, useEffect, useMemo } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { supabase } from '../services/supabase';

// Modular CRM Components
import { CrmSidebar, CRM_TABS } from '../components/crm/CrmSidebar';
import { CrmHeader } from '../components/crm/CrmHeader';
import { CrmDashboardTab } from '../components/crm/CrmDashboardTab';
import { CrmCustomersTab } from '../components/crm/CrmCustomersTab';
import { CrmAirwayRequestsTab } from '../components/crm/CrmAirwayRequestsTab';
import { CrmRoadShipmentsTab } from '../components/crm/CrmRoadShipmentsTab';
import { CrmDocumentsTab } from '../components/crm/CrmDocumentsTab';
import { CrmQuotationsTab } from '../components/crm/CrmQuotationsTab';
import { CrmBillingTab } from '../components/crm/CrmBillingTab';
import { CrmTransportationPartnersTab } from '../components/crm/CrmTransportationPartnersTab';
import { CrmNotificationsTab } from '../components/crm/CrmNotificationsTab';
import { CrmReportsTab } from '../components/crm/CrmReportsTab';
import { CrmSettingsTab } from '../components/crm/CrmSettingsTab';

export const CrmPage = ({ setActiveTab: setParentActiveTab }) => {
  const {
    customers = [],
    addCustomer,
    updateCustomer,
    deleteCustomer,

    airwayRequests = [],
    addAirwayRequest,
    updateAirwayRequestStatus,
    updateAirwayRequestNotes,

    shipments = [],
    addShipment,
    updateShipmentStatus,

    documents = [],
    addDocument,
    uploadShipmentDocument,
    deleteShipmentDocument,
    updateDocumentStatus,

    quotes = [],
    createCrmQuotation,
    updateAdminQuote,
    sendQuoteToCustomer,
    customerRespondQuote,

    invoices = [],
    addInvoice,
    updateInvoicePaymentStatus,

    transportationPartners = [],
    addTransportationPartner,
    updateTransportationPartner,
    deleteTransportationPartner,
    assignPartnerToShipment,

    notifications = [],
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,

    currentUser,
    logoutUser,
    showToast
  } = useLogistics();

  // Active CRM Sidebar Tab (defaults to 'dashboard')
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sidebar Layout State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Global Universal Search Query
  const [globalSearch, setGlobalSearch] = useState('');

  // Selected entities for quick detail viewing from search or dashboard
  const [selectedAirwayModal, setSelectedAirwayModal] = useState(null);
  const [selectedRoadModal, setSelectedRoadModal] = useState(null);
  const [selectedCustomerModal, setSelectedCustomerModal] = useState(null);
  const [selectedInvoiceModal, setSelectedInvoiceModal] = useState(null);
  const [selectedDocModal, setSelectedDocModal] = useState(null);
  const [selectedQuoteModal, setSelectedQuoteModal] = useState(null);

  // Global Quick Action triggers for header
  const [triggerNewAirway, setTriggerNewAirway] = useState(false);
  const [triggerNewRoad, setTriggerNewRoad] = useState(false);
  const [triggerNewQuote, setTriggerNewQuote] = useState(false);
  const [triggerNewCustomer, setTriggerNewCustomer] = useState(false);
  const [triggerUploadDoc, setTriggerUploadDoc] = useState(false);

  // Tab Title calculation
  const currentTabObj = CRM_TABS.find(t => t.id === activeTab);
  const activeTabTitle = currentTabObj?.label || 'Dashboard';

  // Badge counts for sidebar
  const badgeCounts = useMemo(() => {
    return {
      customers: customers.length,
      airway: airwayRequests.filter(r => r.status === 'New' || r.status === 'Under Review').length,
      road: shipments.filter(s =>!['Delivered','Completed','Cancelled'].includes(s.status)).length,
      docs: documents.length,
      quotes: quotes.filter(q => q.status === 'New').length,
      billing: invoices.filter(i => i.paymentStatus === 'Unpaid' || i.paymentStatus === 'Pending').length,
      partners: transportationPartners.length,
      notifs: notifications.filter(n => !n.read_at).length
    };
  }, [customers, airwayRequests, shipments, documents, quotes, invoices, transportationPartners, notifications]);

  // Handlers for switching tabs with deep-link entity selection
  const handleOpenAirwayDetails = (req) => {
    setSelectedAirwayModal(req);
    setActiveTab('airway-requests');
  };

  const handleOpenRoadDetails = (shipment) => {
    setSelectedRoadModal(shipment);
    setActiveTab('road-shipments');
  };

  const handleOpenCustomerDetails = (cust) => {
    setSelectedCustomerModal(cust);
    setActiveTab('customers');
  };

  const handleOpenInvoiceDetails = (inv) => {
    setSelectedInvoiceModal(inv);
    setActiveTab('billing');
  };

  const handleNotificationClick = async (n) => {
    if (!n) return;
    if (markNotificationAsRead) {
      await markNotificationAsRead(n.id);
    }
    if (n.link) {
      const match = (n.body || '').match(/Reference\s+([A-Za-z0-9-_]+)/i);
      const ref = match ? match[1] : (n.quoteId || n.reference || null);
      let targetQuote = quotes.find(q => (ref && (q.reference === ref || q.referenceNumber === ref || q.id === ref)) || (n.quoteId && q.id === n.quoteId));
      if (!targetQuote && ref) {
        try {
          const { data: dbQuote } = await supabase
            .from('quote_requests')
            .select('*')
            .or(`reference.eq.${ref},id.eq.${ref}`)
            .maybeSingle();
          if (dbQuote) {
            targetQuote = {
              id: dbQuote.id,
              reference: dbQuote.reference,
              referenceNumber: dbQuote.reference,
              service: dbQuote.service_type === 'AIR_FREIGHT_DOCS'
                ? 'Air Freight Documentation Support'
                : dbQuote.service_type === 'ROAD_TRANSPORT'
                  ? 'Commercial Road Transportation Coordination'
                  : 'Shipment Documentation Support',
              customerName: dbQuote.contact_name,
              company: dbQuote.company_name || dbQuote.contact_name,
              customerEmail: dbQuote.contact_email,
              customerPhone: dbQuote.contact_phone,
              origin: dbQuote.pickup_location || 'Singapore',
              destination: dbQuote.delivery_location || 'Singapore',
              status: dbQuote.status || 'New',
              amount: dbQuote.quoted_amount,
              quoted_amount: dbQuote.quoted_amount,
              cargoCategory: dbQuote.cargo_classification,
              notes: dbQuote.cargo_description,
              adminNotes: dbQuote.admin_notes,
              createdAt: dbQuote.created_at,
              created_at: dbQuote.created_at
            };
          }
        } catch (_) {}
      }
      setSelectedQuoteModal(targetQuote || { id: ref || 'quote', reference: ref || 'Quotation', status: 'New' });
      setActiveTab('quotations');
    } else {
      if (n.type?.includes('airway')) setActiveTab('airway-requests');
      else if (n.type?.includes('partner') || n.type?.includes('shipment')) setActiveTab('road-shipments');
      else if (n.type?.includes('quote')) setActiveTab('quotations');
      else if (n.type?.includes('billing')) setActiveTab('billing');
      else setActiveTab('notifications');
    }
  };

  const activeUser = currentUser || (() => {
    try {
      return JSON.parse(localStorage.getItem('josan_staff_user') || localStorage.getItem('josan_user') || 'null');
    } catch (e) {
      return null;
    }
  })();

  // Guard against unauthenticated access
  useEffect(() => {
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem('josan_staff_user') || localStorage.getItem('josan_user') || 'null');
    } catch (e) {}
    const effectiveStaff = activeUser || saved;
    if (!effectiveStaff) {
      if (setParentActiveTab) {
        setParentActiveTab('staff-login');
      } else if (typeof window !== 'undefined') {
        window.location.hash = '#staff-login';
      }
    }
  }, [activeUser, setParentActiveTab]);

  const handleBackToWebsite = () => {
    if (setParentActiveTab) {
      setParentActiveTab('home');
    } else {
      window.location.href = '/#home';
    }
  };

  const handleLogout = () => {
    if (logoutUser) logoutUser(false);
    if (setParentActiveTab) {
      setParentActiveTab('staff-login');
    }
    if (typeof window !== 'undefined') {
      window.location.hash = '#staff-login';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-slate-900 flex w-full overflow-x-hidden font-sans">
      {/* 1. SEPARATE CRM SIDEBAR */}
      <CrmSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        badgeCounts={badgeCounts}
        currentUser={activeUser}
        onLogout={handleLogout}
        onBackToWebsite={handleBackToWebsite}
      />

      {/* 2. MAIN CONTENT WRAPPER */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
        }`}
      >
        {/* 3. SEPARATE CRM TOP HEADER */}
        <CrmHeader
          activeTab={activeTab}
          activeTabTitle={activeTabTitle}
          setMobileOpen={setMobileSidebarOpen}
          onOpenNewAirway={() => { setActiveTab('airway-requests'); }}
          onOpenNewRoad={() => { setActiveTab('road-shipments'); }}
          onOpenNewQuote={() => { setActiveTab('quotations'); }}
          onOpenNewCustomer={() => { setActiveTab('customers'); }}
          onOpenUploadDoc={() => { setActiveTab('documents'); }}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
          notifications={notifications}
          unreadNotifCount={badgeCounts.notifs}
          onNotificationClick={handleNotificationClick}
          onMarkAllNotifsRead={markAllNotificationsAsRead}
          onBackToWebsite={handleBackToWebsite}
          currentUser={activeUser}
        />

        {/* 4. WORKSPACE TAB CONTAINER */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Universal Search Results Banner (if active search) */}
          {globalSearch.trim() && (
            <div className="bg-[#EAF2FF] border border-[#DCE5F0] rounded-2xl p-4 flex items-center justify-between text-xs text-orange-900 animate-fade-in">
              <div>
                <span className="font-extrabold">Filtering by universal search: </span>
                <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-[#DCE5F0] ml-1">
                  "{globalSearch}"
                </span>
              </div>
              <button
                type="button"
                onClick={() => setGlobalSearch('')}
                className="font-extrabold text-[#2463EB] hover:underline cursor-pointer"
              >
                Clear Search Filter
              </button>
            </div>
          )}

          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <CrmDashboardTab
              customers={customers}
              airwayRequests={airwayRequests}
              shipments={shipments}
              documents={documents}
              quotes={quotes}
              invoices={invoices}
              transportationPartners={transportationPartners}
              onNavigateTab={setActiveTab}
              onOpenAirwayDetails={handleOpenAirwayDetails}
              onOpenRoadDetails={handleOpenRoadDetails}
              onOpenCustomerDetails={handleOpenCustomerDetails}
              onOpenInvoiceDetails={handleOpenInvoiceDetails}
            />
          )}

          {/* TAB 2: CUSTOMERS */}
          {activeTab === 'customers' && (
            <CrmCustomersTab
              customers={customers}
              airwayRequests={airwayRequests}
              shipments={shipments}
              documents={documents}
              invoices={invoices}
              onAddCustomer={addCustomer}
              onUpdateCustomer={updateCustomer}
              onDeleteCustomer={deleteCustomer}
              selectedCustomerFromSearch={selectedCustomerModal}
            />
          )}

          {/* TAB 3: AIRWAY REQUESTS */}
          {activeTab === 'airway-requests' && (
            <CrmAirwayRequestsTab
              airwayRequests={airwayRequests}
              onUpdateStatus={updateAirwayRequestStatus}
              onUpdateNotes={updateAirwayRequestNotes}
              onAddRequest={addAirwayRequest}
              selectedRequestFromSearch={selectedAirwayModal}
            />
          )}

          {/* TAB 4: ROAD SHIPMENTS */}
          {activeTab === 'road-shipments' && (
            <CrmRoadShipmentsTab
              shipments={shipments}
              transportationPartners={transportationPartners}
              documents={documents}
              onUpdateStatus={updateShipmentStatus}
              onAssignPartner={assignPartnerToShipment}
              onUpdateNotes={(id, notes) => {
                showToast(`Saved note for road shipment #${id}`, 'success');
              }}
              onAddShipment={addShipment}
              selectedShipmentFromSearch={selectedRoadModal}
            />
          )}

          {/* TAB 5: SHIPMENT DOCUMENTS */}
          {activeTab === 'documents' && (
            <CrmDocumentsTab
              documents={documents}
              customers={customers}
              airwayRequests={airwayRequests}
              shipments={shipments}
              onUploadDocument={addDocument || uploadShipmentDocument}
              onDeleteDocument={deleteShipmentDocument}
              onUpdateDocumentStatus={updateDocumentStatus}
              selectedDocFromSearch={selectedDocModal}
            />
          )}

          {/* TAB 6: QUOTATIONS */}
          {activeTab === 'quotations' && (
            <CrmQuotationsTab
              quotes={quotes}
              customers={customers}
              airwayRequests={airwayRequests}
              shipments={shipments}
              onCreateQuotation={createCrmQuotation}
              onSendQuote={sendQuoteToCustomer}
              onUpdateQuoteStatus={customerRespondQuote}
              onUpdateQuotePricing={updateAdminQuote}
              onConvertQuote={() => {}}
              selectedQuoteFromSearch={selectedQuoteModal}
            />
          )}

          {/* TAB 7: BILLING */}
          {activeTab === 'billing' && (
            <CrmBillingTab
              invoices={invoices}
              customers={customers}
              airwayRequests={airwayRequests}
              shipments={shipments}
              onCreateInvoice={addInvoice}
              onUpdatePaymentStatus={updateInvoicePaymentStatus}
              selectedInvoiceFromSearch={selectedInvoiceModal}
            />
          )}

          {/* TAB 8: TRANSPORTATION PARTNERS */}
          {activeTab === 'transportation-partners' && (
            <CrmTransportationPartnersTab
              partners={transportationPartners}
              shipments={shipments}
              onAddPartner={addTransportationPartner}
              onUpdatePartner={updateTransportationPartner}
              onDeletePartner={deleteTransportationPartner}
              onAssignPartnerToShipment={assignPartnerToShipment}
            />
          )}

          {/* TAB 9: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <CrmNotificationsTab
              notifications={notifications}
              onMarkAsRead={markNotificationAsRead}
              onMarkAllAsRead={markAllNotificationsAsRead}
              onClearNotifications={clearNotifications}
              onNavigateTab={setActiveTab}
              onNotificationClick={handleNotificationClick}
            />
          )}

          {/* TAB 10: REPORTS */}
          {activeTab === 'reports' && (
            <CrmReportsTab
              airwayRequests={airwayRequests}
              shipments={shipments}
              invoices={invoices}
              customers={customers}
              transportationPartners={transportationPartners}
            />
          )}

          {/* TAB 11: SETTINGS */}
          {activeTab === 'settings' && (
            <CrmSettingsTab
              currentUser={currentUser}
              showToast={showToast}
            />
          )}
        </main>
      </div>
    </div>
  );
};
