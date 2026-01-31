import React from 'react';
import { Shield, Database, FileCheck, Clock, AlertCircle } from 'lucide-react';

const Compliance = () => {
    const complianceMetrics = {
        dataRetention: {
            status: 'compliant',
            lastAudit: '2026-01-20',
            recordsArchived: 15420,
            retentionPeriod: '7 years'
        },
        dltCompliance: {
            status: 'compliant',
            registeredTemplates: 4,
            pendingApprovals: 0
        },
        auditTrail: {
            status: 'active',
            logsGenerated: 89234,
            lastBackup: '2026-01-29 02:00 AM'
        },
        gdprCompliance: {
            status: 'compliant',
            dataRequests: 3,
            deletionRequests: 1
        }
    };

    const auditLogs = [
        { id: 1, action: 'User Login', user: 'farmer@example.com', timestamp: '2026-01-29 19:45', ip: '192.168.1.10' },
        { id: 2, action: 'Crop Created', user: 'farmer@example.com', timestamp: '2026-01-29 19:30', ip: '192.168.1.10' },
        { id: 3, action: 'Transaction Added', user: 'admin@farmsmart.com', timestamp: '2026-01-29 18:15', ip: '10.0.0.5' },
        { id: 4, action: 'Price Data Updated', user: 'system', timestamp: '2026-01-29 18:00', ip: 'internal' },
        { id: 5, action: 'SMS Sent', user: 'notification_service', timestamp: '2026-01-29 17:45', ip: 'internal' }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'compliant': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'active': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'warning': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Regulatory Compliance</h2>
                    <p className="text-slate-500 dark:text-slate-400">Data retention, audit trails, and regulatory dashboards</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">All Systems Compliant</span>
                </div>
            </div>

            {/* Compliance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-3">
                        <Database className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complianceMetrics.dataRetention.status)}`}>
                            {complianceMetrics.dataRetention.status.toUpperCase()}
                        </span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">Data Retention</h3>
                    <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <p>Period: {complianceMetrics.dataRetention.retentionPeriod}</p>
                        <p>Archived: {complianceMetrics.dataRetention.recordsArchived.toLocaleString()}</p>
                        <p className="text-xs">Last Audit: {complianceMetrics.dataRetention.lastAudit}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-3">
                        <FileCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complianceMetrics.dltCompliance.status)}`}>
                            {complianceMetrics.dltCompliance.status.toUpperCase()}
                        </span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">DLT Compliance</h3>
                    <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <p>Templates: {complianceMetrics.dltCompliance.registeredTemplates}</p>
                        <p>Pending: {complianceMetrics.dltCompliance.pendingApprovals}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-3">
                        <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complianceMetrics.auditTrail.status)}`}>
                            {complianceMetrics.auditTrail.status.toUpperCase()}
                        </span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">Audit Trail</h3>
                    <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <p>Logs: {complianceMetrics.auditTrail.logsGenerated.toLocaleString()}</p>
                        <p className="text-xs">Backup: {complianceMetrics.auditTrail.lastBackup}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-3">
                        <Shield className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complianceMetrics.gdprCompliance.status)}`}>
                            {complianceMetrics.gdprCompliance.status.toUpperCase()}
                        </span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">GDPR/Privacy</h3>
                    <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <p>Data Requests: {complianceMetrics.gdprCompliance.dataRequests}</p>
                        <p>Deletions: {complianceMetrics.gdprCompliance.deletionRequests}</p>
                    </div>
                </div>
            </div>

            {/* Audit Logs */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <FileCheck className="w-5 h-5" />
                        Recent Audit Logs
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left font-semibold text-slate-900 dark:text-white">Timestamp</th>
                                <th className="px-6 py-3 text-left font-semibold text-slate-900 dark:text-white">Action</th>
                                <th className="px-6 py-3 text-left font-semibold text-slate-900 dark:text-white">User</th>
                                <th className="px-6 py-3 text-left font-semibold text-slate-900 dark:text-white">IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {auditLogs.map(log => (
                                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{log.timestamp}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{log.action}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{log.user}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-mono text-xs">{log.ip}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Info Panel */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800/30">
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-400 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Compliance Features
                </h3>
                <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1 ml-7">
                    <li>• <strong>Automated Data Retention:</strong> 7-year archival policy with automatic cleanup</li>
                    <li>• <strong>Tamper-Proof Audit Trails:</strong> Immutable logs for all system actions</li>
                    <li>• <strong>DLT Compliance:</strong> Registered SMS templates for telecom regulations</li>
                    <li>• <strong>Privacy Controls:</strong> GDPR-compliant data request and deletion workflows</li>
                </ul>
            </div>
        </div>
    );
};

export default Compliance;
