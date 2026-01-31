import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { loginSuccess } from '../slices/authSlice';
import LanguageSelector from '../../Shared/components/LanguageSelector';
import TapToHear from '../../Shared/components/TapToHear';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        state: '',
        district: '',
        farmSize: '',
        preferredLanguage: i18n.language
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLanguageChange = (lang) => {
        setFormData(prev => ({ ...prev, preferredLanguage: lang }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateStep = (currentStep) => {
        const newErrors = {};

        if (currentStep === 1) {
            if (!formData.preferredLanguage) {
                newErrors.preferredLanguage = t('languageRequired');
            }
        }

        if (currentStep === 2) {
            if (!formData.name || formData.name.trim().length === 0) {
                newErrors.name = t('nameRequired');
            } else if (formData.name.trim().length < 2) {
                newErrors.name = t('nameMinLength');
            }

            if (!formData.phone || formData.phone.trim().length === 0) {
                newErrors.phone = t('phoneRequired');
            } else if (!/^\d{10}$/.test(formData.phone.trim())) {
                newErrors.phone = t('phoneInvalid');
            }
        }

        if (currentStep === 3) {
            if (!formData.state || formData.state.trim().length === 0) {
                newErrors.state = t('stateRequired');
            }
            if (!formData.district || formData.district.trim().length === 0) {
                newErrors.district = t('districtRequired');
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(step + 1);
        }
    };

    const handlePrevious = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep(3)) {
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            // Mock registration - in real app, call API here
            dispatch(loginSuccess({
                user: {
                    id: Date.now(),
                    name: formData.name,
                    role: 'farmer',
                    phone: formData.phone,
                    location: {
                        state: formData.state,
                        district: formData.district
                    },
                    farmSize: formData.farmSize || null,
                    preferredLanguage: formData.preferredLanguage
                },
                token: 'mock-token-' + Date.now()
            }));

            // Set language to user's preference
            i18n.changeLanguage(formData.preferredLanguage);

            setIsSubmitting(false);
            navigate('/');
        }, 1500);
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {t('selectYourLanguage')}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                    {t('choosePreferredLanguage')}
                </p>
            </div>

            <LanguageSelector
                variant="grid"
                showLabel={false}
                onLanguageChange={handleLanguageChange}
            />

            {errors.preferredLanguage && (
                <p className="text-red-600 text-sm text-center">{errors.preferredLanguage}</p>
            )}
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-center gap-2">
                    {t('basicInformation')}
                    <TapToHear text={t('basicInformation')} />
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                    {t('tellUsAboutYourself')}
                </p>
            </div>

            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('Name')} <span className="text-red-500">*</span>
                    <TapToHear text={t('Name')} className="ml-auto" />
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-white ${errors.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                        }`}
                    placeholder={t('Name')}
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('phoneNumber')} <span className="text-red-500">*</span>
                    <TapToHear text={t('phoneNumber')} className="ml-auto" />
                </label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-white ${errors.phone ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                        }`}
                    placeholder="9876543210"
                    maxLength="10"
                />
                {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-center gap-2">
                    {t('farmDetails')}
                    <TapToHear text={t('farmDetails')} />
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                    {t('informationAboutFarm')}
                </p>
            </div>

            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('state')} <span className="text-red-500">*</span>
                    <TapToHear text={t('state')} className="ml-auto" />
                </label>
                <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-white ${errors.state ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                        }`}
                    placeholder={t('state')}
                />
                {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state}</p>}
            </div>

            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('district')} <span className="text-red-500">*</span>
                    <TapToHear text={t('district')} className="ml-auto" />
                </label>
                <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-white ${errors.district ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                        }`}
                    placeholder={t('district')}
                />
                {errors.district && <p className="text-red-600 text-sm mt-1">{errors.district}</p>}
            </div>

            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('farmSize')} <span className="text-slate-400">({t('optional')})</span>
                    <TapToHear text={t('farmSize')} className="ml-auto" />
                </label>
                <input
                    type="number"
                    name="farmSize"
                    value={formData.farmSize}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-white"
                    placeholder="5"
                    min="0"
                    step="0.1"
                />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100 dark:from-slate-900 dark:to-slate-800 p-4">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl max-w-2xl w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                        FarmSmart
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">{t('createAccount')}</p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8">
                    {[1, 2, 3].map((s) => (
                        <React.Fragment key={s}>
                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step > s
                                        ? 'bg-emerald-600 text-white'
                                        : step === s
                                            ? 'bg-emerald-500 text-white ring-4 ring-emerald-200 dark:ring-emerald-900'
                                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                                    }`}>
                                    {step > s ? <Check size={20} /> : s}
                                </div>
                                <span className="text-xs mt-1 text-slate-600 dark:text-slate-400">
                                    {s === 1 && t('Language')}
                                    {s === 2 && t('basicInformation')}
                                    {s === 3 && t('farmDetails')}
                                </span>
                            </div>
                            {s < 3 && (
                                <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'
                                    }`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Form Steps */}
                <form onSubmit={handleSubmit}>
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 mt-8">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={handlePrevious}
                                className="flex-1 flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold py-3 px-4 rounded-lg transition-colors"
                            >
                                <ChevronLeft size={20} />
                                {t('previous')}
                            </button>
                        )}

                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
                            >
                                {t('next')}
                                <ChevronRight size={20} />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        {t('Processing Voice')}
                                    </>
                                ) : (
                                    <>
                                        <Check size={20} />
                                        {t('completeRegistration')}
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        {t('alreadyHaveAccount')}{' '}
                        <Link
                            to="/login"
                            className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                        >
                            {t('loginHere')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
