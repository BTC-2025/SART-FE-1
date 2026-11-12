'use client';

import React, { useState, useEffect } from 'react';

export default function CaptainWalletPage({ partnerDetails, onBackToHome }) {
  const [balance, setBalance] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [yesterdayEarnings, setYesterdayEarnings] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalCompletedRides, setTotalCompletedRides] = useState(0);
  const [dailyHistory, setDailyHistory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Withdrawal form state
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('UPI'); // 'UPI' or 'Bank'
  const [upiId, setUpiId] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawMsg, setWithdrawMsg] = useState(null);

  const phone = partnerDetails?.mobile || partnerDetails?.phone || '';
  const captainId = partnerDetails?.id || '';
  const name = partnerDetails?.name || '';

  const fetchWalletAndEarnings = async () => {
    try {
      setLoading(true);
      const query = `?phone=${encodeURIComponent(phone)}&captainId=${encodeURIComponent(captainId)}&name=${encodeURIComponent(name)}`;

      // 1. Fetch captain-earnings breakdown
      const earnRes = await fetch(`http://localhost:5000/api/rides/captain-earnings${query}`);
      if (earnRes.ok) {
        const earnData = await earnRes.json();
        if (earnData.success) {
          setTodayEarnings(earnData.todayEarnings || 0);
          setYesterdayEarnings(earnData.yesterdayEarnings || 0);
          setTotalEarnings(earnData.totalEarnings || 0);
          setTotalCompletedRides(earnData.totalCompletedRides || 0);
          setDailyHistory(earnData.dailyHistory || []);
        }
      }

      // 2. Fetch wallet balance & transactions
      const walRes = await fetch(`http://localhost:5000/api/wallet/captain${query}`);
      if (walRes.ok) {
        const walData = await walRes.json();
        if (walData.success && walData.wallet) {
          setBalance(walData.wallet.balance || 0);
          setTransactions(walData.wallet.transactions || []);
        }
      }
    } catch (err) {
      console.warn('Error fetching wallet/earnings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletAndEarnings();
  }, [phone, captainId, name]);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setWithdrawMsg(null);
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt <= 0) {
      setWithdrawMsg({ type: 'error', text: 'Please enter a valid amount greater than ₹0.' });
      return;
    }
    if (amt > balance) {
      setWithdrawMsg({ type: 'error', text: `Insufficient balance! Your available balance is ₹${balance.toFixed(2)}.` });
      return;
    }

    if (payoutMethod === 'UPI' && !upiId.trim()) {
      setWithdrawMsg({ type: 'error', text: 'Please enter a valid UPI ID (e.g. yourname@oksbi).' });
      return;
    }

    if (payoutMethod === 'Bank' && (!accountNumber.trim() || !ifsc.trim())) {
      setWithdrawMsg({ type: 'error', text: 'Please provide both Bank Account Number and IFSC Code.' });
      return;
    }

    try {
      setWithdrawLoading(true);
      const res = await fetch('http://localhost:5000/api/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          captainId,
          amount: amt,
          paymentMethod: payoutMethod,
          upiId: payoutMethod === 'UPI' ? upiId.trim() : undefined,
          accountNumber: payoutMethod === 'Bank' ? accountNumber.trim() : undefined,
          ifsc: payoutMethod === 'Bank' ? ifsc.trim().toUpperCase() : undefined,
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setWithdrawMsg({ type: 'success', text: `₹${amt} withdrawn successfully to your ${payoutMethod}! Available balance updated.` });
        setWithdrawAmount('');
        // Refresh wallet
        fetchWalletAndEarnings();
      } else {
        setWithdrawMsg({ type: 'error', text: data.message || 'Withdrawal failed. Please try again.' });
      }
    } catch (err) {
      setWithdrawMsg({ type: 'error', text: 'Network error processing withdrawal.' });
    } finally {
      setWithdrawLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px', color: '#0f172a' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            type="button"
            onClick={onBackToHome}
            style={{
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#0f172a',
              fontSize: '16px'
            }}
            title="Back to Duty Map"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              <i className="fa-solid fa-wallet" style={{ color: '#2563eb', marginRight: '10px' }}></i>
              Captain Wallet & Earnings
            </h1>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748b' }}>
              Earnings for <strong style={{ color: '#0f172a' }}>{partnerDetails?.name || 'Captain Partner'}</strong> ({phone || 'No phone registered'})
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchWalletAndEarnings}
          style={{
            background: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: '12px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#334155'
          }}
        >
          <i className={`fa-solid fa-arrows-rotate ${loading ? 'fa-spin' : ''}`}></i> Refresh
        </button>
      </div>

      {/* Top Metric Cards: Balance, Today, Yesterday, Total */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {/* Wallet Balance */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          color: '#ffffff',
          borderRadius: '18px',
          padding: '20px 22px',
          boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)'
        }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', opacity: 0.85, letterSpacing: '0.6px' }}>
            Available Wallet Balance
          </div>
          <div style={{ fontSize: '30px', fontWeight: 900, margin: '8px 0 4px' }}>
            ₹{balance.toFixed(2)}
          </div>
          <div style={{ fontSize: '11.5px', opacity: 0.9 }}>
            Eligible for instant withdrawal anytime
          </div>
        </div>

        {/* Today's Earnings */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #e2e8f0',
          borderRadius: '18px',
          padding: '20px 22px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.6px' }}>
            Today's Earnings
          </div>
          <div style={{ fontSize: '30px', fontWeight: 900, color: '#059669', margin: '8px 0 4px' }}>
            ₹{todayEarnings.toFixed(2)}
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748b' }}>
            Earned fare today
          </div>
        </div>

        {/* Yesterday's Earnings */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #e2e8f0',
          borderRadius: '18px',
          padding: '20px 22px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.6px' }}>
            Yesterday's Earnings
          </div>
          <div style={{ fontSize: '30px', fontWeight: 900, color: '#2563eb', margin: '8px 0 4px' }}>
            ₹{yesterdayEarnings.toFixed(2)}
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748b' }}>
            Earned fare yesterday
          </div>
        </div>

        {/* Total Earnings */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #e2e8f0',
          borderRadius: '18px',
          padding: '20px 22px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.6px' }}>
            Total Earned
          </div>
          <div style={{ fontSize: '30px', fontWeight: 900, color: '#0f172a', margin: '8px 0 4px' }}>
            ₹{totalEarnings.toFixed(2)}
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748b' }}>
            Across {totalCompletedRides} completed rides
          </div>
        </div>
      </div>

      {/* Main Grid: Withdraw Form on Left, Daily Breakdown on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 400px) 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Withdraw Money Card */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #e2e8f0',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 8px', color: '#0f172a' }}>
            <i className="fa-solid fa-money-bill-transfer" style={{ color: '#059669', marginRight: '8px' }}></i>
            Withdraw Money
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 18px' }}>
            Transfer earnings instantly to your bank account or UPI ID.
          </p>

          {withdrawMsg && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '16px',
              background: withdrawMsg.type === 'success' ? '#f0fdf4' : '#fef2f2',
              color: withdrawMsg.type === 'success' ? '#166534' : '#991b1b',
              border: `1px solid ${withdrawMsg.type === 'success' ? '#bbf7d0' : '#fecaca'}`
            }}>
              {withdrawMsg.text}
            </div>
          )}

          <form onSubmit={handleWithdraw}>
            {/* Amount input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Amount to Withdraw (₹)
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '10px', fontWeight: 800, color: '#64748b' }}>₹</span>
                <input
                  type="number"
                  min="1"
                  step="any"
                  placeholder="e.g. 500"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 32px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '15px',
                    fontWeight: 700,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                {[100, 500, 1000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setWithdrawAmount(String(amt))}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      background: '#f8fafc',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      color: '#475569'
                    }}
                  >
                    +₹{amt}
                  </button>
                ))}
                {balance > 0 && (
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(String(Math.floor(balance)))}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      background: '#f8fafc',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      color: '#2563eb'
                    }}
                  >
                    Max (₹{Math.floor(balance)})
                  </button>
                )}
              </div>
            </div>

            {/* Payout Method selection */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Payout Destination
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setPayoutMethod('UPI')}
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    border: `2px solid ${payoutMethod === 'UPI' ? '#2563eb' : '#e2e8f0'}`,
                    background: payoutMethod === 'UPI' ? '#eff6ff' : '#ffffff',
                    color: payoutMethod === 'UPI' ? '#1d4ed8' : '#64748b',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <i className="fa-solid fa-mobile-screen"></i> UPI ID
                </button>
                <button
                  type="button"
                  onClick={() => setPayoutMethod('Bank')}
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    border: `2px solid ${payoutMethod === 'Bank' ? '#2563eb' : '#e2e8f0'}`,
                    background: payoutMethod === 'Bank' ? '#eff6ff' : '#ffffff',
                    color: payoutMethod === 'Bank' ? '#1d4ed8' : '#64748b',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <i className="fa-solid fa-building-columns"></i> Bank Account
                </button>
              </div>
            </div>

            {/* UPI Details */}
            {payoutMethod === 'UPI' ? (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  UPI Virtual Payment Address (VPA)
                </label>
                <input
                  type="text"
                  placeholder="e.g. mobile@upi or name@oksbi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            ) : (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1234567890"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SBIN0001234"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      textTransform: 'uppercase',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={withdrawLoading || balance <= 0}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: balance <= 0 ? '#94a3b8' : '#059669',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 800,
                cursor: balance <= 0 || withdrawLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: balance > 0 ? '0 4px 14px rgba(5, 150, 105, 0.3)' : 'none'
              }}
            >
              {withdrawLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Processing...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane"></i> Withdraw Now
                </>
              )}
            </button>
          </form>

          {/* Recent Withdrawals / Transactions */}
          <div style={{ marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#475569', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Recent Transactions
            </h3>
            {transactions.length === 0 ? (
              <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
                No recent transactions yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                {transactions.slice(0, 5).map((t, i) => (
                  <div
                    key={t.id || i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{t.description || t.type}</div>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>
                        {t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                      </div>
                    </div>
                    <div style={{
                      fontWeight: 800,
                      color: t.type === 'DEBIT' ? '#dc2626' : '#16a34a'
                    }}>
                      {t.type === 'DEBIT' ? '-' : '+'}₹{Number(t.amount || 0).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Daily Breakdown Section: "in which day howmay ride he compted and howmuch he get the total day with date and total amout for that caiton" */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #e2e8f0',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px', color: '#0f172a' }}>
            <i className="fa-solid fa-calendar-days" style={{ color: '#2563eb', marginRight: '8px' }}></i>
            Daily Rides & Earnings Breakdown
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 20px' }}>
            Day-by-day record of how many rides completed and total amount earned for this captain.
          </p>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
              <i className="fa-solid fa-spinner fa-spin fa-2x" style={{ marginBottom: '12px', color: '#2563eb' }}></i>
              <div>Loading your earnings record...</div>
            </div>
          ) : dailyHistory.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '48px 20px',
              background: '#f8fafc',
              borderRadius: '16px',
              border: '1.5px dashed #cbd5e1'
            }}>
              <i className="fa-solid fa-road" style={{ fontSize: '38px', color: '#94a3b8', marginBottom: '12px' }}></i>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px', color: '#334155' }}>
                No Completed Rides Yet
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '380px', margin: '0 auto 16px' }}>
                When you go On Duty and complete ride requests, each day's completed ride count and total earnings will appear here.
              </p>
              <button
                type="button"
                onClick={onBackToHome}
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '9px 18px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Go to Radar Map & Accept Rides
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {dailyHistory.map((item, idx) => {
                const dateObj = new Date(item.date);
                const formattedDate = !isNaN(dateObj.getTime())
                  ? dateObj.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
                  : item.date;

                return (
                  <div
                    key={item.date || idx}
                    style={{
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '16px 20px',
                      background: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        background: '#eff6ff',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px'
                      }}>
                        <i className="fa-solid fa-calendar-day"></i>
                      </div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                          {formattedDate}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                          <span style={{
                            display: 'inline-block',
                            background: '#f1f5f9',
                            color: '#334155',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontWeight: 700,
                            marginRight: '6px'
                          }}>
                            {item.rideCount} {item.rideCount === 1 ? 'Ride' : 'Rides'} Completed
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                        Total Day Earnings
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 900, color: '#059669' }}>
                        ₹{Number(item.totalAmount || 0).toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

