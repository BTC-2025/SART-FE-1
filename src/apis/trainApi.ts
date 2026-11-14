/**
 * Frontend Master & Transactional Train Booking API Client
 * Connects frontend flows to backend endpoints (/api/trains & /api/bookings).
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface TrainPassengerPayload {
  name: string;
  age: number | string;
  gender?: 'Male' | 'Female';
  berthPreference?: string;
}

export interface TrainConfirmBookingPayload {
  trainNumber: string;
  trainName: string;
  classCode: string;
  source: string;
  sourceCode?: string;
  destination: string;
  destinationCode?: string;
  travelDate: string;
  departureTime?: string;
  arrivalTime?: string;
  passenger?: TrainPassengerPayload;
  passengers?: TrainPassengerPayload[];
  email?: string;
  phone?: string;
  irctcId?: string;
  boardingStation?: string;
  paymentDetails?: any;
  fare: number;
}

export const TrainApi = {
  /**
   * Search Trains from backend /api/trains/search
   */
  async searchTrains(origin: string, destination: string, date?: string) {
    const qOrigin = encodeURIComponent(origin.trim());
    const qDest = encodeURIComponent(destination.trim());
    const qDate = encodeURIComponent(date || new Date().toISOString().split('T')[0]);

    const res = await fetch(`${API_BASE}/api/trains/search?origin=${qOrigin}&destination=${qDest}&date=${qDate}`);
    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }
    const json = await res.json();
    return json.data || [];
  },

  /**
   * Get Train Schedule & Route Stops from backend
   */
  async getTrainSchedule(trainNumber: string) {
    const res = await fetch(`${API_BASE}/api/trains/${encodeURIComponent(trainNumber)}/schedule`);
    if (!res.ok) {
      throw new Error(`Failed to load schedule for train ${trainNumber}`);
    }
    const json = await res.json();
    return json.data || null;
  },

  /**
   * Confirm booking in backend /api/trains/confirm-booking
   */
  async confirmBooking(payload: TrainConfirmBookingPayload, userId?: string) {
    const res = await fetch(`${API_BASE}/api/trains/confirm-booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(userId ? { 'x-user-id': userId } : {})
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error('Failed to confirm train ticket on backend');
    }
    return res.json();
  },

  /**
   * Cancel ticket in backend /api/trains/cancel-ticket
   */
  async cancelTicket(bookingId: string, pnr?: string, userId?: string) {
    const res = await fetch(`${API_BASE}/api/trains/cancel-ticket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(userId ? { 'x-user-id': userId } : {})
      },
      body: JSON.stringify({ bookingId, pnr })
    });
    if (!res.ok) {
      throw new Error('Failed to cancel train ticket on backend');
    }
    return res.json();
  }
};

