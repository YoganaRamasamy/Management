import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const api = axios.create({
    baseURL: 'http://localhost:8085/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding the bearer token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling 401s (unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const getUserRole = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        // Adjust 'role' key based on your backend JWT structure (e.g., 'role', 'roles', 'authorities')
        return decoded.role || decoded.roles?.[0] || 'EMPLOYEE';
    } catch (error) {
        return null;
    }
};

export default api;
