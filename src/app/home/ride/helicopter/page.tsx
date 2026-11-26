'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';
import TrainBookingView from '@/components/TrainBookingView';

export default function HelicopterRidePage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <Navbar />
      <SubNavbar />
      <main style={{ flex: '1 0 auto', width: '100%', overflowY: 'visible' }}>
        <TrainBookingView />
      </main>
      <Footer />
    </div>
  );
}
