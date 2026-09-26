import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  ArrowRight,
  Shield,
  Layers,
  Clock,
  RefreshCw,
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getStats();
      if (data.success) {
        setStats(data.stats);
        setRecentOrders(data.recentOrders || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve administrative statistics.');
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

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '6rem' }}>
      <div className="container">
        {/* Admin Header & Nav Tabs */}
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
              Management Console
            </h1>
          </div>

          {/* Navigation Links */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/admin" className="btn btn-primary btn-sm">
              Overview
            </Link>
            <Link to="/admin/products" className="btn btn-secondary btn-sm">
              <Layers size={14} /> Products Management
            </Link>
            <Link to="/admin/orders" className="btn btn-secondary btn-sm">
              <ShoppingBag size={14} /> Orders Management
            </Link>
            <button onClick={fetchStats} className="btn btn-secondary btn-sm" title="Refresh data">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {error && (
          <div className="alert-box alert-error" style={{ marginBottom: '2rem' }}>
            <span>{error}</span>
          </div>
        )}

        {/* 4 Metric Summary Cards */}
        {loading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem',
            }}
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="veyra-card"
                style={{ height: '120px', backgroundColor: '#ffffff', padding: '1.5rem' }}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem',
            }}
          >
            {/* Card 1: Total Products */}
            <div className="veyra-card" style={{ padding: '1.5rem', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Total Catalog Items
                </span>
                <div style={{ padding: '0.4rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                  <Layers size={18} color="var(--text-primary)" />
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {stats?.totalProducts ?? 0}
              </div>
              <Link
                to="/admin/products"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--accent-blue)',
                  marginTop: '0.5rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                }}
              >
                Manage Catalog <ArrowRight size={12} />
              </Link>
            </div>

            {/* Card 2: Total Orders */}
            <div className="veyra-card" style={{ padding: '1.5rem', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Total Orders
                </span>
                <div style={{ padding: '0.4rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                  <ShoppingBag size={18} color="var(--text-primary)" />
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {stats?.totalOrders ?? 0}
              </div>
              <Link
                to="/admin/orders"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--accent-blue)',
                  marginTop: '0.5rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                }}
              >
                Process Orders <ArrowRight size={12} />
              </Link>
            </div>

            {/* Card 3: Total Users */}
            <div className="veyra-card" style={{ padding: '1.5rem', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Registered Customers
                </span>
                <div style={{ padding: '0.4rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                  <Users size={18} color="var(--text-primary)" />
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {stats?.totalUsers ?? 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Active database accounts
              </div>
            </div>

            {/* Card 4: Revenue */}
            <div className="veyra-card" style={{ padding: '1.5rem', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Net Order Value
                </span>
                <div style={{ padding: '0.4rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                  <DollarSign size={18} color="var(--text-primary)" />
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                ${(stats?.revenue ?? 0).toFixed(2)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--status-success)', marginTop: '0.5rem', fontWeight: 600 }}>
                Excludes cancelled orders
              </div>
            </div>
          </div>
        )}

        {/* Recent Orders Overview */}
        <div
          className="veyra-card"
          style={{
            backgroundColor: '#ffffff',
            padding: '1.75rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
            }}
          >
            <div>
              <h2
                className="font-display"
                style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.2rem' }}
              >
                Recent Fulfillment Activity
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Latest orders received across the storefront
              </span>
            </div>

            <Link to="/admin/orders" className="btn btn-secondary btn-sm">
              View All Orders <ArrowRight size={14} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              No recent orders registered in the system.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-light)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>ORDER</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>CUSTOMER</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>ITEMS</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>TOTAL</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>STATUS</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((ord) => (
                    <tr key={ord._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700, fontFamily: 'monospace' }}>
                        #{ord._id.slice(-8).toUpperCase()}
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        <div style={{ fontWeight: 600 }}>{ord.user?.name || ord.shippingAddress?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.user?.email}</div>
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'}
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700 }}>
                        ${ord.total.toFixed(2)}
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem' }}>{getStatusBadge(ord.status)}</td>
                      <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-secondary)' }}>
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
