import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const PriceCard = ({ crop, currentPrice, unit, change, trend, region }) => {
    const isPositive = change > 0;
    const isNegative = change < 0;

    // Prepare data for the mini sparkline
    const chartData = trend.map((v, i) => ({ value: v, id: i }));

    return (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{region}</h4>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{crop}</h3>
                </div>
                <div className={`flex items-center px-2 py-1 rounded text-xs font-bold ${isPositive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        isNegative ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                    {isPositive ? <TrendingUp size={12} className="mr-1" /> :
                        isNegative ? <TrendingDown size={12} className="mr-1" /> :
                            <Minus size={12} className="mr-1" />}
                    {Math.abs(change)}%
                </div>
            </div>

            <div className="flex items-end justify-between">
                <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        ₹{currentPrice.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                        per {unit}
                    </div>
                </div>

                <div className="h-12 w-24">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id={`gradient-${crop}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={isPositive ? '#10B981' : isNegative ? '#EF4444' : '#64748B'} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={isPositive ? '#10B981' : isNegative ? '#EF4444' : '#64748B'} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={isPositive ? '#10B981' : isNegative ? '#EF4444' : '#64748B'}
                                fillOpacity={1}
                                fill={`url(#gradient-${crop})`}
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default PriceCard;
