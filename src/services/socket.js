/**
 * Admin CRM Socket.IO Client Service
 *
 * Connects the Admin CRM Web Dashboard to the backend Socket.IO server (default: http://localhost:3000)
 * to receive real-time driver GPS tracking pings, trip updates, and driver online/offline statuses.
 */
import { io } from "socket.io-client";

let socket = null;
let statusChangeCallbacks = new Set();
let locationUpdateCallbacks = new Set();
let driverStatusCallbacks = new Set();
let tripEventCallbacks = new Set();

let customerActivityCallbacks = new Set();

const DEFAULT_BACKEND_URL = "http://localhost:3000";

/**
 * Initializes and connects the Socket.IO client for the Admin CRM.
 */
export function connectAdminSocket(customUrl) {
  if (socket?.connected) return socket;

  if (socket) {
    socket.disconnect();
    socket = null;
  }

  const backendUrl = customUrl || import.meta.env.VITE_BACKEND_URL || DEFAULT_BACKEND_URL;

  socket = io(backendUrl, {
    transports: ["websocket", "polling"],
    auth: {
      role: "ADMIN",
    },
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
    timeout: 10000,
  });

  socket.on("connect", () => {
    console.log("[AdminSocket] Connected to live tracking backend:", socket.id);
    statusChangeCallbacks.forEach((cb) => cb(true, socket.id));
  });

  socket.on("connect_error", (err) => {
    console.warn("[AdminSocket] Connection error:", err.message);
    statusChangeCallbacks.forEach((cb) => cb(false, null, err.message));
  });

  socket.on("disconnect", (reason) => {
    console.log("[AdminSocket] Disconnected:", reason);
    statusChangeCallbacks.forEach((cb) => cb(false, null, reason));
  });

  // Listen for real-time location updates emitted by drivers
  socket.on("location:update", (data) => {
    console.log("[AdminSocket] Received location update:", data);
    locationUpdateCallbacks.forEach((cb) => cb(data));
  });

  // Listen for driver online/offline/status changes
  socket.on("driver:status", (data) => {
    console.log("[AdminSocket] Driver status change:", data);
    driverStatusCallbacks.forEach((cb) => cb({ type: "status", ...data }));
  });

  socket.on("driver:online", (data) => {
    console.log("[AdminSocket] Driver came online:", data);
    driverStatusCallbacks.forEach((cb) => cb({ type: "online", ...data }));
  });

  socket.on("driver:offline", (data) => {
    console.log("[AdminSocket] Driver went offline:", data);
    driverStatusCallbacks.forEach((cb) => cb({ type: "offline", ...data }));
  });

  // Listen for trip lifecycle events
  socket.on("trip:assigned", (data) => {
    console.log("[AdminSocket] Trip assigned:", data);
    tripEventCallbacks.forEach((cb) => cb({ type: "assigned", ...data }));
  });

  socket.on("trip:completed", (data) => {
    console.log("[AdminSocket] Trip completed:", data);
    tripEventCallbacks.forEach((cb) => cb({ type: "completed", ...data }));
  });

  // Listen for Customer App live activity
  socket.on("customer:booking:created", (data) => {
    console.log("[AdminSocket] Customer booking created:", data);
    customerActivityCallbacks.forEach((cb) => cb({ type: "booking_created", ...data }));
  });

  socket.on("customer:quote:requested", (data) => {
    console.log("[AdminSocket] Customer quote requested:", data);
    customerActivityCallbacks.forEach((cb) => cb({ type: "quote_requested", ...data }));
  });

  return socket;
}

/**
 * Join a specific trip room to receive targeted GPS location updates.
 */
export function joinTripRoom(tripId) {
  if (!tripId) return;
  if (!socket?.connected) {
    connectAdminSocket();
  }
  socket?.emit("join:trip", { tripId });
  console.log(`[AdminSocket] Joined trip room: trip:${tripId}`);
}

/**
 * Leave a trip room when no longer watching.
 */
export function leaveTripRoom(tripId) {
  if (!tripId || !socket?.connected) return;
  socket.emit("leave:trip", { tripId });
}

/**
 * Subscribe to connection status changes.
 */
export function onAdminSocketStatus(callback) {
  statusChangeCallbacks.add(callback);
  if (socket) {
    callback(socket.connected, socket.id);
  }
  return () => statusChangeCallbacks.delete(callback);
}

/**
 * Subscribe to driver location updates.
 */
export function onLocationUpdate(callback) {
  locationUpdateCallbacks.add(callback);
  return () => locationUpdateCallbacks.delete(callback);
}

/**
 * Subscribe to driver status changes (online, offline, status update).
 */
export function onDriverStatusChange(callback) {
  driverStatusCallbacks.add(callback);
  return () => driverStatusCallbacks.delete(callback);
}

/**
 * Subscribe to trip lifecycle events.
 */
export function onTripEvent(callback) {
  tripEventCallbacks.add(callback);
  return () => tripEventCallbacks.delete(callback);
}

/**
 * Subscribe to customer app live activities.
 */
export function onCustomerActivity(callback) {
  customerActivityCallbacks.add(callback);
  return () => customerActivityCallbacks.delete(callback);
}

/**
 * Disconnect socket on logout or app teardown.
 */
export function disconnectAdminSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/**
 * Returns current socket instance.
 */
export function getAdminSocket() {
  return socket;
}
