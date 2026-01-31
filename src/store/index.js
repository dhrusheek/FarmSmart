import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/Auth/slices/authSlice';
import themeReducer from './themeSlice';
import uiReducer from './uiSlice';
import cropsReducer from '../features/Crops/slices/cropsSlice';
import inventoryReducer from '../features/Inventory/slices/inventorySlice';
import financeReducer from '../features/Finance/slices/financeSlice';
import marketReducer from '../features/Market/slices/marketSlice';
import auctionReducer from '../features/Market/slices/auctionSlice';
import notificationsReducer from './notificationsSlice';
import advisoryReducer from '../features/Crops/slices/advisorySlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,
        ui: uiReducer,
        crops: cropsReducer,
        inventory: inventoryReducer,
        finance: financeReducer,
        market: marketReducer,
        auction: auctionReducer,
        notifications: notificationsReducer,
        advisory: advisoryReducer,
    },
    devTools: import.meta.env.MODE !== 'production',
});
