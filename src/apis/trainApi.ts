/**
 * Frontend Master & Transactional Train Booking API Client
 * Connects frontend flows to backend endpoints (/api/trains & /api/transit).
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface TrainPassengerPayload {
  name: string;
  age: number | string;
  gender?: 'Male' | 'Female' | 'Transgender';
  nationality?: string;
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
  dateOfJourney?: string;
  travelDate?: string;
  departureTime?: string;
  arrivalTime?: string;
  passengerName?: string;
  passengerAge?: number | string;
  gender?: string;
  berthPreference?: string;
  passenger?: TrainPassengerPayload;
  passengers?: TrainPassengerPayload[];
  email?: string;
  phone?: string;
  irctcId?: string;
  boardingStation?: string;
  paymentDetails?: any;
  freeCancel?: boolean;
  fare: number;
}

export const TrainApi = {
  /**
   * 1. Search Trains from backend GET /api/trains/search?origin=...&destination=...&date=...
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
   * 2. Get Train Schedule & Route Stops from backend GET /api/trains/:trainNumber/schedule
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
   * 3. Confirm booking in backend POST /api/trains/confirm-booking
   * Commits booking to backend database, generates official 10-digit PNR, returns booking record
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
   * 4. Cancel ticket in backend POST /api/trains/cancel-ticket
   */
  async cancelTicket(bookingId: string, pnr?: string, reason?: string, userId?: string) {
    const res = await fetch(`${API_BASE}/api/trains/cancel-ticket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(userId ? { 'x-user-id': userId } : {})
      },
      body: JSON.stringify({ bookingId, pnr, reason })
    });
    if (!res.ok) {
      throw new Error('Failed to cancel train ticket on backend');
    }
    return res.json();
  },

  /**
   * 5. Live NTES GPS Tracking GET /api/trains/live/:trainNumber
   */
  async getLiveStatus(trainNumber: string) {
    const res = await fetch(`${API_BASE}/api/trains/live/${encodeURIComponent(trainNumber)}`);
    if (!res.ok) {
      throw new Error(`Failed to get live status for train ${trainNumber}`);
    }
    return res.json();
  },

  /**
   * 6. Live Government PNR Status GET /api/transit/train/pnr/:pnr
   */
  async getPnrStatus(pnr: string) {
    const res = await fetch(`${API_BASE}/api/transit/train/pnr/${encodeURIComponent(pnr)}`);
    if (!res.ok) {
      throw new Error(`Failed to get PNR status for ${pnr}`);
    }
    return res.json();
  }
};
