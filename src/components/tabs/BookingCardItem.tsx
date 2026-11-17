'use client';

import React from 'react';
import { Booking } from '../../data/mockBookings';
import { TRAIN_CARD_ICON, BUS_CARD_ICON, FLIGHT_CARD_ICON } from '../../data/bookingIcons';

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
  const isFlight =
    booking.type === 'flight' ||
    booking.type === 'Flight' ||
    booking.type === 'aeroplane' ||
    booking.type === 'air' ||
    Boolean((booking as any).airline) ||
    booking.title?.toLowerCase().includes('air india') ||
    booking.title?.toLowerCase().includes('indigo') ||
    booking.title?.toLowerCase().includes('vistara') ||
    booking.title?.toLowerCase().includes('spicejet') ||
    booking.title?.toLowerCase().includes('akasa') ||
    booking.title?.toLowerCase().includes('flight') ||
    booking.title?.toLowerCase().includes('airways') ||
    booking.number?.startsWith('UK') ||
    booking.number?.startsWith('6E') ||
    booking.number?.startsWith('IX') ||
    booking.number?.startsWith('AI') ||
    booking.number?.startsWith('SG') ||
    booking.number?.startsWith('QP') ||
    booking.bookingId?.startsWith('FLT') ||
    (Boolean(booking.pnr) && (booking.pnr?.startsWith('UK') || booking.pnr?.startsWith('6E') || booking.pnr?.startsWith('IX')));

  const isTrain =
    !isFlight &&
    (booking.type === 'train' ||
      booking.title?.toLowerCase().includes('shatabdi') ||
      booking.title?.toLowerCase().includes('vande bharat') ||
      booking.title?.toLowerCase().includes('rajdhani') ||
      booking.title?.toLowerCase().includes('garib rath') ||
      booking.title?.toLowerCase().includes('duronto') ||
      booking.title?.toLowerCase().includes('exp') ||
      booking.title?.toLowerCase().includes('sf ex') ||
      Boolean(booking.number?.match(/^\d{5}$/)));

  const isBus =
    !isFlight &&
    (booking.type === 'bus' ||
      booking.title?.toLowerCase().includes('bus') ||
      booking.title?.toLowerCase().includes('volvo') ||
      booking.title?.toLowerCase().includes('travels') ||
      booking.title?.toLowerCase().includes('scania') ||
      booking.number?.startsWith('BUS'));

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {isFlight ? (
              <img
                src={FLIGHT_CARD_ICON}
                alt="Flight"
                style={{ width: '26px', height: '26px', objectFit: 'contain' }}
              />
            ) : isTrain ? (
              <img
                src={TRAIN_CARD_ICON}
                alt="Train"
                style={{ width: '26px', height: '26px', objectFit: 'contain' }}
              />
            ) : isBus ? (
              <img
                src={BUS_CARD_ICON}
                alt="Bus"
                style={{ width: '66px', height: '66px', objectFit: 'cover' }}
              />
            ) : booking.image ? (
              <img
                src={booking.image}
                alt={booking.type}
                style={{ width: '24px', height: '24px', objectFit: 'contain' }}
              />
            ) : (
              <i className={`fa-solid ${booking.title.includes('AUTO') ? 'fa-motorcycle' : booking.title.includes('CRUISE') ? 'fa-ship' : 'fa-car'}`} style={{ color: '#0f172a' }}></i>
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
        {isFlight ? (
          <span>
            PNR <strong style={{ color: '#0f172a', fontWeight: 'bold' }}>{booking.pnr || booking.bookingId || 'UK228355'}</strong>
          </span>
        ) : isTrain ? (
          <span>
            PNR <strong style={{ color: '#0f172a', fontWeight: 'bold' }}>{booking.pnr || booking.bookingId?.replace(/\D/g, '') || '4863831884'}</strong>
          </span>
        ) : (
          <span>Booking ID {booking.bookingId}</span>
        )}
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

