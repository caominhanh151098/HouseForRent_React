import React from 'react'
import { useNavigate, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
    const navigate = useNavigate();
    const isLogin = !!localStorage.getItem('userInfo')

    return !!isLogin ? element : <Navigate to="/" />
}

export default PrivateRoute