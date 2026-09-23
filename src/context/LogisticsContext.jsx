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
  initialTasks
} from '../data/mockData';
import { 
  connectAdminSocket, 
  onAdminSocketStatus, 
  onLocationUpdate, 
  onDriverStatusChange, 
  onTripEvent,
  onCustomerActivity 
} from '../services/socket';
import { backendApi } from '../services/api';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { supabaseApi } from '../services/supabaseApi';

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
      return saved ? JSON.parse(saved) : initialQuotes;
    } catch (e) {
      return initialQuotes;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('josan_quotes', JSON.stringify(quotes));
    } catch (e) {}
  }, [quotes]);

  // Website Notification System State
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_notifications');
      return saved ? JSON.parse(saved) : initialNotifications;
    } catch (e) {
      return initialNotifications;
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

  // User & Auth state
  const [currentRole, setCurrentRole] = useState(() => {
    try {
      return localStorage.getItem('josan_role') || 'admin';
    } catch (e) {
      return 'admin';
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
    };

    loadSupabaseData();

    // Supabase Realtime Channels for Live Database Changes
    const channelShipments = supabase
      .channel('realtime:shipments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shipments' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setShipments(prev => [payload.new, ...prev.filter(s => s.id !== payload.new.id)]);
        } else if (payload.eventType === 'UPDATE') {
          setShipments(prev => prev.map(s => s.id === payload.new.id ? { ...s, ...payload.new } : s));
        } else if (payload.eventType === 'DELETE') {
          setShipments(prev => prev.filter(s => s.id !== payload.old.id));
        }
      })
      .subscribe();

    const channelDrivers = supabase
      .channel('realtime:drivers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'drivers' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const normalized = {
            ...payload.new,
            licenseNumber: payload.new.license_number || payload.new.licenseNumber,
            vehicleType: payload.new.vehicle_type || payload.new.vehicleType,
            vehicleId: payload.new.vehicle_id || payload.new.vehicleId,
            vehiclePlate: payload.new.vehicle_plate || payload.new.vehiclePlate,
            deliveriesCompleted: payload.new.deliveries_completed ?? payload.new.deliveriesCompleted ?? 0,
            onTimeRate: payload.new.on_time_rate || payload.new.onTimeRate || '100%',
            assignedHub: payload.new.assigned_hub || payload.new.assignedHub,
            safetyScore: payload.new.safety_score || payload.new.safetyScore,
            assignedVehicle: `${payload.new.vehicle_type || 'Vehicle'} (${payload.new.vehicle_plate || payload.new.vehicle_id || 'N/A'})`,
          };
          setDrivers(prev => [normalized, ...prev.filter(d => d.id !== normalized.id)]);
        } else if (payload.eventType === 'UPDATE') {
          setDrivers(prev => prev.map(d => (d.id === payload.new.id || d.driverId === payload.new.id) ? { 
            ...d, 
            ...payload.new,
            licenseNumber: payload.new.license_number || d.licenseNumber,
            vehicleType: payload.new.vehicle_type || d.vehicleType,
            vehicleId: payload.new.vehicle_id || d.vehicleId,
            vehiclePlate: payload.new.vehicle_plate || d.vehiclePlate,
            deliveriesCompleted: payload.new.deliveries_completed ?? d.deliveriesCompleted,
            onTimeRate: payload.new.on_time_rate || d.onTimeRate,
            assignedHub: payload.new.assigned_hub || d.assignedHub,
            safetyScore: payload.new.safety_score || d.safetyScore,
          } : d));
        } else if (payload.eventType === 'DELETE') {
          setDrivers(prev => prev.filter(d => d.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channelShipments);
      supabase.removeChannel(channelDrivers);
    };
  }, []);

  // Socket.IO Real-time Connection State
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [socketId, setSocketId] = useState(null);

  // Initialize Socket.IO connection for live GPS telematics & status broadcast
  useEffect(() => {
    const socket = connectAdminSocket();

    const unsubStatus = onAdminSocketStatus((connected, id) => {
      setIsSocketConnected(connected);
      setSocketId(id);
    });

    const unsubLoc = onLocationUpdate((data) => {
      if (!data) return;
      const { tripId, driverId, latitude, longitude, heading, speedKph } = data;

      // Update shipments matching tripId or driverId with live GPS coordinates
      setShipments((prevShipments) =>
        prevShipments.map((s) => {
          if (s.id === tripId || s.driverId === driverId) {
            return {
              ...s,
              currentLocation: `Live GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)} (${speedKph || 0} km/h)`,
              lastUpdatedTime: 'Just now (Live Socket.IO)',
              coordinates: {
                ...s.coordinates,
                current: [latitude, longitude],
              },
            };
          }
          return s;
        })
      );

      // Update drivers list with live position
      setDrivers((prevDrivers) =>
        prevDrivers.map((d) => {
          if (d.id === driverId || d.driverId === driverId) {
            return {
              ...d,
              lastLocation: `GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
              speedKph: speedKph || 0,
              lastPing: new Date().toLocaleTimeString(),
              coordinates: [latitude, longitude],
            };
          }
          return d;
        })
      );
    });

    const unsubDriverStatus = onDriverStatusChange((data) => {
      if (!data?.driverId) return;
      setDrivers((prevDrivers) =>
        prevDrivers.map((d) => {
          if (d.id === data.driverId || d.driverId === data.driverId) {
            return {
              ...d,
              status: data.type === 'offline' ? 'Offline' : data.status || 'Online',
            };
          }
          return d;
        })
      );
    });

    const unsubCustActivity = onCustomerActivity((data) => {
      if (!data) return;
      addNotification({
        role: 'admin',
        userId: 'admin',
        type: data.type === 'booking_created' ? 'shipment' : 'quote_request',
        title: data.type === 'booking_created' ? '⚡ New Customer App Booking' : '📄 New Customer Quote Request',
        message: data.message || `Customer ${data.customerName || 'App User'} performed action in Customer App.`,
        timestamp: 'Just now'
      });
    });

    return () => {
      unsubStatus();
      unsubLoc();
      unsubDriverStatus();
      unsubCustActivity();
    };
  }, []);

  // Driver Proximity & Admin Intimations state
  const [driverIntimations, setDriverIntimations] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_driver_intimations');
      return saved ? JSON.parse(saved) : [
        {
          id: 'INT-901',
          shipmentId: 'JOS-88219-SG',
          type: 'proximity',
          title: '📍 Proximity Intimation Alert: Order #JOS-88219-SG',
          message: 'Order placed near Changi Cargo Hub (1.2 km away)! Pickup: 8 Changi South Street 1.',
          pickup: '8 Changi South Street 1, Singapore 486790',
          delivery: '2 Loyang Way, Singapore 508776',
          cargoType: 'Medical Logistics & Cold Chain',
          weight: '45 kg',
          price: 'S$ 145.00',
          pickupCity: 'Changi Air Cargo Hub',
          distanceKm: '1.2',
          timestamp: '10 mins ago',
          status: 'Pending'
        },
        {
          id: 'INT-902',
          shipmentId: 'JOS-44102-SG',
          type: 'admin_assigned',
          targetDriverId: 'DRV-001',
          title: '🚨 Direct Admin Order Assignment: Order #JOS-44102-SG',
          message: 'Fleet Operations Manager assigned Order #JOS-44102-SG directly to your vehicle roster!',
          pickup: 'Pasir Panjang Terminal Hub 4, Singapore',
          delivery: 'Woodlands Industrial Park E5, Singapore',
          cargoType: 'Microchip Servers & Electronics',
          weight: '120 kg',
          price: 'S$ 280.00',
          pickupCity: 'Pasir Panjang Terminal',
          distanceKm: '2.5',
          timestamp: '2 mins ago',
          status: 'Assigned'
        }
      ];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('josan_driver_intimations', JSON.stringify(driverIntimations));
    } catch (e) {}
  }, [driverIntimations]);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

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
        name: 'Alexander Josan',
        email: 'alexander@josanlogistics.com',
        role: 'admin',
        company: 'Josan Logistics HQ'
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

      const expectedPassword = matchedDriver.password || 'driver123';
      if (password && password !== expectedPassword) {
        return { success: false, error: 'Incorrect Driver Password. Please use the password set by Admin.' };
      }
    } else if (userRole === 'admin') {
      if (password && password !== 'admin123') {
        return { success: false, error: 'Incorrect Admin password. Default demo password is: admin123' };
      }
    }

    const userObj = {
      name: matchedDriver?.name || details.fullName || (userRole === 'admin' 
        ? 'Fleet Admin Manager' 
        : userRole === 'driver' 
        ? 'Robert Martinez (Driver)' 
        : 'Enterprise Customer'),
      email: matchedDriver?.email || email,
      role: userRole,
      company: matchedDriver?.assignedHub || (userRole === 'admin' 
        ? 'Josan Logistics Operations' 
        : userRole === 'driver' 
        ? 'Josan Fleet Operations' 
        : 'Global Client Corp'),
      phone: matchedDriver?.phone || details.phone || (userRole === 'driver' ? '+65 9112 3456' : '+65 8765 4321'),
      licenseNumber: matchedDriver?.licenseNumber || details.licenseNumber || (userRole === 'driver' ? 'SG-CLASS4-881' : ''),
      dob: matchedDriver?.dob || details.dob || (userRole === 'driver' ? '1990-05-12' : ''),
      photo: matchedDriver?.photo || details.photo || undefined
    };
    setCurrentUser(userObj);
    setCurrentRole(userRole);
    try {
      localStorage.setItem('josan_user', JSON.stringify(userObj));
    } catch (e) {}

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
      } else if (userRole === 'driver') {
        setActiveTab('driver-dashboard', true, userObj);
      } else {
        setActiveTab('customer-dashboard', true, userObj);
      }
    }

    const portalName = userRole === 'admin' ? 'Admin Hub' : userRole === 'driver' ? 'Driver Portal' : 'Customer Portal';
    showToast(`Logged in successfully as ${userObj.name} (${portalName})`);
    return { success: true, user: userObj };
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('josan_user');
    if (typeof window !== 'undefined') {
      window.location.hash = '#home';
      if (window.history && window.history.pushState) {
        window.history.pushState({ tab: 'home' }, '', '#home');
      }
    }
    showToast('Logged out successfully', 'info');
  };

  const updateUserProfile = (updatedDetails) => {
    setCurrentUser(prev => ({
      ...prev,
      ...updatedDetails
    }));
    showToast("Profile details updated successfully!");
  };

  // Shipment operations
  const addShipment = (newShipmentData) => {
    const trackingId = `JOS-${Math.floor(10000 + Math.random() * 90000)}-${newShipmentData.destinationCountryCode || 'SG'}`;
    const distKm = (1 + Math.random() * 2.5).toFixed(1);
    
    const newShipment = {
      id: trackingId,
      sender: newShipmentData.senderName || currentUser?.name || 'Valued Customer',
      senderPhone: newShipmentData.senderPhone || '+65 9123 4567',
      senderAddress: newShipmentData.pickupAddress || 'Singapore Logistics Terminal 4',
      receiver: newShipmentData.receiverName || 'Recipient',
      receiverPhone: newShipmentData.receiverPhone || '+65 8123 4567',
      receiverAddress: newShipmentData.deliveryAddress || 'Singapore Destination Address',
      origin: newShipmentData.pickupCity || 'Changi Air Cargo Hub',
      destination: newShipmentData.deliveryCity || 'Jurong Port Logistics Hub',
      currentLocation: `${newShipmentData.pickupCity || 'Changi Hub'} Sorting Facility`,
      status: 'Order Placed (Awaiting Driver Dispatch)',
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

  const deleteShipment = (shipmentId) => {
    setShipments(prev => {
      const updated = prev.filter(s => s.id !== shipmentId);
      try {
        localStorage.setItem('josan_shipments', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
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

  const updateShipmentStatus = (shipmentId, newStatus, newLocation = '') => {
    const stageMap = {
      'Booked': 1,
      'Confirmed': 2,
      'Pickup Scheduled': 3,
      'Picked Up': 4,
      'In Transit': 5,
      'Near Destination': 6,
      'Out for Delivery': 6,
      'Delivered': 7,
      'Delayed': 5
    };

    const targetStageNum = stageMap[newStatus] || 5;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setShipments(prev => prev.map(s => {
      if (s.id === shipmentId) {
        let updatedStatusType = 'active';
        if (newStatus === 'Delivered') updatedStatusType = 'success';
        if (newStatus === 'Delayed') updatedStatusType = 'warning';

        // Auto-generate OTP if reaching destination and none exists
        let activeOtp = s.deliveryOtp;
        if ((newStatus === 'Near Destination' || newStatus === 'Out for Delivery') && !activeOtp) {
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
          otpVerified: newStatus === 'Delivered' ? true : s.otpVerified,
          timeline: updatedTimeline
        };
      }
      return s;
    }));

    // Trigger in-app notifications
    if (newStatus === 'Confirmed') {
      addNotification({
        role: 'customer',
        type: 'shipment',
        title: `✅ Booking Confirmed: #${shipmentId}`,
        message: `Your booking has been reviewed and verified by Josan Central Operations.`,
        shipmentId
      });
    } else if (newStatus === 'Pickup Scheduled') {
      addNotification({
        role: 'customer',
        type: 'shipment',
        title: `📅 Pickup Scheduled: #${shipmentId}`,
        message: `Pickup has been assigned to driver. Fleet arrival scheduled at loading terminal.`,
        shipmentId
      });
    } else if (newStatus === 'Picked Up') {
      addNotification({
        role: 'customer',
        type: 'shipment',
        title: `📦 Cargo Picked Up: #${shipmentId}`,
        message: `Consignment picked up and weighed. Highway linehaul transit commencing.`,
        shipmentId
      });
    } else if (newStatus === 'Near Destination' || newStatus === 'Out for Delivery') {
      const targetS = shipments.find(item => item.id === shipmentId);
      const otpCode = targetS?.deliveryOtp || '482910';
      addNotification({
        role: 'customer',
        type: 'otp',
        title: `🚚 Delivery Approaching: OTP ${otpCode}`,
        message: `Driver is near destination. Please present Delivery OTP: ${otpCode} upon arrival.`,
        shipmentId
      });
    } else if (newStatus === 'Delivered') {
      addNotification({
        role: 'customer',
        type: 'pod_verified',
        title: `🎉 Order #${shipmentId} Delivered!`,
        message: `Delivered successfully. Digital Proof of Delivery (POD) certified.`,
        shipmentId
      });
    }

    showToast(`Updated status of ${shipmentId} to "${newStatus}"`);
  };

  // Driver Trip & Location Operations
  const startDriverTrip = (shipmentId) => {
    updateShipmentStatus(shipmentId, 'In Transit', 'En Route via Highway Telematics Corridor');
    showToast(`Trip started for #${shipmentId}! Real-time tracking active.`, 'success');
  };

  const updateShipmentLocation = (shipmentId, newLocationText, coords) => {
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
    showToast(`Location updated to "${newLocationText}" for #${shipmentId}`);
  };

  const reachDestination = (shipmentId) => {
    updateShipmentStatus(shipmentId, 'Near Destination', 'Arrived at Destination Receiving Gate');
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

  const submitPod = (shipmentId, podData) => {
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
          status: 'Delivered',
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

    addNotification({
      role: 'customer',
      type: 'pod_verified',
      title: `✅ Order #${shipmentId} Delivered!`,
      message: `Handed over to ${completePod.recipientName}. Digital Proof of Delivery (POD) signed.`,
      shipmentId
    });

    addNotification({
      role: 'admin',
      type: 'pod_verified',
      title: `✍️ Digital POD Stamped for #${shipmentId}`,
      message: `Delivery completed by driver. Signed by ${completePod.recipientName}.`,
      shipmentId
    });

    showToast(`Delivery completed and Digital POD stamped for #${shipmentId}!`, 'success');
    return completePod;
  };

  // Notification Operations
  const addNotification = ({ role = 'customer', userId = 'all', type = 'info', title, message, shipmentId, quoteId }) => {
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
    setNotifications(prev => [newNotif, ...prev]);
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
    const quoteId = `QTE-${Math.floor(10000 + Math.random() * 90000)}-SG`;
    const weightVal = Number(quoteData.cargoWeight) || 100;
    const baseRate = quoteData.freightMode === 'reefer' ? 6.50 : quoteData.freightMode === 'express' ? 8.00 : 5.00;
    const baseTransportation = Number((weightVal * baseRate).toFixed(2));
    const distanceCharge = Number((baseTransportation * 0.18).toFixed(2));
    const cargoCharge = Number((baseTransportation * 0.12).toFixed(2));
    const vehicleCharge = quoteData.freightMode === 'ftl' ? 120.00 : 60.00;
    const additionalServices = quoteData.tailgateRequired ? 35.00 : 0.00;
    const subtotal = baseTransportation + distanceCharge + cargoCharge + vehicleCharge + additionalServices;
    const taxAmount = Number((subtotal * 0.09).toFixed(2));
    const finalAmount = Number((subtotal + taxAmount).toFixed(2));

    const newQuote = {
      id: quoteId,
      customerId: currentUser?.id || 'USR-GUEST',
      customerName: quoteData.contactName || currentUser?.name || 'Enterprise Shipper',
      customerEmail: quoteData.contactEmail || currentUser?.email || 'contact@enterprise.com',
      customerPhone: quoteData.contactPhone || currentUser?.phone || '+65 9123 4567',
      company: quoteData.contactCompany || currentUser?.company || 'Commercial Shipper',
      origin: quoteData.originZone || 'Jurong West Logistics Hub',
      destination: quoteData.destinationZone || 'Woodlands Distribution Complex',
      cargoCategory: quoteData.cargoCategory || 'General Commercial Cargo',
      cargoWeight: weightVal,
      freightMode: quoteData.freightMode || 'ftl',
      deliverySpeed: quoteData.deliverySpeed || 'standard',
      notes: quoteData.specialInstructions || '',
      status: 'Draft',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      validUntil: new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      lineItems: {
        baseTransportationCharge: baseTransportation,
        distanceCharge,
        cargoCharge,
        vehicleCharge,
        additionalServices,
        taxRate: 0.09,
        taxAmount,
        finalAmount
      },
      adminNotes: 'Awaiting operations review and vehicle allocation.'
    };

    setQuotes(prev => [newQuote, ...prev]);

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

  const updateAdminQuote = (quoteId, updatedLineItems, adminNotes) => {
    setQuotes(prev => prev.map(q => {
      if (q.id === quoteId) {
        const subtotal = 
          Number(updatedLineItems.baseTransportationCharge || 0) +
          Number(updatedLineItems.distanceCharge || 0) +
          Number(updatedLineItems.cargoCharge || 0) +
          Number(updatedLineItems.vehicleCharge || 0) +
          Number(updatedLineItems.additionalServices || 0);
        const taxAmount = Number((subtotal * 0.09).toFixed(2));
        const finalAmount = Number((subtotal + taxAmount).toFixed(2));

        return {
          ...q,
          lineItems: {
            ...updatedLineItems,
            taxRate: 0.09,
            taxAmount,
            finalAmount
          },
          adminNotes: adminNotes !== undefined ? adminNotes : q.adminNotes
        };
      }
      return q;
    }));
    showToast(`Quotation #${quoteId} line items updated!`, 'success');
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
      addNotification({
        role: 'customer',
        type: 'quote',
        title: `📄 Quotation #${quoteId} Ready for Review`,
        message: `Your requested quote from ${sentQuote.origin} to ${sentQuote.destination} is ready: S$ ${sentQuote.lineItems.finalAmount.toFixed(2)}. Review and accept to proceed.`,
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

    const newShipmentId = `JOS-${Math.floor(10000 + Math.random() * 90000)}-SG`;
    const newShipment = {
      id: newShipmentId,
      referenceNumber: `REF-${q.id.replace(/[^0-9]/g, '').slice(-4)}-SG`,
      quoteId: q.id,
      sender: q.customerName,
      senderPhone: q.customerPhone,
      senderAddress: q.origin,
      receiver: q.destination,
      receiverPhone: '+65 9123 4567',
      receiverAddress: q.destination,
      origin: q.origin,
      destination: q.destination,
      currentLocation: `${q.origin} (Staging Bay)`,
      status: 'Confirmed',
      statusType: 'active',
      paymentStatus: 'Unpaid',
      serviceLevel: q.freightMode === 'reefer' ? 'Cold Chain Pharma Vault' : 'Express Road Freight & Highway Linehaul (FTL)',
      cargoType: q.cargoCategory,
      weight: `${q.cargoWeight} kg`,
      pieces: Math.ceil(q.cargoWeight / 50),
      declaredValue: 'S$ 35,000',
      price: `S$ ${q.lineItems.finalAmount.toFixed(2)}`,
      driverId: 'DRV-101',
      driverName: 'Tan Wei Ming',
      driverPhone: '+65 9123 4567',
      vehicle: 'Josan 14-Ton Highway Linehaul Truck #SG-8819',
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

    addNotification({
      role: 'customer',
      type: 'shipment',
      title: `🎉 Order #${newShipmentId} Booked!`,
      message: `Your quotation #${quoteId} was successfully converted to Roadway Shipment #${newShipmentId}.`,
      shipmentId: newShipmentId
    });

    addNotification({
      role: 'admin',
      type: 'shipment',
      title: `📦 New Booking from Quote #${quoteId}`,
      message: `Quotation converted to Order #${newShipmentId}. Assigned driver Tan Wei Ming.`,
      shipmentId: newShipmentId
    });

    showToast(`Converted Quote #${quoteId} into active Shipment #${newShipmentId}!`, 'success');
    return newShipment;
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

      // Customer notification on payment confirmation or refund
      if (newStatus === 'Paid' || newStatus === 'Refunded') {
        addNotification({
          role: 'customer',
          type: 'billing',
          title: `💳 Invoice #${targetInv.invoiceNumber} Marked as ${newStatus}`,
          message: `Payment status for consignment #${targetInv.shipmentId} updated to ${newStatus}. Total: S$ ${targetInv.total.toFixed(2)}.`,
          shipmentId: targetInv.shipmentId
        });
      }
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

    addNotification({
      role: 'customer',
      type: 'document',
      title: `📄 New Document Attached: #${shipmentId}`,
      message: `${newDoc.type} ("${newDoc.name}") has been uploaded and archived.`,
      shipmentId
    });

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

  const assignDriver = (shipmentId, driverId) => {
    const driverObj = drivers.find(d => d.id === driverId);
    if (!driverObj) return;

    const targetShipment = shipments.find(s => s.id === shipmentId);

    setShipments(prev => prev.map(s => {
      if (s.id === shipmentId) {
        return {
          ...s,
          driverId: driverObj.id,
          driverName: driverObj.name,
          driverPhone: driverObj.phone,
          vehicle: `${driverObj.vehicleType} (${driverObj.vehicleId || 'SG-8819'})`,
          status: 'Driver Assigned (Direct Admin Order Assignment)'
        };
      }
      return s;
    }));

    const adminIntimation = {
      id: `INT-ADM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      shipmentId: shipmentId,
      type: 'admin_assigned',
      targetDriverId: driverId,
      title: `🚨 Direct Admin Order Assignment (#${shipmentId})`,
      message: `Fleet Operations Manager assigned Order #${shipmentId} directly to your roster!`,
      pickup: targetShipment?.senderAddress || 'Changi Air Cargo Logistics Hub - 8 Changi South Street 1',
      delivery: targetShipment?.receiverAddress || 'West Coast Hub Terminal - 12 Pasir Panjang Road',
      cargoType: targetShipment?.cargoType || 'High-Tech Microchips',
      weight: targetShipment?.weight || '20 kg',
      price: targetShipment?.price || '$315.00',
      timestamp: 'Just Now',
      status: 'Assigned'
    };

    // Filter out any existing intimations for this shipmentId to avoid duplicate cards!
    setDriverIntimations(prev => [adminIntimation, ...prev.filter(i => i.shipmentId !== shipmentId)]);

    showToast(`Assigned ${driverObj.name} to order ${shipmentId}! Intimation notification dispatched directly to driver's dashboard.`);
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
      senderPhone: existingShipment?.senderPhone || '+65 9123 4567',
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
      driverPhone: driverObj?.phone || '+65 9123 4567',
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
      password: newDriver.password || 'driver123',
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
    showToast(`Driver ${driverWithId.name} added to fleet roster with Admin Password`);

    if (isSupabaseConfigured) {
      await supabaseApi.createDriver(driverWithId);
    }
  };

  const updateDriverPassword = async (driverId, newPassword) => {
    setDrivers(prev => prev.map(d => d.id === driverId ? { ...d, password: newPassword } : d));
    showToast(`Password updated for Driver ID #${driverId}`, 'success');

    if (isSupabaseConfigured) {
      await supabaseApi.updateDriver(driverId, { password: newPassword });
    }
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

  const assignDriverToShipment = (shipmentId, driverId) => {
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
          status: 'Pickup Scheduled',
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

  return (
    <LogisticsContext.Provider value={{
      shipments,
      drivers,
      warehouses,
      analyticsData,
      currentRole,
      currentUser,
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
      assignDriverToShipment,
      syncCustomerAppAccount,
      addDriver,
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
      shipmentScope,
      setShipmentScope,
      resetShipmentScope,
      isShipmentTypeModalOpen,
      setIsShipmentTypeModalOpen,
      showToast
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
