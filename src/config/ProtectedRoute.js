import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const ProtectedRoute = () => {
    const authToken = getCookie('authToken');
    const isAuthenticated = authToken !== undefined;

    return isAuthenticated ? <Outlet/> : <Navigate to="/login" replace/>;
};

export default ProtectedRoute;