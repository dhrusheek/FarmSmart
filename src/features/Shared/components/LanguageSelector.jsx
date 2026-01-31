import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';

const LANGUAGES = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' }
];

const LanguageSelector = ({
    variant = 'buttons',
    showLabel = true,
    className = '',
    onLanguageChange
}) => {
    const { i18n, t } = useTranslation();

    const handleLanguageChange = (langCode) => {
        i18n.changeLanguage(langCode);
        if (onLanguageChange) {
            onLanguageChange(langCode);
        }
    };

    if (variant === 'dropdown') {
        return (
            <div className={`relative ${className}`}>
                {showLabel && (
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        <Globe className="inline w-4 h-4 mr-1" />
                        {t('Language')}
                    </label>
                )}
                <select
                    value={i18n.language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-white"
                >
                    {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.nativeName} ({lang.name})
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    if (variant === 'grid') {
        return (
            <div className={className}>
                {showLabel && (
                    <div className="flex items-center mb-4">
                        <Globe className="w-5 h-5 text-emerald-600 mr-2" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {t('Language')}
                        </h3>
                    </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`relative px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${i18n.language === lang.code
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-500 dark:text-emerald-300'
                                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-left">
                                    <div className="font-bold">{lang.nativeName}</div>
                                    <div className="text-xs opacity-70">{lang.name}</div>
                                </div>
                                {i18n.language === lang.code && (
                                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // Default: buttons variant (horizontal)
    return (
        <div className={className}>
            {showLabel && (
                <div className="flex items-center mb-3">
                    <Globe className="w-4 h-4 text-emerald-600 mr-2" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {t('Language')}
                    </span>
                </div>
            )}
            <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${i18n.language === lang.code
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                        aria-label={`Switch to ${lang.name}`}
                    >
                        {lang.nativeName}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LanguageSelector;
