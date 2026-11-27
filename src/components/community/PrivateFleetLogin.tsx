'use client';

import React, { useState } from 'react';

interface PrivateFleetLoginProps {
  onLoginSuccess: (user: { company: string; email: string; phone: string; role: string }) => void;
}

export default function PrivateFleetLogin({ onLoginSuccess }: PrivateFleetLoginProps) {
  const [pEmail, setPEmail] = useState('');
  const [pPassword, setPPassword] = useState('');
  const [pCompany, setPCompany] = useState('');
  const [pLoginMode, setPLoginMode] = useState<'signin' | 'register'>('signin');
  const [pError, setPError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pEmail || !pPassword) {
      setPError('Please enter both Email / Corporate ID and Password.');
      return;
    }
    setPError('');
    onLoginSuccess({
      company: pCompany.trim() || 'LogiTrans National Fleet',
      email: pEmail.trim(),
      phone: '+91 98401 23456',
      role: 'Operations Director'
    });
  };

  return (
    <div
      className="fade-in"
      style={{
        maxWidth: '480px',
        margin: '20px auto',
        background: '#ffffff',
        border: '1.5px solid #e2e8f0',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 20px 40px -15px rgba(139, 92, 246, 0.12)'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
            color: '#8b5cf6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            margin: '0 auto 16px',
            boxShadow: '0 8px 16px rgba(139, 92, 246, 0.2)'
          }}
        >
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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#8b5cf6', color: '#ffffff', fontSize: '15px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 16px -4px rgba(139, 92, 246, 0.4)' }}
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
  );
}
