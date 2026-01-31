import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    activeAuctions: [
        {
            id: 1,
            crop: 'Wheat',
            quantity: 500,
            unit: 'Quintal',
            startingPrice: 2000,
            currentBid: 2150,
            minimumIncrement: 50,
            endsAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
            bids: [
                { id: 1, userId: 'user_123', amount: 2050, timestamp: new Date(Date.now() - 1800000).toISOString() },
                { id: 2, userId: 'user_456', amount: 2100, timestamp: new Date(Date.now() - 900000).toISOString() },
                { id: 3, userId: 'user_789', amount: 2150, timestamp: new Date(Date.now() - 300000).toISOString() }
            ],
            seller: 'Farmer Ramesh',
            status: 'active'
        },
        {
            id: 2,
            crop: 'Rice (Basmati)',
            quantity: 300,
            unit: 'Quintal',
            startingPrice: 4000,
            currentBid: 4300,
            minimumIncrement: 100,
            endsAt: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
            bids: [
                { id: 1, userId: 'user_234', amount: 4100, timestamp: new Date(Date.now() - 2400000).toISOString() },
                { id: 2, userId: 'user_567', amount: 4300, timestamp: new Date(Date.now() - 600000).toISOString() }
            ],
            seller: 'Farmer Suresh',
            status: 'active'
        }
    ],
    fraudAlerts: []
};

const auctionSlice = createSlice({
    name: 'auction',
    initialState,
    reducers: {
        placeBid: (state, action) => {
            const { auctionId, userId, amount } = action.payload;
            const auction = state.activeAuctions.find(a => a.id === auctionId);

            if (!auction) return;

            const now = new Date();
            const endsAt = new Date(auction.endsAt);
            const timeRemaining = endsAt - now;

            // Anti-sniping: Extend auction by 1 minute if bid placed in last 10 seconds
            if (timeRemaining < 10000 && timeRemaining > 0) {
                auction.endsAt = new Date(endsAt.getTime() + 60000).toISOString();
                console.log('[Anti-Sniping] Auction extended by 1 minute');
            }

            // Fraud detection: Check for abnormal bid patterns
            const mandiAverage = auction.startingPrice;
            const deviation = ((amount - mandiAverage) / mandiAverage) * 100;

            if (Math.abs(deviation) > 30) {
                state.fraudAlerts.push({
                    id: Date.now(),
                    auctionId,
                    userId,
                    type: 'abnormal_bid',
                    message: `Bid deviates ${deviation.toFixed(1)}% from market average`,
                    timestamp: now.toISOString()
                });
            }

            // Check for rapid bidding (potential collusion)
            const recentBids = auction.bids.filter(b =>
                new Date(b.timestamp) > new Date(now - 60000) && b.userId === userId
            );

            if (recentBids.length > 3) {
                state.fraudAlerts.push({
                    id: Date.now(),
                    auctionId,
                    userId,
                    type: 'rapid_bidding',
                    message: `User placed ${recentBids.length} bids in last minute`,
                    timestamp: now.toISOString()
                });
            }

            // Add the bid
            auction.bids.push({
                id: auction.bids.length + 1,
                userId,
                amount,
                timestamp: now.toISOString()
            });
            auction.currentBid = amount;
        },

        endAuction: (state, action) => {
            const auction = state.activeAuctions.find(a => a.id === action.payload);
            if (auction) {
                auction.status = 'completed';
            }
        },

        clearFraudAlert: (state, action) => {
            state.fraudAlerts = state.fraudAlerts.filter(a => a.id !== action.payload);
        }
    }
});

export const { placeBid, endAuction, clearFraudAlert } = auctionSlice.actions;
export default auctionSlice.reducer;
