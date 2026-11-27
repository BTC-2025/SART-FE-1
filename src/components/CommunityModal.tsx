'use client';

import React, { useState, useEffect } from 'react';
import { ALL_TRANSPORT_UNIONS, TransportUnionInfo } from './community/transportUnionsData';
import PublicUnionsOverview from './community/PublicUnionsOverview';
import UnionStandHub from './community/UnionStandHub';
import PrivateFleetLogin from './community/PrivateFleetLogin';
import FleetDashboard, { FleetVehicleItem } from './community/FleetDashboard';
import {
  AddVehicleModal,
  AddDriverModal,
  AllocateDriverModal,
  ManageVehicleModal,
  DriverItem
} from './community/FleetModals';
import PublicDriverRegistrationModal from './community/PublicDriverRegistrationModal';
import { PublicUnionMember, INITIAL_UNION_MEMBERS } from './community/unionMembersData';

export default function CommunityModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeMainTab, setActiveMainTab] = useState<'private' | 'public'>('public');

  // Public Community State
  const [unionCategoryFilter, setUnionCategoryFilter] = useState<'ALL' | 'ROAD' | 'SEA' | 'AIR' | 'RAIL'>('ROAD');
  const [unionsList, setUnionsList] = useState<TransportUnionInfo[]>(ALL_TRANSPORT_UNIONS);
  const [selectedUnion, setSelectedUnion] = useState<TransportUnionInfo | null>(null);
  const [unionSubView, setUnionSubView] = useState<'directory' | 'hub'>('directory');

  const handleUpdateUnionStand = (unionId: string, newStand: string, allStands: string[]) => {
    setUnionsList(prev => prev.map(u => {
      if (u.id === unionId) {
        return {
          ...u,
          defaultStand: newStand,
          stands: allStands,
          standsCount: allStands.length
        };
      }
      return u;
    }));
    setSelectedUnion(prev => {
      if (prev && prev.id === unionId) {
        return {
          ...prev,
          defaultStand: newStand,
          stands: allStands,
          standsCount: allStands.length
        };
      }
      return prev;
    });
  };

  // Session State
  const [isPrivateLoggedIn, setIsPrivateLoggedIn] = useState(false);
  const [isPublicLoggedIn, setIsPublicLoggedIn] = useState(false);
  const [privateUser, setPrivateUser] = useState<{ company: string; email: string; phone: string; role: string } | null>(null);
  const [publicUser, setPublicUser] = useState<{ driverName: string; unionName: string; badgeNo: string; phone: string } | null>(null);

  // Modals Visibility
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [showManageVehicleModal, setShowManageVehicleModal] = useState(false);
  const [manageVehId, setManageVehId] = useState('');
  const [showDriverRegistrationModal, setShowDriverRegistrationModal] = useState(false);

  // Public Union Members
  const [unionMembers, setUnionMembers] = useState<PublicUnionMember[]>(INITIAL_UNION_MEMBERS);

  // Private Fleet State
  const [fleet, setFleet] = useState<FleetVehicleItem[]>([
    {
      id: 'v1',
      reg: 'TN-01-AB-1234',
      make: 'Tata Signa 4825.TK Tipper',
      manufacturer: 'Tata Motors',
      cat: 'Commercial Truck / Carrier',
      purpose: 'Heavy Construction Aggregate & Sand Haulage',
      driver: 'Ramesh Kumar',
      driverPhone: '+91 98765 43210',
      driverStatus: 'On Duty',
      shiftTime: '06:00 AM - 02:00 PM',
      dutyHours: '6.5 hrs today',
      status: 'On Duty',
      health: 'Normal',
      issue: null,
      loc: 'Chennai - Bangalore Hwy (NH48, KM 42)',
      destination: 'Peenya Industrial Estate, Bengaluru',
      eta: 'Today by 06:30 PM',
      color: '#10b981',
      incomingOrderMessage: null
    },
    {
      id: 'v2',
      reg: 'TN-02-XY-9876',
      make: 'Tata Prima 5530.S Tractor-Trailer',
      manufacturer: 'Tata Motors',
      cat: 'Commercial Truck / Carrier',
      purpose: 'Interstate Multi-Axle Container Freight (Port to Warehouse)',
      driver: 'Suresh Babu',
      driverPhone: '+91 87654 32109',
      driverStatus: 'On Duty',
      shiftTime: '02:00 PM - 10:00 PM',
      dutyHours: '2.0 hrs today',
      status: 'On Duty',
      health: 'Minor Issue',
      issue: 'Engine Coolant Temp High (102°C - Halting at Service Bay)',
      loc: 'Vellore Checkpost Toll Plaza',
      destination: 'Whitefield Inland Depot, Bengaluru',
      eta: 'Tonight by 11:00 PM',
      color: '#f59e0b',
      incomingOrderMessage: 'Reaching Whitefield tonight. Please schedule return container load from Bengaluru to Chennai.'
    },
    {
      id: 'v3',
      reg: 'TN-04-KL-5566',
      make: 'Tata Ultra T.7 Electric / LCV',
      manufacturer: 'Tata Motors',
      cat: 'Commercial Truck / Carrier',
      purpose: 'Urban Cold Chain Dairy & FMCG Delivery',
      driver: 'Unassigned',
      driverPhone: 'Unassigned',
      driverStatus: 'Unassigned',
      shiftTime: 'Scheduled: 08:00 AM - 04:00 PM',
      dutyHours: '0 hrs',
      status: 'Idle',
      health: 'Normal',
      issue: null,
      loc: 'Chennai Central Logistics Hub (Depot 3)',
      destination: 'Guindy Industrial Estate, Chennai',
      eta: 'Ready in Depot Yard',
      color: '#9ca3af',
      incomingOrderMessage: null
    },
    {
      id: 'v4',
      reg: 'TN-09-CD-3321',
      make: 'Ashok Leyland 2820 Heavy Duty 6x2',
      manufacturer: 'Ashok Leyland',
      cat: 'Commercial Truck / Carrier',
      purpose: 'Cement & Steel Rods Industrial Transport',
      driver: 'Muthu Kumar',
      driverPhone: '+91 65432 10987',
      driverStatus: 'On Duty',
      shiftTime: '08:00 AM - 05:00 PM',
      dutyHours: '4.5 hrs today',
      status: 'Needs Maint.',
      health: 'Breakdown',
      issue: 'Brake Air Valve Leakage Reported (Assistance Dispatched)',
      loc: 'Sriperumbudur Industrial Corridor (Lane 2)',
      destination: 'Ranipet SIPCOT Industrial Complex',
      eta: 'Delayed by 2.5 hrs for roadside repair',
      color: '#ef4444',
      incomingOrderMessage: null
    },
    {
      id: 'v5',
      reg: 'TN-11-EF-7788',
      make: 'Mahindra Blazo X 35 Haulage Truck',
      manufacturer: 'Mahindra Trucks',
      cat: 'Commercial Truck / Carrier',
      purpose: 'Agricultural Produce & Grain Transit to Wholesale Mandi',
      driver: 'Karthik M',
      driverPhone: '+91 76543 21098',
      driverStatus: 'On Duty',
      shiftTime: '05:00 AM - 01:00 PM',
      dutyHours: '7.0 hrs today',
      status: 'Completed',
      health: 'Normal',
      issue: null,
      loc: 'Koyambedu Wholesale Terminal, Chennai',
      destination: 'Delivery Completed at Mandi Gate 4',
      eta: 'Trip Finished - Unloaded Safely',
      color: '#0284c7',
      incomingOrderMessage: 'Goods completely delivered to wholesale dealer. I am available for immediate next trip assignment.'
    },
    {
      id: 'v6',
      reg: 'TN-22-GH-4455',
      make: 'Tata Ace Gold Petrol Plus (Chota Hathi)',
      manufacturer: 'Tata Motors',
      cat: 'Commercial Truck / Carrier',
      purpose: 'Last-Mile E-Commerce Parcel & Express Delivery',
      driver: 'Arun Vijay',
      driverPhone: '+91 54321 09876',
      driverStatus: 'Resting',
      shiftTime: '10:00 AM - 06:00 PM (Break)',
      dutyHours: '3.5 hrs today',
      status: 'Resting',
      health: 'Normal',
      issue: null,
      loc: 'T. Nagar Express Delivery Station',
      destination: 'Adyar Express Sorting Center',
      eta: 'Resuming at 03:00 PM',
      color: '#f59e0b',
      incomingOrderMessage: null
    }
  ]);

  const [drivers, setDrivers] = useState<DriverItem[]>([
    { id: 'd1', name: 'Ramesh Kumar', phone: '9876543210', status: 'Assigned', dutyState: 'On Duty', shift: 'Morning Shift (06:00 AM - 02:00 PM)', currentVeh: 'TN-01-AB-1234', experience: '8 yrs', license: 'HMV-TN01-9821' },
    { id: 'd2', name: 'Suresh Babu', phone: '8765432109', status: 'Assigned', dutyState: 'On Duty', shift: 'Afternoon Shift (02:00 PM - 10:00 PM)', currentVeh: 'TN-02-XY-9876', experience: '5 yrs', license: 'HMV-TN02-4412' },
    { id: 'd3', name: 'Karthik M', phone: '7654321098', status: 'Assigned', dutyState: 'On Duty', shift: 'Early Shift (05:00 AM - 01:00 PM)', currentVeh: 'TN-11-EF-7788', experience: '6 yrs', license: 'HMV-TN11-3091' },
    { id: 'd4', name: 'Muthu Kumar', phone: '6543210987', status: 'Assigned', dutyState: 'Standby', shift: 'Standard Shift (08:00 AM - 05:00 PM)', currentVeh: 'TN-09-CD-3321', experience: '11 yrs', license: 'HMV-TN09-8819' },
    { id: 'd5', name: 'Arun Vijay', phone: '5432109876', status: 'Assigned', dutyState: 'Resting', shift: 'General Shift (10:00 AM - 06:00 PM)', currentVeh: 'TN-22-GH-4455', experience: '3 yrs', license: 'LMV-TN22-5501' },
    { id: 'd6', name: 'Siva Prakash (Backup Driver)', phone: '9443210987', status: 'Available', dutyState: 'Available', shift: 'Ready for Quick Deployment ', currentVeh: 'None', experience: '7 yrs', license: 'HMV-TN04-7123' },
    { id: 'd7', name: 'Dinesh Balan', phone: '9345678901', status: 'Available', dutyState: 'On Leave', shift: 'Medical Leave Approved', currentVeh: 'None', experience: '4 yrs', license: 'HMV-TN14-2204' }
  ]);

  useEffect(() => {
    const handleUrlState = () => {
      const path = window.location.pathname;
      if (path.includes('-join')) {
        setActiveMainTab('public');
      }
    };

    if (isOpen) {
      handleUrlState();
    }

    window.addEventListener('popstate', handleUrlState);
    return () => {
      window.removeEventListener('popstate', handleUrlState);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setSelectedUnion(null);
    onClose();
  };

  const filteredUnions = unionCategoryFilter === 'ALL'
    ? unionsList
    : unionsList.filter(u => u.category === unionCategoryFilter);

  return (
    <div className="sart-modal-backdrop" style={{ display: 'flex', zIndex: 1000, background: 'rgba(0,0,0,0.65)' }} onClick={handleClose}>
      <div
        className="modal-sheet centered-modal"
        style={{
          maxWidth: '1060px',
          width: '95%',
          height: '92vh',
          display: 'flex',
          backgroundColor: '#f8fafc',
          borderRadius: '24px',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ede9fe', color: '#2A1373', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
              <i className="fa-solid fa-users"></i>
            </div>
            <span>SART Communities & Stand Directory</span>
          </div>

          <button
            onClick={handleClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              color: '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '15px'
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Tab Navigation & Status Pill */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', background: '#ffffff', padding: '0 24px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveMainTab('private')}
              style={{
                padding: '16px 20px',
                border: 'none',
                background: 'transparent',
                fontSize: '14.5px',
                fontWeight: '700',
                color: activeMainTab === 'private' ? '#8b5cf6' : '#64748b',
                borderBottom: activeMainTab === 'private' ? '3px solid #8b5cf6' : '3px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <i className="fa-solid fa-building-user"></i> Private (Fleet Owners)
              {isPrivateLoggedIn && (
                <span style={{ fontSize: '10px', background: '#ede9fe', color: '#7c3aed', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>
                  Active
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveMainTab('public')}
              style={{
                padding: '16px 20px',
                border: 'none',
                background: 'transparent',
                fontSize: '14.5px',
                fontWeight: '700',
                color: activeMainTab === 'public' ? '#2A1373' : '#64748b',
                borderBottom: activeMainTab === 'public' ? '3px solid #2A1373' : '3px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <i className="fa-solid fa-people-group"></i> Public (Unions & Stands)
              {isPublicLoggedIn && (
                <span style={{ fontSize: '10px', background: '#ede9fe', color: '#2A1373', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>
                  Active
                </span>
              )}
            </button>
          </div>

          {/* Top Right Status - Shown only when user is logged in */}
          <div>
            {activeMainTab === 'public' && isPublicLoggedIn && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ede9fe', color: '#2A1373', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
                    <i className="fa-solid fa-id-card"></i>
                  </div>
                  <div>
                    <span style={{ fontWeight: 800, color: '#0f172a' }}>{publicUser?.driverName}</span>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>{publicUser?.badgeNo} • {publicUser?.unionName}</span>
                  </div>
                </div>
                <button
                  onClick={() => { setIsPublicLoggedIn(false); setPublicUser(null); }}
                  style={{ padding: '5px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#ffffff', color: '#dc2626', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout
                </button>
              </div>
            )}

            {activeMainTab === 'private' && isPrivateLoggedIn && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
                    <i className="fa-solid fa-user-tie"></i>
                  </div>
                  <div>
                    <span style={{ fontWeight: 800, color: '#0f172a' }}>{privateUser?.company}</span>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>{privateUser?.role}</span>
                  </div>
                </div>
                <button
                  onClick={() => { setIsPrivateLoggedIn(false); setPrivateUser(null); }}
                  style={{ padding: '5px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#ffffff', color: '#dc2626', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

          {/* TAB 1: PUBLIC UNIONS & STANDS */}
          {activeMainTab === 'public' && (
            <div className="fade-in">
              {!selectedUnion ? (
                <PublicUnionsOverview
                  unions={filteredUnions}
                  categoryFilter={unionCategoryFilter}
                  onCategoryFilterChange={(cat) => setUnionCategoryFilter(cat)}
                  onSelectUnion={(u) => {
                    setSelectedUnion(u);
                    setUnionSubView('directory');
                  }}
                />
              ) : (
                <UnionStandHub
                  union={selectedUnion}
                  onBack={() => setSelectedUnion(null)}
                  subView={unionSubView}
                  onSetSubView={(v) => setUnionSubView(v)}
                  unionMembers={unionMembers}
                  isPublicLoggedIn={isPublicLoggedIn}
                  publicUser={publicUser}
                  onLoginSuccess={(user) => {
                    setIsPublicLoggedIn(true);
                    setPublicUser(user);
                  }}
                  onOpenRegisterModal={() => setShowDriverRegistrationModal(true)}
                  onUpdateUnionStand={handleUpdateUnionStand}
                  onDeleteDriver={(id) => setUnionMembers(prev => prev.filter(m => m.id !== id))}
                  onLogout={() => {
                    setIsPublicLoggedIn(false);
                    setPublicUser(null);
                  }}
                />
              )}
            </div>
          )}

          {/* TAB 2: PRIVATE FLEET OWNERS */}
          {activeMainTab === 'private' && (
            <div className="fade-in">
              {!isPrivateLoggedIn ? (
                <PrivateFleetLogin
                  onLoginSuccess={(user) => {
                    setIsPrivateLoggedIn(true);
                    setPrivateUser(user);
                  }}
                />
              ) : (
                <FleetDashboard
                  fleet={fleet}
                  onUpdateFleet={(updated) => setFleet(updated)}
                  onOpenAddDriver={() => setShowAddDriverModal(true)}
                  onOpenAddVehicle={() => setShowAddVehicleModal(true)}
                />
              )}
            </div>
          )}

        </div>

        {/* ALL MODALS (FLEET MANAGEMENT & ADWA DRIVER REGISTRATION) */}
        <AddVehicleModal
          isOpen={showAddVehicleModal}
          onClose={() => setShowAddVehicleModal(false)}
          onAddVehicle={(nv) => setFleet([...fleet, nv])}
        />

        <AddDriverModal
          isOpen={showAddDriverModal}
          onClose={() => setShowAddDriverModal(false)}
          onAddDriver={(nd) => setDrivers([...drivers, nd])}
        />

        <AllocateDriverModal
          isOpen={showAllocateModal}
          onClose={() => setShowAllocateModal(false)}
          fleet={fleet}
          drivers={drivers}
          onConfirmAllocation={(vehId, drId, shift) => {
            setFleet(fleet.map(v => {
              if (v.id === vehId) {
                const driverObj = drivers.find(d => d.id === drId);
                const driverName = drId === 'UNASSIGN' ? 'Unassigned' : driverObj?.name || 'Unknown';
                return {
                  ...v,
                  driver: driverName,
                  status: drId === 'UNASSIGN' ? 'Idle' : 'On Duty',
                  color: drId === 'UNASSIGN' ? '#9ca3af' : '#10b981',
                  shiftTime: shift || v.shiftTime,
                  health: 'Normal',
                  issue: null
                };
              }
              return v;
            }));

            if (drId !== 'UNASSIGN') {
              setDrivers(drivers.map(d => d.id === drId ? { ...d, status: 'Assigned', dutyState: 'On Duty', currentVeh: fleet.find(f => f.id === vehId)?.reg || 'Assigned' } : d));
            }
            alert("Driver successfully reassigned and operational status updated!");
          }}
        />

        <ManageVehicleModal
          isOpen={showManageVehicleModal}
          onClose={() => setShowManageVehicleModal(false)}
          vehicle={fleet.find(v => v.id === manageVehId) || null}
          onUpdateStatus={(vehId, status, issueText) => {
            let color = '#9ca3af';
            if (status === 'On Duty') color = '#10b981';
            if (status === 'Resting') color = '#f59e0b';
            if (status === 'Needs Maint.') color = '#ef4444';

            setFleet(fleet.map(v => v.id === vehId ? {
              ...v,
              status,
              color,
              health: status === 'Needs Maint.' ? 'Breakdown' : 'Normal',
              issue: status === 'Needs Maint.' ? (issueText || 'Mechanical Inspection Required') : null
            } : v));
          }}
          onOpenReassign={() => setShowAllocateModal(true)}
        />

        <PublicDriverRegistrationModal
          isOpen={showDriverRegistrationModal}
          onClose={() => setShowDriverRegistrationModal(false)}
          defaultUnionName={selectedUnion ? (selectedUnion.associatedUnionName || selectedUnion.name) : 'Auto Stand Union'}
          onRegisterSuccess={(newMember) => {
            setUnionMembers(prev => [newMember, ...prev]);
            setShowDriverRegistrationModal(false);
            setIsPublicLoggedIn(true);
            setPublicUser({
              driverName: newMember.fullName,
              badgeNo: newMember.badgeNumber,
              unionName: newMember.unionName,
              phone: newMember.mobile
            });
            alert('🎉 Congratulations ' + newMember.fullName + '! Your ADWA Driver Registration was successful with Mobile +91 ' + newMember.mobile + '. Your profile is now registered and you can log in with this number anytime.');
          }}
        />

      </div>
    </div>
  );
}
