import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [
        { id: 1, name: 'Tomato Seeds', category: 'Seeds', quantity: 50, unit: 'packs', location: 'Shed A', minStock: 10 },
        { id: 2, name: 'NPK 20-20-20', category: 'Fertilizer', quantity: 15, unit: 'kg', location: 'Barn', minStock: 20 },
        { id: 3, name: 'Shovel', category: 'Equipment', quantity: 5, unit: 'pcs', location: 'Tool Shed', minStock: 2 },
        { id: 4, name: 'Corn Seeds', category: 'Seeds', quantity: 5, unit: 'packs', location: 'Shed A', minStock: 10 },
    ],
    isLoading: false,
    error: null,
};

const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {
        addItem: (state, action) => {
            state.items.push({
                id: Date.now(),
                minStock: 10,
                ...action.payload,
            });
        },
        updateItem: (state, action) => {
            const index = state.items.findIndex((item) => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        deleteItem: (state, action) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
    },
});

export const { addItem, updateItem, deleteItem } = inventorySlice.actions;
export default inventorySlice.reducer;
