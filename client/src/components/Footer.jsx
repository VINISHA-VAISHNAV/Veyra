import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#09090b',
        color: '#a1a1aa',
        borderTop: '1px solid #27272a',
        paddingTop: '4.5rem',
        paddingBottom: '3.5rem',
        marginTop: '6rem',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3rem',
            marginBottom: '3.5rem',
          }}
        >
          {/* Brand Info */}
          <div>
            <div
              className="font-display"
              style={{
                fontSize: '1.4rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                color: '#fafafa',
                marginBottom: '0.85rem',
              }}
            >
              VEYRA
            </div>
            <p
              style={{
                fontSize: '0.9rem',
                color: '#d4d4d8',
                fontWeight: 500,
                marginBottom: '0.5rem',
              }}
            >
              A smarter way to shop.
            </p>
            <p style={{ fontSize: '0.825rem', lineHeight: 1.6, color: '#71717a' }}>
              Curated essentials engineered for the way you live, work, and move. Premium craftsmanship with intelligent simplicity.
            </p>
          </div>

          {/* Catalog Categories */}
          <div>
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#fafafa',
                marginBottom: '1rem',
              }}
            >
              Collection
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {['Audio', 'Wearables', 'Accessories', 'Lifestyle', 'Tech'].map((category) => (
                <li key={category}>
                  <Link
                    to={`/?category=${encodeURIComponent(category)}`}
                    style={{
                      fontSize: '0.85rem',
                      color: '#a1a1aa',
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.target.style.color = '#ffffff')}
                    onMouseLeave={(e) => (e.target.style.color = '#a1a1aa')}
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Experience & Trust */}
          <div>
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#fafafa',
                marginBottom: '1rem',
              }}
            >
              Standard of Quality
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
              <li>Carbon-neutral fulfillment</li>
              <li>Precision hardware inspection</li>
              <li>Encrypted database integrity</li>
              <li>Direct live order tracking</li>
            </ul>
          </div>

          {/* Quick Access */}
          <div>
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#fafafa',
                marginBottom: '1rem',
              }}
            >
              Account & Orders
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link to="/orders" style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
                  Track Order Status
                </Link>
              </li>
              <li>
                <Link to="/cart" style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
                  Review Cart
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
                  Sign In / Register
                </Link>
              </li>
              <li>
                <Link to="/admin" style={{ fontSize: '0.85rem', color: '#71717a' }}>
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid #27272a',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.8rem',
            color: '#71717a',
          }}
        >
          <div>&copy; {new Date().getFullYear()} VEYRA Technologies Inc. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
