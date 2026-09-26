const API_BASE = '/api';

/**
 * Universal request handler with automatic JWT Bearer token attachment
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('veyra_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body !== 'string') {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = { success: false, message: 'Server returned an unparseable response.' };
  }

  if (!response.ok) {
    const error = new Error(data.message || 'An unexpected error occurred.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Authentication API
export const authApi = {
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  signup: (userData) => request('/auth/signup', { method: 'POST', body: userData }),
  getMe: () => request('/auth/me', { method: 'GET' }),
};

// Products API
export const productsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.featured) query.append('featured', 'true');
    if (params.sort) query.append('sort', params.sort);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/products${queryString}`, { method: 'GET' });
  },
  getById: (id) => request(`/products/${id}`, { method: 'GET' }),
};

// Orders API
export const ordersApi = {
  create: (orderPayload) => request('/orders', { method: 'POST', body: orderPayload }),
  getMyOrders: () => request('/orders/my', { method: 'GET' }),
};

// Admin API
export const adminApi = {
  getStats: () => request('/admin/stats', { method: 'GET' }),
  getProducts: () => request('/admin/products', { method: 'GET' }),
  createProduct: (data) => request('/admin/products', { method: 'POST', body: data }),
  updateProduct: (id, data) => request(`/admin/products/${id}`, { method: 'PATCH', body: data }),
  deleteProduct: (id) => request(`/admin/products/${id}`, { method: 'DELETE' }),
  getOrders: () => request('/admin/orders', { method: 'GET' }),
  updateOrderStatus: (id, status) => request(`/admin/orders/${id}/status`, { method: 'PATCH', body: { status } }),
};
