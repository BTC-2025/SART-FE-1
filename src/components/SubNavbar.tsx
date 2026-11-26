'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSartStore } from '../store/useSartStore';
import './SubNavbar.css';
import CustomizeDockModal, {
  ALL_SERVICES_SHORTCUTS,
  DEFAULT_SELECTED_SHORTCUT_IDS,
  PERMANENT_SHORTCUT_IDS,
  ShortcutItem
} from './CustomizeDockModal';
import UserAuthModal from './UserAuthModal';

const MY_SERVE_OPTIONS = [
  {
    id: 'captain',
    label: 'Captain',
    icon: 'fa-user-tie',
    url: 'http://localhost:3005/ride/captain/login?category=bike',
    isExternal: false
  },
  {
    id: 'rental_owner',
    label: 'Rental Owner',
    icon: 'fa-key',
    url: 'http://localhost:3007/rentals',
    isExternal: true
  },
  {
    id: 'carriers',
    label: 'Carriers',
    icon: 'fa-truck-fast',
    url: 'http://localhost:3007/carriers',
    isExternal: true
  },
  {
    id: 'parking_owner',
    label: 'Parking Owner',
    icon: 'fa-square-parking',
    url: 'http://localhost:3007/parking',
    isExternal: true
  },
  {
    id: 'drivers',
    label: 'Drivers',
    icon: 'fa-id-card',
    url: 'http://localhost:3007/drivers',
    isExternal: true
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

  // Authentication requirement modal & pending target
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingTargetUrl, setPendingTargetUrl] = useState<string | null>(null);

  // Default: Bike, Truck, Parkings permanent defaults (matching user image)
  const [selectedShortcutIds, setSelectedShortcutIds] = useState<string[]>(DEFAULT_SELECTED_SHORTCUT_IDS);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem('sart_subnav_shortcut_ids');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Always ensure the 3 permanent shortcuts exist at the start
          const customOnly = parsed.filter((id: string) => !PERMANENT_SHORTCUT_IDS.includes(id)).slice(0, 2);
          setSelectedShortcutIds([...PERMANENT_SHORTCUT_IDS, ...customOnly]);
          return;
        }
      }
      setSelectedShortcutIds(DEFAULT_SELECTED_SHORTCUT_IDS);
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
    // Ensure permanent 3 are never removed, plus up to 2 custom choices
    const customOnly = newIds.filter(id => !PERMANENT_SHORTCUT_IDS.includes(id)).slice(0, 2);
    const combined = [...PERMANENT_SHORTCUT_IDS, ...customOnly];
    setSelectedShortcutIds(combined);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sart_subnav_shortcut_ids', JSON.stringify(combined));
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
    } else if (shortcut.type === 'carrier') {
      setActiveTab('carrier');
      router.push(shortcut.route, { scroll: false });
    } else if (['rental', 'drivers', 'parking', 'community'].includes(shortcut.type)) {
      setActiveTab(shortcut.type as any);
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

  const checkIsLoggedIn = () => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = localStorage.getItem('sart_user_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.token || parsed.phone || parsed.email || parsed.id)) {
          return true;
        }
      }
    } catch (e) { }
    return false;
  };

  const navigateToUrl = (targetUrl: string) => {
    if (typeof window === 'undefined') return;
    if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
      window.location.href = targetUrl;
    } else {
      router.push(targetUrl);
    }
  };

  const handleMyServeSelect = (option: typeof MY_SERVE_OPTIONS[0]) => {
    setIsMyServeOpen(false);

    // Only logged-in users can enter into these portals
    const loggedIn = checkIsLoggedIn();
    if (!loggedIn) {
      setPendingTargetUrl(option.url);
      setIsAuthModalOpen(true);
      return;
    }

    navigateToUrl(option.url);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    if (pendingTargetUrl) {
      const url = pendingTargetUrl;
      setPendingTargetUrl(null);
      navigateToUrl(url);
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
                : activeTab === shortcut.type;

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

      {/* Customize Shortcuts Modal: Bike, Truck, Parkings permanent defaults + max 2 custom additions */}
      <CustomizeDockModal
        isOpen={isDockModalOpen}
        onClose={() => setIsDockModalOpen(false)}
        selectedIds={selectedShortcutIds}
        onSave={handleSaveShortcuts}
        maxCustomAdditions={2}
      />

      {/* User Login Modal: ensures only logged-in users can enter */}
      <UserAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingTargetUrl(null);
        }}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}
