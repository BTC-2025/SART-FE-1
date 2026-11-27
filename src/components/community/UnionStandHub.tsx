'use client';

import React, { useState } from 'react';
import { TransportUnionInfo } from './transportUnionsData';
import { PublicUnionMember } from './unionMembersData';
import PublicUnionDirectory from './PublicUnionDirectory';
import StandLocationModal from './StandLocationModal';

interface UnionStandHubProps {
  union: TransportUnionInfo;
  onBack: () => void;
  subView: 'directory' | 'hub';
  onSetSubView: (v: 'directory' | 'hub') => void;
  unionMembers: PublicUnionMember[];
  isPublicLoggedIn: boolean;
  publicUser: { driverName: string; unionName: string; badgeNo: string; phone: string } | null;
  onLoginSuccess: (user: { driverName: string; unionName: string; badgeNo: string; phone: string }) => void;
  onOpenRegisterModal: () => void;
  onUpdateUnionStand?: (unionId: string, newStand: string, allStands: string[]) => void;
  onDeleteDriver?: (memberId: string) => void;
  onLogout?: () => void;
}

export default function UnionStandHub({
  union,
  onBack,
  subView,
  onSetSubView,
  unionMembers,
  isPublicLoggedIn,
  publicUser,
  onLoginSuccess,
  onOpenRegisterModal,
  onUpdateUnionStand,
  onDeleteDriver,
  onLogout
}: UnionStandHubProps) {
  // Stand Location State
  const [currentStand, setCurrentStand] = useState(union.defaultStand);
  const [standsList, setStandsList] = useState<string[]>(() => {
    const list = union.stands || [];
    return list.includes(union.defaultStand) ? list : [union.defaultStand, ...list];
  });
  const [showStandModal, setShowStandModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  React.useEffect(() => {
    setCurrentStand(union.defaultStand);
    const list = union.stands || [];
    setStandsList(list.includes(union.defaultStand) ? list : [union.defaultStand, ...list]);
  }, [union]);

  const handleSelectStand = (stand: string) => {
    setCurrentStand(stand);
    setShowStandModal(false);
    setToastMsg(`Stand location switched to: ${stand}`);
    if (onUpdateUnionStand) {
      onUpdateUnionStand(union.id, stand, standsList);
    }
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleAddNewStand = (fullStandTitle: string, updatedList: string[]) => {
    setStandsList(updatedList);
    setCurrentStand(fullStandTitle);
    setShowStandModal(false);
    setToastMsg(`Stand relocated to: ${fullStandTitle}`);
    if (onUpdateUnionStand) {
      onUpdateUnionStand(union.id, fullStandTitle, updatedList);
    }
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Mobile login inputs (Strictly validated against registered members from registration page)
  const [uPhone, setUPhone] = useState('');
  const [uOtp, setUOtp] = useState('');
  const [uOtpSent, setUOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [matchedDriver, setMatchedDriver] = useState<PublicUnionMember | null>(null);
  const [uError, setUError] = useState('');

  // Queue and comms
  const [chatInput, setChatInput] = useState('');
  const [unionChat, setUnionChat] = useState<{ name: string; msg: string; time: string; isSelf: boolean }[]>([
    { name: 'Admin (Ramesh)', msg: 'Welcome to the Regional Stand! Maintain queue order.', time: '09:00 AM', isSelf: false },
    { name: 'Karthik (Driver)', msg: 'Heavy passenger demand near Gate 2.', time: '10:02 AM', isSelf: false },
    { name: 'Siva (Driver)', msg: 'Next passenger in queue allocated.', time: '10:05 AM', isSelf: false }
  ]);

  const [unionQueue] = useState<{ id: string; name: string; v: string; status: string; isSelf: boolean }[]>([
    { id: 'q1', name: 'Kumar M.', v: 'TN-01-AB-1234', status: 'Next in Queue', isSelf: false },
    { id: 'q2', name: 'Suresh Babu', v: 'TN-05-CD-5678', status: 'Waiting (Rank #2)', isSelf: false },
    { id: 'q3', name: 'You (Standby)', v: 'TN-02-XX-9999', status: 'Waiting (Rank #3)', isSelf: true },
    { id: 'q4', name: 'Muthu Krishnan', v: 'TN-22-EZ-1111', status: 'On Active Trip', isSelf: false }
  ]);

  // Step 1: Send OTP only to mobile numbers registered on the registration page
  const handleSendOtp = () => {
    if (!uPhone.trim()) {
      setUError('Please enter your registered mobile number first.');
      return;
    }

    const cleanPhone = uPhone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length < 10) {
      setUError('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Match against drivers registered in unionMembers (from registration page)
    const foundMember = unionMembers.find(m => {
      const mClean = m.mobile.replace(/\D/g, '').slice(-10);
      return mClean === cleanPhone;
    });

    if (!foundMember) {
      setUError(`❌ Mobile number +91 ${cleanPhone} is NOT registered. Only drivers registered on the registration page can log in. Please click "Register as Driver" below to register.`);
      setUOtpSent(false);
      setMatchedDriver(null);
      setGeneratedOtp('');
      return;
    }

    // Generate dynamic 4-digit verification OTP
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setMatchedDriver(foundMember);
    setUOtp(code);
    setUOtpSent(true);
    setUError('');
    setToastMsg(`📱 Verification OTP sent to registered driver ${foundMember.fullName}: ${code}`);
    setTimeout(() => setToastMsg(''), 4500);
  };

  // Step 2: Strictly verify mobile number and OTP from registration page
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uPhone.trim()) {
      setUError('Please enter your registered mobile number.');
      return;
    }

    const cleanPhone = uPhone.replace(/\D/g, '').slice(-10);
    const foundMember = unionMembers.find(m => {
      const mClean = m.mobile.replace(/\D/g, '').slice(-10);
      return mClean === cleanPhone;
    });

    if (!foundMember) {
      setUError(`❌ Access Denied: Mobile number +91 ${cleanPhone} is NOT registered. You can only log in with a registered driver mobile number from the registration page.`);
      return;
    }

    if (!uOtp.trim()) {
      setUError('Please enter the 4-digit verification code (OTP).');
      return;
    }

    if (!generatedOtp || uOtp.trim() !== generatedOtp.trim()) {
      setUError('❌ Incorrect OTP code. Please enter the valid verification OTP sent to your registered mobile number.');
      return;
    }

    setUError('');
    setToastMsg(`✓ Welcome, ${foundMember.fullName}! Verified & joined stand queue.`);
    setTimeout(() => setToastMsg(''), 3500);

    onLoginSuccess({
      driverName: foundMember.fullName,
      badgeNo: foundMember.badgeNumber,
      unionName: foundMember.unionName || union.name,
      phone: foundMember.mobile
    });
  };

  const filteredMembers = unionMembers.filter(m => {
    const uFirst = union.name.toLowerCase().split(' ')[0];
    return m.unionName.toLowerCase().includes(uFirst) || m.unionName === union.associatedUnionName;
  });

  const loggedInMember = isPublicLoggedIn && publicUser
    ? unionMembers.find(m => {
        const cleanPhone = (publicUser.phone || '').replace(/\D/g, '').slice(-10);
        const mClean = (m.mobile || '').replace(/\D/g, '').slice(-10);
        return (cleanPhone && mClean === cleanPhone) ||
          (publicUser.badgeNo && m.badgeNumber === publicUser.badgeNo) ||
          (publicUser.driverName && m.fullName.toLowerCase() === publicUser.driverName.toLowerCase());
      })
    : null;

  return (
    <div className="fade-in">
      {/* Top Header Card */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '18px',
          padding: '20px 24px',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        {/* Tier 1: Portal Title & Stand Info */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={onBack}
              style={{
                background: '#f1f5f9',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '10px',
                color: '#334155',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <i className="fa-solid fa-arrow-left"></i> Back to All Unions
            </button>

            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: union.iconBg,
                color: union.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}
            >
              <i className={`fa-solid ${union.icon}`}></i>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>
                  {union.name} Portal
                </h3>
                <button
                  type="button"
                  onClick={() => setShowStandModal(true)}
                  style={{
                    fontSize: '12px',
                    background: '#f5f3ff',
                    color: '#2A1373',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '8px',
                    border: '1.5px solid #ddd6fe',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 1px 3px rgba(42, 19, 115, 0.06)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ede9fe';
                    e.currentTarget.style.borderColor = '#c4b5fd';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f5f3ff';
                    e.currentTarget.style.borderColor = '#ddd6fe';
                  }}
                  title="Click to change stand location or set a new place"
                >
                  <i className="fa-solid fa-location-dot" style={{ color: '#2A1373', fontSize: '12px' }}></i>
                  <span>Stand: <strong>{currentStand}</strong></span>
                  <span style={{ fontSize: '10px', background: '#2A1373', color: '#ffffff', padding: '1px 6px', borderRadius: '4px', marginLeft: '2px', fontWeight: 700 }}>
                    Change ▾
                  </span>
                </button>
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '3px' }}>
                {union.description}
              </div>
            </div>
          </div>
        </div>

        {/* Divider matching screenshot */}
        <div style={{ borderTop: '1px solid #f1f5f9', width: '100%', margin: '2px 0 4px 0' }}></div>

        {/* Tier 2: Action Buttons & Auth Profile Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
          {/* Left Buttons: Drivers Directory & Stand Queue & Radio */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => onSetSubView('directory')}
              style={{
                padding: '9px 18px',
                borderRadius: '10px',
                border: subView === 'directory' ? 'none' : '1px solid #e2e8f0',
                background: subView === 'directory' ? '#2A1373' : '#ffffff',
                color: subView === 'directory' ? '#ffffff' : '#334155',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: subView === 'directory' ? '0 2px 6px rgba(42, 19, 115, 0.28)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <i className="fa-solid fa-address-book" style={{ fontSize: '13px' }}></i>
              <span>Drivers Directory</span>
            </button>

            <button
              type="button"
              onClick={() => onSetSubView('hub')}
              style={{
                padding: '9px 18px',
                borderRadius: '10px',
                border: '1px solid ' + (subView === 'hub' ? '#2A1373' : '#e2e8f0'),
                background: subView === 'hub' ? '#2A1373' : '#ffffff',
                color: subView === 'hub' ? '#ffffff' : '#0f172a',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: subView === 'hub' ? '0 2px 6px rgba(42, 19, 115, 0.28)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '-0.5px' }}>((•))</span>
              <span>Stand Queue &amp; Radio</span>
            </button>
          </div>

          {/* Right Area (In place of empty space): User Image + Name + Logout beside it, OR Login & SignUp */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {isPublicLoggedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 14px 4px 6px',
                    borderRadius: '9999px',
                    background: '#f5f3ff',
                    border: '1.5px solid #ddd6fe',
                    boxShadow: '0 2px 6px rgba(42, 19, 115, 0.12)'
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4f23cb 0%, #2A1373 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: 900
                    }}
                  >
                    {publicUser?.driverName?.charAt(0) || <i className="fa-solid fa-user"></i>}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#2A1373' }}>
                    {publicUser?.driverName}
                  </span>
                  <span style={{ fontSize: '10.5px', background: '#ede9fe', color: '#2A1373', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                    ✓ Logged In
                  </span>
                </div>

                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '10px',
                      border: '1px solid #fecaca',
                      background: '#fef2f2',
                      color: '#b91c1c',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fef2f2'; }}
                  >
                    <i className="fa-solid fa-right-from-bracket"></i>
                    <span>Logout</span>
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => onSetSubView('hub')}
                  style={{
                    padding: '6px 16px 6px 8px',
                    borderRadius: '9999px',
                    border: '1.5px solid #bfdbfe',
                    background: '#ffffff',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.08)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#60a5fa'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#bfdbfe'; }}
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: '#dbeafe',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px'
                    }}
                  >
                    <i className="fa-solid fa-right-to-bracket"></i>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                    Log in
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onOpenRegisterModal}
                  style={{
                    padding: '7px 16px',
                    borderRadius: '9999px',
                    border: 'none',
                    background: '#2A1373',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(42, 19, 115, 0.3)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#1f0c59'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#2A1373'; }}
                >
                  <i className="fa-solid fa-user-plus"></i>
                  <span>Sign up</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Directory SubView */}
      {subView === 'directory' && (
        <PublicUnionDirectory
          members={filteredMembers}
          onOpenRegisterModal={onOpenRegisterModal}
          activeStand={currentStand}
          onChangeStand={() => setShowStandModal(true)}
          isLoggedIn={isPublicLoggedIn}
          loggedInUser={publicUser}
          onLoginClick={() => onSetSubView('hub')}
          onCallDriver={(member) => {
            window.location.href = 'tel:' + member.mobile;
          }}
        />
      )}

      {/* Hub / Stand Queue SubView */}
      {subView === 'hub' && (
        <div>
          {!isPublicLoggedIn ? (
            <div className="fade-in" style={{ maxWidth: '480px', margin: '20px auto', background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 40px -15px rgba(42, 19, 115, 0.16)' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)', color: '#2A1373', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px', boxShadow: '0 8px 16px rgba(42, 19, 115, 0.2)' }}>
                  <i className="fa-solid fa-mobile-screen-button"></i>
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                  {union.name} Stand Driver Login
                </h2>
                <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
                  Already registered at <strong>{currentStand}</strong>? Sign in with mobile number and OTP to join the live stand queue!
                </p>
              </div>

              {uError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '10px 14px', color: '#b91c1c', fontSize: '12.5px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa-solid fa-circle-exclamation"></i> {uError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                    Registered Mobile Number *
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="tel"
                      value={uPhone}
                      onChange={(e) => { setUPhone(e.target.value); setUError(''); }}
                      placeholder="e.g. 9876543210"
                      style={{ flex: 1, padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '14px', fontWeight: 700, color: '#0f172a', outline: 'none' }}
                      required
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      style={{ padding: '11px 14px', borderRadius: '10px', border: 'none', background: '#2A1373', color: '#ffffff', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 2px 6px rgba(42, 19, 115, 0.28)' }}
                    >
                      {uOtpSent ? 'Resend OTP' : 'Send OTP'}
                    </button>
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                    * Only mobile numbers registered on the registration page can log in.
                  </span>
                </div>

                {uOtpSent && matchedDriver && (
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                      4-Digit Verification Code (OTP) *
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={uOtp}
                      onChange={(e) => { setUOtp(e.target.value); setUError(''); }}
                      placeholder="Enter 4-digit OTP"
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '18px', fontWeight: 900, color: '#0f172a', letterSpacing: '6px', textAlign: 'center', outline: 'none' }}
                      required
                    />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', flexWrap: 'wrap', gap: '6px', background: '#f5f3ff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd6fe' }}>
                      <span style={{ fontSize: '11.5px', color: '#2A1373', fontWeight: 700 }}>
                        <i className="fa-solid fa-circle-check"></i> Registered: <strong>{matchedDriver.fullName}</strong> ({matchedDriver.badgeNumber})
                      </span>
                      <span style={{ fontSize: '11.5px', color: '#ffffff', fontWeight: 900, background: '#2A1373', padding: '2px 8px', borderRadius: '6px' }}>
                        OTP: {generatedOtp}
                      </span>
                    </div>
                  </div>
                )}

                {/* Quick Selection for Registered Drivers in Directory */}
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
                    Registered Drivers in Directory (Click to Quick-Fill):
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {filteredMembers.map((driver) => (
                      <button
                        key={driver.id}
                        type="button"
                        onClick={() => {
                          setUPhone(driver.mobile);
                          const code = Math.floor(1000 + Math.random() * 9000).toString();
                          setGeneratedOtp(code);
                          setUOtp(code);
                          setUOtpSent(true);
                          setMatchedDriver(driver);
                          setUError('');
                          setToastMsg(`📱 OTP generated for registered driver ${driver.fullName}: ${code}`);
                          setTimeout(() => setToastMsg(''), 4000);
                        }}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          padding: '5px 9px',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#0f172a',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <i className="fa-solid fa-id-badge" style={{ color: '#2A1373' }}></i>
                        {driver.fullName} (+91 {driver.mobile})
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#2A1373', color: '#ffffff', fontSize: '15px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 16px -4px rgba(42, 19, 115, 0.4)' }}
                >
                  <i className="fa-solid fa-right-to-bracket" style={{ marginRight: '8px' }}></i> Verify & Join Stand Queue
                </button>
              </form>

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
                New driver without badge?{' '}
                <strong
                  onClick={onOpenRegisterModal}
                  style={{ color: '#2A1373', cursor: 'pointer' }}
                >
                  Register Now (4 Steps)
                </strong>
              </div>
            </div>
          ) : (
            <div>
              {/* Queue + Radar + Radio Comms */}
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 360px' }}>
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                        <i className="fa-solid fa-list-ol" style={{ color: '#2A1373', marginRight: '8px' }}></i>
                        {currentStand} Live Queue
                      </h3>
                      <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '8px', background: '#ede9fe', color: '#2A1373' }}>
                        ● Live Dispatch
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {unionQueue.map((q, i) => {
                        const isUserSelf = q.isSelf;
                        const displayName = isUserSelf && isPublicLoggedIn && publicUser
                          ? `${publicUser.driverName} (You)`
                          : q.name;

                        const vehiclePlate = loggedInMember?.assignedVehicle
                          ? loggedInMember.assignedVehicle.split(' ')[0]
                          : (isUserSelf ? 'TN-02-AZ-4545' : q.v);

                        const userMobile = publicUser?.phone || loggedInMember?.mobile || '9840155555';

                        const displayNumberPlace = isUserSelf && isPublicLoggedIn
                          ? `${vehiclePlate} • +91 ${userMobile}`
                          : q.v;

                        return (
                          <div
                            key={q.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '12px 16px',
                              background: isUserSelf ? '#f5f3ff' : '#f8fafc',
                              borderRadius: '12px',
                              border: isUserSelf ? '1.5px solid #ddd6fe' : '1px solid #e2e8f0'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  background: isUserSelf ? '#2A1373' : '#cbd5e1',
                                  color: '#ffffff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 800,
                                  fontSize: '13px'
                                }}
                              >
                                {i + 1}
                              </div>
                              <div>
                                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span>{displayName}</span>
                                  {isUserSelf && isPublicLoggedIn && (
                                    <span style={{ fontSize: '10px', background: '#ede9fe', color: '#2A1373', padding: '1px 6px', borderRadius: '6px', fontWeight: 700 }}>
                                      ✓ Logged In
                                    </span>
                                  )}
                                </div>
                                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', fontWeight: isUserSelf && isPublicLoggedIn ? 600 : 400 }}>
                                  {displayNumberPlace}
                                </div>
                              </div>
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: q.status.includes('Next') ? '#2A1373' : '#d97706' }}>
                              {q.status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                      <i className="fa-solid fa-satellite-dish" style={{ color: '#0284c7', marginRight: '8px' }}></i> Stand Passenger Radar
                    </h3>
                    <div style={{ height: '140px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                      <i className="fa-solid fa-location-crosshairs" style={{ fontSize: '32px', color: '#0284c7', zIndex: 10 }}></i>
                      <div style={{ position: 'absolute', bottom: '12px', fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                        Scanning stand perimeter for passenger ride bookings...
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', height: '480px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                    <div style={{ padding: '14px 18px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                        <i className="fa-solid fa-walkie-talkie" style={{ color: '#2A1373', marginRight: '8px' }}></i> Stand Radio Channel
                      </h3>
                      <button
                        onClick={() => alert(`🚨 Stand SOS Alert broadcast to all drivers at ${currentStand}!`)}
                        style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 800, cursor: 'pointer' }}
                      >
                        <i className="fa-solid fa-triangle-exclamation"></i> Broadcast SOS
                      </button>
                    </div>

                    <div style={{ flex: 1, padding: '18px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {unionChat.map((c, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: c.isSelf ? 'flex-end' : 'flex-start' }}>
                          <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '3px', padding: '0 4px' }}>{c.name} • {c.time}</div>
                          <div style={{ padding: '9px 14px', background: c.isSelf ? '#2A1373' : '#f1f5f9', color: c.isSelf ? '#ffffff' : '#0f172a', borderRadius: '14px', fontSize: '13.5px', maxWidth: '85%' }}>
                            {c.msg}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ padding: '14px', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px' }}>
                      <input
                        type="text"
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && chatInput) {
                            setUnionChat([...unionChat, { name: 'You (' + (publicUser?.driverName || 'Driver') + ')', msg: chatInput, time: 'Just now', isSelf: true }]);
                            setChatInput('');
                          }
                        }}
                        placeholder="Broadcast message to stand peers..."
                        style={{ flex: 1, padding: '10px 14px', borderRadius: '20px', border: '1.5px solid #cbd5e1', outline: 'none', fontSize: '13.5px' }}
                      />
                      <button
                        onClick={() => {
                          if (chatInput) {
                            setUnionChat([...unionChat, { name: 'You (' + (publicUser?.driverName || 'Driver') + ')', msg: chatInput, time: 'Just now', isSelf: true }]);
                            setChatInput('');
                          }
                        }}
                        style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#2A1373', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <i className="fa-solid fa-paper-plane"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#2A1373',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(42, 19, 115, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 6500,
            fontSize: '13.5px',
            fontWeight: 800
          }}
        >
          <i className="fa-solid fa-circle-check" style={{ color: '#c4b5fd', fontSize: '16px' }}></i>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ================= CHANGE STAND LOCATION MODAL ================= */}
      <StandLocationModal
        isOpen={showStandModal}
        onClose={() => setShowStandModal(false)}
        union={union}
        currentStand={currentStand}
        standsList={standsList}
        onSelectStand={handleSelectStand}
        onAddNewStand={handleAddNewStand}
      />
    </div>
  );
}
