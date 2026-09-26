import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';
import {
  Shield,
  Layers,
  ShoppingBag,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Eye,
  X,
} from 'lucide-react';

const STATUS_OPTIONS = ['Placed', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getOrders();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch customer orders.');
    } finally {
      setLoading(false);
    }
  };

  const notify = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      setError(null);
      const res = await adminApi.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        notify(`Order status updated to "${newStatus}".`);
        // Update local state smoothly
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrderDetails?._id === orderId) {
          setSelectedOrderDetails((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to update order tracking status.');
    } finally {
      setUpdatingId(null);
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

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '6rem' }}>
      <div className="container">
        {/* Header & Tabs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.25rem',
            marginBottom: '2rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--border-light)',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                marginBottom: '0.25rem',
              }}
            >
              <Shield size={14} /> VEYRA / ADMIN
            </div>
            <h1
              className="font-display"
              style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}
            >
              Orders Management
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/admin" className="btn btn-secondary btn-sm">
              Overview
            </Link>
            <Link to="/admin/products" className="btn btn-secondary btn-sm">
              <Layers size={14} /> Products Management
            </Link>
            <button onClick={fetchOrders} className="btn btn-secondary btn-sm" title="Refresh">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="alert-box alert-success" style={{ marginBottom: '1.5rem' }}>
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}
        {error && (
          <div className="alert-box alert-error" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Orders Table */}
        <div
          className="veyra-card"
          style={{
            backgroundColor: '#ffffff',
            padding: '1.5rem',
          }}
        >
          {loading ? (
            <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading all customer orders...
            </div>
          ) : orders.length === 0 ? (
            <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              No orders have been placed across the store yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr
                    style={{
                      borderBottom: '1px solid var(--border-light)',
                      textAlign: 'left',
                      color: 'var(--text-muted)',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    <th style={{ padding: '0.85rem 0.5rem' }}>ORDER ID</th>
                    <th style={{ padding: '0.85rem 0.5rem' }}>CUSTOMER</th>
                    <th style={{ padding: '0.85rem 0.5rem' }}>TOTAL</th>
                    <th style={{ padding: '0.85rem 0.5rem' }}>CURRENT STATUS</th>
                    <th style={{ padding: '0.85rem 0.5rem' }}>UPDATE STATUS</th>
                    <th style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr key={ord._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: 700, fontFamily: 'monospace' }}>
                        #{ord._id.slice(-8).toUpperCase()}
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td style={{ padding: '1rem 0.5rem' }}>
                        <div style={{ fontWeight: 600 }}>{ord.user?.name || ord.shippingAddress.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.user?.email}</div>
                      </td>

                      <td style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>
                        ${ord.total.toFixed(2)}
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                          {ord.paymentMethod}
                        </div>
                      </td>

                      <td style={{ padding: '1rem 0.5rem' }}>{getStatusBadge(ord.status)}</td>

                      <td style={{ padding: '1rem 0.5rem' }}>
                        <select
                          value={ord.status}
                          disabled={updatingId === ord._id}
                          onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                          className="form-select"
                          style={{
                            width: 'auto',
                            padding: '0.35rem 0.65rem',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                          }}
                        >
                          {STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedOrderDetails(ord)}
                          className="btn btn-secondary btn-sm"
                          title="Inspect Order Details"
                        >
                          <Eye size={13} /> Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Details Drawer / Modal */}
        {selectedOrderDetails && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <div
                style={{
                  padding: '1.25rem 1.5rem',
                  borderBottom: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <h2 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                    Order #{selectedOrderDetails._id.slice(-8).toUpperCase()}
                  </h2>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Placed on {new Date(selectedOrderDetails.createdAt).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  style={{ color: 'var(--text-muted)' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Status selector */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Tracking Status:</span>
                  <select
                    value={selectedOrderDetails.status}
                    onChange={(e) => handleStatusChange(selectedOrderDetails._id, e.target.value)}
                    className="form-select"
                    style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Items */}
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Purchased Items ({selectedOrderDetails.items.length})
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      marginTop: '0.65rem',
                      backgroundColor: 'var(--bg-secondary)',
                      padding: '1rem',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    {selectedOrderDetails.items.map((it, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.85rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={it.image}
                            alt={it.name}
                            style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600 }}>{it.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Qty: {it.quantity} &times; ${it.price.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <div style={{ fontWeight: 700 }}>
                          ${(it.price * it.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Customer */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    fontSize: '0.825rem',
                    borderTop: '1px solid var(--border-light)',
                    paddingTop: '1rem',
                  }}
                >
                  <div>
                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Recipient:</strong>
                    <div>{selectedOrderDetails.shippingAddress.name}</div>
                    <div>{selectedOrderDetails.shippingAddress.phone}</div>
                    <div style={{ color: 'var(--text-muted)' }}>{selectedOrderDetails.user?.email}</div>
                  </div>

                  <div>
                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Address:</strong>
                    <div>{selectedOrderDetails.shippingAddress.address}</div>
                    <div>
                      {selectedOrderDetails.shippingAddress.city} - {selectedOrderDetails.shippingAddress.pincode}
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid var(--border-light)',
                    paddingTop: '1rem',
                  }}
                >
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Total Authorized</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                    ${selectedOrderDetails.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
