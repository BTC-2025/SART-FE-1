/**
 * API client to connect SART Frontend with SART Backend Express Server (`http://localhost:5000/api`)
 * and live Transit/Government Gateways (IRCTC, DGCA, SRTC)
 */

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

export interface BackendBooking {
  id: string;
  userId: string;
  title: string;
  type: string;
  subType?: string;
  dateTime: string;
  details?: string;
  status: 'Active' | 'Completed' | 'Cancelled';
  cost: number;
  pickupLoc?: string;
  dropLoc?: string;
  extraData?: string;
  createdAt?: string;
}

export const bookingsApiClient = {
  // 1. Fetch user bookings from backend database
  getBookings: async (type?: string, status?: string): Promise<BackendBooking[]> => {
    try {
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (status) params.append('status', status);

      const res = await fetch(`${API_BASE}/bookings?${params.toString()}`);
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    } catch (e) {
      console.warn('[bookingsApiClient] Could not reach backend, returning empty list:', e);
      return [];
    }
  },

  // 2. Create new booking
  createBooking: async (bookingData: {
    title: string;
    type: string;
    subType?: string;
    cost: number;
    pickupLoc?: string;
    dropLoc?: string;
    details?: string;
    extraData?: any;
    deductWallet?: boolean;
  }) => {
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      return await res.json();
    } catch (e) {
      console.error('[bookingsApiClient] createBooking error:', e);
      return { success: false, message: 'Backend unreachable' };
    }
  },

  // 3. Update status (e.g. Cancelled)
  updateStatus: async (id: string, status: 'Active' | 'Completed' | 'Cancelled') => {
    try {
      const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: 'Backend error' };
    }
  }
};

/**
 * Government & National Public Transit API Client
 * (Train IRCTC, DGCA Flight, SRTC Bus)
 */
export const governmentTransitApi = {
  getTrainPnrStatus: async (pnr: string) => {
    try {
      const res = await fetch(`${API_BASE}/transit/train/pnr/${encodeURIComponent(pnr)}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  getFlightStatus: async (flightNumber: string) => {
    try {
      const res = await fetch(`${API_BASE}/transit/flight/track/${encodeURIComponent(flightNumber)}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  getBusTicketStatus: async (ticketNo: string) => {
    try {
      const res = await fetch(`${API_BASE}/transit/bus/ticket/${encodeURIComponent(ticketNo)}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }
};
