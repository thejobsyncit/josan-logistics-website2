import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialShipments, initialDrivers, initialWarehouses, analyticsData } from '../data/mockData';

const LogisticsContext = createContext();

export const LogisticsProvider = ({ children }) => {
  // Load state from localStorage or initial mock data
  const [shipments, setShipments] = useState(() => {
    const saved = localStorage.getItem('josan_shipments');
    return saved ? JSON.parse(saved) : initialShipments;
  });

  const [drivers, setDrivers] = useState(() => {
    const saved = localStorage.getItem('josan_drivers');
    return saved ? JSON.parse(saved) : initialDrivers;
  });

  const [warehouses, setWarehouses] = useState(() => {
    const saved = localStorage.getItem('josan_warehouses');
    return saved ? JSON.parse(saved) : initialWarehouses;
  });

  // User & Auth state
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('josan_role') || 'admin'; // default to admin for instant feature testing
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('josan_user');
    return saved ? JSON.parse(saved) : {
      name: 'Alexander Josan',
      email: 'alexander@josanlogistics.com',
      role: 'admin',
      company: 'Josan Logistics HQ'
    };
  });

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Active tracking search state
  const [activeTrackingId, setActiveTrackingId] = useState('');

  // Active modal state for invoices or auth
  const [selectedInvoiceShipment, setSelectedInvoiceShipment] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(true);

  // Sub-tab navigation state
  const [customerSubTab, setCustomerSubTab] = useState('orders');
  const [driverSubTab, setDriverSubTab] = useState('dashboard');

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
  const loginUser = (email, role, setActiveTab, details = {}) => {
    const userRole = role || (email.includes('admin') ? 'admin' : email.includes('driver') ? 'driver' : 'customer');
    const userObj = {
      name: details.fullName || (userRole === 'admin' 
        ? 'Fleet Admin Manager' 
        : userRole === 'driver' 
        ? 'Robert Martinez (Driver)' 
        : 'Enterprise Customer'),
      email: email,
      role: userRole,
      company: userRole === 'admin' 
        ? 'Josan Logistics Operations' 
        : userRole === 'driver' 
        ? 'Josan Fleet Operations' 
        : 'Global Client Corp',
      phone: details.phone || (userRole === 'driver' ? '+65 9112 3456' : '+65 8765 4321'),
      licenseNumber: details.licenseNumber || (userRole === 'driver' ? 'S9876543A' : ''),
      dob: details.dob || (userRole === 'driver' ? '1990-05-12' : '')
    };
    setCurrentUser(userObj);
    setCurrentRole(userRole);
    setIsAuthModalOpen(false);

    // Enforce Strict Portal Redirection
    if (setActiveTab) {
      if (userRole === 'admin') {
        setActiveTab('admin-dashboard');
      } else if (userRole === 'driver') {
        setActiveTab('driver-dashboard');
      } else {
        setActiveTab('customer-dashboard');
      }
    }

    const portalName = userRole === 'admin' ? 'Admin Hub' : userRole === 'driver' ? 'Driver Portal' : 'Customer Portal';
    showToast(`Logged in successfully as ${userObj.name} (${portalName})`);
  };

  const logoutUser = () => {
    setCurrentUser(null);
    showToast('Logged out successfully', 'info');
  };

  // Shipment operations
  const addShipment = (newShipmentData) => {
    const trackingId = `JOS-${Math.floor(10000 + Math.random() * 90000)}-${newShipmentData.destinationCountryCode || 'US'}`;
    const newShipment = {
      id: trackingId,
      sender: newShipmentData.senderName || currentUser?.name || 'Valued Customer',
      senderPhone: newShipmentData.senderPhone || '+1 4085550199',
      senderAddress: newShipmentData.pickupAddress,
      receiver: newShipmentData.receiverName,
      receiverPhone: newShipmentData.receiverPhone || '+1 2125550188',
      receiverAddress: newShipmentData.deliveryAddress,
      origin: newShipmentData.pickupCity || 'Origin Hub',
      destination: newShipmentData.deliveryCity || 'Destination Hub',
      currentLocation: `${newShipmentData.pickupCity || 'Origin'} Sorting Facility`,
      status: 'Order Placed',
      statusType: 'active',
      serviceLevel: newShipmentData.serviceLevel || 'Express Air Freight',
      cargoType: newShipmentData.cargoType || 'General Freight',
      weight: `${newShipmentData.weight || 10} kg`,
      pieces: newShipmentData.pieces || 1,
      declaredValue: `$${newShipmentData.declaredValue || '1,000'}`,
      price: newShipmentData.estimatedPrice || '$350.00',
      driverId: 'DRV-103',
      driverName: 'Sarah Chen',
      driverPhone: '+1 (555) 441-9023',
      vehicle: 'Sprinter Express Cargo',
      estimatedDelivery: '3 Business Days',
      createdDate: new Date().toLocaleString(),
      timeline: [
        { title: 'Order Booked & Labeled', location: newShipmentData.pickupCity || 'Origin Hub', timestamp: 'Just Now', completed: true, current: true, icon: 'FileCheck' },
        { title: 'Picked Up by Courier', location: 'En Route to Dispatch', timestamp: 'Pending', completed: false, icon: 'Truck' },
        { title: 'In Transit & Sorting Center', location: 'Sorting Hub', timestamp: 'Pending', completed: false, icon: 'PackageCheck' },
        { title: 'Out for Delivery', location: newShipmentData.deliveryCity || 'Destination', timestamp: 'Pending', completed: false, icon: 'MapPin' },
        { title: 'Delivered & Signature Verified', location: newShipmentData.deliveryAddress, timestamp: 'Pending', completed: false, icon: 'CheckCircle2' }
      ]
    };

    setShipments(prev => [newShipment, ...prev]);
    showToast(`Shipment ${trackingId} booked successfully!`);
    return newShipment;
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

    setShipments(prev => prev.map(s => {
      if (s.id === shipmentId) {
        return {
          ...s,
          driverId: driverObj.id,
          driverName: driverObj.name,
          driverPhone: driverObj.phone,
          vehicle: `${driverObj.vehicleType} #${driverObj.vehicleId}`
        };
      }
      return s;
    }));

    showToast(`Assigned ${driverObj.name} to order ${shipmentId}`);
  };

  // Driver operations
  const addDriver = (newDriver) => {
    const driverWithId = {
      ...newDriver,
      id: `DRV-${Math.floor(100 + Math.random() * 900)}`,
      deliveriesCompleted: 0,
      onTimeRate: '100%',
      rating: 5.0,
      safetyScore: '100/100',
      joinedDate: 'Recent',
      photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };
    setDrivers(prev => [driverWithId, ...prev]);
    showToast(`Driver ${newDriver.name} added to fleet roster`);
  };

  const removeDriver = (driverId) => {
    setDrivers(prev => prev.filter(d => d.id !== driverId));
    showToast('Driver removed from active fleet', 'warning');
  };

  const toggleDriverStatus = (driverId, newStatus) => {
    setDrivers(prev => prev.map(d => d.id === driverId ? { ...d, status: newStatus } : d));
    showToast(`Driver status updated to ${newStatus}`);
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
      selectedInvoiceShipment,
      isAuthModalOpen,
      customerSubTab,
      setCustomerSubTab,
      driverSubTab,
      setDriverSubTab,
      setActiveTrackingId,
      setSelectedInvoiceShipment,
      setIsAuthModalOpen,
      toggleRole,
      loginUser,
      logoutUser,
      addShipment,
      updateShipmentStatus,
      flagWeatherDelay,
      assignDriver,
      addDriver,
      removeDriver,
      toggleDriverStatus,
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
