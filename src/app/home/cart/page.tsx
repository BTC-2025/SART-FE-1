'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';
import UserSideBitTool from '@/components/UserSideBitTool';
import { useSartStore } from '@/store/useSartStore';
import { ALL_STORE_PRODUCTS } from '@/components/tabs/StoreTab';
import './CartPage.css';

export default function CartPage() {
  const {
    cart,
    wishlist,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    toggleWishlist,
    clearWishlist,
    cleanExpiredCart,
    addToCart,
    wallet,
    updateBalance,
    addTransaction
  } = useSartStore();

  const [userSession, setUserSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'cart' | 'wishlist'>('cart');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Check login and clean expired guest items
  useEffect(() => {
    cleanExpiredCart();

    const checkSession = () => {
      try {
        const stored = localStorage.getItem('sart_user_session');
        if (stored) {
          setUserSession(JSON.parse(stored));
        } else {
          setUserSession(null);
        }
      } catch (e) {
        setUserSession(null);
      }
    };

    checkSession();
    window.addEventListener('user-session-changed', checkSession);
    return () => window.removeEventListener('user-session-changed', checkSession);
  }, [cleanExpiredCart]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const isGuest = !userSession;

  // Subtotal & savings calculation
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountTotal = subtotal * 0.10; // 10% instant promo discount
  const finalTotal = Math.max(0, subtotal - discountTotal);

  // Wishlist items populated with full details
  const wishlistItems = (wishlist || []).map((id) => {
    const product = ALL_STORE_PRODUCTS.find((p) => p.id === id);
    if (product) {
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        icon: product.icon || 'fa-box',
        category: product.category,
      };
    }
    // Fallback item definition if added from custom source
    return {
      id,
      name: `Saved Item (${id})`,
      price: 999,
      icon: 'fa-heart',
      category: 'Saved Wishlist',
    };
  });

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast('Cart is empty!');
      return;
    }
    if (wallet.balance < finalTotal) {
      showToast(`Insufficient Wallet Balance! You need ₹${finalTotal.toLocaleString('en-IN')}`);
      return;
    }

    updateBalance(finalTotal, false);
    addTransaction({
      id: `tx-${Date.now()}`,
      title: `Checkout: ${cart.length} item(s)`,
      amount: finalTotal,
      date: new Date().toLocaleString(),
      isCredit: false,
      category: 'Store'
    });

    clearCart();
    showToast(`Order placed successfully! ₹${finalTotal.toLocaleString('en-IN')} paid via SART Wallet.`);
  };

  const handleMoveToWishlist = (item: any) => {
    removeFromCart(item.id);
    if (!wishlist.includes(item.id)) {
      toggleWishlist(item.id);
    }
    showToast(`Moved "${item.name}" to Wishlist.`);
  };

  const handleMoveToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      icon: item.icon || 'fa-box',
      category: item.category || 'General',
      quantity: 1,
    });
    toggleWishlist(item.id);
    showToast(`Added "${item.name}" to cart.`);
  };

  return (
    <div className="web-app-layout">
      <Navbar />
      <SubNavbar />
      <UserSideBitTool isOpen={false} />

      <main className="cart-page-main">
        {/* Toast Alert */}
        {toastMsg && (
          <div className="cart-page-toast">
            <i className="fa-solid fa-circle-check"></i>
            <span>{toastMsg}</span>
          </div>
        )}

        <div className="cart-page-container">
          {/* Header Banner */}
          <div className="cart-page-header">
            <div className="cart-header-title-box">
              <h1 className="cart-main-title">
                <i className="fa-solid fa-bag-shopping"></i> My Cart
              </h1>
              <p className="cart-sub-title">
                {isGuest ? (
                  <span>
                  </span>
                ) : (
                  <span className="user-badge-success">
                    <i className="fa-solid fa-shield-check"></i> Logged In as {userSession.name || 'User'}
                  </span>
                )}
              </p>
            </div>


          </div>

          {/* VIEW 1: SHOPPING CART */}
          {activeTab === 'cart' && (
            <div className="cart-layout-grid">
              {/* Left Column: Cart Items List */}
              <div className="cart-items-section">
                <div className="cart-section-top">
                  <span className="cart-items-count">
                    {cart.length} {cart.length === 1 ? 'Item' : 'Items'} in your cart
                  </span>
                  {cart.length > 0 && (
                    <button
                      type="button"
                      className="cart-clear-all-btn"
                      onClick={() => {
                        if (confirm('Are you sure you want to remove all items from your cart?')) {
                          clearCart();
                          showToast('Cart cleared successfully.');
                        }
                      }}
                    >
                      <i className="fa-solid fa-trash-can"></i> Remove All
                    </button>
                  )}
                </div>

                {cart.length === 0 ? (
                  <div className="cart-empty-state">
                    <div className="cart-empty-icon">
                      <i className="fa-solid fa-cart-shopping"></i>
                    </div>
                    <h3>Your shopping cart is empty</h3>
                    <p>Browse our verified auto parts, helmets, accessories, and book rides seamlessly.</p>
                    <div className="cart-empty-actions">
                      <button
                        type="button"
                        className="btn-primary-explore"
                        onClick={() => window.location.href = '/store'}
                      >
                        <i className="fa-solid fa-store"></i> Explore SART Store
                      </button>
                      <button
                        type="button"
                        className="btn-secondary-explore"
                        onClick={() => setActiveTab('wishlist')}
                      >
                        <i className="fa-solid fa-heart"></i> View Wishlist ({wishlistItems.length})
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="cart-items-list">
                    {cart.map((item) => {
                      const itemTotal = item.price * item.quantity;
                      const addedTime = item.savedAt ? new Date(item.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently';

                      return (
                        <div key={item.id} className="cart-item-card">
                          <div className="cart-item-img-box">
                            <i className={`fa-solid ${item.icon || 'fa-box'}`}></i>
                          </div>

                          <div className="cart-item-info">
                            <h3 className="cart-item-name">{item.name}</h3>
                            <span className="cart-item-category">{item.category || 'Automotive & Mobility'}</span>
                            <div className="cart-item-meta">
                              {isGuest ? (
                                <span className="">
                                </span>
                              ) : (
                                <span className="meta-saved-tag">
                                  <i className="fa-solid fa-cloud"></i> Saved to Account
                                </span>
                              )}
                              <span className="meta-time-tag">Added: {addedTime}</span>
                            </div>
                          </div>

                          {/* Quantity Selector */}
                          <div className="cart-item-quantity-box">
                            <span className="qty-label">Quantity</span>
                            <div className="qty-controls">
                              <button
                                type="button"
                                className="qty-btn"
                                onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))}
                              >
                                <i className="fa-solid fa-minus"></i>
                              </button>
                              <span className="qty-value">{item.quantity}</span>
                              <button
                                type="button"
                                className="qty-btn"
                                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              >
                                <i className="fa-solid fa-plus"></i>
                              </button>
                            </div>
                          </div>

                          {/* Price & Actions */}
                          <div className="cart-item-price-box">
                            <span className="cart-price-primary">₹{itemTotal.toLocaleString('en-IN')}</span>
                            <span className="cart-price-unit">₹{item.price.toLocaleString('en-IN')} each</span>

                            <div className="cart-item-actions">
                              <button
                                type="button"
                                className="btn-action-save"
                                onClick={() => handleMoveToWishlist(item)}
                                title="Move to Wishlist"
                              >
                                <i className="fa-regular fa-heart"></i> Save for later
                              </button>
                              <button
                                type="button"
                                className="btn-action-remove"
                                onClick={() => {
                                  removeFromCart(item.id);
                                  showToast(`Removed "${item.name}" from cart.`);
                                }}
                                title="Remove item"
                              >
                                <i className="fa-solid fa-trash-can"></i> Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Order Summary & Checkout */}
              {cart.length > 0 && (
                <div className="cart-summary-section">
                  <div className="cart-summary-card">
                    <h3 className="summary-title">Order Summary</h3>

                    <div className="summary-row">
                      <span>Items Subtotal</span>
                      <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="summary-row discount">
                      <span>Instant Promo (10% OFF)</span>
                      <span>-₹{discountTotal.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="summary-row">
                      <span>Standard Delivery</span>
                      <span className="free-tag">FREE</span>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-row total">
                      <span>Total Amount</span>
                      <span className="total-amount">₹{finalTotal.toLocaleString('en-IN')}</span>
                    </div>

                    {/* SART Wallet Balance Box */}
                    <div className="wallet-status-box">
                      <div className="wallet-status-info">
                        <i className="fa-solid fa-wallet"></i>
                        <div>
                          <span className="wallet-lbl">SART Wallet Balance</span>
                          <strong className="wallet-val">₹{wallet.balance.toLocaleString('en-IN')}</strong>
                        </div>
                      </div>
                      {wallet.balance < finalTotal && (
                        <span className="wallet-warning">
                          <i className="fa-solid fa-circle-exclamation"></i> Low balance
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      className="btn-checkout-primary"
                      onClick={handleCheckout}
                    >
                      <i className="fa-solid fa-lock"></i> Proceed to Checkout
                    </button>

                    <div className="summary-guarantee">
                      <i className="fa-solid fa-shield-halved"></i> 100% Safe & Secure Payments via SART Universal Gateway
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: WISHLIST (SAVED ITEMS) */}
          {activeTab === 'wishlist' && (
            <div className="wishlist-section">
              <div className="cart-section-top">
                <span className="cart-items-count">
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'} saved in Wishlist
                </span>
                {wishlistItems.length > 0 && (
                  <button
                    type="button"
                    className="cart-clear-all-btn"
                    onClick={() => {
                      if (confirm('Are you sure you want to clear your entire wishlist?')) {
                        clearWishlist();
                        showToast('Wishlist cleared.');
                      }
                    }}
                  >
                    <i className="fa-solid fa-trash-can"></i> Remove All
                  </button>
                )}
              </div>

              {wishlistItems.length === 0 ? (
                <div className="cart-empty-state">
                  <div className="cart-empty-icon heart">
                    <i className="fa-solid fa-heart"></i>
                  </div>
                  <h3>Your Wishlist is Empty</h3>
                  <p>Save items you like by clicking the heart icon on any product or service.</p>
                  <button
                    type="button"
                    className="btn-primary-explore"
                    onClick={() => window.location.href = '/store'}
                  >
                    <i className="fa-solid fa-store"></i> Browse Store
                  </button>
                </div>
              ) : (
                <div className="wishlist-grid">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="wishlist-card">
                      <button
                        type="button"
                        className="wishlist-remove-icon-btn"
                        onClick={() => {
                          toggleWishlist(item.id);
                          showToast(`Removed "${item.name}" from wishlist.`);
                        }}
                        title="Remove from wishlist"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>

                      <div className="wishlist-img-box">
                        <i className={`fa-solid ${item.icon}`}></i>
                      </div>

                      <div className="wishlist-body">
                        <h4 className="wishlist-title">{item.name}</h4>
                        <span className="wishlist-category">{item.category}</span>
                        <div className="wishlist-price">₹{item.price.toLocaleString('en-IN')}</div>
                      </div>

                      <div className="wishlist-footer">
                        <button
                          type="button"
                          className="btn-move-to-cart"
                          onClick={() => handleMoveToCart(item)}
                        >
                          <i className="fa-solid fa-bag-shopping"></i> Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

