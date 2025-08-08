// components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "../lib/axios.js";

function ProtectedRoute({ children, requiredRole }) {
    const [loading, setLoading] = useState(true);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem("token");
            const role = localStorage.getItem("role");

            if (!token || (requiredRole && role !== requiredRole)) {
                setIsValid(false);
                setLoading(false);
                return;
            }

            try {
                await axios.get("http://localhost:8080/auth/validate");
                setIsValid(true);
            } catch {
                setIsValid(false);
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [requiredRole]);

    if (loading) return null;

    if (!isValid) return <Navigate to="/unauthorized" replace />;

    return children;
}

export default ProtectedRoute;
