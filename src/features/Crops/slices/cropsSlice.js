import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    crops: [
        { id: 1, name: 'Tomato', type: 'Vegetable', plantingDate: '2023-10-15', status: 'Healthy' },
        { id: 2, name: 'Wheat', type: 'Grain', plantingDate: '2023-11-01', status: 'Needs Water' },
        { id: 3, name: 'Corn', type: 'Grain', plantingDate: '2023-09-20', status: 'Healthy' },
    ],
    isLoading: false,
    error: null,
};

const cropsSlice = createSlice({
    name: 'crops',
    initialState,
    reducers: {
        addCrop: (state, action) => {
            state.crops.push({
                id: Date.now(),
                ...action.payload,
            });
        },
        updateCrop: (state, action) => {
            const index = state.crops.findIndex((crop) => crop.id === action.payload.id);
            if (index !== -1) {
                state.crops[index] = action.payload;
            }
        },
        deleteCrop: (state, action) => {
            state.crops = state.crops.filter((crop) => crop.id !== action.payload);
        },
    },
});

export const { addCrop, updateCrop, deleteCrop } = cropsSlice.actions;
export default cropsSlice.reducer;
