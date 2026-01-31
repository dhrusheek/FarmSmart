import axios from 'axios';
import { store } from '../store';
import { logout } from '../features/Auth/slices/authSlice';
import { addNotification } from '../store/uiSlice';

// Create Axios Instance
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
apiClient.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth.token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle specific error codes
        if (error.response) {
            const { status, data } = error.response;

            if (status === 401) {
                // Unauthorized - Logout user
                store.dispatch(logout());
                store.dispatch(addNotification({ type: 'error', message: 'Session expired. Please login again.' }));
            } else if (status >= 500) {
                // Server Error
                store.dispatch(addNotification({ type: 'error', message: 'Server error. Please try again later.' }));
            } else {
                // Other errors
                store.dispatch(addNotification({ type: 'error', message: data.message || 'Something went wrong' }));
            }
        } else if (error.request) {
            // Network Error
            store.dispatch(addNotification({ type: 'error', message: 'Network error. Check your connection.' }));
        }

        return Promise.reject(error);
    }
);

export default apiClient;
