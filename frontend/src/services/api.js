const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('aura_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Authentication
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Authentication failed' }));
      throw new Error(err.detail || 'Login failed');
    }
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  // Products
  async getProducts(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.category && params.category !== 'All') {
      searchParams.append('category', params.category);
    }
    if (params.featured !== undefined) {
      searchParams.append('featured', params.featured);
    }
    if (params.q) {
      searchParams.append('q', params.q);
    }

    const queryStr = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await fetch(`${API_BASE}/products${queryStr}`);
    if (!res.ok) throw new Error('Failed to load products');
    return res.json();
  },

  async getProductBySlug(slug) {
    const res = await fetch(`${API_BASE}/products/${slug}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  },

  async createProduct(productData) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(productData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to create product' }));
      throw new Error(err.detail || 'Failed to create product');
    }
    return res.json();
  },

  async updateProduct(id, productData) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(productData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to update product' }));
      throw new Error(err.detail || 'Failed to update product');
    }
    return res.json();
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return true;
  },

  async reorderProducts(reorderList) {
    const res = await fetch(`${API_BASE}/products/batch/reorder`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(reorderList),
    });
    if (!res.ok) throw new Error('Failed to reorder products');
    return res.json();
  },

  // Site Content
  async getAboutContent() {
    const res = await fetch(`${API_BASE}/content/about`);
    if (!res.ok) throw new Error('Failed to load About content');
    return res.json();
  },

  async updateAboutContent(data) {
    const res = await fetch(`${API_BASE}/content/about`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update About content');
    return res.json();
  },

  // Inquiries / Contact
  async submitInquiry(inquiryData) {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryData),
    });
    if (!res.ok) throw new Error('Failed to submit inquiry');
    return res.json();
  },

  async getInquiries() {
    const res = await fetch(`${API_BASE}/contact/inquiries`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to fetch inquiries');
    return res.json();
  },

  // File Upload
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(err.detail || 'Upload failed');
    }
    return res.json();
  }
};
