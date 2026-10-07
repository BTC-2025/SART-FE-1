'use client';
import React, { useEffect, useState } from 'react';
import { useSartStore } from '@/store/useSartStore';
import './CartModal.css';

export default function CartModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, removeFromCart, updateCartQuantity, clearCart, wallet, updateBalance, addTransaction } = useSartStore();

  useEffect(() => {
    const handleOpen = (e: any) => {
      if (e.detail === 'modal-cart') setIsOpen(true);
    };
    window.addEventListener('openReactModal', handleOpen);
    return () => window.removeEventListener('openReactModal', handleOpen);
  }, []);

  const close = () => setIsOpen(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // Fake "savings" logic for visual flair matching the modern cart style
  const savedTotal = subtotal * 0.15; // 15% fake savings
  const originalTotal = subtotal + savedTotal;

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }
    
    if (wallet.balance < subtotal) {
      alert(`Insufficient Wallet Balance! You need ₹${subtotal.toFixed(2)}`);
      return;
    }

    // Deduct balance
    updateBalance(subtotal, false);
    addTransaction({
      id: `tx-${Date.now()}`,
      title: 'Store Checkout: ' + cart.length + ' Items',
      amount: subtotal,
      date: new Date().toLocaleString(),
      isCredit: false,
      category: 'Store'
    });
    
    clearCart();
    
    alert(`Checkout successful! ₹${subtotal.toFixed(2)} deducted from your wallet.`);
    close();
  };

  return (
    <div className={`cart-drawer-overlay ${isOpen ? 'show' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="cart-drawer">
        
        <div className="cart-drawer-header">
          <h2>YOUR CART ({cart.length})</h2>
          <button className="cart-drawer-close" onClick={close}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="cart-promo-banner">
          Extra 5% off on SART Wallet payments.
        </div>

        {cart.length > 0 && (
          <div className="cart-progress-section">
            <div className="cart-progress-steps">
              <div className="cart-step active">
                <div className="cart-step-icon"><i className="fa-solid fa-check"></i></div>
                <div className="cart-step-label">SAVINGS</div>
              </div>
              <div className="cart-step active">
                <div className="cart-step-icon"><i className="fa-solid fa-check"></i></div>
                <div className="cart-step-label">DEALS</div>
              </div>
              <div className="cart-step">
                <div className="cart-step-icon"><i className="fa-solid fa-gift"></i></div>
                <div className="cart-step-label">SUPERDEALS</div>
              </div>
              <div className="cart-step">
                <div className="cart-step-icon"><i className="fa-solid fa-star"></i></div>
                <div className="cart-step-label">MAX</div>
              </div>
            </div>
            <div className="cart-progress-track">
              <div className="cart-progress-fill" style={{ width: '50%' }}></div>
            </div>
            <div className="cart-progress-msg">
              Add ₹800 more to unlock SUPERDEALS!
            </div>
          </div>
        )}

        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '60px 0' }}>
              <i className="fa-solid fa-basket-shopping" style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '16px' }}></i>
              <p style={{ margin: 0, fontSize: '15px' }}>Your cart is empty.</p>
            </div>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} className="cart-product-card">
                  <div className="cart-product-top">
                    <div className="cart-product-img">
                      <i className={`fa-solid ${item.icon || 'fa-box'}`}></i>
                    </div>
                    <div className="cart-product-info">
                      <h4 className="cart-product-title">{item.name}</h4>
                      <p className="cart-product-category">{item.category}</p>
                    </div>
                    <div className="cart-product-price-col">
                      <span className="cart-product-price">₹{item.price.toLocaleString('en-IN')}</span>
                      <span className="cart-product-old-price">₹{(item.price * 1.15).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>
                  
                  <div className="cart-product-controls">
                    <button className="cart-del-btn" onClick={() => removeFromCart(item.id)}>
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                    <div className="cart-qty-selector">
                      <button className="cart-qty-btn" onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))}>-</button>
                      <span className="cart-qty-val">{item.quantity}</span>
                      <button className="cart-qty-btn" onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="cart-offers-box">
                <div className="cart-offer-left">
                  <i className="fa-solid fa-tags"></i>
                  <div className="cart-offer-details">
                    <span className="cart-offer-saved">₹{savedTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })} savings</span>
                    <span className="cart-offer-code">with 'SARTWALLET' <i className="fa-solid fa-check"></i></span>
                  </div>
                </div>
                <div className="cart-offer-action">
                  Remove
                </div>
              </div>

              <div className="cart-upsell">
                <h4 className="cart-upsell-title">You might also like</h4>
                <div className="cart-upsell-scroll">
                  <div className="cart-upsell-card">
                    <div className="cart-upsell-img"><i className="fa-solid fa-spray-can"></i></div>
                    <h5 className="cart-upsell-name">Premium Microfiber Cloth</h5>
                    <span className="cart-upsell-price">₹269</span>
                    <button className="cart-upsell-btn"><i className="fa-solid fa-plus"></i> ADD</button>
                  </div>
                  <div className="cart-upsell-card">
                    <div className="cart-upsell-img"><i className="fa-solid fa-spray-can-sparkles"></i></div>
                    <h5 className="cart-upsell-name">Neo Air Freshener</h5>
                    <span className="cart-upsell-price">₹449</span>
                    <button className="cart-upsell-btn"><i className="fa-solid fa-plus"></i> ADD</button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-footer-totals">
              <div className="cart-footer-totals-left">
                <i className="fa-solid fa-receipt"></i>
                Estimated total
              </div>
              <div className="cart-footer-totals-right">
                <div className="cart-total-final">
                  <span className="cart-total-old">₹{originalTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="cart-total-saved">
                  You saved ₹{savedTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}!
                </div>
              </div>
            </div>
            
            <button className="cart-checkout-btn" onClick={handleCheckout}>
              <span>Checkout</span>
              <div className="cart-pay-icons">
                <i className="fa-brands fa-google-pay"></i>
                <i className="fa-brands fa-cc-visa"></i>
                <i className="fa-solid fa-wallet"></i>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
