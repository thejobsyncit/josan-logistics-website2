import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialShipments, initialDrivers, initialWarehouses, analyticsData } from '../data/mockData';

const LogisticsContext = createContext();

export const LogisticsProvider = ({ children }) => {
  // Load state from localStorage or initial mock data
  const [shipments, setShipments] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_shipments');
      return saved ? JSON.parse(saved) : initialShipments;
    } catch (e) {
      return initialShipments;
    }
  });

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

  // User & Auth state
  const [currentRole, setCurrentRole] = useState(() => {
    try {
      return localStorage.getItem('josan_role') || 'admin';
    } catch (e) {
      return 'admin';
    }
  });

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

  const openAuthModalWithoutClose = () => {
    setAuthModalHideClose(true);
    setIsAuthModalOpen(true);
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
      setCurrentUser({
        name: 'Alexander Josan',
        email: 'alexander@josanlogistics.com',
        role: 'admin',
        company: 'Josan Logistics HQ'
      });
      if (setActiveTab) setActiveTab('admin-dashboard');
      showToast('Switched to Admin Management Portal', 'info');
    } else if (newRole === 'driver') {
      setCurrentUser({
        name: 'Robert Martinez (Driver)',
        email: 'robert.m@josanlogistics.com',
        role: 'driver',
        company: 'Josan Logistics Fleet'
      });
      if (setActiveTab) setActiveTab('driver-dashboard');
      showToast('Switched to Driver Portal', 'info');
    } else {
      setCurrentUser({
        name: 'TechCorp Solutions (Customer)',
        email: 'shipping@techcorp.com',
        role: 'customer',
        company: 'TechCorp Solutions'
      });
      if (setActiveTab) setActiveTab('customer-dashboard');
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
    setIsAuthModalOpen(false);

    const wasForcedBookingModal = authModalHideClose;
    setIsAuthModalOpen(false);
    setAuthModalHideClose(false);

    // Enforce Strict Portal Redirection
    if (setActiveTab) {
      if (wasForcedBookingModal && userRole === 'customer') {
        setActiveTab('book');
      } else if (userRole === 'admin') {
        setActiveTab('admin-dashboard');
      } else if (userRole === 'driver') {
        setActiveTab('driver-dashboard');
      } else {
        setActiveTab('customer-dashboard');
      }
    }

    const portalName = userRole === 'admin' ? 'Admin Hub' : userRole === 'driver' ? 'Driver Portal' : 'Customer Portal';
    showToast(`Logged in successfully as ${userObj.name} (${portalName})`);
    return { success: true };
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('josan_user');
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
    setShipments(prev => prev.map(s => {
      if (s.id === shipmentId) {
        let updatedStatusType = 'active';
        if (newStatus === 'Delivered') updatedStatusType = 'success';
        if (newStatus === 'Delayed') updatedStatusType = 'warning';

        const updatedTimeline = s.timeline.map((step, idx) => {
          if (newStatus === 'In Transit' && idx <= 2) return { ...step, completed: true, current: idx === 2 };
          if (newStatus === 'Out for Delivery' && idx <= 3) return { ...step, completed: true, current: idx === 3 };
          if (newStatus === 'Delivered') return { ...step, completed: true, current: idx === 4 };
          if (newStatus === 'Delayed' && idx === 2) return { ...step, completed: true, current: true, title: 'Delay Flagged (Traffic/Customs)' };
          return step;
        });

        return {
          ...s,
          status: newStatus,
          statusType: updatedStatusType,
          currentLocation: newLocation || s.currentLocation,
          timeline: updatedTimeline
        };
      }
      return s;
    }));
    showToast(`Updated status of ${shipmentId} to "${newStatus}"`);
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
  const addDriver = (newDriver) => {
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
    setDrivers(prev => [driverWithId, ...prev]);
    showToast(`Driver ${driverWithId.name} added to fleet roster with Admin Password`);
  };

  const updateDriverPassword = (driverId, newPassword) => {
    setDrivers(prev => prev.map(d => d.id === driverId ? { ...d, password: newPassword } : d));
    showToast(`Password updated for Driver ID #${driverId}`, 'success');
  };

  const updateDriverPhoto = (driverId, photoUrl) => {
    setDrivers(prev => prev.map(d => d.id === driverId ? { ...d, photo: photoUrl } : d));
    showToast(`Profile photo updated for Driver ID #${driverId}`, 'success');
  };

  const removeDriver = (driverId) => {
    setDrivers(prev => prev.filter(d => d.id !== driverId));
    showToast('Driver removed from active fleet', 'warning');
  };

  const toggleDriverStatus = (driverId, newStatus) => {
    setDrivers(prev => prev.map(d => d.id === driverId ? { ...d, status: newStatus } : d));
    showToast(`Driver status updated to ${newStatus}`);
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

  return (
    <LogisticsContext.Provider value={{
      shipments,
      drivers,
      warehouses,
      analyticsData,
      currentRole,
      currentUser,
      toast,
      activeTrackingId,
      isAuthModalOpen,
      authModalHideClose,
      setAuthModalHideClose,
      openAuthModalWithoutClose,
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
