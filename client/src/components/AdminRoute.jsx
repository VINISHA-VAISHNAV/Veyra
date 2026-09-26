import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          fontWeight: 500,
        }}
      >
        Verifying administrative authorization...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div
        className="container"
        style={{
          paddingTop: '6rem',
          paddingBottom: '6rem',
          textAlign: 'center',
          maxWidth: '520px',
        }}
      >
        <div className="alert-box alert-error" style={{ justifyContent: 'center' }}>
          Restricted Portal: Admin privileges required.
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Your current account is authenticated as a customer and does not possess access to the VEYRA management system.
        </p>
        <Navigate to="/" replace />
      </div>
    );
  }

  return children;
}
