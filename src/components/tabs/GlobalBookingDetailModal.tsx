'use client';

import React from 'react';
import { Booking } from '../../data/mockBookings';

export interface GlobalBookingDetailModalProps {
  booking: Booking | null;
  onClose: () => void;
  onCancelBooking: (bookingId: string) => void;
}

export const GlobalBookingDetailModal: React.FC<GlobalBookingDetailModalProps> = ({
  booking,
  onClose,
  onCancelBooking
}) => {
  if (!booking) return null;

  const handleCancelClick = () => {
    if (confirm(`Are you sure you want to cancel booking for ${booking.title}?`)) {
      onCancelBooking(booking.id || booking.bookingId || booking.pnr || '');
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '800px', background: 'white', borderRadius: '16px', display: 'flex', overflow: 'hidden', maxHeight: '90vh' }}>

        {/* Left: Details */}
        <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', color: '#0f172a' }}>{booking.title}</h2>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Booking ID: {booking.bookingId || booking.pnr}</div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>FROM</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>{booking.source}</div>
                <div style={{ fontSize: '13px', color: '#0f172a' }}>{booking.sourceTime}, {booking.sourceDate}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>TO</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>{booking.destination}</div>
                <div style={{ fontSize: '13px', color: '#0f172a' }}>{booking.destinationTime}, {booking.destinationDate}</div>
              </div>
            </div>
            <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Passenger Name</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{booking.passengerName || 'Passenger'}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Seat Status</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: booking.isCancelled ? '#ef4444' : '#15803d' }}>
                  {booking.seatStatus || (booking.isCancelled ? 'Cancelled' : 'Confirmed')}
                </div>
              </div>
            </div>
          </div>

          {booking.isCancelled ? (
            <>
              <h3 style={{ fontSize: '16px', margin: '0 0 16px 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', color: '#ef4444' }}>
                Cancellation & Refund Details
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Booking Status</span>
                <span style={{ fontWeight: 'bold', color: '#ef4444' }}>Cancelled</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Refund Status</span>
                <span style={{ fontWeight: 'bold', color: '#10b981' }}>Processed to Bank (100% Refund)</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#64748b', marginTop: '12px' }}>
                <span style={{ background: '#ecfdf5', color: '#10b981', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                  <i className="fa-solid fa-check-circle"></i> Refunded Successfully
                </span>
                <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>
                  Ref: RFND-{booking.pnr || 'BUS98765'}
                </span>
              </div>
            </>
          ) : (
            <>
              <h3 style={{ fontSize: '16px', margin: '0 0 16px 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                Booking Actions
              </h3>
              <div style={{ display: 'flex', gap: '14px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{ flex: 1, padding: '10px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', color: '#334155' }}
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleCancelClick}
                  style={{ flex: 1, padding: '10px 16px', background: '#ef4444', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', color: 'white' }}
                >
                  Cancel Ticket & Get Refund
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

