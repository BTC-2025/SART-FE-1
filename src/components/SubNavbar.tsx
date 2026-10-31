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
    // { id: 'rides', label: 'Rides', icon: 'fa-car-side', targetTab: 'ride' },
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

  const handleSupportClick = () => {
    setActiveTab('support');
    router.push('/support', { scroll: false });
  };

  const handleSettingsClick = () => {
    setActiveTab('profile');
    router.push('/profile', { scroll: false });
  };

  const handleCaptainLoginClick = () => {
    router.push('/ride/captain/login');
  };

  return (
    <nav className="subnavbar-container" aria-label="Sub Navigation">
      {/* Invisible spacer to balance the right-side actions and keep center items truly centered */}
      <div className="subnavbar-spacer" aria-hidden="true"></div>

      {/* Center Shortcuts */}
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

      {/* End Actions: Captain Login External Link, Help & Support, Settings */}
      <div className="subnavbar-actions">

        <button
          type="button"
          className="subnav-icon-btn"
          onClick={handleSupportClick}
          title="Help & Support"
          aria-label="Help & Support"
        >
          <i className="fa-solid fa-headset"></i>
        </button>
        <button
          type="button"
          className="subnav-icon-btn"
          onClick={handleSettingsClick}
          title="Settings"
          aria-label="Settings"
        >
          <i className="fa-solid fa-gear"></i>
        </button>
      </div>
    </nav>
  );
}
