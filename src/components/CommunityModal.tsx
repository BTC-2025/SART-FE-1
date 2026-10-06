'use client';

import React, { useState, useEffect } from 'react';

const ROAD_COMMUNITY = [
  {
    title: 'Road Unions & Stands',
    vehicles: [
      { id: 'com-auto', name: 'Auto-Rickshaw Stand Union', icon: 'fa-taxi', color: '#f59e0b', price: 500 },
      { id: 'com-taxi', name: 'City Taxi Drivers Union', icon: 'fa-car', color: '#3b82f6', price: 1000 },
      { id: 'com-truck', name: 'Heavy Truckers Association', icon: 'fa-truck-front', color: '#8b5cf6', price: 2500 },
      { id: 'com-bus', name: 'Private Bus Owners Club', icon: 'fa-bus', color: '#10b981', price: 5000 },
    ]
  }
];

const SEA_COMMUNITY = [
  {
    title: 'Marine Clubs & Port Unions',
    vehicles: [
      { id: 'com-fisher', name: 'Fishermen Coastal Union', icon: 'fa-fish', color: '#0ea5e9', price: 200 },
      { id: 'com-yacht', name: 'Elite Yacht Owners Club', icon: 'fa-sailboat', color: '#db2777', price: 15000 },
      { id: 'com-ferry', name: 'Ferry Captains Syndicate', icon: 'fa-ferry', color: '#4f46e5', price: 3000 },
    ]
  }
];

const AIR_COMMUNITY = [
  {
    title: 'Aviation Associations',
    vehicles: [
      { id: 'com-drone', name: 'Commercial Drone Pilots', icon: 'fa-helicopter-symbol', color: '#f97316', price: 800 },
      { id: 'com-pilot', name: 'Charter Pilots Association', icon: 'fa-plane', color: '#3b82f6', price: 8000 },
      { id: 'com-heli', name: 'Helicopter Operators Club', icon: 'fa-helicopter', color: '#10b981', price: 5000 },
    ]
  }
];

const RAIL_COMMUNITY = [
  {
    title: 'Rail Worker Unions',
    vehicles: [
      { id: 'com-train', name: 'Locomotive Engineers Union', icon: 'fa-train', color: '#8b5cf6', price: 2000 },
      { id: 'com-metro', name: 'Urban Metro Workers', icon: 'fa-train-subway', color: '#ec4899', price: 1500 },
    ]
  }
];

const ALL_COMMUNITIES = [
  ...ROAD_COMMUNITY.map(c => c.vehicles).flat(),
  ...SEA_COMMUNITY.map(c => c.vehicles).flat(),
  ...AIR_COMMUNITY.map(c => c.vehicles).flat(),
  ...RAIL_COMMUNITY.map(c => c.vehicles).flat()
];

