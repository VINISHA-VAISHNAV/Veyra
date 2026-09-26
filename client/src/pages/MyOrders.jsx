import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../services/api';
import OrderTimeline from '../components/OrderTimeline';
import { Package, Calendar, MapPin, CreditCard, RefreshCw, ShoppingBag } from 'lucide-react';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ordersApi.getMyOrders();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      setError(err.message || 'Unable to retrieve order history.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="badge badge-success">Delivered</span>;
      case 'Shipped':
        return <span className="badge badge-info">Shipped</span>;
      case 'Confirmed':
        return <span className="badge badge-dark">Confirmed</span>;
      case 'Cancelled':
        return <span className="badge badge-danger">Cancelled</span>;
      default:
        return <span className="badge badge-warning">Placed</span>;
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '6rem', textAlign: 'center' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Loading your VEYRA orders...
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
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
              Order History & Tracking
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Monitor live fulfillment milestones and review previous purchases.
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {error && (
          <div className="alert-box alert-error" style={{ marginBottom: '2rem' }}>
            <span>{error}</span>
          </div>
        )}

        {/* Empty Orders State */}
        {orders.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4.5rem 1.5rem',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                color: 'var(--text-muted)',
              }}
            >
              <Package size={28} />
            </div>
            <h3
              className="font-display"
              style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem' }}
            >
              No orders registered yet
            </h3>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                maxWidth: '400px',
                margin: '0 auto 1.5rem',
              }}
            >
              Once you checkout from the VEYRA collection, your live status tracking will be displayed here.
            </p>
            <Link to="/" className="btn btn-primary">
              <ShoppingBag size={16} /> Explore Collection
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {orders.map((order) => (
              <div
                key={order._id}
                className="veyra-card"
                style={{
                  backgroundColor: '#ffffff',
                  padding: '1.75rem',
                }}
              >
                {/* Order Top Bar */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    paddingBottom: '1.25rem',
                    borderBottom: '1px solid var(--border-light)',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: 'var(--text-muted)',
                        }}
                      >
                        Order ID
                      </span>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'monospace' }}>
                        #{order._id.slice(-8).toUpperCase()}
                      </div>
                    </div>

                    <div style={{ borderLeft: '1px solid var(--border-light)', paddingLeft: '1rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: 'var(--text-muted)',
                        }}
                      >
                        Date Placed
                      </span>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </div>

                    <div style={{ borderLeft: '1px solid var(--border-light)', paddingLeft: '1rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: 'var(--text-muted)',
                        }}
                      >
                        Total
                      </span>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        ${order.total.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div>{getStatusBadge(order.status)}</div>
                </div>

                {/* Visual Order Tracking Timeline */}
                <div style={{ marginBottom: '1.75rem', padding: '0 0.5rem' }}>
                  <OrderTimeline status={order.status} />
                </div>

                {/* Items Purchased List */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1.25rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    Items in Order ({order.items.length})
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '1rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: '4px',
                              objectFit: 'cover',
                              backgroundColor: '#ffffff',
                              border: '1px solid var(--border-light)',
                            }}
                          />
                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Qty: {item.quantity} &times; ${item.price.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Payment Meta Footer */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1.25rem',
                    fontSize: '0.825rem',
                    color: 'var(--text-secondary)',
                    borderTop: '1px solid var(--border-light)',
                    paddingTop: '1rem',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      Shipping Address:
                    </span>
                    <div>{order.shippingAddress.name} ({order.shippingAddress.phone})</div>
                    <div>{order.shippingAddress.address}, {order.shippingAddress.city} - {order.shippingAddress.pincode}</div>
                  </div>

                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      Payment Method:
                    </span>
                    <div>{order.paymentMethod}</div>
                    <div style={{ color: 'var(--status-success)', fontWeight: 500 }}>
                      Verified on Server
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
