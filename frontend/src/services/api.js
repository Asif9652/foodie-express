import axios from 'axios';
import { API_URL } from '../config/api';

const API = axios.create({
    baseURL: API_URL ? `${API_URL}/api` : '/api',
});

// Add a request interceptor to include JWT token in headers
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// Auth Services
export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const signupUser = (formData) => API.post('/auth/signup', formData);
export const getProfile = () => API.get('/auth/profile');

// Restaurant & Menu Services
export const fetchRestaurants = () => API.get('/restaurants');
export const fetchRestaurantById = (id) => API.get(`/restaurants/${id}`);
export const fetchMenuByRestaurant = (id) => API.get(`/menu/${id}`);

// Cart Services
export const fetchCart = () => API.get('/cart');
export const addToCart = (data) => API.post('/cart/add', data);
export const removeFromCart = (itemId) => API.delete(`/cart/remove/${itemId}`);

// Order Services
export const createOrder = (orderData) => API.post('/orders/create', orderData);
export const fetchUserOrders = () => API.get('/orders/user');
export const fetchOrderById = (id) => API.get(`/orders/${id}`);

export default API;
