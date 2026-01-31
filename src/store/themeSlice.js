import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    mode: localStorage.getItem('theme') || 'light', // 'light' | 'dark'
    highContrast: localStorage.getItem('highContrast') === 'true',
    fontSize: 'normal', // 'normal' | 'large'
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', state.mode);
            updateBodyClasses(state);
        },
        setTheme: (state, action) => {
            state.mode = action.payload;
            localStorage.setItem('theme', state.mode);
            updateBodyClasses(state);
        },
        toggleHighContrast: (state) => {
            state.highContrast = !state.highContrast;
            localStorage.setItem('highContrast', state.highContrast);
            updateBodyClasses(state);
        },
        setFontSize: (state, action) => {
            state.fontSize = action.payload;
        }
    },
});

// Helper to update body classes for immediate effect
const updateBodyClasses = (state) => {
    const body = document.body;

    if (state.mode === 'dark') {
        body.classList.add('dark');
    } else {
        body.classList.remove('dark');
    }

    if (state.highContrast) {
        body.classList.add('high-contrast');
    } else {
        body.classList.remove('high-contrast');
    }
};

export const { toggleTheme, setTheme, toggleHighContrast, setFontSize } = themeSlice.actions;
export default themeSlice.reducer;
