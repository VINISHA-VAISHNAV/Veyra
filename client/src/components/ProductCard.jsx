import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Plus, Check, AlertCircle } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart, cartItems } = useCart();

  const isOutOfStock = product.stock <= 0;
  const cartItem = cartItems.find((item) => item.product === product._id);
  const qtyInCart = cartItem ? cartItem.quantity : 0;
  const isMaxInCart = qtyInCart >= product.stock;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock && !isMaxInCart) {
      addToCart(product, 1);
    }
  };

  return (
    <div
      className="veyra-card veyra-card-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Product Image Container */}
      <Link
        to={`/products/${product._id}`}
        style={{
          position: 'relative',
          paddingTop: '80%', // 5:4 aspect ratio
          width: '100%',
          backgroundColor: '#f4f4f5',
          overflow: 'hidden',
          display: 'block',
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.03)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
        />

        {/* Featured Tag */}
        {product.featured && (
          <span
            className="badge badge-dark"
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              fontSize: '0.7rem',
              letterSpacing: '0.04em',
            }}
          >
            Featured
          </span>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(9, 9, 11, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              className="badge"
              style={{
                backgroundColor: '#ffffff',
                color: '#09090b',
                fontWeight: 700,
                fontSize: '0.75rem',
              }}
            >
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Card Details */}
      <div
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          {/* Category & Stock Indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--text-muted)',
              }}
            >
              {product.category}
            </span>

            {isOutOfStock ? (
              <span className="badge badge-danger" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                Out of Stock
              </span>
            ) : product.stock <= 5 ? (
              <span className="badge badge-warning" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                Only {product.stock} left
              </span>
            ) : (
              <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                In Stock
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link to={`/products/${product._id}`}>
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                lineHeight: 1.35,
                marginBottom: '0.5rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price and Action Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1rem',
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--border-light)',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}
            >
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isMaxInCart}
            className={`btn btn-sm ${
              isOutOfStock || isMaxInCart ? 'btn-secondary' : 'btn-primary'
            }`}
            title={
              isOutOfStock
                ? 'Out of Stock'
                : isMaxInCart
                ? 'Maximum in cart'
                : 'Add to Cart'
            }
          >
            {isOutOfStock ? (
              'Sold Out'
            ) : isMaxInCart ? (
              <>
                <Check size={14} /> Max in Cart
              </>
            ) : (
              <>
                <Plus size={14} /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
