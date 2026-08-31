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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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

  // Helper toast alert function
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Role toggle action
  const toggleRole = (role) => {
    const newRole = role || (currentRole === 'admin' ? 'customer' : 'admin');
    setCurrentRole(newRole);
    if (newRole === 'admin') {
      setCurrentUser({
        name: 'Alexander Josan',
        email: 'alexander@josanlogistics.com',
        role: 'admin',
        company: 'Josan Logistics HQ'
      });
      showToast('Switched to Admin Management Portal', 'info');
    } else {
      setCurrentUser({
        name: 'TechCorp Solutions (Customer)',
        email: 'shipping@techcorp.com',
        role: 'customer',
        company: 'TechCorp Solutions'
      });
      showToast('Switched to Customer Dashboard', 'info');
    }
  };

  // Auth login
  const loginUser = (email, role) => {
    const userRole = role || (email.includes('admin') ? 'admin' : 'customer');
    const userObj = {
      name: userRole === 'admin' ? 'Fleet Admin Manager' : 'Enterprise Customer',
      email: email,
      role: userRole,
      company: userRole === 'admin' ? 'Josan Logistics Operations' : 'Global Client Corp'
    };
    setCurrentUser(userObj);
    setCurrentRole(userRole);
    setIsAuthModalOpen(false);
    showToast(`Logged in successfully as ${userObj.name}`);
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
      senderAddress: newShipmentData.pickupAddress,
      receiver: newShipmentData.receiverName,
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
      setActiveTrackingId,
      setSelectedInvoiceShipment,
      setIsAuthModalOpen,
      toggleRole,
      loginUser,
      logoutUser,
      addShipment,
      updateShipmentStatus,
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
