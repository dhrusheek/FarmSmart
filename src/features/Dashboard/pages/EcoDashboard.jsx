import React from 'react';
import { useSelector } from 'react-redux';
import {
    Leaf,
    Cloud,
    Wind,
    Droplets,
    TreePine,
    TrendingDown,
    Award,
    Info,
    ArrowUpRight,
    Zap,
    Bug,
    ShieldCheck
} from 'lucide-react';

const EcoDashboard = () => {
    const { metrics, environmentalProjects } = useSelector((state) => state.sustainability);

    const MetricCard = ({ title, value, unit, icon: Icon, color, description, trend }) => (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-opacity-5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" style={{ backgroundColor: color }} />
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl bg-opacity-10`} style={{ backgroundColor: color, color: color }}>
                        <Icon className="w-6 h-6" />
                    </div>
                    {trend && (
                        <span className={`text-[10px] font-black px-2 py-1 rounded-full ${trend.type === 'good' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                            {trend.label}
                        </span>
                    )}
                </div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
                <div className="flex items-baseline gap-1 mb-2">
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white">{value}</h3>
                    <span className="text-sm font-bold text-slate-400">{unit}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] leading-relaxed italic">{description}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Eco-Tracking & Sustainability</h2>
                    <p className="text-slate-500 dark:text-slate-400">Monitor your farm's green footprint and environmental impact.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-sm text-sm font-bold flex items-center gap-2">
                        <Award className="w-4 h-4" /> Certification View
                    </button>
                </div>
            </div>

            {/* Core Green Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Carbon Footprint"
                    value={metrics.carbonFootprint}
                    unit="tCO2e"
                    icon={Cloud}
                    color="#10b981"
                    description="Equivalent to emissions from 2.5 cars driven for a year."
                    trend={{ type: 'good', label: '⬇ 5% vs last season' }}
                />
                <MetricCard
                    title="Eco-Score"
                    value={metrics.ecoScore}
                    unit="/100"
                    icon={Leaf}
                    color="#22c55e"
                    description="Your farm performs better than 84% of local producers."
                />
                <MetricCard
                    title="Water Conservation"
                    value={metrics.waterSaved}
                    unit="%"
                    icon={Droplets}
                    color="#3b82f6"
                    description="Savings achieved through smart irrigation scheduling."
                    trend={{ type: 'good', label: '⬆ 2% YTD' }}
                />
                <MetricCard
                    title="Biodiversity"
                    value={metrics.biodiversityIndex}
                    unit="/10"
                    icon={Bug}
                    color="#f59e0b"
                    description="Score based on pollinator presence and native soil life."
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Environmental Projects */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <TreePine className="w-5 h-5 text-emerald-500" /> Active Conservation Projects
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {environmentalProjects.map(project => (
                            <div key={project.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-900/50">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="font-bold text-slate-900 dark:text-white">{project.name}</h4>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${project.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {project.status}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>{project.impactingMetric}</span>
                                        <span className="font-bold">{project.progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${project.status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Carbon Offset Visualizer */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-800 p-8 rounded-[2.5rem] text-white relative overflow-hidden flex flex-col justify-between shadow-lg shadow-emerald-100 dark:shadow-none min-h-[400px]">
                    <Wind className="absolute -right-8 -top-8 w-48 h-48 text-white/10" />
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
                            Negative Emission Goal
                        </div>
                        <h3 className="text-3xl font-black mb-4">Your Forest Equivalent</h3>
                        <p className="text-emerald-50/80 text-sm leading-relaxed mb-6">
                            By reducing your energy consumption and planting native trees, you have offset enough carbon to equal <strong>142 mature teak trees</strong>.
                        </p>
                    </div>

                    <div className="relative z-10">
                        <div className="flex justify-between text-xs font-bold mb-2">
                            <span>2024 GOAL PROGRESS</span>
                            <span>68%</span>
                        </div>
                        <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 rounded-full" style={{ width: '68%' }} />
                        </div>
                        <p className="text-[10px] text-emerald-200/50 mt-4 italic font-medium">Keep moving toward Carbon Neutrality by 2030.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EcoDashboard;
