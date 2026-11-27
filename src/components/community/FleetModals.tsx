'use client';

import React, { useState } from 'react';
import { FleetVehicleItem } from './FleetDashboard';

export interface DriverItem {
  id: string;
  name: string;
  phone: string;
  status: string;
  dutyState: string;
  shift: string;
  currentVeh: string;
  experience: string;
  license: string;
}

// 1. Add Vehicle Modal
export function AddVehicleModal({
  isOpen,
  onClose,
  onAddVehicle
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddVehicle: (v: FleetVehicleItem) => void;
}) {
  const [newVehReg, setNewVehReg] = useState('');
  const [newVehMake, setNewVehMake] = useState('Tata Signa 4825.TK Tipper');
  const [newVehCat, setNewVehCat] = useState('Commercial Truck / Carrier');
  const [newVehPurpose, setNewVehPurpose] = useState('Heavy Cargo Haulage');

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '20px', width: '90%', maxWidth: '450px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#111827' }}><i className="fa-solid fa-truck-medical" style={{ color: '#10b981', marginRight: '8px' }}></i> Add New Vehicle</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}><i className="fa-solid fa-xmark"></i></button>
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
          <input type="text" value={newVehPurpose} onChange={e => setNewVehPurpose(e.target.value)} placeholder="e.g. Bulk Cement Transit, Inter-State Logistics" style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', fontSize: '14px', color: '#111827', outline: 'none' }} />
        </div>

        <button onClick={() => {
          if (!newVehReg || !newVehMake) return alert("Please fill all vehicle details!");
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
          onAddVehicle(nv);
          setNewVehReg('');
          onClose();
        }} style={{ width: '100%', padding: '14px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>
          Save Vehicle to Fleet
        </button>
      </div>
    </div>
  );
}

// 2. Add Driver Modal
export function AddDriverModal({
  isOpen,
  onClose,
  onAddDriver
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddDriver: (d: DriverItem) => void;
}) {
  const [newDrName, setNewDrName] = useState('');
  const [newDrPhone, setNewDrPhone] = useState('');
  const [newDrShift, setNewDrShift] = useState('08:00 AM - 04:00 PM');
  const [newDrDutyState, setNewDrDutyState] = useState<'Available' | 'On Duty' | 'On Leave'>('Available');

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '20px', width: '90%', maxWidth: '450px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#111827' }}><i className="fa-solid fa-id-badge" style={{ color: '#f59e0b', marginRight: '8px' }}></i> Add New Driver</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}><i className="fa-solid fa-xmark"></i></button>
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
          const nd: DriverItem = {
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
          onAddDriver(nd);
          setNewDrName(''); setNewDrPhone('');
          onClose();
        }} style={{ width: '100%', padding: '14px', background: '#111827', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>
          Add to Active Roster
        </button>
      </div>
    </div>
  );
}

// 3. Allocate Driver Work Modal
export function AllocateDriverModal({
  isOpen,
  onClose,
  fleet,
  drivers,
  onConfirmAllocation
}: {
  isOpen: boolean;
  onClose: () => void;
  fleet: FleetVehicleItem[];
  drivers: DriverItem[];
  onConfirmAllocation: (vehId: string, drId: string, shift: string) => void;
}) {
  const [allocVeh, setAllocVeh] = useState('');
  const [allocDr, setAllocDr] = useState('');
  const [allocShift, setAllocShift] = useState('');

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '20px', width: '90%', maxWidth: '480px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '19px', fontWeight: '800', color: '#111827' }}>
            <i className="fa-solid fa-user-plus" style={{ color: '#8b5cf6', marginRight: '8px' }}></i>
            Allocate / Reassign Driver Work
          </h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}><i className="fa-solid fa-xmark"></i></button>
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
          <input type="text" value={allocShift} onChange={e => setAllocShift(e.target.value)} placeholder="e.g. Taking over due to engine heat alert" style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', fontSize: '14px', color: '#111827', outline: 'none' }} />
        </div>

        <button onClick={() => {
          if (!allocVeh || !allocDr) return alert("Select both vehicle and driver!");
          onConfirmAllocation(allocVeh, allocDr, allocShift);
          onClose();
        }} style={{ width: '100%', padding: '14px', background: '#8b5cf6', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)' }}>
          Confirm Allocation & Clear Issue
        </button>
      </div>
    </div>
  );
}

// 4. Manage Vehicle Health & Telematics Modal
export function ManageVehicleModal({
  isOpen,
  onClose,
  vehicle,
  onUpdateStatus,
  onOpenReassign
}: {
  isOpen: boolean;
  onClose: () => void;
  vehicle: FleetVehicleItem | null;
  onUpdateStatus: (vehId: string, status: FleetVehicleItem['status'], issueText: string) => void;
  onOpenReassign: (vehId: string) => void;
}) {
  const [reportIssueText, setReportIssueText] = useState('');

  if (!isOpen || !vehicle) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '20px', width: '90%', maxWidth: '460px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '19px', fontWeight: '800', color: '#111827' }}><i className="fa-solid fa-gear" style={{ color: '#4b5563', marginRight: '8px' }}></i> Vehicle Health & Telematics</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}><i className="fa-solid fa-xmark"></i></button>
        </div>

        <div style={{ marginBottom: '16px', padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>{vehicle.reg}</div>
          <div style={{ fontSize: '13px', color: '#0284c7', fontWeight: 700 }}>{vehicle.make}</div>
          <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>
            <strong>Purpose:</strong> {vehicle.purpose}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            <strong>Driver:</strong> {vehicle.driver} ({vehicle.shiftTime})
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
            Report Issue or Breakdown (Owner Alert):
          </label>
          <input
            type="text"
            defaultValue={vehicle.issue || ''}
            placeholder="e.g. Engine Overheating, Clutch Plate issue"
            onChange={(e) => setReportIssueText(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>Update Operational Status</label>
          <select onChange={(e) => {
            const newStatus = e.target.value as FleetVehicleItem['status'];
            onUpdateStatus(vehicle.id, newStatus, reportIssueText);
          }} defaultValue={vehicle.status} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '14px', color: '#111827', outline: 'none' }}>
            <option value="On Duty">On Duty (Active Route)</option>
            <option value="Idle">Idle (Available at Depot)</option>
            <option value="Resting">Resting (Driver Break)</option>
            <option value="Needs Maint.">Needs Maint. (Vehicle Issue / Breakdown)</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <button onClick={() => {
            onOpenReassign(vehicle.id);
            onClose();
          }} style={{ flex: 1, padding: '11px', background: '#8b5cf6', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
            <i className="fa-solid fa-user-plus"></i> Reassign Driver
          </button>
          <button onClick={() => {
            alert(`Assistance request dispatched for ${vehicle.reg} to nearest Highway Recovery Workshop!`);
          }} style={{ flex: 1, padding: '11px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
            <i className="fa-solid fa-wrench"></i> Roadside Support
          </button>
        </div>

        <button onClick={onClose} style={{ width: '100%', padding: '12px', background: '#f1f5f9', color: '#334155', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '800', cursor: 'pointer' }}>
          Done
        </button>
      </div>
    </div>
  );
}
