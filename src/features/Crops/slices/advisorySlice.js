import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    advisories: [
        {
            id: 1,
            title: 'Late Blight in Tomatoes',
            category: 'Disease',
            targetCrop: 'Tomato',
            severity: 'High',
            symptoms: 'Water-soaked spots on leaves, white fungal growth on undersides, fruit rot.',
            management: 'Remove infected plants, improve air circulation, avoid overhead irrigation. Use copper-based fungicides if necessary.',
            prevention: 'Plant resistant varieties, crop rotation, ensure proper spacing.',
        },
        {
            id: 2,
            title: 'Stem Rust in Wheat',
            category: 'Disease',
            targetCrop: 'Wheat',
            severity: 'Medium',
            symptoms: 'Brick-red, elongated pustules on stems and leaf sheaths.',
            management: 'Early planting, use of fungicides like tebuconazole.',
            prevention: 'Use resistant cultivars, eliminate barberry bushes (alternate host).',
        },
        {
            id: 3,
            title: 'Aphids Attack',
            category: 'Pest',
            targetCrop: 'General',
            severity: 'Low',
            symptoms: 'Curled or yellowed leaves, sticky honeydew on foliage, presence of small green/black insects.',
            management: 'Strong water stream to dislodge, neem oil spray, introducing ladybugs.',
            prevention: 'Companion planting with marigolds, regular monitoring.',
        },
        {
            id: 4,
            title: 'Fall Armyworm in Corn',
            category: 'Pest',
            targetCrop: 'Corn',
            severity: 'High',
            symptoms: 'Ragged holes in leaves, sawdust-like frass on stems and ears.',
            management: 'Early detection, pheromone traps, targeted insecticide application.',
            prevention: 'Timely planting, intercropping with leguminous plants.',
        }
    ],
    isLoading: false,
    error: null,
};

const advisorySlice = createSlice({
    name: 'advisory',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setLoading, setError } = advisorySlice.actions;
export default advisorySlice.reducer;
