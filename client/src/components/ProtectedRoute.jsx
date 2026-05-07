import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuthStore();
    const location = useLocation();

    if (loading) return <div>Loading...</div>;

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Role check and redirection logic
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their correct dashboard if they are in the wrong portal
        if (user.role === 'customer') return <Navigate to="/customer/dashboard" replace />;
        if (user.role === 'driver') return <Navigate to="/driver/radar" replace />;
        if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
        
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
