import React from "react";
import {useNavigate} from "react-router-dom";

function BackButton({label = "Dashboard"}) {
    const navigate = useNavigate();

    const role = localStorage.getItem("role");
    const path = role === "ROLE_ADMIN" ? "/admin" : "/dashboard";

    return(
      <button onClick={() => navigate(path)} className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
          ← Back to {label}
      </button>
    );
}
export default BackButton;