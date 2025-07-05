import React, {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import axios from "axios";

function ProtectedRoute({ children }) {
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        axios.get('http://localhost:8080/users/test', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then( () => {
                setIsValid(true);
                setLoading(false);
            })
            .catch( () => {
                setIsValid(false);
                setLoading(false);
            });
    }, [token]);

    if(loading){
        return <p>Loading...</p>;
    }
    if(!token || !isValid){
        return <Navigate to="/" replace />;
    }

    return children;

}

export default ProtectedRoute;