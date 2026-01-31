import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    transactions: [
        { id: 1, date: '2023-10-01', description: 'Sold Tomatoes', type: 'income', amount: 5000, category: 'Sales', cropId: 1 },
        { id: 2, date: '2023-10-05', description: 'Bought Fertilizer', type: 'expense', amount: 1200, category: 'Supplies', cropId: 1 },
        { id: 3, date: '2023-10-15', description: 'Tractor Repair', type: 'expense', amount: 800, category: 'Maintenance' },
        { id: 4, date: '2023-11-01', description: 'Sold Wheat', type: 'income', amount: 8500, category: 'Sales', cropId: 2 },
        { id: 5, date: '2023-11-20', description: 'Irrigation Pump', type: 'expense', amount: 3000, category: 'Equipment' },
        { id: 6, date: '2023-12-05', description: 'Sold Corn', type: 'income', amount: 6000, category: 'Sales', cropId: 3 },
    ],
    isLoading: false,
    error: null,
};

const financeSlice = createSlice({
    name: 'finance',
    initialState,
    reducers: {
        addTransaction: (state, action) => {
            state.transactions.push({
                id: Date.now(),
                ...action.payload,
            });
            // Sort by date desc
            state.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        },
        deleteTransaction: (state, action) => {
            state.transactions = state.transactions.filter((t) => t.id !== action.payload);
        },
    },
});

export const { addTransaction, deleteTransaction } = financeSlice.actions;

/**
 * Advanced Trust Score Computation
 * Weighted scoring with recency-based updates and penalty rules
 */
export const calculateTrustScore = (userProfile) => {
    const {
        totalTransactions = 0,
        successfulTransactions = 0,
        disputes = 0,
        resolvedDisputes = 0,
        accountAge = 0, // in days
        lastActivityDate = new Date(),
        verifiedIdentity = false,
        ratings = [] // array of { score: 1-5, date }
    } = userProfile;

    let score = 0;
    const weights = {
        transactionSuccess: 0.30,
        disputeResolution: 0.25,
        accountAge: 0.15,
        recency: 0.15,
        identity: 0.10,
        ratings: 0.05
    };

    // 1. Transaction Success Rate (30%)
    if (totalTransactions > 0) {
        const successRate = successfulTransactions / totalTransactions;
        score += successRate * 100 * weights.transactionSuccess;
    }

    // 2. Dispute Resolution (25%)
    if (disputes > 0) {
        const resolutionRate = resolvedDisputes / disputes;
        score += resolutionRate * 100 * weights.disputeResolution;
    } else if (totalTransactions > 5) {
        // Bonus for no disputes with sufficient history
        score += 100 * weights.disputeResolution;
    }

    // 3. Account Age (15%)
    const ageScore = Math.min(accountAge / 365, 1) * 100; // Max at 1 year
    score += ageScore * weights.accountAge;

    // 4. Recency Penalty (15%)
    const daysSinceActivity = (new Date() - new Date(lastActivityDate)) / (1000 * 60 * 60 * 24);
    const recencyScore = Math.max(0, 100 - (daysSinceActivity * 2)); // -2 points per day
    score += recencyScore * weights.recency;

    // 5. Identity Verification (10%)
    if (verifiedIdentity) {
        score += 100 * weights.identity;
    }

    // 6. Average Ratings (5%)
    if (ratings.length > 0) {
        const avgRating = ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length;
        score += (avgRating / 5) * 100 * weights.ratings;
    }

    // Apply penalties
    if (disputes > 3) {
        score -= 10; // Penalty for multiple disputes
    }
    if (totalTransactions > 0 && successfulTransactions / totalTransactions < 0.7) {
        score -= 15; // Penalty for low success rate
    }

    return Math.max(0, Math.min(100, Math.round(score)));
};

export default financeSlice.reducer;
