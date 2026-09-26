import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productsApi } from '../services/api';
import { useCart } from '../context/CartContext';
import {
  ArrowLeft,
  Check,
  Shield,
  Truck,
  RotateCcw,
  Minus,
  Plus,
  ShoppingBag,
} from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsApi.getById(id);
      if (data.success && data.product) {
        setProduct(data.product);
      } else {
        setError('Product could not be retrieved from VEYRA catalog.');
      }
    } catch (err) {
      setError(err.message || 'Product not found or unavailable.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="container"
        style={{
          paddingTop: '6rem',
          paddingBottom: '6rem',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Loading VEYRA product specifications...
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div
        className="container"
        style={{
          paddingTop: '6rem',
          paddingBottom: '6rem',
          maxWidth: '560px',
          textAlign: 'center',
        }}
      >
        <div className="alert-box alert-error" style={{ justifyContent: 'center' }}>
          {error || 'Product not found'}
        </div>
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft size={16} /> Return to Collection
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const cartItem = cartItems.find((item) => item.product === product._id);
  const currentInCart = cartItem ? cartItem.quantity : 0;
  const maxCanAdd = Math.max(0, product.stock - currentInCart);

  const handleIncrement = () => {
    if (quantity < maxCanAdd) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!isOutOfStock && quantity > 0 && quantity <= maxCanAdd) {
      addToCart(product, quantity);
      setQuantity(1);
    }
  };

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <div className="container">
        {/* Breadcrumb Back Link */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
            }}
          >
            <ArrowLeft size={16} /> Back to Collection
          </button>
        </div>

        {/* Editorial Product Detail Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'start',
          }}
        >
          {/* Product Gallery / Hero Media */}
          <div
            className="veyra-card"
            style={{
              position: 'relative',
              backgroundColor: '#f4f4f5',
              paddingTop: '90%',
              overflow: 'hidden',
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {product.featured && (
              <span
                className="badge badge-dark"
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  fontSize: '0.75rem',
                }}
              >
                Featured Selection
              </span>
            )}
          </div>

          {/* Product Specifications & Purchase Column */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Category Pill */}
            <div style={{ marginBottom: '0.75rem' }}>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                }}
              >
                {product.category}
              </span>
            </div>

            {/* Product Title */}
            <h1
              className="font-display"
              style={{
                fontSize: '2.25rem',
                fontWeight: 800,
                lineHeight: 1.15,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                marginBottom: '1rem',
              }}
            >
              {product.name}
            </h1>

            {/* Price & Stock Status Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                marginBottom: '1.75rem',
                paddingBottom: '1.25rem',
                borderBottom: '1px solid var(--border-light)',
              }}
            >
              <span
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                }}
              >
                ${product.price.toFixed(2)}
              </span>

              {isOutOfStock ? (
                <span className="badge badge-danger">Out of Stock</span>
              ) : product.stock <= 5 ? (
                <span className="badge badge-warning">Only {product.stock} units remaining</span>
              ) : (
                <span className="badge badge-success">In Stock ({product.stock} units ready)</span>
              )}
            </div>

            {/* Description */}
            <div style={{ marginBottom: '2.25rem' }}>
              <h3
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.65rem',
                }}
              >
                Engineering & Overview
              </h3>
              <p
                style={{
                  fontSize: '0.95rem',
                  lineHeight: 1.65,
                  color: 'var(--text-secondary)',
                }}
              >
                {product.description}
              </p>
            </div>

            {/* Purchasing Controls */}
            {!isOutOfStock && (
              <div
                style={{
                  padding: '1.5rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '2rem',
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
                  <label
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}
                  >
                    Select Quantity
                  </label>

                  {/* Quantity Stepper */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      backgroundColor: 'var(--bg-secondary)',
                    }}
                  >
                    <button
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      style={{
                        padding: '0.45rem 0.75rem',
                        color: 'var(--text-primary)',
                      }}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span
                      style={{
                        padding: '0.45rem 1rem',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        minWidth: '40px',
                        textAlign: 'center',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      disabled={quantity >= maxCanAdd}
                      style={{
                        padding: '0.45rem 0.75rem',
                        color: 'var(--text-primary)',
                      }}
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* In Cart Feedback */}
                {currentInCart > 0 && (
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      marginBottom: '1rem',
                    }}
                  >
                    You currently have {currentInCart} in your cart. (Max: {product.stock})
                  </div>
                )}

                {/* Add to Cart CTA */}
                <button
                  onClick={handleAddToCart}
                  disabled={maxCanAdd === 0}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', gap: '0.65rem' }}
                >
                  <ShoppingBag size={18} />
                  {maxCanAdd === 0 ? 'Max Quantity in Cart' : `Add ${quantity} to Cart &bull; $${(product.price * quantity).toFixed(2)}`}
                </button>
              </div>
            )}

            {isOutOfStock && (
              <div
                style={{
                  padding: '1.25rem',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '2rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  This piece is currently unavailable for order. Check back soon for stock replenishment.
                </div>
              </div>
            )}

            {/* Standard Guarantees */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                borderTop: '1px solid var(--border-light)',
                paddingTop: '1.5rem',
                textAlign: 'center',
              }}
            >
              <div>
                <Truck size={18} color="var(--text-secondary)" style={{ margin: '0 auto 0.35rem' }} />
                <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>Expedited Shipping</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Dispatched in 24h</div>
              </div>
              <div>
                <Shield size={18} color="var(--text-secondary)" style={{ margin: '0 auto 0.35rem' }} />
                <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>2-Year Warranty</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Precision guarantee</div>
              </div>
              <div>
                <RotateCcw size={18} color="var(--text-secondary)" style={{ margin: '0 auto 0.35rem' }} />
                <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>30-Day Return</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>No questions asked</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
