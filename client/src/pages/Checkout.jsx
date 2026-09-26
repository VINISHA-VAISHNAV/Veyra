import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ordersApi } from '../services/api';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function Checkout() {
  const { user, isAuthenticated } = useAuth();
  const { cartItems, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'Cash on Delivery',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Redirect if cart is empty
  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <div className="container" style={{ paddingTop: '6rem', textAlign: 'center' }}>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
          Your cart is currently empty. Add products before proceeding to checkout.
        </p>
        <Link to="/" className="btn btn-primary">
          Explore Collection
        </Link>
      </div>
    );
  }

  // Redirect to login if unauthenticated
  if (!isAuthenticated) {
    return (
      <div
        className="container"
        style={{
          paddingTop: '6rem',
          paddingBottom: '6rem',
          maxWidth: '480px',
          textAlign: 'center',
        }}
      >
        <h2 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          VEYRA Checkout
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Please sign in to your VEYRA account to complete shipping and order registration.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/login" className="btn btn-primary">
            Sign In to Account
          </Link>
          <Link to="/signup" className="btn btn-secondary">
            Create New Account
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError(null);

    // Form validation
    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.pincode.trim()
    ) {
      setError('Please complete all required shipping fields.');
      return;
    }

    try {
      setSubmitting(true);

      const orderPayload = {
        items: cartItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
        shippingAddress: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          pincode: formData.pincode.trim(),
        },
        paymentMethod: formData.paymentMethod,
      };

      const response = await ordersApi.create(orderPayload);

      if (response.success && response.order) {
        clearCart();
        setOrderSuccess(response.order);
      } else {
        setError(response.message || 'Order verification failed.');
      }
    } catch (err) {
      setError(
        err.message ||
          'Failed to finalize order. Inventory may have changed. Please verify cart items.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div
          className="container"
          style={{
            maxWidth: '560px',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            padding: '3.5rem 2rem',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-success-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: 'var(--status-success)',
            }}
          >
            <CheckCircle2 size={32} />
          </div>

          <span
            className="badge badge-success"
            style={{ marginBottom: '1rem', padding: '0.35rem 0.75rem' }}
          >
            Order Placed Successfully
          </span>

          <h1
            className="font-display"
            style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}
          >
            Thank you for choosing VEYRA.
          </h1>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Your order ID is <strong>#{orderSuccess._id.slice(-8).toUpperCase()}</strong>. Inventory has been allocated, and fulfillment is in progress.
          </p>

          <div
            style={{
              padding: '1.25rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '2rem',
              fontSize: '0.85rem',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div>
              <strong>Recipient:</strong> {orderSuccess.shippingAddress.name}
            </div>
            <div>
              <strong>Destination:</strong> {orderSuccess.shippingAddress.address},{' '}
              {orderSuccess.shippingAddress.city} - {orderSuccess.shippingAddress.pincode}
            </div>
            <div>
              <strong>Payment:</strong> {orderSuccess.paymentMethod} &bull; Total: $
              {orderSuccess.total.toFixed(2)}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/orders" className="btn btn-primary">
              View Order Tracking
            </Link>
            <Link to="/" className="btn btn-secondary">
              Back to Collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <Link
            to="/cart"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: '1rem',
            }}
          >
            <ArrowLeft size={16} /> Return to Cart
          </Link>
          <h1
            className="font-display"
            style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}
          >
            VEYRA Checkout
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Provide your destination and preferred settlement method.
          </p>
        </div>

        {error && (
          <div className="alert-box alert-error" style={{ marginBottom: '2rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'start',
            }}
          >
            {/* Left Column: Shipping & Payment Form */}
            <div>
              {/* Shipping Section */}
              <div
                className="veyra-card"
                style={{
                  padding: '1.75rem',
                  backgroundColor: '#ffffff',
                  marginBottom: '2rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    marginBottom: '1.5rem',
                    paddingBottom: '0.85rem',
                    borderBottom: '1px solid var(--border-light)',
                  }}
                >
                  <Truck size={20} color="var(--text-primary)" />
                  <h2 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                    1. Shipping Information
                  </h2>
                </div>

                <div className="form-group">
                  <label className="form-label">Full Recipient Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. John Doe"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. +1 (555) 019-2834"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g. Seattle"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Postal / Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g. 98101"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div
                className="veyra-card"
                style={{
                  padding: '1.75rem',
                  backgroundColor: '#ffffff',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    marginBottom: '1.5rem',
                    paddingBottom: '0.85rem',
                    borderBottom: '1px solid var(--border-light)',
                  }}
                >
                  <CreditCard size={20} color="var(--text-primary)" />
                  <h2 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                    2. Payment Method
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Option 1: Cash on Delivery */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      padding: '1rem',
                      border: `1.5px solid ${
                        formData.paymentMethod === 'Cash on Delivery'
                          ? '#09090b'
                          : 'var(--border-light)'
                      }`,
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      backgroundColor:
                        formData.paymentMethod === 'Cash on Delivery'
                          ? 'var(--bg-secondary)'
                          : '#ffffff',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={formData.paymentMethod === 'Cash on Delivery'}
                      onChange={handleChange}
                      style={{ marginTop: '0.2rem' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Cash on Delivery</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Settle payment in person upon courier delivery.
                      </div>
                    </div>
                  </label>

                  {/* Option 2: Demo Card */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      padding: '1rem',
                      border: `1.5px solid ${
                        formData.paymentMethod === 'Demo Card'
                          ? '#09090b'
                          : 'var(--border-light)'
                      }`,
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      backgroundColor:
                        formData.paymentMethod === 'Demo Card'
                          ? 'var(--bg-secondary)'
                          : '#ffffff',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Demo Card"
                      checked={formData.paymentMethod === 'Demo Card'}
                      onChange={handleChange}
                      style={{ marginTop: '0.2rem' }}
                    />
                    <div style={{ width: '100%' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Demo Card Simulation</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        Simulated card gateway (no real billing or credit card integration).
                      </div>
                      {formData.paymentMethod === 'Demo Card' && (
                        <div
                          style={{
                            padding: '0.75rem',
                            backgroundColor: '#ffffff',
                            border: '1px solid var(--border-light)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.78rem',
                            color: 'var(--text-muted)',
                          }}
                        >
                          Demo Mode Active &bull; Instant authorization simulated on submission.
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Confirmation Sidebar */}
            <div
              className="veyra-card"
              style={{
                padding: '1.75rem',
                backgroundColor: '#ffffff',
                position: 'sticky',
                top: '96px',
              }}
            >
              <h2
                className="font-display"
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  marginBottom: '1.25rem',
                  paddingBottom: '0.85rem',
                  borderBottom: '1px solid var(--border-light)',
                }}
              >
                Order Review ({cartItems.length} items)
              </h2>

              {/* Items mini list */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  marginBottom: '1.25rem',
                  paddingRight: '0.5rem',
                }}
              >
                {cartItems.map((item) => (
                  <div
                    key={item.product}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      fontSize: '0.85rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '4px',
                          objectFit: 'cover',
                          backgroundColor: '#f4f4f5',
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Qty: {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700 }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Totals */}
              <div
                style={{
                  borderTop: '1px solid var(--border-light)',
                  paddingTop: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                  <span style={{ fontWeight: 600, color: 'var(--status-success)' }}>Free</span>
                </div>
                <div
                  style={{
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-light)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <span style={{ fontSize: '1rem', fontWeight: 700 }}>Total Due</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginBottom: '1.25rem' }}
              >
                {submitting ? 'Verifying & Reserving Stock...' : 'Place Order Now'}
              </button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  justifyContent: 'center',
                }}
              >
                <ShieldCheck size={14} />
                <span>Price & live stock verified strictly on backend</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
