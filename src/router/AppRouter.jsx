import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainLayout from '../layouts/MainLayout';
import Loader from '../features/Shared/components/Loader';

// Lazy loaded components
const Dashboard = lazy(() => import('../features/Dashboard/pages/Dashboard'));
const WeatherForecast = lazy(() => import('../features/Dashboard/pages/WeatherForecast'));
const Login = lazy(() => import('../features/Auth/pages/Login'));
const Register = lazy(() => import('../features/Auth/pages/Register'));
const CropsList = lazy(() => import('../features/Crops/pages/CropsList'));
const InventoryList = lazy(() => import('../features/Inventory/pages/InventoryList'));
const TransactionsList = lazy(() => import('../features/Finance/pages/TransactionsList'));
const MarketPrices = lazy(() => import('../features/Market/pages/MarketPrices'));
const Auctions = lazy(() => import('../features/Market/pages/Auctions'));
const Disputes = lazy(() => import('../features/Market/pages/Disputes'));
const PestAdvisory = lazy(() => import('../features/Crops/pages/PestAdvisory'));
const Settings = lazy(() => import('../features/Settings/pages/Settings'));
const Compliance = lazy(() => import('../features/Settings/pages/Compliance'));
const AIDashboard = lazy(() => import('../features/Shared/pages/AIDashboard'));
const NotFound = lazy(() => import('../features/Shared/pages/NotFound'));

// Guard Component
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

const AppRouter = () => {
    return (
        <Suspense fallback={<Loader fullScreen />}>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                    <Route index element={<Dashboard />} />
                    <Route path="weather" element={<WeatherForecast />} />
                    <Route path="crops" element={<CropsList />} />
                    <Route path="inventory" element={<InventoryList />} />
                    <Route path="transactions" element={<TransactionsList />} />
                    <Route path="market" element={<MarketPrices />} />
                    <Route path="auctions" element={<Auctions />} />
                    <Route path="disputes" element={<Disputes />} />
                    <Route path="advisory" element={<PestAdvisory />} />
                    <Route path="ai-dashboard" element={<AIDashboard />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="compliance" element={<Compliance />} />
                    {/* Add more routes here as we build them */}
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};

export default AppRouter;
