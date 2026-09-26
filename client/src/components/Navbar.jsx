import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  User,
  Shield,
  Menu,
  X,
  LogOut,
  Package,
  Search,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemsCount, notification } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Toast Notification Container */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: '84px',
            right: '24px',
            zIndex: 1000,
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            className={`alert-box alert-${
              notification.type === 'danger'
                ? 'error'
                : notification.type === 'success'
                ? 'success'
                : 'info'
            }`}
            style={{
              boxShadow: 'var(--shadow-lg)',
              maxWidth: '380px',
              backgroundColor: notification.type === 'danger' ? '#fef2f2' : '#ffffff',
              border: '1px solid var(--border-strong)',
            }}
          >
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-light)',
          height: 'var(--nav-height)',
        }}
      >
        <div
          className="container"
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          {/* Brand Logo / Wordmark */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
            }}
          >
            <span
              className="font-display"
              style={{
                fontSize: '1.55rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                color: 'var(--text-primary)',
              }}
            >
              VEYRA
            </span>
          </Link>

          {/* Search Bar (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="navbar-search"
            style={{
              flex: '1',
              maxWidth: '380px',
              position: 'relative',
              display: 'none',
            }}
          >
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              placeholder="Search collection, audio, tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 1rem 0.55rem 2.25rem',
                fontSize: '0.85rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-full)',
                color: 'var(--text-primary)',
              }}
            />
          </form>

          {/* Navigation Links (Desktop) */}
          <nav
            className="desktop-nav"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
            }}
          >
            <Link
              to="/"
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                transition: 'color 0.15s ease',
              }}
            >
              Collection
            </Link>

            {isAuthenticated && (
              <Link
                to="/orders"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                }}
              >
                <Package size={16} />
                Orders
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="badge badge-dark"
                style={{
                  textDecoration: 'none',
                  fontSize: '0.75rem',
                  padding: '0.3rem 0.65rem',
                  letterSpacing: '0.04em',
                }}
              >
                <Shield size={12} />
                VEYRA / ADMIN
              </Link>
            )}

            {/* Cart Icon */}
            <Link
              to="/cart"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                padding: '0.45rem',
                color: 'var(--text-primary)',
              }}
              title="View Cart"
            >
              <ShoppingBag size={20} />
              {totalItemsCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '0px',
                    right: '-2px',
                    backgroundColor: 'var(--text-primary)',
                    color: 'var(--text-inverse)',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* User Account / Auth Actions */}
            {isAuthenticated ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  paddingLeft: '0.75rem',
                  borderLeft: '1px solid var(--border-light)',
                }}
              >
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}
                >
                  {user?.name?.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                  title="Sign Out"
                  style={{ padding: '0.35rem 0.6rem' }}
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile Menu Toggle Button */}
          <div
            className="mobile-toggle"
            style={{ display: 'none', alignItems: 'center', gap: '0.75rem' }}
          >
            <Link
              to="/cart"
              style={{
                position: 'relative',
                color: 'var(--text-primary)',
                padding: '0.25rem',
              }}
            >
              <ShoppingBag size={22} />
              {totalItemsCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-6px',
                    backgroundColor: 'var(--text-primary)',
                    color: 'var(--text-inverse)',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {totalItemsCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ color: 'var(--text-primary)', padding: '0.25rem' }}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'var(--nav-height)',
              left: 0,
              width: '100%',
              backgroundColor: 'var(--bg-surface)',
              borderBottom: '1px solid var(--border-light)',
              padding: '1.25rem 1.5rem',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <form onSubmit={handleSearchSubmit}>
              <div style={{ position: 'relative' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 1rem 0.6rem 2.25rem',
                    fontSize: '0.875rem',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                />
              </div>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}
              >
                Explore Collection
              </Link>
              {isAuthenticated && (
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}
                >
                  My Orders
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Shield size={16} /> VEYRA / ADMIN
                </Link>
              )}
            </div>

            <div
              style={{
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {isAuthenticated ? (
                <>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                  </div>
                  <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                    Sign Out
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Media query styling for responsive navbar */}
      <style>{`
        @media (min-width: 768px) {
          .navbar-search {
            display: block !important;
          }
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
