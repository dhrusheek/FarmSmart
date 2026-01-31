import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Edit2, Trash2, Sprout, Microscope, ArrowRight } from 'lucide-react';
import { addCrop, updateCrop, deleteCrop } from '../slices/cropsSlice';
import { useNavigate } from 'react-router-dom';
import CropFormModal from '../components/CropFormModal';

const CropsList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { crops } = useSelector((state) => state.crops);
    const { advisories } = useSelector((state) => state.advisory);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCrop, setEditingCrop] = useState(null);

    const relevantAdvisories = advisories.filter(adv =>
        adv.targetCrop === 'General' || crops.some(c => c.name === adv.targetCrop)
    );

    const handleAddCrop = () => {
        setEditingCrop(null);
        setIsModalOpen(true);
    };

    const handleEditCrop = (crop) => {
        setEditingCrop(crop);
        setIsModalOpen(true);
    };

    const handleDeleteCrop = (id) => {
        if (window.confirm('Are you sure you want to delete this crop?')) {
            dispatch(deleteCrop(id));
        }
    };

    const handleSubmit = (formData) => {
        if (editingCrop) {
            dispatch(updateCrop({ ...editingCrop, ...formData }));
        } else {
            dispatch(addCrop(formData));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Crop Management</h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage your farm's crops and tracking.</p>
                </div>
                <button
                    onClick={handleAddCrop}
                    className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Crop
                </button>
            </div>

            {/* Advisory Highlight */}
            {relevantAdvisories.length > 0 && (
                <div
                    onClick={() => navigate('/advisory')}
                    className="group bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-xl text-white shadow-md cursor-pointer hover:shadow-lg transition-all"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Microscope className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">Security Alert: {relevantAdvisories[0].title}</h4>
                                <p className="text-xs text-emerald-100/90">{relevantAdvisories[0].symptoms.split('.')[0]}. Click to learn more.</p>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Name</th>
                                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Type</th>
                                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Planting Date</th>
                                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {crops.length === 0 ? (
                                <tr>
                                    <td colspan="5" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <Sprout className="w-12 h-12 mb-3 text-slate-300 dark:text-slate-600" />
                                            <p>No crops found. Start by adding one!</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                crops.map((crop) => (
                                    <tr key={crop.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                            {crop.name}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            {crop.type}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            {new Date(crop.plantingDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                                                ${crop.status === 'Healthy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                                                ${crop.status === 'Needs Water' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                                                ${crop.status === 'Pest Issue' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : ''}
                                                ${crop.status === 'Harvest Ready' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : ''}
                                            `}>
                                                {crop.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleEditCrop(crop)}
                                                className="p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCrop(crop.id)}
                                                className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                                title="Delete"
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

            <CropFormModal
                key={isModalOpen ? (editingCrop?.id || 'new') : 'closed'}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingCrop}
            />
        </div>
    );
};

export default CropsList;
