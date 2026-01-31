import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Search, Filter, RefreshCw } from 'lucide-react';
import PriceCard from '../components/PriceCard';

const MarketPrices = () => {
    const { prices } = useSelector((state) => state.market);
    const [searchTerm, setSearchTerm] = useState('');
    const [regionFilter, setRegionFilter] = useState('All');

    const regions = ['All', ...new Set(prices.map(p => p.region))];

    const filteredPrices = prices.filter(p => {
        const matchesSearch = p.crop.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRegion = regionFilter === 'All' || p.region === regionFilter;
        return matchesSearch && matchesRegion;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Market Prices</h2>
                    <p className="text-slate-500 dark:text-slate-400">Real-time market rates and trends across regions.</p>
                </div>
                <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Rates
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search crops..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:text-white"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-slate-400" />
                    <select
                        value={regionFilter}
                        onChange={(e) => setRegionFilter(e.target.value)}
                        className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:text-white"
                    >
                        {regions.map(region => (
                            <option key={region} value={region}>{region}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrices.length > 0 ? (
                    filteredPrices.map((item) => (
                        <PriceCard
                            key={item.id}
                            crop={item.crop}
                            currentPrice={item.currentPrice}
                            unit={item.unit}
                            change={item.change}
                            trend={item.trend}
                            region={item.region}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        No market data found for your search.
                    </div>
                )}
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-400 mb-2">Market Insights</h3>
                <p className="text-emerald-700 dark:text-emerald-300 text-sm leading-relaxed">
                    Prices for <span className="font-bold">Tomato</span> are currently at a 30-day high due to seasonal demand.
                    Consider harvesting early if your crops are ready. Local mandi arrivals are expected to increase next week.
                </p>
            </div>
        </div>
    );
};

export default MarketPrices;
