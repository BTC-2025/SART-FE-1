'use client';
import React, { useEffect, useState } from 'react';
import './WalletTab.css'; 
import { useSartStore } from '@/store/useSartStore';

export default function WalletTab() {
  const { activeTab } = useSartStore();
  const [mounted, setMounted] = useState(false);
  
  // Wallet State
  const [balance, setBalance] = useState(15000.00);
  const [points, setPoints] = useState(2450);
  const [cashback, setCashback] = useState(350.00);
  const [transactions, setTransactions] = useState<any[]>([]);

  // Form State
  const [depositAmount, setDepositAmount] = useState(5000);
  const [depositSource, setDepositSource] = useState('Visa (last 4: 4242)');
  const [transferRecipient, setTransferRecipient] = useState('rajesh.kumar@upi');
  const [transferAmount, setTransferAmount] = useState(1000);

  useEffect(() => {
    // Load state from localStorage if exists
    const saved = localStorage.getItem('sart_web_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.wallet) {
          setBalance(parsed.wallet.balance || 0);
          setPoints(parsed.wallet.points || 0);
          setCashback(parsed.wallet.cashback || 0);
          setTransactions(parsed.wallet.transactions || []);
        }
      } catch(e) {}
    } else {
      // Default transactions if no save state
      const now = new Date();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const d1 = new Date(now); d1.setDate(d1.getDate() - 1);
      const d2 = new Date(now); d2.setDate(d2.getDate() - 3);
      const d3 = new Date(now); d3.setDate(d3.getDate() - 7);
      setTransactions([
        { id: 'tx-001', title: 'Airport Taxi Booking', amount: 800.00, date: `${months[d1.getMonth()]} ${d1.getDate()}, ${d1.getFullYear()}, 10:00 AM`, isCredit: false, category: 'Ride' },
        { id: 'tx-002', title: 'Tire Air Replacement Kit', amount: 3500.00, date: `${months[d2.getMonth()]} ${d2.getDate()}, ${d2.getFullYear()}, 03:30 PM`, isCredit: false, category: 'Store' },
        { id: 'tx-003', title: 'Visa Top-up Loaded', amount: 10000.00, date: `${months[d3.getMonth()]} ${d3.getDate()}, ${d3.getFullYear()}, 09:15 AM`, isCredit: true, category: 'Deposit' }
      ]);
    }
    setMounted(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!mounted) return;
    const saved = localStorage.getItem('sart_web_state');
    let parsed = {};
    if (saved) {
      try { parsed = JSON.parse(saved); } catch(e) {}
    }
    parsed = {
      ...parsed,
      wallet: { balance, points, cashback, transactions }
    };
    localStorage.setItem('sart_web_state', JSON.stringify(parsed));
  }, [balance, points, cashback, transactions, mounted]);

  const claimCashbackMoney = () => {
    if (cashback <= 0) {
      alert("No cashback available to claim.");
      return;
    }
    setBalance(prev => prev + cashback);
    
    const tx = {
      id: 'tx-' + Math.random().toString(36).substring(2,9),
      title: 'Cashback Claimed',
      amount: cashback,
      date: new Date().toLocaleString(),
      isCredit: true,
      category: 'System'
    };
    setTransactions(prev => [tx, ...prev]);
    setCashback(0);
    alert("Cashback claimed successfully!");
  };

  const executeWalletPageDeposit = () => {
    if (depositAmount <= 0) {
      alert("Please enter a valid deposit amount.");
      return;
    }
    setBalance(prev => prev + depositAmount);
    
    const tx = {
      id: 'tx-' + Math.random().toString(36).substring(2,9),
      title: 'Funds Deposited via ' + depositSource.split(' ')[0],
      amount: depositAmount,
      date: new Date().toLocaleString(),
      isCredit: true,
      category: 'Deposit'
    };
    setTransactions(prev => [tx, ...prev]);
    setDepositAmount(0);
    alert(`Successfully deposited ₹${depositAmount.toFixed(2)}`);
  };

  const executeWalletPageTransfer = () => {
    if (transferAmount <= 0) {
      alert("Please enter a valid transfer amount.");
      return;
    }
    if (balance < transferAmount) {
      alert("Insufficient wallet balance for this transfer!");
      return;
    }
    setBalance(prev => prev - transferAmount);
    
    const tx = {
      id: 'tx-' + Math.random().toString(36).substring(2,9),
      title: 'Transfer to ' + transferRecipient,
      amount: transferAmount,
      date: new Date().toLocaleString(),
      isCredit: false,
      category: 'Transfer'
    };
    setTransactions(prev => [tx, ...prev]);
    setTransferAmount(0);
    alert(`Successfully transferred ₹${transferAmount.toFixed(2)} to ${transferRecipient}`);
  };

  if (!mounted) return null;


  return (
    <section className={`tab-screen ${activeTab === 'wallet' ? 'active' : ''}`} id="tab-wallet">
      <div className="wallet-page-layout">
        
        <div className="wallet-dashboard-col">
          <div className="dashboard-card wallet-card-wide">
            <div className="wallet-page-header">
              <h2>Super Wallet Dashboard</h2>
              <span className="gold-tier-badge">GOLD ELITE MEMBER</span>
            </div>
            
            <div className="wallet-page-metrics">
              <div className="wallet-metric-box">
                <span className="lbl">Available Balance</span>
                <h1 className="val">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>
                <span className="subtext">Secure escrow holding</span>
              </div>
              <div className="wallet-metric-box">
                <span className="lbl">Loyalty Points</span>
                <h1 className="val" style={{ color: 'var(--secondary)' }}>{points.toLocaleString('en-IN')} pts</h1>
                <span className="subtext">Claim details under profile</span>
              </div>
              <div className="wallet-metric-box">
                <span className="lbl">Accumulated Cashback</span>
                <h1 className="val" style={{ color: 'var(--success)' }}>₹{cashback.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>
                <button className="claim-btn" onClick={claimCashbackMoney}>Claim to Balance</button>
              </div>
            </div>
          </div>

          {/* Wallet Forms row */}
          <div className="wallet-forms-row">
            <div className="dashboard-card" style={{ flex: 1 }}>
              <h3><i className="fa-solid fa-plus" style={{ color: 'var(--success)' }}></i> Load Funds</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Add instant digital currency to your wallet balance.</p>
              
              <div className="form-group">
                <label>Amount to Deposit (INR)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={depositAmount || ''}
                  onChange={e => setDepositAmount(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label>Payment Source Card</label>
                <select 
                  className="input-field select-field" 
                  value={depositSource}
                  onChange={e => setDepositSource(e.target.value)}
                >
                  <option value="Visa (last 4: 4242)">Visa •••• 4242</option>
                  <option value="Mastercard (last 4: 8839)">Mastercard •••• 8839</option>
                </select>
              </div>
              <button className="action-btn" onClick={executeWalletPageDeposit}>Process Deposit</button>
            </div>

            <div className="dashboard-card" style={{ flex: 1 }}>
              <h3><i className="fa-solid fa-paper-plane" style={{ color: 'var(--primary)' }}></i> Send Money (UPI)</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Transfer funds immediately to any UPI ID or account number.</p>
              
              <div className="form-group">
                <label>Recipient Address</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="upi-id@bank or account no" 
                  value={transferRecipient}
                  onChange={e => setTransferRecipient(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Amount to Send (INR)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={transferAmount || ''}
                  onChange={e => setTransferAmount(Number(e.target.value))}
                />
              </div>
              <button className="action-btn" onClick={executeWalletPageTransfer}>Transfer Funds</button>
            </div>
          </div>
        </div>

        <div className="wallet-history-col">
          <div className="dashboard-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3>Recent Transaction Registry</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '14px' }}>Audit log of recent wallet charges and top-ups.</p>
            <div className="transactions-full-list" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <div key={tx.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', background: tx.isCredit ? '#dcfce7' : '#f1f5f9', color: tx.isCredit ? '#10b981' : '#64748b' }}>
                        <i className={`fa-solid ${tx.isCredit ? 'fa-arrow-down' : 'fa-arrow-up'}`}></i>
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>{tx.title}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{tx.date} • {tx.category}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: tx.isCredit ? '#10b981' : '#1e293b' }}>
                      {tx.isCredit ? '+' : '-'}₹{(Number(tx.amount) || 0).toFixed(2)}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: '14px' }}>
                  <i className="fa-solid fa-receipt" style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.5 }}></i><br/>
                  No recent transactions.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
