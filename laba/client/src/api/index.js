import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  // Товары
  getProducts: () => api.get('/products'),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),

  // Заказы
  getOrders: () => api.get('/orders'),
  createOrder: (data) => api.post('/orders', data),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
}; 