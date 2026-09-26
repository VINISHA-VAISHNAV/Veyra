import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, totalItemsCount } =
    useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div
          className="container"
          style={{
            maxWidth: '520px',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            padding: '3.5rem 2rem',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: 'var(--text-muted)',
            }}
          >
            <ShoppingBag size={28} />
          </div>
          <h2
            className="font-display"
            style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.65rem' }}
          >
            Your VEYRA Cart is empty
          </h2>
          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              marginBottom: '2rem',
              lineHeight: 1.5,
            }}
          >
            Discover our curated collection of industrial-grade audio, wearables, and essentials.
          </p>
          <Link to="/" className="btn btn-primary btn-lg">
            Explore Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
      <div className="container">
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2.5rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--border-light)',
          }}
        >
          <div>
            <h1
              className="font-display"
              style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}
            >
              Your Cart
            </h1>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} in your selection
            </span>
          </div>

          <button
            onClick={clearCart}
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--status-danger)',
              cursor: 'pointer',
            }}
          >
            Clear Entire Cart
          </button>
        </div>

        {/* Layout Grid: Items List + Order Summary Sidebar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'start',
          }}
        >
          {/* Items Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {cartItems.map((item) => (
              <div
                key={item.product}
                className="veyra-card"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  gap: '1.25rem',
                  backgroundColor: '#ffffff',
                }}
              >
                {/* Thumbnail */}
                <Link
                  to={`/products/${item.product}`}
                  style={{
                    width: '96px',
                    height: '96px',
                    flexShrink: 0,
                    backgroundColor: '#f4f4f5',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Link>

                {/* Details */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                      }}
                    >
                      <Link to={`/products/${item.product}`}>
                        <h3
                          style={{
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            marginBottom: '0.25rem',
                          }}
                        >
                          {item.name}
                        </h3>
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.product)}
                        style={{ color: '#a1a1aa', padding: '0.2rem' }}
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Category: {item.category}
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '1rem',
                    }}
                  >
                    {/* Stepper */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-secondary)',
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item.product, item.quantity - 1)}
                        style={{ padding: '0.3rem 0.55rem', color: 'var(--text-primary)' }}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span
                        style={{
                          padding: '0.3rem 0.75rem',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          backgroundColor: '#ffffff',
                          minWidth: '32px',
                          textAlign: 'center',
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        style={{
                          padding: '0.3rem 0.55rem',
                          color: item.quantity >= item.stock ? '#d4d4d8' : 'var(--text-primary)',
                          cursor: item.quantity >= item.stock ? 'not-allowed' : 'pointer',
                        }}
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Unit & Subtotal Price */}
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                        }}
                      >
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        ${item.price.toFixed(2)} each
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div style={{ marginTop: '1rem' }}>
              <Link
                to="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                }}
              >
                <ArrowLeft size={16} /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar */}
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
                fontSize: '1.25rem',
                fontWeight: 800,
                marginBottom: '1.25rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--border-light)',
              }}
            >
              Order Summary
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Items Subtotal</span>
                <span style={{ fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Standard Delivery</span>
                <span style={{ fontWeight: 600, color: 'var(--status-success)' }}>Complimentary</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Estimated Tax</span>
                <span style={{ fontWeight: 600 }}>$0.00</span>
              </div>

              <div
                style={{
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-light)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <span style={{ fontSize: '1rem', fontWeight: 700 }}>Total</span>
                <span
                  style={{
                    fontSize: '1.45rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                  }}
                >
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', gap: '0.5rem', marginBottom: '1.25rem' }}
            >
              Proceed to VEYRA Checkout
              <ArrowRight size={18} />
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
              <span>Real-time server stock verification enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
