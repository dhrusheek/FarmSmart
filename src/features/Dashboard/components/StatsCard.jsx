import React from 'react';
import { useTranslation } from 'react-i18next';
import TapToHear from '../../Shared/components/TapToHear';


// eslint-disable-next-line no-unused-vars
const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{t(title)}</p>
                        <TapToHear text={`${t(title)}: ${value}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
                </div>
                <div className={`p-3 rounded-full ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-sm">
                    <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                        {trendValue}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 ml-2">{t('fromLastMonth')}</span>
                </div>
            )}
        </div>
    );
};

export default StatsCard;
