'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSartStore } from '../store/useSartStore';
import './SubNavbar.css';
import CustomizeDockModal, {
  ALL_SERVICES_SHORTCUTS,
  DEFAULT_SELECTED_SHORTCUT_IDS,
  ShortcutItem
} from './CustomizeDockModal';

export default function SubNavbar() {
  const { activeTab, setActiveTab } = useSartStore();
  const router = useRouter();

  // State for customize shortcuts modal
  const [isDockModalOpen, setIsDockModalOpen] = useState(false);

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
    } catch (e) {}
  }, []);

  const handleSaveShortcuts = (newIds: string[]) => {
    const limited = newIds.slice(0, 4);
    setSelectedShortcutIds(limited);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sart_subnav_shortcut_ids', JSON.stringify(limited));
      } catch (e) {}
    }
  };

  const handleShortcutClick = (shortcut: ShortcutItem) => {
    if (shortcut.type === 'ride') {
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

  // Resolve full shortcut items from selected IDs
  const activeShortcuts = selectedShortcutIds
    .map(id => ALL_SERVICES_SHORTCUTS.find(s => s.id === id))
    .filter(Boolean) as ShortcutItem[];

  return (
    <>
      <nav className="subnavbar-container" aria-label="Sub Navigation">
        {/* 1. Left Side: Configured Shortcuts (Bike and Car default, up to 4) + '+' Plus Icon Button */}
        <div className="subnavbar-left-actions">
          {activeShortcuts.map((shortcut) => {
            const isActive =
              (shortcut.type === 'ride' && activeTab === 'ride') ||
              (shortcut.type === 'carrier' && activeTab === 'carrier');

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

          {/* Plus '+' Symbol button beside shortcuts to open Customize Shortcuts Modal */}
          <button
            type="button"
            className="subnav-plus-shortcut-btn"
            onClick={() => setIsDockModalOpen(true)}
            title="Add or Customize Shortcuts (Max 4)"
            aria-label="Add or Customize Shortcuts"
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>

        {/* 2. Center: Empty or Spacing for balanced layout */}
        <div className="subnavbar-center-dock"></div>

        {/* 3. Right Side: Help & Support, Settings matching User's Image */}
        <div className="subnavbar-actions">
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