export default function CommunityModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [activeMainTab, setActiveMainTab] = useState<'private' | 'public'>('private');
  
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedVehicle, setSelectedVehicle] = useState('com-auto');

  useEffect(() => {
    const handleUrlState = () => {
      const path = window.location.pathname;
      if (path.includes('-join')) {
        setStep(2);
        const parts = path.split('/');
        const last = parts[parts.length - 1];
        const name = decodeURIComponent(last.replace('-join', ''));
        const found = ALL_COMMUNITIES.find(v => v.name.startsWith(name));
        if (found) setSelectedVehicle(found.id);
      } else if (path === '/home/community') {
        setStep(1);
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

  const [activeCategory, setActiveCategory] = useState<'ALL' | 'ROAD' | 'SEA' | 'AIR' | 'RAIL'>('ALL');
  const [pickup, setPickup] = useState('');
  const [date, setDate] = useState('');
  const [vehReg, setVehReg] = useState('');
  
  // Active Union Dashboard State
  const [joinedUnion, setJoinedUnion] = useState<any>(null);
  const [chatInput, setChatInput] = useState('');
  const [unionChat, setUnionChat] = useState<{name: string, msg: string, time: string, isSelf: boolean}[]>([
    { name: 'Admin (Ramesh)', msg: 'Welcome to the Union! Drive safely.', time: '09:00 AM', isSelf: false },
    { name: 'Karthik (Auto TN-11)', msg: 'Heavy traffic near Mount Road signal.', time: '10:02 AM', isSelf: false },
    { name: 'Siva (Auto TN-09)', msg: 'Any pickups available at Central Station?', time: '10:05 AM', isSelf: false }
  ]);
  const [unionQueue, setUnionQueue] = useState<{id: string, name: string, v: string, status: string, isSelf: boolean}[]>([
    { id: 'q1', name: 'Kumar', v: 'TN-01-AB-1234', status: 'Next in Queue', isSelf: false },
    { id: 'q2', name: 'Suresh', v: 'TN-05-CD-5678', status: 'Waiting', isSelf: false },
    { id: 'q3', name: 'You', v: 'TN-01-XX-9999', status: 'Waiting (Rank #3)', isSelf: true },
    { id: 'q4', name: 'Muthu', v: 'TN-22-EZ-1111', status: 'On Trip', isSelf: false }
  ]);

  // Modals for Private
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [showManageVehicleModal, setShowManageVehicleModal] = useState(false);
  const [manageVehId, setManageVehId] = useState('');

  // Private Fleet State
  const [fleetCategoryFilter, setFleetCategoryFilter] = useState('ALL');
  const [fleet, setFleet] = useState([
    { id: 'v1', reg: 'TN-01-AB-1234', make: 'Ashok Leyland', cat: 'Commercial Truck / Carrier', driver: 'Ramesh Kumar', status: 'On Duty', loc: 'Chennai - Bangalore Hwy', color: '#10b981' },
    { id: 'v2', reg: 'TN-02-XY-9876', make: 'Tata Signa', cat: 'Commercial Truck / Carrier', driver: 'Suresh Babu', status: 'Resting', loc: 'Vellore Checkpost', color: '#f59e0b' },
    { id: 'v3', reg: 'TN-04-KL-5566', make: 'Mahindra Blazo', cat: 'Commercial Truck / Carrier', driver: 'Unassigned', status: 'Idle', loc: 'Chennai Hub', color: '#9ca3af' },
    { id: 'v4', reg: 'TN-09-CD-3321', make: 'Toyota Innova', cat: 'Car / Sedan (Taxi)', driver: 'Muthu Kumar', status: 'On Duty', loc: 'Airport Terminal 2', color: '#10b981' },
  ]);

  const [drivers, setDrivers] = useState([
    { id: 'd1', name: 'Ramesh Kumar', phone: '9876543210', status: 'Assigned' },
    { id: 'd2', name: 'Suresh Babu', phone: '8765432109', status: 'Assigned' },
    { id: 'd3', name: 'Karthik M', phone: '7654321098', status: 'Available' },
    { id: 'd4', name: 'Muthu Kumar', phone: '6543210987', status: 'Assigned' },
    { id: 'd5', name: 'Arun Vijay', phone: '5432109876', status: 'Available' },
  ]);

  // Form State for Modals
  const [newVehReg, setNewVehReg] = useState('');
  const [newVehMake, setNewVehMake] = useState('');
  const [newVehCat, setNewVehCat] = useState('Commercial Truck / Carrier');

  const [newDrName, setNewDrName] = useState('');
  const [newDrEmail, setNewDrEmail] = useState('');
  const [newDrPhone, setNewDrPhone] = useState('');

  const [allocVeh, setAllocVeh] = useState('');
  const [allocDr, setAllocDr] = useState('');
  const [allocShift, setAllocShift] = useState('');

  React.useEffect(() => {
    const handleReset = () => {
      setStep(1);
    };
    window.addEventListener('resetModalSteps', handleReset);
    return () => window.removeEventListener('resetModalSteps', handleReset);
  }, []);

  if (!isOpen) return null;

  const updateUrl = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
    }
  };

  const handleSelectVehicle = (vehicle: any) => {
    setSelectedVehicle(vehicle.id);
    setStep(2);
    const cleanName = vehicle.name.split('/')[0].trim();
    updateUrl(`/home/community/${encodeURIComponent(cleanName)}-join`);
  };

  const handleClose = () => {
    setStep(1);
    updateUrl('/');
    onClose();
  };

  const handleJoinUnion = () => {
    if(!pickup || !vehReg) {
      alert("Please enter Stand Area and Vehicle Registration!");
      return;
    }
    
    // Simulate approval and joining
    setUnionQueue(prev => prev.map(q => q.isSelf ? { ...q, v: vehReg } : q));
    setJoinedUnion(selectedVehicleObj);
  };

  const selectedVehicleObj = ALL_COMMUNITIES.find(v => v.id === selectedVehicle);

  const renderGridSection = (title: string, icon: string, data: typeof ROAD_COMMUNITY) => {
    const allVehicles = data.map(c => c.vehicles).flat();
    return (
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: '24px 0 16px 0', paddingBottom: '8px', borderBottom: '2px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className={`fa-solid ${icon}`}></i> {title}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '16px' }}>
            {allVehicles.map(v => (
            <div 
              key={v.id} 
              onClick={() => handleSelectVehicle(v)}
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                padding: '16px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'; }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: v.color + '20', color: v.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '12px' }}>
                <i className={`fa-solid ${v.icon}`}></i>
              </div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937', textAlign: 'center', lineHeight: '1.2' }}>
                {v.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="modal-overlay open" style={{ display: 'flex', zIndex: 1000, background: 'rgba(0,0,0,0.6)' }} onClick={handleClose}>
      <div className="modal-sheet centered-modal" style={{ maxWidth: '1000px', width: '95%', height: '90vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb', borderRadius: '24px', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', background: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#111827', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="fa-solid fa-users" style={{ color: '#8b5cf6' }}></i> SART Communities
          </div>
          <button onClick={handleClose} style={{ background: '#f3f4f6', border: 'none', width: '36px', height: '36px', borderRadius: '50%', color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', background: '#ffffff', padding: '0 24px' }}>
          <button 
            onClick={() => setActiveMainTab('private')}
            style={{ 
              padding: '16px 24px', 
              border: 'none', 
              background: 'transparent', 
              fontSize: '16px', 
              fontWeight: '700', 
              color: activeMainTab === 'private' ? '#8b5cf6' : '#6b7280',
              borderBottom: activeMainTab === 'private' ? '3px solid #8b5cf6' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <i className="fa-solid fa-building-user"></i> Private (Fleet Owners)
          </button>
          <button 
            onClick={() => { setActiveMainTab('public'); setStep(1); }}
            style={{ 
              padding: '16px 24px', 
              border: 'none', 
              background: 'transparent', 
              fontSize: '16px', 
              fontWeight: '700', 
              color: activeMainTab === 'public' ? '#10b981' : '#6b7280',
              borderBottom: activeMainTab === 'public' ? '3px solid #10b981' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <i className="fa-solid fa-people-group"></i> Public (Unions & Stands)
          </button>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          
          {/* ================= PRIVATE COMMUNITY ================= */}
          {activeMainTab === 'private' && (
            <div className="fade-in">
              <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '800', color: '#1f2937' }}>Fleet Management Hub</h2>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '15px' }}>Track your owned vehicles, manage drivers, and allocate resources efficiently.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setShowAddVehicleModal(true)} style={{ background: '#ffffff', color: '#1f2937', border: '1px solid #d1d5db', padding: '10px 16px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fa-solid fa-truck-medical"></i> Add Vehicle
                  </button>
                  <button onClick={() => setShowAllocateModal(true)} style={{ background: '#8b5cf6', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fa-solid fa-user-plus"></i> Allocate Driver
                  </button>
                </div>
              </div>

              {/* Private Dashboard Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3e8ff', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}><i className="fa-solid fa-truck"></i></div>
                  <div><div style={{ fontSize: '24px', fontWeight: '800', color: '#111827' }}>{fleet.length}</div><div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '600' }}>Total Vehicles</div></div>
                </div>
                <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dcfce7', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}><i className="fa-solid fa-id-card"></i></div>
                  <div><div style={{ fontSize: '24px', fontWeight: '800', color: '#111827' }}>{drivers.length}</div><div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '600' }}>Total Drivers</div></div>
                </div>
                <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0f2fe', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}><i className="fa-solid fa-route"></i></div>
                  <div><div style={{ fontSize: '24px', fontWeight: '800', color: '#111827' }}>{fleet.filter(v => v.status === 'On Duty').length}</div><div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '600' }}>On Duty (Live)</div></div>
                </div>
                <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fce7f3', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}><i className="fa-solid fa-user-check"></i></div>
                  <div><div style={{ fontSize: '24px', fontWeight: '800', color: '#111827' }}>{drivers.filter(d => d.status === 'Available').length}</div><div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '600' }}>Drivers Available</div></div>
                </div>
              </div>

              {/* Category Filter */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
                {['ALL', 'Commercial Truck / Carrier', 'Car / Sedan (Taxi)', 'Bus / Minivan', 'Two-Wheeler'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFleetCategoryFilter(cat)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '700',
                      background: fleetCategoryFilter === cat ? '#111827' : '#f3f4f6',
                      color: fleetCategoryFilter === cat ? '#ffffff' : '#4b5563',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {cat === 'ALL' ? 'All Vehicles' : cat}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#374151', margin: 0 }}>Live Fleet Tracking & Allocation</h3>
                <button onClick={() => setShowAddDriverModal(true)} style={{ background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', padding: '8px 16px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <i className="fa-solid fa-id-badge"></i> Add Driver
                </button>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ background: '#f9fafb' }}>
                    <tr>
                      <th style={{ padding: '16px', fontSize: '13px', color: '#6b7280', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Vehicle</th>
                      <th style={{ padding: '16px', fontSize: '13px', color: '#6b7280', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Category</th>
                      <th style={{ padding: '16px', fontSize: '13px', color: '#6b7280', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Assigned Driver</th>
                      <th style={{ padding: '16px', fontSize: '13px', color: '#6b7280', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                      <th style={{ padding: '16px', fontSize: '13px', color: '#6b7280', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fleet.filter(v => fleetCategoryFilter === 'ALL' || v.cat === fleetCategoryFilter).length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No vehicles found in this category.</td>
                      </tr>
                    ) : (
                      fleet.filter(v => fleetCategoryFilter === 'ALL' || v.cat === fleetCategoryFilter).map((row, idx) => (
                        <tr key={row.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{row.reg}<br/><span style={{fontSize:'12px', color:'#6b7280', fontWeight:'500'}}>{row.make}</span></td>
                          <td style={{ padding: '16px', fontSize: '13px', color: '#4b5563' }}>{row.cat}</td>
                          <td style={{ padding: '16px', fontSize: '14px', color: '#4b5563', fontWeight: row.driver !== 'Unassigned' ? '600' : '400' }}>{row.driver}</td>
                          <td style={{ padding: '16px' }}><span style={{ padding: '4px 10px', borderRadius: '12px', background: row.color+'20', color: row.color, fontSize: '12px', fontWeight: '700' }}>{row.status}</span></td>
                          <td style={{ padding: '16px' }}>
                            <button onClick={() => {
                              setManageVehId(row.id);
                              setShowManageVehicleModal(true);
                            }} style={{ background: '#f3f4f6', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', color: '#374151', fontWeight: '600', fontSize: '12px' }}>Manage <i className="fa-solid fa-arrow-right"></i></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= PUBLIC COMMUNITY ================= */}
          {activeMainTab === 'public' && step === 1 && !joinedUnion && (
            <div className="fade-in">
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '800', color: '#1f2937' }}>Join Unions & Vehicle Stands</h2>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '15px' }}>Register as a driver, join local unions, add your vehicle, and connect with peers.</p>
              </div>

              {/* Category Selector */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
                {[
                  { id: 'ALL', label: 'All Communities', icon: 'fa-globe', color: '#f59e0b' },
                  { id: 'ROAD', label: 'Road', icon: 'fa-car', color: '#3b82f6' },
                  { id: 'SEA', label: 'Sea & Water', icon: 'fa-ship', color: '#0ea5e9' },
                  { id: 'AIR', label: 'Aviation', icon: 'fa-plane', color: '#8b5cf6' },
                  { id: 'RAIL', label: 'Train & Rail', icon: 'fa-train', color: '#10b981' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as any)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px',
                      borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: '700',
                      background: activeCategory === cat.id ? cat.color : '#f3f4f6',
                      color: activeCategory === cat.id ? '#ffffff' : '#4b5563',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <i className={`fa-solid ${cat.icon}`}></i> {cat.label}
                  </button>
                ))}
              </div>

              {/* Render only active category */}
              {activeCategory === 'ALL' && renderGridSection('ALL COMMUNITIES', 'fa-globe', [{ title: 'All', vehicles: ALL_COMMUNITIES }] as any)}
              {activeCategory === 'ROAD' && renderGridSection('ROAD UNIONS', 'fa-car', ROAD_COMMUNITY)}
              {activeCategory === 'SEA' && renderGridSection('MARINE CLUBS', 'fa-ship', SEA_COMMUNITY)}
              {activeCategory === 'AIR' && renderGridSection('AVIATION CLUBS', 'fa-plane', AIR_COMMUNITY)}
              {activeCategory === 'RAIL' && renderGridSection('RAIL UNIONS', 'fa-train', RAIL_COMMUNITY)}
            </div>
          )}

          {activeMainTab === 'public' && step === 2 && !joinedUnion && (
            <div className="fade-in" style={{ padding: '0 8px' }}>
              <button 
                onClick={() => setStep(1)} 
                style={{ background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '15px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 0 24px 0' }}
              >
                <i className="fa-solid fa-arrow-left"></i> Back to Communities
              </button>

              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                {/* Left Column: Union Info */}
                <div style={{ flex: '1 1 300px' }}>
                  {selectedVehicleObj && (
                    <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: selectedVehicleObj.color + '20', color: selectedVehicleObj.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                          <i className={`fa-solid ${selectedVehicleObj.icon}`}></i>
                        </div>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#111827' }}>{selectedVehicleObj.name}</h3>
                          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>Local Independent Union</p>
                        </div>
                      </div>

                      <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <span style={{ fontSize: '14px', color: '#4b5563', fontWeight: '600' }}>Current Members</span>
                          <span style={{ fontSize: '14px', color: '#111827', fontWeight: '800' }}>142 / 150</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <span style={{ fontSize: '14px', color: '#4b5563', fontWeight: '600' }}>Status</span>
                          <span style={{ fontSize: '14px', color: '#10b981', fontWeight: '800' }}>Accepting New Drivers</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '14px', color: '#4b5563', fontWeight: '600' }}>Membership Fee</span>
                          <span style={{ fontSize: '14px', color: '#111827', fontWeight: '800' }}>₹{selectedVehicleObj.price.toLocaleString('en-IN')}<span style={{fontSize: '12px', color: '#6b7280', fontWeight: '500'}}>/yr</span></span>
                        </div>
                      </div>

                      <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '700', color: '#1f2937' }}>Union Benefits</h4>
                      <ul style={{ margin: 0, padding: '0 0 0 20px', color: '#4b5563', fontSize: '14px', lineHeight: '1.6' }}>
                        <li><strong>Exclusive Pickups:</strong> Receive priority ride requests in this stand's jurisdiction.</li>
                        <li><strong>Mutual Support:</strong> Help fellow drivers, share trips, and coordinate during peak hours.</li>
                        <li><strong>SOS & Emergency:</strong> Instant alert broadcasting to all union members.</li>
                        <li><strong>Queue System:</strong> Fair rotation for offline waiting passengers.</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Right Column: Join Form */}
                <div style={{ flex: '1 1 400px' }}>
                  <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px' }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '800', color: '#111827' }}>Application Form</h3>
                    
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#4b5563', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Stand Location / Area</label>
                      <input type="text" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', color: '#111827', fontSize: '15px', outline: 'none' }} placeholder="e.g. Central Railway Station Stand" value={pickup} onChange={e => setPickup(e.target.value)} />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#4b5563', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Vehicle Registration</label>
                      <input type="text" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', color: '#111827', fontSize: '15px', outline: 'none' }} placeholder="e.g. TN-01-AB-1234" value={vehReg} onChange={e => setVehReg(e.target.value)} />
                    </div>
                    
                    <div style={{ marginBottom: '32px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#4b5563', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Preferred Join Date</label>
                      <input type="date" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', color: '#111827', fontSize: '15px', outline: 'none' }} value={date} onChange={e => setDate(e.target.value)} />
                    </div>

                    <button 
                      onClick={handleJoinUnion}
                      style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#8b5cf6', color: '#ffffff', border: 'none', fontSize: '16px', fontWeight: '700', cursor: 'pointer', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#7c3aed'}
                      onMouseLeave={e => e.currentTarget.style.background = '#8b5cf6'}
                    >
                      Submit Application to Union Admin
                    </button>
                    <p style={{ margin: '12px 0 0 0', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
                      The Stand Admin will verify your vehicle details before approval.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= ACTIVE UNION HUB (POST-JOIN) ================= */}
          {activeMainTab === 'public' && joinedUnion && (
            <div className="fade-in" style={{ padding: '0 8px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', background: 'linear-gradient(135deg, #111827, #374151)', padding: '24px', borderRadius: '16px', color: '#ffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                    <i className={`fa-solid ${joinedUnion.icon}`}></i>
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800' }}>{joinedUnion.name}</h2>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '14px', color: '#9ca3af' }}>
                      <span><i className="fa-solid fa-location-dot" style={{ color: '#ef4444' }}></i> {pickup} Stand</span>
                      <span>•</span>
                      <span style={{ color: '#10b981', fontWeight: '600' }}>Active Member</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setJoinedUnion(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#ffffff', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                  Leave Union
                </button>
              </div>

              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                
                {/* Left: Queue & Radar */}
                <div style={{ flex: '1 1 350px' }}>
                  <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#111827' }}><i className="fa-solid fa-list-ol" style={{ color: '#3b82f6', marginRight: '8px' }}></i> Stand Queue</h3>
                      <span style={{ fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '12px', background: '#dcfce7', color: '#10b981' }}>Live</span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {unionQueue.map((q, i) => (
                        <div key={q.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: q.isSelf ? '#f3e8ff' : '#f9fafb', borderRadius: '12px', border: q.isSelf ? '1px solid #c084fc' : '1px solid transparent' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: q.isSelf ? '#8b5cf6' : '#d1d5db', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px' }}>{i + 1}</div>
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>{q.name}</div>
                              <div style={{ fontSize: '12px', color: '#6b7280' }}>{q.v}</div>
                            </div>
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: '600', color: q.status.includes('Waiting') ? '#f59e0b' : '#10b981' }}>{q.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '800', color: '#111827' }}><i className="fa-solid fa-satellite-dish" style={{ color: '#ef4444', marginRight: '8px' }}></i> Radar</h3>
                    <div style={{ height: '150px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                       <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: '1px solid #60a5fa', position: 'absolute', animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }}></div>
                       <i className="fa-solid fa-location-crosshairs" style={{ fontSize: '32px', color: '#3b82f6', zIndex: 10 }}></i>
                       <div style={{ position: 'absolute', bottom: '16px', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Scanning for pickups in {pickup}...</div>
                    </div>
                  </div>
                </div>

                {/* Right: Comms / SOS */}
                <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', height: '530px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ padding: '16px 20px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#111827' }}><i className="fa-solid fa-walkie-talkie" style={{ color: '#8b5cf6', marginRight: '8px' }}></i> Comms Channel</h3>
                      <button style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}><i className="fa-solid fa-triangle-exclamation"></i> Send SOS</button>
                    </div>
                    
                    <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {unionChat.map((c, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: c.isSelf ? 'flex-end' : 'flex-start' }}>
                          <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', padding: '0 4px' }}>{c.name} • {c.time}</div>
                          <div style={{ padding: '10px 16px', background: c.isSelf ? '#8b5cf6' : '#f3f4f6', color: c.isSelf ? '#ffffff' : '#1f2937', borderRadius: '16px', borderBottomRightRadius: c.isSelf ? '4px' : '16px', borderBottomLeftRadius: c.isSelf ? '16px' : '4px', fontSize: '14px', maxWidth: '85%' }}>
                            {c.msg}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ padding: '16px', background: '#ffffff', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '12px' }}>
                      <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => {
                        if(e.key === 'Enter' && chatInput) {
                          setUnionChat([...unionChat, { name: 'You', msg: chatInput, time: 'Just now', isSelf: true }]);
                          setChatInput('');
                        }
                      }} placeholder="Ask for help or updates..." style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid #d1d5db', background: '#f9fafb', outline: 'none', fontSize: '14px' }} />
                      <button onClick={() => {
                        if(chatInput) {
                          setUnionChat([...unionChat, { name: 'You', msg: chatInput, time: 'Just now', isSelf: true }]);
                          setChatInput('');
                        }
                      }} style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#8b5cf6', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa-solid fa-paper-plane"></i></button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

      {/* ================= MODALS FOR PRIVATE FLEET MANAGEMENT ================= */}
      {showAddVehicleModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={(e) => { e.stopPropagation(); setShowAddVehicleModal(false); }}>
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '20px', width: '90%', maxWidth: '450px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#111827' }}><i className="fa-solid fa-truck-medical" style={{ color: '#10b981', marginRight: '8px' }}></i> Add New Vehicle</h3>
              <button onClick={() => setShowAddVehicleModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}><i className="fa-solid fa-xmark"></i></button>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#4b5563', marginBottom: '6px' }}>Vehicle Registration No.</label>
              <input type="text" value={newVehReg} onChange={e => setNewVehReg(e.target.value)} placeholder="e.g. TN-01-AB-1234" style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', fontSize: '15px', color: '#111827', outline: 'none' }} />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#4b5563', marginBottom: '6px' }}>Make & Model</label>
              <input type="text" value={newVehMake} onChange={e => setNewVehMake(e.target.value)} placeholder="e.g. Ashok Leyland 1920" style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', fontSize: '15px', color: '#111827', outline: 'none' }} />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#4b5563', marginBottom: '6px' }}>Vehicle Category</label>
              <select value={newVehCat} onChange={e => setNewVehCat(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', fontSize: '15px', color: '#111827', outline: 'none' }}>
                <option>Commercial Truck / Carrier</option>
                <option>Car / Sedan (Taxi)</option>
                <option>Bus / Minivan</option>
                <option>Two-Wheeler</option>
              </select>
            </div>

            <button onClick={() => {
              if(!newVehReg || !newVehMake) return alert("Please fill all details!");
              const nv = { id: 'v'+Date.now(), reg: newVehReg, make: newVehMake, cat: newVehCat, driver: 'Unassigned', status: 'Idle', loc: 'Depot', color: '#9ca3af' };
              setFleet([...fleet, nv]);
              setNewVehReg(''); setNewVehMake('');
              setShowAddVehicleModal(false);
            }} style={{ width: '100%', padding: '14px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>
              Save Vehicle
            </button>
          </div>
        </div>
      )}

      {showAddDriverModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={(e) => { e.stopPropagation(); setShowAddDriverModal(false); }}>
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '20px', width: '90%', maxWidth: '450px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#111827' }}><i className="fa-solid fa-id-badge" style={{ color: '#f59e0b', marginRight: '8px' }}></i> Add New Driver</h3>
              <button onClick={() => setShowAddDriverModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}><i className="fa-solid fa-xmark"></i></button>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#4b5563', marginBottom: '6px' }}>Driver Name</label>
              <input type="text" value={newDrName} onChange={e => setNewDrName(e.target.value)} placeholder="e.g. Siva Kumar" style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', fontSize: '15px', color: '#111827', outline: 'none' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#4b5563', marginBottom: '6px' }}>Email Address</label>
              <input type="email" value={newDrEmail} onChange={e => setNewDrEmail(e.target.value)} placeholder="e.g. siva@BNXmail.com" style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', fontSize: '15px', color: '#111827', outline: 'none' }} />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#4b5563', marginBottom: '6px' }}>Phone Number</label>
              <input type="text" value={newDrPhone} onChange={e => setNewDrPhone(e.target.value)} placeholder="e.g. 9876543210" style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', fontSize: '15px', color: '#111827', outline: 'none' }} />
            </div>

            <button onClick={() => {
              if(!newDrName || !newDrPhone || !newDrEmail) return alert("Please fill all details!");
              const nd = { id: 'd'+Date.now(), name: newDrName, email: newDrEmail, phone: newDrPhone, status: 'Available' };
              setDrivers([...drivers, nd]);
              setNewDrName(''); setNewDrEmail(''); setNewDrPhone('');
              setShowAddDriverModal(false);
            }} style={{ width: '100%', padding: '14px', background: '#111827', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>
              Add to Roster
            </button>
          </div>
        </div>
      )}

      {showAllocateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={(e) => { e.stopPropagation(); setShowAllocateModal(false); }}>
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '20px', width: '90%', maxWidth: '450px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#111827' }}><i className="fa-solid fa-user-plus" style={{ color: '#8b5cf6', marginRight: '8px' }}></i> Allocate Driver</h3>
              <button onClick={() => setShowAllocateModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}><i className="fa-solid fa-xmark"></i></button>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#4b5563', marginBottom: '6px' }}>Select Vehicle</label>
              <select value={allocVeh} onChange={e => setAllocVeh(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', fontSize: '15px', color: '#111827', outline: 'none' }}>
                <option value="">Choose a Vehicle...</option>
                {fleet.map(v => (
                  <option key={v.id} value={v.id}>{v.reg} ({v.make})</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#4b5563', marginBottom: '6px' }}>Assign Available Driver</label>
              <select value={allocDr} onChange={e => setAllocDr(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', fontSize: '15px', color: '#111827', outline: 'none' }}>
                <option value="">Select from Roster...</option>
                {drivers.filter(d => d.status === 'Available').map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
                <option value="UNASSIGN">-- Unassign Current Driver --</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#4b5563', marginBottom: '6px' }}>Shift Details / Notes</label>
              <input type="text" value={allocShift} onChange={e => setAllocShift(e.target.value)} placeholder="e.g. Night Shift, 8PM to 6AM" style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', fontSize: '15px', color: '#111827', outline: 'none' }} />
            </div>

            <button onClick={() => {
              if(!allocVeh || !allocDr) return alert("Select vehicle and driver!");
              
              setFleet(fleet.map(v => {
                if(v.id === allocVeh) {
                  const driverName = allocDr === 'UNASSIGN' ? 'Unassigned' : drivers.find(d=>d.id===allocDr)?.name || 'Unknown';
                  return { ...v, driver: driverName, status: allocDr === 'UNASSIGN' ? 'Idle' : 'On Duty', color: allocDr === 'UNASSIGN' ? '#9ca3af' : '#10b981' };
                }
                return v;
              }));

              if(allocDr !== 'UNASSIGN') {
                setDrivers(drivers.map(d => d.id === allocDr ? {...d, status: 'Assigned'} : d));
              }

              setShowAllocateModal(false);
              setAllocVeh(''); setAllocDr(''); setAllocShift('');
            }} style={{ width: '100%', padding: '14px', background: '#8b5cf6', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>
              Confirm Allocation
            </button>
          </div>
        </div>
      )}

      {showManageVehicleModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={(e) => { e.stopPropagation(); setShowManageVehicleModal(false); }}>
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '20px', width: '90%', maxWidth: '450px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#111827' }}><i className="fa-solid fa-gear" style={{ color: '#4b5563', marginRight: '8px' }}></i> Manage Vehicle</h3>
              <button onClick={() => setShowManageVehicleModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}><i className="fa-solid fa-xmark"></i></button>
            </div>
            
            <div style={{ marginBottom: '24px', padding: '16px', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>
                {fleet.find(v => v.id === manageVehId)?.reg}
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                {fleet.find(v => v.id === manageVehId)?.make}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#4b5563', marginBottom: '6px' }}>Update Status</label>
              <select onChange={(e) => {
                const newStatus = e.target.value;
                let color = '#9ca3af';
                if(newStatus === 'On Duty') color = '#10b981';
                if(newStatus === 'Resting') color = '#f59e0b';
                if(newStatus === 'Needs Maint.') color = '#ef4444';
                
                setFleet(fleet.map(v => v.id === manageVehId ? { ...v, status: newStatus, color } : v));
              }} defaultValue={fleet.find(v => v.id === manageVehId)?.status} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', fontSize: '15px', color: '#111827', outline: 'none' }}>
                <option value="Idle">Idle</option>
                <option value="On Duty">On Duty</option>
                <option value="Resting">Resting</option>
                <option value="Needs Maint.">Needs Maint.</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
              <button onClick={() => {
                setAllocVeh(manageVehId);
                setShowManageVehicleModal(false);
                setShowAllocateModal(true);
              }} style={{ flex: 1, padding: '12px', background: '#8b5cf6', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                <i className="fa-solid fa-user-plus"></i> Reassign Driver
              </button>
              <button onClick={() => {
                alert("Maintenance Request Submitted!");
              }} style={{ flex: 1, padding: '12px', background: '#fce7f3', color: '#ec4899', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                <i className="fa-solid fa-wrench"></i> Schedule Repair
              </button>
            </div>

            <button onClick={() => {
              setShowManageVehicleModal(false);
            }} style={{ width: '100%', padding: '14px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
