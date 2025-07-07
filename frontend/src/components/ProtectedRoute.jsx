import React, {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";

function ProtectedRoute({ children }) {
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');


    useEffect(() => {


        if (!token) {
            setLoading(false);
            return;
        }

        console.log("Sending token:", token);
        console.log("Role: ", role);



        setIsValid(true);
        setLoading(false);
    }, [token, role]);

    if(loading){
        return <p>Loading...</p>;
    }
    if(!token || !isValid){
        return <Navigate to="/" replace />;
    }

    return children;

}

export default ProtectedRoute;