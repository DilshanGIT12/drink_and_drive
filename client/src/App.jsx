import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import CustomerDashboard from './pages/customer/Dashboard';
import CustomerActiveTrip from './pages/customer/CustomerActiveTrip';
import SpecialPackages from './pages/customer/SpecialPackages';
import TripHistory from './pages/customer/TripHistory';
import Profile from './pages/customer/Profile';
import AboutUs from './pages/AboutUs';
import HelpSupport from './pages/HelpSupport';
import DriverRadar from './pages/driver/DriverRadar';
import DriverHistory from './pages/driver/DriverHistory';
import DriverPerformance from './pages/driver/DriverPerformance';
import DriverActiveTrip from './pages/driver/DriverActiveTrip';
import AdminDashboard from './pages/admin/AdminDashboard';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';

import useAuthStore from './store/useAuthStore';

function App() {
    const { loadUser } = useAuthStore();

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    return (
        <Router>
            <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/support" element={<HelpSupport />} />
                
                {/* Landing Page */}
                <Route path="/" element={<LandingPage />} />


                {/* Customer Routes */}
                <Route path="/customer/dashboard" element={
                    <ProtectedRoute allowedRoles={['customer']}>
                        <CustomerDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/customer/active-trip/:id" element={
                    <ProtectedRoute allowedRoles={['customer']}>
                        <CustomerActiveTrip />
                    </ProtectedRoute>
                } />
                <Route path="/customer/packages" element={
                    <ProtectedRoute allowedRoles={['customer']}>
                        <SpecialPackages />
                    </ProtectedRoute>
                } />
                <Route path="/customer/history" element={
                    <ProtectedRoute allowedRoles={['customer']}>
                        <TripHistory />
                    </ProtectedRoute>
                } />
                <Route path="/customer/profile" element={
                    <ProtectedRoute allowedRoles={['customer']}>
                        <Profile />
                    </ProtectedRoute>
                } />

                {/* Driver Routes */}
                <Route path="/driver/radar" element={
                    <ProtectedRoute allowedRoles={['driver']}>
                        <DriverRadar />
                    </ProtectedRoute>
                } />
                <Route path="/driver/history" element={
                    <ProtectedRoute allowedRoles={['driver']}>
                        <DriverHistory />
                    </ProtectedRoute>
                } />
                <Route path="/driver/performance" element={
                    <ProtectedRoute allowedRoles={['driver']}>
                        <DriverPerformance />
                    </ProtectedRoute>
                } />
                <Route path="/driver/active-trip/:id" element={
                    <ProtectedRoute allowedRoles={['driver']}>
                        <DriverActiveTrip />
                    </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
