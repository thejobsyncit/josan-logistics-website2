import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  initialShipments, 
  initialDrivers, 
  initialWarehouses, 
  analyticsData,
  initialQuotes,
  initialNotifications,
  initialCustomers,
  initialDocuments,
  initialInvoices,
  initialTickets,
  initialLeads,
  initialCommunications,
  initialTasks,
  initialTransportationPartners,
  initialShipmentEvents
} from '../data/mockData';
import {
  initialCargoPricing,
  initialSystemUsers,
  initialCrmRolePermissions,
  initialWebsiteContent,
  initialManagedServices,
  initialAdminActivityLog,
  calculateCargoPricingHelper
} from '../data/adminCrmData';
import { backendApi } from '../services/api';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { supabaseApi } from '../services/supabaseApi';
import { fetchServerShipmentReference } from '../utils/referenceApi';

// Helper to deduplicate notifications and strip seed/test data
export const deduplicateNotifications = (list) => {
  if (!Array.isArray(list)) return [];

  const seenQuotes = new Set();
  const seenAirwayRoutes = new Set();
  const seenExact = new Set();
  const result = [];

  for (const n of list) {
    if (!n) continue;

    const title = (n.title || '').trim();
    const msg = (n.message || '').trim();
    const id = (n.id || '').toLowerCase();

    // 1. Filter out legacy or invalid test/seeded notifications
    if (
      id.startsWith('notif-0') ||
      title.toLowerCase().includes('test') ||
      msg.toLowerCase().includes('test')
    ) {
      continue;
    }

    // 2. Extract quote reference (e.g. #QR-AV8X-4VDM, QR-AV8X-4VDM, or n.quoteId)
    const quoteMatch = (n.quoteId || (title + ' ' + msg)).match(/#?([A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+|[A-Z0-9]+-[0-9]{4,})/i);
    const quoteKey = quoteMatch ? quoteMatch[1].toUpperCase() : (n.quoteId ? String(n.quoteId).toUpperCase() : null);

    if (quoteKey) {
      if (seenQuotes.has(quoteKey)) {
        continue; // duplicate quote notification
      }
      seenQuotes.add(quoteKey);
    }

    // 3. Airway vs Quote route duplicate matching (e.g. identical route and customer)
    const arrowParts = msg.split(/→|->|to/i);
    if (arrowParts.length >= 2) {
      const orig = arrowParts[0].slice(-25).trim().toLowerCase();
      const dest = arrowParts[1].slice(0, 25).trim().toLowerCase();
      if (orig.length > 3 && dest.length > 3) {
        const routeKey = orig + ':::' + dest;
        if (seenAirwayRoutes.has(routeKey)) {
          continue; // duplicate submission across airway & quote
        }
        seenAirwayRoutes.add(routeKey);
      }
    }

    // 4. Exact duplicate check (title + message)
    const exactKey = title + ':::' + msg;
    if (seenExact.has(exactKey)) {
      continue;
    }
    seenExact.add(exactKey);

    result.push(n);
  }

  return result;
};

const LogisticsContext = createContext();

export const LogisticsProvider = ({ children }) => {
  // Load state from localStorage or initial mock data
  const [shipments, setShipments] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_shipments');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Retain only domestic Singapore roadways freight shipments
        const domesticOnly = (parsed || []).filter((s) => {
          if (!s || !s.id) return false;
          // Filter out legacy non-domestic dummy shipments
          if (
            s.id.endsWith('-EU') ||
            s.id.endsWith('-IN') ||
            s.id.endsWith('-UK') ||
            s.id.endsWith('-US') ||
            s.id.includes('-EU') ||
            s.id.includes('-IN') ||
            s.id.includes('-UK') ||
            s.id.includes('-US')
          ) {
            return false;
          }
          if (
            s.origin?.includes('Germany') ||
            s.origin?.includes('Noida') ||
            s.origin?.includes('Edinburgh') ||
            s.destination?.includes('Rotterdam') ||
            s.destination?.includes('Mumbai') ||
            s.destination?.includes('London')
          ) {
            return false;
          }
          return true;
        });

        // If user already booked domestic orders (like JOS-17133-SG), keep them!
        if (domesticOnly.length > 0) {
          return domesticOnly;
        }
      }
      return initialShipments;
    } catch (e) {
      return initialShipments;
    }
  });

  // Sync sanitized domestic shipments back to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('josan_shipments', JSON.stringify(shipments));
    } catch (e) {}
  }, [shipments]);

  const [drivers, setDrivers] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_drivers');
      return saved ? JSON.parse(saved) : initialDrivers;
    } catch (e) {
      return initialDrivers;
    }
  });

  const [warehouses, setWarehouses] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_warehouses');
      return saved ? JSON.parse(saved) : initialWarehouses;
    } catch (e) {
      return initialWarehouses;
    }
  });

  // Quotation Management State
  const [quotes, setQuotes] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_quotes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(q => ({
            ...q,
            staffPriced: q.staffPriced === true ? true : false,
            total: q.staffPriced === true ? (q.total ?? q.amount) : null,
            amount: q.staffPriced === true ? (q.amount ?? q.total) : null,
            status: !q.staffPriced && q.status === 'Draft' ? 'Requested' : (q.status || 'Requested')
          }));
        }
      }
      // Fallback: check josan_admin_quote_requests archive
      const archive = localStorage.getItem('josan_admin_quote_requests');
      if (archive) {
        const parsedArchive = JSON.parse(archive);
        if (Array.isArray(parsedArchive) && parsedArchive.length > 0) {
          return parsedArchive.map(req => ({
            id: req.id || req.referenceNumber,
            referenceNumber: req.referenceNumber || req.id,
            requestId: req.referenceNumber || req.id,
            customerName: req.contactName || 'Customer',
            customerEmail: req.contactEmail || '',
            customerPhone: req.contactPhone || '',
            company: req.contactCompany || 'Commercial Shipper',
            origin: req.pickupAddress || 'Singapore',
            destination: req.deliveryAddress || 'Destination',
            service: req.service || (req.serviceCategory === 'air-freight' ? 'Air Freight Documentation Support' : req.serviceCategory === 'road-transport' ? 'Commercial Road Transportation Coordination' : 'Shipment Documentation Support'),
            cargoCategory: req.cargoCategory || 'General Commercial Cargo',
            cargoWeight: req.cargoWeight || 100,
            status: req.isTest ? 'Test' : 'Requested',
            isTest: Boolean(req.isTest),
            createdAt: req.singaporeTime || new Date().toLocaleString(),
            staffPriced: false,
            amount: null,
            total: null,
            lineItems: null
          }));
        }
      }
      return initialQuotes.map(q => ({ ...q, staffPriced: false, total: null, amount: null }));
    } catch (e) {
      return initialQuotes;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('josan_quotes', JSON.stringify(quotes));
    } catch (e) {}
  }, [quotes]);

  // Airway Service Requests State (AWB Preparation, Billing, Documentation, Transportation Support)
  const [airwayRequests, setAirwayRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_airway_requests');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'AIR-0001',
        customerName: 'Marcus Lim',
        company: 'Changi Aviation Logistics Pte Ltd',
        email: 'ops@changiaviation.sg',
        phone: '+65 6543 2100',
        receiverName: 'Somchai Prasert',
        receiverCompany: 'Bangkok Air Logistics Co., Ltd',
        receiverEmail: 'import@bangkokairlogistics.co.th',
        receiverPhone: '+66 2 134 8888',
        incoterm: 'FOB',
        origin: 'SIN - Singapore Changi Airport (Air Cargo Complex)',
        destination: 'BKK - Bangkok Suvarnabhumi Airport',
        cargoDescription: 'Precision aircraft avionics replacement components & calibration units',
        packagesCount: '4 wooden crates',
        totalWeight: '320 kg',
        dimensions: '120 x 80 x 75 cm per crate',
        approximateValue: 'SGD 45,000',
        services: ['AWB Preparation', 'AWB Billing', 'Shipment Documentation', 'Transportation Support'],
        documents: [
          { name: 'Commercial_Invoice_Avionics_001.pdf', type: 'Commercial Invoice', size: '245 KB' },
          { name: 'Packing_List_Crates_1-4.pdf', type: 'Packing List', size: '110 KB' },
          { name: 'Certificate_of_Origin_SG_Avionics.pdf', type: 'Certificate of Origin', size: '180 KB' }
        ],
        date: '2026-09-24',
        status: 'Under Review',
        adminNotes: 'IATA master AWB draft prepared with Singapore Airlines Cargo (SQ). Validated shipper export code.'
      },
      {
        id: 'AIR-0002',
        customerName: 'Elena Rostova',
        company: 'BioPharma Asia Express',
        email: 'supplychain@biopharma-asia.com',
        phone: '+65 8234 5678',
        receiverName: 'Kenji Takahashi',
        receiverCompany: 'Narita Clinical Distribution KK',
        receiverEmail: 'k.takahashi@naritaclinical.co.jp',
        receiverPhone: '+81 3 5555 0142',
        incoterm: 'FOB',
        origin: 'HarbourFront Biomedical Hub, Singapore',
        destination: 'NRT - Tokyo Narita International Airport',
        cargoDescription: 'Temperature-controlled diagnostic reagents & cold-chain test kits',
        packagesCount: '12 insulated cartons',
        totalWeight: '185 kg',
        dimensions: '50 x 50 x 40 cm',
        approximateValue: 'SGD 28,000',
        services: ['AWB Preparation', 'Shipment Documentation'],
        documents: [
          { name: 'Biopharma_Commercial_Invoice.pdf', type: 'Commercial Invoice', size: '320 KB' },
          { name: 'Cold_Chain_Certificate_Of_Origin.pdf', type: 'Certificate of Origin', size: '195 KB' }
        ],
        date: '2026-09-23',
        status: 'Documentation',
        adminNotes: 'Chemical export clearance permit attached.'
      },
      {
        id: 'AIR-0003',
        customerName: 'Darren Koh',
        company: 'Razer Global Supply Solutions',
        email: 'logistics.sg@razer.com',
        phone: '+65 6789 0123',
        receiverName: 'Min-Jun Park',
        receiverCompany: 'Seoul E-Sports Hardware Hub',
        receiverEmail: 'park.mj@seoulelectronics.co.kr',
        receiverPhone: '+82 2 3456 7890',
        incoterm: 'FOB',
        origin: 'Raffles Logistics Bay, Singapore',
        destination: 'ICN - Seoul Incheon Airport',
        cargoDescription: 'High-end gaming microprocessor prototype samples',
        packagesCount: '2 secure palletized boxes',
        totalWeight: '95 kg',
        dimensions: '80 x 60 x 50 cm',
        approximateValue: 'SGD 62,000',
        services: ['AWB Preparation', 'AWB Billing', 'Transportation Support'],
        documents: [
          { name: 'Razer_Commercial_Invoice_KR.pdf', type: 'Commercial Invoice', size: '185 KB' },
          { name: 'Dangerous_Goods_Exemption_Declaration.pdf', type: 'Other Shipment Documents', size: '140 KB' }
        ],
        date: '2026-09-22',
        status: 'Billing',
        adminNotes: 'AWB billing invoice sent to customer finance department.'
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('josan_airway_requests', JSON.stringify(airwayRequests));
    } catch (e) {}
  }, [airwayRequests]);

  // Website Notification System State
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
          return deduplicateNotifications(parsed);
      }
      return [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('josan_notifications', JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  // Phase 3: Customers Directory
  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_customers');
      return saved ? JSON.parse(saved) : initialCustomers;
    } catch (e) {
      return initialCustomers;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('josan_customers', JSON.stringify(customers));
    } catch (e) {}
  }, [customers]);

  // Phase 3: Linked Shipment Documents
  const [documents, setDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_documents');
      return saved ? JSON.parse(saved) : initialDocuments;
    } catch (e) {
      return initialDocuments;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('josan_documents', JSON.stringify(documents));
    } catch (e) {}
  }, [documents]);

  // Phase 3: Invoices & Billing
  const [invoices, setInvoices] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_invoices');
      return saved ? JSON.parse(saved) : initialInvoices;
    } catch (e) {
      return initialInvoices;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('josan_invoices', JSON.stringify(invoices));
    } catch (e) {}
  }, [invoices]);

  // Phase 3: Support Tickets System
  const [tickets, setTickets] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_tickets');
      return saved ? JSON.parse(saved) : initialTickets;
    } catch (e) {
      return initialTickets;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('josan_tickets', JSON.stringify(tickets));
    } catch (e) {}
  }, [tickets]);

  // Transportation Partners (Contracted Commercial Roadway Haulers)
  const [transportationPartners, setTransportationPartners] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_transport_partners');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialTransportationPartners;
  });

  useEffect(() => {
    try {
      localStorage.setItem('josan_transport_partners', JSON.stringify(transportationPartners));
    } catch (e) {}
  }, [transportationPartners]);

  // CRM Module: Leads & Pipeline
  const [leads, setLeads] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_leads');
      return saved ? JSON.parse(saved) : initialLeads;
    } catch (e) {
      return initialLeads;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('josan_leads', JSON.stringify(leads));
    } catch (e) {}
  }, [leads]);

  // CRM Module: Communications Log
  const [communications, setCommunications] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_communications');
      return saved ? JSON.parse(saved) : initialCommunications;
    } catch (e) {
      return initialCommunications;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('josan_communications', JSON.stringify(communications));
    } catch (e) {}
  }, [communications]);

  // CRM Module: Tasks & Follow-ups
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_tasks');
      return saved ? JSON.parse(saved) : initialTasks;
    } catch (e) {
      return initialTasks;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('josan_tasks', JSON.stringify(tasks));
    } catch (e) {}
  }, [tasks]);

  // Global Shipment Details Modal/View
  const [selectedDetailShipment, setSelectedDetailShipment] = useState(null);

  // --- ADMIN PORTAL & CRM STATE MODULES ---

  // 1. CRM Cargo & Pricing Module
  const [cargoPricing, setCargoPricing] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_cargo_pricing');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialCargoPricing;
  });

  useEffect(() => {
    try {
      localStorage.setItem('josan_cargo_pricing', JSON.stringify(cargoPricing));
    } catch (e) {}
  }, [cargoPricing]);

  const sanitizeActivityLogs = (logs) => {
    if (!Array.isArray(logs)) return [];
    return logs.filter(log => {
      const u = String(log?.user || '').toLowerCase();
      const a = String(log?.action || '').toLowerCase();
      const d = String(log?.details || '').toLowerCase();
      if (u.includes('alexander') || (u.includes('josan') && !u.includes('@'))) return false;
      if (a.includes('cargo pricing verified') || a.includes('system initialized')) return false;
      if (d.includes('cargo pricing verified') || d.includes('6 standardized cargo')) return false;
      if (log?.id === 'act-101' || log?.id === 'act-102') return false;
      return true;
    });
  };

  // 2. Admin System Activity Audit Log (Real audit events only)
  const [adminActivityLog, setAdminActivityLog] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_admin_activity');
      if (saved) {
        const cleaned = sanitizeActivityLogs(JSON.parse(saved));
        localStorage.setItem('josan_admin_activity', JSON.stringify(cleaned));
        return cleaned;
      }
    } catch (e) {}
    return sanitizeActivityLogs(initialAdminActivityLog);
  });

  useEffect(() => {
    try {
      localStorage.setItem('josan_admin_activity', JSON.stringify(sanitizeActivityLogs(adminActivityLog)));
    } catch (e) {}
  }, [adminActivityLog]);

  const logAdminActivity = (action, details, user) => {
    const defaultUser = currentUser?.name || currentUser?.email || 'Administrator';
    const newEntry = {
      id: `act-${Date.now()}`,
      action,
      details,
      timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' SGT, ' + new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      user: user || defaultUser
    };
    setAdminActivityLog(prev => sanitizeActivityLogs([newEntry, ...prev.slice(0, 49)]));
  };

  const addCargoPricing = (cargoData) => {
    const newItem = {
      ...cargoData,
      id: cargoData.id || `cargo-${Date.now().toString(36)}`,
      active: cargoData.active !== undefined ? cargoData.active : true,
      basePricePerKg: Number(cargoData.basePricePerKg) || 0,
      minimumCharge: Number(cargoData.minimumCharge) || 0,
      weightSlabs: Array.isArray(cargoData.weightSlabs) ? cargoData.weightSlabs : []
    };
    setCargoPricing(prev => [newItem, ...prev]);
    logAdminActivity('Cargo Type Added', `Added cargo pricing for ${newItem.name}`);
    if (showToast) showToast(`Cargo type "${newItem.name}" added successfully`, 'success');
    return newItem;
  };

  const updateCargoPricing = (cargoId, updates) => {
    setCargoPricing(prev => prev.map(item => item.id === cargoId ? { ...item, ...updates } : item));
    logAdminActivity('Cargo Type Updated', `Updated pricing configuration for #${cargoId}`);
    if (showToast) showToast('Cargo pricing updated successfully', 'success');
  };

  const deleteCargoPricing = (cargoId) => {
    const target = cargoPricing.find(c => c.id === cargoId);
    setCargoPricing(prev => prev.filter(c => c.id !== cargoId));
    logAdminActivity('Cargo Type Deleted', `Deleted cargo type: ${target?.name || cargoId}`);
    if (showToast) showToast('Cargo type removed', 'info');
  };

  const toggleCargoPricingStatus = (cargoId) => {
    setCargoPricing(prev => prev.map(item => {
      if (item.id === cargoId) {
        const nextActive = !item.active;
        logAdminActivity('Cargo Status Toggled', `${item.name} set to ${nextActive ? 'Active' : 'Inactive'}`);
        return { ...item, active: nextActive };
      }
      return item;
    }));
  };

  const calculateCargoPrice = (cargoTypeIdOrName, weightKg = 0) => {
    if (!cargoTypeIdOrName) return { pricePerKg: 0, estimatedCargoCharge: 0, appliedSlab: null, isMinChargeApplied: false, minimumCharge: 0 };
    const query = String(cargoTypeIdOrName).toLowerCase().trim();
    const item = cargoPricing.find(c =>
      c.id.toLowerCase() === query ||
      c.name.toLowerCase() === query ||
      c.category?.toLowerCase() === query ||
      query.includes(c.name.toLowerCase()) ||
      c.name.toLowerCase().includes(query)
    ) || cargoPricing[0];
    return calculateCargoPricingHelper(item, weightKg);
  };

  // 3. Admin User Management State
  const [systemUsers, setSystemUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_system_users');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialSystemUsers;
  });

  useEffect(() => {
    try {
      localStorage.setItem('josan_system_users', JSON.stringify(systemUsers));
    } catch (e) {}
  }, [systemUsers]);

  const addSystemUser = (userData) => {
    const newUser = {
      ...userData,
      id: userData.id || `USR-${Math.floor(100 + Math.random() * 900)}`,
      status: userData.status || 'Active',
      lastLogin: 'Never logged in',
      permissions: userData.permissions || ['dashboard']
    };
    setSystemUsers(prev => [newUser, ...prev]);
    logAdminActivity('User Created', `Created user ${newUser.name} (${newUser.role})`);
    if (showToast) showToast(`User "${newUser.name}" added successfully`, 'success');
    return newUser;
  };

  const updateSystemUser = (userId, updates) => {
    setSystemUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    logAdminActivity('User Updated', `Updated user record #${userId}`);
    if (showToast) showToast('User details updated', 'success');
  };

  const deleteSystemUser = (userId) => {
    const target = systemUsers.find(u => u.id === userId);
    setSystemUsers(prev => prev.filter(u => u.id !== userId));
    logAdminActivity('User Removed', `Deleted user ${target?.name || userId}`);
    if (showToast) showToast('User removed from system', 'info');
  };

  const toggleSystemUserStatus = (userId) => {
    setSystemUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Inactive' : 'Active';
        logAdminActivity('User Status Changed', `${u.name} status changed to ${nextStatus}`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  // 4. Admin Roles & Permissions State
  const [crmRolePermissions, setCrmRolePermissions] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_crm_permissions');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialCrmRolePermissions;
  });

  useEffect(() => {
    try {
      localStorage.setItem('josan_crm_permissions', JSON.stringify(crmRolePermissions));
    } catch (e) {}
  }, [crmRolePermissions]);

  const updateRolePermissions = (roleKey, moduleKey, isAllowed) => {
    setCrmRolePermissions(prev => ({
      ...prev,
      [roleKey]: {
        ...(prev[roleKey] || {}),
        [moduleKey]: isAllowed
      }
    }));
    logAdminActivity('Role Permission Updated', `Modified ${moduleKey} permission for role ${roleKey}`);
    if (showToast) showToast(`Updated permission for role ${roleKey}`, 'success');
  };

  const updateUserPermissions = (userId, allowedModules) => {
    setSystemUsers(prev => prev.map(u => u.id === userId ? { ...u, permissions: allowedModules } : u));
    logAdminActivity('User Permissions Updated', `Updated permissions for user #${userId}`);
    if (showToast) showToast('User module permissions saved', 'success');
  };

  // 5. Admin Public Website Content State
  const [websiteContent, setWebsiteContent] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_website_content');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialWebsiteContent,
          ...parsed,
          hero: {
            ...initialWebsiteContent.hero,
            ...(parsed.hero || {}),
            badge: '',
            title: parsed.hero?.title || initialWebsiteContent.hero.title,
            subtitle: parsed.hero?.subtitle || initialWebsiteContent.hero.subtitle,
            ctaPrimary: parsed.hero?.ctaPrimary || initialWebsiteContent.hero.ctaPrimary,
            ctaSecondary: '' // explicitly removed secondary button
          },
          services: {
            ...initialWebsiteContent.services,
            ...(parsed.services || {}),
            documentation: {
              ...initialWebsiteContent.services.documentation,
              ...(parsed.services?.documentation || {}),
              title: 'Shipment Documentation Support',
              shortDesc: 'Help preparing and organising shipment documents. Documentation support only; we do not provide customs clearance.'
            }
          },
          about: {
            ...initialWebsiteContent.about,
            ...(parsed.about || {}),
            tagline: parsed.about?.tagline || initialWebsiteContent.about.tagline,
            mission: parsed.about?.mission || initialWebsiteContent.about.mission,
            vision: parsed.about?.vision || initialWebsiteContent.about.vision
          },
          contact: {
            ...initialWebsiteContent.contact,
            ...(parsed.contact || {}),
            description: 'Phone number, email, office address and opening hours.',
            operatingHours: parsed.contact?.operatingHours || '[ENTER REAL HOURS]'
          },
          faqs: (parsed.faqs && parsed.faqs.length > 0) ? parsed.faqs : initialWebsiteContent.faqs,
          banner: {
            ...initialWebsiteContent.banner,
            ...(parsed.banner || {}),
            active: false,
            text: 'Air freight documentation support and road transportation coordination in Singapore.'
          }
        };
      }
    } catch (e) {}
    return initialWebsiteContent;
  });

  useEffect(() => {
    try {
      localStorage.setItem('josan_website_content', JSON.stringify(websiteContent));
    } catch (e) {}
  }, [websiteContent]);

  const updateWebsiteContent = (section, newValues) => {
    setWebsiteContent(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        ...newValues
      }
    }));
    logAdminActivity('Website Content Updated', `Updated ${section} content on public website`);
    if (showToast) showToast(`Website ${section} updated successfully`, 'success');
  };

  const addWebsiteFaq = (faqItem) => {
    const newFaq = {
      id: faqItem.id || `faq-${Date.now()}`,
      q: faqItem.q,
      a: faqItem.a
    };
    setWebsiteContent(prev => ({
      ...prev,
      faqs: [...(prev.faqs || []), newFaq]
    }));
    logAdminActivity('FAQ Added', `Added FAQ: "${newFaq.q.slice(0, 30)}..."`);
    if (showToast) showToast('FAQ added to public website', 'success');
  };

  const updateWebsiteFaq = (faqId, updatedFaq) => {
    setWebsiteContent(prev => ({
      ...prev,
      faqs: (prev.faqs || []).map(f => f.id === faqId ? { ...f, ...updatedFaq } : f)
    }));
    logAdminActivity('FAQ Updated', `Updated FAQ #${faqId}`);
    if (showToast) showToast('FAQ updated successfully', 'success');
  };

  const deleteWebsiteFaq = (faqId) => {
    setWebsiteContent(prev => ({
      ...prev,
      faqs: (prev.faqs || []).map(f => f.id !== faqId)
    }));
    logAdminActivity('FAQ Deleted', `Deleted FAQ #${faqId}`);
    if (showToast) showToast('FAQ removed from public website', 'info');
  };

  // 5b. Unified Site Settings (Company Profile, UEN, GST, Registered Office, Demo Mode)
  const initialSiteSettings = {
    company_name: 'Josan Logistics Pte. Ltd.',
    uen: '',
    gst_reg: '',
    phone: '+65 6789 0123',
    whatsapp: '+65 6789 0123',
    contact_email: 'contact@josanlogistics.com.sg',
    registered_office: '10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438',
    dpo_email: 'contact@josanlogistics.com.sg',
    show_price_estimate: 'false',
    demo_mode: true
  };

  const [siteSettings, setSiteSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_site_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialSiteSettings,
          ...parsed,
          company_name: parsed.company_name || initialSiteSettings.company_name,
          uen: parsed.uen === '201829481K' || parsed.uen === '202412345K' ? '' : (parsed.uen ?? ''),
          gst_reg: parsed.gst_reg === 'M90382910X' || parsed.gst_reg === 'M90384721' ? '' : (parsed.gst_reg ?? ''),
          phone: parsed.phone || initialSiteSettings.phone,
          contact_email: parsed.contact_email || initialSiteSettings.contact_email,
          registered_office: parsed.registered_office || initialSiteSettings.registered_office,
          demo_mode: parsed.demo_mode !== false && parsed.demo_mode !== 'false'
        };
      }
    } catch (e) {}
    return initialSiteSettings;
  });

  // Sync siteSettings from Supabase database on mount
  useEffect(() => {
    let isMounted = true;
    supabaseApi.getSiteSettings().then((remoteSettings) => {
      if (isMounted && remoteSettings && Object.keys(remoteSettings).length > 0) {
        setSiteSettings(prev => {
          const merged = {
            ...prev,
            ...remoteSettings,
            uen: remoteSettings.uen === '201829481K' || remoteSettings.uen === '202412345K' ? '' : (remoteSettings.uen ?? prev.uen ?? ''),
            gst_reg: remoteSettings.gst_reg === 'M90382910X' || remoteSettings.gst_reg === 'M90384721' ? '' : (remoteSettings.gst_reg ?? prev.gst_reg ?? ''),
            phone: remoteSettings.phone || prev.phone,
            contact_email: remoteSettings.contact_email || prev.contact_email,
            registered_office: remoteSettings.registered_office || prev.registered_office,
            demo_mode: remoteSettings.demo_mode !== 'false' && remoteSettings.demo_mode !== false
          };
          try {
            localStorage.setItem('josan_site_settings', JSON.stringify(merged));
          } catch (e) {}
          return merged;
        });
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const updateSiteSettings = async (newSettings) => {
    setSiteSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('josan_site_settings', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Synchronize to websiteContent.contact as well so all consumers stay 100% in sync
    setWebsiteContent(prev => ({
      ...prev,
      contact: {
        ...(prev.contact || {}),
        phone: newSettings.phone || prev.contact?.phone || initialSiteSettings.phone,
        email: newSettings.contact_email || prev.contact?.email || initialSiteSettings.contact_email,
        address: newSettings.registered_office || prev.contact?.address || initialSiteSettings.registered_office,
        description: 'Phone number, email, office address and opening hours.',
        operatingHours: prev.contact?.operatingHours || '[ENTER REAL HOURS]'
      }
    }));

    // Persist to Supabase site_settings table
    try {
      await supabaseApi.saveSiteSettings(newSettings);
    } catch (err) {
      console.warn('Failed to sync site_settings to Supabase:', err);
    }

    logAdminActivity('Settings Updated', 'Updated company profile and site_settings');
    if (showToast) showToast('Company profile & site settings updated', 'success');
  };

  // 6. Admin Services Management State
  const [managedServices, setManagedServices] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_managed_services');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          airway: { ...initialManagedServices.airway, ...(parsed.airway || {}) },
          road: { 
            ...initialManagedServices.road, 
            ...(parsed.road || {}),
            badge: 'Partner Carriers',
            description: (parsed.road?.description && !parsed.road.description.includes('linehaul') && !parsed.road.description.includes('FTL'))
              ? parsed.road.description
              : initialManagedServices.road.description
          },
          documentation: { 
            ...initialManagedServices.documentation, 
            ...(parsed.documentation || {}),
            active: parsed.documentation?.userToggled ? parsed.documentation.active : initialManagedServices.documentation.active,
            name: 'Shipment Documentation Support',
            badge: 'Documentation Only',
            description: 'Help preparing and organising shipment documents. Documentation support only; we do not provide customs clearance.'
          }
        };
      }
    } catch (e) {}
    return initialManagedServices;
  });

  useEffect(() => {
    try {
      localStorage.setItem('josan_managed_services', JSON.stringify(managedServices));
    } catch (e) {}
  }, [managedServices]);

  const toggleManagedService = (serviceId) => {
    setManagedServices(prev => {
      const current = prev[serviceId];
      if (!current) return prev;
      const nextActive = !current.active;
      logAdminActivity('Service Status Toggled', `${current.name} set to ${nextActive ? 'Active' : 'Inactive'}`);
      return {
        ...prev,
        [serviceId]: {
          ...current,
          active: nextActive,
          userToggled: true
        }
      };
    });
    if (showToast) showToast('Service availability updated', 'info');
  };

  const updateManagedService = (serviceId, updates) => {
    setManagedServices(prev => ({
      ...prev,
      [serviceId]: {
        ...(prev[serviceId] || {}),
        ...updates
      }
    }));
    logAdminActivity('Service Details Updated', `Updated details for service ${serviceId}`);
    if (showToast) showToast('Service configuration updated', 'success');
  };

  // User & Auth state
  const [currentRole, setCurrentRole] = useState(() => {
    try {
      return localStorage.getItem('josan_role') || 'customer';
    } catch (e) {
      return 'customer';
    }
  });


  // Initialize Supabase Data Fetching & Realtime Database Subscriptions
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Fetch initial data from Supabase DB
    const loadSupabaseData = async () => {
      const dbShipments = await supabaseApi.getShipments();
      if (dbShipments && dbShipments.length > 0) {
        setShipments(dbShipments);
      }

      const dbDrivers = await supabaseApi.getDrivers();
      if (dbDrivers && dbDrivers.length > 0) {
        setDrivers(prev => {
          const dbIds = new Set(dbDrivers.map(d => d.id));
          const localOnly = (prev || []).filter(d => d && d.id && !dbIds.has(d.id));
          // If there are local drivers created offline/before sync, push them to Supabase
          if (localOnly.length > 0) {
            localOnly.forEach(d => supabaseApi.createDriver(d));
          }
          return [...dbDrivers, ...localOnly];
        });
      }

      const dbLeads = await supabaseApi.getLeads();
      if (dbLeads && dbLeads.length > 0) {
        setLeads(dbLeads);
      }

      const dbTickets = await supabaseApi.getTickets();
      if (dbTickets && dbTickets.length > 0) {
        setTickets(dbTickets);
      }

      const dbCustomers = await supabaseApi.getCustomers();
      if (dbCustomers && dbCustomers.length > 0) {
        setCustomers(prev => {
          const dbIds = new Set(dbCustomers.map(c => c.id));
          const localOnly = (prev || []).filter(c => c && c.id && !dbIds.has(c.id));
          return [...dbCustomers, ...localOnly];
        });
      }
    };

    loadSupabaseData();

  }, []);

  // Real-time Connection State
  const [isSocketConnected] = useState(false);
  const [socketId] = useState(null);

  // Driver Proximity & Admin Intimations state
  const [driverIntimations, setDriverIntimations] = useState([]);

  useEffect(() => {
    try {
      localStorage.setItem('josan_driver_intimations', JSON.stringify(driverIntimations));
    } catch (e) {}
  }, [driverIntimations]);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_staff_user') || localStorage.getItem('josan_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.isTest || parsed?.isDemo) {
          try {
            localStorage.removeItem('josan_user');
            localStorage.removeItem('josan_staff_user');
          } catch (e) {}
          return null;
        }
        return parsed;
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  // Ensure any lingering invalid sessions are cleaned up
  useEffect(() => {
    try {
      const saved = localStorage.getItem('josan_staff_user') || localStorage.getItem('josan_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.isTest || parsed?.isDemo) {
          localStorage.removeItem('josan_user');
          localStorage.removeItem('josan_staff_user');
          localStorage.removeItem('josan_staff_token');
          setCurrentUser(null);
        }
      }
    } catch (e) {}
  }, []);

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Active tracking search state
  const [activeTrackingId, setActiveTrackingId] = useState('');

  // Active modal state for invoices or auth
  const [selectedInvoiceShipment, setSelectedInvoiceShipment] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalHideClose, setAuthModalHideClose] = useState(false);
  const [authRedirectTab, setAuthRedirectTab] = useState(null);

  const openAuthModalWithoutClose = () => {
    setAuthModalHideClose(true);
    setIsAuthModalOpen(true);
  };

  // Shipment Scope (null | 'domestic' | 'international')
  // Shipment Scope ('domestic' road service)
  const [shipmentScope, setShipmentScope] = useState('domestic');

  const [isShipmentTypeModalOpen, setIsShipmentTypeModalOpen] = useState(false);

  const resetShipmentScope = () => {
    setShipmentScope(null);
  };

  // Sub-tab navigation state
  const [customerSubTab, setCustomerSubTab] = useState('orders');
  const [driverSubTab, setDriverSubTab] = useState('dashboard');

  // Saved Addresses State
  const [addressList, setAddressList] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_addresses');
      return saved ? JSON.parse(saved) : [
        { id: 1, label: 'Primary Pasir Panjang HQ Warehouse', address: '10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438', contact: 'Tan Wei Ming (Warehouse Manager)', type: 'pickup' },
        { id: 2, label: 'Changi Air Cargo Logistics Hub', address: 'Air Cargo Road, Complex Bay #4, Singapore 819830', contact: 'Gurpreet Singh (Dispatch Spec)', type: 'pickup' },
        { id: 3, label: 'Downtown Retail Outlet', address: '89 Orchard Road, Singapore 238854', contact: 'Store Manager', type: 'drop' },
        { id: 4, label: 'West Coast Hub Terminal', address: '12 Pioneer Sector 3, Singapore 628349', contact: 'Receiving Dock', type: 'drop' }
      ];
    } catch (e) {
      return [
        { id: 1, label: 'Primary Pasir Panjang HQ Warehouse', address: '10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438', contact: 'Tan Wei Ming (Warehouse Manager)', type: 'pickup' },
        { id: 2, label: 'Changi Air Cargo Logistics Hub', address: 'Air Cargo Road, Complex Bay #4, Singapore 819830', contact: 'Gurpreet Singh (Dispatch Spec)', type: 'pickup' },
        { id: 3, label: 'Downtown Retail Outlet', address: '89 Orchard Road, Singapore 238854', contact: 'Store Manager', type: 'drop' },
        { id: 4, label: 'West Coast Hub Terminal', address: '12 Pioneer Sector 3, Singapore 628349', contact: 'Receiving Dock', type: 'drop' }
      ];
    }
  });

  const addSavedAddress = (newAddressObj) => {
    setAddressList(prev => [...prev, newAddressObj]);
  };

  const updateSavedAddress = (id, updatedObj) => {
    setAddressList(prev => prev.map(a => a.id === id ? { ...a, ...updatedObj } : a));
  };

  const deleteSavedAddress = (id) => {
    setAddressList(prev => prev.filter(a => a.id !== id));
  };

  useEffect(() => {
    localStorage.setItem('josan_addresses', JSON.stringify(addressList));
  }, [addressList]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('josan_shipments', JSON.stringify(shipments));
  }, [shipments]);

  useEffect(() => {
    localStorage.setItem('josan_drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('josan_warehouses', JSON.stringify(warehouses));
  }, [warehouses]);

  useEffect(() => {
    localStorage.setItem('josan_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('josan_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Helper toast alert function (20s duration so Admin & Drivers can view availability status)
  const showToast = (message, type = 'success', duration = 20000) => {
    if (!message) {
      setToast(null);
      return;
    }
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, duration);
  };

  // Role toggle action
  const toggleRole = (role, setActiveTab) => {
    const newRole = role || (currentRole === 'customer' ? 'driver' : 'customer');
    setCurrentRole(newRole);
    if (newRole === 'admin') {
      const adminUser = {
        name: 'Administrator',
        email: 'admin@josanlogistics.com.sg',
        role: 'admin',
        company: 'Josan Logistics Operations'
      };
      setCurrentUser(adminUser);
      try { localStorage.setItem('josan_user', JSON.stringify(adminUser)); } catch (e) {}
      if (setActiveTab) setActiveTab('admin-dashboard', true, adminUser);
      showToast('Switched to Admin Management Portal', 'info');
    } else if (newRole === 'driver') {
      const driverUser = {
        name: 'Robert Martinez (Driver)',
        email: 'robert.m@josanlogistics.com',
        role: 'driver',
        company: 'Josan Logistics Fleet'
      };
      setCurrentUser(driverUser);
      try { localStorage.setItem('josan_user', JSON.stringify(driverUser)); } catch (e) {}
      if (setActiveTab) setActiveTab('driver-dashboard', true, driverUser);
      showToast('Switched to Driver Portal', 'info');
    } else {
      const custUser = {
        name: 'TechCorp Solutions (Customer)',
        email: 'shipping@techcorp.com',
        role: 'customer',
        company: 'TechCorp Solutions'
      };
      setCurrentUser(custUser);
      try { localStorage.setItem('josan_user', JSON.stringify(custUser)); } catch (e) {}
      if (setActiveTab) setActiveTab('customer-dashboard', true, custUser);
      showToast('Switched to Customer Dashboard', 'info');
    }
  };

  // Auth login
  const loginUser = (email, password, role, setActiveTab, details = {}) => {
    const userRole = role || (email.includes('admin') ? 'admin' : email.includes('driver') ? 'driver' : 'customer');
    
    let matchedDriver = null;
    let matchedCustomer = null;

    if (userRole === 'driver') {
      const cleanInput = (email || '').trim().toLowerCase();
      matchedDriver = drivers.find(d => 
        (d.email && d.email.trim().toLowerCase() === cleanInput) ||
        (d.phone && d.phone.replace(/[^0-9]/g, '') === cleanInput.replace(/[^0-9]/g, '')) ||
        (d.name && d.name.trim().toLowerCase() === cleanInput)
      );

      if (!matchedDriver) {
        return { success: false, error: 'Driver account not found. Drivers must be provisioned by Admin in the Admin Control Portal first.' };
      }
    } else if (userRole === 'admin' || userRole === 'crm' || userRole === 'read_only') {
      // Staff accounts authenticate through the secure server staff authentication endpoint
      // No plain text demo passwords accepted
    } else if (userRole === 'customer') {
      const cleanEmail = (email || '').trim().toLowerCase();
      matchedCustomer = (customers || []).find(c => c.email && c.email.trim().toLowerCase() === cleanEmail);
    }

    const userObj = {
      id: details.id || `USER-${Date.now()}`,
      name: details.name || details.fullName || matchedDriver?.name || matchedCustomer?.name || (userRole === 'admin' 
        ? 'Fleet Admin Manager' 
        : userRole === 'driver' 
        ? 'Robert Martinez (Driver)' 
        : (email ? email.split('@')[0] : 'Customer')),
      email: matchedDriver?.email || email,
      role: userRole,
      displayRole: details.displayRole || (userRole === 'admin' ? 'Admin' : userRole === 'crm' ? 'CRM Operations' : 'Customer'),
      company: details.company || matchedDriver?.assignedHub || matchedCustomer?.company || (userRole === 'admin' 
        ? 'Josan Logistics Operations' 
        : userRole === 'driver' 
        ? 'Josan Fleet Operations' 
        : ''),
      phone: details.phone || matchedDriver?.phone || matchedCustomer?.phone || (userRole === 'driver' ? '+65 9112 3456' : '+65 8765 4321'),
      licenseNumber: matchedDriver?.licenseNumber || details.licenseNumber || (userRole === 'driver' ? 'SG-CLASS4-881' : ''),
      dob: matchedDriver?.dob || details.dob || (userRole === 'driver' ? '1990-05-12' : ''),
      photo: matchedDriver?.photo || details.photo || undefined,
      ...details
    };
    setCurrentUser(userObj);
    setCurrentRole(userRole);
    try {
      localStorage.setItem('josan_user', JSON.stringify(userObj));
      localStorage.setItem('josan_role', userRole);
      if (userRole === 'admin' || userRole === 'crm' || userRole === 'read_only' || userRole?.startsWith('crm_')) {
        localStorage.setItem('josan_staff_user', JSON.stringify(userObj));
      }
    } catch (e) {}

    if (userRole === 'customer') {
      const newCustObj = {
        id: matchedCustomer?.id || `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
        name: userObj.name,
        email: userObj.email,
        phone: userObj.phone,
        company: userObj.company,
        company_name: userObj.company
      };
      setCustomers(prev => {
        const exists = (prev || []).some(c => c.email?.toLowerCase() === userObj.email?.toLowerCase());
        if (!exists) {
          return [newCustObj, ...(prev || [])];
        } else {
          return (prev || []).map(c => c.email?.toLowerCase() === userObj.email?.toLowerCase() ? { ...c, ...newCustObj } : c);
        }
      });
    }

    const wasForcedBookingModal = authModalHideClose;
    setIsAuthModalOpen(false);
    setAuthModalHideClose(false);

    // Enforce Strict Portal Redirection
    if (setActiveTab) {
      if (authRedirectTab && userRole === 'customer') {
        setActiveTab(authRedirectTab, true, userObj);
        setAuthRedirectTab(null);
      } else if (wasForcedBookingModal && userRole === 'customer') {
        setActiveTab('book', true, userObj);
      } else if (userRole === 'admin') {
        setActiveTab('admin-dashboard', true, userObj);
      } else if (userRole === 'crm' || userRole === 'read_only' || userRole === 'read-only' || userRole?.startsWith('crm_')) {
        setActiveTab('crm', true, userObj);
      } else {
        setActiveTab('customer-dashboard', true, userObj);
      }
    }

    const portalName = userRole === 'admin' ? 'Admin Hub' : userRole === 'driver' ? 'Driver Portal' : 'Customer Portal';
    showToast(`Logged in successfully as ${userObj.name} (${portalName})`);
    return { success: true, user: userObj };
  };

  const logoutUser = (silent = false) => {
    setCurrentUser(null);
    setCurrentRole('customer');
    try {
      localStorage.removeItem('josan_user');
      localStorage.removeItem('josan_staff_user');
      localStorage.removeItem('josan_staff_token');
      localStorage.removeItem('josan_role');
      sessionStorage.clear();
    } catch (e) {}

    try {
      if (supabase && supabase.auth) {
        supabase.auth.signOut().catch(() => {});
      }
    } catch (e) {}

    if (typeof window !== 'undefined') {
      window.location.hash = '#home';
      if (window.history && window.history.pushState) {
        window.history.pushState({ tab: 'home' }, '', '#home');
      }
    }

    if (!silent) {
      showToast('Logged out successfully', 'info');
    }
  };

  const updateUserProfile = (updatedDetails) => {
    setCurrentUser(prev => ({
      ...prev,
      ...updatedDetails
    }));
    showToast("Profile details updated successfully!");
  };

  // Shipment operations
  const addShipment = async (newShipmentData) => {
    let trackingId = newShipmentData.id || newShipmentData.trackingNumber;
    let isTest = Boolean(newShipmentData.isTest);

    // If tracking number not provided, fetch automatic random tracking number generated on server only
    if (!trackingId) {
      const serverRef = await fetchServerShipmentReference({ isTest });
      trackingId = serverRef.trackingNumber;
      isTest = serverRef.isTest;
    }

    const distKm = (1 + Math.random() * 2.5).toFixed(1);
    
    const newShipment = {
      id: trackingId,
      trackingNumber: trackingId,
      isTest,
      sender: newShipmentData.senderName || currentUser?.name || 'Valued Customer',
      senderPhone: newShipmentData.senderPhone || '+65 6789 0123',
      senderAddress: newShipmentData.pickupAddress || 'Singapore Logistics Terminal 4',
      receiver: newShipmentData.receiverName || 'Recipient',
      receiverPhone: newShipmentData.receiverPhone || '+65 6789 0123',
      receiverAddress: newShipmentData.deliveryAddress || 'Singapore Destination Address',
      origin: newShipmentData.pickupCity || 'Changi Air Cargo Hub',
      destination: newShipmentData.deliveryCity || 'Pasir Panjang Logistics Hub',
      currentLocation: `${newShipmentData.pickupCity || 'Changi Hub'} Sorting Facility`,
      status: 'ASSIGNED',
      statusType: 'active',
      paymentStatus: 'Paid',
      serviceLevel: newShipmentData.serviceLevel || 'Express Air Freight',
      cargoType: newShipmentData.cargoType || 'General Cargo',
      packageType: newShipmentData.packageType || 'Carton / Box',
      weight: `${newShipmentData.weight || 10} kg`,
      pieces: newShipmentData.pieces || 1,
      declaredValue: `$${newShipmentData.declaredValue || '1,000'}`,
      price: newShipmentData.estimatedPrice || 'S$ 120.00',
      driverId: null,
      driverName: 'Unassigned (Drivers Intimated)',
      driverPhone: 'N/A',
      vehicle: 'Awaiting Driver Acceptance',
      estimatedDelivery: 'Same-Day Regional Dispatch',
      createdDate: new Date().toLocaleString(),
      timeline: [
        { title: 'Order Placed & Intimated to Nearby Drivers', location: newShipmentData.pickupCity || 'Changi Hub', timestamp: 'Just Now', completed: true, current: true, icon: 'FileCheck' },
        { title: 'Picked Up by Courier', location: 'En Route to Dispatch', timestamp: 'Pending', completed: false, icon: 'Truck' },
        { title: 'In Transit & Sorting Center', location: 'Sorting Hub', timestamp: 'Pending', completed: false, icon: 'PackageCheck' },
        { title: 'Out for Delivery', location: newShipmentData.deliveryCity || 'Destination', timestamp: 'Pending', completed: false, icon: 'MapPin' },
        { title: 'Delivered & Signature Verified', location: newShipmentData.deliveryAddress || 'Recipient Address', timestamp: 'Pending', completed: false, icon: 'CheckCircle2' }
      ]
    };

    setShipments(prev => [newShipment, ...prev]);

    if (isSupabaseConfigured) {
      await supabaseApi.createShipment(newShipment);
    }

    // Create Proximity Intimation Notification for Drivers!
    const newIntimation = {
      id: `INT-${Date.now()}`,
      shipmentId: trackingId,
      type: 'proximity',
      title: `📍 Nearby Order Intimation Alert (#${trackingId})`,
      message: `New order placed near ${newShipmentData.pickupCity || 'Changi Hub'} (${distKm} km away)! Pickup at ${newShipmentData.pickupAddress || 'Singapore Logistics Terminal'}.`,
      pickup: newShipmentData.pickupAddress || 'Singapore Logistics Terminal 4',
      delivery: newShipmentData.deliveryAddress || 'Singapore Destination Address',
      cargoType: newShipmentData.cargoType || 'General Freight',
      weight: `${newShipmentData.weight || 10} kg`,
      price: newShipmentData.estimatedPrice || 'S$ 120.00',
      pickupCity: newShipmentData.pickupCity || 'Changi Air Cargo Hub',
      distanceKm: distKm,
      timestamp: 'Just Now',
      status: 'Pending'
    };

    setDriverIntimations(prev => [newIntimation, ...prev]);

    showToast(`Order ${trackingId} booked! Nearby drivers have been automatically intimated with dispatch details.`);
    return newShipment;
  };

  const deleteShipment = async (shipmentId) => {
    setShipments(prev => {
      const updated = prev.filter(s => s.id !== shipmentId);
      try {
        localStorage.setItem('josan_shipments', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (isSupabaseConfigured) {
      await supabaseApi.deleteShipment(shipmentId);
    }

    showToast(`Order #${shipmentId} deleted successfully from records.`, 'info');
  };

  const payShipmentInvoice = (shipmentId, method = 'Credit Card') => {
    setShipments(prev => prev.map(s => {
      if (s.id === shipmentId) {
        return {
          ...s,
          paymentStatus: 'Paid',
          paymentMethod: method
        };
      }
      return s;
    }));
    // Also update selectedInvoiceShipment if open
    setSelectedInvoiceShipment(prev => prev && prev.id === shipmentId ? { ...prev, paymentStatus: 'Paid', paymentMethod: method } : prev);
  };

  const updateShipmentStatus = async (shipmentId, newStatus, newLocation = '') => {
    const stageMap = {
      'ASSIGNED': 1,
      'Booked': 1,
      'ACCEPTED': 2,
      'Confirmed': 2,
      'GOING_TO_PICKUP': 3,
      'Pickup Scheduled': 3,
      'ARRIVED_AT_PICKUP': 3,
      'PICKUP_COMPLETED': 4,
      'Picked Up': 4,
      'IN_TRANSIT': 5,
      'In Transit': 5,
      'ARRIVED_AT_DELIVERY': 6,
      'Near Destination': 6,
      'Out for Delivery': 6,
      'DELIVERY_COMPLETED': 7,
      'Delivered': 7,
      'CANCELLED': 1,
      'Delayed': 5
    };

    const targetStageNum = stageMap[newStatus] || 5;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setShipments(prev => prev.map(s => {
      if (s.id === shipmentId) {
        let updatedStatusType = 'active';
        if (newStatus === 'Delivered' || newStatus === 'DELIVERY_COMPLETED') updatedStatusType = 'success';
        if (newStatus === 'Delayed' || newStatus === 'CANCELLED') updatedStatusType = 'warning';

        // Auto-generate OTP if reaching destination and none exists
        let activeOtp = s.deliveryOtp;
        if ((newStatus === 'ARRIVED_AT_DELIVERY' || newStatus === 'Near Destination' || newStatus === 'Out for Delivery') && !activeOtp) {
          activeOtp = Math.floor(100000 + Math.random() * 900000).toString();
        }

        const default7StageTitles = [
          'Consignment Booked',
          'Booking Confirmed by Operations',
          'Pickup Scheduled',
          'Picked Up by Fleet Driver',
          'In Transit on Highway Corridor',
          'Near Destination Terminal',
          'Delivered & POD Verified'
        ];

        // Ensure 7 stages in timeline
        let baseTimeline = Array.isArray(s.timeline) && s.timeline.length >= 7 ? s.timeline : (
          default7StageTitles.map((title, i) => ({
            step: i + 1,
            title,
            location: i <= 2 ? s.origin : i === 3 ? 'Origin Loading Bay' : i === 4 ? (newLocation || s.currentLocation || 'Expressway Corridor') : s.destination,
            timestamp: i + 1 <= targetStageNum ? (i + 1 === targetStageNum ? timeNow : 'Completed') : 'Pending',
            completed: i + 1 <= targetStageNum,
            current: i + 1 === targetStageNum
          }))
        );

        const updatedTimeline = baseTimeline.map((step, idx) => {
          const stepNum = step.step || (idx + 1);
          const isDone = stepNum <= targetStageNum;
          const isCurrent = stepNum === targetStageNum;
          return {
            ...step,
            completed: isDone,
            current: isCurrent,
            timestamp: isCurrent ? timeNow : (step.timestamp === 'Pending' && isDone ? timeNow : step.timestamp)
          };
        });

        return {
          ...s,
          status: newStatus,
          statusType: updatedStatusType,
          currentLocation: newLocation || s.currentLocation,
          lastUpdatedTime: `Just now (${timeNow} SGT)`,
          deliveryOtp: activeOtp,
          otpVerified: (newStatus === 'Delivered' || newStatus === 'DELIVERY_COMPLETED') ? true : s.otpVerified,
          timeline: updatedTimeline
        };
      }
      return s;
    }));

    if (isSupabaseConfigured) {
      await supabaseApi.updateShipmentStatus(shipmentId, newStatus, newLocation);
    }

    // Notifications restricted strictly to: quote request, quote status change, contact message, staff invite.

    showToast(`Updated status of ${shipmentId} to "${newStatus}"`);
  };

  // Driver Trip & Location Operations
  const startDriverTrip = (shipmentId) => {
    updateShipmentStatus(shipmentId, 'IN_TRANSIT', 'En Route via Highway Telematics Corridor');
    showToast(`Trip started for #${shipmentId}! Real-time tracking active.`, 'success');
  };

  const updateShipmentLocation = async (shipmentId, newLocationText, coords) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setShipments(prev => prev.map(s => {
      if (s.id === shipmentId) {
        return {
          ...s,
          currentLocation: newLocationText,
          lastUpdatedTime: `Just now (${timeNow} SGT)`,
          coordinates: coords ? { ...s.coordinates, current: coords } : s.coordinates
        };
      }
      return s;
    }));

    if (isSupabaseConfigured && coords && coords.length >= 2) {
      const targetS = shipments.find(s => s.id === shipmentId);
      if (targetS?.driverId) {
        await supabaseApi.updateDriverLocation(targetS.driverId, coords[0], coords[1]);
      }
    }

    showToast(`Location updated to "${newLocationText}" for #${shipmentId}`);
  };

  const reachDestination = (shipmentId) => {
    updateShipmentStatus(shipmentId, 'ARRIVED_AT_DELIVERY', 'Arrived at Destination Receiving Gate');
    showToast(`Arrived near destination for #${shipmentId}! Delivery OTP issued.`, 'success');
  };

  const verifyDeliveryOtp = (shipmentId, enteredOtp) => {
    const s = shipments.find(item => item.id === shipmentId);
    if (!s) return { success: false, message: 'Shipment record not found.' };

    const cleanInput = (enteredOtp || '').trim();
    const targetOtp = (s.deliveryOtp || s.otpActive || '482910').trim();

    if (!cleanInput) {
      return { success: false, message: 'Please enter the 6-digit delivery OTP from the customer.' };
    }

    if (cleanInput !== targetOtp) {
      return { success: false, message: 'Invalid OTP code. Please confirm OTP with recipient.' };
    }

    setShipments(prev => prev.map(item => item.id === shipmentId ? { ...item, otpVerified: true } : item));
    return { success: true, message: 'OTP verified successfully! Please capture recipient signature and photo to complete POD.' };
  };

  const submitPod = async (shipmentId, podData) => {
    const timeNow = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const completePod = {
      photo: podData.photo || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
      recipientName: podData.recipientName || 'Authorized Receiving Officer',
      recipientSignature: podData.recipientSignature || '',
      deliveredAt: `${timeNow} SGT`,
      remarks: podData.remarks || 'Consignment handed over in verified undamaged condition.',
      driverId: podData.driverId || 'DRV-101'
    };

    setShipments(prev => prev.map(s => {
      if (s.id === shipmentId) {
        const updatedTimeline = (s.timeline || []).map(step => ({
          ...step,
          completed: true,
          current: step.step === 7,
          timestamp: step.step === 7 ? timeNow : step.timestamp
        }));

        return {
          ...s,
          status: 'DELIVERY_COMPLETED',
          statusType: 'success',
          currentLocation: `${s.destination} (Delivered)`,
          lastUpdatedTime: `${timeNow} (Digital POD Stamped)`,
          otpVerified: true,
          pod: completePod,
          timeline: updatedTimeline
        };
      }
      return s;
    }));

    if (isSupabaseConfigured) {
      await supabaseApi.submitProofOfDelivery({
        shipmentId,
        driverId: podData.driverId || 'DRV-101',
        receiverName: podData.recipientName || 'Authorized Receiving Officer',
        signatureUrl: podData.recipientSignature || '',
        photoUrl: podData.photo || '',
        notes: podData.remarks || 'Consignment delivered'
      });
    }

    // Delivery POD recorded (notifications restricted to quotes, contact messages, staff invite)

    showToast(`Delivery completed and Digital POD stamped for #${shipmentId}!`, 'success');
    return completePod;
  };

  // Shipment Events Management (Manual team updates & Future Live Feed)
  const [shipmentEvents, setShipmentEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_shipment_events');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialShipmentEvents;
  });

  useEffect(() => {
    try {
      localStorage.setItem('josan_shipment_events', JSON.stringify(shipmentEvents));
    } catch (e) {}
  }, [shipmentEvents]);

  const addShipmentEvent = ({
    shipmentNumber,
    stage,
    location,
    timestamp,
    source = 'manual',
    staffUser,
    note = '',
    isTest = false
  }) => {
    if (!shipmentNumber || !stage || !location) {
      if (showToast) showToast('Shipment number, stage, and location are required.', 'error');
      return null;
    }

    const cleanNum = shipmentNumber.trim().toUpperCase();
    const eventTime = timestamp || new Date().toISOString();
    const staffName = staffUser || currentUser?.name || 'Staff User';

    const newEvent = {
      id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      shipmentNumber: cleanNum,
      stage: stage.trim(),
      location: location.trim(),
      timestamp: eventTime,
      source: source || 'manual',
      staffUser: staffName,
      note: (note || '').trim(),
      isTest: Boolean(isTest)
    };

    setShipmentEvents(prev => [newEvent, ...prev]);

    // Update matching shipment in shipments state
    setShipments(prev => prev.map(s => {
      const sNum = (s.id || s.referenceNumber || '').toUpperCase();
      if (sNum === cleanNum) {
        return {
          ...s,
          status: newEvent.stage,
          currentLocation: newEvent.location,
          lastUpdatedTimestamp: newEvent.timestamp,
          lastUpdatedTime: 'Just now',
          isTest: Boolean(isTest)
        };
      }
      return s;
    }));

    logAdminActivity(
      'Shipment Tracking Update',
      `${newEvent.source === 'manual' ? 'Manual update' : 'Live feed'}: #${cleanNum} set to "${newEvent.stage}" at ${newEvent.location}${newEvent.isTest ? ' [TEST]' : ''}`,
      staffName
    );

    if (showToast) {
      showToast(`Tracking update recorded for #${cleanNum}!`, 'success');
    }

    return newEvent;
  };

  const getShipmentEvents = (shipmentNumber) => {
    if (!shipmentNumber) return [];
    const cleanNum = String(shipmentNumber).trim().toUpperCase();
    return (shipmentEvents || []).filter(e => 
      e.shipmentNumber && e.shipmentNumber.toUpperCase() === cleanNum
    );
  };

  const getLatestShipmentEvent = (shipmentNumber) => {
    const events = getShipmentEvents(shipmentNumber);
    if (!events || events.length === 0) return null;
    return [...events].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
  };

  // Notification Operations
  const addNotification = ({ role = 'admin', userId = 'all', type = 'info', title, message, shipmentId, quoteId }) => {
    // Only real events: new quote request, quote status change, new contact message, staff invite
    const allowedTypes = ['quote_request', 'quote', 'quote_response', 'contact_enquiry', 'staff_invite', 'contact_message', 'airway_request'];
    const titleLower = (title || '').toLowerCase();
    const isAllowed = 
      allowedTypes.includes(type) ||
      titleLower.includes('quote') ||
      titleLower.includes('enquiry') ||
      titleLower.includes('contact') ||
      titleLower.includes('invitation') ||
      titleLower.includes('staff');

    if (!isAllowed) {
      return null;
    }

    const newNotif = {
      id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      role,
      userId,
      type,
      title,
      message,
      shipmentId: shipmentId || null,
      quoteId: quoteId || null,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => {
      const currentList = Array.isArray(prev) ? prev : [];

      // Extract quote reference if available
      const incomingQuoteMatch = (quoteId || (title + ' ' + message)).match(/#?([A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+|[A-Z0-9]+-[0-9]{4,})/i);
      const incomingQuoteRef = incomingQuoteMatch ? incomingQuoteMatch[1].toUpperCase() : (quoteId ? String(quoteId).toUpperCase() : null);

      // Check if duplicate exists
      const isDuplicate = currentList.some(n => {
        if (!n) return false;
        if (n.title === title && n.message === message) return true;
        if (incomingQuoteRef) {
          const existingQuoteMatch = (n.quoteId || (n.title + ' ' + n.message)).match(/#?([A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+|[A-Z0-9]+-[0-9]{4,})/i);
          const existingQuoteRef = existingQuoteMatch ? existingQuoteMatch[1].toUpperCase() : (n.quoteId ? String(n.quoteId).toUpperCase() : null);
          if (existingQuoteRef && existingQuoteRef === incomingQuoteRef) {
            return true;
          }
        }
        if (shipmentId && n.shipmentId === shipmentId && n.type === type) {
          return true;
        }
        return false;
      });

      if (isDuplicate) {
        return currentList;
      }
      return [newNotif, ...currentList];
    });
    return newNotif;
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = (role) => {
    setNotifications(prev => prev.map(n => (!role || n.role === role) ? { ...n, read: true } : n));
    showToast('All notifications marked as read', 'info');
  };

  const clearNotifications = (role) => {
    setNotifications(prev => prev.filter(n => role && n.role !== role));
    showToast('Notifications cleared', 'info');
  };

  // Quotation Management Operations
  const requestQuote = (quoteData) => {
    const isTestRequest = Boolean(quoteData.isTest || quoteData.status === 'Test');
    const quoteId = quoteData.id || quoteData.referenceNumber || (isTestRequest ? 'TQ-TEST-0001' : 'QR-REFD-0001');
    const weightVal = Number(quoteData.cargoWeight) || 100;

    const newQuote = {
      id: quoteId,
      referenceNumber: quoteId,
      requestId: quoteId,
      customerId: currentUser?.id || 'USR-GUEST',
      customerName: quoteData.contactName || currentUser?.name || 'Customer',
      customerEmail: quoteData.contactEmail || currentUser?.email || 'contact@client.com',
      customerPhone: quoteData.contactPhone || currentUser?.phone || '+65 6789 0123',
      company: quoteData.contactCompany || currentUser?.company || 'Commercial Shipper',
      origin: quoteData.originAddress || quoteData.originZone || 'Singapore Central Logistics Hub',
      destination: quoteData.destinationAddress || quoteData.destinationZone || 'Woodlands Distribution Complex',
      service: quoteData.service || (quoteData.serviceCategory === 'air-freight' ? 'Air Freight Documentation Support' : quoteData.serviceCategory === 'road-transport' ? 'Commercial Road Transportation Coordination' : 'Shipment Documentation Support'),
      cargoCategory: quoteData.cargoCategory || 'General Commercial Cargo',
      cargoWeight: weightVal,
      freightMode: quoteData.roadLoadType || quoteData.freightMode || 'ltl',
      deliverySpeed: quoteData.deliverySpeed || 'standard',
      notes: quoteData.cargoDescription || quoteData.specialInstructions || '',
      isTest: isTestRequest,
      status: isTestRequest ? 'Test' : 'Requested',
      staffPriced: false,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      validUntil: new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      total: null,
      amount: null,
      lineItems: null,
      adminNotes: 'Awaiting operations review and vehicle allocation.'
    };

    setQuotes(prev => {
      const filtered = (prev || []).filter(q => q.id !== quoteId && q.referenceNumber !== quoteId);
      const updated = [newQuote, ...filtered];
      try {
        localStorage.setItem('josan_quotes', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // If Air Freight, also route into airwayRequests so CRM Air Freight tab shows it immediately
    if (quoteData.serviceCategory === 'air-freight' || (newQuote.service && newQuote.service.toLowerCase().includes('air'))) {
      const airwayReq = {
        id: `AIR-${quoteId.replace(/[^0-9]/g, '').slice(-4) || String(Math.floor(1000 + Math.random() * 9000))}`,
        quoteId: quoteId,
        referenceNumber: quoteId,
        customerName: newQuote.customerName,
        company: newQuote.company,
        email: newQuote.customerEmail,
        phone: newQuote.customerPhone,
        origin: newQuote.origin,
        destination: newQuote.destination,
        cargoDescription: quoteData.cargoDescription || newQuote.notes || 'Air freight consignment',
        packagesCount: quoteData.packageCount ? `${quoteData.packageCount} packages` : '1 package',
        totalWeight: `${weightVal} kg`,
        dimensions: quoteData.dimensions || 'Standard Cargo',
        services: ['AWB Preparation', 'Shipment Documentation', 'Air Freight Support'],
        date: new Date().toISOString().split('T')[0],
        status: 'New',
        adminNotes: `Generated from quote request #${quoteId}.`
      };
      setAirwayRequests(prev => {
        const filtered = (prev || []).filter(r => r.quoteId !== quoteId && r.referenceNumber !== quoteId);
        const updatedAir = [airwayReq, ...filtered];
        try {
          localStorage.setItem('josan_airway_requests', JSON.stringify(updatedAir));
        } catch (e) {}
        return updatedAir;
      });
    }

    // Auto-add customer to CRM customers list if not present
    if (newQuote.customerEmail) {
      setCustomers(prev => {
        const exists = (prev || []).some(c => c.email?.toLowerCase() === newQuote.customerEmail.toLowerCase());
        if (!exists) {
          const newCust = {
            id: `CUST-${Date.now().toString().slice(-4)}`,
            name: newQuote.customerName,
            email: newQuote.customerEmail,
            phone: newQuote.customerPhone,
            company: newQuote.company,
            tier: 'Standard Corporate',
            status: 'Active',
            joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          };
          const updatedCust = [newCust, ...(prev || [])];
          try {
            localStorage.setItem('josan_customers', JSON.stringify(updatedCust));
          } catch (e) {}
          return updatedCust;
        }
        return prev;
      });
    }

    addNotification({
      role: 'admin',
      type: 'quote_request',
      title: `📥 New Quote Request #${quoteId}`,
      message: `${newQuote.customerName} (${newQuote.company}) requested a quote for ${newQuote.origin} → ${newQuote.destination}.`,
      quoteId
    });

    showToast(`Quotation #${quoteId} created! Our operations desk has been notified.`, 'success');
    return newQuote;
  };

  const updateAdminQuote = (quoteId, quotedAmount, adminNotes) => {
    let updatedQuoteObj = null;
    const numericAmount = typeof quotedAmount === 'object' && quotedAmount !== null
      ? Number(quotedAmount.amount ?? quotedAmount.finalAmount ?? quotedAmount.baseTransportationCharge ?? 0)
      : Number(quotedAmount);

    setQuotes(prev => {
      const updated = (prev || []).map(q => {
        if (q.id === quoteId || q.referenceNumber === quoteId) {
          updatedQuoteObj = {
            ...q,
            amount: numericAmount,
            total: numericAmount,
            staffPriced: true,
            status: q.status === 'Draft' ? 'Requested' : q.status,
            lineItems: {
              ...(q.lineItems || {}),
              finalAmount: numericAmount,
              baseTransportationCharge: numericAmount,
              taxRate: 0,
              taxAmount: 0
            },
            notes: adminNotes !== undefined && adminNotes !== null ? adminNotes : q.notes,
            adminNotes: adminNotes !== undefined && adminNotes !== null ? adminNotes : q.adminNotes
          };
          return updatedQuoteObj;
        }
        return q;
      });
      try {
        localStorage.setItem('josan_quotes', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast(`Quotation #${quoteId} pricing updated successfully!`, 'success');
    return updatedQuoteObj;
  };

  const sendQuoteToCustomer = (quoteId) => {
    let sentQuote = null;
    setQuotes(prev => prev.map(q => {
      if (q.id === quoteId) {
        sentQuote = { ...q, status: 'Sent' };
        return sentQuote;
      }
      return q;
    }));

    if (sentQuote) {
      const displayPrice = sentQuote.total !== null && sentQuote.total !== undefined
        ? `S$ ${Number(sentQuote.total).toFixed(2)}`
        : (sentQuote.amount !== null && sentQuote.amount !== undefined ? `S$ ${Number(sentQuote.amount).toFixed(2)}` : 'Pending Quote');
      addNotification({
        role: 'customer',
        type: 'quote',
        title: `📄 Quotation #${quoteId} Ready for Review`,
        message: `Your requested quote from ${sentQuote.origin} to ${sentQuote.destination} is ready: ${displayPrice}. Review and accept to proceed.`,
        quoteId
      });
      showToast(`Quotation #${quoteId} sent to customer!`, 'success');
    }
  };

  const customerRespondQuote = (quoteId, response) => {
    let targetQuote = null;
    setQuotes(prev => prev.map(q => {
      if (q.id === quoteId) {
        targetQuote = { ...q, status: response };
        return targetQuote;
      }
      return q;
    }));

    if (targetQuote) {
      addNotification({
        role: 'admin',
        type: 'quote_response',
        title: `Quotation #${quoteId} ${response}`,
        message: `Customer ${targetQuote.customerName} has ${response.toLowerCase()} quotation #${quoteId}.`,
        quoteId
      });
      showToast(`Quotation #${quoteId} marked as ${response}!`, response === 'Accepted' ? 'success' : 'info');
    }
  };

  const convertQuoteToShipment = (quoteId) => {
    const q = quotes.find(item => item.id === quoteId);
    if (!q) return null;

    const displayPrice = q.total !== null && q.total !== undefined
      ? `S$ ${Number(q.total).toFixed(2)}`
      : (q.amount !== null && q.amount !== undefined ? `S$ ${Number(q.amount).toFixed(2)}` : (q.lineItems?.finalAmount ? `S$ ${Number(q.lineItems.finalAmount).toFixed(2)}` : 'S$ 0.00'));

    const newShipmentId = `JOS-${Math.floor(10000 + Math.random() * 90000)}-SG`;
    const newShipment = {
      id: newShipmentId,
      referenceNumber: `REF-${q.id.replace(/[^0-9]/g, '').slice(-4)}-SG`,
      quoteId: q.id,
      sender: q.customerName,
      senderPhone: q.customerPhone,
      senderAddress: q.origin,
      receiver: q.destination,
      receiverPhone: '+65 6789 0123',
      receiverAddress: q.destination,
      origin: q.origin,
      destination: q.destination,
      currentLocation: `${q.origin} (Staging Bay)`,
      status: 'Confirmed',
      statusType: 'active',
      paymentStatus: 'Unpaid',
      serviceLevel: q.freightMode === 'reefer' ? 'Cold Chain Pharma Vault' : 'Commercial Road Transportation (Partner Carriers)',
      cargoType: q.cargoCategory,
      weight: `${q.cargoWeight} kg`,
      pieces: Math.ceil(q.cargoWeight / 50),
      declaredValue: 'S$ 35,000',
      price: displayPrice,
      driverId: 'DRV-101',
      driverName: 'Tan Wei Ming',
      driverPhone: '+65 6789 0123',
      vehicle: 'Commercial Transport Box Truck #SG-8819',
      vehiclePlate: 'SG-8819',
      vehicleType: '14-Ton Highway Box Truck',
      estimatedDelivery: 'Tomorrow, 04:30 PM (SGT)',
      lastUpdatedTime: 'Just now',
      createdDate: new Date().toLocaleString(),
      timeline: [
        { step: 1, title: 'Consignment Booked from Quote', location: q.origin, timestamp: 'Just now', completed: true },
        { step: 2, title: 'Booking Confirmed by Operations', location: 'Operations Desk', timestamp: 'Just now', completed: true, current: true },
        { step: 3, title: 'Pickup Scheduled', location: q.origin, timestamp: 'Pending', completed: false },
        { step: 4, title: 'Picked Up', location: q.origin, timestamp: 'Pending', completed: false },
        { step: 5, title: 'In Transit', location: 'Expressway Corridor', timestamp: 'Pending', completed: false },
        { step: 6, title: 'Near Destination', location: q.destination, timestamp: 'Pending', completed: false },
        { step: 7, title: 'Delivered & POD Verified', location: q.destination, timestamp: 'Pending', completed: false }
      ],
      coordinates: { origin: [1.3400, 103.7100], current: [1.3400, 103.7100], destination: [1.4420, 103.7680] }
    };

    setShipments(prev => [newShipment, ...prev]);
    setQuotes(prev => prev.map(item => item.id === quoteId ? { ...item, status: 'Converted', convertedShipmentId: newShipmentId } : item));

    // Quote converted to shipment

    showToast(`Converted Quote #${quoteId} into active Shipment #${newShipmentId}!`, 'success');
    return newShipment;
  };

  // Airway Service Requests Operations
  const addAirwayRequest = (requestData) => {
    const existingNums = airwayRequests.map(r => {
      const num = parseInt(r.id?.replace(/\D/g, ''), 10);
      return isNaN(num) ? 0 : num;
    });
    const nextNum = (existingNums.length > 0 ? Math.max(...existingNums) : 0) + 1;
    const formattedId = `AIR-${String(nextNum).padStart(4, '0')}`;

    const newRequest = {
      id: formattedId,
      customerName: requestData.customerName || requestData.fullName || 'Commercial Shipper',
      company: requestData.company || requestData.companyName || 'Corporate Client',
      email: requestData.email,
      phone: requestData.phone,
      receiverName: requestData.receiverName || 'Designated Consignee',
      receiverCompany: requestData.receiverCompany || '',
      receiverEmail: requestData.receiverEmail || '',
      receiverPhone: requestData.receiverPhone || '',
      incoterm: requestData.incoterm || 'FOB',
      origin: requestData.origin,
      destination: requestData.destination,
      cargoDescription: requestData.cargoDescription,
      packagesCount: requestData.packagesCount,
      totalWeight: requestData.totalWeight,
      dimensions: requestData.dimensions || 'Standard Cargo',
      approximateValue: requestData.approximateValue || 'SGD 10,000',
      services: requestData.services || ['AWB Preparation'],
      documents: requestData.documents || [],
      date: new Date().toISOString().split('T')[0],
      status: 'New',
      adminNotes: 'New customer airway service request received.'
    };

    setAirwayRequests(prev => [newRequest, ...prev]);

    if (!requestData.quoteId && !requestData.referenceNumber) {
      addNotification({
      role: 'admin',
      type: 'airway_request',
      title: `✈️ New Airway Service Request (${formattedId})`,
      message: `${newRequest.customerName} (${newRequest.company}) requested airway coordination for ${newRequest.origin} → ${newRequest.destination}.`,
      timestamp: 'Just Now',
      read: false
    });
    }

    showToast(`Airway Service Request #${formattedId} submitted successfully!`, 'success');
    return newRequest;
  };

  const updateAirwayRequestStatus = (id, newStatus) => {
    setAirwayRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    showToast(`Airway Request #${id} status updated to ${newStatus}`, 'success');
  };

  const updateAirwayRequestNotes = (id, notes) => {
    setAirwayRequests(prev => prev.map(r => r.id === id ? { ...r, adminNotes: notes } : r));
    showToast(`Admin note saved for Airway Request #${id}`, 'success');
  };

  // ==========================================
  // PHASE 3: SUPPORT TICKETS OPERATIONS
  // ==========================================
  const createSupportTicket = (ticketData) => {
    const ticketId = `TCK-${Math.floor(100 + Math.random() * 900)}`;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateNow = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    
    const newTicket = {
      id: ticketId,
      shipmentId: ticketData.shipmentId || 'General Inquiry',
      customerName: ticketData.customerName || currentUser?.name || 'Customer Account',
      customerEmail: ticketData.customerEmail || currentUser?.email || 'customer@josan.com',
      customerPhone: ticketData.customerPhone || currentUser?.phone || '+65 6789 0123',
      subject: ticketData.subject || 'Consignment Inquiry',
      priority: ticketData.priority || 'Medium',
      status: 'Open',
      assignedTo: 'Unassigned',
      createdAt: `${dateNow}, ${timeNow} SGT`,
      lastUpdated: 'Just now',
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: ticketData.customerName || currentUser?.name || 'Customer Account',
          role: 'customer',
          text: ticketData.message || 'Support inquiry submitted regarding consignment.',
          timestamp: timeNow
        }
      ]
    };

    setTickets(prev => [newTicket, ...prev]);

    addNotification({
      role: 'admin',
      type: 'ticket',
      title: `🎫 New Support Ticket #${ticketId}`,
      message: `${newTicket.customerName} opened a ${newTicket.priority} priority ticket: "${newTicket.subject}".`,
      shipmentId: ticketData.shipmentId !== 'General Inquiry' ? ticketData.shipmentId : null
    });

    showToast(`Support Ticket #${ticketId} submitted to dispatch team!`, 'success');
    return newTicket;
  };

  const replySupportTicket = (ticketId, messageText, role = 'admin', senderName = '') => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const author = senderName || (role === 'admin' ? (currentUser?.name || 'Operations Lead') : (currentUser?.name || 'Customer'));

    let targetTicket = null;
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const updatedMessages = [
          ...t.messages,
          {
            id: `msg-${Date.now()}`,
            sender: author,
            role,
            text: messageText,
            timestamp: timeNow
          }
        ];
        const nextStatus = role === 'admin' ? (t.status === 'Open' ? 'In Progress' : 'Waiting for Customer') : 'In Progress';
        targetTicket = {
          ...t,
          status: nextStatus,
          lastUpdated: 'Just now',
          messages: updatedMessages
        };
        return targetTicket;
      }
      return t;
    }));

    if (targetTicket) {
      if (role === 'admin') {
        addNotification({
          role: 'customer',
          type: 'ticket',
          title: `💬 Update on Ticket #${ticketId}`,
          message: `${author} replied to your support ticket: "${targetTicket.subject}".`,
          shipmentId: targetTicket.shipmentId !== 'General Inquiry' ? targetTicket.shipmentId : null
        });
      } else {
        addNotification({
          role: 'admin',
          type: 'ticket',
          title: `💬 Customer Reply on Ticket #${ticketId}`,
          message: `${author} replied to ticket #${ticketId}: "${targetTicket.subject}".`,
          shipmentId: targetTicket.shipmentId !== 'General Inquiry' ? targetTicket.shipmentId : null
        });
      }
      showToast(`Reply sent to Ticket #${ticketId}!`, 'success');
    }
  };

  const updateTicketStatus = (ticketId, newStatus, assignedTo) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: newStatus,
          assignedTo: assignedTo !== undefined ? assignedTo : t.assignedTo,
          lastUpdated: 'Just now'
        };
      }
      return t;
    }));
    showToast(`Ticket #${ticketId} status changed to ${newStatus}!`, 'info');
  };

  // ==========================================
  // PHASE 3: INVOICES & PAYMENT OPERATIONS
  // ==========================================
  const updateInvoicePaymentStatus = (invoiceId, newStatus, notes = '') => {
    let targetInv = null;
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId || inv.invoiceNumber === invoiceId) {
        targetInv = {
          ...inv,
          paymentStatus: newStatus,
          notes: notes || inv.notes
        };
        return targetInv;
      }
      return inv;
    }));

    // If invoice is linked to a shipment, sync shipment.paymentStatus
    if (targetInv && targetInv.shipmentId) {
      setShipments(prev => prev.map(s => {
        if (s.id === targetInv.shipmentId) {
          return {
            ...s,
            paymentStatus: newStatus
          };
        }
        return s;
      }));

      // Payment status updated
    }

    showToast(`Invoice #${targetInv?.invoiceNumber || invoiceId} payment status updated to "${newStatus}"!`, 'success');
  };

  // ==========================================
  // PHASE 3: SHIPMENT DOCUMENT VAULT
  // ==========================================
  const uploadShipmentDocument = (shipmentId, docData) => {
    const docId = `DOC-${shipmentId.replace(/[^0-9]/g, '').slice(-4) || 'GEN'}-${Date.now().toString().slice(-3)}`;
    const newDoc = {
      id: docId,
      shipmentId,
      customerName: docData.customerName || 'Consignment Shipper',
      type: docData.type || 'Commercial Document',
      name: docData.name || `Document_${docId}.pdf`,
      fileSize: docData.fileSize || '150 KB',
      uploadedBy: docData.uploadedBy || (currentUser?.name ? `${currentUser.name} (${currentUser.role})` : 'Authorized User'),
      uploadDate: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} SGT`,
      status: docData.status || 'Verified',
      docCategory: docData.docCategory || 'other'
    };

    setDocuments(prev => [newDoc, ...prev]);

    // Document attached

    showToast(`Uploaded ${newDoc.type} for Consignment #${shipmentId}!`, 'success');
    return newDoc;
  };

  const deleteShipmentDocument = (docId) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
    showToast('Document removed from archive.', 'info');
  };

  // ==========================================
  // CRM MODULE OPERATIONS
  // ==========================================
  const addLead = (leadData) => {
    const newId = `LEAD-${Math.floor(100 + Math.random() * 900)}`;
    const today = new Date().toISOString().split('T')[0];
    const tagsArr = Array.isArray(leadData.tags) 
      ? leadData.tags 
      : (typeof leadData.tags === 'string' ? leadData.tags.split(',').map(t => t.trim()).filter(Boolean) : []);

    const newLead = {
      id: newId,
      name: leadData.name || '',
      company: leadData.company || leadData.name || 'New Enterprise Prospect',
      email: leadData.email || '',
      phone: leadData.phone || '',
      source: leadData.source || 'Website Inquiry',
      stage: leadData.stage || 'New',
      estimatedValue: Number(leadData.estimatedValue) || 0,
      tags: tagsArr,
      createdDate: today,
      convertedCustomerId: null
    };

    setLeads(prev => [newLead, ...prev]);
    showToast(`Lead for ${newLead.company} created (#${newId})!`, 'success');
    return newLead;
  };

  const updateLeadStage = (leadId, newStage) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: newStage } : l));
    showToast(`Lead stage updated to ${newStage}!`, 'info');
  };

  const updateLead = (leadId, updatedData) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const tagsArr = updatedData.tags !== undefined
          ? (Array.isArray(updatedData.tags) ? updatedData.tags : String(updatedData.tags).split(',').map(t => t.trim()).filter(Boolean))
          : l.tags;
        return {
          ...l,
          ...updatedData,
          tags: tagsArr,
          estimatedValue: updatedData.estimatedValue !== undefined ? Number(updatedData.estimatedValue) : l.estimatedValue
        };
      }
      return l;
    }));
    showToast(`Lead #${leadId} updated!`, 'info');
  };

  const deleteLead = (leadId) => {
    setLeads(prev => prev.filter(l => l.id !== leadId));
    showToast(`Lead #${leadId} deleted.`, 'info');
  };

  const convertLeadToCustomer = (leadId, extraDetails = {}) => {
    const targetLead = leads.find(l => l.id === leadId);
    if (!targetLead) return null;

    const newCustId = `CUST-${String(customers.length + 1).padStart(3, '0')}`;
    const newCustomer = {
      id: newCustId,
      name: targetLead.company || targetLead.name,
      contactPerson: `${targetLead.name} (${extraDetails.designation || 'Supply Chain Lead'})`,
      email: targetLead.email,
      phone: targetLead.phone,
      company: targetLead.company || targetLead.name,
      address: extraDetails.address || 'Singapore Logistics Hub, SG',
      tier: extraDetails.tier || 'Standard Corporate',
      creditLimit: extraDetails.creditLimit || 'S$ 35,000',
      paymentTerms: extraDetails.paymentTerms || 'Net 30 Days',
      totalOrders: 0,
      totalSpent: 0,
      activeShipments: 0,
      status: 'Active',
      registeredDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      tags: [...(targetLead.tags || []), 'Converted Lead']
    };

    setCustomers(prev => [...prev, newCustomer]);
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: 'Won', convertedCustomerId: newCustId } : l));

    // Log a communication event for record
    const timeStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' SGT';
    const commId = `COMM-${Math.floor(100 + Math.random() * 900)}`;
    const newComm = {
      id: commId,
      leadId: leadId,
      customerId: newCustId,
      type: 'note',
      summary: `🎉 Qualified lead converted to Corporate Account #${newCustId} (${newCustomer.name}) with ${newCustomer.tier} status.`,
      staffName: currentUser?.name || 'CRM Lead Specialist',
      timestamp: timeStr
    };
    setCommunications(prev => [newComm, ...prev]);

    showToast(`🎉 Lead #${leadId} converted to Corporate Customer ${newCustomer.name} (${newCustId})!`, 'success');
    return newCustomer;
  };

  const addCommunication = (commData) => {
    const newId = `COMM-${Math.floor(100 + Math.random() * 900)}`;
    const timeStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' SGT';
    const newComm = {
      id: newId,
      leadId: commData.leadId || null,
      customerId: commData.customerId || null,
      type: commData.type || 'note',
      summary: commData.summary || '',
      staffName: commData.staffName || currentUser?.name || 'Staff Member',
      timestamp: commData.timestamp || timeStr
    };
    setCommunications(prev => [newComm, ...prev]);
    showToast(`Logged communication entry #${newId}!`, 'success');
    return newComm;
  };

  const deleteCommunication = (commId) => {
    setCommunications(prev => prev.filter(c => c.id !== commId));
    showToast('Communication entry removed.', 'info');
  };

  const addTask = (taskData) => {
    const newId = `TASK-${Math.floor(100 + Math.random() * 900)}`;
    const newTask = {
      id: newId,
      leadId: taskData.leadId || null,
      customerId: taskData.customerId || null,
      title: taskData.title || 'Follow-up Task',
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      assignedTo: taskData.assignedTo || currentUser?.name || 'Darren Josan',
      status: taskData.status || 'pending',
      priority: (taskData.priority || 'medium').toLowerCase()
    };
    setTasks(prev => [newTask, ...prev]);
    showToast(`CRM Task created (#${newId})!`, 'success');
    return newTask;
  };

  const updateTask = (taskId, updatedData) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updatedData } : t));
    showToast(`Task #${taskId} updated!`, 'info');
  };

  const toggleTaskStatus = (taskId) => {
    let updatedStatus = 'pending';
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        updatedStatus = t.status === 'pending' ? 'done' : 'pending';
        return { ...t, status: updatedStatus };
      }
      return t;
    }));
    showToast(`Task marked as ${updatedStatus}!`, 'info');
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    showToast('Task removed.', 'info');
  };

  const updateCustomerTags = (customerId, tags) => {
    const tagsArr = Array.isArray(tags) ? tags : String(tags).split(',').map(t => t.trim()).filter(Boolean);
    setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, tags: tagsArr } : c));
    showToast(`Customer #${customerId} tags updated!`, 'info');
  };

  const flagWeatherDelay = (shipmentId, weatherCondition = 'Severe Thunderstorm & High Crosswind Corridor') => {
    setShipments(prev => prev.map(s => {
      if (s.id === shipmentId) {
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newTimeline = s.timeline.map((step, idx) => {
          if (idx === 2) {
            return {
              ...step,
              title: `⛈️ Weather Delay Flagged (${weatherCondition})`,
              timestamp: timeNow,
              completed: true,
              current: true
            };
          }
          return step;
        });

        return {
          ...s,
          status: 'Delayed',
          statusType: 'warning',
          weatherDelay: {
            active: true,
            condition: weatherCondition,
            etaImpact: '+45 Minutes Safety Margin Added',
            smsSent: true,
            emailSent: true,
            timestamp: timeNow
          },
          timeline: newTimeline
        };
      }
      return s;
    }));

    showToast(`Weather delay flagged for #${shipmentId}! Automated SMS & Email notifications dispatched to recipient.`, 'warning');
  };

  const assignDriver = async (shipmentId, driverId) => {
    const driverObj = (drivers || []).find(d => d.id === driverId || d.driverId === driverId);
    if (!driverObj) return;

    const targetShipment = shipments.find(s => s.id === shipmentId);

    setShipments(prev => prev.map(s => {
      if (s.id === shipmentId) {
        return {
          ...s,
          driverId: driverObj.id,
          driverName: driverObj.name,
          driverEmail: driverObj.email,
          driverPhone: driverObj.phone,
          vehicle: `${driverObj.vehicleType || 'Express Cargo Truck'} (${driverObj.vehicleId || 'SG-8819'})`,
          vehiclePlate: driverObj.vehicleId || 'SG-8819',
          status: 'Processing'
        };
      }
      return s;
    }));

    setDrivers(prev => prev.map(d => {
      if (d.id === driverId || d.driverId === driverId) {
        return { ...d, status: 'On Delivery', activeTripId: shipmentId };
      }
      return d;
    }));

    if (isSupabaseConfigured) {
      await supabaseApi.assignDriver(shipmentId, driverObj.id, driverObj.name, driverObj.phone, `${driverObj.vehicleType} (${driverObj.vehicleId || 'SG-8819'})`);
    }

    const adminIntimation = {
      id: `INT-ADM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      shipmentId: shipmentId,
      type: 'admin_assigned',
      targetDriverId: driverId,
      title: `🚨 Direct Admin Order Assignment (#${shipmentId})`,
      message: `Fleet Operations Manager assigned Order #${shipmentId} directly to your roster!`,
      pickup: targetShipment?.senderAddress || targetShipment?.origin || 'Changi Air Cargo Logistics Hub - 8 Changi South Street 1',
      delivery: targetShipment?.receiverAddress || targetShipment?.destination || 'West Coast Hub Terminal - 12 Pasir Panjang Road',
      cargoType: targetShipment?.cargoType || 'Commercial Freight',
      weight: targetShipment?.weight || '250 kg',
      price: targetShipment?.price || '$315.00',
      timestamp: 'Just Now',
      status: 'Assigned'
    };

    // Filter out any existing intimations for this shipmentId to avoid duplicate cards!
    setDriverIntimations(prev => [adminIntimation, ...prev.filter(i => i.shipmentId !== shipmentId)]);

    showToast(`Assigned driver ${driverObj.name} to shipment #${shipmentId}!`, 'success');
  };

  const assignDriverWithCredentials = async ({ shipmentId, driverData, isNewDriver = false }) => {
    let finalDriver = null;
    if (isNewDriver) {
      finalDriver = await addDriver(driverData);
    } else {
      finalDriver = (drivers || []).find(d => d.id === driverData.id || d.email?.toLowerCase() === driverData.email?.toLowerCase()) || driverData;
    }

    if (!finalDriver) return null;

    const targetShipment = shipments.find(s => s.id === shipmentId);

    setShipments(prev => prev.map(s => {
      if (s.id === shipmentId) {
        return {
          ...s,
          driverId: finalDriver.id,
          driverName: finalDriver.name,
          driverEmail: finalDriver.email,
          driverPhone: finalDriver.phone,
          vehicle: `${finalDriver.vehicleType || 'Express Box Truck'} (${finalDriver.vehicleId || 'SG-8819'})`,
          vehiclePlate: finalDriver.vehicleId || 'SG-8819',
          status: 'Processing'
        };
      }
      return s;
    }));

    setDrivers(prev => prev.map(d => {
      if (d.id === finalDriver.id) {
        return { ...d, status: 'On Delivery', activeTripId: shipmentId };
      }
      return d;
    }));

    const adminIntimation = {
      id: `INT-ADM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      shipmentId: shipmentId,
      type: 'admin_assigned',
      targetDriverId: finalDriver.id,
      title: `🚨 Direct Admin Order Assignment (#${shipmentId})`,
      message: `Fleet Operations Manager assigned Order #${shipmentId} directly to your roster!`,
      pickup: targetShipment?.senderAddress || targetShipment?.origin || 'Changi Air Cargo Logistics Hub - 8 Changi South Street 1',
      delivery: targetShipment?.receiverAddress || targetShipment?.destination || 'West Coast Hub Terminal - 12 Pasir Panjang Road',
      cargoType: targetShipment?.cargoType || 'Commercial Freight',
      weight: targetShipment?.weight || '250 kg',
      price: targetShipment?.price || '$315.00',
      timestamp: 'Just Now',
      status: 'Assigned'
    };

    setDriverIntimations(prev => [adminIntimation, ...prev.filter(i => i.shipmentId !== shipmentId)]);

    if (isSupabaseConfigured) {
      await supabaseApi.assignDriver(shipmentId, finalDriver.id, finalDriver.name, finalDriver.phone, `${finalDriver.vehicleType || 'Express Box Truck'} (${finalDriver.vehicleId || 'SG-8819'})`);
    }

    showToast(`Driver ${finalDriver.name} successfully assigned to #${shipmentId}!`, 'success');
    return finalDriver;
  };

  const acceptDriverIntimation = (intimationId, driverObj = {}) => {
    const intimation = driverIntimations.find(i => String(i.id) === String(intimationId) || String(i.shipmentId) === String(intimationId));
    if (!intimation) return null;

    // Filter out all intimations matching either ID or shipmentId
    setDriverIntimations(prev => prev.filter(i => String(i.id) !== String(intimationId) && String(i.shipmentId) !== String(intimation.shipmentId)));

    let existingShipment = shipments.find(s => s.id === intimation.shipmentId);

    const updatedShipment = {
      id: intimation.shipmentId,
      sender: existingShipment?.sender || 'Enterprise Client',
      senderPhone: existingShipment?.senderPhone || '+65 6789 0123',
      senderAddress: existingShipment?.senderAddress || intimation.pickup || 'Changi Air Cargo Logistics Hub',
      receiver: existingShipment?.receiver || 'Recipient Facility',
      receiverPhone: existingShipment?.receiverPhone || '+65 8123 4567',
      receiverAddress: existingShipment?.receiverAddress || intimation.delivery || 'West Coast Hub Terminal',
      origin: intimation.pickupCity || 'Changi Air Cargo Hub',
      destination: 'Singapore Regional Destination',
      currentLocation: `En Route from ${intimation.pickup || 'Dispatch Hub'}`,
      status: 'In Transit',
      statusType: 'active',
      serviceLevel: 'Express Air Freight',
      cargoType: intimation.cargoType || 'General Freight',
      weight: intimation.weight || '50 kg',
      pieces: 1,
      declaredValue: '$2,500',
      price: intimation.price || 'S$ 180.00',
      driverId: driverObj?.id || 'DRV-001',
      driverName: driverObj?.name || 'Active Fleet Driver',
      driverPhone: driverObj?.phone || '+65 6789 0123',
      vehicle: `${driverObj?.assignedVehicle || 'Refrigerated Van (SG-8819)'}`,
      estimatedDelivery: 'Same-Day Regional Dispatch',
      createdDate: new Date().toLocaleString(),
      timeline: [
        { title: 'Order Booked & Intimated', location: intimation.pickup || 'Origin Hub', timestamp: 'Just Now', completed: true, current: false, icon: 'FileCheck' },
        { title: 'Accepted by Driver (In Transit)', location: intimation.pickup || 'Origin Hub', timestamp: 'Just Now', completed: true, current: true, icon: 'Truck' },
        { title: 'In Transit & Sorting Center', location: 'Sorting Hub', timestamp: 'Pending', completed: false, icon: 'PackageCheck' },
        { title: 'Out for Delivery', location: intimation.delivery || 'Destination Hub', timestamp: 'Pending', completed: false, icon: 'MapPin' },
        { title: 'Delivered & Signature Verified', location: intimation.delivery || 'Destination Hub', timestamp: 'Pending', completed: false, icon: 'CheckCircle2' }
      ]
    };

    setShipments(prev => {
      const exists = prev.some(s => s.id === intimation.shipmentId);
      if (exists) {
        return prev.map(s => s.id === intimation.shipmentId ? updatedShipment : s);
      }
      return [updatedShipment, ...prev];
    });

    showToast(`Accepted Order #${intimation.shipmentId}! Live GPS telematics & navigation route initialized.`, 'success');
    return updatedShipment;
  };

  const declineDriverIntimation = (intimationId) => {
    const target = driverIntimations.find(i => String(i.id) === String(intimationId) || String(i.shipmentId) === String(intimationId));
    setDriverIntimations(prev => prev.filter(i => String(i.id) !== String(intimationId) && (target ? String(i.shipmentId) !== String(target.shipmentId) : true)));
    showToast('Intimation alert dismissed.', 'info');
  };

  // Driver operations
  const addDriver = async (newDriver) => {
    const driverWithId = {
      ...newDriver,
      id: newDriver.id || `DRV-${Math.floor(100 + Math.random() * 900)}`,
      name: newDriver.name,
      email: newDriver.email,
      phone: newDriver.phone,
      licenseNumber: newDriver.licenseNumber || 'SG-CLASS4-991',
      dob: newDriver.dob || '1992-08-14',
      vehicleType: newDriver.vehicleType || 'Refrigerated Van',
      vehicleId: newDriver.vehicleId || 'SG-900',
      assignedVehicle: `${newDriver.vehicleType || 'Refrigerated Van'} (${newDriver.vehicleId || 'SG-900'})`,
      assignedHub: newDriver.assignedHub || 'Singapore Changi Air Cargo Hub',
      workingLocation: newDriver.assignedHub || 'Singapore Changi Air Cargo Hub',
      deliveriesCompleted: 0,
      onTimeRate: '100%',
      rating: 5.0,
      safetyScore: '100/100',
      status: 'Available',
      photo: newDriver.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
    };
    setDrivers(prev => [driverWithId, ...prev.filter(d => d.id !== driverWithId.id)]);
    showToast(`Driver ${driverWithId.name} added to fleet roster`);

    if (isSupabaseConfigured) {
      await supabaseApi.createDriver(driverWithId);
    }
    return driverWithId;
  };

  const updateDriver = async (driverId, updatedFields) => {
    setDrivers(prev => prev.map(d => d.id === driverId ? { ...d, ...updatedFields } : d));
    showToast(`Driver details updated`, 'success');
    if (isSupabaseConfigured) {
      await supabaseApi.updateDriver(driverId, updatedFields);
    }
  };

  const updateDriverPassword = async (driverId) => {
    showToast(`Driver ID #${driverId} profile updated`, 'success');
  };

  const updateDriverPhoto = async (driverId, photoUrl) => {
    setDrivers(prev => prev.map(d => d.id === driverId ? { ...d, photo: photoUrl } : d));
    showToast(`Profile photo updated for Driver ID #${driverId}`, 'success');

    if (isSupabaseConfigured) {
      await supabaseApi.updateDriver(driverId, { photo: photoUrl });
    }
  };

  const removeDriver = async (driverId) => {
    setDrivers(prev => prev.filter(d => d.id !== driverId));
    showToast('Driver removed from active fleet', 'warning');

    if (isSupabaseConfigured) {
      await supabaseApi.deleteDriver(driverId);
    }
  };

  const toggleDriverStatus = async (driverId, newStatus) => {
    setDrivers(prev => prev.map(d => d.id === driverId ? { ...d, status: newStatus } : d));
    showToast(`Driver status updated to ${newStatus}`);

    if (isSupabaseConfigured) {
      await supabaseApi.updateDriver(driverId, { status: newStatus });
    }
  };

  // Warehouse operations
  const addWarehouse = (newWhData) => {
    const cleanName = (newWhData.name || 'Singapore Logistics Hub').replace(/[^a-zA-Z\s]/g, '');
    const cleanManager = (newWhData.manager || 'Logistics Lead').replace(/[^a-zA-Z\s]/g, '');
    const newWh = {
      id: `WH-${Date.now().toString().slice(-4)}`,
      name: cleanName || 'Singapore Logistics Hub',
      location: newWhData.location || 'Woodlands, Singapore',
      manager: cleanManager || 'Logistics Lead',
      capacityPercentage: Number(newWhData.capacityPercentage) || 60,
      activeParcels: Number(newWhData.activeParcels) || 2500,
      capacitySqFt: newWhData.capacitySqFt || '250,000 sq ft',
      incomingToday: Number(newWhData.incomingToday) || 420,
      outgoingToday: Number(newWhData.outgoingToday) || 390,
      bins: [
        { binId: 'BIN-SG01', item: 'High-Tech Microchips', status: 'Staged for Load' },
        { binId: 'BIN-SG02', item: 'Pharma Cold Storage', status: 'In Storage' },
        { binId: 'BIN-SG03', item: 'Automotive Spare Parts', status: 'Ready for Trucking' }
      ]
    };
    setWarehouses(prev => [newWh, ...prev]);
    showToast(`Added new Warehouse Hub: ${newWh.name}`);
  };

  const updateWarehouse = (whId, updatedData) => {
    setWarehouses(prev => prev.map(w => {
      if (w.id === whId) {
        return {
          ...w,
          ...updatedData
        };
      }
      return w;
    }));
    showToast(`Saved changes for Warehouse Hub: ${updatedData.name || ''}`);
  };

  const removeWarehouse = (whId) => {
    setWarehouses(prev => prev.filter(w => w.id !== whId));
    showToast('Warehouse hub removed from roster', 'info');
  };

  const updateWarehouseBinStatus = (warehouseId, binId, newStatus) => {
    setWarehouses(prev => prev.map(wh => {
      if (wh.id === warehouseId) {
        return {
          ...wh,
          bins: (wh.bins || []).map(bin => {
            if (bin.binId === binId) {
              return { ...bin, status: newStatus };
            }
            return bin;
          })
        };
      }
      return wh;
    }));
    showToast(`Updated Bin ${binId} status to "${newStatus}"!`);
  };

  // Search helper
  const getShipmentByTracking = (id) => {
    if (!id) return null;
    const searchClean = id.trim().toUpperCase();
    return shipments.find(s => s.id.toUpperCase() === searchClean || s.id.toUpperCase().includes(searchClean));
  };

  const assignDriverToShipment = async (shipmentId, driverId) => {
    const selectedDriver = (drivers || []).find(d => d.id === driverId || d.driverId === driverId);
    if (!selectedDriver) return false;

    setShipments(prev => prev.map(s => {
      if (s.id === shipmentId) {
        return {
          ...s,
          driverId: selectedDriver.id,
          driverName: selectedDriver.name,
          driverPhone: selectedDriver.phone,
          vehicle: selectedDriver.vehicleType || s.vehicle,
          vehiclePlate: selectedDriver.vehicleId || s.vehiclePlate,
          status: 'ASSIGNED',
          timeline: s.timeline ? s.timeline.map(t => t.step === 3 ? { ...t, completed: true, current: true } : t) : s.timeline
        };
      }
      return s;
    }));

    setDrivers(prev => prev.map(d => {
      if (d.id === driverId || d.driverId === driverId) {
        return { ...d, status: 'On Delivery', activeTripId: shipmentId };
      }
      return d;
    }));

    if (isSupabaseConfigured) {
      await supabaseApi.assignDriver(shipmentId, selectedDriver.id, selectedDriver.name, selectedDriver.phone, selectedDriver.vehicleType || 'Box Truck');
    }

    try {
      backendApi.assignDriverToTrip(shipmentId, driverId).catch(err => console.warn('Dispatch API:', err));
    } catch (e) {}

    showToast(`Driver ${selectedDriver.name} assigned & dispatched to shipment #${shipmentId}!`, 'success');
    return true;
  };

  const syncCustomerAppAccount = (customerData) => {
    const newCust = {
      id: customerData.id || `CUST-${Date.now().toString().slice(-4)}`,
      name: customerData.name || 'Corporate Account',
      company: customerData.company || 'Customer App Account',
      email: customerData.email,
      phone: customerData.phone,
      address: customerData.address || 'Singapore',
      tier: customerData.tier || 'Standard Corporate',
      totalSpent: 'S$ 0.00',
      totalShipments: 0,
      status: 'Active',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    setCustomers(prev => [newCust, ...prev.filter(c => c.email !== customerData.email)]);

    try {
      backendApi.syncCustomerAppAccount(newCust).catch(err => console.warn('Customer Sync API:', err));
    } catch (e) {}

    showToast(`Account ${newCust.name} synced with Customer App!`, 'success');
    return newCust;
  };

  // CRM Helper Operations
  const addTransportationPartner = (partnerData) => {
    const newPartner = {
      ...partnerData,
      id: partnerData.id || `PRT-${Date.now().toString().slice(-4)}`,
      registeredVehicles: Number(partnerData.registeredVehicles) || 4,
      designatedDrivers: Number(partnerData.designatedDrivers) || 4,
      activeDispatches: Number(partnerData.activeDispatches) || 0,
      agreementStatus: partnerData.agreementStatus || 'Active Partner'
    };
    setTransportationPartners(prev => [newPartner, ...prev]);
    showToast(`Transportation partner "${newPartner.name}" added successfully!`, 'success');
    return newPartner;
  };

  const updateTransportationPartner = (partnerId, updatedData) => {
    setTransportationPartners(prev => prev.map(p => p.id === partnerId ? { ...p, ...updatedData } : p));
    showToast(`Transportation partner #${partnerId} updated!`, 'success');
  };

  const deleteTransportationPartner = (partnerId) => {
    setTransportationPartners(prev => prev.filter(p => p.id !== partnerId));
    showToast(`Partner removed from roster`, 'info');
  };

  const assignPartnerToShipment = (shipmentId, partnerId, partnerName) => {
    setShipments(prev => prev.map(s => {
      if (s.id === shipmentId) {
        return {
          ...s,
          transportationPartnerId: partnerId,
          transportationPartner: partnerName,
          status: s.status === 'New Booking' || s.status === 'Pending' ? 'Partner Assigned' : s.status,
          adminNotes: `${s.adminNotes ? s.adminNotes + ' | ' : ''}Transportation Partner assigned: ${partnerName}`
        };
      }
      return s;
    }));
    // Partner assigned
    showToast(`Assigned ${partnerName} to shipment #${shipmentId}!`, 'success');
  };

  const addCustomer = (customerData) => {
    const newCust = {
      id: customerData.id || `CUST-${Date.now().toString().slice(-4)}`,
      name: customerData.name || 'Commercial Client',
      company: customerData.company || customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      address: customerData.address || 'Singapore',
      tier: customerData.tier || 'Standard Corporate',
      creditLimit: customerData.creditLimit || 'S$ 30,000',
      paymentTerms: customerData.paymentTerms || 'Net 30 Days',
      totalOrders: 0,
      totalSpent: 0,
      activeShipments: 0,
      status: customerData.status || 'Active',
      registeredDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      tags: customerData.tags || ['Corporate Client'],
      notes: customerData.notes || ''
    };
    setCustomers(prev => [newCust, ...prev]);
    showToast(`Customer account "${newCust.company}" added!`, 'success');
    return newCust;
  };

  const updateCustomer = (customerId, updatedData) => {
    setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, ...updatedData } : c));
    showToast(`Customer #${customerId} updated!`, 'success');
  };

  const deleteCustomer = (customerId) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
    showToast('Customer record archived', 'info');
  };

  const addInvoice = (invoiceData) => {
    const invId = invoiceData.invoiceNumber || `INV-2026-${Date.now().toString().slice(-4)}`;
    const newInv = {
      id: invId,
      invoiceNumber: invId,
      shipmentId: invoiceData.shipmentId || invoiceData.requestId || 'REQ-GENERAL',
      customerName: invoiceData.customerName || 'Commercial Client',
      customerEmail: invoiceData.customerEmail || '',
      customerPhone: invoiceData.customerPhone || '',
      service: invoiceData.service || 'Air Freight Services / Road Transportation',
      subtotal: Number(invoiceData.amount || invoiceData.subtotal || 0),
      taxRate: 0.09,
      taxAmount: Number(((Number(invoiceData.amount || invoiceData.subtotal || 0)) * 0.09).toFixed(2)),
      total: Number(((Number(invoiceData.amount || invoiceData.subtotal || 0)) * 1.09).toFixed(2)),
      paymentStatus: invoiceData.paymentStatus || 'Unpaid',
      issueDate: invoiceData.issueDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      dueDate: invoiceData.dueDate || new Date(Date.now() + 30 * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      notes: invoiceData.notes || 'Tax invoice for logistics services provided.'
    };
    setInvoices(prev => [newInv, ...prev]);
    addNotification({
      role: 'admin',
      type: 'billing',
      title: `🧾 Invoice Created: #${newInv.invoiceNumber}`,
      message: `Invoice generated for ${newInv.customerName} (S$ ${newInv.total.toFixed(2)}).`,
      shipmentId: newInv.shipmentId
    });
    showToast(`Invoice #${newInv.invoiceNumber} created!`, 'success');
    return newInv;
  };

  const addDocument = (docData) => {
    const docId = `DOC-${Date.now().toString().slice(-4)}`;
    const newDoc = {
      id: docId,
      shipmentId: docData.shipmentId || docData.requestId || 'GENERAL',
      customerName: docData.customerName || 'Commercial Shipper',
      type: docData.type || 'Commercial Invoice',
      name: docData.name || `Document_${docId}.pdf`,
      fileSize: docData.fileSize || '180 KB',
      uploadedBy: currentUser?.name || 'CRM Operations Staff',
      uploadDate: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} SGT`,
      status: docData.status || 'Verified',
      docCategory: docData.docCategory || 'other',
      notes: docData.notes || ''
    };
    setDocuments(prev => [newDoc, ...prev]);
    showToast(`Document "${newDoc.name}" uploaded successfully!`, 'success');
    return newDoc;
  };

  const updateDocumentStatus = (docId, newStatus) => {
    setDocuments(prev => prev.map(d => d.id === docId ? { ...d, status: newStatus } : d));
    showToast(`Document #${docId} marked as ${newStatus}`, 'success');
  };

  const createCrmQuotation = (quoteData) => {
    const quoteId = quoteData.id || `QR-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const hasAmount = quoteData.amount !== undefined && quoteData.amount !== null && quoteData.amount !== '' && !isNaN(Number(quoteData.amount));
    const amountVal = hasAmount ? Number(quoteData.amount) : null;
    const isPriced = hasAmount && amountVal > 0;

    const newQuote = {
      id: quoteId,
      customerId: quoteData.customerId || 'USR-GUEST',
      customerName: quoteData.customerName || 'Commercial Client',
      customerEmail: quoteData.customerEmail || '',
      customerPhone: quoteData.customerPhone || '',
      company: quoteData.company || quoteData.customerName,
      requestId: quoteData.requestId || '',
      service: quoteData.service || 'Air Freight Services',
      origin: quoteData.origin || 'Singapore',
      destination: quoteData.destination || 'Designated Destination',
      cargoCategory: quoteData.cargoCategory || 'General Commercial Freight',
      cargoWeight: quoteData.cargoWeight || '150 kg',
      status: quoteData.status || (isPriced ? 'Draft' : 'Requested'),
      staffPriced: isPriced,
      createdAt: quoteData.createdAt || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      validUntil: quoteData.validUntil || new Date(Date.now() + 14 * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      lineItems: isPriced ? {
        baseTransportationCharge: amountVal,
        taxRate: 0,
        taxAmount: 0,
        finalAmount: amountVal
      } : null,
      total: amountVal,
      amount: amountVal,
      notes: quoteData.notes || ''
    };
    setQuotes(prev => [newQuote, ...prev]);
    showToast(`Quotation #${quoteId} created!`, 'success');
    return newQuote;
  };

  return (
    <LogisticsContext.Provider value={{
      shipments,
      drivers,
      warehouses,
      analyticsData,
      currentRole,
      setCurrentRole,
      currentUser,
      setCurrentUser,
      isSocketConnected,
      socketId,
      toast,
      activeTrackingId,
      isAuthModalOpen,
      authModalHideClose,
      setAuthModalHideClose,
      openAuthModalWithoutClose,
      authRedirectTab,
      setAuthRedirectTab,
      customerSubTab,
      setCustomerSubTab,
      driverSubTab,
      setDriverSubTab,
      addressList,
      setAddressList,
      addSavedAddress,
      updateSavedAddress,
      deleteSavedAddress,
      setActiveTrackingId,
      selectedInvoiceShipment,
      setSelectedInvoiceShipment,
      setIsAuthModalOpen,
      toggleRole,
      loginUser,
      logoutUser,
      updateUserProfile,
      addShipment,
      deleteShipment,
      payShipmentInvoice,
      updateShipmentStatus,
      flagWeatherDelay,
      assignDriver,
      assignDriverWithCredentials,
      assignDriverToShipment,
      syncCustomerAppAccount,
      addDriver,
      updateDriver,
      updateDriverPassword,
      updateDriverPhoto,
      removeDriver,
      toggleDriverStatus,
      addWarehouse,
      updateWarehouse,
      removeWarehouse,
      updateWarehouseBinStatus,
      driverIntimations,
      acceptDriverIntimation,
      declineDriverIntimation,
      getShipmentByTracking,
      quotes,
      setQuotes,
      notifications,
      setNotifications,
      customers,
      setCustomers,
      documents,
      setDocuments,
      invoices,
      setInvoices,
      tickets,
      setTickets,
      leads,
      setLeads,
      communications,
      setCommunications,
      tasks,
      setTasks,
      addLead,
      updateLeadStage,
      updateLead,
      deleteLead,
      convertLeadToCustomer,
      addCommunication,
      deleteCommunication,
      addTask,
      updateTask,
      toggleTaskStatus,
      deleteTask,
      updateCustomerTags,
      createSupportTicket,
      replySupportTicket,
      updateTicketStatus,
      updateInvoicePaymentStatus,
      uploadShipmentDocument,
      deleteShipmentDocument,
      selectedDetailShipment,
      setSelectedDetailShipment,
      addNotification,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      clearNotifications,
      startDriverTrip,
      updateShipmentLocation,
      reachDestination,
      verifyDeliveryOtp,
      submitPod,
      requestQuote,
      updateAdminQuote,
      sendQuoteToCustomer,
      customerRespondQuote,
      convertQuoteToShipment,
      airwayRequests,
      addAirwayRequest,
      updateAirwayRequestStatus,
      updateAirwayRequestNotes,
      transportationPartners,
      setTransportationPartners,
      addTransportationPartner,
      updateTransportationPartner,
      deleteTransportationPartner,
      assignPartnerToShipment,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addInvoice,
      addDocument,
      updateDocumentStatus,
      createCrmQuotation,
      shipmentScope,
      setShipmentScope,
      resetShipmentScope,
      isShipmentTypeModalOpen,
      setIsShipmentTypeModalOpen,
      showToast,

      // Cargo & Pricing Module (CRM)
      cargoPricing,
      setCargoPricing,
      addCargoPricing,
      updateCargoPricing,
      deleteCargoPricing,
      toggleCargoPricingStatus,
      calculateCargoPrice,

      // System Users & Roles (Admin)
      systemUsers,
      setSystemUsers,
      addSystemUser,
      updateSystemUser,
      deleteSystemUser,
      toggleSystemUserStatus,
      crmRolePermissions,
      setCrmRolePermissions,
      updateRolePermissions,
      updateUserPermissions,

      // Website Content & Services (Admin)
      websiteContent,
      setWebsiteContent,
      updateWebsiteContent,
      addWebsiteFaq,
      updateWebsiteFaq,
      deleteWebsiteFaq,
      managedServices,
      setManagedServices,
      toggleManagedService,
      updateManagedService,

      // System Activity Audit Log (Admin)
      adminActivityLog,
      logAdminActivity,

      // Unified Site Settings (Company Profile & Demo Mode)
      siteSettings,
      setSiteSettings,
      updateSiteSettings,

      // Shipment Events (Manual Tracking Updates & Live Feed Ingestion)
      shipmentEvents,
      addShipmentEvent,
      getShipmentEvents,
      getLatestShipmentEvent
    }}>
      {children}
    </LogisticsContext.Provider>
  );
};

export const useLogistics = () => {
  const context = useContext(LogisticsContext);
  if (!context) {
    throw new Error('useLogistics must be used within a LogisticsProvider');
  }
  return context;
};
