'use client';

import React from 'react';
import TrainBookingView from './TrainBookingView';

export default function RideBookingModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="ride-page-wrapper" style={{ width: '100%', minHeight: 'calc(100vh - 80px)', backgroundColor: '#f8fafc', padding: '24px 20px', boxSizing: 'border-box' }}>
      <TrainBookingView />
    </div>
  );
}
