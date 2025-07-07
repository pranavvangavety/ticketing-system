import React from "react";
import {Navigate} from "react-router-dom";

function AdminRoute({children}) {

    const role = localStorage.getItem("role");

    if(role !== "ROLE_ADMIN") {
        return <Navigate to="/unauthorized" replace/>;
    }

    return children;
}

export default AdminRoute;