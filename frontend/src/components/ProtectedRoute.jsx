import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "../lib/axios.js";

function ProtectedRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setIsValid(false);
                setLoading(false);
                return;
            }

            try {
                await new Promise(resolve => setTimeout(resolve, 100));
                await axios.get("http://localhost:8080/auth/validate");
                setIsValid(true);
            } catch (err) {
                setIsValid(false);
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, []);

    if (loading) return null;
    if (!isValid) return <Navigate to="/" replace />;

    return children;
}

export default ProtectedRoute;
