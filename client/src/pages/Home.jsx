import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsApi } from '../services/api';
import ProductCard from '../components/ProductCard';
import {
  ArrowDown,
  Sparkles,
  ShieldCheck,
  Zap,
  SlidersHorizontal,
  RefreshCw,
  Search as SearchIcon,
} from 'lucide-react';

const CATEGORIES = ['All', 'Audio', 'Wearables', 'Accessories', 'Lifestyle', 'Tech'];

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const selectedCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';
  const sortOption = searchParams.get('sort') || 'newest';

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, sortOption]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsApi.getAll({
        category: selectedCategory,
        search: searchQuery,
        sort: sortOption,
      });
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve products from VEYRA catalog.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (cat) => {
    const nextParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', cat);
    }
    setSearchParams(nextParams);
  };

  const handleSortChange = (e) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('sort', e.target.value);
    setSearchParams(nextParams);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  const scrollToCollection = () => {
    const element = document.getElementById('collection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featuredProducts = products.filter((p) => p.featured);

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          paddingTop: '5.5rem',
          paddingBottom: '5.5rem',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--border-light)',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '780px' }}>
            {/* Tagline Badge */}
            <div
              className="badge badge-neutral"
              style={{
                marginBottom: '1.25rem',
                padding: '0.35rem 0.85rem',
                fontSize: '0.8rem',
              }}
            >
              <Sparkles size={13} style={{ color: 'var(--text-secondary)' }} />
              2026 Collection Released
            </div>

            {/* Brand Title & Hero Heading */}
            <h1
              className="font-display"
              style={{
                fontSize: 'clamp(2.75rem, 6vw, 4.5rem)',
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: '-0.035em',
                color: 'var(--text-primary)',
                marginBottom: '1.25rem',
              }}
            >
              A smarter way <br />
              to shop.
            </h1>

            {/* Hero Subtitle */}
            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: 'var(--text-secondary)',
                lineHeight: 1.55,
                marginBottom: '2.25rem',
                maxWidth: '620px',
              }}
            >
              Curated essentials for the way you live, work and move. Minimalist industrial design with uncompromised acoustic and technological precision.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <button onClick={scrollToCollection} className="btn btn-primary btn-lg">
                Explore Collection
                <ArrowDown size={18} />
              </button>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Direct inventory &bull; Secure checkout &bull; Live tracking
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Value Pillars */}
      <section
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-light)',
          padding: '2.5rem 0',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '2rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div
                style={{
                  padding: '0.65rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <Sparkles size={20} color="var(--text-primary)" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.925rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Curated Catalog
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Engineered selections prioritizing pure materials and aesthetic longevity.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div
                style={{
                  padding: '0.65rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <ShieldCheck size={20} color="var(--text-primary)" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.925rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Verified Verification
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  All pricing and stock levels validated server-side for complete trust.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div
                style={{
                  padding: '0.65rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <Zap size={20} color="var(--text-primary)" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.925rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Live Order Tracking
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Instant visual tracking from order confirmation to final delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Collection & Filter Section */}
      <section id="collection" style={{ padding: '4.5rem 0' }}>
        <div className="container">
          {/* Section Header */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--text-muted)',
                  marginBottom: '0.35rem',
                }}
              >
                Catalog Index
              </div>
              <h2
                className="font-display"
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                }}
              >
                Curated Collection
              </h2>
            </div>

            {/* Sort & Filter Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <SlidersHorizontal size={15} color="var(--text-muted)" />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Sort:
                </span>
              </div>
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="form-select"
                style={{ width: 'auto', padding: '0.45rem 1rem', fontSize: '0.825rem' }}
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Category Pills Navigation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingBottom: '0.5rem',
              marginBottom: '2.5rem',
              scrollbarWidth: 'none',
            }}
          >
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  style={{
                    padding: '0.5rem 1.15rem',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-full)',
                    border: `1px solid ${isActive ? '#09090b' : 'var(--border-light)'}`,
                    backgroundColor: isActive ? '#09090b' : '#ffffff',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Info Badge if filtering */}
          {(searchQuery || selectedCategory !== 'All') && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1.25rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '2rem',
                fontSize: '0.85rem',
              }}
            >
              <span>
                Showing results for{' '}
                {searchQuery && (
                  <strong>&ldquo;{searchQuery}&rdquo; </strong>
                )}
                {selectedCategory !== 'All' && (
                  <span>
                    in <strong>{selectedCategory}</strong>
                  </span>
                )}
                ({products.length} {products.length === 1 ? 'item' : 'items'})
              </span>
              <button
                onClick={handleClearFilters}
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--accent-blue)',
                  textDecoration: 'underline',
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="alert-box alert-error" style={{ marginBottom: '2rem' }}>
              <span>{error}</span>
              <button onClick={fetchProducts} className="btn btn-sm btn-secondary" style={{ marginLeft: 'auto' }}>
                <RefreshCw size={13} /> Retry
              </button>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
                gap: '1.75rem',
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div
                  key={n}
                  className="veyra-card"
                  style={{
                    height: '380px',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ flex: 1, backgroundColor: '#f4f4f5', animation: 'pulse 1.5s infinite' }} />
                  <div style={{ padding: '1.25rem' }}>
                    <div style={{ height: '14px', width: '30%', backgroundColor: '#e4e4e7', marginBottom: '8px' }} />
                    <div style={{ height: '18px', width: '80%', backgroundColor: '#e4e4e7', marginBottom: '14px' }} />
                    <div style={{ height: '24px', width: '40%', backgroundColor: '#e4e4e7' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
                gap: '1.75rem',
              }}
            >
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 1.5rem',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  color: 'var(--text-muted)',
                }}
              >
                <SearchIcon size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                No products match your criteria
              </h3>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  maxWidth: '420px',
                  margin: '0 auto 1.5rem',
                }}
              >
                We could not find any items matching your current filters. Try resetting the category or search terms.
              </p>
              <button onClick={handleClearFilters} className="btn btn-primary">
                View All Products
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
