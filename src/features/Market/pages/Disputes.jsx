import React, { useState } from 'react';
import { FileText, Clock, AlertTriangle, CheckCircle, MessageSquare, User } from 'lucide-react';

const Disputes = () => {
    const [disputes] = useState([
        {
            id: 1,
            title: 'Payment not received for Wheat delivery',
            buyer: 'Buyer Corp Ltd',
            seller: 'Farmer Ramesh',
            amount: 45000,
            filedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            stage: 'negotiation', // filed, negotiation, admin_review, resolved
            slaDeadline: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
            messages: 3
        },
        {
            id: 2,
            title: 'Quality issue with Rice shipment',
            buyer: 'Wholesale Traders',
            seller: 'Farmer Suresh',
            amount: 32000,
            filedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            stage: 'admin_review',
            slaDeadline: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
            messages: 7
        },
        {
            id: 3,
            title: 'Delivery delay compensation claim',
            buyer: 'Retail Chain',
            seller: 'Farmer Prakash',
            amount: 18000,
            filedAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
            stage: 'resolved',
            slaDeadline: null,
            messages: 12,
            resolution: 'Partial refund of ₹5,000 issued to buyer'
        }
    ]);

    const getStageColor = (stage) => {
        switch (stage) {
            case 'filed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'negotiation': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            case 'admin_review': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            case 'resolved': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400';
        }
    };

    const getTimeRemaining = (deadline) => {
        if (!deadline) return null;
        const now = new Date();
        const end = new Date(deadline);
        const diff = end - now;

        if (diff <= 0) return 'Overdue';

        const hours = Math.floor(diff / 3600000);
        if (hours < 24) return `${hours}h remaining`;

        const days = Math.floor(hours / 24);
        return `${days}d remaining`;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dispute Resolution</h2>
                    <p className="text-slate-500 dark:text-slate-400">Automated workflow for trade disputes</p>
                </div>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                    File New Dispute
                </button>
            </div>

            {/* Disputes List */}
            <div className="space-y-4">
                {disputes.map(dispute => {
                    const timeRemaining = getTimeRemaining(dispute.slaDeadline);
                    const isOverdue = timeRemaining === 'Overdue';

                    return (
                        <div key={dispute.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{dispute.title}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(dispute.stage)}`}>
                                            {dispute.stage.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                        <div className="flex items-center gap-1">
                                            <User className="w-4 h-4" />
                                            <span>{dispute.buyer} vs {dispute.seller}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FileText className="w-4 h-4" />
                                            <span>₹{dispute.amount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Filed</p>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                        {new Date(dispute.filedAt).toLocaleDateString()}
                                    </p>
                                </div>
                                {dispute.stage !== 'resolved' && (
                                    <div className={`p-3 rounded-lg ${isOverdue ? 'bg-red-50 dark:bg-red-900/20' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            SLA Deadline
                                        </p>
                                        <p className={`text-sm font-medium ${isOverdue ? 'text-red-700 dark:text-red-400' : 'text-blue-700 dark:text-blue-400'}`}>
                                            {timeRemaining}
                                        </p>
                                    </div>
                                )}
                                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                                        <MessageSquare className="w-3 h-3" />
                                        Messages
                                    </p>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                        {dispute.messages} exchanges
                                    </p>
                                </div>
                            </div>

                            {dispute.stage === 'resolved' && dispute.resolution && (
                                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800 flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-green-900 dark:text-green-300">Resolution</p>
                                        <p className="text-sm text-green-700 dark:text-green-400">{dispute.resolution}</p>
                                    </div>
                                </div>
                            )}

                            {dispute.stage !== 'resolved' && (
                                <div className="flex gap-2 mt-4">
                                    <button className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
                                        View Details
                                    </button>
                                    {dispute.stage === 'negotiation' && (
                                        <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium">
                                            Escalate to Admin
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Workflow Info */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-400 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Automated Dispute Resolution Workflow
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-blue-700 dark:text-blue-400 font-bold">1</span>
                        </div>
                        <p className="text-sm font-medium text-indigo-900 dark:text-indigo-300">Filed</p>
                        <p className="text-xs text-indigo-700 dark:text-indigo-400">Dispute submitted</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-amber-700 dark:text-amber-400 font-bold">2</span>
                        </div>
                        <p className="text-sm font-medium text-indigo-900 dark:text-indigo-300">Negotiation</p>
                        <p className="text-xs text-indigo-700 dark:text-indigo-400">5-day SLA</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-purple-700 dark:text-purple-400 font-bold">3</span>
                        </div>
                        <p className="text-sm font-medium text-indigo-900 dark:text-indigo-300">Admin Review</p>
                        <p className="text-xs text-indigo-700 dark:text-indigo-400">3-day SLA</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-green-700 dark:text-green-400 font-bold">4</span>
                        </div>
                        <p className="text-sm font-medium text-indigo-900 dark:text-indigo-300">Resolved</p>
                        <p className="text-xs text-indigo-700 dark:text-indigo-400">Final decision</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Disputes;
