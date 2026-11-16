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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sart_pending_train_booking');
      if (saved) {
        try {
          setBookingData(JSON.parse(saved));
        } catch (e) {
          console.error('Error loading booking data', e);
        }
      }
    }
  }, []);

  const trainName = bookingData?.trainName || 'VIKRAMSIMHAPURI';
  const trainNumber = bookingData?.trainNumber || '12743';
  const classCode = bookingData?.classCode || '2S';
  const fare = Number(bookingData?.fare || 105);
  const source = bookingData?.source || 'NELLORE';
  const destination = bookingData?.destination || 'CHIRALA';
  const dateOfJourney = bookingData?.dateOfJourney || 'Wed, 18 Nov';
  const depTime = bookingData?.depTime || '06:25';
  const arrTime = bookingData?.arrTime || '08:38';

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <SubNavbar />

      <main style={{ flex: 1, padding: '20px 0' }}>
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
          passenger={
            bookingData?.passengers?.[0] || {
              name: 'PICHUKA VENKATA',
              age: '24',
              gender: 'Male',
              berthPreference: 'No Preference'
            }
          }
          freeCancel={false}
          onPassengerChange={() => {}}
          onConfirmBooking={() => {}}
          onClose={() => router.push('/home/ride/train')}
          isConfirmed={false}
        />
      </main>

      <Footer />
    </div>
  );
}

