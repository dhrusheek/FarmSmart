import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null, // { id, name, role: 'farmer' | 'buyer', phone, location, farmSize, preferredLanguage }
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('token', action.payload.token);

            // Store user data in localStorage for persistence
            if (action.payload.user) {
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            }
        },
        loginFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        updateProfile: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            // Update localStorage
            if (state.user) {
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        },
        setUserLanguage: (state, action) => {
            if (state.user) {
                state.user.preferredLanguage = action.payload;
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        }
    },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateProfile, setUserLanguage } = authSlice.actions;
export default authSlice.reducer;
