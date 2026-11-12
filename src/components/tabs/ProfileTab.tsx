'use client';
import React, { useEffect, useState, useRef } from 'react';
import './ProfileTab.css';
import { useSartStore } from '@/store/useSartStore';

export default function ProfileTab() {
  const { activeTab } = useSartStore();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState({
    name: 'SAI KUMAR',
    email: 'saip1997@bnxmail.com',
    recoveryEmail: 'None added',
    phone: '+919988664422',
    birthday: 'Not set',
    gender: 'Rather not say',
    avatar: ''
  });

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<any>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    // Load from local session first if available
    try {
      const stored = localStorage.getItem('sart_user_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile(prev => ({
          ...prev,
          name: parsed.name || prev.name,
          phone: parsed.phone || prev.phone,
          email: parsed.email || prev.email,
          gender: parsed.gender || prev.gender,
          birthday: parsed.age ? `${parsed.age} years old` : prev.birthday,
          avatar: parsed.avatar || prev.avatar
        }));
      }
    } catch (e) { }

    const loadUserProfile = () => {
      let token = '';
      let phone = '';
      let email = '';
      try {
        const stored = localStorage.getItem('sart_user_session');
        if (stored) {
          const parsed = JSON.parse(stored);
          token = parsed.token || '';
          phone = parsed.phone || '';
          email = parsed.email || '';
          setProfile(prev => ({
            ...prev,
            name: parsed.name || prev.name,
            phone: parsed.phone || prev.phone,
            email: parsed.email || prev.email,
            gender: parsed.gender || prev.gender,
            birthday: parsed.age ? `${parsed.age} years old` : prev.birthday,
            avatar: parsed.avatar || prev.avatar
          }));
        }
      } catch (e) { }

      // Fetch live user profile from Backend API passing token, phone, or email
      const queryParams = new URLSearchParams();
      if (token) queryParams.append('token', token);
      if (phone) queryParams.append('phone', phone);
      if (email) queryParams.append('email', email);

      fetch(`http://localhost:5000/api/user/profile?${queryParams.toString()}`)
        .then(res => res.json())
        .then(res => {
          if (res.success && res.data) {
            setProfile(prev => ({
              ...prev,
              name: res.data.name || prev.name,
              phone: res.data.phone || prev.phone,
              email: res.data.email || prev.email,
              gender: res.data.gender || prev.gender,
              birthday: res.data.birthday || prev.birthday,
              avatar: res.data.avatar || prev.avatar
            }));
          }
        })
        .catch(() => { });
    };

    loadUserProfile();

    const handleSessionChanged = () => loadUserProfile();
    window.addEventListener('user-session-changed', handleSessionChanged);
    window.addEventListener('storage', handleSessionChanged);

    const handlePhotoUpdated = (e: any) => {
      if (e.detail) {
        setProfile(prev => ({ ...prev, avatar: e.detail }));
      }
    };
    window.addEventListener('user-photo-updated', handlePhotoUpdated);
    return () => {
      window.removeEventListener('user-photo-updated', handlePhotoUpdated);
      window.removeEventListener('user-session-changed', handleSessionChanged);
      window.removeEventListener('storage', handleSessionChanged);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openEditModal = (field: string) => {
    setActiveModal(field);
    if (field === 'password') {
      setEditValues({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setEditValues({ [field]: (profile as any)[field] === 'Not set' || (profile as any)[field] === 'None added' ? '' : (profile as any)[field] });
    }
  };

  const handleSaveModal = async () => {
    if (activeModal === 'password') {
      if (!editValues.newPassword || editValues.newPassword.length < 6) {
        showToast('Password must be at least 6 characters');
        return;
      }
      if (editValues.newPassword !== editValues.confirmPassword) {
        showToast('New passwords do not match');
        return;
      }
    }

    try {
      let token = '';
      try {
        const stored = localStorage.getItem('sart_user_session');
        if (stored) {
          const parsed = JSON.parse(stored);
          token = parsed.token || '';
        }
      } catch (e) { }

      const payload = {
        token,
        name: activeModal === 'name' ? editValues.name : profile.name,
        phone: activeModal === 'phone' ? editValues.phone : profile.phone,
        email: activeModal === 'email' ? editValues.email : profile.email,
        birthday: activeModal === 'birthday' ? editValues.birthday : profile.birthday,
        gender: activeModal === 'gender' ? editValues.gender : profile.gender,
        recoveryEmail: activeModal === 'recoveryEmail' ? editValues.recoveryEmail : profile.recoveryEmail,
        ...(activeModal === 'password' ? { password: editValues.newPassword } : {})
      };

      const res = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setProfile(prev => ({ ...prev, ...data.data }));
        // Also update local storage session & notify navbar
        try {
          const stored = localStorage.getItem('sart_user_session');
          if (stored) {
            const parsed = JSON.parse(stored);
            const updated = { ...parsed, ...data.data };
            localStorage.setItem('sart_user_session', JSON.stringify(updated));
            window.dispatchEvent(new CustomEvent('user-session-changed', { detail: updated }));
          }
        } catch (e) { }
        showToast(activeModal === 'password' ? 'Password changed successfully' : 'Profile updated successfully');
      }
    } catch (e) {
      setProfile(prev => ({ ...prev, ...editValues }));
      showToast('Updated successfully');
    }
    setActiveModal(null);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setProfile(prev => ({ ...prev, avatar: base64 }));
      try {
        await fetch('http://localhost:5000/api/user/profile/photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 })
        });
        showToast('Photo uploaded successfully');
      } catch (err) {
        showToast('Photo uploaded locally');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = async () => {
    setProfile(prev => ({ ...prev, avatar: '' }));
    try {
      await fetch('http://localhost:5000/api/user/profile/photo', { method: 'DELETE' });
      showToast('Photo removed');
    } catch (err) {
      showToast('Photo removed');
    }
  };

  if (!mounted) return null;

  const initial = profile.name ? profile.name.trim().charAt(0).toUpperCase() : 'P';
  const firstName = profile.name ? profile.name.split(' ')[0].toUpperCase() : 'PICHUKA';

  return (
    <section className={`tab-screen ${activeTab === 'profile' ? 'active' : ''}`} id="tab-profile">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoSelect}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <div style={{ maxWidth: '980px', margin: '0 auto', padding: '36px 20px 60px 20px', fontFamily: 'inherit', color: '#1e293b' }}>
        {/* Toast Notification */}
        {toastMessage && (
          <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: '#0f172a', color: '#fff', padding: '12px 20px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 3000, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
            <i className="fa-solid fa-circle-check" style={{ color: '#10b981' }}></i>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header matching Screenshot 3 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', textAlign: 'center' }}>
          <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: '#e8f0fe', color: '#1a73e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '38px', fontWeight: 600, marginBottom: '16px', overflow: 'hidden', boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)' }}>
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span>{initial}</span>
            )}
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>Welcome, {firstName}</h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Manage your info, privacy, and security to make better for you.</p>
        </div>

        {/* Card 1: Basic Info matching Screenshot 2 & 3 (without NICKNAME and DISPLAY NAME) */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', marginBottom: '24px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
          <div style={{ padding: '24px 24px 12px 24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>Basic info</h2>
            <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>Some info may be visible to other people using BNX services. Click any row to update.</p>
          </div>

          <div>
            {/* Photo */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e8f0fe', color: '#1a73e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>
                  <i className="fa-solid fa-camera"></i>
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', color: '#64748b' }}>PHOTO</div>
                  <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#0f172a' }}>
                    {profile.avatar ? <img src={profile.avatar} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} /> : 'Add a photo to personalize your account'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => fileInputRef.current?.click()} style={{ border: '1px solid #cbd5e1', background: '#fff', color: '#334155', fontSize: '13px', fontWeight: 600, padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' }}>
                  CHANGE PHOTO
                </button>
                {profile.avatar && (
                  <button type="button" onClick={handleRemovePhoto} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Name */}
            <div onClick={() => openEditModal('name')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderTop: '1px solid #f1f5f9', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e8f0fe', color: '#1a73e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>
                  <i className="fa-regular fa-user"></i>
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', color: '#64748b' }}>NAME</div>
                  <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#0f172a' }}>{profile.name}</div>
                </div>
              </div>
              <i className="fa-solid fa-chevron-right" style={{ color: '#94a3b8', fontSize: '13px' }}></i>
            </div>

            {/* Birthday */}
            <div onClick={() => openEditModal('birthday')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderTop: '1px solid #f1f5f9', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e8f0fe', color: '#1a73e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>
                  <i className="fa-regular fa-calendar"></i>
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', color: '#64748b' }}>BIRTHDAY</div>
                  <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#0f172a' }}>{profile.birthday}</div>
                </div>
              </div>
              <i className="fa-solid fa-chevron-right" style={{ color: '#94a3b8', fontSize: '13px' }}></i>
            </div>

            {/* Gender */}
            <div onClick={() => openEditModal('gender')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderTop: '1px solid #f1f5f9', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e8f0fe', color: '#1a73e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>
                  <i className="fa-regular fa-face-smile"></i>
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', color: '#64748b' }}>GENDER</div>
                  <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#0f172a' }}>{profile.gender}</div>
                </div>
              </div>
              <i className="fa-solid fa-chevron-right" style={{ color: '#94a3b8', fontSize: '13px' }}></i>
            </div>

            {/* Password */}
            <div onClick={() => openEditModal('password')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderTop: '1px solid #f1f5f9', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e8f0fe', color: '#1a73e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>
                  <i className="fa-solid fa-lock"></i>
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', color: '#64748b' }}>PASSWORD</div>
                  <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#0f172a' }}>••••••••</div>
                </div>
              </div>
              <i className="fa-solid fa-chevron-right" style={{ color: '#94a3b8', fontSize: '13px' }}></i>
            </div>
          </div>
        </div>

        {/* Card 2: Contact Info matching Screenshot 2 */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', marginBottom: '24px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
          <div style={{ padding: '24px 24px 12px 24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>Contact info</h2>
            <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>Your contact information used for communication and recovery. Click to edit.</p>
          </div>

          <div>
            {/* Primary Email */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e8f0fe', color: '#1a73e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>
                  <i className="fa-regular fa-envelope"></i>
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', color: '#64748b' }}>PRIMARY EMAIL</div>
                  <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#0f172a' }}>{profile.email}</div>
                </div>
              </div>
            </div>

            {/* Recovery Email */}
            <div onClick={() => openEditModal('recoveryEmail')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderTop: '1px solid #f1f5f9', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e8f0fe', color: '#1a73e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>
                  <i className="fa-regular fa-envelope"></i>
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', color: '#64748b' }}>RECOVERY EMAIL</div>
                  <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#0f172a' }}>{profile.recoveryEmail}</div>
                </div>
              </div>
              <i className="fa-solid fa-chevron-right" style={{ color: '#94a3b8', fontSize: '13px' }}></i>
            </div>

            {/* Phone */}
            <div onClick={() => openEditModal('phone')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderTop: '1px solid #f1f5f9', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e8f0fe', color: '#1a73e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', color: '#64748b' }}>PHONE NUMBER</div>
                  <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#0f172a' }}>{profile.phone}</div>
                </div>
              </div>
              <i className="fa-solid fa-chevron-right" style={{ color: '#94a3b8', fontSize: '13px' }}></i>
            </div>
          </div>
        </div>

        {/* Modal Dialog */}
        {activeModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '16px' }} onClick={() => setActiveModal(null)}>
            <div style={{ background: '#fff', width: '100%', maxWidth: '440px', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 20px 45px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
                  {activeModal === 'name' && 'Change Name'}
                  {activeModal === 'phone' && 'Change Phone Number'}
                  {activeModal === 'password' && 'Change Password'}
                  {activeModal === 'birthday' && 'Set Birthday'}
                  {activeModal === 'gender' && 'Select Gender'}
                  {activeModal === 'recoveryEmail' && 'Set Recovery Email'}
                </h3>
                <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '16px' }}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {activeModal === 'name' && (
                  <div>
                    <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Full Name</label>
                    <input
                      type="text"
                      style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', boxSizing: 'border-box' }}
                      value={editValues.name || ''}
                      onChange={e => setEditValues({ name: e.target.value })}
                      autoFocus
                    />
                  </div>
                )}

                {activeModal === 'phone' && (
                  <div>
                    <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Phone Number</label>
                    <input
                      type="tel"
                      style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', boxSizing: 'border-box' }}
                      value={editValues.phone || ''}
                      onChange={e => setEditValues({ phone: e.target.value })}
                      autoFocus
                    />
                  </div>
                )}

                {activeModal === 'password' && (
                  <>
                    <div>
                      <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>New Password</label>
                      <input
                        type="password"
                        style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', boxSizing: 'border-box' }}
                        value={editValues.newPassword || ''}
                        onChange={e => setEditValues({ ...editValues, newPassword: e.target.value })}
                        placeholder="At least 6 characters"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Confirm Password</label>
                      <input
                        type="password"
                        style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', boxSizing: 'border-box' }}
                        value={editValues.confirmPassword || ''}
                        onChange={e => setEditValues({ ...editValues, confirmPassword: e.target.value })}
                        placeholder="Re-enter password"
                      />
                    </div>
                  </>
                )}

                {activeModal === 'birthday' && (
                  <div>
                    <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Date of Birth</label>
                    <input
                      type="date"
                      style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', boxSizing: 'border-box' }}
                      value={editValues.birthday || ''}
                      onChange={e => setEditValues({ birthday: e.target.value })}
                    />
                  </div>
                )}

                {activeModal === 'gender' && (
                  <div>
                    <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Gender</label>
                    <select
                      style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', boxSizing: 'border-box' }}
                      value={editValues.gender || 'Rather not say'}
                      onChange={e => setEditValues({ gender: e.target.value })}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary"></option>
                      <option value="Rather not say">Gender</option>
                    </select>
                  </div>
                )}

                {activeModal === 'recoveryEmail' && (
                  <div>
                    <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Recovery Email</label>
                    <input
                      type="email"
                      style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', boxSizing: 'border-box' }}
                      value={editValues.recoveryEmail || ''}
                      onChange={e => setEditValues({ recoveryEmail: e.target.value })}
                      placeholder="example@gmail.com"
                    />
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                  <button type="button" onClick={() => setActiveModal(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '8px 16px', color: '#475569', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button type="button" onClick={handleSaveModal} style={{ background: '#1a73e8', border: 'none', borderRadius: '8px', padding: '8px 18px', color: '#fff', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' }}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
