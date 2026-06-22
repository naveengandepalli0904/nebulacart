import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// Product helpers
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const getAllProductsAdmin = () => api.get('/products/admin/all');
export const addReview = (id, data) => api.post(`/products/${id}/reviews`, data);

// Auth helpers
export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');
export const updateProfile = (data) => api.put('/auth/profile', data);

// Order helpers
export const createOrder = (data) => api.post('/orders', data);
export const getMyOrders = () => api.get('/orders/my');
export const getOrder = (id) => api.get(`/orders/${id}`);
export const getAllOrdersAdmin = (params) => api.get('/orders/admin/all', { params });
export const updateOrderStatus = (id, data) => api.put(`/orders/${id}/status`, data);
export const getAnalytics = () => api.get('/orders/admin/analytics');

// User helpers (admin)
export const getAllUsers = () => api.get('/users');
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const addAddress = (data) => api.post('/users/address', data);
export const deleteAddress = (id) => api.delete(`/users/address/${id}`);
export const toggleWishlist = (id) => api.put(`/users/wishlist/${id}`);

// Coupon helpers
export const validateCoupon = (data) => api.post('/coupons/validate', data);
export const getAllCoupons = () => api.get('/coupons');
export const createCoupon = (data) => api.post('/coupons', data);
export const updateCoupon = (id, data) => api.put(`/coupons/${id}`, data);
export const deleteCoupon = (id) => api.delete(`/coupons/${id}`);

// Upload
export const uploadImage = (formData) =>
  api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
