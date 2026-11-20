'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';
import RentalStepTwo from '@/components/rental/RentalStepTwo';
import { RENTAL_MASTER_CATEGORIES } from '@/components/rental/rentalData';

function AllRentalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pickup = searchParams.get('pickup') || searchParams.get('origin') || 'Katpadi';
  const [userLoc, setUserLoc] = useState(pickup);
  const [isLocating, setIsLocating] = useState(false);

  // Dates
  const [pickupDate, setPickupDate] = useState(() => {
    const today = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]}`;
  });

  const [dropoffDate, setDropoffDate] = useState(() => {
    const tom = new Date();
    tom.setDate(tom.getDate() + 1);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[tom.getDay()]}, ${tom.getDate()} ${months[tom.getMonth()]}`;
  });

  // Filter & Duration States
  const [filterFuel, setFilterFuel] = useState<string>('ALL');
  const [filterTransmission, setFilterTransmission] = useState<string>('ALL');
  const [filterSeats, setFilterSeats] = useState<string>('ALL');
  const [filterModelYear, setFilterModelYear] = useState<string>('ALL');
  const [filterCategoryModel, setFilterCategoryModel] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('near_first');
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(15000);
  const [durationPlan, setDurationPlan] = useState<'1day' | '3days' | '1week' | '2weeks' | '1month' | 'custom'>('1day');
  const [customDays, setCustomDays] = useState<number>(1);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');

  // Combined Master Category for All Vehicles (Cars + Bikes)
  const allMaster = {
    id: 'all',
    title: 'Self-drive Cars & Bikes',
    subtitle: 'Cars, Bikes and Scooters across India',
    list: []
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <RentalStepTwo
        activeMaster={allMaster as any}
        pickup={pickup}
        setPickup={setUserLoc}
        pickupDate={pickupDate}
        dropoffDate={dropoffDate}
        userLocationName={userLoc}
        isLocating={isLocating}
        setIsLocating={setIsLocating}
        setUserLocationName={setUserLoc}
        filterFuel={filterFuel}
        setFilterFuel={setFilterFuel}
        filterTransmission={filterTransmission}
        setFilterTransmission={setFilterTransmission}
        filterSeats={filterSeats}
        setFilterSeats={setFilterSeats}
        filterModelYear={filterModelYear}
        setFilterModelYear={setFilterModelYear}
        filterCategoryModel={filterCategoryModel}
        setFilterCategoryModel={setFilterCategoryModel}
        sortBy={sortBy}
        setSortBy={setSortBy}
        priceMin={priceMin}
        setPriceMin={setPriceMin}
        priceMax={priceMax}
        setPriceMax={setPriceMax}
        durationPlan={durationPlan}
        setDurationPlan={setDurationPlan}
        customDays={customDays}
        setCustomDays={setCustomDays}
        selectedVehicleId={selectedVehicleId}
        setSelectedVehicleId={setSelectedVehicleId}
        handleBackToFleet={() => router.push('/')}
        handleClose={() => router.push('/')}
        setStep={(step) => {
          if (step === 1) {
            router.push('/');
          }
        }}
      />
    </div>
  );
}

export default function AllFleetPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <Navbar />
      <SubNavbar />
      <Suspense fallback={
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
          <div style={{ textAlign: 'center' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '32px', color: '#2563eb', marginBottom: '12px' }}></i>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Loading Fleet...</p>
          </div>
        </div>
      }>
        <AllRentalContent />
      </Suspense>
      <Footer />
    </div>
  );
}
