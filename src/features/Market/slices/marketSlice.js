import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    prices: [
        {
            id: 1,
            crop: 'Wheat',
            currentPrice: 2200,
            unit: 'Quintal',
            change: 1.5,
            trend: [2100, 2150, 2180, 2200, 2190, 2200, 2200],
            region: 'Northern Region',
            verified: true,
            source: 'APMC Delhi',
            lastUpdated: new Date().toISOString(),
            freshness: 'live' // live, recent, stale
        },
        {
            id: 2,
            crop: 'Rice (Basmati)',
            currentPrice: 4500,
            unit: 'Quintal',
            change: -0.8,
            trend: [4600, 4550, 4580, 4520, 4500, 4510, 4500],
            region: 'Northern Region',
            verified: true,
            source: 'APMC Karnal',
            lastUpdated: new Date(Date.now() - 1800000).toISOString(),
            freshness: 'recent'
        },
        {
            id: 3,
            crop: 'Tomato',
            currentPrice: 1800,
            unit: 'Quintal',
            change: 5.2,
            trend: [1500, 1600, 1650, 1700, 1750, 1780, 1800],
            region: 'Southern Region',
            verified: false,
            source: 'Estimated',
            lastUpdated: new Date(Date.now() - 7200000).toISOString(),
            freshness: 'stale'
        },
        {
            id: 4,
            crop: 'Corn',
            currentPrice: 1950,
            unit: 'Quintal',
            change: 0.2,
            trend: [1940, 1945, 1955, 1950, 1950, 1948, 1950],
            region: 'Central Region',
            verified: true,
            source: 'APMC Indore',
            lastUpdated: new Date(Date.now() - 3600000).toISOString(),
            freshness: 'recent'
        },
        {
            id: 5,
            crop: 'Potatoes',
            currentPrice: 1200,
            unit: 'Quintal',
            change: -2.3,
            trend: [1300, 1280, 1250, 1230, 1210, 1200, 1200],
            region: 'Eastern Region',
            verified: true,
            source: 'APMC Kolkata',
            lastUpdated: new Date().toISOString(),
            freshness: 'live'
        },
        {
            id: 6,
            crop: 'Onions',
            currentPrice: 2800,
            unit: 'Quintal',
            change: 1.2,
            trend: [2700, 2750, 2780, 2800, 2790, 2800, 2800],
            region: 'Western Region',
            verified: true,
            source: 'APMC Nashik',
            lastUpdated: new Date(Date.now() - 900000).toISOString(),
            freshness: 'recent'
        },
    ],
    isLoading: false,
    error: null,
};

const marketSlice = createSlice({
    name: 'market',
    initialState,
    reducers: {
        setPrices: (state, action) => {
            state.prices = action.payload;
        },
    },
});

export const { setPrices } = marketSlice.actions;
export default marketSlice.reducer;
