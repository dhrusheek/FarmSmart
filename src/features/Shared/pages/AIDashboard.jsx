import React, { useState } from 'react';
import { Brain, TrendingUp, AlertCircle, RefreshCw, CheckCircle, Activity } from 'lucide-react';

const AIDashboard = () => {
    const [models] = useState([
        {
            id: 1,
            name: 'Crop Yield Predictor',
            version: 'v2.3.1',
            accuracy: 0.87,
            lastTrained: '2026-01-15',
            status: 'active',
            drift: 0.03,
            predictions: 12450
        },
        {
            id: 2,
            name: 'Pest Detection Model',
            version: 'v1.8.0',
            accuracy: 0.92,
            lastTrained: '2026-01-20',
            status: 'active',
            drift: 0.01,
            predictions: 8920
        },
        {
            id: 3,
            name: 'Price Forecasting',
            version: 'v3.1.2',
            accuracy: 0.79,
            lastTrained: '2025-12-28',
            status: 'needs_retraining',
            drift: 0.12,
            predictions: 15670
        }
    ]);

    const [retrainingQueue, setRetrainingQueue] = useState([]);

    const triggerRetraining = (modelId) => {
        const model = models.find(m => m.id === modelId);
        setRetrainingQueue([...retrainingQueue, {
            modelId,
            modelName: model.name,
            status: 'queued',
            queuedAt: new Date().toISOString()
        }]);

        // Simulate retraining process
        setTimeout(() => {
            setRetrainingQueue(prev => prev.map(item =>
                item.modelId === modelId ? { ...item, status: 'training' } : item
            ));
        }, 2000);

        setTimeout(() => {
            setRetrainingQueue(prev => prev.map(item =>
                item.modelId === modelId ? { ...item, status: 'completed' } : item
            ));
        }, 8000);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'needs_retraining': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            case 'training': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400';
        }
    };

    const getDriftStatus = (drift) => {
        if (drift < 0.05) return { label: 'Low', color: 'text-green-600 dark:text-green-400' };
        if (drift < 0.10) return { label: 'Medium', color: 'text-amber-600 dark:text-amber-400' };
        return { label: 'High', color: 'text-red-600 dark:text-red-400' };
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI Model Lifecycle</h2>
                    <p className="text-slate-500 dark:text-slate-400">Monitor and manage AI models powering FarmSmart</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-300">{models.length} Active Models</span>
                </div>
            </div>

            {/* Model Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {models.map(model => {
                    const driftStatus = getDriftStatus(model.drift);
                    return (
                        <div key={model.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{model.name}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{model.version}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(model.status)}`}>
                                    {model.status.replace('_', ' ').toUpperCase()}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Accuracy</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${model.accuracy > 0.85 ? 'bg-green-500' : model.accuracy > 0.75 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                style={{ width: `${model.accuracy * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{(model.accuracy * 100).toFixed(0)}%</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Drift</p>
                                    <p className={`text-sm font-bold ${driftStatus.color}`}>
                                        {(model.drift * 100).toFixed(1)}% ({driftStatus.label})
                                    </p>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                                    <span>Last Trained</span>
                                    <span className="font-medium">{model.lastTrained}</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                                    <span>Predictions Made</span>
                                    <span className="font-medium">{model.predictions.toLocaleString()}</span>
                                </div>
                            </div>

                            {model.status === 'needs_retraining' && (
                                <button
                                    onClick={() => triggerRetraining(model.id)}
                                    className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center justify-center gap-2"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Trigger Retraining
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Retraining Queue */}
            {retrainingQueue.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Retraining Queue
                    </h3>
                    <div className="space-y-3">
                        {retrainingQueue.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    {item.status === 'completed' ? (
                                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    ) : item.status === 'training' ? (
                                        <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                    )}
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">{item.modelName}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {item.status === 'completed' ? 'Retraining completed' :
                                                item.status === 'training' ? 'Training in progress...' :
                                                    'Queued for retraining'}
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                    {item.status.toUpperCase()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Info Panel */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-400 mb-2 flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Model Lifecycle Features
                </h3>
                <ul className="text-indigo-700 dark:text-indigo-300 text-sm space-y-1 ml-7">
                    <li>• <strong>Accuracy Monitoring:</strong> Real-time tracking of model performance</li>
                    <li>• <strong>Drift Detection:</strong> Automatic alerts when model predictions deviate from expected patterns</li>
                    <li>• <strong>Automated Retraining:</strong> One-click retraining pipeline with queue management</li>
                    <li>• <strong>Version Control:</strong> Track model versions and rollback capabilities</li>
                </ul>
            </div>
        </div>
    );
};

export default AIDashboard;
