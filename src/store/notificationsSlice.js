import { createSlice } from '@reduxjs/toolkit';
import { notificationGateways } from '../lib/NotificationGateways';

const initialState = {
    notifications: [],
    unreadCount: 0,
};

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift({
                id: Date.now(),
                timestamp: new Date().toISOString(),
                read: false,
                ...action.payload,
            });
            state.unreadCount = state.notifications.filter(n => !n.read).length;
        },
        markAsRead: (state, action) => {
            const notification = state.notifications.find(n => n.id === action.payload);
            if (notification) {
                notification.read = true;
                state.unreadCount = state.notifications.filter(n => !n.read).length;
            }
        },
        markAllAsRead: (state) => {
            state.notifications.forEach(n => n.read = true);
            state.unreadCount = 0;
        },
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        },
    },
});

export const { addNotification, markAsRead, markAllAsRead, clearNotifications } = notificationsSlice.actions;

// Thunk-like logic for checking inventory levels
export const checkInventoryLevels = (items, userPhone) => (dispatch) => {
    items.forEach(item => {
        if (item.quantity <= (item.minStock || 10)) {
            dispatch(addNotification({
                type: 'low_stock',
                title: 'Low Stock Alert',
                message: `${item.name} is running low (${item.quantity} ${item.unit} remaining).`,
                itemId: item.id
            }));

            // If stock is very low, trigger SMS
            if (item.quantity <= 5 && userPhone) {
                dispatch(sendSMSNotification({
                    phone: userPhone,
                    message: `CRITICAL: ${item.name} is extremely low. Current stock: ${item.quantity}. Please restock.`,
                    templateId: 'INVENTORY_ALERT' // Note: This would need to be added to dltRegisteredTemplates in a real scenario
                }));
            }
        }
    });
};

export const sendSMSNotification = ({ phone, message, templateId }) => async (dispatch) => {
    try {
        const result = await notificationGateways.sendSMS(phone, message, templateId);
        if (result.success) {
            dispatch(addNotification({
                type: 'sms_sent',
                title: 'SMS Notification Sent',
                message: `Alert sent to ${phone}`,
                status: 'success'
            }));
        } else {
            console.error('SMS Failed:', result.error);
        }
    } catch (error) {
        console.error('SMS Gateway Error:', error);
    }
};

export const startIVRAlert = ({ phone, steps }) => async (dispatch) => {
    try {
        const result = await notificationGateways.initiateIVR(phone, steps);
        if (result.success) {
            dispatch(addNotification({
                type: 'ivr_call_complete',
                title: 'IVR Alert Complete',
                message: `Voice call to ${phone} finished successfully.`,
                status: 'success'
            }));
        }
    } catch (error) {
        console.error('IVR Gateway Error:', error);
    }
};

export default notificationsSlice.reducer;
