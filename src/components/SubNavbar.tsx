'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSartStore } from '../store/useSartStore';
import './SubNavbar.css';

interface SubNavItem {
  id: string;
  label: string;
  icon: string;
  targetTab?: string;
  modal?: string;
  externalUrl?: string;
}

export default function SubNavbar() {
  const { activeTab, setActiveTab } = useSartStore();
  const router = useRouter();

  const subNavItems: SubNavItem[] = [
    { id: 'rides', label: 'Rides', icon: 'fa-car-side', targetTab: 'ride' },
    { id: 'carrier', label: 'Logistics & Cargo', icon: 'fa-truck-fast', targetTab: 'carrier' },
    { id: 'rental', label: 'Rentals', icon: 'fa-key', targetTab: 'rental' },
    { id: 'drivers', label: 'Hire Drivers', icon: 'fa-user-tie', targetTab: 'drivers' },
    { id: 'parking', label: 'Parking Slots', icon: 'fa-square-parking', targetTab: 'parking' },
    { id: 'mechanic', label: 'Mechanic', icon: 'fa-screwdriver-wrench', targetTab: 'mechanic' },
    { id: 'community', label: 'Community', icon: 'fa-users', targetTab: 'community' },
  ];

  const handleItemClick = (item: SubNavItem) => {
    if (item.externalUrl) {
      window.open(item.externalUrl, '_blank');
      return;
    }
    if (item.modal && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('openReactModal', { detail: item.modal }));
      return;
    }
    if (item.targetTab) {
      setActiveTab(item.targetTab as any);
      router.push(`/?tab=${item.targetTab}`, { scroll: false });
    }
  };

  return (
    <nav className="subnavbar-container" aria-label="Sub Navigation">
      <div className="subnavbar-links">
        {subNavItems.map((item) => {
          const isActive = activeTab === item.targetTab;
          return (
            <button
              key={item.id}
              type="button"
              className={`subnav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleItemClick(item)}
              title={item.label}
            >
              <i className={`fa-solid ${item.icon} subnav-item-icon`}></i>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

    </nav>
  );
}
