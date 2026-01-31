import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isSidebarOpen: false,
    activeModal: null,
    notifications: [], // { id, message, type: 'success'|'error'|'info' }
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
        openModal: (state, action) => {
            state.activeModal = action.payload;
        },
        closeModal: (state) => {
            state.activeModal = null;
        },
        addNotification: (state, action) => {
            state.notifications.push({
                id: Date.now(),
                ...action.payload,
            });
        },
        removeNotification: (state, action) => {
            state.notifications = state.notifications.filter(n => n.id !== action.payload);
        },
    },
});

export const { toggleSidebar, openModal, closeModal, addNotification, removeNotification } = uiSlice.actions;
export default uiSlice.reducer;
