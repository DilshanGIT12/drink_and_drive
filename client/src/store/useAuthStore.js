import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set, get) => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: false,
    loading: false,
    error: null,

    loadUser: () => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        if (token && user) {
            set({ token, user, isAuthenticated: true });
        }
    },

    login: async (phoneNumber, password) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { phoneNumber, password });
            const { token, user } = res.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            set({ token, user, isAuthenticated: true, loading: false });
            return user;
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            set({ error: message, loading: false });
            throw new Error(message);
        }
    },

    register: async (userData) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', userData);
            const { token, user } = res.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            set({ token, user, isAuthenticated: true, loading: false });
            return user;
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            set({ error: message, loading: false });
            throw new Error(message);
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ token: null, user: null, isAuthenticated: false });
    },

    clearError: () => set({ error: null })
}));

export default useAuthStore;
