/**
 * Frontend Master & Transactional Bus Booking API Client
 * Connects frontend flows to backend endpoints (/api/buses & /api/bookings).
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface BusPassenger {
  name: string;
  gender: 'male' | 'female';
  age?: number;
  seatId: string;
}

export interface BusConfirmBookingPayload {
  busId: string;
  operator: string;
  busType: string;
  source: string;
  destination: string;
  dateOfJourney: string;
  sourceTime?: string;
  destinationTime?: string;
  selectedSeats: string[];
  passengers: BusPassenger[];
  contactDetails?: {
    email?: string;
    phone?: string;
  };
  totalAmount: number;
  boardingPoint?: { name: string; time: string } | string;
  droppingPoint?: { name: string; time: string } | string;
}

export const BusApi = {
  // 1. Master Data: Get Source / Available Cities
  async getCities(): Promise<string[]> {
    try {
      const res = await fetch(`${API_BASE}/api/buses/cities`);
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    } catch (e) {
      console.warn('Failed to fetch bus cities:', e);
      return [];
    }
  },

  // 2. Master Data: Get Destination Stations based on selected source station
  async getDestinationStations(source: string): Promise<string[]> {
    try {
      const res = await fetch(`${API_BASE}/api/buses/destinations?source=${encodeURIComponent(source)}`);
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    } catch (e) {
      console.warn('Failed to fetch destination stations:', e);
      return [];
    }
  },

  // 3. Search & Availability: Available Buses / Trip Search
  async searchBuses(origin: string, destination: string, date: string): Promise<any[]> {
    try {
      const cleanSrc = origin.replace(/\s*-\s*[A-Z0-9]+$/i, '').trim();
      const cleanDst = destination.replace(/\s*-\s*[A-Z0-9]+$/i, '').trim();
      const res = await fetch(
        `${API_BASE}/api/buses/search?origin=${encodeURIComponent(cleanSrc)}&destination=${encodeURIComponent(cleanDst)}&date=${encodeURIComponent(date)}`
      );
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    } catch (e) {
      console.warn('Failed to search buses from API:', e);
      return [];
    }
  },

  // 4. Seat Mapping & Layout: TotalSeatList, Physical layout, Upper/Lower deck & Gender constraints
  async getSeatLayout(busId: string, date?: string): Promise<any | null> {
    try {
      const url = date
        ? `${API_BASE}/api/buses/${encodeURIComponent(busId)}/layout?date=${encodeURIComponent(date)}`
        : `${API_BASE}/api/buses/${encodeURIComponent(busId)}/layout`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data || null;
    } catch (e) {
      console.warn('Failed to fetch seat layout:', e);
      return null;
    }
  },

  // 5. Boarding Points
  async getBoardingPoints(busId: string): Promise<Array<{ name: string; time: string }>> {
    try {
      const res = await fetch(`${API_BASE}/api/buses/${encodeURIComponent(busId)}/boarding-points`);
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    } catch (e) {
      console.warn('Failed to fetch boarding points:', e);
      return [];
    }
  },

  // 6. Dropping Points
  async getDroppingPoints(busId: string): Promise<Array<{ name: string; time: string }>> {
    try {
      const res = await fetch(`${API_BASE}/api/buses/${encodeURIComponent(busId)}/dropping-points`);
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    } catch (e) {
      console.warn('Failed to fetch dropping points:', e);
      return [];
    }
  },

  // 7. Ticketing: Block Seat (hold temporarily for 10-15 mins)
  async blockSeats(busId: string, seats: string[], passengers: BusPassenger[], travelDate?: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/api/buses/block-seat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ busId, seats, passengers, travelDate })
      });
      return await res.json();
    } catch (e) {
      console.warn('Failed to block seats:', e);
      return { success: false, message: 'Network error blocking seats' };
    }
  },

  // 8. Ticketing: Confirm Seat Booking (Commits to SQLite DB via Prisma & issues PNR)
  async confirmSeatBooking(payload: BusConfirmBookingPayload, userId?: string): Promise<any> {
    try {
      const currentUserId = userId || (typeof window !== 'undefined' ? localStorage.getItem('sart_user_id') || 'usr_default' : 'usr_default');
      const res = await fetch(`${API_BASE}/api/buses/confirm-booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUserId
        },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (e) {
      console.warn('Failed to confirm seat booking via backend:', e);
      return { success: false, message: 'Network error confirming booking' };
    }
  },

  // 9. Post-Booking: Get Cancellation Policy
  async getCancellationPolicy(busId?: string): Promise<any> {
    try {
      const url = busId
        ? `${API_BASE}/api/buses/cancellation-policy?busId=${encodeURIComponent(busId)}`
        : `${API_BASE}/api/buses/cancellation-policy`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data || null;
    } catch (e) {
      console.warn('Failed to fetch cancellation policy:', e);
      return null;
    }
  },

  // 10. Post-Booking: Cancel Ticket (Updates database status & computes refund)
  async cancelTicket(pnrOrBookingId: { pnr?: string; bookingId?: string; reason?: string }): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/api/buses/cancel-ticket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pnrOrBookingId)
      });
      return await res.json();
    } catch (e) {
      console.warn('Failed to cancel bus ticket:', e);
      return { success: false, message: 'Network error processing cancellation' };
    }
  }
};

