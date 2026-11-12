'use client';

import React, { useState, useEffect } from 'react';
import CaptainHeader from '@/components/captain/CaptainHeader';
import CaptainWalletPage from '@/components/captain/CaptainWalletPage';
import EnableLocationModal from '@/components/captain/EnableLocationModal';
import Footer from '@/components/captain/Footer';
import '@/components/captain/CaptainHub.css';

export default function CaptainWalletRoutePage() {
  const [partnerDetails, setPartnerDetails] = useState<any>(null);
  const [isOnDuty, setIsOnDuty] = useState(true);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem('sart_captain_session');
      if (stored) {
        setPartnerDetails(JSON.parse(stored));
      } else {
        // Fallback default details
        setPartnerDetails({
          name: 'Kumar',
          mobile: '9988664422',
          serviceType: 'bike',
          city: 'Chennai',
          vehicleModel: 'Hero Splendor EV Bike',
          plateNumber: 'TN 09 EQ 4421'
        });
      }
    } catch (e) { }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('sart_captain_session');
      localStorage.removeItem('sart_captain_jwt_token');
    } catch (e) { }
    if (typeof window !== 'undefined') {
      window.location.href = '/ride/captain/login';
    }
  };

  const handleBackToHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/ride/captain/bike';
    }
  };

  if (!isMounted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#94a3b8' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '10px' }}></i> Loading Captain Wallet...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <CaptainHeader
        partnerDetails={partnerDetails}
        isOnDuty={isOnDuty}
        setIsOnDuty={setIsOnDuty}
        onOpenProfile={() => {
          if (typeof window !== 'undefined') window.location.href = '/ride/captain/bike';
        }}
        onOpenWallet={() => { }}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onLogout={handleLogout}
        activeSubTab="wallet"
      />

      <EnableLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectCity={(city: string) => {
          setPartnerDetails((prev: any) => ({ ...(prev || {}), city }));
          setIsLocationModalOpen(false);
        }}
        currentCity={partnerDetails?.city || 'Chennai'}
      />

      <main style={{ flex: 1, padding: '16px 8px' }}>
        <CaptainWalletPage
          partnerDetails={partnerDetails}
          onBackToHome={handleBackToHome}
        />
      </main>

      <Footer />
    </div>
  );
}

