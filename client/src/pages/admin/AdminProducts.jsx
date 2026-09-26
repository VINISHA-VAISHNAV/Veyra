import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';
import {
  Plus,
  Edit2,
  Trash2,
  Shield,
  Layers,
  ShoppingBag,
  X,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

const CATEGORIES = ['Audio', 'Wearables', 'Accessories', 'Lifestyle', 'Tech'];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Audio',
    image: '',
    stock: '',
    featured: false,
  });
  const [modalSubmitting, setModalSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getProducts();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch catalog.');
    } finally {
      setLoading(false);
    }
  };

  const notify = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Audio',
      image: '',
      stock: '',
      featured: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock,
      featured: product.featured,
    });
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      formData.price === '' ||
      !formData.category ||
      !formData.image.trim() ||
      formData.stock === ''
    ) {
      setError('Please complete all product fields.');
      return;
    }

    try {
      setModalSubmitting(true);
      if (editingProduct) {
        // Update product
        const res = await adminApi.updateProduct(editingProduct._id, formData);
        if (res.success) {
          notify(`Updated "${formData.name}" successfully.`);
          setIsModalOpen(false);
          fetchProducts();
        }
      } else {
        // Create product
        const res = await adminApi.createProduct(formData);
        if (res.success) {
          notify(`Created "${formData.name}" in catalog.`);
          setIsModalOpen(false);
          fetchProducts();
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to save product in database.');
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently remove "${name}" from the VEYRA catalog?`)) {
      try {
        const res = await adminApi.deleteProduct(id);
        if (res.success) {
          notify(`Removed "${name}" from catalog.`);
          fetchProducts();
        }
      } catch (err) {
        setError(err.message || 'Failed to delete product.');
      }
    }
  };

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '6rem' }}>
      <div className="container">
        {/* Navigation & Header */}
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
              Products Management
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/admin" className="btn btn-secondary btn-sm">
              Overview
            </Link>
            <Link to="/admin/orders" className="btn btn-secondary btn-sm">
              <ShoppingBag size={14} /> Orders Management
            </Link>
            <button onClick={openAddModal} className="btn btn-primary btn-sm">
              <Plus size={14} /> Add Product
            </button>
            <button onClick={fetchProducts} className="btn btn-secondary btn-sm" title="Refresh">
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

        {/* Products Table */}
        <div
          className="veyra-card"
          style={{
            backgroundColor: '#ffffff',
            padding: '1.5rem',
          }}
        >
          {loading ? (
            <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading VEYRA catalog items...
            </div>
          ) : products.length === 0 ? (
            <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              No products found in the database. Use &ldquo;Add Product&rdquo; above.
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
                    <th style={{ padding: '0.85rem 0.5rem' }}>ITEM</th>
                    <th style={{ padding: '0.85rem 0.5rem' }}>CATEGORY</th>
                    <th style={{ padding: '0.85rem 0.5rem' }}>PRICE</th>
                    <th style={{ padding: '0.85rem 0.5rem' }}>STOCK</th>
                    <th style={{ padding: '0.85rem 0.5rem' }}>FEATURED</th>
                    <th style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr
                      key={prod._id}
                      style={{ borderBottom: '1px solid var(--border-light)' }}
                    >
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <img
                            src={prod.image}
                            alt={prod.name}
                            style={{
                              width: '46px',
                              height: '46px',
                              borderRadius: '4px',
                              objectFit: 'cover',
                              backgroundColor: '#f4f4f5',
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                              {prod.name}
                            </div>
                            <div
                              style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-muted)',
                                maxWidth: '280px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {prod.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '1rem 0.5rem' }}>
                        <span className="badge badge-neutral">{prod.category}</span>
                      </td>

                      <td style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>
                        ${prod.price.toFixed(2)}
                      </td>

                      <td style={{ padding: '1rem 0.5rem' }}>
                        {prod.stock <= 0 ? (
                          <span className="badge badge-danger">0 (Out)</span>
                        ) : prod.stock <= 5 ? (
                          <span className="badge badge-warning">{prod.stock} low</span>
                        ) : (
                          <span className="badge badge-success">{prod.stock} in stock</span>
                        )}
                      </td>

                      <td style={{ padding: '1rem 0.5rem' }}>
                        {prod.featured ? (
                          <span className="badge badge-dark">Yes</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No</span>
                        )}
                      </td>

                      <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                        <div
                          style={{
                            display: 'inline-flex',
                            gap: '0.5rem',
                            alignItems: 'center',
                          }}
                        >
                          <button
                            onClick={() => openEditModal(prod)}
                            className="btn btn-secondary btn-sm"
                            title="Edit Product"
                          >
                            <Edit2 size={13} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(prod._id, prod.name)}
                            className="btn btn-danger btn-sm"
                            title="Delete Product"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
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
                <h2 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                  {editingProduct ? 'Edit Product Details' : 'Add New Product to Catalog'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleModalSubmit} style={{ padding: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-input"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Stock Units *</label>
                    <input
                      type="number"
                      min="0"
                      className="form-input"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL *</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.65rem' }}>
                  <input
                    type="checkbox"
                    id="featuredCheckbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  <label htmlFor="featuredCheckbox" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                    Mark as Featured Collection item
                  </label>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '0.75rem',
                    marginTop: '1.5rem',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid var(--border-light)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={modalSubmitting} className="btn btn-primary">
                    {modalSubmitting ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
