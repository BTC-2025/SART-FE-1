'use client';
import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useSartStore } from '@/store/useSartStore';
import RideBookingModal from '@/components/RideBookingModal';
import CarrierBookingModal from '@/components/CarrierBookingModal';
import RentalBookingModal from '@/components/RentalBookingModal';
import UniversalModals from '@/components/modals/UniversalModals';
import HomeTab from '@/components/tabs/HomeTab';
import StoreTab from '@/components/tabs/StoreTab';
import ProfileTab from '@/components/tabs/ProfileTab';
import WalletTab from '@/components/tabs/WalletTab';
import BookingsTab from '@/components/tabs/BookingsTab';
import SupportTab from '@/components/tabs/SupportTab';
import FavoritesTab from '@/components/tabs/FavoritesTab';
import CitySelectorModal from '@/components/modals/CitySelectorModal';
import BookingsRegistryModal from '@/components/BookingsRegistryModal';
import DriversBookingModal from '@/components/DriversBookingModal';
import CommunityModal from '@/components/CommunityModal';
import MechanicModal from '@/components/MechanicModal';
import ParkingBookingModal from '@/components/ParkingBookingModal';
import CartModal from '@/components/CartModal';

export default function Home() {
  const { activeTab, setActiveTab } = useSartStore();
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenModal = (e: any) => {
      if (e.detail === 'modal-city-selector') {
        setIsCityModalOpen(true);
      } else if (e.detail === 'modal-bookings-registry') {
        setIsBookingsModalOpen(true);
      }
    };
    
    window.addEventListener('openReactModal', handleOpenModal);
    
    return () => {
      window.removeEventListener('openReactModal', handleOpenModal);
    };
  }, []);

  const pathname = usePathname();

  // Handle URL parsing on mount and route changes (Next.js App Router)
  useEffect(() => {
    if (!pathname) return;
    
    if (pathname === '/' || pathname === '/home') {
      setActiveTab('home');
    } else if (pathname.startsWith('/home/')) {
      const parts = pathname.split('/');
      let tab = parts[2]; // e.g., 'ride', 'carrier'
      
      // Handle plural vs singular mismatches
      if (tab === 'rides') tab = 'ride';

      if (['ride', 'carrier', 'rental', 'drivers', 'community', 'mechanic', 'parking'].includes(tab)) {
        setActiveTab(tab as any);
      }
    } else if (pathname.startsWith('/booking/')) {
      setActiveTab('booking');
    } else {
      // Check for top-level tabs (e.g. /store)
      const tab = pathname.replace('/', '');
      if (['store', 'booking', 'wallet', 'profile', 'support', 'favorites'].includes(tab)) {
        setActiveTab(tab as any);
      }
    }
  }, [pathname, setActiveTab]);

  return (
    <div className="web-app-layout">
      <Navbar />
      
      <main className="web-main-content">
        <HomeTab />
        <StoreTab />
        <BookingsTab />
        <WalletTab />
        <ProfileTab />
        <SupportTab />
        <FavoritesTab />
        
        {/* Service Sub-Pages (Rendered as Tabs) */}
        <div className={`tab-screen ${['ride', 'carrier', 'rental', 'drivers', 'community', 'mechanic', 'parking'].includes(activeTab) ? 'active' : ''}`} id="tab-service-pages">
          <RideBookingModal isOpen={activeTab === 'ride'} onClose={() => setActiveTab('home')} />
          <CarrierBookingModal isOpen={activeTab === 'carrier'} onClose={() => setActiveTab('home')} />
          <RentalBookingModal isOpen={activeTab === 'rental'} onClose={() => setActiveTab('home')} />
          <DriversBookingModal isOpen={activeTab === 'drivers'} onClose={() => setActiveTab('home')} />
          <CommunityModal isOpen={activeTab === 'community'} onClose={() => setActiveTab('home')} />
          <MechanicModal isOpen={activeTab === 'mechanic'} onClose={() => setActiveTab('home')} />
          <ParkingBookingModal isOpen={activeTab === 'parking'} onClose={() => setActiveTab('home')} />
        </div>

        {/* Legacy Universal Modals */}
        <UniversalModals />
      </main>

      <Script src="/app.js" strategy="lazyOnload" />
      <CitySelectorModal isOpen={isCityModalOpen} onClose={() => setIsCityModalOpen(false)} />
      <BookingsRegistryModal isOpen={isBookingsModalOpen} onClose={() => setIsBookingsModalOpen(false)} />
      <CartModal />
    </div>
  );
}
