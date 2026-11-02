'use client';

import React, { useState } from 'react';
import './CustomizeDockModal.css';

export interface ShortcutItem {
  id: string;
  name: string;
  type: 'ride' | 'carrier';
  icon: string;
  route: string;
}

export const ALL_SERVICES_SHORTCUTS: ShortcutItem[] = [
  // Rides Services
  { id: 'bike', name: 'Bike', type: 'ride', icon: 'fa-motorcycle', route: '/home/ride' },
  { id: 'car', name: 'Car', type: 'ride', icon: 'fa-car', route: '/home/ride' },
  { id: 'auto', name: 'Auto', type: 'ride', icon: 'fa-taxi', route: '/home/ride' },
  { id: 'bus', name: 'Bus Booking', type: 'ride', icon: 'fa-bus', route: '/home/ride' },
  { id: 'shuttle', name: 'Shuttle / Van Booking', type: 'ride', icon: 'fa-van-shuttle', route: '/home/ride' },
  { id: 'train_ride', name: 'Train Booking', type: 'ride', icon: 'fa-train', route: '/home/ride' },
  { id: 'flight_ride', name: 'Flight Booking', type: 'ride', icon: 'fa-plane', route: '/home/ride' },
  { id: 'ferry', name: 'Ferry / Boat Booking', type: 'ride', icon: 'fa-ship', route: '/home/ride' },
  { id: 'helicopter', name: 'Helicopter Booking', type: 'ride', icon: 'fa-helicopter', route: '/home/ride' },

  // Carriers & Cargo Logistics
  { id: 'truck', name: 'Truck Cargo', type: 'carrier', icon: 'fa-truck-moving', route: '/home/carrier' },
  { id: 'train_cargo', name: 'Train Cargo Freight', type: 'carrier', icon: 'fa-train-subway', route: '/home/carrier' },
  { id: 'flight_cargo', name: 'Flight Air Cargo', type: 'carrier', icon: 'fa-plane-departure', route: '/home/carrier' },
  { id: 'bike_parcel', name: 'Bike Parcel', type: 'carrier', icon: 'fa-box', route: '/home/carrier' },
  { id: 'ship_cargo', name: 'Ship Cargo', type: 'carrier', icon: 'fa-ship', route: '/home/carrier' },
  { id: 'tempo', name: 'Mini Truck / Tempo', type: 'carrier', icon: 'fa-truck-pickup', route: '/home/carrier' },
];

export const DEFAULT_SELECTED_SHORTCUT_IDS: string[] = ['bike'];

interface CustomizeDockModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: string[];
  onSave: (ids: string[]) => void;
  maxSelections?: number;
}

export default function CustomizeDockModal({
  isOpen,
  onClose,
  selectedIds,
  onSave,
  maxSelections = 4
}: CustomizeDockModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'ride' | 'carrier'>('all');
  const [tempSelected, setTempSelected] = useState<string[]>(selectedIds);

  // Sync temp selections when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTempSelected(selectedIds);
      setSearchQuery('');
    }
  }, [isOpen, selectedIds]);

  if (!isOpen) return null;

  const handleToggle = (id: string) => {
    if (tempSelected.includes(id)) {
      if (tempSelected.length <= 1) {
        return;
      }
      setTempSelected(prev => prev.filter(item => item !== id));
    } else {
      // Maximum 4 shortcuts can be chosen
      if (tempSelected.length >= maxSelections) {
        alert(`You can choose a maximum of ${maxSelections} shortcuts for the navigation bar.`);
        return;
      }
      setTempSelected(prev => [...prev, id]);
    }
  };

  const handleResetDefaults = () => {
    setTempSelected(DEFAULT_SELECTED_SHORTCUT_IDS);
  };

  const handleDone = () => {
    onSave(tempSelected);
    onClose();
  };

  const filteredServices = ALL_SERVICES_SHORTCUTS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategoryFilter === 'all' || s.type === activeCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="dock-modal-backdrop" onClick={onClose}>
      <div className="dock-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="dock-modal-header">
          <div>
            <h3 className="dock-modal-title">Customize Shortcuts</h3>
            <span className="dock-modal-subtitle">
              Select {maxSelections} shortcuts ({tempSelected.length}/{maxSelections} selected)
            </span>
          </div>
          <button type="button" className="dock-modal-close-btn" onClick={onClose} title="Close">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Search Input Box */}
        <div className="dock-modal-search-box">
          <i className="fa-solid fa-magnifying-glass search-ico"></i>
          <input
            type="text"
            className="dock-modal-search-input"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Tabs: All, Rides, Carriers */}
        <div className="dock-service-filter-row">
          <button
            type="button"
            className={`dock-filter-tab ${activeCategoryFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategoryFilter('all')}
          >
            All Services
          </button>
          <button
            type="button"
            className={`dock-filter-tab ${activeCategoryFilter === 'ride' ? 'active' : ''}`}
            onClick={() => setActiveCategoryFilter('ride')}
          >
            <i className="fa-solid fa-car-side" style={{ marginRight: '5px' }}></i> Rides
          </button>
          <button
            type="button"
            className={`dock-filter-tab ${activeCategoryFilter === 'carrier' ? 'active' : ''}`}
            onClick={() => setActiveCategoryFilter('carrier')}
          >
            <i className="fa-solid fa-truck-moving" style={{ marginRight: '5px' }}></i> Carriers
          </button>
        </div>

        {/* 2-Column Grid Matching User's Image 2 */}
        <div className="dock-shortcuts-grid">
          {filteredServices.map(service => {
            const isSelected = tempSelected.includes(service.id);
            const isAtMax = !isSelected && tempSelected.length >= maxSelections;

            return (
              <div
                key={service.id}
                className={`shortcut-item-card ${isSelected ? 'selected' : ''} ${isAtMax ? 'disabled' : ''}`}
                onClick={() => handleToggle(service.id)}
              >
                <div className="shortcut-card-left">
                  <div className={`shortcut-icon-badge ${isSelected ? 'active' : ''}`}>
                    <i className={`fa-solid ${service.icon}`}></i>
                  </div>
                  <span className="shortcut-card-name">{service.name}</span>
                </div>

                <div className={`shortcut-radio-circle ${isSelected ? 'checked' : ''}`}>
                  {isSelected && <i className="fa-solid fa-check"></i>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer with Reset Defaults and Done button */}
        <div className="dock-modal-footer">
          <button
            type="button"
            className="dock-reset-btn"
            onClick={handleResetDefaults}
          >
            Reset Defaults
          </button>

          <button
            type="button"
            className="dock-done-btn"
            onClick={handleDone}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
