import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, User, Save, RefreshCw } from 'lucide-react';
import { toggleTheme } from '../../../store/themeSlice';
import { updateProfile, setUserLanguage } from '../../Auth/slices/authSlice';
import LanguageSelector from '../../Shared/components/LanguageSelector';

const Settings = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { mode } = useSelector((state) => state.theme);
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
        // Update user profile with new language preference
        dispatch(setUserLanguage(lang));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        setIsSaving(true);

        // Simulate API call
        setTimeout(() => {
            // Update redux state (mock update)
            dispatch(updateProfile({ ...formData }));
            setIsSaving(false);
            alert('Profile updated successfully!');
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('Settings')}</h2>
                <p className="text-slate-500 dark:text-slate-400">Manage your profile and application preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Section */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center mb-6">
                        <User className="w-6 h-6 text-emerald-600 mr-2" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('Profile')}</h3>
                    </div>

                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                {t('Name')}
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                {t('Email')}
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                {t('Role')}
                            </label>
                            <input
                                type="text"
                                value={user?.role || 'User'}
                                disabled
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 rounded-lg cursor-not-allowed"
                            />
                        </div>
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                            >
                                {isSaving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                {t('Save Changes')}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Preferences Section */}
                <div className="space-y-6">
                    {/* Language */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                        <LanguageSelector variant="grid" showLabel={true} onLanguageChange={handleLanguageChange} />
                    </div>

                    {/* Theme */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center mb-4">
                            {mode === 'dark' ? (
                                <Moon className="w-6 h-6 text-violet-500 mr-2" />
                            ) : (
                                <Sun className="w-6 h-6 text-amber-500 mr-2" />
                            )}
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('Theme')}</h3>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-700 dark:text-slate-300">
                                {mode === 'dark' ? t('Dark Mode') : t('Light Mode')}
                            </span>
                            <button
                                onClick={() => dispatch(toggleTheme())}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${mode === 'dark' ? 'bg-violet-600' : 'bg-gray-200'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${mode === 'dark' ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
