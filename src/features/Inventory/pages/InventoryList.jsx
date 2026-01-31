import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Edit2, Trash2, Package, AlertTriangle } from 'lucide-react';
import { addItem, updateItem, deleteItem } from '../slices/inventorySlice';
import { checkInventoryLevels } from '../../../store/notificationsSlice';
import InventoryFormModal from '../components/InventoryFormModal';
import { useEffect } from 'react';

const InventoryList = () => {
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.inventory);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [activeTab, setActiveTab] = useState('All');

    useEffect(() => {
        dispatch(checkInventoryLevels(items));
    }, [items, dispatch]);

    const handleAddItem = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEditItem = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDeleteItem = (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            dispatch(deleteItem(id));
        }
    };

    const handleSubmit = (formData) => {
        if (editingItem) {
            dispatch(updateItem({ ...editingItem, ...formData }));
        } else {
            dispatch(addItem(formData));
        }
    };

    const filteredItems = items.filter(item => activeTab === 'All' || item.category === activeTab);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Inventory</h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage your seeds, fertilizers, and equipment.</p>
                </div>
                <button
                    onClick={handleAddItem}
                    className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Item
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 dark:border-slate-700">
                <nav className="-mb-px flex space-x-6 overflow-x-auto">
                    {['All', 'Seeds', 'Fertilizer', 'Equipment'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === tab
                                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* List */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Name</th>
                                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Category</th>
                                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Quantity</th>
                                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Location</th>
                                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colspan="5" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <Package className="w-12 h-12 mb-3 text-slate-300 dark:text-slate-600" />
                                            <p>No items found in this category.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            <div className="flex items-center gap-2">
                                                <span className={item.quantity <= (item.minStock || 0) ? 'text-red-600 font-bold' : ''}>
                                                    {item.quantity} {item.unit}
                                                </span>
                                                {item.quantity <= (item.minStock || 0) && (
                                                    <AlertTriangle className="w-4 h-4 text-red-500" title="Low Stock" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            {item.location}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleEditItem(item)}
                                                className="p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteItem(item.id)}
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

            <InventoryFormModal
                key={isModalOpen ? (editingItem?.id || 'new') : 'closed'}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingItem}
            />
        </div>
    );
};

export default InventoryList;
