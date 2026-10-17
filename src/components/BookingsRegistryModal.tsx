import React, { useEffect, useState } from 'react';
import './BookingsRegistryModal.css';

interface Booking {
  id: string;
  title: string;
  type: string;
  dateTime: string;
  details: string;
  status: string;
  cost: number;
}

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'bk-001',
    title: 'Tata Nexon EV Rental',
    type: 'rental',
    dateTime: 'Oct 02, 2026, 10:00 AM',
    details: 'Pickup: 10:00 AM • 3 Days Duration',
    status: 'Active',
    cost: 4500.00
  },
  {
    id: 'bk-002',
    title: 'Tire Diagnostics & Balance',
    type: 'mechanic',
    dateTime: 'Sept 22, 2026, 02:30 PM',
    details: 'Assigned: Rajesh Kumar • Completed',
    status: 'Completed',
    cost: 1200.00
  },
  {
    id: 'bk-003',
    title: 'Airport Taxi Booking',
    type: 'ride',
    dateTime: 'Sept 15, 2026, 08:45 AM',
    details: 'Terminal 1 • Completed',
    status: 'Completed',
    cost: 800.00
  }
];

export default function BookingsRegistryModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredBookings = MOCK_BOOKINGS.filter(b =>
    activeTab === 'active' ? b.status === 'Active' : b.status === 'Completed'
  );

  return (
    <div className="sart-modal-backdrop" style={{ display: 'flex', zIndex: 1000, background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div className="modal-sheet centered-modal" style={{ maxWidth: '600px', width: '95%', height: '80vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb', borderRadius: '24px', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', background: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#111827', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="fa-solid fa-bag-shopping" style={{ color: 'var(--primary)' }}></i> My Bookings
          </div>
          <button onClick={onClose} style={{ background: '#f3f4f6', border: 'none', width: '36px', height: '36px', borderRadius: '50%', color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <div className="bookings-tabs">
            <button
              className={`booking-tab-btn ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Active
            </button>
            <button
              className={`booking-tab-btn ${activeTab === 'past' ? 'active' : ''}`}
              onClick={() => setActiveTab('past')}
            >
              Past
            </button>
          </div>

          <div className="bookings-list">
            {filteredBookings.length > 0 ? (
              filteredBookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-card-header">
                    <span className="booking-id">#{booking.id}</span>
                    <span className={`booking-status ${booking.status.toLowerCase()}`}>{booking.status}</span>
                  </div>
                  <h3 className="booking-title">{booking.title}</h3>
                  <p className="booking-details">{booking.details}</p>
                  <div className="booking-card-footer">
                    <span className="booking-date"><i className="fa-regular fa-clock"></i> {booking.dateTime}</span>
                    <span className="booking-cost">₹{(Number(booking.cost) || 0).toFixed(2)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-bookings">
                <i className="fa-solid fa-box-open" style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '16px' }}></i>
                <p>No {activeTab} bookings found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
