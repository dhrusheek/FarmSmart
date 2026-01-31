import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Gavel, TrendingUp, Clock, AlertTriangle, Shield } from 'lucide-react';
import { placeBid, clearFraudAlert } from '../slices/auctionSlice';

const Auctions = () => {
    const dispatch = useDispatch();
    const { activeAuctions, fraudAlerts } = useSelector((state) => state.auction);
    const { user } = useSelector((state) => state.auth);
    const [selectedAuction, setSelectedAuction] = useState(null);
    const [bidAmount, setBidAmount] = useState('');
    const [timeRemaining, setTimeRemaining] = useState({});

    useEffect(() => {
        const interval = setInterval(() => {
            const remaining = {};
            activeAuctions.forEach(auction => {
                const now = new Date();
                const end = new Date(auction.endsAt);
                const diff = end - now;

                if (diff > 0) {
                    const hours = Math.floor(diff / 3600000);
                    const minutes = Math.floor((diff % 3600000) / 60000);
                    const seconds = Math.floor((diff % 60000) / 1000);
                    remaining[auction.id] = `${hours}h ${minutes}m ${seconds}s`;
                } else {
                    remaining[auction.id] = 'Ended';
                }
            });
            setTimeRemaining(remaining);
        }, 1000);

        return () => clearInterval(interval);
    }, [activeAuctions]);

    const handlePlaceBid = (auctionId) => {
        const amount = parseFloat(bidAmount);
        const auction = activeAuctions.find(a => a.id === auctionId);

        if (!amount || amount <= auction.currentBid) {
            alert(`Bid must be higher than current bid of ₹${auction.currentBid}`);
            return;
        }

        if (amount < auction.currentBid + auction.minimumIncrement) {
            alert(`Minimum increment is ₹${auction.minimumIncrement}`);
            return;
        }

        dispatch(placeBid({
            auctionId,
            userId: user?.id || 'user_demo',
            amount
        }));

        setBidAmount('');
        setSelectedAuction(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Live Auctions</h2>
                    <p className="text-slate-500 dark:text-slate-400">Bid on crops from verified farmers</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Anti-Fraud Protected</span>
                </div>
            </div>

            {/* Fraud Alerts */}
            {fraudAlerts.length > 0 && (
                <div className="space-y-2">
                    {fraudAlerts.map(alert => (
                        <div key={alert.id} className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800 flex items-start justify-between">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-red-900 dark:text-red-300 text-sm">Fraud Alert: {alert.type.replace('_', ' ').toUpperCase()}</h4>
                                    <p className="text-sm text-red-700 dark:text-red-400">{alert.message}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => dispatch(clearFraudAlert(alert.id))}
                                className="text-red-400 hover:text-red-600 text-sm"
                            >
                                Dismiss
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Auction Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeAuctions.map(auction => (
                    <div key={auction.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Gavel className="w-6 h-6" />
                                    <div>
                                        <h3 className="font-bold text-lg">{auction.crop}</h3>
                                        <p className="text-sm text-emerald-100">{auction.quantity} {auction.unit}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-sm">
                                        <Clock className="w-4 h-4" />
                                        <span className={timeRemaining[auction.id]?.includes('Ended') ? 'text-red-200' : ''}>
                                            {timeRemaining[auction.id] || 'Loading...'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Current Bid</p>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{auction.currentBid.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Starting Price</p>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">₹{auction.startingPrice.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Recent Bids ({auction.bids.length})</p>
                                <div className="space-y-1 max-h-20 overflow-y-auto">
                                    {auction.bids.slice(-3).reverse().map(bid => (
                                        <div key={bid.id} className="flex justify-between text-xs">
                                            <span className="text-slate-600 dark:text-slate-300">User {bid.userId.slice(-3)}</span>
                                            <span className="font-medium text-slate-900 dark:text-white">₹{bid.amount.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {selectedAuction === auction.id ? (
                                <div className="space-y-3">
                                    <input
                                        type="number"
                                        placeholder={`Min: ₹${auction.currentBid + auction.minimumIncrement}`}
                                        value={bidAmount}
                                        onChange={(e) => setBidAmount(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:text-white"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handlePlaceBid(auction.id)}
                                            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                                        >
                                            Place Bid
                                        </button>
                                        <button
                                            onClick={() => setSelectedAuction(null)}
                                            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setSelectedAuction(auction.id)}
                                    disabled={timeRemaining[auction.id]?.includes('Ended')}
                                    className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <TrendingUp className="w-4 h-4" />
                                    {timeRemaining[auction.id]?.includes('Ended') ? 'Auction Ended' : 'Place Bid'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800/30">
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-400 mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Auction Safety Features
                </h3>
                <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1 ml-7">
                    <li>• <strong>Anti-Sniping:</strong> Auction extends by 1 minute if bid placed in last 10 seconds</li>
                    <li>• <strong>Fraud Detection:</strong> Automatic alerts for abnormal bidding patterns</li>
                    <li>• <strong>Price Verification:</strong> Bids compared against market averages</li>
                </ul>
            </div>
        </div>
    );
};

export default Auctions;
