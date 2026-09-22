/**
 * Backend REST API Client for Josan Web Apps
 *
 * Base URL defaults to http://localhost:3000/api (or VITE_API_BASE_URL).
 */
const DEFAULT_API_BASE = "http://localhost:3000/api";

const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE;
};

async function request(endpoint, options = {}) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = localStorage.getItem("josan_auth_token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        message: data.message || "Request failed",
        error: data.code || "HTTP_ERROR",
      };
    }

    return {
      success: true,
      data: data.data || data,
    };
  } catch (err) {
    console.warn(`[API] Request to ${url} failed:`, err.message);
    return {
      success: false,
      message: err.message,
      isNetworkError: true,
    };
  }
}

export const backendApi = {
  // Health check
  checkHealth: async () => {
    try {
      const res = await fetch("http://localhost:3000/health");
      return await res.json();
    } catch (e) {
      return { status: "offline", error: e.message };
    }
  },

  // Auth
  login: (credentials) => request("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  getProfile: () => request("/auth/me"),

  // Trips & Shipments
  getTrips: () => request("/trips"),
  getShipments: () => request("/shipments"),
  createShipment: (shipmentData) => request("/shipments", { method: "POST", body: JSON.stringify(shipmentData) }),
  updateTripStatus: (tripId, status) => request(`/trips/${tripId}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  
  // Drivers
  getDrivers: () => request("/driver/status"),
  updateDriverStatus: (status) => request("/driver/status", { method: "PATCH", body: JSON.stringify({ status }) }),
  assignDriverToTrip: (tripId, driverId) => request(`/trips/${tripId}/assign`, { method: "POST", body: JSON.stringify({ driverId }) }),
  getDriverLocations: () => request("/driver/locations"),

  // Customer App
  getCustomerProfiles: () => request("/customer/profiles"),
  syncCustomerAppAccount: (customerData) => request("/customer/sync", { method: "POST", body: JSON.stringify(customerData) }),
};
