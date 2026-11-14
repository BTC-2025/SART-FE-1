'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';
import UserSideBitTool from '@/components/UserSideBitTool';
import CitySelectorModal from '@/components/modals/CitySelectorModal';
import { useSartStore } from '@/store/useSartStore';
import { ALL_STORE_PRODUCTS } from '@/components/tabs/StoreTab';
import { DEFAULT_CART_ITEMS } from './defaultCartData';
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
    addTransaction,
    isBitToolOpen
  } = useSartStore();

  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [activeBitToolPanel, setActiveBitToolPanel] = useState<string | null>(null);
  const [userSession, setUserSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'cart' | 'wishlist' | 'address' | 'payment' | 'order-success'>('cart');
  const [selectedAddress, setSelectedAddress] = useState<string>('addr_1');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressDetails, setAddressDetails] = useState<{
    id?: string;
    name: string;
    addressLine: string;
    phone: string;
  } | null>({
    name: 'P. Vasanth Kumar',
    addressLine: 'East street, near lord Ganesh temple, Patur, Kovur, Sri Potti Sriramulu Nellore District, Sri Potti Sriramulu Nellore District, Andhra Pradesh, 524137',
    phone: '9032932985'
  });
  const [newAddressForm, setNewAddressForm] = useState({
    name: '',
    addressLine: '',
    phone: ''
  });
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Address items list
  interface UserAddressItem {
    id: string;
    name: string;
    phone: string;
    altPhone?: string;
    flat: string;
    area: string;
    cityStateZip: string;
    type: 'Home' | 'Work';
    lat: number;
    lng: number;
  }

  // Load address from backend on mount or when userSession changes
  useEffect(() => {
    const fetchBackendAddress = async () => {
      try {
        const token = userSession?.token || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('sart_user_session') || '{}')?.token : null);
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('http://localhost:5000/api/user/addresses', { headers });
        if (res.ok) {
          const result = await res.json();
          if (result && result.success && Array.isArray(result.data) && result.data.length > 0) {
            const defaultAddr = result.data.find((a: any) => a.isDefault) || result.data[0];
            setAddressDetails({
              id: defaultAddr.id,
              name: defaultAddr.name,
              addressLine: defaultAddr.addressLine,
              phone: defaultAddr.phone
            });
            localStorage.setItem('sart_saved_delivery_address', JSON.stringify(defaultAddr));
            return;
          }
        }
      } catch (err) {
        // Fallback to local storage if offline/backend unreachable
      }

      // Check localStorage if backend returned empty or was unreachable
      try {
        const cached = localStorage.getItem('sart_saved_delivery_address');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.name) {
            setAddressDetails(parsed);
          } else if (parsed === null) {
            setAddressDetails(null);
          }
        }
      } catch (e) { }
    };

    fetchBackendAddress();
  }, [userSession]);

  const [savedAddresses, setSavedAddresses] = useState<UserAddressItem[]>([
    {
      id: 'addr_1',
      name: 'Sai',
      phone: '9988664422',
      flat: 'Flat 102, Sunrise Apts',
      area: 'Fast street, Near Bus Stand',
      cityStateZip: 'Vellore, Tamil Nadu, 632001',
      type: 'Home',
      lat: 12.9165,
      lng: 79.1325
    },
    {
      id: 'addr_2',
      name: 'VENKATA VASANTH KUMAR PICHUKA',
      phone: '9032932985',
      altPhone: '',
      flat: 'Beta softnet, EB KOOT ROAD',
      area: 'Near JPM Kalyana Mandapam, Thiruvallam',
      cityStateZip: 'Vellore, Tamil Nadu, 632515',
      type: 'Work',
      lat: 12.9812,
      lng: 79.2234
    },
    {
      id: 'addr_3',
      name: 'VENKATA VASANTH KUMAR PICHUKA',
      phone: '9032932985',
      altPhone: '',
      flat: 'Beside clinic, National Highway 40',
      area: 'Near IndianOil Petrol Bunk, Thiruvallam',
      cityStateZip: 'Vellore, Tamil Nadu, 632515',
      type: 'Home',
      lat: 12.9791,
      lng: 79.2198
    }
  ]);

  // Address form draft state
  const [addressForm, setAddressForm] = useState<{
    flat: string;
    area: string;
    cityStateZip: string;
    name: string;
    phone: string;
    altPhone: string;
    type: 'Home' | 'Work';
    lat: number;
    lng: number;
  }>({
    flat: '',
    area: 'National Highway 40, Kugaiyanallore, Near Aslam Bunk, Thiruvallam',
    cityStateZip: 'Vellore, Tamil Nadu, 632515',
    name: 'VENKATA VASANTH KUMAR PICHUKA',
    phone: '9032932985',
    altPhone: '',
    type: 'Home',
    lat: 12.9785,
    lng: 79.2215
  });

  const [isLocatingOnMap, setIsLocatingOnMap] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [onlineAccordion, setOnlineAccordion] = useState<'upi' | 'wallet' | 'card' | 'netbanking'>('upi');
  const [isQrRevealed, setIsQrRevealed] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [hasInitializedDefault, setHasInitializedDefault] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // 2 columns x 2 rows = 4 items per page

  // Initialize default sample data if cart is empty on first visit
  useEffect(() => {
    if (!hasInitializedDefault && cart.length === 0) {
      const isCartSeeded = localStorage.getItem('sart_cart_seeded_v2');
      if (!isCartSeeded) {
        DEFAULT_CART_ITEMS.forEach((item) => {
          addToCart(item);
        });
        localStorage.setItem('sart_cart_seeded_v2', 'true');
      }
      setHasInitializedDefault(true);
    }
  }, [cart.length, hasInitializedDefault, addToCart]);

  // Listen for city selector modal event (e.g. from location button in Navbar)
  useEffect(() => {
    const handleOpenModal = (e: any) => {
      if (e.detail === 'modal-city-selector') {
        setIsCityModalOpen(true);
      }
    };
    window.addEventListener('openReactModal', handleOpenModal);
    return () => window.removeEventListener('openReactModal', handleOpenModal);
  }, []);

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
    setTimeout(() => setToastMsg(null), 3200);
  };

  const isGuest = !userSession;

  // Pagination calculation for 2 columns x 2 rows (4 items per page)
  const totalPages = Math.ceil(cart.length / itemsPerPage);
  const activePage = Math.min(Math.max(1, currentPage), totalPages || 1);
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedCartItems = cart.slice(startIndex, startIndex + itemsPerPage);

  // Subtotal & savings calculation
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const originalSubtotal = cart.reduce((sum, item) => {
    const orig = item.originalPrice || Math.round(item.price * 1.35);
    return sum + (orig * item.quantity);
  }, 0);
  const productDiscount = Math.max(0, originalSubtotal - subtotal);
  const couponDiscount = promoApplied ? Math.round(subtotal * 0.15) : 0;
  const deliveryFee = subtotal > 999 ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - couponDiscount + deliveryFee);
  const totalSavings = productDiscount + couponDiscount;

  // Wishlist items populated with full details
  const wishlistItems = (wishlist || []).map((id) => {
    const product = ALL_STORE_PRODUCTS.find((p) => p.id === id);
    if (product) {
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: (product as any).originalPrice || Math.round(product.price * 1.3),
        icon: product.icon || 'fa-box',
        image: (product as any).image,
        category: product.category,
        brand: (product as any).brand || 'SART Certified',
        rating: (product as any).rating || 4.8,
        inStock: (product as any).inStock ?? true,
      };
    }
    return {
      id,
      name: `Saved Item (${id})`,
      price: 999,
      originalPrice: 1499,
      icon: 'fa-heart',
      image: undefined,
      category: 'Saved Wishlist',
      brand: 'SART Mobility',
      rating: 4.7,
      inStock: true,
    };
  });

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setPromoError('Please enter a coupon code.');
      return;
    }
    if (code === 'SART15' || code === 'FIRSTDRIVE' || code === 'SAVE15') {
      setPromoApplied(true);
      showToast('Coupon applied! 15% extra discount has been deducted.');
    } else {
      setPromoError('Invalid coupon. Try using "SART15" for 15% off.');
    }
  };

  const handleRemoveCoupon = () => {
    setPromoApplied(false);
    setPromoCode('');
    showToast('Promo code removed.');
  };

  const handleResetToDefaults = () => {
    clearCart();
    DEFAULT_CART_ITEMS.forEach((item) => addToCart(item));
    showToast('Cart reloaded with default featured products.');
  };

  // Calculate Online Payment Discount (Matching reference: extra discount for Pay Online)
  const onlineDiscount = paymentMethod === 'online' ? Math.min(86, Math.max(20, Math.round(finalTotal * 0.05))) : 0;
  const paymentFinalTotal = Math.max(0, finalTotal - onlineDiscount);

  const handleProceedToAddress = () => {
    if (cart.length === 0) {
      showToast('Cart is empty!');
      return;
    }
    setActiveTab('address');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToPayment = () => {
    setActiveTab('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmOrder = () => {
    if (cart.length === 0) {
      showToast('Cart is empty!');
      return;
    }

    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);

      if (paymentMethod === 'online' && onlineAccordion === 'wallet') {
        if (wallet.balance < paymentFinalTotal) {
          showToast(`Insufficient Wallet Balance! Need ₹${paymentFinalTotal.toLocaleString('en-IN')}`);
          return;
        }
        updateBalance(paymentFinalTotal, false);
      }

      addTransaction({
        id: `tx-${Date.now()}`,
        title: `Order: ${totalItemsCount} item(s) (${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'})`,
        amount: paymentFinalTotal,
        date: new Date().toLocaleString(),
        isCredit: false,
        category: 'Store'
      });

      clearCart();
      setActiveTab('order-success');
      showToast('Order placed successfully!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  const handleMoveToWishlist = (item: any) => {
    removeFromCart(item.id);
    if (!wishlist.includes(item.id)) {
      toggleWishlist(item.id);
    }
    showToast(`Saved "${item.name}" to Wishlist.`);
  };

  const handleMoveToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      icon: item.icon || 'fa-box',
      image: item.image,
      category: item.category || 'General',
      brand: item.brand,
      quantity: 1,
      rating: item.rating,
      inStock: item.inStock ?? true,
      deliveryEstimate: 'Delivered in 2-3 Days',
      savedAt: Date.now()
    });
    toggleWishlist(item.id);
    showToast(`Added "${item.name}" to your cart.`);
  };

  return (
    <div className="web-app-layout" style={{ height: '100vh', overflow: 'hidden' }}>
      <Navbar />
      <SubNavbar />
      <UserSideBitTool
        isOpen={isBitToolOpen}
        onActivePanelChange={(panel) => setActiveBitToolPanel(panel)}
      />

      <div className={`web-main-content ${isBitToolOpen ? (activeBitToolPanel ? 'has-bittool-panel' : 'has-bittool-strip') : ''}`} style={{ display: 'flex', flexDirection: 'column' }}>
        <main className="cart-page-main" style={{ flex: 1 }}>
          {/* Toast Alert */}
          {toastMsg && (
            <div className="cart-page-toast">
              <i className="fa-solid fa-circle-check"></i>
              <span>{toastMsg}</span>
            </div>
          )}

          <div className="cart-page-container">
            {/* Checkout Process Stepper Header (Image 4) */}
            {(activeTab === 'cart' || activeTab === 'address' || activeTab === 'payment' || activeTab === 'order-success') && (
              <div className="checkout-stepper-container">
                <div
                  className={`step-item ${activeTab === 'cart' ? 'current' : 'completed'}`}
                  onClick={() => setActiveTab('cart')}
                >
                  <div className="step-circle">
                    {activeTab !== 'cart' ? <i className="fa-solid fa-check"></i> : <span>1</span>}
                  </div>
                  <span className="step-label">Cart</span>
                </div>
                <div className={`step-connector ${activeTab !== 'cart' ? 'active' : ''}`}></div>

                <div
                  className={`step-item ${activeTab === 'address' ? 'current' : (activeTab === 'payment' || activeTab === 'order-success') ? 'completed' : 'pending'}`}
                  onClick={() => {
                    if (cart.length > 0) setActiveTab('address');
                  }}
                >
                  <div className="step-circle">
                    {(activeTab === 'payment' || activeTab === 'order-success') ? (
                      <i className="fa-solid fa-check"></i>
                    ) : (
                      <span>2</span>
                    )}
                  </div>
                  <span className="step-label">Address</span>
                </div>
                <div className={`step-connector ${(activeTab === 'payment' || activeTab === 'order-success') ? 'active' : ''}`}></div>

                <div
                  className={`step-item ${activeTab === 'payment' ? 'current' : activeTab === 'order-success' ? 'completed' : 'pending'}`}
                  onClick={() => {
                    if (cart.length > 0) setActiveTab('payment');
                  }}
                >
                  <div className="step-circle">
                    {activeTab === 'order-success' ? <i className="fa-solid fa-check"></i> : <span>3</span>}
                  </div>
                  <span className="step-label">Payment</span>
                </div>
                <div className={`step-connector ${activeTab === 'order-success' ? 'active' : ''}`}></div>

                <div className={`step-item ${activeTab === 'order-success' ? 'completed' : 'pending'}`}>
                  <div className="step-circle">
                    <span>4</span>
                  </div>
                  <span className="step-label">Summary</span>
                </div>
              </div>
            )}

            {/* Top Modern Header */}
            <div className="cart-modern-hero">
              <div className="cart-hero-left">
                <h1 className="cart-page-title">
                  {activeTab === 'cart' && 'Shopping Cart'}
                  {activeTab === 'address' && 'Select Delivery Address'}
                  {activeTab === 'payment' && 'Select Payment Method'}
                  {activeTab === 'order-success' && 'Order Confirmed'}
                  {activeTab === 'wishlist' && 'Saved Products'}
                </h1>
              </div>
            </div>

            {/* VIEW 1: SHOPPING CART */}
            {activeTab === 'cart' && (
              <div className="cart-layout-grid">
                {/* Left Column: Cart Items List */}
                <div className="cart-items-section">
                  <div className="cart-section-top">
                    <div className="cart-count-group">
                      <span className="cart-items-count">
                        {cart.length} unique {cart.length === 1 ? 'item' : 'items'}
                      </span>

                    </div>

                    <div className="cart-top-actions">
                      <button
                        type="button"
                        className="cart-reload-defaults-btn"
                        onClick={handleResetToDefaults}
                        title="Load default sample items"
                      >
                        <i className="fa-solid fa-rotate"></i> Load Default Items
                      </button>
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
                          <i className="fa-solid fa-trash-can"></i> Clear Cart
                        </button>
                      )}
                    </div>
                  </div>

                  {cart.length === 0 ? (
                    <div className="cart-empty-state">
                      <div className="cart-empty-icon">
                        <i className="fa-solid fa-cart-shopping"></i>
                      </div>
                      <h3>Your shopping cart is currently empty</h3>
                      <p>Load our default verified products to explore full product specs, pricing, and checkout, or browse the store.</p>

                    </div>
                  ) : (
                    <>
                      <div className="cart-items-list">
                        {paginatedCartItems.map((item) => {
                          const itemTotal = item.price * item.quantity;
                          const origPrice = item.originalPrice || Math.round(item.price * 1.35);
                          const origTotal = origPrice * item.quantity;
                          const discountPercent = Math.round(((origPrice - item.price) / origPrice) * 100);
                          const deliveryDate = item.deliveryEstimate || 'Delivered in 2-3 Business Days';
                          const brandName = item.brand || 'SART Certified Automotive';

                          return (
                            <div key={item.id} className="cart-item-card-modern">
                              {/* Top row: Media + Details */}
                              <div className="cart-item-top-row">
                                {/* Left: Product Thumbnail */}
                                <div className="cart-item-media">
                                  {item.image ? (
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="cart-item-thumbnail"
                                      onError={(e) => {
                                        // Fallback to icon if remote image fails
                                        (e.target as HTMLElement).style.display = 'none';
                                        const fallback = (e.target as HTMLElement).parentElement?.querySelector('.cart-item-icon-fallback') as HTMLElement;
                                        if (fallback) fallback.style.display = 'flex';
                                      }}
                                    />
                                  ) : null}
                                  <div className="cart-item-icon-fallback" style={{ display: item.image ? 'none' : 'flex' }}>
                                    <i className={`fa-solid ${item.icon || 'fa-box'}`}></i>
                                  </div>
                                  {item.badge && (
                                    <span className="cart-item-floating-badge">{item.badge}</span>
                                  )}
                                </div>

                                {/* Middle: Rich Product Specs & Details */}
                                <div className="cart-item-details">
                                  <div className="cart-item-brand-row">
                                    <span className="cart-item-brand">{brandName}</span>
                                    <span className="cart-item-cat-tag">{item.category || 'Automotive Spares'}</span>
                                  </div>

                                  <h3 className="cart-item-title">{item.name}</h3>
                                </div>
                              </div>

                              {/* Bottom Bar: Action buttons on left, pricing + stepper on right */}
                              <div className="cart-item-bottom-bar">
                                <div className="cart-item-bottom-actions">
                                  <button
                                    type="button"
                                    className="btn-modern-action remove"
                                    onClick={() => {
                                      removeFromCart(item.id);
                                      showToast(`Removed "${item.name}" from cart.`);
                                    }}
                                  >
                                    <i className="fa-solid fa-trash-can"></i> Remove
                                  </button>
                                </div>

                                <div className="cart-item-pricing-col">
                                  <div className="pricing-box">
                                    <div className="price-inline-group">
                                      <span className="cart-final-price">₹{itemTotal.toLocaleString('en-IN')}</span>
                                      {origTotal > itemTotal && (
                                        <>
                                          <span className="cart-original-price">₹{origTotal.toLocaleString('en-IN')}</span>
                                          <span className="cart-discount-percent">{discountPercent}% OFF</span>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  {/* Interactive Quantity Stepper */}
                                  <div className="modern-qty-stepper">
                                    <span className="stepper-label">QUANTITY</span>
                                    <div className="stepper-controls">
                                      <button
                                        type="button"
                                        className="stepper-btn minus"
                                        onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))}
                                        disabled={item.quantity <= 1}
                                        title="Decrease quantity"
                                      >
                                        <i className="fa-solid fa-minus"></i>
                                      </button>
                                      <span className="stepper-number">{item.quantity}</span>
                                      <button
                                        type="button"
                                        className="stepper-btn plus"
                                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                        title="Increase quantity"
                                      >
                                        <i className="fa-solid fa-plus"></i>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Clean Pagination Control matching user image */}
                      {totalPages > 1 && (
                        <div className="cart-pagination-bar">
                          <button
                            type="button"
                            className={`cart-page-nav-btn ${activePage <= 1 ? 'disabled' : ''}`}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={activePage <= 1}
                            title="Previous Page"
                          >
                            <i className="fa-solid fa-chevron-left"></i>
                          </button>

                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <button
                              key={pageNum}
                              type="button"
                              className={`cart-page-number-btn ${activePage === pageNum ? 'active' : ''}`}
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </button>
                          ))}

                          <button
                            type="button"
                            className={`cart-page-nav-btn ${activePage >= totalPages ? 'disabled' : ''}`}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={activePage >= totalPages}
                            title="Next Page"
                          >
                            <i className="fa-solid fa-chevron-right"></i>
                          </button>
                        </div>
                      )}
                    </>
                  )}


                </div>

                {/* Right Column: Order Summary & Checkout Card */}
                {cart.length > 0 && (
                  <div className="cart-summary-section">
                    <div className="cart-summary-card-modern">
                      <h3 className="summary-card-title">
                        <i className="fa-solid fa-receipt"></i> Order Summary
                      </h3>

                      {/* Promo Code Input */}
                      <div className="coupon-box">
                        <label className="coupon-label">Apply Promo / Coupon Code</label>
                        {!promoApplied ? (
                          <form onSubmit={handleApplyCoupon} className="coupon-form">
                            <input
                              type="text"
                              placeholder="Enter Code (e.g. SART15)"
                              value={promoCode}
                              onChange={(e) => setPromoCode(e.target.value)}
                              className="coupon-input"
                            />
                            <button type="submit" className="coupon-apply-btn">
                              Apply
                            </button>
                          </form>
                        ) : (
                          <div className="coupon-applied-pill">
                            <div className="coupon-applied-text">
                              <i className="fa-solid fa-circle-check"></i>
                              <span>Code <strong>{promoCode || 'SART15'}</strong> Applied!</span>
                            </div>
                            <button
                              type="button"
                              onClick={handleRemoveCoupon}
                              className="coupon-remove-btn"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                        {promoError && <p className="coupon-error-text">{promoError}</p>}
                      </div>

                      {/* Breakdown List */}
                      <div className="summary-breakdown">
                        <div className="breakdown-row">
                          <span>Items Price ({totalItemsCount} units)</span>
                          <span>₹{originalSubtotal.toLocaleString('en-IN')}</span>
                        </div>

                        {productDiscount > 0 && (
                          <div className="breakdown-row discount">
                            <span>Catalog Discount</span>
                            <span>-₹{productDiscount.toLocaleString('en-IN')}</span>
                          </div>
                        )}

                        {promoApplied && (
                          <div className="breakdown-row discount promo">
                            <span>Promo Code Savings (15%)</span>
                            <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                          </div>
                        )}

                        <div className="breakdown-row">
                          <span>Estimated Delivery</span>
                          {deliveryFee === 0 ? (
                            <span className="free-delivery-badge">FREE</span>
                          ) : (
                            <span>₹{deliveryFee}</span>
                          )}
                        </div>

                        <div className="breakdown-row">
                          <span>Estimated Taxes & Packaging</span>
                          <span className="free-delivery-badge">INCLUDED</span>
                        </div>

                        <div className="summary-line-divider"></div>

                        <div className="breakdown-row final-total-row">
                          <div>
                            <strong>Total Payable</strong>
                            <span className="tax-inclusive-tag">(Inclusive of all GST)</span>
                          </div>
                          <strong className="final-total-num">₹{finalTotal.toLocaleString('en-IN')}</strong>
                        </div>
                      </div>

                      {totalSavings > 0 && (
                        <div className="summary-savings-banner">
                          <i className="fa-solid fa-gift"></i>
                          <span>You are saving <strong>₹{totalSavings.toLocaleString('en-IN')}</strong> on this order!</span>
                        </div>
                      )}

                      {/* SART Wallet Box */}
                      <div className="wallet-card-highlight">
                        <div className="wallet-card-header">
                          <div className="wallet-icon-ring">
                            <i className="fa-solid fa-wallet"></i>
                          </div>
                          <div className="wallet-balance-info">
                            <span className="wallet-title">SART Wallet Balance</span>
                            <strong className="wallet-amount">₹{wallet.balance.toLocaleString('en-IN')}</strong>
                          </div>
                        </div>
                        {wallet.balance < finalTotal ? (
                          <div >
                          </div>
                        ) : (
                          <div className="wallet-alert-success">
                            <i className="fa-solid fa-circle-check"></i>
                            <span>Sufficient balance available for instant 1-click checkout.</span>
                          </div>
                        )}
                      </div>

                      {/* Primary Checkout Button to Proceed to Address & Payment */}
                      <button
                        type="button"
                        className="btn-checkout-modern"
                        onClick={handleProceedToAddress}
                      >
                        <i className="fa-solid fa-arrow-right"></i>
                        <span>Proceed to Buy (₹{finalTotal.toLocaleString('en-IN')})</span>
                      </button>

                      <div className="summary-guarantee-note">
                        <i className="fa-solid fa-shield-check"></i>
                        <span>Encrypted 256-bit Secure Checkout • 100% Buyer Protection</span>
                      </div>


                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VIEW 2: ADDRESS SELECTION (Image 1) */}
            {activeTab === 'address' && (
              <div className="checkout-stage-layout">
                {/* Left Column: Address Selection */}
                <div className="checkout-main-content">
                  <div className="checkout-stage-card">
                    <div className="checkout-card-header-row">
                      <h2 className="checkout-stage-title">Select Delivery Address</h2>
                      <button
                        type="button"
                        className="checkout-add-action-btn"
                        onClick={() => setIsAddingAddress(true)}
                      >
                        + ADD NEW ADDRESS
                      </button>
                    </div>

                    {/* Selected Address Card */}
                    {addressDetails ? (
                      <div className={`checkout-address-box ${selectedAddress === 'addr_1' ? 'selected' : ''}`}>
                        <div className="address-box-top">
                          <div className="address-radio-label">
                            <span className="address-custom-radio checked"></span>
                            <h3 className="address-user-name">{addressDetails.name}</h3>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button
                              type="button"
                              className="address-edit-btn"
                              onClick={() => setIsEditingAddress(true)}
                            >
                              EDIT
                            </button>
                            <button
                              type="button"
                              className="address-edit-btn"
                              style={{ color: '#ef4444' }}
                              onClick={async () => {
                                if (confirm('Are you sure you want to permanently delete this address?')) {
                                  const addrId = addressDetails.id;
                                  setAddressDetails(null);
                                  setIsEditingAddress(false);
                                  localStorage.removeItem('sart_saved_delivery_address');

                                  // Call backend API to permanently delete from database
                                  try {
                                    const token = userSession?.token || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('sart_user_session') || '{}')?.token : null);
                                    const headers: HeadersInit = { 'Content-Type': 'application/json' };
                                    if (token) headers['Authorization'] = `Bearer ${token}`;

                                    if (addrId) {
                                      await fetch(`http://localhost:5000/api/user/addresses/${addrId}`, {
                                        method: 'DELETE',
                                        headers
                                      });
                                    }
                                  } catch (err) { }

                                  showToast('Address permanently deleted.');
                                }
                              }}
                              title="Delete address"
                            >
                              DELETE
                            </button>
                          </div>
                        </div>

                        <p className="address-text-body">
                          {addressDetails.addressLine}
                        </p>

                        <p className="address-phone-number">
                          {addressDetails.phone}
                        </p>

                        <button
                          type="button"
                          className="btn-deliver-address-action"
                          onClick={handleProceedToPayment}
                        >
                          Deliver to this Address
                        </button>
                      </div>
                    ) : (
                      <div style={{ padding: '24px', background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: '12px', textAlign: 'center', margin: '12px 0' }}>
                        <i className="fa-solid fa-location-dot" style={{ fontSize: '28px', color: '#94a3b8', marginBottom: '8px' }}></i>
                        <p style={{ margin: '0 0 10px', fontSize: '13.5px', color: '#64748b', fontWeight: 600 }}>
                          No delivery address selected. Please add an address to continue.
                        </p>
                        <button
                          type="button"
                          className="checkout-add-action-btn"
                          style={{ margin: '0 auto', display: 'inline-flex' }}
                          onClick={() => setIsAddingAddress(true)}
                        >
                          + ADD NEW ADDRESS
                        </button>
                      </div>
                    )}

                    {/* Modal / Form for editing address if triggered */}
                    {isEditingAddress && addressDetails && (
                      <div className="address-edit-inline-form">
                        <h4 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 800 }}>Edit Delivery Address</h4>
                        <input
                          type="text"
                          className="checkout-input"
                          placeholder="Full Name"
                          value={addressDetails.name}
                          onChange={(e) => setAddressDetails({ ...addressDetails, name: e.target.value })}
                          style={{ marginBottom: '8px' }}
                        />
                        <textarea
                          className="checkout-textarea"
                          placeholder="Complete Address"
                          value={addressDetails.addressLine}
                          onChange={(e) => setAddressDetails({ ...addressDetails, addressLine: e.target.value })}
                          style={{ marginBottom: '8px' }}
                        />
                        <input
                          type="text"
                          className="checkout-input"
                          placeholder="Mobile Number"
                          value={addressDetails.phone}
                          onChange={(e) => setAddressDetails({ ...addressDetails, phone: e.target.value })}
                          style={{ marginBottom: '10px' }}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            className="btn-deliver-address-action"
                            style={{ width: 'auto', padding: '6px 16px' }}
                            onClick={async () => {
                              setIsEditingAddress(false);
                              localStorage.setItem('sart_saved_delivery_address', JSON.stringify(addressDetails));

                              // Sync with backend API
                              try {
                                const token = userSession?.token || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('sart_user_session') || '{}')?.token : null);
                                const headers: HeadersInit = { 'Content-Type': 'application/json' };
                                if (token) headers['Authorization'] = `Bearer ${token}`;

                                if (addressDetails.id) {
                                  await fetch(`http://localhost:5000/api/user/addresses/${addressDetails.id}`, {
                                    method: 'PUT',
                                    headers,
                                    body: JSON.stringify(addressDetails)
                                  });
                                } else {
                                  const res = await fetch('http://localhost:5000/api/user/addresses', {
                                    method: 'POST',
                                    headers,
                                    body: JSON.stringify(addressDetails)
                                  });
                                  if (res.ok) {
                                    const r = await res.json();
                                    if (r?.data?.id) {
                                      setAddressDetails(prev => prev ? { ...prev, id: r.data.id } : null);
                                    }
                                  }
                                }
                              } catch (e) { }

                              showToast('Address updated.');
                            }}
                          >
                            Save Address
                          </button>
                          <button
                            type="button"
                            className="btn-back-to-cart"
                            onClick={() => setIsEditingAddress(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Modal / Form for adding a new address when clicking + ADD NEW ADDRESS */}
                    {isAddingAddress && (
                      <div className="address-edit-inline-form" style={{ marginTop: '16px', borderTop: '2px dashed #cbd5e1' }}>
                        <h4 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 800, color: '#8b1d7b' }}>
                          + Add New Delivery Address
                        </h4>
                        <input
                          type="text"
                          className="checkout-input"
                          placeholder="Full Name (e.g. John Doe)"
                          value={newAddressForm.name}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, name: e.target.value })}
                          style={{ marginBottom: '8px' }}
                        />
                        <textarea
                          className="checkout-textarea"
                          placeholder="Complete Address (House/Flat No, Landmark, City, State, Pincode)"
                          value={newAddressForm.addressLine}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, addressLine: e.target.value })}
                          style={{ marginBottom: '8px' }}
                        />
                        <input
                          type="text"
                          className="checkout-input"
                          placeholder="10-digit Mobile Number"
                          value={newAddressForm.phone}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, phone: e.target.value })}
                          style={{ marginBottom: '10px' }}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            className="btn-deliver-address-action"
                            style={{ width: 'auto', padding: '6px 16px' }}
                            onClick={async () => {
                              if (!newAddressForm.name.trim() || !newAddressForm.addressLine.trim() || !newAddressForm.phone.trim()) {
                                showToast('Please fill out name, address, and mobile number.');
                                return;
                              }
                              const payload = {
                                name: newAddressForm.name.trim(),
                                addressLine: newAddressForm.addressLine.trim(),
                                phone: newAddressForm.phone.trim()
                              };

                              setAddressDetails(payload);
                              setIsAddingAddress(false);
                              setNewAddressForm({ name: '', addressLine: '', phone: '' });
                              localStorage.setItem('sart_saved_delivery_address', JSON.stringify(payload));

                              // Save to backend database API
                              try {
                                const token = userSession?.token || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('sart_user_session') || '{}')?.token : null);
                                const headers: HeadersInit = { 'Content-Type': 'application/json' };
                                if (token) headers['Authorization'] = `Bearer ${token}`;

                                const res = await fetch('http://localhost:5000/api/user/addresses', {
                                  method: 'POST',
                                  headers,
                                  body: JSON.stringify(payload)
                                });
                                if (res.ok) {
                                  const r = await res.json();
                                  if (r?.data?.id) {
                                    setAddressDetails(prev => prev ? { ...prev, id: r.data.id } : null);
                                    localStorage.setItem('sart_saved_delivery_address', JSON.stringify({ ...payload, id: r.data.id }));
                                  }
                                }
                              } catch (e) { }

                              showToast('New address added & selected.');
                            }}
                          >
                            Save & Deliver Here
                          </button>
                          <button
                            type="button"
                            className="btn-back-to-cart"
                            onClick={() => {
                              setIsAddingAddress(false);
                              setNewAddressForm({ name: '', addressLine: '', phone: '' });
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Price Details (Matching Image 1 & 2 & 3) */}
                <div className="checkout-side-summary">
                  <div className="price-details-card">
                    <h3 className="price-details-title">Price Details ({totalItemsCount} Items)</h3>

                    <div className="price-details-list">
                      <div className="price-row">
                        <span>Product Price</span>
                        <span className="price-val">+ ₹{originalSubtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="price-row discount">
                        <span>Total Discounts</span>
                        <span className="price-val discount-green">- ₹{totalSavings.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="price-details-divider"></div>

                      <div className="price-row order-total-row">
                        <strong>Order Total</strong>
                        <strong className="order-total-amount">₹{finalTotal.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>

                    {totalSavings > 0 && (
                      <div className="yay-savings-badge">
                        <div className="yay-icon">
                          <i className="fa-solid fa-percent"></i>
                        </div>
                        <span>Yay! Your total discount is ₹{totalSavings.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 3: PAYMENT METHOD (Image 1, 2, 3 - Exact Match) */}
            {activeTab === 'payment' && (
              <div className="checkout-stage-layout">
                {/* Left Column: Select Payment Method & All Options */}
                <div className="checkout-main-content">
                  <div className="checkout-stage-card">
                    <div className="checkout-card-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h2 className="checkout-stage-title" style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#1e293b' }}>
                        All Payment Options
                      </h2>
                      <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>
                        <i className="fa-solid fa-lock" style={{ color: '#10b981', marginRight: '4px' }}></i> 256-Bit Encrypted
                      </span>
                    </div>

                    <div className="payment-options-container" style={{ marginTop: '16px' }}>
                      {/* Option: Cash on Delivery (COD) - Matching Image 2 */}
                      <div
                        className={`payment-method-box ${paymentMethod === 'cod' ? 'selected' : ''}`}
                        onClick={() => setPaymentMethod('cod')}
                        style={{
                          border: paymentMethod === 'cod' ? '2px solid #2563eb' : '1.5px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '14px 18px',
                          background: paymentMethod === 'cod' ? '#f0f7ff' : '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          marginBottom: '10px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              border: paymentMethod === 'cod' ? '6px solid #2563eb' : '2px solid #cbd5e1',
                              display: 'inline-block',
                              background: '#ffffff',
                              boxSizing: 'border-box'
                            }}></span>
                            <span style={{ fontSize: '14.5px', fontWeight: 700, color: '#1e293b' }}>Cash on Delivery (COD)</span>
                          </div>
                          <span style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>₹{finalTotal.toLocaleString('en-IN')}</span>
                        </div>
                        {paymentMethod === 'cod' && (
                          <div style={{ marginTop: '10px', padding: '10px 14px', background: '#e0f2fe', borderRadius: '8px', fontSize: '12px', color: '#0369a1', fontWeight: 600 }}>
                            ℹ️ In case of shipping delay caused by any weather conditions, we will do our best to deliver at the soonest possible time!
                          </div>
                        )}
                      </div>

                      {/* Accordion 1: UPI (Google Pay, PhonePe, Paytm, Apps & UPI ID) - Matching Image 1 */}
                      <div className="payment-method-box" style={{
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '12px',
                        background: '#ffffff',
                        marginBottom: '10px',
                        overflow: 'hidden'
                      }}>
                        <div
                          onClick={() => {
                            setPaymentMethod('online');
                            setOnlineAccordion(onlineAccordion === 'upi' ? ('' as any) : 'upi');
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 18px',
                            cursor: 'pointer',
                            background: onlineAccordion === 'upi' ? '#f8fafc' : '#ffffff'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '18px', color: '#2563eb' }}>
                              <i className="fa-solid fa-shapes"></i>
                            </span>
                            <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>UPI</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '6px' }}>
                              <span style={{ background: '#4285F4', color: '#fff', borderRadius: '4px', padding: '1px 5px', fontSize: '10px', fontWeight: 900 }}>GPay</span>
                              <span style={{ background: '#5f259f', color: '#fff', borderRadius: '4px', padding: '1px 5px', fontSize: '10px', fontWeight: 900 }}>Pe</span>
                              <span style={{ background: '#00baf2', color: '#fff', borderRadius: '4px', padding: '1px 5px', fontSize: '10px', fontWeight: 900 }}>Paytm</span>
                            </div>
                          </div>
                          <i className={`fa-solid fa-chevron-${onlineAccordion === 'upi' ? 'up' : 'down'}`} style={{ color: '#64748b' }}></i>
                        </div>

                        {onlineAccordion === 'upi' && (
                          <div style={{ padding: '16px 18px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '14px' }}>
                              <button
                                type="button"
                                onClick={() => { setPaymentMethod('online'); showToast('Google Pay selected.'); }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '8px',
                                  padding: '12px 14px',
                                  background: '#ffffff',
                                  border: '1.5px solid #cbd5e1',
                                  borderRadius: '10px',
                                  fontWeight: 700,
                                  fontSize: '13px',
                                  cursor: 'pointer',
                                  color: '#1e293b'
                                }}
                              >
                                <i className="fa-brands fa-google-pay" style={{ fontSize: '20px', color: '#4285f4' }}></i>
                                <span>Google Pay</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => { setPaymentMethod('online'); showToast('PhonePe selected.'); }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '8px',
                                  padding: '12px 14px',
                                  background: '#ffffff',
                                  border: '1.5px solid #cbd5e1',
                                  borderRadius: '10px',
                                  fontWeight: 700,
                                  fontSize: '13px',
                                  cursor: 'pointer',
                                  color: '#1e293b'
                                }}
                              >
                                <i className="fa-solid fa-mobile-screen" style={{ color: '#5f259f' }}></i>
                                <span>PhonePe</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => { setPaymentMethod('online'); showToast('PayTM selected.'); }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '8px',
                                  padding: '12px 14px',
                                  background: '#ffffff',
                                  border: '1.5px solid #cbd5e1',
                                  borderRadius: '10px',
                                  fontWeight: 700,
                                  fontSize: '13px',
                                  cursor: 'pointer',
                                  color: '#1e293b'
                                }}
                              >
                                <i className="fa-solid fa-wallet" style={{ color: '#00baf2' }}></i>
                                <span>PayTM</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => { setPaymentMethod('online'); setIsQrRevealed(true); }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '8px',
                                  padding: '12px 14px',
                                  background: '#ffffff',
                                  border: '1.5px solid #cbd5e1',
                                  borderRadius: '10px',
                                  fontWeight: 700,
                                  fontSize: '13px',
                                  cursor: 'pointer',
                                  color: '#1e293b'
                                }}
                              >
                                <i className="fa-solid fa-qrcode" style={{ color: '#0f172a' }}></i>
                                <span>Apps & QR</span>
                              </button>
                            </div>

                            {/* Scan and Pay QR Frame */}
                            <div style={{ textAlign: 'center', padding: '12px', background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                              <div style={{ fontWeight: 700, fontSize: '12.5px', color: '#0f172a', marginBottom: '8px' }}>
                                Instant QR Code Payment
                              </div>
                              {!isQrRevealed ? (
                                <button
                                  type="button"
                                  onClick={() => setIsQrRevealed(true)}
                                  style={{
                                    padding: '8px 18px',
                                    background: '#2563eb',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontWeight: 800,
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Reveal Dynamic QR Code
                                </button>
                              ) : (
                                <div>
                                  <div style={{
                                    width: '140px',
                                    height: '140px',
                                    margin: '0 auto 8px',
                                    background: '#0f172a',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#ffffff',
                                    fontSize: '48px'
                                  }}>
                                    <i className="fa-solid fa-qrcode"></i>
                                  </div>
                                  <span style={{ fontSize: '11px', color: '#64748b' }}>Scan with GPay / PhonePe / Paytm / BHIM</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Accordion 2: Credit / Debit Cards - Matching Image 1 & 3 */}
                      <div className="payment-method-box" style={{
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '12px',
                        background: '#ffffff',
                        marginBottom: '10px',
                        overflow: 'hidden'
                      }}>
                        <div
                          onClick={() => {
                            setPaymentMethod('online');
                            setOnlineAccordion(onlineAccordion === 'card' ? ('' as any) : 'card');
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 18px',
                            cursor: 'pointer',
                            background: onlineAccordion === 'card' ? '#f8fafc' : '#ffffff'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '18px', color: '#2563eb' }}>
                              <i className="fa-regular fa-credit-card"></i>
                            </span>
                            <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Cards</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '6px' }}>
                              <span style={{ color: '#1a1f71', fontWeight: 900, fontSize: '11px' }}>VISA</span>
                              <span style={{ color: '#eb001b', fontWeight: 900, fontSize: '11px' }}>Mastercard</span>
                              <span style={{ color: '#0061a8', fontWeight: 900, fontSize: '11px' }}>RuPay</span>
                            </div>
                          </div>
                          <i className={`fa-solid fa-chevron-${onlineAccordion === 'card' ? 'up' : 'down'}`} style={{ color: '#64748b' }}></i>
                        </div>

                        {onlineAccordion === 'card' && (
                          <div style={{ padding: '16px 18px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '420px' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Card number</label>
                                <div style={{ position: 'relative' }}>
                                  <input
                                    type="text"
                                    className="checkout-input"
                                    placeholder="1234 5678 9012 3456"
                                    maxLength={19}
                                    style={{ paddingRight: '36px' }}
                                  />
                                  <i className="fa-solid fa-lock" style={{ position: 'absolute', right: '12px', top: '12px', color: '#94a3b8' }}></i>
                                </div>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div>
                                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Expiration date (MM / YY)</label>
                                  <input type="text" className="checkout-input" placeholder="MM / YY" maxLength={5} />
                                </div>
                                <div>
                                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Security code (CVV)</label>
                                  <input type="password" className="checkout-input" placeholder="123" maxLength={4} />
                                </div>
                              </div>

                              <div>
                                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Name on card</label>
                                <input type="text" className="checkout-input" placeholder="Cardholder Name" defaultValue={addressDetails.name} />
                              </div>

                              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155', cursor: 'pointer', marginTop: '4px' }}>
                                <input type="checkbox" defaultChecked />
                                <span>Use shipping address as billing address</span>
                              </label>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Accordion 3: Netbanking - Matching Image 1 */}
                      <div className="payment-method-box" style={{
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '12px',
                        background: '#ffffff',
                        marginBottom: '10px',
                        overflow: 'hidden'
                      }}>
                        <div
                          onClick={() => {
                            setPaymentMethod('online');
                            setOnlineAccordion(onlineAccordion === 'netbanking' ? ('' as any) : 'netbanking');
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 18px',
                            cursor: 'pointer',
                            background: onlineAccordion === 'netbanking' ? '#f8fafc' : '#ffffff'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '18px', color: '#2563eb' }}>
                              <i className="fa-solid fa-building-columns"></i>
                            </span>
                            <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Netbanking</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '6px', fontSize: '11px', color: '#64748b' }}>
                              <span>SBI • HDFC • ICICI</span>
                            </div>
                          </div>
                          <i className={`fa-solid fa-chevron-${onlineAccordion === 'netbanking' ? 'up' : 'down'}`} style={{ color: '#64748b' }}></i>
                        </div>

                        {onlineAccordion === 'netbanking' && (
                          <div style={{ padding: '16px 18px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
                            <select className="checkout-input" style={{ maxWidth: '340px' }}>
                              <option value="sbi">State Bank of India (SBI)</option>
                              <option value="hdfc">HDFC Bank</option>
                              <option value="icici">ICICI Bank</option>
                              <option value="axis">Axis Bank</option>
                              <option value="kotak">Kotak Mahindra Bank</option>
                              <option value="pnb">Punjab National Bank</option>
                            </select>
                          </div>
                        )}
                      </div>

                      {/* Accordion 4: EMI (Equated Monthly Installment) - Matching Image 1 */}
                      <div className="payment-method-box" style={{
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '12px',
                        background: '#ffffff',
                        marginBottom: '10px',
                        overflow: 'hidden'
                      }}>
                        <div
                          onClick={() => {
                            setPaymentMethod('online');
                            setOnlineAccordion(onlineAccordion === 'emi' as any ? ('' as any) : ('emi' as any));
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 18px',
                            cursor: 'pointer',
                            background: (onlineAccordion as any) === 'emi' ? '#f8fafc' : '#ffffff'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '18px', color: '#2563eb' }}>
                              <i className="fa-regular fa-calendar-check"></i>
                            </span>
                            <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>EMI</span>
                            <span style={{ background: '#fef3c7', color: '#b45309', borderRadius: '4px', padding: '1px 6px', fontSize: '10px', fontWeight: 800 }}>No Cost EMI</span>
                          </div>
                          <i className={`fa-solid fa-chevron-${(onlineAccordion as any) === 'emi' ? 'up' : 'down'}`} style={{ color: '#64748b' }}></i>
                        </div>

                        {(onlineAccordion as any) === 'emi' && (
                          <div style={{ padding: '16px 18px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
                            <p style={{ margin: '0 0 10px', fontSize: '12px', color: '#475569' }}>
                              Available across major banks with 3, 6, 9 & 12 months flexible tenure.
                            </p>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                              <span style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>
                                ₹{Math.round(finalTotal / 3).toLocaleString('en-IN')}/mo (3 Months)
                              </span>
                              <span style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>
                                ₹{Math.round(finalTotal / 6).toLocaleString('en-IN')}/mo (6 Months)
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Accordion 5: Wallet (SART Wallet & Partners) - Matching Image 1 */}
                      <div className="payment-method-box" style={{
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '12px',
                        background: '#ffffff',
                        marginBottom: '10px',
                        overflow: 'hidden'
                      }}>
                        <div
                          onClick={() => {
                            setPaymentMethod('online');
                            setOnlineAccordion(onlineAccordion === 'wallet' ? ('' as any) : 'wallet');
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 18px',
                            cursor: 'pointer',
                            background: onlineAccordion === 'wallet' ? '#f8fafc' : '#ffffff'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '18px', color: '#2563eb' }}>
                              <i className="fa-solid fa-wallet"></i>
                            </span>
                            <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Wallet</span>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#059669' }}>
                              (SART Balance: ₹{wallet.balance.toLocaleString('en-IN')})
                            </span>
                          </div>
                          <i className={`fa-solid fa-chevron-${onlineAccordion === 'wallet' ? 'up' : 'down'}`} style={{ color: '#64748b' }}></i>
                        </div>

                        {onlineAccordion === 'wallet' && (
                          <div style={{ padding: '16px 18px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
                            <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#475569' }}>
                              Use your pre-loaded SART Wallet balance for instant 1-tap checkout.
                            </p>
                            {wallet.balance < paymentFinalTotal ? (
                              <span style={{ color: '#d97706', fontSize: '11.5px', fontWeight: 700 }}>
                                ⚠️ Wallet balance is less than payable amount.
                              </span>
                            ) : (
                              <span style={{ color: '#16a34a', fontSize: '11.5px', fontWeight: 700 }}>
                                ✓ Sufficient balance available in SART Wallet for instant 1-click order.
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Accordion 6: Pay Later (BillEase / Simpl / LazyPay) - Matching Image 1 & 2 */}
                      <div className="payment-method-box" style={{
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '12px',
                        background: '#ffffff',
                        marginBottom: '10px',
                        overflow: 'hidden'
                      }}>
                        <div
                          onClick={() => {
                            setPaymentMethod('online');
                            setOnlineAccordion(onlineAccordion === 'paylater' as any ? ('' as any) : ('paylater' as any));
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 18px',
                            cursor: 'pointer',
                            background: (onlineAccordion as any) === 'paylater' ? '#f8fafc' : '#ffffff'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '18px', color: '#2563eb' }}>
                              <i className="fa-regular fa-clock"></i>
                            </span>
                            <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Pay Later</span>
                            <span style={{ fontSize: '11.5px', color: '#64748b' }}>Buy Now, Pay Later. No card required.</span>
                          </div>
                          <i className={`fa-solid fa-chevron-${(onlineAccordion as any) === 'paylater' ? 'up' : 'down'}`} style={{ color: '#64748b' }}></i>
                        </div>

                        {(onlineAccordion as any) === 'paylater' && (
                          <div style={{ padding: '16px 18px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
                            <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>
                              Pay next month with 0% interest via Simpl / LazyPay / Amazon Pay Later.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Trust Badges matching Image 1: PCI-DSS, Verified by Visa, Powered by UPI */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '24px',
                        marginTop: '20px',
                        paddingTop: '16px',
                        borderTop: '1px solid #e2e8f0',
                        color: '#94a3b8',
                        fontSize: '11px',
                        fontWeight: 700
                      }}>
                        <span><i className="fa-solid fa-shield-halved" style={{ marginRight: '5px' }}></i> PCI-DSS Level 1</span>
                        <span><i className="fa-brands fa-cc-visa" style={{ marginRight: '5px' }}></i> VERIFIED by VISA</span>
                        <span><i className="fa-solid fa-bolt" style={{ marginRight: '5px' }}></i> POWERED BY UPI</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Price Details & Continue CTA */}
                <div className="checkout-side-summary">
                  <div className="price-details-card">
                    <h3 className="price-details-title">Price Details ({totalItemsCount} Items)</h3>

                    <div className="price-details-list">
                      <div className="price-row">
                        <span>Product Price</span>
                        <span className="price-val">+ ₹{originalSubtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="price-row discount">
                        <span>Total Discounts</span>
                        <span className="price-val discount-green">- ₹{(totalSavings + onlineDiscount).toLocaleString('en-IN')}</span>
                      </div>

                      <div className="price-details-divider"></div>

                      <div className="price-row order-total-row">
                        <strong>Order Total</strong>
                        <strong className="order-total-amount">₹{paymentFinalTotal.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>

                    {totalSavings > 0 && (
                      <div className="yay-savings-badge">
                        <div className="yay-icon">
                          <i className="fa-solid fa-percent"></i>
                        </div>
                        <span>Yay! Your total discount is ₹{(totalSavings + onlineDiscount).toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    {/* Payment CTA Note & Button matching Image 1 */}
                    <div className="payment-submit-container">
                      <p className="payment-cta-disclaimer">
                        {paymentMethod === 'online'
                          ? "Clicking on 'Continue' will proceed with secure payment"
                          : "Clicking on 'Continue' will confirm your Cash on Delivery order"}
                      </p>
                      <button
                        type="button"
                        className="btn-payment-continue"
                        onClick={handleConfirmOrder}
                        disabled={isProcessingPayment}
                      >
                        {isProcessingPayment ? (
                          <>
                            <i className="fa-solid fa-circle-notch fa-spin"></i>
                            <span>Processing Order...</span>
                          </>
                        ) : (
                          <span>Continue (Pay ₹{paymentFinalTotal.toLocaleString('en-IN')})</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 4: ORDER SUCCESS */}
            {activeTab === 'order-success' && (
              <div className="order-success-screen">
                <div className="success-icon-banner">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <h2 className="success-headline">Order Placed Successfully!</h2>
                <p className="success-subtext">
                  Thank you for your purchase, {addressDetails.name}! Your order has been registered and is being prepared for express delivery.
                </p>

                <div className="success-info-card">
                  <div className="success-info-row">
                    <span>Payment Mode:</span>
                    <strong>{paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment (Prepaid)'}</strong>
                  </div>
                  <div className="success-info-row">
                    <span>Shipping To:</span>
                    <span>{addressDetails.addressLine}</span>
                  </div>
                  <div className="success-info-row">
                    <span>Contact Number:</span>
                    <strong>{addressDetails.phone}</strong>
                  </div>
                </div>

                <div className="success-actions-row">
                  <button
                    type="button"
                    className="btn-deliver-address-action"
                    style={{ width: 'auto', padding: '10px 24px' }}
                    onClick={() => {
                      setActiveTab('cart');
                      handleResetToDefaults();
                    }}
                  >
                    <i className="fa-solid fa-rotate-left"></i> Order More Items
                  </button>
                  <button
                    type="button"
                    className="btn-back-to-cart"
                    style={{ padding: '10px 20px' }}
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.location.href = '/store';
                      }
                    }}
                  >
                    <i className="fa-solid fa-store"></i> Explore Store
                  </button>
                </div>
              </div>
            )}

            {/* VIEW 5: WISHLIST (SAVED ITEMS) */}
            {activeTab === 'wishlist' && (
              <div className="wishlist-section">
                <div className="cart-section-top">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      type="button"
                      className="btn-back-to-cart"
                      onClick={() => setActiveTab('cart')}
                      title="Return to Shopping Cart"
                    >
                      <i className="fa-solid fa-arrow-left"></i> Back to Cart
                    </button>
                    <span className="cart-items-count">
                      {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'} saved in Wishlist
                    </span>
                  </div>
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
                    <p>Save items you like by clicking the heart icon on any automotive part or accessory.</p>
                    <button
                      type="button"
                      className="btn-primary-explore"
                      onClick={() => window.location.href = '/store'}
                    >
                      <i className="fa-solid fa-store"></i> Browse SART Store
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
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : null}
                          <i className={`fa-solid ${item.icon}`}></i>
                        </div>

                        <div className="wishlist-body">
                          <span className="wishlist-category">{item.category}</span>
                          <h4 className="wishlist-title">{item.name}</h4>
                          <div className="wishlist-pricing">
                            <span className="wishlist-price">₹{item.price.toLocaleString('en-IN')}</span>
                            {item.originalPrice && (
                              <span className="wishlist-original-price">₹{item.originalPrice.toLocaleString('en-IN')}</span>
                            )}
                          </div>
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
      <CitySelectorModal isOpen={isCityModalOpen} onClose={() => setIsCityModalOpen(false)} />
    </div>
  );
}
