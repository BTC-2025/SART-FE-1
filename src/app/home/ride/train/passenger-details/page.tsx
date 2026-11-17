'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';
import TrainPassengerDetailsModal from '@/components/TrainPassengerDetails';

export default function TrainPassengerDetailsStandalonePage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sart_pending_train_booking');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setBookingData(parsed);
        } catch (e) {
          console.error('Error loading booking data', e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  if (!isLoaded) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 90, background: '#ffffff', width: '100%' }}>
          <Navbar />
          <SubNavbar />
        </div>
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '14px', color: '#64748b' }}>Loading journey details...</div>
        </main>
        <Footer />
      </div>
    );
  }

  const trainName = bookingData?.trainName || '';
  const trainNumber = bookingData?.trainNumber || '';
  const classCode = bookingData?.classCode || '';
  const fare = Number(bookingData?.fare || 0);
  const source = bookingData?.source || '';
  const destination = bookingData?.destination || '';
  const dateOfJourney = bookingData?.dateOfJourney || '';
  const depTime = bookingData?.depTime || '';
  const arrTime = bookingData?.arrTime || '';
  const duration = bookingData?.duration || '';
  const initialPassengers = bookingData?.passengers || [];
  const initialEmail = bookingData?.email || '';
  const initialPhone = bookingData?.phone || '';
  const initialIrctcId = bookingData?.irctcId || '';
  const initialBoardingStation = bookingData?.boardingStation || '';

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      {/* Sticky Header: Navbar + SubNavbar always stay together at top */}
      <div style={{ position: 'sticky', top: 0, zIndex: 90, background: '#ffffff', width: '100%' }}>
        <Navbar />
        <SubNavbar />
      </div>

      {/* Main Container: Centered with 20px left and right gap */}
      <main style={{
        flex: 1,
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingTop: '24px',
        paddingBottom: '32px',
        maxWidth: '1440px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'visible'
      }}>
        <TrainPassengerDetailsModal
          trainName={trainName}
          trainNumber={trainNumber}
          classCode={classCode}
          fare={fare}
          source={source}
          destination={destination}
          dateOfJourney={dateOfJourney}
          depTime={depTime}
          arrTime={arrTime}
          duration={duration}
          passenger={
            initialPassengers?.[0] || {
              name: '',
              age: '',
              gender: 'Male',
              berthPreference: 'No Preference'
            }
          }
          initialPassengers={initialPassengers}
          initialEmail={initialEmail}
          initialPhone={initialPhone}
          initialIrctcId={initialIrctcId}
          initialBoardingStation={initialBoardingStation}
          freeCancel={false}
          onPassengerChange={() => {}}
          onConfirmBooking={() => {}}
          onClose={() => router.push('/home/ride/train')}
          isConfirmed={false}
          isModal={false}
        />
      </main>

      <Footer />
    </div>
  );
}
