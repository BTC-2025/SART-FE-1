'use client';

import React, { useState } from 'react';
import { PublicUnionMember } from './unionMembersData';

interface PublicUnionDirectoryProps {
  members: PublicUnionMember[];
  onOpenRegisterModal: () => void;
  onCallDriver: (member: PublicUnionMember) => void;
  activeStand?: string;
  onChangeStand?: () => void;
  onDeleteDriver?: (memberId: string) => void;
  isLoggedIn?: boolean;
  loggedInUser?: { driverName: string; unionName: string; badgeNo: string; phone: string } | null;
  onLoginClick?: () => void;
}

export default function PublicUnionDirectory({
  members,
  onOpenRegisterModal,
  onCallDriver,
  activeStand,
  onChangeStand,
  isLoggedIn = false,
  loggedInUser = null,
  onLoginClick
}: PublicUnionDirectoryProps) {
  const [filterUnion, setFilterUnion] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<PublicUnionMember | null>(null);

  const filtered = members.filter(m => {
    const matchesUnion = filterUnion === 'ALL' || m.unionName === filterUnion;
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.vehicleType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.mobile.includes(searchQuery);
    return matchesUnion && matchesSearch;
  });

  // Identify the currently logged-in user's profile card
  const myDriver = loggedInUser
    ? filtered.find(m => {
        const cleanPhone = loggedInUser.phone.replace(/\D/g, '').slice(-10);
        const mClean = m.mobile.replace(/\D/g, '').slice(-10);
        return mClean === cleanPhone || m.badgeNumber === loggedInUser.badgeNo || m.fullName.toLowerCase() === loggedInUser.driverName.toLowerCase();
      })
    : null;

  // Other drivers excluding current logged in user
  const otherDrivers = myDriver
    ? filtered.filter(m => m.id !== myDriver.id)
    : filtered;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner with Direct Contact Directory Highlight */}


      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', background: '#ffffff', padding: '14px 18px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
        <div style={{ flex: '1 1 260px', position: 'relative' }}>
          <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }}></i>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search driver by name, phone number, vehicle type, or city..."
            style={{ width: '100%', padding: '10px 14px 10px 36px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#475569' }}>Union Association:</span>
          <select
            value={filterUnion}
            onChange={e => setFilterUnion(e.target.value)}
            style={{ padding: '9px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', fontWeight: 700, color: '#0f172a', outline: 'none', background: '#f8fafc' }}
          >
            <option value="ALL">All Transport Unions ({members.length})</option>
            <option value="Heavy Truckers Association">Heavy Truckers Association</option>
            <option value="Auto Stand Union">Auto Stand Union</option>
            <option value="City Taxi Drivers Union">City Taxi Drivers Union</option>
            <option value="Private Bus Owners Club">Private Bus Owners Club</option>
          </select>
        </div>

        {activeStand && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f5f3ff', border: '1px solid #ddd6fe', padding: '5px 12px', borderRadius: '10px', fontSize: '12px', color: '#2A1373', fontWeight: 700 }}>
            <i className="fa-solid fa-location-dot" style={{ color: '#2A1373' }}></i>
            <span>Stand: <strong>{activeStand}</strong></span>
            {onChangeStand && (
              <button
                type="button"
                onClick={onChangeStand}
                style={{ background: '#2A1373', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', marginLeft: '4px' }}
              >
                Change Location
              </button>
            )}
          </div>
        )}

        <span style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 700, marginLeft: 'auto' }}>
          Showing {filtered.length} Verified Drivers
        </span>
      </div>

      {/* Gated Directory: Visible only when user logs in */}
      {!isLoggedIn ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', background: '#ffffff', borderRadius: '20px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', margin: '0 auto 16px', boxShadow: '0 8px 16px rgba(217, 119, 6, 0.15)' }}>
            <i className="fa-solid fa-lock"></i>
          </div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '19px', fontWeight: 900, color: '#0f172a' }}>
            Driver Directory Locked
          </h4>
          <p style={{ margin: '0 auto 20px', fontSize: '13.5px', color: '#64748b', maxWidth: '460px', lineHeight: 1.5 }}>
            To safeguard driver personal contacts and verified smart ID cards, other drivers&apos; details will only appear once you log in with your registered mobile number &amp; OTP.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {onLoginClick && (
              <button
                type="button"
                onClick={onLoginClick}
                style={{ padding: '11px 22px', borderRadius: '12px', border: 'none', background: '#2A1373', color: '#ffffff', fontSize: '13.5px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(42, 19, 115, 0.28)' }}
              >
                <i className="fa-solid fa-right-to-bracket"></i>
                <span>Log In with Mobile &amp; OTP</span>
              </button>
            )}
            <button
              type="button"
              onClick={onOpenRegisterModal}
              style={{ padding: '11px 22px', borderRadius: '12px', border: '1.5px solid #2A1373', background: '#ffffff', color: '#2A1373', fontSize: '13.5px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <i className="fa-solid fa-user-plus"></i>
              <span>Register as Driver</span>
            </button>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', background: '#ffffff', borderRadius: '18px', border: '1.5px dashed #cbd5e1' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f1f5f9', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', margin: '0 auto 12px' }}>
            <i className="fa-solid fa-id-badge"></i>
          </div>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
            No Registered Drivers in Directory Yet
          </h4>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b', maxWidth: '440px', marginInline: 'auto', lineHeight: 1.5 }}>
            Drivers who register on the registration page will appear here with their verified smart ID card and live status.
          </p>
          <button
            type="button"
            onClick={onOpenRegisterModal}
            style={{
              marginTop: '16px',
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              background: '#2A1373',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 10px rgba(42, 19, 115, 0.28)'
            }}
          >
            <i className="fa-solid fa-user-plus"></i> Register as Driver
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 1. Logged-In User Profile Card (Matching Image 4) */}
          {myDriver && (
            <div>
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#2A1373', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fa-solid fa-circle-user"></i>
                <span>My Driver Profile (Logged In As You)</span>
              </div>

              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '18px',
                  border: '2px solid #2A1373',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  boxShadow: '0 4px 16px rgba(42, 19, 115, 0.15)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f23cb 0%, #2A1373 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 900 }}>
                      {myDriver.fullName.charAt(0)}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <h4 style={{ margin: 0, fontSize: '17px', fontWeight: 900, color: '#0f172a' }}>
                          {myDriver.fullName}
                        </h4>
                        <i className="fa-solid fa-circle-check" style={{ color: '#2A1373', fontSize: '14px' }} title="Verified Driver"></i>
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                        Badge: <strong style={{ color: '#0f172a' }}>{myDriver.badgeNumber}</strong> • {myDriver.unionName}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, background: '#fef3c7', color: '#92400e', padding: '3px 8px', borderRadius: '8px' }}>
                      {myDriver.status}
                    </span>
                    <span style={{ fontSize: '10.5px', fontWeight: 800, background: '#ede9fe', color: '#2A1373', border: '1px solid #ddd6fe', padding: '2px 8px', borderRadius: '6px' }}>
                      ✓ My Registered Profile
                    </span>
                  </div>
                </div>

                {/* Driving Specs & Vehicle Class */}
                <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '12px', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontSize: '12.5px', color: '#334155' }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Vehicle Class: </span>
                    <strong style={{ color: '#0284c7' }}>{myDriver.vehicleType}</strong>
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#334155' }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Experience: </span>
                    <strong>{myDriver.experienceYears} Years</strong> (Clean Record: {myDriver.cleanRecord ? '✓ 100% Violation-Free' : 'Verified'})
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569' }}>
                    <i className="fa-solid fa-location-dot" style={{ color: '#ef4444', marginRight: '6px' }}></i>
                    {myDriver.currentLocation}
                  </div>
                </div>

                {/* Contact & Actions (NO delete button) */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: 'auto' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Verified Mobile</span>
                    <span style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a' }}>
                      +91 {myDriver.mobile}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={() => setSelectedMember(myDriver)}
                      style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#334155', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
                    >
                      View ID Card
                    </button>
                    <a
                      href={`tel:+91${myDriver.mobile}`}
                      onClick={() => onCallDriver(myDriver)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#2A1373',
                        color: '#ffffff',
                        fontSize: '12.5px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        textDecoration: 'none',
                        boxShadow: '0 4px 10px rgba(42, 19, 115, 0.28)'
                      }}
                    >
                      <i className="fa-solid fa-phone"></i> Call Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Other Drivers Section */}
          {otherDrivers.length > 0 && (
            <div>
              {myDriver && (
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#475569', marginBottom: '12px' }}>
                  Other Stand Drivers ({otherDrivers.length})
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
                {otherDrivers.map(driver => {
                  const isWaiting = driver.status === 'Waiting in Stand';
                  const isOnTrip = driver.status === 'On Trip';
                  const statusBg = isWaiting ? '#fef3c7' : isOnTrip ? '#e0f2fe' : '#dcfce7';
                  const statusColor = isWaiting ? '#92400e' : isOnTrip ? '#0369a1' : '#166534';

                  return (
                    <div
                      key={driver.id}
                      style={{
                        background: '#ffffff',
                        borderRadius: '18px',
                        border: '1.5px solid #e2e8f0',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                        position: 'relative'
                      }}
                    >
                      {/* Top Row: Avatar, Name, Badge & Status */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f23cb 0%, #2A1373 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 900 }}>
                            {driver.fullName.charAt(0)}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>
                                {driver.fullName}
                              </h4>
                              <i className="fa-solid fa-circle-check" style={{ color: '#2A1373', fontSize: '13px' }} title="Government Verified License &amp; Aadhaar"></i>
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                              Badge: <strong style={{ color: '#0f172a' }}>{driver.badgeNumber}</strong> • {driver.unionName}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, background: statusBg, color: statusColor, padding: '3px 8px', borderRadius: '8px' }}>
                            {driver.status}
                          </span>
                          {(driver.registeredDate.toLowerCase().includes('today') || driver.registeredDate.toLowerCase().includes('recent') || driver.registeredDate.toLowerCase().includes('just now')) && (
                            <span style={{ fontSize: '10px', fontWeight: 800, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '2px 6px', borderRadius: '6px' }}>
                              ✨ Recently Registered
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Driving Specs & Vehicle Class */}
                      <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '12px', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ fontSize: '12.5px', color: '#334155' }}>
                          <span style={{ color: '#64748b', fontWeight: 600 }}>Vehicle Class: </span>
                          <strong style={{ color: '#0284c7' }}>{driver.vehicleType}</strong>
                        </div>
                        <div style={{ fontSize: '12.5px', color: '#334155' }}>
                          <span style={{ color: '#64748b', fontWeight: 600 }}>Experience: </span>
                          <strong>{driver.experienceYears} Years</strong> (Clean Record: {driver.cleanRecord ? '✓ 100% Violation-Free' : 'Verified'})
                        </div>
                        <div style={{ fontSize: '12px', color: '#475569' }}>
                          <i className="fa-solid fa-location-dot" style={{ color: '#ef4444', marginRight: '6px' }}></i>
                          {driver.currentLocation}
                        </div>
                      </div>

                      {/* Contact & Calling Actions (NO delete button!) */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: 'auto' }}>
                        <div>
                          <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Verified Mobile</span>
                          <a
                            href={`tel:+91${driver.mobile}`}
                            style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a', textDecoration: 'none' }}
                          >
                            +91 {driver.mobile}
                          </a>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            onClick={() => setSelectedMember(driver)}
                            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#334155', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
                          >
                            View ID Card
                          </button>
                          <a
                            href={`tel:+91${driver.mobile}`}
                            onClick={() => onCallDriver(driver)}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '8px',
                              border: 'none',
                              background: '#2A1373',
                              color: '#ffffff',
                              fontSize: '12.5px',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              textDecoration: 'none',
                              boxShadow: '0 4px 10px rgba(42, 19, 115, 0.28)'
                            }}
                          >
                            <i className="fa-solid fa-phone"></i> Call Now
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= DRIVER SMART ID CARD MODAL ================= */}
      {selectedMember && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 6000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setSelectedMember(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              maxWidth: '520px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* ID Card Front Frame */}
            <div
              style={{
                background: 'linear-gradient(135deg, #1b0b4d 0%, #2A1373 50%, #3e1b9b 100%)',
                borderRadius: '18px',
                padding: '20px',
                color: '#ffffff',
                boxShadow: '0 8px 24px rgba(42, 19, 115, 0.4)',
                border: '2px solid rgba(255,255,255,0.2)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '12px', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '1px', color: '#ddd6fe' }}>ALL DRIVER WELFARE ASSOCIATION</div>
                  <div style={{ fontSize: '15px', fontWeight: 900 }}>DIGITAL DRIVER SMART CARD</div>
                </div>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  🪪
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '70px', height: '80px', borderRadius: '10px', background: 'rgba(255,255,255,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '32px', border: '1px solid rgba(255,255,255,0.3)' }}>
                  👤
                  <span style={{ fontSize: '9px', fontWeight: 800, marginTop: '4px' }}>PHOTO</span>
                </div>

                <div style={{ flex: 1, fontSize: '12.5px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div style={{ fontSize: '17px', fontWeight: 900 }}>{selectedMember.fullName}</div>
                  <div style={{ color: '#e0e7ff' }}>S/o: {selectedMember.fatherName}</div>
                  <div style={{ color: '#e0e7ff' }}>DOB: {selectedMember.dob} • Gender: {selectedMember.gender}</div>
                  <div style={{ color: '#fef08a', fontWeight: 800 }}>License: {selectedMember.licenseNumber}</div>
                  <div style={{ color: '#ddd6fe' }}>RTO: {selectedMember.issuingRto}</div>
                </div>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '10px', borderTop: '1px dashed rgba(255,255,255,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                <span>Badge No: <strong>{selectedMember.badgeNumber}</strong></span>
                <span style={{ background: '#4f23cb', color: '#ffffff', padding: '2px 8px', borderRadius: '6px', fontWeight: 900 }}>✓ ACTIVE MEMBER</span>
              </div>
            </div>

            {/* Address & Emergency Info */}
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12.5px', color: '#334155' }}>
              <div><strong>Registered Address: </strong>{selectedMember.fullAddress}, {selectedMember.city}, {selectedMember.state} - {selectedMember.pincode}</div>
              <div style={{ marginTop: '4px' }}><strong>Primary Stand: </strong>{selectedMember.unionName}</div>
              <div style={{ marginTop: '4px' }}><strong>Contact: </strong>+91 {selectedMember.mobile} {selectedMember.alternateMobile && `(Alt: ${selectedMember.alternateMobile})`}</div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => setSelectedMember(null)}
                style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
              >
                Close
              </button>
              <a
                href={`tel:+91${selectedMember.mobile}`}
                style={{ padding: '10px 22px', borderRadius: '10px', border: 'none', background: '#2A1373', color: '#ffffff', fontSize: '13.5px', fontWeight: 900, cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <i className="fa-solid fa-phone"></i> Call Driver Now
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
