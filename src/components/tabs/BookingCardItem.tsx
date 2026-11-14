'use client';

import React from 'react';
import { Booking } from '../../data/mockBookings';

interface BookingCardProps {
  booking: Booking;
  overviewTab: 'upcoming' | 'past' | 'cancelled';
  onViewDetails: (b: Booking) => void;
  onDownloadTicket: (b: Booking) => void;
  onCancelBooking: (id: string) => void;
}

export const BookingCardItem: React.FC<BookingCardProps> = ({
  booking,
  overviewTab,
  onViewDetails,
  onDownloadTicket,
  onCancelBooking
}) => {
  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {booking.image ? (
              <img src={booking.image} alt={booking.type} style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
            ) : (
              <i className={`fa-solid ${booking.title.includes('AUTO') ? 'fa-motorcycle' : booking.title.includes('CRUISE') ? 'fa-ship' : booking.title.includes('EXPRESS') ? 'fa-train' : 'fa-plane'}`} style={{ color: '#0f172a' }}></i>
            )}
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>{booking.number}</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>{booking.title}</div>
          </div>
        </div>
        {overviewTab === 'cancelled' && (
          <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold' }}>CANCELLED</div>
        )}
        {overviewTab !== 'cancelled' && (
          <div style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: 'bold' }}>P</div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>{booking.sourceCode || booking.source}</div>
          <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: '500', marginTop: '4px' }}>{booking.sourceTime}</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{booking.sourceDate}</div>
        </div>
        <i className="fa-solid fa-arrow-right-long" style={{ color: '#cbd5e1' }}></i>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>{booking.destinationCode || booking.destination}</div>
          <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: '500', marginTop: '4px' }}>{booking.destinationTime}</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{booking.destinationDate}</div>
        </div>
      </div>

      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
        Booking ID {booking.bookingId}
      </div>

      {overviewTab === 'cancelled' ? (
        <button onClick={() => onViewDetails(booking)} style={{ width: '100%', padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          Refund Details
        </button>
      ) : (
        <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
          <button
            onClick={() => onDownloadTicket(booking)}
            style={{ flex: 1, padding: '10px 4px', fontSize: '13px', whiteSpace: 'nowrap', background: 'transparent', color: '#0ea5e9', border: '1px solid #0ea5e9', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Download Ticket
          </button>
          <button onClick={() => onViewDetails(booking)} style={{ flex: 1, padding: '10px 4px', fontSize: '13px', whiteSpace: 'nowrap', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            View Details
          </button>
          <button
            onClick={() => onCancelBooking(booking.id || booking.bookingId || booking.pnr || '')}
            style={{ padding: '10px 8px', fontSize: '12px', whiteSpace: 'nowrap', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
            title="Cancel this booking"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

