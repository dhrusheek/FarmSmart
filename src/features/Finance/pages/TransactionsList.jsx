import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { addTransaction, deleteTransaction } from '../slices/financeSlice';
import TransactionFormModal from '../components/TransactionFormModal';

const TransactionsList = () => {
    const dispatch = useDispatch();
    const { transactions } = useSelector((state) => state.finance);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterType, setFilterType] = useState('all'); // all, income, expense

    const handleAddTransaction = (transaction) => {
        dispatch(addTransaction(transaction));
    };

    const handleDeleteTransaction = (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            dispatch(deleteTransaction(id));
        }
    };

    // Calculate Summary
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const netProfit = totalIncome - totalExpense;

    // Filter Items
    const filteredTransactions = transactions.filter(t =>
        filterType === 'all' ? true : t.type === filterType
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Financials</h2>
                    <p className="text-slate-500 dark:text-slate-400">Track your farm's income and expenses.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Transaction
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Income</span>
                        <div className="p-2 bg-green-100 rounded-full text-green-600"><TrendingUp size={20} /></div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">${totalIncome.toLocaleString()}</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Expenses</span>
                        <div className="p-2 bg-red-100 rounded-full text-red-600"><TrendingDown size={20} /></div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">${totalExpense.toLocaleString()}</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Net Profit</span>
                        <div className="p-2 bg-blue-100 rounded-full text-blue-600"><DollarSign size={20} /></div>
                    </div>
                    <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${netProfit.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex space-x-2">
                {['all', 'income', 'expense'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filterType === type
                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Transactions List */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Date</th>
                                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Description</th>
                                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Category</th>
                                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Type</th>
                                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white text-right">Amount</th>
                                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        No transactions found.
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{t.date}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{t.description}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                                                {t.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${t.type === 'income'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                {t.type}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-right font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDeleteTransaction(t.id)}
                                                className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <TransactionFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddTransaction}
            />
        </div>
    );
};

export default TransactionsList;
