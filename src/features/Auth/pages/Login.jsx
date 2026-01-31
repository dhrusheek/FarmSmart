import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loginSuccess } from '../slices/authSlice';
import LanguageSelector from '../../Shared/components/LanguageSelector';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLogin = (role) => {
        // Mock login
        dispatch(loginSuccess({
            user: { id: 1, name: 'Demo User', role },
            token: 'dummy-token'
        }));
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100 dark:from-slate-900 dark:to-slate-800 p-4">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl max-w-md w-full">
                {/* Language Selector */}
                <div className="mb-6">
                    <LanguageSelector variant="dropdown" showLabel={false} />
                </div>

                {/* Logo/Title */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                        FarmSmart
                    </h1>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                        {t('loginToFarmSmart')}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        {t('selectYourLanguage')}
                    </p>
                </div>

                {/* Login Buttons */}
                <div className="space-y-4">
                    <button
                        onClick={() => handleLogin('farmer')}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
                    >
                        {t('loginAsFarmer')}
                    </button>
                    <button
                        onClick={() => handleLogin('buyer')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
                    >
                        {t('loginAsBuyer')}
                    </button>
                </div>

                {/* Register Link */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        {t('dontHaveAccount')}{' '}
                        <Link
                            to="/register"
                            className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                        >
                            {t('registerHere')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
