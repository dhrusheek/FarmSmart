import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    AlertTriangle,
    ShieldCheck,
    Bug,
    Wind,
    Droplets,
    Search,
    Filter,
    ArrowRight,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

const PestAdvisory = () => {
    const { advisories } = useSelector((state) => state.advisory);
    const { crops } = useSelector((state) => state.crops);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [expandedId, setExpandedId] = useState(null);

    const activeCropNames = useMemo(() => crops.map(c => c.name), [crops]);

    const filteredAdvisories = useMemo(() => {
        return advisories.filter(adv => {
            const matchesSearch = adv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                adv.targetCrop.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = filterCategory === 'All' || adv.category === filterCategory;
            return matchesSearch && matchesCategory;
        });
    }, [advisories, searchTerm, filterCategory]);

    const relevantAdvisories = useMemo(() => {
        return filteredAdvisories.filter(adv =>
            adv.targetCrop === 'General' || activeCropNames.includes(adv.targetCrop)
        );
    }, [filteredAdvisories, activeCropNames]);

    const otherAdvisories = useMemo(() => {
        return filteredAdvisories.filter(adv =>
            adv.targetCrop !== 'General' && !activeCropNames.includes(adv.targetCrop)
        );
    }, [filteredAdvisories, activeCropNames]);

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'High': return 'text-red-600 bg-red-100 dark:bg-red-900/40 dark:text-red-400';
            case 'Medium': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400';
            case 'Low': return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400';
            default: return 'text-slate-600 bg-slate-100 dark:bg-slate-900/40 dark:text-slate-400';
        }
    };

    const AdvisoryCard = ({ advisory }) => {
        const isExpanded = expandedId === advisory.id;
        const isRelevant = advisory.targetCrop === 'General' || activeCropNames.includes(advisory.targetCrop);

        return (
            <div
                className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-2 ring-emerald-500' : ''}`}
            >
                <div
                    className="p-4 flex items-start justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    onClick={() => setExpandedId(isExpanded ? null : advisory.id)}
                >
                    <div className="flex gap-4">
                        <div className={`p-3 rounded-lg ${advisory.category === 'Pest' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                            {advisory.category === 'Pest' ? <Bug className="w-6 h-6" /> : <Wind className="w-6 h-6" />}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                    {advisory.title}
                                </h3>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getSeverityColor(advisory.severity)}`}>
                                    {advisory.severity} Severity
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1">
                                    <ShieldCheck className="w-4 h-4" />
                                    Target: {advisory.targetCrop}
                                </span>
                                {isRelevant && (
                                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                                        <AlertTriangle className="w-4 h-4" />
                                        Found in your farm
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>

                {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-700 space-y-4 animate-in fade-in duration-300">
                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Droplets className="w-3 h-3" />
                                Typical Symptoms
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                                {advisory.symptoms}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Management / Treatment</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    {advisory.management}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Preventive Measures</h4>
                                <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 space-y-1">
                                    {advisory.prevention.split(', ').map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Pest & Disease Advisory</h2>
                    <p className="text-slate-500 dark:text-slate-400">Proactive alerts and expert advice for your crops.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search pests or crops..."
                            className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-full sm:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="All">All Types</option>
                        <option value="Pest">Pests</option>
                        <option value="Disease">Diseases</option>
                    </select>
                </div>
            </div>

            {/* Relevant Advisories Section */}
            {relevantAdvisories.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1 px-2 rounded bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                            Priority
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Relevant to Your Current Crops</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {relevantAdvisories.map(adv => (
                            <AdvisoryCard key={adv.id} advisory={adv} />
                        ))}
                    </div>
                </div>
            )}

            {/* Other Advisories Section */}
            {otherAdvisories.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-8 flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Other Common Agricultural Threats
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {otherAdvisories.map(adv => (
                            <AdvisoryCard key={adv.id} advisory={adv} />
                        ))}
                    </div>
                </div>
            )}

            {filteredAdvisories.length === 0 && (
                <div className="bg-white dark:bg-slate-800 p-12 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No advisories found</h3>
                    <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filters.</p>
                </div>
            )}

            {/* Educational Note */}
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-6 rounded-2xl flex items-start gap-4">
                <div className="p-2 bg-white dark:bg-emerald-800 rounded-lg shadow-sm text-emerald-600 dark:text-emerald-400">
                    <ArrowRight className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="font-bold text-emerald-900 dark:text-emerald-300 mb-1">Expert Note on Integrated Pest Management (IPM)</h4>
                    <p className="text-sm text-emerald-800/80 dark:text-emerald-400/80 leading-relaxed">
                        Always follow a systematic approach: Prevention first, then Monitoring, and finally Control.
                        Chemical intervention should be your last resort. Rotate between different classes of pesticides
                        to prevent resistance development in pests.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PestAdvisory;
