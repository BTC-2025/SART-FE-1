'use client';

import React, { useState, useEffect } from 'react';
import PublicDriverRegistrationModal from './community/PublicDriverRegistrationModal';
import PublicUnionDirectory from './community/PublicUnionDirectory';
import FleetDashboard, { FleetVehicleItem } from './community/FleetDashboard';
import { PublicUnionMember, INITIAL_UNION_MEMBERS } from './community/unionMembersData';

const ROAD_COMMUNITY = [
  {
    title: 'Road Unions & Stands',
    vehicles: [
      { id: 'com-auto', name: 'Auto Stand Union', icon: 'fa-taxi', color: '#f59e0b', price: 500 },
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

  // Login / Authentication State
  const [isPrivateLoggedIn, setIsPrivateLoggedIn] = useState(false);
  const [isPublicLoggedIn, setIsPublicLoggedIn] = useState(false);
  const [privateUser, setPrivateUser] = useState<{ company: string; email: string; phone: string; role: string } | null>(null);
  const [publicUser, setPublicUser] = useState<{ driverName: string; unionName: string; badgeNo: string; phone: string } | null>(null);

  // Private Login Form Inputs
  const [pEmail, setPEmail] = useState('');
  const [pPassword, setPPassword] = useState('');
  const [pCompany, setPCompany] = useState('');
  const [pLoginMode, setPLoginMode] = useState<'signin' | 'register'>('signin');
  const [pError, setPError] = useState('');

  // Public (Driver/Union) Login Form Inputs
  const [uPhone, setUPhone] = useState('');
  const [uOtp, setUOtp] = useState('');
  const [uDriverName, setUDriverName] = useState('');
  const [uBadge, setUBadge] = useState('');
  const [uUnionSelect, setUUnionSelect] = useState('Auto Stand Union');
  const [uLoginMode, setULoginMode] = useState<'signin' | 'register'>('signin');
  const [uOtpSent, setUOtpSent] = useState(false);
  const [uError, setUError] = useState('');

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
  const [unionChat, setUnionChat] = useState<{ name: string, msg: string, time: string, isSelf: boolean }[]>([
    { name: 'Admin (Ramesh)', msg: 'Welcome to the Union! Drive safely.', time: '09:00 AM', isSelf: false },
    { name: 'Karthik (Auto TN-11)', msg: 'Heavy traffic near Mount Road signal.', time: '10:02 AM', isSelf: false },
    { name: 'Siva (Auto TN-09)', msg: 'Any pickups available at Central Station?', time: '10:05 AM', isSelf: false }
  ]);
  const [unionQueue, setUnionQueue] = useState<{ id: string, name: string, v: string, status: string, isSelf: boolean }[]>([
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

  // Private Fleet State with Real Commercial Models, Purpose, Driver Rostering & Telematics
  // Public Union Members State (loaded with 7 realistic online members + dynamically registered members)
  const [unionMembers, setUnionMembers] = useState<PublicUnionMember[]>(INITIAL_UNION_MEMBERS);
  const [showDriverRegistrationModal, setShowDriverRegistrationModal] = useState(false);
  const [publicActiveView, setPublicActiveView] = useState<'directory' | 'unionHub'>('directory');

  // Private Fleet State with Real Commercial Models, Destinations, Health/Damage & Driver Order Requests
  const [fleetCategoryFilter, setFleetCategoryFilter] = useState('ALL');
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

  const [drivers, setDrivers] = useState([
    { id: 'd1', name: 'Ramesh Kumar', phone: '9876543210', status: 'Assigned', dutyState: 'On Duty', shift: 'Morning Shift (06:00 AM - 02:00 PM)', currentVeh: 'TN-01-AB-1234', experience: '8 yrs', license: 'HMV-TN01-9821' },
    { id: 'd2', name: 'Suresh Babu', phone: '8765432109', status: 'Assigned', dutyState: 'On Duty', shift: 'Afternoon Shift (02:00 PM - 10:00 PM)', currentVeh: 'TN-02-XY-9876', experience: '5 yrs', license: 'HMV-TN02-4412' },
    { id: 'd3', name: 'Karthik M', phone: '7654321098', status: 'Assigned', dutyState: 'On Duty', shift: 'Early Shift (05:00 AM - 01:00 PM)', currentVeh: 'TN-11-EF-7788', experience: '6 yrs', license: 'HMV-TN11-3091' },
    { id: 'd4', name: 'Muthu Kumar', phone: '6543210987', status: 'Assigned', dutyState: 'Standby', shift: 'Standard Shift (08:00 AM - 05:00 PM)', currentVeh: 'TN-09-CD-3321', experience: '11 yrs', license: 'HMV-TN09-8819' },
    { id: 'd5', name: 'Arun Vijay', phone: '5432109876', status: 'Assigned', dutyState: 'Resting', shift: 'General Shift (10:00 AM - 06:00 PM)', currentVeh: 'TN-22-GH-4455', experience: '3 yrs', license: 'LMV-TN22-5501' },
    { id: 'd6', name: 'Siva Prakash (Backup Driver)', phone: '9443210987', status: 'Available', dutyState: 'Available', shift: 'Ready for Quick Deployment (Standby)', currentVeh: 'None', experience: '7 yrs', license: 'HMV-TN04-7123' },
    { id: 'd7', name: 'Dinesh Balan', phone: '9345678901', status: 'Available', dutyState: 'On Leave', shift: 'Medical Leave Approved', currentVeh: 'None', experience: '4 yrs', license: 'HMV-TN14-2204' },
  ]);

  // Form State for Modals & Quick Issue Reassignment
  const [newVehReg, setNewVehReg] = useState('');
  const [newVehMake, setNewVehMake] = useState('Tata Signa 4825.TK');
  const [newVehCat, setNewVehCat] = useState('Commercial Truck / Carrier');
  const [newVehPurpose, setNewVehPurpose] = useState('Heavy Cargo Haulage');

  const [newDrName, setNewDrName] = useState('');
  const [newDrEmail, setNewDrEmail] = useState('');
  const [newDrPhone, setNewDrPhone] = useState('');
  const [newDrShift, setNewDrShift] = useState('08:00 AM - 04:00 PM');
  const [newDrDutyState, setNewDrDutyState] = useState<'Available' | 'On Duty' | 'On Leave'>('Available');

  const [allocVeh, setAllocVeh] = useState('');
  const [allocDr, setAllocDr] = useState('');
  const [allocShift, setAllocShift] = useState('');
  const [reportIssueText, setReportIssueText] = useState('');

  // Selected driver for detail inspection / shift alteration
  const [inspectDriver, setInspectDriver] = useState<any>(null);

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
      try {
        const nativePushState = Object.getPrototypeOf(window.history).pushState;
        nativePushState.call(window.history, null, '', path);
      } catch (e) {
        window.history.pushState(null, '', path);
      }
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
    if (!pickup || !vehReg) {
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

        {/* Tab Navigation & User Status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', background: '#ffffff', padding: '0 24px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex' }}>
            <button
              onClick={() => setActiveMainTab('private')}
              style={{
                padding: '16px 20px',
                border: 'none',
                background: 'transparent',
                fontSize: '15px',
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
              {isPrivateLoggedIn && (
                <span style={{ fontSize: '10px', background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '10px', fontWeight: 800 }}>
                  Active
                </span>
              )}
            </button>
            <button
              onClick={() => { setActiveMainTab('public'); setStep(1); }}
              style={{
                padding: '16px 20px',
                border: 'none',
                background: 'transparent',
                fontSize: '15px',
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
              {isPublicLoggedIn && (
                <span style={{ fontSize: '10px', background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '10px', fontWeight: 800 }}>
                  Active
                </span>
              )}
            </button>
          </div>

          {/* Current Session Indicator */}
          {activeMainTab === 'private' && isPrivateLoggedIn && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ede9fe', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                  <i className="fa-solid fa-user-tie"></i>
                </div>
                <div>
                  <span style={{ fontWeight: 800, color: '#1e293b' }}>{privateUser?.company}</span>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>{privateUser?.role}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsPrivateLoggedIn(false);
                  setPrivateUser(null);
                }}
                style={{ padding: '5px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#ef4444', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                title="Logout from Fleet Owner portal"
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout
              </button>
            </div>
          )}

          {activeMainTab === 'public' && isPublicLoggedIn && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#dcfce7', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                  <i className="fa-solid fa-id-card"></i>
                </div>
                <div>
                  <span style={{ fontWeight: 800, color: '#1e293b' }}>{publicUser?.driverName}</span>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>{publicUser?.badgeNo} • {publicUser?.unionName}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsPublicLoggedIn(false);
                  setPublicUser(null);
                  setJoinedUnion(null);
                }}
                style={{ padding: '5px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#ef4444', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                title="Logout from Union portal"
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout
              </button>
            </div>
          )}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

          {/* ================= PRIVATE COMMUNITY LOGIN GATE ================= */}
          {activeMainTab === 'private' && !isPrivateLoggedIn && (
            <div className="fade-in" style={{ maxWidth: '480px', margin: '20px auto', background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 40px -15px rgba(139, 92, 246, 0.12)' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px', boxShadow: '0 8px 16px rgba(139, 92, 246, 0.2)' }}>
                  <i className="fa-solid fa-building-user"></i>
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                  {pLoginMode === 'signin' ? 'Fleet Owner Portal Login' : 'Register New Fleet Business'}
                </h2>
                <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
                  {pLoginMode === 'signin'
                    ? 'Enter your fleet manager credentials to access live vehicles, rosters & trips.'
                    : 'Create your private fleet account to manage operations and driver allocations.'}
                </p>
              </div>

              {pError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '10px 14px', color: '#b91c1c', fontSize: '12.5px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa-solid fa-circle-exclamation"></i> {pError}
                </div>
              )}

              <form onSubmit={(e) => {
                e.preventDefault();
                if (!pEmail || !pPassword) {
                  setPError('Please enter both Email / Corporate ID and Password.');
                  return;
                }
                setPError('');
                setIsPrivateLoggedIn(true);
                setPrivateUser({
                  company: pCompany.trim() || 'LogiTrans National Fleet',
                  email: pEmail.trim(),
                  phone: '+91 98401 23456',
                  role: 'Operations Director'
                });
              }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {pLoginMode === 'register' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                      Company / Fleet Business Name *
                    </label>
                    <input
                      type="text"
                      value={pCompany}
                      onChange={(e) => setPCompany(e.target.value)}
                      placeholder="e.g. SRM Transports, VRL Logistics"
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '14px', fontWeight: 600, color: '#0f172a', outline: 'none' }}
                      required
                    />
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                    Corporate Email / Fleet ID *
                  </label>
                  <input
                    type="text"
                    value={pEmail}
                    onChange={(e) => { setPEmail(e.target.value); setPError(''); }}
                    placeholder="fleet.ops@transport.com or FLEET-982"
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '14px', fontWeight: 600, color: '#0f172a', outline: 'none' }}
                    required
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155' }}>
                      Password *
                    </label>
                    {pLoginMode === 'signin' && (
                      <span
                        onClick={() => alert('Password reset instructions sent to registered corporate email.')}
                        style={{ fontSize: '11.5px', color: '#8b5cf6', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Forgot Password?
                      </span>
                    )}
                  </div>
                  <input
                    type="password"
                    value={pPassword}
                    onChange={(e) => { setPPassword(e.target.value); setPError(''); }}
                    placeholder="Enter account password"
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '14px', fontWeight: 600, color: '#0f172a', outline: 'none' }}
                    required
                  />
                </div>

                {/* Quick Demo Fill button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setPEmail('fleet.owner@sartlogistics.com');
                      setPPassword('sart1234');
                      setPCompany('SART Mega Transports');
                      setPError('');
                    }}
                    style={{ background: 'transparent', border: 'none', color: '#8b5cf6', fontSize: '11.5px', fontWeight: 800, cursor: 'pointer', padding: 0 }}
                  >
                    ⚡ Fill Demo Credentials
                  </button>
                </div>

                <button
                  type="submit"
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#8b5cf6', color: '#ffffff', fontSize: '15px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 16px -4px rgba(139, 92, 246, 0.4)', transition: 'all 0.15s ease' }}
                >
                  <i className="fa-solid fa-lock" style={{ marginRight: '8px' }}></i>
                  {pLoginMode === 'signin' ? 'Sign In to Fleet Dashboard' : 'Complete Registration & Access'}
                </button>
              </form>

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
                {pLoginMode === 'signin' ? (
                  <span>
                    New fleet operator?{' '}
                    <strong
                      onClick={() => { setPLoginMode('register'); setPError(''); }}
                      style={{ color: '#8b5cf6', cursor: 'pointer' }}
                    >
                      Create Account
                    </strong>
                  </span>
                ) : (
                  <span>
                    Already registered?{' '}
                    <strong
                      onClick={() => { setPLoginMode('signin'); setPError(''); }}
                      style={{ color: '#8b5cf6', cursor: 'pointer' }}
                    >
                      Sign In here
                    </strong>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ================= PRIVATE COMMUNITY LOGGED-IN DASHBOARD ================= */}
          {activeMainTab === 'private' && isPrivateLoggedIn && (
            <div className="fade-in">
              <FleetDashboard
                fleet={fleet}
                onUpdateFleet={(updated) => setFleet(updated)}
                onOpenAddDriver={() => setShowDriverRegistrationModal(true)}
                onOpenAddVehicle={() => setShowAddVehicleModal(true)}
              />
            </div>
          )}

          {/* ================= PUBLIC (UNIONS & STANDS) MODULE ================= */}
          {activeMainTab === 'public' && (
            <div className="fade-in">
              {/* Public Top Sub-Navigation: Customer Directory vs Union Internal Operations */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                  padding: '12px 18px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setPublicActiveView('directory')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      border: '1px solid ' + (publicActiveView === 'directory' ? '#10b981' : '#cbd5e1'),
                      background: publicActiveView === 'directory' ? '#10b981' : '#ffffff',
                      color: publicActiveView === 'directory' ? '#ffffff' : '#334155',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: publicActiveView === 'directory' ? '0 4px 10px rgba(16, 185, 129, 0.25)' : 'none'
                    }}
                  >
                    <i className="fa-solid fa-address-book"></i> Verified Driver Directory (Public / Customer View)
                  </button>

                  <button
                    onClick={() => setPublicActiveView('unionHub')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      border: '1px solid ' + (publicActiveView === 'unionHub' ? '#0f172a' : '#cbd5e1'),
                      background: publicActiveView === 'unionHub' ? '#0f172a' : '#ffffff',
                      color: publicActiveView === 'unionHub' ? '#ffffff' : '#334155',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <i className="fa-solid fa-tower-broadcast"></i> Union Internal Hub & Queue
                    {isPublicLoggedIn && (
                      <span style={{ fontSize: '10px', background: '#22c55e', color: '#ffffff', padding: '1px 6px', borderRadius: '10px' }}>
                        ACTIVE
                      </span>
                    )}
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {!isPublicLoggedIn ? (
                    <button
                      onClick={() => setPublicActiveView('unionHub')}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #10b981',
                        background: '#f0fdf4',
                        color: '#047857',
                        fontWeight: 800,
                        fontSize: '12.5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <i className="fa-solid fa-right-to-bracket"></i> Returning Driver Login (Mobile Only)
                    </button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>
                        👤 {publicUser?.driverName} ({publicUser?.phone})
                      </span>
                      <button
                        onClick={() => {
                          setIsPublicLoggedIn(false);
                          setPublicUser(null);
                          setJoinedUnion(null);
                        }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: '1px solid #fecaca',
                          background: '#fef2f2',
                          color: '#dc2626',
                          fontWeight: 700,
                          fontSize: '11.5px',
                          cursor: 'pointer'
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => setShowDriverRegistrationModal(true)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <i className="fa-solid fa-user-plus"></i> Register as Driver (4 Steps)
                  </button>
                </div>
              </div>

              {/* 1. PUBLIC DIRECTORY FOR CUSTOMERS: View driver details, verified badge, live stand, call now */}
              {publicActiveView === 'directory' && (
                <PublicUnionDirectory
                  members={unionMembers}
                  onOpenRegisterModal={() => setShowDriverRegistrationModal(true)}
                  onCallDriver={(member) => {
                    window.location.href = 'tel:' + member.mobile;
                  }}
                />
              )}

              {/* 2. UNION INTERNAL HUB: Sign In with Phone Only for returning drivers */}
              {publicActiveView === 'unionHub' && !isPublicLoggedIn && (
                <div className="fade-in" style={{ maxWidth: '480px', margin: '20px auto', background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 40px -15px rgba(16, 185, 129, 0.12)' }}>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)' }}>
                      <i className="fa-solid fa-mobile-screen-button"></i>
                    </div>
                    <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                      Returning Driver Login
                    </h2>
                    <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
                      Already registered? Login using <strong>only your mobile number</strong> and OTP. No need to fill all 4 steps again!
                    </p>
                  </div>

                  {uError && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '10px 14px', color: '#b91c1c', fontSize: '12.5px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="fa-solid fa-circle-exclamation"></i> {uError}
                    </div>
                  )}

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!uPhone) {
                      setUError('Please enter your registered mobile number.');
                      return;
                    }
                    if (!uOtp) {
                      setUError('Please enter the 4-digit OTP (Demo: 4819).');
                      return;
                    }

                    // Search existing registered members list
                    const cleanPhone = uPhone.replace(/\D/g, '');
                    const matchedMember = unionMembers.find(m => {
                      const mClean = m.mobile.replace(/\D/g, '');
                      return mClean.includes(cleanPhone.slice(-10)) || cleanPhone.includes(mClean.slice(-10));
                    });

                    setUError('');
                    setIsPublicLoggedIn(true);
                    setPublicUser({
                      driverName: matchedMember ? matchedMember.fullName : 'Rajesh Kumar Sharma',
                      badgeNo: matchedMember ? matchedMember.badgeNumber : 'ADWA-TN-7721',
                      unionName: matchedMember ? matchedMember.unionName : 'Heavy Truckers Association',
                      phone: uPhone
                    });
                    setJoinedUnion({
                      id: 'com-truck',
                      name: matchedMember ? matchedMember.unionName : 'Heavy Truckers Association',
                      icon: 'fa-truck-front',
                      color: '#8b5cf6',
                      price: 299
                    });
                  }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                        Registered Mobile Number *
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="tel"
                          value={uPhone}
                          onChange={(e) => { setUPhone(e.target.value); setUError(''); }}
                          placeholder="+91 98765 43210"
                          style={{ flex: 1, padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '14px', fontWeight: 700, color: '#0f172a', outline: 'none' }}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!uPhone) {
                              setUError('Please enter phone number first.');
                              return;
                            }
                            setUOtpSent(true);
                            setUOtp('4819');
                            setUError('');
                          }}
                          style={{ padding: '11px 14px', borderRadius: '10px', border: 'none', background: '#e0f2fe', color: '#0284c7', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}
                        >
                          {uOtpSent ? 'Resend OTP' : 'Send OTP'}
                        </button>
                      </div>
                    </div>

                    {uOtpSent && (
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                          4-Digit Verification Code (OTP) *
                        </label>
                        <input
                          type="text"
                          maxLength={4}
                          value={uOtp}
                          onChange={(e) => { setUOtp(e.target.value); setUError(''); }}
                          placeholder="e.g. 4819"
                          style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '18px', fontWeight: 900, color: '#0f172a', letterSpacing: '6px', textAlign: 'center', outline: 'none' }}
                          required
                        />
                        <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700, display: 'block', marginTop: '4px' }}>
                          <i className="fa-solid fa-check"></i> Demo OTP auto-filled: 4819
                        </span>
                      </div>
                    )}

                    {/* Quick Demo Fill button */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Select online driver:</span>
                      <button
                        type="button"
                        onClick={() => {
                          const demo = unionMembers[0];
                          setUPhone(demo.mobile);
                          setUOtpSent(true);
                          setUOtp('4819');
                          setUError('');
                        }}
                        style={{ background: 'transparent', border: 'none', color: '#10b981', fontSize: '11.5px', fontWeight: 800, cursor: 'pointer', padding: 0 }}
                      >
                        ⚡ Fill {unionMembers[0].fullName} ({unionMembers[0].mobile})
                      </button>
                    </div>

                    <button
                      type="submit"
                      style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#10b981', color: '#ffffff', fontSize: '15px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 16px -4px rgba(16, 185, 129, 0.4)', transition: 'all 0.15s ease' }}
                    >
                      <i className="fa-solid fa-right-to-bracket" style={{ marginRight: '8px' }}></i>
                      Verify & Open Union Portal
                    </button>
                  </form>

                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
                    New driver without registration?{' '}
                    <strong
                      onClick={() => setShowDriverRegistrationModal(true)}
                      style={{ color: '#10b981', cursor: 'pointer' }}
                    >
                      Register Now (4 Steps)
                    </strong>
                  </div>
                </div>
              )}

              {/* 3. LOGGED-IN UNION PORTAL FOR DRIVER: Live Queue, Radar, and Radio Comms */}
              {publicActiveView === 'unionHub' && isPublicLoggedIn && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', background: 'linear-gradient(135deg, #111827, #374151)', padding: '24px', borderRadius: '16px', color: '#ffffff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                        <i className="fa-solid fa-truck-front"></i>
                      </div>
                      <div>
                        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800' }}>{publicUser?.unionName || 'All Driver Welfare Association Union'}</h2>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '13.5px', color: '#9ca3af' }}>
                          <span><i className="fa-solid fa-id-badge" style={{ color: '#10b981' }}></i> Badge: {publicUser?.badgeNo}</span>
                          <span>•</span>
                          <span style={{ color: '#10b981', fontWeight: '700' }}>● Active Duty</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsPublicLoggedIn(false);
                        setPublicUser(null);
                        setJoinedUnion(null);
                      }}
                      style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#ffffff', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}
                    >
                      <i className="fa-solid fa-arrow-right-from-bracket" style={{ marginRight: '6px' }}></i> Log Out
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
                          <div style={{ position: 'absolute', bottom: '16px', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Scanning for passenger pickups in stand zone...</div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Comms / SOS */}
                    <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', height: '530px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ padding: '16px 20px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#111827' }}><i className="fa-solid fa-walkie-talkie" style={{ color: '#8b5cf6', marginRight: '8px' }}></i> Comms Channel</h3>
                          <button onClick={() => alert('🚨 Emergency SOS alert broadcast to all 150 members in this union zone!')} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}><i className="fa-solid fa-triangle-exclamation"></i> Send SOS</button>
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
                            if (e.key === 'Enter' && chatInput) {
                              setUnionChat([...unionChat, { name: 'You (' + (publicUser?.driverName || 'Driver') + ')', msg: chatInput, time: 'Just now', isSelf: true }]);
                              setChatInput('');
                            }
                          }} placeholder="Broadcast message to union peers..." style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid #d1d5db', background: '#f9fafb', outline: 'none', fontSize: '14px' }} />
                          <button onClick={() => {
                            if (chatInput) {
                              setUnionChat([...unionChat, { name: 'You (' + (publicUser?.driverName || 'Driver') + ')', msg: chatInput, time: 'Just now', isSelf: true }]);
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
          )}

        </div>
      </div>
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
              <select value={newVehMake} onChange={e => setNewVehMake(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', fontSize: '14.5px', color: '#111827', outline: 'none', fontWeight: 600 }}>
                <option value="Tata Signa 4825.TK Tipper">Tata Signa 4825.TK (Tipper - Construction)</option>
                <option value="Tata Prima 5530.S Trailer">Tata Prima 5530.S (Heavy Multi-Axle Haulage)</option>
                <option value="Tata Ultra T.7 Electric LCV">Tata Ultra T.7 (Electric / Cold Chain Cargo)</option>
                <option value="Tata Ace Gold Petrol Plus">Tata Ace Gold (Last Mile Mini Truck)</option>
                <option value="Ashok Leyland 2820 Heavy Duty">Ashok Leyland 2820 (Industrial Haulage)</option>
                <option value="Mahindra Blazo X 35">Mahindra Blazo X 35 (Agriculture & Freight)</option>
                <option value="BharatBenz 3528C Tipper">BharatBenz 3528C (Mining & Heavy Duty)</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#4b5563', marginBottom: '6px' }}>Vehicle Category</label>
              <select value={newVehCat} onChange={e => setNewVehCat(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', fontSize: '14.5px', color: '#111827', outline: 'none' }}>
                <option>Commercial Truck / Carrier</option>
                <option>Car / Sedan (Taxi)</option>
                <option>Bus / Minivan</option>
                <option>Two-Wheeler</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#4b5563', marginBottom: '6px' }}>Operational Working Purpose</label>
              <input type="text" value={newVehPurpose} onChange={e => setNewVehPurpose(e.target.value)} placeholder="e.g. Bulk Cement Transit, Inter-State Logistics, Mining" style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', fontSize: '14px', color: '#111827', outline: 'none' }} />
            </div>

            <button onClick={() => {
              if (!newVehReg || !newVehMake) return alert("Please fill all details!");
              const nv: FleetVehicleItem = {
                id: 'v' + Date.now(),
                reg: newVehReg,
                make: newVehMake,
                manufacturer: newVehMake.startsWith('Tata') ? 'Tata Motors' : newVehMake.startsWith('Ashok') ? 'Ashok Leyland' : 'Commercial OEM',
                cat: newVehCat,
                purpose: newVehPurpose || 'General Commercial Freight',
                driver: 'Unassigned',
                driverPhone: 'Unassigned',
                driverStatus: 'Unassigned',
                shiftTime: 'Standard: 08:00 AM - 05:00 PM',
                dutyHours: '0 hrs',
                status: 'Idle',
                health: 'Normal',
                issue: null,
                loc: 'Depot Yard',
                destination: 'Awaiting Next Dispatch Order',
                eta: 'Standing by at Depot',
                color: '#9ca3af',
                incomingOrderMessage: null
              };
              setFleet([...fleet, nv]);
              setNewVehReg('');
              setShowAddVehicleModal(false);
            }} style={{ width: '100%', padding: '14px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>
              Save Vehicle to Fleet
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
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#4b5563', marginBottom: '6px' }}>Driver Full Name</label>
              <input type="text" value={newDrName} onChange={e => setNewDrName(e.target.value)} placeholder="e.g. Siva Kumar" style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', fontSize: '15px', color: '#111827', outline: 'none' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#4b5563', marginBottom: '6px' }}>Phone Number (Mobile for SMS/Alerts)</label>
              <input type="text" value={newDrPhone} onChange={e => setNewDrPhone(e.target.value)} placeholder="e.g. 9876543210" style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', fontSize: '15px', color: '#111827', outline: 'none' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#4b5563', marginBottom: '6px' }}>Allocated Duty Shift</label>
              <input type="text" value={newDrShift} onChange={e => setNewDrShift(e.target.value)} placeholder="e.g. Morning Shift (06:00 AM - 02:00 PM)" style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', fontSize: '14px', color: '#111827', outline: 'none' }} />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#4b5563', marginBottom: '6px' }}>Initial Duty State</label>
              <select value={newDrDutyState} onChange={e => setNewDrDutyState(e.target.value as any)} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', fontSize: '14px', color: '#111827', outline: 'none' }}>
                <option value="Available">Available (Standby Roster)</option>
                <option value="On Duty">On Duty</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>

            <button onClick={() => {
              if (!newDrName || !newDrPhone) return alert("Please fill driver name & phone!");
              const nd = {
                id: 'd' + Date.now(),
                name: newDrName,
                phone: newDrPhone,
                status: 'Available',
                dutyState: newDrDutyState,
                shift: newDrShift,
                currentVeh: 'None',
                experience: '5 yrs',
                license: 'HMV-NEW-' + Math.floor(1000 + Math.random() * 9000)
              };
              setDrivers([...drivers, nd]);
              setNewDrName(''); setNewDrPhone('');
              setShowAddDriverModal(false);
            }} style={{ width: '100%', padding: '14px', background: '#111827', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>
              Add to Active Roster
            </button>
          </div>
        </div>
      )}

      {showAllocateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={(e) => { e.stopPropagation(); setShowAllocateModal(false); }}>
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '20px', width: '90%', maxWidth: '480px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '19px', fontWeight: '800', color: '#111827' }}>
                <i className="fa-solid fa-user-plus" style={{ color: '#8b5cf6', marginRight: '8px' }}></i>
                Allocate / Reassign Driver Work
              </h3>
              <button onClick={() => setShowAllocateModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}><i className="fa-solid fa-xmark"></i></button>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#4b5563', marginBottom: '6px' }}>Select Target Vehicle</label>
              <select value={allocVeh} onChange={e => setAllocVeh(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', fontSize: '14px', color: '#111827', outline: 'none', fontWeight: 600 }}>
                <option value="">Choose a Vehicle...</option>
                {fleet.map(v => (
                  <option key={v.id} value={v.id}>{v.reg} • {v.make} ({v.status})</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#4b5563', marginBottom: '6px' }}>Assign Available Driver (Standby or Alternative)</label>
              <select value={allocDr} onChange={e => setAllocDr(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', fontSize: '14px', color: '#111827', outline: 'none' }}>
                <option value="">Select from Available Drivers...</option>
                {drivers.filter(d => d.dutyState !== 'On Leave').map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.dutyState} - {d.shift})</option>
                ))}
                <option value="UNASSIGN">-- Remove Current Driver / Set Idle --</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#4b5563', marginBottom: '6px' }}>Shift Hours / Trip Reassignment Notes</label>
              <input type="text" value={allocShift} onChange={e => setAllocShift(e.target.value)} placeholder="e.g. Taking over due to engine heat alert - Morning Shift" style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', fontSize: '14px', color: '#111827', outline: 'none' }} />
            </div>

            <button onClick={() => {
              if (!allocVeh || !allocDr) return alert("Select both vehicle and driver!");

              setFleet(fleet.map(v => {
                if (v.id === allocVeh) {
                  const driverObj = drivers.find(d => d.id === allocDr);
                  const driverName = allocDr === 'UNASSIGN' ? 'Unassigned' : driverObj?.name || 'Unknown';
                  return {
                    ...v,
                    driver: driverName,
                    status: allocDr === 'UNASSIGN' ? 'Idle' : 'On Duty',
                    color: allocDr === 'UNASSIGN' ? '#9ca3af' : '#10b981',
                    shiftTime: allocShift || v.shiftTime,
                    // If reassigned, clear breakdown
                    health: 'Normal',
                    issue: null
                  };
                }
                return v;
              }));

              if (allocDr !== 'UNASSIGN') {
                setDrivers(drivers.map(d => d.id === allocDr ? { ...d, status: 'Assigned', dutyState: 'On Duty', currentVeh: fleet.find(f => f.id === allocVeh)?.reg || 'Assigned' } : d));
              }

              setShowAllocateModal(false);
              setAllocVeh(''); setAllocDr(''); setAllocShift('');
              alert("Driver successfully reassigned and operational status updated!");
            }} style={{ width: '100%', padding: '14px', background: '#8b5cf6', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)' }}>
              Confirm Allocation & Clear Issue
            </button>
          </div>
        </div>
      )}

      {showManageVehicleModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={(e) => { e.stopPropagation(); setShowManageVehicleModal(false); }}>
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '20px', width: '90%', maxWidth: '460px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '19px', fontWeight: '800', color: '#111827' }}><i className="fa-solid fa-gear" style={{ color: '#4b5563', marginRight: '8px' }}></i> Vehicle Health & Telematics</h3>
              <button onClick={() => setShowManageVehicleModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}><i className="fa-solid fa-xmark"></i></button>
            </div>

            {(() => {
              const currentV = fleet.find(v => v.id === manageVehId);
              if (!currentV) return null;
              return (
                <div>
                  <div style={{ marginBottom: '16px', padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>{currentV.reg}</div>
                    <div style={{ fontSize: '13px', color: '#0284c7', fontWeight: 700 }}>{currentV.make}</div>
                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>
                      <strong>Purpose:</strong> {currentV.purpose}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                      <strong>Driver:</strong> {currentV.driver} ({currentV.shiftTime})
                    </div>
                  </div>

                  {/* Active Issue Status */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                      Report Issue or Breakdown (Owner Alert):
                    </label>
                    <input
                      type="text"
                      defaultValue={currentV.issue || ''}
                      placeholder="e.g. Engine Overheating, Clutch Plate issue, Tire Puncture"
                      onChange={(e) => setReportIssueText(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>Update Operational Status</label>
                    <select onChange={(e) => {
                      const newStatus = e.target.value as FleetVehicleItem['status'];
                      let color = '#9ca3af';
                      if (newStatus === 'On Duty') color = '#10b981';
                      if (newStatus === 'Resting') color = '#f59e0b';
                      if (newStatus === 'Needs Maint.') color = '#ef4444';

                      setFleet(fleet.map(v => v.id === manageVehId ? {
                        ...v,
                        status: newStatus,
                        color,
                        health: newStatus === 'Needs Maint.' ? 'Breakdown' : 'Normal',
                        issue: newStatus === 'Needs Maint.' ? (reportIssueText || 'Mechanical Inspection Required') : null
                      } : v));
                    }} defaultValue={currentV.status} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '14px', color: '#111827', outline: 'none' }}>
                      <option value="On Duty">On Duty (Active Route)</option>
                      <option value="Idle">Idle (Available at Depot)</option>
                      <option value="Resting">Resting (Driver Break)</option>
                      <option value="Needs Maint.">Needs Maint. (Vehicle Issue / Breakdown)</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                    <button onClick={() => {
                      setAllocVeh(manageVehId);
                      setShowManageVehicleModal(false);
                      setShowAllocateModal(true);
                    }} style={{ flex: 1, padding: '11px', background: '#8b5cf6', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                      <i className="fa-solid fa-user-plus"></i> Reassign to Other Driver
                    </button>
                    <button onClick={() => {
                      alert(`Assistance request dispatched for ${currentV.reg} to nearest Highway Recovery & Authorized Workshop!`);
                    }} style={{ flex: 1, padding: '11px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                      <i className="fa-solid fa-wrench"></i> Roadside Support
                    </button>
                  </div>

                  <button onClick={() => {
                    setShowManageVehicleModal(false);
                  }} style={{ width: '100%', padding: '12px', background: '#f1f5f9', color: '#334155', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '800', cursor: 'pointer' }}>
                    Done
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

    
      {/* 4-Step ADWA Driver Registration Modal with Fee Breakdown */}
      <PublicDriverRegistrationModal
        isOpen={showDriverRegistrationModal}
        onClose={() => setShowDriverRegistrationModal(false)}
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
          setPublicActiveView('directory');
          alert('🎉 Congratulations ' + newMember.fullName + '! Your ADWA Driver Registration was successful. Your profile and digital card are now live in the Public Directory.');
        }}
      />
  </div>
  );
}
