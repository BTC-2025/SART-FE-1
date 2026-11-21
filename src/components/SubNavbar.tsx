'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSartStore } from '../store/useSartStore';
import './SubNavbar.css';
import CustomizeDockModal, {
  ALL_SERVICES_SHORTCUTS,
  DEFAULT_SELECTED_SHORTCUT_IDS,
  ShortcutItem
} from './CustomizeDockModal';

const MY_SERVE_OPTIONS = [
  {
    id: 'captain',
    label: 'Captain',
    icon: 'fa-user-tie',
    route: '/ride/captain'
  },
  {
    id: 'rental_owner',
    label: 'Rental Owner',
    icon: 'fa-key',
    route: '/home/rental'
  },
  {
    id: 'parking_owner',
    label: 'Parking Owner',
    icon: 'fa-square-parking',
    route: '/booking'
  },
  {
    id: 'drivers',
    label: 'Drivers',
    icon: 'fa-id-card',
    route: '/home/rental/Car/CarDetails/DriverDetails'
  }
];

export default function SubNavbar() {
  const { activeTab, setActiveTab, activeRideMode, setActiveRideMode, isBitToolOpen } = useSartStore();
  const router = useRouter();

  // State for customize shortcuts modal
  const [isDockModalOpen, setIsDockModalOpen] = useState(false);

  // State for My Serve dropdown menu
  const [isMyServeOpen, setIsMyServeOpen] = useState(false);
  const myServeRef = useRef<HTMLDivElement>(null);

  // Default: only Bike appears initially (matching user image)
  const [selectedShortcutIds, setSelectedShortcutIds] = useState<string[]>(DEFAULT_SELECTED_SHORTCUT_IDS);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem('sart_subnav_shortcut_ids');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedShortcutIds(parsed.slice(0, 4));
        }
      }
    } catch (e) { }
  }, []);

  // Click outside listener for My Serve dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (myServeRef.current && !myServeRef.current.contains(event.target as Node)) {
        setIsMyServeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSaveShortcuts = (newIds: string[]) => {
    const limited = newIds.slice(0, 4);
    setSelectedShortcutIds(limited);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sart_subnav_shortcut_ids', JSON.stringify(limited));
      } catch (e) { }
    }
  };

  const handleShortcutClick = (shortcut: ShortcutItem) => {
    if (shortcut.type === 'ride') {
      const rideMode = (shortcut.id === 'train_ride' ? 'train' : shortcut.id === 'flight_ride' ? 'flight' : shortcut.id) as any;
      if (setActiveRideMode) {
        setActiveRideMode(rideMode);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('sart_active_ride_mode', rideMode);
      }
      setActiveTab('ride');
      router.push(shortcut.route, { scroll: false });
    } else {
      setActiveTab('carrier');
      router.push(shortcut.route, { scroll: false });
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

  const handleMyServeSelect = (option: typeof MY_SERVE_OPTIONS[0]) => {
    setIsMyServeOpen(false);
    if (option.id === 'captain') {
      router.push('/ride/captain');
    } else if (option.id === 'rental_owner') {
      if (typeof window !== 'undefined') {
        const win = window.open('http://localhost:5173', '_blank');
        if (!win || win.closed || typeof win.closed === 'undefined') {
          router.push('/home/rental');
        }
      } else {
        router.push('/home/rental');
      }
    } else if (option.id === 'parking_owner') {
      if (typeof window !== 'undefined') {
        const win = window.open('http://localhost:5173', '_blank');
        if (!win || win.closed || typeof win.closed === 'undefined') {
          router.push('/booking');
        }
      } else {
        router.push('/booking');
      }
    } else if (option.id === 'drivers') {
      router.push('/home/rental/Car/CarDetails/DriverDetails');
    } else if (option.route) {
      router.push(option.route);
    }
  };

  // Resolve full shortcut items from selected IDs
  const activeShortcuts = selectedShortcutIds
    .map(id => ALL_SERVICES_SHORTCUTS.find(s => s.id === id))
    .filter(Boolean) as ShortcutItem[];

  return (
    <>
      <nav
        className={`subnavbar-container ${isBitToolOpen ? 'has-bittool' : 'no-bittool'}`}
        aria-label="Sub Navigation"
      >
        {/* 1. Left Side: Configured Shortcuts (Bike, Car, etc.) + '+' Plus Icon Button */}
        <div className="subnavbar-center-actions">
          {activeShortcuts.map((shortcut) => {
            const normalizedShortcutMode = shortcut.id === 'train_ride' ? 'train' : shortcut.id === 'flight_ride' ? 'flight' : shortcut.id;
            const currentMode = activeRideMode || 'bike';
            const isActive =
              shortcut.type === 'ride'
                ? activeTab === 'ride' && (currentMode === normalizedShortcutMode || currentMode === shortcut.id)
                : activeTab === 'carrier' && shortcut.type === 'carrier';

            return (
              <button
                key={shortcut.id}
                type="button"
                className={`subnav-quick-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleShortcutClick(shortcut)}
                title={shortcut.name}
              >
                <i className={`fa-solid ${shortcut.icon}`}></i>
                <span>{shortcut.name}</span>
              </button>
            );
          })}

          {/* Plus '+' Symbol and 'Customize' wrapped inside ONE dashed pill border */}
          <button
            type="button"
            className="subnav-customize-combined-btn"
            onClick={() => setIsDockModalOpen(true)}
            title="Add or Customize Shortcuts (Max 4)"
            aria-label="Add or Customize Shortcuts"
          >
            <i className="fa-solid fa-plus subnav-customize-plus-icon"></i>
            <span className="subnav-customize-text">Shortcut</span>
          </button>
        </div>

        {/* 2. Center: Empty or Spacing for balanced layout */}
        <div className="subnavbar-center-dock"></div>

        {/* 3. Right Side: My Serve, Help & Support, Settings matching User's Image */}
        <div className="subnavbar-actions">
          {/* My Serve Dropdown Button (Placed immediately before Help & Support) */}
          <div className="subnav-dropdown-wrapper" ref={myServeRef}>
            <button
              type="button"
              className={`subnav-action-pill-btn ${isMyServeOpen ? 'active' : ''}`}
              onClick={() => setIsMyServeOpen(prev => !prev)}
              title="My Serve"
              aria-label="My Serve"
              aria-expanded={isMyServeOpen}
            >
              <span className="subnav-action-icon-circle">
                <i className="fa-solid fa-briefcase"></i>
              </span>
              <span className="subnav-action-text">My Serve</span>
              <i
                className={`fa-solid fa-chevron-down subnav-dropdown-chevron ${isMyServeOpen ? 'open' : ''}`}
                style={{ fontSize: '10px', marginLeft: '3px' }}
              ></i>
            </button>

            {isMyServeOpen && (
              <div className="subnav-dropdown-menu" role="menu">
                {MY_SERVE_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className="subnav-dropdown-item"
                    onClick={() => handleMyServeSelect(option)}
                    role="menuitem"
                  >
                    <i className={`fa-solid ${option.icon}`}></i>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="subnav-action-pill-btn"
            onClick={handleSupportClick}
            title="Help & Support"
            aria-label="Help & Support"
          >
            <span className="subnav-action-icon-circle">
              <i className="fa-solid fa-headset"></i>
            </span>
            <span className="subnav-action-text">Help & Support</span>
          </button>
          <button
            type="button"
            className="subnav-action-pill-btn"
            onClick={handleSettingsClick}
            title="Settings"
            aria-label="Settings"
          >
            <span className="subnav-action-icon-circle">
              <i className="fa-solid fa-gear"></i>
            </span>
            <span className="subnav-action-text">Settings</span>
          </button>
        </div>
      </nav>

      {/* Customize Shortcuts Modal (Image 2 UI: max 4 selectable) */}
      <CustomizeDockModal
        isOpen={isDockModalOpen}
        onClose={() => setIsDockModalOpen(false)}
        selectedIds={selectedShortcutIds}
        onSave={handleSaveShortcuts}
        maxSelections={4}
      />
    </>
  );
}
