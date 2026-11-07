import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { supabase } from '../services/supabase';

// Modular Admin Components (Website, System, Users & Administration)
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { DashboardOverviewTab } from '../components/admin/DashboardOverviewTab';
import { UserManagementTab } from '../components/admin/UserManagementTab';
import { RolesPermissionsTab } from '../components/admin/RolesPermissionsTab';
import { WebsiteContentTab } from '../components/admin/WebsiteContentTab';
import { ServicesManagementTab } from '../components/admin/ServicesManagementTab';
import { NotificationsTab } from '../components/admin/NotificationsTab';
import { SystemReportsTab } from '../components/admin/SystemReportsTab';
import { SettingsTab } from '../components/admin/SettingsTab';
import { CrmQuotationsTab } from '../components/crm/CrmQuotationsTab';

export const AdminDashboardPage = ({ setActiveTab: setParentActiveTab }) => {
  const { 
    systemUsers = [],
    addSystemUser,
    updateSystemUser,
    deleteSystemUser,
    toggleSystemUserStatus,

    crmRolePermissions = {},
    updateRolePermissions,
    updateUserPermissions,

    websiteContent = {},
    updateWebsiteContent,
    addWebsiteFaq,
    updateWebsiteFaq,
    deleteWebsiteFaq,

    managedServices = {},
    toggleManagedService,
    updateManagedService,

    adminActivityLog = [],
    airwayRequests = [],
    shipments = [],

    notifications = [],
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,

    showToast,
    logoutUser,
    currentUser,
    quotes = [],
    customers = [],
    createCrmQuotation,
    sendQuoteToCustomer,
    customerRespondQuote,
    updateAdminQuote
  } = useLogistics();

  // Active admin tab state (defaults to 'overview')
  // Exactly 8 Admin Modules:
  // 1. Dashboard (overview)
  // 2. User Management (users)
  // 3. Roles & Permissions (roles)
  // 4. Website Content (website_content)
  // 5. Services Management (services_management)
  // 6. Notifications (notifications)
  // 7. System Reports (system_reports)
  // 8. Settings (settings)
  const [adminTab, setAdminTab] = useState('overview');
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [selectedQuoteModal, setSelectedQuoteModal] = useState(null);

  // Handle return to customer website
  const handleReturnToPublic = () => {
    if (setParentActiveTab) {
      setParentActiveTab('home');
    } else {
      window.location.href = '/#home';
    }
  };

  // Handle admin logout
  const handleLogout = () => {
    if (logoutUser) logoutUser(true);
    handleReturnToPublic();
  };

  // Select item from search dropdown
  const handleSelectSearchResult = (type, item) => {
    if (type === 'user') {
      setAdminTab('users');
    }
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
      setAdminTab('quotations');
    }
  };

  const badgeCounts = {
    users: systemUsers.length,
    notifications: notifications.filter(n => !n.read_at).length,
    quotes: quotes.filter(q => q.status === 'New').length || quotes.length
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row w-full overflow-x-hidden font-sans">
      {/* 1. SEPARATE ADMIN SIDEBAR */}
      <AdminSidebar
        adminTab={adminTab}
        setAdminTab={setAdminTab}
        counts={badgeCounts}
        onReturnToPublic={handleReturnToPublic}
      />

      {/* 2. ADMIN MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 3. SEPARATE ADMIN HEADER */}
        <AdminHeader
          searchQuery={adminSearchQuery}
          setSearchQuery={setAdminSearchQuery}
          onSelectSearchResult={handleSelectSearchResult}
          notifications={notifications}
          onOpenNotifications={() => setAdminTab('notifications')}
          onNotificationClick={handleNotificationClick}
          onMarkAllNotifsRead={markAllNotificationsAsRead}
          onOpenSettings={() => setAdminTab('settings')}
          onOpenOverview={() => setAdminTab('overview')}
          currentUser={currentUser}
          onLogout={handleLogout}
          systemUsers={systemUsers}
        />

        {/* 4. WORKSPACE TAB CONTAINER */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* TAB 1: DASHBOARD */}
          {adminTab === 'overview' && (
            <DashboardOverviewTab
              systemUsers={systemUsers}
              airwayRequests={airwayRequests}
              shipments={shipments}
              notifications={notifications}
              managedServices={managedServices}
              adminActivityLog={adminActivityLog}
              onNavigateTab={setAdminTab}
            />
          )}

          {/* TAB: QUOTATIONS */}
          {adminTab === 'quotations' && (
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

          {/* TAB 2: USER MANAGEMENT (ADMIN ONLY) */}
          {adminTab === 'users' && (
            <UserManagementTab />
          )}

          {/* TAB 3: ROLES & PERMISSIONS */}
          {adminTab === 'roles' && (
            <RolesPermissionsTab
              crmRolePermissions={crmRolePermissions}
              onUpdateRolePermission={updateRolePermissions}
              systemUsers={systemUsers}
              onUpdateUserPermissions={updateUserPermissions}
            />
          )}

          {/* TAB 4: WEBSITE CONTENT */}
          {adminTab === 'website_content' && (
            <WebsiteContentTab
              websiteContent={websiteContent}
              onUpdateContent={updateWebsiteContent}
              onAddFaq={addWebsiteFaq}
              onUpdateFaq={updateWebsiteFaq}
              onDeleteFaq={deleteWebsiteFaq}
            />
          )}

          {/* TAB 5: SERVICES MANAGEMENT */}
          {adminTab === 'services_management' && (
            <ServicesManagementTab
              managedServices={managedServices}
              onToggleService={toggleManagedService}
              onUpdateService={updateManagedService}
            />
          )}

          {/* TAB 6: NOTIFICATIONS */}
          {adminTab === 'notifications' && (
            <NotificationsTab
              notifications={notifications}
              onMarkAsRead={markNotificationAsRead}
              onMarkAllAsRead={markAllNotificationsAsRead}
              onClearNotifications={clearNotifications}
              onNotificationClick={handleNotificationClick}
            />
          )}

          {/* TAB 7: SYSTEM REPORTS */}
          {adminTab === 'system_reports' && (
            <SystemReportsTab
              systemUsers={systemUsers}
              airwayRequests={airwayRequests}
              shipments={shipments}
              adminActivityLog={adminActivityLog}
            />
          )}

          {/* TAB 8: SETTINGS */}
          {adminTab === 'settings' && (
            <SettingsTab
              onSaveToast={showToast}
            />
          )}
        </main>
      </div>
    </div>
  );
};
