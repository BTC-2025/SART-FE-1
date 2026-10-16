'use client';

import React, { useState } from 'react';

export interface FleetVehicleItem {
  id: string;
  reg: string;
  make: string;
  manufacturer: string;
  cat: string;
  purpose: string;
  driver: string;
  driverPhone: string;
  driverStatus: string;
  shiftTime: string;
  dutyHours: string;
  status: 'On Duty' | 'Idle' | 'Resting' | 'Needs Maint.' | 'Completed';
  health: 'Normal' | 'Minor Issue' | 'Breakdown' | 'Damage Reported';
  issue: string | null;
  loc: string;
  destination: string;
  eta: string;
  color: string;
  incomingOrderMessage?: string | null;
}

interface FleetDashboardProps {
  fleet: FleetVehicleItem[];
  onUpdateFleet: (updatedFleet: FleetVehicleItem[]) => void;
  onOpenAddDriver: () => void;
  onOpenAddVehicle: () => void;
}

export default function FleetDashboard({
  fleet,
  onUpdateFleet,
  onOpenAddDriver,
  onOpenAddVehicle
}: FleetDashboardProps) {
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicleItem | null>(null);

  // Quick dispatch / order schedule modal
  const [scheduleOrderModal, setScheduleOrderModal] = useState<FleetVehicleItem | null>(null);
  const [newOrderCargo, setNewOrderCargo] = useState('Containerized Industrial Components (14 Tonnes)');
  const [newOrderPickup, setNewOrderPickup] = useState('Sriperumbudur Industrial Hub');
  const [newOrderDrop, setNewOrderDrop] = useState('Peenya Industrial Area, Bengaluru');

  // Stats calculation
  const workingCount = fleet.filter(v => v.status === 'On Duty').length;
  const idleCount = fleet.filter(v => v.status === 'Idle').length;
  const completedCount = fleet.filter(v => v.status === 'Completed').length;
  const damageAlertCount = fleet.filter(v => v.health === 'Breakdown' || v.health === 'Damage Reported' || v.issue !== null).length;
  const incomingRequestsCount = fleet.filter(v => !!v.incomingOrderMessage).length;

  const filtered = fleet.filter(v => {
    const matchesCat = filterCategory === 'ALL' || v.cat === filterCategory;
    const matchesStatus = filterStatus === 'ALL' || v.status === filterStatus;
    const matchesSearch =
      v.reg.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.loc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesStatus && matchesSearch;
  });

  const handleAssignNextOrder = (vId: string) => {
    const updated = fleet.map(v => {
      if (v.id === vId) {
        return {
          ...v,
          status: 'On Duty' as const,
          health: 'Normal' as const,
          issue: null,
          loc: `${newOrderPickup} (Loading Gate)`,
          destination: newOrderDrop,
          eta: 'Scheduled: Tomorrow 06:00 AM',
          color: '#10b981',
          incomingOrderMessage: null,
          purpose: newOrderCargo
        };
      }
      return v;
    });

    onUpdateFleet(updated);
    setScheduleOrderModal(null);
    alert(`✅ New order successfully assigned to ${selectedVehicle?.reg || 'Truck'}! Driver notified via WhatsApp and SMS.`);
  };

  const handleMarkDamageResolved = (vId: string) => {
    const updated = fleet.map(v => {
      if (v.id === vId) {
        return {
          ...v,
          health: 'Normal' as const,
          issue: null,
          status: 'Idle' as const,
          color: '#9ca3af'
        };
      }
      return v;
    });
    onUpdateFleet(updated);
    alert(`Inspection cleared. Vehicle marked ready for next trip.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Real-Time Operational Fleet Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
        {/* Working Trucks */}
        <div style={{ background: '#ffffff', padding: '18px 20px', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Active On Road</span>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#16a34a', marginTop: '2px' }}>{workingCount}</div>
            <span style={{ fontSize: '11.5px', color: '#15803d', fontWeight: 700 }}>In Transit & Hauling</span>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
            <i className="fa-solid fa-truck-moving"></i>
          </div>
        </div>

        {/* Completed Trips */}
        <div style={{ background: '#ffffff', padding: '18px 20px', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Completed Deliveries</span>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#0284c7', marginTop: '2px' }}>{completedCount}</div>
            <span style={{ fontSize: '11.5px', color: '#0369a1', fontWeight: 700 }}>Reached Destination</span>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
            <i className="fa-solid fa-flag-checkered"></i>
          </div>
        </div>

        {/* Damage / Issues Alerts */}
        <div style={{ background: '#ffffff', padding: '18px 20px', borderRadius: '18px', border: damageAlertCount > 0 ? '1.5px solid #fca5a5' : '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Damage & Maintenance</span>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#dc2626', marginTop: '2px' }}>{damageAlertCount}</div>
            <span style={{ fontSize: '11.5px', color: damageAlertCount > 0 ? '#b91c1c' : '#64748b', fontWeight: 700 }}>
              {damageAlertCount > 0 ? 'Urgent Attention Needed' : 'All Trucks Healthy'}
            </span>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
            <i className="fa-solid fa-triangle-exclamation"></i>
          </div>
        </div>

        {/* Driver Requests for Next Order */}
        <div style={{ background: '#ffffff', padding: '18px 20px', borderRadius: '18px', border: incomingRequestsCount > 0 ? '1.5px solid #c084fc' : '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Driver Next Load Messages</span>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#7c3aed', marginTop: '2px' }}>{incomingRequestsCount}</div>
            <span style={{ fontSize: '11.5px', color: '#6b21a8', fontWeight: 700 }}>Ready for Reassignment</span>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
            <i className="fa-solid fa-comments"></i>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', background: '#ffffff', padding: '14px 18px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
        <div style={{ flex: '1 1 260px', position: 'relative' }}>
          <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }}></i>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search vehicle number, driver name, make or location..."
            style={{ width: '100%', padding: '10px 14px 10px 36px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#475569' }}>Status:</span>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{ padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', fontWeight: 700, outline: 'none' }}
          >
            <option value="ALL">All Operational Statuses</option>
            <option value="On Duty">On Duty (Working)</option>
            <option value="Completed">Completed Trip</option>
            <option value="Idle">Idle (In Depot)</option>
            <option value="Needs Maint.">Needs Maint. / Damage</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
          <button
            onClick={onOpenAddDriver}
            style={{ padding: '9px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <i className="fa-solid fa-user-plus" style={{ color: '#8b5cf6' }}></i> Add Driver (ADWA Form)
          </button>
          <button
            onClick={onOpenAddVehicle}
            style={{ padding: '9px 16px', borderRadius: '10px', border: 'none', background: '#8b5cf6', color: '#ffffff', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <i className="fa-solid fa-plus"></i> Add Vehicle
          </button>
        </div>
      </div>

      {/* Fleet Monitoring Table with Damage Status and Driver Next Order Request */}
      <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <th style={{ padding: '14px 16px' }}>Vehicle & Make</th>
              <th style={{ padding: '14px 16px' }}>Assigned Driver & Mobile</th>
              <th style={{ padding: '14px 16px' }}>Live Location & Destination</th>
              <th style={{ padding: '14px 16px' }}>Status & Health</th>
              <th style={{ padding: '14px 16px' }}>Driver Messages & Next Load</th>
              <th style={{ padding: '14px 16px', textAlign: 'right' }}>Owner Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(veh => {
              const hasDamage = veh.health === 'Breakdown' || veh.health === 'Damage Reported' || veh.issue !== null;
              const hasIncoming = !!veh.incomingOrderMessage;

              return (
                <tr
                  key={veh.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    background: hasDamage ? '#fff1f2' : hasIncoming ? '#fbf8ff' : '#ffffff',
                    transition: 'background 0.15s ease'
                  }}
                >
                  {/* Vehicle details */}
                  <td style={{ padding: '16px', verticalAlign: 'top' }}>
                    <div style={{ fontSize: '14.5px', fontWeight: 900, color: '#0f172a' }}>{veh.reg}</div>
                    <div style={{ fontSize: '12px', color: '#0284c7', fontWeight: 700, marginTop: '2px' }}>{veh.make}</div>
                    <span style={{ fontSize: '10.5px', background: '#f1f5f9', color: '#64748b', padding: '2px 6px', borderRadius: '6px', display: 'inline-block', marginTop: '4px' }}>
                      {veh.purpose}
                    </span>
                  </td>

                  {/* Driver */}
                  <td style={{ padding: '16px', verticalAlign: 'top' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>
                      👨‍✈️ {veh.driver}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                      📞 {veh.driverPhone}
                    </div>
                    <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700, marginTop: '3px' }}>
                      Shift: {veh.shiftTime}
                    </div>
                  </td>

                  {/* Live Position & Destination */}
                  <td style={{ padding: '16px', verticalAlign: 'top', maxWidth: '240px' }}>
                    <div style={{ fontSize: '12.5px', color: '#0f172a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <i className="fa-solid fa-location-arrow" style={{ color: '#0284c7', fontSize: '11px' }}></i>
                      {veh.loc}
                    </div>
                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>
                      🏁 Dest: <strong>{veh.destination}</strong>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                      ETA: {veh.eta}
                    </div>
                  </td>

                  {/* Status & Health / Damage alert */}
                  <td style={{ padding: '16px', verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 800, padding: '3px 8px', borderRadius: '8px', background: veh.color + '20', color: veh.color }}>
                        {veh.status}
                      </span>
                      {hasDamage && (
                        <span style={{ fontSize: '10.5px', fontWeight: 900, background: '#fee2e2', color: '#b91c1c', padding: '2px 6px', borderRadius: '6px' }}>
                          DAMAGE / ISSUE
                        </span>
                      )}
                    </div>
                    {veh.issue && (
                      <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', padding: '6px 8px', fontSize: '11px', color: '#991b1b', fontWeight: 700 }}>
                        <i className="fa-solid fa-wrench" style={{ marginRight: '4px' }}></i>
                        {veh.issue}
                      </div>
                    )}
                  </td>

                  {/* Driver message to owner asking for next order */}
                  <td style={{ padding: '16px', verticalAlign: 'top', maxWidth: '240px' }}>
                    {hasIncoming ? (
                      <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '10px', padding: '8px 10px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <i className="fa-solid fa-bell"></i> Request from Driver:
                        </div>
                        <div style={{ fontSize: '12px', color: '#334155', marginTop: '3px', fontStyle: 'italic' }}>
                          "{veh.incomingOrderMessage}"
                        </div>
                        <button
                          onClick={() => {
                            setSelectedVehicle(veh);
                            setScheduleOrderModal(veh);
                          }}
                          style={{ marginTop: '6px', padding: '5px 10px', borderRadius: '6px', border: 'none', background: '#7c3aed', color: '#ffffff', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
                        >
                          Schedule Next Order ⚡
                        </button>
                      </div>
                    ) : (
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                        <i className="fa-solid fa-circle-check" style={{ color: '#16a34a', marginRight: '4px' }}></i>
                        No pending requests
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '16px', verticalAlign: 'top', textAlign: 'right' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                      <button
                        onClick={() => {
                          setSelectedVehicle(veh);
                          setScheduleOrderModal(veh);
                        }}
                        style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
                      >
                        Assign Work
                      </button>

                      {hasDamage && (
                        <button
                          onClick={() => handleMarkDamageResolved(veh.id)}
                          style={{ padding: '5px 10px', borderRadius: '8px', border: 'none', background: '#16a34a', color: '#ffffff', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
                        >
                          Clear Damage Flag ✓
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================= SCHEDULE NEXT ORDER MODAL ================= */}
      {scheduleOrderModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 6500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setScheduleOrderModal(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              maxWidth: '540px',
              width: '100%',
              padding: '26px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                  Assign Next Goods Order to Driver
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Vehicle: <strong>{scheduleOrderModal.reg}</strong> • Driver: {scheduleOrderModal.driver}
                </span>
              </div>
              <button
                onClick={() => setScheduleOrderModal(null)}
                style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: '#f1f5f9', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Cargo / Order Description</label>
              <input
                type="text"
                value={newOrderCargo}
                onChange={e => setNewOrderCargo(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Pickup Location</label>
                <input
                  type="text"
                  value={newOrderPickup}
                  onChange={e => setNewOrderPickup(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Drop Destination</label>
                <input
                  type="text"
                  value={newOrderDrop}
                  onChange={e => setNewOrderDrop(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                />
              </div>
            </div>

            <button
              onClick={() => handleAssignNextOrder(scheduleOrderModal.id)}
              style={{
                marginTop: '8px',
                padding: '13px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                color: '#ffffff',
                fontSize: '14.5px',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 6px 16px rgba(124, 58, 237, 0.35)'
              }}
            >
              🚀 Confirm Assignment & Dispatch Driver
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
