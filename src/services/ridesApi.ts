/**
 * Dedicated API Client for Bike, Auto, and Car Rides & Captains
 * Communicates with SART Backend (`http://localhost:5000`)
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api/rides';

export type SupportedRideCategory = 'bike' | 'auto' | 'car';

export interface CaptainItem {
  id: string;
  driverName: string;
  serviceType: SupportedRideCategory;
  vehicleModel?: string;
  plateNumber?: string;
  phone?: string;
  lat: number;
  lng: number;
  status: 'available' | 'busy' | 'offline';
  rating: number;
}

export interface FuelFareResponse {
  rideType: SupportedRideCategory;
  city: string;
  distanceKm: number;
  duration?: {
    minMinutes: number;
    maxMinutes: number;
    avgMinutes: number;
    formatted: string;
  };
  fuelSpecs: {
    fuelType: string;
    fuelConsumed: string;
    fuelPricePerUnit?: number;
    fuelCostEstimate: string;
    fuelEconomy: string;
  };
  pricing: {
    baseFare: number;
    perKmRate: number;
    driverAllowance: number;
    totalCustomerFare: number;
  };
}

export const ridesApiClient = {
  // 0. GET: Fetch vehicle configurations from backend database/API
  getVehicles: async (category?: SupportedRideCategory) => {
    try {
      const query = category ? `?category=${category}` : '';
      const res = await fetch(`${API_BASE_URL}/vehicles${query}`);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data || null;
    } catch (err) {
      console.warn('[ridesApi] Failed to fetch vehicles from backend:', err);
      return null;
    }
  },

  // 1. GET: Fetch nearby captains for Bike, Auto, or Car
  getNearbyCaptains: async (category: SupportedRideCategory, lat?: number, lng?: number): Promise<CaptainItem[]> => {
    try {
      const query = new URLSearchParams({ type: category });
      if (lat && lng) {
        query.append('lat', lat.toString());
        query.append('lng', lng.toString());
      }
      const res = await fetch(`${API_BASE_URL}/nearby?${query.toString()}`);
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.warn(`[ridesApi] Failed to fetch nearby ${category}s:`, err);
      return [];
    }
  },

  // 2. GET: List all captains with search filter
  getAllCaptains: async (category?: SupportedRideCategory, search?: string): Promise<CaptainItem[]> => {
    try {
      const query = new URLSearchParams();
      if (category) query.append('category', category);
      if (search) query.append('search', search);

      const res = await fetch(`${API_BASE_URL}/captains?${query.toString()}`);
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.warn('[ridesApi] Failed to fetch captains:', err);
      return [];
    }
  },

  // 3. POST: Register new Captain for Bike, Auto, or Car
  registerCaptain: async (captainData: {
    driverName: string;
    phone: string;
    serviceType: SupportedRideCategory;
    vehicleModel: string;
    plateNumber: string;
    lat?: number;
    lng?: number;
  }) => {
    const res = await fetch(`${API_BASE_URL}/captains`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(captainData)
    });
    return res.json();
  },

  // 4. PUT: Update Captain location or status
  updateCaptain: async (id: string, updates: Partial<CaptainItem>) => {
    const res = await fetch(`${API_BASE_URL}/captains/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  // 5. DELETE: Remove Captain
  deleteCaptain: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/captains/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // 6. POST: Real fuel and distance fare computation
  calculateFuelFare: async (category: SupportedRideCategory, distanceKm: number, city: string = 'Bengaluru'): Promise<FuelFareResponse | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/calculate-fuel-fare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rideType: category, distanceKm, city })
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data || null;
    } catch (err) {
      console.warn('[ridesApi] Failed to compute fuel fare:', err);
      return null;
    }
  }
};
