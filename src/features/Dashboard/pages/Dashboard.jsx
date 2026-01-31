import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Sprout, AlertTriangle, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import StatsCard from '../components/StatsCard';

import WeatherWidget from '../components/WeatherWidget';
import TapToHear from '../../Shared/components/TapToHear';

const Dashboard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { crops } = useSelector((state) => state.crops);
    const { transactions } = useSelector((state) => state.finance);

    // Calculate stats
    const totalCropsCount = crops.length;
    const warningsCount = crops.filter(c => c.status === 'Pest Issue' || c.status === 'Needs Water').length;

    // Monthly Revenue Calculation (Simplified: Current Month)
    const currentMonth = new Date().getMonth();
    const monthlyRevenue = transactions
        .filter(t => t.type === 'income' && new Date(t.date).getMonth() === currentMonth)
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('dashboard')}</h2>
                    <p className="text-slate-500 dark:text-slate-400">{t('welcomeBack')}</p>
                </div>
                <TapToHear text={`${t('dashboard')}. ${t('welcomeBack')}`} />
            </div>

            <WeatherWidget />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatsCard
                    title="Total Crops"
                    value={totalCropsCount}
                    icon={Sprout}
                    color="bg-emerald-500"
                    trend="up"
                    trendValue="+2"
                />
                <StatsCard
                    title="Warnings"
                    value={warningsCount}
                    icon={AlertTriangle}
                    color="bg-amber-500"
                    trend="up"
                    trendValue="+1"
                />
                <StatsCard
                    title="Monthly Revenue"
                    value={`$${monthlyRevenue.toLocaleString()}`}
                    icon={TrendingUp}
                    color="bg-indigo-500"
                    trend="up"
                    trendValue="+15%"
                />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 gap-6">
                {/* Quick Actions */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => navigate('/crops')}
                            className="flex-1 min-w-[200px] py-4 px-6 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-sm font-bold transition-all text-left flex items-center justify-between shadow-sm hover:shadow-md"
                        >
                            <div className="flex items-center">
                                <span className="w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center mr-4 text-emerald-700 text-lg">+</span>
                                {t('addNewCrop')}
                            </div>
                            <TapToHear text={t('addNewCrop')} />
                        </button>
                        <button
                            onClick={() => navigate('/transactions')}
                            className="flex-1 min-w-[200px] py-4 px-6 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-sm font-bold transition-all text-left flex items-center justify-between shadow-sm hover:shadow-md"
                        >
                            <div className="flex items-center">
                                <span className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center mr-4 text-blue-700 text-lg">$</span>
                                {t('Add Transaction')}
                            </div>
                            <TapToHear text={t('Add Transaction')} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
